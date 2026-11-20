const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const webpush = require('web-push');
const db = require('./db');
const { migrate, seedIfEmpty } = require('./migrate');

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const AUTO_SEED = (process.env.AUTO_SEED || 'true') === 'true';

if (!JWT_SECRET || !ADMIN_PASSWORD) {
  console.error('JWT_SECRET dan ADMIN_PASSWORD wajib diisi di environment variable.');
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 8) {
  console.error('ADMIN_PASSWORD minimal 8 karakter.');
  process.exit(1);
}

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@scurebot.site';
const PUSH_ON = !!(VAPID_PUBLIC && VAPID_PRIVATE);
if (PUSH_ON) webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
else console.log('Web Push nonaktif: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY belum diisi.');

const STAGES_MAX = 3;
const PAYS = ['QRIS', 'Tunai', 'Kasbon'];
const SLOTS = ['Pagi 09.30', 'Istirahat 12.00', 'Istirahat 18.00', 'Pulang shift 1', 'Pulang shift 2'];
const CATS = ['Makanan', 'Minuman', 'Rokok', 'Sembako', 'Lainnya'];

/* ---------- helpers ---------- */
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const bad = (msg) => new HttpError(400, msg);
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const str = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const int = (v) => (Number.isFinite(+v) ? Math.round(+v) : NaN);

const PRODUCTS_SQL = `
  SELECT p.*, (COALESCE(si.q, 0) - COALESCE(so.q, 0))::int AS stock
  FROM products p
  LEFT JOIN (SELECT kode, SUM(qty)::int AS q FROM stockin GROUP BY kode) si ON si.kode = p.kode
  LEFT JOIN (
    SELECT it->>'kode' AS kode, SUM((it->>'qty')::int)::int AS q
    FROM orders o CROSS JOIN LATERAL jsonb_array_elements(o.items) it
    WHERE o.stage >= 0
    GROUP BY 1
  ) so ON so.kode = p.kode`;

const mapProduct = (r) => ({
  kode: r.kode, name: r.name, cat: r.cat, unit: r.unit, modal: r.modal, jual: r.jual,
  min: r.min_stock, online: r.online, img: r.img, stock: Number(r.stock || 0),
});
const mapPublicProduct = (r) => {
  const p = mapProduct(r);
  delete p.modal;
  return p;
};
const mapOrder = (r) => ({
  id: r.id, code: r.code, source: r.source, createdAt: new Date(r.created_at).toISOString(),
  customerName: r.customer_name, customerLine: r.customer_line, items: r.items,
  total: r.total, modalTotal: r.modal_total, pay: r.pay, paid: r.paid,
  paidAt: r.paid_at ? new Date(r.paid_at).toISOString() : null, stage: r.stage,
  slot: r.slot, note: r.note, cashIn: r.cash_in, change: r.change_amt,
});
const mapPublicOrder = (r) => {
  const o = mapOrder(r);
  delete o.modalTotal;
  o.items = (o.items || []).map(({ modal, ...rest }) => rest);
  return o;
};
const mapCustomer = (r) => ({ id: String(r.id), name: r.name, line: r.line, wa: r.wa });
const mapStock = (r) => ({ id: String(r.id), date: r.date, kode: r.kode, qty: r.qty, harga: r.harga, tempat: r.tempat });

async function findCustomer(client, name) {
  const { rows } = await client.query('SELECT * FROM customers WHERE lower(name) = lower($1)', [name]);
  return rows[0] || null;
}

/* Kirim notifikasi ke semua HP admin yang berlangganan. Langganan kedaluwarsa dihapus. */
async function pushAdmins(payload) {
  if (!PUSH_ON) return;
  const { rows } = await db.query('SELECT endpoint, p256dh, auth FROM push_subs');
  await Promise.all(rows.map(async (s) => {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload),
        { TTL: 3600, urgency: 'high' },
      );
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) {
        await db.query('DELETE FROM push_subs WHERE endpoint = $1', [s.endpoint]).catch(() => {});
      } else {
        console.error('Push gagal:', e.statusCode || e.message);
      }
    }
  }));
}

function orderCode() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (const b of crypto.randomBytes(4)) s += abc[b % abc.length];
  return 'KA-' + s;
}

/**
 * Membuat pesanan dalam satu transaksi: mengunci baris produk, memeriksa stok,
 * mengambil harga dari database (bukan dari browser), lalu menyimpan.
 */
async function createOrder({ items, source, customerName, customerLine, pay, slot, note, cashIn, allowHidden }) {
  if (!Array.isArray(items) || items.length === 0) throw bad('Keranjang masih kosong.');
  if (items.length > 30) throw bad('Terlalu banyak jenis barang dalam satu pesanan.');
  const qtyByKode = new Map();
  for (const it of items) {
    const kode = str(it && it.kode, 40);
    const qty = int(it && it.qty);
    if (!kode || !Number.isInteger(qty) || qty < 1 || qty > 100) throw bad('Jumlah barang tidak valid.');
    qtyByKode.set(kode, (qtyByKode.get(kode) || 0) + qty);
  }
  if (!PAYS.includes(pay)) throw bad('Metode bayar tidak dikenal.');

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const kodes = [...qtyByKode.keys()];
    await client.query('SELECT kode FROM products WHERE kode = ANY($1) ORDER BY kode FOR UPDATE', [kodes]);
    const { rows } = await client.query(PRODUCTS_SQL + ' WHERE p.kode = ANY($1)', [kodes]);
    const byKode = new Map(rows.map((r) => [r.kode, r]));

    const lines = [];
    for (const [kode, qty] of qtyByKode) {
      const p = byKode.get(kode);
      if (!p || (!allowHidden && !p.online)) throw bad('Produk ' + kode + ' tidak tersedia.');
      if (Number(p.stock) < qty) throw bad('Stok ' + p.name + ' tinggal ' + Math.max(0, Number(p.stock)) + '.');
      lines.push({ kode, name: p.name, qty, price: p.jual, modal: p.modal });
    }
    const total = lines.reduce((s, l) => s + l.qty * l.price, 0);
    const modalTotal = lines.reduce((s, l) => s + l.qty * l.modal, 0);

    let name = customerName;
    let line = customerLine;
    if (pay === 'Kasbon') {
      const c = name ? await findCustomer(client, name) : null;
      if (!c) throw bad('Bayar pas gajian khusus pelanggan terdaftar.');
      name = c.name;
      if (!line) line = c.line;
    }
    let cash = null;
    let change = null;
    if (source === 'kasir' && pay === 'Tunai') {
      cash = int(cashIn);
      if (!Number.isInteger(cash) || cash < total) throw bad('Uang diterima kurang dari total.');
      change = cash - total;
    }
    const paid = source === 'kasir' && pay !== 'Kasbon';
    const stage = source === 'kasir' ? STAGES_MAX : 0;
    const id = crypto.randomUUID();
    const token = crypto.randomBytes(18).toString('hex');

    const ins = await client.query(
      `INSERT INTO orders (id, code, source, customer_name, customer_line, items, total, modal_total,
         pay, paid, paid_at, stage, slot, note, cash_in, change_amt, public_token)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,${paid ? 'now()' : 'NULL'},$11,$12,$13,$14,$15,$16)
       RETURNING *`,
      [id, orderCode(), source, name, line, JSON.stringify(lines), total, modalTotal,
        pay, paid, stage, slot, note, cash, change, token],
    );
    await client.query('COMMIT');
    return { row: ins.rows[0], token };
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

/* ---------- app ---------- */
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

const origins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));

app.get('/', (req, res) => res.json({ name: 'KAmart API', ok: true }));
app.get('/api/health', ah(async (req, res) => {
  await db.query('SELECT 1');
  res.json({ ok: true });
}));

/* Publik: katalog toko */
app.get('/api/products', ah(async (req, res) => {
  const { rows } = await db.query(PRODUCTS_SQL + ' WHERE p.online ORDER BY p.kode');
  res.json({ products: rows.map(mapPublicProduct) });
}));

/* Publik: apakah nama ini pelanggan terdaftar (boleh bayar pas gajian) */
app.get('/api/customers/check', ah(async (req, res) => {
  const name = str(req.query.name, 60);
  const c = name ? await findCustomer(db, name) : null;
  res.json({ registered: !!c });
}));

/* Publik: buat pesanan */
app.post('/api/orders', ah(async (req, res) => {
  const b = req.body || {};
  const customerName = str(b.customerName, 60);
  if (!customerName) throw bad('Isi nama dulu.');
  const slot = SLOTS.includes(b.slot) ? b.slot : SLOTS[1];
  const { row, token } = await createOrder({
    items: b.items, source: 'online', customerName, customerLine: str(b.customerLine, 60),
    pay: b.pay, slot, note: str(b.note, 140), allowHidden: false,
  });
  res.status(201).json({ order: mapPublicOrder(row), token });
  const items = (row.items || []).map((i) => i.qty + '× ' + i.name).join(', ');
  pushAdmins({
    title: 'Pesanan baru · ' + row.customer_name,
    body: items + ' · Rp' + Number(row.total).toLocaleString('id-ID') + (row.slot ? ' · ' + row.slot : ''),
    tag: row.id,
    url: '/#pesanan',
  }).catch((e) => console.error('Push gagal:', e.message));
}));

/* Publik: kunci VAPID untuk berlangganan notifikasi */
app.get('/api/push/key', (req, res) => res.json({ publicKey: PUSH_ON ? VAPID_PUBLIC : null }));

/* Publik: status pesanan milik HP ini (pakai token yang disimpan di HP) */
app.post('/api/orders/lookup', ah(async (req, res) => {
  const tokens = Array.isArray(req.body && req.body.tokens) ? req.body.tokens.filter((t) => typeof t === 'string').slice(0, 50) : [];
  if (!tokens.length) return res.json({ orders: [] });
  const { rows } = await db.query('SELECT * FROM orders WHERE public_token = ANY($1) ORDER BY created_at DESC', [tokens]);
  res.json({ orders: rows.map(mapPublicOrder) });
}));

/* Publik: antrian pesanan yang masih diproses (tanpa kode, harga, atau cara bayar orang lain) */
app.get('/api/orders/queue', ah(async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, created_at, customer_name, items, stage, slot FROM orders
     WHERE stage BETWEEN 0 AND 2 AND source = 'online'
     ORDER BY created_at ASC LIMIT 100`,
  );
  res.json({
    orders: rows.map((r) => ({
      id: r.id,
      createdAt: new Date(r.created_at).toISOString(),
      customerName: r.customer_name,
      items: (r.items || []).map((i) => ({ name: i.name, qty: i.qty })),
      stage: r.stage,
      slot: r.slot,
    })),
  });
}));

/* Login admin */
const attempts = new Map();
function sameSecret(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}
app.post('/api/auth/login', ah(async (req, res) => {
  const ip = req.ip || 'x';
  const now = Date.now();
  const a = attempts.get(ip) || { n: 0, until: 0 };
  if (a.until > now) throw new HttpError(429, 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.');
  const { username, password } = req.body || {};
  const ok = sameSecret(username || '', ADMIN_USERNAME) & sameSecret(password || '', ADMIN_PASSWORD);
  if (!ok) {
    a.n += 1;
    if (a.n >= 5) { a.n = 0; a.until = now + 5 * 60 * 1000; }
    attempts.set(ip, a);
    throw new HttpError(401, 'Username atau password salah.');
  }
  attempts.delete(ip);
  const token = jwt.sign({ role: 'admin', sub: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
}));

function requireAdmin(req, res, next) {
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : '';
  try {
    const p = jwt.verify(t, JWT_SECRET);
    if (p.role !== 'admin') throw new Error('role');
    next();
  } catch (e) {
    res.status(401).json({ error: 'Sesi admin berakhir, silakan masuk lagi.' });
  }
}
const admin = express.Router();
admin.use(requireAdmin);

admin.get('/data', ah(async (req, res) => {
  const [p, c, o, s] = await Promise.all([
    db.query(PRODUCTS_SQL + ' ORDER BY p.kode'),
    db.query('SELECT * FROM customers ORDER BY lower(name)'),
    db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5000'),
    db.query('SELECT * FROM stockin ORDER BY date DESC, id DESC LIMIT 5000'),
  ]);
  res.json({
    products: p.rows.map(mapProduct),
    customers: c.rows.map(mapCustomer),
    orders: o.rows.map(mapOrder),
    stockin: s.rows.map(mapStock),
  });
}));

admin.put('/products/:kode', ah(async (req, res) => {
  const kode = str(req.params.kode, 40).toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const b = req.body || {};
  const name = str(b.name, 80);
  if (!kode || !name) throw bad('Kode dan nama wajib diisi.');
  const cat = CATS.includes(b.cat) ? b.cat : 'Lainnya';
  const modal = int(b.modal); const jual = int(b.jual); const min = int(b.min || 0);
  if (![modal, jual, min].every((n) => Number.isInteger(n) && n >= 0)) throw bad('Harga dan stok minimum harus angka 0 atau lebih.');
  const img = String(b.img || '');
  if (img && (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(img) || img.length > 300000)) throw bad('Foto tidak valid atau terlalu besar.');
  const online = cat === 'Rokok' ? false : !!b.online;
  if (b.isNew) {
    const ex = await db.query('SELECT 1 FROM products WHERE kode = $1', [kode]);
    if (ex.rowCount) throw new HttpError(409, 'Kode ' + kode + ' sudah dipakai.');
  }
  await db.query(
    `INSERT INTO products (kode, name, cat, unit, modal, jual, min_stock, online, img, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, now())
     ON CONFLICT (kode) DO UPDATE SET name=$2, cat=$3, unit=$4, modal=$5, jual=$6, min_stock=$7, online=$8, img=$9, updated_at=now()`,
    [kode, name, cat, str(b.unit, 20) || 'pcs', modal, jual, min, online, img],
  );
  res.json({ ok: true });
}));

admin.post('/stockin', ah(async (req, res) => {
  const b = req.body || {};
  const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date) ? b.date : new Date().toISOString().slice(0, 10);
  const kode = str(b.kode, 40);
  const qty = int(b.qty); const harga = int(b.harga);
  if (!Number.isInteger(qty) || qty < 1) throw bad('Jumlah harus 1 atau lebih.');
  if (!Number.isInteger(harga) || harga < 0) throw bad('Harga beli tidak valid.');
  const ex = await db.query('SELECT 1 FROM products WHERE kode = $1', [kode]);
  if (!ex.rowCount) throw bad('Produk tidak ditemukan.');
  await db.query('INSERT INTO stockin (date, kode, qty, harga, tempat) VALUES ($1,$2,$3,$4,$5)', [date, kode, qty, harga, str(b.tempat, 60)]);
  if (b.updateModal && harga > 0) await db.query('UPDATE products SET modal = $2, updated_at = now() WHERE kode = $1', [kode, harga]);
  res.status(201).json({ ok: true });
}));

admin.post('/customers', ah(async (req, res) => {
  const b = req.body || {};
  const name = str(b.name, 60);
  if (!name) throw bad('Isi nama pelanggan.');
  try {
    await db.query('INSERT INTO customers (name, line, wa) VALUES ($1,$2,$3)', [name, str(b.line, 60), str(b.wa, 30)]);
  } catch (e) {
    if (e.code === '23505') throw new HttpError(409, name + ' sudah terdaftar.');
    throw e;
  }
  res.status(201).json({ ok: true });
}));

admin.post('/orders', ah(async (req, res) => {
  const b = req.body || {};
  const buyer = str(b.customerName, 60);
  const c = buyer ? await findCustomer(db, buyer) : null;
  const { row } = await createOrder({
    items: b.items, source: 'kasir', customerName: c ? c.name : 'Pembeli umum', customerLine: c ? c.line : '',
    pay: b.pay, slot: 'Kasir', note: '', cashIn: b.cashIn, allowHidden: true,
  });
  res.status(201).json({ order: mapOrder(row) });
}));

admin.patch('/orders/:id', ah(async (req, res) => {
  const b = req.body || {};
  const sets = []; const vals = [req.params.id];
  if (b.stage !== undefined) {
    const st = int(b.stage);
    if (!Number.isInteger(st) || st < -1 || st > STAGES_MAX) throw bad('Tahap tidak valid.');
    vals.push(st); sets.push('stage = $' + vals.length);
  }
  if (b.paid === true) sets.push('paid = TRUE, paid_at = COALESCE(paid_at, now())');
  if (!sets.length) throw bad('Tidak ada perubahan.');
  const r = await db.query('UPDATE orders SET ' + sets.join(', ') + ' WHERE id = $1 RETURNING *', vals);
  if (!r.rowCount) throw new HttpError(404, 'Pesanan tidak ditemukan.');
  res.json({ order: mapOrder(r.rows[0]) });
}));

admin.post('/kasbon/settle', ah(async (req, res) => {
  const name = str(req.body && req.body.name, 60);
  if (!name) throw bad('Nama pelanggan kosong.');
  const r = await db.query(
    `UPDATE orders SET paid = TRUE, paid_at = now()
     WHERE NOT paid AND stage >= 0 AND (pay = 'Kasbon' OR stage = 3) AND lower(customer_name) = lower($1)`,
    [name],
  );
  res.json({ updated: r.rowCount });
}));

admin.post('/push/subscribe', ah(async (req, res) => {
  const sub = (req.body && req.body.subscription) || {};
  const endpoint = String(sub.endpoint || '');
  const keys = sub.keys || {};
  if (!/^https:\/\//.test(endpoint) || endpoint.length > 1000 || typeof keys.p256dh !== 'string' || typeof keys.auth !== 'string') {
    throw bad('Data langganan notifikasi tidak valid.');
  }
  await db.query(
    `INSERT INTO push_subs (endpoint, p256dh, auth) VALUES ($1,$2,$3)
     ON CONFLICT (endpoint) DO UPDATE SET p256dh = $2, auth = $3`,
    [endpoint, keys.p256dh.slice(0, 200), keys.auth.slice(0, 100)],
  );
  res.status(201).json({ ok: true, enabled: PUSH_ON });
}));

admin.post('/push/unsubscribe', ah(async (req, res) => {
  await db.query('DELETE FROM push_subs WHERE endpoint = $1', [String((req.body && req.body.endpoint) || '')]);
  res.json({ ok: true });
}));

admin.post('/push/test', ah(async (req, res) => {
  if (!PUSH_ON) throw bad('Web Push belum aktif di server. Isi VAPID_PUBLIC_KEY dan VAPID_PRIVATE_KEY.');
  await pushAdmins({ title: 'Tes notifikasi KAmart', body: 'Notifikasi HP sudah aktif.', tag: 'tes', url: '/#pesanan' });
  res.json({ ok: true });
}));

app.use('/api/admin', admin);

app.use((req, res) => res.status(404).json({ error: 'Alamat API tidak ditemukan.' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Data terlalu besar.' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Format data tidak valid.' });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Terjadi kesalahan di server.' : err.message });
});

(async () => {
  try {
    await migrate(db);
    if (AUTO_SEED && (await seedIfEmpty(db))) console.log('Data awal KAmart dimasukkan.');
    app.listen(PORT, () => console.log('KAmart API berjalan di port ' + PORT));
  } catch (e) {
    console.error('Gagal menyiapkan database:', e.message);
    process.exit(1);
  }
})();

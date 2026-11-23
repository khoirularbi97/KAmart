const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const webpush = require('web-push');
const db = require('./db');
const { migrate, seedIfEmpty } = require('./migrate');
const storage = require('./storage');
const midtrans = require('./midtrans');
const master = require('./master');
const promo = require('./promo');

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
  subtotal: r.subtotal == null ? r.total : r.subtotal, diskon: r.diskon || [], voucher: r.voucher || '',
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
async function loadPromos(q) {
  const { rows } = await q.query('SELECT id, data FROM promos ORDER BY created_at');
  return rows.map((r) => Object.assign({ id: r.id }, r.data));
}
const rpTxt = (n) => 'Rp' + Number(n).toLocaleString('id-ID');

async function createOrder({ items, source, customerName, customerLine, pay, slot, note, cashIn, allowHidden, voucher }) {
  if (!Array.isArray(items) || items.length === 0) throw bad('Keranjang masih kosong.');
  if (items.length > 30) throw bad('Terlalu banyak jenis barang dalam satu pesanan.');
  const qtyByKode = new Map();
  for (const it of items) {
    const kode = str(it && it.kode, 40);
    const qty = int(it && it.qty);
    if (!kode || !Number.isInteger(qty) || qty < 1 || qty > 100) throw bad('Jumlah barang tidak valid.');
    qtyByKode.set(kode, (qtyByKode.get(kode) || 0) + qty);
  }
  if (!master.payFor(pay, source)) throw bad('Metode bayar tidak tersedia.');

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
      if (!p || (!allowHidden && (!p.online || !master.catOnline(p.cat)))) throw bad('Produk ' + kode + ' tidak tersedia.');
      if (Number(p.stock) < qty) throw bad('Stok ' + p.name + ' tinggal ' + Math.max(0, Number(p.stock)) + '.');
      lines.push({ kode, name: p.name, qty, price: p.jual, modal: p.modal });
    }
    // Promo dihitung di server (harga dari browser tidak dipakai).
    const promos = await loadPromos(client);
    const code = str(voucher, 20).toUpperCase();
    if (code) {
      const v = promos.find((x) => x.tipe === 'voucher' && x.voucher === code);
      if (v) {
        await client.query('SELECT id FROM promos WHERE id = $1 FOR UPDATE', [v.id]);
        if (v.kuota > 0) {
          const u = await client.query('SELECT count(*)::int AS n FROM orders WHERE voucher = $1 AND stage >= 0', [code]);
          if (u.rows[0].n >= v.kuota) throw bad('Kuota voucher ' + code + ' sudah habis.');
        }
      }
    }
    const hasil = promo.hitungPromo(lines, promos, { voucher: code, rp: rpTxt });
    if (hasil.voucherErr) throw bad(hasil.voucherErr);
    const finalLines = hasil.items.map((l) => {
      const o = { kode: l.kode, name: l.name, qty: l.qty, price: l.price, modal: l.modal };
      if (l.normal !== l.price) { o.normal = l.normal; o.promoId = l.promoId; }
      return o;
    });
    lines.length = 0;
    lines.push(...finalLines);
    const total = hasil.total;
    const subtotal = hasil.subtotal;
    const modalTotal = lines.reduce((s, l) => s + l.qty * l.modal, 0);
    const usedVoucher = hasil.diskon.some((d) => d.tipe === 'voucher') ? code : '';

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
         pay, paid, paid_at, stage, slot, note, cash_in, change_amt, public_token, subtotal, diskon, voucher)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,${paid ? 'now()' : 'NULL'},$11,$12,$13,$14,$15,$16,$17,$18,$19)
       RETURNING *`,
      [id, orderCode(), source, name, line, JSON.stringify(lines), total, modalTotal,
        pay, paid, stage, slot, note, cash, change, token, subtotal, JSON.stringify(hasil.diskon), usedVoucher],
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
app.use(express.json({ limit: '3mb' }));

const origins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));

app.get('/', (req, res) => res.json({ name: 'KAmart API', ok: true }));
app.get('/api/health', ah(async (req, res) => {
  await db.query('SELECT 1');
  res.json({ ok: true, foto: storage.ENABLED ? 'neon-bucket:' + storage.BUCKET : 'database', bayar: midtrans.mode });
}));

/* Foto produk cadangan (jika bucket Neon belum diatur) */
app.get('/api/images/:kode', ah(async (req, res) => {
  const { rows } = await db.query('SELECT mime, data, updated_at FROM product_images WHERE kode = $1', [req.params.kode]);
  if (!rows[0]) return res.status(404).json({ error: 'Foto tidak ditemukan.' });
  res.set('Content-Type', rows[0].mime);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(rows[0].data);
}));

/* Publik: katalog toko */
app.get('/api/products', ah(async (req, res) => {
  const { rows } = await db.query(PRODUCTS_SQL + ' WHERE p.online ORDER BY p.kode');
  const now = new Date();
  const promos = promo.publicView(await loadPromos(db)).filter((p) => promo.promoAktif(p, now) || (p.mulai && new Date(p.mulai) > now));
  res.json({ products: rows.filter((r) => master.catOnline(r.cat)).map(mapPublicProduct), master: master.get(), promos });
}));

/* Publik: data master (kategori, metode bayar, waktu ambil, info toko) */
app.get('/api/master', ah(async (req, res) => {
  res.json({ master: master.get() });
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
  const slot = master.slots().includes(b.slot) ? b.slot : master.defaultSlot();
  const { row, token } = await createOrder({
    items: b.items, source: 'online', customerName, customerLine: str(b.customerLine, 60),
    pay: b.pay, slot, note: str(b.note, 140), allowHidden: false, voucher: b.voucher,
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

/* ---------- Pembayaran QRIS Midtrans ---------- */
const rp = (n) => 'Rp' + Number(n).toLocaleString('id-ID');

/* Publik: QRIS dinamis untuk pesanan milik HP ini (dibuktikan dengan token pesanan). */
app.post('/api/orders/:id/qris', ah(async (req, res) => {
  if (!midtrans.ENABLED) return res.status(501).json({ error: 'QRIS otomatis belum aktif.', fallback: true });
  const tokens = Array.isArray(req.body && req.body.tokens) ? req.body.tokens.filter((t) => typeof t === 'string').slice(0, 50) : [];
  const { rows } = await db.query('SELECT * FROM orders WHERE id = $1 AND public_token = ANY($2)', [req.params.id, tokens]);
  const o = rows[0];
  if (!o) throw new HttpError(404, 'Pesanan tidak ditemukan.');
  if (o.paid) return res.json({ paid: true });
  if (o.stage < 0) throw bad('Pesanan sudah dibatalkan.');
  if (o.pay !== 'QRIS') throw bad('Pesanan ini tidak memakai QRIS.');
  // Pakai QR yang masih berlaku (minimal 2 menit lagi) supaya tidak membuat transaksi baru terus.
  const cur = await db.query(
    `SELECT * FROM payments WHERE order_id = $1 AND status = 'pending' AND amount = $2 AND expires_at > now() + interval '2 minutes'
     ORDER BY created_at DESC LIMIT 1`, [o.id, o.total]);
  if (cur.rowCount) {
    const p = cur.rows[0];
    return res.json({ qr: p.qr_string, expiresAt: p.expires_at, amount: p.amount, mode: midtrans.mode, testUrl: midtrans.IS_PRODUCTION ? undefined : p.qr_url });
  }
  const n = await db.query('SELECT count(*)::int AS n FROM payments WHERE order_id = $1', [o.id]);
  if (n.rows[0].n >= 20) throw bad('Terlalu banyak QR dibuat untuk pesanan ini. Hubungi penjual.');
  const mtId = o.code + '-' + Date.now().toString(36).toUpperCase();
  let ch;
  try {
    ch = await midtrans.chargeQris(mtId, o.total);
  } catch (e) {
    console.error('Midtrans charge gagal:', e.message);
    return res.status(502).json({ error: 'QRIS otomatis sedang bermasalah.', fallback: true });
  }
  await db.query('INSERT INTO payments (mt_order_id, order_id, amount, qr_string, qr_url, expires_at) VALUES ($1,$2,$3,$4,$5,$6)',
    [mtId, o.id, o.total, ch.qr, ch.qrUrl, ch.expiresAt]);
  // URL gambar QR hanya dikirim di sandbox, untuk ditempel di simulator Midtrans.
  res.json({ qr: ch.qr, expiresAt: ch.expiresAt, amount: o.total, mode: midtrans.mode, testUrl: midtrans.IS_PRODUCTION ? undefined : ch.qrUrl });
}));

/* Webhook Midtrans: Settings > Payment > Notification URL = https://api-kamart.scurebot.site/api/payment/midtrans */
app.post('/api/payment/midtrans', ah(async (req, res) => {
  const n = req.body || {};
  if (!midtrans.ENABLED) return res.status(503).json({ error: 'Midtrans belum diatur.' });
  if (!midtrans.validSignature(n)) return res.status(403).json({ error: 'Signature tidak valid.' });
  const pay = await db.query('SELECT * FROM payments WHERE mt_order_id = $1', [String(n.order_id)]);
  if (!pay.rowCount) return res.json({ ok: true, note: 'order_id tidak dikenal' }); // mis. tes dari dashboard
  // Pastikan langsung ke Midtrans, jangan hanya percaya isi notifikasi.
  const st = await midtrans.getStatus(n.order_id);
  const status = String(st.transaction_status || n.transaction_status || 'unknown').slice(0, 30);
  await db.query('UPDATE payments SET status = $2, updated_at = now() WHERE mt_order_id = $1', [n.order_id, status]);
  if (midtrans.isPaidStatus(st) && Math.round(Number(st.gross_amount)) === pay.rows[0].amount) {
    const r = await db.query(
      'UPDATE orders SET paid = TRUE, paid_at = now() WHERE id = $1 AND NOT paid RETURNING code, customer_name, total',
      [pay.rows[0].order_id]);
    if (r.rowCount) {
      const o = r.rows[0];
      console.log('QRIS lunas:', o.code, rp(o.total));
      pushAdmins({ title: 'QRIS diterima · ' + o.code, body: o.customer_name + ' membayar ' + rp(o.total) + ' (lunas otomatis)', tag: 'pay-' + o.code, url: '/#pesanan' })
        .catch((e) => console.error('Push gagal:', e.message));
    }
  }
  res.json({ ok: true });
}));

/* Publik: cek kode voucher. Dibatasi 20 kali per 5 menit per IP supaya kode tidak ditebak. */
const vHits = new Map();
app.post('/api/promos/voucher', ah(async (req, res) => {
  const ip = req.ip || 'x';
  const now = Date.now();
  const h = vHits.get(ip) || { n: 0, t: now };
  if (now - h.t > 5 * 60 * 1000) { h.n = 0; h.t = now; }
  h.n += 1;
  vHits.set(ip, h);
  if (h.n > 20) throw new HttpError(429, 'Terlalu banyak percobaan voucher. Coba lagi beberapa menit lagi.');
  const code = str(req.body && req.body.code, 20).toUpperCase();
  const all = await loadPromos(db);
  const v = all.find((x) => x.tipe === 'voucher' && x.voucher === code);
  if (!code || !v || !promo.promoAktif(v, new Date())) throw bad('Kode voucher tidak berlaku.');
  if (v.kuota > 0) {
    const u = await db.query('SELECT count(*)::int AS n FROM orders WHERE voucher = $1 AND stage >= 0', [code]);
    if (u.rows[0].n >= v.kuota) throw bad('Kuota voucher ' + code + ' sudah habis.');
  }
  res.json({ promo: promo.voucherView(v) });
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
    master: master.get(),
    promos: await adminPromos(),
  });
}));

async function adminPromos() {
  const list = await loadPromos(db);
  const u = await db.query("SELECT voucher, count(*)::int AS n FROM orders WHERE voucher <> '' AND stage >= 0 GROUP BY voucher");
  const used = new Map(u.rows.map((x) => [x.voucher, x.n]));
  const d = await db.query("SELECT e->>'id' AS id, count(*)::int AS n, sum((e->>'nilai')::int)::int AS total FROM orders, jsonb_array_elements(diskon) e WHERE stage >= 0 GROUP BY 1");
  const stat = new Map(d.rows.map((x) => [x.id, x]));
  return list.map((p) => Object.assign({}, p, {
    dipakai: p.tipe === 'voucher' ? (used.get(p.voucher) || 0) : ((stat.get(p.id) || {}).n || 0),
    totalPotongan: (stat.get(p.id) || {}).total || 0,
  }));
}

admin.put('/promos/:id', ah(async (req, res) => {
  const id = String(req.params.id || '').replace(/[^\w-]/g, '').slice(0, 40);
  if (!id) throw bad('ID promo tidak valid.');
  const kodes = new Set((await db.query('SELECT kode FROM products')).rows.map((r) => r.kode));
  let p;
  try { p = promo.sanitize(req.body, kodes); } catch (e) { throw bad(e.message); }
  if (p.tipe === 'voucher') {
    const dup = (await loadPromos(db)).find((x) => x.id !== id && x.tipe === 'voucher' && x.voucher === p.voucher);
    if (dup) throw bad('Kode voucher ' + p.voucher + ' sudah dipakai promo lain.');
  }
  await db.query(
    `INSERT INTO promos (id, data) VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`, [id, JSON.stringify(p)]);
  res.json({ promo: Object.assign({ id }, p) });
}));

admin.delete('/promos/:id', ah(async (req, res) => {
  await db.query('DELETE FROM promos WHERE id = $1', [String(req.params.id || '')]);
  res.json({ ok: true });
}));

/* Simpan data master. renames: [{dari, ke}] untuk kategori yang diganti nama (produk ikut dipindah). */
admin.put('/master', ah(async (req, res) => {
  let next;
  try { next = master.sanitize(req.body && req.body.master); } catch (e) { throw bad(e.message); }
  const names = new Set(next.kategori.map((k) => k.nama));
  const renames = (Array.isArray(req.body && req.body.renames) ? req.body.renames : [])
    .map((x) => ({ dari: str(x && x.dari, 30), ke: str(x && x.ke, 30) }))
    .filter((x) => x.dari && x.ke && x.dari !== x.ke && names.has(x.ke));
  const client = await db.pool.connect();
  let moved = 0;
  try {
    await client.query('BEGIN');
    for (const x of renames) {
      const u = await client.query('UPDATE products SET cat = $2 WHERE cat = $1', [x.dari, x.ke]);
      moved += u.rowCount;
    }
    const used = await client.query('SELECT cat, count(*)::int AS n FROM products WHERE NOT (cat = ANY($1)) GROUP BY cat', [[...names]]);
    if (used.rowCount) {
      const u = used.rows[0];
      throw bad('Kategori "' + u.cat + '" masih dipakai ' + u.n + ' produk. Pindahkan produknya dulu.');
    }
    await master.save(client, next);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
  res.json({ master: next, moved });
}));

admin.put('/products/:kode', ah(async (req, res) => {
  const kode = str(req.params.kode, 40).toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const b = req.body || {};
  const name = str(b.name, 80);
  if (!kode || !name) throw bad('Kode dan nama wajib diisi.');
  const cats = master.catNames();
  const cat = cats.includes(b.cat) ? b.cat : (cats.includes('Lainnya') ? 'Lainnya' : cats[0]);
  const modal = int(b.modal); const jual = int(b.jual); const min = int(b.min || 0);
  if (![modal, jual, min].every((n) => Number.isInteger(n) && n >= 0)) throw bad('Harga dan stok minimum harus angka 0 atau lebih.');
  const online = master.catOnline(cat) ? !!b.online : false;
  const cur = await db.query('SELECT img FROM products WHERE kode = $1', [kode]);
  if (b.isNew && cur.rowCount) throw new HttpError(409, 'Kode ' + kode + ' sudah dipakai.');
  const oldImg = cur.rowCount ? cur.rows[0].img : '';
  // Foto baru dikirim sebagai data URL -> disimpan ke bucket Neon (atau database). '' = hapus foto.
  const incoming = typeof b.img === 'string' ? b.img : oldImg;
  let img = oldImg;
  if (incoming.startsWith('data:')) {
    try {
      img = await storage.saveImage(db, kode, incoming, oldImg);
    } catch (e) {
      if (e.status === 400) throw e;
      console.error('Upload foto gagal:', e.message);
      throw new HttpError(502, 'Foto gagal diunggah ke penyimpanan. Coba lagi.');
    }
  } else if (incoming === '') {
    if (oldImg) await storage.removeImage(db, kode, oldImg);
    img = '';
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
    pay: b.pay, slot: 'Kasir', note: '', cashIn: b.cashIn, allowHidden: true, voucher: b.voucher,
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
    await master.load(db);
    if (AUTO_SEED && (await seedIfEmpty(db))) console.log('Data awal KAmart dimasukkan.');
    console.log('Pembayaran QRIS: ' + midtrans.mode);
    console.log('Penyimpanan foto: ' + (storage.ENABLED ? 'Neon Object Storage (bucket ' + storage.BUCKET + ')' : 'database (bucket belum diatur)'));
    // Pindahkan foto lama (data URL di kolom img) ke penyimpanan baru.
    const legacy = await db.query("SELECT kode, img FROM products WHERE img LIKE 'data:%'");
    for (const r of legacy.rows) {
      try {
        const url = await storage.saveImage(db, r.kode, r.img, '');
        await db.query('UPDATE products SET img = $2 WHERE kode = $1', [r.kode, url]);
        console.log('Foto ' + r.kode + ' dipindahkan.');
      } catch (e) { console.error('Pindah foto ' + r.kode + ' gagal:', e.message); }
    }
    app.listen(PORT, () => console.log('KAmart API berjalan di port ' + PORT));
  } catch (e) {
    console.error('Gagal menyiapkan database:', e.message);
    process.exit(1);
  }
})();

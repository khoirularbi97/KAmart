/* Data master KAmart: kategori, metode bayar, waktu ambil, satuan, bagian/line, info toko.
 * Disimpan di tabel settings (key = 'master') dan di-cache di memori. */

const WARNA = ['pink', 'blue', 'gold', 'lav', 'mint'];
const IKON = ['cup', 'coffee', 'box', 'bag'];
// Metode bawaan sistem: kodenya dipakai di logika (QRIS Midtrans, kembalian tunai, kasbon), tidak bisa dihapus.
const SISTEM = { QRIS: 'qris', Tunai: 'tunai', Kasbon: 'kasbon' };

const DEFAULT = {
  kategori: [
    { nama: 'Makanan', warna: 'pink', ikon: 'cup', online: true },
    { nama: 'Minuman', warna: 'blue', ikon: 'coffee', online: true },
    { nama: 'Rokok', warna: 'gold', ikon: 'box', online: false },
    { nama: 'Sembako', warna: 'lav', ikon: 'bag', online: true },
    { nama: 'Lainnya', warna: 'lav', ikon: 'box', online: true },
  ],
  bayar: [
    { kode: 'QRIS', label: 'QRIS', tipe: 'qris', online: true, kasir: true, aktif: true, ket: '' },
    { kode: 'Tunai', label: 'Tunai', tipe: 'tunai', online: true, kasir: true, aktif: true, ket: '' },
    { kode: 'Kasbon', label: 'Bayar pas gajian', tipe: 'kasbon', online: true, kasir: true, aktif: true, ket: '' },
  ],
  waktu: [
    { label: 'Pagi 09.30', aktif: true, utama: false },
    { label: 'Istirahat 12.00', aktif: true, utama: true },
    { label: 'Istirahat 18.00', aktif: true, utama: false },
    { label: 'Pulang shift 1', aktif: true, utama: false },
    { label: 'Pulang shift 2', aktif: true, utama: false },
  ],
  satuan: ['pcs', 'cup', 'bungkus', 'botol', 'sachet', 'dus', 'kg'],
  bagian: [],
  toko: { lokasi: 'Parkiran motor / pos', tutup: 30 },
};

let cache = JSON.parse(JSON.stringify(DEFAULT));

class MasterError extends Error { constructor(m) { super(m); this.status = 400; } }
const s = (v, n) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, n) : '');
const arr = (v) => (Array.isArray(v) ? v : []);
function uniq(list, key, what) {
  const seen = new Set();
  for (const x of list) {
    const k = String(key(x)).toLowerCase();
    if (seen.has(k)) throw new MasterError(what + ' "' + key(x) + '" dobel.');
    seen.add(k);
  }
}

/** Bersihkan & validasi kiriman admin. Mengembalikan master baru yang aman disimpan. */
function sanitize(input) {
  const m = input || {};
  const kategori = arr(m.kategori).slice(0, 30).map((k) => ({
    nama: s(k && k.nama, 30),
    warna: WARNA.includes(k && k.warna) ? k.warna : 'lav',
    ikon: IKON.includes(k && k.ikon) ? k.ikon : 'box',
    online: !(k && k.online === false),
  })).filter((k) => k.nama);
  if (!kategori.length) throw new MasterError('Minimal harus ada satu kategori.');
  uniq(kategori, (k) => k.nama, 'Kategori');

  const bayar = arr(m.bayar).slice(0, 15).map((b) => {
    const kode0 = s(b && b.kode, 24);
    const tipe = SISTEM[kode0] || 'manual';
    const label = s(b && b.label, 30) || kode0;
    const kode = tipe === 'manual' ? (kode0 || label).replace(/[^\w .-]/g, '').slice(0, 24) : kode0;
    return {
      kode, label: label || kode, tipe,
      online: !(b && b.online === false), kasir: !(b && b.kasir === false), aktif: !(b && b.aktif === false),
      ket: s(b && b.ket, 140),
    };
  }).filter((b) => b.kode);
  for (const k of Object.keys(SISTEM)) {
    if (!bayar.some((b) => b.kode === k)) {
      bayar.push(Object.assign({}, DEFAULT.bayar.find((d) => d.kode === k), { aktif: false }));
    }
  }
  uniq(bayar, (b) => b.kode, 'Kode pembayaran');
  if (!bayar.some((b) => b.aktif && b.online)) throw new MasterError('Minimal satu metode bayar aktif untuk toko online.');
  if (!bayar.some((b) => b.aktif && b.kasir)) throw new MasterError('Minimal satu metode bayar aktif untuk kasir.');

  const waktu = arr(m.waktu).slice(0, 20).map((w) => ({
    label: s(w && w.label, 30), aktif: !(w && w.aktif === false), utama: !!(w && w.utama),
  })).filter((w) => w.label);
  uniq(waktu, (w) => w.label, 'Waktu ambil');
  const aktif = waktu.filter((w) => w.aktif);
  if (!aktif.length) throw new MasterError('Minimal satu waktu ambil aktif.');
  const utama = aktif.find((w) => w.utama) || aktif[0];
  waktu.forEach((w) => { w.utama = w === utama; });

  const satuan = [...new Set(arr(m.satuan).map((x) => s(x, 15)).filter(Boolean))].slice(0, 30);
  const bagian = [...new Set(arr(m.bagian).map((x) => s(x, 40)).filter(Boolean))].slice(0, 100);
  const t = m.toko || {};
  const tutup = Math.max(0, Math.min(240, Math.round(Number(t.tutup))));
  const toko = { lokasi: s(t.lokasi, 80) || DEFAULT.toko.lokasi, tutup: Number.isFinite(tutup) ? tutup : 30 };

  return { kategori, bayar, waktu, satuan, bagian, toko };
}

async function load(db) {
  const r = await db.query("SELECT value FROM settings WHERE key = 'master'");
  if (r.rowCount) {
    try { cache = sanitize(r.rows[0].value); } catch (e) { console.error('Master rusak, pakai bawaan:', e.message); }
  }
  return cache;
}

async function save(client, next) {
  await client.query(
    `INSERT INTO settings (key, value, updated_at) VALUES ('master', $1, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`, [JSON.stringify(next)]);
  cache = next;
}

const get = () => cache;
const catNames = () => cache.kategori.map((k) => k.nama);
const catOnline = (nama) => { const k = cache.kategori.find((x) => x.nama === nama); return !k || k.online !== false; };
const payFor = (kode, source) => cache.bayar.find((b) => b.kode === kode && b.aktif && (source === 'kasir' ? b.kasir : b.online));
const slots = () => cache.waktu.filter((w) => w.aktif).map((w) => w.label);
const defaultSlot = () => (cache.waktu.find((w) => w.aktif && w.utama) || cache.waktu.find((w) => w.aktif) || {}).label || '';

module.exports = { DEFAULT, MasterError, sanitize, load, save, get, catNames, catOnline, payFor, slots, defaultSlot };

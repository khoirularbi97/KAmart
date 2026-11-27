/* Promo & diskon KAmart.
 * Jenis: produk (harga coret), flash (flash sale: harga khusus singkat + kuota), bundling (beli X harga khusus / gratis), minimal (diskon minimal belanja), voucher (kode).
 * hitungPromo() HARUS sama persis dengan salinannya di frontend (kamart.html), supaya angka di keranjang = angka di server. */

const TIPE = ['produk', 'flash', 'bundling', 'bonus', 'minimal', 'voucher'];

/* ===== MULAI: mesin hitung (salinan identik di frontend) ===== */
function promoAktif(p, now) {
  if (!p || p.aktif === false) return false;
  const t = +now;
  if (p.mulai && t < +new Date(p.mulai)) return false;
  if (p.selesai && t > +new Date(p.selesai)) return false;
  return true;
}
function potongan(base, p) {
  const v = Math.max(0, +p.nilai || 0);
  let d = p.jenis === 'persen' ? Math.floor(base * Math.min(v, 100) / 100) : v;
  if (p.jenis === 'persen' && +p.maks > 0) d = Math.min(d, +p.maks);
  return Math.max(0, Math.min(Math.floor(d), base));
}
function hitungPromo(lines, promos, opt) {
  opt = opt || {};
  const now = opt.now || new Date();
  const rpf = opt.rp || ((n) => 'Rp' + n);
  const act = (promos || []).filter((p) => promoAktif(p, now));
  const items = lines.map((l) => {
    const normal = +l.price || 0;
    let price = normal;
    let promoId = '';
    act.filter((p) => p.tipe === 'produk' && p.kode === l.kode && +p.harga >= 0 && +p.harga < price)
      .forEach((p) => { price = +p.harga; promoId = p.id; });
    return Object.assign({}, l, { price, normal, promoId });
  });
  const diskon = [];
  // Flash sale: harga khusus dalam waktu singkat, dibatasi kuota total (p.kuota) dan batas per pesanan (p.batas).
  const flashKode = new Set();
  items.forEach((l) => {
    let best = null;
    act.filter((p) => p.tipe === 'flash' && p.kode === l.kode && +p.harga >= 0 && +p.harga < l.price).forEach((p) => {
      const used = opt.flashUsed ? (+opt.flashUsed(p) || 0) : (+p.terjual || 0);
      let n = l.qty;
      if (+p.batas > 0) n = Math.min(n, Math.floor(+p.batas));
      if (+p.kuota > 0) n = Math.min(n, Math.max(0, Math.floor(+p.kuota) - used));
      const d = n * (l.price - +p.harga);
      if (n > 0 && d > 0 && (!best || d > best.nilai)) best = { id: p.id, nama: p.nama, tipe: 'flash', nilai: d, qty: n, kode: l.kode };
    });
    if (best) { diskon.push(best); flashKode.add(l.kode); }
  });
  items.forEach((l) => {
    if (flashKode.has(l.kode)) return;
    let best = null;
    act.filter((p) => p.tipe === 'bundling' && p.kode === l.kode).forEach((p) => {
      const x = Math.max(1, Math.floor(+p.qty || 0));
      let d = 0;
      if (p.mode === 'gratis') {
        const y = Math.max(1, Math.floor(+p.gratis || 0));
        d = Math.floor(l.qty / (x + y)) * y * l.price;
      } else {
        d = Math.floor(l.qty / x) * Math.max(0, x * l.price - Math.max(0, +p.harga || 0));
      }
      if (d > 0 && (!best || d > best.nilai)) best = { id: p.id, nama: p.nama, tipe: 'bundling', nilai: d };
    });
    if (best) diskon.push(best);
  });
  const subtotal = items.reduce((s, l) => s + l.qty * l.price, 0);
  let sisa = Math.max(0, subtotal - diskon.reduce((s, d) => s + d.nilai, 0));
  let bm = null;
  act.filter((p) => p.tipe === 'minimal' && sisa >= (+p.minBelanja || 0)).forEach((p) => {
    const d = potongan(sisa, p);
    if (d > 0 && (!bm || d > bm.nilai)) bm = { id: p.id, nama: p.nama, tipe: 'minimal', nilai: d };
  });
  if (bm) { diskon.push(bm); sisa -= bm.nilai; }
  let voucherErr = '';
  const code = String(opt.voucher || '').trim().toUpperCase();
  if (code) {
    const vp = opt.voucherPromo && String(opt.voucherPromo.voucher || '').toUpperCase() === code ? opt.voucherPromo : null;
    const v = vp || act.find((p) => p.tipe === 'voucher' && String(p.voucher || '').toUpperCase() === code);
    if (!v || !promoAktif(v, now)) voucherErr = 'Kode voucher tidak berlaku.';
    else if (sisa < (+v.minBelanja || 0)) voucherErr = 'Voucher ' + code + ' berlaku untuk belanja minimal ' + rpf(+v.minBelanja) + '.';
    else {
      const d = potongan(sisa, v);
      if (d > 0) { diskon.push({ id: v.id, nama: v.nama, tipe: 'voucher', nilai: d, voucher: code }); sisa -= d; }
    }
  }
  // Bonus: beli produk X (min qty) dapat produk Y gratis. Ditambahkan sebagai baris harga 0, dibatasi stok Y.
  const bonus = [];
  act.filter((p) => p.tipe === 'bonus').forEach((p) => {
    const src = items.find((l) => l.kode === p.kode);
    const x = Math.max(1, Math.floor(+p.qty || 0));
    if (!src || src.qty < x) return;
    const info = opt.prod ? opt.prod(p.bonusKode) : null;
    if (!info) return;
    let n = (p.kelipatan === false ? 1 : Math.floor(src.qty / x)) * Math.max(1, Math.floor(+p.bonusQty || 0));
    if (opt.stock) {
      const used = items.filter((l) => l.kode === p.bonusKode).reduce((t, l) => t + l.qty, 0)
        + bonus.filter((b) => b.kode === p.bonusKode).reduce((t, b) => t + b.qty, 0);
      n = Math.min(n, Math.max(0, Math.floor(+opt.stock(p.bonusKode) || 0) - used));
    }
    if (n > 0) bonus.push({ id: p.id, nama: p.nama, kode: p.bonusKode, name: info.name, qty: n, normal: +info.jual || 0, modal: +info.modal || 0 });
  });
  bonus.forEach((b) => items.push({ kode: b.kode, name: b.name, qty: b.qty, price: 0, normal: b.normal, modal: b.modal, promoId: b.id, bonus: true }));
  return { items, subtotal, diskon, bonus, totalDiskon: subtotal - sisa, total: Math.max(0, sisa), voucherErr };
}
/* ===== SELESAI: mesin hitung ===== */

class PromoError extends Error { constructor(m) { super(m); this.status = 400; } }
const s = (v, n) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, n) : '');
const n0 = (v, max) => { const x = Math.round(Number(v)); return Number.isFinite(x) ? Math.max(0, Math.min(max, x)) : 0; };
const tgl = (v) => { if (!v) return null; const d = new Date(v); return Number.isNaN(+d) ? null : d.toISOString(); };

/** Validasi kiriman admin. productKodes: Set kode produk yang ada. */
function sanitize(b, productKodes) {
  b = b || {};
  const tipe = TIPE.includes(b.tipe) ? b.tipe : null;
  if (!tipe) throw new PromoError('Jenis promo tidak dikenal.');
  const nama = s(b.nama, 60);
  if (!nama) throw new PromoError('Nama promo wajib diisi.');
  const p = { tipe, nama, aktif: b.aktif !== false, mulai: tgl(b.mulai), selesai: tgl(b.selesai),
    banner: b.banner === undefined ? tipe !== 'voucher' : !!b.banner };
  if (p.mulai && p.selesai && p.selesai < p.mulai) throw new PromoError('Tanggal selesai harus setelah tanggal mulai.');
  const needKode = () => {
    const k = s(b.kode, 40);
    if (!productKodes.has(k)) throw new PromoError('Pilih produk untuk promo ini.');
    return k;
  };
  const diskonFields = () => {
    p.jenis = b.jenis === 'persen' ? 'persen' : 'nominal';
    p.nilai = n0(b.nilai, p.jenis === 'persen' ? 100 : 10000000);
    if (!p.nilai) throw new PromoError('Isi besar potongan.');
    p.maks = p.jenis === 'persen' ? n0(b.maks, 10000000) : 0;
    p.minBelanja = n0(b.minBelanja, 100000000);
  };
  if (tipe === 'produk') {
    p.kode = needKode();
    p.harga = n0(b.harga, 100000000);
  } else if (tipe === 'flash') {
    p.kode = needKode();
    p.harga = n0(b.harga, 100000000);
    if (!p.mulai || !p.selesai) throw new PromoError('Flash sale wajib punya waktu mulai dan selesai.');
    p.kuota = n0(b.kuota, 100000);
    p.batas = n0(b.batas, 100);
  } else if (tipe === 'bundling') {
    p.kode = needKode();
    p.mode = b.mode === 'gratis' ? 'gratis' : 'harga';
    p.qty = Math.max(1, n0(b.qty, 100));
    if (p.mode === 'gratis') { p.gratis = Math.max(1, n0(b.gratis, 100)); p.harga = 0; } else { p.harga = n0(b.harga, 100000000); p.gratis = 0; }
    if (p.mode === 'harga' && p.qty < 2) throw new PromoError('Harga khusus minimal untuk 2 item.');
  } else if (tipe === 'bonus') {
    p.kode = needKode();
    p.qty = Math.max(1, n0(b.qty, 100));
    const bk = s(b.bonusKode, 40);
    if (!productKodes.has(bk)) throw new PromoError('Pilih produk bonus.');
    p.bonusKode = bk;
    p.bonusQty = Math.max(1, n0(b.bonusQty, 100));
    p.kelipatan = b.kelipatan !== false;
  } else if (tipe === 'minimal') {
    diskonFields();
    if (!p.minBelanja) throw new PromoError('Isi minimal belanja.');
  } else {
    p.voucher = s(b.voucher, 20).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (p.voucher.length < 3) throw new PromoError('Kode voucher minimal 3 huruf/angka.');
    diskonFields();
    p.kuota = n0(b.kuota, 1000000);
  }
  return p;
}

/** Data promo untuk pembeli. Voucher hanya ikut jika admin menampilkannya di banner (kodenya jadi publik). */
const publicView = (list) => list
  .filter((p) => p.tipe !== 'voucher' || p.banner === true)
  .map((p) => (p.tipe === 'voucher' ? Object.assign(voucherView(p), { banner: true, kuota: p.kuota }) : p));
function voucherView(p) { return ({
  id: p.id, nama: p.nama, tipe: 'voucher', voucher: p.voucher, jenis: p.jenis, nilai: p.nilai, maks: p.maks,
  minBelanja: p.minBelanja, mulai: p.mulai, selesai: p.selesai, aktif: p.aktif,
}); }

module.exports = { TIPE, PromoError, promoAktif, potongan, hitungPromo, sanitize, publicView, voucherView };

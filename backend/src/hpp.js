/* Modal rata-rata (HPP metode rata-rata bergerak / moving average).
 * Setiap stok masuk: modal baru = (sisa stok × modal lama + jumlah masuk × harga beli) / (sisa + jumlah masuk).
 * Penjualan mengurangi jumlah, modal rata-rata tidak berubah.
 * hppReplay() HARUS sama persis dengan salinannya di frontend (kamart.html). */

/* ===== MULAI: hpp (salinan identik di frontend) ===== */
function hppDay(t) { return new Date(new Date(t).getTime() + 7 * 3600e3).toISOString().slice(0, 10); }
function hppTime(x) {
  const d = String(x.date).slice(0, 10);
  if (x.createdAt && hppDay(x.createdAt) === d) return new Date(x.createdAt).getTime();
  return Date.parse(d + 'T00:00:00+07:00');
}
/* stockin: [{id,date,kode,qty,harga,createdAt}], orders: [{id,createdAt,stage,items:[{kode,qty}]}]
 * opts.until: hanya kejadian sebelum waktu ini (ms). opts.fallback: {kode: modal} untuk stok masuk tanpa harga.
 * opts.adjust: penyesuaian stok opname [{id,date,kode,qty(+/-),modal,createdAt}]; tidak mengubah modal rata-rata.
 * Hasil: prod[kode] = {qty, avg, tanpaHarga}, jual[orderId][kode] = modal rata-rata saat terjual. */
function hppReplay(stockin, orders, opts) {
  opts = opts || {};
  const until = opts.until == null ? Infinity : opts.until;
  const fb = opts.fallback || {};
  const ev = [];
  (stockin || []).forEach((x) => {
    const t = hppTime(x);
    if (t < until) ev.push({ t, k: x.kode, q: Number(x.qty) || 0, h: Number(x.harga) || 0, masuk: 1, id: String(x.id) });
  });
  (orders || []).forEach((o) => {
    if ((o.stage == null ? 0 : o.stage) < 0) return;
    const t = new Date(o.createdAt).getTime();
    if (!(t < until)) return;
    (o.items || []).forEach((i) => ev.push({ t, k: i.kode, q: Number(i.qty) || 0, masuk: 0, id: String(o.id) }));
  });
  (opts.adjust || []).forEach((x) => {
    const t = hppTime(x); const q = Number(x.qty) || 0;
    if (t < until && q) ev.push({ t, k: x.kode, q, adj: 1, h: Number(x.modal) || 0, masuk: q > 0 ? 1 : 0, id: 'adj' + x.id });
  });
  ev.sort((a, b) => a.t - b.t || b.masuk - a.masuk || a.id.localeCompare(b.id, undefined, { numeric: true }));
  const prod = {}; const jual = {};
  ev.forEach((e) => {
    const s = prod[e.k] || (prod[e.k] = { qty: 0, avg: null, tanpaHarga: 0 });
    if (e.adj) {
      if (e.q > 0 && s.avg == null) s.avg = e.h;
      s.qty += e.q;
    } else if (e.masuk) {
      let h = e.h;
      if (!(h > 0)) { s.tanpaHarga += 1; h = s.avg != null ? s.avg : (Number(fb[e.k]) || 0); }
      const q0 = Math.max(0, s.qty);
      s.avg = q0 > 0 && s.avg != null ? (q0 * s.avg + e.q * h) / (q0 + e.q) : h;
      s.qty += e.q;
    } else {
      s.qty -= e.q;
      const m = s.avg != null ? s.avg : (Number(fb[e.k]) || 0);
      (jual[e.id] = jual[e.id] || {})[e.k] = m;
    }
  });
  return { prod, jual };
}
/* Nilai persediaan (harga modal) dari hasil hppReplay. */
function hppNilai(r) {
  let v = 0;
  Object.keys(r.prod).forEach((k) => { const s = r.prod[k]; if (s.qty > 0 && s.avg != null) v += s.qty * s.avg; });
  return v;
}
/* ===== SELESAI: hpp ===== */

module.exports = { hppReplay, hppNilai, hppTime };

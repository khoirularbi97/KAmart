(function(){
const STAGES=['Baru','Disiapkan','Siap diambil','Selesai'];
const STAGE_COL=['#6E5AC4','#D9467C','#E0901F','#4377DB'];
const VIEWS=[
  {id:'toko',t:'Toko',g:'Pembeli',ic:'shop'},
  {id:'keranjang',t:'Keranjang',g:'Pembeli',ic:'bag'},
  {id:'pesananku',t:'Pesanan Saya',g:'Pembeli',ic:'inbox'},
  {id:'akun',t:'Akun',g:'Pembeli',ic:'users'},
  {id:'tentang',t:'Tentang & Kontak',g:'Pembeli',ic:'shop'},
  {id:'syarat',t:'Syarat & Ketentuan',g:'Pembeli',ic:'inbox'},
  {id:'refund',t:'Pengembalian & Refund',g:'Pembeli',ic:'money'},
  {id:'privasi',t:'Kebijakan Privasi',g:'Pembeli',ic:'users'},
  {id:'dashboard',t:'Dashboard',g:'Admin',ic:'home'},
  {id:'pesanan',t:'Pesanan',g:'Admin',ic:'inbox'},
  {id:'kasir',t:'Kasir',g:'Admin',ic:'pos'},
  {id:'produk',t:'Produk',g:'Admin',ic:'box'},
  {id:'stok',t:'Stok Masuk',g:'Admin',ic:'down'},
  {id:'kasbon',t:'Belum Bayar',g:'Admin',ic:'clock'},
  {id:'riwayat',t:'Riwayat',g:'Admin',ic:'inbox'},
  {id:'promo',t:'Promo',g:'Admin',ic:'money'},
  {id:'rekap',t:'Rekap',g:'Admin',ic:'chart'},
  {id:'rutin',t:'Rutinitas',g:'Admin',ic:'check'},
  {id:'master',t:'Kelola Master',g:'Admin',ic:'box'}
];
const IC={
  rapat:'M4 5h16M4 9.5h16M4 14h16M4 18.5h16',doc:'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',grid:'M4 4h16v16H4zM4 10h16M4 15h16M10 4v16',
  shop:'M4 7h16l-1.5 12h-13zM8 7a4 4 0 0 1 8 0',home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  inbox:'M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6H3v-6z',pos:'M4 4h16v16H4zM8 9h8M8 13h3M8 17h3M14 13h2M14 17h2',
  box:'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8',down:'M12 3v12M7 10l5 5 5-5M4 21h16',
  clock:'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
  money:'M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',bag:'M6 7h12l-1 13H7zM9 7a3 3 0 0 1 6 0',
  trophy:'M8 4h8v5a4 4 0 0 1-8 0zM12 13v4M8 21h8',bell:'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  plus:'M12 5v14M5 12h14',cup:'M5 8h14l-1.5 12h-11zM4 5h16v3H4z',coffee:'M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 2v3M12 2v3',
  check:'M5 12l5 5 9-10',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5',phone:'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',monitor:'M3 4h18v12H3zM8 20h8M12 16v4',auto:'M3 5h12v10H3zM17 8h4v11h-4zM6 19h6',users:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-5-6'
};
const ic=(n,s=20,w=2)=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+IC[n]+'"/></svg>';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rp=n=>'Rp'+Math.round(+n||0).toLocaleString('id-ID');
const mk=d=>{d=new Date(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const sameDay=(a,b=new Date())=>new Date(a).toDateString()===new Date(b).toDateString();
const MONTHS=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const mLabel=k=>{const[y,m]=k.split('-');return MONTHS[+m-1]+' '+y};
const dLabel=iso=>{const d=new Date(iso);return d.getDate()+' '+MONTHS[d.getMonth()].slice(0,3)+', '+String(d.getHours()).padStart(2,'0')+'.'+String(d.getMinutes()).padStart(2,'0')};
const AVC=['#6E5AC4','#D9467C','#4377DB','#C47A12','#2F9E6A','#8A5CD6'];
const avc=n=>AVC[[...String(n)].reduce((a,c)=>a+c.charCodeAt(0),0)%AVC.length];
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const ls={get(k,d){try{const v=localStorage.getItem('kamart:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('kamart:'+k,JSON.stringify(v))}catch(e){}}};

const S={products:[],customers:[],orders:[],stockin:[],promos:[],expenses:[],adjust:[],cashclose:[],rutin:[],pengingat:null,loaded:{},db:null,offline:false,
  view:'toko',cat:'Semua',cart:{},co:Object.assign({name:'',line:'',slot:'Istirahat 12.00',pay:'QRIS',note:''},ls.get('me',{})),
  k:{cart:{},buyer:'',method:'Tunai',cash:0},receipt:null,confirm:null,
  pf:null,sf:{date:(d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'))(new Date()),kode:'',qty:'',harga:'',tempat:'',sumber:'laci'},
  xp:null,cf:{name:'',line:'',wa:''},month:mk(new Date()),kfilter:'Belum',lastPlaced:null,busy:false,q:'',qrisFor:null,qrisStatic:false,layout:ls.get('layout','auto'),compact:ls.get('compact',false),mine:[],placed:null,placedDl:'',alerts:[],alerted:new Set(),ns:ls.get('ns',{sound:true,push:false}),
  token:ls.get('token',null),pub:[],mine:[],queue:[],reg:false,netErr:'',lg:{user:'',pass:'',err:''}};
/* ---------- data master (bisa diubah di menu Kelola Master) ---------- */
const MASTER_DEFAULT={
  kategori:[{nama:'Makanan',warna:'pink',ikon:'cup',online:true},{nama:'Minuman',warna:'blue',ikon:'coffee',online:true},{nama:'Rokok',warna:'gold',ikon:'box',online:false},{nama:'Sembako',warna:'lav',ikon:'bag',online:true},{nama:'Lainnya',warna:'lav',ikon:'box',online:true}],
  bayar:[{kode:'QRIS',label:'QRIS',tipe:'qris',online:true,kasir:true,aktif:true,ket:''},{kode:'Tunai',label:'Tunai',tipe:'tunai',online:true,kasir:true,aktif:true,ket:''},{kode:'Kasbon',label:'Bayar pas gajian',tipe:'kasbon',online:true,kasir:true,aktif:true,ket:''}],
  waktu:[{label:'Pagi 09.30',aktif:true,utama:false},{label:'Istirahat 12.00',aktif:true,utama:true},{label:'Istirahat 18.00',aktif:true,utama:false},{label:'Pulang shift 1',aktif:true,utama:false},{label:'Pulang shift 2',aktif:true,utama:false}],
  satuan:['pcs','cup','bungkus','botol','sachet','dus','kg'],
  bagian:[],
  toko:{lokasi:'Parkiran motor / pos',tutup:30}};
const clone=o=>JSON.parse(JSON.stringify(o));
function M(){const m=S.master||{},d=MASTER_DEFAULT,a=(k)=>Array.isArray(m[k])&&m[k].length?m[k]:d[k];
  return{kategori:a('kategori'),bayar:a('bayar'),waktu:a('waktu'),satuan:Array.isArray(m.satuan)?m.satuan:d.satuan,bagian:Array.isArray(m.bagian)?m.bagian:d.bagian,toko:Object.assign({},d.toko,m.toko||{})}}
const catInfo=n=>M().kategori.find(c=>c.nama===n)||{nama:n||'Lainnya',warna:'lav',ikon:'box',online:true};
const catOnline=n=>catInfo(n).online!==false;
const slots=()=>M().waktu.filter(w=>w.aktif!==false).map(w=>w.label);
const defSlot=()=>{const w=M().waktu.filter(x=>x.aktif!==false);return(w.find(x=>x.utama)||w[0]||{label:''}).label};
const pays=where=>M().bayar.filter(b=>b.aktif!==false&&b[where]!==false);
const payInfo=k=>M().bayar.find(b=>b.kode===k)||{kode:k,label:k,tipe:'manual',ket:''};
const payLabel=k=>payInfo(k).label||k;
const bagianList=()=>[...new Set([...M().bagian,...S.customers.map(c=>c.line).filter(Boolean)])];
const dl=(id,a)=>'<datalist id="'+id+'">'+a.map(x=>'<option value="'+esc(x)+'">').join('')+'</datalist>';
/* ---------- modal rata-rata (salinan identik backend/src/hpp.js) ---------- */
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
/* ---------- promo: mesin hitung (salinan identik backend/src/promo.js) ---------- */
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
  items.forEach((l) => {
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

const PTIPE={produk:'Harga coret',bundling:'Beli X',bonus:'Beli X bonus Y',minimal:'Minimal belanja',voucher:'Voucher'};
const promoList=()=>(S.token&&S.loaded&&S.loaded.admin?S.promos:(S.pubPromos||S.promos||[]))||[];
function vch(sc,v){S.vouch=S.vouch||{co:{code:'',vp:null},k:{code:'',vp:null}};if(v!==undefined)S.vouch[sc]=v||{code:'',vp:null};return S.vouch[sc]}
function priceFor(lines,sc){const v=vch(sc);return hitungPromo(lines,promoList(),{voucher:v.code,voucherPromo:v.vp,rp,prod:k=>prod(k)||null,stock:k=>stockOf(k)})}
const potTxt=p=>p.jenis==='persen'?(+p.nilai)+'%'+(+p.maks?' (maks '+rp(p.maks)+')':''):rp(p.nilai);
const bundleText=q=>q.mode==='gratis'?'Beli '+q.qty+' gratis '+q.gratis:q.qty+' pcs '+rp(q.harga);
function promoDesc(p){const pr=prod(p.kode)||{},nm=pr.name||p.kode;
  if(p.tipe==='produk')return nm+' jadi '+rp(p.harga)+(pr.jual?' (dari '+rp(pr.jual)+')':'');
  if(p.tipe==='bundling')return nm+': '+bundleText(p);
  if(p.tipe==='bonus'){const y=prod(p.bonusKode)||{};return 'Beli '+p.qty+' '+nm+' gratis '+p.bonusQty+' '+(y.name||p.bonusKode)+(p.kelipatan===false?'':' (berlaku kelipatan)')}
  if(p.tipe==='minimal')return 'Belanja min '+rp(p.minBelanja)+', hemat '+potTxt(p);
  return 'Kode '+p.voucher+': hemat '+potTxt(p)+(+p.minBelanja?', min '+rp(p.minBelanja):'')+(+p.kuota?', kuota '+p.kuota:'')}
const actPromos=()=>{const now=new Date();return promoList().filter(p=>promoAktif(p,now))};
function promoPrice(p){const x=actPromos().filter(q=>q.tipe==='produk'&&q.kode===p.kode&&+q.harga<(+p.jual||0));return x.length?Math.min(...x.map(q=>+q.harga)):null}
function priceTag(p){const pp=promoPrice(p);return pp==null?'<span class="pr num">'+rp(p.jual)+'</span>':'<span class="pr num">'+rp(pp)+' <s>'+rp(p.jual)+'</s></span>'}
function promoBadge(p){const pp=promoPrice(p),b=actPromos().find(q=>q.tipe==='bundling'&&q.kode===p.kode);
  if(pp!=null&&+p.jual)return '<span class="pbadge">-'+Math.max(1,Math.round((1-pp/p.jual)*100))+'%</span>';
  if(b)return '<span class="pbadge">'+esc(bundleText(b))+'</span>';
  const bo=actPromos().find(q=>q.tipe==='bonus'&&q.kode===p.kode);return bo?'<span class="pbadge">Bonus '+esc((prod(bo.bonusKode)||{}).name||bo.bonusKode)+'</span>':''}
function promoStrip(){const a=actPromos().filter(p=>p.tipe!=='voucher');if(!a.length)return '';
  return '<div class="pstrip" aria-label="Promo">'+a.map(p=>'<span class="pchip">'+ic('money',14)+'<span>'+esc(promoDesc(p))+'</span></span>').join('')+'</div>'}
function sumRows(hp){return '<div class="li" style="border:0;padding:2px 0"><span style="color:var(--muted)">Subtotal</span><span class="num">'+rp(hp.subtotal)+'</span></div>'+
  hp.diskon.map(d=>'<div class="li" style="border:0;padding:2px 0;color:var(--ok)"><span>'+esc(d.nama)+'</span><span class="num">−'+rp(d.nilai)+'</span></div>').join('')+
  (hp.bonus||[]).map(b=>'<div class="li" style="border:0;padding:2px 0;color:var(--ok)"><span>Bonus '+b.qty+'× '+esc(b.name)+'</span><span>Gratis</span></div>').join('')}
function promoHint(hp){const sisa=hp.subtotal-hp.diskon.filter(d=>d.tipe==='bundling').reduce((t,d)=>t+d.nilai,0),got=hp.diskon.find(d=>d.tipe==='minimal');
  const next=actPromos().filter(p=>p.tipe==='minimal'&&+p.minBelanja>sisa&&(!got||potongan(+p.minBelanja,p)>got.nilai)).sort((a,b)=>a.minBelanja-b.minBelanja)[0];
  return next?'<div class="banner b-mint" style="font-size:13px">Tambah <b class="num">'+rp(next.minBelanja-sisa)+'</b> lagi untuk hemat '+esc(potTxt(next))+'.</div>':''}
function voucherBox(sc,hp){const v=vch(sc);
  if(v.code){const d=hp.diskon.find(x=>x.tipe==='voucher');return '<div class="vbox on"><span style="display:flex;align-items:center;gap:6px;min-width:0">'+ic('check',16,2.6)+'<b>'+esc(v.code)+'</b>'+(d?'<span class="num">· hemat '+rp(d.nilai)+'</span>':'')+'</span><button type="button" class="btn3" data-vclear="'+sc+'">Hapus</button></div>'+(hp.voucherErr?'<small style="color:var(--bad)">'+esc(hp.voucherErr)+'</small>':'')}
  return '<div class="vbox"><input class="in" id="'+sc+'-vin" placeholder="Kode voucher" autocapitalize="characters" autocomplete="off" maxlength="20" aria-label="Kode voucher"><button type="button" class="btn2" data-vapply="'+sc+'"'+(S.vbusy?' disabled':'')+'>Pakai</button></div>'}
async function fetchVoucher(code){const r=await api('POST','/api/promos/voucher',{code});return r.promo}
document.addEventListener('click',async e=>{const a=e.target.closest('[data-vapply],[data-vclear]');if(!a)return;
  if(a.dataset.vclear){vch(a.dataset.vclear,null);render();return}
  const sc=a.dataset.vapply,inp=document.getElementById(sc+'-vin'),code=String(inp&&inp.value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(!code){toast('Isi kode voucher dulu');return}
  S.vbusy=true;render();
  try{const vp=await fetchVoucher(code);vch(sc,{code,vp});toast('Voucher '+code+' dipakai')}catch(err){toast((err&&err.message)||'Kode voucher tidak berlaku.')}
  S.vbusy=false;render()});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&/-vin$/.test(e.target.id||'')){e.preventDefault();const b=document.querySelector('[data-vapply="'+e.target.id.replace(/-vin$/,'')+'"]');if(b)b.click()}});

/* ---------- data layer ---------- */
const COLS=['products','customers','orders','stockin','promos','expenses','adjust','cashclose','rutin'];
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>{t.hidden=true},2600)}
function dbErr(e){toast(e&&e.code==='quota_exceeded'?'Penyimpanan penuh. Hapus data lama dulu.':'Gagal menyimpan, coba lagi.')}
const API=(window.KAMART_API_BASE||'').replace(/\/$/,'');
async function api(method,path,body,auth){
  const h={'Content-Type':'application/json'};if(auth&&S.token)h.Authorization='Bearer '+S.token;
  let res;try{res=await fetch(API+path,{method,headers:h,body:body?JSON.stringify(body):undefined})}catch(e){throw new Error('Tidak bisa terhubung ke server. Cek internet lalu coba lagi.')}
  let data=null;try{data=await res.json()}catch(e){}
  if(res.status===401&&auth){S.token=null;ls.set('token',null);S.loaded.admin=false;render();throw new Error((data&&data.error)||'Sesi admin berakhir, silakan masuk lagi.')}
  if(!res.ok)throw new Error((data&&data.error)||'Terjadi kesalahan ('+res.status+').');
  return data;
}
async function run(p,okMsg){try{const r=await p;if(okMsg)toast(okMsg);return r}catch(e){toast(e.message);throw e}}
async function saveMaster(m,renames){const r=await run(api('PUT','/api/admin/master',{master:m,renames},true));S.master=r.master;if(r.moved)await loadAdmin();render();return r}
async function loadPublic(){try{const r=await api('GET','/api/products');S.pub=r.products;if(r.master)S.master=r.master;S.pubPromos=r.promos||[];S.loaded.pub=true;S.netErr=navigator.onLine?'':'Kamu sedang offline. Katalog yang tampil mungkin bukan yang terbaru.'}catch(e){S.netErr=e.message}render()}
async function loadMine(){const toks=ls.get('orders',[]);if(!toks.length){S.mine=[];return}try{const r=await api('POST','/api/orders/lookup',{tokens:toks});S.mine=r.orders;render()}catch(e){}}
async function loadAdmin(){if(!S.token)return;try{const r=await api('GET','/api/admin/data',null,true);S.products=r.products;S.customers=r.customers;S.orders=r.orders;S.stockin=r.stockin;if(r.master)S.master=r.master;S.promos=r.promos||[];S.expenses=r.expenses||[];S.adjust=r.adjust||[];S.cashclose=r.cashclose||[];S.rutin=r.rutin||[];S.pengingat=r.pengingat||null;S.loaded.admin=true;S.netErr=''}catch(e){S.netErr=e.message}render()}
async function loadQueue(){try{const r=await api('GET','/api/orders/queue');S.queue=r.orders;S.loaded.queue=true}catch(e){}render()}
async function checkReg(){const n=S.co.name.trim();if(!n){S.reg=false;render();return}try{const r=await api('GET','/api/customers/check?name='+encodeURIComponent(n));S.reg=!!r.registered}catch(e){}render()}

/* ---------- derived ---------- */
const valid=()=>S.orders.filter(o=>(o.stage==null?0:o.stage)>=0);
const prod=k=>S.products.find(p=>p.kode===k)||S.pub.find(p=>p.kode===k);
function stockOf(k){const src=isShopView()?S.pub:S.products;const p=src.find(x=>x.kode===k)||prod(k);return p?(+p.stock||0):0}
const sortedProducts=()=>S.products.slice().sort((a,b)=>String(a.kode).localeCompare(String(b.kode)));
const profit=o=>(+o.total||0)-(+o.modalTotal||0);
const isCust=n=>S.customers.find(c=>c.name.trim().toLowerCase()===String(n).trim().toLowerCase());
// Tagihan: semua kasbon yang belum lunas + pesanan yang sudah diambil (Selesai) tapi belum dibayar
const unpaidKasbon=()=>valid().filter(o=>!o.paid&&(o.pay==='Kasbon'||o.stage===3));
const activeCount=()=>valid().filter(o=>o.stage<2).length;
function cartLines(cart,src){return Object.entries(cart).filter(([,q])=>q>0).map(([k,q])=>{const p=(src||S.products).find(x=>x.kode===k);return p?{kode:k,name:p.name,qty:q,price:+p.jual||0,modal:+p.modal||0}:null}).filter(Boolean)}
const sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);

/* ---------- shell ---------- */
function go(v){if(location.hash!=='#'+v)location.hash=v;else{S.view=v;render()}}
function readHash(){const h=location.hash.slice(1);S.view=VIEWS.some(v=>v.id===h)?h:'toko'}
function badgeFor(id){if(id==='pesanan'){const n=activeCount();return n?n:''}if(id==='kasbon'){const n=new Set(unpaidKasbon().map(o=>o.customerName)).size;return n?n:''}return ''}
function renderShell(){
  const cur=VIEWS.find(x=>x.id===S.view),shop=cur.g==='Pembeli';
  document.body.classList.toggle('shopmode',shop);
  applyLayout(!shop&&isAuthed());
  const snav=document.getElementById('shopnav');snav.hidden=!shop;snav.innerHTML=shop?shopNav():'';
  const lines=cartLines(S.cart,S.pub),cn=sum(lines,l=>l.qty);
  document.getElementById('cartbar').innerHTML=shop&&S.view==='toko'&&cn?'<button class="cartbar" data-go="keranjang"><span><small>'+cn+' item di keranjang</small><br><strong class="num" style="font-size:15px">'+rp(sum(lines,l=>l.qty*l.price))+'</strong></span><b>Lihat keranjang ›</b></button>':'';
  const groups=['Pembeli','Admin'];
  document.getElementById('side').innerHTML=
    '<div class="who"><img src="logo.png" alt="" width="88" height="88" style="border-radius:50%;border:3px solid rgba(255,255,255,.7);box-shadow:0 12px 26px rgba(0,0,0,.25)"><strong style="font-size:16px">Hi, Arbi!</strong><span style="font-size:12px;color:#E6DEFF">Admin KAmart</span></div>'+
    groups.map(g=>'<nav class="navg" aria-label="'+g+'"><small>'+g+'</small>'+VIEWS.filter(v=>v.g===g&&(g==='Admin'||v.id==='toko')).map(v=>{const b=badgeFor(v.id);return '<button class="nv'+(S.view===v.id?' on':'')+'" data-go="'+v.id+'"'+(S.view===v.id?' aria-current="page"':'')+'><span>'+ic(v.ic,18)+v.t+'</span>'+(b?'<em class="bdg">'+b+'</em>':'')+'</button>'}).join('')+'</nav>').join('')+
    '<div class="sidenote"><strong>Tersambung ke server</strong><br>Data diperbarui saat ada pesanan baru, saat aplikasi dibuka, atau lewat tombol ↻.</div>'+
    '<button class="nv" data-act="logout" style="justify-content:center;background:rgba(255,255,255,.14)">Keluar</button>';
  const v=VIEWS.find(x=>x.id===S.view);
  document.getElementById('mbar').innerHTML='<span style="display:flex;align-items:center;gap:8px"><img src="logo.png" alt="" width="34" height="34" style="border-radius:50%"><b>KAmart</b></span><span style="font-size:12px;color:#EDE7FF">'+v.g+' · '+v.t+'</span>';
  const nNew=valid().filter(o=>o.stage===0).length;
  const subs={rutin:'Checklist harian sampai tahunan dan pengingat otomatis',promo:'Harga coret, beli X, minimal belanja, dan voucher',riwayat:'Semua pesanan online & kasir, bisa dicari dan diekspor',master:'Kategori, pembayaran, waktu ambil, dan lainnya',tentang:'Tentang KAmart',syarat:'Aturan berbelanja',refund:'Pembatalan dan pengembalian dana',privasi:'Perlindungan data pembeli',toko:'Pesan sekarang, ambil saat istirahat',dashboard:salam()+', Arbi',pesanan:'Alur pesanan dari Baru sampai Selesai',kasir:'Transaksi langsung di tempat',produk:'Harga, margin, dan sisa stok',stok:'Catat belanja dan stok opname',kasbon:'Kasbon dan pesanan yang belum dibayar',rekap:'Ringkasan per bulan'};
  document.getElementById('top').innerHTML='<div><h1>'+v.t+'</h1><div class="sub">'+subs[v.id]+'</div></div>'+
    '<div class="tbtns">'+(v.g==='Admin'?layoutSwitch()+'<button class="btn2" data-act="refresh" aria-label="Muat ulang data"'+(S.refreshing?' disabled':'')+'>'+(S.refreshing?'Memuat…':'↻ Muat ulang')+'</button>':'')+(v.g==='Admin'?'<button class="cbtn'+(unseenOrders().length?' ring-on':'')+'" data-go="pesanan" aria-label="Pesanan baru: '+nNew+'">'+ic('bell')+(nNew?'<em>'+nNew+'</em>':'')+'</button>':'')+
    (v.g==='Admin'&&isAuthed()?'<button class="btn2" data-act="xopen">'+ic('down',16)+'Export</button>':'')+'<button class="btn2" data-go="'+(v.g==='Admin'?'toko':'dashboard')+'">'+(v.g==='Admin'?'Lihat toko':'Masuk admin')+'</button>'+(v.g==='Admin'?'<button class="btn2" data-act="logout">Keluar</button>':'')+'</div>';
  const pillIds=v.g==='Admin'?['dashboard','pesanan','riwayat','kasir','produk','promo','stok','kasbon','rekap','master']:['toko'];
  document.getElementById('pill').innerHTML='<div class="track">'+pillIds.map(id=>{const x=VIEWS.find(y=>y.id===id),b=badgeFor(id);return '<button class="pb'+(S.view===id?' on':'')+'" data-go="'+id+'">'+x.t+(b?'<em>'+b+'</em>':'')+'</button>'}).join('')+
    (v.g==='Admin'?'':'<button class="pb" data-go="dashboard">Admin</button>')+'</div>'+
    '<button class="plus" data-go="'+(v.g==='Admin'?'kasir':'toko')+'" aria-label="'+(v.g==='Admin'?'Transaksi baru di kasir':'Belanja')+'">'+ic('plus',22,2.4)+'</button>';
}
/* ---------- notifikasi pesanan masuk ---------- */
const adminView=()=>VIEWS.find(x=>x.id===S.view).g==='Admin';
const onlineOrders=()=>valid().filter(o=>o.source==='online');
function lastSeen(){let v=ls.get('lastSeen',null);if(!v){v=onlineOrders().reduce((a,o)=>o.createdAt>a?o.createdAt:a,new Date().toISOString());ls.set('lastSeen',v)}return v}
function markSeen(){const v=onlineOrders().reduce((a,o)=>o.createdAt>a?o.createdAt:a,lastSeen());ls.set('lastSeen',v)}
function unseenOrders(){if(!isAuthed()||!(S.loaded.orders||S.loaded.admin))return [];const last=lastSeen();return onlineOrders().filter(o=>o.stage===0&&o.createdAt>last)}
let AC=null;
function audio(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}return AC}
document.addEventListener('pointerdown',audio,{once:true});
function beep(){const ac=audio();if(!ac)return;try{const t=ac.currentTime+.02;[[880,0],[1175,.16],[1568,.32]].forEach(([f,d])=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t+d);g.gain.exponentialRampToValueAtTime(.3,t+d+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d+.15);o.connect(g);g.connect(ac.destination);o.start(t+d);o.stop(t+d+.17)})}catch(e){}}
function expireAlerts(){clearTimeout(expireAlerts.t);expireAlerts.t=setTimeout(()=>{const n=Date.now(),before=S.alerts.length;S.alerts=S.alerts.filter(a=>n-a.at<20000);if(S.alerts.length!==before)render();if(S.alerts.length)expireAlerts()},4000)}
function notifyNew(){
  const fresh=unseenOrders().filter(o=>!S.alerted.has(o.id));
  if(!fresh.length)return;
  fresh.forEach(o=>S.alerted.add(o.id));
  const now=Date.now();
  S.alerts=fresh.map(o=>({id:o.id,name:o.customerName,items:itemsText(o),total:o.total,slot:o.slot,at:now})).concat(S.alerts).slice(0,3);
  expireAlerts();
  if(S.ns.sound)beep();
  try{if(navigator.vibrate)navigator.vibrate([120,60,120])}catch(e){}
  if(S.ns.push&&'Notification' in window&&Notification.permission==='granted'&&document.hidden){
    fresh.forEach(o=>{const title='Pesanan baru · '+o.customerName,opts={body:itemsText(o)+' · '+rp(o.total)+(o.slot?' · '+o.slot:''),icon:'logo.png',badge:'favicon.png',tag:o.id,data:{url:'/#pesanan'}};
      if(navigator.serviceWorker&&navigator.serviceWorker.controller){navigator.serviceWorker.ready.then(r=>r.showNotification(title,opts)).catch(()=>{})}
      else{try{const n=new Notification(title,opts);n.onclick=()=>{window.focus();go('pesanan');n.close()}}catch(e){}}});
  }
}
function notifHtml(){
  if(!isAuthed()||!adminView()||!S.alerts.length)return '';
  return S.alerts.map(a=>'<div class="ncard" role="status"><span class="tile t-pink" style="width:42px;height:42px">'+ic('bell',20)+'</span><div style="flex:1;min-width:0"><b style="font-size:14px">Pesanan baru · '+esc(a.name)+'</b><div style="font-size:12px;color:var(--muted);margin-top:2px">'+esc(a.items)+'</div><div style="font-size:12px;margin-top:2px"><b class="num">'+rp(a.total)+'</b>'+(a.slot?' · '+esc(a.slot):'')+'</div><div style="margin-top:8px"><button class="btn3" data-go="pesanan">Lihat pesanan</button></div></div><button class="btn3" data-ndismiss="'+esc(a.id)+'" aria-label="Tutup notifikasi" style="padding:0 12px;font-size:16px">×</button></div>').join('');
}
function notifSettings(){
  const has='Notification' in window,perm=has?Notification.permission:'unsupported';
  return '<div class="card" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px"><span style="display:flex;align-items:center;gap:12px;min-width:0"><span class="tile t-lav" style="width:42px;height:42px">'+ic('bell',18)+'</span><span style="min-width:0"><b>Notifikasi pesanan masuk</b><br><small style="color:var(--muted)">Kartu, suara, dan getar saat halaman admin terbuka. Aktifkan notifikasi HP supaya tetap masuk walau aplikasi ditutup.</small></span></span>'+
   '<span style="display:flex;gap:8px;flex-wrap:wrap"><button class="sg'+(S.ns.sound?' on':'')+'" data-act="nsound" aria-pressed="'+S.ns.sound+'">Suara '+(S.ns.sound?'aktif':'mati')+'</button>'+
   (perm==='granted'&&S.ns.push?'<span class="pill-s ps-ok" style="align-self:center">'+(S.ns.server?'Notifikasi HP aktif':'Notifikasi aktif (hanya saat terbuka)')+'</span>':perm==='denied'?'<span class="pill-s ps-bad" style="align-self:center">Notifikasi diblokir, izinkan di pengaturan situs</span>':perm==='unsupported'?'':'<button class="sg" data-act="npush">Aktifkan notifikasi HP</button>')+
   '<button class="sg" data-act="ntest">Tes notifikasi</button></span></div>';
}
function layoutSwitch(){
  const o=[['auto','Otomatis','auto'],['mobile','HP','phone'],['desktop','Desktop','monitor']];
  return '<div class="seg lay" role="radiogroup" aria-label="Mode tampilan admin">'+o.map(([v,t,i])=>'<button class="sg'+(S.layout===v?' on':'')+'" role="radio" aria-checked="'+(S.layout===v)+'" data-layout="'+v+'" title="Tampilan '+t+'">'+ic(i,16)+'<span>'+t+'</span></button>').join('')+'<i class="laysep" aria-hidden="true"></i><button class="sg'+(S.compact?' on':'')+'" data-act="compact" aria-pressed="'+!!S.compact+'" title="Tampilan ringkas: jarak dan ukuran lebih rapat">'+ic('rapat',16)+'<span>Ringkas</span></button></div>';
}
function applyLayout(admin){
  const lay=admin?S.layout:'auto';
  document.body.classList.toggle('force-mobile',lay==='mobile');
  document.body.classList.toggle('force-desktop',lay==='desktop');
  document.body.classList.toggle('compact',!!(admin&&S.compact));
  // Mode Desktop di layar sempit: tata letak 1280 px diperkecil agar muat (seperti "situs desktop").
  const w=document.documentElement.clientWidth||window.innerWidth;
  const z=lay==='desktop'&&w<1200?Math.max(.3,w/1280):1;
  const cur=parseFloat(document.documentElement.style.zoom||'1');
  if(Math.abs(cur-z)>.001)document.documentElement.style.zoom=z===1?'':String(z);
}
window.addEventListener('resize',()=>{clearTimeout(applyLayout.t);applyLayout.t=setTimeout(()=>{if(S.layout==='desktop')render()},150)});
function salam(){const h=new Date().getHours();return h<11?'Selamat pagi':h<15?'Selamat siang':h<18?'Selamat sore':'Selamat malam'}

/* ---------- views ---------- */
function loading(){return isShopView()?!(S.view==='pesananku'?S.loaded.queue:S.loaded.pub):!S.loaded.admin}
function prodTile(p,big){if(p.img)return '<img class="thumb" src="'+esc(p.img)+'" alt=""'+(big?' style="width:54px;height:54px;border-radius:16px"':'')+'>';const ci=catInfo(p.cat),c=ci.warna,i=ci.ikon;return '<span class="tile t-'+c+'"'+(big?' style="width:54px;height:54px;border-radius:16px"':'')+'>'+ic(i,big?26:20)+'</span>'}

/* ---------- PWA: pasang aplikasi & offline ---------- */
let deferredPrompt=null;
const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;render()});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;toast('KAmart sudah terpasang di HP kamu');render()});
window.addEventListener('offline',()=>{S.netErr='Kamu sedang offline. Katalog yang tampil mungkin bukan yang terbaru.';render()});
window.addEventListener('online',()=>{S.netErr='';tick()});
/* ---------- Web Push: notifikasi HP admin walau aplikasi ditutup ---------- */
function b64ToU8(s){const p='='.repeat((4-s.length%4)%4);const b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0))}
async function enablePush(silent){
  try{
    if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){
      if(!silent)toast(isIOS()?'Di iPhone: pasang KAmart ke Layar Utama dulu, lalu buka dari ikonnya':'Browser ini tidak mendukung notifikasi');return}
    const perm=silent?Notification.permission:await Notification.requestPermission();
    if(perm!=='granted'){S.ns.push=false;S.ns.server=false;ls.set('ns',S.ns);if(!silent)toast('Izin notifikasi tidak diberikan');render();return}
    const k=await api('GET','/api/push/key');
    const reg=await navigator.serviceWorker.ready;
    if(k.publicKey){
      let sub=await reg.pushManager.getSubscription();
      if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64ToU8(k.publicKey)});
      await api('POST','/api/admin/push/subscribe',{subscription:sub.toJSON()},true);S.ns.server=true;
    }else S.ns.server=false;
    S.ns.push=true;ls.set('ns',S.ns);
    if(!silent)toast(k.publicKey?'Notifikasi HP aktif, tetap masuk walau aplikasi ditutup':'Notifikasi aktif, tapi server belum diatur VAPID');
  }catch(e){if(!silent)toast('Gagal mengaktifkan notifikasi: '+e.message)}
  render();
}
async function disablePush(){
  try{const reg=await navigator.serviceWorker.getRegistration();const sub=reg&&await reg.pushManager.getSubscription();
    if(sub){if(S.token)await api('POST','/api/admin/push/unsubscribe',{endpoint:sub.endpoint},true).catch(()=>{});await sub.unsubscribe()}}catch(e){}
  S.ns.push=false;S.ns.server=false;ls.set('ns',S.ns);
}
setTimeout(()=>{if(S.token&&S.ns.push)enablePush(true)},3000);
if(!navigator.onLine)S.netErr='Kamu sedang offline. Katalog yang tampil mungkin bukan yang terbaru.';
if('serviceWorker' in navigator)window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})});
function installCard(){if(isStandalone()||!(deferredPrompt||isIOS()))return '';
  return '<div class="card stack" style="gap:10px;padding:16px"><span style="display:flex;align-items:center;gap:12px"><img src="icons/icon-192.png" alt="" width="46" height="46" style="border-radius:14px;flex:none"><span><b>Pasang aplikasi KAmart</b><br><small style="color:var(--muted)">Buka langsung dari layar utama HP, layar penuh seperti aplikasi.</small></span></span>'+
  (deferredPrompt?'<button class="btn" data-act="install">Pasang sekarang</button>':'<small style="color:var(--muted)">Di iPhone: buka di Safari, ketuk tombol <b>Bagikan</b>, lalu pilih <b>Tambahkan ke Layar Utama</b>.</small>')+'</div>'}
function installBanner(){if(!deferredPrompt||isStandalone()||ls.get('installHide',0))return '';
  return '<div class="banner b-lav" style="display:flex;align-items:center;gap:10px;padding:10px 12px"><img src="icons/icon-192.png" alt="" width="38" height="38" style="border-radius:11px;flex:none"><span style="flex:1;min-width:0;font-size:12px;line-height:1.35"><b>Pasang aplikasi KAmart</b><br>Pesan lebih cepat dari layar utama.</span><button class="btn3" data-act="install">Pasang</button><button class="btn3" data-act="installhide" aria-label="Tutup" style="padding:0 12px">×</button></div>'}
async function doInstall(){if(!deferredPrompt)return;deferredPrompt.prompt();try{await deferredPrompt.userChoice}catch(e){}deferredPrompt=null;render()}
function shopHead(title,sub,right,logo){return '<header class="sh-head"><div style="min-width:0;display:flex;align-items:center;gap:10px">'+(logo?'<img src="logo.png" alt="KAmart" width="46" height="46" style="border-radius:50%;flex:none;box-shadow:0 8px 18px rgba(91,71,176,.25)">':'')+'<div style="min-width:0"><h1>'+title+'</h1><p>'+sub+'</p></div></div>'+(right||'')+'</header>'}
// Pesanan HP ini yang masih berjalan (Baru, Disiapkan, Siap diambil). Batal (-1) dan Selesai (3) tidak dihitung.
const activeMine=()=>myOrders().filter(o=>o.stage>=0&&o.stage<3);
// Pesanan milik nama di Akun (jika nama kosong: semua pesanan dari HP ini), tanpa yang dibatalkan.
const acctOrders=name=>myOrders().filter(o=>o.stage>=0&&(!name||String(o.customerName||'').trim().toLowerCase()===name.toLowerCase()));
function myOrders(){return S.mine.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}
function shopNav(){const n=sum(cartLines(S.cart,S.pub),l=>l.qty),a=activeMine().length;
  return [['toko','Belanja','shop',0],['keranjang','Keranjang','bag',n],['pesananku','Pesanan','inbox',a],['akun','Akun','users',0]].map(([id,t,i,b])=>'<button class="sn'+(S.view===id?' on':'')+'" data-go="'+id+'"'+(S.view===id?' aria-current="page"':'')+'>'+ic(i,21)+'<span>'+t+'</span>'+(b?'<em>'+b+'</em>':'')+'</button>').join('')}
function cupHtml(){return '<div aria-hidden="true" style="position:relative;flex:0 0 86px;height:86px">'+
 ['28','40','52'].map((l,i)=>'<span style="position:absolute;left:'+l+'px;top:'+(i===1?0:4)+'px;width:6px;height:14px;border-radius:6px;background:rgba(255,255,255,.85)"></span>').join('')+
 '<span style="position:absolute;left:16px;top:30px;width:56px;height:50px;border-radius:6px 6px 18px 18px;background:linear-gradient(180deg,#FFC1D6,#D9467C);box-shadow:0 10px 18px rgba(217,70,124,.35)"></span>'+
 '<span style="position:absolute;left:10px;top:22px;width:68px;height:14px;border-radius:8px;background:linear-gradient(180deg,#fff,#F1ECFD);box-shadow:0 4px 8px rgba(91,71,176,.2)"></span>'+
 '<span style="position:absolute;left:28px;top:48px;width:32px;height:16px;border-radius:8px;background:rgba(255,255,255,.75)"></span></div>'}
function stepper(k,q,st,name){return q?'<span style="display:flex;align-items:center;gap:6px"><button class="qb m" data-cart="'+esc(k)+'" data-d="-1" aria-label="Kurangi '+esc(name)+'">−</button><b class="num">'+q+'</b><button class="qb" data-cart="'+esc(k)+'" data-d="1" aria-label="Tambah '+esc(name)+'"'+(q>=st?' disabled':'')+'>+</button></span>'
  :'<button class="qb" data-cart="'+esc(k)+'" data-d="1" aria-label="Tambah '+esc(name)+'"'+(st<=0?' disabled':'')+'>+</button>'}
function vToko(){
  const n=sum(cartLines(S.cart,S.pub),l=>l.qty),first=S.co.name.trim().split(' ')[0];
  const head=shopHead('Halo'+(first?', '+esc(first):'')+'!','Mau jajan apa hari ini?','<button class="iconbtn" data-go="keranjang" aria-label="Keranjang, '+n+' item">'+ic('bag',22)+(n?'<em>'+n+'</em>':'')+'</button>',true);
  if(loading())return head+'<div class="card empty">Memuat produk…</div>';
  const list=S.pub.filter(p=>catOnline(p.cat));
  const pc=new Set(list.map(p=>p.cat||'Lainnya')),mc=M().kategori.map(k=>k.nama);
  const cats=['Semua',...mc.filter(n=>pc.has(n)),...[...pc].filter(n=>!mc.includes(n))];
  const q=S.q.trim().toLowerCase();
  const shown=list.filter(p=>(S.cat==='Semua'||p.cat===S.cat)&&(!q||String(p.name).toLowerCase().includes(q)));
  return head+'<div class="stack" style="gap:14px">'+installBanner()+
  '<div class="search">'+ic('search',18)+'<label for="q" class="sr">Cari produk</label><input class="in" id="q" type="search" data-bind="q" data-live="1" placeholder="Cari Pop Mie, kopi…" value="'+esc(S.q)+'"></div>'+
  bannerHtml('<section class="promo"><div style="flex:1;min-width:0"><span class="chip" style="font-size:11px;padding:4px 10px"><i></i>Ambil saat istirahat</span><h2>Pesan dulu, tinggal ambil.</h2><p>Order tutup '+(+M().toko.tutup||0)+' menit sebelum jam ambil.</p></div>'+cupHtml()+'</section>')+
  '<div class="chips" id="katalog" role="group" aria-label="Kategori">'+cats.map(c=>'<button class="sg'+(S.cat===c?' on':'')+'" data-cat="'+esc(c)+'" aria-pressed="'+(S.cat===c)+'">'+esc(c)+'</button>').join('')+'</div>'+
  (shown.length?'<div class="mgrid">'+shown.map(p=>{const st=stockOf(p.kode),qq=S.cart[p.kode]||0,c=catInfo(p.cat).warna;
    return '<article class="mc'+(st>0?'':' habis')+'"><div class="ph b-'+c+'">'+promoBadge(p)+(p.img?'<img src="'+esc(p.img)+'" alt="'+esc(p.name)+'">':prodTile(p,true))+(st>0?'':'<span class="stamp" aria-hidden="true">HABIS</span>')+'</div><div class="nm">'+esc(p.name)+'</div><div class="st">'+(st>0?'Sisa '+st+' '+esc(p.unit||''):'Stok habis')+'</div><div class="qty">'+priceTag(p)+stepper(p.kode,qq,st,p.name)+'</div></article>'}).join('')+'</div>'
    :'<div class="card empty">'+(q?'Tidak ada produk bernama "'+esc(S.q)+'".':'Belum ada produk yang dijual online.')+'</div>')+
  infoFooter()+'</div>';
}
function vKeranjang(){
  if(!slots().includes(S.co.slot))S.co.slot=defSlot();
  {const pl=pays('online').map(b=>b.kode);if(!pl.includes(S.co.pay))S.co.pay=pl[0]||''}
  const lines=cartLines(S.cart,S.pub),hp=priceFor(lines,'co'),total=hp.total,cnt=sum(lines,l=>l.qty),reg=S.reg;
  let h=shopHead('Keranjang',cnt?cnt+' item':'Masih kosong',cnt?'<button class="btn3" data-act="clearCart">Kosongkan</button>':'');
  if(!lines.length)return h+'<div class="card empty stack" style="align-items:center;gap:12px"><span class="tile t-pink" style="width:58px;height:58px;border-radius:18px">'+ic('bag',26)+'</span><span>Belum ada barang di keranjang.</span><button class="btn" data-go="toko">Mulai belanja</button></div>';
  h+='<div class="stack" style="gap:12px"><div class="card" style="padding:6px 14px">'+hp.items.map(l=>{const p=prod(l.kode);return '<div class="li" style="padding:10px 0"><span style="display:flex;align-items:center;gap:10px;min-width:0">'+(p?prodTile(p):'')+'<span style="min-width:0"><b style="font-size:13px">'+esc(l.name)+'</b><br><small class="num" style="color:var(--muted)">'+(l.bonus?'<span style="color:var(--ok);font-weight:700">Gratis</span>':rp(l.price))+(l.normal>l.price?' <s>'+rp(l.normal)+'</s>':'')+'</small></span></span>'+(l.bonus?'<span class="pill-s ps-ok">Bonus '+l.qty+'× · Gratis</span>':stepper(l.kode,l.qty,stockOf(l.kode),l.name))+'</div>'}).join('')+'</div>';
  h+='<form id="coForm" class="stack" style="gap:12px">'+
   '<div class="card stack" style="gap:12px;padding:16px"><h3 style="font-size:15px">Data pemesan</h3><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">'+
    '<label class="f">Nama<input class="in" id="co-name" data-bind="co.name" list="custList" required autocomplete="name" value="'+esc(S.co.name)+'" placeholder="Nama kamu"></label>'+
    '<label class="f">Bagian / line<input class="in" id="co-line" data-bind="co.line" list="bagianList" value="'+esc(S.co.line)+'" placeholder="Painting L1"></label></div>'+dl('bagianList',bagianList())+
    '<datalist id="custList">'+S.customers.map(c=>'<option value="'+esc(c.name)+'">').join('')+'</datalist></div>'+
   '<div class="card stack" style="gap:10px;padding:16px"><h3 style="font-size:15px">Waktu ambil</h3><div class="seg">'+slots().map(s=>'<button type="button" class="sg'+(S.co.slot===s?' on':'')+'" data-coslot="'+esc(s)+'" aria-pressed="'+(S.co.slot===s)+'">'+esc(s)+'</button>').join('')+'</div><small style="color:var(--muted)">Ambil di '+esc(M().toko.lokasi)+'.</small></div>'+
   '<div class="card stack" style="gap:10px;padding:16px"><h3 style="font-size:15px">Pembayaran</h3><div class="seg" role="radiogroup" aria-label="Pembayaran">'+pays('online').map(b=>b.kode).map(m=>'<button type="button" class="sg'+(S.co.pay===m?' on':'')+'" role="radio" aria-checked="'+(S.co.pay===m)+'" data-copay="'+esc(m)+'"'+(m==='Kasbon'&&!reg?' disabled':'')+'>'+esc(payLabel(m))+'</button>').join('')+'</div>'+
    (S.co.pay==='Kasbon'&&!reg?'<small style="color:var(--bad)">'+esc(payLabel('Kasbon'))+' khusus pelanggan terdaftar.</small>':'<small style="color:var(--muted)">'+(payInfo(S.co.pay).ket?esc(payInfo(S.co.pay).ket):S.co.pay==='QRIS'?'QRIS dengan nominal otomatis muncul setelah kamu pesan.':S.co.pay==='Kasbon'?'Dicatat sebagai kasbon, ditagih saat gajian.':reg?'Bayar saat ambil barang.':'Bayar saat ambil barang. Bayar pas gajian khusus pelanggan terdaftar.')+'</small>')+'</div>'+
   '<label class="f">Catatan<input class="in" id="co-note" data-bind="co.note" value="'+esc(S.co.note)+'" placeholder="Opsional, misal: tanpa sendok"></label>'+
   promoHint(hp)+'<div class="card stack" style="gap:10px;padding:16px"><h3 style="font-size:15px">Voucher</h3>'+voucherBox('co',hp)+'</div>'+
   '<div class="card stack" style="gap:6px;padding:16px">'+sumRows(hp)+'<div class="li" style="border:0;padding:2px 0"><span style="color:var(--muted)">Ambil di tempat</span><span style="color:var(--ok);font-weight:700">Gratis</span></div><div class="tot"><span>Total</span><span class="num">'+rp(total)+'</span></div></div>'+
   '<button class="btn" type="submit" style="height:52px"'+(S.busy?' disabled':'')+'>Pesan sekarang · '+rp(total)+'</button><small style="color:var(--muted);text-align:center;font-size:12px">Dengan memesan, kamu menyetujui <a href="#syarat">Syarat &amp; Ketentuan</a> dan <a href="#refund">Kebijakan Refund</a> KAmart.</small></form></div>';
  return h;
}
function queueOrders(){return S.queue.slice()}
function isMine(o){return S.mine.some(m=>m.id===o.id)}
function findOrder(id){return S.mine.find(o=>o.id===id)||S.orders.find(o=>o.id===id)}
function vPesananku(){
  let h=shopHead('Antrian Pesanan','Pesanan yang sedang diproses','<button class="btn3" data-act="refresh"'+(S.refreshing?' disabled':'')+'>'+(S.refreshing?'Memuat…':'↻ Perbarui')+'</button>');
  if(loading())return h+'<div class="card empty">Memuat antrian…</div>';
  const q=queueOrders();
  h+='<div class="stack" style="gap:12px"><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">'+[0,1,2].map(i=>'<div class="stat '+['b-lav','b-pink','b-gold'][i]+'" style="padding:10px 12px;gap:0"><span class="vl num" style="font-size:20px">'+q.filter(o=>o.stage===i).length+'</span><span class="sm" style="font-size:11px">'+STAGES[i]+'</span></div>').join('')+'</div>';
  if(!q.length)h+='<div class="card empty stack" style="align-items:center;gap:12px"><span>Tidak ada pesanan yang sedang diproses.</span><button class="btn" data-go="toko">Mulai belanja</button></div>';
  h+=q.map(o=>{const me=isMine(o),m=me?(findOrder(o.id)||o):o;
    return '<article class="card stack" style="gap:8px;padding:14px 16px'+(me?';border:2px solid var(--primary)':'')+'">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span style="display:flex;align-items:center;gap:10px;min-width:0"><span class="av" style="background:'+avc(o.customerName)+'">'+esc((String(o.customerName)[0]||'?').toUpperCase())+'</span><span style="min-width:0"><b style="font-size:14px">'+esc(o.customerName)+'</b>'+(me?' <span class="pill-s ps-lav">Pesanan kamu</span>':'')+'<br><small style="color:var(--muted)">'+(me&&m.code?esc(m.code)+' · ':'')+esc(o.slot||'')+'</small></span></span><span class="pill-s '+stagePill(o.stage)+'">'+STAGES[o.stage]+'</span></div>'+
    '<div class="steps" role="img" aria-label="Tahap '+(o.stage+1)+' dari 4">'+STAGES.map((s,i)=>'<i'+(i<=o.stage?' class="on"':'')+'></i>').join('')+'</div>'+
    '<div style="font-size:13px">'+esc(itemsText(o))+'</div>'+
    (me&&o.stage===2?'<div class="banner b-lav" style="font-weight:600">Siap diambil! Tunjukkan kode '+esc(m.code||'')+'.</div>':'')+
    (me?'<div style="display:flex;gap:6px;flex-wrap:wrap">'+(m.pay==='QRIS'&&!m.paid?'<button class="btn3" data-qrisfor="'+esc(o.id)+'">Bayar QRIS</button>':'')+'<button class="btn3" data-receipt="'+esc(o.id)+'">Unduh struk</button></div>':'')+'</article>'}).join('');
  return h+'</div>';
}
function vAkun(){
  const name=S.co.name.trim(),c=S.reg,mine=acctOrders(name),kb=sum(mine.filter(o=>o.pay==='Kasbon'&&!o.paid),o=>+o.total||0);
  return shopHead('Akun','Dipakai otomatis saat memesan')+'<div class="stack" style="gap:12px">'+
  '<div class="card" style="display:flex;align-items:center;gap:14px;padding:16px"><span class="av" style="width:54px;height:54px;font-size:20px;background:'+avc(name||'?')+'">'+esc((name[0]||'?').toUpperCase())+'</span><span style="min-width:0;flex:1;display:flex;flex-direction:column;gap:4px;align-items:flex-start"><b style="font-size:16px">'+(name?esc(name):'Tamu')+'</b><span class="pill-s '+(c?'ps-ok':'ps-lav')+'">'+(c?'Pelanggan terdaftar':'Belum terdaftar')+'</span></span></div>'+
  '<div class="card stack" style="gap:12px;padding:16px"><label class="f">Nama<input class="in" id="ak-name" data-bind="co.name" list="custList2" autocomplete="name" value="'+esc(S.co.name)+'" placeholder="Nama kamu"></label><datalist id="custList2">'+S.customers.map(x=>'<option value="'+esc(x.name)+'">').join('')+'</datalist>'+
   '<label class="f">Bagian / line<input class="in" id="ak-line" data-bind="co.line" list="bagianList2" value="'+esc(S.co.line)+'" placeholder="Contoh: Painting L1"></label>'+dl('bagianList2',bagianList())+
   '<small style="color:var(--muted)">'+(c?'Kamu bisa memakai Bayar pas gajian.':'Bayar pas gajian hanya untuk pelanggan terdaftar. Minta penjual mendaftarkan namamu.')+'</small></div>'+
  '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px"><div class="stat b-lav" style="padding:14px"><span class="lb">'+(name?'Total pesanan':'Pesanan di HP ini')+'</span><span class="vl num" style="font-size:20px">'+mine.length+'</span></div><div class="stat b-gold" style="padding:14px"><span class="lb">Kasbon</span><span class="vl num" style="font-size:20px">'+rp(kb)+'</span></div></div>'+
  installCard()+'<div class="card stack" style="gap:4px;font-size:13px;padding:16px"><b>Info ambil pesanan</b><span style="color:var(--muted)">Ambil di '+esc(M().toko.lokasi)+' sesuai jam yang dipilih. Order tutup '+(+M().toko.tutup||0)+' menit sebelum jam ambil.</span></div>'+
  '<div class="card stack" style="gap:2px;padding:8px 16px"><b style="padding:8px 0 4px">Informasi toko</b>'+INFO_PAGES.map(([id,t])=>'<button class="li linkrow" data-go="'+id+'"><span>'+t+'</span><span aria-hidden="true">›</span></button>').join('')+'</div>'+
  panduanCard('pembeli')+'<button class="btn2" data-go="dashboard" style="justify-content:center;height:46px">Masuk admin</button></div>';
}
/* ---------- Promo (admin) ---------- */
const toLocalInput=iso=>{if(!iso)return '';const d=new Date(iso),z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'T'+z(d.getHours())+':'+z(d.getMinutes())};
function promoStatus(p){const now=new Date();if(p.aktif===false)return['Nonaktif','ps-lav'];if(p.mulai&&now<new Date(p.mulai))return['Terjadwal','ps-blue'];if(p.selesai&&now>new Date(p.selesai))return['Berakhir','ps-bad'];return['Aktif','ps-ok']}
function promoUsage(p){
  if(p.tipe==='produk'){const hit=i=>i.kode===p.kode&&+i.normal>+i.price&&(!i.promoId||i.promoId===p.id);const os=valid().filter(o=>(o.items||[]).some(hit));return{n:os.length,total:sum(os,o=>sum((o.items||[]).filter(hit),i=>(+i.normal-+i.price)*(+i.qty||0)))}}
  if(p.tipe==='bonus'){const hit=i=>i.bonus&&i.promoId===p.id;const os=valid().filter(o=>(o.items||[]).some(hit));return{n:os.length,total:sum(os,o=>sum((o.items||[]).filter(hit),i=>(+i.normal||0)*(+i.qty||0)))}}
  const os=valid().filter(o=>(o.diskon||[]).some(d=>d.id===p.id));return{n:os.length,total:sum(os,o=>sum((o.diskon||[]).filter(d=>d.id===p.id),d=>+d.nilai||0))}}
function newPromo(tipe){const k=(sortedProducts()[0]||{}).kode||'';return{_edit:false,id:uid('pr'),tipe:tipe||'produk',nama:'',aktif:true,banner:(tipe||'produk')!=='voucher',bonusKode:(sortedProducts()[1]||sortedProducts()[0]||{}).kode||'',bonusQty:1,kelipatan:true,mulai:'',selesai:'',kode:k,harga:'',mode:'harga',qty:3,gratis:1,jenis:'nominal',nilai:'',maks:'',minBelanja:'',kuota:'',voucher:''}}
function vPromo(){
  if(loading())return '<div class="card empty">Memuat promo…</div>';
  const f=S.prf,list=(S.promos||[]).slice().sort((a,b)=>{const o={Aktif:0,Terjadwal:1,Nonaktif:2,Berakhir:3};return o[promoStatus(a)[0]]-o[promoStatus(b)[0]]||String(a.nama).localeCompare(String(b.nama))});
  const inp=(key,label,type,extra)=>'<label class="f">'+label+'<input class="in'+(type==='number'?' num':'')+'" id="pr-'+key+'" type="'+(type||'text')+'"'+(type==='number'?' min="0" inputmode="numeric"':'')+' data-bind="prf.'+key+'" value="'+esc(f[key]==null?'':f[key])+'"'+(extra||'')+'></label>';
  const sel=(key,label,opts,live)=>'<label class="f">'+label+'<select class="in" id="pr-'+key+'" data-bind="prf.'+key+'"'+(live?' data-live="1"':'')+'>'+opts.map(([v,t])=>'<option value="'+esc(v)+'"'+(String(f[key])===String(v)?' selected':'')+'>'+esc(t)+'</option>').join('')+'</select></label>';
  const prodOpts=sortedProducts().map(p=>[p.kode,p.name+' · '+rp(p.jual)]);
  const jenis=()=>sel('jenis','Jenis potongan',[['nominal','Rupiah (Rp)'],['persen','Persen (%)']],true)+inp('nilai',f.jenis==='persen'?'Potongan (%)':'Potongan (Rp)','number',' required')+(f.jenis==='persen'?inp('maks','Maksimal potongan (Rp, 0 = tanpa batas)','number'):'');
  let form='';
  if(f){const pr=prod(f.kode)||{};let body='';
    if(f.tipe==='produk')body=sel('kode','Produk',prodOpts,true)+inp('harga','Harga promo (normal '+rp(pr.jual||0)+')','number',' required');
    else if(f.tipe==='bundling')body=sel('kode','Produk',prodOpts,true)+sel('mode','Bentuk',[['harga','Beli X harga khusus'],['gratis','Beli X gratis Y']],true)+inp('qty','Beli (X)','number',' required')+
      (f.mode==='gratis'?inp('gratis','Gratis (Y)','number',' required'):inp('harga','Harga untuk X item (normal '+rp((pr.jual||0)*(+f.qty||0))+')','number',' required'));
    else if(f.tipe==='bonus'){const y=prod(f.bonusKode)||{};body=sel('kode','Produk yang dibeli (X)',prodOpts,true)+inp('qty','Jumlah beli minimal','number',' required')+sel('bonusKode','Produk bonus (Y)',prodOpts,true)+inp('bonusQty','Jumlah bonus','number',' required')+
      '<label class="f" style="flex-direction:row;align-items:center;gap:8px;align-self:end;height:44px"><input type="checkbox" id="pr-kelipatan" data-bind="prf.kelipatan"'+(f.kelipatan!==false?' checked':'')+'> Berlaku kelipatan (beli '+((+f.qty||1)*2)+' dapat '+((+f.bonusQty||1)*2)+')</label>'+
      (y.name?'<small style="color:var(--muted);grid-column:1/-1">Bonus '+esc(y.name)+' senilai '+rp((+y.jual||0)*(+f.bonusQty||1))+', stok sisa '+stockOf(f.bonusKode)+'.</small>':'')}
    else if(f.tipe==='minimal')body=inp('minBelanja','Minimal belanja (Rp)','number',' required')+jenis();
    else body=inp('voucher','Kode voucher','text',' required maxlength="20" style="text-transform:uppercase"')+jenis()+inp('minBelanja','Minimal belanja (Rp, opsional)','number')+inp('kuota','Kuota pemakaian (0 = tanpa batas)','number');
    form='<form id="prForm" class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>'+(f._edit?'Ubah promo':'Promo baru')+'</h3><p>'+esc(PTIPE[f.tipe])+'</p></div><button type="button" class="btn3" data-act="prclose">Tutup</button></div>'+
      '<div class="fg">'+(f._edit?'':sel('tipe','Jenis promo',Object.entries(PTIPE),true))+inp('nama','Nama promo','text',' required maxlength="60" placeholder="Contoh: Promo gajian"')+body+
      '<label class="f">Mulai (opsional)<input class="in" type="datetime-local" id="pr-mulai" data-bind="prf.mulai" value="'+esc(f.mulai)+'"></label><label class="f">Selesai (opsional)<input class="in" type="datetime-local" id="pr-selesai" data-bind="prf.selesai" value="'+esc(f.selesai)+'"></label>'+
      '<label class="f" style="flex-direction:row;align-items:center;gap:8px;align-self:end;height:44px"><input type="checkbox" id="pr-aktif" data-bind="prf.aktif"'+(f.aktif!==false?' checked':'')+'> Aktif</label>'+
      '<label class="f" style="flex-direction:row;align-items:center;gap:8px;align-self:end;height:44px"><input type="checkbox" id="pr-banner" data-bind="prf.banner"'+(f.banner?' checked':'')+'> Tampilkan di banner aplikasi'+(f.tipe==='voucher'?' (kode jadi publik)':'')+'</label></div>'+
      '<small style="color:var(--muted)">'+({produk:'Harga produk turun selama promo, tampil dengan harga coret di toko dan kasir.',bundling:'Contoh: beli 3 jadi Rp15.000, atau beli 5 gratis 1 (setiap 6 item, 1 gratis).',bonus:'Contoh: beli 2 Pop Mie gratis 1 kopi. Bonus otomatis masuk pesanan dengan harga Rp0 dan mengurangi stok. Jika stok bonus habis, bonus dilewati.',minimal:'Otomatis dipotong saat total belanja mencapai minimal. Jika ada beberapa, dipakai yang paling hemat.',voucher:'Pembeli mengetik kode di keranjang. Kasir juga bisa memakai kode. Pesanan batal tidak mengurangi kuota.'})[f.tipe]+'</small>'+
      '<div style="display:flex;gap:8px"><button class="btn" type="submit"'+(S.busy?' disabled':'')+'>'+(S.busy?'Menyimpan…':'Simpan promo')+'</button></div></form>'}
  const live=list.filter(p=>promoAktif(p,new Date()));
  return '<div class="stack">'+(form||'<div style="display:flex;gap:8px;flex-wrap:wrap">'+Object.entries(PTIPE).map(([t,l])=>'<button class="'+(t==='produk'?'btn':'btn2')+'" data-prnew="'+t+'">'+ic('plus',16,2.4)+l+'</button>').join('')+'</div>')+
   (!form&&live.length>1?'<div class="banner b-lav" style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap"><span><b>Poster semua promo aktif</b><br><small style="color:var(--muted)">'+live.length+' promo dalam satu poster untuk Status WA atau grup.</small></span><button class="btn" data-prposterall="1">Buat poster</button></div>':'')+
   (list.length?'<div class="card" style="padding:4px 16px">'+list.map(p=>{const[st,cl]=promoStatus(p),u=promoUsage(p),cf=S.prdel===p.id;
     return '<div class="prow"><div class="stack" style="gap:4px;min-width:0;flex:1"><span style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><b>'+esc(p.nama)+'</b><span class="mtag">'+esc(PTIPE[p.tipe]||p.tipe)+'</span><span class="pill-s '+cl+'">'+st+'</span></span>'+
       '<small>'+esc(promoDesc(p))+'</small><small style="color:var(--muted)">'+(p.mulai||p.selesai?(p.mulai?dLabel(p.mulai):'Sekarang')+' – '+(p.selesai?dLabel(p.selesai):'tanpa batas'):'Tanpa batas waktu')+' · dipakai '+u.n+'× · total potongan '+rp(u.total)+(p.tipe==='voucher'&&+p.kuota?' · sisa kuota '+Math.max(0,p.kuota-u.n):'')+'</small></div>'+
       '<div class="prow-act"><button class="btn3" data-prposter="'+esc(p.id)+'">Poster</button><button class="btn3" data-predit="'+esc(p.id)+'">Ubah</button><button class="btn3" data-prtoggle="'+esc(p.id)+'">'+(p.aktif===false?'Aktifkan':'Matikan')+'</button>'+(cf?'<button class="btn3 dang" data-prdelok="'+esc(p.id)+'">Ya, hapus</button>':'<button class="btn3 dang" data-prdel="'+esc(p.id)+'">Hapus</button>')+'</div></div>'}).join('')+'</div>'
    :'<div class="card empty">Belum ada promo. Pilih jenis promo di atas untuk membuat.</div>')+'</div>';
}
function promoBody(f){
  const n=v=>Math.max(0,Math.round(+v||0)),b={tipe:f.tipe,nama:String(f.nama||'').trim(),aktif:f.aktif!==false,banner:!!f.banner,mulai:f.mulai?new Date(f.mulai).toISOString():null,selesai:f.selesai?new Date(f.selesai).toISOString():null};
  if(!b.nama)throw new Error('Nama promo wajib diisi.');
  if(b.mulai&&b.selesai&&b.selesai<b.mulai)throw new Error('Tanggal selesai harus setelah tanggal mulai.');
  const disk=()=>{b.jenis=f.jenis==='persen'?'persen':'nominal';b.nilai=Math.min(n(f.nilai),b.jenis==='persen'?100:1e7);if(!b.nilai)throw new Error('Isi besar potongan.');b.maks=b.jenis==='persen'?n(f.maks):0;b.minBelanja=n(f.minBelanja)};
  if(f.tipe==='produk'||f.tipe==='bundling'||f.tipe==='bonus'){if(!prod(f.kode))throw new Error('Pilih produk.');b.kode=f.kode}
  if(f.tipe==='bonus'){if(!prod(f.bonusKode))throw new Error('Pilih produk bonus.');b.bonusKode=f.bonusKode;b.qty=Math.max(1,n(f.qty));b.bonusQty=Math.max(1,n(f.bonusQty));b.kelipatan=f.kelipatan!==false}
  if(f.tipe==='produk'){b.harga=n(f.harga);if(b.harga>=(+prod(f.kode).jual||0))throw new Error('Harga promo harus lebih murah dari harga normal.')}
  else if(f.tipe==='bundling'){b.mode=f.mode==='gratis'?'gratis':'harga';b.qty=Math.max(1,n(f.qty));if(b.mode==='gratis'){b.gratis=Math.max(1,n(f.gratis));b.harga=0}else{b.harga=n(f.harga);b.gratis=0;if(b.qty<2)throw new Error('Harga khusus minimal untuk 2 item.')}}
  else if(f.tipe==='bonus'){/* sudah diisi di atas */}
  else if(f.tipe==='minimal'){disk();if(!b.minBelanja)throw new Error('Isi minimal belanja.')}
  else{b.voucher=String(f.voucher||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,20);if(b.voucher.length<3)throw new Error('Kode voucher minimal 3 huruf/angka.');
    if((S.promos||[]).some(p=>p.id!==f.id&&p.tipe==='voucher'&&p.voucher===b.voucher))throw new Error('Kode '+b.voucher+' sudah dipakai promo lain.');disk();b.kuota=n(f.kuota)}
  return b}
async function savePromoDoc(id,body){await run(api('PUT','/api/admin/promos/'+encodeURIComponent(id),body,true));await loadAdmin()}
async function deletePromoDoc(id){await run(api('DELETE','/api/admin/promos/'+encodeURIComponent(id),null,true));await loadAdmin()}
async function savePromo(){const f=S.prf;let b;try{b=promoBody(f)}catch(e){toast(e.message);return}
  S.busy=true;render();try{await savePromoDoc(f.id,b);S.prf=null;toast('Promo tersimpan')}catch(e){}S.busy=false;render()}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-prnew],[data-predit],[data-prtoggle],[data-prdel],[data-prdelok],[data-act="prclose"]');if(!t)return;const d=t.dataset;
  if(d.act==='prclose'){S.prf=null;render();return}
  if(d.prnew){S.prf=newPromo(d.prnew);render();window.scrollTo({top:0});return}
  const p=(S.promos||[]).find(x=>x.id===(d.predit||d.prtoggle||d.prdel||d.prdelok));if(!p)return;
  if(d.predit){S.prf=Object.assign(newPromo(p.tipe),p,{_edit:true,mulai:toLocalInput(p.mulai),selesai:toLocalInput(p.selesai)});['dipakai','totalPotongan'].forEach(k=>delete S.prf[k]);render();window.scrollTo({top:0});return}
  if(d.prtoggle){const b=Object.assign({},p,{aktif:p.aktif===false});['id','dipakai','totalPotongan'].forEach(k=>delete b[k]);try{await savePromoDoc(p.id,b);toast(b.aktif?'Promo diaktifkan':'Promo dimatikan')}catch(err){}render();return}
  if(d.prdel){S.prdel=p.id;render();return}
  if(d.prdelok){S.prdel=null;try{await deletePromoDoc(p.id);toast('Promo dihapus')}catch(err){}render()}});

/* Kolom angka yang ikut menggambar ulang halaman memakai type=text (inputmode numeric) supaya kursor tidak lompat. Hanya angka yang diterima. */
document.addEventListener('input',e=>{const t=e.target;if(!t||!t.dataset||!t.dataset.num)return;const v=t.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'').slice(0,12);if(v!==t.value){const pos=Math.max(0,(t.selectionStart||v.length)-(t.value.length-v.length));t.value=v;try{t.setSelectionRange(pos,pos)}catch(err){}}},true);
/* ---------- Banner promo (toko) & poster (admin) ---------- */
const SITE=()=>window.KAMART_SITE||'https://kamart-liart.vercel.app';
function promoHead(p){const pr=prod(p.kode)||{},nm=pr.name||p.kode||'';
  if(p.tipe==='produk')return{k:'HARGA SPESIAL',t:nm,big:rp(p.harga),s:pr.jual?rp(pr.jual):'',strike:true,img:pr.img||'',cat:pr.cat,prod:true,save:pr.jual?'Hemat '+rp(pr.jual-p.harga)+' per '+(pr.unit||'item'):''};
  if(p.tipe==='bundling')return{k:'PAKET HEMAT',t:nm,big:p.mode==='gratis'?'Beli '+p.qty+' gratis '+p.gratis:p.qty+' pcs '+rp(p.harga),s:p.mode==='gratis'?'':(pr.jual?rp(pr.jual*p.qty):''),strike:p.mode!=='gratis',img:pr.img||'',cat:pr.cat,prod:true,
    save:pr.jual?(p.mode==='gratis'?'Hemat '+rp(pr.jual*p.gratis)+' tiap '+(+p.qty+ +p.gratis)+' item':'Hemat '+rp(pr.jual*p.qty-p.harga)):''};
  if(p.tipe==='bonus'){const yb=prod(p.bonusKode)||{};return{k:'GRATIS BONUS',t:'Beli '+p.qty+' '+nm,big:'Gratis '+p.bonusQty+' '+(yb.name||p.bonusKode),s:p.kelipatan===false?'':'Berlaku kelipatan',img:pr.img||'',cat:pr.cat,prod:true,save:yb.jual?'Senilai '+rp(yb.jual*p.bonusQty):''}}
  if(p.tipe==='minimal')return{k:'HEMAT BELANJA',t:'Belanja min '+rp(p.minBelanja),big:'Hemat '+potTxt(p),s:'Otomatis terpotong di keranjang',hint:'Tanpa kode, langsung terpotong saat total belanja cukup.'};
  return{k:'VOUCHER',t:'Pakai kode',big:p.voucher,s:'Hemat '+potTxt(p)+(+p.minBelanja?' · min belanja '+rp(p.minBelanja):''),code:true,hint:'Ketik kode ini di kolom Voucher pada keranjang'+(+p.kuota?'. Kuota terbatas!':'.')}}
function promoPeriod(p){const f=d=>new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'short'}),now=new Date();
  if(p.mulai&&new Date(p.mulai)>now)return 'Mulai '+f(p.mulai)+(p.selesai?' s/d '+f(p.selesai):'');
  return p.selesai?'Berlaku s/d '+f(p.selesai):'Berlaku selama persediaan ada'}
const bannerPromos=()=>actPromos().filter(p=>p.banner!==false&&(p.tipe!=='voucher'||p.banner===true));
const BCOL=['pink','blue','gold','mint','lav'];
function bannerHtml(hero){const a=bannerPromos();if(!a.length)return hero;
  const slides=a.map((p,i)=>{const h=promoHead(p);
    const act=h.prod?'<button class="bs-btn" data-bprod="'+esc(p.kode)+'">Lihat produk</button>':h.code?'<button class="bs-btn" data-bvouch="'+esc(p.voucher)+'">Pakai kode</button>':'<button class="bs-btn" data-bgo="katalog">Belanja sekarang</button>';
    const pic=h.prod?(h.img?'<img class="bs-img" src="'+esc(h.img)+'" alt="">':'<span class="bs-img bs-ph">'+prodTile(prod(p.kode)||{cat:h.cat},true)+'</span>'):'<span class="bs-img bs-ph"><span class="bs-emo">'+(h.code?'%':'Rp')+'</span></span>';
    return '<div class="bsl bs-'+BCOL[i%BCOL.length]+'" role="group" aria-roledescription="slide" aria-label="Promo '+(i+1)+' dari '+a.length+'"><div class="bs-txt"><span class="bs-k">'+esc(h.k)+'</span><b class="bs-t">'+esc(h.t)+'</b><span class="bs-big">'+esc(h.big)+(h.s&&h.strike?' <s>'+esc(h.s)+'</s>':'')+'</span>'+(h.s&&!h.strike?'<span class="bs-s">'+esc(h.s)+'</span>':'')+'<span class="bs-p">'+esc(promoPeriod(p))+'</span>'+act+'</div>'+pic+'</div>'}).join('');
  const n=a.length+1;
  return '<div class="bcar" aria-label="Promo"><div class="btrack" id="btrack">'+slides+'<div class="bsl bs-hero">'+hero+'</div></div><div class="bdots">'+Array.from({length:n},(_,i)=>'<button class="bdot'+(i===(S.bIdx||0)?' on':'')+'" data-bdot="'+i+'" aria-label="Slide '+(i+1)+'"></button>').join('')+'</div></div>'}
function restoreBanner(){const t=document.getElementById('btrack');if(!t)return;const i=Math.min(S.bIdx||0,t.children.length-1);if(i>0)t.scrollLeft=i*t.clientWidth}
document.addEventListener('scroll',e=>{const t=e.target;if(!t||t.id!=='btrack')return;const i=Math.round(t.scrollLeft/Math.max(1,t.clientWidth));if(i!==S.bIdx){S.bIdx=i;document.querySelectorAll('.bdot').forEach((d,j)=>d.classList.toggle('on',j===i))}},true);
setInterval(()=>{const t=document.getElementById('btrack');if(!t||document.hidden||t.matches(':hover'))return;const n=t.children.length,i=((S.bIdx||0)+1)%n;t.scrollTo({left:i*t.clientWidth,behavior:'smooth'})},6000);

function posterImgSrc(p,h){return h.img&&!/^(data|blob):/.test(h.img)?API+'/api/products/'+encodeURIComponent(p.kode)+'/photo?v='+encodeURIComponent(h.img.slice(-24)):h.img}
function loadImg(src){return new Promise(res=>{if(!src)return res(null);const i=new Image();try{if(!/^(data|blob):/.test(src)&&new URL(src,location.href).origin!==location.origin)i.crossOrigin='anonymous'}catch(e){}i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src})}
async function posterPng(list,fmt){
  const sq=fmt==='square',W=1080,H=sq?1080:1920,F="'Poppins',system-ui,sans-serif";
  try{await document.fonts.ready}catch(e){}
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
  const rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
  const font=(w,sz)=>{g.font=w+' '+sz+'px '+F};
  const wrap=(t,max)=>{const out=[];let cur='';String(t).split(' ').forEach(w=>{const tt=cur?cur+' '+w:w;if(g.measureText(tt).width>max&&cur){out.push(cur);cur=w}else cur=tt});if(cur)out.push(cur);return out};
  const fit=(t,w,sz,min,max)=>{font(w,sz);while(sz>min&&g.measureText(t).width>max){sz-=4;font(w,sz)}return sz};
  const bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#8E78E6');bg.addColorStop(1,'#4B37A3');g.fillStyle=bg;g.fillRect(0,0,W,H);
  g.globalAlpha=.16;g.fillStyle='#FFC7DC';g.beginPath();g.arc(W-40,sq?120:180,sq?220:320,0,7);g.fill();g.fillStyle='#BDEBD5';g.beginPath();g.arc(60,H-(sq?120:260),sq?240:360,0,7);g.fill();g.globalAlpha=1;
  const M=sq?56:80;let y=sq?52:100;const LS=sq?92:128;
  const lg=await logoImg();if(lg){g.save();g.beginPath();g.arc(M+LS/2,y+LS/2,LS/2,0,7);g.clip();g.drawImage(lg,M,y,LS,LS);g.restore()}
  g.fillStyle='#fff';font('800',sq?50:66);g.fillText('KAmart',M+LS+26,y+(sq?44:58));
  {const tw0=W-M-(M+LS+28);g.fillStyle='#EDE7FF';font('500',sq?22:28);g.fillText(fitText(g,'Toko kelontong online',tw0),M+LS+28,y+(sq?74:96));g.fillText(fitText(g,'Ambil saat istirahat, awal masuk, pulang kerja',tw0),M+LS+28,y+(sq?102:132))}
  y+=LS+(sq?30:60);
  g.fillStyle='#FFE27A';font('900',sq?96:150);g.fillText('PROMO',M,y+(sq?84:130));
  font('900',sq?96:150);const pw=g.measureText('PROMO').width,sub=list.length>1?list.length+' promo spesial':'spesial buat kamu';g.fillStyle='#fff';fit(sub,'700',sq?30:40,20,W-M-(M+pw+24));g.fillText(sub,M+pw+24,y+(sq?78:120));
  y+=sq?112:170;
  const footH=sq?196:300,cardY=y,cardH=H-y-footH-(sq?24:50),cx=M+(sq?40:56),cw=W-2*M-2*(sq?40:56);
  g.save();g.shadowColor='rgba(30,10,80,.35)';g.shadowBlur=40;g.shadowOffsetY=16;rr(M,cardY,W-2*M,cardH,sq?40:56);g.fillStyle='#fff';g.fill();g.restore();
  let cy=cardY+(sq?40:70);
  const pill=(t,x,yy,bgc,fc,sz)=>{font('800',sz);const w=g.measureText(t).width+sz*1.4,h=sz*1.9;rr(x,yy,w,h,h/2);g.fillStyle=bgc;g.fill();g.fillStyle=fc;g.fillText(t,x+sz*0.7,yy+sz*1.32);return w};
  if(list.length===1){const p=list[0],h=promoHead(p);
    pill(h.k,cx,cy,'#E24B6B','#fff',sq?26:34);cy+=sq?76:110;
    let tw=cw;const imgS=sq?250:420;
    if(h.prod){const im=await loadImg(posterImgSrc(p,h)),ix=cx+cw-imgS,iy=cy-(sq?6:10);
      g.save();rr(ix,iy,imgS,imgS,sq?36:48);g.clip();
      if(im){const k=Math.max(imgS/im.width,imgS/im.height);g.drawImage(im,ix+(imgS-im.width*k)/2,iy+(imgS-im.height*k)/2,im.width*k,im.height*k)}
      else{const col={pink:'#F7BFD2',blue:'#BCD0F7',gold:'#F7DA92',lav:'#D9CDF6',mint:'#BFE9D4'}[catInfo(h.cat).warna]||'#D9CDF6';g.fillStyle=col;g.fillRect(ix,iy,imgS,imgS);g.fillStyle='rgba(255,255,255,.75)';font('800',imgS*.42);g.textAlign='center';g.fillText((h.t||'?')[0].toUpperCase(),ix+imgS/2,iy+imgS*.64);g.textAlign='left'}
      g.restore();tw=cw-imgS-(sq?24:36)}
    font('800',sq?48:66);const tl=wrap(h.t,tw).slice(0,3);g.fillStyle='#2B2140';tl.forEach(l=>{g.fillText(l,cx,cy+(sq?44:60));cy+=sq?58:80});
    if(h.prod)cy=Math.max(cy+(sq?10:20),cardY+(sq?40:70)+(sq?76:110)+imgS+(sq?14:30));else cy+=sq?20:40;
    if(h.code){const bh=sq?120:170;g.save();g.setLineDash([16,12]);g.lineWidth=5;g.strokeStyle='#7A66D0';rr(cx,cy,cw,bh,28);g.stroke();g.restore();g.fillStyle='#F2EDFF';rr(cx+6,cy+6,cw-12,bh-12,24);g.fill();
      const sz=fit(h.big,'900',sq?84:120,40,cw-60);g.fillStyle='#5B47B0';g.textAlign='center';g.fillText(h.big,cx+cw/2,cy+bh/2+sz*.36);g.textAlign='left';cy+=bh+(sq?44:60)}
    else{const sz=fit(h.big,'900',sq?96:140,44,cw);g.fillStyle='#E24B6B';g.fillText(h.big,cx,cy+sz*.82);cy+=sz+(sq?10:20)}
    if(h.s){font(h.strike?'600':'600',sq?32:44);g.fillStyle='#7C7191';const t=h.strike?'Normal '+h.s:h.s;const ln=wrap(t,cw).slice(0,2);ln.forEach(l=>{g.fillText(l,cx,cy+(sq?30:40));if(h.strike){const w=g.measureText(l).width,x0=cx+g.measureText('Normal ').width;g.fillRect(x0,cy+(sq?19:26),w-g.measureText('Normal ').width,sq?3:4)}cy+=sq?42:56})}
    if(h.save){cy+=sq?10:24;pill(h.save,cx,cy,'#E2F5EA','#22704A',sq?26:38);cy+=(sq?26:38)*1.9+(sq?16:30)}
    if(h.hint){font('500',sq?26:36);g.fillStyle='#54496A';wrap(h.hint,cw).slice(0,2).forEach(l=>{g.fillText(l,cx,cy+(sq?28:40));cy+=sq?38:52})}
    font('700',sq?28:38);g.fillStyle='#5B47B0';g.fillText(promoPeriod(p),cx,cardY+cardH-(sq?36:56));
  }else{
    const rows=list.slice(0,sq?3:6),rowH=(cardH-(list.length>rows_n(list,sq)?(sq?70:110):(sq?40:70)))/Math.min(list.length,sq?3:6);
    const thumb=(x,y,sz,im,h,cat)=>{g.save();rr(x,y,sz,sz,sz*.2);g.clip();
      if(im){const k=Math.max(sz/im.width,sz/im.height);g.drawImage(im,x+(sz-im.width*k)/2,y+(sz-im.height*k)/2,im.width*k,im.height*k)}
      else{g.fillStyle=h.prod?({pink:'#F7BFD2',blue:'#BCD0F7',gold:'#F7DA92',lav:'#D9CDF6',mint:'#BFE9D4'}[catInfo(cat).warna]||'#D9CDF6'):(h.code?'#E6DCFF':'#FFF0C7');g.fillRect(x,y,sz,sz);
        g.fillStyle=h.prod?'rgba(255,255,255,.8)':'#5B47B0';font('900',h.prod?sz*.46:sz*.34);g.textAlign='center';g.fillText(h.prod?(h.t||'?')[0].toUpperCase():(h.code?'%':'Rp'),x+sz/2,y+sz*(h.prod?.65:.62));g.textAlign='left'}
      g.restore()};
    for(let i=0;i<rows.length;i++){const p=rows[i],h=promoHead(p),ry=cy+i*rowH,ts=Math.min(rowH-(sq?28:44),sq?120:180),tw=cw-ts-(sq?20:30);
      if(i)g.fillStyle='#EEE7F7',g.fillRect(cx,ry-(sq?10:16),cw,3);
      const im=h.prod?await loadImg(posterImgSrc(p,h)):null;thumb(cx+cw-ts,ry+Math.max(0,((sq?118:168)-ts)/2),ts,im,h,h.cat);
      pill(h.k,cx,ry,['#E24B6B','#4A78D0','#D39B1C','#2E9E6A','#7A66D0'][i%5],'#fff',sq?18:24);
      font('800',sq?32:44);g.fillStyle='#2B2140';g.fillText(fitText(g,h.t,tw),cx,ry+(sq?72:100));
      const sz=fit(h.big,'900',sq?42:60,24,tw);g.fillStyle='#E24B6B';g.fillText(h.big,cx,ry+(sq?72:100)+sz+(sq?6:10));
      if(h.s){const bw=g.measureText(h.big).width;font('600',sq?22:30);g.fillStyle='#7C7191';const tt=(h.strike?'Normal ':'')+h.s,y2=ry+(sq?72:100)+sz+(sq?6:10);
        if(bw+20+g.measureText(tt).width<=tw)g.fillText(tt,cx+bw+20,y2-(sq?2:2));else if(rowH>(sq?150:220))g.fillText(fitText(g,tt,tw),cx,y2+(sq?32:44))}}
    if(list.length>rows.length){font('700',sq?24:32);g.fillStyle='#7A66D0';g.fillText('+'+(list.length-rows.length)+' promo lainnya di aplikasi',cx,cardY+cardH-(sq?34:52))}
  }
  // footer: QR + ajakan
  const fy=H-footH+(sq?8:20),qs=sq?170:250;
  rr(M,fy,qs,qs,24);g.fillStyle='#fff';g.fill();
  try{if(typeof qrcode==='function'){const q=qrcode(0,'M');q.addData(SITE());q.make();const n=q.getModuleCount(),cs=(qs-28)/n;g.fillStyle='#2B2140';for(let r=0;r<n;r++)for(let cc=0;cc<n;cc++)if(q.isDark(r,cc))g.fillRect(M+14+cc*cs,fy+14+r*cs,Math.ceil(cs),Math.ceil(cs))}}catch(e){}
  const tx=M+qs+(sq?30:44),tw2=W-M-tx;g.fillStyle='#fff';font('800',sq?38:54);g.fillText('Pesan sekarang!',tx,fy+(sq?48:70));
  font('600',sq?26:36);g.fillStyle='#EDE7FF';g.fillText(fitText(g,SITE().replace(/^https?:\/\//,''),tw2),tx,fy+(sq?92:130));
  font('500',sq?22:30);g.fillText(fitText(g,'Ambil di '+M_().toko.lokasi,tw2),tx,fy+(sq?132:186));
  if(!sq){g.fillText(fitText(g,'Scan QR atau buka link di atas',tw2),tx,fy+234)}
  return await new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('Poster gagal dibuat')),'image/png'));
}
const M_=()=>M();
const rows_n=(l,sq)=>sq?3:6;
function fitText(g,t,max){t=String(t);if(g.measureText(t).width<=max)return t;while(t.length>1&&g.measureText(t+'…').width>max)t=t.slice(0,-1);return t+'…'}
function promoShareText(list){return '*PROMO KAmart* 🛒\n'+list.map(p=>'• '+promoDesc(p)+' ('+promoPeriod(p).toLowerCase()+')').join('\n')+'\n\nPesan dari HP, ambil saat istirahat, awal masuk, atau pulang kerja:\n'+SITE()}
function closePoster(){if(S.poster&&S.poster.url)URL.revokeObjectURL(S.poster.url);S.poster=null}
async function makePoster(){const P=S.poster;if(!P)return;if(P.url)URL.revokeObjectURL(P.url);P.url='';P.blob=null;render();
  try{const b=await posterPng(P.list,P.fmt);if(S.poster!==P)return;P.blob=b;P.url=URL.createObjectURL(b)}catch(e){toast((e&&e.message)||'Poster gagal dibuat')}render()}
function posterHtml(){const P=S.poster;
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="Poster promo"><div class="box" style="max-width:460px">'+
   '<div class="ch" style="margin:0"><div><h3>Poster promo</h3><p>'+(P.list.length>1?P.list.length+' promo aktif':esc(P.list[0].nama))+'</p></div><button class="btn3" data-act="posterclose">Tutup</button></div>'+
   '<div class="seg" role="radiogroup" aria-label="Ukuran">'+[['story','Status WA (9:16)'],['square','Grup (kotak)']].map(([v,t])=>'<button type="button" class="sg'+(P.fmt===v?' on':'')+'" role="radio" aria-checked="'+(P.fmt===v)+'" data-pfmt="'+v+'">'+t+'</button>').join('')+'</div>'+
   '<div class="pprev'+(P.fmt==='square'?' sq':'')+'">'+(P.url?'<img src="'+P.url+'" alt="Pratinjau poster promo">':'<span>Membuat poster…</span>')+'</div>'+
   '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn2" data-act="postersave"'+(P.url?'':' disabled')+'>Unduh PNG</button><button class="btn" data-act="postershare"'+(P.url?'':' disabled')+'>Bagikan ke WA</button></div>'+
   '<button class="btn3" data-act="postertext" style="align-self:center">Salin teks promo untuk caption</button></div></div>'}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Teks promo disalin')}catch(e){prompt('Salin teks ini:',t)}}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-bprod],[data-bvouch],[data-bgo],[data-bdot],[data-prposter],[data-prposterall],[data-pfmt],[data-act^="poster"]');if(!t)return;const d=t.dataset;
  if(d.bdot!=null){const tr=document.getElementById('btrack');if(tr)tr.scrollTo({left:+d.bdot*tr.clientWidth,behavior:'smooth'});return}
  if(d.bprod){const p=prod(d.bprod);S.q=p?p.name:'';S.cat='Semua';render();const k=document.getElementById('katalog');if(k)k.scrollIntoView({behavior:'smooth',block:'start'});return}
  if(d.bgo){const k=document.getElementById(d.bgo);if(k)k.scrollIntoView({behavior:'smooth',block:'start'});return}
  if(d.bvouch){try{const vp=await fetchVoucher(d.bvouch);vch('co',{code:d.bvouch,vp});toast('Voucher '+d.bvouch+' dipasang. Potongan muncul di keranjang.')}catch(err){toast((err&&err.message)||'Voucher tidak berlaku')}render();return}
  if(d.prposter||d.prposterall){const list=d.prposterall?(S.promos||[]).filter(p=>promoAktif(p,new Date())):(S.promos||[]).filter(p=>p.id===d.prposter);if(!list.length)return;S.poster={list,fmt:'story',url:'',blob:null};makePoster();return}
  if(!S.poster)return;
  if(d.pfmt){if(S.poster.fmt!==d.pfmt){S.poster.fmt=d.pfmt;makePoster()}return}
  if(d.act==='posterclose'){closePoster();render();return}
  if(d.act==='postertext'){copyText(promoShareText(S.poster.list));return}
  const P=S.poster;if(!P.blob)return;const name='promo-kamart-'+(P.fmt==='square'?'kotak':'status')+'.png';
  if(d.act==='postersave'){try{await saveFile(name,P.blob);toast('Poster diunduh')}catch(err){toast((err&&err.message)||'Unduhan gagal')}return}
  if(d.act==='postershare'){const text=promoShareText(P.list);
    try{const file=new File([P.blob],name,{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text});return}}catch(err){if(err&&err.name==='AbortError')return}
    try{await saveFile(name,P.blob)}catch(err){}copyText(text);window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank','noopener');toast('Poster diunduh. Lampirkan gambarnya di WhatsApp.')}});

/* ---------- Riwayat Pesanan ---------- */
const ymd=d=>{d=new Date(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function rhInit(){if(!S.rh)S.rh={q:'',range:'bulan',from:ymd(new Date(Date.now()-6*864e5)),to:ymd(new Date()),status:'all',bayar:'all',src:'all',metode:'',limit:50,open:null};return S.rh}
function rhRange(){const f=rhInit(),now=new Date(),t=ymd(now);
  if(f.range==='today')return[t,t];
  if(f.range==='7')return[ymd(new Date(now-6*864e5)),t];
  if(f.range==='bulan')return[mk(now)+'-01',t];
  if(f.range==='custom')return[f.from||'0000',f.to||'9999'];
  return['0000','9999']}
function riwayatList(){const f=rhInit(),[a,b]=rhRange(),q=f.q.trim().toLowerCase();
  return S.orders.filter(o=>{const d=ymd(o.createdAt),st=o.stage==null?0:o.stage;
    if(d<a||d>b)return false;
    if(f.status==='done'&&st!==3)return false;if(f.status==='cancel'&&st>=0)return false;if(f.status==='proses'&&!(st>=0&&st<3))return false;
    if(f.bayar==='lunas'&&!(o.paid&&st>=0))return false;if(f.bayar==='belum'&&(o.paid||st<0))return false;
    if(f.src!=='all'&&o.source!==f.src)return false;if(f.metode&&o.pay!==f.metode)return false;
    if(q&&!((o.customerName||'')+' '+(o.code||'')+' '+(o.customerLine||'')+' '+itemsText(o)).toLowerCase().includes(q))return false;
    return true}).sort((x,y)=>y.createdAt.localeCompare(x.createdAt))}
function vRiwayat(){
  if(loading())return '<div class="card empty">Memuat pesanan…</div>';
  const f=rhInit(),list=riwayatList(),ok=list.filter(o=>(o.stage==null?0:o.stage)>=0);
  const sel=(key,opts,label)=>'<select class="in" id="rh-'+key+'" data-bind="rh.'+key+'" data-live="1" aria-label="'+label+'">'+opts.map(([v,t])=>'<option value="'+esc(v)+'"'+(f[key]===v?' selected':'')+'>'+esc(t)+'</option>').join('')+'</select>';
  const metodes=[...new Set([...M().bayar.map(b=>b.kode),...S.orders.map(o=>o.pay).filter(Boolean)])];
  const shown=list.slice(0,f.limit);let lastDay='';
  return '<div class="stack">'+
   '<div class="card stack" style="gap:12px;padding:16px">'+
    '<input class="in" id="rh-q" type="search" data-bind="rh.q" data-live="1" value="'+esc(f.q)+'" placeholder="Cari nama, kode, bagian, atau barang">'+
    '<div class="seg" role="radiogroup" aria-label="Periode">'+[['today','Hari ini'],['7','7 hari'],['bulan','Bulan ini'],['all','Semua'],['custom','Pilih tanggal']].map(([v,t])=>'<button type="button" class="sg'+(f.range===v?' on':'')+'" role="radio" aria-checked="'+(f.range===v)+'" data-rhrange="'+v+'">'+t+'</button>').join('')+'</div>'+
    (f.range==='custom'?'<div class="fg" style="grid-template-columns:repeat(2,minmax(0,1fr))"><label class="f">Dari<input class="in" type="date" id="rh-from" data-bind="rh.from" data-live="1" value="'+esc(f.from)+'"></label><label class="f">Sampai<input class="in" type="date" id="rh-to" data-bind="rh.to" data-live="1" value="'+esc(f.to)+'"></label></div>':'')+
    '<div class="rhf">'+sel('status',[['all','Semua tahap'],['proses','Diproses'],['done','Selesai'],['cancel','Batal']],'Tahap')+sel('bayar',[['all','Lunas & belum'],['lunas','Lunas'],['belum','Belum lunas']],'Status bayar')+
      sel('src',[['all','Online & kasir'],['online','Online'],['kasir','Kasir']],'Sumber')+sel('metode',[['','Semua metode']].concat(metodes.map(m=>[m,payLabel(m)])),'Metode bayar')+'</div></div>'+
   '<div class="rhstats"><div class="stat b-lav"><span class="lb">Pesanan</span><span class="vl num">'+list.length+'</span><span class="sm">'+(list.length-ok.length)+' dibatalkan</span></div>'+
    '<div class="stat b-blue"><span class="lb">Omzet</span><span class="vl num">'+rp(sum(ok,o=>+o.total||0))+'</span><span class="sm">tanpa yang batal</span></div>'+
    '<div class="stat b-gold"><span class="lb">Untung</span><span class="vl num">'+rp(sum(ok,profit))+'</span><span class="sm">'+rp(sum(ok.filter(o=>!o.paid),o=>+o.total||0))+' belum dibayar</span></div></div>'+
   '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><small style="color:var(--muted)">Menampilkan '+shown.length+' dari '+list.length+' pesanan</small></div>'+
   (shown.length?'<div class="card" style="padding:4px 16px">'+shown.map(o=>{const d=new Date(o.createdAt).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),st=o.stage==null?0:o.stage,open=f.open===o.id;
      const head=d!==lastDay?'<div class="rhday">'+d+'</div>':'';lastDay=d;
      return head+'<div class="rhrow'+(open?' open':'')+'"><button class="rhbtn" data-rhopen="'+o.id+'" aria-expanded="'+open+'">'+
        '<span class="av" style="background:'+avc(o.customerName)+'">'+esc((o.customerName||'?')[0])+'</span>'+
        '<span class="rhmain"><span class="rhtop"><b>'+esc(o.customerName||'Pembeli umum')+'</b><span class="num'+(st<0?' strike':'')+'">'+rp(o.total)+'</span></span>'+
        '<small>'+esc(o.code||'')+' · '+new Date(o.createdAt).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})+' · '+(o.source==='online'?'Online':'Kasir')+'</small>'+
        '<span class="rhitems">'+esc((o.items||[]).map(i=>i.qty+'× '+i.name+(i.bonus?' (bonus)':'')).join(', ')||'-')+'</span>'+
        '<span class="rhpills"><span class="pill-s '+(st<0?'ps-bad':stagePill(st))+'">'+stageText(st)+'</span>'+(st<0?'':'<span class="pill-s '+(o.paid?'ps-ok':'ps-warn')+'">'+esc(payLabel(o.pay))+(o.paid?' · lunas':' · belum')+'</span>')+'</span></span></button>'+
        (open?'<div class="rhdet">'+(o.items||[]).map(i=>'<div class="li"><span>'+i.qty+'× '+esc(i.name)+(i.bonus?' <small style="color:var(--ok);font-weight:700">bonus</small>':'')+'</span><span class="num">'+(i.bonus?'Gratis':rp((+i.qty||0)*(+i.price||0)))+'</span></div>').join('')+
          ((o.diskon||[]).length?sumRows({subtotal:o.subtotal==null?o.total:o.subtotal,diskon:o.diskon}):'')+'<div class="li" style="font-weight:700"><span>Total</span><span class="num">'+rp(o.total)+'</span></div>'+
          '<small style="color:var(--muted)">'+[o.customerLine,o.slot?'Ambil: '+o.slot:'',o.note?'Catatan: '+o.note:'',o.paidAt&&o.paid?'Dibayar '+tglJam(o.paidAt):'',st>=0?'Untung '+rp(profit(o)):''].filter(Boolean).map(esc).join(' · ')+'</small>'+
          '<div style="display:flex;gap:6px;flex-wrap:wrap">'+(st>=0&&!o.paid?'<button class="btn3" data-paid="'+o.id+'">Tandai lunas</button>':'')+'<button class="btn3" data-rcpt="'+o.id+'">Unduh struk</button></div></div>':'')+'</div>'}).join('')+'</div>'
     :'<div class="card empty">Tidak ada pesanan untuk filter ini.</div>')+
   (list.length>shown.length?'<div style="text-align:center"><button class="btn2" data-act="rhmore">Tampilkan 50 lagi</button></div>':'')+
  '</div>';
}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-rhrange],[data-rhopen],[data-rcpt]');if(!t)return;const d=t.dataset;
  if(d.rhrange){rhInit().range=d.rhrange;S.rh.limit=50;render();return}
  if(d.rhopen){S.rh.open=S.rh.open===d.rhopen?null:d.rhopen;render();return}
  if(d.rcpt){const o=S.orders.find(x=>x.id===d.rcpt);if(o){try{await downloadReceipt(o)}catch(err){toast((err&&err.message)||'Struk gagal dibuat')}}}});

/* ---------- Kelola Master ---------- */
const MTABS=[['kategori','Kategori'],['bayar','Pembayaran'],['waktu','Waktu ambil'],['lain','Satuan, bagian & toko']];
const WARNA=[['pink','Pink'],['blue','Biru'],['gold','Kuning'],['lav','Ungu'],['mint','Hijau']];
const IKONS=[['cup','Cup'],['coffee','Gelas'],['box','Kotak'],['bag','Tas']];
const TIPE={qris:'Bawaan · QRIS (Midtrans/DANA)',tunai:'Bawaan · hitung kembalian',kasbon:'Bawaan · khusus pelanggan terdaftar',manual:'Manual · admin tandai lunas'};
function mfInit(){const m=clone(M());m.kategori.forEach(k=>k._lama=k.nama);S.mf=m}
function mfPlain(){const a=clone(S.mf);a.kategori.forEach(k=>delete k._lama);a.bayar.forEach(b=>delete b._baru);return a}
const mfDirty=()=>!!S.mf&&JSON.stringify(mfPlain())!==JSON.stringify(M());
function mfState(){const el=document.getElementById('mfstate');if(el){const d=mfDirty();el.textContent=d?'Ada perubahan yang belum disimpan':'Semua perubahan tersimpan';el.style.color=d?'var(--warn)':'var(--muted)'}}
const mIn=(path,val,ph,extra)=>'<input class="in grow" data-mf="'+path+'" value="'+esc(val)+'" placeholder="'+esc(ph||'')+'"'+(extra||'')+'>';
const mCk=(path,on,label,dis)=>'<label class="ck"><input type="checkbox" data-mf="'+path+'"'+(on?' checked':'')+(dis?' disabled':'')+'>'+label+'</label>';
const mSel=(path,val,opts,label)=>'<select class="in" data-mf="'+path+'" aria-label="'+label+'">'+opts.map(([v,t])=>'<option value="'+v+'"'+(v===val?' selected':'')+'>'+t+'</option>').join('')+'</select>';
const mMove=(list,i,n)=>'<button type="button" class="mbtn" data-mfmove="'+list+'.'+i+'.-1" aria-label="Naikkan"'+(i===0?' disabled':'')+'>↑</button><button type="button" class="mbtn" data-mfmove="'+list+'.'+i+'.1" aria-label="Turunkan"'+(i===n-1?' disabled':'')+'>↓</button>';
const mDel=(list,i,dis,why)=>'<button type="button" class="mbtn dang" data-mfdel="'+list+'.'+i+'" aria-label="Hapus"'+(dis?' disabled title="'+esc(why||'')+'"':'')+'>✕</button>';
function vMaster(){
  if(loading())return '<div class="card empty">Memuat data…</div>';
  if(!S.mf)mfInit();
  const m=S.mf,tab=S.mtab||'kategori',dirty=mfDirty();
  let body='';
  if(tab==='kategori'){
    body='<div class="card" style="padding:4px 16px">'+m.kategori.map((k,i)=>{const used=S.products.filter(p=>p.cat===(k._lama||k.nama)).length;
      return '<div class="mrow"><span class="tile t-'+esc(k.warna)+'" style="width:40px;height:40px;border-radius:12px;flex:0 0 auto">'+ic(k.ikon,18)+'</span>'+
        mIn('kategori.'+i+'.nama',k.nama,'Nama kategori',' aria-label="Nama kategori" maxlength="30"')+
        mSel('kategori.'+i+'.warna',k.warna,WARNA,'Warna')+mSel('kategori.'+i+'.ikon',k.ikon,IKONS,'Ikon')+
        mCk('kategori.'+i+'.online',k.online!==false,'Jual online')+'<span class="mtag">'+used+' produk</span>'+
        '<span class="mrow-act">'+mMove('kategori',i,m.kategori.length)+mDel('kategori',i,used>0,'Masih dipakai '+used+' produk')+'</span></div>'}).join('')+'</div>'+
      '<div><button class="btn2" data-act="mfadd" data-list="kategori">'+ic('plus',16,2.4)+'Tambah kategori</button></div>'+
      '<small style="color:var(--muted)">Matikan "Jual online" untuk kategori khusus kasir seperti rokok (verifikasi umur). Kategori yang masih dipakai produk tidak bisa dihapus; ganti namanya akan ikut memindahkan produknya.</small>';
  }else if(tab==='bayar'){
    body='<div class="card" style="padding:4px 16px">'+m.bayar.map((b,i)=>{const sys=b.tipe&&b.tipe!=='manual';
      return '<div class="mrow"><span class="mtag" title="Kode tersimpan di pesanan">'+esc(b.kode||'baru')+'</span>'+
        mIn('bayar.'+i+'.label',b.label,'Nama yang tampil',' aria-label="Nama metode" maxlength="30"')+
        '<span class="mrow-act">'+mMove('bayar',i,m.bayar.length)+mDel('bayar',i,sys,'Metode bawaan tidak bisa dihapus, cukup nonaktifkan')+'</span>'+
        '<div style="flex-basis:100%;display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center">'+mCk('bayar.'+i+'.aktif',b.aktif!==false,'Aktif')+mCk('bayar.'+i+'.online',b.online!==false,'Toko online')+mCk('bayar.'+i+'.kasir',b.kasir!==false,'Kasir')+
        '<small style="color:var(--muted)">'+TIPE[b.tipe||'manual']+'</small></div>'+
        mIn('bayar.'+i+'.ket',b.ket||'','Keterangan untuk pembeli, mis. no. rekening (opsional)',' aria-label="Keterangan" maxlength="140" style="flex-basis:100%"')+'</div>'}).join('')+'</div>'+
      '<div><button class="btn2" data-act="mfadd" data-list="bayar">'+ic('plus',16,2.4)+'Tambah metode</button></div>'+
      '<small style="color:var(--muted)">Metode tambahan (misal Transfer BCA) dicatat belum lunas di toko online sampai admin menandai lunas. Di kasir langsung dianggap lunas.</small>';
  }else if(tab==='waktu'){
    body='<div class="card" style="padding:4px 16px">'+m.waktu.map((w,i)=>'<div class="mrow">'+mIn('waktu.'+i+'.label',w.label,'Contoh: Istirahat 12.00',' aria-label="Waktu ambil" maxlength="30"')+
        mCk('waktu.'+i+'.aktif',w.aktif!==false,'Aktif')+'<label class="ck"><input type="radio" name="mfutama" data-mfutama="'+i+'"'+(w.utama?' checked':'')+'>Bawaan</label>'+
        '<span class="mrow-act">'+mMove('waktu',i,m.waktu.length)+mDel('waktu',i,m.waktu.length<=1,'Minimal satu waktu ambil')+'</span></div>').join('')+'</div>'+
      '<div><button class="btn2" data-act="mfadd" data-list="waktu">'+ic('plus',16,2.4)+'Tambah waktu ambil</button></div>'+
      '<small style="color:var(--muted)">"Bawaan" dipilih otomatis untuk pembeli baru. Pesanan lama tetap menyimpan nama waktu saat dipesan.</small>';
  }else{
    const chips=(list,ph)=>'<div style="display:flex;flex-wrap:wrap;gap:6px">'+(m[list].length?m[list].map((x,i)=>'<span class="chipx">'+esc(x)+'<button type="button" data-mfdel="'+list+'.'+i+'" aria-label="Hapus '+esc(x)+'">×</button></span>').join(''):'<small style="color:var(--muted)">Belum ada.</small>')+'</div>'+
      '<form class="mrow" data-mfaddtxt="'+list+'" style="border:0;padding:0"><input class="in grow" id="mf-new-'+list+'" placeholder="'+ph+'" maxlength="40"><button class="btn2" type="submit">Tambah</button></form>';
    body='<div class="card stack" style="gap:10px;padding:16px"><h3 style="font-size:15px">Satuan produk</h3>'+chips('satuan','Contoh: renteng')+'<small style="color:var(--muted)">Muncul sebagai pilihan di kolom Satuan saat menambah produk.</small></div>'+
      '<div class="card stack" style="gap:10px;padding:16px"><h3 style="font-size:15px">Bagian / line</h3>'+chips('bagian','Contoh: Painting L1')+'<small style="color:var(--muted)">Muncul sebagai saran saat pembeli mengisi bagian/line.</small></div>'+
      '<div class="card stack" style="gap:12px;padding:16px"><h3 style="font-size:15px">Info toko</h3>'+
        '<label class="f">Lokasi ambil pesanan<input class="in" data-mf="toko.lokasi" value="'+esc(m.toko.lokasi)+'" maxlength="80"></label>'+
        '<label class="f">Order tutup (menit sebelum jam ambil)<input class="in num" type="number" min="0" max="240" inputmode="numeric" data-mf="toko.tutup" value="'+esc(m.toko.tutup)+'"></label></div>';
  }
  return '<div class="stack">'+
    '<div class="card mfhead"><div class="stack" style="gap:2px"><b>Data master</b><small id="mfstate" style="color:'+(dirty?'var(--warn)':'var(--muted)')+'">'+(dirty?'Ada perubahan yang belum disimpan':'Semua perubahan tersimpan')+'</small></div>'+
    '<div style="display:flex;gap:8px"><button class="btn3" data-act="mfreset">Batalkan</button><button class="btn" data-act="mfsave"'+(S.busy?' disabled':'')+'>'+(S.busy?'Menyimpan…':'Simpan')+'</button></div></div>'+
    '<div class="mtabs" role="tablist">'+MTABS.map(([id,t])=>'<button class="sg'+(tab===id?' on':'')+'" role="tab" aria-selected="'+(tab===id)+'" data-mtab="'+id+'">'+t+'</button>').join('')+'</div>'+
    body+'</div>';
}
function mfGet(path){return path.split('.').reduce((o,k)=>o==null?o:o[k],S.mf)}
function mfSet(path,val){const ks=path.split('.'),last=ks.pop();const o=ks.reduce((x,k)=>x[k],S.mf);o[last]=val}
document.addEventListener('input',e=>{const t=e.target;if(!t.dataset||!t.dataset.mf||!S.mf)return;
  mfSet(t.dataset.mf,t.type==='checkbox'?t.checked:t.type==='number'?(t.value===''?'':+t.value):t.value);
  if(t.tagName==='SELECT'||t.type==='checkbox')render();else mfState()});
document.addEventListener('change',e=>{const t=e.target;if(!S.mf)return;
  if(t.dataset&&t.dataset.mfutama!=null){S.mf.waktu.forEach((w,i)=>w.utama=i===+t.dataset.mfutama);mfState()}});
document.addEventListener('submit',e=>{const f=e.target.closest('[data-mfaddtxt]');if(!f)return;e.preventDefault();
  const list=f.dataset.mfaddtxt,inp=document.getElementById('mf-new-'+list),v=inp.value.replace(/\s+/g,' ').trim();if(!v)return;
  if(S.mf[list].some(x=>x.toLowerCase()===v.toLowerCase())){toast('"'+v+'" sudah ada');return}
  S.mf[list].push(v);render();const n=document.getElementById('mf-new-'+list);if(n)n.focus()});
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!S.mf&&!t.dataset.mtab)return;const d=t.dataset;
  if(d.mtab){S.mtab=d.mtab;render();return}
  if(d.mfmove){const[list,i,dir]=d.mfmove.split('.');const a=S.mf[list],j=+i+ +dir;if(j<0||j>=a.length)return;[a[+i],a[j]]=[a[j],a[+i]];render();return}
  if(d.mfdel){const[list,i]=d.mfdel.split('.');S.mf[list].splice(+i,1);if(list==='waktu'&&!S.mf.waktu.some(w=>w.utama)&&S.mf.waktu[0])S.mf.waktu[0].utama=true;render();return}
  if(d.act==='mfadd'){const L=d.list;
    if(L==='kategori')S.mf.kategori.push({nama:'',warna:'lav',ikon:'box',online:true});
    if(L==='bayar')S.mf.bayar.push({kode:'',label:'',tipe:'manual',online:true,kasir:true,aktif:true,ket:'',_baru:true});
    if(L==='waktu')S.mf.waktu.push({label:'',aktif:true,utama:false});
    render();const ins=document.querySelectorAll('[data-mf^="'+L+'.'+(S.mf[L].length-1)+'."]');if(ins[0])ins[0].focus();return}
  if(d.act==='mfreset'){S.mf=null;render();toast('Perubahan dibatalkan');return}
  if(d.act==='mfsave'){mfSave();return}});
async function mfSave(){
  if(S.busy)return;const m=mfPlain(),src=S.mf;const tidy=v=>String(v||'').replace(/\s+/g,' ').trim();
  m.kategori.forEach(k=>k.nama=tidy(k.nama));m.waktu.forEach(w=>w.label=tidy(w.label));m.bayar.forEach(b=>{b.label=tidy(b.label);b.ket=tidy(b.ket)});
  const dup=(a,f)=>{const s=new Set();for(const x of a){const k=f(x).toLowerCase();if(s.has(k))return f(x);s.add(k)}return null};
  const fail=(msg,tab)=>{toast(msg);if(tab){S.mtab=tab;render()}};
  if(m.kategori.some(k=>!k.nama))return fail('Nama kategori tidak boleh kosong.','kategori');
  let x=dup(m.kategori,k=>k.nama);if(x)return fail('Kategori "'+x+'" dobel.','kategori');
  if(m.bayar.some(b=>!b.label))return fail('Nama metode bayar tidak boleh kosong.','bayar');
  m.bayar.forEach(b=>{if(!b.kode)b.kode=b.label.replace(/[^\w .-]/g,'').slice(0,24)||'Metode'});
  x=dup(m.bayar,b=>b.kode);if(x)return fail('Metode bayar "'+x+'" dobel.','bayar');
  if(!m.bayar.some(b=>b.aktif!==false&&b.online!==false))return fail('Minimal satu metode bayar aktif untuk toko online.','bayar');
  if(!m.bayar.some(b=>b.aktif!==false&&b.kasir!==false))return fail('Minimal satu metode bayar aktif untuk kasir.','bayar');
  if(m.waktu.some(w=>!w.label))return fail('Waktu ambil tidak boleh kosong.','waktu');
  x=dup(m.waktu,w=>w.label);if(x)return fail('Waktu ambil "'+x+'" dobel.','waktu');
  if(!m.waktu.some(w=>w.aktif!==false))return fail('Minimal satu waktu ambil aktif.','waktu');
  m.toko.lokasi=tidy(m.toko.lokasi)||MASTER_DEFAULT.toko.lokasi;m.toko.tutup=Math.max(0,Math.min(240,Math.round(+m.toko.tutup||0)));
  const renames=src.kategori.map((k,i)=>({dari:k._lama,ke:m.kategori[i].nama})).filter(r=>r.dari&&r.dari!==r.ke);
  S.busy=true;render();
  try{await saveMaster(m,renames);S.mf=null;toast('Data master tersimpan')}catch(e){}
  S.busy=false;render();
}

/* ---------- halaman informasi (syarat verifikasi payment gateway) ---------- */
const INFO=Object.assign({nama:'KAmart',pemilik:'Khoirul Arbi',wa:'0895369834425',email:'khoirularbi729@gmail.com',alamat:'Cikarang, Kabupaten Bekasi, Jawa Barat',jam:'Senin–Sabtu, 07.00–17.00 WIB',berlaku:'21 November 2026'},window.KAMART_INFO||{});
const INFO_PAGES=[['tentang','Tentang & Kontak'],['syarat','Syarat & Ketentuan'],['refund','Pengembalian & Refund'],['privasi','Kebijakan Privasi']];
const waLink=()=>'https://wa.me/62'+String(INFO.wa).replace(/\D/g,'').replace(/^0|^62/,'');
function infoFooter(){return '<footer class="infofoot"><nav aria-label="Informasi toko">'+INFO_PAGES.map(([id,t])=>'<a href="#'+id+'">'+t+'</a>').join('')+'</nav><span>© 2026 '+esc(INFO.nama)+' · '+esc(INFO.alamat)+'</span></footer>'}
function infoPage(title,sub,secs){return shopHead(esc(title),esc(sub),'<button class="iconbtn" data-go="akun" aria-label="Kembali">‹</button>')+
  '<div class="stack legal" style="gap:12px">'+secs.map(([h,b])=>'<section class="card stack" style="gap:8px;padding:16px">'+(h?'<h2>'+esc(h)+'</h2>':'')+b+'</section>').join('')+
  '<small style="color:var(--muted);text-align:center">Berlaku sejak '+esc(INFO.berlaku)+'</small>'+infoFooter()+'</div>'}
const ul=a=>'<ul>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
function contactHtml(){return ul(['WhatsApp: <a href="'+waLink()+'" target="_blank" rel="noopener">'+esc(INFO.wa)+'</a>','Email: <a href="mailto:'+esc(INFO.email)+'">'+esc(INFO.email)+'</a>','Alamat: '+esc(INFO.alamat),'Jam layanan: '+esc(INFO.jam)])}
function vTentang(){return infoPage('Tentang & Kontak','KAmart, toko kelontong online',[
  ['Tentang KAmart','<p>'+esc(INFO.nama)+' adalah toko kelontong online milik '+esc(INFO.pemilik)+' yang menjual makanan instan, minuman, dan kebutuhan sehari-hari untuk karyawan di lingkungan kawasan industri Cikarang. Pembeli memesan lewat situs ini lalu mengambil pesanan pada jam istirahat.</p>'],
  ['Produk yang dijual','<p>Mi instan cup (Pop Mie), kopi dan minuman sachet, minuman kemasan, serta sembako dan kebutuhan harian. Daftar produk, harga, dan sisa stok selalu tampil terbaru di halaman Belanja.</p>'],
  ['Cara memesan',ul(['Pilih produk di halaman Belanja dan masukkan ke keranjang.','Isi nama, bagian/line, dan jam pengambilan.','Pilih pembayaran: Tunai saat ambil, QRIS, atau Bayar pas gajian (khusus pelanggan terdaftar).','Pantau status pesanan di menu Pesanan: Baru, Disiapkan, Siap diambil, Selesai.','Ambil pesanan di titik ambil sesuai jam yang dipilih dan tunjukkan kode pesanan.'])],
  ['Pengiriman','<p>KAmart tidak melakukan pengiriman lewat kurir. Semua pesanan diambil langsung oleh pembeli di titik ambil pada hari yang sama. Tidak ada ongkos kirim.</p>'],
  ['Hubungi kami',contactHtml()]])}
function vSyarat(){return infoPage('Syarat & Ketentuan','Aturan berbelanja di KAmart',[
  ['','<p>Dengan memakai situs dan melakukan pemesanan di '+esc(INFO.nama)+', kamu dianggap telah membaca dan menyetujui ketentuan berikut.</p>'],
  ['1. Pemesanan',ul(['Pesanan dianggap masuk setelah muncul kode pesanan (contoh KA-1A2B) dan struk.','Order untuk satu jam istirahat ditutup 30 menit sebelum jam istirahat dimulai.','KAmart berhak membatalkan pesanan bila stok habis, data pemesan tidak jelas, atau ada indikasi penyalahgunaan. Pembeli akan dihubungi dan dana dikembalikan sesuai Kebijakan Refund.'])],
  ['2. Harga dan stok',ul(['Harga yang berlaku adalah harga yang tampil saat pesanan dibuat, dalam Rupiah, tanpa biaya tambahan.','Stok dihitung otomatis oleh sistem. Bila terjadi selisih stok, KAmart akan menghubungi pembeli sebelum pesanan disiapkan.'])],
  ['3. Pembayaran',ul(['Tunai: dibayar saat pesanan diambil.','QRIS: dibayar sesuai nominal pesanan, dapat memakai DANA, GoPay, OVO, ShopeePay, LinkAja, atau aplikasi m-banking yang mendukung QRIS.','Bayar pas gajian (kasbon): hanya untuk pelanggan yang sudah didaftarkan oleh KAmart, wajib dilunasi pada tanggal gajian berikutnya.','Pembayaran dianggap sah setelah dikonfirmasi oleh sistem atau admin KAmart.'])],
  ['4. Pengambilan',ul(['Pesanan diambil sendiri di titik ambil sesuai jam yang dipilih, dengan menunjukkan kode pesanan.','Pesanan yang tidak diambil sampai akhir hari kerja dapat dibatalkan. Pesanan yang sudah dibayar dan tidak diambil akan dihubungi lebih dulu sebelum dibatalkan.'])],
  ['5. Produk terbatas','<p>Produk tembakau/rokok tidak dijual melalui toko online dan hanya dilayani langsung kepada pembeli berusia 18 tahun ke atas.</p>'],
  ['6. Perubahan ketentuan','<p>KAmart dapat memperbarui ketentuan ini sewaktu-waktu. Versi terbaru selalu tersedia di halaman ini.</p>'],
  ['Kontak',contactHtml()]])}
function vRefund(){return infoPage('Pengembalian & Refund','Kebijakan pembatalan, penukaran, dan pengembalian dana',[
  ['Pembatalan oleh pembeli',ul(['Pesanan dapat dibatalkan selama statusnya masih <b>Baru</b>, dengan menghubungi KAmart lewat WhatsApp dan menyebutkan kode pesanan.','Pesanan yang sudah berstatus Disiapkan atau Siap diambil tidak dapat dibatalkan, kecuali ada kesalahan dari pihak KAmart.'])],
  ['Pembatalan oleh KAmart','<p>Bila pesanan dibatalkan oleh KAmart (misalnya stok habis), pesanan yang sudah dibayar akan dikembalikan <b>100%</b>.</p>'],
  ['Produk rusak, salah, atau kedaluwarsa',ul(['Periksa pesanan saat pengambilan. Laporkan produk yang rusak, salah, atau kedaluwarsa paling lambat <b>1×24 jam</b> setelah pengambilan dengan foto produk dan kode pesanan.','KAmart akan menukar produk yang sama atau mengembalikan dana sesuai harga produk tersebut, sesuai pilihan pembeli.','Produk yang sudah dibuka atau dikonsumsi tanpa cacat dari pabrik tidak dapat dikembalikan.'])],
  ['Cara dan waktu pengembalian dana',ul(['Pembayaran QRIS: dikembalikan ke rekening atau e-wallet atas nama pembeli, atau tunai bila pembeli memilih, paling lambat <b>3 hari kerja</b> setelah pengajuan disetujui.','Pembayaran tunai: dikembalikan tunai saat itu juga atau di pengambilan berikutnya.','Kasbon: tagihan dihapus atau dikurangi sesuai nilai produk.'])],
  ['Ajukan pengembalian',contactHtml()]])}
function vPrivasi(){return infoPage('Kebijakan Privasi','Data apa yang kami simpan dan untuk apa',[
  ['Data yang dikumpulkan',ul(['Nama dan bagian/line yang kamu isi saat memesan.','Isi pesanan, jam pengambilan, metode dan status pembayaran.','Data pembayaran QRIS diproses oleh penyedia pembayaran. KAmart tidak menyimpan nomor kartu, PIN, atau data rekening pembeli.'])],
  ['Penggunaan data','<p>Data dipakai hanya untuk memproses pesanan, menghubungi pembeli terkait pesanan, mencatat tagihan kasbon, dan menyusun rekap penjualan toko. Data tidak dijual atau dibagikan kepada pihak lain, kecuali kepada penyedia pembayaran untuk memproses transaksi atau bila diwajibkan oleh hukum.</p>'],
  ['Penyimpanan di perangkat','<p>Nama, bagian/line, dan daftar pesanan disimpan di browser HP kamu supaya tidak perlu diisi ulang. Kamu bisa menghapusnya dengan menghapus data situs di pengaturan browser.</p>'],
  ['Antrean pesanan','<p>Halaman Pesanan hanya menampilkan nama depan dan status pesanan yang masih diproses. Harga, isi lengkap, dan riwayat pesanan orang lain tidak ditampilkan.</p>'],
  ['Hak kamu','<p>Kamu dapat meminta data pesananmu dilihat, diperbaiki, atau dihapus dengan menghubungi kami.</p>'+contactHtml()]])}
function itemsText(o){return (o.items||[]).map(i=>i.qty+'× '+i.name+(i.bonus?' (bonus)':'')).join(', ')}
function stagePill(s){return ['ps-lav','ps-bad','ps-warn','ps-ok'][s]||'ps-lav'}
function plantHtml(){return '<div class="plant" aria-hidden="true">'+
 '<span style="left:46px;top:6px;width:24px;height:70px;border-radius:50%/60% 60% 40% 40%;background:linear-gradient(180deg,#8FD39E,#4E9F63)"></span>'+
 '<span style="left:20px;top:30px;width:24px;height:62px;border-radius:50%/60% 60% 40% 40%;background:linear-gradient(180deg,#9EDCAB,#57A86C);transform:rotate(-32deg)"></span>'+
 '<span style="left:70px;top:28px;width:24px;height:62px;border-radius:50%/60% 60% 40% 40%;background:linear-gradient(180deg,#9EDCAB,#4E9F63);transform:rotate(30deg)"></span>'+
 '<span style="left:20px;top:96px;width:72px;height:14px;border-radius:8px;background:#C98A5E"></span>'+
 '<span style="left:26px;top:106px;width:60px;height:52px;border-radius:4px 4px 20px 20px;background:linear-gradient(180deg,#E0A57B,#B9764B);box-shadow:0 12px 18px rgba(91,71,176,.25)"></span></div>'}
function illuHtml(){return '<div class="illu" aria-hidden="true">'+
 '<div style="left:30px;top:30px;width:170px;height:120px;border-radius:20px;background:linear-gradient(160deg,#fff,#F1ECFD);transform:rotate(-6deg);box-shadow:0 18px 30px rgba(91,71,176,.28);">'+
   ['#C6B5FF,#7C69CF:38:18','#FFC1D6,#D9467C:60:50','#BFD6FF,#4377DB:46:82','#CFC2FF,#6E5AC4:72:114'].map(s=>{const[g,h,l]=s.split(':');return '<span style="left:'+l+'px;bottom:16px;width:18px;height:'+h+'px;border-radius:9px;background:linear-gradient(180deg,'+g+')"></span>'}).join('')+'</div>'+
 '<div style="left:186px;top:8px;width:70px;height:70px;border-radius:50%;background:conic-gradient(#7C69CF 0 38%,#F79BB8 0 62%,#FFD27A 0 82%,#93B8F5 0);box-shadow:0 12px 22px rgba(91,71,176,.28)"><span style="left:18px;top:18px;width:34px;height:34px;border-radius:50%;background:#F4EFFE"></span></div>'+
 '<div style="left:200px;top:96px;width:42px;height:42px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFE7A0,#F2B230);color:#7A4C00;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 14px rgba(242,178,48,.45)"><span style="position:static">Rp</span></div>'+
 '<div style="left:6px;top:6px;background:#fff;border-radius:14px;padding:7px 10px;display:flex;gap:4px;box-shadow:0 8px 16px rgba(91,71,176,.18)"><span style="position:static;width:6px;height:6px;border-radius:50%;background:#A99BBF"></span><span style="position:static;width:6px;height:6px;border-radius:50%;background:#A99BBF"></span><span style="position:static;width:6px;height:6px;border-radius:50%;background:#A99BBF"></span></div></div>'}
function spark(vals,color){const max=Math.max(1,...vals),w=96,h=34;const pts=vals.map((v,i)=>(2+i*(w-4)/(vals.length-1)).toFixed(1)+','+(h-4-(v/max)*(h-8)).toFixed(1)).join(' ');return '<svg width="96" height="34" viewBox="0 0 96 34" aria-hidden="true"><polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'}

function vDashboard(){
  if(loading())return '<div class="card empty">Memuat data…</div>';
  const v=valid(),now=new Date(),mo=mk(now);
  const today=v.filter(o=>sameDay(o.createdAt));
  const month=v.filter(o=>mk(o.createdAt)===mo);
  const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return sum(v.filter(o=>sameDay(o.createdAt,d)),o=>+o.total||0)});
  const dayCnt=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return v.filter(o=>sameDay(o.createdAt,d)).length});
  const kb=unpaidKasbon();
  const low=sortedProducts().map(p=>({p,s:stockOf(p.kode)})).filter(x=>x.s<=(+x.p.min||0));
  const waiting=v.filter(o=>o.stage<2);
  const stats=[['lav','money','Penjualan hari ini',rp(sum(today,o=>+o.total||0)),'Bulan ini '+rp(sum(month,o=>+o.total||0)),days,'#6E5AC4'],
    ['pink','bag','Pesanan hari ini',String(today.length),waiting.length+' menunggu disiapkan',dayCnt,'#D9467C'],
    ['gold','trophy','Untung kotor bulan ini',rp(sum(month,profit)),'Dari '+month.length+' transaksi',null,'#C47A12'],
    ['blue','clock','Belum dibayar',rp(sum(kb,o=>+o.total||0)),new Set(kb.map(o=>o.customerName)).size+' pelanggan',null,'#4377DB']];
  const top={};month.forEach(o=>(o.items||[]).forEach(i=>{top[i.name]=(top[i.name]||0)+(+i.qty||0)}));
  const topA=Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,4),topT=sum(topA,x=>x[1]);
  const cols=['#6E5AC4','#F48FB1','#FFC85C','#7FA8F0'];let acc=0;
  const cg=topT?'conic-gradient('+topA.map((x,i)=>{const a=acc;acc+=x[1]/topT*100;return cols[i]+' '+a.toFixed(1)+'% '+acc.toFixed(1)+'%'}).join(',')+')':'#EEE8FB';
  return '<div class="stack">'+
  '<section class="hero">'+illuHtml()+'<div style="flex:1 1 260px;display:flex;flex-direction:column;gap:10px">'+
   (waiting[0]?'<span class="chip" style="align-self:flex-start"><i></i>Pesanan baru · '+esc(waiting[0].customerName)+'</span>':'')+
   '<h2>'+salam()+', Arbi!</h2><p>Ada <strong>'+waiting.length+' pesanan</strong> menunggu disiapkan dan <strong>'+low.length+' produk</strong> perlu restock.</p>'+
   '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-go="kasir">'+ic('plus',18,2.4)+'Buka Kasir</button><button class="btn2" data-go="pesanan">Lihat pesanan</button></div></div>'+plantHtml()+'</section>'+
  '<div class="grid g4">'+stats.map(s=>'<div class="stat b-'+s[0]+'"><div class="row"><span class="tile t-'+s[0]+'">'+ic(s[1],22)+'</span>'+(s[5]?spark(s[5],s[6]):'')+'</div><span class="lb">'+s[2]+'</span><span class="vl num">'+s[3]+'</span><span class="sm">'+s[4]+'</span></div>').join('')+'</div>'+
  perfCard()+
  '<div class="grid g3">'+
   '<div class="card"><div class="ch"><div><h3>Pesanan masuk</h3><p>Belum siap diambil</p></div><button class="btn3" data-go="pesanan">Semua</button></div>'+
     (waiting.length?waiting.slice(0,5).map(o=>'<div class="li"><span style="display:flex;gap:10px;align-items:center;min-width:0"><span class="av" style="background:'+avc(o.customerName)+'">'+esc(o.customerName[0]||'?')+'</span><span style="min-width:0"><b>'+esc(o.customerName)+'</b><br><span style="font-size:12px;color:var(--muted)">'+esc(itemsText(o))+'</span></span></span><span class="pill-s '+stagePill(o.stage)+'">'+STAGES[o.stage]+'</span></div>').join(''):'<div class="empty">Semua pesanan sudah siap.</div>')+'</div>'+
   '<div class="card"><div class="ch"><div><h3>Produk terlaris</h3><p>'+mLabel(mo)+'</p></div></div>'+
     (topA.length?'<div style="display:flex;flex-wrap:wrap;gap:18px;align-items:center"><div role="img" aria-label="'+esc(topA.map(x=>x[0]+' '+x[1]).join(', '))+'" style="width:124px;height:124px;border-radius:50%;background:'+cg+';display:flex;align-items:center;justify-content:center;box-shadow:0 12px 24px rgba(110,90,196,.2)"><span style="width:74px;height:74px;border-radius:50%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center"><b class="num" style="font-size:18px">'+topT+'</b><small style="font-size:10px;color:var(--muted)">terjual</small></span></div><div style="flex:1 1 130px;display:flex;flex-direction:column;gap:8px">'+topA.map((x,i)=>'<div style="display:flex;justify-content:space-between;gap:8px;font-size:13px"><span style="display:flex;align-items:center;gap:8px"><i style="width:10px;height:10px;border-radius:3px;background:'+cols[i]+'"></i>'+esc(x[0])+'</span><b class="num">'+x[1]+'</b></div>').join('')+'</div></div>':'<div class="empty">Belum ada penjualan bulan ini.</div>')+'</div>'+
   '<div class="card"><div class="ch"><div><h3>Stok menipis</h3><p>Di bawah stok minimum</p></div><button class="btn3" data-go="stok">Catat stok</button></div>'+
     (low.length?low.map(x=>'<div class="li"><span><b>'+esc(x.p.name)+'</b><br><span style="font-size:12px;color:var(--muted)">min. '+(+x.p.min||0)+' '+esc(x.p.unit||'')+'</span></span><span class="pill-s ps-bad num">sisa '+x.s+'</span></div>').join(''):'<div class="empty">Semua stok aman.</div>')+'</div>'+
  '</div></div>';
}

function vPesanan(){
  if(loading())return '<div class="card empty">Memuat pesanan…</div>';
  const v=valid().filter(o=>o.stage<3||sameDay(o.createdAt)||!o.paid).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
  const tiles=[['lav','inbox'],['pink','bag'],['gold','box'],['blue','check']];
  return '<div class="stack">'+notifSettings()+'<div class="grid g4">'+STAGES.map((s,i)=>{const l=v.filter(o=>o.stage===i);return '<div class="stat b-'+tiles[i][0]+'" style="flex-direction:row;align-items:center;gap:14px"><span class="tile t-'+tiles[i][0]+'">'+ic(tiles[i][1])+'</span><span><span class="vl num" style="font-size:20px">'+rp(sum(l,o=>+o.total||0))+'</span><br><span class="sm">'+s+' · '+l.length+' pesanan</span></span></div>'}).join('')+'</div>'+
  '<p style="margin:0;color:var(--muted);font-size:13px">Tekan "Lanjut" untuk memindahkan pesanan ke tahap berikutnya. Kolom Selesai menampilkan pesanan hari ini dan semua yang belum dibayar.</p>'+
  '<div class="kan"><div>'+STAGES.map((s,i)=>{const l=v.filter(o=>o.stage===i);return '<section class="col" aria-label="'+s+'"><div class="colh"><span><i class="dot" style="background:'+STAGE_COL[i]+'"></i>'+s+' <small style="color:var(--muted)">'+l.length+'</small></span><small class="num" style="color:var(--muted)">'+rp(sum(l,o=>+o.total||0))+'</small></div>'+
    (l.length?l.map(o=>orderCard(o,i)).join(''):'<div class="empty" style="padding:14px">Kosong</div>')+'</section>'}).join('')+'</div></div></div>';
}
function payPill(o){return o.pay==='Kasbon'?'ps-warn':o.pay==='QRIS'?'ps-blue':'ps-ok'}
function orderCard(o,i){
  const cf=S.confirm===o.id;
  return '<article class="oc"><div style="display:flex;justify-content:space-between;gap:8px"><b style="line-height:1.3">'+esc(itemsText(o))+'</b><small style="color:var(--muted);white-space:nowrap">'+esc(o.code||'')+'</small></div>'+
  '<span style="display:flex;align-items:center;gap:8px;font-size:12px;color:#54496A"><span class="av" style="width:26px;height:26px;font-size:11px;background:'+avc(o.customerName)+'">'+esc(o.customerName[0]||'?')+'</span>'+esc(o.customerName)+(o.customerLine?' · '+esc(o.customerLine):'')+'</span>'+
  '<div style="display:flex;justify-content:space-between;align-items:center"><b class="num" style="font-size:16px">'+rp(o.total)+'</b><span class="pill-s '+payPill(o)+'">'+(o.pay==='Kasbon'?'Kasbon':o.pay)+(o.paid?' · lunas':'')+'</span></div>'+
  (!o.paid&&o.stage===3?'<div class="banner b-pink" style="color:var(--bad);font-weight:600;padding:8px 12px">Sudah diambil, belum dibayar</div>':'')+
  '<div class="prog"><i style="width:'+((i+1)*25)+'%;background:'+STAGE_COL[i]+'"></i></div>'+
  '<div style="font-size:12px;color:var(--muted)">'+esc(o.slot||'Kasir')+(o.note?' · '+esc(o.note):'')+((o.diskon||[]).length?' · hemat '+rp(sum(o.diskon,d=>+d.nilai||0))+(o.voucher?' ('+esc(o.voucher)+')':''):'')+'</div>'+
  '<div style="display:flex;gap:6px;flex-wrap:wrap">'+
   (i===2&&!o.paid&&o.pay!=='Kasbon'?'<button class="btn3" data-donepaid="'+o.id+'">Diambil &amp; lunas</button><button class="btn3 dang" data-adv="'+o.id+'">Diambil, belum bayar</button>'
     :i<3?'<button class="btn3" data-adv="'+o.id+'">Lanjut ›</button>':'')+
   (!o.paid&&o.pay!=='Kasbon'&&i!==2?'<button class="btn3" data-paid="'+o.id+'">Tandai lunas</button>':'')+
   (i<3?(cf?'<button class="btn3 dang" data-cancel="'+o.id+'">Ya, batalkan</button>':'<button class="btn3 dang" data-ask="'+o.id+'">Batal</button>'):'')+
  '</div></article>';
}

function vKasir(){
  if(loading())return '<div class="card empty">Memuat produk…</div>';
  if(S.ktab==='tutup')return vTutupKasir();
  {const pl=pays('kasir').map(b=>b.kode);if(!pl.includes(S.k.method))S.k.method=pl[0]||''}
  const k=S.k,lines=cartLines(k.cart),hp=priceFor(lines,'k'),total=hp.total,cnt=sum(lines,l=>l.qty);
  const rokok=lines.some(l=>!catOnline((prod(l.kode)||{}).cat));
  const change=(+k.cash||0)-total;
  const can=cnt>0&&!S.busy&&(k.method==='Tunai'?change>=0:k.method==='Kasbon'?!!k.buyer:true);
  return kasirTabs()+'<div class="shop"><div class="stack"><div class="kt">'+sortedProducts().map(p=>{const q=k.cart[p.kode]||0,st=stockOf(p.kode);
    return '<button class="ktile'+(q?' on':'')+(st<=0?' habis':'')+'" data-kadd="'+esc(p.kode)+'"'+(st<=0?' disabled':st-q<=0?' disabled style="opacity:.55"':'')+' aria-label="Tambah '+esc(p.name)+'"><span style="display:flex;justify-content:space-between;width:100%;align-items:center"><small>'+esc(p.kode)+(catOnline(p.cat)?'':' · 21+')+'</small>'+(q?'<span class="n">'+q+'</span>':'')+'</span>'+(p.img?'<img class="kimg" src="'+esc(p.img)+'" alt="">':'')+'<b style="line-height:1.25">'+esc(p.name)+'</b><span style="display:flex;justify-content:space-between;width:100%;font-size:12px"><b class="num" style="color:var(--primary-ink);font-size:14px">'+rp(p.jual)+'</b>'+(st<=0?'<span class="khabis">Stok habis</span>':'<span style="color:var(--muted)">sisa '+st+'</span>')+'</span>'+(st<=0?'<span class="stamp" aria-hidden="true">HABIS</span>':'')+'</button>'}).join('')+'</div>'+
    (S.products.length?'':'<div class="card empty">Belum ada produk. Tambahkan di menu Produk.</div>')+'</div>'+
  '<aside class="card sticky stack" style="gap:12px" aria-label="Transaksi"><div class="ch" style="margin:0"><div><h3>Transaksi</h3><p>'+cnt+' item</p></div>'+(cnt?'<button class="btn3" data-act="kclear">Kosongkan</button>':'')+'</div>'+
   (lines.length?'<div>'+hp.items.map(l=>'<div class="li"><span style="display:flex;align-items:center;gap:6px">'+(l.bonus?'<span class="pill-s ps-ok">Bonus</span>':'<button class="qb m" style="width:32px;height:32px" data-kdec="'+esc(l.kode)+'" aria-label="Kurangi '+esc(l.name)+'">−</button>')+l.qty+'× '+esc(l.name)+'</span><span class="num"'+(l.bonus?' style="color:var(--ok);font-weight:700"':'')+'>'+(l.bonus?'Gratis':rp(l.qty*l.price))+'</span></div>').join('')+'</div>':'<div class="empty" style="padding:10px">Ketuk produk untuk menambah.</div>')+
   (lines.length&&(hp.diskon.length||vch('k').code||actPromos().some(p=>p.tipe==='voucher'))?'<div class="stack" style="gap:4px">'+(hp.diskon.length?sumRows(hp):'')+voucherBox('k',hp)+'</div>':'')+
   '<div class="tot"><span>Total</span><span class="num">'+rp(total)+'</span></div>'+
   '<label class="f">Pembeli<select class="in" id="k-buyer" data-bind="k.buyer" data-live="1"><option value="">Pembeli umum</option>'+S.customers.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(c=>'<option value="'+esc(c.name)+'"'+(k.buyer===c.name?' selected':'')+'>'+esc(c.name)+(c.line?' · '+esc(c.line):'')+'</option>').join('')+'</select></label>'+
   '<div class="seg" role="radiogroup" aria-label="Metode bayar">'+pays('kasir').map(b=>b.kode).map(m=>'<button type="button" class="sg'+(k.method===m?' on':'')+'" role="radio" aria-checked="'+(k.method===m)+'" data-kpay="'+esc(m)+'">'+esc(m==='Kasbon'?'Kasbon':payLabel(m))+'</button>').join('')+'</div>'+
   (k.method==='Tunai'?'<div class="seg">'+[['Uang pas',total],['20rb',20000],['50rb',50000],['100rb',100000]].map(([l,v])=>'<button type="button" class="sg'+(+k.cash===v&&cnt?' on':'')+'" data-cash="'+v+'">'+l+'</button>').join('')+'</div>'+
     '<label class="f">Uang diterima<input class="in num" id="k-cash" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" data-num="1" data-bind="k.cash" data-live="1" value="'+(+k.cash||'')+'"></label>'+
     '<div class="banner '+(change>=0?'b-lav':'b-pink')+'" style="display:flex;justify-content:space-between;font-weight:700"><span>'+(change>=0?'Kembalian':'Kurang')+'</span><span class="num">'+rp(Math.abs(change))+'</span></div>'
    :k.method==='QRIS'?(total>0?qrisBlock(total)+'<div class="banner b-blue">Minta pembeli scan, tekan Bayar setelah notifikasi dana masuk di DANA.</div>':'<div class="banner b-blue">Pilih produk dulu untuk menampilkan QRIS.</div>')
    :k.method!=='Kasbon'?'<div class="banner b-blue">'+esc(payInfo(k.method).ket||'Pastikan pembayaran sudah diterima, lalu tekan Bayar.')+'</div>':'<div class="banner b-gold" style="color:var(--warn)">'+(k.buyer?'Dicatat sebagai kasbon atas nama '+esc(k.buyer)+'. Kasbon berjalan: '+rp(sum(unpaidKasbon().filter(o=>o.customerName===k.buyer),o=>+o.total||0))+'.':'Pilih nama pembeli untuk mencatat kasbon.')+'</div>')+
   (rokok?'<div style="font-size:12px;font-weight:600;color:var(--bad)">Ada produk khusus kasir (21+) di transaksi ini: pastikan umur pembeli.</div>':'')+
   '<button class="btn" data-act="kpay"'+(can?'':' disabled')+'>Bayar '+rp(total)+'</button></aside></div>';
}

function vProduk(){
  if(loading())return '<div class="card empty">Memuat produk…</div>';
  const list=sortedProducts();const f=S.pf;
  return '<div class="stack">'+
   (f?'<form id="pForm" class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>'+(f._edit?'Ubah produk':'Produk baru')+'</h3><p>Harga dalam rupiah</p></div><button type="button" class="btn3" data-act="pclose">Tutup</button></div><div class="fg">'+
     '<label class="f">Kode<input class="in" id="p-kode" data-bind="pf.kode" required value="'+esc(f.kode)+'"'+(f._edit?' readonly':'')+' placeholder="P003"></label>'+
     '<label class="f" style="grid-column:span 2">Nama produk<input class="in" id="p-name" data-bind="pf.name" required value="'+esc(f.name)+'"></label>'+
     '<label class="f">Kategori<select class="in" id="p-cat" data-bind="pf.cat">'+[...new Set([...M().kategori.map(c=>c.nama),f.cat].filter(Boolean))].map(c=>'<option'+(f.cat===c?' selected':'')+'>'+esc(c)+'</option>').join('')+'</select></label>'+
     '<label class="f">Satuan<input class="in" id="p-unit" data-bind="pf.unit" list="satuanList" value="'+esc(f.unit)+'" placeholder="cup, bks, pcs"></label>'+dl('satuanList',M().satuan)+
     (f._edit&&hasStockin(f.kode)?'<label class="f">Harga modal (otomatis)<input class="in num" id="p-modal" readonly value="'+esc(rp(f.modal))+'" title="Rata-rata dari harga beli di Stok masuk"></label>':'<label class="f">Harga modal awal<input class="in num" id="p-modal" type="number" min="0" data-bind="pf.modal" required value="'+esc(f.modal)+'"></label>')+
     '<label class="f">Harga jual<input class="in num" id="p-jual" type="number" min="0" data-bind="pf.jual" required value="'+esc(f.jual)+'"></label>'+
     '<label class="f">Stok minimum<input class="in num" id="p-min" type="number" min="0" data-bind="pf.min" value="'+esc(f.min)+'"></label>'+
     '<label class="f" style="flex-direction:row;align-items:center;gap:8px;align-self:end;height:44px"><input type="checkbox" id="p-online" data-bind="pf.online"'+(f.online?' checked':'')+(catOnline(f.cat)?'':' disabled')+'> Tampil di toko online</label>'+
     '</div>'+(f._edit&&hasStockin(f.kode)?'<small style="color:var(--muted)">Harga modal = rata-rata harga beli dari Stok masuk, dihitung otomatis. Untuk mengubahnya, betulkan harga beli di halaman Stok.</small>':'<small style="color:var(--muted)">Setelah ada catatan Stok masuk, harga modal otomatis mengikuti rata-rata harga beli.</small>')+
     '<div class="imgpick"><div class="imgbox">'+(f.img?'<img src="'+esc(f.img)+'" alt="Foto '+esc(f.name)+'">':ic('box',30))+'</div><div class="stack" style="gap:6px"><span style="font-size:12px;font-weight:600;color:#54496A">Foto produk</span><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn2" data-act="pimgpick"'+(S.imgBusy?' disabled':'')+'>'+(S.imgBusy?'Memproses foto…':(f.img?'Ganti foto':'Pilih foto'))+'</button>'+(f.img?'<button type="button" class="btn3 dang" data-act="pimgdel">Hapus foto</button>':'')+'</div><small style="color:var(--muted)">Dari galeri atau kamera HP. Otomatis diperkecil.</small></div></div>'+(catOnline(f.cat)?'':'<div class="banner b-gold" style="color:var(--warn)">Kategori '+esc(f.cat)+' tidak ditampilkan di toko online (khusus kasir, verifikasi umur). Atur di Kelola Master.</div>')+'<div><button class="btn" type="submit">Simpan produk</button></div></form>'
     :'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="pnew">'+ic('plus',18,2.4)+'Tambah produk</button></div>')+
   '<div class="card"><div class="tbl"><table><thead><tr><th>Produk</th><th>Kategori</th><th>Modal</th><th>Jual</th><th>Untung</th><th>Sisa stok</th><th>Status</th><th>Online</th><th></th></tr></thead><tbody>'+
   (list.length?list.map(p=>{const st=stockOf(p.kode),low=st<=(+p.min||0),u=(+p.jual||0)-(+p.modal||0);
     return '<tr><td><span style="display:flex;align-items:center;gap:10px">'+prodTile(p)+'<span><b>'+esc(p.name)+'</b><br><small style="color:var(--muted)">'+esc(p.kode)+'</small></span></span></td><td>'+esc(p.cat)+'</td><td class="num">'+rp(p.modal)+'</td><td class="num">'+rp(p.jual)+'</td><td class="num" style="color:var(--ok);font-weight:700">'+rp(u)+(p.jual?' · '+Math.round(u/p.jual*100)+'%':'')+'</td><td class="num"><b>'+st+'</b> '+esc(p.unit||'')+' <small style="color:var(--muted)">min '+(+p.min||0)+'</small></td><td><span class="pill-s '+(low?'ps-bad':'ps-ok')+'">'+(low?'Restock':'Aman')+'</span></td><td>'+(!catOnline(p.cat)?'<small style="color:var(--muted)">Kasir saja</small>':'<button class="btn3" data-online="'+esc(p.kode)+'">'+(p.online!==false?'Tampil':'Disembunyikan')+'</button>')+'</td><td><button class="btn3" data-edit="'+esc(p.kode)+'">Ubah</button></td></tr>'}).join('')
    :'<tr><td colspan="9" class="empty">Belum ada produk.</td></tr>')+'</tbody></table></div></div></div>';
}

function vStok(){
  if(loading())return '<div class="card empty">Memuat stok…</div>';
  const f=S.sf,list=sortedProducts();if(!f.kode&&list[0]){f.kode=list[0].kode;if(!f.harga)f.harga=list[0].modal}
  const all=S.stockin.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))||String(b.id).localeCompare(String(a.id),undefined,{numeric:true})),rows=all.slice(0,S.siLimit||40),ed=f.editId?S.stockin.find(x=>String(x.id)===String(f.editId)):null;
  const mo=mk(new Date());
  if(S.stab==='opname')return stokTabs()+opnameView();
  return stokTabs()+'<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:start">'+
  '<form id="sForm" class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>'+(ed?'Ubah catatan belanja':'Catat belanja ke grosir')+'</h3><p>'+(ed?'Stok produk ikut menyesuaikan':'Stok bertambah otomatis')+'</p></div>'+(ed?'<button type="button" class="btn3" data-act="sicancel">Batal</button>':'')+'</div><div class="fg">'+
   '<label class="f">Tanggal<input class="in" id="s-date" type="date" data-bind="sf.date" required value="'+esc(f.date)+'"></label>'+
   '<label class="f">Produk<select class="in" id="s-kode" data-bind="sf.kode" data-live="1">'+list.map(p=>'<option value="'+esc(p.kode)+'"'+(f.kode===p.kode?' selected':'')+'>'+esc(p.name)+'</option>').join('')+'</select></label>'+
   '<label class="f">Jumlah<input class="in num" id="s-qty" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" data-num="1" required data-bind="sf.qty" data-live="1" value="'+esc(f.qty)+'"></label>'+
   '<label class="f">Harga beli / unit<input class="in num" id="s-harga" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" data-num="1" required data-bind="sf.harga" data-live="1" value="'+esc(f.harga)+'"></label>'+
   '<label class="f" style="grid-column:1/-1">Tempat beli<input class="in" id="s-tempat" data-bind="sf.tempat" value="'+esc(f.tempat)+'" placeholder="Nama grosir / agen"></label>'+
   '<div class="f" style="grid-column:1/-1"><span>Dibayar dari</span><div class="seg" role="radiogroup" aria-label="Dibayar dari">'+[['laci','Laci kasir'],['','Uang lain']].map(([v,t])=>'<button type="button" role="radio" class="sg'+((f.sumber||'')===v?' on':'')+'" aria-checked="'+((f.sumber||'')===v)+'" data-sfsrc="'+v+'">'+t+'</button>').join('')+'</div>'+
   '<small style="color:var(--muted)">'+(f.sumber==='laci'?'Total belanja otomatis dikurangkan di Tutup kasir tanggal ini.':'Tidak memengaruhi uang di laci (mis. uang pribadi / transfer).')+'</small></div></div>'+
   '<small style="color:var(--muted)">Harga modal produk otomatis menjadi rata-rata dari sisa stok dan belanja ini.</small>'+
   '<div class="banner b-lav" style="display:flex;justify-content:space-between;font-weight:700"><span>Total belanja</span><span class="num">'+rp((+f.qty||0)*(+f.harga||0))+'</span></div>'+
   '<div><button class="btn" type="submit"'+(list.length&&!S.busy?'':' disabled')+'>'+(ed?'Simpan perubahan':'Simpan &amp; tambah stok')+'</button></div></form>'+
  '<div class="card"><div class="ch"><div><h3>Riwayat belanja</h3><p>'+mLabel(mo)+': '+rp(sum(S.stockin.filter(x=>String(x.date).slice(0,7)===mo),x=>(+x.qty||0)*(+x.harga||0)))+'</p></div></div>'+
   (rows.length?rows.map(x=>{const p=prod(x.kode),id=esc(String(x.id)),on=ed&&String(ed.id)===String(x.id),cf=S.sidel===String(x.id);
     return '<div class="li sirow'+(on?' on':'')+'"><span style="min-width:0"><b>'+esc(p?p.name:x.kode)+' · +'+(+x.qty||0)+'</b><br><small style="color:var(--muted)">'+esc(x.date)+(x.tempat?' · '+esc(x.tempat):'')+' · '+rp(x.harga)+'/unit'+(x.sumber==='laci'?' · <span style="color:var(--primary-ink);font-weight:700">dari laci</span>':'')+'</small></span>'+
       '<span style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><b class="num">'+rp((+x.qty||0)*(+x.harga||0))+'</b><span style="display:flex;gap:6px">'+
       '<button type="button" class="btn3 sm" data-siedit="'+id+'"'+(on?' disabled':'')+'>Ubah</button>'+(cf?'<button type="button" class="btn3 sm dang" data-sidelok="'+id+'">Ya, hapus</button>':'<button type="button" class="btn3 sm dang" data-sidel="'+id+'">Hapus</button>')+'</span></span></div>'}).join('')+
     (all.length>rows.length?'<div style="text-align:center;padding-top:10px"><button type="button" class="btn2" data-act="simore">Tampilkan '+Math.min(40,all.length-rows.length)+' lagi</button></div>':'')
    :'<div class="empty">Belum ada catatan belanja.</div>')+'</div></div>';
}

function vKasbon(){
  if(loading())return '<div class="card empty">Memuat kasbon…</div>';
  const all=valid().filter(o=>o.pay==='Kasbon'||(o.stage===3&&!o.paid));
  const by={};all.forEach(o=>{const n=o.customerName;(by[n]=by[n]||{name:n,line:o.customerLine||'',open:0,paid:0,n:0,first:null});if(o.paid)by[n].paid+=+o.total||0;else{by[n].open+=+o.total||0;by[n].n++;if(!by[n].first||o.createdAt<by[n].first)by[n].first=o.createdAt}});
  let rows=Object.values(by).sort((a,b)=>b.open-a.open);
  if(S.kfilter==='Belum')rows=rows.filter(r=>r.open>0);if(S.kfilter==='Lunas')rows=rows.filter(r=>r.open===0);
  const open=sum(Object.values(by),r=>r.open),openN=Object.values(by).filter(r=>r.open>0).length;
  const paidMo=sum(all.filter(o=>o.paid&&mk(o.paidAt||o.createdAt)===mk(new Date())),o=>+o.total||0);
  return '<div class="stack"><div class="grid g4">'+
   [['blue','clock',rp(open),'Belum dibayar'],['lav','users',String(openN),'Pelanggan belum bayar'],['gold','money',rp(paidMo),'Kasbon lunas bulan ini'],['pink','check',String(S.customers.length),'Pelanggan terdaftar']].map(s=>'<div class="stat b-'+s[0]+'" style="flex-direction:row;align-items:center;gap:14px"><span class="tile t-'+s[0]+'">'+ic(s[1])+'</span><span><span class="vl num" style="font-size:20px">'+s[2]+'</span><br><span class="sm">'+s[3]+'</span></span></div>').join('')+'</div>'+
  '<div class="card"><div class="ch"><div class="seg">'+['Belum','Lunas','Semua'].map(x=>'<button class="sg'+(S.kfilter===x?' on':'')+'" data-kf="'+x+'">'+x+'</button>').join('')+'</div></div><div class="tbl"><table><thead><tr><th>Pelanggan</th><th>Bagian</th><th>Transaksi belum lunas</th><th>Belum dibayar</th><th>Sejak</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'+
   (rows.length?rows.map(r=>'<tr><td><span style="display:flex;align-items:center;gap:10px"><span class="av" style="background:'+avc(r.name)+'">'+esc(r.name[0]||'?')+'</span><b>'+esc(r.name)+'</b></span></td><td>'+esc(r.line)+'</td><td class="num">'+r.n+'</td><td class="num"><b>'+rp(r.open)+'</b></td><td>'+(r.first?dLabel(r.first).split(',')[0]:'–')+'</td><td><span class="pill-s '+(r.open?'ps-bad':'ps-ok')+'">'+(r.open?'Belum dibayar':'Lunas')+'</span></td><td style="white-space:nowrap">'+(r.open?'<button class="btn3" data-lunas="'+esc(r.name)+'">Tandai lunas</button> <button class="btn3" data-copy="'+esc(r.name)+'">Salin pengingat</button>':'')+'</td></tr>').join('')
    :'<tr><td colspan="7" class="empty">Tidak ada data untuk filter ini.</td></tr>')+'</tbody></table></div></div>'+
  '<form id="cForm" class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>Daftarkan pelanggan</h3><p>Hanya pelanggan terdaftar yang bisa bayar pas gajian</p></div></div><div class="fg">'+
   '<label class="f">Nama<input class="in" id="c-name" data-bind="cf.name" required value="'+esc(S.cf.name)+'"></label>'+
   '<label class="f">Bagian / line<input class="in" id="c-line" data-bind="cf.line" list="bagianList3" value="'+esc(S.cf.line)+'"></label>'+dl('bagianList3',M().bagian)+
   '<label class="f">No. WhatsApp<input class="in" id="c-wa" data-bind="cf.wa" inputmode="tel" value="'+esc(S.cf.wa)+'"></label></div>'+
   '<div><button class="btn" type="submit">Simpan pelanggan</button></div>'+
   (S.customers.length?'<div style="display:flex;flex-wrap:wrap;gap:8px">'+S.customers.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(c=>'<span class="pill-s ps-lav">'+esc(c.name)+(c.line?' · '+esc(c.line):'')+'</span>').join('')+'</div>':'')+'</form></div>';
}

function vRekap(){
  if(loading())return '<div class="card empty">Memuat rekap…</div>';
  const v=valid();const months=[...new Set([mk(new Date()),...v.map(o=>mk(o.createdAt))])].sort().reverse();
  const mo=S.month,list=v.filter(o=>mk(o.createdAt)===mo);
  const omzet=sum(list,o=>+o.total||0),untung=sum(list,profit),terima=sum(list.filter(o=>o.paid),o=>+o.total||0),kb=sum(list.filter(o=>!o.paid),o=>+o.total||0);
  const belanja=sum(S.stockin.filter(x=>String(x.date).slice(0,7)===mo),x=>(+x.qty||0)*(+x.harga||0));
  const peng=sum((S.expenses||[]).filter(x=>String(x.date).slice(0,7)===mo),x=>+x.jumlah||0),susut=-adjNetMo(mo),kas=sum((S.cashclose||[]).filter(x=>String(x.date).slice(0,7)===mo),x=>+x.selisih||0),bersih=untung-peng-susut+kas;
  const ps=S.products.map(p=>({p,st:stockOf(p.kode)})),restock=ps.filter(x=>x.st<=(+x.p.min||0)).length;
  const ar=arusStok(mo,belanja,omzet-untung);ar.omzet=omzet;ar.susutPct=omzet&&ar.adj<0?(-ar.adj)/omzet*100:0;const nilaiStok=ar.akhir,sisaQty=ar.qtyAkhir;
  const wk=[0,0,0,0,0];list.forEach(o=>{wk[Math.min(4,Math.floor((new Date(o.createdAt).getDate()-1)/7))]+=+o.total||0});
  const max=Math.max(1,...wk),g=['#C6B5FF,#7C69CF','#FFC1D6,#D9467C','#FFE09A,#E0901F','#BFD6FF,#4377DB','#CFC2FF,#6E5AC4'];
  const per={};list.forEach(o=>(o.items||[]).forEach(i=>{const r=per[i.kode]=per[i.kode]||{kode:i.kode,name:i.name,q:0,om:0,un:0,md:0};r.q+=+i.qty||0;r.om+=(+i.qty||0)*(+i.price||0);r.un+=(+i.qty||0)*((+i.price||0)-(+i.modal||0));r.md+=(+i.qty||0)*(+i.modal||0)}));
  const perA=Object.values(per).sort((a,b)=>b.om-a.om);
  return '<div class="stack"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between"><label class="f" style="flex-direction:row;align-items:center;gap:10px">Bulan<select class="in" id="r-month" data-bind="month" data-live="1" style="width:auto">'+months.map(m=>'<option value="'+m+'"'+(m===mo?' selected':'')+'>'+mLabel(m)+'</option>').join('')+'</select></label></div>'+
  '<div class="grid g3 rkstats">'+[['lav','money','Penjualan',rp(omzet),list.length+' transaksi'],['gold','trophy','Untung kotor',rp(untung),omzet?'margin '+Math.round(untung/omzet*100)+'%':'–'],['mint','chart','Untung bersih',(bersih<0?'−':'')+rp(Math.abs(bersih)),'kotor − pengeluaran '+rp(peng)+(susut?(susut>0?' − susut ':' + lebih opname ')+rp(Math.abs(susut)):'')+(kas?(kas<0?' − kas kurang ':' + kas lebih ')+rp(Math.abs(kas)):'')],['blue','check','Uang diterima',rp(terima),'Belum dibayar '+rp(kb)],['pink','down','Belanja stok',rp(belanja),'dari catatan stok masuk'],['lav','box','Nilai sisa stok',rp(nilaiStok),'harga modal · '+sisaQty+' pcs'+(ar.kini?' · '+restock+' perlu restock':' · akhir '+mLabel(mo))]].map(s=>'<div class="stat b-'+s[0]+'"><div class="row"><span class="tile t-'+s[0]+'">'+ic(s[1],22)+'</span></div><span class="lb">'+s[2]+'</span><span class="vl num">'+s[3]+'</span><span class="sm">'+s[4]+'</span></div>').join('')+'</div>'+
  arusCard(mo,ar)+'<div class="grid g3"><div class="card"><div class="ch"><div><h3>Penjualan per minggu</h3><p>'+mLabel(mo)+'</p></div></div><div class="bars" role="img" aria-label="'+wk.map((x,i)=>'Minggu '+(i+1)+' '+rp(x)).join(', ')+'">'+wk.map((x,i)=>'<div><span class="num">'+(x?Math.round(x/1000)+'rb':'0')+'</span><b style="height:'+Math.round(x/max*120)+'px;background:linear-gradient(180deg,'+g[i]+')"></b><small>Mg '+(i+1)+'</small></div>').join('')+'</div></div>'+
  '<div class="card"><div class="ch"><div><h3>Per produk</h3><p>Jumlah, omzet, untung</p></div></div>'+(perA.length?perA.map(r=>{const am=r.q?Math.round(r.md/r.q):0,pm=(prod(r.kode)||{}).modal;
    return '<div class="li"><span style="min-width:0"><b>'+esc(r.name)+'</b><br><small style="color:var(--muted)">'+r.q+' terjual · modal '+(hasStockin(r.kode)?'rata-rata ':'')+rp(am)+'/unit</small>'+(pm!=null&&+pm!==am&&!hasStockin(r.kode)?'<br><small style="color:var(--warn)">Modal produk sekarang '+rp(pm)+'</small>':'')+'</span>'+
    '<span style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:4px"><b class="num">'+rp(r.om)+'</b><small class="num" style="color:'+(r.un<0?'var(--bad)':'var(--ok)')+'">'+(r.un<0?'−':'+')+rp(Math.abs(r.un))+'</small><button type="button" class="btn3 sm" data-remodal="'+esc(r.kode)+'">Koreksi modal</button></span></div>'}).join(''):'<div class="empty">Belum ada penjualan di bulan ini.</div>')+'</div></div>'+expenseCard(mo,peng)+'</div>';
}

/* ---------- admin login ---------- */
function isAuthed(){return !!S.token}
function vLogin(){const L=S.lg;
  return '<div class="login"><img src="logo.png" alt="KAmart" width="120" height="120" style="border-radius:50%;box-shadow:0 18px 36px rgba(91,71,176,.3)"><div><h1>Masuk Admin</h1><p class="lg-p">Khusus pemilik toko</p></div>'+
  '<form id="lgForm" class="stack" style="gap:12px;width:100%"><label class="f">Username<input class="in" id="lg-user" data-bind="lg.user" autocomplete="username" autocapitalize="off" required value="'+esc(L.user)+'"></label>'+
  '<label class="f">Password<input class="in" id="lg-pass" type="password" data-bind="lg.pass" autocomplete="current-password" required value="'+esc(L.pass)+'"></label>'+
  (L.err?'<div class="banner b-pink" role="alert" style="color:var(--bad);font-weight:600">'+esc(L.err)+'</div>':'')+
  '<button class="btn" type="submit" style="width:100%"'+(S.busy?' disabled':'')+'>'+(S.busy?'Memeriksa…':'Masuk')+'</button></form>'+
  '<button class="btn2" data-go="toko" style="justify-content:center;width:100%">Kembali ke toko</button></div>'}
async function doLogin(){const L=S.lg;S.busy=true;L.err='';render();
  try{const r=await api('POST','/api/auth/login',{username:L.user.trim(),password:L.pass});S.token=r.token;ls.set('token',r.token);S.lg={user:'',pass:'',err:''};S.busy=false;toast('Selamat datang!');await loadAdmin()}
  catch(e){L.err=e.message;L.pass='';S.busy=false;render()}}

const RENDER={rutin:vRutin,promo:vPromo,riwayat:vRiwayat,master:vMaster,tentang:vTentang,syarat:vSyarat,refund:vRefund,privasi:vPrivasi,toko:vToko,keranjang:vKeranjang,pesananku:vPesananku,akun:vAkun,dashboard:vDashboard,pesanan:vPesanan,kasir:vKasir,produk:vProduk,stok:vStok,kasbon:vKasbon,rekap:vRekap};
function render(){
  notifyNew();
  if(isAuthed()&&S.view==='pesanan'&&(S.loaded.orders||S.loaded.admin))markSeen();
  {const u=unseenOrders().length;document.title=(u?'('+u+') ':'')+'KAmart'}
  const a=document.activeElement,fid=a&&a.id,s1=a&&a.selectionStart,s2=a&&a.selectionEnd;
  const locked=VIEWS.find(x=>x.id===S.view).g==='Admin'&&!isAuthed();
  document.body.classList.toggle('loginmode',locked);
  renderShell();
  document.getElementById('view').innerHTML=(S.netErr?'<div class="banner b-gold" role="status" style="color:var(--warn);margin-bottom:14px">'+esc(S.netErr)+'</div>':'')+(locked?vLogin():RENDER[S.view]());
  document.getElementById('modal').innerHTML=S.receipt?receiptHtml():S.placed?placedHtml():S.qrisFor?qrisModalHtml():S.poster?posterHtml():S.remodal?remodalHtml():S.xp?exportHtml():'';restoreBanner();
  document.getElementById('notif').innerHTML=notifHtml();
  if(fid){const el=document.getElementById(fid);if(el&&el!==document.activeElement){el.focus({preventScroll:true});try{if(s1!=null)el.setSelectionRange(s1,s2)}catch(e){}}}
}
function receiptText(o){return 'KAmart · '+o.code+'\n'+dLabel(o.createdAt)+'\n'+(o.items||[]).map(i=>i.qty+'x '+i.name+'  '+rp(i.qty*i.price)).join('\n')+'\nTotal: '+rp(o.total)+'\nBayar: '+(o.pay==='Kasbon'?'Kasbon (ditagih saat gajian)':o.pay)+(o.pay==='Tunai'?'\nDiterima: '+rp(o.cashIn)+'\nKembalian: '+rp(o.change):'')+'\nTerima kasih!'}
function receiptHtml(){const o=S.receipt;return '<div class="modal" role="dialog" aria-modal="true" aria-label="Transaksi berhasil"><div class="box"><div style="display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center"><span class="tile t-lav" style="border-radius:50%">'+ic('check',24,2.6)+'</span><b style="font-size:18px">Transaksi berhasil</b><small style="color:var(--muted)">'+esc(o.code)+' · '+dLabel(o.createdAt)+' · '+esc(o.customerName)+'</small></div>'+
 '<div style="border-block:1px dashed #DCCDE0;padding:10px 0">'+(o.items||[]).map(i=>'<div class="li" style="border:0;padding:3px 0"><span>'+i.qty+'× '+esc(i.name)+(i.bonus?' <small style="color:var(--ok);font-weight:700">bonus</small>':'')+'</span><span class="num">'+(i.bonus?'Gratis':rp(i.qty*i.price))+'</span></div>').join('')+'</div>'+
 ((o.diskon||[]).length?sumRows({subtotal:o.subtotal==null?o.total:o.subtotal,diskon:o.diskon}):'')+'<div class="li" style="border:0;font-weight:800"><span>Total</span><span class="num">'+rp(o.total)+'</span></div>'+
 (o.pay==='Tunai'?'<div class="li" style="border:0"><span>Diterima</span><span class="num">'+rp(o.cashIn)+'</span></div><div class="li" style="border:0"><span>Kembalian</span><span class="num">'+rp(o.change)+'</span></div>':'<div class="li" style="border:0"><span>Metode</span><span>'+(o.pay==='Kasbon'?'Kasbon · belum dibayar':esc(payLabel(o.pay)))+'</span></div>')+
 '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn2" data-act="copyReceipt" style="justify-content:center">Salin struk</button><button class="btn" data-act="closeReceipt">Transaksi baru</button></div><textarea id="rcpt" class="in" rows="4" readonly hidden>'+esc(receiptText(o))+'</textarea></div></div>'}

/* ---------- QRIS (DANA · KAmart, Sembako) ---------- */
const QRIS_STATIC=window.KAMART_QRIS||'00020101021126570011ID.DANA.WWW011893600915303719908802090371990880303UMI51440014ID.CO.QRIS.WWW0215ID10266444066170303UMI5204549953033605802ID5915KAmart, Sembako6012Kab. Kebumen610554314630447DB';
const QRIS_NAME='KAmart, Sembako',QRIS_NMID='ID1026644406617';
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')}
// Ubah QRIS statis menjadi QRIS dengan nominal (tag 54) dan hitung ulang CRC.
function qrisAmount(base,amount){const tl=[];let i=0;while(i<base.length){const t=base.substr(i,2),l=parseInt(base.substr(i+2,2),10);tl.push([t,base.substr(i+4,l)]);i+=4+l}
  const out=tl.filter(([t])=>t!=='63'&&t!=='54').map(([t,v])=>t==='01'?['01','12']:[t,v]);
  let k=out.findIndex(([t])=>t>'54');if(k<0)k=out.length;out.splice(k,0,['54',String(Math.round(amount))]);
  const s=out.map(([t,v])=>t+String(v.length).padStart(2,'0')+v).join('')+'6304';return s+crc16(s)}
function qrisSvg(text){try{if(typeof qrcode!=='function')return '';const q=qrcode(0,'M');q.addData(text);q.make();return q.createSvgTag({cellSize:6,margin:3,scalable:true,alt:'QRIS KAmart'})}catch(e){return ''}}
function qrisBlock(amount){
  const svg=amount>0&&!S.qrisStatic?qrisSvg(qrisAmount(QRIS_STATIC,amount)):'';
  return '<div class="qris"><div class="qhead"><b>QRIS</b><span>'+esc(QRIS_NAME)+'</span></div>'+
   (svg?'<div class="qcode" role="img" aria-label="QRIS '+rp(amount)+'">'+svg+'</div>':'<img class="qimg" src="qris-kamart.jpg" alt="QRIS KAmart">')+
   '<div class="qamt num">'+rp(amount)+'</div>'+
   '<small style="font-size:12px">'+(svg?'Nominal sudah terisi otomatis. Scan pakai DANA, GoPay, OVO, ShopeePay, atau m-banking.':'Scan lalu masukkan nominal <b>'+rp(amount)+'</b>.')+'</small>'+
   '<small style="color:var(--muted);font-size:11px">NMID '+QRIS_NMID+'</small>'+
   '<button type="button" class="linkbtn" data-act="qristoggle" style="font-size:12px">'+(S.qrisStatic?'Pakai QRIS dengan nominal otomatis':'Nominal tidak muncul? Pakai QRIS biasa')+'</button></div>'}
function qrisModalHtml(){const o=findOrder(S.qrisFor);if(!o)return '';
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="Bayar dengan QRIS"><div class="box" style="align-items:center;text-align:center"><b style="font-size:17px">Bayar pesanan '+esc(o.code||'')+'</b>'+qrisPay(o)+'<button class="btn" data-act="qrisclose" style="width:100%">Tutup</button></div></div>'}

/* ---------- QRIS Midtrans: lunas otomatis ---------- */
S.mt={};
function paidNow(o){if(!o)return false;const m=S.mine.find(x=>x.id===o.id);return !!(o.paid||(m&&m.paid)||(S.mt[o.id]&&S.mt[o.id].st==='paid'))}
async function mtLoad(id){
  try{const r=await api('POST','/api/orders/'+encodeURIComponent(id)+'/qris',{tokens:ls.get('orders',[])});
    S.mt[id]=r.paid?{st:'paid'}:{st:'ok',qr:r.qr,exp:r.expiresAt,amount:r.amount,mode:r.mode,test:r.testUrl||''};if(r.paid)loadMine()}
  catch(e){S.mt[id]={st:'off'}}
  render()}
function qrisPay(o){
  if(paidNow(o))return '<div class="banner b-blue" style="width:100%;display:flex;gap:8px;align-items:center;justify-content:center">'+ic('check',18,2.6)+'<b>Pembayaran QRIS diterima. Pesanan lunas.</b></div>';
  const c=S.mt[o.id],wait='<div class="qris"><div class="qhead"><b>QRIS</b><span>KAmart</span></div><small style="padding:40px 0">Menyiapkan QRIS…</small></div>';
  if(!c||c.st==='load'||(c.st==='ok'&&new Date(c.exp)<=Date.now())){if(!c||c.st!=='load'){S.mt[o.id]={st:'load'};setTimeout(()=>mtLoad(o.id),0)}return wait}
  const svg=c.st==='ok'?qrisSvg(c.qr):'';
  if(svg){const d=new Date(c.exp),hm=String(d.getHours()).padStart(2,'0')+'.'+String(d.getMinutes()).padStart(2,'0');
    return '<div class="qris"><div class="qhead"><b>QRIS</b><span>KAmart</span></div><div class="qcode" role="img" aria-label="QRIS '+rp(c.amount)+'">'+svg+'</div><div class="qamt num">'+rp(c.amount)+'</div>'+
      '<small style="font-size:12px">Scan pakai DANA, GoPay, OVO, ShopeePay, atau m-banking. Pesanan <b>otomatis lunas</b> setelah dibayar.</small>'+
      '<small style="color:var(--muted);font-size:11px">Berlaku sampai pukul '+hm+(c.mode==='midtrans-sandbox'?' · MODE UJI (sandbox), jangan dibayar sungguhan':'')+'</small>'+
      (c.test?'<div class="banner b-gold" style="font-size:12px;text-align:left;color:var(--warn)"><b>Tes sandbox:</b> salin alamat QR, buka simulator, tempel, lalu bayar.<div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap"><button type="button" class="btn2" data-act="mtcopy" data-url="'+esc(c.test)+'" style="height:34px">Salin alamat QR</button><a class="btn2" href="https://simulator.sandbox.midtrans.com/v2/qris/index" target="_blank" rel="noopener" style="height:34px">Buka simulator</a></div></div>':'')+'</div>'}
  return qrisBlock(o.total)+'<small style="color:var(--muted)">Penjual menandai lunas setelah dana masuk.</small>'}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-act="mtcopy"]');if(!b)return;
  try{await navigator.clipboard.writeText(b.dataset.url);toast('Alamat QR disalin')}catch(err){prompt('Salin alamat QR ini:',b.dataset.url)}});
setInterval(()=>{if(document.hidden)return;const id=(S.placed&&S.placed.id)||S.qrisFor,c=id&&S.mt[id];
  if(c&&c.st==='ok'&&!paidNow(findOrder(id)||S.placed))loadMine()},4000);

/* ---------- struk pesanan (PNG) ---------- */
let LOGO=null;
function logoImg(){if(!LOGO)LOGO=new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src='logo.png'});return LOGO}
async function receiptPng(o){
  const items=o.items||[],dk=o.diskon||[],W=600,P=50,H=604+items.length*34+(dk.length?(dk.length+1)*30+10:0),F="'Poppins',system-ui,sans-serif";
  try{await document.fonts.ready}catch(e){}
  const c=document.createElement('canvas');c.width=W*2;c.height=H*2;const g=c.getContext('2d');g.scale(2,2);
  const rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
  const fit=(t,max)=>{t=String(t);if(g.measureText(t).width<=max)return t;while(t.length>1&&g.measureText(t+'…').width>max)t=t.slice(0,-1);return t+'…'};
  const dash=y=>{g.save();g.strokeStyle='#DCCDE0';g.setLineDash([6,6]);g.beginPath();g.moveTo(P,y);g.lineTo(W-P,y);g.stroke();g.restore()};
  g.fillStyle='#E9DFF6';g.fillRect(0,0,W,H);
  rr(20,20,W-40,H-40,28);g.fillStyle='#FFFFFF';g.fill();
  g.save();rr(20,20,W-40,150,28);g.clip();const gr=g.createLinearGradient(0,20,W,170);gr.addColorStop(0,'#7A66D0');gr.addColorStop(1,'#5B47B0');g.fillStyle=gr;g.fillRect(20,20,W-40,150);g.restore();
  const lg=await logoImg();if(lg){g.save();g.beginPath();g.arc(P+40,95,40,0,Math.PI*2);g.clip();g.drawImage(lg,P,55,80,80);g.restore()}
  g.fillStyle='#FFFFFF';g.font='800 30px '+F;g.fillText('KAmart',P+100,88);g.font='500 15px '+F;g.fillStyle='#EDE7FF';g.fillText('Struk Pesanan',P+100,114);g.fillText(dLabel(o.createdAt),P+100,136);
  let y=212;g.textAlign='center';g.fillStyle='#675C7B';g.font='600 13px '+F;g.fillText('KODE PESANAN',W/2,y);
  y+=50;g.fillStyle='#5B47B0';g.font='800 46px '+F;g.fillText(o.code||'-',W/2,y);
  y+=28;g.fillStyle='#675C7B';g.font='500 13px '+F;g.fillText('Tunjukkan kode ini saat mengambil pesanan',W/2,y);g.textAlign='left';
  y+=26;dash(y);y+=34;
  const row=(l,v,bold)=>{g.fillStyle='#675C7B';g.font='500 14px '+F;g.fillText(l,P,y);g.fillStyle='#2B2140';g.font=(bold?'700':'600')+' 14px '+F;g.textAlign='right';g.fillText(fit(v,W-2*P-130),W-P,y);g.textAlign='left';y+=30};
  row('Nama',o.customerName+(o.customerLine?' · '+o.customerLine:''));
  row('Waktu ambil',o.slot||'-');
  row('Pembayaran',o.pay==='Kasbon'?'Bayar pas gajian':(o.pay||'-')+(o.paid?' · lunas':' · bayar saat ambil'));
  y-=4;dash(y);y+=34;
  items.forEach(i=>{g.fillStyle='#2B2140';g.font='600 14px '+F;g.fillText(fit(i.qty+'× '+i.name+(i.bonus?' (bonus)':''),W-2*P-140),P,y);g.textAlign='right';if(i.bonus)g.fillStyle='#2E8B57';g.fillText(i.bonus?'Gratis':rp((+i.qty||0)*(+i.price||0)),W-P,y);g.textAlign='left';y+=34});
  y-=8;dash(y);y+=40;
  if(dk.length){const dr=(l,v,c)=>{g.fillStyle=c;g.font='600 14px '+F;g.fillText(fit(l,W-2*P-140),P,y);g.textAlign='right';g.fillText(v,W-P,y);g.textAlign='left';y+=30};
    dr('Subtotal',rp(o.subtotal==null?o.total:o.subtotal),'#675C7B');dk.forEach(d=>dr(d.nama,'−'+rp(d.nilai),'#2E8B57'));y+=10}
  g.fillStyle='#2B2140';g.font='800 22px '+F;g.fillText('Total',P,y);g.textAlign='right';g.fillText(rp(o.total),W-P,y);g.textAlign='left';
  y+=50;g.textAlign='center';g.fillStyle='#675C7B';g.font='500 13px '+F;g.fillText('Terima kasih sudah belanja di KAmart!',W/2,y);g.textAlign='left';
  return await new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('png')),'image/png'));
}
async function saveFile(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
async function downloadReceipt(o){const b=await receiptPng(o);await saveFile('struk-'+(o.code||'KAmart')+'.png',b)}
async function autoReceipt(){render();try{await downloadReceipt(S.placed);S.placedDl='ok'}catch(e){S.placedDl='fail'}render()}
function placedHtml(){const o=S.placed;
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="Pesanan terkirim"><div class="box" style="align-items:center;text-align:center"><span class="tile t-lav" style="border-radius:50%;width:56px;height:56px">'+ic('check',26,2.6)+'</span><b style="font-size:18px">Pesanan terkirim!</b><span style="color:var(--muted);font-size:13px">Tunjukkan kode ini saat mengambil pesanan</span>'+
  '<div class="num" style="font-size:30px;font-weight:800;letter-spacing:.06em;color:var(--primary-ink);background:var(--primary-soft);border-radius:16px;padding:10px 22px">'+esc(o.code)+'</div>'+
  '<div style="font-size:13px">'+esc(itemsText(o))+'<br><b class="num">'+rp(o.total)+'</b> · '+esc(o.slot||'')+((o.diskon||[]).length?'<br><span style="color:var(--ok);font-weight:700">Hemat '+rp(sum(o.diskon,d=>+d.nilai||0))+'</span>':'')+'</div>'+
  (o.pay==='QRIS'&&!o.paid?qrisPay(o):'')+
  '<small style="color:'+(S.placedDl==='fail'?'var(--bad)':'var(--muted)')+'">'+(S.placedDl==='ok'?'Struk sudah diunduh ke HP kamu.':S.placedDl==='fail'?'Struk belum terunduh. Tekan Unduh struk.':'Menyiapkan struk…')+'</small>'+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%"><button class="btn2" data-act="dlplaced" style="justify-content:center">Unduh struk</button><button class="btn" data-act="closeplaced">Lihat antrian</button></div></div></div>'}

/* ---------- actions ---------- */
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Tersalin. Tempel di WhatsApp.')}catch(e){const el=document.getElementById('rcpt');if(el){el.hidden=false;el.select()}toast('Salin manual dari kotak teks.')}}
function setBind(path,val){const[a,b]=path.split('.');if(b)S[a][b]=val;else S[a]=val}
document.addEventListener('input',e=>{const t=e.target,b=t.dataset&&t.dataset.bind;if(!b)return;const val=t.type==='checkbox'?t.checked:t.value;setBind(b,val);
  if(b==='sf.kode'){const p=prod(val);if(p)S.sf.harga=p.modal}
  if(b==='pf.cat'&&!catOnline(val))S.pf.online=false;
  if(b.startsWith('co.'))ls.set('me',{name:S.co.name,line:S.co.line});
  if(b==='co.name'){clearTimeout(checkReg.t);checkReg.t=setTimeout(checkReg,450)}if(t.dataset.live||b==='pf.cat')render()});
document.addEventListener('change',e=>{const t=e.target,b=t.dataset&&t.dataset.bind;if(b&&(t.tagName==='SELECT'||t.type==='checkbox')){setBind(b,t.type==='checkbox'?t.checked:t.value);if(b==='sf.kode'){const p=prod(t.value);if(p)S.sf.harga=p.modal}render()}});
document.addEventListener('click',async e=>{
  const t=e.target.closest('button,a');if(!t)return;const d=t.dataset;
  if(d.go){e.preventDefault();go(d.go);window.scrollTo({top:0});return}
  if(d.qrisfor){S.qrisFor=d.qrisfor;render();return}
  if(d.receipt){const o=findOrder(d.receipt);if(o)downloadReceipt(o).then(()=>toast('Struk diunduh')).catch(e=>toast(e.message||'Struk gagal diunduh'));return}
  if(d.act==='compact'){S.compact=!S.compact;ls.set('compact',S.compact);toast('Tampilan ringkas '+(S.compact?'aktif':'mati'));render();return}
  if(d.layout){S.layout=d.layout;ls.set('layout',S.layout);toast('Tampilan: '+({auto:'Otomatis',mobile:'HP',desktop:'Desktop'})[S.layout]);render();window.scrollTo({top:0});return}
  if(d.ndismiss){S.alerts=S.alerts.filter(x=>x.id!==d.ndismiss);render();return}
  if(d.cat){S.cat=d.cat;render();return}
  if(d.cart){const k=d.cart,q=(S.cart[k]||0)+(+d.d);S.cart[k]=Math.max(0,Math.min(q,stockOf(k)));render();return}
  if(d.copay){S.co.pay=d.copay;render();return}
  if(d.coslot){S.co.slot=d.coslot;render();return}
  if(d.kadd){const k=d.kadd;S.k.cart[k]=(S.k.cart[k]||0)+1;if(S.k.method==='Tunai')S.k.cash=0;render();return}
  if(d.kdec){const k=d.kdec;S.k.cart[k]=Math.max(0,(S.k.cart[k]||0)-1);render();return}
  if(d.kpay){S.k.method=d.kpay;render();return}
  if(d.cash){S.k.cash=+d.cash;render();return}
  if(d.kf){S.kfilter=d.kf;render();return}
  if(d.adv){const o=S.orders.find(x=>x.id===d.adv);if(o){await run(api('PATCH','/api/admin/orders/'+encodeURIComponent(o.id),{stage:Math.min(3,o.stage+1)},true)).catch(()=>{});loadAdmin()}return}
  if(d.paid){await run(api('PATCH','/api/admin/orders/'+encodeURIComponent(d.paid),{paid:true},true),'Ditandai lunas').catch(()=>{});loadAdmin();return}
  if(d.donepaid){await run(api('PATCH','/api/admin/orders/'+encodeURIComponent(d.donepaid),{stage:3,paid:true},true),'Pesanan selesai & lunas').catch(()=>{});loadAdmin();return}
  if(d.ask){S.confirm=d.ask;render();return}
  if(d.cancel){S.confirm=null;await run(api('PATCH','/api/admin/orders/'+encodeURIComponent(d.cancel),{stage:-1},true),'Pesanan dibatalkan, stok dikembalikan').catch(()=>{});loadAdmin();return}
  if(d.online){const p=S.products.find(x=>x.kode===d.online);if(p){await run(api('PUT','/api/admin/products/'+encodeURIComponent(p.kode),Object.assign({},p,{online:!p.online}),true)).catch(()=>{});loadAdmin()}return}
  if(d.edit){const p=prod(d.edit);if(p){S.pf=Object.assign({},p,{online:p.online!==false,_edit:true});render();window.scrollTo({top:0})}return}
  if(d.lunas){await run(api('POST','/api/admin/kasbon/settle',{name:d.lunas},true),'Kasbon '+d.lunas+' lunas').catch(()=>{});loadAdmin();return}
  if(d.copy){const os=unpaidKasbon().filter(o=>o.customerName===d.copy);copyText('Halo '+d.copy+', tagihan KAmart kamu '+rp(sum(os,o=>+o.total||0))+' ('+os.length+' transaksi). Mohon dibayar saat gajian ya. Terima kasih!');return}
  const act=d.act;if(!act)return;
  if(act==='qristoggle'){S.qrisStatic=!S.qrisStatic;render();return}
  if(act==='qrisclose'){S.qrisFor=null;render();return}
  if(act==='install'){doInstall();return}
  if(act==='installhide'){ls.set('installHide',1);render();return}
  if(act==='dlplaced'&&S.placed){autoReceipt();return}
  if(act==='closeplaced'){S.placed=null;go('pesananku');render();return}
  if(act==='nsound'){S.ns.sound=!S.ns.sound;ls.set('ns',S.ns);if(S.ns.sound)beep();render();return}
  if(act==='npush'){await enablePush(false);return}
  if(act==='ntest'){if(S.ns.push&&S.ns.server)api('POST','/api/admin/push/test',{},true).catch(e=>toast(e.message));S.alerts=[{id:'tes-'+Date.now(),name:'Contoh pembeli',items:'1× Pop Mie Ayam',total:6000,slot:'Istirahat 12.00',at:Date.now()}].concat(S.alerts).slice(0,3);expireAlerts();if(S.ns.sound)beep();try{if(navigator.vibrate)navigator.vibrate([120,60,120])}catch(e){}render();return}
  if(act==='logout'){await disablePush();S.token=null;ls.set('token',null);S.loaded.admin=false;S.products=[];S.orders=[];S.customers=[];S.stockin=[];toast('Kamu sudah keluar dari admin');go('toko');return}
  if(act==='resetpin'){S.lg.reset=true;S.lg.err='';S.lg.pin='';S.lg.pin2='';render();return}
  if(act==='cancelreset'){S.lg.reset=false;S.lg.err='';render();return}
  if(act==='clearCart'){S.cart={};render()}
  if(act==='kclear'){S.k.cart={};S.k.cash=0;render()}
  if(act==='pnew'){S.pf={kode:'',name:'',cat:(M().kategori[0]||{}).nama||'Lainnya',unit:M().satuan[0]||'pcs',modal:'',jual:'',min:5,online:true};render()}
  if(act==='pclose'){S.pf=null;render()}
  if(act==='pimgdel'&&S.pf){S.pf.img='';render()}
  if(act==='pimgpick'&&S.pf&&!S.imgBusy){imgInput.value='';imgInput.click()}
  if(act==='closeReceipt'){S.receipt=null;render()}
  if(act==='copyReceipt'&&S.receipt)copyText(receiptText(S.receipt));
  if(act==='kpay')await kasirPay();
  if(act==='csv')await exportCsv();
  if(act==='pcsv')await exportProduk();
  if(act==='rhcsv')await exportRiwayat();
  if(act==='rhmore'){S.rh.limit+=50;render()}
});
document.addEventListener('submit',async e=>{
  e.preventDefault();const id=e.target.id;
  if(id==='lgForm')await doLogin();
  if(id==='coForm')await placeOrder();
  if(id==='pForm')await saveProduct();
  if(id==='prForm')await savePromo();
  if(id==='sForm')await submitStock();
  if(id==='cForm')await saveCustomer();
});
// Gambar: dibaca dengan <img>, kalau gagal (mis. HEIC) coba createImageBitmap.
async function decodeImg(file){
  const url=URL.createObjectURL(file);
  try{return await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res({src:i,w:i.naturalWidth,h:i.naturalHeight});i.onerror=rej;i.src=url})}
  catch(e){if(!window.createImageBitmap)throw e;const b=await createImageBitmap(file);return{src:b,w:b.width,h:b.height}}
  finally{setTimeout(()=>URL.revokeObjectURL(url),0)}
}
async function shrink(file){
  const d=await decodeImg(file);if(!d.w||!d.h)throw new Error('kosong');
  const M=800,s=Math.min(1,M/Math.max(d.w,d.h));
  const c=document.createElement('canvas');c.width=Math.max(1,Math.round(d.w*s));c.height=Math.max(1,Math.round(d.h*s));
  const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(d.src,0,0,c.width,c.height);
  if(d.src.close)d.src.close();
  return c.toDataURL('image/jpeg',0.82);
}
// Satu input file tetap di luar area yang di-render ulang. Sebelumnya input ikut diganti
// saat data diperbarui otomatis (tiap 10 detik / kembali dari galeri), sehingga foto dari galeri hilang.
const imgInput=document.createElement('input');
imgInput.type='file';imgInput.accept='image/*';imgInput.id='p-img';imgInput.className='sr';imgInput.tabIndex=-1;imgInput.setAttribute('aria-hidden','true');
document.body.appendChild(imgInput);
imgInput.addEventListener('change',async()=>{const f=imgInput.files&&imgInput.files[0];if(!f||!S.pf)return;
  if(f.size>25*1024*1024){toast('Foto terlalu besar (maks 25 MB).');imgInput.value='';return}
  S.imgBusy=true;render();
  try{const data=await shrink(f);if(S.pf)S.pf.img=data}catch(err){toast('Foto tidak bisa dibaca. Coba file JPG atau PNG.')}
  S.imgBusy=false;imgInput.value='';render()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(S.receipt||S.placed||S.qrisFor||S.poster||S.remodal)){S.receipt=null;S.placed=null;S.qrisFor=null;S.remodal=null;closePoster();render()}});

function orderBody(lines,extra,hp){const its=hp?hp.items.map(l=>{const o={kode:l.kode,name:l.name,qty:l.qty,price:l.price,modal:l.modal};if(l.normal!==l.price){o.normal=l.normal;o.promoId=l.promoId}if(l.bonus)o.bonus=true;return o}):lines;const sub=sum(its,l=>l.qty*l.price),vd=hp&&hp.diskon.find(d=>d.tipe==='voucher');
  return Object.assign({createdAt:new Date().toISOString(),items:its,subtotal:sub,total:hp?hp.total:sub,diskon:hp?hp.diskon:[],voucher:vd?vd.voucher:'',modalTotal:sum(its,l=>l.qty*l.modal)},extra)}
async function placeOrder(){
  const lines=cartLines(S.cart,S.pub);const name=S.co.name.trim();
  if(!lines.length)return;if(!name){toast('Isi nama dulu');const el=document.getElementById('co-name');if(el)el.focus();return}
  if(S.co.pay==='Kasbon'&&!S.reg){toast('Bayar pas gajian khusus pelanggan terdaftar');return}
  S.busy=true;render();
  try{const r=await api('POST','/api/orders',{customerName:name,customerLine:S.co.line.trim(),slot:S.co.slot,pay:S.co.pay,note:S.co.note.trim(),voucher:vch('co').code,items:lines.map(l=>({kode:l.kode,qty:l.qty}))});vch('co',null);
    const toks=ls.get('orders',[]);toks.unshift(r.token);ls.set('orders',toks.slice(0,50));S.mine.unshift(r.order);
    S.cart={};S.co.note='';S.busy=false;S.placed=r.order;S.placedDl='';go('pesananku');window.scrollTo({top:0});autoReceipt();loadPublic();loadQueue();return}
  catch(e){toast(e.message)}
  S.busy=false;render();
}
async function kasirPay(){
  const k=S.k,lines=cartLines(k.cart);if(!lines.length)return;
  S.busy=true;render();
  try{const r=await api('POST','/api/admin/orders',{customerName:k.buyer||'',pay:k.method,cashIn:+k.cash||0,voucher:vch('k').code,items:lines.map(l=>({kode:l.kode,qty:l.qty}))},true);
    S.receipt=r.order;S.k={cart:{},buyer:'',method:'Tunai',cash:0};vch('k',null);loadAdmin()}catch(e){toast(e.message)}
  S.busy=false;render();
}
async function saveProduct(){
  const f=S.pf;const kode=String(f.kode).trim().toUpperCase().replace(/[^A-Z0-9_-]/g,'');
  if(!kode||!String(f.name).trim()){toast('Kode dan nama wajib diisi');return}
  if(!f._edit&&S.products.some(p=>p.kode===kode)){toast('Kode '+kode+' sudah dipakai');return}
  const body={isNew:!f._edit,name:String(f.name).trim(),cat:f.cat,unit:String(f.unit||'').trim(),modal:+f.modal||0,jual:+f.jual||0,min:+f.min||0,online:catOnline(f.cat)?!!f.online:false,img:f.img||''};
  if(body.img.length>1000000){toast('Foto terlalu besar, coba foto lain');return}
  try{await run(api('PUT','/api/admin/products/'+encodeURIComponent(kode),body,true),'Produk tersimpan');S.pf=null;await loadAdmin()}catch(e){}
}
async function saveStock(){
  const f=S.sf;const qty=+f.qty||0,harga=+f.harga||0;if(!f.kode||qty<=0){toast('Isi jumlah dulu');return}
  if(harga<1){toast('Isi harga beli per unit');return}
  try{await run(api('POST','/api/admin/stockin',{date:f.date,kode:f.kode,qty,harga,tempat:String(f.tempat||'').trim(),sumber:f.sumber==='laci'?'laci':''},true),'Stok bertambah '+qty);S.sf.qty='';await loadAdmin()}catch(e){}
}
async function saveCustomer(){
  const n=S.cf.name.trim();if(!n){toast('Isi nama pelanggan');return}
  try{await run(api('POST','/api/admin/customers',{name:n,line:S.cf.line.trim(),wa:S.cf.wa.trim()},true),'Pelanggan tersimpan');S.cf={name:'',line:'',wa:''};await loadAdmin()}catch(e){}
}
async function exportCsv(){
  const list=valid().filter(o=>mk(o.createdAt)===S.month).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
  const rows=[['Tanggal','Kode','Sumber','Pembeli','Bagian','Barang','Total','Modal','Untung','Bayar','Status bayar','Tahap']].concat(list.map(o=>[new Date(o.createdAt).toLocaleString('id-ID'),o.code,o.source,o.customerName,o.customerLine,itemsText(o),o.total,o.modalTotal,profit(o),o.pay,o.paid?'Lunas':'Belum',STAGES[o.stage]]));
  await downloadCsv('rekap-kamart-'+S.month+'.csv',rows);
}

async function downloadCsv(name,rows){
  const q=s=>'"'+String(s==null?'':s).replace(/"/g,'""')+'"';
  const csv='\ufeff'+rows.map(r=>r.map(q).join(',')).join('\r\n');
  try{await saveFile(name,new Blob([csv],{type:'text/csv;charset=utf-8'}));toast('File '+name+' diunduh')}
  catch(e){toast(e&&e.code==='declined'?'Unduhan dibatalkan':(e&&e.message)||'Unduhan gagal')}
}
const tglJam=d=>{const x=new Date(d);return x.toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'})+' '+x.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})};
const stageText=s=>s<0?'Batal':STAGES[s]||'';
async function exportProduk(){
  const rows=[['Kode','Nama','Kategori','Satuan','Harga modal','Harga jual','Untung','Margin %','Sisa stok','Stok minimum','Status stok','Tampil online']].concat(sortedProducts().map(p=>{
    const st=stockOf(p.kode),u=(+p.jual||0)-(+p.modal||0);
    return [p.kode,p.name,p.cat,p.unit,+p.modal||0,+p.jual||0,u,p.jual?Math.round(u/p.jual*100):0,st,+p.min||0,st<=0?'Habis':st<=(+p.min||0)?'Menipis':'Aman',p.online!==false&&catOnline(p.cat)?'Ya':'Tidak']}));
  const d=new Date(),ds=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
  await downloadCsv('produk-kamart-'+ds+'.csv',rows);
}
async function exportRiwayat(){
  const list=riwayatList();
  const rows=[['Tanggal','Kode','Sumber','Pembeli','Bagian','Barang','Jumlah item','Total','Modal','Untung','Metode bayar','Status bayar','Tahap','Waktu ambil','Catatan','Diskon','Voucher']].concat(list.map(o=>[tglJam(o.createdAt),o.code,o.source==='online'?'Online':'Kasir',o.customerName,o.customerLine,itemsText(o),sum(o.items||[],i=>+i.qty||0),+o.total||0,+o.modalTotal||0,o.stage<0?0:profit(o),payLabel(o.pay),o.stage<0?'-':o.paid?'Lunas':'Belum',stageText(o.stage),o.slot||'',o.note||'',sum(o.diskon||[],d=>+d.nilai||0),o.voucher||'']));
  await downloadCsv('riwayat-pesanan-kamart.csv',rows);
}

async function submitStock(){if(S.sf.editId)return updateStock();return saveStock()}
function stockAfter(kode,delta){return stockOf(kode)+delta}
async function updateStock(){
  const f=S.sf,old=S.stockin.find(x=>String(x.id)===String(f.editId));if(!old){S.sf.editId=null;render();return}
  const qty=+f.qty||0,harga=+f.harga||0;if(!f.kode||qty<=0){toast('Isi jumlah dulu');return}
  if(harga<1){toast('Isi harga beli per unit');return}
  const sisa=stockAfter(old.kode,-(+old.qty||0)+(old.kode===f.kode?qty:0));
  if(sisa<0){const p=prod(old.kode);toast('Stok '+(p?p.name:old.kode)+' akan minus '+(-sisa)+' karena sudah terjual');return}
  const body={date:f.date,kode:f.kode,qty,harga,tempat:String(f.tempat||'').trim(),sumber:f.sumber==='laci'?'laci':''};
  S.busy=true;render();
  try{await updateStockDoc(old.id,body,[old.kode,f.kode]);
    S.sf=Object.assign({},S.sf,{editId:null,qty:''});toast('Catatan stok diperbarui')}catch(e){}
  S.busy=false;render()}
async function updateStockDoc(id,body,kodes){await run(api('PUT','/api/admin/stockin/'+encodeURIComponent(id),body,true));await loadAdmin()}
async function deleteStockDoc(id){await run(api('DELETE','/api/admin/stockin/'+encodeURIComponent(id),null,true));await loadAdmin()}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-siedit],[data-sidel],[data-sidelok],[data-act="sicancel"],[data-act="simore"]');if(!t)return;const d=t.dataset;
  if(d.act==='simore'){S.siLimit=(S.siLimit||40)+40;render();return}
  if(d.act==='sicancel'){S.sf=Object.assign({},S.sf,{editId:null,qty:''});render();return}
  const x=S.stockin.find(y=>String(y.id)===String(d.siedit||d.sidel||d.sidelok));if(!x)return;
  if(d.siedit){S.sidel=null;S.sf=Object.assign({},S.sf,{editId:String(x.id),date:String(x.date).slice(0,10),kode:x.kode,qty:String(x.qty),harga:String(x.harga),tempat:x.tempat||'',sumber:x.sumber||''});render();window.scrollTo({top:0,behavior:'smooth'});return}
  if(d.sidel){S.sidel=String(x.id);render();return}
  if(d.sidelok){S.sidel=null;const sisa=stockAfter(x.kode,-(+x.qty||0));if(sisa<0){const p=prod(x.kode);toast('Tidak bisa dihapus: '+(p?p.name:x.kode)+' sudah terjual, stok akan minus '+(-sisa));render();return}
    try{await deleteStockDoc(x.id);await syncModal([x.kode]);if(String(S.sf.editId)===String(x.id))S.sf.editId=null;toast('Catatan stok dihapus')}catch(err){}render()}});

/* ---------- Koreksi modal transaksi lama ---------- */
function remodalScope(R){return valid().filter(o=>(R.scope==='semua'||mk(o.createdAt)===R.month)&&(o.items||[]).some(i=>i.kode===R.kode))}
function remodalHtml(){const R=S.remodal,os=remodalScope(R),nm=+R.modal||0;
  const lama=sum(os,profit),baru=sum(os,o=>(+o.total||0)-sum(o.items||[],i=>(+i.qty||0)*(i.kode===R.kode?nm:(+i.modal||0)))),q=sum(os,o=>sum((o.items||[]).filter(i=>i.kode===R.kode),i=>+i.qty||0));
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="Koreksi modal"><form id="rmForm" class="box stack" style="gap:14px;max-width:460px">'+
   '<div class="ch" style="margin:0"><div><h3>Koreksi modal</h3><p>'+esc(R.name)+'</p></div><button type="button" class="btn3" data-act="rmclose">Tutup</button></div>'+
   '<label class="f">Modal yang benar per unit<input class="in num" id="rm-modal" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" data-num="1" data-bind="remodal.modal" data-live="1" value="'+esc(R.modal)+'" required></label>'+
   '<div class="seg" role="radiogroup" aria-label="Transaksi yang diperbaiki">'+[['bulan','Transaksi '+mLabel(R.month)],['semua','Semua transaksi']].map(([v,t])=>'<button type="button" class="sg'+(R.scope===v?' on':'')+'" role="radio" aria-checked="'+(R.scope===v)+'" data-rmscope="'+v+'">'+esc(t)+'</button>').join('')+'</div>'+
   (hasStockin(R.kode)?'':'<label class="f" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" id="rm-set" data-bind="remodal.setProduct"'+(R.setProduct?' checked':'')+'> Simpan juga sebagai harga modal produk</label>')+
   '<div class="banner b-lav" style="font-size:13px;display:flex;flex-direction:column;gap:4px"><span>'+os.length+' transaksi, '+q+' item akan diperbarui.</span><span>Untung transaksi itu: <b class="num">'+rp(lama)+'</b> → <b class="num">'+rp(baru)+'</b></span></div>'+
   '<button class="btn" type="submit"'+(S.busy||!os.length?' disabled':'')+'>'+(S.busy?'Menyimpan…':'Perbaiki modal')+'</button></form></div>'}
async function remodalDoc(kode,modal,month,setProduct){const r=await run(api('POST','/api/admin/products/'+encodeURIComponent(kode)+'/remodal',{modal,month,setProduct},true));await loadAdmin();return r}
async function saveRemodal(){const R=S.remodal;if(!R)return;const m=Math.round(+R.modal);if(!Number.isFinite(m)||m<0||R.modal===''){toast('Isi modal yang benar');return}
  S.busy=true;render();try{await remodalDoc(R.kode,m,R.scope==='semua'?null:R.month,!!R.setProduct);S.remodal=null;toast('Modal '+R.name+' diperbaiki')}catch(e){}S.busy=false;render()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-remodal],[data-rmscope],[data-act="rmclose"]');if(!t)return;const d=t.dataset;
  if(d.remodal){const p=prod(d.remodal)||{};const row=valid().flatMap(o=>(o.items||[]).filter(i=>i.kode===d.remodal))[0]||{};S.remodal={kode:d.remodal,name:p.name||row.name||d.remodal,modal:String(p.modal!=null?p.modal:(row.modal||'')),scope:'bulan',month:S.month,setProduct:true};render();setTimeout(()=>{const i=document.getElementById('rm-modal');if(i){i.focus();i.select()}},50);return}
  if(!S.remodal)return;
  if(d.rmscope){S.remodal.scope=d.rmscope;render();return}
  if(d.act==='rmclose'){S.remodal=null;render()}});
document.addEventListener('submit',e=>{if(e.target&&e.target.id==='rmForm'){e.preventDefault();e.stopPropagation();saveRemodal()}},true);

/* ---------- Pengeluaran operasional (untung bersih) ---------- */
function efInit(){if(!S.ef)S.ef={date:ymd(new Date()),ket:'',jumlah:'',editId:null};return S.ef}
function expenseCard(mo,peng){const f=efInit(),rows=(S.expenses||[]).filter(x=>String(x.date).slice(0,7)===mo).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  return '<div class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>Pengeluaran operasional</h3><p>'+mLabel(mo)+': '+rp(peng)+' · mengurangi untung bersih</p></div>'+(f.editId?'<button type="button" class="btn3" data-act="efcancel">Batal ubah</button>':'')+'</div>'+
   '<form id="efForm" class="exform"><label class="f">Tanggal<input class="in" type="date" id="ef-date" data-bind="ef.date" value="'+esc(f.date)+'" required></label>'+
   '<label class="f exk">Keterangan<input class="in" id="ef-ket" data-bind="ef.ket" value="'+esc(f.ket)+'" maxlength="80" placeholder="Kantong plastik, bensin belanja, gas…" required></label>'+
   '<label class="f">Jumlah (Rp)<input class="in num" id="ef-jml" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" data-num="1" data-bind="ef.jumlah" value="'+esc(f.jumlah)+'" required></label>'+
   '<button class="btn" type="submit"'+(S.busy?' disabled':'')+'>'+(f.editId?'Simpan':'Tambah')+'</button></form>'+
   (rows.length?'<div>'+rows.map(x=>{const id=esc(String(x.id)),cf=S.efdel===String(x.id);return '<div class="li sirow'+(String(f.editId)===String(x.id)?' on':'')+'"><span style="min-width:0"><b>'+esc(x.ket)+'</b><br><small style="color:var(--muted)">'+esc(x.date)+'</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><b class="num">'+rp(x.jumlah)+'</b><span style="display:flex;gap:6px"><button type="button" class="btn3 sm" data-efedit="'+id+'">Ubah</button>'+(cf?'<button type="button" class="btn3 sm dang" data-efdelok="'+id+'">Ya, hapus</button>':'<button type="button" class="btn3 sm dang" data-efdel="'+id+'">Hapus</button>')+'</span></span></div>'}).join('')+'</div>'
    :'<div class="empty" style="padding:12px">Belum ada pengeluaran di bulan ini. Untung bersih = untung kotor.</div>')+'</div>'}
async function saveExpenseDoc(id,body){await run(id?api('PUT','/api/admin/expenses/'+encodeURIComponent(id),body,true):api('POST','/api/admin/expenses',body,true));await loadAdmin()}
async function deleteExpenseDoc(id){await run(api('DELETE','/api/admin/expenses/'+encodeURIComponent(id),null,true));await loadAdmin()}
async function saveExpense(){const f=efInit(),jumlah=Math.round(+f.jumlah||0),ket=String(f.ket||'').trim();
  if(!f.date||!ket||jumlah<1){toast('Isi tanggal, keterangan, dan jumlah');return}
  S.busy=true;render();try{await saveExpenseDoc(f.editId,{date:f.date,ket,jumlah});toast(f.editId?'Pengeluaran diperbarui':'Pengeluaran dicatat');S.ef=Object.assign({},f,{ket:'',jumlah:'',editId:null})}catch(e){}S.busy=false;render()}
document.addEventListener('submit',e=>{if(e.target&&e.target.id==='efForm'){e.preventDefault();e.stopPropagation();saveExpense()}},true);
document.addEventListener('click',async e=>{const t=e.target.closest('[data-efedit],[data-efdel],[data-efdelok],[data-act="efcancel"]');if(!t)return;const d=t.dataset;
  if(d.act==='efcancel'){S.ef=Object.assign({},efInit(),{ket:'',jumlah:'',editId:null});render();return}
  const x=(S.expenses||[]).find(y=>String(y.id)===String(d.efedit||d.efdel||d.efdelok));if(!x)return;
  if(d.efedit){S.efdel=null;S.ef={date:String(x.date).slice(0,10),ket:x.ket,jumlah:String(x.jumlah),editId:String(x.id)};render();const i=document.getElementById('ef-ket');if(i)i.scrollIntoView({block:'center'});return}
  if(d.efdel){S.efdel=String(x.id);render();return}
  if(d.efdelok){S.efdel=null;try{await deleteExpenseDoc(x.id);if(String(efInit().editId)===String(x.id))S.ef.editId=null;toast('Pengeluaran dihapus')}catch(err){}render()}});

/* ---------- Modal rata-rata & arus stok ---------- */
function hasStockin(kode){return S.stockin.some(x=>x.kode===kode)}
function modalFb(){const fb={};S.products.forEach(p=>{fb[p.kode]=+p.modal||0});return fb}
function moStart(mo){return Date.parse(mo+'-01T00:00:00+07:00')}
function moNext(mo){const [y,m]=mo.split('-').map(Number);return moStart(m===12?(y+1)+'-01':y+'-'+String(m+1).padStart(2,'0'))}
async function syncModal(kodes){}
/* Stok awal + belanja − HPP = stok akhir (semua dalam harga modal) */
function adjNetMo(mo){return sum((S.adjust||[]).filter(x=>String(x.date).slice(0,7)===mo),x=>(+x.qty||0)*(+x.modal||0))}
function arusStok(mo,belanja,hppBulan){const adj=adjNetMo(mo);const fb=modalFb(),t0=moStart(mo),t1=moNext(mo),kini=Date.now()<t1;
  const A=hppReplay(S.stockin,S.orders,{until:t0,fallback:fb,adjust:S.adjust}),B=hppReplay(S.stockin,S.orders,{until:t1,fallback:fb,adjust:S.adjust});
  const awal=Math.round(hppNilai(A)),akhir=Math.round(hppNilai(B)),hitung=awal+belanja-hppBulan+adj,selisih=akhir-hitung;
  const qtyAkhir=sum(Object.values(B.prod),s=>Math.max(0,s.qty)),minus=Object.keys(B.prod).filter(k=>B.prod[k].qty<0).length;
  const tanpaHarga=S.stockin.filter(x=>String(x.date).slice(0,7)<=mo&&!(+x.harga>0)).length;
  const items=sum(valid().filter(o=>mk(o.createdAt)===mo),o=>sum(o.items||[],i=>+i.qty||0));
  return{awal,akhir,belanja,hpp:hppBulan,adj,hitung,selisih,qtyAkhir,minus,tanpaHarga,kini,seimbang:Math.abs(selisih)<=Math.max(10,items)}}
function arusCard(mo,a){const row=(l,v,c)=>'<div class="arow'+(c?' '+c:'')+'"><span>'+l+'</span><b class="num">'+v+'</b></div>';
  return '<div class="card stack" style="gap:10px"><div class="ch" style="margin:0"><div><h3>Arus stok (harga modal)</h3><p>'+mLabel(mo)+' · stok awal + belanja − modal terjual ± opname = stok akhir</p></div><span class="pill-s '+(a.seimbang?'ps-ok':'ps-bad')+'">'+(a.seimbang?'Seimbang':'Ada selisih')+'</span></div>'+
   (a.adj<0?'<div class="banner '+(a.susutPct>=2?'b-gold':'b-lav')+'" style="font-size:13px">Susut bersih bulan ini <b class="num">'+rp(-a.adj)+'</b>'+(a.omzet?' ('+a.susutPct.toLocaleString("id-ID",{maximumFractionDigits:1})+'% dari penjualan)':'')+(a.susutPct>=2?'. Cukup tinggi, cek barang yang sering selisih di Riwayat opname.':'')+'</div>':'')+'<div class="arus">'+row('Stok awal bulan',rp(a.awal))+row('+ Belanja stok',rp(a.belanja))+row('− Modal barang terjual (HPP)',rp(a.hpp))+(a.adj?row((a.adj<0?'− Susut':'+ Lebih')+' stok opname',rp(Math.abs(a.adj))):'')+row('= Stok akhir seharusnya',rp(a.hitung),'tot')+row('Stok akhir di sistem',rp(a.akhir))+
   row('Selisih',(a.selisih<0?'−':'')+rp(Math.abs(a.selisih)),a.seimbang?'ok':'bad')+'</div>'+
   (a.seimbang?'<small style="color:var(--muted)">'+(a.selisih?'Selisih kecil dari pembulatan modal rata-rata. ':'')+'Angka penjualan, belanja, dan sisa stok sudah sinkron.</small>'
    :'<div class="banner b-gold" style="color:var(--warn);font-size:13px;display:flex;flex-direction:column;gap:8px"><span>Modal di sebagian transaksi bulan ini tidak sama dengan modal rata-rata dari stok masuk (biasanya karena modal lama diketik manual atau stok masuk dicatat belakangan).'+(a.tanpaHarga?' Ada '+a.tanpaHarga+' catatan stok masuk tanpa harga beli; lengkapi di halaman Stok.':'')+(a.minus?' Ada '+a.minus+' produk dengan stok minus; catat stok masuknya.':'')+'</span>'+
     '<span><button type="button" class="btn2" data-act="rehitung"'+(S.busy?' disabled':'')+'>'+(S.busy?'Menghitung…':'Samakan modal transaksi '+mLabel(mo))+'</button></span></div>')+'</div>'}
async function rehitungDoc(month){const r=await run(api('POST','/api/admin/hpp/rehitung',{month},true));await loadAdmin();return r}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-act="rehitung"]');if(!t||S.busy)return;
  S.busy=true;render();try{const r=await rehitungDoc(S.month);toast(r&&r.updated?r.updated+' transaksi disamakan dengan modal rata-rata':'Tidak ada transaksi yang perlu diubah')}catch(err){}S.busy=false;render()});

/* ---------- Stok opname ---------- */
const ALASAN={rusak:'Rusak/kedaluwarsa',hilang:'Hilang',pakai:'Dipakai sendiri',salah:'Salah catat'};
function stokTabs(){return '<div class="seg" role="tablist" aria-label="Stok" style="margin-bottom:14px">'+[['belanja','Stok masuk'],['opname','Stok opname']].map(([v,t])=>'<button type="button" role="tab" class="sg'+((S.stab||'belanja')===v?' on':'')+'" aria-selected="'+((S.stab||'belanja')===v)+'" data-stab="'+v+'">'+t+'</button>').join('')+'</div>'}
function opInit(){if(!S.op)S.op={date:ymd(new Date()),f:{},r:{},cat:'Semua'};return S.op}
function opDiff(p){const o=opInit(),v=o.f[p.kode];if(v===undefined||v==='')return null;return (+v)-stockOf(p.kode)}
function opDiffHtml(p){const d=opDiff(p);if(d==null)return '';if(!d)return '<span class="pill-s ps-ok">Cocok</span>';
  return '<b class="num" style="color:'+(d<0?'var(--bad)':'var(--ok)')+'">'+(d<0?'Kurang ':'Lebih ')+Math.abs(d)+' '+esc(p.unit||'')+'</b> <small class="num" style="color:var(--muted)">'+(d<0?'−':'+')+rp(Math.abs(d)*(+p.modal||0))+'</small>'}
function opRow(p){const o=opInit(),k=esc(p.kode),v=o.f[p.kode],d=opDiff(p);
  return '<div class="oprow'+(d?' bad':'')+'" id="opr-'+k+'"><span class="opn"><b>'+esc(p.name)+'</b><small>Sistem <b class="num">'+stockOf(p.kode)+'</b> '+esc(p.unit||'')+'</small></span>'+
   '<input class="in num opin" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" data-num="1" data-opf="'+k+'" value="'+esc(v==null?'':v)+'" placeholder="Fisik" aria-label="Stok fisik '+esc(p.name)+'">'+
   '<button type="button" class="btn3 sm" data-opsame="'+k+'" title="Jumlah fisik sama dengan sistem">Sama</button>'+
   '<div class="opx"><span id="opd-'+k+'">'+opDiffHtml(p)+'</span><select class="in ops" data-opr="'+k+'"'+(d?'':' hidden')+' aria-label="Alasan selisih '+esc(p.name)+'"><option value="">Pilih alasan…</option>'+Object.entries(ALASAN).map(([a,t])=>'<option value="'+a+'"'+(o.r[p.kode]===a?' selected':'')+'>'+t+'</option>').join('')+'</select></div></div>'}
function opSummary(){const o=opInit(),ps=S.products.filter(p=>o.f[p.kode]!==undefined&&o.f[p.kode]!=='');const ds=ps.map(p=>({p,d:opDiff(p)})).filter(x=>x.d);
  const net=sum(ds,x=>x.d*(+x.p.modal||0));
  return '<b>'+ps.length+'</b> produk dihitung · <b>'+ds.length+'</b> selisih'+(ds.length?' · nilai <b class="num" style="color:'+(net<0?'var(--bad)':'var(--ok)')+'">'+(net<0?'−':'+')+rp(Math.abs(net))+'</b>':'')}
function opBatches(){const by={};(S.adjust||[]).forEach(x=>{const b=by[x.batch]=by[x.batch]||{batch:x.batch,date:x.date,at:x.createdAt||'',rows:[]};b.rows.push(x);if(String(x.createdAt||'')>b.at)b.at=x.createdAt});
  return Object.values(by).sort((a,b)=>String(b.date).localeCompare(String(a.date))||String(b.at).localeCompare(String(a.at)))}
function opnameView(){const o=opInit(),cats=['Semua',...new Set(S.products.map(p=>p.cat).filter(Boolean))];
  const list=sortedProducts().filter(p=>o.cat==='Semua'||p.cat===o.cat),bs=opBatches();
  return '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));align-items:start">'+
   '<form id="opForm" class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>Hitung stok di rak</h3><p>Isi jumlah fisik. Produk yang dikosongkan tidak diubah.</p></div></div>'+
   '<label class="f">Tanggal opname<input class="in" type="date" id="op-date" data-bind="op.date" value="'+esc(o.date)+'" required></label>'+
   '<div class="seg" aria-label="Kategori">'+cats.map(c=>'<button type="button" class="sg'+(o.cat===c?' on':'')+'" data-opcat="'+esc(c)+'">'+esc(c)+'</button>').join('')+'</div>'+
   '<div class="oplist">'+(list.length?list.map(opRow).join(''):'<div class="empty">Belum ada produk.</div>')+'</div>'+
   '<div class="banner b-lav opsum" id="opsum" role="status">'+opSummary()+'</div>'+
   '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" type="submit"'+(S.busy?' disabled':'')+'>'+(S.busy?'Menyimpan…':'Simpan opname')+'</button><button type="button" class="btn3" data-act="opreset">Kosongkan</button></div>'+
   '<small style="color:var(--muted)">Saat disimpan, stok sistem disamakan dengan jumlah fisik. Barang yang kurang dicatat sebagai susut dengan harga modal rata-rata dan mengurangi untung bersih.</small></form>'+
   '<div class="card"><div class="ch"><div><h3>Riwayat opname</h3><p>'+bs.length+' kali opname</p></div></div>'+
   (bs.length?bs.slice(0,S.opLimit||20).map(b=>{const kur=sum(b.rows.filter(x=>x.qty<0),x=>-x.qty),leb=sum(b.rows.filter(x=>x.qty>0),x=>+x.qty),net=sum(b.rows,x=>(+x.qty||0)*(+x.modal||0)),open=S.opopen===b.batch,cf=S.opdel===b.batch,id=esc(b.batch);
     return '<div class="li sirow" style="flex-direction:column;align-items:stretch;gap:8px"><div style="display:flex;justify-content:space-between;gap:10px"><span><b>'+esc(String(b.date).slice(0,10))+'</b><br><small style="color:var(--muted)">'+b.rows.length+' produk selisih'+(kur?' · kurang '+kur:'')+(leb?' · lebih '+leb:'')+'</small></span>'+
       '<span style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><b class="num" style="color:'+(net<0?'var(--bad)':'var(--ok)')+'">'+(net<0?'−':'+')+rp(Math.abs(net))+'</b><span style="display:flex;gap:6px"><button type="button" class="btn3 sm" data-opopen="'+id+'" aria-expanded="'+open+'">'+(open?'Tutup':'Detail')+'</button>'+(cf?'<button type="button" class="btn3 sm dang" data-opdelok="'+id+'">Ya, batalkan</button>':'<button type="button" class="btn3 sm dang" data-opdel="'+id+'">Batalkan</button>')+'</span></span></div>'+
       (open?'<div class="opdet">'+b.rows.map(x=>{const p=prod(x.kode);return '<div><span>'+esc(p?p.name:x.kode)+' <small style="color:var(--muted)">'+(+x.sistem||0)+' → '+((+x.sistem||0)+(+x.qty||0))+' · '+esc(ALASAN[x.alasan]||x.alasan||'')+'</small></span><b class="num" style="color:'+(x.qty<0?'var(--bad)':'var(--ok)')+'">'+(x.qty<0?'':'+')+x.qty+'</b></div>'}).join('')+'</div>':'')+'</div>'}).join('')+
     (bs.length>(S.opLimit||20)?'<div style="text-align:center;padding-top:10px"><button type="button" class="btn2" data-act="opmore">Tampilkan lagi</button></div>':'')
    :'<div class="empty">Belum pernah opname. Hasil yang ada selisihnya akan muncul di sini.</div>')+'</div></div>'}
function opRefresh(kode){const p=prod(kode);if(!p)return;const d=opDiff(p),el=document.getElementById('opd-'+kode),row=document.getElementById('opr-'+kode);
  if(el)el.innerHTML=opDiffHtml(p);if(row){row.classList.toggle('bad',!!d);const sel=row.querySelector('select');if(sel)sel.hidden=!d}
  const sm=document.getElementById('opsum');if(sm)sm.innerHTML=opSummary()}
async function saveOpnameDoc(body){const r=await run(api('POST','/api/admin/opname',body,true));await loadAdmin();return r}
async function deleteOpnameDoc(batch){await run(api('DELETE','/api/admin/opname/'+encodeURIComponent(batch),null,true));await loadAdmin()}
async function saveOpname(){const o=opInit();if(!o.date){toast('Isi tanggal opname');return}
  const items=S.products.filter(p=>o.f[p.kode]!==undefined&&o.f[p.kode]!=='').map(p=>({kode:p.kode,fisik:Math.round(+o.f[p.kode]),alasan:o.r[p.kode]||''}));
  if(!items.length){toast('Isi jumlah fisik minimal satu produk');return}
  const kosong=S.products.filter(p=>{const d=opDiff(p);return d&&!o.r[p.kode]});
  if(kosong.length){toast('Pilih alasan selisih untuk '+kosong.map(p=>p.name).slice(0,3).join(', ')+(kosong.length>3?' dan '+(kosong.length-3)+' lainnya':''));const el=document.querySelector('[data-opr="'+kosong[0].kode+'"]');if(el)el.focus();return}
  S.busy=true;render();
  try{const r=await saveOpnameDoc({date:o.date,items});S.op=Object.assign({},o,{f:{},r:{}});toast(r&&r.adjusted?'Opname tersimpan, '+r.adjusted+' produk disesuaikan':'Opname tersimpan, semua stok cocok')}catch(e){}
  S.busy=false;render()}
async function opnameCsv(){const rows=[['Tanggal','No opname','Kode','Produk','Stok sistem','Stok fisik','Selisih','Modal/unit','Nilai','Alasan']];
  opBatches().forEach(b=>b.rows.forEach(x=>{const p=prod(x.kode);rows.push([String(x.date).slice(0,10),b.batch,x.kode,p?p.name:x.kode,+x.sistem||0,(+x.sistem||0)+(+x.qty||0),+x.qty||0,+x.modal||0,(+x.qty||0)*(+x.modal||0),ALASAN[x.alasan]||x.alasan||''])}));
  await downloadCsv('stok-opname-kamart.csv',rows)}
document.addEventListener('input',e=>{const t=e.target;if(!t.dataset||!t.dataset.opf)return;opInit().f[t.dataset.opf]=t.value;opRefresh(t.dataset.opf)});
document.addEventListener('change',e=>{const t=e.target;if(!t.dataset||!t.dataset.opr)return;opInit().r[t.dataset.opr]=t.value});
document.addEventListener('submit',e=>{if(e.target&&e.target.id==='opForm'){e.preventDefault();e.stopPropagation();saveOpname()}},true);
document.addEventListener('click',async e=>{const t=e.target.closest('[data-stab],[data-opcat],[data-opsame],[data-opopen],[data-opdel],[data-opdelok],[data-act="opreset"],[data-act="opcsv"],[data-act="opmore"]');if(!t)return;const d=t.dataset;
  if(d.stab){S.stab=d.stab;render();return}
  if(d.opcat){opInit().cat=d.opcat;render();return}
  if(d.opsame){const p=prod(d.opsame);if(!p)return;opInit().f[p.kode]=String(Math.max(0,stockOf(p.kode)));const i=document.querySelector('[data-opf="'+p.kode+'"]');if(i)i.value=opInit().f[p.kode];opRefresh(p.kode);return}
  if(d.act==='opreset'){const o=opInit();o.f={};o.r={};render();return}
  if(d.act==='opcsv'){opnameCsv();return}
  if(d.act==='opmore'){S.opLimit=(S.opLimit||20)+20;render();return}
  if(d.opopen){S.opopen=S.opopen===d.opopen?null:d.opopen;render();return}
  if(d.opdel){S.opdel=d.opdel;render();return}
  if(d.opdelok){S.opdel=null;S.busy=true;render();try{await deleteOpnameDoc(d.opdelok);toast('Opname dibatalkan, stok kembali seperti sebelumnya')}catch(err){}S.busy=false;render()}});

/* ---------- Export Excel / PDF / CSV (semua halaman admin) ---------- */
const XLIB={xlsx:['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',()=>window.XLSX],
  jspdf:['https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',()=>window.jspdf],
  autotable:['https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js',()=>window.jspdf&&window.jspdf.jsPDF&&window.jspdf.jsPDF.API.autoTable]};
const xLoaded={};
function loadLib(k){if(XLIB[k][1]())return Promise.resolve();if(xLoaded[k])return xLoaded[k];
  xLoaded[k]=new Promise((ok,no)=>{const s=document.createElement('script');s.src=XLIB[k][0];s.onload=()=>ok();s.onerror=()=>{xLoaded[k]=null;no(new Error('Gagal memuat modul export. Cek koneksi internet.'))};document.head.appendChild(s)});return xLoaded[k]}
const xRp=v=>(+v<0?'-':'')+rp(Math.abs(+v||0));
const xDate=d=>{if(!d)return '';const s=String(d);if(/^\d{4}-\d{2}-\d{2}$/.test(s.slice(0,10))&&s.length<=10){const[y,m,dd]=s.split('-');return dd+'/'+m+'/'+y}return tglJam(d)};
const xToday=()=>ymd(new Date());
/* kolom: [judul, tipe] tipe: s teks, n angka, rp rupiah, p persen */
function xSheet(name,cols,rows,opt){opt=opt||{};const s={name,cols:cols.map(c=>({h:c[0],t:c[1]||'s'})),rows};
  if(opt.total){s.total=s.cols.map((c,i)=>i===0?'Total':(opt.total.includes(i)?sum(rows,r=>+r[i]||0):''))}
  if(opt.note)s.note=opt.note;return s}
function xKV(name,pairs){return xSheet(name,[['Keterangan'],['Nilai','kv']],pairs.map(p=>[p[0],{v:p[1],t:p[2]||'rp'}]))}
const xOrderRow=o=>[tglJam(o.createdAt),o.code||'',o.source==='online'?'Online':'Kasir',o.customerName,o.customerLine||'',itemsText(o),sum(o.items||[],i=>+i.qty||0),+o.total||0,+o.modalTotal||0,o.stage<0?0:profit(o),payLabel(o.pay),o.stage<0?'-':o.paid?'Lunas':'Belum',stageText(o.stage)];
const xOrderCols=[['Tanggal'],['Kode'],['Sumber'],['Pembeli'],['Bagian'],['Barang'],['Item','n'],['Total','rp'],['Modal','rp'],['Untung','rp'],['Bayar'],['Status bayar'],['Tahap']];

function exportSpec(view){
  const now=new Date(),t=xToday(),v=valid();
  if(view==='dashboard'){const mo=mk(now),today=v.filter(o=>sameDay(o.createdAt)),month=v.filter(o=>mk(o.createdAt)===mo),kb=unpaidKasbon();
    const low=sortedProducts().map(p=>({p,s:stockOf(p.kode)})).filter(x=>x.s<=(+x.p.min||0));
    const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const l=v.filter(o=>sameDay(o.createdAt,d));return[xDate(ymd(d)),l.length,sum(l,o=>+o.total||0),sum(l,profit)]});
    const top={};month.forEach(o=>(o.items||[]).forEach(i=>{const r=top[i.kode]=top[i.kode]||[i.name,0,0];r[1]+=+i.qty||0;r[2]+=(+i.qty||0)*(+i.price||0)}));
    return{file:'dashboard-'+t,title:'Dashboard',sub:'Per '+tglJam(now),sheets:[
      xKV('Ringkasan',[['Penjualan hari ini',sum(today,o=>+o.total||0)],['Pesanan hari ini',today.length,'n'],['Penjualan '+mLabel(mo),sum(month,o=>+o.total||0)],['Untung kotor '+mLabel(mo),sum(month,profit)],['Belum dibayar',sum(kb,o=>+o.total||0)],['Pesanan menunggu disiapkan',v.filter(o=>o.stage<2).length,'n'],['Produk perlu restock',low.length,'n']]),
      xSheet('Penjualan 7 hari',[['Tanggal'],['Transaksi','n'],['Penjualan','rp'],['Untung','rp']],days,{total:[1,2,3]}),
      xSheet('Produk terlaris',[['Produk'],['Terjual','n'],['Omzet','rp']],Object.values(top).sort((a,b)=>b[1]-a[1]),{total:[1,2]}),
      xSheet('Stok menipis',[['Kode'],['Produk'],['Sisa','n'],['Minimum','n']],low.map(x=>[x.p.kode,x.p.name,x.s,+x.p.min||0]))]}}
  if(view==='pesanan'){const l=v.filter(o=>o.stage<3||sameDay(o.createdAt)||!o.paid).sort((a,b)=>(a.stage-b.stage)||a.createdAt.localeCompare(b.createdAt));
    return{file:'pesanan-'+t,title:'Pesanan',sub:'Pesanan berjalan per '+tglJam(now),sheets:[
      xSheet('Pesanan',[['Tahap'],['Kode'],['Waktu'],['Pembeli'],['Bagian'],['Barang'],['Total','rp'],['Bayar'],['Status bayar'],['Waktu ambil'],['Catatan']],l.map(o=>[STAGES[o.stage],o.code||'',tglJam(o.createdAt),o.customerName,o.customerLine||'',itemsText(o),+o.total||0,payLabel(o.pay),o.paid?'Lunas':'Belum',o.slot||'',o.note||'']),{total:[6]}),
      xSheet('Per tahap',[['Tahap'],['Pesanan','n'],['Total','rp']],STAGES.map((s,i)=>{const x=l.filter(o=>o.stage===i);return[s,x.length,sum(x,o=>+o.total||0)]}),{total:[1,2]})]}}
  if(view==='riwayat'){const f=rhInit(),[a,b]=rhRange(),l=riwayatList(),ok=l.filter(o=>o.stage>=0);
    return{file:'riwayat-pesanan-'+a+'_'+b,title:'Riwayat Pesanan',sub:xDate(a)+' s/d '+xDate(b)+(f.q?' · cari "'+f.q+'"':''),sheets:[
      xSheet('Riwayat',xOrderCols.concat([['Waktu ambil'],['Catatan'],['Diskon','rp'],['Voucher']]),l.map(o=>xOrderRow(o).concat([o.slot||'',o.note||'',sum(o.diskon||[],d=>+d.nilai||0),o.voucher||''])),{total:[6,7,8,9,15]}),
      xKV('Ringkasan',[['Pesanan',l.length,'n'],['Dibatalkan',l.length-ok.length,'n'],['Omzet (tanpa batal)',sum(ok,o=>+o.total||0)],['Untung',sum(ok,profit)],['Belum dibayar',sum(ok.filter(o=>!o.paid),o=>+o.total||0)]])]}}
  if(view==='kasir'&&S.ktab==='tutup'){const h=(S.cashclose||[]).slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
    return{file:'tutup-kasir-'+t,title:'Tutup Kasir',sub:'Per '+tglJam(now),sheets:[xSheet('Tutup kasir',[['Tanggal'],['Modal awal','rp'],['Penjualan tunai','rp'],['Pelunasan kasbon','rp'],['Belanja stok dari laci','rp'],['Uang keluar lain','rp'],['Seharusnya','rp'],['Dihitung','rp'],['Selisih','rp'],['Keterangan']],
      h.map(x=>[xDate(String(x.date).slice(0,10)),+x.modal||0,+x.tunai||0,+x.kasbon||0,+x.belanja||0,+x.keluar||0,+x.seharusnya||0,+x.fisik||0,+x.selisih||0,[x.ketKeluar,x.catatan].filter(Boolean).join(' · ')]),{total:[8]})]}}
  if(view==='kasir'){const l=v.filter(o=>o.source==='kasir'&&sameDay(o.createdAt)).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
    return{file:'kasir-'+t,title:'Transaksi Kasir',sub:'Hari ini, '+xDate(t),sheets:[
      xSheet('Transaksi kasir',[['Waktu'],['Kode'],['Pembeli'],['Barang'],['Total','rp'],['Untung','rp'],['Bayar'],['Status']],l.map(o=>[tglJam(o.createdAt),o.code||'',o.customerName,itemsText(o),+o.total||0,profit(o),payLabel(o.pay),o.paid?'Lunas':'Belum']),{total:[4,5]}),
      xSheet('Per cara bayar',[['Cara bayar'],['Transaksi','n'],['Total','rp']],[...new Set(l.map(o=>o.pay))].map(p=>{const x=l.filter(o=>o.pay===p);return[payLabel(p),x.length,sum(x,o=>+o.total||0)]}),{total:[1,2]})]}}
  if(view==='produk'){const ps=sortedProducts();
    return{file:'produk-'+t,title:'Daftar Produk',sub:'Per '+tglJam(now)+' · '+ps.length+' produk',sheets:[
      xSheet('Produk',[['Kode'],['Nama'],['Kategori'],['Satuan'],['Modal','rp'],['Jual','rp'],['Untung','rp'],['Margin','p'],['Sisa stok','n'],['Min','n'],['Nilai stok','rp'],['Status'],['Online']],ps.map(p=>{const st=stockOf(p.kode),u=(+p.jual||0)-(+p.modal||0);
        return[p.kode,p.name,p.cat,p.unit||'',+p.modal||0,+p.jual||0,u,p.jual?u/p.jual:0,st,+p.min||0,Math.max(0,st)*(+p.modal||0),st<=0?'Habis':st<=(+p.min||0)?'Menipis':'Aman',p.online!==false&&catOnline(p.cat)?'Ya':'Tidak']}),{total:[8,10]})]}}
  if(view==='promo'){const l=(S.promos||[]);
    return{file:'promo-'+t,title:'Promo & Diskon',sub:'Per '+tglJam(now)+' · '+l.length+' promo',sheets:[
      xSheet('Promo',[['Nama'],['Jenis'],['Detail'],['Mulai'],['Selesai'],['Status'],['Dipakai','n'],['Total hemat','rp']],l.map(p=>{const u=promoUsage(p)||{};return[p.nama||'',PTIPE[p.tipe]||p.tipe,promoDesc(p)+(p.voucher?' · kode '+p.voucher:''),p.mulai?tglJam(p.mulai):'',p.selesai?tglJam(p.selesai):'',promoStatus(p)[0],+u.n||0,+u.total||0]}),{total:[6,7]})]}}
  if(view==='stok'){
    if(S.stab==='opname'){const bs=opBatches(),ps=sortedProducts();
      return{file:'stok-opname-'+t,title:'Stok Opname',sub:'Per '+tglJam(now),sheets:[
        xSheet('Lembar hitung',[['Kode'],['Produk'],['Kategori'],['Satuan'],['Stok sistem','n'],['Stok fisik'],['Selisih'],['Alasan']],ps.map(p=>[p.kode,p.name,p.cat,p.unit||'',stockOf(p.kode),'','',''])),
        xSheet('Riwayat opname',[['Tanggal'],['No opname'],['Kode'],['Produk'],['Sistem','n'],['Fisik','n'],['Selisih','n'],['Modal/unit','rp'],['Nilai','rp'],['Alasan']],
          bs.flatMap(b=>b.rows.map(x=>{const p=prod(x.kode);return[xDate(String(x.date).slice(0,10)),b.batch,x.kode,p?p.name:x.kode,+x.sistem||0,(+x.sistem||0)+(+x.qty||0),+x.qty||0,+x.modal||0,(+x.qty||0)*(+x.modal||0),ALASAN[x.alasan]||x.alasan||'']})),{total:[6,8]})]}}
    const l=S.stockin.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));const r=hppReplay(S.stockin,S.orders,{fallback:modalFb(),adjust:S.adjust});
    return{file:'stok-masuk-'+t,title:'Stok Masuk',sub:'Per '+tglJam(now),sheets:[
      xSheet('Stok masuk',[['Tanggal'],['Kode'],['Produk'],['Jumlah','n'],['Harga beli','rp'],['Total','rp'],['Tempat beli'],['Dibayar dari']],l.map(x=>{const p=prod(x.kode);return[xDate(String(x.date).slice(0,10)),x.kode,p?p.name:x.kode,+x.qty||0,+x.harga||0,(+x.qty||0)*(+x.harga||0),x.tempat||'',x.sumber==='laci'?'Laci kasir':'Uang lain']}),{total:[3,5]}),
      xSheet('Sisa stok',[['Kode'],['Produk'],['Sisa','n'],['Modal rata-rata','rp'],['Nilai','rp']],sortedProducts().map(p=>{const s=r.prod[p.kode],st=stockOf(p.kode),m=s&&s.avg!=null?Math.round(s.avg):+p.modal||0;return[p.kode,p.name,st,m,Math.max(0,st)*m]}),{total:[2,4]})]}}
  if(view==='kasbon'){const all=v.filter(o=>!o.paid&&(o.pay==='Kasbon'||o.stage===3)).sort((a,b)=>a.customerName.localeCompare(b.customerName)||a.createdAt.localeCompare(b.createdAt));
    const by={};all.forEach(o=>{const r=by[o.customerName]=by[o.customerName]||[o.customerName,o.customerLine||'',0,0,o.createdAt];r[2]++;r[3]+=+o.total||0;if(o.createdAt<r[4])r[4]=o.createdAt});
    return{file:'kasbon-'+t,title:'Kasbon',sub:'Belum dibayar per '+tglJam(now),sheets:[
      xSheet('Per pelanggan',[['Pelanggan'],['Bagian'],['Transaksi','n'],['Belum dibayar','rp'],['Sejak']],Object.values(by).sort((a,b)=>b[3]-a[3]).map(r=>[r[0],r[1],r[2],r[3],tglJam(r[4])]),{total:[2,3]}),
      xSheet('Rincian',[['Tanggal'],['Kode'],['Pelanggan'],['Bagian'],['Barang'],['Total','rp'],['Bayar']],all.map(o=>[tglJam(o.createdAt),o.code||'',o.customerName,o.customerLine||'',itemsText(o),+o.total||0,payLabel(o.pay)]),{total:[5]}),
      xSheet('Pelanggan terdaftar',[['Nama'],['Bagian'],['WhatsApp']],S.customers.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(c=>[c.name,c.line||'',c.wa||'']))]}}
  if(view==='rekap'){const mo=S.month,list=v.filter(o=>mk(o.createdAt)===mo).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
    const omzet=sum(list,o=>+o.total||0),untung=sum(list,profit),belanja=sum(S.stockin.filter(x=>String(x.date).slice(0,7)===mo),x=>(+x.qty||0)*(+x.harga||0));
    const exps=(S.expenses||[]).filter(x=>String(x.date).slice(0,7)===mo),peng=sum(exps,x=>+x.jumlah||0),ar=arusStok(mo,belanja,omzet-untung),susut=-ar.adj;
    const per={};list.forEach(o=>(o.items||[]).forEach(i=>{const r=per[i.kode]=per[i.kode]||[i.name,0,0,0,0];r[1]+=+i.qty||0;r[2]+=(+i.qty||0)*(+i.price||0);r[3]+=(+i.qty||0)*(+i.modal||0);r[4]=r[2]-r[3]}));
    const adj=(S.adjust||[]).filter(x=>String(x.date).slice(0,7)===mo);
    return{file:'rekap-'+mo,title:'Rekap '+mLabel(mo),sub:'Dicetak '+tglJam(now),csv:2,sheets:[
      xKV('Ringkasan',[['Penjualan',omzet],['Jumlah transaksi',list.length,'n'],['Untung kotor',untung],['Pengeluaran operasional',peng],['Susut stok opname',susut],['Untung bersih',untung-peng-susut],['Uang diterima',sum(list.filter(o=>o.paid),o=>+o.total||0)],['Belum dibayar',sum(list.filter(o=>!o.paid),o=>+o.total||0)],
        ['Stok awal bulan',ar.awal],['Belanja stok',belanja],['Modal barang terjual (HPP)',omzet-untung],['Penyesuaian opname',ar.adj],['Stok akhir seharusnya',ar.hitung],['Nilai sisa stok (sistem)',ar.akhir],['Selisih',ar.selisih]]),
      xSheet('Per produk',[['Produk'],['Terjual','n'],['Omzet','rp'],['Modal','rp'],['Untung','rp']],Object.values(per).sort((a,b)=>b[2]-a[2]),{total:[1,2,3,4]}),
      xSheet('Transaksi',xOrderCols,list.map(xOrderRow),{total:[6,7,8,9]}),
      xSheet('Pengeluaran',[['Tanggal'],['Keterangan'],['Jumlah','rp']],exps.slice().sort((a,b)=>String(a.date).localeCompare(String(b.date))).map(x=>[xDate(String(x.date).slice(0,10)),x.ket,+x.jumlah||0]),{total:[2]}),
      xSheet('Belanja stok',[['Tanggal'],['Produk'],['Jumlah','n'],['Harga beli','rp'],['Total','rp'],['Tempat']],S.stockin.filter(x=>String(x.date).slice(0,7)===mo).sort((a,b)=>String(a.date).localeCompare(String(b.date))).map(x=>{const p=prod(x.kode);return[xDate(String(x.date).slice(0,10)),p?p.name:x.kode,+x.qty||0,+x.harga||0,(+x.qty||0)*(+x.harga||0),x.tempat||'']}),{total:[2,4]}),
      xSheet('Stok opname',[['Tanggal'],['Produk'],['Selisih','n'],['Nilai','rp'],['Alasan']],adj.map(x=>{const p=prod(x.kode);return[xDate(String(x.date).slice(0,10)),p?p.name:x.kode,+x.qty||0,(+x.qty||0)*(+x.modal||0),ALASAN[x.alasan]||x.alasan||'']}),{total:[2,3]})]}}
  if(view==='master'){const m=M(),yn=b=>b===false?'Tidak':'Ya';
    return{file:'master-'+t,title:'Data Master',sub:'Per '+tglJam(now),sheets:[
      xSheet('Kategori',[['Nama'],['Tampil online']],m.kategori.map(c=>[c.nama,yn(c.online)])),
      xSheet('Pembayaran',[['Kode'],['Label'],['Tipe'],['Online'],['Kasir'],['Aktif'],['Keterangan']],m.bayar.map(b=>[b.kode,b.label,b.tipe,yn(b.online),yn(b.kasir),yn(b.aktif),b.ket||''])),
      xSheet('Waktu ambil',[['Waktu'],['Aktif'],['Utama']],m.waktu.map(w=>[w.label,yn(w.aktif),w.utama?'Ya':''])),
      xSheet('Satuan & bagian',[['Satuan'],['Bagian / line']],[...Array(Math.max(m.satuan.length,m.bagian.length))].map((_,i)=>[m.satuan[i]||'',m.bagian[i]||''])),
      xKV('Toko',[['Lokasi ambil',m.toko.lokasi,'s'],['Tutup pesanan (menit sebelum)',+m.toko.tutup||0,'n']])]}}
  return null}

function xCell(c,col){const o=c&&typeof c==='object'?c:{v:c,t:col.t==='kv'?'s':col.t};return o}
function xText(c,col){const o=xCell(c,col),v=o.v;if(v===''||v==null)return '';
  if(o.t==='rp')return xRp(v);if(o.t==='n')return (+v||0).toLocaleString('id-ID');if(o.t==='p')return Math.round((+v||0)*100)+'%';return String(v)}
function xFile(spec,ext){return 'kamart-'+spec.file.replace(/[^\w.-]+/g,'-')+'.'+ext}

async function exportXlsx(spec){await loadLib('xlsx');const X=window.XLSX,wb=X.utils.book_new(),used=new Set();
  spec.sheets.forEach(sh=>{const aoa=[['KAmart · '+spec.title],[spec.sub||''],[sh.name],[],sh.cols.map(c=>c.h)];
    const body=sh.rows.concat(sh.total?[sh.total]:[]);
    body.forEach(r=>aoa.push(r.map((c,i)=>{const o=xCell(c,sh.cols[i]||{t:'s'});return o.v==null?'':(o.t==='rp'||o.t==='n'||o.t==='p')&&o.v!==''?+o.v||0:o.v})));
    const ws=X.utils.aoa_to_sheet(aoa);
    body.forEach((r,ri)=>r.forEach((c,ci)=>{const o=xCell(c,sh.cols[ci]||{t:'s'}),a=X.utils.encode_cell({r:ri+5,c:ci});if(!ws[a]||ws[a].t!=='n')return;
      ws[a].z=o.t==='rp'?'"Rp"#,##0;[Red]-"Rp"#,##0':o.t==='p'?'0%':'#,##0'}));
    ws['!cols']=sh.cols.map((c,ci)=>({wch:Math.min(60,Math.max(8,String(c.h).length+2,...body.map(r=>xText(r[ci],c).length+2)))}));
    ws['!autofilter']=sh.rows.length?{ref:X.utils.encode_range({s:{r:4,c:0},e:{r:4+sh.rows.length,c:sh.cols.length-1}})}:undefined;
    let nm=sh.name.replace(/[\\/?*[\]:]/g,'').slice(0,31)||'Data';while(used.has(nm))nm=nm.slice(0,28)+used.size;used.add(nm);
    X.utils.book_append_sheet(wb,ws,nm)});
  const buf=X.write(wb,{bookType:'xlsx',type:'array'});
  await saveFile(xFile(spec,'xlsx'),new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}))}

const pdfSafe=s=>String(s).replace(/[−–—]/g,'-').replace(/→/g,'->').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/…/g,'...').replace(/[^\x00-\xFF]/g,'');
let xLogo=null;
async function logoData(){if(xLogo!==null)return xLogo;try{const im=new Image();im.src='logo.png';await im.decode();const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d');g.beginPath();g.arc(48,48,48,0,Math.PI*2);g.clip();g.drawImage(im,0,0,96,96);xLogo=c.toDataURL('image/png')}catch(e){xLogo=''}return xLogo}
async function exportPdf(spec){await loadLib('jspdf');await loadLib('autotable');
  const wide=Math.max(...spec.sheets.map(s=>s.cols.length))>7,doc=new window.jspdf.jsPDF({orientation:wide?'landscape':'portrait',unit:'mm',format:'a4'});
  const W=doc.internal.pageSize.getWidth(),H=doc.internal.pageSize.getHeight(),logo=await logoData();
  doc.setFillColor(110,90,196);doc.rect(0,0,W,24,'F');
  if(logo)try{doc.addImage(logo,'PNG',10,4,16,16)}catch(e){}
  doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(15);doc.text(pdfSafe('KAmart · '+spec.title),logo?30:12,12);
  doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text(pdfSafe(spec.sub||''),logo?30:12,18);
  let y=32;
  spec.sheets.forEach((sh,si)=>{if(si&&y>H-40){doc.addPage();y=16}
    doc.setTextColor(43,33,64);doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text(pdfSafe(sh.name),12,y);y+=2;
    const num=sh.cols.map((c,i)=>c.t==='rp'||c.t==='n'||c.t==='p'||(c.t==='kv'&&sh.rows.some(r=>{const o=xCell(r[i],c);return o.t!=='s'})));
    const cs={};num.forEach((n,i)=>{if(n)cs[i]={halign:'right'}});
    window.jspdf.jsPDF.API.autoTable.call(doc,{startY:y,margin:{left:12,right:12},head:[sh.cols.map(c=>pdfSafe(c.h))],
      body:sh.rows.length?sh.rows.map(r=>sh.cols.map((c,i)=>pdfSafe(xText(r[i],c)))):[[{content:'Tidak ada data',colSpan:sh.cols.length,styles:{halign:'center',textColor:[140,130,160]}}]],
      foot:sh.total&&sh.rows.length?[sh.cols.map((c,i)=>pdfSafe(xText(sh.total[i],c)))]:undefined,showFoot:'lastPage',
      styles:{font:'helvetica',fontSize:8,cellPadding:1.8,overflow:'linebreak',textColor:[43,33,64]},
      headStyles:{fillColor:[110,90,196],textColor:255,fontStyle:'bold'},footStyles:{fillColor:[237,231,255],textColor:[43,33,64],fontStyle:'bold'},
      alternateRowStyles:{fillColor:[249,247,253]},columnStyles:cs,
      didParseCell:d=>{if((d.section==='head'||d.section==='foot')&&num[d.column.index])d.cell.styles.halign='right'}});
    y=doc.lastAutoTable.finalY+10});
  const n=doc.getNumberOfPages();for(let i=1;i<=n;i++){doc.setPage(i);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(120,110,140);
    doc.text(pdfSafe('Dicetak '+tglJam(new Date())+' · kamart'),12,H-6);doc.text('Halaman '+i+' dari '+n,W-12,H-6,{align:'right'})}
  await saveFile(xFile(spec,'pdf'),doc.output('blob'))}

async function exportCsvSpec(spec){const sh=spec.sheets[spec.csv||0];
  const rows=[sh.cols.map(c=>c.h)].concat(sh.rows.map(r=>r.map((c,i)=>{const o=xCell(c,sh.cols[i]);return o.t==='p'?Math.round((+o.v||0)*100):o.v})));
  await downloadCsv(xFile(spec,'csv'),rows)}

function exportHtml(){const spec=exportSpec(S.view),b=S.xp.busy;
  if(!spec)return '';
  const btn=(k,ic2,t,d)=>'<button type="button" class="xbtn" data-xfmt="'+k+'"'+(b?' disabled':'')+'><span class="tile t-'+ic2+'">'+(b===k?'<span class="spin"></span>':ic(k==='pdf'?'doc':k==='xlsx'?'grid':'down',20))+'</span><span><b>'+t+'</b><small>'+d+'</small></span></button>';
  return '<div class="modal" role="dialog" aria-modal="true" aria-label="Export"><div class="box stack" style="gap:14px;max-width:440px">'+
   '<div class="ch" style="margin:0"><div><h3>Export '+esc(spec.title)+'</h3><p>'+esc(spec.sub||'')+'</p></div><button type="button" class="btn3" data-act="xclose">Tutup</button></div>'+
   '<small style="color:var(--muted)">Isi: '+spec.sheets.map(s=>esc(s.name)+' ('+s.rows.length+')').join(', ')+'</small>'+
   btn('xlsx','mint','Excel (.xlsx)','Semua tabel, tiap tabel jadi satu sheet. Angka bisa dihitung ulang.')+
   btn('pdf','pink','PDF','Siap cetak atau kirim lewat WhatsApp.')+
   btn('csv','lav','CSV','Tabel '+esc(spec.sheets[spec.csv||0].name)+' saja, untuk Google Sheets atau aplikasi lain.')+
   '</div></div>'}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-act="xopen"],[data-act="xclose"],[data-xfmt]');if(!t)return;
  if(t.dataset.act==='xopen'){S.xp={open:true,busy:''};render();return}
  if(t.dataset.act==='xclose'){S.xp=null;render();return}
  const f=t.dataset.xfmt;if(!S.xp||S.xp.busy)return;const spec=exportSpec(S.view);if(!spec)return;
  S.xp.busy=f;render();
  try{if(f==='xlsx')await exportXlsx(spec);else if(f==='pdf')await exportPdf(spec);else await exportCsvSpec(spec);if(f!=='csv')toast('File '+xFile(spec,f)+' diunduh');S.xp=null}
  catch(err){toast(err&&err.code==='declined'?'Unduhan dibatalkan':(err&&err.message)||'Export gagal')}
  if(S.xp)S.xp.busy='';render()});

/* ---------- Tutup kasir (hitung uang di laci) ---------- */
const PECAHAN=[100000,50000,20000,10000,5000,2000,1000];
function kasirTabs(){const t=S.ktab||'jual';return '<div class="seg" role="tablist" aria-label="Kasir" style="margin-bottom:14px">'+[['jual','Transaksi'],['tutup','Tutup kasir']].map(([v,l])=>'<button type="button" role="tab" class="sg'+(t===v?' on':'')+'" aria-selected="'+(t===v)+'" data-ktab="'+v+'">'+l+'</button>').join('')+'</div>'}
const payDay=o=>ymd(new Date(o.paidAt||o.createdAt));
const tipeOf=o=>(payInfo(o.pay)||{}).tipe||(o.pay==='Tunai'?'tunai':o.pay==='Kasbon'?'kasbon':'');
function ccInit(date){date=date||ymd(new Date());if(S.cc&&S.cc.date===date)return S.cc;
  const saved=(S.cashclose||[]).find(x=>String(x.date).slice(0,10)===date),last=(S.cashclose||[]).filter(x=>String(x.date).slice(0,10)<date).sort((a,b)=>String(b.date).localeCompare(String(a.date)))[0];
  S.cc=saved?{date,modal:String(saved.modal),keluar:saved.keluar?String(saved.keluar):'',ketKeluar:saved.ketKeluar||'',kasbonTunai:saved.kasbon>0||!ccData(date).kasbonL.length,pec:Object.fromEntries(Object.entries(saved.pecahan||{}).map(([k,v])=>[k,String(v)])),catatan:saved.catatan||'',add:{},saved:true}
    :{date,modal:last?String(last.modal):'',keluar:'',ketKeluar:'',kasbonTunai:true,pec:{},catatan:'',add:{},saved:false};
  return S.cc}
function ccData(date){const ok=valid().filter(o=>o.paid&&o.stage>=0&&payDay(o)===date);
  return{tunaiL:ok.filter(o=>tipeOf(o)==='tunai'),kasbonL:ok.filter(o=>tipeOf(o)==='kasbon'),qrisL:ok.filter(o=>tipeOf(o)!=='tunai'&&tipeOf(o)!=='kasbon'),
    belumL:valid().filter(o=>!o.paid&&tipeOf(o)==='tunai'&&ymd(new Date(o.createdAt))===date),
    belanjaL:S.stockin.filter(x=>x.sumber==='laci'&&String(x.date).slice(0,10)===date)}}
function ccFisik(c){return sum(PECAHAN,p=>p*(+c.pec[p]||0))+(+c.pec.koin||0)}
function ccCalc(){const c=ccInit(S.cc&&S.cc.date),d=ccData(c.date),tunai=sum(d.tunaiL,o=>+o.total||0),kasbon=c.kasbonTunai?sum(d.kasbonL,o=>+o.total||0):0,modal=+c.modal||0,keluar=+c.keluar||0,belanja=sum(d.belanjaL,x=>(+x.qty||0)*(+x.harga||0));
  const seharusnya=modal+tunai+kasbon-keluar-belanja,fisik=ccFisik(c),adaFisik=PECAHAN.some(p=>c.pec[p]!==undefined&&c.pec[p]!=='')||(c.pec.koin!==undefined&&c.pec.koin!=='');
  return{c,d,tunai,kasbon,modal,keluar,belanja,seharusnya,fisik,adaFisik,selisih:fisik-seharusnya}}
function ccSummaryHtml(){const k=ccCalc(),row=(l,v,cls,sub)=>'<div class="arow'+(cls?' '+cls:'')+'"><span>'+l+(sub?'<br><small style="color:var(--muted);font-weight:400">'+sub+'</small>':'')+'</span><b class="num">'+v+'</b></div>';
  let h='<div class="arus">'+row('Modal awal laci',rp(k.modal),'','uang kembalian di awal hari')+
    row('+ Penjualan tunai lunas',rp(k.tunai),'',k.d.tunaiL.length+' transaksi (kasir & online)')+
    (k.d.kasbonL.length?row('+ Pelunasan kasbon',rp(k.kasbon),'',k.d.kasbonL.length+' pelunasan'+(k.c.kasbonTunai?' dibayar tunai':' tidak tunai, tidak dihitung')):'')+
    (k.d.belanjaL.length?row('− Belanja stok dari laci',rp(k.belanja),'',esc(k.d.belanjaL.map(x=>{const p=prod(x.kode);return (p?p.name:x.kode)+' ×'+x.qty}).join(', '))):'')+
    (k.keluar?row('− Uang keluar lainnya',rp(k.keluar),'',esc(k.c.ketKeluar||'')):'')+
    row('= Seharusnya ada di laci',rp(k.seharusnya),'tot')+
    row('Uang dihitung',k.adaFisik?rp(k.fisik):'—')+
    (k.adaFisik?row('Selisih',(k.selisih<0?'−':k.selisih>0?'+':'')+rp(Math.abs(k.selisih)),k.selisih?'bad':'ok'):'')+'</div>';
  if(k.d.qrisL.length)h+='<small style="color:var(--muted)">QRIS/non-tunai hari ini '+rp(sum(k.d.qrisL,o=>+o.total||0))+' ('+k.d.qrisL.length+' transaksi) tidak masuk laci; cocokkan dengan mutasi di aplikasi pembayaran.</small>';
  if(k.d.belumL.length)h+='<small style="color:var(--warn)">'+k.d.belumL.length+' pesanan tunai hari ini belum ditandai lunas ('+rp(sum(k.d.belumL,o=>+o.total||0))+'). Kalau uangnya sudah diterima, tandai lunas dulu.</small>';
  if(!k.adaFisik)return h+'<div class="banner b-lav" style="font-size:13px">Hitung uang di laci per pecahan, nanti selisihnya muncul di sini.</div>';
  if(!k.selisih)return h+'<div class="banner b-mint" style="font-size:13px;color:var(--ok)"><b>Pas.</b> Uang di laci sama dengan catatan.</div>';
  if(k.selisih>0)return h+'<div class="banner b-gold" style="font-size:13px;display:flex;flex-direction:column;gap:6px"><span><b>Uang lebih '+rp(k.selisih)+'.</b> Kemungkinan ada barang yang terjual tapi tidak diinput (atau diinput kurang). Cocokkan dengan stok opname: kalau ada barang yang kurang senilai ini, catat sebagai penjualan di bawah supaya stok dan untung ikut benar.</span></div>';
  return h+'<div class="banner b-pink" style="font-size:13px;color:var(--bad)"><b>Uang kurang '+rp(-k.selisih)+'.</b> Kemungkinan: kembalian berlebih, transaksi ditandai lunas tapi uangnya belum diterima, atau uang diambil dari laci tanpa dicatat. Kalau tetap kurang, selisih ini dihitung sebagai kerugian di Rekap.</div>'}
function ccAddHtml(){const k=ccCalc(),c=k.c,today=c.date===ymd(new Date());if(!k.adaFisik||k.selisih<=0)return '';
  if(!today)return '<div class="card"><small style="color:var(--muted)">Pencatatan penjualan yang terlewat hanya bisa untuk tutup kasir hari ini.</small></div>';
  const lines=Object.entries(c.add).filter(([,q])=>q>0).map(([kode,qty])=>({kode,qty,p:prod(kode)})).filter(x=>x.p),tot=sum(lines,x=>x.qty*(+x.p.jual||0)),sisa=k.selisih-tot;
  return '<div class="card stack" style="gap:10px"><div class="ch" style="margin:0"><div><h3>Catat penjualan yang terlewat</h3><p>Pilih barang yang terjual tapi tidak diinput</p></div></div>'+
   '<div class="ccadd">'+sortedProducts().filter(p=>stockOf(p.kode)>0||c.add[p.kode]).map(p=>{const q=c.add[p.kode]||0;return '<div class="ccp'+(q?' on':'')+'"><span><b>'+esc(p.name)+'</b><small>'+rp(p.jual)+' · sisa '+stockOf(p.kode)+'</small></span><span class="qty"><button type="button" data-ccq="'+esc(p.kode)+'" data-d="-1" aria-label="Kurangi">−</button><b class="num">'+q+'</b><button type="button" data-ccq="'+esc(p.kode)+'" data-d="1" aria-label="Tambah"'+(q>=stockOf(p.kode)?' disabled':'')+'>+</button></span></div>'}).join('')+'</div>'+
   '<div class="arus">'+'<div class="arow"><span>Uang lebih</span><b class="num">'+rp(k.selisih)+'</b></div><div class="arow"><span>Barang dipilih</span><b class="num">'+rp(tot)+'</b></div><div class="arow tot '+(sisa===0?'ok':'')+'"><span>Sisa selisih setelah dicatat</span><b class="num">'+(sisa<0?'−':'')+rp(Math.abs(sisa))+'</b></div></div>'+
   (sisa<0?'<small style="color:var(--warn)">Total barang melebihi uang lebih. Promo/diskon bisa membuat total sedikit berbeda.</small>':'')+
   '<button type="button" class="btn" data-act="ccsale"'+(lines.length&&!S.busy?'':' disabled')+'>Catat sebagai penjualan tunai '+rp(tot)+'</button></div>'}
function vTutupKasir(){const c=ccInit(S.cc&&S.cc.date),hist=(S.cashclose||[]).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const num=(id,key,val,ph)=>'<input class="in num" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" data-num="1" id="'+id+'" data-cc="'+key+'" value="'+esc(val==null?'':val)+'" placeholder="'+(ph||'0')+'">';
  return kasirTabs()+'<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));align-items:start">'+
   '<div class="stack" style="gap:16px"><div class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>Tutup kasir</h3><p>Hitung uang di laci, bandingkan dengan catatan</p></div>'+(c.saved?'<span class="pill-s ps-ok">Tersimpan</span>':'')+'</div>'+
    '<label class="f">Tanggal<input class="in" type="date" id="cc-date" value="'+esc(c.date)+'" max="'+ymd(new Date())+'"></label>'+
    '<div class="grid g2" style="gap:10px"><label class="f">Modal awal laci (Rp)'+num('cc-modal','modal',c.modal)+'</label><label class="f">Uang keluar lainnya (Rp)'+num('cc-keluar','keluar',c.keluar)+'</label></div>'+
    '<label class="f">Keterangan uang keluar<input class="in" id="cc-ket" data-cc="ketKeluar" value="'+esc(c.ketKeluar)+'" placeholder="mis. beli es batu, gas (belanja stok tidak perlu, sudah otomatis)"></label>'+
    (ccData(c.date).kasbonL.length?'<label class="f" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" id="cc-kb" data-cck="1"'+(c.kasbonTunai?' checked':'')+'> Pelunasan kasbon hari ini dibayar tunai (masuk laci)</label>':'')+
    '<div><p class="lbl" style="margin:4px 0 8px;font-weight:700;font-size:13px">Hitung uang di laci</p><div class="pec">'+PECAHAN.map(p=>'<label class="pc"><span>'+rp(p).replace('Rp','')+'</span>'+num('cc-p'+p,'pec.'+p,c.pec[p],'lembar')+'<small id="cc-s'+p+'" class="num">'+(+c.pec[p]?rp(p*(+c.pec[p])):'')+'</small></label>').join('')+
     '<label class="pc"><span>Koin (Rp)</span>'+num('cc-koin','pec.koin',c.pec.koin,'total koin')+'<small></small></label></div></div>'+
    '<div class="arow tot"><span>Total uang dihitung</span><b class="num" id="cc-fisik">'+rp(ccFisik(c))+'</b></div>'+
    '<label class="f">Catatan<input class="in" id="cc-cat" data-cc="catatan" value="'+esc(c.catatan)+'" placeholder="opsional"></label></div></div>'+
   '<div class="stack" style="gap:16px"><div class="card stack" style="gap:10px"><div class="ch" style="margin:0"><div><h3>Perhitungan</h3><p>'+esc(tglPanjang(c.date))+'</p></div></div><div id="cc-sum" class="stack" style="gap:10px">'+ccSummaryHtml()+'</div>'+
    '<button type="button" class="btn" data-act="ccsave"'+(S.busy?' disabled':'')+'>'+(c.saved?'Perbarui tutup kasir':'Simpan tutup kasir')+'</button></div>'+
    '<div id="cc-add">'+ccAddHtml()+'</div>'+
    '<div class="card"><div class="ch"><div><h3>Riwayat tutup kasir</h3><p>'+hist.length+' hari tercatat</p></div></div>'+
    (hist.length?hist.slice(0,S.ccLimit||14).map(x=>{const d=String(x.date).slice(0,10),cf=S.ccdel===d;return '<div class="li" style="align-items:center"><span><b>'+esc(tglPanjang(d))+'</b><br><small style="color:var(--muted)">seharusnya '+rp(x.seharusnya)+' · dihitung '+rp(x.fisik)+(+x.belanja?' · belanja '+rp(x.belanja):'')+'</small></span><span style="display:flex;flex-direction:column;align-items:flex-end;gap:6px"><b class="num" style="color:'+(x.selisih<0?'var(--bad)':x.selisih>0?'var(--warn)':'var(--ok)')+'">'+(x.selisih?(x.selisih<0?'−':'+')+rp(Math.abs(x.selisih)):'Pas')+'</b><span style="display:flex;gap:6px"><button type="button" class="btn3 sm" data-ccopen="'+d+'">Buka</button>'+(cf?'<button type="button" class="btn3 sm dang" data-ccdelok="'+d+'">Ya, hapus</button>':'<button type="button" class="btn3 sm dang" data-ccdel="'+d+'">Hapus</button>')+'</span></span></div>'}).join('')+
      (hist.length>(S.ccLimit||14)?'<div style="text-align:center;padding-top:10px"><button type="button" class="btn2" data-act="ccmore">Tampilkan lagi</button></div>':'')
     :'<div class="empty">Belum ada. Simpan tutup kasir setiap selesai jualan.</div>')+'</div></div></div>'}
function tglPanjang(d){return new Date(String(d).slice(0,10)+'T12:00:00').toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
function ccRefresh(){const c=S.cc;if(!c)return;PECAHAN.forEach(p=>{const el=document.getElementById('cc-s'+p);if(el)el.textContent=+c.pec[p]?rp(p*(+c.pec[p])):''});
  const f=document.getElementById('cc-fisik');if(f)f.textContent=rp(ccFisik(c));const sm=document.getElementById('cc-sum');if(sm)sm.innerHTML=ccSummaryHtml();const ad=document.getElementById('cc-add');if(ad)ad.innerHTML=ccAddHtml()}
async function saveCloseDoc(date,body){await run(api('PUT','/api/admin/cashclose/'+date,body,true));await loadAdmin()}
async function deleteCloseDoc(date){await run(api('DELETE','/api/admin/cashclose/'+date,null,true));await loadAdmin()}
async function saveClose(){const k=ccCalc();if(!k.adaFisik){toast('Hitung dulu uang di laci');return}
  const body={modal:k.modal,tunai:k.tunai,kasbon:k.kasbon,keluar:k.keluar,belanja:k.belanja,ketKeluar:String(k.c.ketKeluar||'').trim(),seharusnya:k.seharusnya,fisik:k.fisik,selisih:k.selisih,
    pecahan:Object.fromEntries(Object.entries(k.c.pec).filter(([,v])=>+v>0).map(([p,v])=>[p,+v])),catatan:String(k.c.catatan||'').trim()};
  S.busy=true;render();try{await saveCloseDoc(k.c.date,body);S.cc.saved=true;toast('Tutup kasir tersimpan'+(k.selisih?' · selisih '+(k.selisih<0?'−':'+')+rp(Math.abs(k.selisih)):' · pas'))}catch(e){}S.busy=false;render()}
async function ccSaleDoc(items){const tunai=(pays('kasir').find(b=>b.tipe==='tunai')||{kode:'Tunai'}).kode;await run(api('POST','/api/admin/orders',{customerName:'',pay:tunai,cashExact:true,note:'Penjualan terlewat (tutup kasir)',items},true));await loadAdmin()}
async function ccSale(){const c=S.cc;const items=Object.entries(c.add).filter(([,q])=>q>0).map(([kode,qty])=>({kode,qty}));if(!items.length)return;
  S.busy=true;render();try{await ccSaleDoc(items);c.add={};toast('Penjualan terlewat tercatat, stok dan untung ikut diperbarui')}catch(e){}S.busy=false;render()}
document.addEventListener('input',e=>{const t=e.target;if(!t.dataset||!t.dataset.cc||!S.cc)return;const k=t.dataset.cc;
  if(k.startsWith('pec.'))S.cc.pec[k.slice(4)]=t.value;else S.cc[k]=t.value;ccRefresh()});
document.addEventListener('change',e=>{const t=e.target;if(t.id==='cc-date'){S.cc=null;ccInit(t.value||ymd(new Date()));render();return}
  if(t.dataset&&t.dataset.cck&&S.cc){S.cc.kasbonTunai=t.checked;ccRefresh()}});
document.addEventListener('click',e=>{const t=e.target.closest('[data-sfsrc]');if(!t||!S.sf)return;S.sf.sumber=t.dataset.sfsrc;render()});
document.addEventListener('click',async e=>{const t=e.target.closest('[data-ktab],[data-ccq],[data-ccopen],[data-ccdel],[data-ccdelok],[data-act="ccsave"],[data-act="ccsale"],[data-act="ccmore"]');if(!t)return;const d=t.dataset;
  if(d.ktab){S.ktab=d.ktab;render();return}
  if(d.ccq){const c=S.cc,p=prod(d.ccq);if(!c||!p)return;c.add[p.kode]=Math.max(0,Math.min(stockOf(p.kode),(c.add[p.kode]||0)+(+d.d)));ccRefresh();return}
  if(d.act==='ccsave'){saveClose();return}
  if(d.act==='ccsale'){ccSale();return}
  if(d.act==='ccmore'){S.ccLimit=(S.ccLimit||14)+14;render();return}
  if(d.ccopen){S.cc=null;ccInit(d.ccopen);render();window.scrollTo({top:0,behavior:'smooth'});return}
  if(d.ccdel){S.ccdel=d.ccdel;render();return}
  if(d.ccdelok){S.ccdel=null;try{await deleteCloseDoc(d.ccdelok);if(S.cc&&S.cc.date===d.ccdelok)S.cc=null;toast('Tutup kasir dihapus')}catch(err){}render()}});

/* ---------- Dashboard: grafik performa ---------- */
const PERF_COL={kasir:'#6E5AC4',online:'#E8719E'};
const PERF_M={omzet:'Penjualan',untung:'Untung kotor',bersih:'Untung bersih',trx:'Transaksi'};
function perfInit(){if(!S.dperf)S.dperf={r:'30',m:'omzet'};return S.dperf}
function perfBuckets(r,shift){shift=shift||0;const now=new Date(),out=[];
  if(r==='12'){for(let i=11;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i-shift*12,1);out.push({key:mk(d),label:d.toLocaleDateString('id-ID',{month:'short'}),long:d.toLocaleDateString('id-ID',{month:'long',year:'numeric'})})}}
  else{const n=+r;for(let i=n-1;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-i-shift*n);out.push({key:ymd(d),label:n<=7?d.toLocaleDateString('id-ID',{weekday:'short'}):String(d.getDate()),long:d.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'})})}}
  return out}
/* Untung bersih = untung kotor − pengeluaran − susut opname + selisih kas (sama seperti Rekap) */
function perfData(r,shift){const bs=perfBuckets(r,shift),idx={},key=d=>r==='12'?String(d).slice(0,7):String(d).slice(0,10);
  bs.forEach((b,i)=>{idx[b.key]=i;b.kasir={omzet:0,untung:0,trx:0};b.online={omzet:0,untung:0,trx:0};b.peng=0;b.opname=0;b.kas=0});
  valid().forEach(o=>{const k=r==='12'?mk(o.createdAt):ymd(new Date(o.createdAt)),i=idx[k];if(i==null)return;const c=bs[i][o.source==='online'?'online':'kasir'];c.omzet+=+o.total||0;c.untung+=profit(o);c.trx++});
  (S.expenses||[]).forEach(x=>{const i=idx[key(x.date)];if(i!=null)bs[i].peng+=+x.jumlah||0});
  (S.adjust||[]).forEach(x=>{const i=idx[key(x.date)];if(i!=null)bs[i].opname+=(+x.qty||0)*(+x.modal||0)});
  (S.cashclose||[]).forEach(x=>{const i=idx[key(x.date)];if(i!=null)bs[i].kas+=+x.selisih||0});
  bs.forEach(b=>{b.kotor=b.kasir.untung+b.online.untung;b.bersih=b.kotor-b.peng+b.opname+b.kas});
  return bs}
function perfTot(bs){const t={omzet:0,untung:0,trx:0,peng:0,opname:0,kas:0,bersih:0};bs.forEach(b=>{['omzet','untung','trx'].forEach(m=>{t[m]+=b.kasir[m]+b.online[m]});t.peng+=b.peng;t.opname+=b.opname;t.kas+=b.kas;t.bersih+=b.bersih});t.avg=t.trx?Math.round(t.omzet/t.trx):0;return t}
const perfSg=v=>(v<0?'−':'')+rp(Math.abs(v));
const perfFmt=(m,v)=>m==='trx'?String(v):perfSg(v);
const perfShort=v=>{const a=Math.abs(v),s=v<0?'−':'';return a>=1e6?s+(a/1e6).toLocaleString('id-ID',{maximumFractionDigits:1})+'jt':a>=1e3?s+Math.round(a/1e3)+'rb':s+a};
function perfDelta(cur,prev){if(!prev)return cur?'<small class="pdl">belum ada data periode lalu</small>':'<small class="pdl">—</small>';const p=(cur-prev)/Math.abs(prev)*100;if(Math.abs(p)<0.5)return '<small class="pdl">sama seperti periode lalu</small>';
  return '<small class="pdl '+(p>0?'up':'down')+'">'+(p>0?'▲ naik ':'▼ turun ')+Math.abs(p).toLocaleString('id-ID',{maximumFractionDigits:0})+'% <span>vs periode lalu</span></small>'}
function perfTip(b,m){if(m==='bersih')return '<b>'+esc(b.long)+'</b><span>Untung kotor '+perfSg(b.kotor)+'</span>'+(b.peng?'<span>− Pengeluaran '+rp(b.peng)+'</span>':'')+(b.opname?'<span>'+(b.opname<0?'− Susut opname ':'+ Lebih opname ')+rp(Math.abs(b.opname))+'</span>':'')+(b.kas?'<span>'+(b.kas<0?'− Kas kurang ':'+ Kas lebih ')+rp(Math.abs(b.kas))+'</span>':'')+'<span><b>= Bersih '+perfSg(b.bersih)+'</b></span>';
  const k=b.kasir[m],o=b.online[m];return '<b>'+esc(b.long)+'</b><span><i style="background:'+PERF_COL.kasir+'"></i>Kasir '+perfFmt(m,k)+'</span><span><i style="background:'+PERF_COL.online+'"></i>Online '+perfFmt(m,o)+'</span><span><b>Total '+perfFmt(m,k+o)+'</b></span>'}
/* Satu sumbu. Penjualan/untung kotor/transaksi: batang bertumpuk kasir + online. Untung bersih: satu batang, bisa minus. */
function perfSvg(bs,m){const W=Math.max(280,Math.round(S.pw||Math.min(900,window.innerWidth-80))),H=220,L=48,R=8,T=12,B=26,iw=W-L-R,ih=H-T-B,n=bs.length,single=m==='bersih';
  const segs=bs.map(b=>single?[[b.bersih,b.bersih<0?'#D7263D':PERF_COL.kasir]]:[[b.kasir[m],PERF_COL.kasir],[b.online[m],PERF_COL.online]]);
  const hiV=Math.max(0,...segs.map(s=>sum(s,x=>Math.max(0,x[0])))),loV=Math.min(0,...segs.map(s=>sum(s,x=>Math.min(0,x[0]))));
  const span=Math.max(1,hiV-loV),step=Math.pow(10,Math.floor(Math.log10(span))),nice=[1,2,2.5,5,10].map(x=>x*step).find(x=>x*4>=span)||step*10;
  const lo=Math.floor(loV/nice)*nice,hi=Math.max(lo+nice,Math.ceil(hiV/nice)*nice),y=v=>T+ih-((v-lo)/(hi-lo))*ih,bw=iw/n,gap=Math.max(2,bw*0.28),w=Math.max(2,bw-gap);
  let g='';for(let v=lo;v<=hi+1e-6;v+=nice){const yy=y(v).toFixed(1);g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+yy+'" y2="'+yy+'" stroke="'+(v===0?'#CFC6E4':'#ECE7F5')+'" stroke-width="1"/><text x="'+(L-6)+'" y="'+yy+'" dy="3.5" text-anchor="end" class="pax">'+(m==='trx'?v:perfShort(v))+'</text>'}
  const every=Math.max(1,Math.ceil(n/Math.max(4,Math.floor(iw/46))));let bars='',hits='',xl='';
  bs.forEach((b,i)=>{const x=L+i*bw+gap/2,rx=Math.min(3,w/2);let up=0,dn=0;
    segs[i].forEach(([v,c])=>{if(!v)return;if(v>0){const y1=y(up+v)+(up>0?2:0),y2=y(up);if(y2-y1>0.5)bars+='<rect x="'+x.toFixed(1)+'" y="'+y1.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+(y2-y1).toFixed(1)+'" rx="'+rx+'" fill="'+c+'"/>';up+=v}
      else{const y1=y(dn),y2=y(dn+v);if(y2-y1>0.5)bars+='<rect x="'+x.toFixed(1)+'" y="'+y1.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+(y2-y1).toFixed(1)+'" rx="'+rx+'" fill="'+(single?c:'#D7263D')+'"/>';dn+=v}});
    hits+='<rect class="phit" data-pi="'+i+'" x="'+(L+i*bw).toFixed(1)+'" y="'+T+'" width="'+bw.toFixed(1)+'" height="'+ih+'" fill="transparent"><title>'+esc(b.long+': '+perfFmt(m,single?b.bersih:b.kasir[m]+b.online[m]))+'</title></rect>';
    if(i%every===0||(i===n-1&&i%every>=every/2))xl+='<text x="'+(L+i*bw+bw/2).toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle" class="pax">'+esc(b.label)+'</text>'});
  return '<svg class="psvg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Grafik '+PERF_M[m].toLowerCase()+' per '+(n===12?'bulan':'hari')+'">'+g+bars+'<rect id="psel" x="-99" y="'+T+'" width="'+bw.toFixed(1)+'" height="'+ih+'" fill="rgba(110,90,196,.08)" rx="6"/>'+hits+xl+'</svg>'}
function perfCard(){const s=perfInit(),bs=perfData(s.r),prev=perfData(s.r,1),t=perfTot(bs),tp=perfTot(prev),m=s.m;
  const kpi=(lab,v,pv,key,sub)=>'<div class="pk"><small>'+lab+'</small><b class="num">'+(key==='trx'?v:perfSg(v))+'</b>'+(sub?'<small class="psub">'+sub+'</small>':'')+perfDelta(v,pv)+'</div>';
  const seg=(attr,cur,opts)=>'<div class="seg">'+opts.map(([v,l])=>'<button type="button" class="sg'+(cur===v?' on':'')+'" data-'+attr+'="'+v+'" aria-pressed="'+(cur===v)+'">'+l+'</button>').join('')+'</div>';
  const last=bs.slice().reverse().find(b=>b.kasir.trx+b.online.trx||b.peng||b.opname||b.kas)||bs[bs.length-1];
  const bsub=[t.peng?'pengeluaran −'+rp(t.peng):'',t.opname?(t.opname<0?'susut opname −':'lebih opname +')+rp(Math.abs(t.opname)):'',t.kas?(t.kas<0?'kas kurang −':'kas lebih +')+rp(Math.abs(t.kas)):''].filter(Boolean).join(' · ')||'tanpa pengeluaran, susut, atau selisih kas';
  return '<div class="card stack perf" style="gap:14px"><div class="ch" style="margin:0;flex-wrap:wrap;gap:10px"><div><h3>Performa penjualan</h3><p>'+({'7':'7 hari terakhir','30':'30 hari terakhir','12':'12 bulan terakhir'})[s.r]+', dibanding periode sebelumnya</p></div>'+seg('pr',s.r,[['7','7 hari'],['30','30 hari'],['12','12 bulan']])+'</div>'+
   '<div class="pks">'+kpi('Penjualan',t.omzet,tp.omzet)+kpi('Untung kotor',t.untung,tp.untung)+kpi('Untung bersih',t.bersih,tp.bersih,'',bsub)+kpi('Transaksi',t.trx,tp.trx,'trx')+kpi('Rata-rata / transaksi',t.avg,tp.avg)+'</div>'+
   '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">'+seg('pm',m,[['omzet','Penjualan'],['untung','Untung kotor'],['bersih','Untung bersih'],['trx','Transaksi']])+
     (m==='bersih'?'<span class="plg"><span><i style="background:'+PERF_COL.kasir+'"></i>Untung</span><span><i style="background:#D7263D"></i>Rugi</span></span>':'<span class="plg"><span><i style="background:'+PERF_COL.kasir+'"></i>Kasir</span><span><i style="background:'+PERF_COL.online+'"></i>Online</span></span>')+'</div>'+
   (m==='bersih'?'<small style="color:var(--muted)">Untung bersih = untung kotor − pengeluaran − susut stok opname ± selisih tutup kasir, sama seperti di Rekap.</small>':'')+
   '<div class="ptip" id="ptip" aria-live="polite">'+perfTip(last,m)+'</div>'+
   '<div class="pwrap">'+perfSvg(bs,m)+'</div>'+(setTimeout(perfFit,0),'')+
   '<details class="ptbl"><summary>Lihat tabel</summary><div style="overflow:auto"><table><thead><tr><th>'+(s.r==='12'?'Bulan':'Tanggal')+'</th><th>Kasir</th><th>Online</th><th>Penjualan</th><th>Untung kotor</th><th>Pengeluaran</th><th>Opname</th><th>Selisih kas</th><th>Untung bersih</th><th>Trx</th></tr></thead><tbody>'+
     bs.slice().reverse().map(b=>'<tr><td>'+esc(b.long)+'</td><td class="num">'+rp(b.kasir.omzet)+'</td><td class="num">'+rp(b.online.omzet)+'</td><td class="num"><b>'+rp(b.kasir.omzet+b.online.omzet)+'</b></td><td class="num">'+perfSg(b.kotor)+'</td><td class="num">'+(b.peng?'−'+rp(b.peng):'')+'</td><td class="num">'+(b.opname?perfSg(b.opname):'')+'</td><td class="num">'+(b.kas?perfSg(b.kas):'')+'</td><td class="num"><b>'+perfSg(b.bersih)+'</b></td><td class="num">'+(b.kasir.trx+b.online.trx)+'</td></tr>').join('')+'</tbody></table></div></details></div>'}
function perfFit(){const el=document.querySelector('.perf .pwrap');if(el&&el.clientWidth&&Math.abs(el.clientWidth-(S.pw||0))>8){S.pw=el.clientWidth;render()}}
let perfRT=null;window.addEventListener('resize',()=>{clearTimeout(perfRT);perfRT=setTimeout(perfFit,200)});
function perfShow(i){const s=perfInit(),bs=perfData(s.r),b=bs[i];if(!b)return;const tip=document.getElementById('ptip'),sel=document.getElementById('psel'),hit=document.querySelector('.phit[data-pi="'+i+'"]');
  if(tip)tip.innerHTML=perfTip(b,s.m);if(sel&&hit)sel.setAttribute('x',hit.getAttribute('x'))}
document.addEventListener('mouseover',e=>{const t=e.target.closest&&e.target.closest('.phit');if(t)perfShow(+t.dataset.pi)});
document.addEventListener('click',e=>{const t=e.target.closest('.phit,[data-pr],[data-pm]');if(!t)return;
  if(t.classList.contains('phit')){perfShow(+t.dataset.pi);return}
  const s=perfInit();if(t.dataset.pr)s.r=t.dataset.pr;if(t.dataset.pm)s.m=t.dataset.pm;render()});

/* ---------- Rutinitas: checklist harian s/d tahunan + pengingat ---------- */
function isoWeek(d){d=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=d.getUTCDay()||7;d.setUTCDate(d.getUTCDate()+4-day);const y0=new Date(Date.UTC(d.getUTCFullYear(),0,1));return d.getUTCFullYear()+'-W'+String(Math.ceil(((d-y0)/864e5+1)/7)).padStart(2,'0')}
function rutinPeriods(){const d=new Date();return{H:ymd(d),W:isoWeek(d),M:mk(d),Q:d.getFullYear()+'-Q'+(Math.floor(d.getMonth()/3)+1),Y:String(d.getFullYear())}}
const RUTIN=[
 {p:'H',t:'Harian',sub:'±10 menit setelah tutup jualan',items:[
  {id:'lunas',t:'Tandai lunas pesanan tunai yang uangnya sudah diterima',d:'Termasuk pesanan online. Lakukan sebelum tutup kasir.',go:'pesanan',auto:()=>!valid().some(o=>!o.paid&&o.stage>=0&&tipeOf(o)==='tunai'&&ymd(new Date(o.createdAt))===ymd(new Date()))?null:false},
  {id:'stok',t:'Catat semua belanja di Stok masuk',d:'Isi harga beli dan pilih “Dibayar dari” dengan benar.',go:'stok'},
  {id:'kasir',t:'Tutup kasir',d:'Hitung uang di laci per pecahan, cari penyebab selisih hari itu juga.',go:'kasir',tab:'tutup',auto:()=>(S.cashclose||[]).some(x=>String(x.date).slice(0,10)===ymd(new Date()))},
  {id:'qris',t:'Cocokkan QRIS dengan mutasi DANA/Midtrans',d:'Total QRIS hari ini ada di halaman Tutup kasir.'},
  {id:'biaya',t:'Catat pengeluaran operasional',d:'Plastik, gas, es batu, dan sejenisnya, di kartu Pengeluaran pada Rekap.',go:'rekap'},
  {id:'restock',t:'Lihat stok menipis untuk daftar belanja besok',d:'Kartu “Stok menipis” di Dashboard.',go:'dashboard'}]},
 {p:'W',t:'Mingguan',sub:'Sekali seminggu',items:[
  {id:'opcepat',t:'Opname sebagian barang cepat laku',d:'Kopi, mie, rokok. Menu Stok → Stok opname.',go:'stok',tab:'opname'},
  {id:'kasbon',t:'Tagih kasbon, mulai dari yang paling lama',d:'Halaman Belum Bayar.',go:'kasbon'},
  {id:'performa',t:'Lihat performa 7 hari',d:'Hari paling ramai, online vs kasir, untung bersih.',go:'dashboard'},
  {id:'promo',t:'Evaluasi promo yang berjalan',d:'Mana yang laku, mana yang sudah lewat masa berlakunya.',go:'promo'}]},
 {p:'M',t:'Bulanan',sub:'Akhir / awal bulan',items:[
  {id:'opname',t:'Stok opname semua produk',d:'Hari terakhir bulan. Cetak Lembar hitung lewat Export → PDF di tab Stok opname.',go:'stok',tab:'opname'},
  {id:'arus',t:'Pastikan Arus stok di Rekap “Seimbang”',d:'Kalau ada selisih, cari penyebabnya dulu sebelum menekan “Samakan”.',go:'rekap'},
  {id:'angka',t:'Pantau margin, susut %, dan selisih kas',d:'Susut idealnya di bawah 1–2% dari penjualan.',go:'rekap'},
  {id:'export',t:'Export Rekap (Excel & PDF), simpan di Google Drive',d:'Sekaligus jadi cadangan data.',go:'rekap'},
  {id:'harga',t:'Tinjau harga jual vs modal rata-rata',d:'Naikkan harga produk yang modalnya naik.',go:'produk'},
  {id:'rapikan',t:'Rapikan produk & stok minimum',d:'Sembunyikan yang tidak laku 2–3 bulan.',go:'produk'},
  {id:'server',t:'Perawatan server VPS',d:'sudo apt update && sudo apt upgrade, lalu pm2 restart kamart-api; cek pm2 logs kamart-api --lines 50 dan gembok HTTPS.'}]},
 {p:'Q',t:'Tiga bulanan',sub:'Sekali per kuartal',items:[
  {id:'neon',t:'Cek kuota & batas pemulihan database Neon',d:'Pastikan pemakaian masih jauh dari batas paket.'},
  {id:'password',t:'Ganti password admin KAmart',d:'Di file .env VPS (ADMIN_PASSWORD), lalu restart.'},
  {id:'cadangan',t:'Uji file cadangan',d:'Buka Excel hasil export dan pastikan datanya lengkap.'}]},
 {p:'Y',t:'Tahunan',sub:'Sekali setahun',items:[
  {id:'domain',t:'Perpanjang domain scurebot.site',d:'Isi tanggal habisnya di Pengingat di bawah supaya diingatkan otomatis.'},
  {id:'vps',t:'Perpanjang VPS Rumahweb',d:'Isi tanggal habisnya di Pengingat di bawah.'},
  {id:'midtrans',t:'Ganti Server Key Midtrans',d:'Buat kunci baru di dashboard Midtrans, perbarui .env di VPS.'},
  {id:'tahunan',t:'Rekap tahunan',d:'Export Dashboard periode 12 bulan: omzet, untung bersih, produk terlaris.',go:'dashboard'},
  {id:'pajak',t:'Siapkan total omzet tahunan untuk SPT',d:'Cek ketentuan pajak UMKM terbaru di kantor pajak/konsultan.'},
  {id:'supplier',t:'Evaluasi supplier',d:'Bandingkan harga beli per tempat belanja dari export Stok masuk.',go:'stok'}]}];
function rutinSet(){return new Set((S.rutin||[]).map(x=>typeof x==='string'?x:x.k))}
function rutinState(sec,it,per,set){const a=it.auto?it.auto():null;if(a===true)return 'auto';return set.has(sec.p+':'+per[sec.p]+'|'+it.id)?'done':'todo'}
function vRutin(){if(loading())return '<div class="card empty">Memuat…</div>';
  const per=rutinPeriods(),set=rutinSet(),pg=Object.assign({kasir:true,jamKasir:'21:00',opname:true,bulanan:true,domain:'',vps:''},S.pengingat||{});
  const label={H:tglPanjang(per.H),W:'Minggu ke-'+(+per.W.split('W')[1])+' '+per.W.slice(0,4),M:mLabel(per.M),Q:'Kuartal '+per.Q.slice(-1)+' '+per.Q.slice(0,4),Y:'Tahun '+per.Y};
  const secs=RUTIN.map(sec=>{const st=sec.items.map(it=>rutinState(sec,it,per,set)),n=st.filter(x=>x!=='todo').length,pct=Math.round(n/sec.items.length*100);
    return '<section class="card stack rsec" style="gap:10px"><div class="ch" style="margin:0"><div><h3>'+sec.t+'</h3><p>'+esc(label[sec.p])+' · '+sec.sub+'</p></div><span class="pill-s '+(n===sec.items.length?'ps-ok':'ps-warn')+'">'+n+'/'+sec.items.length+'</span></div>'+
     '<div class="rbar" role="progressbar" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100" aria-label="Progres '+sec.t.toLowerCase()+'"><i style="width:'+pct+'%"></i></div>'+
     sec.items.map((it,i)=>{const s=st[i],k=sec.p+':'+per[sec.p]+'|'+it.id;return '<div class="ritem'+(s!=='todo'?' done':'')+'"><button type="button" class="rchk" data-rk="'+esc(k)+'" aria-pressed="'+(s!=='todo')+'"'+(s==='auto'?' disabled title="Tercentang otomatis dari data"':'')+' aria-label="'+esc(it.t)+'">'+(s!=='todo'?ic('check',16,3):'')+'</button>'+
       '<span class="rtx"><b>'+esc(it.t)+'</b><small>'+esc(it.d)+(s==='auto'?' <em>· otomatis dari data</em>':'')+'</small></span>'+(it.go?'<button type="button" class="btn3 sm" data-rgo="'+it.go+'"'+(it.tab?' data-rtab="'+it.tab+'"':'')+'>Buka</button>':'')+'</div>'}).join('')+'</section>'}).join('');
  const tg=(key,l,sub)=>'<label class="rtg"><input type="checkbox" data-pgk="'+key+'"'+(pg[key]?' checked':'')+'><span><b>'+l+'</b><small>'+sub+'</small></span></label>';
  return '<div class="stack">'+notifSettings()+panduanCard('admin')+'<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));align-items:start">'+secs+
   '<section class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>Pengingat otomatis</h3><p>Dikirim sebagai notifikasi ke HP admin yang mengaktifkan notifikasi</p></div></div>'+
    tg('kasir','Belum tutup kasir','Setiap hari, jika sampai jam di bawah belum ada tutup kasir')+
    '<label class="f" style="max-width:180px">Jam pengingat tutup kasir<input class="in" type="time" data-pgv="jamKasir" value="'+esc(pg.jamKasir)+'"></label>'+
    tg('opname','Stok opname akhir bulan','Hari terakhir setiap bulan, jam 19.00')+
    tg('bulanan','Rutinitas awal bulan','Tanggal 1 jam 08.00: cek Rekap, export, tinjau harga')+
    '<div class="grid g2" style="gap:10px"><label class="f">Domain habis tanggal<input class="in" type="date" data-pgv="domain" value="'+esc(pg.domain)+'"></label><label class="f">VPS habis tanggal<input class="in" type="date" data-pgv="vps" value="'+esc(pg.vps)+'"></label></div>'+
    '<small style="color:var(--muted)">Pengingat domain dan VPS dikirim 30, 7, dan 1 hari sebelum tanggal habis.</small>'+
    '<button type="button" class="btn" data-act="pgsave"'+(S.busy?' disabled':'')+'>Simpan pengingat</button></section></div></div>'}
async function rutinDoc(k,done){await run(api('PUT','/api/admin/rutin',{k,done},true))}
async function savePengingatDoc(v){const r=await run(api('PUT','/api/admin/pengingat',v,true));S.pengingat=r.pengingat}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-rk],[data-rgo],[data-act="pgsave"]');if(!t)return;
  if(t.dataset.rgo){if(t.dataset.rtab==='tutup')S.ktab='tutup';if(t.dataset.rtab==='opname')S.stab='opname';go(t.dataset.rgo);return}
  if(t.dataset.rk){const k=t.dataset.rk,set=rutinSet(),done=!set.has(k);
    S.rutin=done?[...(S.rutin||[]),k]:(S.rutin||[]).filter(x=>(typeof x==='string'?x:x.k)!==k);render();
    try{await rutinDoc(k,done)}catch(err){toast('Gagal menyimpan centang')}return}
  if(t.dataset.act==='pgsave'){const v=Object.assign({kasir:true,jamKasir:'21:00',opname:true,bulanan:true,domain:'',vps:''},S.pengingat||{});
    document.querySelectorAll('[data-pgk]').forEach(i=>{v[i.dataset.pgk]=i.checked});document.querySelectorAll('[data-pgv]').forEach(i=>{v[i.dataset.pgv]=i.value});
    S.busy=true;render();try{await savePengingatDoc(v);toast('Pengingat tersimpan')}catch(err){}S.busy=false;render()}});

/* ---------- Buku panduan (PDF) ---------- */
const PANDUAN={pembeli:{f:'panduan-pembeli.pdf',t:'Buku panduan pembeli',d:'Cara belanja, bayar, dan ambil pesanan · PDF 14 halaman'},admin:{f:'panduan-admin.pdf',t:'Buku panduan admin',d:'Pesanan, kasir, stok, opname, rekap, dan rutinitas · PDF 36 halaman'}};
function panduanCard(k){const p=PANDUAN[k];return '<div class="card pdcard"><span class="tile t-lav">'+ic('doc',20)+'</span><span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><b style="font-size:14px">'+p.t+'</b><small style="color:var(--muted)">'+p.d+'</small></span><button type="button" class="btn sm" data-panduan="'+k+'"'+(S.pdBusy===k?' disabled':'')+'>'+(S.pdBusy===k?'Mengunduh…':'Unduh')+'</button></div>'}
async function panduanBlob(k){let r;try{r=k==='admin'?await fetch(API+'/api/admin/panduan',{headers:{Authorization:'Bearer '+S.token}}):await fetch('/panduan/'+PANDUAN[k].f+'?v=1')}catch(e){throw new Error('Tidak bisa terhubung ke server. Cek internet lalu coba lagi.')}if(r.status===401&&k==='admin'){S.token=null;ls.set('token',null);S.loaded.admin=false;throw new Error('Sesi admin berakhir, silakan masuk lagi.')}if(!r.ok)throw new Error('File panduan belum tersedia ('+r.status+')');return await r.blob()}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-panduan]');if(!t)return;const k=t.dataset.panduan;if(S.pdBusy)return;
  S.pdBusy=k;render();try{const b=await panduanBlob(k);await saveFile('KAmart-'+PANDUAN[k].f,b);toast('Panduan diunduh')}catch(err){toast((err&&err.message)||'Unduhan gagal')}S.pdBusy=null;render()});
/* ---------- boot ---------- */
function isShopView(){return VIEWS.find(v=>v.id===S.view).g==='Pembeli'}
function tick(){if(isShopView()){if(document.hidden)return;loadPublic();loadMine();loadQueue()}else if(S.token)loadAdmin()}
window.addEventListener('hashchange',()=>{readHash();S.confirm=null;render();tick()});
// Tidak ada refresh berkala. Data dimuat ulang saat: pindah halaman, aplikasi dibuka lagi,
// notifikasi push pesanan masuk (admin), atau tombol ↻ ditekan.
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!S.imgBusy)tick()});
if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='kamart-push')tick()});
async function manualRefresh(){if(S.refreshing)return;S.refreshing=true;render();
  try{if(isShopView())await Promise.all([loadPublic(),loadMine(),loadQueue()]);else if(S.token)await loadAdmin()}finally{S.refreshing=false;render()}}
document.addEventListener('click',e=>{if(e.target.closest('[data-act="refresh"]'))manualRefresh()});
readHash();render();tick();if(S.co.name)checkReg();
})();

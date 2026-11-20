(function(){
const STAGES=['Baru','Disiapkan','Siap diambil','Selesai'];
const STAGE_COL=['#6E5AC4','#D9467C','#E0901F','#4377DB'];
const VIEWS=[
  {id:'toko',t:'Toko',g:'Pembeli',ic:'shop'},
  {id:'keranjang',t:'Keranjang',g:'Pembeli',ic:'bag'},
  {id:'pesananku',t:'Pesanan Saya',g:'Pembeli',ic:'inbox'},
  {id:'akun',t:'Akun',g:'Pembeli',ic:'users'},
  {id:'dashboard',t:'Dashboard',g:'Admin',ic:'home'},
  {id:'pesanan',t:'Pesanan',g:'Admin',ic:'inbox'},
  {id:'kasir',t:'Kasir',g:'Admin',ic:'pos'},
  {id:'produk',t:'Produk',g:'Admin',ic:'box'},
  {id:'stok',t:'Stok Masuk',g:'Admin',ic:'down'},
  {id:'kasbon',t:'Belum Bayar',g:'Admin',ic:'clock'},
  {id:'rekap',t:'Rekap',g:'Admin',ic:'chart'}
];
const IC={
  shop:'M4 7h16l-1.5 12h-13zM8 7a4 4 0 0 1 8 0',home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  inbox:'M3 13h5l1 3h6l1-3h5M5 5h14l2 8v6H3v-6z',pos:'M4 4h16v16H4zM8 9h8M8 13h3M8 17h3M14 13h2M14 17h2',
  box:'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8',down:'M12 3v12M7 10l5 5 5-5M4 21h16',
  clock:'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18',chart:'M4 20V10M10 20V4M16 20v-7M22 20H2',
  money:'M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',bag:'M6 7h12l-1 13H7zM9 7a3 3 0 0 1 6 0',
  trophy:'M8 4h8v5a4 4 0 0 1-8 0zM12 13v4M8 21h8',bell:'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  plus:'M12 5v14M5 12h14',cup:'M5 8h14l-1.5 12h-11zM4 5h16v3H4z',coffee:'M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 2v3M12 2v3',
  check:'M5 12l5 5 9-10',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5',users:'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-5-6'
};
const ic=(n,s=20,w=2)=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+IC[n]+'"/></svg>';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rp=n=>'Rp'+Math.round(+n||0).toLocaleString('id-ID');
const mk=d=>{d=new Date(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const sameDay=(a,b=new Date())=>new Date(a).toDateString()===new Date(b).toDateString();
const MONTHS=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const mLabel=k=>{const[y,m]=k.split('-');return MONTHS[+m-1]+' '+y};
const dLabel=iso=>{const d=new Date(iso);return d.getDate()+' '+MONTHS[d.getMonth()].slice(0,3)+', '+String(d.getHours()).padStart(2,'0')+'.'+String(d.getMinutes()).padStart(2,'0')};
const CAT_STYLE={Makanan:['pink','cup'],Minuman:['blue','coffee'],Rokok:['gold','box'],Sembako:['lav','bag'],Lainnya:['lav','box']};
const AVC=['#6E5AC4','#D9467C','#4377DB','#C47A12','#2F9E6A','#8A5CD6'];
const avc=n=>AVC[[...String(n)].reduce((a,c)=>a+c.charCodeAt(0),0)%AVC.length];
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const ls={get(k,d){try{const v=localStorage.getItem('kamart:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('kamart:'+k,JSON.stringify(v))}catch(e){}}};

const S={products:[],customers:[],orders:[],stockin:[],loaded:{},db:null,offline:false,
  view:'toko',cat:'Semua',cart:{},co:Object.assign({name:'',line:'',slot:'Istirahat 12.00',pay:'QRIS',note:''},ls.get('me',{})),
  k:{cart:{},buyer:'',method:'Tunai',cash:0},receipt:null,confirm:null,
  pf:null,sf:{date:new Date().toISOString().slice(0,10),kode:'',qty:'',harga:'',tempat:'',upd:true},
  cf:{name:'',line:'',wa:''},month:mk(new Date()),kfilter:'Belum',lastPlaced:null,busy:false,q:'',mine:[],placed:null,placedDl:'',alerts:[],alerted:new Set(),ns:ls.get('ns',{sound:true,push:false}),
  token:ls.get('token',null),pub:[],mine:[],queue:[],reg:false,netErr:'',lg:{user:'',pass:'',err:''}};
const SLOTS=['Pagi 09.30','Istirahat 12.00','Istirahat 18.00','Pulang shift 1','Pulang shift 2'];

/* ---------- data layer ---------- */
const COLS=['products','customers','orders','stockin'];
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
async function loadPublic(){try{const r=await api('GET','/api/products');S.pub=r.products;S.loaded.pub=true;S.netErr=navigator.onLine?'':'Kamu sedang offline. Katalog yang tampil mungkin bukan yang terbaru.'}catch(e){S.netErr=e.message}render()}
async function loadMine(){const toks=ls.get('orders',[]);if(!toks.length){S.mine=[];return}try{const r=await api('POST','/api/orders/lookup',{tokens:toks});S.mine=r.orders;render()}catch(e){}}
async function loadAdmin(){if(!S.token)return;try{const r=await api('GET','/api/admin/data',null,true);S.products=r.products;S.customers=r.customers;S.orders=r.orders;S.stockin=r.stockin;S.loaded.admin=true;S.netErr=''}catch(e){S.netErr=e.message}render()}
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
  const snav=document.getElementById('shopnav');snav.hidden=!shop;snav.innerHTML=shop?shopNav():'';
  const lines=cartLines(S.cart,S.pub),cn=sum(lines,l=>l.qty);
  document.getElementById('cartbar').innerHTML=shop&&S.view==='toko'&&cn?'<button class="cartbar" data-go="keranjang"><span><small>'+cn+' item di keranjang</small><br><strong class="num" style="font-size:15px">'+rp(sum(lines,l=>l.qty*l.price))+'</strong></span><b>Lihat keranjang ›</b></button>':'';
  const groups=['Pembeli','Admin'];
  document.getElementById('side').innerHTML=
    '<div class="who"><img src="logo.png" alt="" width="88" height="88" style="border-radius:50%;border:3px solid rgba(255,255,255,.7);box-shadow:0 12px 26px rgba(0,0,0,.25)"><strong style="font-size:16px">Hi, Arbi!</strong><span style="font-size:12px;color:#E6DEFF">Admin KAmart</span></div>'+
    groups.map(g=>'<nav class="navg" aria-label="'+g+'"><small>'+g+'</small>'+VIEWS.filter(v=>v.g===g&&(g==='Admin'||v.id==='toko')).map(v=>{const b=badgeFor(v.id);return '<button class="nv'+(S.view===v.id?' on':'')+'" data-go="'+v.id+'"'+(S.view===v.id?' aria-current="page"':'')+'><span>'+ic(v.ic,18)+v.t+'</span>'+(b?'<em class="bdg">'+b+'</em>':'')+'</button>'}).join('')+'</nav>').join('')+
    '<div class="sidenote"><strong>Tersambung ke server</strong><br>Pesanan baru dicek tiap 10 detik.</div>'+
    '<button class="nv" data-act="logout" style="justify-content:center;background:rgba(255,255,255,.14)">Keluar</button>';
  const v=VIEWS.find(x=>x.id===S.view);
  document.getElementById('mbar').innerHTML='<span style="display:flex;align-items:center;gap:8px"><img src="logo.png" alt="" width="34" height="34" style="border-radius:50%"><b>KAmart</b></span><span style="font-size:12px;color:#EDE7FF">'+v.g+' · '+v.t+'</span>';
  const nNew=valid().filter(o=>o.stage===0).length;
  const subs={toko:'Pesan sekarang, ambil saat istirahat',dashboard:salam()+', Arbi',pesanan:'Alur pesanan dari Baru sampai Selesai',kasir:'Transaksi langsung di tempat',produk:'Harga, margin, dan sisa stok',stok:'Catat belanja dari grosir',kasbon:'Kasbon dan pesanan yang belum dibayar',rekap:'Ringkasan per bulan'};
  document.getElementById('top').innerHTML='<div><h1>'+v.t+'</h1><div class="sub">'+subs[v.id]+'</div></div>'+
    '<div class="tbtns">'+(v.g==='Admin'?'<button class="cbtn'+(unseenOrders().length?' ring-on':'')+'" data-go="pesanan" aria-label="Pesanan baru: '+nNew+'">'+ic('bell')+(nNew?'<em>'+nNew+'</em>':'')+'</button>':'')+
    '<button class="btn2" data-go="'+(v.g==='Admin'?'toko':'dashboard')+'">'+(v.g==='Admin'?'Lihat toko':'Masuk admin')+'</button>'+(v.g==='Admin'?'<button class="btn2" data-act="logout">Keluar</button>':'')+'</div>';
  const pillIds=v.g==='Admin'?['dashboard','pesanan','kasir','produk','stok','kasbon','rekap']:['toko'];
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
  return '<div class="card" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px"><span style="display:flex;align-items:center;gap:12px;min-width:0"><span class="tile t-lav" style="width:42px;height:42px">'+ic('bell',18)+'</span><span style="min-width:0"><b>Notifikasi pesanan masuk</b><br><small style="color:var(--muted)">Kartu, suara, dan getar di semua halaman admin selama halaman ini terbuka.</small></span></span>'+
   '<span style="display:flex;gap:8px;flex-wrap:wrap"><button class="sg'+(S.ns.sound?' on':'')+'" data-act="nsound" aria-pressed="'+S.ns.sound+'">Suara '+(S.ns.sound?'aktif':'mati')+'</button>'+
   (perm==='granted'&&S.ns.push?'<span class="pill-s ps-ok" style="align-self:center">Notifikasi browser aktif</span>':perm==='denied'?'<span class="pill-s ps-bad" style="align-self:center">Notifikasi browser diblokir</span>':perm==='unsupported'?'':'<button class="sg" data-act="npush">Aktifkan notifikasi browser</button>')+
   '<button class="sg" data-act="ntest">Tes notifikasi</button></span></div>';
}
function salam(){const h=new Date().getHours();return h<11?'Selamat pagi':h<15?'Selamat siang':h<18?'Selamat sore':'Selamat malam'}

/* ---------- views ---------- */
function loading(){return isShopView()?!(S.view==='pesananku'?S.loaded.queue:S.loaded.pub):!S.loaded.admin}
function prodTile(p,big){if(p.img)return '<img class="thumb" src="'+esc(p.img)+'" alt=""'+(big?' style="width:54px;height:54px;border-radius:16px"':'')+'>';const [c,i]=CAT_STYLE[p.cat]||CAT_STYLE.Lainnya;return '<span class="tile t-'+c+'"'+(big?' style="width:54px;height:54px;border-radius:16px"':'')+'>'+ic(i,big?26:20)+'</span>'}

/* ---------- PWA: pasang aplikasi & offline ---------- */
let deferredPrompt=null;
const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;render()});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;toast('KAmart sudah terpasang di HP kamu');render()});
window.addEventListener('offline',()=>{S.netErr='Kamu sedang offline. Katalog yang tampil mungkin bukan yang terbaru.';render()});
window.addEventListener('online',()=>{S.netErr='';tick()});
if(!navigator.onLine)S.netErr='Kamu sedang offline. Katalog yang tampil mungkin bukan yang terbaru.';
if('serviceWorker' in navigator)window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})});
function installCard(){if(isStandalone()||!(deferredPrompt||isIOS()))return '';
  return '<div class="card stack" style="gap:10px;padding:16px"><span style="display:flex;align-items:center;gap:12px"><img src="icons/icon-192.png" alt="" width="46" height="46" style="border-radius:14px;flex:none"><span><b>Pasang aplikasi KAmart</b><br><small style="color:var(--muted)">Buka langsung dari layar utama HP, layar penuh seperti aplikasi.</small></span></span>'+
  (deferredPrompt?'<button class="btn" data-act="install">Pasang sekarang</button>':'<small style="color:var(--muted)">Di iPhone: buka di Safari, ketuk tombol <b>Bagikan</b>, lalu pilih <b>Tambahkan ke Layar Utama</b>.</small>')+'</div>'}
function installBanner(){if(!deferredPrompt||isStandalone()||ls.get('installHide',0))return '';
  return '<div class="banner b-lav" style="display:flex;align-items:center;gap:10px;padding:10px 12px"><img src="icons/icon-192.png" alt="" width="38" height="38" style="border-radius:11px;flex:none"><span style="flex:1;min-width:0;font-size:12px;line-height:1.35"><b>Pasang aplikasi KAmart</b><br>Pesan lebih cepat dari layar utama.</span><button class="btn3" data-act="install">Pasang</button><button class="btn3" data-act="installhide" aria-label="Tutup" style="padding:0 12px">×</button></div>'}
async function doInstall(){if(!deferredPrompt)return;deferredPrompt.prompt();try{await deferredPrompt.userChoice}catch(e){}deferredPrompt=null;render()}
function shopHead(title,sub,right,logo){return '<header class="sh-head"><div style="min-width:0;display:flex;align-items:center;gap:10px">'+(logo?'<img src="logo.png" alt="KAmart" width="46" height="46" style="border-radius:50%;flex:none;box-shadow:0 8px 18px rgba(91,71,176,.25)">':'')+'<div style="min-width:0"><h1>'+title+'</h1><p>'+sub+'</p></div></div>'+(right||'')+'</header>'}
function myOrders(){return S.mine.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}
function shopNav(){const n=sum(cartLines(S.cart,S.pub),l=>l.qty),a=myOrders().filter(o=>o.stage<3).length;
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
  const list=S.pub.slice();
  const cats=['Semua',...new Set(list.map(p=>p.cat||'Lainnya'))];
  const q=S.q.trim().toLowerCase();
  const shown=list.filter(p=>(S.cat==='Semua'||p.cat===S.cat)&&(!q||String(p.name).toLowerCase().includes(q)));
  return head+'<div class="stack" style="gap:14px">'+installBanner()+
  '<div class="search">'+ic('search',18)+'<label for="q" class="sr">Cari produk</label><input class="in" id="q" type="search" data-bind="q" data-live="1" placeholder="Cari Pop Mie, kopi…" value="'+esc(S.q)+'"></div>'+
  '<section class="promo"><div style="flex:1;min-width:0"><span class="chip" style="font-size:11px;padding:4px 10px"><i></i>Ambil saat istirahat</span><h2>Pesan dulu, tinggal ambil.</h2><p>Order tutup 30 menit sebelum istirahat.</p></div>'+cupHtml()+'</section>'+
  '<div class="chips" role="group" aria-label="Kategori">'+cats.map(c=>'<button class="sg'+(S.cat===c?' on':'')+'" data-cat="'+esc(c)+'" aria-pressed="'+(S.cat===c)+'">'+esc(c)+'</button>').join('')+'</div>'+
  (shown.length?'<div class="mgrid">'+shown.map(p=>{const st=stockOf(p.kode),qq=S.cart[p.kode]||0,c=(CAT_STYLE[p.cat]||CAT_STYLE.Lainnya)[0];
    return '<article class="mc"><div class="ph b-'+c+'">'+(p.img?'<img src="'+esc(p.img)+'" alt="'+esc(p.name)+'">':prodTile(p,true))+'</div><div class="nm">'+esc(p.name)+'</div><div class="st">'+(st>0?'Sisa '+st+' '+esc(p.unit||''):'Stok habis')+'</div><div class="qty"><span class="pr num">'+rp(p.jual)+'</span>'+stepper(p.kode,qq,st,p.name)+'</div></article>'}).join('')+'</div>'
    :'<div class="card empty">'+(q?'Tidak ada produk bernama "'+esc(S.q)+'".':'Belum ada produk yang dijual online.')+'</div>')+
  '</div>';
}
function vKeranjang(){
  const lines=cartLines(S.cart,S.pub),total=sum(lines,l=>l.qty*l.price),cnt=sum(lines,l=>l.qty),reg=S.reg;
  let h=shopHead('Keranjang',cnt?cnt+' item':'Masih kosong',cnt?'<button class="btn3" data-act="clearCart">Kosongkan</button>':'');
  if(!lines.length)return h+'<div class="card empty stack" style="align-items:center;gap:12px"><span class="tile t-pink" style="width:58px;height:58px;border-radius:18px">'+ic('bag',26)+'</span><span>Belum ada barang di keranjang.</span><button class="btn" data-go="toko">Mulai belanja</button></div>';
  h+='<div class="stack" style="gap:12px"><div class="card" style="padding:6px 14px">'+lines.map(l=>{const p=prod(l.kode);return '<div class="li" style="padding:10px 0"><span style="display:flex;align-items:center;gap:10px;min-width:0">'+(p?prodTile(p):'')+'<span style="min-width:0"><b style="font-size:13px">'+esc(l.name)+'</b><br><small class="num" style="color:var(--muted)">'+rp(l.price)+'</small></span></span>'+stepper(l.kode,l.qty,stockOf(l.kode),l.name)+'</div>'}).join('')+'</div>';
  h+='<form id="coForm" class="stack" style="gap:12px">'+
   '<div class="card stack" style="gap:12px;padding:16px"><h3 style="font-size:15px">Data pemesan</h3><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">'+
    '<label class="f">Nama<input class="in" id="co-name" data-bind="co.name" list="custList" required autocomplete="name" value="'+esc(S.co.name)+'" placeholder="Nama kamu"></label>'+
    '<label class="f">Bagian / line<input class="in" id="co-line" data-bind="co.line" value="'+esc(S.co.line)+'" placeholder="Painting L1"></label></div>'+
    '<datalist id="custList">'+S.customers.map(c=>'<option value="'+esc(c.name)+'">').join('')+'</datalist></div>'+
   '<div class="card stack" style="gap:10px;padding:16px"><h3 style="font-size:15px">Waktu ambil</h3><div class="seg">'+SLOTS.map(s=>'<button type="button" class="sg'+(S.co.slot===s?' on':'')+'" data-coslot="'+s+'" aria-pressed="'+(S.co.slot===s)+'">'+s+'</button>').join('')+'</div><small style="color:var(--muted)">Ambil di parkiran motor / pos.</small></div>'+
   '<div class="card stack" style="gap:10px;padding:16px"><h3 style="font-size:15px">Pembayaran</h3><div class="seg" role="radiogroup" aria-label="Pembayaran">'+['QRIS','Tunai','Kasbon'].map(m=>'<button type="button" class="sg'+(S.co.pay===m?' on':'')+'" role="radio" aria-checked="'+(S.co.pay===m)+'" data-copay="'+m+'"'+(m==='Kasbon'&&!reg?' disabled':'')+'>'+(m==='Kasbon'?'Bayar pas gajian':m)+'</button>').join('')+'</div>'+
    (S.co.pay==='Kasbon'&&!reg?'<small style="color:var(--bad)">Bayar pas gajian khusus pelanggan terdaftar.</small>':'<small style="color:var(--muted)">'+(S.co.pay==='Kasbon'?'Dicatat sebagai kasbon, ditagih saat gajian.':reg?'Bayar saat ambil barang.':'Bayar saat ambil barang. Bayar pas gajian khusus pelanggan terdaftar.')+'</small>')+'</div>'+
   '<label class="f">Catatan<input class="in" id="co-note" data-bind="co.note" value="'+esc(S.co.note)+'" placeholder="Opsional, misal: tanpa sendok"></label>'+
   '<div class="card stack" style="gap:6px;padding:16px"><div class="li" style="border:0;padding:2px 0"><span style="color:var(--muted)">Subtotal</span><span class="num">'+rp(total)+'</span></div><div class="li" style="border:0;padding:2px 0"><span style="color:var(--muted)">Ambil di tempat</span><span style="color:var(--ok);font-weight:700">Gratis</span></div><div class="tot"><span>Total</span><span class="num">'+rp(total)+'</span></div></div>'+
   '<button class="btn" type="submit" style="height:52px"'+(S.busy?' disabled':'')+'>Pesan sekarang · '+rp(total)+'</button></form></div>';
  return h;
}
function queueOrders(){return S.queue.slice()}
function isMine(o){return S.mine.some(m=>m.id===o.id)}
function findOrder(id){return S.mine.find(o=>o.id===id)||S.orders.find(o=>o.id===id)}
function vPesananku(){
  let h=shopHead('Antrian Pesanan','Pesanan yang sedang diproses');
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
    (me?'<button class="btn3" data-receipt="'+esc(o.id)+'" style="align-self:flex-start">Unduh struk</button>':'')+'</article>'}).join('');
  return h+'</div>';
}
function vAkun(){
  const name=S.co.name.trim(),c=S.reg,mine=myOrders(),kb=sum(mine.filter(o=>o.pay==='Kasbon'&&!o.paid),o=>+o.total||0);
  return shopHead('Akun','Dipakai otomatis saat memesan')+'<div class="stack" style="gap:12px">'+
  '<div class="card" style="display:flex;align-items:center;gap:14px;padding:16px"><span class="av" style="width:54px;height:54px;font-size:20px;background:'+avc(name||'?')+'">'+esc((name[0]||'?').toUpperCase())+'</span><span style="min-width:0;flex:1;display:flex;flex-direction:column;gap:4px;align-items:flex-start"><b style="font-size:16px">'+(name?esc(name):'Tamu')+'</b><span class="pill-s '+(c?'ps-ok':'ps-lav')+'">'+(c?'Pelanggan terdaftar':'Belum terdaftar')+'</span></span></div>'+
  '<div class="card stack" style="gap:12px;padding:16px"><label class="f">Nama<input class="in" id="ak-name" data-bind="co.name" list="custList2" autocomplete="name" value="'+esc(S.co.name)+'" placeholder="Nama kamu"></label><datalist id="custList2">'+S.customers.map(x=>'<option value="'+esc(x.name)+'">').join('')+'</datalist>'+
   '<label class="f">Bagian / line<input class="in" id="ak-line" data-bind="co.line" value="'+esc(S.co.line)+'" placeholder="Contoh: Painting L1"></label>'+
   '<small style="color:var(--muted)">'+(c?'Kamu bisa memakai Bayar pas gajian.':'Bayar pas gajian hanya untuk pelanggan terdaftar. Minta penjual mendaftarkan namamu.')+'</small></div>'+
  '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px"><div class="stat b-lav" style="padding:14px"><span class="lb">Total pesanan</span><span class="vl num" style="font-size:20px">'+mine.length+'</span></div><div class="stat b-gold" style="padding:14px"><span class="lb">Kasbon</span><span class="vl num" style="font-size:20px">'+rp(kb)+'</span></div></div>'+
  installCard()+'<div class="card stack" style="gap:4px;font-size:13px;padding:16px"><b>Info ambil pesanan</b><span style="color:var(--muted)">Ambil di parkiran motor / pos sesuai jam yang dipilih. Order tutup 30 menit sebelum istirahat.</span></div>'+
  '<button class="btn2" data-go="dashboard" style="justify-content:center;height:46px">Masuk admin</button></div>';
}
function itemsText(o){return (o.items||[]).map(i=>i.qty+'× '+i.name).join(', ')}
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
  '<div style="font-size:12px;color:var(--muted)">'+esc(o.slot||'Kasir')+(o.note?' · '+esc(o.note):'')+'</div>'+
  '<div style="display:flex;gap:6px;flex-wrap:wrap">'+
   (i===2&&!o.paid&&o.pay!=='Kasbon'?'<button class="btn3" data-donepaid="'+o.id+'">Diambil &amp; lunas</button><button class="btn3 dang" data-adv="'+o.id+'">Diambil, belum bayar</button>'
     :i<3?'<button class="btn3" data-adv="'+o.id+'">Lanjut ›</button>':'')+
   (!o.paid&&o.pay!=='Kasbon'&&i!==2?'<button class="btn3" data-paid="'+o.id+'">Tandai lunas</button>':'')+
   (i<3?(cf?'<button class="btn3 dang" data-cancel="'+o.id+'">Ya, batalkan</button>':'<button class="btn3 dang" data-ask="'+o.id+'">Batal</button>'):'')+
  '</div></article>';
}

function vKasir(){
  if(loading())return '<div class="card empty">Memuat produk…</div>';
  const k=S.k,lines=cartLines(k.cart),total=sum(lines,l=>l.qty*l.price),cnt=sum(lines,l=>l.qty);
  const rokok=lines.some(l=>(prod(l.kode)||{}).cat==='Rokok');
  const change=(+k.cash||0)-total;
  const can=cnt>0&&!S.busy&&(k.method==='Tunai'?change>=0:k.method==='Kasbon'?!!k.buyer:true);
  return '<div class="shop"><div class="stack"><div class="kt">'+sortedProducts().map(p=>{const q=k.cart[p.kode]||0,st=stockOf(p.kode);
    return '<button class="ktile'+(q?' on':'')+'" data-kadd="'+esc(p.kode)+'"'+(st-q<=0?' disabled style="opacity:.55"':'')+' aria-label="Tambah '+esc(p.name)+'"><span style="display:flex;justify-content:space-between;width:100%;align-items:center"><small>'+esc(p.kode)+(p.cat==='Rokok'?' · 21+':'')+'</small>'+(q?'<span class="n">'+q+'</span>':'')+'</span>'+(p.img?'<img class="kimg" src="'+esc(p.img)+'" alt="">':'')+'<b style="line-height:1.25">'+esc(p.name)+'</b><span style="display:flex;justify-content:space-between;width:100%;font-size:12px"><b class="num" style="color:var(--primary-ink);font-size:14px">'+rp(p.jual)+'</b><span style="color:var(--muted)">sisa '+st+'</span></span></button>'}).join('')+'</div>'+
    (S.products.length?'':'<div class="card empty">Belum ada produk. Tambahkan di menu Produk.</div>')+'</div>'+
  '<aside class="card sticky stack" style="gap:12px" aria-label="Transaksi"><div class="ch" style="margin:0"><div><h3>Transaksi</h3><p>'+cnt+' item</p></div>'+(cnt?'<button class="btn3" data-act="kclear">Kosongkan</button>':'')+'</div>'+
   (lines.length?'<div>'+lines.map(l=>'<div class="li"><span style="display:flex;align-items:center;gap:6px"><button class="qb m" style="width:32px;height:32px" data-kdec="'+esc(l.kode)+'" aria-label="Kurangi '+esc(l.name)+'">−</button>'+l.qty+'× '+esc(l.name)+'</span><span class="num">'+rp(l.qty*l.price)+'</span></div>').join('')+'</div>':'<div class="empty" style="padding:10px">Ketuk produk untuk menambah.</div>')+
   '<div class="tot"><span>Total</span><span class="num">'+rp(total)+'</span></div>'+
   '<label class="f">Pembeli<select class="in" id="k-buyer" data-bind="k.buyer" data-live="1"><option value="">Pembeli umum</option>'+S.customers.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(c=>'<option value="'+esc(c.name)+'"'+(k.buyer===c.name?' selected':'')+'>'+esc(c.name)+(c.line?' · '+esc(c.line):'')+'</option>').join('')+'</select></label>'+
   '<div class="seg" role="radiogroup" aria-label="Metode bayar">'+['Tunai','QRIS','Kasbon'].map(m=>'<button type="button" class="sg'+(k.method===m?' on':'')+'" role="radio" aria-checked="'+(k.method===m)+'" data-kpay="'+m+'">'+m+'</button>').join('')+'</div>'+
   (k.method==='Tunai'?'<div class="seg">'+[['Uang pas',total],['20rb',20000],['50rb',50000],['100rb',100000]].map(([l,v])=>'<button type="button" class="sg'+(+k.cash===v&&cnt?' on':'')+'" data-cash="'+v+'">'+l+'</button>').join('')+'</div>'+
     '<label class="f">Uang diterima<input class="in num" id="k-cash" type="number" inputmode="numeric" min="0" data-bind="k.cash" data-live="1" value="'+(+k.cash||'')+'"></label>'+
     '<div class="banner '+(change>=0?'b-lav':'b-pink')+'" style="display:flex;justify-content:space-between;font-weight:700"><span>'+(change>=0?'Kembalian':'Kurang')+'</span><span class="num">'+rp(Math.abs(change))+'</span></div>'
    :k.method==='QRIS'?'<div class="banner b-blue">Tunjukkan QRIS KAmart, tekan Bayar setelah dana masuk.</div>'
    :'<div class="banner b-gold" style="color:var(--warn)">'+(k.buyer?'Dicatat sebagai kasbon atas nama '+esc(k.buyer)+'. Kasbon berjalan: '+rp(sum(unpaidKasbon().filter(o=>o.customerName===k.buyer),o=>+o.total||0))+'.':'Pilih nama pembeli untuk mencatat kasbon.')+'</div>')+
   (rokok?'<div style="font-size:12px;font-weight:600;color:var(--bad)">Ada rokok di transaksi ini: pastikan pembeli berusia 21+.</div>':'')+
   '<button class="btn" data-act="kpay"'+(can?'':' disabled')+'>Bayar '+rp(total)+'</button></aside></div>';
}

function vProduk(){
  if(loading())return '<div class="card empty">Memuat produk…</div>';
  const list=sortedProducts();const f=S.pf;
  return '<div class="stack">'+
   (f?'<form id="pForm" class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>'+(f._edit?'Ubah produk':'Produk baru')+'</h3><p>Harga dalam rupiah</p></div><button type="button" class="btn3" data-act="pclose">Tutup</button></div><div class="fg">'+
     '<label class="f">Kode<input class="in" id="p-kode" data-bind="pf.kode" required value="'+esc(f.kode)+'"'+(f._edit?' readonly':'')+' placeholder="P003"></label>'+
     '<label class="f" style="grid-column:span 2">Nama produk<input class="in" id="p-name" data-bind="pf.name" required value="'+esc(f.name)+'"></label>'+
     '<label class="f">Kategori<select class="in" id="p-cat" data-bind="pf.cat">'+Object.keys(CAT_STYLE).map(c=>'<option'+(f.cat===c?' selected':'')+'>'+c+'</option>').join('')+'</select></label>'+
     '<label class="f">Satuan<input class="in" id="p-unit" data-bind="pf.unit" value="'+esc(f.unit)+'" placeholder="cup, bks, pcs"></label>'+
     '<label class="f">Harga modal<input class="in num" id="p-modal" type="number" min="0" data-bind="pf.modal" required value="'+esc(f.modal)+'"></label>'+
     '<label class="f">Harga jual<input class="in num" id="p-jual" type="number" min="0" data-bind="pf.jual" required value="'+esc(f.jual)+'"></label>'+
     '<label class="f">Stok minimum<input class="in num" id="p-min" type="number" min="0" data-bind="pf.min" value="'+esc(f.min)+'"></label>'+
     '<label class="f" style="flex-direction:row;align-items:center;gap:8px;align-self:end;height:44px"><input type="checkbox" id="p-online" data-bind="pf.online"'+(f.online?' checked':'')+(f.cat==='Rokok'?' disabled':'')+'> Tampil di toko online</label>'+
     '</div>'+
     '<div class="imgpick"><div class="imgbox">'+(f.img?'<img src="'+esc(f.img)+'" alt="Foto '+esc(f.name)+'">':ic('box',30))+'</div><div class="stack" style="gap:6px"><span style="font-size:12px;font-weight:600;color:#54496A">Foto produk</span><div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn2" for="p-img" style="cursor:pointer">'+(f.img?'Ganti foto':'Pilih foto')+'</label><input id="p-img" type="file" accept="image/*" class="sr">'+(f.img?'<button type="button" class="btn3 dang" data-act="pimgdel">Hapus foto</button>':'')+'</div><small style="color:var(--muted)">Dari galeri atau kamera HP. Otomatis diperkecil.</small></div></div>'+(f.cat==='Rokok'?'<div class="banner b-gold" style="color:var(--warn)">Rokok tidak ditampilkan di toko online (wajib verifikasi umur), hanya dijual lewat Kasir.</div>':'')+'<div><button class="btn" type="submit">Simpan produk</button></div></form>'
     :'<div><button class="btn" data-act="pnew">'+ic('plus',18,2.4)+'Tambah produk</button></div>')+
   '<div class="card"><div class="tbl"><table><thead><tr><th>Produk</th><th>Kategori</th><th>Modal</th><th>Jual</th><th>Untung</th><th>Sisa stok</th><th>Status</th><th>Online</th><th></th></tr></thead><tbody>'+
   (list.length?list.map(p=>{const st=stockOf(p.kode),low=st<=(+p.min||0),u=(+p.jual||0)-(+p.modal||0);
     return '<tr><td><span style="display:flex;align-items:center;gap:10px">'+prodTile(p)+'<span><b>'+esc(p.name)+'</b><br><small style="color:var(--muted)">'+esc(p.kode)+'</small></span></span></td><td>'+esc(p.cat)+'</td><td class="num">'+rp(p.modal)+'</td><td class="num">'+rp(p.jual)+'</td><td class="num" style="color:var(--ok);font-weight:700">'+rp(u)+(p.jual?' · '+Math.round(u/p.jual*100)+'%':'')+'</td><td class="num"><b>'+st+'</b> '+esc(p.unit||'')+' <small style="color:var(--muted)">min '+(+p.min||0)+'</small></td><td><span class="pill-s '+(low?'ps-bad':'ps-ok')+'">'+(low?'Restock':'Aman')+'</span></td><td>'+(p.cat==='Rokok'?'<small style="color:var(--muted)">Kasir saja</small>':'<button class="btn3" data-online="'+esc(p.kode)+'">'+(p.online!==false?'Tampil':'Disembunyikan')+'</button>')+'</td><td><button class="btn3" data-edit="'+esc(p.kode)+'">Ubah</button></td></tr>'}).join('')
    :'<tr><td colspan="9" class="empty">Belum ada produk.</td></tr>')+'</tbody></table></div></div></div>';
}

function vStok(){
  if(loading())return '<div class="card empty">Memuat stok…</div>';
  const f=S.sf,list=sortedProducts();if(!f.kode&&list[0]){f.kode=list[0].kode;if(!f.harga)f.harga=list[0].modal}
  const rows=S.stockin.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).slice(0,40);
  const mo=mk(new Date());
  return '<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:start">'+
  '<form id="sForm" class="card stack" style="gap:12px"><div class="ch" style="margin:0"><div><h3>Catat belanja ke grosir</h3><p>Stok bertambah otomatis</p></div></div><div class="fg">'+
   '<label class="f">Tanggal<input class="in" id="s-date" type="date" data-bind="sf.date" required value="'+esc(f.date)+'"></label>'+
   '<label class="f">Produk<select class="in" id="s-kode" data-bind="sf.kode" data-live="1">'+list.map(p=>'<option value="'+esc(p.kode)+'"'+(f.kode===p.kode?' selected':'')+'>'+esc(p.name)+'</option>').join('')+'</select></label>'+
   '<label class="f">Jumlah<input class="in num" id="s-qty" type="number" min="1" required data-bind="sf.qty" data-live="1" value="'+esc(f.qty)+'"></label>'+
   '<label class="f">Harga beli / unit<input class="in num" id="s-harga" type="number" min="0" required data-bind="sf.harga" data-live="1" value="'+esc(f.harga)+'"></label>'+
   '<label class="f" style="grid-column:1/-1">Tempat beli<input class="in" id="s-tempat" data-bind="sf.tempat" value="'+esc(f.tempat)+'" placeholder="Nama grosir / agen"></label></div>'+
   '<label class="f" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" id="s-upd" data-bind="sf.upd"'+(f.upd?' checked':'')+'> Jadikan harga modal produk</label>'+
   '<div class="banner b-lav" style="display:flex;justify-content:space-between;font-weight:700"><span>Total belanja</span><span class="num">'+rp((+f.qty||0)*(+f.harga||0))+'</span></div>'+
   '<div><button class="btn" type="submit"'+(list.length?'':' disabled')+'>Simpan &amp; tambah stok</button></div></form>'+
  '<div class="card"><div class="ch"><div><h3>Riwayat belanja</h3><p>'+mLabel(mo)+': '+rp(sum(S.stockin.filter(x=>String(x.date).slice(0,7)===mo),x=>(+x.qty||0)*(+x.harga||0)))+'</p></div></div>'+
   (rows.length?rows.map(x=>{const p=prod(x.kode);return '<div class="li"><span><b>'+esc(p?p.name:x.kode)+' · +'+(+x.qty||0)+'</b><br><small style="color:var(--muted)">'+esc(x.date)+(x.tempat?' · '+esc(x.tempat):'')+' · '+rp(x.harga)+'/unit</small></span><b class="num">'+rp((+x.qty||0)*(+x.harga||0))+'</b></div>'}).join(''):'<div class="empty">Belum ada catatan belanja.</div>')+'</div></div>';
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
   '<label class="f">Bagian / line<input class="in" id="c-line" data-bind="cf.line" value="'+esc(S.cf.line)+'"></label>'+
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
  const wk=[0,0,0,0,0];list.forEach(o=>{wk[Math.min(4,Math.floor((new Date(o.createdAt).getDate()-1)/7))]+=+o.total||0});
  const max=Math.max(1,...wk),g=['#C6B5FF,#7C69CF','#FFC1D6,#D9467C','#FFE09A,#E0901F','#BFD6FF,#4377DB','#CFC2FF,#6E5AC4'];
  const per={};list.forEach(o=>(o.items||[]).forEach(i=>{const r=per[i.kode]=per[i.kode]||{name:i.name,q:0,om:0,un:0};r.q+=+i.qty||0;r.om+=(+i.qty||0)*(+i.price||0);r.un+=(+i.qty||0)*((+i.price||0)-(+i.modal||0))}));
  const perA=Object.values(per).sort((a,b)=>b.om-a.om);
  return '<div class="stack"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between"><label class="f" style="flex-direction:row;align-items:center;gap:10px">Bulan<select class="in" id="r-month" data-bind="month" data-live="1" style="width:auto">'+months.map(m=>'<option value="'+m+'"'+(m===mo?' selected':'')+'>'+mLabel(m)+'</option>').join('')+'</select></label><button class="btn2" data-act="csv">'+ic('down',16)+'Unduh CSV</button></div>'+
  '<div class="grid g4">'+[['lav','money','Penjualan',rp(omzet),list.length+' transaksi'],['gold','trophy','Untung kotor',rp(untung),omzet?'margin '+Math.round(untung/omzet*100)+'%':'–'],['blue','check','Uang diterima',rp(terima),'Belum dibayar '+rp(kb)],['pink','down','Belanja stok',rp(belanja),'dari catatan stok masuk']].map(s=>'<div class="stat b-'+s[0]+'"><div class="row"><span class="tile t-'+s[0]+'">'+ic(s[1],22)+'</span></div><span class="lb">'+s[2]+'</span><span class="vl num">'+s[3]+'</span><span class="sm">'+s[4]+'</span></div>').join('')+'</div>'+
  '<div class="grid g3"><div class="card"><div class="ch"><div><h3>Penjualan per minggu</h3><p>'+mLabel(mo)+'</p></div></div><div class="bars" role="img" aria-label="'+wk.map((x,i)=>'Minggu '+(i+1)+' '+rp(x)).join(', ')+'">'+wk.map((x,i)=>'<div><span class="num">'+(x?Math.round(x/1000)+'rb':'0')+'</span><b style="height:'+Math.round(x/max*120)+'px;background:linear-gradient(180deg,'+g[i]+')"></b><small>Mg '+(i+1)+'</small></div>').join('')+'</div></div>'+
  '<div class="card"><div class="ch"><div><h3>Per produk</h3><p>Jumlah, omzet, untung</p></div></div>'+(perA.length?perA.map(r=>'<div class="li"><span><b>'+esc(r.name)+'</b><br><small style="color:var(--muted)">'+r.q+' terjual</small></span><span style="text-align:right"><b class="num">'+rp(r.om)+'</b><br><small class="num" style="color:var(--ok)">+'+rp(r.un)+'</small></span></div>').join(''):'<div class="empty">Belum ada penjualan di bulan ini.</div>')+'</div></div></div>';
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

const RENDER={toko:vToko,keranjang:vKeranjang,pesananku:vPesananku,akun:vAkun,dashboard:vDashboard,pesanan:vPesanan,kasir:vKasir,produk:vProduk,stok:vStok,kasbon:vKasbon,rekap:vRekap};
function render(){
  notifyNew();
  if(isAuthed()&&S.view==='pesanan'&&(S.loaded.orders||S.loaded.admin))markSeen();
  {const u=unseenOrders().length;document.title=(u?'('+u+') ':'')+'KAmart'}
  const a=document.activeElement,fid=a&&a.id,s1=a&&a.selectionStart,s2=a&&a.selectionEnd;
  const locked=VIEWS.find(x=>x.id===S.view).g==='Admin'&&!isAuthed();
  document.body.classList.toggle('loginmode',locked);
  renderShell();
  document.getElementById('view').innerHTML=(S.netErr?'<div class="banner b-gold" role="status" style="color:var(--warn);margin-bottom:14px">'+esc(S.netErr)+'</div>':'')+(locked?vLogin():RENDER[S.view]());
  document.getElementById('modal').innerHTML=S.receipt?receiptHtml():S.placed?placedHtml():'';
  document.getElementById('notif').innerHTML=notifHtml();
  if(fid){const el=document.getElementById(fid);if(el&&el!==document.activeElement){el.focus({preventScroll:true});try{if(s1!=null)el.setSelectionRange(s1,s2)}catch(e){}}}
}
function receiptText(o){return 'KAmart · '+o.code+'\n'+dLabel(o.createdAt)+'\n'+(o.items||[]).map(i=>i.qty+'x '+i.name+'  '+rp(i.qty*i.price)).join('\n')+'\nTotal: '+rp(o.total)+'\nBayar: '+(o.pay==='Kasbon'?'Kasbon (ditagih saat gajian)':o.pay)+(o.pay==='Tunai'?'\nDiterima: '+rp(o.cashIn)+'\nKembalian: '+rp(o.change):'')+'\nTerima kasih!'}
function receiptHtml(){const o=S.receipt;return '<div class="modal" role="dialog" aria-modal="true" aria-label="Transaksi berhasil"><div class="box"><div style="display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center"><span class="tile t-lav" style="border-radius:50%">'+ic('check',24,2.6)+'</span><b style="font-size:18px">Transaksi berhasil</b><small style="color:var(--muted)">'+esc(o.code)+' · '+dLabel(o.createdAt)+' · '+esc(o.customerName)+'</small></div>'+
 '<div style="border-block:1px dashed #DCCDE0;padding:10px 0">'+(o.items||[]).map(i=>'<div class="li" style="border:0;padding:3px 0"><span>'+i.qty+'× '+esc(i.name)+'</span><span class="num">'+rp(i.qty*i.price)+'</span></div>').join('')+'</div>'+
 '<div class="li" style="border:0;font-weight:800"><span>Total</span><span class="num">'+rp(o.total)+'</span></div>'+
 (o.pay==='Tunai'?'<div class="li" style="border:0"><span>Diterima</span><span class="num">'+rp(o.cashIn)+'</span></div><div class="li" style="border:0"><span>Kembalian</span><span class="num">'+rp(o.change)+'</span></div>':'<div class="li" style="border:0"><span>Metode</span><span>'+(o.pay==='Kasbon'?'Kasbon · belum dibayar':'QRIS')+'</span></div>')+
 '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button class="btn2" data-act="copyReceipt" style="justify-content:center">Salin struk</button><button class="btn" data-act="closeReceipt">Transaksi baru</button></div><textarea id="rcpt" class="in" rows="4" readonly hidden>'+esc(receiptText(o))+'</textarea></div></div>'}

/* ---------- struk pesanan (PNG) ---------- */
let LOGO=null;
function logoImg(){if(!LOGO)LOGO=new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>res(null);i.src='logo.png'});return LOGO}
async function receiptPng(o){
  const items=o.items||[],W=600,P=50,H=604+items.length*34,F="'Poppins',system-ui,sans-serif";
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
  items.forEach(i=>{g.fillStyle='#2B2140';g.font='600 14px '+F;g.fillText(fit(i.qty+'× '+i.name,W-2*P-140),P,y);g.textAlign='right';g.fillText(rp((+i.qty||0)*(+i.price||0)),W-P,y);g.textAlign='left';y+=34});
  y-=8;dash(y);y+=40;
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
  '<div style="font-size:13px">'+esc(itemsText(o))+'<br><b class="num">'+rp(o.total)+'</b> · '+esc(o.slot||'')+'</div>'+
  '<small style="color:'+(S.placedDl==='fail'?'var(--bad)':'var(--muted)')+'">'+(S.placedDl==='ok'?'Struk sudah diunduh ke HP kamu.':S.placedDl==='fail'?'Struk belum terunduh. Tekan Unduh struk.':'Menyiapkan struk…')+'</small>'+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%"><button class="btn2" data-act="dlplaced" style="justify-content:center">Unduh struk</button><button class="btn" data-act="closeplaced">Lihat antrian</button></div></div></div>'}

/* ---------- actions ---------- */
async function copyText(t){try{await navigator.clipboard.writeText(t);toast('Tersalin. Tempel di WhatsApp.')}catch(e){const el=document.getElementById('rcpt');if(el){el.hidden=false;el.select()}toast('Salin manual dari kotak teks.')}}
function setBind(path,val){const[a,b]=path.split('.');if(b)S[a][b]=val;else S[a]=val}
document.addEventListener('input',e=>{const t=e.target,b=t.dataset&&t.dataset.bind;if(!b)return;const val=t.type==='checkbox'?t.checked:t.value;setBind(b,val);
  if(b==='sf.kode'){const p=prod(val);if(p)S.sf.harga=p.modal}
  if(b==='pf.cat'&&val==='Rokok')S.pf.online=false;
  if(b.startsWith('co.'))ls.set('me',{name:S.co.name,line:S.co.line});
  if(b==='co.name'){clearTimeout(checkReg.t);checkReg.t=setTimeout(checkReg,450)}if(t.dataset.live||b==='pf.cat')render()});
document.addEventListener('change',e=>{const t=e.target,b=t.dataset&&t.dataset.bind;if(b&&(t.tagName==='SELECT'||t.type==='checkbox')){setBind(b,t.type==='checkbox'?t.checked:t.value);if(b==='sf.kode'){const p=prod(t.value);if(p)S.sf.harga=p.modal}render()}});
document.addEventListener('click',async e=>{
  const t=e.target.closest('button,a');if(!t)return;const d=t.dataset;
  if(d.go){e.preventDefault();go(d.go);window.scrollTo({top:0});return}
  if(d.receipt){const o=findOrder(d.receipt);if(o)downloadReceipt(o).then(()=>toast('Struk diunduh')).catch(e=>toast(e.message||'Struk gagal diunduh'));return}
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
  if(act==='install'){doInstall();return}
  if(act==='installhide'){ls.set('installHide',1);render();return}
  if(act==='dlplaced'&&S.placed){autoReceipt();return}
  if(act==='closeplaced'){S.placed=null;go('pesananku');render();return}
  if(act==='nsound'){S.ns.sound=!S.ns.sound;ls.set('ns',S.ns);if(S.ns.sound)beep();render();return}
  if(act==='npush'){
    if(!('Notification' in window)){toast('Browser ini tidak mendukung notifikasi');return}
    let r='denied';try{r=await Notification.requestPermission()}catch(e){}
    S.ns.push=r==='granted';ls.set('ns',S.ns);toast(r==='granted'?'Notifikasi browser aktif':'Izin notifikasi tidak diberikan');render();return}
  if(act==='ntest'){S.alerts=[{id:'tes-'+Date.now(),name:'Contoh pembeli',items:'1× Pop Mie Ayam',total:6000,slot:'Istirahat 12.00',at:Date.now()}].concat(S.alerts).slice(0,3);expireAlerts();if(S.ns.sound)beep();try{if(navigator.vibrate)navigator.vibrate([120,60,120])}catch(e){}render();return}
  if(act==='logout'){S.token=null;ls.set('token',null);S.loaded.admin=false;S.products=[];S.orders=[];S.customers=[];S.stockin=[];toast('Kamu sudah keluar dari admin');go('toko');return}
  if(act==='resetpin'){S.lg.reset=true;S.lg.err='';S.lg.pin='';S.lg.pin2='';render();return}
  if(act==='cancelreset'){S.lg.reset=false;S.lg.err='';render();return}
  if(act==='clearCart'){S.cart={};render()}
  if(act==='kclear'){S.k.cart={};S.k.cash=0;render()}
  if(act==='pnew'){S.pf={kode:'',name:'',cat:'Makanan',unit:'pcs',modal:'',jual:'',min:5,online:true};render()}
  if(act==='pclose'){S.pf=null;render()}
  if(act==='pimgdel'&&S.pf){S.pf.img='';render()}
  if(act==='closeReceipt'){S.receipt=null;render()}
  if(act==='copyReceipt'&&S.receipt)copyText(receiptText(S.receipt));
  if(act==='kpay')await kasirPay();
  if(act==='csv')await exportCsv();
});
document.addEventListener('submit',async e=>{
  e.preventDefault();const id=e.target.id;
  if(id==='lgForm')await doLogin();
  if(id==='coForm')await placeOrder();
  if(id==='pForm')await saveProduct();
  if(id==='sForm')await saveStock();
  if(id==='cForm')await saveCustomer();
});
async function shrink(file){
  const url=URL.createObjectURL(file);
  try{
    const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
    const M=400,s=Math.min(1,M/Math.max(img.naturalWidth,img.naturalHeight));
    const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*s));c.height=Math.max(1,Math.round(img.naturalHeight*s));
    const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);
    return c.toDataURL('image/jpeg',0.8);
  }finally{URL.revokeObjectURL(url)}
}
document.addEventListener('change',async e=>{const t=e.target;if(t.id!=='p-img'||!t.files||!t.files[0]||!S.pf)return;
  try{S.pf.img=await shrink(t.files[0]);render()}catch(err){toast('Foto tidak bisa dibaca. Coba file JPG atau PNG.')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(S.receipt||S.placed)){S.receipt=null;S.placed=null;render()}});

function orderBody(lines,extra){const total=sum(lines,l=>l.qty*l.price);return Object.assign({createdAt:new Date().toISOString(),items:lines,total,modalTotal:sum(lines,l=>l.qty*l.modal)},extra)}
async function placeOrder(){
  const lines=cartLines(S.cart,S.pub);const name=S.co.name.trim();
  if(!lines.length)return;if(!name){toast('Isi nama dulu');const el=document.getElementById('co-name');if(el)el.focus();return}
  if(S.co.pay==='Kasbon'&&!S.reg){toast('Bayar pas gajian khusus pelanggan terdaftar');return}
  S.busy=true;render();
  try{const r=await api('POST','/api/orders',{customerName:name,customerLine:S.co.line.trim(),slot:S.co.slot,pay:S.co.pay,note:S.co.note.trim(),items:lines.map(l=>({kode:l.kode,qty:l.qty}))});
    const toks=ls.get('orders',[]);toks.unshift(r.token);ls.set('orders',toks.slice(0,50));S.mine.unshift(r.order);
    S.cart={};S.co.note='';S.busy=false;S.placed=r.order;S.placedDl='';go('pesananku');window.scrollTo({top:0});autoReceipt();loadPublic();loadQueue();return}
  catch(e){toast(e.message)}
  S.busy=false;render();
}
async function kasirPay(){
  const k=S.k,lines=cartLines(k.cart);if(!lines.length)return;
  S.busy=true;render();
  try{const r=await api('POST','/api/admin/orders',{customerName:k.buyer||'',pay:k.method,cashIn:+k.cash||0,items:lines.map(l=>({kode:l.kode,qty:l.qty}))},true);
    S.receipt=r.order;S.k={cart:{},buyer:'',method:'Tunai',cash:0};loadAdmin()}catch(e){toast(e.message)}
  S.busy=false;render();
}
async function saveProduct(){
  const f=S.pf;const kode=String(f.kode).trim().toUpperCase().replace(/[^A-Z0-9_-]/g,'');
  if(!kode||!String(f.name).trim()){toast('Kode dan nama wajib diisi');return}
  if(!f._edit&&S.products.some(p=>p.kode===kode)){toast('Kode '+kode+' sudah dipakai');return}
  const body={isNew:!f._edit,name:String(f.name).trim(),cat:f.cat,unit:String(f.unit||'').trim(),modal:+f.modal||0,jual:+f.jual||0,min:+f.min||0,online:f.cat==='Rokok'?false:!!f.online,img:f.img||''};
  if(body.img.length>300000){toast('Foto terlalu besar, coba foto lain');return}
  try{await run(api('PUT','/api/admin/products/'+encodeURIComponent(kode),body,true),'Produk tersimpan');S.pf=null;await loadAdmin()}catch(e){}
}
async function saveStock(){
  const f=S.sf;const qty=+f.qty||0,harga=+f.harga||0;if(!f.kode||qty<=0){toast('Isi jumlah dulu');return}
  try{await run(api('POST','/api/admin/stockin',{date:f.date,kode:f.kode,qty,harga,tempat:String(f.tempat||'').trim(),updateModal:!!f.upd},true),'Stok bertambah '+qty);S.sf.qty='';await loadAdmin()}catch(e){}
}
async function saveCustomer(){
  const n=S.cf.name.trim();if(!n){toast('Isi nama pelanggan');return}
  try{await run(api('POST','/api/admin/customers',{name:n,line:S.cf.line.trim(),wa:S.cf.wa.trim()},true),'Pelanggan tersimpan');S.cf={name:'',line:'',wa:''};await loadAdmin()}catch(e){}
}
async function exportCsv(){
  const list=valid().filter(o=>mk(o.createdAt)===S.month).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
  const q=s=>'"'+String(s==null?'':s).replace(/"/g,'""')+'"';
  const rows=[['Tanggal','Kode','Sumber','Pembeli','Bagian','Barang','Total','Modal','Untung','Bayar','Status bayar','Tahap']].concat(list.map(o=>[new Date(o.createdAt).toLocaleString('id-ID'),o.code,o.source,o.customerName,o.customerLine,itemsText(o),o.total,o.modalTotal,profit(o),o.pay,o.paid?'Lunas':'Belum',STAGES[o.stage]]));
  const csv='﻿'+rows.map(r=>r.map(q).join(',')).join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='rekap-kamart-'+S.month+'.csv';
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
}

/* ---------- boot ---------- */
function isShopView(){return VIEWS.find(v=>v.id===S.view).g==='Pembeli'}
function tick(){if(isShopView()){if(document.hidden)return;loadPublic();loadMine();loadQueue()}else if(S.token)loadAdmin()}
window.addEventListener('hashchange',()=>{readHash();S.confirm=null;render();tick()});
document.addEventListener('visibilitychange',tick);
readHash();render();tick();if(S.co.name)checkReg();
setInterval(tick,10000);
})();

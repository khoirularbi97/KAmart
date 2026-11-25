# KAmart

Toko kelontong online untuk lingkungan PT: pembeli pesan dari HP lalu ambil saat istirahat, admin mengelola pesanan, kasir, produk, stok, kasbon, dan rekap.

| Bagian | Teknologi | Deploy ke |
|---|---|---|
| `frontend/` | HTML + CSS + JavaScript (tanpa build) | **Vercel** |
| `backend/` | Node.js + Express + JWT | **VPS** (Docker atau PM2) |
| Database | PostgreSQL | **Neon** |

```
kamart/
├── frontend/          # index.html, app.js, styles.css, logo, vercel.json
├── backend/
│   ├── src/           # server.js (API), db.js, migrate.js, seed.js
│   └── sql/           # schema.sql, seed.sql (data awal dari KAmart_Pencatatan)
├── docker-compose.yml # API di VPS (nginx-proxy + SSL otomatis)
└── render.yaml        # opsional: blueprint Render
```

Alur data: browser → `https://domain-vercel/api/...` → (rewrite Vercel) → `https://api-kamart.scurebot.site` (VPS) → database Neon.
Karena lewat rewrite, frontend dan API terlihat satu domain, jadi tidak ada masalah CORS.

---

## 1. Upload ke GitHub

1. Buat repository baru di GitHub, misalnya `kamart` (boleh private).
2. Ekstrak zip ini, lalu dari folder `kamart`:
   ```bash
   git init
   git add .
   git commit -m "KAmart: frontend, backend, dan konfigurasi deploy"
   git branch -M main
   git remote add origin https://github.com/khoirularbi97/kamart.git
   git push -u origin main
   ```

## 2. Database di Neon

1. Masuk ke <https://console.neon.tech>, buat **New Project** (region terdekat: Singapore).
2. Buka **Connect** dan salin **connection string** (pilih yang *pooled*). Bentuknya:
   `postgresql://USER:PASSWORD@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
3. Tidak perlu membuat tabel manual. API akan membuat tabel dan mengisi data awal otomatis saat pertama kali jalan.

## 3. Backend API di VPS

Contoh memakai subdomain `api-kamart.scurebot.site`. Ganti jika memakai nama lain (ubah juga `frontend/vercel.json`).

### a. Arahkan subdomain ke VPS
Di panel DNS domain (Rumahweb), tambahkan **A record**: nama `api-kamart`, nilai = IP VPS. Tunggu beberapa menit sampai aktif (`ping api-kamart.scurebot.site` menunjukkan IP VPS).

### b. Ambil kode dan isi rahasia
```bash
cd ~
git clone https://github.com/khoirularbi97/KAmart.git kamart
cd kamart
cp backend/.env.example backend/.env
nano backend/.env
```
Isi `DATABASE_URL` (dari Neon), `JWT_SECRET` (buat dengan `openssl rand -hex 32`), `ADMIN_USERNAME`, `ADMIN_PASSWORD` (minimal 8 karakter), dan `CORS_ORIGIN` (domain Vercel, boleh kosong dulu).

### c. Jalankan dengan Docker (disarankan, karena port 80/443 dipegang nginx-proxy)
```bash
docker network ls                      # cari nama network milik nginx-proxy
docker compose up -d --build           # jika nama network-nya bukan "nginx-proxy":
                                       # PROXY_NETWORK=nama_network docker compose up -d --build
docker logs -f kamart-api              # harus muncul "KAmart API berjalan di port 3000"
```
nginx-proxy membaca `VIRTUAL_HOST`, dan acme-companion membuat sertifikat SSL untuk `LETSENCRYPT_HOST` secara otomatis (1–2 menit).
Cek: buka `https://api-kamart.scurebot.site/api/health`, hasilnya harus `{"ok":true}`.

**Update setelah ada perubahan kode:**
```bash
cd ~/kamart && git pull && docker compose up -d --build
```

### Alternatif: PM2 (tanpa Docker)
```bash
cd ~/kamart/backend
npm install --omit=dev
pm2 start ecosystem.config.js && pm2 save
```
API berjalan di port 3005. Sambungkan subdomain lewat container jembatan (socat) di network nginx-proxy, lalu izinkan container mengakses port 3005 di firewall:
```bash
cd ~/apps/kamart
PROXY_NETWORK=smart-parking_app-network docker compose -f deploy/pm2-bridge.compose.yml up -d
sudo ufw allow from 172.16.0.0/12 to any port 3005 proto tcp   # tanpa ini hasilnya 504 Gateway Timeout
curl -I https://api-kamart.scurebot.site/api/health              # harus HTTP/2 200
```

### Opsional: Render
`render.yaml` tetap tersedia jika suatu saat ingin memakai Render (Root Directory `backend`, Start Command `npm start`).

## 4. Frontend di Vercel

1. `frontend/vercel.json` sudah mengarah ke `https://api-kamart.scurebot.site`. Jika memakai subdomain lain, ubah dulu lalu commit & push.
2. Di <https://vercel.com/new>, import repo `kamart`.
3. Atur **Root Directory** = `frontend`, **Framework Preset** = `Other`, kosongkan Build Command dan Output Directory.
4. Deploy. Buka domain Vercel-nya:
   - Halaman utama = toko untuk pembeli (tanpa login).
   - Tombol **Masuk admin** di tab Akun = halaman login admin (username & password dari `backend/.env`).
5. Isi `CORS_ORIGIN` di `backend/.env` dengan domain Vercel lalu `docker compose up -d` (opsional jika selalu lewat rewrite).

## Aplikasi HP (PWA)

KAmart bisa dipasang di layar utama HP:
- **Android (Chrome):** buka situs KAmart, lalu ketuk **Pasang** pada banner di halaman toko, atau tombol **Pasang sekarang** di tab Akun.
- **iPhone (Safari):** ketuk **Bagikan**, lalu **Tambahkan ke Layar Utama**.

Katalog tetap bisa dilihat saat offline (data terakhir). Memesan dan halaman admin tetap butuh internet.
Setiap rilis, naikkan `VERSION` di `frontend/sw.js` (misalnya `kamart-v2`) supaya HP pengguna mengambil file terbaru.

## Notifikasi HP admin (Web Push)

Notifikasi pesanan baru tetap masuk walau aplikasi KAmart ditutup.

1. Buat kunci VAPID sekali saja di VPS:
   ```bash
   cd ~/apps/kamart/backend && npm install --omit=dev
   npx web-push generate-vapid-keys
   ```
2. Salin hasilnya ke `backend/.env`:
   ```
   VAPID_PUBLIC_KEY=...
   VAPID_PRIVATE_KEY=...
   VAPID_SUBJECT=mailto:emailkamu@contoh.com
   ```
3. `pm2 restart kamart-api` (atau `docker compose up -d --build`).
4. Di HP admin: buka KAmart, masuk admin, buka **Pesanan**, ketuk **Aktifkan notifikasi HP**, izinkan, lalu ketuk **Tes notifikasi**.

Catatan: di iPhone (iOS 16.4+), KAmart harus dipasang ke Layar Utama dulu dan dibuka dari ikonnya. Jangan mengganti kunci VAPID setelah dipakai; kalau terganti, aktifkan ulang notifikasi di setiap HP admin.

## Foto produk di Neon Object Storage (bucket)

Tanpa pengaturan apa pun, foto disimpan di tabel `product_images` (database). Agar foto disimpan di bucket Neon:

1. **Buat bucket:** Console Neon → project KAmart → pilih branch → tab **Object storage** → **New bucket**.
   Nama: `kamart-produk`, akses: **public_read** (supaya foto bisa tampil di toko). Butuh peran Admin project.
2. **Buat credential** dengan scope `storage:read` dan `storage:write`. Simpan *secret*-nya, hanya ditampilkan sekali.
3. **Isi `backend/.env`:**
   ```
   AWS_ENDPOINT_URL_S3=https://<branch-id>.storage.c-<N>.<region>.aws.neon.tech
   AWS_REGION=ap-southeast-1
   AWS_ACCESS_KEY_ID=<token_id credential>
   AWS_SECRET_ACCESS_KEY=<s3_secret_access_key>
   NEON_BUCKET=kamart-produk
   ```
4. `npm install --omit=dev && pm2 restart kamart-api`. Di log harus muncul
   `Penyimpanan foto: Neon Object Storage (bucket kamart-produk)`, dan `/api/health` menampilkan `"foto":"neon-bucket:kamart-produk"`.

Foto yang sudah ada otomatis dipindahkan saat API dijalankan ulang. Foto lama terhapus dari bucket saat diganti atau dihapus.
Jika alamat publik bucket berbeda dari `AWS_ENDPOINT_URL_S3/NEON_BUCKET`, isi `NEON_BUCKET_PUBLIC_URL`.

## Promo & diskon

Menu admin **Promo**, berlaku di toko online dan kasir:
- **Harga coret**: harga produk turun selama periode promo (tampil "-25%" dan harga lama dicoret).
- **Beli X**: beli X harga khusus (mis. 3 pcs Rp15.000) atau beli X gratis Y.
- **Beli X bonus Y**: beli produk X (jumlah minimal) dapat produk Y gratis, bisa berlaku kelipatan. Bonus masuk pesanan sebagai baris Rp0, mengurangi stok Y, dan modalnya tetap dihitung di untung. Jika stok Y habis, bonus dilewati.
- **Minimal belanja**: potongan Rp atau % (dengan batas maksimal) otomatis saat belanja mencapai minimal; dipakai yang paling hemat.
- **Voucher**: kode yang diketik pembeli/kasir, potongan Rp atau %, minimal belanja, kuota. Kode voucher tidak pernah dikirim ke toko publik; pesanan batal tidak mengurangi kuota.

**Banner & poster**: promo bercentang "Tampilkan di banner aplikasi" muncul sebagai banner geser di halaman toko (voucher hanya jika dicentang, kodenya jadi publik). Tombol **Poster** di menu Promo membuat gambar PNG ukuran Status WA (1080×1920) atau grup (1080×1080) lengkap dengan QR ke toko, lalu bisa langsung dibagikan ke WhatsApp. Alamat di QR bisa diganti lewat `window.KAMART_SITE` di `frontend/config.js`.

Urutan hitung: harga coret → beli X → minimal belanja → voucher; bonus produk ditambahkan terakhir. Semua dihitung ulang di server (`backend/src/promo.js`); salinan yang sama ada di frontend supaya angka keranjang sama dengan struk. Setiap promo bisa diberi tanggal mulai/selesai dan dimatikan sementara.

## Kelola Master

Menu admin **Kelola Master** untuk mengatur tanpa mengubah kode:
- **Kategori**: nama, warna, ikon, urutan, dan "Jual online" (matikan untuk kategori khusus kasir seperti rokok). Ganti nama kategori otomatis memindahkan produknya; kategori yang masih dipakai produk tidak bisa dihapus.
- **Pembayaran**: QRIS, Tunai, dan Bayar pas gajian (bawaan, bisa diganti nama/dinonaktifkan) serta metode tambahan seperti Transfer BCA, lengkap dengan keterangan untuk pembeli dan pilihan tampil di toko online/kasir.
- **Waktu ambil**: tambah, ubah, urutkan, nonaktifkan, dan pilih waktu bawaan.
- **Satuan, bagian/line, dan info toko** (lokasi ambil, batas waktu order).

Data disimpan di tabel `settings` dan dibuat otomatis saat API dijalankan ulang.

## QRIS otomatis lunas (Midtrans)

Tanpa pengaturan, pembeli melihat QRIS DANA statis dan admin menandai lunas manual. Jika `MIDTRANS_SERVER_KEY` diisi:
- setiap pesanan QRIS mendapat QR sendiri dari Midtrans (berlaku 30 menit, dibuat ulang otomatis jika kedaluwarsa);
- setelah dibayar, Midtrans memanggil `POST /api/payment/midtrans`; server memeriksa `signature_key`, mengecek ulang status ke Midtrans, lalu menandai pesanan **Lunas** dan mengirim notifikasi ke HP admin;
- layar pembeli berubah menjadi "Pembayaran QRIS diterima" tanpa perlu dimuat ulang;
- Kasir tetap memakai QRIS DANA statis.

Langkah di VPS:
```bash
cd ~/apps/kamart && git pull
nano backend/.env
#   MIDTRANS_ENV=sandbox                          (ganti production setelah akun disetujui)
#   MIDTRANS_SERVER_KEY=<nilai di tabel "Server Keys", mis. G123...-DEFAULT-PAYMENT...>
#   MIDTRANS_SIGNATURE_KEY=<"Signature Secret Key", SB-Mid-server-...>
#   MIDTRANS_NOTIFY_URL=https://api-kamart.scurebot.site/api/payment/midtrans
pm2 restart kamart-api
curl https://api-kamart.scurebot.site/api/health   # "bayar":"midtrans-sandbox" atau "midtrans-production"
```
Tabel `payments` dibuat otomatis saat API dijalankan ulang. Isi juga **Payment Notification URL** di dashboard Midtrans (Settings → Payment) dengan alamat yang sama.
Uji sandbox: bayar QR lewat simulator QRIS sandbox Midtrans, jangan dengan aplikasi e-wallet sungguhan.

## Verifikasi Midtrans (aktivasi Production)

Halaman yang biasanya dicek tim Midtrans sudah tersedia di situs (tautan ada di bawah halaman toko dan di tab Akun):

| Halaman | Alamat |
|---|---|
| Tentang & Kontak (produk, cara pesan, pengiriman, kontak) | `https://kamart-liart.vercel.app/#tentang` |
| Syarat & Ketentuan | `https://kamart-liart.vercel.app/#syarat` |
| Pengembalian & Refund | `https://kamart-liart.vercel.app/#refund` |
| Kebijakan Privasi | `https://kamart-liart.vercel.app/#privasi` |

Nama pemilik, WhatsApp, email, alamat, dan jam layanan bisa diubah tanpa mengedit `app.js`, cukup lewat `frontend/config.js`:
```js
window.KAMART_INFO = { wa: '08xxxxxxxxxx', email: 'kamu@contoh.com', alamat: 'Cikarang, Kabupaten Bekasi, Jawa Barat' };
```

Dokumen untuk form aktivasi (usaha perorangan): KTP, NPWP pribadi (jika ada), foto buku tabungan/rekening atas nama sendiri, dan swafoto dengan KTP bila diminta.
Isi jenis usaha sebagai **toko kelontong / makanan & minuman (sembako)**. Rokok tidak dijual di toko online.

## Menjalankan di komputer sendiri

Butuh Node.js 20+.

```bash
cd backend
cp .env.example .env      # isi DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD
npm install
npm run dev               # API di http://localhost:3000
```

Untuk frontend lokal, isi `frontend/config.js` dengan `window.KAMART_API_BASE = 'http://localhost:3000';`, lalu buka folder `frontend` dengan server statis, misalnya `npx serve frontend`. Kembalikan ke `''` sebelum push.

## Endpoint API

| Metode | Alamat | Akses | Fungsi |
|---|---|---|---|
| GET | `/api/health` | publik | Cek server & database |
| GET | `/api/products` | publik | Katalog (produk online + sisa stok) |
| GET | `/api/customers/check?name=` | publik | Cek pelanggan terdaftar (boleh kasbon) |
| POST | `/api/orders` | publik | Buat pesanan online |
| POST | `/api/orders/lookup` | publik | Status pesanan milik HP pembeli (pakai token) |
| POST | `/api/orders/:id/qris` | publik (token pesanan) | QRIS Midtrans untuk pesanan |
| POST | `/api/payment/midtrans` | Midtrans (signature) | Webhook pembayaran |
| GET | `/api/master` | publik | Data master (kategori, metode bayar, waktu ambil, info toko) |
| PUT | `/api/admin/master` | admin | Simpan data master (`renames` memindahkan produk saat kategori diganti nama) |
| POST | `/api/promos/voucher` | publik (dibatasi) | Cek kode voucher |
| PUT/DELETE | `/api/admin/promos/:id` | admin | Simpan / hapus promo |
| POST | `/api/auth/login` | publik | Login admin, mengembalikan token (berlaku 7 hari) |
| GET | `/api/admin/data` | admin | Semua produk, pelanggan, pesanan, stok masuk |
| PUT | `/api/admin/products/:kode` | admin | Tambah/ubah produk (termasuk foto) |
| POST | `/api/admin/stockin` | admin | Catat stok masuk |
| POST | `/api/admin/products/:kode/remodal` | admin | Koreksi modal produk di transaksi lama (per bulan atau semua) |
| POST | `/api/admin/expenses` | admin | Catat pengeluaran operasional (tanggal, keterangan, jumlah) |
| PUT | `/api/admin/expenses/:id` | admin | Ubah pengeluaran |
| DELETE | `/api/admin/expenses/:id` | admin | Hapus pengeluaran |
| POST | `/api/admin/hpp/rehitung` | admin | Samakan modal transaksi (per bulan) dengan modal rata-rata dari stok masuk |
| PUT | `/api/admin/cashclose/:date` | admin | Simpan/perbarui tutup kasir harian (modal, tunai, kasbon, keluar, fisik, pecahan) |
| DELETE | `/api/admin/cashclose/:date` | admin | Hapus tutup kasir |
| POST | `/api/admin/opname` | admin | Simpan stok opname `{date, items:[{kode, fisik, alasan}]}`; selisih jadi penyesuaian stok |
| DELETE | `/api/admin/opname/:batch` | admin | Batalkan satu opname (stok kembali) |
| PUT/DELETE | `/api/admin/stockin/:id` | admin | Ubah / hapus catatan stok masuk (ditolak jika stok jadi minus) |
| POST | `/api/admin/customers` | admin | Daftarkan pelanggan |
| POST | `/api/admin/orders` | admin | Transaksi kasir |
| PATCH | `/api/admin/orders/:id` | admin | Ubah tahap / tandai lunas / batalkan (`stage: -1`) |
| POST | `/api/admin/kasbon/settle` | admin | Lunasi semua kasbon satu pelanggan |

## Catatan keamanan

- Harga dan stok selalu dihitung di server, bukan dari browser, jadi pembeli tidak bisa mengubah harga.
- Login admin dibatasi 5 kali gagal per 5 menit per alamat IP.
- Jangan pernah commit file `.env`. Ganti `ADMIN_PASSWORD` di `backend/.env` kapan saja (lalu restart API); token lama tetap berlaku sampai kedaluwarsa, jadi ganti juga `JWT_SECRET` untuk memaksa semua perangkat login ulang.
- Rokok tidak tampil di toko online (wajib verifikasi umur) dan hanya bisa dijual lewat Kasir.

## Data awal

`backend/sql/seed.sql` berisi data dari file KAmart_Pencatatan: 9 produk, 7 pelanggan, 12 catatan stok masuk, dan 7 transaksi November 2026. Data ini hanya dimasukkan jika tabel produk masih kosong. Catatan: harga Pop Mie Kari (modal Rp30.000, jual Rp31.500) kemungkinan salah ketik; ubah lewat menu Produk setelah deploy.


## Rekap: untung bersih & nilai sisa stok

- **Untung kotor** = penjualan − modal barang terjual (modal dicatat saat transaksi).
- **Untung bersih** = untung kotor − pengeluaran operasional bulan itu (dicatat di kartu *Pengeluaran operasional* di bawah halaman Rekap).
- **Nilai sisa stok** = Σ sisa stok × modal rata-rata (posisi akhir bulan yang dipilih).
- **Modal produk otomatis** memakai metode rata-rata bergerak (moving average): setiap stok masuk,
  modal = (sisa stok × modal lama + jumlah masuk × harga beli) ÷ (sisa + jumlah masuk). Harga modal di form
  produk hanya bisa diisi sebagai *modal awal* sebelum ada catatan stok masuk. Harga beli di Stok masuk wajib diisi.
- Kartu **Arus stok** mengecek: stok awal bulan + belanja − modal barang terjual (HPP) = stok akhir.
  Jika ada selisih (modal transaksi lama diketik manual, stok masuk dicatat belakangan), tombol
  *Samakan modal transaksi* menghitung ulang modal tiap transaksi bulan itu dari stok masuk.
- Saat server dinyalakan, modal semua produk dihitung ulang dari stok masuk (`src/hpp.js`; salinan identik di frontend).

## Stok opname

Menu **Stok → Stok opname**: isi jumlah fisik di rak (tombol *Sama* = cocok dengan sistem), pilih alasan untuk yang selisih
(rusak/kedaluwarsa, hilang, dipakai sendiri, salah catat), lalu simpan. Selisih dicatat di tabel `adjustments`
dengan modal rata-rata saat itu, dan stok = stok masuk − terjual ± penyesuaian.
Di Rekap, susut opname mengurangi **untung bersih** dan muncul sebagai baris di kartu **Arus stok**.
Riwayat opname bisa dilihat detailnya, dibatalkan, dan diekspor ke CSV.

## Export Excel / PDF

Setiap halaman admin punya satu tombol **Export** di kanan atas.
Pilihan: **Excel (.xlsx)** semua tabel halaman itu (tiap tabel satu sheet, angka tetap angka dengan format Rupiah),
**PDF** siap cetak (A4, otomatis landscape untuk tabel lebar, ada nomor halaman), dan **CSV** untuk tabel utama.
Library dimuat dari CDN hanya saat dipakai: SheetJS `xlsx@0.18.5`, `jspdf@2.5.1`, `jspdf-autotable@3.8.2`.
Export Stok opname menyertakan **Lembar hitung** kosong untuk dicetak dan diisi saat menghitung di rak.

## Tutup kasir

Menu **Kasir → Tutup kasir**. Rumus: **modal awal laci + penjualan tunai lunas hari itu + pelunasan kasbon tunai − uang keluar = seharusnya ada di laci**.
Uang dihitung per pecahan (100rb … 1rb + koin), lalu selisih lebih/kurang ditampilkan dengan kemungkinan penyebabnya.
Jika uang **lebih**, barang yang terjual tapi tidak diinput bisa dicatat sebagai penjualan tunai (stok & untung ikut benar).
Selisih kas yang disimpan masuk ke **untung bersih** di Rekap (kurang = rugi, lebih = tambahan).
Di form **Stok masuk** ada pilihan *Dibayar dari: Laci kasir / Uang lain*. Belanja dari laci otomatis dikurangkan di tutup kasir tanggal itu
(baris *Belanja stok dari laci*). Belanja stok **tidak** dicatat di Pengeluaran operasional karena biayanya masuk lewat HPP saat barang terjual.

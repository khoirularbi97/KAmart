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
| POST | `/api/auth/login` | publik | Login admin, mengembalikan token (berlaku 7 hari) |
| GET | `/api/admin/data` | admin | Semua produk, pelanggan, pesanan, stok masuk |
| PUT | `/api/admin/products/:kode` | admin | Tambah/ubah produk (termasuk foto) |
| POST | `/api/admin/stockin` | admin | Catat stok masuk |
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

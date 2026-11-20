# KAmart

Toko kelontong online untuk lingkungan PT: pembeli pesan dari HP lalu ambil saat istirahat, admin mengelola pesanan, kasir, produk, stok, kasbon, dan rekap.

| Bagian | Teknologi | Deploy ke |
|---|---|---|
| `frontend/` | HTML + CSS + JavaScript (tanpa build) | **Vercel** |
| `backend/` | Node.js + Express + JWT | **Render** |
| Database | PostgreSQL | **Neon** |

```
kamart/
├── frontend/          # index.html, app.js, styles.css, logo, vercel.json
├── backend/
│   ├── src/           # server.js (API), db.js, migrate.js, seed.js
│   └── sql/           # schema.sql, seed.sql (data awal dari KAmart_Pencatatan)
└── render.yaml        # blueprint Render
```

Alur data: browser → `https://domain-vercel/api/...` → (rewrite Vercel) → API di Render → database Neon.
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

## 3. Backend API di Render

**Cara cepat (Blueprint):**
1. Di <https://dashboard.render.com> pilih **New → Blueprint**, hubungkan repo `kamart`.
2. Render membaca `render.yaml`. Isi variabel yang diminta:
   - `DATABASE_URL` = connection string dari Neon
   - `ADMIN_PASSWORD` = password admin (minimal 8 karakter)
   - `CORS_ORIGIN` = domain Vercel nanti, misalnya `https://kamart.vercel.app` (boleh dikosongkan dulu)
   - `JWT_SECRET` dibuat otomatis, `ADMIN_USERNAME` default `admin`
3. Tunggu deploy selesai, lalu buka `https://NAMA-SERVICE.onrender.com/api/health`. Hasilnya harus `{"ok":true}`.

**Cara manual (Web Service):** Root Directory `backend`, Build Command `npm install --omit=dev`, Start Command `npm start`, lalu isi environment variable yang sama.

> Paket gratis Render "tidur" setelah 15 menit tanpa akses. Permintaan pertama setelah tidur bisa butuh sekitar 1 menit.

## 4. Frontend di Vercel

1. Buka `frontend/vercel.json`, ganti `GANTI-DENGAN-NAMA-SERVICE.onrender.com` dengan alamat Render kamu. Commit & push.
2. Di <https://vercel.com/new>, import repo `kamart`.
3. Atur **Root Directory** = `frontend`, **Framework Preset** = `Other`, kosongkan Build Command dan Output Directory.
4. Deploy. Buka domain Vercel-nya:
   - Halaman utama = toko untuk pembeli (tanpa login).
   - Tombol **Masuk admin** di tab Akun = halaman login admin (username & password dari Render).
5. Isi `CORS_ORIGIN` di Render dengan domain Vercel (opsional jika selalu lewat rewrite).

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
- Jangan pernah commit file `.env`. Ganti `ADMIN_PASSWORD` di Render kapan saja; token lama tetap berlaku sampai kedaluwarsa, jadi ganti juga `JWT_SECRET` untuk memaksa semua perangkat login ulang.
- Rokok tidak tampil di toko online (wajib verifikasi umur) dan hanya bisa dijual lewat Kasir.

## Data awal

`backend/sql/seed.sql` berisi data dari file KAmart_Pencatatan: 9 produk, 7 pelanggan, 12 catatan stok masuk, dan 7 transaksi November 2026. Data ini hanya dimasukkan jika tabel produk masih kosong. Catatan: harga Pop Mie Kari (modal Rp30.000, jual Rp31.500) kemungkinan salah ketik; ubah lewat menu Produk setelah deploy.

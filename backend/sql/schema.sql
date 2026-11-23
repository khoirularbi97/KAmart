-- Skema database KAmart (PostgreSQL / Neon). Aman dijalankan berulang kali.

CREATE TABLE IF NOT EXISTS products (
  kode        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  cat         TEXT NOT NULL DEFAULT 'Lainnya',
  unit        TEXT NOT NULL DEFAULT 'pcs',
  modal       INTEGER NOT NULL DEFAULT 0,
  jual        INTEGER NOT NULL DEFAULT 0,
  min_stock   INTEGER NOT NULL DEFAULT 0,
  online      BOOLEAN NOT NULL DEFAULT TRUE,
  img         TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  line        TEXT NOT NULL DEFAULT '',
  wa          TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS customers_name_lower ON customers (lower(name));

CREATE TABLE IF NOT EXISTS stockin (
  id          SERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  kode        TEXT NOT NULL REFERENCES products(kode) ON UPDATE CASCADE,
  qty         INTEGER NOT NULL CHECK (qty > 0),
  harga       INTEGER NOT NULL DEFAULT 0,
  tempat      TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS stockin_kode ON stockin (kode);

-- items: [{kode, name, qty, price, modal}] disimpan sebagai salinan harga saat transaksi.
-- stage: 0 Baru, 1 Disiapkan, 2 Siap diambil, 3 Selesai, -1 Dibatalkan (stok kembali).
CREATE TABLE IF NOT EXISTS orders (
  id            TEXT PRIMARY KEY,
  code          TEXT NOT NULL,
  source        TEXT NOT NULL CHECK (source IN ('online', 'kasir')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  customer_name TEXT NOT NULL,
  customer_line TEXT NOT NULL DEFAULT '',
  items         JSONB NOT NULL,
  total         INTEGER NOT NULL,
  modal_total   INTEGER NOT NULL,
  pay           TEXT NOT NULL,
  paid          BOOLEAN NOT NULL DEFAULT FALSE,
  paid_at       TIMESTAMPTZ,
  stage         INTEGER NOT NULL DEFAULT 0 CHECK (stage BETWEEN -1 AND 3),
  slot          TEXT NOT NULL DEFAULT '',
  note          TEXT NOT NULL DEFAULT '',
  cash_in       INTEGER,
  change_amt    INTEGER,
  public_token  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS orders_created ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_token ON orders (public_token);

-- Langganan Web Push untuk HP admin (notifikasi pesanan masuk walau aplikasi ditutup).
CREATE TABLE IF NOT EXISTS push_subs (
  endpoint    TEXT PRIMARY KEY,
  p256dh      TEXT NOT NULL,
  auth        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cadangan penyimpanan foto produk jika bucket Neon Object Storage belum diatur.
CREATE TABLE IF NOT EXISTS product_images (
  kode        TEXT PRIMARY KEY,
  mime        TEXT NOT NULL,
  data        BYTEA NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transaksi QRIS Midtrans per pesanan (satu pesanan bisa punya beberapa QR jika yang lama kedaluwarsa).
CREATE TABLE IF NOT EXISTS payments (
  mt_order_id TEXT PRIMARY KEY,
  order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  qr_string   TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending',
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payments_order ON payments (order_id, created_at DESC);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS qr_url TEXT NOT NULL DEFAULT '';

-- Pengaturan / data master (kategori, metode bayar, waktu ambil, dll.) dalam bentuk JSON.
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Metode bayar kini diatur lewat Kelola Master, jadi batasan lama dilepas.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_pay_check;

-- Promo & diskon (harga coret, beli X, minimal belanja, voucher). Isi promo disimpan sebagai JSON.
CREATE TABLE IF NOT EXISTS promos (
  id         TEXT PRIMARY KEY,
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal INTEGER;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS diskon JSONB NOT NULL DEFAULT '[]';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS voucher TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS orders_voucher ON orders (voucher) WHERE voucher <> '';

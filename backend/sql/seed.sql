-- Data awal KAmart dari file KAmart_Pencatatan (November 2026).
-- Dijalankan otomatis sekali saat tabel products masih kosong (AUTO_SEED=true),
-- atau manual: npm run seed, atau tempel di SQL Editor Neon.

INSERT INTO products (kode, name, cat, unit, modal, jual, min_stock, online) VALUES
  ('P001', 'Pop Mie Ayam',      'Makanan', 'cup',    5000,  6000,  1, TRUE),
  ('P002', 'Pop Mie Baso',      'Makanan', 'cup',    5000,  6000,  1, TRUE),
  ('P003', 'Pop Mie Soto',      'Makanan', 'cup',    5000,  6000,  1, TRUE),
  ('P005', 'Pop Mie Kari',      'Makanan', 'cup',   30000, 31500,  1, TRUE),  -- cek harga: di Stok Masuk dibeli Rp4.500
  ('S001', 'Sedap Ayam Jerit',  'Makanan', 'cup',    4400,  6000,  1, TRUE),
  ('S002', 'Sedap Korean Spcy', 'Makanan', 'cup',    4500,  6000,  1, TRUE),
  ('S004', 'Sedap Goreng',      'Makanan', 'cup',    6000,  7000,  1, TRUE),
  ('G001', 'Atom Garuda',       'Makanan', 'cup',     900,  1000,  1, TRUE),
  ('K001', 'Kopi Kapal api',    'Minuman', 'sachet', 1700,  2000,  2, TRUE)
ON CONFLICT (kode) DO NOTHING;

INSERT INTO customers (name, line) VALUES
  ('bg ocit', 'QC'), ('Tio', ''), ('Yugo', ''), ('Malik', ''),
  ('Fajar', ''), ('Syahrul', ''), ('Alfonso', '')
ON CONFLICT DO NOTHING;

INSERT INTO stockin (date, kode, qty, harga, tempat) VALUES
  ('2026-11-04', 'P001',  1, 5000, 'madura'),
  ('2026-11-11', 'P002',  2, 5000, 'madura'),
  ('2026-11-11', 'P003',  2, 5000, 'madura'),
  ('2026-11-11', 'S004',  1, 5000, 'madura'),
  ('2026-11-11', 'G001', 10,  900, 'madura'),
  ('2026-11-19', 'S004',  4, 4600, 'O! save'),
  ('2026-11-19', 'P002',  4, 4500, 'O! save'),
  ('2026-11-19', 'P005',  1, 4500, 'O! save'),
  ('2026-11-19', 'S001',  1, 4400, 'O! save'),
  ('2026-11-19', 'S002',  2, 4500, 'O! save'),
  ('2026-11-19', 'P001',  1, 4500, 'O! save'),
  ('2026-11-19', 'K001', 20, 1700, 'O! save');

INSERT INTO orders (id, code, source, created_at, customer_name, customer_line, items, total, modal_total, pay, paid, paid_at, stage, slot, note, public_token) VALUES
  ('seed-o01', 'KA-0001', 'kasir', '2026-11-11 12:00+07', 'bg ocit', 'QC',
   '[{"kode":"S004","name":"Sedap Goreng","qty":1,"price":7000,"modal":6000}]', 7000, 6000, 'Tunai', TRUE, '2026-11-11 12:00+07', 3, 'Kasir', 'Bayar langsung', md5(random()::text)),
  ('seed-o02', 'KA-0002', 'kasir', '2026-11-19 12:00+07', 'Tio', '',
   '[{"kode":"S001","name":"Sedap Ayam Jerit","qty":1,"price":6000,"modal":4400}]', 6000, 4400, 'Tunai', TRUE, '2026-11-19 12:00+07', 3, 'Kasir', '', md5(random()::text)),
  ('seed-o03', 'KA-0003', 'kasir', '2026-11-19 12:01+07', 'Yugo', '',
   '[{"kode":"P002","name":"Pop Mie Baso","qty":1,"price":6000,"modal":5000},{"kode":"G001","name":"Atom Garuda","qty":1,"price":1000,"modal":900}]', 7000, 5900, 'Tunai', TRUE, '2026-11-19 12:01+07', 3, 'Kasir', '', md5(random()::text)),
  ('seed-o04', 'KA-0004', 'kasir', '2026-11-19 12:02+07', 'Malik', '',
   '[{"kode":"P003","name":"Pop Mie Soto","qty":1,"price":6000,"modal":5000}]', 6000, 5000, 'Kasbon', FALSE, NULL, 3, 'Kasir', '', md5(random()::text)),
  ('seed-o05', 'KA-0005', 'kasir', '2026-11-19 12:03+07', 'Fajar', '',
   '[{"kode":"P003","name":"Pop Mie Soto","qty":1,"price":6000,"modal":5000}]', 6000, 5000, 'Tunai', TRUE, '2026-11-19 12:03+07', 3, 'Kasir', '', md5(random()::text)),
  ('seed-o06', 'KA-0006', 'kasir', '2026-11-19 12:04+07', 'Syahrul', '',
   '[{"kode":"P001","name":"Pop Mie Ayam","qty":1,"price":6000,"modal":5000}]', 6000, 5000, 'Tunai', TRUE, '2026-11-19 12:04+07', 3, 'Kasir', '', md5(random()::text)),
  ('seed-o07', 'KA-0007', 'kasir', '2026-11-19 12:05+07', 'Alfonso', '',
   '[{"kode":"P002","name":"Pop Mie Baso","qty":1,"price":6000,"modal":5000}]', 6000, 5000, 'Tunai', TRUE, '2026-11-19 12:05+07', 3, 'Kasir', '', md5(random()::text))
ON CONFLICT (id) DO NOTHING;

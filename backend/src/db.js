const { Pool, types } = require('pg');

// Kolom DATE dikembalikan apa adanya ("2026-11-19"), bukan objek Date, supaya tidak bergeser zona waktu.
types.setTypeParser(1082, (v) => v);

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL belum diisi. Salin connection string dari Neon ke environment variable DATABASE_URL.');
  process.exit(1);
}

const isLocal = /@(localhost|127\.0\.0\.1)(:|\/)/.test(url);

const pool = new Pool({
  connectionString: url,
  ssl: isLocal ? false : { rejectUnauthorized: process.env.PGSSL_NO_VERIFY !== 'true' },
  max: Number(process.env.PG_POOL_MAX || 5),
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => console.error('Koneksi database error:', err.message));

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};

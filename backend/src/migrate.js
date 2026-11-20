const fs = require('fs');
const path = require('path');

const SQL_DIR = path.join(__dirname, '..', 'sql');

async function migrate(db) {
  const sql = fs.readFileSync(path.join(SQL_DIR, 'schema.sql'), 'utf8');
  await db.query(sql);
}

async function seedIfEmpty(db) {
  const { rows } = await db.query('SELECT count(*)::int AS n FROM products');
  if (rows[0].n > 0) return false;
  const sql = fs.readFileSync(path.join(SQL_DIR, 'seed.sql'), 'utf8');
  await db.query(sql);
  return true;
}

module.exports = { migrate, seedIfEmpty };

if (require.main === module) {
  const db = require('./db');
  migrate(db)
    .then(() => { console.log('Skema database siap.'); return db.pool.end(); })
    .catch((e) => { console.error('Migrasi gagal:', e.message); process.exit(1); });
}

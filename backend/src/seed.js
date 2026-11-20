const db = require('./db');
const { migrate, seedIfEmpty } = require('./migrate');

(async () => {
  try {
    await migrate(db);
    const done = await seedIfEmpty(db);
    console.log(done ? 'Data awal KAmart berhasil dimasukkan.' : 'Tabel produk sudah berisi data, seed dilewati.');
  } catch (e) {
    console.error('Seed gagal:', e.message);
    process.exitCode = 1;
  } finally {
    await db.pool.end();
  }
})();

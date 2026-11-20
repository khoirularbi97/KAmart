// Alternatif tanpa Docker: jalankan dengan PM2 (Node.js 20.6+).
//   cd backend && npm install --omit=dev && pm2 start ecosystem.config.js && pm2 save
// Rahasia dibaca dari backend/.env. Ganti PORT jika 3005 sudah dipakai aplikasi lain.
module.exports = {
  apps: [
    {
      name: 'kamart-api',
      script: 'src/server.js',
      cwd: __dirname,
      node_args: '--env-file=.env',
      env: { NODE_ENV: 'production', PORT: 3005 },
      max_memory_restart: '200M',
      time: true,
    },
  ],
};

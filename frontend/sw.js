/* Service worker KAmart.
 * Naikkan VERSION setiap rilis supaya HP pembeli mengambil file terbaru. */
const VERSION = 'kamart-v26';
const SHELL = [
  '/',
  '/styles.css',
  '/app.js',
  '/config.js',
  '/logo.png',
  '/favicon.png',
  '/qris-kamart.jpg',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function putCache(name, req, res) {
  if (res && res.ok) {
    const copy = res.clone();
    caches.open(name).then((c) => c.put(req, copy));
  }
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // API: selalu ke server. Katalog disimpan supaya tetap bisa dilihat saat offline.
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
    if (url.pathname === '/api/products') {
      event.respondWith(fetch(req).then((res) => putCache(VERSION + '-data', req, res)).catch(() => caches.match(req)));
    }
    return;
  }

  // Halaman: coba internet dulu, kalau offline pakai salinan tersimpan.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => putCache(VERSION, '/', res)).catch(() => caches.match('/')),
    );
    return;
  }

  // File aplikasi: tampilkan dari cache, sambil memperbarui di belakang layar.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const net = fetch(req).then((res) => putCache(VERSION, req, res)).catch(() => hit);
        return hit || net;
      }),
    );
    return;
  }

  // Font Google: simpan setelah pertama kali diunduh.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => putCache(VERSION + '-fonts', req, res))),
    );
  }
});

// Web Push dari server: tampil walau aplikasi ditutup.
self.addEventListener('push', (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { title: 'KAmart', body: event.data ? event.data.text() : '' }; }
  // Beri tahu aplikasi yang sedang terbuka supaya memuat ulang data (pengganti refresh berkala).
  self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((list) => list.forEach((c) => c.postMessage({ type: 'kamart-push' })));
  event.waitUntil(self.registration.showNotification(d.title || 'KAmart', {
    body: d.body || '',
    icon: '/icons/icon-192.png',
    badge: '/favicon.png',
    tag: d.tag || undefined,
    renotify: !!d.tag,
    vibrate: [120, 60, 120],
    data: { url: d.url || '/#pesanan' },
  }));
});

// Notifikasi pesanan masuk (admin): ketuk untuk membuka halaman Pesanan.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/#pesanan';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) {
          if ('navigate' in c) c.navigate(target).catch(() => {});
          return c.focus();
        }
      }
      return self.clients.openWindow(target);
    }),
  );
});

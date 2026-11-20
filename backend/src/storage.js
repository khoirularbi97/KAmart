/**
 * Penyimpanan foto produk.
 * - Utama: Neon Object Storage (kompatibel S3), jika variabel AWS_* dan NEON_BUCKET diisi.
 * - Cadangan: tabel product_images di PostgreSQL, disajikan lewat /api/images/:kode.
 */
const crypto = require('crypto');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const ENDPOINT = (process.env.AWS_ENDPOINT_URL_S3 || '').replace(/\/$/, '');
const BUCKET = process.env.NEON_BUCKET || '';
const PUBLIC_BASE = (process.env.NEON_BUCKET_PUBLIC_URL || (ENDPOINT && BUCKET ? ENDPOINT + '/' + BUCKET : '')).replace(/\/$/, '');
const ENABLED = !!(ENDPOINT && BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

const s3 = ENABLED
  ? new S3Client({
    endpoint: ENDPOINT,
    region: process.env.AWS_REGION || 'ap-southeast-1',
    forcePathStyle: true,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })
  : null;

const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_BYTES = 1.5 * 1024 * 1024;

class ImageError extends Error {
  constructor(message) { super(message); this.status = 400; }
}

/** Ubah data URL dari browser menjadi { mime, buf }. */
function parseDataUrl(dataUrl) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(String(dataUrl || ''));
  if (!m) throw new ImageError('Format foto tidak didukung. Gunakan JPG, PNG, atau WEBP.');
  const buf = Buffer.from(m[2].replace(/\s/g, ''), 'base64');
  if (!buf.length) throw new ImageError('Foto kosong.');
  if (buf.length > MAX_BYTES) throw new ImageError('Foto terlalu besar (maks 1,5 MB setelah diperkecil).');
  return { mime: m[1], buf };
}

function keyFromUrl(url) {
  if (!PUBLIC_BASE || !url || !url.startsWith(PUBLIC_BASE + '/')) return null;
  return url.slice(PUBLIC_BASE.length + 1);
}

/** Simpan foto, kembalikan URL yang dipakai di kolom products.img. */
async function saveImage(db, kode, dataUrl, oldUrl) {
  const { mime, buf } = parseDataUrl(dataUrl);
  if (ENABLED) {
    const key = 'products/' + kode + '-' + Date.now().toString(36) + '-' + crypto.randomBytes(3).toString('hex') + '.' + TYPES[mime];
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET, Key: key, Body: buf, ContentType: mime,
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    await removeImage(db, kode, oldUrl);
    return PUBLIC_BASE + '/' + key;
  }
  await db.query(
    `INSERT INTO product_images (kode, mime, data, updated_at) VALUES ($1,$2,$3, now())
     ON CONFLICT (kode) DO UPDATE SET mime = $2, data = $3, updated_at = now()`,
    [kode, mime, buf],
  );
  return '/api/images/' + encodeURIComponent(kode) + '?v=' + Date.now().toString(36);
}

/** Hapus foto lama (best effort, tidak menggagalkan penyimpanan produk). */
async function removeImage(db, kode, oldUrl) {
  const key = keyFromUrl(oldUrl);
  if (key && ENABLED) {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key })).catch((e) => console.error('Hapus foto lama gagal:', e.message));
  }
  if (oldUrl && oldUrl.startsWith('/api/images/')) {
    await db.query('DELETE FROM product_images WHERE kode = $1', [kode]).catch(() => {});
  }
}

module.exports = { ENABLED, BUCKET, saveImage, removeImage, ImageError };

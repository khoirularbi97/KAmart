/* Midtrans Core API: QRIS dinamis per pesanan + verifikasi notifikasi (webhook). */
const crypto = require('crypto');

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const ENABLED = !!SERVER_KEY;
// Key sandbox diawali "SB-". Bisa dipaksa lewat MIDTRANS_IS_PRODUCTION=true/false.
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION
  ? process.env.MIDTRANS_IS_PRODUCTION === 'true'
  : ENABLED && !SERVER_KEY.startsWith('SB-');
const BASE = process.env.MIDTRANS_API_URL
  || (IS_PRODUCTION ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com');
const NOTIFY_URL = process.env.MIDTRANS_NOTIFY_URL || '';
const EXPIRY_MIN = Math.max(5, Math.min(1440, Number(process.env.MIDTRANS_QRIS_EXPIRY_MIN || 30)));

class MidtransError extends Error {}

async function call(method, path, body) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + Buffer.from(SERVER_KEY + ':').toString('base64'),
  };
  if (NOTIFY_URL && method === 'POST') headers['X-Override-Notification'] = NOTIFY_URL;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined, signal: ctrl.signal });
    const j = await r.json().catch(() => ({}));
    return j;
  } finally {
    clearTimeout(t);
  }
}

/** Buat transaksi QRIS. Mengembalikan { qr, expiresAt, raw }. */
async function chargeQris(mtOrderId, amount) {
  const j = await call('POST', '/v2/charge', {
    payment_type: 'qris',
    transaction_details: { order_id: mtOrderId, gross_amount: amount },
    qris: { acquirer: 'gopay' },
    custom_expiry: { expiry_duration: EXPIRY_MIN, unit: 'minute' },
  });
  if (String(j.status_code) !== '201' || !j.qr_string) {
    throw new MidtransError((j.status_message || 'Midtrans menolak transaksi') + ' (' + (j.status_code || '?') + ')');
  }
  const exp = j.expiry_time ? new Date(j.expiry_time.replace(' ', 'T') + '+07:00') : new Date(Date.now() + EXPIRY_MIN * 60000);
  return { qr: j.qr_string, expiresAt: exp, raw: j };
}

async function getStatus(mtOrderId) {
  return call('GET', '/v2/' + encodeURIComponent(mtOrderId) + '/status');
}

/** signature_key = SHA512(order_id + status_code + gross_amount + server_key) */
function validSignature(n) {
  if (!n || typeof n.signature_key !== 'string') return false;
  const expect = crypto.createHash('sha512')
    .update(String(n.order_id) + String(n.status_code) + String(n.gross_amount) + SERVER_KEY)
    .digest('hex');
  const a = Buffer.from(expect);
  const b = Buffer.from(n.signature_key);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const isPaidStatus = (s) => s && (s.transaction_status === 'settlement'
  || (s.transaction_status === 'capture' && (!s.fraud_status || s.fraud_status === 'accept')));

module.exports = {
  ENABLED, IS_PRODUCTION, EXPIRY_MIN, MidtransError, chargeQris, getStatus, validSignature, isPaidStatus,
  mode: ENABLED ? (IS_PRODUCTION ? 'midtrans-production' : 'midtrans-sandbox') : 'dana-statis',
};

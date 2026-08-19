
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

/* =======================
   CONSTANTS
======================= */
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const HMAC_LENGTH = 32;
const HASH_ALGO = 'sha256';

let encKey, macKey;

/* =======================
   KEY DERIVATION
======================= */
function deriveKeys(secret) {
  const secretBuf = Buffer.from(secret, 'utf8');

  encKey = crypto
    .createHash(HASH_ALGO)
    .update(Buffer.concat([secretBuf, Buffer.from('enc')]))
    .digest();

  macKey = crypto
    .createHash(HASH_ALGO)
    .update(Buffer.concat([secretBuf, Buffer.from('mac')]))
    .digest();
}

deriveKeys(process.env.SHARED_SECRET);

/* =======================
   DECRYPT MIDDLEWARE
======================= */
export function decryptPayload(req, res, next) {
  try {
    let payloadBase64 = req.body?.data;

    if (typeof payloadBase64 !== 'string') {
      throw new Error('Request body "data" must be a base64 string');
    }

    payloadBase64 = payloadBase64.trim().replace(/ /g, '+');
    const payload = Buffer.from(payloadBase64, 'base64');

    const iv = payload.subarray(0, IV_LENGTH);
    const hmac = payload.subarray(payload.length - HMAC_LENGTH);
    const cipherText = payload.subarray(IV_LENGTH, payload.length - HMAC_LENGTH);

    /* ---- Verify HMAC ---- */
    const hmacCheck = crypto
      .createHmac(HASH_ALGO, macKey)
      .update(Buffer.concat([iv, cipherText]))
      .digest();

    if (!crypto.timingSafeEqual(hmacCheck, hmac)) {
      throw new Error('HMAC verification failed');
    }

    /* ---- Decrypt ---- */
    const decipher = crypto.createDecipheriv(ALGORITHM, encKey, iv);
    const decrypted = Buffer.concat([
      decipher.update(cipherText),
      decipher.final(),
    ]);

    /* ---- Parse JSON safely ---- */
    const cleanJson = decrypted
      .toString('utf8')
      .replace(/\0/g, '')
      .trim();

    req.body = JSON.parse(cleanJson);
    next();
  } catch (err) {
    next(err); // let Express error middleware handle it
  }
}

/* =======================
   ENCRYPT FUNCTION
======================= */
export function encryptPayload(jsonString) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, encKey, iv);

  const encrypted = Buffer.concat([
    cipher.update(jsonString, 'utf8'),
    cipher.final(),
  ]);

  const hmac = crypto
    .createHmac(HASH_ALGO, macKey)
    .update(Buffer.concat([iv, encrypted]))
    .digest();

  return Buffer.concat([iv, encrypted, hmac]).toString('base64');
}

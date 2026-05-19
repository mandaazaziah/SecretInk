import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derive a 256-bit key from a user-provided encryption key using SHA-256
 */
function deriveKey(encryptionKey: string): Buffer {
  return crypto.createHash('sha256').update(encryptionKey).digest();
}

/**
 * Encrypt plaintext using AES-256-CBC
 * Returns base64 encoded string: IV + encrypted data
 */
export function encrypt(plaintext: string, encryptionKey: string): string {
  if (!plaintext || !encryptionKey) {
    throw new Error('Plaintext and encryption key are required');
  }

  const key = deriveKey(encryptionKey);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Prepend IV to encrypted data for decryption
  const ivAndEncrypted = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]);
  return ivAndEncrypted.toString('base64');
}

/**
 * Decrypt AES-256-CBC encrypted data
 * Expects base64 encoded string: IV + encrypted data
 */
export function decrypt(encryptedData: string, encryptionKey: string): string {
  if (!encryptedData || !encryptionKey) {
    throw new Error('Encrypted data and encryption key are required');
  }

  const key = deriveKey(encryptionKey);
  const buffer = Buffer.from(encryptedData, 'base64');

  // Extract IV from the beginning
  const iv = buffer.subarray(0, IV_LENGTH);
  const encrypted = buffer.subarray(IV_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(encrypted, undefined, 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Validate encryption key strength
 */
export function validateEncryptionKey(key: string): { valid: boolean; message: string } {
  if (!key || key.trim().length === 0) {
    return { valid: false, message: 'Encryption key is required' };
  }
  if (key.length < 6) {
    return { valid: false, message: 'Encryption key must be at least 6 characters' };
  }
  return { valid: true, message: 'Valid encryption key' };
}

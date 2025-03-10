/**
 * Cryptography utility functions for the ERP system
 */

import * as crypto from 'crypto';

/**
 * Encrypt sensitive data using AES-256-CBC
 * @param data Data to encrypt
 * @param key Encryption key (32 bytes)
 * @returns Encrypted data as a hexadecimal string
 */
export function encrypt(data: string, key: string): string {
  if (!data) return '';
  
  // Create an initialization vector
  const iv = crypto.randomBytes(16);
  
  // Create a key buffer from the provided key
  const keyBuffer = crypto.createHash('sha256').update(key).digest();
  
  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
  
  // Encrypt the data
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return the IV and encrypted data as a single string
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt sensitive data using AES-256-CBC
 * @param encryptedData Encrypted data (from the encrypt function)
 * @param key Encryption key used for encryption
 * @returns Decrypted data as a string
 */
export function decrypt(encryptedData: string, key: string): string {
  if (!encryptedData) return '';
  
  // Split the encrypted data into IV and encrypted components
  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  // Create a key buffer from the provided key
  const keyBuffer = crypto.createHash('sha256').update(key).digest();
  
  // Create decipher
  const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
  
  // Decrypt the data
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generate a hash of a password with a random salt
 * @param password Password to hash
 * @returns Object containing the hash and salt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  if (!password) {
    throw new Error('Password cannot be empty');
  }
  
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Hash the password with the salt
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  
  return { hash, salt };
}

/**
 * Verify a password against a stored hash and salt
 * @param password Password to verify
 * @param hash Stored hash
 * @param salt Stored salt
 * @returns true if the password matches, false otherwise
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false;
  
  // Hash the provided password with the stored salt
  const calculatedHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  
  // Compare the calculated hash with the stored hash
  return calculatedHash === hash;
}

/**
 * Generate a random secure token for password reset, etc.
 * @param length Length of the token (default 32)
 * @returns Secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
} 
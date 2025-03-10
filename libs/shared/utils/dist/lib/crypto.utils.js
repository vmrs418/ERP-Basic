"use strict";
/**
 * Cryptography utility functions for the ERP system
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.generateSecureToken = generateSecureToken;
const crypto = __importStar(require("crypto"));
/**
 * Encrypt sensitive data using AES-256-CBC
 * @param data Data to encrypt
 * @param key Encryption key (32 bytes)
 * @returns Encrypted data as a hexadecimal string
 */
function encrypt(data, key) {
    if (!data)
        return '';
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
function decrypt(encryptedData, key) {
    if (!encryptedData)
        return '';
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
function hashPassword(password) {
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
function verifyPassword(password, hash, salt) {
    if (!password || !hash || !salt)
        return false;
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
function generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

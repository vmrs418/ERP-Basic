/**
 * Cryptography utility functions for the ERP system
 */
/**
 * Encrypt sensitive data using AES-256-CBC
 * @param data Data to encrypt
 * @param key Encryption key (32 bytes)
 * @returns Encrypted data as a hexadecimal string
 */
export declare function encrypt(data: string, key: string): string;
/**
 * Decrypt sensitive data using AES-256-CBC
 * @param encryptedData Encrypted data (from the encrypt function)
 * @param key Encryption key used for encryption
 * @returns Decrypted data as a string
 */
export declare function decrypt(encryptedData: string, key: string): string;
/**
 * Generate a hash of a password with a random salt
 * @param password Password to hash
 * @returns Object containing the hash and salt
 */
export declare function hashPassword(password: string): {
    hash: string;
    salt: string;
};
/**
 * Verify a password against a stored hash and salt
 * @param password Password to verify
 * @param hash Stored hash
 * @param salt Stored salt
 * @returns true if the password matches, false otherwise
 */
export declare function verifyPassword(password: string, hash: string, salt: string): boolean;
/**
 * Generate a random secure token for password reset, etc.
 * @param length Length of the token (default 32)
 * @returns Secure random token
 */
export declare function generateSecureToken(length?: number): string;

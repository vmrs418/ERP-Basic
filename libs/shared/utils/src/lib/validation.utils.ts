/**
 * Validation utility functions for the ERP system
 */

/**
 * Validate an email address
 * @param email Email address to validate
 * @returns true if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate a phone number (10 digits, optionally prefixed with +91 for India)
 * @param phone Phone number to validate
 * @returns true if the phone number is valid, false otherwise
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  
  // Accept formats: 1234567890, +911234567890, or 091234567890
  const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate an Aadhaar number (12 digits)
 * @param aadhaar Aadhaar number to validate
 * @returns true if the Aadhaar number is valid, false otherwise
 */
export function isValidAadhaar(aadhaar: string): boolean {
  if (!aadhaar) return false;
  
  // Remove spaces if any
  const aadhaarClean = aadhaar.replace(/\s/g, '');
  
  // Check if it's 12 digits
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaarClean);
}

/**
 * Validate a PAN (Permanent Account Number) for India
 * @param pan PAN to validate
 * @returns true if the PAN is valid, false otherwise
 */
export function isValidPAN(pan: string): boolean {
  if (!pan) return false;
  
  // Format: ABCDE1234F (5 letters, 4 numbers, 1 letter)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
}

/**
 * Validate an Indian passport number
 * @param passport Passport number to validate
 * @returns true if the passport number is valid, false otherwise
 */
export function isValidPassport(passport: string): boolean {
  if (!passport) return false;
  
  // Format: A1234567 (1 letter followed by 7 digits)
  const passportRegex = /^[A-Z][0-9]{7}$/;
  return passportRegex.test(passport);
}

/**
 * Validate an IFSC code (Indian Financial System Code)
 * @param ifsc IFSC code to validate
 * @returns true if the IFSC code is valid, false otherwise
 */
export function isValidIFSC(ifsc: string): boolean {
  if (!ifsc) return false;
  
  // Format: ABCD0123456 (First 4 characters represent the bank, 5th character is 0, and the last 6 characters represent the branch)
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
}

/**
 * Check if a string has at least one uppercase letter, one lowercase letter, one number, and one special character
 * @param str String to check
 * @returns true if the string meets the complexity requirements, false otherwise
 */
export function isStrongPassword(str: string): boolean {
  if (!str || str.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(str);
  const hasLowerCase = /[a-z]/.test(str);
  const hasNumber = /\d/.test(str);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
  
  return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
} 
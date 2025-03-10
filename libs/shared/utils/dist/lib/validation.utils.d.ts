/**
 * Validation utility functions for the ERP system
 */
/**
 * Validate an email address
 * @param email Email address to validate
 * @returns true if the email is valid, false otherwise
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validate a phone number (10 digits, optionally prefixed with +91 for India)
 * @param phone Phone number to validate
 * @returns true if the phone number is valid, false otherwise
 */
export declare function isValidPhone(phone: string): boolean;
/**
 * Validate an Aadhaar number (12 digits)
 * @param aadhaar Aadhaar number to validate
 * @returns true if the Aadhaar number is valid, false otherwise
 */
export declare function isValidAadhaar(aadhaar: string): boolean;
/**
 * Validate a PAN (Permanent Account Number) for India
 * @param pan PAN to validate
 * @returns true if the PAN is valid, false otherwise
 */
export declare function isValidPAN(pan: string): boolean;
/**
 * Validate an Indian passport number
 * @param passport Passport number to validate
 * @returns true if the passport number is valid, false otherwise
 */
export declare function isValidPassport(passport: string): boolean;
/**
 * Validate an IFSC code (Indian Financial System Code)
 * @param ifsc IFSC code to validate
 * @returns true if the IFSC code is valid, false otherwise
 */
export declare function isValidIFSC(ifsc: string): boolean;
/**
 * Check if a string has at least one uppercase letter, one lowercase letter, one number, and one special character
 * @param str String to check
 * @returns true if the string meets the complexity requirements, false otherwise
 */
export declare function isStrongPassword(str: string): boolean;

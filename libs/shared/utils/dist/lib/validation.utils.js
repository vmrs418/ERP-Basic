"use strict";
/**
 * Validation utility functions for the ERP system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isValidPhone = isValidPhone;
exports.isValidAadhaar = isValidAadhaar;
exports.isValidPAN = isValidPAN;
exports.isValidPassport = isValidPassport;
exports.isValidIFSC = isValidIFSC;
exports.isStrongPassword = isStrongPassword;
/**
 * Validate an email address
 * @param email Email address to validate
 * @returns true if the email is valid, false otherwise
 */
function isValidEmail(email) {
    if (!email)
        return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validate a phone number (10 digits, optionally prefixed with +91 for India)
 * @param phone Phone number to validate
 * @returns true if the phone number is valid, false otherwise
 */
function isValidPhone(phone) {
    if (!phone)
        return false;
    // Accept formats: 1234567890, +911234567890, or 091234567890
    const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}
/**
 * Validate an Aadhaar number (12 digits)
 * @param aadhaar Aadhaar number to validate
 * @returns true if the Aadhaar number is valid, false otherwise
 */
function isValidAadhaar(aadhaar) {
    if (!aadhaar)
        return false;
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
function isValidPAN(pan) {
    if (!pan)
        return false;
    // Format: ABCDE1234F (5 letters, 4 numbers, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
}
/**
 * Validate an Indian passport number
 * @param passport Passport number to validate
 * @returns true if the passport number is valid, false otherwise
 */
function isValidPassport(passport) {
    if (!passport)
        return false;
    // Format: A1234567 (1 letter followed by 7 digits)
    const passportRegex = /^[A-Z][0-9]{7}$/;
    return passportRegex.test(passport);
}
/**
 * Validate an IFSC code (Indian Financial System Code)
 * @param ifsc IFSC code to validate
 * @returns true if the IFSC code is valid, false otherwise
 */
function isValidIFSC(ifsc) {
    if (!ifsc)
        return false;
    // Format: ABCD0123456 (First 4 characters represent the bank, 5th character is 0, and the last 6 characters represent the branch)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
}
/**
 * Check if a string has at least one uppercase letter, one lowercase letter, one number, and one special character
 * @param str String to check
 * @returns true if the string meets the complexity requirements, false otherwise
 */
function isStrongPassword(str) {
    if (!str || str.length < 8)
        return false;
    const hasUpperCase = /[A-Z]/.test(str);
    const hasLowerCase = /[a-z]/.test(str);
    const hasNumber = /\d/.test(str);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
}

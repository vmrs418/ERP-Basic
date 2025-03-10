"use strict";
/**
 * String utility functions for the ERP system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = generateRandomString;
exports.generateEmployeeCode = generateEmployeeCode;
exports.maskString = maskString;
exports.camelCaseToTitleCase = camelCaseToTitleCase;
exports.truncateString = truncateString;
/**
 * Generate a random alphanumeric string of specified length
 * @param length The length of the string to generate
 * @returns Random alphanumeric string
 */
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
/**
 * Generate an employee code based on name and department
 * @param firstName First name of the employee
 * @param lastName Last name of the employee
 * @param departmentCode Department code (e.g., IT, HR, FIN)
 * @param joinDate Date of joining
 * @returns Employee code in the format: DEP-FN-LN-YYYY (e.g., IT-JO-DO-2023)
 */
function generateEmployeeCode(firstName, lastName, departmentCode, joinDate) {
    if (!firstName || !lastName || !departmentCode || !joinDate) {
        return '';
    }
    const fn = firstName.substring(0, 2).toUpperCase();
    const ln = lastName.substring(0, 2).toUpperCase();
    const dept = departmentCode.toUpperCase();
    const year = joinDate.getFullYear().toString();
    return `${dept}-${fn}${ln}-${year}`;
}
/**
 * Mask a string by replacing characters with a mask character
 * @param value The string to mask
 * @param showFirstChars Number of characters to show at the beginning
 * @param showLastChars Number of characters to show at the end
 * @param maskChar Character to use for masking
 * @returns Masked string
 */
function maskString(value, showFirstChars = 4, showLastChars = 4, maskChar = '*') {
    if (!value)
        return '';
    if (value.length <= showFirstChars + showLastChars) {
        return value;
    }
    const firstPart = value.substring(0, showFirstChars);
    const lastPart = value.substring(value.length - showLastChars);
    const maskLength = value.length - showFirstChars - showLastChars;
    const mask = maskChar.repeat(maskLength);
    return `${firstPart}${mask}${lastPart}`;
}
/**
 * Convert a CamelCase string to Title Case with spaces
 * @param camelCaseString CamelCase string to convert
 * @returns Title Case string with spaces
 */
function camelCaseToTitleCase(camelCaseString) {
    if (!camelCaseString)
        return '';
    // Add a space before each capital letter and then convert to title case
    const withSpaces = camelCaseString.replace(/([A-Z])/g, ' $1').trim();
    // Capitalize the first letter
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}
/**
 * Truncate a string to a specified length and add ellipsis if truncated
 * @param str String to truncate
 * @param maxLength Maximum length of the string
 * @returns Truncated string with ellipsis if needed
 */
function truncateString(str, maxLength) {
    if (!str)
        return '';
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength) + '...';
}

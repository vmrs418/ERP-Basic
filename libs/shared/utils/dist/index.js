"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmployeeCode = generateEmployeeCode;
exports.formatDate = formatDate;
exports.addDays = addDays;
exports.calculateBusinessDaysBetweenDates = calculateBusinessDaysBetweenDates;
exports.sanitizeString = sanitizeString;
exports.capitalize = capitalize;
exports.roundToDecimal = roundToDecimal;
// Export all utilities
__exportStar(require("./lib/date.utils"), exports);
__exportStar(require("./lib/string.utils"), exports);
__exportStar(require("./lib/validation.utils"), exports);
__exportStar(require("./lib/crypto.utils"), exports);
__exportStar(require("./lib/attendance.utils"), exports);
// Employee utils
function generateEmployeeCode(firstName, lastName, joiningDate) {
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    const year = joiningDate.getFullYear().toString().slice(-2);
    const month = (joiningDate.getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${firstInitial}${lastInitial}${year}${month}${randomNum}`;
}
// Date utils
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function calculateBusinessDaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let days = 0;
    // Normalize dates to remove time components
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const current = new Date(start);
    // Loop through days
    while (current <= end) {
        const dayOfWeek = current.getDay();
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            days++;
        }
        // Move to next day
        current.setDate(current.getDate() + 1);
    }
    return days;
}
// String utils
function sanitizeString(value) {
    return value.trim().replace(/[^\w\s.-]/g, '');
}
function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
// Number utils
function roundToDecimal(value, decimals = 2) {
    return Number(Math.round(parseFloat(value + 'e' + decimals)) + 'e-' + decimals);
}

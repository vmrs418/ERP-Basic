"use strict";
/**
 * Date utility functions for the ERP system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDaysBetweenDates = getDaysBetweenDates;
exports.isWeekend = isWeekend;
exports.formatDate = formatDate;
exports.formatTime = formatTime;
exports.parseTimeString = parseTimeString;
exports.calculateWorkingHours = calculateWorkingHours;
/**
 * Calculate the difference in days between two dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns The number of days between the two dates (inclusive)
 */
function getDaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const differenceInTime = end.getTime() - start.getTime();
    return Math.round(differenceInTime / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
}
/**
 * Check if a date is a weekend day
 * @param date The date to check
 * @param weekendDays Array of days that are considered weekend (0 = Sunday, 6 = Saturday)
 * @returns true if the date is a weekend, false otherwise
 */
function isWeekend(date, weekendDays = [0, 6]) {
    const day = date.getDay();
    return weekendDays.includes(day);
}
/**
 * Format a date to a string in the format DD/MM/YYYY
 * @param date The date to format
 * @returns The formatted date string
 */
function formatDate(date) {
    if (!date)
        return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}
/**
 * Format time to a string in the format HH:MM AM/PM
 * @param date The date containing the time to format
 * @returns The formatted time string
 */
function formatTime(date) {
    if (!date)
        return '';
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}
/**
 * Parse a string in the format HH:MM:SS to a Date object
 * @param timeString The time string to parse
 * @returns A Date object representing the time or undefined if the string is invalid
 */
function parseTimeString(timeString) {
    if (!timeString)
        return undefined;
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0, 0);
    return date;
}
/**
 * Calculate working hours between two timestamps
 * @param checkInTime Check-in timestamp
 * @param checkOutTime Check-out timestamp
 * @returns The number of working hours as a decimal
 */
function calculateWorkingHours(checkInTime, checkOutTime) {
    if (!checkInTime || !checkOutTime)
        return 0;
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const differenceInTime = checkOut.getTime() - checkIn.getTime();
    return parseFloat((differenceInTime / (1000 * 3600)).toFixed(2));
}

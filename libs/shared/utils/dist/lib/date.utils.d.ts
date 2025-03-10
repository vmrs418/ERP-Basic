/**
 * Date utility functions for the ERP system
 */
/**
 * Calculate the difference in days between two dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns The number of days between the two dates (inclusive)
 */
export declare function getDaysBetweenDates(startDate: Date, endDate: Date): number;
/**
 * Check if a date is a weekend day
 * @param date The date to check
 * @param weekendDays Array of days that are considered weekend (0 = Sunday, 6 = Saturday)
 * @returns true if the date is a weekend, false otherwise
 */
export declare function isWeekend(date: Date, weekendDays?: number[]): boolean;
/**
 * Format a date to a string in the format DD/MM/YYYY
 * @param date The date to format
 * @returns The formatted date string
 */
export declare function formatDate(date: Date): string;
/**
 * Format time to a string in the format HH:MM AM/PM
 * @param date The date containing the time to format
 * @returns The formatted time string
 */
export declare function formatTime(date: Date): string;
/**
 * Parse a string in the format HH:MM:SS to a Date object
 * @param timeString The time string to parse
 * @returns A Date object representing the time or undefined if the string is invalid
 */
export declare function parseTimeString(timeString: string): Date | undefined;
/**
 * Calculate working hours between two timestamps
 * @param checkInTime Check-in timestamp
 * @param checkOutTime Check-out timestamp
 * @returns The number of working hours as a decimal
 */
export declare function calculateWorkingHours(checkInTime: Date, checkOutTime: Date): number;

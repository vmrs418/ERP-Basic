import { format, parseISO } from 'date-fns';

/**
 * Formats a date string to a human-readable format
 * @param dateString ISO date string
 * @param formatStr Optional format string (default: 'dd MMM yyyy')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, formatStr: string = 'dd MMM yyyy'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Formats a date string to include time
 * @param dateString ISO date string
 * @param formatStr Optional format string (default: 'dd MMM yyyy, HH:mm')
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string, formatStr: string = 'dd MMM yyyy, HH:mm'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return dateString;
  }
};

/**
 * Gets the current date as an ISO string
 * @returns ISO date string for the current date
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Checks if a date is in the past
 * @param dateString ISO date string
 * @returns Boolean indicating if the date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  const date = parseISO(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Checks if a date is in the future
 * @param dateString ISO date string
 * @returns Boolean indicating if the date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  const date = parseISO(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

/**
 * Calculates the difference in days between two dates
 * @param startDate Start date (ISO string)
 * @param endDate End date (ISO string)
 * @returns Number of days between the dates (inclusive)
 */
export const getDaysBetweenDates = (startDate: string, endDate: string): number => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  // Reset time to compare full days
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Add 1 to include both start and end days
  return diffDays + 1;
}; 
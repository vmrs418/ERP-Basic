// Export all utilities
export * from './lib/date.utils';
export * from './lib/string.utils';
export * from './lib/validation.utils';
export * from './lib/crypto.utils';
export * from './lib/attendance.utils';

// Employee utils
export function generateEmployeeCode(firstName: string, lastName: string, joiningDate: Date): string {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const year = joiningDate.getFullYear().toString().slice(-2);
  const month = (joiningDate.getMonth() + 1).toString().padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${firstInitial}${lastInitial}${year}${month}${randomNum}`;
}

// Date utils
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function calculateBusinessDaysBetweenDates(startDate: Date, endDate: Date): number {
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
export function sanitizeString(value: string): string {
  return value.trim().replace(/[^\w\s.-]/g, '');
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// Number utils
export function roundToDecimal(value: number, decimals: number = 2): number {
  return Number(Math.round(parseFloat(value + 'e' + decimals)) + 'e-' + decimals);
} 
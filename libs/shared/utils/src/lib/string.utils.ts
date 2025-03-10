/**
 * String utility functions for the ERP system
 */

/**
 * Generate a random alphanumeric string of specified length
 * @param length The length of the string to generate
 * @returns Random alphanumeric string
 */
export function generateRandomString(length: number): string {
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
export function generateEmployeeCode(
  firstName: string,
  lastName: string,
  departmentCode: string,
  joinDate: Date
): string {
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
export function maskString(
  value: string,
  showFirstChars: number = 4,
  showLastChars: number = 4,
  maskChar: string = '*'
): string {
  if (!value) return '';
  
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
export function camelCaseToTitleCase(camelCaseString: string): string {
  if (!camelCaseString) return '';
  
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
export function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.substring(0, maxLength) + '...';
} 
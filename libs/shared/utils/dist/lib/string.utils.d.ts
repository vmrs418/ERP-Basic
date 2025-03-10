/**
 * String utility functions for the ERP system
 */
/**
 * Generate a random alphanumeric string of specified length
 * @param length The length of the string to generate
 * @returns Random alphanumeric string
 */
export declare function generateRandomString(length: number): string;
/**
 * Generate an employee code based on name and department
 * @param firstName First name of the employee
 * @param lastName Last name of the employee
 * @param departmentCode Department code (e.g., IT, HR, FIN)
 * @param joinDate Date of joining
 * @returns Employee code in the format: DEP-FN-LN-YYYY (e.g., IT-JO-DO-2023)
 */
export declare function generateEmployeeCode(firstName: string, lastName: string, departmentCode: string, joinDate: Date): string;
/**
 * Mask a string by replacing characters with a mask character
 * @param value The string to mask
 * @param showFirstChars Number of characters to show at the beginning
 * @param showLastChars Number of characters to show at the end
 * @param maskChar Character to use for masking
 * @returns Masked string
 */
export declare function maskString(value: string, showFirstChars?: number, showLastChars?: number, maskChar?: string): string;
/**
 * Convert a CamelCase string to Title Case with spaces
 * @param camelCaseString CamelCase string to convert
 * @returns Title Case string with spaces
 */
export declare function camelCaseToTitleCase(camelCaseString: string): string;
/**
 * Truncate a string to a specified length and add ellipsis if truncated
 * @param str String to truncate
 * @param maxLength Maximum length of the string
 * @returns Truncated string with ellipsis if needed
 */
export declare function truncateString(str: string, maxLength: number): string;

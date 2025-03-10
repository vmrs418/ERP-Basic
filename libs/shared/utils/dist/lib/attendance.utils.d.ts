/**
 * Calculate the number of working hours between two timestamps
 * @param checkInTime - The check-in timestamp
 * @param checkOutTime - The check-out timestamp
 * @returns The number of working hours rounded to 2 decimal places
 */
export declare function calculateAttendanceHours(checkInTime: Date, checkOutTime: Date): number;
/**
 * Calculate attendance statistics for a given period
 * @param attendanceRecords - Array of attendance records
 * @returns Attendance summary object
 */
export declare function calculateAttendanceSummary(attendanceRecords: Array<{
    date: Date;
    status: string;
    working_hours: number;
    overtime_hours: number;
}>, year: number, month: number): {
    total_working_days: number;
    present_days: number;
    absent_days: number;
    half_days: number;
    late_arrivals: number;
    early_departures: number;
    leave_days: number;
    weekends: number;
    holidays: number;
    total_working_hours: number;
    total_overtime_hours: number;
};
/**
 * Get the number of working days between two dates (excluding weekends)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of working days
 */
export declare function getWorkingDaysBetweenDates(startDate: Date, endDate: Date): number;

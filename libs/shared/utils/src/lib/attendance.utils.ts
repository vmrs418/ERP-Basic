/**
 * Calculate the number of working hours between two timestamps
 * @param checkInTime - The check-in timestamp
 * @param checkOutTime - The check-out timestamp
 * @returns The number of working hours rounded to 2 decimal places
 */
export function calculateAttendanceHours(checkInTime: Date, checkOutTime: Date): number {
  if (!checkInTime || !checkOutTime) {
    return 0;
  }

  // Convert both dates to milliseconds
  const checkInMs = checkInTime instanceof Date 
    ? checkInTime.getTime() 
    : new Date(checkInTime).getTime();
  
  const checkOutMs = checkOutTime instanceof Date 
    ? checkOutTime.getTime() 
    : new Date(checkOutTime).getTime();

  // Calculate difference in milliseconds
  const diffMs = checkOutMs - checkInMs;

  // If check-out time is before check-in time, return 0
  if (diffMs < 0) {
    return 0;
  }

  // Convert to hours (milliseconds / (1000 * 60 * 60))
  const hours = diffMs / (1000 * 60 * 60);

  // Round to 2 decimal places
  return Math.round(hours * 100) / 100;
}

/**
 * Calculate attendance statistics for a given period
 * @param attendanceRecords - Array of attendance records
 * @returns Attendance summary object
 */
export function calculateAttendanceSummary(
  attendanceRecords: Array<{
    date: Date;
    status: string;
    working_hours: number;
    overtime_hours: number;
  }>,
  year: number,
  month: number
): {
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
} {
  // Initialize summary object
  const summary = {
    total_working_days: 0,
    present_days: 0,
    absent_days: 0,
    half_days: 0,
    late_arrivals: 0,
    early_departures: 0,
    leave_days: 0,
    weekends: 0,
    holidays: 0,
    total_working_hours: 0,
    total_overtime_hours: 0
  };

  if (!attendanceRecords || attendanceRecords.length === 0) {
    return summary;
  }

  // Calculate total working days in the month
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Count weekends (Saturday and Sunday) in the month
  let weekendCount = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // 0 is Sunday, 6 is Saturday
      weekendCount++;
    }
  }

  summary.total_working_days = daysInMonth - weekendCount;

  // Process each attendance record
  attendanceRecords.forEach(record => {
    // Add working and overtime hours
    summary.total_working_hours += record.working_hours || 0;
    summary.total_overtime_hours += record.overtime_hours || 0;

    // Count by status
    switch(record.status) {
      case 'present':
        summary.present_days++;
        break;
      case 'absent':
        summary.absent_days++;
        break;
      case 'half_day':
        summary.half_days++;
        break;
      case 'late':
        summary.late_arrivals++;
        summary.present_days++; // Also count as present
        break;
      case 'early_departure':
        summary.early_departures++;
        summary.present_days++; // Also count as present
        break;
      case 'on_leave':
        summary.leave_days++;
        break;
      case 'weekend':
        summary.weekends++;
        break;
      case 'holiday':
        summary.holidays++;
        break;
    }
  });

  return summary;
}

/**
 * Get the number of working days between two dates (excluding weekends)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of working days
 */
export function getWorkingDaysBetweenDates(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset time portion to ensure full day count
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Ensure start date is before or equal to end date
  if (start > end) {
    return 0;
  }

  let count = 0;
  const current = new Date(start);

  // Loop through each day
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
} 
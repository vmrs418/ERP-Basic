import { apiClient } from './client';

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  working_hours: number | null;
  status: 'present' | 'absent' | 'half_day' | 'weekend' | 'holiday' | 'on_leave';
  source: 'biometric' | 'web' | 'mobile' | 'manual';
  location_check_in?: string;
  location_check_out?: string;
  ip_address_check_in?: string;
  ip_address_check_out?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  modified_by?: string;
  // Expand objects
  employee?: {
    id: string;
    first_name: string;
    last_name: string;
    employee_code: string;
  };
}

export interface AttendanceSummary {
  present_days: number;
  absent_days: number;
  leave_days: number;
  holiday_days: number;
  weekend_days: number;
  half_days: number;
  total_working_hours: number;
}

export interface CheckInRequest {
  employee_id?: string;
  location?: string;
  remarks?: string;
}

export interface CheckOutRequest {
  employee_id?: string;
  location?: string;
  remarks?: string;
}

export interface AttendanceCorrectionRequest {
  attendance_id: string;
  corrected_check_in?: string;
  corrected_check_out?: string;
  reason: string;
}

// Get attendance for an employee on a specific date
export const getAttendance = async (employeeId: string, date: string): Promise<AttendanceRecord | null> => {
  const response = await apiClient.get(`/attendance/${employeeId}/${date}`);
  return response.data;
};

// Get attendance records for an employee for a date range
export const getAttendanceRecords = async (
  employeeId: string,
  startDate: string,
  endDate: string
): Promise<AttendanceRecord[]> => {
  const params = { start_date: startDate, end_date: endDate };
  const response = await apiClient.get(`/attendance/employee/${employeeId}`, { params });
  return response.data;
};

// Get attendance records for all employees on a specific date
export const getDailyAttendance = async (date: string): Promise<AttendanceRecord[]> => {
  const response = await apiClient.get(`/attendance/daily/${date}`);
  return response.data;
};

// Get monthly attendance summary for an employee
export const getAttendanceSummary = async (
  employeeId: string,
  year: number,
  month: number
): Promise<AttendanceSummary> => {
  const response = await apiClient.get(`/attendance/summary/${employeeId}/${year}/${month}`);
  return response.data;
};

// Check in
export const checkIn = async (data: CheckInRequest): Promise<AttendanceRecord> => {
  const response = await apiClient.post('/attendance/check-in', data);
  return response.data;
};

// Check out
export const checkOut = async (data: CheckOutRequest): Promise<AttendanceRecord> => {
  const response = await apiClient.post('/attendance/check-out', data);
  return response.data;
};

// Submit attendance correction request
export const submitAttendanceCorrection = async (data: AttendanceCorrectionRequest): Promise<void> => {
  await apiClient.post('/attendance/correction', data);
};

// Mark employee as on leave (for automatic leave attendance marking)
export const markEmployeeOnLeave = async (
  employeeId: string,
  date: string,
  remarks?: string
): Promise<AttendanceRecord> => {
  const response = await apiClient.post('/attendance/mark-leave', {
    employee_id: employeeId,
    date,
    remarks,
  });
  return response.data;
};

// Get employees currently on leave
export const getEmployeesOnLeave = async (date?: string): Promise<any[]> => {
  const params = date ? { date } : {};
  const response = await apiClient.get('/attendance/on-leave', { params });
  return response.data;
};

// Generate attendance reports for a department or team
export const generateAttendanceReport = async (
  departmentId?: string,
  startDate?: string,
  endDate?: string
): Promise<any> => {
  const params = {
    department_id: departmentId,
    start_date: startDate,
    end_date: endDate,
  };
  const response = await apiClient.get('/attendance/report', { params });
  return response.data;
}; 
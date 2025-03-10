export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string; // YYYY-MM-DD format
  check_in_time?: string; // HH:MM:SS format
  check_out_time?: string; // HH:MM:SS format
  working_hours?: number;
  status: 'present' | 'absent' | 'half_day' | 'on_leave' | 'weekend' | 'holiday';
  source: 'manual' | 'system' | 'mobile';
  notes?: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceFilter {
  employee_id?: string;
  from_date?: string;
  to_date?: string;
  status?: string;
  source?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAttendanceResponse {
  items: AttendanceRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface AttendanceSummary {
  present_days: number;
  absent_days: number;
  half_days: number;
  leave_days: number;
  total_working_hours: number;
  attendance_percentage: number;
}

export interface CheckInRequest {
  employee_id: string;
  date: string;
  time: string;
  source: 'manual' | 'system' | 'mobile';
  notes?: string;
}

export interface CheckOutRequest {
  employee_id: string;
  date: string;
  time: string;
  source: 'manual' | 'system' | 'mobile';
  notes?: string;
}

export interface AttendanceUpdateRequest {
  status?: 'present' | 'absent' | 'half_day' | 'on_leave' | 'weekend' | 'holiday';
  check_in_time?: string;
  check_out_time?: string;
  working_hours?: number;
  notes?: string;
} 
export interface AttendanceRecord {
    id: string;
    employee_id: string;
    date: Date;
    check_in_time: Date;
    check_out_time?: Date;
    working_hours: number;
    status: 'present' | 'absent' | 'half_day' | 'weekend' | 'holiday' | 'on_leave';
    source: 'biometric' | 'web' | 'mobile' | 'manual';
    location_check_in?: string;
    location_check_out?: string;
    ip_address_check_in?: string;
    ip_address_check_out?: string;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
    modified_by?: string;
    employee?: any;
}
export interface AttendanceCorrection {
    id: string;
    attendance_id: string;
    employee_id: string;
    original_check_in?: Date;
    original_check_out?: Date;
    corrected_check_in?: Date;
    corrected_check_out?: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by?: string;
    reviewed_at?: Date;
    review_comments?: string;
    created_at: Date;
    updated_at: Date;
    attendance?: AttendanceRecord;
    employee?: any;
    reviewer?: any;
}
export interface Shift {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    grace_period_minutes: number;
    half_day_threshold_hours: number;
    is_night_shift: boolean;
    description?: string;
    created_at: Date;
    updated_at: Date;
}
export interface EmployeeShift {
    id: string;
    employee_id: string;
    shift_id: string;
    effective_from: Date;
    effective_to?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    employee?: any;
    shift?: Shift;
}
export interface Holiday {
    id: string;
    name: string;
    date: Date;
    description?: string;
    is_restricted: boolean;
    applies_to_departments?: string[];
    created_at: Date;
    updated_at: Date;
}
export interface WeekendPolicy {
    id: string;
    name: string;
    description: string;
    weekends: number[];
    created_at: Date;
    updated_at: Date;
}
export interface EmployeeWeekendPolicy {
    id: string;
    employee_id: string;
    weekend_policy_id: string;
    from_date: Date;
    to_date?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    employee?: any;
    weekend_policy?: WeekendPolicy;
}
export type CreateAttendanceRecordDto = Omit<AttendanceRecord, 'id' | 'created_at' | 'updated_at' | 'employee'>;
export type UpdateAttendanceRecordDto = Partial<CreateAttendanceRecordDto>;
export type CreateAttendanceCorrectionDto = Omit<AttendanceCorrection, 'id' | 'created_at' | 'updated_at' | 'status' | 'reviewed_by' | 'reviewed_at' | 'review_comments' | 'attendance' | 'employee' | 'reviewer'>;
export type UpdateAttendanceCorrectionDto = Partial<Omit<AttendanceCorrection, 'id' | 'created_at' | 'updated_at' | 'attendance' | 'employee' | 'reviewer'>>;
export type CreateShiftDto = Omit<Shift, 'id' | 'created_at' | 'updated_at'>;
export type UpdateShiftDto = Partial<CreateShiftDto>;
export type CreateEmployeeShiftDto = Omit<EmployeeShift, 'id' | 'created_at' | 'updated_at' | 'employee' | 'shift'>;
export type UpdateEmployeeShiftDto = Partial<CreateEmployeeShiftDto>;
export type CreateHolidayDto = Omit<Holiday, 'id' | 'created_at' | 'updated_at'>;
export type UpdateHolidayDto = Partial<CreateHolidayDto>;
export type CreateWeekendPolicyDto = Omit<WeekendPolicy, 'id' | 'created_at' | 'updated_at'>;
export type UpdateWeekendPolicyDto = Partial<CreateWeekendPolicyDto>;
export type CreateEmployeeWeekendPolicyDto = Omit<EmployeeWeekendPolicy, 'id' | 'created_at' | 'updated_at' | 'employee' | 'weekend_policy'>;
export type UpdateEmployeeWeekendPolicyDto = Partial<CreateEmployeeWeekendPolicyDto>;

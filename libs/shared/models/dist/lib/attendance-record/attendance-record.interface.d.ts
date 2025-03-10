export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    HALF_DAY = "half_day",
    WEEKEND = "weekend",
    HOLIDAY = "holiday",
    ON_LEAVE = "on_leave"
}
export declare enum AttendanceSource {
    BIOMETRIC = "biometric",
    WEB = "web",
    MOBILE = "mobile",
    MANUAL = "manual"
}
export interface IAttendanceRecord {
    id: string;
    employee_id: string;
    date: Date;
    check_in_time: Date;
    check_out_time?: Date | null;
    working_hours: number;
    status: AttendanceStatus;
    source: AttendanceSource;
    location_check_in?: string | null;
    location_check_out?: string | null;
    ip_address_check_in?: string | null;
    ip_address_check_out?: string | null;
    remarks?: string | null;
    modified_by?: string | null;
    created_at: Date;
    updated_at: Date;
}
export interface IAttendanceRecordWithEmployee extends IAttendanceRecord {
    employee: {
        id: string;
        employee_code: string;
        first_name: string;
        last_name: string;
        email: string;
        profile_picture_url?: string;
    };
}
export interface IAttendanceResponse {
    id: string;
    date: Date;
    check_in_time: Date;
    check_out_time?: Date | null;
    duration_hours: number;
    status: AttendanceStatus;
    location_check_in?: string | null;
    location_check_out?: string | null;
}
export interface IAttendanceRecordListResponse {
    items: IAttendanceRecordWithEmployee[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}
export interface IDailyAttendanceSummary {
    date: Date;
    total_employees: number;
    present: number;
    absent: number;
    half_day: number;
    on_leave: number;
    late_arrivals: number;
    early_departures: number;
}
export interface IMonthlyAttendanceSummary {
    employee_id: string;
    employee_name: string;
    employee_code: string;
    profile_picture_url?: string;
    present_days: number;
    absent_days: number;
    half_days: number;
    leave_days: number;
    late_arrivals: number;
    early_departures: number;
    total_working_hours: number;
    attendance_percentage: number;
}
export interface IAttendanceSummary {
    employee_id: string;
    year: number;
    month: number;
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
}

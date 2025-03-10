import { Employee } from '../../employees/entities/employee.entity';
import { User } from '../../users/entities/user.entity';
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
export declare class AttendanceRecord {
    id: string;
    employee_id: string;
    employee: Employee;
    date: Date;
    check_in_time: Date;
    check_out_time: Date | null;
    working_hours: number;
    status: AttendanceStatus;
    source: AttendanceSource;
    location_check_in: string | null;
    location_check_out: string | null;
    ip_address_check_in: string | null;
    ip_address_check_out: string | null;
    remarks: string | null;
    is_overtime: boolean;
    overtime_hours: number;
    is_modified: boolean;
    modified_by: string | null;
    modifier: User | null;
    modified_at: Date;
    modification_reason: string;
    created_at: Date;
    updated_at: Date;
}

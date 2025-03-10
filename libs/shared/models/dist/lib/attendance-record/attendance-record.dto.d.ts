import { AttendanceStatus, AttendanceSource } from './attendance-record.interface';
export declare class CreateAttendanceRecordDto {
    employee_id: string;
    date: Date;
    check_in_time: Date;
    check_out_time?: Date;
    status?: AttendanceStatus;
    source?: AttendanceSource;
    location_check_in?: string;
    location_check_out?: string;
    ip_address_check_in?: string;
    ip_address_check_out?: string;
    remarks?: string;
}
export declare class UpdateAttendanceRecordDto {
    check_out_time?: Date;
    working_hours?: number;
    status?: AttendanceStatus;
    location_check_out?: string;
    ip_address_check_out?: string;
    remarks?: string;
}
export declare class CheckInDto {
    employee_id: string;
    location?: string;
    ip_address?: string;
    source?: AttendanceSource;
}
export declare class CheckOutDto {
    location?: string;
    ip_address?: string;
    remarks?: string;
}
export declare class AttendanceFilterDto {
    employee_id?: string;
    from_date?: Date;
    to_date?: Date;
    status?: AttendanceStatus;
    page?: number;
    limit?: number;
}

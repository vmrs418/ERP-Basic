import { Employee } from '../../employees/entities/employee.entity';
import { AttendanceRecord } from '../../attendance-records/entities/attendance-record.entity';
import { User } from '../../users/entities/user.entity';
export declare class AttendanceCorrection {
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
    attendance: AttendanceRecord;
    employee: Employee;
    reviewer?: User;
}

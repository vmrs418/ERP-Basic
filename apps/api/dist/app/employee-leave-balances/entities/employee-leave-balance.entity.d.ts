import { Employee } from '../../employees/entities/employee.entity';
import { LeaveType } from '../../leave-types/entities/leave-type.entity';
export declare class EmployeeLeaveBalance {
    id: string;
    employee_id: string;
    leave_type_id: string;
    year: number;
    opening_balance: number;
    accrued: number;
    used: number;
    adjusted: number;
    encashed: number;
    carried_forward: number;
    closing_balance: number;
    last_updated: Date;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    leave_type: LeaveType;
}

import { Employee } from '../../employees/entities/employee.entity';
import { Shift } from '../../shifts/entities/shift.entity';
export declare class EmployeeShift {
    id: string;
    employee_id: string;
    shift_id: string;
    effective_from: Date;
    effective_to?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    shift: Shift;
}

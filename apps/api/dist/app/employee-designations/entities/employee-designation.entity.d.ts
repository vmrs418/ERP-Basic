import { Employee } from '../../employees/entities/employee.entity';
import { Designation } from '../../designations/entities/designation.entity';
export declare class EmployeeDesignation {
    id: string;
    employee_id: string;
    designation_id: string;
    from_date: Date;
    to_date?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    designation: Designation;
}

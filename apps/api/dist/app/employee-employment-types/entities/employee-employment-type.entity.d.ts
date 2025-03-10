import { Employee } from '../../employees/entities/employee.entity';
import { EmploymentType } from '../../employment-types/entities/employment-type.entity';
export declare class EmployeeEmploymentType {
    id: string;
    employee_id: string;
    employment_type_id: string;
    from_date: Date;
    to_date?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    employmentType: EmploymentType;
}

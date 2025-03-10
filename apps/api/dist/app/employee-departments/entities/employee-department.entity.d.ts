import { Employee } from '../../employees/entities/employee.entity';
import { Department } from '../../departments/entities/department.entity';
export declare class EmployeeDepartment {
    id: string;
    employee_id: string;
    department_id: string;
    is_primary: boolean;
    from_date: Date;
    to_date?: Date;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    department: Department;
}

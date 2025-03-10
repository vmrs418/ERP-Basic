import { Employee } from '../../employees/entities/employee.entity';
import { EmployeeDepartment } from '../../employee-departments/entities/employee-department.entity';
export declare class Department {
    id: string;
    name: string;
    code: string;
    description?: string;
    parent_department_id?: string;
    head_employee_id?: string;
    created_at: Date;
    updated_at: Date;
    parent_department?: Department;
    head_employee?: Employee;
    employees: EmployeeDepartment[];
}

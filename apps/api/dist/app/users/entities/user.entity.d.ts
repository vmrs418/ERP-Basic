import { Employee } from '../../employees/entities/employee.entity';
import { UserRole } from '../../user-roles/entities/user-role.entity';
export declare class User {
    id: string;
    email: string;
    employee_id?: string;
    phone?: string;
    is_active: boolean;
    last_login?: Date;
    created_at: Date;
    updated_at: Date;
    employee?: Employee;
    roles?: UserRole[];
}

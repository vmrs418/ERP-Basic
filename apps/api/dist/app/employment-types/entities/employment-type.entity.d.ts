import { EmployeeEmploymentType } from '../../employee-employment-types/entities/employee-employment-type.entity';
export declare class EmploymentType {
    id: string;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
    employees: EmployeeEmploymentType[];
}

import { EmployeeDesignation } from '../../employee-designations/entities/employee-designation.entity';
export declare class Designation {
    id: string;
    title: string;
    code: string;
    description?: string;
    level: number;
    created_at: Date;
    updated_at: Date;
    employees: EmployeeDesignation[];
}

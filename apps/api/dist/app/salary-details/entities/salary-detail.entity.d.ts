import { Employee } from '../../employees/entities/employee.entity';
export declare class SalaryDetail {
    id: string;
    employee_id: string;
    basic_salary: number;
    hra: number;
    conveyance_allowance: number;
    medical_allowance: number;
    special_allowance: number;
    pf_employer_contribution: number;
    pf_employee_contribution: number;
    esi_employer_contribution: number;
    esi_employee_contribution: number;
    professional_tax: number;
    tds: number;
    effective_from: Date;
    effective_to?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    employee: Employee;
}

import { Employee } from '../../employees/entities/employee.entity';
export declare class BankDetail {
    id: string;
    employee_id: string;
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    branch_name: string;
    ifsc_code: string;
    is_primary: boolean;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
}

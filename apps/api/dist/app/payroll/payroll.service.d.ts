import { SupabaseService } from '../supabase/supabase.service';
export declare class PayrollService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findByEmployee(employeeId: string): Promise<any[]>;
    create(payrollData: any): Promise<any>;
    generatePayroll(month: number, year: number): Promise<any[]>;
    approve(id: string): Promise<any>;
}

import { PayrollService } from './payroll.service';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    create(createPayrollDto: any): Promise<any>;
    findAll(): Promise<any[]>;
    findByEmployee(id: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    generatePayroll(data: {
        month: number;
        year: number;
    }): Promise<any[]>;
    approve(id: string): Promise<any>;
}

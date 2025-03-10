"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let PayrollService = class PayrollService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async findAll() {
        return this.supabaseService.getPayrollRecords();
    }
    async findOne(id) {
        const payrollRecords = await this.supabaseService.getPayrollRecords();
        return payrollRecords.find(record => record.id === id);
    }
    async findByEmployee(employeeId) {
        const payrollRecords = await this.supabaseService.getPayrollRecords();
        return payrollRecords.filter(record => record.employee_id === employeeId);
    }
    async create(payrollData) {
        return this.supabaseService.createPayrollRecord(payrollData);
    }
    async generatePayroll(month, year) {
        const employees = await this.supabaseService.getEmployees();
        const activeEmployees = employees.filter(emp => emp.status === 'active');
        const attendanceRecords = await this.supabaseService.getAttendanceRecords();
        const leaveApplications = await this.supabaseService.getLeaveApplications();
        const payrollRecords = [];
        for (const employee of activeEmployees) {
            const employeeAttendance = attendanceRecords.filter(record => record.employee_id === employee.id);
            const workingDays = employeeAttendance.length;
            const employeeLeaves = leaveApplications.filter(leave => leave.employee_id === employee.id);
            const leaveDays = employeeLeaves.reduce((total, leave) => {
                const startDate = new Date(leave.start_date);
                const endDate = new Date(leave.end_date);
                const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                return total + diffDays;
            }, 0);
            const basicSalary = employee.basic_salary || 50000;
            const grossSalary = basicSalary;
            const taxRate = 0.1;
            const taxDeduction = grossSalary * taxRate;
            const netSalary = grossSalary - taxDeduction;
            const payrollRecord = {
                employee_id: employee.id,
                month,
                year,
                basic_salary: basicSalary,
                gross_salary: grossSalary,
                tax_deduction: taxDeduction,
                net_salary: netSalary,
                working_days: workingDays,
                leave_days: leaveDays,
                status: 'pending',
                payment_date: null,
            };
            const savedRecord = await this.supabaseService.createPayrollRecord(payrollRecord);
            payrollRecords.push(savedRecord);
        }
        return payrollRecords;
    }
    async approve(id) {
        const payrollRecords = await this.supabaseService.getPayrollRecords();
        const recordIndex = payrollRecords.findIndex(record => record.id === id);
        if (recordIndex === -1) {
            throw new Error('Payroll record not found');
        }
        const updatedRecord = Object.assign(Object.assign({}, payrollRecords[recordIndex]), { status: 'approved', payment_date: new Date().toISOString() });
        return this.supabaseService.createPayrollRecord(updatedRecord);
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map
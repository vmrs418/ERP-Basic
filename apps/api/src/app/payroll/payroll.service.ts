import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PayrollService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    return this.supabaseService.getPayrollRecords();
  }

  async findOne(id: string) {
    const payrollRecords = await this.supabaseService.getPayrollRecords();
    return payrollRecords.find(record => record.id === id);
  }

  async findByEmployee(employeeId: string) {
    const payrollRecords = await this.supabaseService.getPayrollRecords();
    return payrollRecords.filter(record => record.employee_id === employeeId);
  }

  async create(payrollData: any) {
    return this.supabaseService.createPayrollRecord(payrollData);
  }

  async generatePayroll(month: number, year: number) {
    // Get all active employees
    const employees = await this.supabaseService.getEmployees();
    const activeEmployees = employees.filter(emp => emp.status === 'active');
    
    // Get attendance records for the month
    const attendanceRecords = await this.supabaseService.getAttendanceRecords();
    
    // Get leave records for the month
    const leaveApplications = await this.supabaseService.getLeaveApplications();
    
    // Generate payroll for each employee
    const payrollRecords = [];
    
    for (const employee of activeEmployees) {
      // Calculate working days
      const employeeAttendance = attendanceRecords.filter(
        record => record.employee_id === employee.id
      );
      
      const workingDays = employeeAttendance.length;
      
      // Calculate leave days
      const employeeLeaves = leaveApplications.filter(
        leave => leave.employee_id === employee.id
      );
      
      const leaveDays = employeeLeaves.reduce((total, leave) => {
        const startDate = new Date(leave.start_date);
        const endDate = new Date(leave.end_date);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return total + diffDays;
      }, 0);
      
      // Calculate basic salary (this would come from employee record)
      const basicSalary = employee.basic_salary || 50000; // Default value
      
      // Calculate gross salary
      const grossSalary = basicSalary;
      
      // Calculate deductions (tax, etc.)
      const taxRate = 0.1; // 10% tax
      const taxDeduction = grossSalary * taxRate;
      
      // Calculate net salary
      const netSalary = grossSalary - taxDeduction;
      
      // Create payroll record
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
      
      // Save to database
      const savedRecord = await this.supabaseService.createPayrollRecord(payrollRecord);
      payrollRecords.push(savedRecord);
    }
    
    return payrollRecords;
  }

  async approve(id: string) {
    const payrollRecords = await this.supabaseService.getPayrollRecords();
    const recordIndex = payrollRecords.findIndex(record => record.id === id);
    
    if (recordIndex === -1) {
      throw new Error('Payroll record not found');
    }
    
    // Update payroll record
    const updatedRecord = {
      ...payrollRecords[recordIndex],
      status: 'approved',
      payment_date: new Date().toISOString(),
    };
    
    return this.supabaseService.createPayrollRecord(updatedRecord);
  }
} 
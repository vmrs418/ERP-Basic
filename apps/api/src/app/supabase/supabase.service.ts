import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_KEY'),
    );
  }

  get client() {
    return this.supabase;
  }

  /**
   * Get the admin client with service role key
   * Use this carefully as it bypasses RLS policies
   */
  getAdminClient() {
    return createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  // Employees
  async getEmployees() {
    const { data, error } = await this.supabase.from('employees').select('*');
    if (error) throw error;
    return data;
  }

  async getEmployeeById(id: string) {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async createEmployee(employeeData: any) {
    const { data, error } = await this.supabase
      .from('employees')
      .insert(employeeData)
      .select();
    if (error) throw error;
    return data[0];
  }

  async updateEmployee(id: string, employeeData: any) {
    const { data, error } = await this.supabase
      .from('employees')
      .update(employeeData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  }

  async deleteEmployee(id: string) {
    const { error } = await this.supabase
      .from('employees')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  // Leave Types
  async getLeaveTypes() {
    const { data, error } = await this.supabase.from('leave_types').select('*');
    if (error) throw error;
    return data;
  }

  async getLeaveTypeById(id: string) {
    const { data, error } = await this.supabase
      .from('leave_types')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async createLeaveType(leaveTypeData: any) {
    const { data, error } = await this.supabase
      .from('leave_types')
      .insert(leaveTypeData)
      .select();
    if (error) throw error;
    return data[0];
  }

  // Leave Applications
  async getLeaveApplications() {
    const { data, error } = await this.supabase
      .from('leave_applications')
      .select(`
        *,
        employees (id, first_name, last_name),
        leave_types (id, name, is_paid)
      `);
    if (error) throw error;
    
    // Transform to match the expected format
    return data.map(app => ({
      ...app,
      employee_name: app.employees ? `${app.employees.first_name} ${app.employees.last_name}` : 'Unknown',
      leave_type_name: app.leave_types ? app.leave_types.name : 'Unknown',
    }));
  }

  async createLeaveApplication(leaveData: any) {
    const { data, error } = await this.supabase
      .from('leave_applications')
      .insert(leaveData)
      .select();
    if (error) throw error;
    return data[0];
  }

  // Attendance Records
  async getAttendanceRecords(employeeId?: string) {
    let query = this.supabase
      .from('attendance_records')
      .select(`
        *,
        employees (id, first_name, last_name)
      `);
    
    if (employeeId) {
      query = query.eq('employee_id', employeeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Transform to match expected format
    return data.map(record => ({
      ...record,
      employee_name: record.employees ? `${record.employees.first_name} ${record.employees.last_name}` : 'Unknown',
    }));
  }

  async createAttendanceRecord(attendanceData: any) {
    const { data, error } = await this.supabase
      .from('attendance_records')
      .insert(attendanceData)
      .select();
    if (error) throw error;
    return data[0];
  }

  async updateAttendanceRecord(id: string, attendanceData: any) {
    const { data, error } = await this.supabase
      .from('attendance_records')
      .update(attendanceData)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  }

  // Departments
  async getDepartments() {
    const { data, error } = await this.supabase.from('departments').select('*');
    if (error) throw error;
    return data;
  }

  async createDepartment(departmentData: any) {
    const { data, error } = await this.supabase
      .from('departments')
      .insert(departmentData)
      .select();
    if (error) throw error;
    return data[0];
  }

  // Designations
  async getDesignations() {
    const { data, error } = await this.supabase.from('designations').select('*');
    if (error) throw error;
    return data;
  }

  async createDesignation(designationData: any) {
    const { data, error } = await this.supabase
      .from('designations')
      .insert(designationData)
      .select();
    if (error) throw error;
    return data[0];
  }

  // Payroll
  async getPayrollRecords() {
    const { data, error } = await this.supabase
      .from('payroll')
      .select(`
        *,
        employees (id, first_name, last_name)
      `);
    if (error) throw error;
    return data;
  }

  async createPayrollRecord(payrollData: any) {
    const { data, error } = await this.supabase
      .from('payroll')
      .insert(payrollData)
      .select();
    if (error) throw error;
    return data[0];
  }

  // Authentication
  async signUp(email: string, password: string, userData: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  }

  async getCurrentUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }
} 
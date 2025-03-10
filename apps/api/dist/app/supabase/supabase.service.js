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
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    constructor(configService) {
        this.configService = configService;
        this.supabase = (0, supabase_js_1.createClient)(this.configService.get('SUPABASE_URL'), this.configService.get('SUPABASE_KEY'));
    }
    get client() {
        return this.supabase;
    }
    getAdminClient() {
        return (0, supabase_js_1.createClient)(this.configService.get('SUPABASE_URL'), this.configService.get('SUPABASE_SERVICE_ROLE_KEY'));
    }
    async getEmployees() {
        const { data, error } = await this.supabase.from('employees').select('*');
        if (error)
            throw error;
        return data;
    }
    async getEmployeeById(id) {
        const { data, error } = await this.supabase
            .from('employees')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
    async createEmployee(employeeData) {
        const { data, error } = await this.supabase
            .from('employees')
            .insert(employeeData)
            .select();
        if (error)
            throw error;
        return data[0];
    }
    async updateEmployee(id, employeeData) {
        const { data, error } = await this.supabase
            .from('employees')
            .update(employeeData)
            .eq('id', id)
            .select();
        if (error)
            throw error;
        return data[0];
    }
    async deleteEmployee(id) {
        const { error } = await this.supabase
            .from('employees')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return { success: true };
    }
    async getLeaveTypes() {
        const { data, error } = await this.supabase.from('leave_types').select('*');
        if (error)
            throw error;
        return data;
    }
    async getLeaveTypeById(id) {
        const { data, error } = await this.supabase
            .from('leave_types')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
        return data;
    }
    async createLeaveType(leaveTypeData) {
        const { data, error } = await this.supabase
            .from('leave_types')
            .insert(leaveTypeData)
            .select();
        if (error)
            throw error;
        return data[0];
    }
    async getLeaveApplications() {
        const { data, error } = await this.supabase
            .from('leave_applications')
            .select(`
        *,
        employees (id, first_name, last_name),
        leave_types (id, name, is_paid)
      `);
        if (error)
            throw error;
        return data.map(app => (Object.assign(Object.assign({}, app), { employee_name: app.employees ? `${app.employees.first_name} ${app.employees.last_name}` : 'Unknown', leave_type_name: app.leave_types ? app.leave_types.name : 'Unknown' })));
    }
    async createLeaveApplication(leaveData) {
        const { data, error } = await this.supabase
            .from('leave_applications')
            .insert(leaveData)
            .select();
        if (error)
            throw error;
        return data[0];
    }
    async getAttendanceRecords(employeeId) {
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
        if (error)
            throw error;
        return data.map(record => (Object.assign(Object.assign({}, record), { employee_name: record.employees ? `${record.employees.first_name} ${record.employees.last_name}` : 'Unknown' })));
    }
    async createAttendanceRecord(attendanceData) {
        const { data, error } = await this.supabase
            .from('attendance_records')
            .insert(attendanceData)
            .select();
        if (error)
            throw error;
        return data[0];
    }
    async updateAttendanceRecord(id, attendanceData) {
        const { data, error } = await this.supabase
            .from('attendance_records')
            .update(attendanceData)
            .eq('id', id)
            .select();
        if (error)
            throw error;
        return data[0];
    }
    async getDepartments() {
        const { data, error } = await this.supabase.from('departments').select('*');
        if (error)
            throw error;
        return data;
    }
    async createDepartment(departmentData) {
        const { data, error } = await this.supabase
            .from('departments')
            .insert(departmentData)
            .select();
        if (error)
            throw error;
        return data[0];
    }
    async getDesignations() {
        const { data, error } = await this.supabase.from('designations').select('*');
        if (error)
            throw error;
        return data;
    }
    async createDesignation(designationData) {
        const { data, error } = await this.supabase
            .from('designations')
            .insert(designationData)
            .select();
        if (error)
            throw error;
        return data[0];
    }
    async getPayrollRecords() {
        const { data, error } = await this.supabase
            .from('payroll')
            .select(`
        *,
        employees (id, first_name, last_name)
      `);
        if (error)
            throw error;
        return data;
    }
    async createPayrollRecord(payrollData) {
        const { data, error } = await this.supabase
            .from('payroll')
            .insert(payrollData)
            .select();
        if (error)
            throw error;
        return data[0];
    }
    async signUp(email, password, userData) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData,
            },
        });
        if (error)
            throw error;
        return data;
    }
    async signIn(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error)
            throw error;
        return data;
    }
    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error)
            throw error;
        return { success: true };
    }
    async getCurrentUser() {
        const { data, error } = await this.supabase.auth.getUser();
        if (error)
            throw error;
        return data.user;
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map
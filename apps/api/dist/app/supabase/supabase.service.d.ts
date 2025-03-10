import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    get client(): SupabaseClient<any, "public", any>;
    getAdminClient(): SupabaseClient<any, "public", any>;
    getEmployees(): Promise<any[]>;
    getEmployeeById(id: string): Promise<any>;
    createEmployee(employeeData: any): Promise<any>;
    updateEmployee(id: string, employeeData: any): Promise<any>;
    deleteEmployee(id: string): Promise<{
        success: boolean;
    }>;
    getLeaveTypes(): Promise<any[]>;
    getLeaveTypeById(id: string): Promise<any>;
    createLeaveType(leaveTypeData: any): Promise<any>;
    getLeaveApplications(): Promise<any[]>;
    createLeaveApplication(leaveData: any): Promise<any>;
    getAttendanceRecords(employeeId?: string): Promise<any[]>;
    createAttendanceRecord(attendanceData: any): Promise<any>;
    updateAttendanceRecord(id: string, attendanceData: any): Promise<any>;
    getDepartments(): Promise<any[]>;
    createDepartment(departmentData: any): Promise<any>;
    getDesignations(): Promise<any[]>;
    createDesignation(designationData: any): Promise<any>;
    getPayrollRecords(): Promise<any[]>;
    createPayrollRecord(payrollData: any): Promise<any>;
    signUp(email: string, password: string, userData: any): Promise<{
        user: import("@supabase/supabase-js").AuthUser | null;
        session: import("@supabase/supabase-js").AuthSession | null;
    } | {
        user: null;
        session: null;
    }>;
    signIn(email: string, password: string): Promise<{
        user: import("@supabase/supabase-js").AuthUser;
        session: import("@supabase/supabase-js").AuthSession;
        weakPassword?: import("@supabase/supabase-js").WeakPassword;
    } | {
        user: null;
        session: null;
        weakPassword?: null;
    }>;
    signOut(): Promise<{
        success: boolean;
    }>;
    getCurrentUser(): Promise<import("@supabase/supabase-js").AuthUser>;
}

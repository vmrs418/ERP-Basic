// Employee types
export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  personal_email?: string;
  phone: string;
  alternate_phone?: string;
  date_of_birth: string;
  date_of_joining: string;
  probation_period_months: number;
  confirmation_date?: string;
  gender: 'male' | 'female' | 'other';
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';
  blood_group?: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_phone: string;
  current_address: string;
  permanent_address: string;
  nationality: string;
  aadhaar_number: string;
  pan_number: string;
  passport_number?: string;
  passport_expiry?: string;
  profile_picture_url?: string;
  status: 'active' | 'on_notice' | 'terminated' | 'on_leave' | 'absconding';
  notice_period_days?: number;
  last_working_date?: string;
  termination_reason?: string;
  departments: EmployeeDepartment[];
  designations: EmployeeDesignation[];
  created_at: string;
  updated_at: string;
}

export interface EmployeeDepartment {
  id: string;
  employee_id: string;
  department_id: string;
  is_primary: boolean;
  from_date: string;
  to_date?: string;
  department?: Department;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  parent_department_id?: string;
  head_employee_id?: string;
}

export interface EmployeeDesignation {
  id: string;
  employee_id: string;
  designation_id: string;
  from_date: string;
  to_date?: string;
  is_current: boolean;
  designation?: Designation;
}

export interface Designation {
  id: string;
  title: string;
  code: string;
  description?: string;
  level: number;
}

// Leave management types
export interface LeaveType {
  id: string;
  name: string;
  code: string;
  description: string;
  color_code: string;
  is_paid: boolean;
  is_encashable: boolean;
  requires_approval: boolean;
  max_consecutive_days?: number;
  min_days_before_application: number;
}

export interface LeaveApplication {
  id: string;
  employee_id: string;
  leave_type_id: string;
  from_date: string;
  to_date: string;
  duration_days: number;
  first_day_half: boolean;
  last_day_half: boolean;
  reason: string;
  contact_during_leave?: string;
  handover_to?: string;
  handover_notes?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  applied_at: string;
  actioned_by?: string;
  actioned_at?: string;
  rejection_reason?: string;
  attachment_url?: string;
  employee?: Employee;
  leave_type?: LeaveType;
  approver?: Employee;
  approval_workflow?: LeaveApprovalWorkflow[];
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  cancelled_by?: string;
  cancelled_at?: string;
}

export interface LeaveApprovalWorkflow {
  id: string;
  leave_application_id: string;
  approver_level: number;
  approver_id: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  actioned_at?: string;
  approver?: Employee;
  leave_application?: LeaveApplication;
  created_at: string;
  updated_at: string;
}

export interface EmployeeLeaveBalance {
  id: string;
  employee_id: string;
  leave_type_id: string;
  year: number;
  opening_balance: number;
  accrued: number;
  used: number;
  adjusted: number;
  encashed: number;
  carried_forward: number;
  closing_balance: number;
  last_updated: string;
  employee?: Employee;
  leave_type?: LeaveType;
  created_at: string;
  updated_at: string;
}

// Attendance types
export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  working_hours: number;
  status: 'present' | 'absent' | 'half_day' | 'weekend' | 'holiday' | 'on_leave';
  source: 'biometric' | 'web' | 'mobile' | 'manual';
  location_check_in?: string;
  location_check_out?: string;
  ip_address_check_in?: string;
  ip_address_check_out?: string;
  remarks?: string;
  employee?: Employee;
  created_at: string;
  updated_at: string;
  modified_by?: string;
}

// Holiday and weekend types
export interface Holiday {
  id: string;
  name: string;
  date: string;
  description?: string;
  is_restricted: boolean;
  applies_to_departments?: string[];
  created_at: string;
  updated_at: string;
}

export interface WeekendPolicy {
  id: string;
  name: string;
  description: string;
  weekends: number[];
  created_at: string;
  updated_at: string;
}

export interface EmployeeWeekendPolicy {
  id: string;
  employee_id: string;
  weekend_policy_id: string;
  from_date: string;
  to_date?: string;
  is_current: boolean;
  weekend_policy?: WeekendPolicy;
  created_at: string;
  updated_at: string;
}

// User types
export interface User {
  id: string;
  email: string;
  employee_id?: string;
  phone?: string;
  is_active: boolean;
  last_login?: string;
  roles: UserRole[];
  employee?: Employee;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: Permission[];
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  role?: Role;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  module: string;
  created_at: string;
  updated_at: string;
} 
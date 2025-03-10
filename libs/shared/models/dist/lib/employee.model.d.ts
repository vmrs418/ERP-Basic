import { Department } from './department.model';
import { Designation } from './designation.model';
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
    date_of_birth: Date;
    date_of_joining: Date;
    probation_period_months: number;
    confirmation_date?: Date;
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
    passport_expiry?: Date;
    profile_picture_url?: string;
    status: 'active' | 'on_notice' | 'terminated' | 'on_leave' | 'absconding';
    notice_period_days?: number;
    last_working_date?: Date;
    termination_reason?: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
}
export type CreateEmployeeDto = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;
export type UpdateEmployeeDto = Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>;
export interface EmployeeWithDetails extends Employee {
    departments?: EmployeeDepartment[];
    designations?: EmployeeDesignation[];
    employmentTypes?: EmployeeEmploymentType[];
    salaryDetails?: SalaryDetail[];
    bankDetails?: BankDetail[];
    documents?: Document[];
}
export interface EmployeeDepartment {
    id: string;
    employee_id: string;
    department_id: string;
    is_primary: boolean;
    from_date: Date;
    to_date?: Date;
    created_at: Date;
    updated_at: Date;
    department?: Department;
}
export interface EmployeeDesignation {
    id: string;
    employee_id: string;
    designation_id: string;
    from_date: Date;
    to_date?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    designation?: Designation;
}
export interface EmployeeEmploymentType {
    id: string;
    employee_id: string;
    employment_type_id: string;
    from_date: Date;
    to_date?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    employmentType?: EmploymentType;
}
export interface SalaryDetail {
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
}
export interface BankDetail {
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
}
export interface Document {
    id: string;
    employee_id: string;
    document_type: 'aadhar' | 'pan' | 'passport' | 'resume' | 'offer_letter' | 'joining_letter' | 'experience_certificate' | 'education_certificate' | 'other';
    document_url: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    verification_notes?: string;
    verified_by?: string;
    verified_at?: Date;
    created_at: Date;
    updated_at: Date;
}
export interface EmploymentType {
    id: string;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

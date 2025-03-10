export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced",
    WIDOWED = "widowed"
}
export declare enum EmployeeStatus {
    ACTIVE = "active",
    ON_NOTICE = "on_notice",
    TERMINATED = "terminated",
    ON_LEAVE = "on_leave",
    ABSCONDING = "absconding"
}
export interface IEmployee {
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
    gender: Gender;
    marital_status: MaritalStatus;
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
    status: EmployeeStatus;
    notice_period_days?: number;
    last_working_date?: Date;
    termination_reason?: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
}
export interface IEmployeeDepartment {
    id: string;
    employee_id: string;
    department_id: string;
    is_primary: boolean;
    from_date: Date;
    to_date?: Date;
    created_at: Date;
    updated_at: Date;
    department?: IDepartment;
}
export interface IDepartment {
    id: string;
    name: string;
    code: string;
    description?: string;
    parent_department_id?: string;
    head_employee_id?: string;
    created_at: Date;
    updated_at: Date;
    parent_department?: IDepartment;
    head_employee?: IEmployee;
}
export interface IEmployeeDesignation {
    id: string;
    employee_id: string;
    designation_id: string;
    from_date: Date;
    to_date?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    designation?: IDesignation;
}
export interface IDesignation {
    id: string;
    title: string;
    code: string;
    description?: string;
    level: number;
    created_at: Date;
    updated_at: Date;
}
export interface IEmployeeResponse {
    employee: IEmployee;
    departments: IEmployeeDepartment[];
    designations: IEmployeeDesignation[];
    current_department?: IDepartment;
    current_designation?: IDesignation;
}
export interface IEmployeeListResponse {
    items: IEmployeeResponse[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

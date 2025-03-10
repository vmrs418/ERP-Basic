declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
declare enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced",
    WIDOWED = "widowed"
}
declare enum EmployeeStatus {
    ACTIVE = "active",
    ON_NOTICE = "on_notice",
    TERMINATED = "terminated",
    ON_LEAVE = "on_leave",
    ABSCONDING = "absconding"
}
export declare class CreateEmployeeDto {
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
    nationality?: string;
    aadhaar_number: string;
    pan_number: string;
    passport_number?: string;
    passport_expiry?: Date;
    profile_picture_url?: string;
    status?: EmployeeStatus;
    notice_period_days?: number;
    last_working_date?: Date;
    termination_reason?: string;
}
export declare class UpdateEmployeeDto {
    employee_code?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    email?: string;
    personal_email?: string;
    phone?: string;
    alternate_phone?: string;
    date_of_birth?: Date;
    date_of_joining?: Date;
    probation_period_months?: number;
    confirmation_date?: Date;
    gender?: Gender;
    marital_status?: MaritalStatus;
    blood_group?: string;
    emergency_contact_name?: string;
    emergency_contact_relation?: string;
    emergency_contact_phone?: string;
    current_address?: string;
    permanent_address?: string;
    nationality?: string;
    aadhaar_number?: string;
    pan_number?: string;
    passport_number?: string;
    passport_expiry?: Date;
    profile_picture_url?: string;
    status?: EmployeeStatus;
    notice_period_days?: number;
    last_working_date?: Date;
    termination_reason?: string;
}
export declare class EmployeeFilterDto {
    search?: string;
    department_id?: string;
    designation_id?: string;
    status?: EmployeeStatus;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}
export declare class BulkEmployeeUploadDto {
    update_existing: boolean;
    required_fields: string[];
}
export {};

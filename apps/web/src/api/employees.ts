import { api } from './apiClient';

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
}

export interface CreateEmployeeDto {
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
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {}

export interface EmployeeFilter {
  status?: string;
  department_id?: string;
  designation_id?: string;
  search?: string;
}

export const getEmployees = async (filter?: EmployeeFilter): Promise<Employee[]> => {
  return api.employees.getEmployees(filter) as Promise<Employee[]>;
};

export const getEmployee = async (id: string): Promise<Employee> => {
  return api.employees.getEmployee(id) as Promise<Employee>;
};

export const createEmployee = async (data: Partial<Employee>): Promise<Employee> => {
  return api.employees.createEmployee(data) as Promise<Employee>;
};

export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<Employee> => {
  return api.employees.updateEmployee(id, data) as Promise<Employee>;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  return api.employees.deleteEmployee(id) as Promise<void>;
}; 
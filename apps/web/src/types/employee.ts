export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  hire_date: string;
  birth_date?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  employee_code: string;
  profile_picture_url?: string;
  department_id?: string;
  designation_id?: string;
  manager_id?: string;
  employment_status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  parent_department_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Designation {
  id: string;
  name: string;
  description?: string;
  department_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeWithRelations extends Employee {
  department?: Department;
  designation?: Designation;
  manager?: Employee;
}

export interface PaginatedEmployeeResponse {
  items: {
    employee: Employee;
    department?: Department;
    designation?: Designation;
  }[];
  total: number;
  page: number;
  limit: number;
}

export interface EmployeeFilter {
  department_id?: string;
  manager_id?: string;
  employment_status?: string;
  employment_type?: string;
  search?: string;
  page?: number;
  limit?: number;
} 
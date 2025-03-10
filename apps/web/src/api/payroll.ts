import { apiClient } from './client';

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
  effective_from: string;
  effective_to?: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface PayrollPeriod {
  id: string;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'processing' | 'completed' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface PayslipItem {
  id: string;
  payroll_id: string;
  employee_id: string;
  basic_salary: number;
  hra: number;
  conveyance_allowance: number;
  medical_allowance: number;
  special_allowance: number;
  leave_encashment: number;
  other_earnings: number;
  gross_salary: number;
  pf_deduction: number;
  esi_deduction: number;
  tds_deduction: number;
  prof_tax_deduction: number;
  leave_deduction: number;
  other_deductions: number;
  total_deductions: number;
  net_salary: number;
  remarks?: string;
  status: 'draft' | 'approved' | 'paid';
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface LeaveEncashmentRequest {
  id: string;
  employee_id: string;
  leave_type_id: string;
  requested_days: number;
  year: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  amount?: number;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  employee?: {
    id: string;
    employee_code: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  leave_type?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreateLeaveEncashmentRequestDto {
  employee_id?: string; // Optional, can be taken from authenticated user
  leave_type_id: string;
  requested_days: number;
  year: number;
  reason: string;
}

// Get current salary details for employee
export const getEmployeeSalary = async (employeeId: string): Promise<SalaryDetail> => {
  const response = await apiClient.get(`/payroll/salary/${employeeId}`);
  return response.data;
};

// Update salary details
export const updateSalaryDetails = async (
  id: string,
  data: Partial<SalaryDetail>
): Promise<SalaryDetail> => {
  const response = await apiClient.put(`/payroll/salary/${id}`, data);
  return response.data;
};

// Get payslips for employee
export const getEmployeePayslips = async (
  employeeId: string,
  year?: number
): Promise<PayslipItem[]> => {
  const params: any = { employee_id: employeeId };
  if (year) params.year = year;
  
  const response = await apiClient.get('/payroll/payslips', { params });
  return response.data;
};

// Get single payslip
export const getPayslip = async (id: string): Promise<PayslipItem> => {
  const response = await apiClient.get(`/payroll/payslips/${id}`);
  return response.data;
};

// Get leave encashment requests
export const getLeaveEncashmentRequests = async (
  status?: string
): Promise<LeaveEncashmentRequest[]> => {
  const params: any = {};
  if (status) params.status = status;
  
  const response = await apiClient.get('/payroll/leave-encashment', { params });
  return response.data;
};

// Create leave encashment request
export const createLeaveEncashmentRequest = async (
  data: CreateLeaveEncashmentRequestDto
): Promise<LeaveEncashmentRequest> => {
  const response = await apiClient.post('/payroll/leave-encashment', data);
  return response.data;
};

// Approve leave encashment request
export const approveLeaveEncashmentRequest = async (
  id: string,
  amount: number
): Promise<LeaveEncashmentRequest> => {
  const response = await apiClient.put(`/payroll/leave-encashment/${id}/approve`, { amount });
  return response.data;
};

// Reject leave encashment request
export const rejectLeaveEncashmentRequest = async (
  id: string,
  reason: string
): Promise<LeaveEncashmentRequest> => {
  const response = await apiClient.put(`/payroll/leave-encashment/${id}/reject`, { rejection_reason: reason });
  return response.data;
};

// Calculate leave encashment amount
export const calculateLeaveEncashmentAmount = async (
  employeeId: string,
  leaveTypeId: string,
  days: number
): Promise<{ amount: number }> => {
  const response = await apiClient.post('/payroll/calculate-encashment', {
    employee_id: employeeId,
    leave_type_id: leaveTypeId,
    days
  });
  
  return response.data;
}; 
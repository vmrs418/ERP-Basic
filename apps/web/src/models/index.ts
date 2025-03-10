// Add types for leave encashment and payroll
export interface LeaveEncashmentRequest {
  id: string;
  employee_id: string;
  leave_type_id: string;
  requested_days: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'paid';
  reason: string;
  approval_date?: string;
  approved_amount?: number;
  rejection_reason?: string;
  approved_by?: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface SalaryDetail {
  id: string;
  employee_id: string;
  basic_salary: number;
  hra: number;
  conveyance_allowance: number;
  medical_allowance: number;
  special_allowance: number;
  pf_employee_contribution: number;
  pf_employer_contribution: number;
  esi_employee_contribution: number;
  esi_employer_contribution: number;
  professional_tax: number;
  effective_from: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollPeriod {
  id: string;
  year: number;
  month: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PayslipItem {
  id: string;
  employee_id: string;
  payroll_period_id: string;
  basic_salary: number;
  hra: number;
  conveyance_allowance: number;
  medical_allowance: number;
  special_allowance: number;
  other_earnings: number;
  pf_employee: number;
  pf_employer: number;
  esi_employee: number;
  esi_employer: number;
  professional_tax: number;
  income_tax: number;
  other_deductions: number;
  leave_encashment: number;
  gross_salary: number;
  net_salary: number;
  status: 'draft' | 'published' | 'paid';
  payment_date?: string;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
} 
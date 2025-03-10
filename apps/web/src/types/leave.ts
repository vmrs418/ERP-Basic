export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  is_paid: boolean;
  default_days: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalance {
  id: string;
  employee_id: string;
  leave_type_id: string;
  year: number;
  total_days: number;
  used_days: number;
  remaining_days: number;
  created_at: string;
  updated_at: string;
  leave_type?: LeaveType;
}

export interface LeaveApplication {
  id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: string;
  rejected_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  leave_type?: LeaveType;
}

export interface LeaveApplicationFilter {
  employee_id?: string;
  leave_type_id?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedLeaveApplicationResponse {
  items: LeaveApplication[];
  total: number;
  page: number;
  limit: number;
}

export interface LeaveBalanceFilter {
  employee_id?: string;
  leave_type_id?: string;
  year?: number;
}

export interface PaginatedLeaveBalanceResponse {
  items: LeaveBalance[];
  total: number;
  page: number;
  limit: number;
}

export interface LeaveApplicationRequest {
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface LeaveApprovalRequest {
  approved_by: string;
}

export interface LeaveRejectionRequest {
  rejected_by: string;
  rejection_reason: string;
} 
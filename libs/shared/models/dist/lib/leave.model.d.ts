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
    created_at: Date;
    updated_at: Date;
}
export interface LeavePolicy {
    id: string;
    name: string;
    description: string;
    effective_from: Date;
    effective_to?: Date;
    is_current: boolean;
    probation_applicable: boolean;
    created_at: Date;
    updated_at: Date;
    details?: LeavePolicyDetail[];
}
export interface LeavePolicyDetail {
    id: string;
    leave_policy_id: string;
    leave_type_id: string;
    annual_quota: number;
    accrual_type: 'yearly' | 'monthly' | 'quarterly';
    carry_forward_limit: number;
    encashment_limit: number;
    applicable_from_months: number;
    created_at: Date;
    updated_at: Date;
    leave_type?: LeaveType;
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
    last_updated: Date;
    created_at: Date;
    updated_at: Date;
    employee?: any;
    leave_type?: LeaveType;
}
export interface LeaveApplication {
    id: string;
    employee_id: string;
    leave_type_id: string;
    from_date: Date;
    to_date: Date;
    duration_days: number;
    first_day_half: boolean;
    last_day_half: boolean;
    reason: string;
    contact_during_leave: string;
    handover_to?: string;
    handover_notes?: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
    applied_at: Date;
    actioned_by?: string;
    actioned_at?: Date;
    rejection_reason?: string;
    attachment_url?: string;
    created_at: Date;
    updated_at: Date;
    employee?: any;
    leave_type?: LeaveType;
    approver?: any;
    approval_workflow?: LeaveApprovalWorkflow[];
}
export interface LeaveApprovalWorkflow {
    id: string;
    leave_application_id: string;
    approver_level: number;
    approver_id: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    actioned_at?: Date;
    created_at: Date;
    updated_at: Date;
    leave_application?: LeaveApplication;
    approver?: any;
}
export type CreateLeaveTypeDto = Omit<LeaveType, 'id' | 'created_at' | 'updated_at'>;
export type UpdateLeaveTypeDto = Partial<CreateLeaveTypeDto>;
export type CreateLeavePolicyDto = Omit<LeavePolicy, 'id' | 'created_at' | 'updated_at' | 'details'>;
export type UpdateLeavePolicyDto = Partial<CreateLeavePolicyDto>;
export type CreateLeavePolicyDetailDto = Omit<LeavePolicyDetail, 'id' | 'created_at' | 'updated_at' | 'leave_type'>;
export type UpdateLeavePolicyDetailDto = Partial<CreateLeavePolicyDetailDto>;
export type CreateEmployeeLeaveBalanceDto = Omit<EmployeeLeaveBalance, 'id' | 'created_at' | 'updated_at' | 'employee' | 'leave_type'>;
export type UpdateEmployeeLeaveBalanceDto = Partial<Omit<EmployeeLeaveBalance, 'id' | 'created_at' | 'updated_at' | 'employee' | 'leave_type'>>;
export type CreateLeaveApplicationDto = Omit<LeaveApplication, 'id' | 'status' | 'applied_at' | 'actioned_by' | 'actioned_at' | 'created_at' | 'updated_at' | 'employee' | 'leave_type' | 'approver' | 'approval_workflow'>;
export type UpdateLeaveApplicationDto = Partial<CreateLeaveApplicationDto>;
export type CreateLeaveApprovalWorkflowDto = Omit<LeaveApprovalWorkflow, 'id' | 'created_at' | 'updated_at' | 'leave_application' | 'approver'>;
export type UpdateLeaveApprovalWorkflowDto = Partial<Omit<LeaveApprovalWorkflow, 'id' | 'created_at' | 'updated_at' | 'leave_application_id' | 'leave_application' | 'approver'>>;
export interface LeaveBalanceCalculation {
    employee_id: string;
    leave_type_id: string;
    year: number;
    current_balance: number;
}

import { Employee } from '../../employees/entities/employee.entity';
import { LeaveType } from '../../leave-types/entities/leave-type.entity';
import { User } from '../../users/entities/user.entity';
import { LeaveApprovalWorkflow } from '../../leave-approval-workflows/entities/leave-approval-workflow.entity';
export declare class LeaveApplication {
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
    status: string;
    applied_at: Date;
    actioned_by?: string;
    actioned_at?: Date;
    rejection_reason?: string;
    attachment_url?: string;
    created_by: string;
    updated_by: string;
    approved_by: string;
    rejected_by: string;
    cancelled_by: string;
    approved_at: Date;
    rejected_at: Date;
    cancelled_at: Date;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    leave_type: LeaveType;
    approver?: User;
    approval_workflow: LeaveApprovalWorkflow[];
}

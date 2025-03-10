import { LeaveApplication } from '../../leave-applications/entities/leave-application.entity';
import { User } from '../../users/entities/user.entity';
export declare class LeaveApprovalWorkflow {
    id: string;
    leave_application_id: string;
    approver_level: number;
    approver_id: string;
    status: 'pending' | 'approved' | 'rejected';
    comments: string;
    actioned_at: Date;
    created_at: Date;
    updated_at: Date;
    leave_application: LeaveApplication;
    approver: User;
}

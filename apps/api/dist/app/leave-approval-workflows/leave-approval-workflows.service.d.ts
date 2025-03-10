import { Repository } from 'typeorm';
import { LeaveApprovalWorkflow } from './entities/leave-approval-workflow.entity';
export declare class LeaveApprovalWorkflowsService {
    private readonly leaveApprovalWorkflowRepository;
    constructor(leaveApprovalWorkflowRepository: Repository<LeaveApprovalWorkflow>);
    createWorkflow(leaveApplicationId: string, approvers: {
        level: number;
        approverId: string;
    }[]): Promise<LeaveApprovalWorkflow[]>;
    getWorkflowForLeaveApplication(leaveApplicationId: string): Promise<LeaveApprovalWorkflow[]>;
    getWorkflowEntry(id: string): Promise<LeaveApprovalWorkflow>;
    updateWorkflowStatus(id: string, status: 'approved' | 'rejected', comments?: string): Promise<LeaveApprovalWorkflow>;
    getPendingApprovalsForUser(approverId: string): Promise<LeaveApprovalWorkflow[]>;
    getAllPendingApprovals(): Promise<LeaveApprovalWorkflow[]>;
    getApprovalStats(startDate?: Date, endDate?: Date): Promise<{
        period: {
            start: Date;
            end: Date;
        };
        summary: {
            total: number;
            approved: number;
            rejected: number;
            pending: number;
            avgResponseTime: number;
        };
        approverStats: {};
    }>;
    checkAllApproved(leaveApplicationId: string): Promise<boolean>;
    checkAnyRejected(leaveApplicationId: string): Promise<boolean>;
}

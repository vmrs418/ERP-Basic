import { LeaveApprovalWorkflowsService } from './leave-approval-workflows.service';
export declare class LeaveApprovalWorkflowsController {
    private readonly leaveApprovalWorkflowsService;
    constructor(leaveApprovalWorkflowsService: LeaveApprovalWorkflowsService);
    findPendingForUser(user: any): Promise<import("./entities/leave-approval-workflow.entity").LeaveApprovalWorkflow[]>;
    getWorkflowForApplication(leaveApplicationId: string, user: any): Promise<import("./entities/leave-approval-workflow.entity").LeaveApprovalWorkflow[]>;
    approveWorkflowStep(id: string, comments: string, user: any): Promise<import("./entities/leave-approval-workflow.entity").LeaveApprovalWorkflow>;
    rejectWorkflowStep(id: string, comments: string, user: any): Promise<import("./entities/leave-approval-workflow.entity").LeaveApprovalWorkflow>;
    getAllPendingApprovals(): Promise<import("./entities/leave-approval-workflow.entity").LeaveApprovalWorkflow[]>;
    getApprovalStats(startDate: string, endDate: string): Promise<{
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
}

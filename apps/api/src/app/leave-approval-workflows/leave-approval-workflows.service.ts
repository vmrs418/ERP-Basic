import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LeaveApprovalWorkflow } from './entities/leave-approval-workflow.entity';

@Injectable()
export class LeaveApprovalWorkflowsService {
  constructor(
    @InjectRepository(LeaveApprovalWorkflow)
    private readonly leaveApprovalWorkflowRepository: Repository<LeaveApprovalWorkflow>,
  ) {}

  async createWorkflow(leaveApplicationId: string, approvers: { level: number; approverId: string }[]) {
    const workflowEntries = approvers.map(approver => 
      this.leaveApprovalWorkflowRepository.create({
        leave_application_id: leaveApplicationId,
        approver_level: approver.level,
        approver_id: approver.approverId,
        status: 'pending',
      })
    );
    
    return this.leaveApprovalWorkflowRepository.save(workflowEntries);
  }

  async getWorkflowForLeaveApplication(leaveApplicationId: string) {
    return this.leaveApprovalWorkflowRepository.find({
      where: { leave_application_id: leaveApplicationId },
      order: { approver_level: 'ASC' },
      relations: ['approver'],
    });
  }

  async getWorkflowEntry(id: string) {
    const entry = await this.leaveApprovalWorkflowRepository.findOne({
      where: { id },
      relations: ['approver', 'leave_application'],
    });
    
    if (!entry) {
      throw new NotFoundException(`Workflow entry with ID ${id} not found`);
    }
    
    return entry;
  }

  async updateWorkflowStatus(
    id: string, 
    status: 'approved' | 'rejected', 
    comments?: string
  ) {
    const workflowEntry = await this.getWorkflowEntry(id);
    
    workflowEntry.status = status;
    workflowEntry.comments = comments;
    workflowEntry.actioned_at = new Date();
    
    return this.leaveApprovalWorkflowRepository.save(workflowEntry);
  }

  async getPendingApprovalsForUser(approverId: string) {
    return this.leaveApprovalWorkflowRepository.find({
      where: {
        approver_id: approverId,
        status: 'pending',
      },
      relations: ['leave_application', 'leave_application.employee', 'leave_application.leave_type'],
      order: {
        created_at: 'ASC'
      }
    });
  }

  async getAllPendingApprovals() {
    return this.leaveApprovalWorkflowRepository.find({
      where: {
        status: 'pending',
      },
      relations: ['leave_application', 'leave_application.employee', 'leave_application.leave_type', 'approver'],
      order: {
        created_at: 'ASC'
      }
    });
  }

  async getApprovalStats(startDate?: Date, endDate?: Date) {
    // Default to current month if dates not provided
    const now = new Date();
    const start = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get all workflow entries in the date range
    const entries = await this.leaveApprovalWorkflowRepository.find({
      where: {
        actioned_at: Between(start, end)
      },
      relations: ['approver']
    });

    // Calculate statistics
    const total = entries.length;
    const approved = entries.filter(entry => entry.status === 'approved').length;
    const rejected = entries.filter(entry => entry.status === 'rejected').length;
    const pending = entries.filter(entry => entry.status === 'pending').length;
    
    // Calculate average response time (in hours)
    const respondedEntries = entries.filter(entry => entry.status !== 'pending' && entry.actioned_at && entry.created_at);
    const avgResponseTime = respondedEntries.length > 0 
      ? respondedEntries.reduce((sum, entry) => {
          const responseTime = entry.actioned_at.getTime() - entry.created_at.getTime();
          return sum + (responseTime / (1000 * 60 * 60)); // Convert to hours
        }, 0) / respondedEntries.length
      : 0;

    // Get approver statistics
    const approverStats = {};
    entries.forEach(entry => {
      const approverId = entry.approver?.id || 'unknown';
      const approverName = entry.approver?.employee?.first_name || 'Unknown Approver';
      
      if (!approverStats[approverId]) {
        approverStats[approverId] = {
          name: approverName,
          total: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          avgResponseTime: 0,
          totalResponseTime: 0,
          respondedCount: 0
        };
      }
      
      approverStats[approverId].total += 1;
      
      if (entry.status === 'approved') {
        approverStats[approverId].approved += 1;
      } else if (entry.status === 'rejected') {
        approverStats[approverId].rejected += 1;
      } else if (entry.status === 'pending') {
        approverStats[approverId].pending += 1;
      }
      
      if (entry.status !== 'pending' && entry.actioned_at && entry.created_at) {
        const responseTime = (entry.actioned_at.getTime() - entry.created_at.getTime()) / (1000 * 60 * 60);
        approverStats[approverId].totalResponseTime += responseTime;
        approverStats[approverId].respondedCount += 1;
      }
    });
    
    // Calculate average response time for each approver
    Object.keys(approverStats).forEach(approverId => {
      const stats = approverStats[approverId];
      stats.avgResponseTime = stats.respondedCount > 0 
        ? stats.totalResponseTime / stats.respondedCount 
        : 0;
      delete stats.totalResponseTime;
      delete stats.respondedCount;
    });

    return {
      period: {
        start,
        end
      },
      summary: {
        total,
        approved,
        rejected,
        pending,
        avgResponseTime
      },
      approverStats
    };
  }

  async checkAllApproved(leaveApplicationId: string): Promise<boolean> {
    const workflow = await this.getWorkflowForLeaveApplication(leaveApplicationId);
    
    // If there's no workflow defined, return true (no approval needed)
    if (workflow.length === 0) {
      return true;
    }
    
    // Check if all workflow entries are approved
    return workflow.every(entry => entry.status === 'approved');
  }

  async checkAnyRejected(leaveApplicationId: string): Promise<boolean> {
    const workflow = await this.getWorkflowForLeaveApplication(leaveApplicationId);
    
    // Check if any workflow entry is rejected
    return workflow.some(entry => entry.status === 'rejected');
  }
} 
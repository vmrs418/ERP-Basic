import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ForbiddenException } from '@nestjs/common';
import { LeaveApprovalWorkflowsService } from './leave-approval-workflows.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('leave-approval-workflows')
@UseGuards(AuthGuard, RolesGuard)
export class LeaveApprovalWorkflowsController {
  constructor(private readonly leaveApprovalWorkflowsService: LeaveApprovalWorkflowsService) {}

  @Get('pending')
  async findPendingForUser(@CurrentUser() user: any) {
    return this.leaveApprovalWorkflowsService.getPendingApprovalsForUser(user.id);
  }

  @Get('application/:leaveApplicationId')
  async getWorkflowForApplication(
    @Param('leaveApplicationId') leaveApplicationId: string,
    @CurrentUser() user: any
  ) {
    // Check if user has rights to view this workflow (employee, approver, HR, admin)
    // This would require a more complex check in a real system
    return this.leaveApprovalWorkflowsService.getWorkflowForLeaveApplication(leaveApplicationId);
  }

  @Post(':id/approve')
  async approveWorkflowStep(
    @Param('id') id: string,
    @Body('comments') comments: string,
    @CurrentUser() user: any
  ) {
    // Verify that the current user is the assigned approver
    const workflow = await this.leaveApprovalWorkflowsService.getWorkflowEntry(id);
    
    if (workflow.approver_id !== user.id && !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
      throw new ForbiddenException('You are not authorized to approve this step');
    }
    
    return this.leaveApprovalWorkflowsService.updateWorkflowStatus(id, 'approved', comments);
  }

  @Post(':id/reject')
  async rejectWorkflowStep(
    @Param('id') id: string,
    @Body('comments') comments: string,
    @CurrentUser() user: any
  ) {
    // Verify that the current user is the assigned approver
    const workflow = await this.leaveApprovalWorkflowsService.getWorkflowEntry(id);
    
    if (workflow.approver_id !== user.id && !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
      throw new ForbiddenException('You are not authorized to reject this step');
    }
    
    if (!comments) {
      throw new ForbiddenException('A rejection reason is required');
    }
    
    return this.leaveApprovalWorkflowsService.updateWorkflowStatus(id, 'rejected', comments);
  }

  @Get('dashboard/pending-approvals')
  @Roles('admin', 'hr')
  async getAllPendingApprovals() {
    return this.leaveApprovalWorkflowsService.getAllPendingApprovals();
  }

  @Get('dashboard/approval-stats')
  @Roles('admin', 'hr')
  async getApprovalStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.leaveApprovalWorkflowsService.getApprovalStats(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }
} 
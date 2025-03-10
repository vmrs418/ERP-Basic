import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveApplication } from '../app/leave-applications/entities/leave-application.entity';
import { CreateLeaveApplicationDto } from '../app/leave-applications/dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from '../app/leave-applications/dto/update-leave-application.dto';
import { LeaveApprovalWorkflowsService } from '../app/leave-approval-workflows/leave-approval-workflows.service';
import { EmployeeLeaveBalancesService } from '../app/employee-leave-balances/employee-leave-balances.service';

@Injectable()
export class LeaveApplicationsService {
  constructor(
    @InjectRepository(LeaveApplication)
    private readonly leaveApplicationRepository: Repository<LeaveApplication>,
    private readonly leaveApprovalWorkflowService: LeaveApprovalWorkflowsService,
    private readonly employeeLeaveBalancesService: EmployeeLeaveBalancesService
  ) {}

  async create(createLeaveApplicationDto: CreateLeaveApplicationDto, createdById: string) {
    // Check if employee has sufficient leave balance
    const leaveBalance = await this.employeeLeaveBalancesService.findEmployeeLeaveBalance(
      createLeaveApplicationDto.employee_id,
      createLeaveApplicationDto.leave_type_id
    );

    // Calculate the leave duration
    const fromDate = new Date(createLeaveApplicationDto.from_date);
    const toDate = new Date(createLeaveApplicationDto.to_date);
    const daysDifference = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1;
    
    // Adjust for half days if applicable
    let duration = daysDifference;
    if (createLeaveApplicationDto.first_day_half) {
      duration -= 0.5;
    }
    if (createLeaveApplicationDto.last_day_half) {
      duration -= 0.5;
    }

    // Validate leave balance
    if (leaveBalance && leaveBalance.closing_balance < duration) {
      throw new BadRequestException(`Insufficient leave balance. Available: ${leaveBalance.closing_balance}, Requested: ${duration}`);
    }

    // Create the leave application
    const leaveApplication = this.leaveApplicationRepository.create({
      ...createLeaveApplicationDto,
      duration_days: duration,
      applied_at: new Date(),
      created_by: createdById,
      status: 'pending'
    });
    
    const savedApplication = await this.leaveApplicationRepository.save(leaveApplication);

    // Create approval workflow for this application
    // First, get the approvers from the employee's department hierarchy
    // This is simplified - you'd need to implement logic to determine approvers
    const approvers = [
      { level: 1, approverId: 'manager-id' }, // Placeholder - fetch from department hierarchy
      { level: 2, approverId: 'hr-id' } // Placeholder - HR approval
    ];

    await this.leaveApprovalWorkflowService.createWorkflow(savedApplication.id, approvers);

    return savedApplication;
  }

  async findAll(filters: { employeeId?: string; status?: string }) {
    const where: any = {};
    
    if (filters.employeeId) {
      where.employee_id = filters.employeeId;
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    return this.leaveApplicationRepository.find({
      where,
      relations: ['employee', 'leave_type', 'approver'],
      order: { applied_at: 'DESC' }
    });
  }

  async findOne(id: string) {
    const leaveApplication = await this.leaveApplicationRepository.findOne({
      where: { id },
      relations: ['employee', 'leave_type', 'approver', 'approval_workflow']
    });
    
    if (!leaveApplication) {
      throw new NotFoundException(`Leave application with ID ${id} not found`);
    }
    
    return leaveApplication;
  }

  async update(id: string, updateLeaveApplicationDto: UpdateLeaveApplicationDto, updatedById: string) {
    const leaveApplication = await this.findOne(id);
    
    if (leaveApplication.status !== 'pending') {
      throw new BadRequestException('Cannot update a leave application that is not in pending status');
    }
    
    const updatedApplication = {
      ...leaveApplication,
      ...updateLeaveApplicationDto,
      updated_by: updatedById,
    };
    
    return this.leaveApplicationRepository.save(updatedApplication);
  }

  async remove(id: string) {
    const leaveApplication = await this.findOne(id);
    return this.leaveApplicationRepository.remove(leaveApplication);
  }

  async approve(id: string, approverId: string) {
    const leaveApplication = await this.findOne(id);
    const workflow = await this.leaveApprovalWorkflowService.getWorkflowForLeaveApplication(id);
    
    // Find the current approver's entry in the workflow
    const currentApproverEntry = workflow.find(entry => 
      entry.approver_id === approverId && entry.status === 'pending'
    );
    
    if (!currentApproverEntry) {
      throw new BadRequestException('You are not authorized to approve this application or it is not pending your approval');
    }
    
    // Update the current approver's workflow entry
    await this.leaveApprovalWorkflowService.updateWorkflowStatus(
      currentApproverEntry.id,
      'approved'
    );
    
    // Check if all approvals are complete
    const allApproved = await this.leaveApprovalWorkflowService.checkAllApproved(id);
    
    if (allApproved) {
      // If all approvals are complete, update the leave application status
      leaveApplication.status = 'approved';
      leaveApplication.actioned_by = approverId;
      leaveApplication.actioned_at = new Date();
      
      // Update the employee's leave balance
      await this.employeeLeaveBalancesService.deductLeaveBalance(
        leaveApplication.employee_id,
        leaveApplication.leave_type_id,
        leaveApplication.duration_days
      );
      
      return this.leaveApplicationRepository.save(leaveApplication);
    }
    
    return { message: 'Your approval has been recorded. Waiting for other approvers.' };
  }

  async reject(id: string, rejectionReason: string, rejecterId: string) {
    const leaveApplication = await this.findOne(id);
    const workflow = await this.leaveApprovalWorkflowService.getWorkflowForLeaveApplication(id);
    
    // Find the current approver's entry in the workflow
    const currentApproverEntry = workflow.find(entry => 
      entry.approver_id === rejecterId && entry.status === 'pending'
    );
    
    if (!currentApproverEntry) {
      throw new BadRequestException('You are not authorized to reject this application or it is not pending your approval');
    }
    
    // Update the current approver's workflow entry
    await this.leaveApprovalWorkflowService.updateWorkflowStatus(
      currentApproverEntry.id,
      'rejected',
      rejectionReason
    );
    
    // Update the leave application status
    leaveApplication.status = 'rejected';
    leaveApplication.rejection_reason = rejectionReason;
    leaveApplication.actioned_by = rejecterId;
    leaveApplication.actioned_at = new Date();
    
    return this.leaveApplicationRepository.save(leaveApplication);
  }

  async cancel(id: string, user: any) {
    const leaveApplication = await this.findOne(id);
    
    // Only the employee who applied or an admin/HR can cancel
    if (leaveApplication.employee_id !== user.id && 
        !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
      throw new BadRequestException('You are not authorized to cancel this application');
    }
    
    // Can only cancel pending or approved applications
    if (!['pending', 'approved'].includes(leaveApplication.status)) {
      throw new BadRequestException(`Cannot cancel an application with status: ${leaveApplication.status}`);
    }
    
    // If it was approved, restore the leave balance
    if (leaveApplication.status === 'approved') {
      await this.employeeLeaveBalancesService.addLeaveBalance(
        leaveApplication.employee_id,
        leaveApplication.leave_type_id,
        leaveApplication.duration_days
      );
    }
    
    leaveApplication.status = 'cancelled';
    leaveApplication.cancelled_by = user.id;
    leaveApplication.cancelled_at = new Date();
    
    return this.leaveApplicationRepository.save(leaveApplication);
  }

  async findByEmployee(employeeId: string) {
    return this.leaveApplicationRepository.find({
      where: { employee_id: employeeId },
      relations: ['leave_type'],
      order: { applied_at: 'DESC' }
    });
  }

  async findPendingForApproval() {
    return this.leaveApplicationRepository.find({
      where: { status: 'pending' },
      relations: ['employee', 'leave_type'],
      order: { applied_at: 'ASC' }
    });
  }
  
  async findPendingForUser(approverId: string) {
    return this.leaveApprovalWorkflowService.getPendingApprovalsForUser(approverId);
  }
}

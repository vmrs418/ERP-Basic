import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveApplication } from './entities/leave-application.entity';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';

@Injectable()
export class LeaveApplicationsService {
  constructor(
    @InjectRepository(LeaveApplication)
    private leaveApplicationRepository: Repository<LeaveApplication>,
  ) {}

  async findAll(filters?: { employeeId?: string; status?: string }): Promise<LeaveApplication[]> {
    const query = this.leaveApplicationRepository.createQueryBuilder('leave_application')
      .leftJoinAndSelect('leave_application.employee', 'employee')
      .leftJoinAndSelect('leave_application.leave_type', 'leave_type');

    if (filters?.employeeId) {
      query.andWhere('leave_application.employee_id = :employeeId', { employeeId: filters.employeeId });
    }

    if (filters?.status) {
      query.andWhere('leave_application.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<LeaveApplication> {
    const application = await this.leaveApplicationRepository.findOne({ 
      where: { id },
      relations: ['employee', 'leave_type', 'approval_workflow']
    });

    if (!application) {
      throw new NotFoundException(`Leave application with ID ${id} not found`);
    }

    return application;
  }

  async create(createLeaveApplicationDto: CreateLeaveApplicationDto, userId: string): Promise<LeaveApplication> {
    const newLeaveApplication = this.leaveApplicationRepository.create({
      ...createLeaveApplicationDto,
      applied_at: new Date(),
      status: 'pending',
      created_by: userId
    });
    
    return this.leaveApplicationRepository.save(newLeaveApplication);
  }

  async update(id: string, updateLeaveApplicationDto: UpdateLeaveApplicationDto, user: any): Promise<LeaveApplication> {
    const application = await this.findOne(id);
    
    // Check if user has permission to update this application
    if (application.employee_id !== user.id && !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
      throw new ForbiddenException('You can only update your own leave applications');
    }
    
    // Only allow updates if the application is still pending
    if (application.status !== 'pending') {
      throw new ForbiddenException('Can only update pending leave applications');
    }

    await this.leaveApplicationRepository.update(id, {
      ...updateLeaveApplicationDto,
      updated_by: user.id
    });
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.leaveApplicationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Leave application with ID ${id} not found`);
    }
  }

  async approve(id: string, userId: string): Promise<LeaveApplication> {
    const application = await this.findOne(id);
    
    if (application.status !== 'pending') {
      throw new ForbiddenException('Can only approve pending leave applications');
    }
    
    await this.leaveApplicationRepository.update(id, {
      status: 'approved',
      actioned_by: userId,
      actioned_at: new Date(),
      approved_by: userId,
      approved_at: new Date()
    });
    
    return this.findOne(id);
  }

  async reject(id: string, rejectionReason: string, userId: string): Promise<LeaveApplication> {
    const application = await this.findOne(id);
    
    if (application.status !== 'pending') {
      throw new ForbiddenException('Can only reject pending leave applications');
    }
    
    await this.leaveApplicationRepository.update(id, {
      status: 'rejected',
      rejection_reason: rejectionReason,
      actioned_by: userId,
      actioned_at: new Date(),
      rejected_by: userId,
      rejected_at: new Date()
    });
    
    return this.findOne(id);
  }

  async cancel(id: string, user: any): Promise<LeaveApplication> {
    const application = await this.findOne(id);
    
    // Check if user has permission to cancel this application
    if (application.employee_id !== user.id && !user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
      throw new ForbiddenException('You can only cancel your own leave applications');
    }
    
    // Only allow cancellation if the application is still pending or approved
    if (!['pending', 'approved'].includes(application.status)) {
      throw new ForbiddenException('Can only cancel pending or approved leave applications');
    }
    
    await this.leaveApplicationRepository.update(id, {
      status: 'cancelled',
      cancelled_by: user.id,
      cancelled_at: new Date()
    });
    
    return this.findOne(id);
  }

  async findByEmployee(employeeId: string): Promise<LeaveApplication[]> {
    return this.leaveApplicationRepository.find({
      where: { employee_id: employeeId },
      relations: ['leave_type'],
      order: { applied_at: 'DESC' }
    });
  }

  async findPendingForApproval(): Promise<LeaveApplication[]> {
    return this.leaveApplicationRepository.find({
      where: { status: 'pending' },
      relations: ['employee', 'leave_type'],
      order: { applied_at: 'ASC' }
    });
  }
}

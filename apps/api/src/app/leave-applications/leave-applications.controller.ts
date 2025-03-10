import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ForbiddenException } from '@nestjs/common';
import { LeaveApplicationsService } from './leave-applications.service';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('leave-applications')
@UseGuards(AuthGuard, RolesGuard)
export class LeaveApplicationsController {
  constructor(private readonly leaveApplicationsService: LeaveApplicationsService) {}

  @Post()
  create(@Body() createLeaveApplicationDto: CreateLeaveApplicationDto, @CurrentUser() user: any) {
    // If the requester is not an admin or HR and trying to create for another employee
    if (!user.roles.some(role => ['admin', 'hr'].includes(role.name)) && 
        createLeaveApplicationDto.employee_id !== user.id) {
      throw new ForbiddenException('You can only create leave applications for yourself');
    }
    
    return this.leaveApplicationsService.create(createLeaveApplicationDto, user.id);
  }

  @Get()
  findAll(@Query('employee_id') employeeId: string, @Query('status') status: string, @CurrentUser() user: any) {
    // If the requester is not an admin or HR, only show their own applications
    if (!user.roles.some(role => ['admin', 'hr'].includes(role.name))) {
      return this.leaveApplicationsService.findAll({ employeeId: user.id, status });
    }
    
    return this.leaveApplicationsService.findAll({ employeeId, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leaveApplicationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateLeaveApplicationDto: UpdateLeaveApplicationDto,
    @CurrentUser() user: any
  ) {
    return this.leaveApplicationsService.update(id, updateLeaveApplicationDto, user);
  }

  @Delete(':id')
  @Roles('admin', 'hr')
  remove(@Param('id') id: string) {
    return this.leaveApplicationsService.remove(id);
  }

  @Post(':id/approve')
  @Roles('admin', 'hr')
  approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leaveApplicationsService.approve(id, user.id);
  }

  @Post(':id/reject')
  @Roles('admin', 'hr')
  reject(
    @Param('id') id: string, 
    @Body('rejection_reason') rejectionReason: string,
    @CurrentUser() user: any
  ) {
    return this.leaveApplicationsService.reject(id, rejectionReason, user.id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leaveApplicationsService.cancel(id, user);
  }

  @Get('employee/:employeeId')
  findByEmployee(@Param('employeeId') employeeId: string, @CurrentUser() user: any) {
    // If the requester is not an admin or HR and trying to see another employee's applications
    if (!user.roles.some(role => ['admin', 'hr'].includes(role.name)) && 
        employeeId !== user.id) {
      throw new ForbiddenException('You can only view your own leave applications');
    }
    
    return this.leaveApplicationsService.findByEmployee(employeeId);
  }

  @Get('pending/for-approval')
  @Roles('admin', 'hr')
  findPendingForApproval() {
    return this.leaveApplicationsService.findPendingForApproval();
  }
} 
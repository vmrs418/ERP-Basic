import { Controller, Get, Post, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { EmployeeLeaveBalancesService } from './employee-leave-balances.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('employee-leave-balances')
@UseGuards(AuthGuard, RolesGuard)
export class EmployeeLeaveBalancesController {
  constructor(private readonly employeeLeaveBalancesService: EmployeeLeaveBalancesService) {}

  @Get('employee/:employeeId/year/:year')
  async getEmployeeBalances(
    @Param('employeeId') employeeId: string,
    @Param('year') year: number,
    @CurrentUser() user: any
  ) {
    // Check if user is allowed to view this employee's balances
    const isAdminOrHR = user.roles.some(role => ['admin', 'hr'].includes(role.name));
    if (!isAdminOrHR && employeeId !== user.id) {
      throw new ForbiddenException('You can only view your own leave balances');
    }

    // In a real implementation, you would fetch all leave types and get balances for each
    // This is a simplified version
    return { message: 'Employee leave balances for the year', employeeId, year };
  }

  @Post('employee/:employeeId/leave-type/:leaveTypeId/adjust')
  @Roles('admin', 'hr')
  async adjustLeaveBalance(
    @Param('employeeId') employeeId: string,
    @Param('leaveTypeId') leaveTypeId: string,
    @Body() adjustmentData: { year: number; days: number; reason: string }
  ) {
    return this.employeeLeaveBalancesService.adjustLeave(
      employeeId,
      leaveTypeId,
      adjustmentData.year,
      adjustmentData.days,
      adjustmentData.reason
    );
  }

  @Post('employee/:employeeId/leave-type/:leaveTypeId/encash')
  @Roles('admin', 'hr')
  async encashLeave(
    @Param('employeeId') employeeId: string,
    @Param('leaveTypeId') leaveTypeId: string,
    @Body() encashmentData: { year: number; days: number }
  ) {
    return this.employeeLeaveBalancesService.encashLeave(
      employeeId,
      leaveTypeId,
      encashmentData.year,
      encashmentData.days
    );
  }

  @Post('employee/:employeeId/leave-type/:leaveTypeId/carry-forward')
  @Roles('admin', 'hr')
  async carryForwardLeave(
    @Param('employeeId') employeeId: string,
    @Param('leaveTypeId') leaveTypeId: string,
    @Body() carryForwardData: { fromYear: number; toYear: number; days: number }
  ) {
    return this.employeeLeaveBalancesService.carryForwardLeave(
      employeeId,
      leaveTypeId,
      carryForwardData.fromYear,
      carryForwardData.toYear,
      carryForwardData.days
    );
  }
} 
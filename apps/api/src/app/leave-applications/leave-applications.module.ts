import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveApplicationsService } from './leave-applications.service';
import { LeaveApplicationsController } from './leave-applications.controller';
import { LeaveApplication } from './entities/leave-application.entity';
import { LeaveTypesModule } from '../leave-types/leave-types.module';
import { EmployeesModule } from '../employees/employees.module';
import { EmployeeLeaveBalancesModule } from '../employee-leave-balances/employee-leave-balances.module';
import { LeaveApprovalWorkflowsModule } from '../leave-approval-workflows/leave-approval-workflows.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveApplication]),
    LeaveTypesModule,
    EmployeesModule,
    EmployeeLeaveBalancesModule,
    LeaveApprovalWorkflowsModule,
  ],
  controllers: [LeaveApplicationsController],
  providers: [LeaveApplicationsService],
  exports: [LeaveApplicationsService],
})
export class LeaveApplicationsModule {} 
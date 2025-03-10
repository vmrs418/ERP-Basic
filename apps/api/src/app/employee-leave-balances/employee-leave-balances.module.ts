import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeLeaveBalancesService } from './employee-leave-balances.service';
import { EmployeeLeaveBalancesController } from './employee-leave-balances.controller';
import { EmployeeLeaveBalance } from './entities/employee-leave-balance.entity';
import { LeaveTypesModule } from '../leave-types/leave-types.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeLeaveBalance]),
    LeaveTypesModule,
    EmployeesModule,
  ],
  controllers: [EmployeeLeaveBalancesController],
  providers: [EmployeeLeaveBalancesService],
  exports: [EmployeeLeaveBalancesService],
})
export class EmployeeLeaveBalancesModule {} 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { EmployeeDepartment } from '../employee-departments/entities/employee-department.entity';
import { EmployeeDesignation } from '../employee-designations/entities/employee-designation.entity';
import { EmployeeEmploymentType } from '../employee-employment-types/entities/employee-employment-type.entity';
import { SalaryDetail } from '../salary-details/entities/salary-detail.entity';
import { BankDetail } from '../bank-details/entities/bank-detail.entity';
import { Document } from '../documents/entities/document.entity';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmployeeDepartment,
      EmployeeDesignation,
      EmployeeEmploymentType,
      SalaryDetail,
      BankDetail,
      Document
    ]),
    SupabaseModule
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService]
})
export class EmployeesModule {} 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEmploymentType } from './entities/employee-employment-type.entity';
import { EmploymentTypesModule } from '../employment-types/employment-types.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeEmploymentType]),
    EmploymentTypesModule,
    EmployeesModule,
  ],
  exports: [TypeOrmModule],
})
export class EmployeeEmploymentTypesModule {} 
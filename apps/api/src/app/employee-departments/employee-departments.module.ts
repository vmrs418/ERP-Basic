import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeDepartment } from './entities/employee-department.entity';
import { DepartmentsModule } from '../departments/departments.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeDepartment]),
    DepartmentsModule,
    EmployeesModule,
  ],
  exports: [TypeOrmModule],
})
export class EmployeeDepartmentsModule {} 
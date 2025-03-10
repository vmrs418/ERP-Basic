import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeDesignation } from './entities/employee-designation.entity';
import { DesignationsModule } from '../designations/designations.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeDesignation]),
    DesignationsModule,
    EmployeesModule,
  ],
  exports: [TypeOrmModule],
})
export class EmployeeDesignationsModule {} 
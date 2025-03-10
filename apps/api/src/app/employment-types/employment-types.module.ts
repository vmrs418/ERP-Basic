import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmploymentType } from './entities/employment-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentType])],
  exports: [TypeOrmModule],
})
export class EmploymentTypesModule {} 
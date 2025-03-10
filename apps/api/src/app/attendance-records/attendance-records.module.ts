import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecordsController } from './attendance-records.controller';
import { AttendanceRecordsService } from './attendance-records.service';
import { AttendanceRecord } from './entities/attendance-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceRecord])
  ],
  controllers: [AttendanceRecordsController],
  providers: [AttendanceRecordsService],
  exports: [AttendanceRecordsService]
})
export class AttendanceRecordsModule {} 
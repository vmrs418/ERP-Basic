import { Repository } from 'typeorm';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { CreateAttendanceRecordDto, UpdateAttendanceRecordDto, CheckInDto, CheckOutDto, AttendanceFilterDto, IAttendanceRecordListResponse, IAttendanceRecord } from '@erp-system/shared-models';
export declare class AttendanceRecordsService {
    private attendanceRepository;
    constructor(attendanceRepository: Repository<AttendanceRecord>);
    create(createAttendanceRecordDto: CreateAttendanceRecordDto, currentUserId: string): Promise<IAttendanceRecord>;
    findAll(filterDto: AttendanceFilterDto): Promise<IAttendanceRecordListResponse>;
    findOne(id: string): Promise<AttendanceRecord>;
    findByEmployeeAndDate(employeeId: string, date: Date): Promise<AttendanceRecord>;
    update(id: string, updateAttendanceRecordDto: UpdateAttendanceRecordDto, currentUserId: string): Promise<AttendanceRecord>;
    remove(id: string): Promise<void>;
    checkIn(checkInDto: CheckInDto, currentUserId: string): Promise<AttendanceRecord>;
    checkOut(id: string, checkOutDto: CheckOutDto, currentUserId: string): Promise<AttendanceRecord>;
    private calculateWorkingHours;
    getAttendanceSummary(employeeId: string, month: number, year: number): Promise<any>;
}

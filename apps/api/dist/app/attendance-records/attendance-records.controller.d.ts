import { AttendanceRecordsService } from './attendance-records.service';
import { CreateAttendanceRecordDto, UpdateAttendanceRecordDto, CheckInDto, CheckOutDto, AttendanceFilterDto, IAttendanceRecordListResponse, IAttendanceRecord } from '@erp-system/shared-models';
export declare class AttendanceRecordsController {
    private readonly attendanceRecordsService;
    constructor(attendanceRecordsService: AttendanceRecordsService);
    create(createAttendanceRecordDto: CreateAttendanceRecordDto, req: any): Promise<IAttendanceRecord>;
    findAll(filterDto: AttendanceFilterDto): Promise<IAttendanceRecordListResponse>;
    findOne(id: string): Promise<import("./entities/attendance-record.entity").AttendanceRecord>;
    update(id: string, updateAttendanceRecordDto: UpdateAttendanceRecordDto, req: any): Promise<import("./entities/attendance-record.entity").AttendanceRecord>;
    remove(id: string): Promise<void>;
    checkIn(checkInDto: CheckInDto, req: any): Promise<import("./entities/attendance-record.entity").AttendanceRecord>;
    checkOut(id: string, checkOutDto: CheckOutDto, req: any): Promise<import("./entities/attendance-record.entity").AttendanceRecord>;
    getAttendanceSummary(employeeId: string, month: number, year: number): Promise<any>;
}

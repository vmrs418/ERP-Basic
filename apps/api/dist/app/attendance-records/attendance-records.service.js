"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRecordsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const attendance_record_entity_1 = require("./entities/attendance-record.entity");
const shared_utils_1 = require("@erp-system/shared-utils");
let AttendanceRecordsService = class AttendanceRecordsService {
    constructor(attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }
    async create(createAttendanceRecordDto, currentUserId) {
        const existingRecord = await this.attendanceRepository.findOne({
            where: {
                employee_id: createAttendanceRecordDto.employee_id,
                date: new Date((0, shared_utils_1.formatDate)(createAttendanceRecordDto.date))
            }
        });
        if (existingRecord) {
            throw new common_1.ConflictException('Attendance record already exists for this employee and date');
        }
        let workingHours = 0;
        if (createAttendanceRecordDto.check_out_time) {
            workingHours = this.calculateWorkingHours(createAttendanceRecordDto.check_in_time, createAttendanceRecordDto.check_out_time);
        }
        const attendanceRecord = this.attendanceRepository.create(Object.assign(Object.assign({}, createAttendanceRecordDto), { working_hours: workingHours, modified_by: currentUserId }));
        return this.attendanceRepository.save(attendanceRecord);
    }
    async findAll(filterDto) {
        const { page = 1, limit = 10, employee_id, from_date, to_date, status } = filterDto;
        const skip = (page - 1) * limit;
        const whereConditions = {};
        if (employee_id) {
            whereConditions.employee_id = employee_id;
        }
        if (from_date && to_date) {
            whereConditions.date = (0, typeorm_2.Between)(from_date, to_date);
        }
        else if (from_date) {
            whereConditions.date = (0, typeorm_2.MoreThanOrEqual)(from_date);
        }
        else if (to_date) {
            whereConditions.date = (0, typeorm_2.LessThanOrEqual)(to_date);
        }
        if (status) {
            whereConditions.status = status;
        }
        const [records, total] = await this.attendanceRepository.findAndCount({
            where: whereConditions,
            relations: ['employee'],
            skip,
            take: limit,
            order: { date: 'DESC', check_in_time: 'DESC' }
        });
        const totalPages = Math.ceil(total / limit);
        return {
            items: records,
            total,
            page,
            limit,
            total_pages: totalPages,
        };
    }
    async findOne(id) {
        const attendanceRecord = await this.attendanceRepository.findOne({
            where: { id },
            relations: ['employee']
        });
        if (!attendanceRecord) {
            throw new common_1.NotFoundException(`Attendance record with ID ${id} not found`);
        }
        return attendanceRecord;
    }
    async findByEmployeeAndDate(employeeId, date) {
        const formattedDate = (0, shared_utils_1.formatDate)(date);
        const record = await this.attendanceRepository.findOne({
            where: {
                employee_id: employeeId,
                date: new Date(formattedDate)
            }
        });
        if (!record) {
            throw new common_1.NotFoundException(`Attendance record not found for employee ${employeeId} on ${formattedDate}`);
        }
        return record;
    }
    async update(id, updateAttendanceRecordDto, currentUserId) {
        const attendanceRecord = await this.findOne(id);
        if (updateAttendanceRecordDto.check_out_time && attendanceRecord.check_in_time) {
            updateAttendanceRecordDto.working_hours = this.calculateWorkingHours(attendanceRecord.check_in_time, updateAttendanceRecordDto.check_out_time);
        }
        const updatedRecord = Object.assign(Object.assign(Object.assign({}, attendanceRecord), updateAttendanceRecordDto), { modified_by: currentUserId });
        return this.attendanceRepository.save(updatedRecord);
    }
    async remove(id) {
        const result = await this.attendanceRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Attendance record with ID ${id} not found`);
        }
    }
    async checkIn(checkInDto, currentUserId) {
        const today = new Date();
        const formattedToday = (0, shared_utils_1.formatDate)(today);
        const existingRecord = await this.findByEmployeeAndDate(checkInDto.employee_id, today);
        if (existingRecord) {
            throw new common_1.ConflictException('Employee has already checked in today');
        }
        const attendanceRecord = this.attendanceRepository.create({
            employee_id: checkInDto.employee_id,
            date: formattedToday,
            check_in_time: new Date(),
            working_hours: 0,
            status: attendance_record_entity_1.AttendanceStatus.PRESENT,
            source: checkInDto.source,
            location_check_in: checkInDto.location,
            ip_address_check_in: checkInDto.ip_address,
            modified_by: currentUserId
        });
        return this.attendanceRepository.save(attendanceRecord);
    }
    async checkOut(id, checkOutDto, currentUserId) {
        const attendanceRecord = await this.findOne(id);
        if (attendanceRecord.check_out_time) {
            throw new common_1.BadRequestException('Employee has already checked out');
        }
        const checkOutTime = new Date();
        const workingHours = this.calculateWorkingHours(attendanceRecord.check_in_time, checkOutTime);
        const updatedRecord = Object.assign(Object.assign({}, attendanceRecord), { check_out_time: checkOutTime, working_hours: workingHours, location_check_out: checkOutDto.location, ip_address_check_out: checkOutDto.ip_address, remarks: checkOutDto.remarks, modified_by: currentUserId });
        return this.attendanceRepository.save(updatedRecord);
    }
    calculateWorkingHours(checkInTime, checkOutTime) {
        const diffMs = checkOutTime.getTime() - checkInTime.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return Math.round(diffHours * 100) / 100;
    }
    async getAttendanceSummary(employeeId, month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const records = await this.attendanceRepository.find({
            where: {
                employee_id: employeeId,
                date: (0, typeorm_2.Between)(startDate, endDate)
            },
            order: { date: 'ASC' }
        });
        const businessDays = (0, shared_utils_1.calculateBusinessDaysBetweenDates)(startDate, endDate);
        let presentDays = 0;
        let absentDays = 0;
        let halfDays = 0;
        let leaveDays = 0;
        let lateArrivals = 0;
        let earlyDepartures = 0;
        let totalWorkingHours = 0;
        records.forEach(record => {
            totalWorkingHours += record.working_hours;
            switch (record.status) {
                case attendance_record_entity_1.AttendanceStatus.PRESENT:
                    presentDays++;
                    break;
                case attendance_record_entity_1.AttendanceStatus.ABSENT:
                    absentDays++;
                    break;
                case attendance_record_entity_1.AttendanceStatus.HALF_DAY:
                    halfDays++;
                    break;
                case attendance_record_entity_1.AttendanceStatus.ON_LEAVE:
                    leaveDays++;
                    break;
            }
        });
        const attendancePercentage = (presentDays / businessDays) * 100;
        return {
            employee_id: employeeId,
            month,
            year,
            business_days: businessDays,
            present_days: presentDays,
            absent_days: absentDays,
            half_days: halfDays,
            leave_days: leaveDays,
            late_arrivals: lateArrivals,
            early_departures: earlyDepartures,
            total_working_hours: totalWorkingHours,
            attendance_percentage: attendancePercentage
        };
    }
};
exports.AttendanceRecordsService = AttendanceRecordsService;
exports.AttendanceRecordsService = AttendanceRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_record_entity_1.AttendanceRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AttendanceRecordsService);
//# sourceMappingURL=attendance-records.service.js.map
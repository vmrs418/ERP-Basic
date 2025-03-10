import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, FindOptionsWhere } from 'typeorm';
import { AttendanceRecord, AttendanceStatus } from './entities/attendance-record.entity';
import { 
  CreateAttendanceRecordDto, 
  UpdateAttendanceRecordDto, 
  CheckInDto,
  CheckOutDto,
  AttendanceFilterDto,
  IAttendanceRecordListResponse,
  IAttendanceRecord
} from '@erp-system/shared-models';
import { calculateBusinessDaysBetweenDates, formatDate } from '@erp-system/shared-utils';

@Injectable()
export class AttendanceRecordsService {
  constructor(
    @InjectRepository(AttendanceRecord)
    private attendanceRepository: Repository<AttendanceRecord>,
  ) {}

  async create(createAttendanceRecordDto: CreateAttendanceRecordDto, currentUserId: string): Promise<IAttendanceRecord> {
    // Check if an attendance record for this employee and date already exists
    const existingRecord = await this.attendanceRepository.findOne({
      where: {
        employee_id: createAttendanceRecordDto.employee_id,
        date: new Date(formatDate(createAttendanceRecordDto.date))
      }
    });

    if (existingRecord) {
      throw new ConflictException('Attendance record already exists for this employee and date');
    }

    // Calculate working hours if check-out time is provided
    let workingHours = 0;
    if (createAttendanceRecordDto.check_out_time) {
      workingHours = this.calculateWorkingHours(
        createAttendanceRecordDto.check_in_time, 
        createAttendanceRecordDto.check_out_time
      );
    }

    const attendanceRecord = this.attendanceRepository.create({
      ...createAttendanceRecordDto,
      working_hours: workingHours,
      modified_by: currentUserId
    });

    return this.attendanceRepository.save(attendanceRecord);
  }

  async findAll(filterDto: AttendanceFilterDto): Promise<IAttendanceRecordListResponse> {
    const { page = 1, limit = 10, employee_id, from_date, to_date, status } = filterDto;
    const skip = (page - 1) * limit;

    // Build the where conditions
    const whereConditions: FindOptionsWhere<AttendanceRecord> = {};
    
    if (employee_id) {
      whereConditions.employee_id = employee_id;
    }
    
    if (from_date && to_date) {
      whereConditions.date = Between(from_date, to_date);
    } else if (from_date) {
      whereConditions.date = MoreThanOrEqual(from_date);
    } else if (to_date) {
      whereConditions.date = LessThanOrEqual(to_date);
    }
    
    if (status) {
      whereConditions.status = status;
    }

    // Get the count of records matching the criteria
    const [records, total] = await this.attendanceRepository.findAndCount({
      where: whereConditions,
      relations: ['employee'],
      skip,
      take: limit,
      order: { date: 'DESC', check_in_time: 'DESC' }
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      items: records,
      total,
      page,
      limit,
      total_pages: totalPages,
    };
  }

  async findOne(id: string): Promise<AttendanceRecord> {
    const attendanceRecord = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['employee']
    });

    if (!attendanceRecord) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return attendanceRecord;
  }

  async findByEmployeeAndDate(employeeId: string, date: Date): Promise<AttendanceRecord> {
    const formattedDate = formatDate(date);
    const record = await this.attendanceRepository.findOne({
      where: {
        employee_id: employeeId,
        date: new Date(formattedDate)
      }
    });

    if (!record) {
      throw new NotFoundException(`Attendance record not found for employee ${employeeId} on ${formattedDate}`);
    }

    return record;
  }

  async update(id: string, updateAttendanceRecordDto: UpdateAttendanceRecordDto, currentUserId: string): Promise<AttendanceRecord> {
    const attendanceRecord = await this.findOne(id);

    // If check-out time is provided, recalculate working hours
    if (updateAttendanceRecordDto.check_out_time && attendanceRecord.check_in_time) {
      updateAttendanceRecordDto.working_hours = this.calculateWorkingHours(
        attendanceRecord.check_in_time,
        updateAttendanceRecordDto.check_out_time
      );
    }

    // Update the record with the DTO values and set modified_by
    const updatedRecord = {
      ...attendanceRecord,
      ...updateAttendanceRecordDto,
      modified_by: currentUserId
    };

    return this.attendanceRepository.save(updatedRecord);
  }

  async remove(id: string): Promise<void> {
    const result = await this.attendanceRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
  }

  async checkIn(checkInDto: CheckInDto, currentUserId: string): Promise<AttendanceRecord> {
    const today = new Date();
    const formattedToday = formatDate(today);
    
    // Check if the employee has already checked in today
    const existingRecord = await this.findByEmployeeAndDate(checkInDto.employee_id, today);
    
    if (existingRecord) {
      throw new ConflictException('Employee has already checked in today');
    }
    
    // Create new attendance record
    const attendanceRecord = this.attendanceRepository.create({
      employee_id: checkInDto.employee_id,
      date: formattedToday,
      check_in_time: new Date(),
      working_hours: 0,
      status: AttendanceStatus.PRESENT,
      source: checkInDto.source,
      location_check_in: checkInDto.location,
      ip_address_check_in: checkInDto.ip_address,
      modified_by: currentUserId
    });
    
    return this.attendanceRepository.save(attendanceRecord);
  }

  async checkOut(id: string, checkOutDto: CheckOutDto, currentUserId: string): Promise<AttendanceRecord> {
    const attendanceRecord = await this.findOne(id);
    
    // Check if already checked out
    if (attendanceRecord.check_out_time) {
      throw new BadRequestException('Employee has already checked out');
    }
    
    const checkOutTime = new Date();
    
    // Calculate working hours
    const workingHours = this.calculateWorkingHours(
      attendanceRecord.check_in_time,
      checkOutTime
    );
    
    // Update the record
    const updatedRecord = {
      ...attendanceRecord,
      check_out_time: checkOutTime,
      working_hours: workingHours,
      location_check_out: checkOutDto.location,
      ip_address_check_out: checkOutDto.ip_address,
      remarks: checkOutDto.remarks,
      modified_by: currentUserId
    };
    
    return this.attendanceRepository.save(updatedRecord);
  }

  private calculateWorkingHours(checkInTime: Date, checkOutTime: Date): number {
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Round to 2 decimal places
    return Math.round(diffHours * 100) / 100;
  }

  async getAttendanceSummary(employeeId: string, month: number, year: number): Promise<any> {
    // Create date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    
    // Get all attendance records for the employee in the given month
    const records = await this.attendanceRepository.find({
      where: {
        employee_id: employeeId,
        date: Between(startDate, endDate)
      },
      order: { date: 'ASC' }
    });
    
    // Calculate business days in the month
    const businessDays = calculateBusinessDaysBetweenDates(startDate, endDate);
    
    // Initialize counters
    let presentDays = 0;
    let absentDays = 0;
    let halfDays = 0;
    let leaveDays = 0;
    let lateArrivals = 0;
    let earlyDepartures = 0;
    let totalWorkingHours = 0;
    
    // Count the different status types
    records.forEach(record => {
      totalWorkingHours += record.working_hours;
      
      switch (record.status) {
        case AttendanceStatus.PRESENT:
          presentDays++;
          break;
        case AttendanceStatus.ABSENT:
          absentDays++;
          break;
        case AttendanceStatus.HALF_DAY:
          halfDays++;
          break;
        case AttendanceStatus.ON_LEAVE:
          leaveDays++;
          break;
      }
      
      // Additional logic for late arrivals and early departures could be added here
    });
    
    // Calculate attendance percentage
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
} 
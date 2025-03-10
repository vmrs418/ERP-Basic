import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AttendanceRecordsService } from './attendance-records.service';
import {
  CreateAttendanceRecordDto,
  UpdateAttendanceRecordDto,
  CheckInDto,
  CheckOutDto,
  AttendanceFilterDto,
  IAttendanceRecordListResponse,
  IAttendanceRecord
} from '@erp-system/shared-models';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('attendance-records')
@UseGuards(JwtAuthGuard)
export class AttendanceRecordsController {
  constructor(private readonly attendanceRecordsService: AttendanceRecordsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAttendanceRecordDto: CreateAttendanceRecordDto,
    @Request() req
  ): Promise<IAttendanceRecord> {
    return this.attendanceRecordsService.create(
      createAttendanceRecordDto,
      req.user.userId
    );
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr', 'manager')
  async findAll(
    @Query() filterDto: AttendanceFilterDto
  ): Promise<IAttendanceRecordListResponse> {
    return this.attendanceRecordsService.findAll(filterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.attendanceRecordsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr')
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceRecordDto: UpdateAttendanceRecordDto,
    @Request() req
  ) {
    return this.attendanceRecordsService.update(
      id,
      updateAttendanceRecordDto,
      req.user.userId
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.attendanceRecordsService.remove(id);
  }

  @Post('check-in')
  @HttpCode(HttpStatus.CREATED)
  async checkIn(@Body() checkInDto: CheckInDto, @Request() req) {
    // Check that the employee ID is either the user's own employee ID or they have admin/HR role
    // This is simplified - real implementation would verify current user's employee ID
    return this.attendanceRecordsService.checkIn(checkInDto, req.user.userId);
  }

  @Patch(':id/check-out')
  @HttpCode(HttpStatus.OK)
  async checkOut(
    @Param('id') id: string,
    @Body() checkOutDto: CheckOutDto,
    @Request() req
  ) {
    // Similar check as with check-in
    return this.attendanceRecordsService.checkOut(id, checkOutDto, req.user.userId);
  }

  @Get('summary/:employeeId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'hr', 'manager')
  async getAttendanceSummary(
    @Param('employeeId') employeeId: string,
    @Query('month') month: number,
    @Query('year') year: number
  ) {
    return this.attendanceRecordsService.getAttendanceSummary(
      employeeId, 
      month || new Date().getMonth() + 1,
      year || new Date().getFullYear()
    );
  }
} 
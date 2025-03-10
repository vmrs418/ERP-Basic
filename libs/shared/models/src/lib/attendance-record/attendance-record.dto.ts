import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsDate, 
  IsNumber, 
  Min,
  IsIP,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus, AttendanceSource } from './attendance-record.interface';

export class CreateAttendanceRecordDto {
  @IsUUID()
  employee_id!: string;

  @IsDate()
  @Type(() => Date)
  date!: Date;

  @IsDate()
  @Type(() => Date)
  check_in_time!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  check_out_time?: Date;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsEnum(AttendanceSource)
  source?: AttendanceSource;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location_check_in?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location_check_out?: string;

  @IsOptional()
  @IsIP()
  ip_address_check_in?: string;

  @IsOptional()
  @IsIP()
  ip_address_check_out?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;
}

export class UpdateAttendanceRecordDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  check_out_time?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  working_hours?: number;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location_check_out?: string;

  @IsOptional()
  @IsIP()
  ip_address_check_out?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;
}

export class CheckInDto {
  @IsUUID()
  employee_id!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @IsOptional()
  @IsIP()
  ip_address?: string;

  @IsOptional()
  @IsEnum(AttendanceSource)
  source?: AttendanceSource = AttendanceSource.WEB;
}

export class CheckOutDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @IsOptional()
  @IsIP()
  ip_address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;
}

export class AttendanceFilterDto {
  @IsOptional()
  @IsUUID()
  employee_id?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to_date?: Date;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
} 
import { IsString, IsUUID, IsDate, IsNumber, IsBoolean, IsOptional, IsEnum, IsISO8601, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLeaveApplicationDto {
  @IsUUID()
  employee_id: string;

  @IsUUID()
  leave_type_id: string;

  @IsISO8601()
  @Transform(({ value }) => new Date(value))
  from_date: Date;

  @IsISO8601()
  @Transform(({ value }) => new Date(value))
  to_date: Date;

  @IsNumber()
  @Min(0.5)
  @IsOptional()
  duration_days?: number;

  @IsBoolean()
  @IsOptional()
  first_day_half: boolean = false;

  @IsBoolean()
  @IsOptional()
  last_day_half: boolean = false;

  @IsString()
  reason: string;

  @IsString()
  contact_during_leave: string;

  @IsUUID()
  @IsOptional()
  handover_to?: string;

  @IsString()
  @IsOptional()
  handover_notes?: string;

  @IsEnum(['draft', 'pending', 'approved', 'rejected', 'cancelled'])
  @IsOptional()
  status: string = 'pending';

  @IsString()
  @IsOptional()
  attachment_url?: string;
} 
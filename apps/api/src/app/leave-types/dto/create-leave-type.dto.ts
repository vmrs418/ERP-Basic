import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  color_code: string;

  @IsNotEmpty()
  @IsBoolean()
  is_paid: boolean;

  @IsNotEmpty()
  @IsBoolean()
  is_encashable: boolean;

  @IsNotEmpty()
  @IsBoolean()
  requires_approval: boolean;

  @IsOptional()
  @IsNumber()
  max_consecutive_days?: number;

  @IsNotEmpty()
  @IsNumber()
  min_days_before_application: number;
} 
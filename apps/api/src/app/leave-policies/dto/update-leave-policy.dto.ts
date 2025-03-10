import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateLeavePolicyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  effective_from?: string;

  @IsOptional()
  @IsDateString()
  effective_to?: string;

  @IsOptional()
  @IsBoolean()
  is_current?: boolean;

  @IsOptional()
  @IsBoolean()
  applies_to_probation?: boolean;
} 
import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  IsEnum, 
  IsArray, 
  ArrayMinSize, 
  ArrayMaxSize, 
  Min, 
  Max 
} from 'class-validator';
import { AccrualType } from '../entities/leave-policy-detail.entity';

export class UpdateLeavePolicyDetailDto {
  @IsOptional()
  @IsString()
  leave_type_id?: string;

  @IsOptional()
  @IsString()
  leave_policy_id?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  annual_quota?: number;

  @IsOptional()
  @IsEnum(AccrualType)
  accrual_type?: AccrualType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carry_forward_limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  encashment_limit?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(12)
  applicable_months?: number[];
} 
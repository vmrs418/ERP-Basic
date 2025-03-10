import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsEnum, 
  IsArray, 
  ArrayMinSize, 
  ArrayMaxSize, 
  Min 
} from 'class-validator';
import { AccrualType } from '../entities/leave-policy-detail.entity';

export class CreateLeavePolicyDetailDto {
  @IsNotEmpty()
  @IsString()
  leave_type_id: string;

  @IsNotEmpty()
  @IsString()
  leave_policy_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  annual_quota: number;

  @IsNotEmpty()
  @IsEnum(AccrualType)
  accrual_type: AccrualType;

  @IsNumber()
  @Min(0)
  carry_forward_limit: number;

  @IsNumber()
  @Min(0)
  encashment_limit: number;

  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(12)
  applicable_months: number[];
} 
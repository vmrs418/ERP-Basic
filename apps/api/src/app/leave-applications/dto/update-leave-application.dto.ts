import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveApplicationDto } from './create-leave-application.dto';
import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export class UpdateLeaveApplicationDto extends PartialType(CreateLeaveApplicationDto) {
  // Additional fields specific to updates
  @IsUUID()
  @IsOptional()
  actioned_by?: string;

  @IsEnum(['pending', 'approved', 'rejected', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';

  @IsString()
  @IsOptional()
  rejection_reason?: string;
} 
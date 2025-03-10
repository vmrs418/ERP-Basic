import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsUUID, 
  IsDate, 
  IsEnum, 
  IsNumber, 
  IsBoolean,
  MinLength,
  MaxLength,
  IsISO8601,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

enum EmployeeStatus {
  ACTIVE = 'active',
  ON_NOTICE = 'on_notice',
  TERMINATED = 'terminated',
  ON_LEAVE = 'on_leave',
  ABSCONDING = 'absconding'
}

export class CreateEmployeeDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  employee_code: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  first_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  middle_name?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  last_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsEmail()
  personal_email?: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be 10 digits' })
  phone: string;

  @IsOptional()
  @IsString()
  alternate_phone?: string;

  @IsISO8601()
  @Type(() => Date)
  date_of_birth: Date;

  @IsISO8601()
  @Type(() => Date)
  date_of_joining: Date;

  @IsNumber()
  probation_period_months: number;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  confirmation_date?: Date;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(MaritalStatus)
  marital_status: MaritalStatus;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @IsString()
  emergency_contact_name: string;

  @IsString()
  emergency_contact_relation: string;

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Emergency contact phone must be 10 digits' })
  emergency_contact_phone: string;

  @IsString()
  current_address: string;

  @IsString()
  permanent_address: string;

  @IsOptional()
  @IsString()
  nationality?: string = 'Indian';

  @IsString()
  @Matches(/^[0-9]{12}$/, { message: 'Aadhaar number must be 12 digits' })
  aadhaar_number: string;

  @IsString()
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN number format' })
  pan_number: string;

  @IsOptional()
  @IsString()
  passport_number?: string;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  passport_expiry?: Date;

  @IsOptional()
  @IsString()
  profile_picture_url?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus = EmployeeStatus.ACTIVE;

  @IsOptional()
  @IsNumber()
  notice_period_days?: number;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  last_working_date?: Date;

  @IsOptional()
  @IsString()
  termination_reason?: string;
}

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  employee_code?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  middle_name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  personal_email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be 10 digits' })
  phone?: string;

  @IsOptional()
  @IsString()
  alternate_phone?: string;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  date_of_birth?: Date;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  date_of_joining?: Date;

  @IsOptional()
  @IsNumber()
  probation_period_months?: number;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  confirmation_date?: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(MaritalStatus)
  marital_status?: MaritalStatus;

  @IsOptional()
  @IsString()
  blood_group?: string;

  @IsOptional()
  @IsString()
  emergency_contact_name?: string;

  @IsOptional()
  @IsString()
  emergency_contact_relation?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Emergency contact phone must be 10 digits' })
  emergency_contact_phone?: string;

  @IsOptional()
  @IsString()
  current_address?: string;

  @IsOptional()
  @IsString()
  permanent_address?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{12}$/, { message: 'Aadhaar number must be 12 digits' })
  aadhaar_number?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN number format' })
  pan_number?: string;

  @IsOptional()
  @IsString()
  passport_number?: string;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  passport_expiry?: Date;

  @IsOptional()
  @IsString()
  profile_picture_url?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @IsOptional()
  @IsNumber()
  notice_period_days?: number;

  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  last_working_date?: Date;

  @IsOptional()
  @IsString()
  termination_reason?: string;
}

export class EmployeeFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  department_id?: string;

  @IsOptional()
  @IsUUID()
  designation_id?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sort_by?: string = 'employee_code';

  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'asc';
}

export class BulkEmployeeUploadDto {
  @IsBoolean()
  update_existing: boolean;

  @IsString({ each: true })
  required_fields: string[];
} 
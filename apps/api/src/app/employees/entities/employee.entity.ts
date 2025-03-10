import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmployeeDepartment } from '../../employee-departments/entities/employee-department.entity';
import { EmployeeDesignation } from '../../employee-designations/entities/employee-designation.entity';
import { EmployeeEmploymentType } from '../../employee-employment-types/entities/employee-employment-type.entity';
import { SalaryDetail } from '../../salary-details/entities/salary-detail.entity';
import { BankDetail } from '../../bank-details/entities/bank-detail.entity';
import { Document } from '../../documents/entities/document.entity';
import { AttendanceRecord } from '../../attendance-records/entities/attendance-record.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  employee_code: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  middle_name?: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  personal_email?: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  alternate_phone?: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ type: 'date' })
  date_of_joining: Date;

  @Column()
  probation_period_months: number;

  @Column({ type: 'date', nullable: true })
  confirmation_date?: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'] })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'enum', enum: ['single', 'married', 'divorced', 'widowed'] })
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';

  @Column({ nullable: true })
  blood_group?: string;

  @Column()
  emergency_contact_name: string;

  @Column()
  emergency_contact_relation: string;

  @Column()
  emergency_contact_phone: string;

  @Column({ type: 'text' })
  current_address: string;

  @Column({ type: 'text' })
  permanent_address: string;

  @Column({ default: 'Indian' })
  nationality: string;

  @Column({ unique: true })
  aadhaar_number: string;

  @Column({ unique: true })
  pan_number: string;

  @Column({ nullable: true, unique: true })
  passport_number?: string;

  @Column({ type: 'date', nullable: true })
  passport_expiry?: Date;

  @Column({ nullable: true })
  profile_picture_url?: string;

  @Column({ 
    type: 'enum', 
    enum: ['active', 'on_notice', 'terminated', 'on_leave', 'absconding'],
    default: 'active'
  })
  status: 'active' | 'on_notice' | 'terminated' | 'on_leave' | 'absconding';

  @Column({ nullable: true })
  notice_period_days?: number;

  @Column({ type: 'date', nullable: true })
  last_working_date?: Date;

  @Column({ type: 'text', nullable: true })
  termination_reason?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  created_by: string;

  @Column()
  updated_by: string;

  // Relationships
  @OneToMany(() => EmployeeDepartment, employeeDepartment => employeeDepartment.employee)
  departments: EmployeeDepartment[];

  @OneToMany(() => EmployeeDesignation, employeeDesignation => employeeDesignation.employee)
  designations: EmployeeDesignation[];

  @OneToMany(() => EmployeeEmploymentType, employeeEmploymentType => employeeEmploymentType.employee)
  employmentTypes: EmployeeEmploymentType[];

  @OneToMany(() => SalaryDetail, salaryDetail => salaryDetail.employee)
  salaryDetails: SalaryDetail[];

  @OneToMany(() => BankDetail, bankDetail => bankDetail.employee)
  bankDetails: BankDetail[];

  @OneToMany(() => Document, document => document.employee)
  documents: Document[];

  @OneToMany(() => AttendanceRecord, attendanceRecord => attendanceRecord.employee)
  attendance_records: AttendanceRecord[];
} 
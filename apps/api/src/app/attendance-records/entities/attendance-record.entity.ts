import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { User } from '../../users/entities/user.entity';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  HALF_DAY = 'half_day',
  WEEKEND = 'weekend',
  HOLIDAY = 'holiday',
  ON_LEAVE = 'on_leave'
}

export enum AttendanceSource {
  BIOMETRIC = 'biometric',
  WEB = 'web',
  MOBILE = 'mobile',
  MANUAL = 'manual'
}

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id' })
  @Index()
  employee_id: string;

  @ManyToOne(() => Employee, employee => employee.attendance_records)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'date' })
  @Index()
  date: Date;

  @Column({ name: 'check_in_time', type: 'timestamp' })
  check_in_time: Date;

  @Column({ name: 'check_out_time', type: 'timestamp', nullable: true })
  check_out_time: Date | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  working_hours: number;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT
  })
  status: AttendanceStatus;

  @Column({
    type: 'enum',
    enum: AttendanceSource,
    default: AttendanceSource.WEB
  })
  source: AttendanceSource;

  @Column({ name: 'location_check_in', nullable: true })
  location_check_in: string | null;

  @Column({ name: 'location_check_out', nullable: true })
  location_check_out: string | null;

  @Column({ name: 'ip_address_check_in', nullable: true })
  ip_address_check_in: string | null;

  @Column({ name: 'ip_address_check_out', nullable: true })
  ip_address_check_out: string | null;

  @Column({ type: 'text', nullable: true })
  remarks: string | null;

  @Column({ type: 'boolean', default: false })
  is_overtime: boolean;

  @Column({ type: 'float', default: 0 })
  overtime_hours: number;

  @Column({ type: 'boolean', default: false })
  is_modified: boolean;

  @Column({ name: 'modified_by', nullable: true })
  modified_by: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modified_by' })
  modifier: User | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  modified_at: Date;

  @Column({ type: 'text', nullable: true })
  modification_reason: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
} 
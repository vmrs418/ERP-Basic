import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { AttendanceRecord } from '../../attendance-records/entities/attendance-record.entity';
import { User } from '../../users/entities/user.entity';

@Entity('attendance_corrections')
export class AttendanceCorrection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  attendance_id: string;

  @Column()
  employee_id: string;

  @Column({ type: 'timestamp', nullable: true })
  original_check_in?: Date;

  @Column({ type: 'timestamp', nullable: true })
  original_check_out?: Date;

  @Column({ type: 'timestamp', nullable: true })
  corrected_check_in?: Date;

  @Column({ type: 'timestamp', nullable: true })
  corrected_check_out?: Date;

  @Column({ type: 'text' })
  reason: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  reviewed_by?: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at?: Date;

  @Column({ type: 'text', nullable: true })
  review_comments?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => AttendanceRecord)
  @JoinColumn({ name: 'attendance_id' })
  attendance: AttendanceRecord;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer?: User;
} 
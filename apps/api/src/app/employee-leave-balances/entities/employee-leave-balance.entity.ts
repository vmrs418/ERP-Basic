import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { LeaveType } from '../../leave-types/entities/leave-type.entity';

@Entity('employee_leave_balances')
export class EmployeeLeaveBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column()
  leave_type_id: string;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  opening_balance: number;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  accrued: number;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  used: number;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  adjusted: number;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  encashed: number;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  carried_forward: number;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  closing_balance: number;

  @Column({ type: 'timestamp' })
  last_updated: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => LeaveType, leaveType => leaveType.employee_balances)
  @JoinColumn({ name: 'leave_type_id' })
  leave_type: LeaveType;
} 
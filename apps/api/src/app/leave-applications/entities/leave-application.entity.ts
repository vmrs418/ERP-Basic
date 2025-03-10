import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { LeaveType } from '../../leave-types/entities/leave-type.entity';
import { User } from '../../users/entities/user.entity';
import { LeaveApprovalWorkflow } from '../../leave-approval-workflows/entities/leave-approval-workflow.entity';

@Entity('leave_applications')
export class LeaveApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id' })
  employee_id: string;

  @Column({ name: 'leave_type_id' })
  leave_type_id: string;

  @Column({ type: 'date' })
  from_date: Date;

  @Column({ type: 'date' })
  to_date: Date;

  @Column({ type: 'decimal', precision: 5, scale: 1 })
  duration_days: number;

  @Column({ default: false })
  first_day_half: boolean;

  @Column({ default: false })
  last_day_half: boolean;

  @Column({ type: 'text' })
  reason: string;

  @Column()
  contact_during_leave: string;

  @Column({ nullable: true })
  handover_to?: string;

  @Column({ type: 'text', nullable: true })
  handover_notes?: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'timestamp' })
  applied_at: Date;

  @Column({ nullable: true })
  actioned_by?: string;

  @Column({ type: 'timestamp', nullable: true })
  actioned_at?: Date;

  @Column({ nullable: true })
  rejection_reason?: string;

  @Column({ nullable: true })
  attachment_url?: string;

  @Column({ name: 'created_by', nullable: true })
  created_by: string;

  @Column({ name: 'updated_by', nullable: true })
  updated_by: string;

  @Column({ name: 'approved_by', nullable: true })
  approved_by: string;

  @Column({ name: 'rejected_by', nullable: true })
  rejected_by: string;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelled_by: string;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejected_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => LeaveType, leaveType => leaveType.leave_applications)
  @JoinColumn({ name: 'leave_type_id' })
  leave_type: LeaveType;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actioned_by' })
  approver?: User;

  @OneToMany(() => LeaveApprovalWorkflow, workflow => workflow.leave_application)
  approval_workflow: LeaveApprovalWorkflow[];
} 
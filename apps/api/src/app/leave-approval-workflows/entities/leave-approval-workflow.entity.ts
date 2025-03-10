import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LeaveApplication } from '../../leave-applications/entities/leave-application.entity';
import { User } from '../../users/entities/user.entity';

@Entity('leave_approval_workflows')
export class LeaveApprovalWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  leave_application_id: string;

  @Column()
  approver_level: number;

  @Column()
  approver_id: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'timestamp', nullable: true })
  actioned_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => LeaveApplication, leaveApplication => leaveApplication.approval_workflow)
  @JoinColumn({ name: 'leave_application_id' })
  leave_application: LeaveApplication;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approver_id' })
  approver: User;
} 
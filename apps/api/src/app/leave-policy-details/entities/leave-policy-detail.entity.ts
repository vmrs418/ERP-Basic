import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LeavePolicy } from '../../leave-policies/entities/leave-policy.entity';
import { LeaveType } from '../../leave-types/entities/leave-type.entity';

export enum AccrualType {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly'
}

@Entity('leave_policy_details')
export class LeavePolicyDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  leave_policy_id: string;

  @Column({ type: 'uuid' })
  leave_type_id: string;

  @Column({ type: 'float' })
  annual_quota: number;

  @Column({ 
    type: 'enum',
    enum: AccrualType,
    default: AccrualType.YEARLY
  })
  accrual_type: AccrualType;

  @Column({ type: 'float', default: 0 })
  carry_forward_limit: number;

  @Column({ type: 'float', default: 0 })
  encashment_limit: number;

  @Column({ type: 'jsonb', default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] })
  applicable_months: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => LeavePolicy, (policy) => policy.policy_details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leave_policy_id' })
  leave_policy: LeavePolicy;

  @ManyToOne(() => LeaveType)
  @JoinColumn({ name: 'leave_type_id' })
  leave_type: LeaveType;
} 
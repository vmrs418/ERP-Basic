import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { LeaveApplication } from '../../leave-applications/entities/leave-application.entity';
import { LeavePolicyDetail } from '../../leave-policy-details/entities/leave-policy-detail.entity';
import { EmployeeLeaveBalance } from '../../employee-leave-balances/entities/employee-leave-balance.entity';

@Entity('leave_types')
export class LeaveType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column('text')
  description: string;

  @Column()
  color_code: string;

  @Column()
  is_paid: boolean;

  @Column()
  is_encashable: boolean;

  @Column()
  requires_approval: boolean;

  @Column({ nullable: true })
  max_consecutive_days?: number;

  @Column()
  min_days_before_application: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToMany(() => LeaveApplication, leaveApplication => leaveApplication.leave_type)
  leave_applications: LeaveApplication[];

  @OneToMany(() => LeavePolicyDetail, leavePolicyDetail => leavePolicyDetail.leave_type)
  policy_details: LeavePolicyDetail[];

  @OneToMany(() => EmployeeLeaveBalance, employeeLeaveBalance => employeeLeaveBalance.leave_type)
  employee_balances: EmployeeLeaveBalance[];
} 
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { WeekendPolicy } from '../../weekend-policies/entities/weekend-policy.entity';

@Entity('employee_weekend_policies')
export class EmployeeWeekendPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column()
  weekend_policy_id: string;

  @Column({ type: 'date' })
  from_date: Date;

  @Column({ type: 'date', nullable: true })
  to_date?: Date;

  @Column({ default: false })
  is_current: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => WeekendPolicy, weekendPolicy => weekendPolicy.employees)
  @JoinColumn({ name: 'weekend_policy_id' })
  weekend_policy: WeekendPolicy;
} 
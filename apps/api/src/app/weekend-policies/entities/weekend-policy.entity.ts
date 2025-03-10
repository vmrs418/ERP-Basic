import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmployeeWeekendPolicy } from '../../employee-weekend-policies/entities/employee-weekend-policy.entity';

@Entity('weekend_policies')
export class WeekendPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'jsonb' })
  weekends: number[]; // Array of day numbers (0 = Sunday, 6 = Saturday)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToMany(() => EmployeeWeekendPolicy, employeeWeekendPolicy => employeeWeekendPolicy.weekend_policy)
  employees: EmployeeWeekendPolicy[];
} 
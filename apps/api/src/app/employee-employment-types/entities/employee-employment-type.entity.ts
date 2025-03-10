import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { EmploymentType } from '../../employment-types/entities/employment-type.entity';

@Entity('employee_employment_types')
export class EmployeeEmploymentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column()
  employment_type_id: string;

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
  @ManyToOne(() => Employee, employee => employee.employmentTypes)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => EmploymentType, employmentType => employmentType.employees)
  @JoinColumn({ name: 'employment_type_id' })
  employmentType: EmploymentType;
} 
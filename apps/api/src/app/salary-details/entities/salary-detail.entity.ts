import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('salary_details')
export class SalaryDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basic_salary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hra: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  conveyance_allowance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  medical_allowance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  special_allowance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pf_employer_contribution: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pf_employee_contribution: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  esi_employer_contribution: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  esi_employee_contribution: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  professional_tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tds: number;

  @Column({ type: 'date' })
  effective_from: Date;

  @Column({ type: 'date', nullable: true })
  effective_to?: Date;

  @Column({ default: false })
  is_current: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  created_by: string;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.salaryDetails)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
} 
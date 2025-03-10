import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Designation } from '../../designations/entities/designation.entity';

@Entity('employee_designations')
export class EmployeeDesignation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column()
  designation_id: string;

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
  @ManyToOne(() => Employee, employee => employee.designations)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Designation, designation => designation.employees)
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;
} 
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('employee_departments')
export class EmployeeDepartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column()
  department_id: string;

  @Column({ default: false })
  is_primary: boolean;

  @Column({ type: 'date' })
  from_date: Date;

  @Column({ type: 'date', nullable: true })
  to_date?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.departments)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Department, department => department.employees)
  @JoinColumn({ name: 'department_id' })
  department: Department;
} 
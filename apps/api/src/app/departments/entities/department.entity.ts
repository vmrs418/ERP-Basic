import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { EmployeeDepartment } from '../../employee-departments/entities/employee-department.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  parent_department_id?: string;

  @Column({ nullable: true })
  head_employee_id?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Self-referencing relationship for parent department
  @ManyToOne(() => Department, { nullable: true })
  @JoinColumn({ name: 'parent_department_id' })
  parent_department?: Department;

  // Relationship with employee as department head
  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'head_employee_id' })
  head_employee?: Employee;

  // Relationship with employee departments
  @OneToMany(() => EmployeeDepartment, employeeDepartment => employeeDepartment.department)
  employees: EmployeeDepartment[];
} 
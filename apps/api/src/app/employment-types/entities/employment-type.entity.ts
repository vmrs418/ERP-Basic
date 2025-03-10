import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmployeeEmploymentType } from '../../employee-employment-types/entities/employee-employment-type.entity';

@Entity('employment_types')
export class EmploymentType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToMany(() => EmployeeEmploymentType, employeeEmploymentType => employeeEmploymentType.employmentType)
  employees: EmployeeEmploymentType[];
} 
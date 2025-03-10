import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('bank_details')
export class BankDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column()
  account_holder_name: string;

  @Column()
  account_number: string;

  @Column()
  bank_name: string;

  @Column()
  branch_name: string;

  @Column()
  ifsc_code: string;

  @Column({ default: false })
  is_primary: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.bankDetails)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
} 
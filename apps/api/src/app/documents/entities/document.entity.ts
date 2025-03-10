import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employee_id: string;

  @Column({
    type: 'enum',
    enum: [
      'aadhar',
      'pan',
      'passport',
      'resume',
      'offer_letter',
      'joining_letter',
      'experience_certificate',
      'education_certificate',
      'other'
    ]
  })
  document_type: 'aadhar' | 'pan' | 'passport' | 'resume' | 'offer_letter' | 'joining_letter' | 'experience_certificate' | 'education_certificate' | 'other';

  @Column()
  document_url: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  })
  verification_status: 'pending' | 'verified' | 'rejected';

  @Column({ type: 'text', nullable: true })
  verification_notes?: string;

  @Column({ nullable: true })
  verified_by?: string;

  @Column({ type: 'timestamp', nullable: true })
  verified_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Employee, employee => employee.documents)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
} 
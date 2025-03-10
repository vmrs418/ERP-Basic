import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EmployeeShift } from '../../employee-shifts/entities/employee-shift.entity';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'time' })
  start_time: string; // Format: HH:MM:SS

  @Column({ type: 'time' })
  end_time: string; // Format: HH:MM:SS

  @Column({ default: 15 })
  grace_period_minutes: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 4.0 })
  half_day_threshold_hours: number;

  @Column({ default: false })
  is_night_shift: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToMany(() => EmployeeShift, employeeShift => employeeShift.shift)
  employees: EmployeeShift[];
} 
import { EmployeeShift } from '../../employee-shifts/entities/employee-shift.entity';
export declare class Shift {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    grace_period_minutes: number;
    half_day_threshold_hours: number;
    is_night_shift: boolean;
    description?: string;
    created_at: Date;
    updated_at: Date;
    employees: EmployeeShift[];
}

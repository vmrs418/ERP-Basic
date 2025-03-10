import { EmployeeWeekendPolicy } from '../../employee-weekend-policies/entities/employee-weekend-policy.entity';
export declare class WeekendPolicy {
    id: string;
    name: string;
    description: string;
    weekends: number[];
    created_at: Date;
    updated_at: Date;
    employees: EmployeeWeekendPolicy[];
}

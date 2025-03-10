import { Employee } from '../../employees/entities/employee.entity';
import { WeekendPolicy } from '../../weekend-policies/entities/weekend-policy.entity';
export declare class EmployeeWeekendPolicy {
    id: string;
    employee_id: string;
    weekend_policy_id: string;
    from_date: Date;
    to_date?: Date;
    is_current: boolean;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
    weekend_policy: WeekendPolicy;
}

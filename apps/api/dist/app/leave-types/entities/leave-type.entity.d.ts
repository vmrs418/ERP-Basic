import { LeaveApplication } from '../../leave-applications/entities/leave-application.entity';
import { LeavePolicyDetail } from '../../leave-policy-details/entities/leave-policy-detail.entity';
import { EmployeeLeaveBalance } from '../../employee-leave-balances/entities/employee-leave-balance.entity';
export declare class LeaveType {
    id: string;
    name: string;
    code: string;
    description: string;
    color_code: string;
    is_paid: boolean;
    is_encashable: boolean;
    requires_approval: boolean;
    max_consecutive_days?: number;
    min_days_before_application: number;
    created_at: Date;
    updated_at: Date;
    leave_applications: LeaveApplication[];
    policy_details: LeavePolicyDetail[];
    employee_balances: EmployeeLeaveBalance[];
}

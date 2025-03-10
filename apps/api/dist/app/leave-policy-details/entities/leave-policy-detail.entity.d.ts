import { LeavePolicy } from '../../leave-policies/entities/leave-policy.entity';
import { LeaveType } from '../../leave-types/entities/leave-type.entity';
export declare enum AccrualType {
    YEARLY = "yearly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly"
}
export declare class LeavePolicyDetail {
    id: string;
    leave_policy_id: string;
    leave_type_id: string;
    annual_quota: number;
    accrual_type: AccrualType;
    carry_forward_limit: number;
    encashment_limit: number;
    applicable_months: number[];
    created_at: Date;
    updated_at: Date;
    leave_policy: LeavePolicy;
    leave_type: LeaveType;
}

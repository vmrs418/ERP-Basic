import { AccrualType } from '../entities/leave-policy-detail.entity';
export declare class UpdateLeavePolicyDetailDto {
    leave_type_id?: string;
    leave_policy_id?: string;
    annual_quota?: number;
    accrual_type?: AccrualType;
    carry_forward_limit?: number;
    encashment_limit?: number;
    applicable_months?: number[];
}

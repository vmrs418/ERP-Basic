import { LeavePolicyDetail } from '../../leave-policy-details/entities/leave-policy-detail.entity';
export declare class LeavePolicy {
    id: string;
    name: string;
    description: string;
    effective_from: Date;
    effective_to: Date;
    is_current: boolean;
    probation_applicable: boolean;
    created_at: Date;
    updated_at: Date;
    policy_details: LeavePolicyDetail[];
}

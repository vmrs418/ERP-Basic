export declare class CreateLeaveTypeDto {
    name: string;
    code: string;
    description: string;
    color_code: string;
    is_paid: boolean;
    is_encashable: boolean;
    requires_approval: boolean;
    max_consecutive_days?: number;
    min_days_before_application: number;
}

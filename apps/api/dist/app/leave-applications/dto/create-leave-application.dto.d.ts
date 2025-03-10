export declare class CreateLeaveApplicationDto {
    employee_id: string;
    leave_type_id: string;
    from_date: Date;
    to_date: Date;
    duration_days?: number;
    first_day_half: boolean;
    last_day_half: boolean;
    reason: string;
    contact_during_leave: string;
    handover_to?: string;
    handover_notes?: string;
    status: string;
    attachment_url?: string;
}

import { CreateLeaveApplicationDto } from './create-leave-application.dto';
declare const UpdateLeaveApplicationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateLeaveApplicationDto>>;
export declare class UpdateLeaveApplicationDto extends UpdateLeaveApplicationDto_base {
    actioned_by?: string;
    status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
    rejection_reason?: string;
}
export {};

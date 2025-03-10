import { LeavePolicyDetailsService } from './leave-policy-details.service';
import { CreateLeavePolicyDetailDto } from './dto/create-leave-policy-detail.dto';
import { UpdateLeavePolicyDetailDto } from './dto/update-leave-policy-detail.dto';
export declare class LeavePolicyDetailsController {
    private readonly leavePolicyDetailsService;
    constructor(leavePolicyDetailsService: LeavePolicyDetailsService);
    create(createLeavePolicyDetailDto: CreateLeavePolicyDetailDto): Promise<import("./entities/leave-policy-detail.entity").LeavePolicyDetail>;
    findAll(): Promise<import("./entities/leave-policy-detail.entity").LeavePolicyDetail[]>;
    findOne(id: string): Promise<import("./entities/leave-policy-detail.entity").LeavePolicyDetail>;
    findByPolicy(policyId: string): Promise<import("./entities/leave-policy-detail.entity").LeavePolicyDetail[]>;
    update(id: string, updateLeavePolicyDetailDto: UpdateLeavePolicyDetailDto): Promise<import("./entities/leave-policy-detail.entity").LeavePolicyDetail>;
    remove(id: string): Promise<void>;
}

import { LeavePoliciesService } from './leave-policies.service';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';
export declare class LeavePoliciesController {
    private readonly leavePoliciesService;
    constructor(leavePoliciesService: LeavePoliciesService);
    create(createLeavePolicyDto: CreateLeavePolicyDto): Promise<import("./entities/leave-policy.entity").LeavePolicy>;
    findAll(): Promise<import("./entities/leave-policy.entity").LeavePolicy[]>;
    findOne(id: string): Promise<import("./entities/leave-policy.entity").LeavePolicy>;
    update(id: string, updateLeavePolicyDto: UpdateLeavePolicyDto): Promise<import("./entities/leave-policy.entity").LeavePolicy>;
    remove(id: string): Promise<void>;
    setCurrentPolicy(id: string): Promise<import("./entities/leave-policy.entity").LeavePolicy>;
}

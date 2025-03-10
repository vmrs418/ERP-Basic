import { Repository } from 'typeorm';
import { LeavePolicy } from './entities/leave-policy.entity';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';
export declare class LeavePoliciesService {
    private leavePoliciesRepository;
    constructor(leavePoliciesRepository: Repository<LeavePolicy>);
    create(createLeavePolicyDto: CreateLeavePolicyDto): Promise<LeavePolicy>;
    findAll(): Promise<LeavePolicy[]>;
    findOne(id: string): Promise<LeavePolicy>;
    update(id: string, updateLeavePolicyDto: UpdateLeavePolicyDto): Promise<LeavePolicy>;
    remove(id: string): Promise<void>;
    setCurrentPolicy(id: string): Promise<LeavePolicy>;
    getCurrentPolicy(): Promise<LeavePolicy | null>;
    private resetCurrentPolicies;
}

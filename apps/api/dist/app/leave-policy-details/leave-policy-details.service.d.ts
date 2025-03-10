import { Repository } from 'typeorm';
import { LeavePolicyDetail } from './entities/leave-policy-detail.entity';
import { CreateLeavePolicyDetailDto } from './dto/create-leave-policy-detail.dto';
import { UpdateLeavePolicyDetailDto } from './dto/update-leave-policy-detail.dto';
import { LeaveTypesService } from '../leave-types/leave-types.service';
import { LeavePoliciesService } from '../leave-policies/leave-policies.service';
export declare class LeavePolicyDetailsService {
    private leavePolicyDetailRepository;
    private readonly leaveTypesService;
    private readonly leavePoliciesService;
    constructor(leavePolicyDetailRepository: Repository<LeavePolicyDetail>, leaveTypesService: LeaveTypesService, leavePoliciesService: LeavePoliciesService);
    create(createLeavePolicyDetailDto: CreateLeavePolicyDetailDto): Promise<LeavePolicyDetail>;
    findAll(): Promise<LeavePolicyDetail[]>;
    findOne(id: string): Promise<LeavePolicyDetail>;
    findByPolicy(policyId: string): Promise<LeavePolicyDetail[]>;
    update(id: string, updateLeavePolicyDetailDto: UpdateLeavePolicyDetailDto): Promise<LeavePolicyDetail>;
    remove(id: string): Promise<void>;
}

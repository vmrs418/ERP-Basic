import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeavePolicyDetail } from './entities/leave-policy-detail.entity';
import { CreateLeavePolicyDetailDto } from './dto/create-leave-policy-detail.dto';
import { UpdateLeavePolicyDetailDto } from './dto/update-leave-policy-detail.dto';
import { LeaveTypesService } from '../leave-types/leave-types.service';
import { LeavePoliciesService } from '../leave-policies/leave-policies.service';

@Injectable()
export class LeavePolicyDetailsService {
  constructor(
    @InjectRepository(LeavePolicyDetail)
    private leavePolicyDetailRepository: Repository<LeavePolicyDetail>,
    private readonly leaveTypesService: LeaveTypesService,
    private readonly leavePoliciesService: LeavePoliciesService,
  ) {}

  async create(createLeavePolicyDetailDto: CreateLeavePolicyDetailDto): Promise<LeavePolicyDetail> {
    // Check if a detail for this leave type already exists in this policy
    const existingDetail = await this.leavePolicyDetailRepository.findOne({
      where: {
        leave_policy_id: createLeavePolicyDetailDto.leave_policy_id,
        leave_type_id: createLeavePolicyDetailDto.leave_type_id,
      },
    });

    if (existingDetail) {
      throw new Error('A detail for this leave type already exists in this policy');
    }

    const newLeavePolicyDetail = this.leavePolicyDetailRepository.create(createLeavePolicyDetailDto);
    return this.leavePolicyDetailRepository.save(newLeavePolicyDetail);
  }

  async findAll(): Promise<LeavePolicyDetail[]> {
    return this.leavePolicyDetailRepository.find({
      relations: ['leave_type', 'leave_policy'],
    });
  }

  async findOne(id: string): Promise<LeavePolicyDetail> {
    const leavePolicyDetail = await this.leavePolicyDetailRepository.findOne({
      where: { id },
      relations: ['leave_type', 'leave_policy'],
    });

    if (!leavePolicyDetail) {
      throw new NotFoundException(`Leave policy detail with ID ${id} not found`);
    }

    return leavePolicyDetail;
  }

  async findByPolicy(policyId: string): Promise<LeavePolicyDetail[]> {
    return this.leavePolicyDetailRepository.find({
      where: { leave_policy_id: policyId },
      relations: ['leave_type', 'leave_policy'],
    });
  }

  async update(id: string, updateLeavePolicyDetailDto: UpdateLeavePolicyDetailDto): Promise<LeavePolicyDetail> {
    const leavePolicyDetail = await this.findOne(id);

    // If changing leave_type_id, check if it would create a duplicate
    if (updateLeavePolicyDetailDto.leave_type_id && 
        updateLeavePolicyDetailDto.leave_type_id !== leavePolicyDetail.leave_type_id) {
      const existingDetail = await this.leavePolicyDetailRepository.findOne({
        where: {
          leave_policy_id: leavePolicyDetail.leave_policy_id,
          leave_type_id: updateLeavePolicyDetailDto.leave_type_id,
        },
      });

      if (existingDetail) {
        throw new Error('A detail for this leave type already exists in this policy');
      }
    }

    // Update the entity with the new values
    Object.assign(leavePolicyDetail, updateLeavePolicyDetailDto);
    return this.leavePolicyDetailRepository.save(leavePolicyDetail);
  }

  async remove(id: string): Promise<void> {
    const leavePolicyDetail = await this.findOne(id);
    await this.leavePolicyDetailRepository.remove(leavePolicyDetail);
  }
} 
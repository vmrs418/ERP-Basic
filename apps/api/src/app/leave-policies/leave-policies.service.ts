import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { LeavePolicy } from './entities/leave-policy.entity';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';

@Injectable()
export class LeavePoliciesService {
  constructor(
    @InjectRepository(LeavePolicy)
    private leavePoliciesRepository: Repository<LeavePolicy>,
  ) {}

  async create(createLeavePolicyDto: CreateLeavePolicyDto): Promise<LeavePolicy> {
    const newLeavePolicy = this.leavePoliciesRepository.create(createLeavePolicyDto);
    
    if (newLeavePolicy.is_current) {
      // If setting this as current policy, reset any other current policies
      await this.resetCurrentPolicies();
    }
    
    return this.leavePoliciesRepository.save(newLeavePolicy);
  }

  async findAll(): Promise<LeavePolicy[]> {
    return this.leavePoliciesRepository.find();
  }

  async findOne(id: string): Promise<LeavePolicy> {
    const leavePolicy = await this.leavePoliciesRepository.findOne({ where: { id } });
    
    if (!leavePolicy) {
      throw new NotFoundException(`Leave policy with ID ${id} not found`);
    }
    
    return leavePolicy;
  }

  async update(id: string, updateLeavePolicyDto: UpdateLeavePolicyDto): Promise<LeavePolicy> {
    const leavePolicy = await this.findOne(id);
    
    // Update the entity with the new values
    Object.assign(leavePolicy, updateLeavePolicyDto);
    
    if (updateLeavePolicyDto.is_current) {
      // If setting this as current policy, reset any other current policies
      await this.resetCurrentPolicies(id);
    }
    
    return this.leavePoliciesRepository.save(leavePolicy);
  }

  async remove(id: string): Promise<void> {
    const leavePolicy = await this.findOne(id);
    await this.leavePoliciesRepository.remove(leavePolicy);
  }

  async setCurrentPolicy(id: string): Promise<LeavePolicy> {
    const leavePolicy = await this.findOne(id);
    
    // Reset any current policies first
    await this.resetCurrentPolicies(id);
    
    // Set this one as current
    leavePolicy.is_current = true;
    
    return this.leavePoliciesRepository.save(leavePolicy);
  }

  async getCurrentPolicy(): Promise<LeavePolicy | null> {
    return this.leavePoliciesRepository.findOne({ where: { is_current: true } });
  }

  private async resetCurrentPolicies(exceptId?: string): Promise<void> {
    // Find all current policies except the one we're setting
    const query = { is_current: true };
    
    if (exceptId) {
      // If exceptId is provided, exclude that policy from being reset
      await this.leavePoliciesRepository.update({ is_current: true, id: Not(exceptId) }, { is_current: false });
    } else {
      // Reset all current policies
      await this.leavePoliciesRepository.update({ is_current: true }, { is_current: false });
    }
  }
} 
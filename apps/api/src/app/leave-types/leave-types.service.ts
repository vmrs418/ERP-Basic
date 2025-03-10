import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { LeaveType } from './entities/leave-type.entity';

@Injectable()
export class LeaveTypesService {
  constructor(
    @InjectRepository(LeaveType)
    private leaveTypeRepository: Repository<LeaveType>,
  ) {}

  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
    const leaveType = this.leaveTypeRepository.create(createLeaveTypeDto);
    return this.leaveTypeRepository.save(leaveType);
  }

  async findAll(): Promise<LeaveType[]> {
    return this.leaveTypeRepository.find();
  }

  async findOne(id: string): Promise<LeaveType> {
    const leaveType = await this.leaveTypeRepository.findOne({ where: { id } });
    
    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID "${id}" not found`);
    }
    
    return leaveType;
  }

  async update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType> {
    const leaveType = await this.findOne(id);
    
    // Update the entity with the new values
    Object.assign(leaveType, updateLeaveTypeDto);
    
    return this.leaveTypeRepository.save(leaveType);
  }

  async remove(id: string): Promise<void> {
    const result = await this.leaveTypeRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Leave type with ID "${id}" not found`);
    }
  }
} 
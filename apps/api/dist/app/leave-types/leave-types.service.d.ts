import { Repository } from 'typeorm';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { LeaveType } from './entities/leave-type.entity';
export declare class LeaveTypesService {
    private leaveTypeRepository;
    constructor(leaveTypeRepository: Repository<LeaveType>);
    create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType>;
    findAll(): Promise<LeaveType[]>;
    findOne(id: string): Promise<LeaveType>;
    update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType>;
    remove(id: string): Promise<void>;
}

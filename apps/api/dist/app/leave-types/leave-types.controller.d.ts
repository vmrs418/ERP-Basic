import { LeaveTypesService } from './leave-types.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
export declare class LeaveTypesController {
    private readonly leaveTypesService;
    constructor(leaveTypesService: LeaveTypesService);
    create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<import("./entities/leave-type.entity").LeaveType>;
    findAll(): Promise<import("./entities/leave-type.entity").LeaveType[]>;
    findOne(id: string): Promise<import("./entities/leave-type.entity").LeaveType>;
    update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<import("./entities/leave-type.entity").LeaveType>;
    remove(id: string): Promise<void>;
}

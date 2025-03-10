import { Repository } from 'typeorm';
import { LeaveApplication } from './entities/leave-application.entity';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
export declare class LeaveApplicationsService {
    private leaveApplicationRepository;
    constructor(leaveApplicationRepository: Repository<LeaveApplication>);
    findAll(filters?: {
        employeeId?: string;
        status?: string;
    }): Promise<LeaveApplication[]>;
    findOne(id: string): Promise<LeaveApplication>;
    create(createLeaveApplicationDto: CreateLeaveApplicationDto, userId: string): Promise<LeaveApplication>;
    update(id: string, updateLeaveApplicationDto: UpdateLeaveApplicationDto, user: any): Promise<LeaveApplication>;
    remove(id: string): Promise<void>;
    approve(id: string, userId: string): Promise<LeaveApplication>;
    reject(id: string, rejectionReason: string, userId: string): Promise<LeaveApplication>;
    cancel(id: string, user: any): Promise<LeaveApplication>;
    findByEmployee(employeeId: string): Promise<LeaveApplication[]>;
    findPendingForApproval(): Promise<LeaveApplication[]>;
}

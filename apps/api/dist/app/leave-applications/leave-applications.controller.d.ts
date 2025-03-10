import { LeaveApplicationsService } from './leave-applications.service';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
export declare class LeaveApplicationsController {
    private readonly leaveApplicationsService;
    constructor(leaveApplicationsService: LeaveApplicationsService);
    create(createLeaveApplicationDto: CreateLeaveApplicationDto, user: any): Promise<import("./entities/leave-application.entity").LeaveApplication>;
    findAll(employeeId: string, status: string, user: any): Promise<import("./entities/leave-application.entity").LeaveApplication[]>;
    findOne(id: string, user: any): Promise<import("./entities/leave-application.entity").LeaveApplication>;
    update(id: string, updateLeaveApplicationDto: UpdateLeaveApplicationDto, user: any): Promise<import("./entities/leave-application.entity").LeaveApplication>;
    remove(id: string): Promise<void>;
    approve(id: string, user: any): Promise<import("./entities/leave-application.entity").LeaveApplication>;
    reject(id: string, rejectionReason: string, user: any): Promise<import("./entities/leave-application.entity").LeaveApplication>;
    cancel(id: string, user: any): Promise<import("./entities/leave-application.entity").LeaveApplication>;
    findByEmployee(employeeId: string, user: any): Promise<import("./entities/leave-application.entity").LeaveApplication[]>;
    findPendingForApproval(): Promise<import("./entities/leave-application.entity").LeaveApplication[]>;
}

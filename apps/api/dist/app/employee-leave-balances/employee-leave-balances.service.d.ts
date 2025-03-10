import { Repository } from 'typeorm';
import { EmployeeLeaveBalance } from './entities/employee-leave-balance.entity';
import { LeaveTypesService } from '../leave-types/leave-types.service';
export declare class EmployeeLeaveBalancesService {
    private readonly employeeLeaveBalanceRepository;
    private readonly leaveTypesService;
    constructor(employeeLeaveBalanceRepository: Repository<EmployeeLeaveBalance>, leaveTypesService: LeaveTypesService);
    getLeaveBalance(employeeId: string, leaveTypeId: string, year: number): Promise<EmployeeLeaveBalance>;
    findEmployeeLeaveBalance(employeeId: string, leaveTypeId: string): Promise<EmployeeLeaveBalance>;
    deductLeaveBalance(employeeId: string, leaveTypeId: string, days: number): Promise<EmployeeLeaveBalance>;
    addLeaveBalance(employeeId: string, leaveTypeId: string, days: number): Promise<EmployeeLeaveBalance>;
    deductLeave(employeeId: string, leaveTypeId: string, year: number, days: number): Promise<EmployeeLeaveBalance>;
    addLeave(employeeId: string, leaveTypeId: string, year: number, days: number): Promise<EmployeeLeaveBalance>;
    adjustLeave(employeeId: string, leaveTypeId: string, year: number, days: number, reason: string): Promise<EmployeeLeaveBalance>;
    encashLeave(employeeId: string, leaveTypeId: string, year: number, days: number): Promise<EmployeeLeaveBalance>;
    carryForwardLeave(employeeId: string, leaveTypeId: string, fromYear: number, toYear: number, days: number): Promise<EmployeeLeaveBalance>;
    private calculateClosingBalance;
}

import { EmployeeLeaveBalancesService } from './employee-leave-balances.service';
export declare class EmployeeLeaveBalancesController {
    private readonly employeeLeaveBalancesService;
    constructor(employeeLeaveBalancesService: EmployeeLeaveBalancesService);
    getEmployeeBalances(employeeId: string, year: number, user: any): Promise<{
        message: string;
        employeeId: string;
        year: number;
    }>;
    adjustLeaveBalance(employeeId: string, leaveTypeId: string, adjustmentData: {
        year: number;
        days: number;
        reason: string;
    }): Promise<import("./entities/employee-leave-balance.entity").EmployeeLeaveBalance>;
    encashLeave(employeeId: string, leaveTypeId: string, encashmentData: {
        year: number;
        days: number;
    }): Promise<import("./entities/employee-leave-balance.entity").EmployeeLeaveBalance>;
    carryForwardLeave(employeeId: string, leaveTypeId: string, carryForwardData: {
        fromYear: number;
        toYear: number;
        days: number;
    }): Promise<import("./entities/employee-leave-balance.entity").EmployeeLeaveBalance>;
}

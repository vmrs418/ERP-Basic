"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeLeaveBalancesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_leave_balance_entity_1 = require("./entities/employee-leave-balance.entity");
const leave_types_service_1 = require("../leave-types/leave-types.service");
let EmployeeLeaveBalancesService = class EmployeeLeaveBalancesService {
    constructor(employeeLeaveBalanceRepository, leaveTypesService) {
        this.employeeLeaveBalanceRepository = employeeLeaveBalanceRepository;
        this.leaveTypesService = leaveTypesService;
    }
    async getLeaveBalance(employeeId, leaveTypeId, year) {
        let balance = await this.employeeLeaveBalanceRepository.findOne({
            where: {
                employee_id: employeeId,
                leave_type_id: leaveTypeId,
                year,
            },
        });
        if (!balance) {
            const leaveType = await this.leaveTypesService.findOne(leaveTypeId);
            const initialQuota = 0;
            balance = this.employeeLeaveBalanceRepository.create({
                employee_id: employeeId,
                leave_type_id: leaveTypeId,
                year,
                opening_balance: initialQuota,
                accrued: initialQuota,
                used: 0,
                adjusted: 0,
                encashed: 0,
                carried_forward: 0,
                closing_balance: initialQuota,
                last_updated: new Date(),
            });
            await this.employeeLeaveBalanceRepository.save(balance);
        }
        return balance;
    }
    async findEmployeeLeaveBalance(employeeId, leaveTypeId) {
        const currentYear = new Date().getFullYear();
        return this.getLeaveBalance(employeeId, leaveTypeId, currentYear);
    }
    async deductLeaveBalance(employeeId, leaveTypeId, days) {
        const currentYear = new Date().getFullYear();
        return this.deductLeave(employeeId, leaveTypeId, currentYear, days);
    }
    async addLeaveBalance(employeeId, leaveTypeId, days) {
        const currentYear = new Date().getFullYear();
        return this.addLeave(employeeId, leaveTypeId, currentYear, days);
    }
    async deductLeave(employeeId, leaveTypeId, year, days) {
        const balance = await this.getLeaveBalance(employeeId, leaveTypeId, year);
        if (balance.closing_balance < days) {
            throw new Error(`Insufficient leave balance. Available: ${balance.closing_balance}, Requested: ${days}`);
        }
        balance.used += days;
        balance.closing_balance = this.calculateClosingBalance(balance);
        balance.last_updated = new Date();
        return this.employeeLeaveBalanceRepository.save(balance);
    }
    async addLeave(employeeId, leaveTypeId, year, days) {
        const balance = await this.getLeaveBalance(employeeId, leaveTypeId, year);
        balance.used -= days;
        balance.closing_balance = this.calculateClosingBalance(balance);
        balance.last_updated = new Date();
        return this.employeeLeaveBalanceRepository.save(balance);
    }
    async adjustLeave(employeeId, leaveTypeId, year, days, reason) {
        const balance = await this.getLeaveBalance(employeeId, leaveTypeId, year);
        balance.adjusted += days;
        balance.closing_balance = this.calculateClosingBalance(balance);
        balance.last_updated = new Date();
        return this.employeeLeaveBalanceRepository.save(balance);
    }
    async encashLeave(employeeId, leaveTypeId, year, days) {
        const balance = await this.getLeaveBalance(employeeId, leaveTypeId, year);
        const leaveType = await this.leaveTypesService.findOne(leaveTypeId);
        if (!leaveType.is_encashable) {
            throw new Error('This leave type is not eligible for encashment');
        }
        if (balance.closing_balance < days) {
            throw new Error(`Insufficient leave balance for encashment. Available: ${balance.closing_balance}, Requested: ${days}`);
        }
        balance.encashed += days;
        balance.closing_balance = this.calculateClosingBalance(balance);
        balance.last_updated = new Date();
        return this.employeeLeaveBalanceRepository.save(balance);
    }
    async carryForwardLeave(employeeId, leaveTypeId, fromYear, toYear, days) {
        const fromBalance = await this.getLeaveBalance(employeeId, leaveTypeId, fromYear);
        if (fromBalance.closing_balance < days) {
            throw new Error(`Insufficient leave balance for carry forward. Available: ${fromBalance.closing_balance}, Requested: ${days}`);
        }
        fromBalance.carried_forward += days;
        fromBalance.closing_balance = this.calculateClosingBalance(fromBalance);
        fromBalance.last_updated = new Date();
        let toBalance = await this.getLeaveBalance(employeeId, leaveTypeId, toYear);
        toBalance.opening_balance += days;
        toBalance.closing_balance = this.calculateClosingBalance(toBalance);
        toBalance.last_updated = new Date();
        await this.employeeLeaveBalanceRepository.save(fromBalance);
        return this.employeeLeaveBalanceRepository.save(toBalance);
    }
    calculateClosingBalance(balance) {
        return balance.opening_balance +
            balance.accrued +
            balance.adjusted -
            balance.used -
            balance.encashed;
    }
};
exports.EmployeeLeaveBalancesService = EmployeeLeaveBalancesService;
exports.EmployeeLeaveBalancesService = EmployeeLeaveBalancesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_leave_balance_entity_1.EmployeeLeaveBalance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        leave_types_service_1.LeaveTypesService])
], EmployeeLeaveBalancesService);
//# sourceMappingURL=employee-leave-balances.service.js.map
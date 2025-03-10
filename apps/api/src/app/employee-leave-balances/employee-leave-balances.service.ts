import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeLeaveBalance } from './entities/employee-leave-balance.entity';
import { LeaveTypesService } from '../leave-types/leave-types.service';

@Injectable()
export class EmployeeLeaveBalancesService {
  constructor(
    @InjectRepository(EmployeeLeaveBalance)
    private readonly employeeLeaveBalanceRepository: Repository<EmployeeLeaveBalance>,
    private readonly leaveTypesService: LeaveTypesService,
  ) {}

  async getLeaveBalance(employeeId: string, leaveTypeId: string, year: number) {
    let balance = await this.employeeLeaveBalanceRepository.findOne({
      where: {
        employee_id: employeeId,
        leave_type_id: leaveTypeId,
        year,
      },
    });

    if (!balance) {
      // If no balance record exists, create a new one with default values
      const leaveType = await this.leaveTypesService.findOne(leaveTypeId);
      
      // Get leave policy details for this leave type
      // This is a simplified approach - in a real system, you'd need to get the
      // correct policy based on the employee's department, role, etc.
      const initialQuota = 0; // This should come from leave policy details
      
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

  // New method to find the current leave balance for an employee and leave type
  async findEmployeeLeaveBalance(employeeId: string, leaveTypeId: string) {
    const currentYear = new Date().getFullYear();
    return this.getLeaveBalance(employeeId, leaveTypeId, currentYear);
  }

  // New method to deduct leave balance when a leave application is approved
  async deductLeaveBalance(employeeId: string, leaveTypeId: string, days: number) {
    const currentYear = new Date().getFullYear();
    return this.deductLeave(employeeId, leaveTypeId, currentYear, days);
  }

  // New method to add leave balance when a leave application is cancelled
  async addLeaveBalance(employeeId: string, leaveTypeId: string, days: number) {
    const currentYear = new Date().getFullYear();
    return this.addLeave(employeeId, leaveTypeId, currentYear, days);
  }

  async deductLeave(employeeId: string, leaveTypeId: string, year: number, days: number) {
    const balance = await this.getLeaveBalance(employeeId, leaveTypeId, year);
    
    if (balance.closing_balance < days) {
      throw new Error(`Insufficient leave balance. Available: ${balance.closing_balance}, Requested: ${days}`);
    }
    
    balance.used += days;
    balance.closing_balance = this.calculateClosingBalance(balance);
    balance.last_updated = new Date();
    
    return this.employeeLeaveBalanceRepository.save(balance);
  }

  async addLeave(employeeId: string, leaveTypeId: string, year: number, days: number) {
    const balance = await this.getLeaveBalance(employeeId, leaveTypeId, year);
    
    balance.used -= days;
    balance.closing_balance = this.calculateClosingBalance(balance);
    balance.last_updated = new Date();
    
    return this.employeeLeaveBalanceRepository.save(balance);
  }

  async adjustLeave(employeeId: string, leaveTypeId: string, year: number, days: number, reason: string) {
    const balance = await this.getLeaveBalance(employeeId, leaveTypeId, year);
    
    balance.adjusted += days; // Can be positive or negative
    balance.closing_balance = this.calculateClosingBalance(balance);
    balance.last_updated = new Date();
    
    // In a real system, you might want to log the adjustment with the reason
    
    return this.employeeLeaveBalanceRepository.save(balance);
  }

  async encashLeave(employeeId: string, leaveTypeId: string, year: number, days: number) {
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

  async carryForwardLeave(employeeId: string, leaveTypeId: string, fromYear: number, toYear: number, days: number) {
    const fromBalance = await this.getLeaveBalance(employeeId, leaveTypeId, fromYear);
    
    if (fromBalance.closing_balance < days) {
      throw new Error(`Insufficient leave balance for carry forward. Available: ${fromBalance.closing_balance}, Requested: ${days}`);
    }
    
    // Deduct from current year
    fromBalance.carried_forward += days;
    fromBalance.closing_balance = this.calculateClosingBalance(fromBalance);
    fromBalance.last_updated = new Date();
    
    // Add to next year
    let toBalance = await this.getLeaveBalance(employeeId, leaveTypeId, toYear);
    toBalance.opening_balance += days;
    toBalance.closing_balance = this.calculateClosingBalance(toBalance);
    toBalance.last_updated = new Date();
    
    await this.employeeLeaveBalanceRepository.save(fromBalance);
    return this.employeeLeaveBalanceRepository.save(toBalance);
  }

  private calculateClosingBalance(balance: EmployeeLeaveBalance): number {
    return balance.opening_balance + 
           balance.accrued + 
           balance.adjusted - 
           balance.used - 
           balance.encashed;
  }
} 
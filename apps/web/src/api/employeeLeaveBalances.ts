import { apiClient } from './client';
import { AxiosResponse } from 'axios';

export interface EmployeeLeaveBalance {
  id: string;
  employee_id: string;
  leave_type_id: string;
  leave_type_name?: string;
  year: number;
  opening_balance: number;
  leaves_accrued: number;
  leaves_used: number;
  leaves_adjusted: number;
  leaves_encashed: number;
  closing_balance: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveBalanceAdjustment {
  employee_id: string;
  leave_type_id: string;
  year: number;
  adjustment_days: number;
  reason: string;
  adjusted_by: string;
}

/**
 * Fetch leave balances for a specific employee
 * @param employeeId Employee ID
 * @param year Optional year filter
 * @returns Promise with employee leave balances
 */
export const fetchEmployeeLeaveBalances = async (
  employeeId: string,
  year?: number
): Promise<EmployeeLeaveBalance[]> => {
  const params: Record<string, any> = { employee_id: employeeId };
  
  if (year) {
    params.year = year;
  }
  
  const response = await apiClient.get('/api/leave-balances', { params });
  return response.data;
};

/**
 * Get leave balance for a specific employee, leave type and year
 * @param employeeId Employee ID
 * @param leaveTypeId Leave type ID
 * @param year Year
 * @returns Promise with employee leave balance
 */
export const getLeaveBalance = async (
  employeeId: string,
  leaveTypeId: string,
  year: number
): Promise<EmployeeLeaveBalance> => {
  const params = {
    employee_id: employeeId,
    leave_type_id: leaveTypeId,
    year
  };
  
  const response = await apiClient.get('/api/leave-balances/specific', { params });
  return response.data;
};

/**
 * Adjust leave balance for an employee
 * @param adjustmentData Leave balance adjustment data
 * @returns Promise with updated leave balance
 */
export const adjustLeaveBalance = async (
  adjustmentData: LeaveBalanceAdjustment
): Promise<EmployeeLeaveBalance> => {
  const response = await apiClient.post('/api/leave-balances/adjust', adjustmentData);
  return response.data;
};

/**
 * Update leave balance after leave encashment
 * @param employeeId Employee ID
 * @param leaveTypeId Leave Type ID
 * @param year Year
 * @param days Number of days encashed
 * @returns Promise with updated leave balance
 */
export const updateBalanceAfterEncashment = async (
  employeeId: string,
  leaveTypeId: string,
  year: number,
  days: number
): Promise<EmployeeLeaveBalance> => {
  const data = {
    employee_id: employeeId,
    leave_type_id: leaveTypeId,
    year,
    encashed_days: days
  };
  
  const response = await apiClient.post('/api/leave-balances/encashment', data);
  return response.data;
};

/**
 * Initialize leave balances for a new year
 * @param year Year to initialize balances for
 * @returns Promise with operation result
 */
export const initializeYearlyBalances = async (year: number): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post('/api/leave-balances/initialize-year', { year });
  return response.data;
};

/**
 * Calculate prorated leave balance for a new employee
 * @param employeeId Employee ID
 * @param joiningDate Employee joining date
 * @returns Promise with operation result
 */
export const calculateProratedBalance = async (
  employeeId: string,
  joiningDate: string
): Promise<{ success: boolean; message: string }> => {
  const data = {
    employee_id: employeeId,
    joining_date: joiningDate
  };
  
  const response = await apiClient.post('/api/leave-balances/calculate-prorated', data);
  return response.data;
}; 
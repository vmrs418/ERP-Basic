import { api } from './apiClient';

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  description: string;
  color_code: string;
  is_paid: boolean;
  is_encashable: boolean;
  requires_approval: boolean;
  max_consecutive_days?: number;
  min_days_before_application: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateLeaveTypeDto {
  name: string;
  code: string;
  description: string;
  color_code: string;
  is_paid: boolean;
  is_encashable: boolean;
  requires_approval: boolean;
  max_consecutive_days?: number;
  min_days_before_application: number;
}

export interface UpdateLeaveTypeDto extends Partial<CreateLeaveTypeDto> {}

export const getLeaveTypes = async (): Promise<LeaveType[]> => {
  return api.leave.getLeaveTypes() as Promise<LeaveType[]>;
};

export const getLeaveType = async (id: string): Promise<LeaveType> => {
  return api.leave.getLeaveType(id) as Promise<LeaveType>;
};

export const createLeaveType = async (data: CreateLeaveTypeDto): Promise<LeaveType> => {
  return api.leave.createLeaveType(data) as Promise<LeaveType>;
};

export const updateLeaveType = async (id: string, data: UpdateLeaveTypeDto): Promise<LeaveType> => {
  return api.leave.updateLeaveType(id, data) as Promise<LeaveType>;
};

export const deleteLeaveType = async (id: string): Promise<void> => {
  return api.leave.deleteLeaveType(id) as Promise<void>;
}; 
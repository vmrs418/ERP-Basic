import { apiClient } from './client';

export interface LeavePolicy {
  id: string;
  name: string;
  description: string;
  effective_from: string;
  effective_to?: string;
  is_current: boolean;
  probation_applicable: boolean;
  created_at: string;
  updated_at: string;
  policy_details?: LeavePolicyDetail[];
}

export interface LeavePolicyDetail {
  id: string;
  leave_policy_id: string;
  leave_type_id: string;
  annual_quota: number;
  accrual_type: 'yearly' | 'monthly' | 'quarterly';
  carry_forward_limit: number;
  encashment_limit: number;
  applicable_from_months: number;
  created_at: string;
  updated_at: string;
  leave_type?: {
    id: string;
    name: string;
    code: string;
    color_code: string;
  };
}

export interface CreateLeavePolicyDto {
  name: string;
  description: string;
  effective_from: string;
  effective_to?: string;
  is_current: boolean;
  probation_applicable: boolean;
}

export interface UpdateLeavePolicyDto extends Partial<CreateLeavePolicyDto> {}

export interface CreateLeavePolicyDetailDto {
  leave_policy_id: string;
  leave_type_id: string;
  annual_quota: number;
  accrual_type: 'yearly' | 'monthly' | 'quarterly';
  carry_forward_limit: number;
  encashment_limit: number;
  applicable_from_months: number;
}

export interface UpdateLeavePolicyDetailDto extends Partial<CreateLeavePolicyDetailDto> {}

// Leave Policies API
export const fetchLeavePolicies = async (): Promise<LeavePolicy[]> => {
  const response = await apiClient.get('/leave-policies');
  return response.data;
};

export const fetchLeavePolicy = async (id: string): Promise<LeavePolicy> => {
  const response = await apiClient.get(`/leave-policies/${id}`);
  return response.data;
};

export const createLeavePolicy = async (data: CreateLeavePolicyDto): Promise<LeavePolicy> => {
  const response = await apiClient.post('/leave-policies', data);
  return response.data;
};

export const updateLeavePolicy = async (id: string, data: UpdateLeavePolicyDto): Promise<LeavePolicy> => {
  const response = await apiClient.patch(`/leave-policies/${id}`, data);
  return response.data;
};

export const deleteLeavePolicy = async (id: string): Promise<void> => {
  await apiClient.delete(`/leave-policies/${id}`);
};

export const setCurrentPolicy = async (id: string): Promise<LeavePolicy> => {
  const response = await apiClient.post(`/leave-policies/${id}/set-current`);
  return response.data;
};

// Leave Policy Details API
export const fetchLeavePolicyDetails = async (policyId: string): Promise<LeavePolicyDetail[]> => {
  const response = await apiClient.get(`/leave-policy-details/policy/${policyId}`);
  return response.data;
};

export const fetchLeavePolicyDetail = async (id: string): Promise<LeavePolicyDetail> => {
  const response = await apiClient.get(`/leave-policy-details/${id}`);
  return response.data;
};

export const createLeavePolicyDetail = async (data: CreateLeavePolicyDetailDto): Promise<LeavePolicyDetail> => {
  const response = await apiClient.post('/leave-policy-details', data);
  return response.data;
};

export const updateLeavePolicyDetail = async (id: string, data: UpdateLeavePolicyDetailDto): Promise<LeavePolicyDetail> => {
  const response = await apiClient.patch(`/leave-policy-details/${id}`, data);
  return response.data;
};

export const deleteLeavePolicyDetail = async (id: string): Promise<void> => {
  await apiClient.delete(`/leave-policy-details/${id}`);
}; 
import { apiClient } from './client';

export interface LeaveApprovalStep {
  id: string;
  leave_application_id: string;
  approver_level: number;
  approver_id: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  actioned_at?: string;
  created_at: string;
  updated_at: string;
  approver?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface LeaveApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  levels: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateApprovalStepDto {
  leave_application_id: string;
  approver_level: number;
  approver_id: string;
}

export interface UpdateApprovalStepDto {
  status: 'approved' | 'rejected';
  comments?: string;
}

export interface CreateApprovalWorkflowDto {
  name: string;
  description: string;
  levels: number;
  is_active: boolean;
}

// Fetch approval steps for a leave application
export const fetchLeaveApprovalSteps = async (leaveApplicationId: string): Promise<LeaveApprovalStep[]> => {
  const response = await apiClient.get(`/leave-approval-workflow/${leaveApplicationId}`);
  return response.data;
};

// Create approval step
export const createApprovalStep = async (data: CreateApprovalStepDto): Promise<LeaveApprovalStep> => {
  const response = await apiClient.post('/leave-approval-steps', data);
  return response.data;
};

// Update approval step (approve/reject)
export const updateApprovalStep = async (id: string, data: UpdateApprovalStepDto): Promise<LeaveApprovalStep> => {
  const response = await apiClient.put(`/leave-approval-steps/${id}`, data);
  return response.data;
};

// Fetch approval workflows
export const fetchApprovalWorkflows = async (): Promise<LeaveApprovalWorkflow[]> => {
  const response = await apiClient.get('/leave-approval-workflows');
  return response.data;
};

// Create approval workflow
export const createApprovalWorkflow = async (data: CreateApprovalWorkflowDto): Promise<LeaveApprovalWorkflow> => {
  const response = await apiClient.post('/leave-approval-workflows', data);
  return response.data;
};

// Delete approval workflow
export const deleteApprovalWorkflow = async (id: string): Promise<void> => {
  await apiClient.delete(`/leave-approval-workflows/${id}`);
};

// Get pending approvals for a user
export const getPendingApprovalsForUser = async (userId: string): Promise<LeaveApprovalStep[]> => {
  const response = await apiClient.get(`/leave-approval-steps/pending/${userId}`);
  return response.data;
}; 
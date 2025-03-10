import { apiClient } from './client';
import { LeaveType } from './leaveTypes';

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface LeaveApplication {
  id: string;
  employee_id: string;
  leave_type_id: string;
  from_date: Date;
  to_date: Date;
  duration_days: number;
  first_day_half: boolean;
  last_day_half: boolean;
  reason: string;
  contact_during_leave: string;
  handover_to?: string;
  handover_notes?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  applied_at: Date;
  actioned_by?: string;
  actioned_at?: Date;
  rejection_reason?: string;
  attachment_url?: string;
  created_at: Date;
  updated_at: Date;
  employee?: Employee;
  leave_type?: LeaveType;
  approver?: any;
  handover_employee?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface CreateLeaveApplicationDto {
  employee_id: string;
  leave_type_id: string;
  from_date: Date | string;
  to_date: Date | string;
  duration_days?: number;
  first_day_half?: boolean;
  last_day_half?: boolean;
  reason: string;
  contact_during_leave: string;
  handover_to?: string;
  handover_notes?: string;
  attachment_url?: string;
}

export interface UpdateLeaveApplicationDto {
  from_date?: Date | string;
  to_date?: Date | string;
  duration_days?: number;
  first_day_half?: boolean;
  last_day_half?: boolean;
  reason?: string;
  contact_during_leave?: string;
  handover_to?: string;
  handover_notes?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
  attachment_url?: string;
}

export interface LeaveApplicationsFilter {
  employee_id?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}

export const fetchLeaveApplications = async (filter?: LeaveApplicationsFilter): Promise<LeaveApplication[]> => {
  const params = filter || {};
  return apiClient.get('/leave-applications', { params }) as Promise<LeaveApplication[]>;
};

export const fetchLeaveApplication = async (id: string): Promise<LeaveApplication> => {
  return apiClient.get(`/leave-applications/${id}`);
};

export const createLeaveApplication = async (data: CreateLeaveApplicationDto): Promise<LeaveApplication> => {
  return apiClient.post('/leave-applications', data) as Promise<LeaveApplication>;
};

export const updateLeaveApplication = async (
  id: string,
  data: UpdateLeaveApplicationDto
): Promise<LeaveApplication> => {
  return apiClient.put(`/leave-applications/${id}`, data) as Promise<LeaveApplication>;
};

export const deleteLeaveApplication = async (id: string): Promise<void> => {
  return apiClient.delete(`/leave-applications/${id}`);
};

export const approveLeaveApplication = async (id: string): Promise<LeaveApplication> => {
  const response = await apiClient.put(`/leave-applications/${id}/approve`);
  
  // Sync with attendance
  try {
    await apiClient.post('/api/leave-attendance-sync', {
      leave_application_id: id,
      status: 'approved'
    });
  } catch (error) {
    console.error('Error syncing attendance with leave:', error);
    // Don't fail the entire operation if attendance sync fails
  }
  
  return response.data;
};

export const rejectLeaveApplication = async (
  id: string,
  rejectionReason: string
): Promise<LeaveApplication> => {
  const response = await apiClient.put(`/leave-applications/${id}/reject`, { rejection_reason: rejectionReason });
  return response.data;
};

export const cancelLeaveApplication = async (id: string): Promise<LeaveApplication> => {
  const response = await apiClient.put(`/leave-applications/${id}/cancel`);
  
  // Update attendance records
  try {
    await apiClient.post('/api/leave-attendance-sync', {
      leave_application_id: id,
      status: 'cancelled'
    });
  } catch (error) {
    console.error('Error syncing attendance after cancellation:', error);
    // Don't fail the entire operation if attendance sync fails
  }
  
  return response.data;
};

export const getLeaveApplications = async (
  employeeId?: string,
  status?: string
): Promise<LeaveApplication[]> => {
  const params: any = {};
  
  if (employeeId) params.employee_id = employeeId;
  if (status) params.status = status;
  
  const response = await apiClient.get('/leave-applications', { params });
  return response.data;
};

export const getLeaveApplication = async (id: string): Promise<LeaveApplication> => {
  const response = await apiClient.get(`/leave-applications/${id}`);
  return response.data;
};

export const getEmployeeLeaveApplications = async (employeeId: string): Promise<LeaveApplication[]> => {
  const response = await apiClient.get(`/leave-applications/employee/${employeeId}`);
  return response.data;
};

export const getPendingLeaveApplications = async (): Promise<LeaveApplication[]> => {
  const response = await apiClient.get('/leave-applications/pending');
  return response.data;
};

export const getLeaveApplicationsByDateRange = async (
  employeeId: string,
  startDate: string,
  endDate: string
): Promise<LeaveApplication[]> => {
  const params = {
    employee_id: employeeId,
    start_date: startDate,
    end_date: endDate
  };
  
  const response = await apiClient.get('/leave-applications/date-range', { params });
  return response.data;
};

export const getLeaveApplicationsOnDate = async (
  date: string,
  departmentId?: string
): Promise<LeaveApplication[]> => {
  const params: any = { date };
  if (departmentId) params.department_id = departmentId;
  
  const response = await apiClient.get('/leave-applications/on-date', { params });
  return response.data;
}; 
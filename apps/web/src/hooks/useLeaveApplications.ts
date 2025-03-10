import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { LeaveApplication } from '../types/index';

interface UseLeaveApplicationsProps {
  employeeId?: string;
  status?: string;
}

interface UseLeaveApplicationsResult {
  leaveApplications: LeaveApplication[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useLeaveApplications = (
  { employeeId, status }: UseLeaveApplicationsProps = {}
): UseLeaveApplicationsResult => {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaveApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '/leave-applications';
      const params = new URLSearchParams();
      
      if (employeeId) {
        params.append('employee_id', employeeId);
      }
      
      if (status) {
        params.append('status', status);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      setLeaveApplications(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveApplications();
  }, [employeeId, status]);

  return {
    leaveApplications,
    loading,
    error,
    refetch: fetchLeaveApplications
  };
}; 
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Employee } from '../types';

interface UseTeamMembersResult {
  teamMembers: Employee[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useTeamMembers = (): UseTeamMembersResult => {
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This endpoint would need to be implemented in the backend
      // It should return employees based on the current user's team/department
      const response = await apiClient.get('/employees/team');
      setTeamMembers(response.data);
    } catch (err) {
      setError(err as Error);
      
      // Fallback for development - fetch all employees
      try {
        const allEmployeesResponse = await apiClient.get('/employees');
        setTeamMembers(allEmployeesResponse.data);
      } catch (fallbackErr) {
        // Keep the original error
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return {
    teamMembers,
    loading,
    error,
    refetch: fetchTeamMembers
  };
}; 
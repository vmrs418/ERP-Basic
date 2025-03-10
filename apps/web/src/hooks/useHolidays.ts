import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Holiday } from '../types';

interface UseHolidaysProps {
  year?: number;
}

interface UseHolidaysResult {
  holidays: Holiday[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useHolidays = (
  { year = new Date().getFullYear() }: UseHolidaysProps = {}
): UseHolidaysResult => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(`/holidays?year=${year}`);
      setHolidays(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [year]);

  return {
    holidays,
    loading,
    error,
    refetch: fetchHolidays
  };
}; 
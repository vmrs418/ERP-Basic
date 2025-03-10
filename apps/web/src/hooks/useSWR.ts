import useSWR, { SWRConfiguration } from 'swr';
import { api } from '../api/apiClient';

// Default fetcher function
const defaultFetcher = async (url: string) => {
  if (url.startsWith('http')) {
    // For absolute URLs
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } else {
    // For relative URLs, use our API client's underlying fetch mechanism
    // Extract the path without the query string
    const path = url.split('?')[0];
    
    // Handle specific endpoints based on path patterns
    if (path.startsWith('/employees')) {
      if (path === '/employees') {
        // Handle /employees endpoint
        return api.employees.getEmployees(parseQueryParams(url));
      } else {
        // Handle /employees/:id endpoint
        const id = path.split('/')[2];
        return api.employees.getEmployee(id);
      }
    } else if (path.startsWith('/attendance-records')) {
      if (path === '/attendance-records') {
        // Handle /attendance-records endpoint
        return api.attendance.getRecords(parseQueryParams(url));
      } else {
        // Handle /attendance-records/:id endpoint
        const id = path.split('/')[2];
        return api.attendance.getRecord(id);
      }
    } else if (path.startsWith('/leave-applications')) {
      if (path === '/leave-applications') {
        // Handle /leave-applications endpoint
        return api.leave.getApplications(parseQueryParams(url));
      } else {
        // Handle /leave-applications/:id endpoint
        const id = path.split('/')[2];
        return api.leave.getApplication(id);
      }
    }
    
    // Default case - should not reach here with our current routes
    throw new Error(`Unknown API endpoint: ${url}`);
  }
};

// Helper to parse query parameters from a URL
const parseQueryParams = (url: string): Record<string, any> => {
  const params: Record<string, any> = {};
  const queryString = url.split('?')[1];
  
  if (!queryString) return params;
  
  const searchParams = new URLSearchParams(queryString);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

// Generic SWR hook for API requests
export function useApiSWR<T = any>(
  url: string | null, 
  params?: Record<string, any>,
  config?: SWRConfiguration
) {
  // Only fetch if URL is provided
  const shouldFetch = !!url;
  const fullUrl = shouldFetch ? (params ? `${url}?${new URLSearchParams(
    // Filter out undefined values
    Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    )
  ).toString()}` : url) : null;
  
  return useSWR<T>(
    fullUrl,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      ...config
    }
  );
}

// Employee hooks
export function useEmployees<T = any>(params?: Record<string, any>, config?: SWRConfiguration) {
  return useApiSWR<T>('/employees', params, config);
}

export function useEmployee<T = any>(id: string | null, config?: SWRConfiguration) {
  return useApiSWR<T>(id ? `/employees/${id}` : null, undefined, config);
}

// Attendance hooks
export function useAttendanceRecords<T = any>(
  params?: Record<string, any> | null, 
  config?: SWRConfiguration
) {
  return useApiSWR<T>(params ? '/attendance-records' : null, params || undefined, config);
}

export function useAttendanceRecord<T = any>(id: string | null, config?: SWRConfiguration) {
  return useApiSWR<T>(id ? `/attendance-records/${id}` : null, undefined, config);
}

// Leave hooks
export function useLeaveApplications<T = any>(params?: Record<string, any>, config?: SWRConfiguration) {
  return useApiSWR<T>('/leave-applications', params, config);
}

export function useLeaveApplication<T = any>(id: string | null, config?: SWRConfiguration) {
  return useApiSWR<T>(id ? `/leave-applications/${id}` : null, undefined, config);
}

export function useLeaveBalance<T = any>(employeeId: string | null, config?: SWRConfiguration) {
  return useApiSWR<T>(employeeId ? `/employees/${employeeId}/leave-balance` : null, undefined, config);
} 
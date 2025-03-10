import { supabase } from '../utils/supabaseClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any, 
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // Build URL with query parameters
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  // Get auth header
  const authHeader = await getAuthHeader();
  
  // Build fetch options
  const fetchConfig: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...(fetchOptions.headers as Record<string, string> || {})
    },
    ...fetchOptions,
  };
  
  if (data && method !== 'GET') {
    fetchConfig.body = JSON.stringify(data);
  }
  
  // Make request
  const response = await fetch(url.toString(), fetchConfig);
  
  // Handle API errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  
  // Parse response
  if (response.status === 204) {
    return null as T;
  }
  
  return response.json();
}

// API resources
export const api = {
  // Employees
  employees: {
    getEmployees: (params?: any) => 
      apiRequest('/employees', 'GET', undefined, { params }),
    getEmployee: (id: string) => 
      apiRequest(`/employees/${id}`, 'GET'),
    createEmployee: (data: any) => 
      apiRequest('/employees', 'POST', data),
    updateEmployee: (id: string, data: any) => 
      apiRequest(`/employees/${id}`, 'PATCH', data),
    deleteEmployee: (id: string) => 
      apiRequest(`/employees/${id}`, 'DELETE'),
    getDepartments: () => 
      apiRequest('/departments', 'GET'),
    getDesignations: () => 
      apiRequest('/designations', 'GET'),
    addDepartment: (employeeId: string, data: any) => 
      apiRequest(`/employees/${employeeId}/departments`, 'POST', data),
    addDesignation: (employeeId: string, data: any) => 
      apiRequest(`/employees/${employeeId}/designations`, 'POST', data),
  },
  
  // Attendance
  attendance: {
    getRecords: async (params = {}) => {
      return await apiRequest('/attendance-records', 'GET', null, params);
    },
    getRecord: async (id: string) => {
      return await apiRequest(`/attendance-records/${id}`, 'GET');
    },
    createRecord: async (data: any) => {
      return await apiRequest('/attendance-records', 'POST', data);
    },
    updateRecord: async (id: string, data: any) => {
      return await apiRequest(`/attendance-records/${id}`, 'PATCH', data);
    },
    deleteRecord: async (id: string) => {
      return await apiRequest(`/attendance-records/${id}`, 'DELETE');
    },
    checkIn: async (data: any) => {
      return await apiRequest('/attendance-records/check-in', 'POST', data);
    },
    checkOut: async (data: any) => {
      return await apiRequest('/attendance-records/check-out', 'POST', data);
    },
  },
  
  // Leave
  leave: {
    getApplications: (params?: any) => 
      apiRequest('/leave-applications', 'GET', undefined, { params }),
    getApplication: (id: string) => 
      apiRequest(`/leave-applications/${id}`, 'GET'),
    createApplication: (data: any) => 
      apiRequest('/leave-applications', 'POST', data),
    updateApplication: (id: string, data: any) => 
      apiRequest(`/leave-applications/${id}`, 'PATCH', data),
    deleteApplication: (id: string) => 
      apiRequest(`/leave-applications/${id}`, 'DELETE'),
    approveApplication: (id: string, data: any) => 
      apiRequest(`/leave-applications/${id}/approve`, 'POST', data),
    rejectApplication: (id: string, data: any) => 
      apiRequest(`/leave-applications/${id}/reject`, 'POST', data),
    cancelApplication: (id: string, data: any) => 
      apiRequest(`/leave-applications/${id}/cancel`, 'POST', data),
    getLeaveBalance: (employeeId: string, year?: number) => 
      apiRequest(`/employee-leave-balances/employee/${employeeId}/year/${year || new Date().getFullYear()}`, 'GET'),
    getLeaveTypes: () => 
      apiRequest('/leave-types', 'GET'),
    getLeaveType: (id: string) => 
      apiRequest(`/leave-types/${id}`, 'GET'),
    createLeaveType: (data: any) => 
      apiRequest('/leave-types', 'POST', data),
    updateLeaveType: (id: string, data: any) => 
      apiRequest(`/leave-types/${id}`, 'PATCH', data),
    deleteLeaveType: (id: string) => 
      apiRequest(`/leave-types/${id}`, 'DELETE'),
    getPendingForApproval: () => 
      apiRequest('/leave-applications/pending/for-approval', 'GET'),
  },
  
  // Auth
  auth: {
    getCurrentUser: () => 
      apiRequest('/auth/me', 'GET'),
    updateProfile: (data: any) => 
      apiRequest('/auth/profile', 'PATCH', data),
    changePassword: (data: any) => 
      apiRequest('/auth/change-password', 'POST', data),
  },
  
  departments: {
    getAll: async () => {
      return await apiRequest<{ items: any[]; total: number }>('/departments');
    },
    getDepartment: async (id: string) => {
      return await apiRequest<any>(`/departments/${id}`);
    },
    createDepartment: async (data: any) => {
      return await apiRequest<any>('/departments', 'POST', data);
    },
    updateDepartment: async (id: string, data: any) => {
      return await apiRequest<any>(`/departments/${id}`, 'PATCH', data);
    },
    deleteDepartment: async (id: string) => {
      return await apiRequest<void>(`/departments/${id}`, 'DELETE');
    },
  },
};

// For backward compatibility
export const apiClient = api; 
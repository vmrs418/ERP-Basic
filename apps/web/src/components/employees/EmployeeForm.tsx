import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useEmployee } from '../../hooks/useSWR';
import { EmployeeStatus } from '@erp-system/shared-models';
import { api } from '../../api/apiClient';

interface EmployeeFormProps {
  employeeId?: string;
  isEditMode: boolean;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  employee_code: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  address: string;
  date_of_joining: string;
  status: string;
  employment_type: string;
  work_location: string;
  department_id: string;
  designation_id: string;
  reporting_manager_id: string;
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

interface EmployeeWithRelations {
  employee: {
    id: string;
    profile_picture_url?: string;
    first_name: string;
    last_name: string;
    email: string;
    employee_code: string;
    status: string;
    reporting_manager_id?: string;
    emergency_contact_name?: string;
    emergency_contact_relationship?: string;
    emergency_contact_phone?: string;
  };
  current_department?: {
    id: string;
    name: string;
  };
  current_designation?: {
    id: string;
    title: string;
  };
}

interface Department {
  id: string;
  name: string;
}

interface Designation {
  id: string;
  title: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employeeId, isEditMode }) => {
  const router = useRouter();
  const { data: employeeData, error } = useEmployee(employeeId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [managers, setManagers] = useState<EmployeeWithRelations[]>([]);

  const initialFormState: FormData = {
    first_name: '',
    last_name: '',
    email: '',
    employee_code: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    address: '',
    date_of_joining: new Date().toISOString().split('T')[0],
    status: EmployeeStatus.ACTIVE,
    employment_type: 'full_time',
    work_location: 'on_site',
    department_id: '',
    designation_id: '',
    reporting_manager_id: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});

  // Load employee data for edit mode
  useEffect(() => {
    if (isEditMode && employeeData && employeeData.employee) {
      const { employee } = employeeData;
      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        employee_code: employee.employee_code || '',
        phone_number: employee.phone_number || '',
        date_of_birth: employee.date_of_birth ? new Date(employee.date_of_birth).toISOString().split('T')[0] : '',
        gender: employee.gender || '',
        address: employee.address || '',
        date_of_joining: employee.date_of_joining ? new Date(employee.date_of_joining).toISOString().split('T')[0] : '',
        status: employee.status || EmployeeStatus.ACTIVE,
        employment_type: employee.employment_type || 'full_time',
        work_location: employee.work_location || 'on_site',
        department_id: employeeData.current_department?.id || '',
        designation_id: employeeData.current_designation?.id || '',
        reporting_manager_id: employee.reporting_manager_id || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_relationship: employee.emergency_contact_relationship || '',
        emergency_contact_phone: employee.emergency_contact_phone || ''
      });
    }
  }, [isEditMode, employeeData]);

  // Fetch departments, designations, and potential managers
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [deptResponse, desigResponse, managersResponse] = await Promise.all([
          api.employees.getDepartments() as Promise<ApiResponse<{ id: string; name: string }>>,
          api.employees.getDesignations() as Promise<ApiResponse<{ id: string; title: string }>>,
          api.employees.getEmployees({ status: EmployeeStatus.ACTIVE }) as Promise<ApiResponse<EmployeeWithRelations>>
        ]);
        
        setDepartments(deptResponse.items || []);
        setDesignations(desigResponse.items || []);
        setManagers(managersResponse.items || []);
      } catch (error) {
        console.error('Failed to fetch reference data:', error);
        // Show error notification or message
      }
    };
    
    fetchReferenceData();
  }, []);

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.employee_code.trim()) newErrors.employee_code = 'Employee code is required';
    if (!formData.date_of_joining) newErrors.date_of_joining = 'Joining date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when user makes changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isEditMode && employeeId) {
        await api.employees.updateEmployee(employeeId, formData);
      } else {
        await api.employees.createEmployee(formData);
      }
      
      router.push('/employees');
    } catch (error) {
      console.error('Failed to save employee:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle loading and error states
  if (isEditMode && !employeeData && !error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isEditMode && error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Failed to load employee: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Section */}
          <div className="space-y-4 col-span-2">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name*
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                />
                {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
              </div>
              
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name*
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                />
                {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
              
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Employment Information Section */}
          <div className="space-y-4 col-span-2">
            <h3 className="text-lg font-medium text-gray-900">Employment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="employee_code" className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Code*
                </label>
                <input
                  type="text"
                  id="employee_code"
                  name="employee_code"
                  value={formData.employee_code}
                  onChange={handleChange}
                  className={`w-full border ${errors.employee_code ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                />
                {errors.employee_code && <p className="mt-1 text-xs text-red-500">{errors.employee_code}</p>}
              </div>
              
              <div>
                <label htmlFor="date_of_joining" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Joining*
                </label>
                <input
                  type="date"
                  id="date_of_joining"
                  name="date_of_joining"
                  value={formData.date_of_joining}
                  onChange={handleChange}
                  className={`w-full border ${errors.date_of_joining ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                />
                {errors.date_of_joining && <p className="mt-1 text-xs text-red-500">{errors.date_of_joining}</p>}
              </div>
              
              <div>
                <label htmlFor="department_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="designation_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Designation
                </label>
                <select
                  id="designation_id"
                  name="designation_id"
                  value={formData.designation_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                >
                  <option value="">Select Designation</option>
                  {designations.map((desig: any) => (
                    <option key={desig.id} value={desig.id}>
                      {desig.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="reporting_manager_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Reporting Manager
                </label>
                <select
                  id="reporting_manager_id"
                  name="reporting_manager_id"
                  value={formData.reporting_manager_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                >
                  <option value="">Select Manager</option>
                  {managers.map((manager: any) => (
                    <option key={manager.employee.id} value={manager.employee.id}>
                      {manager.employee.first_name} {manager.employee.last_name} ({manager.employee.employee_code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                >
                  <option value={EmployeeStatus.ACTIVE}>Active</option>
                  <option value={EmployeeStatus.ON_NOTICE}>On Notice</option>
                  <option value={EmployeeStatus.ON_LEAVE}>On Leave</option>
                  <option value={EmployeeStatus.TERMINATED}>Terminated</option>
                  <option value={EmployeeStatus.ABSCONDING}>Absconding</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  id="employment_type"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                  <option value="probation">Probation</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="work_location" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Location
                </label>
                <select
                  id="work_location"
                  name="work_location"
                  value={formData.work_location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                >
                  <option value="on_site">On Site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Emergency Contact Section */}
          <div className="space-y-4 col-span-2">
            <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
              
              <div>
                <label htmlFor="emergency_contact_relationship" className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  id="emergency_contact_relationship"
                  name="emergency_contact_relationship"
                  value={formData.emergency_contact_relationship}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
              
              <div>
                <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={() => router.push('/employees')}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md mr-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Employee'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm; 
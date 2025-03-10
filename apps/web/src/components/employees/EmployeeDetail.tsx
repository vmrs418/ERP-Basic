import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useEmployee } from '../../hooks/useSWR';
import { EmployeeStatus } from '@erp-system/shared-models';
import { api } from '../../api/apiClient';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-2 font-medium text-sm border-b-2 ${
      isActive 
        ? 'border-blue-500 text-blue-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const EmployeeDetail: React.FC<{ employeeId: string }> = ({ employeeId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const { data: employeeData, error, mutate } = useEmployee(employeeId);

  // Handle loading and error states
  if (!employeeData && !error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Failed to load employee: {error.message}
      </div>
    );
  }

  const { employee, current_department, current_designation } = employeeData;

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on_notice': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-blue-100 text-blue-800';
      case 'absconding': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await api.employees.updateEmployee(employeeId, { status: newStatus });
      mutate(); // Refresh data
    } catch (error) {
      console.error('Failed to update employee status:', error);
      // Show error notification
    }
  };

  const handleEdit = () => {
    router.push(`/employees/${employeeId}/edit`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-6 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center">
            <div className="mr-4">
              {employee.profile_picture_url ? (
                <img 
                  src={employee.profile_picture_url} 
                  alt={`${employee.first_name} ${employee.last_name}`} 
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-600 font-medium">
                    {employee.first_name[0]}{employee.last_name[0]}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h1>
              <div className="mt-1 flex items-center">
                <span className="text-gray-500 mr-2">{employee.employee_code}</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(employee.status)}`}>
                  {employee.status.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-1 text-gray-600">
                {current_designation?.title || 'No Designation'} {current_department && `at ${current_department.name}`}
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            <div className="relative inline-block text-left">
              <select
                onChange={(e) => handleStatusChange(e.target.value)}
                value={employee.status}
                className="border border-gray-300 bg-white rounded-md shadow-sm pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              >
                <option value={EmployeeStatus.ACTIVE}>Active</option>
                <option value={EmployeeStatus.ON_NOTICE}>On Notice</option>
                <option value={EmployeeStatus.ON_LEAVE}>On Leave</option>
                <option value={EmployeeStatus.TERMINATED}>Terminated</option>
                <option value={EmployeeStatus.ABSCONDING}>Absconding</option>
              </select>
            </div>
            
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b">
          <div className="flex space-x-4">
            <Tab 
              label="Profile" 
              isActive={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
            />
            <Tab 
              label="Attendance" 
              isActive={activeTab === 'attendance'} 
              onClick={() => setActiveTab('attendance')} 
            />
            <Tab 
              label="Leave" 
              isActive={activeTab === 'leave'} 
              onClick={() => setActiveTab('leave')} 
            />
            <Tab 
              label="History" 
              isActive={activeTab === 'history'} 
              onClick={() => setActiveTab('history')} 
            />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Full Name</span>
                  <span className="text-gray-900">{employee.first_name} {employee.last_name}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900">{employee.email}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-gray-900">{employee.phone_number || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Date of Birth</span>
                  <span className="text-gray-900">{employee.date_of_birth ? formatDate(employee.date_of_birth) : 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Gender</span>
                  <span className="text-gray-900">{employee.gender || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Address</span>
                  <span className="text-gray-900">{employee.address || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Employee Code</span>
                  <span className="text-gray-900">{employee.employee_code}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Department</span>
                  <span className="text-gray-900">{current_department?.name || 'Not assigned'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Designation</span>
                  <span className="text-gray-900">{current_designation?.title || 'Not assigned'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Joining Date</span>
                  <span className="text-gray-900">{formatDate(employee.date_of_joining)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(employee.status)}`}>
                    {employee.status.replace('_', ' ')}
                  </span>
                </div>
                {employee.status === 'terminated' && (
                  <div className="grid grid-cols-2">
                    <span className="text-gray-500">Termination Date</span>
                    <span className="text-gray-900">{employee.termination_date ? formatDate(employee.termination_date) : 'Not recorded'}</span>
                  </div>
                )}
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Reporting Manager</span>
                  <span className="text-gray-900">{employee.reporting_manager_id ? 'Assigned' : 'Not assigned'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Name</span>
                  <span className="text-gray-900">{employee.emergency_contact_name || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Relationship</span>
                  <span className="text-gray-900">{employee.emergency_contact_relationship || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-gray-900">{employee.emergency_contact_phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Work Location</span>
                  <span className="text-gray-900">{employee.work_location || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Employment Type</span>
                  <span className="text-gray-900">{employee.employment_type || 'Not provided'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Created At</span>
                  <span className="text-gray-900">{formatDate(employee.created_at)}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-900">{formatDate(employee.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="text-center py-10">
            <p className="text-gray-500">Attendance records will be implemented in the next phase.</p>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="text-center py-10">
            <p className="text-gray-500">Leave management will be implemented in the next phase.</p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="text-center py-10">
            <p className="text-gray-500">Employee history will be implemented in the next phase.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail; 
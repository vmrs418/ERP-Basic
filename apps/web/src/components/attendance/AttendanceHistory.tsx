import React, { useState } from 'react';
import { useAttendanceRecords } from '../../hooks/useSWR';
import { AttendanceRecord } from '../../types/attendance';

interface AttendanceHistoryProps {
  employeeId: string;
}

interface AttendanceResponse {
  items: AttendanceRecord[];
  total: number;
}

interface FilterOptions {
  month: number;
  year: number;
  status: string;
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ employeeId }) => {
  const currentDate = new Date();
  
  // Initialize with current month and year
  const [filters, setFilters] = useState<FilterOptions>({
    month: currentDate.getMonth() + 1, // 1-12
    year: currentDate.getFullYear(),
    status: 'all'
  });
  
  // Calculate date range for the selected month
  const fromDate = new Date(filters.year, filters.month - 1, 1).toISOString().split('T')[0];
  const toDate = new Date(filters.year, filters.month, 0).toISOString().split('T')[0];
  
  // Fetch attendance records
  const { data: attendanceData, error, isValidating } = useAttendanceRecords<AttendanceResponse>(
    employeeId
      ? {
          employee_id: employeeId,
          from_date: fromDate,
          to_date: toDate,
          status: filters.status !== 'all' ? filters.status : undefined
        }
      : null
  );
  
  // Handle filter changes
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, month: parseInt(e.target.value) }));
  };
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, year: parseInt(e.target.value) }));
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, status: e.target.value }));
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Format time for display (convert from HH:MM:SS to 12h format)
  const formatTime = (timeString?: string) => {
    if (!timeString) return '—';
    
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'half_day':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-blue-100 text-blue-800';
      case 'weekend':
        return 'bg-gray-100 text-gray-800';
      case 'holiday':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Generate month options
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  
  // Generate year options (past 2 years to next year)
  const yearOptions = [];
  const currentYear = currentDate.getFullYear();
  for (let y = currentYear - 2; y <= currentYear + 1; y++) {
    yearOptions.push(y);
  }
  
  // Calculate attendance statistics
  const presentDays = attendanceData?.items?.filter(r => r.status === 'present')?.length || 0;
  const halfDays = attendanceData?.items?.filter(r => r.status === 'half_day')?.length || 0;
  const absentDays = attendanceData?.items?.filter(r => r.status === 'absent')?.length || 0;
  const totalHours = attendanceData?.items?.reduce((sum, r) => sum + (r.working_hours || 0), 0) || 0;
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Filter Attendance Records</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              id="month"
              value={filters.month}
              onChange={handleMonthChange}
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              id="year"
              value={filters.year}
              onChange={handleYearChange}
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
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
              value={filters.status}
              onChange={handleStatusChange}
              className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="half_day">Half Day</option>
              <option value="absent">Absent</option>
              <option value="on_leave">On Leave</option>
              <option value="weekend">Weekend</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Loading state */}
      {isValidating && !attendanceData && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Failed to load attendance records. Please try again.
        </div>
      )}
      
      {/* No data state */}
      {attendanceData?.items?.length === 0 && (
        <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600">
          No attendance records found for the selected time period.
        </div>
      )}
      
      {/* Attendance records table */}
      {attendanceData?.items && attendanceData.items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.items.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(record.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(record.status)}`}>
                      {record.status === 'present'
                        ? 'Present'
                        : record.status === 'half_day'
                          ? 'Half Day'
                          : record.status === 'absent'
                            ? 'Absent'
                            : record.status === 'on_leave'
                              ? 'On Leave'
                              : record.status === 'weekend'
                                ? 'Weekend'
                                : 'Holiday'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatTime(record.check_in_time)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatTime(record.check_out_time)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {record.working_hours ? `${record.working_hours.toFixed(2)} hrs` : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 capitalize">{record.source || 'system'}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Summary section */}
      {attendanceData?.items && attendanceData.items.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-green-800">
              <div className="text-sm font-medium">Present Days</div>
              <div className="text-2xl font-bold">{presentDays}</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800">
              <div className="text-sm font-medium">Half Days</div>
              <div className="text-2xl font-bold">{halfDays}</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg text-red-800">
              <div className="text-sm font-medium">Absent Days</div>
              <div className="text-2xl font-bold">{absentDays}</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
              <div className="text-sm font-medium">Total Hours</div>
              <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {attendanceData && attendanceData.items && attendanceData.items.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          {/* Pagination controls */}
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory; 
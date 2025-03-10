import React, { useState } from 'react';
import { api } from '../../api/apiClient';
import { useEmployees } from '../../hooks/useSWR';
import { AttendanceRecord } from '../../types/attendance';
import { Employee } from '../../types/employee';

interface AttendanceSummaryProps {
  departmentId?: string;
}

interface EmployeeResponse {
  items: {
    employee: Employee;
  }[];
  total: number;
}

interface AttendanceResponse {
  items: AttendanceRecord[];
  total: number;
}

interface SummaryData {
  employeeId: string;
  month: number;
  year: number;
  businessDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  totalWorkingHours: number;
  attendancePercentage: number;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ departmentId }) => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<Record<string, SummaryData>>({});
  
  // Fetch employees
  const { data: employeesData } = useEmployees<EmployeeResponse>(
    departmentId ? { department_id: departmentId } : undefined
  );
  
  const employees = employeesData?.items || [];
  
  // Load attendance summary for all employees
  const loadAttendanceSummary = async () => {
    if (employees.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const summaries: Record<string, SummaryData> = {};
      
      // Fetch attendance summary for each employee
      await Promise.all(
        employees.map(async (emp) => {
          try {
            const response = await api.attendance.getRecords({
              employee_id: emp.employee.id,
              from_date: new Date(year, month - 1, 1).toISOString().split('T')[0],
              to_date: new Date(year, month, 0).toISOString().split('T')[0]
            }) as AttendanceResponse;
            
            // Process attendance data to create summary
            const data = response.items || [];
            const businessDays = 20; // This should be calculated based on weekends and holidays
            
            const presentDays = data.filter(r => r.status === 'present').length;
            const absentDays = data.filter(r => r.status === 'absent').length;
            const halfDays = data.filter(r => r.status === 'half_day').length;
            const leaveDays = data.filter(r => r.status === 'on_leave').length;
            const totalWorkingHours = data.reduce((sum: number, r) => sum + (r.working_hours || 0), 0);
            
            // Calculate attendance percentage
            const attendancePercentage = (presentDays / businessDays) * 100;
            
            summaries[emp.employee.id] = {
              employeeId: emp.employee.id,
              month,
              year,
              businessDays,
              presentDays,
              absentDays,
              halfDays,
              leaveDays,
              lateArrivals: 0, // Would need additional logic
              earlyDepartures: 0, // Would need additional logic
              totalWorkingHours,
              attendancePercentage
            };
          } catch (err) {
            console.error(`Failed to fetch data for employee ${emp.employee.id}:`, err);
          }
        })
      );
      
      setSummaryData(summaries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance summary');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter changes
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(parseInt(e.target.value));
  };
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
  };
  
  // Generate options
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
  
  const currentYear = currentDate.getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 2; y <= currentYear + 1; y++) {
    yearOptions.push(y);
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Team Attendance Summary</h2>
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <select
            id="month"
            value={month}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
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
            value={year}
            onChange={handleYearChange}
            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            {yearOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={loadAttendanceSummary}
          disabled={loading || employees.length === 0}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Generate Report'}
        </button>
      </div>
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* No data state */}
      {employees.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600">
          No employees found in the selected department.
        </div>
      ) : Object.keys(summaryData).length === 0 && !loading ? (
        <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600">
          Click "Generate Report" to view the attendance summary.
        </div>
      ) : null}
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Summary table */}
      {Object.keys(summaryData).length > 0 && !loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Half Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => {
                const summary = summaryData[emp.employee.id];
                if (!summary) return null;
                
                // Determine row color based on attendance percentage
                let rowClass = '';
                if (summary.attendancePercentage < 70) {
                  rowClass = 'bg-red-50';
                } else if (summary.attendancePercentage < 90) {
                  rowClass = 'bg-yellow-50';
                }
                
                return (
                  <tr key={emp.employee.id} className={`hover:bg-gray-50 ${rowClass}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {emp.employee.profile_picture_url ? (
                          <img 
                            className="h-8 w-8 rounded-full mr-3"
                            src={emp.employee.profile_picture_url}
                            alt=""
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-gray-600 text-xs font-medium">
                              {emp.employee.first_name[0]}{emp.employee.last_name[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {emp.employee.first_name} {emp.employee.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {emp.employee.employee_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{summary.presentDays}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{summary.absentDays}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{summary.halfDays}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{summary.leaveDays}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{summary.totalWorkingHours.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className={`text-sm font-medium ${
                          summary.attendancePercentage < 70 
                            ? 'text-red-700' 
                            : summary.attendancePercentage < 90 
                              ? 'text-yellow-700' 
                              : 'text-green-700'
                        }`}
                      >
                        {summary.attendancePercentage.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Department summary */}
      {Object.keys(summaryData).length > 0 && !loading && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Department Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Average Attendance</div>
              <div className="text-2xl font-bold text-blue-700">
                {(Object.values(summaryData).reduce((sum, s) => sum + s.attendancePercentage, 0) / Object.keys(summaryData).length).toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Total Hours Worked</div>
              <div className="text-2xl font-bold text-green-700">
                {Object.values(summaryData).reduce((sum, s) => sum + s.totalWorkingHours, 0).toFixed(1)}
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Employees Below 90%</div>
              <div className="text-2xl font-bold text-yellow-700">
                {Object.values(summaryData).filter(s => s.attendancePercentage < 90).length}
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-600 font-medium">Employees Below 70%</div>
              <div className="text-2xl font-bold text-red-700">
                {Object.values(summaryData).filter(s => s.attendancePercentage < 70).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceSummary; 
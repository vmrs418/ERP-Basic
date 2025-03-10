import React, { useState, useEffect } from 'react';
import { api } from '../../api/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { useAttendanceRecords } from '../../hooks/useSWR';
import { AttendanceRecord } from '../../types/attendance';

interface AttendanceTrackerProps {
  employeeId?: string;
}

interface AttendanceResponse {
  items: AttendanceRecord[];
  total: number;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ employeeId }) => {
  const { user } = useAuth();
  const effectiveEmployeeId = employeeId || user?.id;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch today's attendance records for this employee
  const { data: attendanceData, mutate } = useAttendanceRecords<AttendanceResponse>(
    effectiveEmployeeId 
      ? {
          employee_id: effectiveEmployeeId,
          from_date: today,
          to_date: today
        }
      : null
  );
  
  // Current record is the first record for today (if any)
  const currentRecord = attendanceData?.items?.[0];
  
  // Determine if already checked in or out
  const hasCheckedIn = !!currentRecord?.check_in_time;
  const hasCheckedOut = !!currentRecord?.check_out_time;
  
  // Reset messages after 5 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);
  
  // Handle check in
  const handleCheckIn = async () => {
    if (!effectiveEmployeeId) {
      setError('Employee ID is missing');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const currentTime = new Date().toTimeString().split(' ')[0];
      
      await api.attendance.checkIn({
        employee_id: effectiveEmployeeId,
        date: today,
        time: currentTime,
        source: 'system'
      });
      
      // Refetch the attendance data
      await mutate();
      
      setSuccessMessage('Successfully checked in!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle check out
  const handleCheckOut = async () => {
    if (!effectiveEmployeeId) {
      setError('Employee ID is missing');
      return;
    }
    
    if (!currentRecord?.id) {
      setError('No check-in record found for today');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const currentTime = new Date().toTimeString().split(' ')[0];
      
      await api.attendance.checkOut({
        employee_id: effectiveEmployeeId,
        date: today,
        time: currentTime,
        source: 'system'
      });
      
      // Refetch the attendance data
      await mutate();
      
      setSuccessMessage('Successfully checked out!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check out');
    } finally {
      setLoading(false);
    }
  };
  
  // Format time for display (convert from 24h to 12h format)
  const formatTime = (timeString?: string) => {
    if (!timeString) return '—';
    
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Calculate hours worked if both check-in and check-out times are available
  const hoursWorked = () => {
    if (!currentRecord?.check_in_time || !currentRecord?.check_out_time) {
      return null;
    }
    
    // If the record already has working_hours, just return that
    if (currentRecord.working_hours) {
      return `${currentRecord.working_hours.toFixed(2)} hours`;
    }
    
    // Otherwise calculate it from the times
    const checkIn = new Date(`${today}T${currentRecord.check_in_time}`);
    const checkOut = new Date(`${today}T${currentRecord.check_out_time}`);
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    return `${diffHrs.toFixed(2)} hours`;
  };
  
  // If no employee ID, show a message
  if (!effectiveEmployeeId) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-center">
        <p className="text-yellow-700">
          Please sign in to use the attendance tracking features.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Date and current time */}
      <div className="text-center">
        <div className="text-sm text-gray-500">
          Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="mt-1 text-xl font-semibold text-gray-700">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Error and success messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      {/* Attendance actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleCheckIn}
          disabled={loading || hasCheckedIn}
          className={`
            px-6 py-3 rounded-lg font-medium ${
              hasCheckedIn 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
            }
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
            transition duration-150 ease-in-out
          `}
        >
          {loading && !hasCheckedOut ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : hasCheckedIn ? (
            'Already Checked In'
          ) : (
            'Check In'
          )}
        </button>
        
        <button
          onClick={handleCheckOut}
          disabled={loading || !hasCheckedIn || hasCheckedOut}
          className={`
            px-6 py-3 rounded-lg font-medium ${
              !hasCheckedIn || hasCheckedOut
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
            }
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
            transition duration-150 ease-in-out
          `}
        >
          {loading && hasCheckedIn && !hasCheckedOut ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : !hasCheckedIn ? (
            'Check In First'
          ) : hasCheckedOut ? (
            'Already Checked Out'
          ) : (
            'Check Out'
          )}
        </button>
      </div>
      
      {/* Today's attendance summary */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Today's Attendance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Check In</div>
            <div className="text-xl font-semibold text-gray-800">
              {formatTime(currentRecord?.check_in_time)}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Check Out</div>
            <div className="text-xl font-semibold text-gray-800">
              {formatTime(currentRecord?.check_out_time)}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Hours Worked</div>
            <div className="text-xl font-semibold text-gray-800">
              {hoursWorked() || '—'}
            </div>
          </div>
        </div>
        
        {currentRecord?.status && (
          <div className="mt-4">
            <span 
              className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  currentRecord.status === 'present'
                    ? 'bg-green-100 text-green-800'
                    : currentRecord.status === 'half_day'
                      ? 'bg-yellow-100 text-yellow-800'
                      : currentRecord.status === 'absent'
                        ? 'bg-red-100 text-red-800'
                        : currentRecord.status === 'on_leave'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                }
              `}
            >
              {currentRecord.status === 'present'
                ? 'Present'
                : currentRecord.status === 'half_day'
                  ? 'Half Day'
                  : currentRecord.status === 'absent'
                    ? 'Absent'
                    : currentRecord.status === 'on_leave'
                      ? 'On Leave'
                      : currentRecord.status === 'weekend'
                        ? 'Weekend'
                        : 'Holiday'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker; 
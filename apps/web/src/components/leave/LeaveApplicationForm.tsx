import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../api/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { LeaveType } from '../../types/leave';

interface LeaveApplicationFormProps {
  onSuccess?: () => void;
}

const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  });
  
  // Form validation
  const [formErrors, setFormErrors] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  });
  
  // Calculate days between dates
  const [days, setDays] = useState<number>(0);
  
  // Fetch leave types on component mount
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await api.leave.getLeaveTypes() as { items: LeaveType[] };
        if (response.items) {
          setLeaveTypes(response.items);
          
          // Set default leave type if available
          if (response.items.length > 0) {
            setFormData(prev => ({ ...prev, leave_type_id: response.items[0].id }));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leave types');
      }
    };
    
    fetchLeaveTypes();
  }, []);
  
  // Calculate days when dates change
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      
      // Check if dates are valid
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Calculate difference in days
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
        
        setDays(diffDays);
        
        // Clear end date error if it was previously set
        if (formErrors.end_date && end >= start) {
          setFormErrors(prev => ({ ...prev, end_date: '' }));
        }
      }
    } else {
      setDays(0);
    }
  }, [formData.start_date, formData.end_date, formErrors.end_date]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {
      leave_type_id: '',
      start_date: '',
      end_date: '',
      reason: ''
    };
    let isValid = true;
    
    if (!formData.leave_type_id) {
      errors.leave_type_id = 'Please select a leave type';
      isValid = false;
    }
    
    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
      isValid = false;
    }
    
    if (!formData.end_date) {
      errors.end_date = 'End date is required';
      isValid = false;
    } else if (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      errors.end_date = 'End date cannot be before start date';
      isValid = false;
    }
    
    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required';
      isValid = false;
    } else if (formData.reason.trim().length < 10) {
      errors.reason = 'Reason must be at least 10 characters';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('You must be logged in to apply for leave');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await api.leave.createApplication({
        employee_id: user.id,
        leave_type_id: formData.leave_type_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason
      });
      
      setSuccess('Leave application submitted successfully!');
      
      // Reset form
      setFormData({
        leave_type_id: leaveTypes.length > 0 ? leaveTypes[0].id : '',
        start_date: '',
        end_date: '',
        reason: ''
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/leave');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Apply for Leave</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leave Type */}
        <div>
          <label htmlFor="leave_type_id" className="block text-sm font-medium text-gray-700 mb-1">
            Leave Type *
          </label>
          <select
            id="leave_type_id"
            name="leave_type_id"
            value={formData.leave_type_id}
            onChange={handleChange}
            className={`
              w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
              ${formErrors.leave_type_id ? 'border-red-300' : 'border-gray-300'}
            `}
            disabled={loading || leaveTypes.length === 0}
          >
            {leaveTypes.length === 0 ? (
              <option value="">Loading leave types...</option>
            ) : (
              <>
                <option value="">Select a leave type</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} {type.is_paid ? '(Paid)' : '(Unpaid)'}
                  </option>
                ))}
              </>
            )}
          </select>
          {formErrors.leave_type_id && (
            <p className="mt-1 text-sm text-red-600">{formErrors.leave_type_id}</p>
          )}
        </div>
        
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} // Can't select past dates
              className={`
                w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                ${formErrors.start_date ? 'border-red-300' : 'border-gray-300'}
              `}
              disabled={loading}
            />
            {formErrors.start_date && (
              <p className="mt-1 text-sm text-red-600">{formErrors.start_date}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date || new Date().toISOString().split('T')[0]}
              className={`
                w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                ${formErrors.end_date ? 'border-red-300' : 'border-gray-300'}
              `}
              disabled={loading || !formData.start_date}
            />
            {formErrors.end_date && (
              <p className="mt-1 text-sm text-red-600">{formErrors.end_date}</p>
            )}
          </div>
        </div>
        
        {/* Days Calculation */}
        {days > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700">
              You are requesting <span className="font-bold">{days} day{days !== 1 ? 's' : ''}</span> of leave.
            </p>
          </div>
        )}
        
        {/* Reason */}
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Leave *
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            className={`
              w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
              ${formErrors.reason ? 'border-red-300' : 'border-gray-300'}
            `}
            placeholder="Please provide a detailed reason for your leave request"
            disabled={loading}
          />
          {formErrors.reason && (
            <p className="mt-1 text-sm text-red-600">{formErrors.reason}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveApplicationForm; 
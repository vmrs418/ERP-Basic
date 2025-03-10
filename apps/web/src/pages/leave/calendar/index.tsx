import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Calendar, Select, Badge, Tooltip, Modal, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { getLeaveApplications, LeaveApplication } from '../../../api/leaveApplications';
import { getEmployees, Employee } from '../../../api/employees';
import { getLeaveTypes, LeaveType } from '../../../api/leaveTypes';
import { useAuth } from '../../../contexts/AuthContext';
import { Role } from '../../../types/auth';

const { Option } = Select;

// Status colors for badges
const statusColors: Record<string, string> = {
  draft: 'default',
  pending: 'processing',
  approved: 'success',
  rejected: 'error',
  cancelled: 'warning',
};

const LeaveCalendarPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | 'all'>('all');
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState<string | 'all'>('all');
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  
  const isAdminOrHR = user?.roles?.some((role: Role) => ['admin', 'hr'].includes(role.name)) || false;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [leaveApplicationsData, employeesData, leaveTypesData] = await Promise.all([
        getLeaveApplications(),
        getEmployees(),
        getLeaveTypes()
      ]);
      
      setApplications(leaveApplicationsData);
      setEmployees(employeesData);
      setLeaveTypes(leaveTypesData);
    } catch (error) {
      console.error('Failed to load leave applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to get applications for a specific date
  const getApplicationsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    return applications.filter(app => {
      // Check if application falls within selected filters
      if (selectedEmployeeId !== 'all' && app.employee_id !== selectedEmployeeId) {
        return false;
      }
      
      if (selectedLeaveTypeId !== 'all' && app.leave_type_id !== selectedLeaveTypeId) {
        return false;
      }
      
      // Check if application date range includes this date
      const fromDate = new Date(app.from_date).toISOString().split('T')[0];
      const toDate = new Date(app.to_date).toISOString().split('T')[0];
      
      return dateString >= fromDate && dateString <= toDate;
    });
  };

  // Function to handle date cell rendering
  const dateCellRender = (value: Date) => {
    const applicationsForDate = getApplicationsForDate(value);
    
    return (
      <ul className="leave-list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {applicationsForDate.slice(0, 3).map(app => {
          // Find employee and leave type
          const employee = employees.find(e => e.id === app.employee_id);
          const leaveType = leaveTypes.find(lt => lt.id === app.leave_type_id);
          
          return (
            <li key={app.id} style={{ marginBottom: '2px' }}>
              <Tooltip 
                title={`${employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown'} - ${leaveType?.name || 'Unknown'}`}
              >
                <Badge 
                  status={statusColors[app.status] as any} 
                  text={employee ? `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}` : '??'} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => showApplicationDetails(app)}
                />
              </Tooltip>
            </li>
          );
        })}
        {applicationsForDate.length > 3 && (
          <li>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                showMoreApplications(value);
              }}
            >
              +{applicationsForDate.length - 3} more
            </a>
          </li>
        )}
      </ul>
    );
  };

  // Show details for a specific application
  const showApplicationDetails = (application: LeaveApplication) => {
    setSelectedApplication(application);
    setDetailsVisible(true);
  };

  // Show a list of all applications for a date
  const showMoreApplications = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    // In a real app, this would show a modal with all applications for the date
    alert(`All leave applications for ${dateString} would be shown here in a real app.`);
  };

  // Handle month change
  const onPanelChange = (value: any) => {
    setSelectedMonth(value.toDate());
  };

  // Handle month/year change in the calendar header
  const renderCalendarHeader = ({ value, onChange }: any) => {
    const currentMonth = value.month();
    const currentYear = value.year();
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
    
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Select
            value={currentMonth}
            onChange={(selectedMonth: number) => {
              const newValue = value.clone();
              newValue.month(selectedMonth);
              onChange(newValue);
            }}
            style={{ width: 120, marginRight: 8 }}
          >
            {months.map((month, index) => (
              <Option key={month} value={index}>{month}</Option>
            ))}
          </Select>
          <Select
            value={currentYear}
            onChange={(selectedYear: number) => {
              const newValue = value.clone();
              newValue.year(selectedYear);
              onChange(newValue);
            }}
            style={{ width: 100 }}
          >
            {years.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </div>
        
        <div>
          <Select
            placeholder="Select Employee"
            value={selectedEmployeeId}
            onChange={setSelectedEmployeeId}
            style={{ width: 150, marginRight: 8 }}
          >
            <Option value="all">All Employees</Option>
            {employees.map(emp => (
              <Option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</Option>
            ))}
          </Select>
          
          <Select
            placeholder="Select Leave Type"
            value={selectedLeaveTypeId}
            onChange={setSelectedLeaveTypeId}
            style={{ width: 150 }}
          >
            <Option value="all">All Leave Types</Option>
            {leaveTypes.map(type => (
              <Option key={type.id} value={type.id}>{type.name}</Option>
            ))}
          </Select>
        </div>
      </div>
    );
  };

  return (
    <MainLayout title="Leave Calendar">
      <div className="page-header">
        <h1>Leave Calendar</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => router.push('/leave/applications/create')}
        >
          Apply for Leave
        </Button>
      </div>

      <Card loading={loading}>
        <Calendar 
          dateCellRender={dateCellRender} 
          onPanelChange={onPanelChange}
          headerRender={renderCalendarHeader}
        />
      </Card>

      {/* Leave Application Details Modal */}
      <Modal
        title="Leave Application Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>,
          <Button 
            key="view" 
            type="primary" 
            onClick={() => {
              setDetailsVisible(false);
              router.push(`/leave/applications/${selectedApplication?.id}`);
            }}
          >
            View Full Details
          </Button>,
        ]}
      >
        {selectedApplication && (
          <div>
            <p>
              <strong>Status:</strong>{' '}
              <Tag color={statusColors[selectedApplication.status]}>{selectedApplication.status.toUpperCase()}</Tag>
            </p>
            <p>
              <strong>Employee:</strong>{' '}
              {employees.find(e => e.id === selectedApplication.employee_id)
                ? `${employees.find(e => e.id === selectedApplication.employee_id)?.first_name} ${employees.find(e => e.id === selectedApplication.employee_id)?.last_name}`
                : 'Unknown'}
            </p>
            <p>
              <strong>Leave Type:</strong>{' '}
              {leaveTypes.find(lt => lt.id === selectedApplication.leave_type_id)?.name || 'Unknown'}
            </p>
            <p>
              <strong>From:</strong> {new Date(selectedApplication.from_date).toLocaleDateString()}
            </p>
            <p>
              <strong>To:</strong> {new Date(selectedApplication.to_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Duration:</strong> {selectedApplication.duration_days} day(s)
            </p>
            <p>
              <strong>Reason:</strong> {selectedApplication.reason}
            </p>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};

export default LeaveCalendarPage; 
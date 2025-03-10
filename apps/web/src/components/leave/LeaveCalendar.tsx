import React, { useState, useEffect } from 'react';
import { Calendar, Button, Card } from 'antd';
import Typography from 'antd/lib/typography';
import type { Moment } from 'moment';
import moment from 'moment';
import { Tooltip, Tag, Col, Badge, Option, Select, Row, Spin } from '../common/AntdWrappers';
import { useLeaveApplications } from '../../hooks/useLeaveApplications';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useHolidays } from '../../hooks/useHolidays';
import { LeaveApplication, Holiday, Employee } from '../../types';

const { Title, Text } = Typography;

type CalendarMode = 'month' | 'year';

const LeaveCalendar: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('month');
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [selectedViewType, setSelectedViewType] = useState<'team' | 'department' | 'all'>('team');
  
  const { 
    leaveApplications, 
    loading: leaveLoading, 
    error: leaveError 
  } = useLeaveApplications({ status: 'approved' });
  
  const { 
    teamMembers, 
    loading: teamLoading, 
    error: teamError 
  } = useTeamMembers();
  
  const { 
    holidays, 
    loading: holidaysLoading, 
    error: holidaysError 
  } = useHolidays();

  const loading = leaveLoading || teamLoading || holidaysLoading;
  const error = leaveError || teamError || holidaysError;

  // Filter employees based on selection
  const getFilteredEmployees = (): Employee[] => {
    if (selectedViewType === 'all') {
      return teamMembers;
    }
    
    if (selectedViewType === 'team') {
      // Filter to only show your team (this is a simplified example)
      return teamMembers.filter(member => member.departments.some(dept => 
        dept.department_id === 'current-user-department-id'));
    }
    
    if (selectedDepartment === 'all') {
      return teamMembers;
    }
    
    return teamMembers.filter(member => 
      member.departments.some(dept => dept.department_id === selectedDepartment));
  };

  // Get leave applications for the date
  const getLeavesForDate = (date: Moment): LeaveApplication[] => {
    const filteredEmployees = getFilteredEmployees();
    const employeeIds = filteredEmployees.map(emp => emp.id);
    
    return leaveApplications.filter(leave => {
      const leaveStartDate = moment(leave.from_date);
      const leaveEndDate = moment(leave.to_date);
      
      // Check if this employee is in our filtered set
      if (!employeeIds.includes(leave.employee_id)) {
        return false;
      }
      
      // Check if the date is within the leave period
      return date.isBetween(leaveStartDate, leaveEndDate, null, '[]');
    });
  };

  // Get holidays for the date
  const getHolidaysForDate = (date: Moment): Holiday[] => {
    return holidays.filter(holiday => moment(holiday.date).isSame(date, 'day'));
  };

  // Function to render date cell content
  const dateCellRender = (date: Moment) => {
    const leaves = getLeavesForDate(date);
    const dateHolidays = getHolidaysForDate(date);
    
    return (
      <div>
        {dateHolidays.map(holiday => (
          <Tooltip key={holiday.id} title={holiday.description || holiday.name}>
            <Tag color="red" className="mb-1">
              {holiday.name}
            </Tag>
          </Tooltip>
        ))}
        
        {leaves.map(leave => {
          const employee = teamMembers.find(emp => emp.id === leave.employee_id);
          const employeeName = employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown';
          
          return (
            <Tooltip 
              key={leave.id}
              title={`${employeeName}: ${leave.leave_type?.name || 'Leave'} (${moment(leave.from_date).format('MMM D')} - ${moment(leave.to_date).format('MMM D')})`}
            >
              <Badge 
                status={leave.leave_type?.color_code ? 'processing' : 'default'} 
                color={leave.leave_type?.color_code} 
                text={employeeName} 
                className="mb-1 d-block text-truncate"
              />
            </Tooltip>
          );
        })}
      </div>
    );
  };

  // Function to render month cell content
  const monthCellRender = (date: Moment) => {
    // Get all leaves for this month
    const monthLeaves = leaveApplications.filter(leave => {
      const startDate = moment(leave.from_date);
      const endDate = moment(leave.to_date);
      return (
        (startDate.month() === date.month() && startDate.year() === date.year()) ||
        (endDate.month() === date.month() && endDate.year() === date.year())
      );
    });
    
    // Get all holidays for this month
    const monthHolidays = holidays.filter(holiday => 
      moment(holiday.date).month() === date.month() && 
      moment(holiday.date).year() === date.year()
    );
    
    if (monthLeaves.length === 0 && monthHolidays.length === 0) {
      return null;
    }
    
    return (
      <div className="month-cell">
        {monthHolidays.length > 0 && (
          <Tag color="red" className="mb-1">
            {monthHolidays.length} Holidays
          </Tag>
        )}
        
        {monthLeaves.length > 0 && (
          <Badge 
            count={monthLeaves.length} 
            className="month-badge"
            style={{ backgroundColor: '#1890ff' }}
          />
        )}
      </div>
    );
  };

  const handleDateSelect = (date: Moment) => {
    setSelectedDate(date);
  };

  const handleModeChange = (mode: CalendarMode) => {
    setCalendarMode(mode);
  };

  if (loading) {
    return <Spin size="large" className="center-spinner" />;
  }

  if (error) {
    return <div className="error-message">Failed to load calendar data</div>;
  }

  return (
    <Card>
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={24} md={8}>
          <Title level={4}>Leave Calendar</Title>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Select
            value={selectedViewType}
            onChange={setSelectedViewType}
            style={{ width: '100%' }}
          >
            <Option value="team">My Team</Option>
            <Option value="department">By Department</Option>
            <Option value="all">All Employees</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8}>
          {selectedViewType === 'department' && (
            <Select
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              style={{ width: '100%' }}
              placeholder="Select Department"
            >
              <Option value="all">All Departments</Option>
              {/* This would be populated from your departments data */}
              <Option value="dept1">Engineering</Option>
              <Option value="dept2">HR</Option>
              <Option value="dept3">Marketing</Option>
              <Option value="dept4">Finance</Option>
            </Select>
          )}
        </Col>
      </Row>

      <Calendar
        value={selectedDate.toDate()}
        // @ts-ignore - Type definitions mismatch with actual Ant Design version
        onSelect={handleDateSelect}
        // @ts-ignore - Type definitions mismatch with actual Ant Design version
        onPanelChange={(date, mode) => handleModeChange(mode as CalendarMode)}
        // @ts-ignore - Type definitions mismatch with actual Ant Design version
        dateCellRender={dateCellRender}
        // @ts-ignore - Type definitions mismatch with actual Ant Design version
        monthCellRender={monthCellRender}
        mode={calendarMode}
      />

      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          <Card size="small" title="Legend">
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <Badge status="success" text="Casual Leave" />
              </Col>
              <Col span={8}>
                <Badge status="warning" text="Sick Leave" />
              </Col>
              <Col span={8}>
                <Badge status="error" text="Holidays" />
              </Col>
              <Col span={8}>
                <Badge status="processing" text="Earned Leave" />
              </Col>
              <Col span={8}>
                <Badge status="default" text="Other Leave" />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default LeaveCalendar; 
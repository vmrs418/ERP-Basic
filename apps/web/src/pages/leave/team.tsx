import React, { useState, useEffect } from 'react';
import { Table, Card, Select, DatePicker, Button, Tag, Tabs, Space, Alert, Calendar, Badge } from 'antd';
import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import { getEmployees, Employee } from '../../api/employees';
import { getLeaveTypes, LeaveType } from '../../api/leaveTypes';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types/auth';

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Mock data for team members
const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'John Doe', department: 'Engineering', position: 'Software Engineer' },
  { id: '2', name: 'Jane Smith', department: 'Engineering', position: 'UX Designer' },
  { id: '3', name: 'Mike Johnson', department: 'Engineering', position: 'Backend Developer' },
  { id: '4', name: 'Sarah Williams', department: 'Engineering', position: 'Frontend Developer' },
  { id: '5', name: 'Alex Thompson', department: 'Engineering', position: 'QA Engineer' },
];

// Mock data for leave applications
const MOCK_TEAM_LEAVE_APPLICATIONS = [
  { 
    id: '1', 
    employee_id: '1', 
    employee_name: 'John Doe', 
    leave_type: 'Casual Leave', 
    leave_type_id: '1',
    from_date: '2023-08-10', 
    to_date: '2023-08-12', 
    days: 3, 
    status: 'approved',
    reason: 'Personal reasons'
  },
  { 
    id: '2', 
    employee_id: '2', 
    employee_name: 'Jane Smith', 
    leave_type: 'Sick Leave', 
    leave_type_id: '2',
    from_date: '2023-08-15', 
    to_date: '2023-08-17', 
    days: 3, 
    status: 'approved',
    reason: 'Medical appointment'
  },
  { 
    id: '3', 
    employee_id: '3', 
    employee_name: 'Mike Johnson', 
    leave_type: 'Earned Leave', 
    leave_type_id: '3',
    from_date: '2023-08-21', 
    to_date: '2023-08-25', 
    days: 5, 
    status: 'pending',
    reason: 'Family vacation'
  },
  { 
    id: '4', 
    employee_id: '4', 
    employee_name: 'Sarah Williams', 
    leave_type: 'Casual Leave', 
    leave_type_id: '1',
    from_date: '2023-09-05', 
    to_date: '2023-09-05', 
    days: 1, 
    status: 'pending',
    reason: 'Personal work'
  },
];

// Mock data for leave balances
const MOCK_TEAM_LEAVE_BALANCES = [
  { 
    id: '1', 
    employee_id: '1', 
    employee_name: 'John Doe', 
    casual_total: 12, 
    casual_used: 5, 
    casual_balance: 7,
    sick_total: 10,
    sick_used: 3,
    sick_balance: 7,
    earned_total: 15,
    earned_used: 0,
    earned_balance: 15
  },
  { 
    id: '2', 
    employee_id: '2', 
    employee_name: 'Jane Smith', 
    casual_total: 12, 
    casual_used: 8, 
    casual_balance: 4,
    sick_total: 10,
    sick_used: 5,
    sick_balance: 5,
    earned_total: 15,
    earned_used: 0,
    earned_balance: 15
  },
  { 
    id: '3', 
    employee_id: '3', 
    employee_name: 'Mike Johnson', 
    casual_total: 12, 
    casual_used: 10, 
    casual_balance: 2,
    sick_total: 10,
    sick_used: 2,
    sick_balance: 8,
    earned_total: 15,
    earned_used: 5,
    earned_balance: 10
  },
  { 
    id: '4', 
    employee_id: '4', 
    employee_name: 'Sarah Williams', 
    casual_total: 12, 
    casual_used: 3, 
    casual_balance: 9,
    sick_total: 10,
    sick_used: 0,
    sick_balance: 10,
    earned_total: 15,
    earned_used: 0,
    earned_balance: 15
  },
  { 
    id: '5', 
    employee_id: '5', 
    employee_name: 'Alex Thompson', 
    casual_total: 12, 
    casual_used: 2, 
    casual_balance: 10,
    sick_total: 10,
    sick_used: 1,
    sick_balance: 9,
    earned_total: 15,
    earned_used: 0,
    earned_balance: 15
  },
];

const TeamLeavePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState<[Date, Date] | null>(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [filteredApplications, setFilteredApplications] = useState(MOCK_TEAM_LEAVE_APPLICATIONS);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterLeaveApplications();
  }, [selectedDateRange, selectedLeaveType, selectedStatus]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const leaveTypesData = await getLeaveTypes();
      setLeaveTypes(leaveTypesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeaveApplications = () => {
    let filtered = [...MOCK_TEAM_LEAVE_APPLICATIONS];
    
    if (selectedDateRange && selectedDateRange.length === 2) {
      const [startDate, endDate] = selectedDateRange;
      filtered = filtered.filter(app => {
        const appStartDate = new Date(app.from_date);
        const appEndDate = new Date(app.to_date);
        return (
          (appStartDate >= startDate && appStartDate <= endDate) ||
          (appEndDate >= startDate && appEndDate <= endDate) ||
          (appStartDate <= startDate && appEndDate >= endDate)
        );
      });
    }
    
    if (selectedLeaveType) {
      filtered = filtered.filter(app => app.leave_type_id === selectedLeaveType);
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(app => app.status === selectedStatus);
    }
    
    setFilteredApplications(filtered);
  };

  const handleDateRangeChange = (dates: any) => {
    setSelectedDateRange(dates ? [dates[0].toDate(), dates[1].toDate()] : null);
  };

  const handleLeaveTypeChange = (value: string) => {
    setSelectedLeaveType(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'orange';
      case 'rejected':
        return 'red';
      default:
        return 'blue';
    }
  };

  const resetFilters = () => {
    setSelectedDateRange(null);
    setSelectedLeaveType(null);
    setSelectedStatus(null);
  };

  const leaveApplicationsColumns = [
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Leave Type',
      dataIndex: 'leave_type',
      key: 'leave_type',
    },
    {
      title: 'From',
      dataIndex: 'from_date',
      key: 'from_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'To',
      dataIndex: 'to_date',
      key: 'to_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Days',
      dataIndex: 'days',
      key: 'days',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
  ];

  const leaveBalancesColumns = [
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Casual Leave',
      children: [
        {
          title: 'Total',
          dataIndex: 'casual_total',
          key: 'casual_total',
        },
        {
          title: 'Used',
          dataIndex: 'casual_used',
          key: 'casual_used',
        },
        {
          title: 'Balance',
          dataIndex: 'casual_balance',
          key: 'casual_balance',
          render: (balance: number) => (
            <span style={{ fontWeight: 'bold', color: balance < 3 ? '#f5222d' : 'inherit' }}>
              {balance}
            </span>
          ),
        },
      ],
    },
    {
      title: 'Sick Leave',
      children: [
        {
          title: 'Total',
          dataIndex: 'sick_total',
          key: 'sick_total',
        },
        {
          title: 'Used',
          dataIndex: 'sick_used',
          key: 'sick_used',
        },
        {
          title: 'Balance',
          dataIndex: 'sick_balance',
          key: 'sick_balance',
          render: (balance: number) => (
            <span style={{ fontWeight: 'bold', color: balance < 3 ? '#f5222d' : 'inherit' }}>
              {balance}
            </span>
          ),
        },
      ],
    },
    {
      title: 'Earned Leave',
      children: [
        {
          title: 'Total',
          dataIndex: 'earned_total',
          key: 'earned_total',
        },
        {
          title: 'Used',
          dataIndex: 'earned_used',
          key: 'earned_used',
        },
        {
          title: 'Balance',
          dataIndex: 'earned_balance',
          key: 'earned_balance',
          render: (balance: number) => (
            <span style={{ fontWeight: 'bold' }}>
              {balance}
            </span>
          ),
        },
      ],
    },
  ];

  // Function to get leave applications for a given date
  const getLeaveApplicationsForDate = (date: Date) => {
    return MOCK_TEAM_LEAVE_APPLICATIONS.filter(app => {
      const appStartDate = new Date(app.from_date);
      const appEndDate = new Date(app.to_date);
      
      // Reset hours, minutes, and seconds for accurate date comparison
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      appStartDate.setHours(0, 0, 0, 0);
      appEndDate.setHours(0, 0, 0, 0);
      
      return (appStartDate <= compareDate && appEndDate >= compareDate);
    });
  };

  // Custom date cell renderer for calendar
  const dateCellRender = (value: Date) => {
    const applications = getLeaveApplicationsForDate(value);
    
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {applications.map(app => (
          <li key={app.id} style={{ marginBottom: '2px' }}>
            <Badge 
              color={getStatusColor(app.status)} 
              text={`${app.employee_name.split(' ')[0]} - ${app.leave_type.charAt(0)}`}
              style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <MainLayout title="Team Leave Management">
      <div className="page-header">
        <h1>Team Leave Management</h1>
      </div>

      <Alert
        message="Manage your team's leave effectively"
        description="View your team's leave patterns, approve leave requests, and plan team activities avoiding leave conflicts."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: '20px' }}
      />

      <Tabs defaultActiveKey="1">
        <TabPane tab="Leave Applications" key="1">
          <Card>
            <div className="filter-row" style={{ marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <RangePicker onChange={handleDateRangeChange} />
              
              <Select
                placeholder="Select Leave Type"
                style={{ width: 180 }}
                onChange={handleLeaveTypeChange}
                allowClear
              >
                {leaveTypes.map(type => (
                  <Option key={type.id} value={type.id}>{type.name}</Option>
                ))}
              </Select>
              
              <Select
                placeholder="Select Status"
                style={{ width: 140 }}
                onChange={handleStatusChange}
                allowClear
              >
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
              
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
            
            <Table
              columns={leaveApplicationsColumns}
              dataSource={filteredApplications}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="Leave Balances" key="2">
          <Card>
            <Table
              columns={leaveBalancesColumns}
              dataSource={MOCK_TEAM_LEAVE_BALANCES}
              rowKey="id"
              pagination={false}
              bordered
            />
          </Card>
        </TabPane>
        
        <TabPane tab="Team Calendar" key="3">
          <Card>
            <Calendar 
              dateCellRender={dateCellRender}
            />
          </Card>
        </TabPane>
      </Tabs>
    </MainLayout>
  );
};

export default TeamLeavePage; 
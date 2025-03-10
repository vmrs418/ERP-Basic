import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Table, Tag, Button, Spin, Progress, Alert } from 'antd';
import { PieChartOutlined, BarChartOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import { getEmployees, Employee } from '../../api/employees';
import { getLeaveTypes, LeaveType } from '../../api/leaveTypes';
import { getPendingLeaveApplications, LeaveApplication } from '../../api/leaveApplications';
import { useAuth } from '../../contexts/AuthContext';

const { Option } = Select;

// Mock data for the visualizations - in a real app, this would come from API
const MOCK_MONTHLY_LEAVE_DATA = [
  { month: 'Jan', casual: 12, sick: 5, earned: 0 },
  { month: 'Feb', casual: 10, sick: 8, earned: 0 },
  { month: 'Mar', casual: 8, sick: 6, earned: 0 },
  { month: 'Apr', casual: 15, sick: 10, earned: 2 },
  { month: 'May', casual: 20, sick: 12, earned: 4 },
  { month: 'Jun', casual: 18, sick: 15, earned: 3 },
];

const MOCK_TEAM_LEAVE_DISTRIBUTION = [
  { department: 'Engineering', total: 45, color: '#1890ff' },
  { department: 'Marketing', total: 30, color: '#13c2c2' },
  { department: 'HR', total: 20, color: '#52c41a' },
  { department: 'Finance', total: 15, color: '#faad14' },
  { department: 'Operations', total: 25, color: '#722ed1' },
];

const MOCK_UPCOMING_LEAVES = [
  { id: '1', employee_name: 'John Doe', leave_type: 'Casual Leave', from_date: '2023-08-10', to_date: '2023-08-12', days: 3, status: 'approved' },
  { id: '2', employee_name: 'Jane Smith', leave_type: 'Sick Leave', from_date: '2023-08-15', to_date: '2023-08-17', days: 3, status: 'approved' },
  { id: '3', employee_name: 'Mike Johnson', leave_type: 'Earned Leave', from_date: '2023-08-21', to_date: '2023-08-25', days: 5, status: 'approved' },
];

const LeaveDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [pendingApplications, setPendingApplications] = useState<LeaveApplication[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [employeesData, leaveTypesData, pendingData] = await Promise.all([
        getEmployees(),
        getLeaveTypes(),
        getPendingLeaveApplications()
      ]);

      setEmployees(employeesData);
      setLeaveTypes(leaveTypesData);
      setPendingApplications(pendingData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (date: any) => {
    if (date) {
      setSelectedYear(date.year());
    }
  };

  const handleMonthChange = (value: number) => {
    setSelectedMonth(value);
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

  // Table columns for upcoming leaves
  const upcomingLeavesColumns = [
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
  ];

  // Render bar chart for monthly leave distribution
  const renderMonthlyLeaveChart = () => {
    const data = MOCK_MONTHLY_LEAVE_DATA;
    
    return (
      <div className="chart-container">
        <div className="chart-legend" style={{ marginBottom: '10px', display: 'flex', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#1890ff', marginRight: '8px' }}></div>
            <span>Casual Leave</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#f5222d', marginRight: '8px' }}></div>
            <span>Sick Leave</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#52c41a', marginRight: '8px' }}></div>
            <span>Earned Leave</span>
          </div>
        </div>
        
        <div className="chart-bars" style={{ display: 'flex', height: '200px', alignItems: 'flex-end', gap: '20px' }}>
          {data.map((item, index) => (
            <div key={index} className="chart-bar-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', height: '150px', alignItems: 'flex-end' }}>
                <div 
                  className="bar bar-casual" 
                  style={{ 
                    height: `${(item.casual / 20) * 100}%`, 
                    width: '8px', 
                    backgroundColor: '#1890ff',
                    marginRight: '2px'
                  }}
                  title={`Casual Leave: ${item.casual} days`}
                ></div>
                <div 
                  className="bar bar-sick" 
                  style={{ 
                    height: `${(item.sick / 20) * 100}%`, 
                    width: '8px', 
                    backgroundColor: '#f5222d',
                    marginRight: '2px'
                  }}
                  title={`Sick Leave: ${item.sick} days`}
                ></div>
                <div 
                  className="bar bar-earned" 
                  style={{ 
                    height: `${(item.earned / 20) * 100}%`, 
                    width: '8px', 
                    backgroundColor: '#52c41a' 
                  }}
                  title={`Earned Leave: ${item.earned} days`}
                ></div>
              </div>
              <div className="month-label" style={{ marginTop: '8px' }}>{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render pie chart for team leave distribution
  const renderTeamDistributionChart = () => {
    const data = MOCK_TEAM_LEAVE_DISTRIBUTION;
    const total = data.reduce((acc, item) => acc + item.total, 0);
    
    return (
      <div className="chart-container">
        <div className="pie-chart" style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
          {data.map((item, index, arr) => {
            // Calculate the start and end angles for each segment
            const prevTotal = arr.slice(0, index).reduce((sum, d) => sum + d.total, 0);
            const startAngle = (prevTotal / total) * 360;
            const endAngle = ((prevTotal + item.total) / total) * 360;
            
            return (
              <div
                key={item.department}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: `conic-gradient(${item.color} ${startAngle}deg, ${item.color} ${endAngle}deg, transparent ${endAngle}deg)`,
                  borderRadius: '50%',
                }}
                title={`${item.department}: ${item.total} leave days (${Math.round((item.total / total) * 100)}%)`}
              />
            );
          })}
          <div 
            style={{ 
              position: 'absolute', 
              top: '25%', 
              left: '25%', 
              width: '50%', 
              height: '50%', 
              backgroundColor: 'white', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div>{total} days</div>
          </div>
        </div>
        <div className="chart-legend" style={{ marginTop: '20px' }}>
          {data.map(item => (
            <div key={item.department} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: item.color, marginRight: '8px' }}></div>
              <span>{item.department}: {item.total} days ({Math.round((item.total / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout title="Leave Dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Leave Dashboard">
      <div className="page-header">
        <h1>Leave Management Dashboard</h1>
        <div>
          <DatePicker 
            picker="year" 
            onChange={handleYearChange} 
            defaultValue={null}
            style={{ marginRight: '10px' }}
          />
          <Select 
            defaultValue={selectedMonth} 
            style={{ width: 120 }} 
            onChange={handleMonthChange}
          >
            <Option value={0}>January</Option>
            <Option value={1}>February</Option>
            <Option value={2}>March</Option>
            <Option value={3}>April</Option>
            <Option value={4}>May</Option>
            <Option value={5}>June</Option>
            <Option value={6}>July</Option>
            <Option value={7}>August</Option>
            <Option value={8}>September</Option>
            <Option value={9}>October</Option>
            <Option value={10}>November</Option>
            <Option value={11}>December</Option>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: '16px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <PieChartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <h3>Total Leave Days</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>135</div>
              <div>Across all departments</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              <h3>Employees on Leave</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>7</div>
              <div>Currently on leave</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <BarChartOutlined style={{ fontSize: '24px', color: '#faad14' }} />
              <h3>Average Leave Days</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5.2</div>
              <div>Per employee</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <CalendarOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
              <h3>Pending Approvals</h3>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{pendingApplications.length}</div>
              <div>Need attention</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts and Tables */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Leave Distribution" style={{ marginBottom: '16px' }}>
            {renderMonthlyLeaveChart()}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Team Leave Distribution" style={{ marginBottom: '16px' }}>
            {renderTeamDistributionChart()}
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Upcoming Employee Leaves" style={{ marginBottom: '16px' }}>
            <Alert 
              message="Note: This is mock data for visualization purposes" 
              type="info" 
              showIcon 
              style={{ marginBottom: '16px' }} 
            />
            <Table 
              columns={upcomingLeavesColumns} 
              dataSource={MOCK_UPCOMING_LEAVES} 
              rowKey="id" 
              pagination={false} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Department Leave Utilization">
            <div style={{ padding: '20px 0' }}>
              {MOCK_TEAM_LEAVE_DISTRIBUTION.map(dept => (
                <div key={dept.department} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{dept.department}</span>
                    <span>{dept.total} days</span>
                  </div>
                  <Progress 
                    percent={Math.round((dept.total / 45) * 100)} 
                    strokeColor={dept.color} 
                    size="small" 
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default LeaveDashboardPage; 
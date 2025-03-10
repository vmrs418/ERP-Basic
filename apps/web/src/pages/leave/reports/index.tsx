import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Tabs, Table, Select, DatePicker, Button, Space, Row, Col, Progress, Tag } from 'antd';
import { DownloadOutlined, PieChartOutlined, BarChartOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { getEmployees, Employee } from '../../../api/employees';
import { getLeaveTypes, LeaveType } from '../../../api/leaveTypes';
import { getPendingLeaveApplications, LeaveApplication } from '../../../api/leaveApplications';
import { useAuth } from '../../../contexts/AuthContext';
import { Role } from '../../../types/auth';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data for leave balances - in a real app, this would come from the API
const MOCK_LEAVE_BALANCES = [
  { employee_id: '1', leave_type_id: '1', year: 2023, total: 12, used: 5, balance: 7 },
  { employee_id: '1', leave_type_id: '2', year: 2023, total: 6, used: 2, balance: 4 },
  { employee_id: '2', leave_type_id: '1', year: 2023, total: 12, used: 8, balance: 4 },
  { employee_id: '2', leave_type_id: '2', year: 2023, total: 6, used: 1, balance: 5 },
  { employee_id: '3', leave_type_id: '1', year: 2023, total: 12, used: 3, balance: 9 },
  { employee_id: '3', leave_type_id: '2', year: 2023, total: 6, used: 2, balance: 4 },
];

// Mock data for leave usage - in a real app, this would come from the API
const MOCK_LEAVE_USAGE = [
  { month: 'Jan', casual: 4, sick: 2, earned: 0 },
  { month: 'Feb', casual: 3, sick: 1, earned: 0 },
  { month: 'Mar', casual: 2, sick: 3, earned: 1 },
  { month: 'Apr', casual: 1, sick: 2, earned: 0 },
  { month: 'May', casual: 2, sick: 1, earned: 0 },
  { month: 'Jun', casual: 3, sick: 2, earned: 1 },
  { month: 'Jul', casual: 2, sick: 3, earned: 0 },
  { month: 'Aug', casual: 1, sick: 1, earned: 0 },
  { month: 'Sep', casual: 2, sick: 0, earned: 1 },
  { month: 'Oct', casual: 0, sick: 0, earned: 0 },
  { month: 'Nov', casual: 0, sick: 0, earned: 0 },
  { month: 'Dec', casual: 0, sick: 0, earned: 0 },
];

// Usage section
interface LeaveBalanceRecord {
  employee_id: string;
  leave_type_id: string;
  year: number;
  total: number;
  used: number;
  balance: number;
}

interface LeaveUsageRecord {
  month: string;
  casual: number;
  sick: number;
  earned: number;
}

const LeaveReportsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [pendingApplications, setPendingApplications] = useState<LeaveApplication[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [filterEmployee, setFilterEmployee] = useState<string | undefined>(undefined);
  const [filterLeaveType, setFilterLeaveType] = useState<string | undefined>(undefined);
  
  const isAdminOrHR = user?.roles?.some((role: Role) => ['admin', 'hr'].includes(role.name)) || false;

  useEffect(() => {
    if (!isAdminOrHR) {
      // If not admin/HR, redirect back to leave applications
      router.push('/leave/applications');
      return;
    }
    
    loadInitialData();
  }, [isAdminOrHR, router]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [employeesData, leaveTypesData, pendingData] = await Promise.all([
        getEmployees(),
        getLeaveTypes(),
        getPendingLeaveApplications()
      ]);
      
      setEmployees(employeesData);
      setLeaveTypes(leaveTypesData);
      setPendingApplications(pendingData);
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Balance Report
  const leaveBalanceColumns = [
    {
      title: 'Employee',
      dataIndex: 'employee_id',
      key: 'employee',
      render: (id: string) => {
        const employee = employees.find(e => e.id === id);
        return employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown';
      },
    },
    {
      title: 'Leave Type',
      dataIndex: 'leave_type_id',
      key: 'leave_type',
      render: (id: string) => {
        const leaveType = leaveTypes.find(lt => lt.id === id);
        return leaveType ? leaveType.name : 'Unknown';
      },
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Total Allocation',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Used',
      dataIndex: 'used',
      key: 'used',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_: unknown, record: LeaveBalanceRecord) => (
        <Progress 
          percent={Math.round((record.used / record.total) * 100)} 
          size="small" 
          status={record.balance === 0 ? 'exception' : 'active'} 
        />
      ),
    },
  ];

  // Pending Applications Report
  const pendingApplicationsColumns = [
    {
      title: 'Employee',
      dataIndex: ['employee', 'first_name'],
      key: 'employee',
      render: (_: unknown, record: LeaveApplication) => 
        record.employee ? `${record.employee.first_name} ${record.employee.last_name}` : 'N/A',
    },
    {
      title: 'Leave Type',
      dataIndex: ['leave_type', 'name'],
      key: 'leave_type',
      render: (_: unknown, record: LeaveApplication) => 
        record.leave_type ? record.leave_type.name : 'N/A',
    },
    {
      title: 'From',
      dataIndex: 'from_date',
      key: 'from_date',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'To',
      dataIndex: 'to_date',
      key: 'to_date',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Duration',
      dataIndex: 'duration_days',
      key: 'duration_days',
      render: (days: number) => `${days} day${days !== 1 ? 's' : ''}`,
    },
    {
      title: 'Applied On',
      dataIndex: 'applied_at',
      key: 'applied_at',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag color="orange">PENDING</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: LeaveApplication) => (
        <Button 
          type="link" 
          onClick={() => router.push(`/leave/applications/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  // Generate years for the dropdown
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert('Export functionality would generate a CSV file in a real application');
  };

  return (
    <MainLayout title="Leave Reports">
      <div className="page-header">
        <h1>Leave Reports</h1>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={handleExportCSV}
        >
          Export to CSV
        </Button>
      </div>

      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
        <TabPane 
          tab={
            <span>
              <PieChartOutlined />
              Leave Balances
            </span>
          } 
          key="1"
        >
          <Card style={{ marginBottom: '20px' }}>
            <Row gutter={16} align="middle">
              <Col span={6}>
                <Select
                  placeholder="Select Year"
                  style={{ width: '100%' }}
                  value={selectedYear}
                  onChange={(value: number) => setSelectedYear(value)}
                >
                  {getYearOptions().map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col span={6}>
                <Select
                  placeholder="Filter by Employee"
                  style={{ width: '100%' }}
                  allowClear
                  value={filterEmployee}
                  onChange={(value: string | undefined) => setFilterEmployee(value)}
                >
                  {employees.map(emp => (
                    <Option key={emp.id} value={emp.id}>
                      {`${emp.first_name} ${emp.last_name}`}
                    </Option>
                  ))}
                </Select>
              </Col>
              
              <Col span={6}>
                <Select
                  placeholder="Filter by Leave Type"
                  style={{ width: '100%' }}
                  allowClear
                  value={filterLeaveType}
                  onChange={(value: string | undefined) => setFilterLeaveType(value)}
                >
                  {leaveTypes.map(type => (
                    <Option key={type.id} value={type.id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Card>
          
          <Table 
            columns={leaveBalanceColumns} 
            dataSource={MOCK_LEAVE_BALANCES.filter(record => {
              if (filterEmployee && record.employee_id !== filterEmployee) return false;
              if (filterLeaveType && record.leave_type_id !== filterLeaveType) return false;
              if (record.year !== selectedYear) return false;
              return true;
            }) as LeaveBalanceRecord[]} 
            rowKey={(record: LeaveBalanceRecord) => `${record.employee_id}-${record.leave_type_id}`}
            loading={loading}
            pagination={false}
          />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BarChartOutlined />
              Monthly Leave Usage
            </span>
          } 
          key="2"
        >
          <Card style={{ marginBottom: '20px' }}>
            <Row gutter={16} align="middle">
              <Col span={6}>
                <Select
                  placeholder="Select Year"
                  style={{ width: '100%' }}
                  value={selectedYear}
                  onChange={(value: number) => setSelectedYear(value)}
                >
                  {getYearOptions().map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col span={6}>
                <Select
                  placeholder="Filter by Employee"
                  style={{ width: '100%' }}
                  allowClear
                  value={filterEmployee}
                  onChange={(value: string | undefined) => setFilterEmployee(value)}
                >
                  {employees.map(emp => (
                    <Option key={emp.id} value={emp.id}>
                      {`${emp.first_name} ${emp.last_name}`}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Card>
          
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Monthly Leave Usage for {selectedYear}</h3>
            <p>No chart is implemented in this simplified example, but this would display a chart showing monthly leave usage.</p>
            <Table 
              dataSource={MOCK_LEAVE_USAGE as LeaveUsageRecord[]} 
              columns={[
                { title: 'Month', dataIndex: 'month', key: 'month' },
                { title: 'Casual Leave', dataIndex: 'casual', key: 'casual' },
                { title: 'Sick Leave', dataIndex: 'sick', key: 'sick' },
                { title: 'Earned Leave', dataIndex: 'earned', key: 'earned' },
                { 
                  title: 'Total', 
                  key: 'total',
                  render: (_: unknown, record: LeaveUsageRecord) => record.casual + record.sick + record.earned
                },
              ]}
              pagination={false}
              loading={loading}
              rowKey="month"
            />
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <PieChartOutlined />
              Pending Applications
            </span>
          } 
          key="3"
        >
          <Table 
            columns={pendingApplicationsColumns} 
            dataSource={pendingApplications} 
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
    </MainLayout>
  );
};

export default LeaveReportsPage; 
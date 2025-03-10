import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, DatePicker, Select, Button, Spin, Tabs, Empty, Statistic, RangePicker } from '../ui/AntdWrappers';
import { CheckCircleOutlined, ClockCircleOutlined, TeamOutlined, BarChartOutlined, CalendarOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { apiClient } from '../../api/client';
import { AttendanceRecord, Employee } from '../../types';

const { Option } = Select;
const { TabPane } = Tabs;

interface AttendanceStats {
  totalPresent: number;
  totalAbsent: number;
  totalHalfDay: number;
  totalOnLeave: number;
  avgWorkingHours: number;
  lateArrivals: number;
  earlyDepartures: number;
  totalEmployees: number;
  attendancePercentage: number;
  departmentStats: Record<string, {
    departmentName: string;
    present: number;
    absent: number;
    onLeave: number;
    attendancePercentage: number;
  }>;
}

interface AttendanceDashboardProps {
  userRoles: string[];
}

const AttendanceDashboard: React.FC<AttendanceDashboardProps> = ({ userRoles }) => {
  const [dateRange, setDateRange] = useState<[Moment, Moment]>([
    moment().startOf('month'),
    moment()
  ]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const isHrOrAdmin = userRoles.some(role => ['admin', 'hr'].includes(role));

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (dateRange) {
      fetchAttendanceData();
    }
  }, [dateRange, selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const response = await apiClient.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Prepare date parameters
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      
      // Build URL with parameters
      let url = `/attendance-records/reports?startDate=${startDate}&endDate=${endDate}`;
      
      if (selectedDepartment !== 'all') {
        url += `&departmentId=${selectedDepartment}`;
      }
      
      const response = await apiClient.get(url);
      
      // Process attendance records
      setAttendanceRecords(response.data.records);
      
      // Calculate statistics
      calculateStats(response.data.records);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (records: AttendanceRecord[]) => {
    // Initialize stats object
    const calculatedStats: AttendanceStats = {
      totalPresent: 0,
      totalAbsent: 0,
      totalHalfDay: 0,
      totalOnLeave: 0,
      avgWorkingHours: 0,
      lateArrivals: 0,
      earlyDepartures: 0,
      totalEmployees: employees.length,
      attendancePercentage: 0,
      departmentStats: {}
    };
    
    // Initialize department stats
    departments.forEach(dept => {
      calculatedStats.departmentStats[dept.id] = {
        departmentName: dept.name,
        present: 0,
        absent: 0,
        onLeave: 0,
        attendancePercentage: 0
      };
    });
    
    // Process records
    let totalWorkingHours = 0;
    
    records.forEach(record => {
      // Update general stats
      if (record.status === 'present') {
        calculatedStats.totalPresent++;
        totalWorkingHours += record.working_hours;
        
        // Check for late arrival (simplified logic)
        if (moment(record.check_in_time).format('HH:mm') > '09:30') {
          calculatedStats.lateArrivals++;
        }
        
        // Check for early departure (simplified logic)
        if (record.check_out_time && moment(record.check_out_time).format('HH:mm') < '17:30') {
          calculatedStats.earlyDepartures++;
        }
      } else if (record.status === 'absent') {
        calculatedStats.totalAbsent++;
      } else if (record.status === 'half_day') {
        calculatedStats.totalHalfDay++;
        totalWorkingHours += record.working_hours;
      } else if (record.status === 'on_leave') {
        calculatedStats.totalOnLeave++;
      }
      
      // Update department stats
      if (record.employee?.departments && record.employee.departments.length > 0) {
        record.employee.departments.forEach(empDept => {
          if (empDept.is_primary && calculatedStats.departmentStats[empDept.department_id]) {
            const deptStats = calculatedStats.departmentStats[empDept.department_id];
            
            if (record.status === 'present') {
              deptStats.present++;
            } else if (record.status === 'absent') {
              deptStats.absent++;
            } else if (record.status === 'on_leave') {
              deptStats.onLeave++;
            }
          }
        });
      }
    });
    
    // Calculate average working hours
    const presentAndHalfDays = calculatedStats.totalPresent + calculatedStats.totalHalfDay;
    calculatedStats.avgWorkingHours = presentAndHalfDays > 0 
      ? totalWorkingHours / presentAndHalfDays 
      : 0;
    
    // Calculate overall attendance percentage
    const totalExpectedAttendance = calculatedStats.totalPresent + 
      calculatedStats.totalAbsent + 
      calculatedStats.totalHalfDay + 
      calculatedStats.totalOnLeave;
    
    calculatedStats.attendancePercentage = totalExpectedAttendance > 0
      ? ((calculatedStats.totalPresent + (calculatedStats.totalHalfDay * 0.5)) / totalExpectedAttendance) * 100
      : 0;
    
    // Calculate department attendance percentages
    Object.keys(calculatedStats.departmentStats).forEach(deptId => {
      const deptStat = calculatedStats.departmentStats[deptId];
      const totalDeptAttendance = deptStat.present + deptStat.absent + deptStat.onLeave;
      
      deptStat.attendancePercentage = totalDeptAttendance > 0
        ? (deptStat.present / totalDeptAttendance) * 100
        : 0;
    });
    
    setStats(calculatedStats);
  };

  const handleDateRangeChange = (dates: [Moment, Moment]) => {
    setDateRange(dates);
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
  };

  const attendanceColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('DD MMM, YYYY')
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      render: (employee: Employee) => 
        employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown'
    },
    {
      title: 'Check In',
      dataIndex: 'check_in_time',
      key: 'check_in_time',
      render: (time: string) => time ? moment(time).format('hh:mm A') : '-'
    },
    {
      title: 'Check Out',
      dataIndex: 'check_out_time',
      key: 'check_out_time',
      render: (time: string) => time ? moment(time).format('hh:mm A') : '-'
    },
    {
      title: 'Working Hours',
      dataIndex: 'working_hours',
      key: 'working_hours',
      render: (hours: number) => hours ? hours.toFixed(2) : '-'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let icon = null;
        
        switch (status) {
          case 'present':
            color = 'green';
            icon = <CheckCircleOutlined />;
            break;
          case 'absent':
            color = 'red';
            icon = <CloseCircleOutlined />;
            break;
          case 'half_day':
            color = 'orange';
            icon = <ClockCircleOutlined />;
            break;
          case 'on_leave':
            color = 'blue';
            icon = <CalendarOutlined />;
            break;
          case 'weekend':
            color = 'purple';
            icon = <CalendarOutlined />;
            break;
          case 'holiday':
            color = 'cyan';
            icon = <CalendarOutlined />;
            break;
          default:
            color = 'default';
        }
        
        return (
          <span style={{ color }}>
            {icon} {status.replace('_', ' ').toUpperCase()}
          </span>
        );
      }
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => source.toUpperCase()
    }
  ];

  const departmentStatsColumns = [
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName'
    },
    {
      title: 'Present',
      dataIndex: 'present',
      key: 'present'
    },
    {
      title: 'Absent',
      dataIndex: 'absent',
      key: 'absent'
    },
    {
      title: 'On Leave',
      dataIndex: 'onLeave',
      key: 'onLeave',
    },
    {
      title: 'Attendance %',
      dataIndex: 'attendancePercentage',
      key: 'attendancePercentage',
      render: (percentage: number) => `${percentage.toFixed(2)}%`
    }
  ];

  return (
    <div>
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} md={12}>
          <RangePicker
            value={dateRange}
            onChange={(dates: any) => handleDateRangeChange(dates as [Moment, Moment])}
            style={{ width: '100%' }}
          />
        </Col>
        {isHrOrAdmin && (
          <Col xs={24} md={8}>
            <Select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              style={{ width: '100%' }}
              placeholder="Select Department"
            >
              <Option value="all">All Departments</Option>
              {departments.map(dept => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Col>
        )}
        <Col xs={24} md={4}>
          <Button
            type="primary"
            onClick={fetchAttendanceData}
            block
          >
            Refresh Data
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : stats ? (
        <>
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Present"
                  value={stats.totalPresent}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Absent"
                  value={stats.totalAbsent}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="On Leave"
                  value={stats.totalOnLeave}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Attendance %"
                  value={stats.attendancePercentage}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: stats.attendancePercentage > 80 ? '#3f8600' : '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Avg. Working Hours"
                  value={stats.avgWorkingHours}
                  precision={2}
                  suffix="hrs"
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Late Arrivals"
                  value={stats.lateArrivals}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="Early Departures"
                  value={stats.earlyDepartures}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          <Tabs defaultActiveKey="attendance">
            <TabPane tab="Attendance Records" key="attendance">
              <Table
                columns={attendanceColumns}
                dataSource={attendanceRecords}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50']
                }}
              />
            </TabPane>
            {isHrOrAdmin && (
              <TabPane tab="Department Statistics" key="department-stats">
                <Table
                  columns={departmentStatsColumns}
                  dataSource={Object.values(stats.departmentStats)}
                  rowKey="departmentName"
                  pagination={false}
                />
              </TabPane>
            )}
          </Tabs>
        </>
      ) : (
        <Empty description="No attendance data available" />
      )}
    </div>
  );
};

export default AttendanceDashboard; 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

// Import components individually to avoid TypeScript errors
import Layout from 'antd/lib/layout';
import Typography from 'antd/lib/typography';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Tag from 'antd/lib/tag';
import Space from 'antd/lib/space';
import Breadcrumb from 'antd/lib/breadcrumb';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Statistic from 'antd/lib/statistic';
import DatePicker from 'antd/lib/date-picker';
import TimePicker from 'antd/lib/time-picker';
import message from 'antd/lib/message';

import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Content } = Layout;
const { RangePicker } = DatePicker;

// Mock attendance records
const mockAttendanceRecords = [
  {
    id: '1',
    employee_id: '1',
    employee_name: 'John Doe',
    date: '2023-08-01',
    check_in: '09:00:00',
    check_out: '18:00:00',
    status: 'present',
    working_hours: 9,
    created_at: '2023-08-01T09:00:00Z',
    updated_at: '2023-08-01T18:00:00Z'
  },
  {
    id: '2',
    employee_id: '1',
    employee_name: 'John Doe',
    date: '2023-08-02',
    check_in: '09:15:00',
    check_out: '18:30:00',
    status: 'present',
    working_hours: 9.25,
    created_at: '2023-08-02T09:15:00Z',
    updated_at: '2023-08-02T18:30:00Z'
  },
  {
    id: '3',
    employee_id: '2',
    employee_name: 'Jane Smith',
    date: '2023-08-01',
    check_in: '08:45:00',
    check_out: '17:30:00',
    status: 'present',
    working_hours: 8.75,
    created_at: '2023-08-01T08:45:00Z',
    updated_at: '2023-08-01T17:30:00Z'
  },
  {
    id: '4',
    employee_id: '2',
    employee_name: 'Jane Smith',
    date: '2023-08-02',
    check_in: '09:00:00',
    check_out: '17:45:00',
    status: 'present',
    working_hours: 8.75,
    created_at: '2023-08-02T09:00:00Z',
    updated_at: '2023-08-02T17:45:00Z'
  },
  {
    id: '5',
    employee_id: '3',
    employee_name: 'Michael Johnson',
    date: '2023-08-01',
    check_in: '10:00:00',
    check_out: '19:00:00',
    status: 'late',
    working_hours: 9,
    created_at: '2023-08-01T10:00:00Z',
    updated_at: '2023-08-01T19:00:00Z'
  }
];

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const todayDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/attendance-records');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setAttendanceRecords(data);
      } catch (err) {
        console.error('Error fetching attendance records:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch attendance records');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    setCheckInTime(timeString);
    message.success('Checked in successfully at ' + timeString);
  };
  
  const handleCheckOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    setCheckOutTime(timeString);
    message.success('Checked out successfully at ' + timeString);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Check In',
      dataIndex: 'check_in',
      key: 'check_in',
    },
    {
      title: 'Check Out',
      dataIndex: 'check_out',
      key: 'check_out',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'late') color = 'orange';
        if (status === 'absent') color = 'red';
        
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Working Hours',
      dataIndex: 'working_hours',
      key: 'working_hours',
      render: (hours: number) => `${hours} hrs`,
    },
  ];
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Head>
        <title>Attendance | ERP System</title>
      </Head>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ margin: '16px 0' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link href="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Attendance</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <Title level={3}>Attendance Dashboard</Title>
              <Text type="secondary">{todayDate}</Text>
              
              <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} md={12}>
                  <Card title="Today's Attendance" bordered={false}>
                    <Row gutter={16} align="middle">
                      <Col span={12}>
                        <Button 
                          type="primary" 
                          icon={<ArrowUpOutlined />} 
                          size="large" 
                          onClick={handleCheckIn}
                          disabled={!!checkInTime}
                          block
                        >
                          Check In
                        </Button>
                        {checkInTime && (
                          <Text type="secondary" style={{ display: 'block', marginTop: 8, textAlign: 'center' }}>
                            Checked in at {checkInTime}
                          </Text>
                        )}
                      </Col>
                      <Col span={12}>
                        <Button 
                          type="primary" 
                          danger 
                          icon={<ArrowDownOutlined />} 
                          size="large" 
                          onClick={handleCheckOut}
                          disabled={!checkInTime || !!checkOutTime}
                          block
                        >
                          Check Out
                        </Button>
                        {checkOutTime && (
                          <Text type="secondary" style={{ display: 'block', marginTop: 8, textAlign: 'center' }}>
                            Checked out at {checkOutTime}
                          </Text>
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Col>
                
                <Col xs={24} md={12}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card bordered={false}>
                        <Statistic 
                          title="Present Days" 
                          value={21} 
                          suffix="/ 23" 
                          valueStyle={{ color: '#3f8600' }}
                          prefix={<CheckCircleOutlined />} 
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card bordered={false}>
                        <Statistic 
                          title="Working Hours" 
                          value={168} 
                          suffix="hrs" 
                          valueStyle={{ color: '#1890ff' }}
                          prefix={<ClockCircleOutlined />} 
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card bordered={false}>
                        <Statistic 
                          title="Late Days" 
                          value={2} 
                          valueStyle={{ color: '#faad14' }}
                          prefix={<CalendarOutlined />} 
                        />
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col span={24}>
            <Card title="Attendance Records" extra={<RangePicker />}>
              <Table 
                dataSource={attendanceRecords} 
                columns={columns} 
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
} 
import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Typography, 
  Table, 
  Button, 
  Card, 
  Form, 
  Select, 
  DatePicker, 
  message, 
  Tag, 
  Breadcrumb,
  Row,
  Col,
  Statistic
} from 'antd';
import { DollarOutlined, CalendarOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import moment from 'moment';

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PayrollPage = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [form] = Form.useForm();
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);

  useEffect(() => {
    fetchPayrollRecords();
  }, []);

  const fetchPayrollRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payroll');
      if (!response.ok) {
        throw new Error('Failed to fetch payroll records');
      }
      const data = await response.json();
      setPayrollRecords(data);
      
      // Calculate statistics
      setTotalEmployees(new Set(data.map(record => record.employee_id)).size);
      setTotalSalary(data.reduce((sum, record) => sum + record.net_salary, 0));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      message.error('Failed to load payroll records');
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async (values) => {
    try {
      setGenerating(true);
      const response = await fetch('/api/payroll/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          month: selectedMonth,
          year: selectedYear,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate payroll');
      }

      const data = await response.json();
      message.success('Payroll generated successfully');
      fetchPayrollRecords();
      setGenerating(false);
    } catch (error) {
      console.error('Error generating payroll:', error);
      message.error('Failed to generate payroll');
      setGenerating(false);
    }
  };

  const handleApprovePayroll = async (id) => {
    try {
      const response = await fetch(`/api/payroll/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve payroll');
      }

      message.success('Payroll approved successfully');
      fetchPayrollRecords();
    } catch (error) {
      console.error('Error approving payroll:', error);
      message.error('Failed to approve payroll');
    }
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      render: (month, record) => `${month}/${record.year}`,
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basic_salary',
      key: 'basic_salary',
      render: (salary) => `₹${salary.toLocaleString()}`,
    },
    {
      title: 'Gross Salary',
      dataIndex: 'gross_salary',
      key: 'gross_salary',
      render: (salary) => `₹${salary.toLocaleString()}`,
    },
    {
      title: 'Tax Deduction',
      dataIndex: 'tax_deduction',
      key: 'tax_deduction',
      render: (tax) => `₹${tax.toLocaleString()}`,
    },
    {
      title: 'Net Salary',
      dataIndex: 'net_salary',
      key: 'net_salary',
      render: (salary) => `₹${salary.toLocaleString()}`,
    },
    {
      title: 'Working Days',
      dataIndex: 'working_days',
      key: 'working_days',
    },
    {
      title: 'Leave Days',
      dataIndex: 'leave_days',
      key: 'leave_days',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Payment Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary" 
          disabled={record.status === 'approved'}
          onClick={() => handleApprovePayroll(record.id)}
        >
          Approve
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>
            <Link href="/">
              <HomeOutlined /> Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Payroll</Breadcrumb.Item>
        </Breadcrumb>
        
        <Title level={2}>Payroll Management</Title>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Employees"
                value={totalEmployees}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Salary Disbursed"
                value={totalSalary}
                precision={2}
                prefix={<DollarOutlined />}
                suffix="₹"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Current Month"
                value={moment().format('MMMM YYYY')}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
        </Row>
        
        <Card title="Generate Payroll" style={{ marginBottom: 24 }}>
          <Form
            form={form}
            layout="inline"
            onFinish={handleGeneratePayroll}
          >
            <Form.Item label="Month" name="month">
              <Select 
                style={{ width: 120 }} 
                defaultValue={selectedMonth}
                onChange={value => setSelectedMonth(value)}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {moment().month(i).format('MMMM')}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item label="Year" name="year">
              <Select 
                style={{ width: 120 }} 
                defaultValue={selectedYear}
                onChange={value => setSelectedYear(value)}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = moment().year() - 2 + i;
                  return (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={generating}
              >
                Generate Payroll
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        <Card title="Payroll Records">
          <Table
            columns={columns}
            dataSource={payrollRecords}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default PayrollPage; 
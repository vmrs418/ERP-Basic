import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserAddOutlined, ReloadOutlined } from '@ant-design/icons';

// Import components individually to avoid TypeScript errors
import Table from 'antd/lib/table';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import Space from 'antd/lib/space';
import Card from 'antd/lib/card';
import Layout from 'antd/lib/layout';
import Breadcrumb from 'antd/lib/breadcrumb';

const { Title } = Typography;
const { Content } = Layout;

interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department?: string;
  designation?: string;
  status: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/employees');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    {
      title: 'Employee Code',
      dataIndex: 'employee_code',
      key: 'employee_code',
    },
    {
      title: 'Name',
      key: 'name',
      render: (text: any, record: Employee) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const color = text === 'active' ? 'green' : text === 'on_leave' ? 'orange' : 'red';
        return <span style={{ color }}>{text.replace('_', ' ')}</span>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Employee) => (
        <Space size="middle">
          <Link href={`/employees/${record.id}`}>View</Link>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ margin: '16px 0' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link href="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Employees</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={3}>Employee List</Title>
            <Space>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={() => window.location.reload()}
                loading={loading}
              >
                Refresh
              </Button>
              <Link href="/employees/new">
                <Button type="primary" icon={<UserAddOutlined />}>
                  Add Employee
                </Button>
              </Link>
            </Space>
          </div>
          
          {error ? (
            <div style={{ color: 'red', marginBottom: 16 }}>
              Error: {error}
            </div>
          ) : (
            <Table 
              columns={columns} 
              dataSource={employees} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>
      </Content>
    </Layout>
  );
} 
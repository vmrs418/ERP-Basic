import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

// Import components individually to avoid TypeScript errors
import Table from 'antd/lib/table';
import Typography from 'antd/lib/typography';
import Button from 'antd/lib/button';
import Space from 'antd/lib/space';
import Card from 'antd/lib/card';
import Layout from 'antd/lib/layout';
import Breadcrumb from 'antd/lib/breadcrumb';
import Tag from 'antd/lib/tag';

const { Title } = Typography;
const { Content } = Layout;

interface LeaveApplication {
  id: string;
  employee_id: string;
  employee_name?: string;
  leave_type_id: string;
  leave_type_name?: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function LeaveApplicationsPage() {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leave-applications');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching leave applications:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch leave applications');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveApplications();
  }, []);

  const getStatusTag = (status: string) => {
    let color = '';
    let text = '';
    
    switch(status) {
      case 'pending':
        color = 'orange';
        text = 'Pending';
        break;
      case 'approved':
        color = 'green';
        text = 'Approved';
        break;
      case 'rejected':
        color = 'red';
        text = 'Rejected';
        break;
      default:
        color = 'default';
        text = status;
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      key: 'employee_name',
    },
    {
      title: 'Leave Type',
      dataIndex: 'leave_type_name',
      key: 'leave_type_name',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: LeaveApplication) => (
        <Space size="middle">
          <Link href={`/leave/applications/${record.id}`}>View</Link>
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
            <Breadcrumb.Item>Leave Applications</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={3}>Leave Applications</Title>
            <Space>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={() => window.location.reload()}
                loading={loading}
              >
                Refresh
              </Button>
              <Link href="/leave/applications/new">
                <Button type="primary" icon={<PlusOutlined />}>
                  Apply for Leave
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
              dataSource={applications} 
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
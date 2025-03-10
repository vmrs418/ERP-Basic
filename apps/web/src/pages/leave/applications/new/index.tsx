import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Import components individually to avoid TypeScript errors
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import Select from 'antd/lib/select';
import Card from 'antd/lib/card';
import Layout from 'antd/lib/layout';
import Breadcrumb from 'antd/lib/breadcrumb';
import Typography from 'antd/lib/typography';
import message from 'antd/lib/message';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface LeaveType {
  id: string;
  name: string;
  is_paid: boolean;
}

export default function NewLeaveApplicationPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLeaveTypes, setFetchingLeaveTypes] = useState(true);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await fetch('/api/leave-types');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        setLeaveTypes(data);
      } catch (err) {
        console.error('Error fetching leave types:', err);
        message.error('Failed to fetch leave types');
      } finally {
        setFetchingLeaveTypes(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      // Extract dates from range picker
      const [startDate, endDate] = values.date_range;
      
      const response = await fetch('/api/leave-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leave_type_id: values.leave_type_id,
          start_date: startDate.format('YYYY-MM-DD'),
          end_date: endDate.format('YYYY-MM-DD'),
          reason: values.reason,
          // In a real application, employee_id would come from authenticated user
          employee_id: '00000000-0000-0000-0000-000000000000' 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create leave application');
      }

      message.success('Leave application submitted successfully');
      router.push('/leave');
    } catch (error) {
      console.error('Error creating leave application:', error);
      message.error('Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ margin: '16px 0' }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link href="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link href="/leave">Leave Applications</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>New Application</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Card>
          <Title level={3}>Apply for Leave</Title>
          
          <Form 
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
          >
            <Form.Item 
              name="leave_type_id" 
              label="Leave Type" 
              rules={[{ required: true, message: 'Please select leave type' }]}
            >
              <Select 
                placeholder="Select leave type"
                loading={fetchingLeaveTypes}
              >
                {leaveTypes.map(type => (
                  <Option key={type.id} value={type.id}>{type.name} ({type.is_paid ? 'Paid' : 'Unpaid'})</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item 
              name="date_range" 
              label="Leave Period" 
              rules={[{ required: true, message: 'Please select leave period' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item 
              name="reason" 
              label="Reason" 
              rules={[{ required: true, message: 'Please provide a reason for leave' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="default" 
                  style={{ marginRight: 8 }}
                  onClick={() => router.push('/leave')}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit Application
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
} 
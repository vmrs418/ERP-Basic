import { useState } from 'react';
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
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

export default function NewEmployeePage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const maritalStatusOptions = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ];

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          date_of_birth: values.date_of_birth?.toISOString(),
          date_of_joining: values.date_of_joining?.toISOString(),
          confirmation_date: values.confirmation_date?.toISOString(),
          passport_expiry: values.passport_expiry?.toISOString(),
          created_by: 'admin', // This should come from authentication
          updated_by: 'admin', // This should come from authentication
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create employee');
      }

      message.success('Employee created successfully');
      router.push('/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
      message.error('Failed to create employee');
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
              <Link href="/employees">Employees</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>New</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Card>
          <Title level={3}>Add New Employee</Title>
          
          <Form 
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: '100%' }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item 
                  name="employee_code" 
                  label="Employee Code" 
                  rules={[{ required: true, message: 'Please enter employee code' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item 
                  name="first_name" 
                  label="First Name" 
                  rules={[{ required: true, message: 'Please enter first name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="middle_name" 
                  label="Middle Name"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="last_name" 
                  label="Last Name" 
                  rules={[{ required: true, message: 'Please enter last name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item 
                  name="email" 
                  label="Email" 
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="personal_email" 
                  label="Personal Email"
                  rules={[
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="phone" 
                  label="Phone" 
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item 
                  name="date_of_birth" 
                  label="Date of Birth" 
                  rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="gender" 
                  label="Gender" 
                  rules={[{ required: true, message: 'Please select gender' }]}
                >
                  <Select placeholder="Select gender">
                    {genderOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item 
                  name="marital_status" 
                  label="Marital Status" 
                  rules={[{ required: true, message: 'Please select marital status' }]}
                >
                  <Select placeholder="Select marital status">
                    {maritalStatusOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button 
                type="default" 
                style={{ marginRight: 8 }}
                onClick={() => router.push('/employees')}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
} 
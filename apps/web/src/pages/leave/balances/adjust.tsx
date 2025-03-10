import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Select, InputNumber, Radio, message, Card, Descriptions, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { fetchEmployeeLeaveBalance, adjustLeaveBalance, AdjustLeaveBalanceDto } from '../../../api/employeeLeaveBalances';
import { useAuth } from '../../../contexts/AuthContext';

const { TextArea } = Input;
const { Option } = Select;

const AdjustLeaveBalancePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [leaveBalance, setLeaveBalance] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadLeaveBalance(id as string);
    }
  }, [id]);

  const loadLeaveBalance = async (balanceId: string) => {
    try {
      setBalanceLoading(true);
      const data = await fetchEmployeeLeaveBalance(balanceId);
      setLeaveBalance(data);
    } catch (error) {
      message.error('Failed to load leave balance');
      console.error(error);
    } finally {
      setBalanceLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!id) return;

    try {
      setLoading(true);
      const adjustmentData: AdjustLeaveBalanceDto = {
        amount: values.amount,
        reason: values.reason,
        adjustment_type: values.adjustment_type,
      };

      await adjustLeaveBalance(id as string, adjustmentData);
      message.success('Leave balance adjusted successfully');
      router.push('/leave/balances');
    } catch (error) {
      message.error('Failed to adjust leave balance');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (balanceLoading || !leaveBalance) {
    return (
      <MainLayout title="Adjust Leave Balance">
        <div className="page-loading">
          <p>Loading balance information...</p>
        </div>
      </MainLayout>
    );
  }

  const employeeName = leaveBalance.employee 
    ? `${leaveBalance.employee.first_name} ${leaveBalance.employee.last_name}`
    : 'Unknown Employee';

  const leaveTypeName = leaveBalance.leave_type 
    ? leaveBalance.leave_type.name
    : 'Unknown Leave Type';

  return (
    <MainLayout title="Adjust Leave Balance">
      <div className="page-header">
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/leave/balances')}
            style={{ marginBottom: '16px' }}
          >
            Back to Leave Balances
          </Button>
          <h1>Adjust Leave Balance</h1>
        </div>
      </div>

      <Card style={{ marginBottom: '20px' }}>
        <Descriptions title="Current Balance Information" bordered>
          <Descriptions.Item label="Employee" span={3}>
            {employeeName}
          </Descriptions.Item>
          <Descriptions.Item label="Leave Type" span={3}>
            {leaveTypeName}
          </Descriptions.Item>
          <Descriptions.Item label="Year">
            {leaveBalance.year}
          </Descriptions.Item>
          <Descriptions.Item label="Current Balance">
            <Tag color="blue">{leaveBalance.closing_balance}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {new Date(leaveBalance.last_updated).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Adjustment Details">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            adjustment_type: 'add',
          }}
        >
          <Form.Item
            name="adjustment_type"
            label="Adjustment Type"
            rules={[{ required: true, message: 'Please select adjustment type' }]}
          >
            <Radio.Group>
              <Radio value="add">Add Days</Radio>
              <Radio value="subtract">Subtract Days</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Number of Days"
            rules={[
              { required: true, message: 'Please enter number of days' },
              { type: 'number', min: 0.5, message: 'Value must be at least 0.5 days' }
            ]}
          >
            <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason for Adjustment"
            rules={[{ required: true, message: 'Please provide a reason for the adjustment' }]}
          >
            <TextArea rows={4} placeholder="Explain why this adjustment is being made" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit Adjustment
            </Button>
            <Button 
              style={{ marginLeft: '10px' }} 
              onClick={() => router.push('/leave/balances')}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </MainLayout>
  );
};

export default AdjustLeaveBalancePage; 
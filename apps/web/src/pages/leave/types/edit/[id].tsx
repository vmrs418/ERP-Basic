import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Switch, InputNumber, message, Card, Spin } from 'antd';
import MainLayout from '../../../../layouts/MainLayout';
import { fetchLeaveType, updateLeaveType, LeaveType, UpdateLeaveTypeDto } from '../../../../api/leaveTypes';

const { TextArea } = Input;

const EditLeaveTypePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (id) {
      loadLeaveType(id as string);
    }
  }, [id]);

  const loadLeaveType = async (leaveTypeId: string) => {
    try {
      setFetching(true);
      const data = await fetchLeaveType(leaveTypeId);
      setLeaveType(data);
      form.setFieldsValue(data);
    } catch (error) {
      message.error('Failed to load leave type');
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const onFinish = async (values: UpdateLeaveTypeDto) => {
    if (!id) return;
    
    try {
      setLoading(true);
      await updateLeaveType(id as string, values);
      message.success('Leave type updated successfully');
      router.push('/leave/types');
    } catch (error) {
      message.error('Failed to update leave type');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <MainLayout title="Edit Leave Type">
        <div className="page-loading">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Edit Leave Type">
      <div className="page-header">
        <h1>Edit Leave Type: {leaveType?.name}</h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the leave type name' }]}
          >
            <Input placeholder="e.g., Casual Leave" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Please enter a unique code' }]}
          >
            <Input placeholder="e.g., CL" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} placeholder="Describe this leave type" />
          </Form.Item>

          <Form.Item
            name="color_code"
            label="Color"
            rules={[{ required: true, message: 'Please select a color' }]}
          >
            <Input type="color" style={{ width: '60px', height: '32px' }} />
          </Form.Item>

          <Form.Item
            name="is_paid"
            label="Paid Leave"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="is_encashable"
            label="Encashable"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="requires_approval"
            label="Requires Approval"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="max_consecutive_days"
            label="Maximum Consecutive Days"
            tooltip="Maximum number of consecutive days that can be applied (leave blank for no limit)"
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="min_days_before_application"
            label="Minimum Days Before Application"
            tooltip="Minimum number of days before the leave date that an application must be submitted"
            rules={[{ required: true, message: 'Please enter minimum days' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Leave Type
            </Button>
            <Button 
              style={{ marginLeft: '10px' }} 
              onClick={() => router.push('/leave/types')}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </MainLayout>
  );
};

export default EditLeaveTypePage; 
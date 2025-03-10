import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, DatePicker, Switch, Button, message, Card } from 'antd';
import MainLayout from '../../../layouts/MainLayout';
import { createLeavePolicy, CreateLeavePolicyDto } from '../../../api/leavePolicies';

const { TextArea } = Input;

const CreateLeavePolicyPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      const policyData: CreateLeavePolicyDto = {
        name: values.name,
        description: values.description,
        effective_from: values.effective_from.format('YYYY-MM-DD'),
        effective_to: values.effective_to ? values.effective_to.format('YYYY-MM-DD') : undefined,
        is_current: values.is_current || false,
        probation_applicable: values.probation_applicable || false,
      };
      
      await createLeavePolicy(policyData);
      message.success('Leave policy created successfully');
      router.push('/leave/policies');
    } catch (error) {
      message.error('Failed to create leave policy');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Create Leave Policy">
      <div className="page-header">
        <h1>Create Leave Policy</h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            is_current: false,
            probation_applicable: false,
          }}
        >
          <Form.Item
            name="name"
            label="Policy Name"
            rules={[{ required: true, message: 'Please enter policy name' }]}
          >
            <Input placeholder="e.g., Standard Leave Policy 2023" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} placeholder="Describe this leave policy" />
          </Form.Item>

          <Form.Item
            name="effective_from"
            label="Effective From"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="effective_to"
            label="Effective To (Optional)"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="is_current"
            label="Current Policy"
            valuePropName="checked"
            tooltip="If checked, this will become the current policy and any other current policy will be deactivated"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="probation_applicable"
            label="Applicable During Probation"
            valuePropName="checked"
            tooltip="Whether this policy applies to employees during their probation period"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Policy
            </Button>
            <Button 
              style={{ marginLeft: '10px' }} 
              onClick={() => router.push('/leave/policies')}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </MainLayout>
  );
};

export default CreateLeavePolicyPage; 
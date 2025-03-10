import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Select, InputNumber, Button, Card, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MainLayout from '../../../../../layouts/MainLayout';
import { fetchLeavePolicy, createLeavePolicyDetail, CreateLeavePolicyDetailDto } from '../../../../../api/leavePolicies';
import { fetchLeaveTypes, LeaveType } from '../../../../../api/leaveTypes';

const { Option } = Select;

const CreateLeavePolicyDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (id) {
      loadData(id as string);
    }
  }, [id]);

  const loadData = async (policyId: string) => {
    try {
      setLoadingData(true);
      
      // Fetch policy data
      const policyData = await fetchLeavePolicy(policyId);
      setPolicy(policyData);
      
      // Fetch leave types
      const typesData = await fetchLeaveTypes();
      setLeaveTypes(typesData);
    } catch (error) {
      message.error('Failed to load data');
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const detailData: CreateLeavePolicyDetailDto = {
        leave_policy_id: id as string,
        leave_type_id: values.leave_type_id,
        annual_quota: values.annual_quota,
        accrual_type: values.accrual_type,
        carry_forward_limit: values.carry_forward_limit,
        encashment_limit: values.encashment_limit,
        applicable_from_months: values.applicable_from_months,
      };
      
      await createLeavePolicyDetail(detailData);
      message.success('Leave policy detail added successfully');
      router.push(`/leave/policies/${id}`);
    } catch (error) {
      message.error('Failed to add policy detail');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Add Leave Type to Policy">
      <div className="page-header">
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(`/leave/policies/${id}`)}
            style={{ marginBottom: '16px' }}
          >
            Back to Policy
          </Button>
          <h1>Add Leave Type to Policy</h1>
        </div>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            carry_forward_limit: 0,
            encashment_limit: 0,
            applicable_from_months: 0,
            accrual_type: 'yearly',
          }}
        >
          <Form.Item
            name="leave_type_id"
            label="Leave Type"
            rules={[{ required: true, message: 'Please select a leave type' }]}
          >
            <Select placeholder="Select leave type">
              {leaveTypes.map(type => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="annual_quota"
            label="Annual Quota (days)"
            rules={[{ required: true, message: 'Please enter annual quota' }]}
          >
            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="accrual_type"
            label="Accrual Type"
            rules={[{ required: true, message: 'Please select accrual type' }]}
          >
            <Select>
              <Option value="yearly">Yearly</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="quarterly">Quarterly</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="carry_forward_limit"
            label="Carry Forward Limit (days)"
            rules={[{ required: true, message: 'Please enter carry forward limit' }]}
          >
            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="encashment_limit"
            label="Encashment Limit (days)"
            rules={[{ required: true, message: 'Please enter encashment limit' }]}
          >
            <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="applicable_from_months"
            label="Applicable After (months)"
            tooltip="Number of months after joining that this leave becomes available"
            rules={[{ required: true, message: 'Please enter applicable months' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Leave Type
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => router.push(`/leave/policies/${id}`)}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </MainLayout>
  );
};

export default CreateLeavePolicyDetailPage; 
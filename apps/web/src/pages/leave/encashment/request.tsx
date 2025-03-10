import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  Card, 
  Alert, 
  message, 
  Divider,
  Row,
  Col,
  Spin
} from 'antd';
import Typography from 'antd/lib/typography';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { getLeaveTypes, LeaveType } from '../../../api/leaveTypes';
import { 
  createLeaveEncashmentRequest, 
  calculateLeaveEncashmentAmount 
} from '../../../api/payroll';
import { 
  fetchEmployeeLeaveBalances, 
  EmployeeLeaveBalance 
} from '../../../api/employeeLeaveBalances';

const { Option } = Select;
const { Title, Text } = Typography;

const LeaveEncashmentRequestPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<EmployeeLeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [estimatedAmount, setEstimatedAmount] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null);
  const [requestedDays, setRequestedDays] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableDays, setAvailableDays] = useState<number | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedLeaveType && leaveBalances.length > 0) {
      // Find the balance for the selected leave type
      const balance = leaveBalances.find(
        b => b.leave_type_id === selectedLeaveType && b.year === selectedYear
      );
      
      if (balance) {
        setAvailableDays(balance.closing_balance);
        
        // Update form max days validation
        form.setFieldsValue({
          requested_days: Math.min(
            balance.closing_balance, 
            form.getFieldValue('requested_days') || 0
          )
        });
      } else {
        setAvailableDays(0);
      }
    }
  }, [selectedLeaveType, leaveBalances, selectedYear]);

  useEffect(() => {
    // Calculate amount if both leave type and days are selected
    if (selectedLeaveType && requestedDays && requestedDays > 0 && user?.id) {
      calculateAmount(user.id, selectedLeaveType, requestedDays);
    } else {
      setEstimatedAmount(null);
    }
  }, [selectedLeaveType, requestedDays, user?.id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        message.error('User information not available');
        return;
      }
      
      // Get leave types that are encashable
      const leaveTypesData = await getLeaveTypes();
      const encashableTypes = leaveTypesData.filter(type => type.is_encashable);
      setLeaveTypes(encashableTypes);
      
      // Get leave balances for all encashable types
      const year = new Date().getFullYear();
      const balances = await fetchEmployeeLeaveBalances(user.id, year);
      
      // Filter only encashable leave types that have a positive balance
      const encashableBalances = balances.filter(
        balance => encashableTypes.some(type => type.id === balance.leave_type_id) && 
        balance.closing_balance > 0
      );
      
      setLeaveBalances(encashableBalances);
      
      if (encashableBalances.length === 0) {
        message.info('You do not have any leave balance available for encashment');
      }
    } catch (error) {
      message.error('Failed to load encashment data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const calculateAmount = async (employeeId: string, leaveTypeId: string, days: number) => {
    try {
      setCalculating(true);
      const result = await calculateLeaveEncashmentAmount(employeeId, leaveTypeId, days);
      setEstimatedAmount(result.amount);
    } catch (error) {
      console.error('Failed to calculate amount:', error);
      setEstimatedAmount(null);
    } finally {
      setCalculating(false);
    }
  };

  const handleLeaveTypeChange = (value: string) => {
    setSelectedLeaveType(value);
    // Reset requested days when leave type changes
    setRequestedDays(null);
    form.setFieldsValue({ requested_days: null });
  };

  const handleDaysChange = (value: number | null) => {
    setRequestedDays(value);
  };

  const handleYearChange = (value: number) => {
    setSelectedYear(value);
  };

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      
      const requestData = {
        ...values,
        year: selectedYear
      };
      
      await createLeaveEncashmentRequest(requestData);
      message.success('Leave encashment request submitted successfully');
      router.push('/leave/encashment');
    } catch (error) {
      message.error('Failed to submit encashment request');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear, currentYear - 1];

  return (
    <MainLayout title="Request Leave Encashment">
      <div className="page-header">
        <div>
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/leave/encashment')}
            style={{ marginBottom: '16px' }}
          >
            Back to Leave Encashment
          </Button>
          <Title level={2}>Request Leave Encashment</Title>
        </div>
      </div>

      <Alert
        message="Important Information"
        description={
          <div>
            <p>Encashment of leave is subject to company policy. The calculation is based on your current salary details.</p>
            <p>Only encashable leave types with available balance are shown.</p>
            <p>The estimated amount is indicative and may be adjusted during approval.</p>
          </div>
        }
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: '24px' }}
      />

      {loading ? (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        </Card>
      ) : (
        <Card>
          {leaveBalances.length === 0 ? (
            <Alert
              message="No Eligible Leave Balance"
              description="You do not have any encashable leave balance available. Please check your leave balances or contact HR for assistance."
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="leave_type_id"
                label="Leave Type"
                rules={[{ required: true, message: 'Please select leave type' }]}
              >
                <Select 
                  placeholder="Select encashable leave type" 
                  onChange={handleLeaveTypeChange}
                >
                  {leaveTypes.filter(type => type.is_encashable).map(type => (
                    <Option key={type.id} value={type.id}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="year"
                    label="Year"
                    initialValue={currentYear}
                  >
                    <Select onChange={handleYearChange}>
                      {yearOptions.map(year => (
                        <Option key={year} value={year}>{year}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item 
                    label="Available Days" 
                    style={{ marginBottom: '24px' }}
                  >
                    <InputNumber 
                      value={availableDays || 0}
                      disabled
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="requested_days"
                label="Days to Encash"
                rules={[
                  { required: true, message: 'Please enter days to encash' },
                  {
                    validator: (_: any, value: number) => {
                      if (!value || value <= 0) {
                        return Promise.reject('Days must be greater than 0');
                      }
                      if (availableDays !== null && value > availableDays) {
                        return Promise.reject(`Cannot encash more than available days (${availableDays})`);
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <InputNumber 
                  min={0.5} 
                  max={availableDays || 0} 
                  step={0.5} 
                  style={{ width: '100%' }}
                  onChange={handleDaysChange}
                />
              </Form.Item>

              <Form.Item
                name="reason"
                label="Reason for Encashment"
                rules={[{ required: true, message: 'Please provide a reason' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Divider />

              <div style={{ marginBottom: '24px' }}>
                <Text strong>Estimated Amount:</Text>{' '}
                {calculating ? (
                  <Spin size="small" />
                ) : estimatedAmount !== null ? (
                  <Text style={{ fontSize: '16px', color: '#1890ff' }}>
                    ₹{estimatedAmount.toFixed(2)}
                  </Text>
                ) : (
                  <Text type="secondary">Select leave type and days to see estimate</Text>
                )}
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  Submit Request
                </Button>
                <Button 
                  type="default" 
                  style={{ marginLeft: '10px' }}
                  onClick={() => router.push('/leave/encashment')}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      )}
    </MainLayout>
  );
};

export default LeaveEncashmentRequestPage; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Switch, Upload, message } from 'antd';
import { Card, Input, Button, DatePicker, Select, TextArea } from '../../../components/ui/AntdWrappers';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { createLeaveApplication, CreateLeaveApplicationDto } from '../../../api/leaveApplications';
import { getLeaveTypes, LeaveType } from '../../../api/leaveTypes';
import { getEmployees, Employee } from '../../../api/employees';
import { useAuth } from '../../../contexts/AuthContext';
import { differenceInCalendarDays } from 'date-fns';
import { Role } from '../../../types/auth';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface UploadOptions {
  file: File;
  onSuccess: (response: any, file: File) => void;
  onError: (error: Error) => void;
}

const CreateLeaveApplicationPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [firstDayHalf, setFirstDayHalf] = useState(false);
  const [lastDayHalf, setLastDayHalf] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);
  
  const isAdminOrHR = user?.roles?.some((role: Role) => ['admin', 'hr'].includes(role.name)) || false;

  useEffect(() => {
    loadLeaveTypes();
    if (isAdminOrHR) {
      loadEmployees();
    }
  }, [isAdminOrHR]);

  const loadLeaveTypes = async () => {
    try {
      const data = await getLeaveTypes();
      setLeaveTypes(data);
    } catch (error) {
      message.error('Failed to load leave types');
      console.error(error);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      message.error('Failed to load employees');
      console.error(error);
    }
  };

  const handleUpload = async (options: UploadOptions) => {
    const { file, onSuccess, onError } = options;
    
    setUploadLoading(true);
    
    try {
      // In a real implementation, you would upload the file to a storage service
      // and get back a URL to the uploaded file
      
      // Mock implementation
      setTimeout(() => {
        setUploadedFile('https://example.com/uploads/' + file.name);
        onSuccess('ok', file);
        setUploadLoading(false);
        message.success('File uploaded successfully');
      }, 1000);
    } catch (error) {
      onError(error as Error);
      setUploadLoading(false);
      message.error('Failed to upload file');
    }
  };

  const calculateDuration = (startDate: Date, endDate: Date): number => {
    let days = differenceInCalendarDays(endDate, startDate) + 1;
    
    if (firstDayHalf) days -= 0.5;
    if (lastDayHalf) days -= 0.5;
    
    return Math.max(days, 0.5);
  };

  interface FormValues {
    employee_id?: string;
    leave_type_id: string;
    date_range: [any, any];
    first_day_half: boolean;
    last_day_half: boolean;
    reason: string;
    contact_during_leave: string;
    handover_to?: string;
    handover_notes?: string;
  }

  const onFinish = async (values: FormValues) => {
    try {
      setLoading(true);
      
      const [startDate, endDate] = values.date_range;
      const duration = calculateDuration(startDate.toDate(), endDate.toDate());
      
      const leaveData: CreateLeaveApplicationDto = {
        employee_id: isAdminOrHR && values.employee_id ? values.employee_id : user!.id,
        leave_type_id: values.leave_type_id,
        from_date: startDate.format('YYYY-MM-DD'),
        to_date: endDate.format('YYYY-MM-DD'),
        duration_days: duration,
        first_day_half: values.first_day_half || false,
        last_day_half: values.last_day_half || false,
        reason: values.reason,
        contact_during_leave: values.contact_during_leave,
        handover_to: values.handover_to,
        handover_notes: values.handover_notes,
        attachment_url: uploadedFile || undefined,
      };
      
      await createLeaveApplication(leaveData);
      message.success('Leave application submitted successfully');
      router.push('/leave/applications');
    } catch (error) {
      message.error('Failed to submit leave application');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  return (
    <MainLayout title="Apply for Leave">
      <div className="page-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/leave/applications')}
        >
          Back to Applications
        </Button>
        <h1>Apply for Leave</h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            first_day_half: false,
            last_day_half: false,
          }}
        >
          {isAdminOrHR && (
            <Form.Item
              name="employee_id"
              label="Employee"
              rules={[{ required: true, message: 'Please select an employee' }]}
            >
              <Select placeholder="Select employee">
                {employees.map(emp => (
                  <Option key={emp.id} value={emp.id}>
                    {`${emp.first_name} ${emp.last_name}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

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
            name="date_range"
            label="Leave Period"
            rules={[{ required: true, message: 'Please select leave period' }]}
          >
            <RangePicker 
              style={{ width: '100%' }} 
              onChange={handleDateRangeChange}
            />
          </Form.Item>

          <Form.Item
            name="first_day_half"
            label="First Day Half"
            valuePropName="checked"
          >
            <Switch onChange={(checked: boolean) => setFirstDayHalf(checked)} />
          </Form.Item>

          <Form.Item
            name="last_day_half"
            label="Last Day Half"
            valuePropName="checked"
          >
            <Switch onChange={(checked: boolean) => setLastDayHalf(checked)} />
          </Form.Item>

          {dateRange && dateRange[0] && dateRange[1] && (
            <Form.Item label="Duration">
              <span>
                {calculateDuration(dateRange[0].toDate(), dateRange[1].toDate())} day(s)
              </span>
            </Form.Item>
          )}

          <Form.Item
            name="reason"
            label="Reason for Leave"
            rules={[{ required: true, message: 'Please provide a reason' }]}
          >
            <TextArea rows={4} placeholder="Explain why you need this leave" />
          </Form.Item>

          <Form.Item
            name="contact_during_leave"
            label="Contact During Leave"
            rules={[{ required: true, message: 'Please provide a contact number' }]}
          >
            <Input placeholder="Phone number where you can be reached" />
          </Form.Item>

          <Form.Item
            name="handover_to"
            label="Handover To"
          >
            <Select placeholder="Select employee for handover" allowClear>
              {employees.map(emp => (
                <Option key={emp.id} value={emp.id}>
                  {`${emp.first_name} ${emp.last_name}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="handover_notes"
            label="Handover Notes"
          >
            <TextArea rows={3} placeholder="Notes for the person handling your responsibilities" />
          </Form.Item>

          <Form.Item
            name="attachment"
            label="Attachment"
            tooltip="Upload supporting documents if required (e.g., medical certificate)"
          >
            <Upload
              customRequest={handleUpload}
              maxCount={1}
              listType="picture"
              accept=".pdf,.jpg,.jpeg,.png"
            >
              <Button icon={<UploadOutlined />} loading={uploadLoading}>
                Upload Document
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit Application
            </Button>
            <Button 
              style={{ marginLeft: '10px' }} 
              onClick={() => router.push('/leave/applications')}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </MainLayout>
  );
};

export default CreateLeaveApplicationPage; 
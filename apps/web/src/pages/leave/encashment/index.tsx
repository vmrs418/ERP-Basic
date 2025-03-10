import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Table,
  Button,
  Card,
  Tag,
  Space,
  message,
  Tabs,
  Spin,
  Modal,
  Form,
  Input,
  InputNumber
} from 'antd';
import Typography from 'antd/lib/typography';
import { 
  PlusOutlined, 
  EditOutlined, 
  CheckOutlined, 
  CloseOutlined,
  ExclamationCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  getLeaveEncashmentRequests,
  approveLeaveEncashmentRequest,
  rejectLeaveEncashmentRequest,
  LeaveEncashmentRequest
} from '../../../api/payroll';
import { getEmployees, Employee } from '../../../api/employees';
import { formatDate } from '../../../utils/dateUtils';

const { TabPane } = Tabs;
const { Text, Title } = Typography;
const { confirm } = Modal;

// Define status type for better type checking
type EncashmentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'paid';
type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

const statusColors: Record<EncashmentStatus, string> = {
  'pending': 'orange',
  'approved': 'green',
  'rejected': 'red',
  'cancelled': 'gray',
  'paid': 'blue'
};

// Extended LeaveEncashmentRequest type to include the properties we need
interface ExtendedLeaveEncashmentRequest extends LeaveEncashmentRequest {
  calculated_amount?: number;
  leave_type_name: string;
  year: number;
}

const LeaveEncashmentPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [encashmentRequests, setEncashmentRequests] = useState<ExtendedLeaveEncashmentRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExtendedLeaveEncashmentRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [approvalForm] = Form.useForm();
  const [rejectionForm] = Form.useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHR, setIsHR] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Set user roles
    if (user?.roles) {
      setIsAdmin(user.roles.includes('admin' as UserRole));
      setIsHR(user.roles.includes('hr' as UserRole));
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load encashment requests
      const requests = await getLeaveEncashmentRequests() as ExtendedLeaveEncashmentRequest[];
      setEncashmentRequests(requests);
      
      // Load employees for HR/Admin
      if (user?.roles && user.roles.some(role => 
        role === ('admin' as UserRole) || role === ('hr' as UserRole)
      )) {
        const employeesData = await getEmployees();
        setEmployees(employeesData);
      }
    } catch (error) {
      message.error('Failed to load encashment requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleNewRequest = () => {
    router.push('/leave/encashment/request');
  };

  const handleApprove = (record: ExtendedLeaveEncashmentRequest) => {
    setSelectedRequest(record);
    approvalForm.setFieldsValue({
      amount: record.calculated_amount || 0
    });
    setApprovalModalVisible(true);
  };

  const handleReject = (record: ExtendedLeaveEncashmentRequest) => {
    setSelectedRequest(record);
    setRejectionModalVisible(true);
  };

  const submitApproval = async () => {
    try {
      if (!selectedRequest) return;
      
      await approvalForm.validateFields();
      const values = approvalForm.getFieldsValue();
      
      setSubmitting(true);
      await approveLeaveEncashmentRequest(selectedRequest.id, values.amount);
      
      message.success('Encashment request approved successfully');
      setApprovalModalVisible(false);
      loadInitialData();
    } catch (error) {
      message.error('Failed to approve encashment request');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const submitRejection = async () => {
    try {
      if (!selectedRequest) return;
      
      await rejectionForm.validateFields();
      const values = rejectionForm.getFieldsValue();
      
      setSubmitting(true);
      await rejectLeaveEncashmentRequest(selectedRequest.id, values.rejection_reason);
      
      message.success('Encashment request rejected');
      setRejectionModalVisible(false);
      loadInitialData();
    } catch (error) {
      message.error('Failed to reject encashment request');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getFilteredRequests = () => {
    if (activeTab === 'all') {
      return encashmentRequests;
    }
    
    return encashmentRequests.filter(req => req.status === activeTab);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : employeeId;
  };

  // Only show encashment requests for current user unless user is HR/Admin
  const filteredRequests = getFilteredRequests().filter(request => {
    if (isAdmin || isHR) return true;
    return request.employee_id === user?.id;
  });

  const columns = [
    {
      title: 'Reference ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text copyable>{id.substring(0, 8)}...</Text>
    },
    ...(isAdmin || isHR ? [
      {
        title: 'Employee',
        dataIndex: 'employee_id',
        key: 'employee',
        render: (employeeId: string) => getEmployeeName(employeeId)
      }
    ] : []),
    {
      title: 'Leave Type',
      dataIndex: 'leave_type_name',
      key: 'leave_type'
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year'
    },
    {
      title: 'Requested Days',
      dataIndex: 'requested_days',
      key: 'days'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: EncashmentStatus) => (
        <Tag color={statusColors[status] || 'default'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Requested On',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Amount',
      dataIndex: 'approved_amount',
      key: 'amount',
      render: (amount: number | null, record: ExtendedLeaveEncashmentRequest) => {
        // Use explicit comparison to avoid type issues
        const isApprovedOrPaid = 
          record.status === ('approved' as EncashmentStatus) || 
          record.status === ('paid' as EncashmentStatus);
          
        if (isApprovedOrPaid) {
          return `₹${amount?.toFixed(2) || '0.00'}`;
        }
        return record.calculated_amount ? `₹${record.calculated_amount.toFixed(2)} (est.)` : '-';
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ExtendedLeaveEncashmentRequest) => {
        if ((isAdmin || isHR) && record.status === 'pending') {
          return (
            <Space>
              <Button 
                type="primary" 
                icon={<CheckOutlined />} 
                size="small"
                onClick={() => handleApprove(record)}
              >
                Approve
              </Button>
              <Button 
                danger 
                icon={<CloseOutlined />} 
                size="small"
                onClick={() => handleReject(record)}
              >
                Reject
              </Button>
            </Space>
          );
        }
        return null;
      }
    }
  ];

  return (
    <MainLayout title="Leave Encashment">
      <div className="page-header">
        <div>
          <Title level={2}>Leave Encashment</Title>
        </div>
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleNewRequest}
          >
            New Encashment Request
          </Button>
        </div>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="All Requests" key="all" />
          <TabPane tab="Pending" key="pending" />
          <TabPane tab="Approved" key="approved" />
          <TabPane tab="Rejected" key="rejected" />
          <TabPane tab="Paid" key="paid" />
        </Tabs>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table 
            dataSource={filteredRequests} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* Approval Modal */}
      <Modal
        title="Approve Leave Encashment"
        open={approvalModalVisible}
        onOk={submitApproval}
        onCancel={() => setApprovalModalVisible(false)}
        confirmLoading={submitting}
      >
        <Form form={approvalForm} layout="vertical">
          <Form.Item
            name="amount"
            label="Approval Amount"
            rules={[
              { required: true, message: 'Please enter approval amount' },
              { type: 'number', min: 0, message: 'Amount must be positive' }
            ]}
          >
            <InputNumber
              prefix={<DollarOutlined />}
              style={{ width: '100%' }}
              precision={2}
            />
          </Form.Item>
          <p>
            <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
            This will approve the encashment request and initiate payment processing.
          </p>
        </Form>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        title="Reject Leave Encashment"
        open={rejectionModalVisible}
        onOk={submitRejection}
        onCancel={() => setRejectionModalVisible(false)}
        confirmLoading={submitting}
      >
        <Form form={rejectionForm} layout="vertical">
          <Form.Item
            name="rejection_reason"
            label="Reason for Rejection"
            rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <p>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
            This will reject the encashment request and notify the employee.
          </p>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default LeaveEncashmentPage; 
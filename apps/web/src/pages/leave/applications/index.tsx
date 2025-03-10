import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Select, 
  DatePicker, 
  Form, 
  Row, 
  Col, 
  message,
  Collapse,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  FilterOutlined, 
  ReloadOutlined, 
  CheckOutlined, 
  CloseOutlined, 
  EyeOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { getLeaveApplications, approveLeaveApplication, rejectLeaveApplication, LeaveApplication } from '../../../api/leaveApplications';
import { getLeaveTypes, LeaveType } from '../../../api/leaveTypes';
import { useAuth } from '../../../contexts/AuthContext';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const LeaveApplicationsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[moment.Moment | null, moment.Moment | null] | null>(null);
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadLeaveApplications();
    loadLeaveTypes();
  }, []);

  const loadLeaveApplications = async () => {
    try {
      setLoading(true);
      const data = await getLeaveApplications();
      setLeaveApplications(data);
    } catch (error) {
      message.error('Failed to load leave applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaveTypes = async () => {
    try {
      const data = await getLeaveTypes();
      setLeaveTypes(data);
    } catch (error) {
      message.error('Failed to load leave types');
      console.error(error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveLeaveApplication(id);
      message.success('Leave application approved');
      loadLeaveApplications();
    } catch (error) {
      message.error('Failed to approve leave application');
      console.error(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectLeaveApplication(id, 'Rejected by manager');
      message.success('Leave application rejected');
      loadLeaveApplications();
    } catch (error) {
      message.error('Failed to reject leave application');
      console.error(error);
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/leave/applications/${id}`);
  };

  const handleFilter = () => {
    form.validateFields().then(values => {
      setTypeFilter(values.leaveType || null);
      setStatusFilter(values.status || null);
      setDateRange(values.dateRange || null);
    });
  };

  const handleReset = () => {
    form.resetFields();
    setTypeFilter(null);
    setStatusFilter(null);
    setDateRange(null);
  };

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'default';
      default:
        return 'processing';
    }
  };

  // Filter data based on selected filters
  const getFilteredData = () => {
    let filteredData = [...leaveApplications];

    if (typeFilter) {
      filteredData = filteredData.filter(item => item.leave_type_id === typeFilter);
    }

    if (statusFilter) {
      filteredData = filteredData.filter(item => item.status === statusFilter);
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');

      filteredData = filteredData.filter(item => {
        const fromDate = moment(item.from_date);
        const toDate = moment(item.to_date);
        
        // Check for overlap between application date range and filter date range
        return (
          (fromDate.isSameOrAfter(startDate) && fromDate.isSameOrBefore(endDate)) ||
          (toDate.isSameOrAfter(startDate) && toDate.isSameOrBefore(endDate)) ||
          (fromDate.isBefore(startDate) && toDate.isAfter(endDate))
        );
      });
    }

    return filteredData;
  };

  const renderEmployeeName = (record: LeaveApplication) => {
    if (record.employee) {
      return `${record.employee.first_name} ${record.employee.last_name}`;
    }
    return 'Unknown';
  };

  const renderLeaveName = (record: LeaveApplication) => {
    const leaveType = leaveTypes.find(type => type.id === record.leave_type_id);
    
    if (leaveType) {
      return <span style={{ color: leaveType.color_code }}>{leaveType.name}</span>;
    }
    
    return 'Unknown';
  };

  const renderDuration = (record: LeaveApplication) => {
    const fromDate = moment(record.from_date).format('MMM D, YYYY');
    const toDate = moment(record.to_date).format('MMM D, YYYY');

    if (fromDate === toDate) {
      return fromDate;
    }

    return `${fromDate} - ${toDate} (${record.duration_days} day${record.duration_days !== 1 ? 's' : ''})`;
  };

  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      render: renderEmployeeName,
      responsive: ['md'],
    },
    {
      title: 'Leave Type',
      key: 'leave_type',
      render: renderLeaveName,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: renderDuration,
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LeaveApplication) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              size={isMobile ? 'small' : 'middle'} 
              onClick={() => handleViewDetails(record.id)}
            />
          </Tooltip>
          
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />} 
                  size={isMobile ? 'small' : 'middle'} 
                  onClick={() => handleApprove(record.id)} 
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  danger 
                  icon={<CloseOutlined />} 
                  size={isMobile ? 'small' : 'middle'} 
                  onClick={() => handleReject(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Mobile view: render cards instead of table rows
  const renderMobileCard = (application: LeaveApplication) => {
    return (
      <Card 
        style={{ marginBottom: 16 }} 
        key={application.id}
        size="small"
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>{renderLeaveName(application)}</div>
            <Tag color={getStatusColor(application.status)}>
              {application.status.toUpperCase()}
            </Tag>
          </div>
        }
        actions={[
          <EyeOutlined key="view" onClick={() => handleViewDetails(application.id)} />,
          application.status === 'pending' ? <CheckOutlined key="approve" onClick={() => handleApprove(application.id)} /> : null,
          application.status === 'pending' ? <CloseOutlined key="reject" onClick={() => handleReject(application.id)} /> : null,
        ].filter(Boolean)}
      >
        <p style={{ margin: 0 }}><strong>Employee:</strong> {renderEmployeeName(application)}</p>
        <p style={{ margin: 0 }}><strong>Duration:</strong> {renderDuration(application)}</p>
        <p style={{ margin: 0 }}><strong>Reason:</strong> {application.reason}</p>
      </Card>
    );
  };

  const renderFilterForm = () => (
    <Form
      form={form}
      layout={isMobile ? 'vertical' : 'inline'}
      onFinish={handleFilter}
    >
      <Form.Item name="leaveType" label="Leave Type">
        <Select style={{ width: isMobile ? '100%' : 180 }} allowClear placeholder="Select leave type">
          {leaveTypes.map(type => (
            <Option key={type.id} value={type.id}>
              {type.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select style={{ width: isMobile ? '100%' : 130 }} allowClear placeholder="Select status">
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="rejected">Rejected</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </Form.Item>

      <Form.Item name="dateRange" label="Date Range">
        <RangePicker style={{ width: isMobile ? '100%' : 250 }} />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" icon={<FilterOutlined />} onClick={handleFilter}>
            Filter
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  return (
    <MainLayout title="Leave Applications">
      <div className="page-header" style={{ marginBottom: '20px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '10px' : '0' }}>
        <h1>Leave Applications</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/leave/applications/create')}
        >
          Apply for Leave
        </Button>
      </div>

      <Card>
        {isMobile ? (
          <Collapse defaultActiveKey={['filters']} style={{ marginBottom: 16 }}>
            <Panel header="Filters" key="filters">
              {renderFilterForm()}
            </Panel>
          </Collapse>
        ) : (
          renderFilterForm()
        )}

        {isMobile ? (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
            ) : getFilteredData().length > 0 ? (
              getFilteredData().map(app => renderMobileCard(app))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <InfoCircleOutlined style={{ fontSize: 24, marginBottom: 16 }} />
                <p>No leave applications match your filters</p>
              </div>
            )}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={getFilteredData()}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>
    </MainLayout>
  );
};

export default LeaveApplicationsPage; 
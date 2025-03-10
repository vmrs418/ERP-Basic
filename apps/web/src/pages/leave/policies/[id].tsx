import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, Button, Tabs, Table, Space, message, Descriptions, Tag, Popconfirm, Spin, Typography } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { fetchLeavePolicy, fetchLeavePolicyDetails, deleteLeavePolicyDetail, LeavePolicy, LeavePolicyDetail } from '../../../api/leavePolicies';

const { Title } = Typography;
const { TabPane } = Tabs;

const LeavePolicyDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [policy, setPolicy] = useState<LeavePolicy | null>(null);
  const [policyDetails, setPolicyDetails] = useState<LeavePolicyDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPolicyData(id as string);
    }
  }, [id]);

  const loadPolicyData = async (policyId: string) => {
    try {
      setLoading(true);
      const policyData = await fetchLeavePolicy(policyId);
      setPolicy(policyData);
      
      const detailsData = await fetchLeavePolicyDetails(policyId);
      setPolicyDetails(detailsData);
    } catch (error) {
      message.error('Failed to load policy data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDetail = () => {
    if (id) {
      router.push(`/leave/policies/${id}/details/create`);
    }
  };

  const handleEditDetail = (detailId: string) => {
    router.push(`/leave/policies/${id}/details/edit/${detailId}`);
  };

  const handleDeleteDetail = async (detailId: string) => {
    try {
      await deleteLeavePolicyDetail(detailId);
      message.success('Policy detail deleted successfully');
      if (id) {
        loadPolicyData(id as string);
      }
    } catch (error) {
      message.error('Failed to delete policy detail');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const detailsColumns = [
    {
      title: 'Leave Type',
      dataIndex: ['leave_type', 'name'],
      key: 'leave_type',
      render: (text: string, record: LeavePolicyDetail) => (
        <span style={{ color: record.leave_type?.color_code }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Annual Quota',
      dataIndex: 'annual_quota',
      key: 'annual_quota',
      render: (quota: number) => `${quota} days`,
    },
    {
      title: 'Accrual Type',
      dataIndex: 'accrual_type',
      key: 'accrual_type',
      render: (type: string) => (
        <Tag color="blue">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Carry Forward Limit',
      dataIndex: 'carry_forward_limit',
      key: 'carry_forward_limit',
      render: (limit: number) => `${limit} days`,
    },
    {
      title: 'Encashment Limit',
      dataIndex: 'encashment_limit',
      key: 'encashment_limit',
      render: (limit: number) => `${limit} days`,
    },
    {
      title: 'Applicable After',
      dataIndex: 'applicable_from_months',
      key: 'applicable_from_months',
      render: (months: number) => `${months} months`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LeavePolicyDetail) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditDetail(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this policy detail?"
            onConfirm={() => handleDeleteDetail(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <MainLayout title="Leave Policy Details">
        <div className="page-loading">
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!policy) {
    return (
      <MainLayout title="Leave Policy Details">
        <div>Policy not found</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Leave Policy: ${policy.name}`}>
      <div className="page-header">
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/leave/policies')}
            style={{ marginBottom: '16px' }}
          >
            Back to Policies
          </Button>
          <Title level={2}>{policy.name}</Title>
        </div>
      </div>

      <Card style={{ marginBottom: '20px' }}>
        <Descriptions title="Policy Information" bordered>
          <Descriptions.Item label="Description" span={3}>
            {policy.description}
          </Descriptions.Item>
          <Descriptions.Item label="Effective From">
            {formatDate(policy.effective_from)}
          </Descriptions.Item>
          <Descriptions.Item label="Effective To">
            {policy.effective_to ? formatDate(policy.effective_to) : 'Indefinite'}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatDate(policy.created_at)}
          </Descriptions.Item>
          <Descriptions.Item label="Current Policy">
            {policy.is_current ? (
              <Tag color="green">Yes</Tag>
            ) : (
              <Tag color="orange">No</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Applicable During Probation">
            {policy.probation_applicable ? (
              <Tag color="blue">Yes</Tag>
            ) : (
              <Tag color="orange">No</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Leave Types in This Policy">
        <div style={{ marginBottom: '16px' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddDetail}
          >
            Add Leave Type
          </Button>
        </div>
        <Table
          columns={detailsColumns}
          dataSource={policyDetails}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </MainLayout>
  );
};

export default LeavePolicyDetailPage; 
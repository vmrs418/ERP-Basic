import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Table, Button, Space, Tag, message, Card, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, SettingOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { fetchLeavePolicies, deleteLeavePolicy, setCurrentPolicy, LeavePolicy } from '../../../api/leavePolicies';

const LeavePoliciesPage = () => {
  const router = useRouter();
  const [policies, setPolicies] = useState<LeavePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingCurrent, setSettingCurrent] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await fetchLeavePolicies();
      setPolicies(data);
    } catch (error) {
      message.error('Failed to load leave policies');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/leave/policies/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/leave/policies/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLeavePolicy(id);
      message.success('Leave policy deleted successfully');
      loadPolicies();
    } catch (error) {
      message.error('Failed to delete leave policy');
      console.error(error);
    }
  };

  const handleSetCurrent = async (id: string) => {
    try {
      setSettingCurrent(true);
      await setCurrentPolicy(id);
      message.success('Current policy updated successfully');
      loadPolicies();
    } catch (error) {
      message.error('Failed to update current policy');
      console.error(error);
    } finally {
      setSettingCurrent(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: LeavePolicy) => (
        <a onClick={() => handleViewDetails(record.id)}>{text}</a>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Effective From',
      dataIndex: 'effective_from',
      key: 'effective_from',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Effective To',
      dataIndex: 'effective_to',
      key: 'effective_to',
      render: (date: string | null) => (date ? formatDate(date) : 'Indefinite'),
    },
    {
      title: 'Current',
      dataIndex: 'is_current',
      key: 'is_current',
      render: (isCurrent: boolean) => (
        isCurrent ? <Tag color="green">Current</Tag> : null
      ),
    },
    {
      title: 'Applicable in Probation',
      dataIndex: 'probation_applicable',
      key: 'probation_applicable',
      render: (applicable: boolean) => (
        <Tag color={applicable ? 'blue' : 'orange'}>
          {applicable ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LeavePolicy) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<SettingOutlined />}
            size="small"
            onClick={() => handleViewDetails(record.id)}
          >
            Details
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          {!record.is_current && (
            <>
              <Button
                type="default"
                icon={<CheckCircleOutlined />}
                size="small"
                onClick={() => handleSetCurrent(record.id)}
                loading={settingCurrent}
              >
                Set Current
              </Button>
              <Popconfirm
                title="Are you sure you want to delete this policy?"
                onConfirm={() => handleDelete(record.id)}
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
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <MainLayout title="Leave Policies">
      <div className="page-header">
        <h1>Leave Policies</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/leave/policies/create')}
        >
          Add Leave Policy
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={policies}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </MainLayout>
  );
};

export default LeavePoliciesPage; 
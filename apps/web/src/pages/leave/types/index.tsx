import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Table, Button, Space, Tag, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { fetchLeaveTypes, deleteLeaveType } from '../../../api/leaveTypes';

const LeaveTypesPage = () => {
  const router = useRouter();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      setLoading(true);
      const data = await fetchLeaveTypes();
      setLeaveTypes(data);
    } catch (error) {
      message.error('Failed to load leave types');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    router.push(`/leave/types/edit/${id}`);
  };

  const showDeleteConfirm = (leaveType) => {
    setSelectedLeaveType(leaveType);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await deleteLeaveType(selectedLeaveType.id);
      message.success('Leave type deleted successfully');
      loadLeaveTypes();
      setDeleteModalVisible(false);
    } catch (error) {
      message.error('Failed to delete leave type');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Color',
      dataIndex: 'color_code',
      key: 'color_code',
      render: (color) => (
        <div
          style={{
            backgroundColor: color,
            width: '20px',
            height: '20px',
            borderRadius: '4px',
          }}
        />
      ),
    },
    {
      title: 'Paid',
      dataIndex: 'is_paid',
      key: 'is_paid',
      render: (isPaid) => (
        <Tag color={isPaid ? 'green' : 'red'}>
          {isPaid ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Encashable',
      dataIndex: 'is_encashable',
      key: 'is_encashable',
      render: (isEncashable) => (
        <Tag color={isEncashable ? 'green' : 'red'}>
          {isEncashable ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Requires Approval',
      dataIndex: 'requires_approval',
      key: 'requires_approval',
      render: (requiresApproval) => (
        <Tag color={requiresApproval ? 'blue' : 'orange'}>
          {requiresApproval ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            size="small"
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout title="Leave Types">
      <div className="page-header">
        <h1>Leave Types</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/leave/types/create')}
        >
          Add Leave Type
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={leaveTypes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Yes, Delete"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete the leave type{' '}
          <strong>{selectedLeaveType?.name}</strong>?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>
    </MainLayout>
  );
};

export default LeaveTypesPage; 
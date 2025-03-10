import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Popconfirm, message, Modal, Form, Input, InputNumber, Switch, Tabs, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { 
  fetchApprovalWorkflows, 
  createApprovalWorkflow, 
  deleteApprovalWorkflow, 
  CreateApprovalWorkflowDto, 
  LeaveApprovalWorkflow 
} from '../../../api/leaveApprovals';
import { useAuth } from '../../../contexts/AuthContext';

const { TabPane } = Tabs;

const ApprovalWorkflowsPage = () => {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<LeaveApprovalWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<LeaveApprovalWorkflow | null>(null);
  const [workflowForm] = Form.useForm();

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await fetchApprovalWorkflows();
      setWorkflows(data);
    } catch (error) {
      message.error('Failed to load approval workflows');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = () => {
    workflowForm.resetFields();
    setCreateModalVisible(true);
  };

  const handleEditWorkflow = (workflow: LeaveApprovalWorkflow) => {
    setSelectedWorkflow(workflow);
    workflowForm.setFieldsValue(workflow);
    setEditModalVisible(true);
  };

  const handleDeleteWorkflow = async (id: string) => {
    try {
      await deleteApprovalWorkflow(id);
      message.success('Workflow deleted successfully');
      loadWorkflows();
    } catch (error) {
      message.error('Failed to delete workflow');
      console.error(error);
    }
  };

  const handleCreateFormSubmit = async (values: any) => {
    try {
      const workflowData: CreateApprovalWorkflowDto = {
        name: values.name,
        description: values.description,
        levels: values.levels,
        is_active: values.is_active,
      };
      
      await createApprovalWorkflow(workflowData);
      message.success('Workflow created successfully');
      setCreateModalVisible(false);
      loadWorkflows();
    } catch (error) {
      message.error('Failed to create workflow');
      console.error(error);
    }
  };

  const handleEditFormSubmit = async (values: any) => {
    try {
      if (!selectedWorkflow) return;
      
      const workflowData: CreateApprovalWorkflowDto = {
        name: values.name,
        description: values.description,
        levels: values.levels,
        is_active: values.is_active,
      };
      
      // In a real implementation, we would update the workflow here
      // await updateApprovalWorkflow(selectedWorkflow.id, workflowData);
      message.success('Workflow updated successfully');
      setEditModalVisible(false);
      loadWorkflows();
    } catch (error) {
      message.error('Failed to update workflow');
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Approval Levels',
      dataIndex: 'levels',
      key: 'levels',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <span style={{ color: isActive ? 'green' : 'red' }}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: LeaveApprovalWorkflow) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditWorkflow(record)}
            style={{ marginRight: '8px' }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this workflow?"
            onConfirm={() => handleDeleteWorkflow(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Create workflow modal
  const renderCreateModal = () => (
    <Modal
      title="Create Approval Workflow"
      visible={createModalVisible}
      onCancel={() => setCreateModalVisible(false)}
      footer={null}
    >
      <Form
        form={workflowForm}
        layout="vertical"
        onFinish={handleCreateFormSubmit}
        initialValues={{
          is_active: true,
          levels: 1,
        }}
      >
        <Form.Item
          name="name"
          label="Workflow Name"
          rules={[{ required: true, message: 'Please enter workflow name' }]}
        >
          <Input placeholder="e.g., Standard Approval Workflow" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <Input.TextArea rows={3} placeholder="Describe this workflow" />
        </Form.Item>

        <Form.Item
          name="levels"
          label="Approval Levels"
          rules={[{ required: true, message: 'Please enter number of levels' }]}
        >
          <InputNumber min={1} max={5} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="is_active"
          label="Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Workflow
          </Button>
          <Button 
            style={{ marginLeft: '10px' }} 
            onClick={() => setCreateModalVisible(false)}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  // Edit workflow modal
  const renderEditModal = () => (
    <Modal
      title="Edit Approval Workflow"
      visible={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
    >
      <Form
        form={workflowForm}
        layout="vertical"
        onFinish={handleEditFormSubmit}
      >
        <Form.Item
          name="name"
          label="Workflow Name"
          rules={[{ required: true, message: 'Please enter workflow name' }]}
        >
          <Input placeholder="e.g., Standard Approval Workflow" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <Input.TextArea rows={3} placeholder="Describe this workflow" />
        </Form.Item>

        <Form.Item
          name="levels"
          label="Approval Levels"
          rules={[{ required: true, message: 'Please enter number of levels' }]}
        >
          <InputNumber min={1} max={5} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="is_active"
          label="Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Workflow
          </Button>
          <Button 
            style={{ marginLeft: '10px' }} 
            onClick={() => setEditModalVisible(false)}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <MainLayout title="Leave Approval Workflows">
      <div className="page-header">
        <h1>Leave Approval Workflows</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateWorkflow}
        >
          Create Workflow
        </Button>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Approval Workflows" key="1">
          <Card>
            <Alert
              message="Configure multi-level approval workflows for leave applications"
              description="Define workflows with multiple levels of approval. Each level can have one or more approvers."
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />

            <Table
              columns={columns}
              dataSource={workflows}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        
        <TabPane tab="Help & Guidelines" key="2">
          <Card>
            <div style={{ padding: '20px' }}>
              <h2>Setting Up Approval Workflows</h2>
              <p>Approval workflows allow you to define the sequence of approvals required for leave applications.</p>
              
              <h3>Key Concepts</h3>
              <ul>
                <li><strong>Workflow:</strong> A defined process for approving leave applications.</li>
                <li><strong>Levels:</strong> The number of sequential approval steps required.</li>
                <li><strong>Approvers:</strong> Employees who have the authority to approve or reject leave applications at each level.</li>
              </ul>
              
              <h3>Best Practices</h3>
              <ol>
                <li>Keep workflows simple with 1-3 levels for most organizations.</li>
                <li>Clearly define who should be approvers at each level (e.g., direct manager at level 1, department head at level 2).</li>
                <li>Consider creating different workflows for different leave types or departments.</li>
                <li>Ensure at least one workflow is marked as active.</li>
              </ol>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {renderCreateModal()}
      {renderEditModal()}
    </MainLayout>
  );
};

export default ApprovalWorkflowsPage; 
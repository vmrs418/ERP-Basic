// @ts-nocheck - Type definitions don't match the Ant Design version being used
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Input, Tabs, Tooltip, Badge } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { apiClient } from '../../api/client';
import { LeaveApplication } from '../../types';

const { TabPane } = Tabs;
const { confirm } = Modal;

interface LeaveApprovalDashboardProps {
  userRoles: string[];
}

const LeaveApprovalDashboard: React.FC<LeaveApprovalDashboardProps> = ({ userRoles }) => {
  const [pendingApplications, setPendingApplications] = useState<LeaveApplication[]>([]);
  const [myPendingApprovals, setMyPendingApprovals] = useState<LeaveApplication[]>([]);
  const [recentApprovals, setRecentApprovals] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState<boolean>(false);
  
  const isHrOrAdmin = userRoles.some(role => ['admin', 'hr'].includes(role));

  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  const fetchLeaveApplications = async () => {
    setLoading(true);
    try {
      // Fetch pending applications for all approvers (HR/Admin only)
      if (isHrOrAdmin) {
        const pendingResponse = await apiClient.get('/leave-applications?status=pending');
        setPendingApplications(pendingResponse.data);
      }
      
      // Fetch applications pending my approval
      const myApprovalsResponse = await apiClient.get('/leave-approval-workflows/pending');
      setMyPendingApprovals(myApprovalsResponse.data.map((workflow: any) => workflow.leave_application));
      
      // Fetch recently actioned applications
      const recentResponse = await apiClient.get('/leave-applications?status=approved,rejected&limit=10');
      setRecentApprovals(recentResponse.data);
    } catch (error) {
      console.error('Error fetching leave applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application: LeaveApplication) => {
    setSelectedApplication(application);
    setViewModalVisible(true);
  };

  const handleApprove = (application: LeaveApplication) => {
    confirm({
      title: 'Approve Leave Application',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to approve the leave application for ${application.employee?.first_name} ${application.employee?.last_name}?`,
      onOk: async () => {
        try {
          await apiClient.post(`/leave-applications/${application.id}/approve`);
          fetchLeaveApplications();
        } catch (error) {
          console.error('Error approving leave application:', error);
        }
      }
    });
  };

  const showRejectModal = (application: LeaveApplication) => {
    setSelectedApplication(application);
    setRejectionReason('');
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      return;
    }
    
    try {
      await apiClient.post(`/leave-applications/${selectedApplication.id}/reject`, {
        rejection_reason: rejectionReason
      });
      setRejectModalVisible(false);
      fetchLeaveApplications();
    } catch (error) {
      console.error('Error rejecting leave application:', error);
    }
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      render: (employee: any) => (
        employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown'
      )
    },
    {
      title: 'Leave Type',
      dataIndex: 'leave_type',
      key: 'leave_type',
      render: (leaveType: any) => (
        <Tag color={leaveType?.color_code || 'blue'}>
          {leaveType?.name || 'Unknown'}
        </Tag>
      )
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (record: LeaveApplication) => (
        <>
          {moment(record.from_date).format('MMM D')} - {moment(record.to_date).format('MMM D, YYYY')}
          <br />
          <Badge status="processing" text={`${record.duration_days} days`} />
        </>
      )
    },
    {
      title: 'Applied On',
      dataIndex: 'applied_at',
      key: 'applied_at',
      render: (date: string) => moment(date).format('MMM D, YYYY')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'approved') color = 'green';
        if (status === 'rejected') color = 'red';
        if (status === 'cancelled') color = 'gray';
        
        return (
          <Tag color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: LeaveApplication) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              onClick={() => handleViewApplication(record)}
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
          
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button
                  type="text"
                  style={{ color: 'green' }}
                  onClick={() => handleApprove(record)}
                >
                  <CheckOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="Reject">
                <Button
                  type="text"
                  style={{ color: 'red' }}
                  onClick={() => showRejectModal(record)}
                >
                  <CloseOutlined />
                </Button>
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
      <Card>
        <Tabs defaultActiveKey="my-approvals">
          <TabPane tab="My Pending Approvals" key="my-approvals">
            <Table
              dataSource={myPendingApprovals}
              columns={columns}
              rowKey="id"
              loading={loading}
            />
          </TabPane>
          
          {isHrOrAdmin && (
            <TabPane tab="All Pending Applications" key="all-pending">
              <Table
                dataSource={pendingApplications}
                columns={columns}
                rowKey="id"
                loading={loading}
              />
            </TabPane>
          )}
          
          <TabPane tab="Recent Activity" key="recent">
            <Table
              dataSource={recentApprovals}
              columns={columns}
              rowKey="id"
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* View Application Modal */}
      <Modal
        title="Leave Application Details"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedApplication && (
          <div>
            <h3>Employee: {selectedApplication.employee?.first_name} {selectedApplication.employee?.last_name}</h3>
            <p><strong>Leave Type:</strong> {selectedApplication.leave_type?.name}</p>
            <p><strong>Duration:</strong> {moment(selectedApplication.from_date).format('MMM D, YYYY')} - {moment(selectedApplication.to_date).format('MMM D, YYYY')} ({selectedApplication.duration_days} days)</p>
            <p><strong>Reason:</strong> {selectedApplication.reason}</p>
            
            {selectedApplication.handover_notes && (
              <p><strong>Handover Notes:</strong> {selectedApplication.handover_notes}</p>
            )}
            
            {selectedApplication.contact_during_leave && (
              <p><strong>Contact During Leave:</strong> {selectedApplication.contact_during_leave}</p>
            )}
            
            {selectedApplication.attachment_url && (
              <p>
                <strong>Attachment:</strong>
                <Button type="link" href={selectedApplication.attachment_url} target="_blank">
                  View Attachment
                </Button>
              </p>
            )}
            
            <p><strong>Applied On:</strong> {moment(selectedApplication.applied_at).format('MMM D, YYYY')}</p>
            <p><strong>Status:</strong> {selectedApplication.status.toUpperCase()}</p>
            
            {selectedApplication.status === 'rejected' && (
              <p><strong>Rejection Reason:</strong> {selectedApplication.rejection_reason}</p>
            )}
          </div>
        )}
      </Modal>
      
      {/* Reject Application Modal */}
      <Modal
        title="Reject Leave Application"
        visible={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        okButtonProps={{ disabled: !rejectionReason.trim() }}
      >
        <p>Please provide a reason for rejecting this leave application:</p>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
        />
      </Modal>
    </>
  );
};

export default LeaveApprovalDashboard; 
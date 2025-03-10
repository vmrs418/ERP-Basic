import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { message } from 'antd';
import { Card, Descriptions, Button, Tag, Divider, Modal, Input, Space, Alert, TextArea } from '../../../components/ui/AntdWrappers';
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, StopOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { getLeaveApplication, approveLeaveApplication, rejectLeaveApplication, cancelLeaveApplication, LeaveApplication } from '../../../api/leaveApplications';
import { useAuth } from '../../../contexts/AuthContext';
import { Role } from '../../../types/auth';
import { sendLeaveStatusEmail } from '../../../services/emailService';

const statusColors: Record<string, string> = {
  draft: 'gray',
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
  cancelled: 'black',
};

const LeaveApplicationDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [leaveApplication, setLeaveApplication] = useState<LeaveApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  
  const isAdminOrHR = user?.roles?.some((role: Role) => ['admin', 'hr'].includes(role.name));
  const isOwner = leaveApplication?.employee_id === user?.id;
  const isPending = leaveApplication?.status === 'pending';

  useEffect(() => {
    if (id) {
      loadLeaveApplication();
    }
  }, [id]);

  const loadLeaveApplication = async () => {
    try {
      setLoading(true);
      const data = await getLeaveApplication(id as string);
      setLeaveApplication(data);
    } catch (error) {
      message.error('Failed to load leave application');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!id) return;
    
    try {
      await approveLeaveApplication(id as string);
      message.success('Leave application approved successfully');
      
      // Send email notification
      if (leaveApplication?.employee?.email && leaveApplication?.employee?.first_name) {
        setSendingEmail(true);
        try {
          await sendLeaveStatusEmail(
            id as string,
            'approved',
            leaveApplication.employee.email,
            `${leaveApplication.employee.first_name} ${leaveApplication.employee.last_name || ''}`
          );
        } catch (error) {
          console.error('Failed to send email notification:', error);
          // We don't want to show an error to the user if the email fails
          // The approval was successful
        } finally {
          setSendingEmail(false);
        }
      }
      
      loadLeaveApplication();
    } catch (error) {
      message.error('Failed to approve leave application');
      console.error(error);
    }
  };

  const handleShowRejectionModal = () => {
    setShowRejectionModal(true);
  };

  const handleReject = async () => {
    if (!id || !rejectionReason) return;
    
    try {
      await rejectLeaveApplication(id as string, rejectionReason);
      message.success('Leave application rejected successfully');
      setShowRejectionModal(false);
      
      // Send email notification
      if (leaveApplication?.employee?.email && leaveApplication?.employee?.first_name) {
        setSendingEmail(true);
        try {
          await sendLeaveStatusEmail(
            id as string,
            'rejected',
            leaveApplication.employee.email,
            `${leaveApplication.employee.first_name} ${leaveApplication.employee.last_name || ''}`
          );
        } catch (error) {
          console.error('Failed to send email notification:', error);
          // We don't want to show an error to the user if the email fails
          // The rejection was successful
        } finally {
          setSendingEmail(false);
        }
      }
      
      loadLeaveApplication();
    } catch (error) {
      message.error('Failed to reject leave application');
      console.error(error);
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    
    try {
      await cancelLeaveApplication(id as string);
      message.success('Leave application cancelled successfully');
      
      // Send email notification
      if (leaveApplication?.employee?.email && leaveApplication?.employee?.first_name) {
        setSendingEmail(true);
        try {
          await sendLeaveStatusEmail(
            id as string,
            'cancelled',
            leaveApplication.employee.email,
            `${leaveApplication.employee.first_name} ${leaveApplication.employee.last_name || ''}`
          );
        } catch (error) {
          console.error('Failed to send email notification:', error);
          // We don't want to show an error to the user if the email fails
          // The cancellation was successful
        } finally {
          setSendingEmail(false);
        }
      }
      
      loadLeaveApplication();
    } catch (error) {
      message.error('Failed to cancel leave application');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Leave Application Details">
        <div>Loading...</div>
      </MainLayout>
    );
  }

  if (!leaveApplication) {
    return (
      <MainLayout title="Leave Application Details">
        <div>Leave application not found</div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const employeeName = leaveApplication.employee 
    ? `${leaveApplication.employee.first_name} ${leaveApplication.employee.last_name || ''}`
    : 'Unknown';

  return (
    <MainLayout title="Leave Application Details">
      <div className="page-header">
        <div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/leave/applications')}
            style={{ marginBottom: '16px' }}
          >
            Back to Applications
          </Button>
          <h1>Leave Application Details</h1>
        </div>
      </div>

      {sendingEmail && (
        <Alert 
          message="Sending email notification..." 
          type="info" 
          showIcon 
          style={{ marginBottom: '16px' }} 
        />
      )}

      <Card>
        <Descriptions title="Leave Details" bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Employee">{employeeName}</Descriptions.Item>
          <Descriptions.Item label="Leave Type">
            {leaveApplication.leave_type?.name || 'Unknown'}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(leaveApplication.status)}>
              {leaveApplication.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="From">{new Date(leaveApplication.from_date).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="To">{new Date(leaveApplication.to_date).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Duration">
            {leaveApplication.duration_days} day{leaveApplication.duration_days !== 1 ? 's' : ''}
          </Descriptions.Item>
          <Descriptions.Item label="First Day Half Day">{leaveApplication.first_day_half ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Last Day Half Day">{leaveApplication.last_day_half ? 'Yes' : 'No'}</Descriptions.Item>
          <Descriptions.Item label="Applied On">
            {new Date(leaveApplication.created_at).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Reason" span={3}>{leaveApplication.reason}</Descriptions.Item>
          
          {leaveApplication.contact_during_leave && (
            <Descriptions.Item label="Contact During Leave">
              {leaveApplication.contact_during_leave}
            </Descriptions.Item>
          )}
          
          {leaveApplication.handover_to && (
            <>
              <Descriptions.Item label="Handover To">
                {leaveApplication.handover_to}
              </Descriptions.Item>
              <Descriptions.Item label="Handover Notes" span={3}>
                {leaveApplication.handover_notes}
              </Descriptions.Item>
            </>
          )}
          
          {leaveApplication.status === 'rejected' && leaveApplication.rejection_reason && (
            <Descriptions.Item label="Rejection Reason" span={3}>
              {leaveApplication.rejection_reason}
            </Descriptions.Item>
          )}
          
          {leaveApplication.attachment_url && (
            <Descriptions.Item label="Attachment">
              <a href={leaveApplication.attachment_url} target="_blank" rel="noopener noreferrer">
                View Attachment
              </a>
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          {isPending && (isAdminOrHR || isOwner) && (
            <Space>
              {isAdminOrHR && (
                <>
                  <Button 
                    type="primary" 
                    icon={<CheckOutlined />} 
                    onClick={handleApprove}
                    style={{ backgroundColor: 'green', borderColor: 'green' }}
                  >
                    Approve
                  </Button>
                  <Button 
                    danger 
                    icon={<CloseOutlined />} 
                    onClick={handleShowRejectionModal}
                  >
                    Reject
                  </Button>
                </>
              )}
              
              {isOwner && (
                <Button 
                  danger 
                  icon={<StopOutlined />} 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
            </Space>
          )}
        </div>
      </Card>

      <Modal
        title="Reject Leave Application"
        visible={showRejectionModal}
        onOk={handleReject}
        onCancel={() => setShowRejectionModal(false)}
        okButtonProps={{ disabled: !rejectionReason }}
      >
        <p>Please provide a reason for rejection:</p>
        <TextArea
          rows={4}
          value={rejectionReason}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
          placeholder="Enter reason for rejection"
        />
      </Modal>
    </MainLayout>
  );
};

export default LeaveApplicationDetailPage; 
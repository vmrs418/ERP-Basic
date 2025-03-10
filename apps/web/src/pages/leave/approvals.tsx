import React from 'react';
import { Breadcrumb, Card, Typography } from 'antd';
import { HomeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import LeaveApprovalDashboard from '../../components/leave/LeaveApprovalDashboard';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;

const LeaveApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const userRoles = user?.roles?.map(role => role.name) || [];

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
              <span>Home</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/leave">
              <span>Leave Management</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <CheckCircleOutlined />
              <span>Leave Approvals</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2} className="mt-4 mb-4">Leave Approvals</Title>
        </div>
      </div>

      <div className="page-content">
        <LeaveApprovalDashboard userRoles={userRoles} />
      </div>
    </MainLayout>
  );
};

export default LeaveApprovalsPage; 
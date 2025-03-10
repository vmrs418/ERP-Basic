import React from 'react';
import { Breadcrumb, Card } from 'antd';
import { HomeOutlined, DashboardOutlined } from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import AttendanceDashboard from '../../components/attendance/AttendanceDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { Breadcrumb as AntdBreadcrumb } from '../../components/ui/AntdWrappers';

const AttendanceDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const userRoles = user?.roles?.map(role => role.name) || [];

  return (
    <MainLayout>
      <div className="page-header">
        <div>
          <AntdBreadcrumb>
            <AntdBreadcrumb.Item href="/">
              <HomeOutlined />
              <span>Home</span>
            </AntdBreadcrumb.Item>
            <AntdBreadcrumb.Item href="/attendance">
              <span>Attendance</span>
            </AntdBreadcrumb.Item>
            <AntdBreadcrumb.Item>
              <DashboardOutlined />
              <span>Dashboard</span>
            </AntdBreadcrumb.Item>
          </AntdBreadcrumb>
          <h2 className="mt-4 mb-4">Attendance Dashboard</h2>
        </div>
      </div>

      <div className="page-content">
        <Card>
          <AttendanceDashboard userRoles={userRoles} />
        </Card>
      </div>
    </MainLayout>
  );
};

export default AttendanceDashboardPage; 
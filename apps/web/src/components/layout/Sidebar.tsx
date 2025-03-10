import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  TeamOutlined,
  DollarOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">Dashboard</Link>,
    },
    {
      key: '/employees',
      icon: <UserOutlined />,
      label: <Link href="/employees">Employees</Link>,
    },
    {
      key: '/attendance',
      icon: <ClockCircleOutlined />,
      label: <Link href="/attendance">Attendance</Link>,
    },
    {
      key: '/leave',
      icon: <CalendarOutlined />,
      label: <Link href="/leave">Leave Management</Link>,
    },
    {
      key: '/departments',
      icon: <TeamOutlined />,
      label: <Link href="/departments">Departments</Link>,
    },
    {
      key: '/payroll',
      icon: <DollarOutlined />,
      label: <Link href="/payroll">Payroll</Link>,
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: <Link href="/reports">Reports</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link href="/settings">Settings</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[router.pathname]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar; 
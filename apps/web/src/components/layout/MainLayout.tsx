import React, { ReactNode } from 'react';
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, BellOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';

const { Header, Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu>
      <Menu.Item key="notification1">
        <div>
          <div style={{ fontWeight: 'bold' }}>Leave Request Approved</div>
          <div>Your leave request has been approved</div>
          <div style={{ fontSize: '12px', color: '#999' }}>2 hours ago</div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="notification2">
        <div>
          <div style={{ fontWeight: 'bold' }}>Payroll Generated</div>
          <div>January 2023 payroll has been generated</div>
          <div style={{ fontSize: '12px', color: '#999' }}>1 day ago</div>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Dropdown overlay={notificationMenu} placement="bottomRight">
                <Button type="text" icon={<BellOutlined />} style={{ fontSize: '16px' }} />
              </Dropdown>
              <Dropdown overlay={userMenu} placement="bottomRight">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Avatar icon={<UserOutlined />} />
                  <span style={{ marginLeft: 8 }}>Admin User</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 
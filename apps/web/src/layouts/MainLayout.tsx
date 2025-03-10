import React, { ReactNode, useState, useEffect } from 'react';
import Head from 'next/head';
import { Layout, Drawer, Dropdown, Avatar } from 'antd';
import { 
  UserOutlined, 
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  FileTextOutlined,
  BarChartOutlined,
  ApartmentOutlined,
  IdcardOutlined,
  BankOutlined,
  MailOutlined,
  ScheduleOutlined,
  ProfileOutlined,
  SolutionOutlined,
  HomeOutlined,
  FileOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/auth';
import NotificationsDropdown from '../components/NotificationsDropdown';
import { Menu, Button, Dropdown as CustomDropdown } from '../components/ui/AntdWrappers';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title = 'ERP System' }) => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const currentPath = router.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  const isAdminOrHR = user?.roles?.some((role: Role) => ['admin', 'hr'].includes(role.name)) || false;

  useEffect(() => {
    const checkMobile = () => {
      setMobileView(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const renderMenu = () => (
    <Menu 
      theme="dark" 
      mode="inline" 
      defaultSelectedKeys={[currentPath]} 
      defaultOpenKeys={mobileView ? [] : [currentPath.split('/')[1]]}
    >
      <Menu.Item key="/" icon={<HomeOutlined />}>
        <Link href="/">Dashboard</Link>
      </Menu.Item>
      <SubMenu key="employees" icon={<TeamOutlined />} title="Employees">
        <Menu.Item key="/employees">
          <Link href="/employees">All Employees</Link>
        </Menu.Item>
        <Menu.Item key="/employees/create">
          <Link href="/employees/create">Add Employee</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="attendance" icon={<CalendarOutlined />} title="Attendance">
        <Menu.Item key="/attendance">
          <Link href="/attendance">Daily Attendance</Link>
        </Menu.Item>
        <Menu.Item key="/attendance/summary">
          <Link href="/attendance/summary">Summary</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="leave" icon={<CalendarOutlined />} title="Leave Management">
        <Menu.Item key="/leave/dashboard" icon={<BarChartOutlined />}>
          <Link href="/leave/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/leave/applications">
          <Link href="/leave/applications">Leave Applications</Link>
        </Menu.Item>
        <Menu.Item key="/leave/calendar">
          <Link href="/leave/calendar">Leave Calendar</Link>
        </Menu.Item>
        <Menu.Item key="/leave/team">
          <Link href="/leave/team">Team Management</Link>
        </Menu.Item>
        <Menu.Item key="/leave/balances">
          <Link href="/leave/balances">Leave Balances</Link>
        </Menu.Item>
        <Menu.Item key="/leave/encashment">
          <Link href="/leave/encashment">Leave Encashment</Link>
        </Menu.Item>
        {isAdminOrHR && (
          <Menu.Item key="/leave/reports" icon={<BarChartOutlined />}>
            <Link href="/leave/reports">Leave Reports</Link>
          </Menu.Item>
        )}
        {isAdminOrHR && (
          <Menu.Item key="/leave/settings/approval-workflows" icon={<SettingOutlined />}>
            <Link href="/leave/settings/approval-workflows">Approval Workflows</Link>
          </Menu.Item>
        )}
        <Menu.Item key="/leave/types">
          <Link href="/leave/types">Leave Types</Link>
        </Menu.Item>
        <Menu.Item key="/leave/policies">
          <Link href="/leave/policies">Leave Policies</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
        <Menu.Item key="/settings/profile">
          <Link href="/settings/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="/settings/notifications">
          <Link href="/settings/notifications">Notifications</Link>
        </Menu.Item>
        <Menu.Item key="/settings/general">
          <Link href="/settings/general">General</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );

  const profileSubmenu = [
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Personal Info',
    },
    {
      key: '/profile/salary-details',
      icon: <BankOutlined />,
      label: 'Salary Details',
    },
    {
      key: '/profile/change-password',
      icon: <SettingOutlined />,
      label: 'Change Password',
    },
  ];

  const employeesSubmenu = [
    {
      key: '/employees',
      icon: <TeamOutlined />,
      label: <Link href="/employees">All Employees</Link>,
    },
    {
      key: '/employees/add',
      icon: <UserOutlined />,
      label: <Link href="/employees/add">Add Employee</Link>,
    },
    {
      key: '/employees/departments',
      icon: <ApartmentOutlined />,
      label: <Link href="/employees/departments">Departments</Link>,
    },
    {
      key: '/employees/designations',
      icon: <IdcardOutlined />,
      label: <Link href="/employees/designations">Designations</Link>,
    },
  ];

  const leaveSubmenu = [
    {
      key: '/leave/applications',
      icon: <FileOutlined />,
      label: <Link href="/leave/applications">Leave Applications</Link>,
    },
    {
      key: '/leave/calendar',
      icon: <CalendarOutlined />,
      label: <Link href="/leave/calendar">Leave Calendar</Link>,
    },
    {
      key: '/leave/balances',
      icon: <BankOutlined />,
      label: <Link href="/leave/balances">Leave Balances</Link>,
    },
    {
      key: '/leave/encashment',
      icon: <BankOutlined />,
      label: <Link href="/leave/encashment">Leave Encashment</Link>,
    },
    {
      key: '/leave/reports',
      icon: <BarChartOutlined />,
      label: <Link href="/leave/reports">Leave Reports</Link>,
    },
  ];

  const attendanceSubmenu = [
    {
      key: '/attendance/daily',
      icon: <ClockCircleOutlined />,
      label: <Link href="/attendance/daily">Daily Attendance</Link>,
    },
    {
      key: '/attendance/report',
      icon: <FileTextOutlined />,
      label: <Link href="/attendance/report">Attendance Report</Link>,
    },
    {
      key: '/attendance/regularize',
      icon: <SettingOutlined />,
      label: <Link href="/attendance/regularize">Regularize Attendance</Link>,
    },
  ];

  const settingsSubmenu = [
    {
      key: '/settings/company',
      icon: <HomeOutlined />,
      label: <Link href="/settings/company">Company Settings</Link>,
    },
    {
      key: '/settings/leave-types',
      icon: <TeamOutlined />,
      label: <Link href="/settings/leave-types">Leave Types</Link>,
    },
    {
      key: '/settings/holidays',
      icon: <CalendarOutlined />,
      label: <Link href="/settings/holidays">Holidays</Link>,
    },
    {
      key: '/settings/roles',
      icon: <IdcardOutlined />,
      label: <Link href="/settings/roles">Roles & Permissions</Link>,
    },
  ];

  const items = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link href="/">Dashboard</Link>,
    },
    {
      key: '/employees',
      icon: <TeamOutlined />,
      label: 'Employees',
      children: isAdminOrHR ? employeesSubmenu : null,
    },
    {
      key: '/leave',
      icon: <CalendarOutlined />,
      label: 'Leave Management',
      children: leaveSubmenu,
    },
    {
      key: '/attendance',
      icon: <ClockCircleOutlined />,
      label: 'Attendance',
      children: attendanceSubmenu,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
      children: profileSubmenu,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      children: isAdminOrHR ? settingsSubmenu : null,
    },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handleSignOut}>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Head>
        <title>{title ? `${title} - ERP System` : 'ERP System'}</title>
        <meta name="description" content="Enterprise Resource Planning System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Layout style={{ minHeight: '100vh' }}>
        {mobileView ? (
          <Drawer
            placement="left"
            closable={false}
            onClose={toggleDrawer}
            visible={drawerVisible}
            bodyStyle={{ padding: 0, background: '#001529' }}
            width={250}
          >
            <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[currentPath]}
              defaultOpenKeys={[currentPath.split('/')[1]]}
              items={items}
            />
          </Drawer>
        ) : (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={256}
            className="site-layout-background"
          >
            <div className="logo">
              <Link href="/">
                {collapsed ? <span>ERP</span> : <span>ERP System</span>}
              </Link>
            </div>
            <Menu
              theme="dark"
              defaultSelectedKeys={[currentPath]}
              defaultOpenKeys={[currentPath.split('/')[1]]}
              mode="inline"
              items={items}
            />
          </Sider>
        )}

        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className="header-content">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="trigger"
              />
              <div className="header-right">
                <CustomDropdown
                  overlay={userMenu}
                  placement="bottomRight"
                >
                  <div className="user-dropdown-trigger">
                    <Avatar icon={<UserOutlined />} />
                    <span className="ml-2 hidden md:inline">{user?.email || 'User'}</span>
                  </div>
                </CustomDropdown>
              </div>
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            ERP System ©{new Date().getFullYear()} Created by Your Company
          </Footer>
        </Layout>
      </Layout>
      
      <style jsx global>{`
        .logo {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: bold;
        }
        
        .logo a {
          color: white;
          text-decoration: none;
        }
        
        .site-layout-background {
          background: #fff;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          height: 100%;
        }
        
        .trigger {
          font-size: 18px;
          line-height: 64px;
          cursor: pointer;
          transition: color 0.3s;
        }
        
        .trigger:hover {
          color: #1890ff;
        }
        
        .header-right {
          display: flex;
          align-items: center;
        }
        
        .user-dropdown-trigger {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .username {
          margin-left: 8px;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        @media (max-width: 768px) {
          .username {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default MainLayout; 
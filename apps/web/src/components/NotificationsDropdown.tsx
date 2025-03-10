import React, { useState, useEffect } from 'react';
import { BellOutlined, CheckOutlined, DeleteOutlined, EyeOutlined, InfoCircleOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import moment from 'moment';
import { Menu, Button, Badge, Dropdown } from './ui/AntdWrappers';
import { getNotifications, getUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, Notification } from '../api/notifications';
import { notification } from 'antd';
import { List, Avatar, Spin, Empty } from 'antd';
import { Menu as AntdMenu } from './ui/AntdWrappers';

const NotificationsDropdown: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      loadNotifications();
    }
  }, [visible]);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications(20);
      setNotifications(data);
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to load notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count', error);
    }
  };

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark notification as read', error);
      notification.error({
        message: 'Error',
        description: 'Failed to mark notification as read',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
      notification.error({
        message: 'Error',
        description: 'Failed to mark all notifications as read',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prevNotifications =>
        prevNotifications.filter(n => n.id !== id)
      );
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to delete notification', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete notification',
      });
    }
  };

  const handleItemClick = (notification: Notification) => {
    // Mark as read and navigate if needed
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type and related data
    if (notification.related_to && notification.related_type) {
      switch (notification.related_type) {
        case 'leave_application':
          router.push(`/leave/applications/${notification.related_to}`);
          break;
        case 'approval_request':
          router.push(`/leave/applications/${notification.related_to}`);
          break;
        default:
          // Just close the dropdown
          setVisible(false);
      }
    } else {
      setVisible(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const menu = (
    <AntdMenu className="notifications-dropdown" style={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
      <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontWeight: 'bold' }}>Notifications</span>
        {unreadCount > 0 && (
          <Button size="small" onClick={handleMarkAllAsRead} icon={<CheckOutlined />}>
            Mark all as read
          </Button>
        )}
      </div>
      {loading ? (
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <Spin />
        </div>
      ) : notifications.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item: Notification) => (
            <List.Item
              key={item.id}
              style={{ 
                backgroundColor: item.is_read ? 'white' : '#f6f8fa',
                padding: '8px 12px',
                cursor: 'pointer',
              }}
              actions={[
                <Button 
                  key="read" 
                  type="text" 
                  size="small" 
                  icon={<CheckOutlined />} 
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleMarkAsRead(item.id); }}
                  style={{ visibility: item.is_read ? 'hidden' : 'visible' }}
                />,
                <Button 
                  key="delete" 
                  type="text" 
                  danger 
                  size="small" 
                  icon={<DeleteOutlined />} 
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleDelete(item.id); }}
                />,
              ]}
              onClick={() => handleItemClick(item)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar icon={getNotificationIcon(item.type)} />
                }
                title={item.title}
                description={
                  <div>
                    <div>{item.message}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                      {moment(item.created_at).fromNow()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No notifications"
          style={{ padding: '20px 0' }}
        />
      )}
      <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
        <Button type="link" onClick={() => router.push('/settings/notifications')}>
          Notification Settings
        </Button>
      </div>
    </AntdMenu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={handleVisibleChange}
      placement="bottomRight"
      arrow
    >
      <Badge count={unreadCount} size="small">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: '20px' }} />}
          size="large"
          style={{ padding: '0 8px' }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationsDropdown; 
import React, { useState, useEffect } from 'react';
import { Card, Table, Switch, Alert, message, Spin } from 'antd';
import MainLayout from '../../layouts/MainLayout';
import { getNotificationPreferences, updateNotificationPreference, NotificationPreference } from '../../api/notifications';

interface NotificationType {
  key: string;
  name: string;
  description: string;
  category: string;
}

const NOTIFICATION_TYPES: NotificationType[] = [
  {
    key: 'leave_application_status',
    name: 'Leave Application Status',
    description: 'Notifications when your leave application status changes',
    category: 'Leave Management',
  },
  {
    key: 'leave_application_reminder',
    name: 'Leave Application Reminder',
    description: 'Reminders for upcoming leave',
    category: 'Leave Management',
  },
  {
    key: 'approval_request',
    name: 'Approval Request',
    description: 'Notifications when a leave application requires your approval',
    category: 'Leave Management',
  },
  {
    key: 'team_member_leave',
    name: 'Team Member Leave',
    description: 'Notifications when a team member applies for leave',
    category: 'Leave Management',
  },
  {
    key: 'leave_balance_update',
    name: 'Leave Balance Update',
    description: 'Notifications when your leave balance is updated',
    category: 'Leave Management',
  },
  {
    key: 'attendance_reminder',
    name: 'Attendance Reminder',
    description: 'Reminders to mark your attendance',
    category: 'Attendance',
  },
  {
    key: 'attendance_correction',
    name: 'Attendance Correction',
    description: 'Updates on attendance correction requests',
    category: 'Attendance',
  },
  {
    key: 'system_announcement',
    name: 'System Announcement',
    description: 'Important system-wide announcements',
    category: 'System',
  },
];

const NotificationSettingsPage = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<{ [key: string]: { [key: string]: boolean } }>({});

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const data = await getNotificationPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load notification preferences', error);
      message.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const getPreferenceValue = (type: string, channel: 'email_enabled' | 'push_enabled' | 'in_app_enabled'): boolean => {
    const preference = preferences.find(p => p.type === type);
    return preference ? preference[channel] : true; // Default to true if not found
  };

  const handleTogglePreference = async (
    type: string, 
    channel: 'email_enabled' | 'push_enabled' | 'in_app_enabled', 
    value: boolean
  ) => {
    // Set loading state for this specific toggle
    setSaving(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [channel]: true,
      },
    }));

    try {
      // Update on the server
      const updatedPreference = await updateNotificationPreference(type, { [channel]: value });
      
      // Update local state
      setPreferences(prev => 
        prev.map(p => p.type === type ? updatedPreference : p)
      );
      
      message.success('Notification preference updated');
    } catch (error) {
      console.error('Failed to update notification preference', error);
      message.error('Failed to update notification preference');
    } finally {
      // Clear loading state for this specific toggle
      setSaving(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [channel]: false,
        },
      }));
    }
  };

  const columns = [
    {
      title: 'Notification Type',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: NotificationType) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.name}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 100,
      render: (_: any, record: NotificationType) => (
        <Switch
          checked={getPreferenceValue(record.key, 'email_enabled')}
          onChange={(checked) => handleTogglePreference(record.key, 'email_enabled', checked)}
          loading={saving[record.key]?.email_enabled}
        />
      ),
    },
    {
      title: 'Push',
      dataIndex: 'push',
      key: 'push',
      width: 100,
      render: (_: any, record: NotificationType) => (
        <Switch
          checked={getPreferenceValue(record.key, 'push_enabled')}
          onChange={(checked) => handleTogglePreference(record.key, 'push_enabled', checked)}
          loading={saving[record.key]?.push_enabled}
        />
      ),
    },
    {
      title: 'In-App',
      dataIndex: 'in_app',
      key: 'in_app',
      width: 100,
      render: (_: any, record: NotificationType) => (
        <Switch
          checked={getPreferenceValue(record.key, 'in_app_enabled')}
          onChange={(checked) => handleTogglePreference(record.key, 'in_app_enabled', checked)}
          loading={saving[record.key]?.in_app_enabled}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <MainLayout title="Notification Settings">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Notification Settings">
      <div className="page-header">
        <h1>Notification Settings</h1>
      </div>

      <Alert
        message="Manage Your Notifications"
        description="Control what notifications you receive and how you receive them. Customize your preferences for each notification type."
        type="info"
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <Card>
        <Table
          dataSource={NOTIFICATION_TYPES}
          columns={columns}
          rowKey="key"
          pagination={false}
          expandable={{
            expandedRowRender: () => null,
            rowExpandable: () => false,
          }}
          grouped={true}
          groupBy="category"
        />
      </Card>
    </MainLayout>
  );
};

export default NotificationSettingsPage; 
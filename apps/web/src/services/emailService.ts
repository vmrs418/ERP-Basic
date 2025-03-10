import { apiClient } from '../api/client';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  description?: string;
  is_active: boolean;
}

export interface SendEmailOptions {
  to: string | string[];
  subject?: string;
  template_id?: string;
  template_data?: Record<string, any>;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface EmailNotificationSettings {
  leave_application_status: boolean;
  leave_application_reminder: boolean;
  approval_request: boolean;
  attendance_reminder: boolean;
}

// Send a single email
export const sendEmail = async (options: SendEmailOptions): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/email/send', options);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send leave application status notification
export const sendLeaveStatusEmail = async (
  applicationId: string,
  status: string,
  recipientEmail: string,
  recipientName: string
): Promise<void> => {
  const statusMap: Record<string, string> = {
    approved: 'Approved',
    rejected: 'Rejected',
    pending: 'Submitted and Pending Approval',
    cancelled: 'Cancelled',
  };

  const statusText = statusMap[status.toLowerCase()] || status;

  await sendEmail({
    to: recipientEmail,
    template_id: 'leave_status_notification',
    template_data: {
      recipient_name: recipientName,
      application_id: applicationId,
      status: statusText,
      view_url: `${window.location.origin}/leave/applications/${applicationId}`,
    },
  });
};

// Send leave approval request notification
export const sendApprovalRequestEmail = async (
  applicationId: string,
  approverEmail: string,
  approverName: string,
  employeeName: string,
  leaveType: string,
  fromDate: string,
  toDate: string
): Promise<void> => {
  await sendEmail({
    to: approverEmail,
    template_id: 'leave_approval_request',
    template_data: {
      approver_name: approverName,
      employee_name: employeeName,
      leave_type: leaveType,
      from_date: fromDate,
      to_date: toDate,
      application_id: applicationId,
      action_url: `${window.location.origin}/leave/applications/${applicationId}`,
    },
  });
};

// Send upcoming leave reminder
export const sendUpcomingLeaveReminder = async (
  employeeEmail: string,
  employeeName: string,
  leaveType: string,
  fromDate: string,
  toDate: string
): Promise<void> => {
  await sendEmail({
    to: employeeEmail,
    template_id: 'upcoming_leave_reminder',
    template_data: {
      employee_name: employeeName,
      leave_type: leaveType,
      from_date: fromDate,
      to_date: toDate,
    },
  });
};

// Send leave balance update notification
export const sendLeaveBalanceUpdateEmail = async (
  employeeEmail: string,
  employeeName: string,
  leaveType: string,
  oldBalance: number,
  newBalance: number,
  reason: string
): Promise<void> => {
  await sendEmail({
    to: employeeEmail,
    template_id: 'leave_balance_update',
    template_data: {
      employee_name: employeeName,
      leave_type: leaveType,
      old_balance: oldBalance,
      new_balance: newBalance,
      difference: newBalance - oldBalance,
      reason: reason,
      view_url: `${window.location.origin}/leave/balances`,
    },
  });
};

// Get email templates
export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const response = await apiClient.get('/email/templates');
  return response.data;
};

// Get email template by ID
export const getEmailTemplate = async (id: string): Promise<EmailTemplate> => {
  const response = await apiClient.get(`/email/templates/${id}`);
  return response.data;
};

// Get user's email notification settings
export const getEmailNotificationSettings = async (): Promise<EmailNotificationSettings> => {
  const response = await apiClient.get('/email/notification-settings');
  return response.data;
};

// Update user's email notification settings
export const updateEmailNotificationSettings = async (
  settings: Partial<EmailNotificationSettings>
): Promise<EmailNotificationSettings> => {
  const response = await apiClient.put('/email/notification-settings', settings);
  return response.data;
}; 
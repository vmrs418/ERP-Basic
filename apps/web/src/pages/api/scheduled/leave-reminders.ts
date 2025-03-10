import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../utils/supabaseAdmin';
import { sendUpcomingLeaveReminder } from '../../../services/emailService';

// This endpoint should be secured with an API key for cron job access
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for API key authentication
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Get approved leave applications starting tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Query the database for leave applications
    const { data: leaveApplications, error } = await supabaseAdmin
      .from('leave_applications')
      .select(`
        id, 
        from_date, 
        to_date, 
        employee:employee_id (
          id, 
          first_name, 
          last_name, 
          email
        ),
        leave_type:leave_type_id (
          id,
          name
        )
      `)
      .eq('status', 'approved')
      .eq('from_date', tomorrowStr);

    if (error) {
      console.error('Error fetching leave applications:', error);
      return res.status(500).json({ error: 'Failed to fetch leave applications' });
    }

    // No leave applications starting tomorrow
    if (!leaveApplications || leaveApplications.length === 0) {
      return res.status(200).json({ message: 'No upcoming leave applications to notify' });
    }

    // Send reminder emails
    const emailPromises = leaveApplications.map(async (application) => {
      if (!application.employee || !application.employee[0]?.email) {
        console.warn(`Employee email not found for leave application ${application.id}`);
        return null;
      }

      try {
        await sendUpcomingLeaveReminder(
          application.employee[0].email,
          `${application.employee[0].first_name} ${application.employee[0].last_name || ''}`,
          application.leave_type[0].name,
          new Date(application.from_date).toLocaleDateString(),
          new Date(application.to_date).toLocaleDateString()
        );
        return application.id;
      } catch (error) {
        console.error(`Failed to send reminder for application ${application.id}:`, error);
        return null;
      }
    });

    const results = await Promise.all(emailPromises);
    const sentCount = results.filter(Boolean).length;

    res.status(200).json({
      message: `Successfully sent ${sentCount} leave reminders`,
      total: leaveApplications.length,
      sent: sentCount,
    });
  } catch (error) {
    console.error('Error in leave reminder processing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 
import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../utils/supabaseAdmin';

// Helper function to get dates between two dates (inclusive)
const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  // Strip time information for accurate comparison
  currentDate.setHours(0, 0, 0, 0);
  const lastDate = new Date(endDate);
  lastDate.setHours(0, 0, 0, 0);

  while (currentDate <= lastDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Helper function to check if a date is a weekend
const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

// Helper function to check if a date is a holiday
const isHoliday = async (date: Date): Promise<boolean> => {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  const { data } = await supabaseAdmin
    .from('holidays')
    .select('id')
    .eq('date', dateStr)
    .limit(1);

  return !!data && data.length > 0;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { leave_application_id, status } = req.body;

  if (!leave_application_id) {
    return res.status(400).json({ error: 'Missing leave_application_id parameter' });
  }

  try {
    // Only process approved leave applications
    if (status !== 'approved') {
      return res.status(200).json({ message: 'Leave application not approved, no attendance update needed' });
    }

    // Get leave application details
    const { data: leaveApplication, error: leaveError } = await supabaseAdmin
      .from('leave_applications')
      .select('id, employee_id, from_date, to_date, first_day_half, last_day_half, leave_type_id')
      .eq('id', leave_application_id)
      .single();

    if (leaveError || !leaveApplication) {
      console.error('Error fetching leave application:', leaveError);
      return res.status(404).json({ error: 'Leave application not found' });
    }

    // Get all dates between from_date and to_date
    const fromDate = new Date(leaveApplication.from_date);
    const toDate = new Date(leaveApplication.to_date);
    const datesInRange = getDatesInRange(fromDate, toDate);

    // Process each day in the leave period
    const results = await Promise.all(
      datesInRange.map(async (date) => {
        const dateStr = date.toISOString().split('T')[0];
        const isFirstDay = date.getTime() === fromDate.getTime();
        const isLastDay = date.getTime() === toDate.getTime();
        
        // Skip weekends and holidays if the company policy requires it
        const weekend = isWeekend(date);
        const holiday = await isHoliday(date);
        
        if (weekend) {
          return { date: dateStr, status: 'weekend', skipped: true };
        }
        
        if (holiday) {
          return { date: dateStr, status: 'holiday', skipped: true };
        }

        // Determine status based on half-day flags
        let status = 'on_leave';
        if ((isFirstDay && leaveApplication.first_day_half) || (isLastDay && leaveApplication.last_day_half)) {
          status = 'half_day';
        }

        // Check if an attendance record already exists
        const { data: existingRecord } = await supabaseAdmin
          .from('attendance_records')
          .select('id, status')
          .eq('employee_id', leaveApplication.employee_id)
          .eq('date', dateStr)
          .limit(1);

        if (existingRecord && existingRecord.length > 0) {
          // Update existing record
          const { error: updateError } = await supabaseAdmin
            .from('attendance_records')
            .update({
              status,
              remarks: `Automatically marked due to approved leave: ${leave_application_id}`,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingRecord[0].id);

          if (updateError) {
            console.error('Error updating attendance record:', updateError);
            return { date: dateStr, error: updateError.message };
          }

          return { date: dateStr, status, updated: true };
        } else {
          // Create new record
          const { error: insertError } = await supabaseAdmin
            .from('attendance_records')
            .insert({
              employee_id: leaveApplication.employee_id,
              date: dateStr,
              status,
              source: 'manual',
              remarks: `Automatically marked due to approved leave: ${leave_application_id}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error('Error creating attendance record:', insertError);
            return { date: dateStr, error: insertError.message };
          }

          return { date: dateStr, status, created: true };
        }
      })
    );

    // Count successes and failures
    const created = results.filter(r => r.created).length;
    const updated = results.filter(r => r.updated).length;
    const skipped = results.filter(r => r.skipped).length;
    const errors = results.filter(r => r.error).length;

    res.status(200).json({
      message: 'Leave attendance sync completed',
      leave_application_id,
      results: {
        total: results.length,
        created,
        updated,
        skipped,
        errors,
      },
      details: results,
    });
  } catch (error) {
    console.error('Error in leave-attendance sync:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 
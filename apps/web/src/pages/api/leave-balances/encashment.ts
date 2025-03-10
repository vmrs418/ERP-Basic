import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../utils/supabaseAdmin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the request body
    const { employeeId, leaveTypeId, days, reason } = req.body;

    // Validate the request body
    if (!employeeId || !leaveTypeId || !days || days <= 0) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    // Create the leave encashment record
    const { data, error } = await supabaseAdmin
      .from('leave_encashments')
      .insert({
        employee_id: employeeId,
        leave_type_id: leaveTypeId,
        days: days,
        reason: reason,
        status: 'pending',
        requested_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating leave encashment:', error);
      return res.status(500).json({ message: 'Failed to create leave encashment', error });
    }

    // Return the created leave encashment
    return res.status(201).json(data);
  } catch (error) {
    console.error('Error in leave encashment API:', error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
} 
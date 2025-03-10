import type { NextApiRequest, NextApiResponse } from 'next';

// Mock leave applications data
const mockLeaveApplications = [
  {
    id: '1',
    employee_id: '1',
    employee_name: 'John Doe',
    leave_type_id: '1',
    leave_type_name: 'Casual Leave',
    start_date: '2023-04-10',
    end_date: '2023-04-12',
    reason: 'Family function',
    status: 'approved',
    created_at: '2023-04-01T10:00:00Z',
  },
  {
    id: '2',
    employee_id: '2',
    employee_name: 'Jane Smith',
    leave_type_id: '2',
    leave_type_name: 'Sick Leave',
    start_date: '2023-05-15',
    end_date: '2023-05-17',
    reason: 'Not feeling well',
    status: 'approved',
    created_at: '2023-05-14T09:30:00Z',
  },
  {
    id: '3',
    employee_id: '3',
    employee_name: 'Michael Johnson',
    leave_type_id: '3',
    leave_type_name: 'Annual Leave',
    start_date: '2023-06-01',
    end_date: '2023-06-05',
    reason: 'Family vacation',
    status: 'pending',
    created_at: '2023-05-25T14:15:00Z',
  },
  {
    id: '4',
    employee_id: '1',
    employee_name: 'John Doe',
    leave_type_id: '4',
    leave_type_name: 'Personal Leave',
    start_date: '2023-07-20',
    end_date: '2023-07-20',
    reason: 'Personal work',
    status: 'pending',
    created_at: '2023-07-18T11:45:00Z',
  },
  {
    id: '5',
    employee_id: '2',
    employee_name: 'Jane Smith',
    leave_type_id: '1',
    leave_type_name: 'Casual Leave',
    start_date: '2023-08-10',
    end_date: '2023-08-10',
    reason: 'Personal reasons',
    status: 'rejected',
    created_at: '2023-08-08T10:30:00Z',
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return all leave applications
    res.status(200).json(mockLeaveApplications);
  } else if (req.method === 'POST') {
    // This would create a new leave application in a real API
    // For now, just return success
    res.status(201).json({ 
      success: true,
      message: 'Leave application created successfully',
      data: {
        id: Date.now().toString(),
        employee_name: 'Current User',
        leave_type_name: 'Mock Leave Type',
        status: 'pending',
        created_at: new Date().toISOString(),
        ...req.body
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 
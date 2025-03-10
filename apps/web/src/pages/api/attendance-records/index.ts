import type { NextApiRequest, NextApiResponse } from 'next';

// Mock attendance records
const mockAttendanceRecords = [
  {
    id: '1',
    employee_id: '1',
    employee_name: 'John Doe',
    date: '2023-08-01',
    check_in: '09:00:00',
    check_out: '18:00:00',
    status: 'present',
    working_hours: 9,
    created_at: '2023-08-01T09:00:00Z',
    updated_at: '2023-08-01T18:00:00Z'
  },
  {
    id: '2',
    employee_id: '1',
    employee_name: 'John Doe',
    date: '2023-08-02',
    check_in: '09:15:00',
    check_out: '18:30:00',
    status: 'present',
    working_hours: 9.25,
    created_at: '2023-08-02T09:15:00Z',
    updated_at: '2023-08-02T18:30:00Z'
  },
  {
    id: '3',
    employee_id: '2',
    employee_name: 'Jane Smith',
    date: '2023-08-01',
    check_in: '08:45:00',
    check_out: '17:30:00',
    status: 'present',
    working_hours: 8.75,
    created_at: '2023-08-01T08:45:00Z',
    updated_at: '2023-08-01T17:30:00Z'
  },
  {
    id: '4',
    employee_id: '2',
    employee_name: 'Jane Smith',
    date: '2023-08-02',
    check_in: '09:00:00',
    check_out: '17:45:00',
    status: 'present',
    working_hours: 8.75,
    created_at: '2023-08-02T09:00:00Z',
    updated_at: '2023-08-02T17:45:00Z'
  },
  {
    id: '5',
    employee_id: '3',
    employee_name: 'Michael Johnson',
    date: '2023-08-01',
    check_in: '10:00:00',
    check_out: '19:00:00',
    status: 'late',
    working_hours: 9,
    created_at: '2023-08-01T10:00:00Z',
    updated_at: '2023-08-01T19:00:00Z'
  },
  {
    id: '6',
    employee_id: '3',
    employee_name: 'Michael Johnson',
    date: '2023-08-02',
    check_in: '',
    check_out: '',
    status: 'absent',
    working_hours: 0,
    created_at: '2023-08-02T00:00:00Z',
    updated_at: '2023-08-02T00:00:00Z'
  },
  {
    id: '7',
    employee_id: '1',
    employee_name: 'John Doe',
    date: '2023-08-03',
    check_in: '09:10:00',
    check_out: '18:15:00',
    status: 'present',
    working_hours: 9.08,
    created_at: '2023-08-03T09:10:00Z',
    updated_at: '2023-08-03T18:15:00Z'
  },
  {
    id: '8',
    employee_id: '2',
    employee_name: 'Jane Smith',
    date: '2023-08-03',
    check_in: '09:30:00',
    check_out: '18:00:00',
    status: 'late',
    working_hours: 8.5,
    created_at: '2023-08-03T09:30:00Z',
    updated_at: '2023-08-03T18:00:00Z'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return all attendance records or filter by employee_id if provided
    const { employee_id } = req.query;
    
    if (employee_id) {
      const filteredRecords = mockAttendanceRecords.filter(record => record.employee_id === employee_id);
      res.status(200).json(filteredRecords);
    } else {
      res.status(200).json(mockAttendanceRecords);
    }
  } else if (req.method === 'POST') {
    // This would create a new attendance record in a real API
    // For now, just return success
    res.status(201).json({ 
      success: true,
      message: 'Attendance record created successfully',
      data: {
        id: Date.now().toString(),
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock leave types data
const mockLeaveTypes = [
  {
    id: '1',
    name: 'Casual Leave',
    description: 'For personal reasons, short duration',
    is_paid: true,
    color: '#1890ff',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sick Leave',
    description: 'For medical reasons, requires medical certificate for more than 2 days',
    is_paid: true,
    color: '#52c41a',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Annual Leave',
    description: 'For vacation, planned in advance',
    is_paid: true,
    color: '#722ed1',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Personal Leave',
    description: 'For personal work, short duration',
    is_paid: true,
    color: '#fa8c16',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Unpaid Leave',
    description: 'Leave without pay',
    is_paid: false,
    color: '#f5222d',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return all leave types
    res.status(200).json(mockLeaveTypes);
  } else if (req.method === 'POST') {
    // This would create a new leave type in a real API
    // For now, just return success
    res.status(201).json({ 
      success: true,
      message: 'Leave type created successfully',
      data: {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...req.body
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 
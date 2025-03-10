import { NextApiRequest, NextApiResponse } from 'next';

// Mock data for payroll records (copied from index.ts)
const payrollRecords = [
  {
    id: '1',
    employee_id: '1',
    employee_name: 'John Doe',
    month: 1,
    year: 2023,
    basic_salary: 50000,
    gross_salary: 60000,
    tax_deduction: 6000,
    net_salary: 54000,
    working_days: 22,
    leave_days: 0,
    status: 'approved',
    payment_date: '2023-01-31T10:00:00Z',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-31T10:00:00Z',
  },
  {
    id: '2',
    employee_id: '2',
    employee_name: 'Jane Smith',
    month: 1,
    year: 2023,
    basic_salary: 60000,
    gross_salary: 72000,
    tax_deduction: 7200,
    net_salary: 64800,
    working_days: 20,
    leave_days: 2,
    status: 'approved',
    payment_date: '2023-01-31T10:00:00Z',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-31T10:00:00Z',
  },
  {
    id: '3',
    employee_id: '3',
    employee_name: 'Michael Johnson',
    month: 1,
    year: 2023,
    basic_salary: 45000,
    gross_salary: 54000,
    tax_deduction: 5400,
    net_salary: 48600,
    working_days: 22,
    leave_days: 0,
    status: 'pending',
    payment_date: null,
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-15T08:00:00Z',
  },
  {
    id: '4',
    employee_id: '1',
    employee_name: 'John Doe',
    month: 2,
    year: 2023,
    basic_salary: 50000,
    gross_salary: 60000,
    tax_deduction: 6000,
    net_salary: 54000,
    working_days: 20,
    leave_days: 0,
    status: 'approved',
    payment_date: '2023-02-28T10:00:00Z',
    created_at: '2023-02-15T08:00:00Z',
    updated_at: '2023-02-28T10:00:00Z',
  },
  {
    id: '5',
    employee_id: '2',
    employee_name: 'Jane Smith',
    month: 2,
    year: 2023,
    basic_salary: 60000,
    gross_salary: 72000,
    tax_deduction: 7200,
    net_salary: 64800,
    working_days: 20,
    leave_days: 0,
    status: 'pending',
    payment_date: null,
    created_at: '2023-02-15T08:00:00Z',
    updated_at: '2023-02-15T08:00:00Z',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  // Find the payroll record by ID
  const recordIndex = payrollRecords.findIndex(record => record.id === id);
  
  if (recordIndex === -1) {
    return res.status(404).json({ message: 'Payroll record not found' });
  }
  
  if (req.method === 'PUT') {
    // Update the payroll record status to approved
    const updatedRecord = {
      ...payrollRecords[recordIndex],
      status: 'approved',
      payment_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    payrollRecords[recordIndex] = updatedRecord;
    return res.status(200).json(updatedRecord);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
} 
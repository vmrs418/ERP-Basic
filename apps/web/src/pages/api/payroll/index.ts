import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

// Mock data for payroll records
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
    status: 'approved',
    payment_date: '2023-01-31T10:00:00Z',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-31T10:00:00Z',
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
    status: 'approved',
    payment_date: '2023-02-28T10:00:00Z',
    created_at: '2023-02-15T08:00:00Z',
    updated_at: '2023-02-28T10:00:00Z',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // Return all payroll records or filter by employee_id
      const { employee_id } = req.query;
      
      if (employee_id) {
        const filteredRecords = payrollRecords.filter(record => record.employee_id === employee_id);
        return res.status(200).json(filteredRecords);
      }
      
      return res.status(200).json(payrollRecords);
    
    case 'POST':
      // Create a new payroll record
      const newPayrollRecord = {
        id: uuidv4(),
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      payrollRecords.push(newPayrollRecord);
      return res.status(201).json(newPayrollRecord);
    
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
} 
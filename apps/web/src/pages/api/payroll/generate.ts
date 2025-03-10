import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

// Mock data for employees
const employees = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    basic_salary: 50000,
    status: 'active',
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    basic_salary: 60000,
    status: 'active',
  },
  {
    id: '3',
    first_name: 'Michael',
    last_name: 'Johnson',
    email: 'michael.johnson@example.com',
    basic_salary: 45000,
    status: 'active',
  },
  {
    id: '4',
    first_name: 'Emily',
    last_name: 'Williams',
    email: 'emily.williams@example.com',
    basic_salary: 55000,
    status: 'active',
  },
];

// Mock data for attendance records
const attendanceRecords = [
  { employee_id: '1', date: '2023-01-01' },
  { employee_id: '1', date: '2023-01-02' },
  { employee_id: '1', date: '2023-01-03' },
  { employee_id: '1', date: '2023-01-04' },
  { employee_id: '1', date: '2023-01-05' },
  { employee_id: '1', date: '2023-01-08' },
  { employee_id: '1', date: '2023-01-09' },
  { employee_id: '1', date: '2023-01-10' },
  { employee_id: '1', date: '2023-01-11' },
  { employee_id: '1', date: '2023-01-12' },
  { employee_id: '1', date: '2023-01-15' },
  { employee_id: '1', date: '2023-01-16' },
  { employee_id: '1', date: '2023-01-17' },
  { employee_id: '1', date: '2023-01-18' },
  { employee_id: '1', date: '2023-01-19' },
  { employee_id: '1', date: '2023-01-22' },
  { employee_id: '1', date: '2023-01-23' },
  { employee_id: '1', date: '2023-01-24' },
  { employee_id: '1', date: '2023-01-25' },
  { employee_id: '1', date: '2023-01-26' },
  { employee_id: '1', date: '2023-01-29' },
  { employee_id: '1', date: '2023-01-30' },
  { employee_id: '2', date: '2023-01-01' },
  { employee_id: '2', date: '2023-01-02' },
  { employee_id: '2', date: '2023-01-03' },
  { employee_id: '2', date: '2023-01-04' },
  { employee_id: '2', date: '2023-01-05' },
  { employee_id: '2', date: '2023-01-08' },
  { employee_id: '2', date: '2023-01-09' },
  { employee_id: '2', date: '2023-01-10' },
  { employee_id: '2', date: '2023-01-11' },
  { employee_id: '2', date: '2023-01-12' },
  { employee_id: '2', date: '2023-01-15' },
  { employee_id: '2', date: '2023-01-16' },
  { employee_id: '2', date: '2023-01-17' },
  { employee_id: '2', date: '2023-01-18' },
  { employee_id: '2', date: '2023-01-19' },
  { employee_id: '2', date: '2023-01-22' },
  { employee_id: '2', date: '2023-01-23' },
  { employee_id: '2', date: '2023-01-24' },
  { employee_id: '3', date: '2023-01-01' },
  { employee_id: '3', date: '2023-01-02' },
  { employee_id: '3', date: '2023-01-03' },
  { employee_id: '3', date: '2023-01-04' },
  { employee_id: '3', date: '2023-01-05' },
  { employee_id: '3', date: '2023-01-08' },
  { employee_id: '3', date: '2023-01-09' },
  { employee_id: '3', date: '2023-01-10' },
  { employee_id: '3', date: '2023-01-11' },
  { employee_id: '3', date: '2023-01-12' },
  { employee_id: '3', date: '2023-01-15' },
  { employee_id: '3', date: '2023-01-16' },
  { employee_id: '3', date: '2023-01-17' },
  { employee_id: '3', date: '2023-01-18' },
  { employee_id: '3', date: '2023-01-19' },
  { employee_id: '3', date: '2023-01-22' },
  { employee_id: '3', date: '2023-01-23' },
  { employee_id: '3', date: '2023-01-24' },
  { employee_id: '3', date: '2023-01-25' },
  { employee_id: '3', date: '2023-01-26' },
  { employee_id: '3', date: '2023-01-29' },
  { employee_id: '3', date: '2023-01-30' },
];

// Mock data for leave applications
const leaveApplications = [
  {
    employee_id: '2',
    start_date: '2023-01-25',
    end_date: '2023-01-26',
    status: 'approved',
  },
];

// Mock data for payroll records
const payrollRecords = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { month, year } = req.body;
  
  if (!month || !year) {
    return res.status(400).json({ message: 'Month and year are required' });
  }
  
  // Generate payroll for each active employee
  const generatedRecords = [];
  
  for (const employee of employees) {
    if (employee.status !== 'active') {
      continue;
    }
    
    // Calculate working days
    const employeeAttendance = attendanceRecords.filter(
      record => record.employee_id === employee.id
    );
    
    const workingDays = employeeAttendance.length;
    
    // Calculate leave days
    const employeeLeaves = leaveApplications.filter(
      leave => leave.employee_id === employee.id && leave.status === 'approved'
    );
    
    const leaveDays = employeeLeaves.reduce((total, leave) => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return total + diffDays;
    }, 0);
    
    // Calculate basic salary
    const basicSalary = employee.basic_salary;
    
    // Calculate gross salary (basic + allowances)
    const grossSalary = basicSalary * 1.2; // 20% allowances
    
    // Calculate deductions (tax, etc.)
    const taxRate = 0.1; // 10% tax
    const taxDeduction = grossSalary * taxRate;
    
    // Calculate net salary
    const netSalary = grossSalary - taxDeduction;
    
    // Create payroll record
    const payrollRecord = {
      id: uuidv4(),
      employee_id: employee.id,
      employee_name: `${employee.first_name} ${employee.last_name}`,
      month,
      year,
      basic_salary: basicSalary,
      gross_salary: grossSalary,
      tax_deduction: taxDeduction,
      net_salary: netSalary,
      working_days: workingDays,
      leave_days: leaveDays,
      status: 'pending',
      payment_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Save to mock database
    payrollRecords.push(payrollRecord);
    generatedRecords.push(payrollRecord);
  }
  
  return res.status(201).json(generatedRecords);
} 
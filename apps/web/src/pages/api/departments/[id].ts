import { NextApiRequest, NextApiResponse } from 'next';

// Mock data for departments (copied from index.ts since we can't import it directly)
const departments = [
  {
    id: '1',
    name: 'Human Resources',
    description: 'Responsible for recruiting, onboarding, and employee relations',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-15T08:00:00Z',
  },
  {
    id: '2',
    name: 'Engineering',
    description: 'Software development and technical operations',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-15T08:00:00Z',
  },
  {
    id: '3',
    name: 'Finance',
    description: 'Financial planning, accounting, and payroll management',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-15T08:00:00Z',
  },
  {
    id: '4',
    name: 'Marketing',
    description: 'Brand management, digital marketing, and communications',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-15T08:00:00Z',
  },
  {
    id: '5',
    name: 'Sales',
    description: 'Business development and customer acquisition',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-15T08:00:00Z',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  // Find the department by ID
  const departmentIndex = departments.findIndex(dept => dept.id === id);
  
  if (departmentIndex === -1) {
    return res.status(404).json({ message: 'Department not found' });
  }
  
  switch (req.method) {
    case 'GET':
      // Return the department
      return res.status(200).json(departments[departmentIndex]);
    
    case 'PUT':
      // Update the department
      const updatedDepartment = {
        ...departments[departmentIndex],
        name: req.body.name || departments[departmentIndex].name,
        description: req.body.description || departments[departmentIndex].description,
        updated_at: new Date().toISOString(),
      };
      
      departments[departmentIndex] = updatedDepartment;
      return res.status(200).json(updatedDepartment);
    
    case 'DELETE':
      // Delete the department
      const deletedDepartment = departments[departmentIndex];
      departments.splice(departmentIndex, 1);
      return res.status(200).json(deletedDepartment);
    
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
} 
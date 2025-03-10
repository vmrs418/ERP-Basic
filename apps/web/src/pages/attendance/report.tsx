import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import AttendanceSummary from '../../components/attendance/AttendanceSummary';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api/apiClient';

interface Department {
  id: string;
  name: string;
}

const AttendanceReportPage: NextPage = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch departments on component mount
  React.useEffect(() => {
    const fetchDepartments = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch departments from API
        const response = await api.departments.getAll();
        if (response.items) {
          setDepartments(response.items.map(dept => ({
            id: dept.id,
            name: dept.name
          })));
          
          // If departments exist, select the first one by default
          if (response.items.length > 0) {
            setSelectedDepartment(response.items[0].id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load departments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, [user]);
  
  // Handle department change
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId === "all" ? undefined : departmentId);
  };
  
  return (
    <Layout>
      <Head>
        <title>Attendance Report | ERP System</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Attendance Report</h1>
          
          <div className="w-full md:w-64">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              id="department"
              value={selectedDepartment || "all"}
              onChange={handleDepartmentChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              disabled={loading || departments.length === 0}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Main card */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
              <div className="p-6">
                <AttendanceSummary departmentId={selectedDepartment} />
              </div>
            </div>
            
            {/* Help section */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-lg font-medium text-blue-800 mb-2">About Attendance Reports</h2>
              <p className="text-blue-700 mb-4">
                This page provides managers with a comprehensive view of team attendance across departments.
              </p>
              
              <h3 className="text-md font-medium text-blue-800 mb-2">Report Features:</h3>
              <ul className="list-disc list-inside text-blue-700 space-y-1 mb-4">
                <li>View attendance summary for all employees in a department</li>
                <li>Filter by month and year</li>
                <li>See key metrics including present days, absent days, and total hours worked</li>
                <li>Quickly identify attendance issues with color-coded indicators</li>
                <li>Get department-level averages and statistics</li>
              </ul>
              
              <p className="text-blue-700">
                <strong>Note:</strong> Attendance below 90% is highlighted in yellow, while attendance below 70% is highlighted in red.
              </p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AttendanceReportPage; 
import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import AttendanceHistory from '../../components/attendance/AttendanceHistory';
import { useAuth } from '../../contexts/AuthContext';

const AttendanceHistoryPage: NextPage = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <Head>
        <title>Attendance History | ERP System</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Attendance History</h1>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            {user?.id ? (
              <AttendanceHistory employeeId={user.id} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Please sign in to view your attendance history.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium text-blue-800 mb-2">About Attendance Records</h2>
          <p className="text-blue-700 mb-4">
            This page shows your complete attendance history. You can filter by month, year, and status to view specific records.
          </p>
          
          <h3 className="text-md font-medium text-blue-800 mb-2">Attendance Status Types:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Present</span>
              {' '}- You were present for the full working day
            </li>
            <li>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Half Day</span>
              {' '}- You were present for part of the working day
            </li>
            <li>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Absent</span>
              {' '}- You were absent for the entire working day
            </li>
            <li>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">On Leave</span>
              {' '}- You were on approved leave
            </li>
            <li>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Weekend/Holiday</span>
              {' '}- Non-working day
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceHistoryPage; 
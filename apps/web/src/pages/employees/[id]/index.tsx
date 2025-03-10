import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '../../../contexts/AuthContext';
import EmployeeDetail from '../../../components/employees/EmployeeDetail';
import MainLayout from '../../../layouts/MainLayout';

const EmployeeDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <AuthProvider>
      <Head>
        <title>Employee Details | ERP System</title>
        <meta name="description" content="View detailed employee information" />
      </Head>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          {id && typeof id === 'string' ? (
            <EmployeeDetail employeeId={id} />
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </MainLayout>
    </AuthProvider>
  );
};

export default EmployeeDetailPage; 
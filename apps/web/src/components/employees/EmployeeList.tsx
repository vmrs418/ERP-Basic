import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useEmployees } from '../../hooks/useSWR';
import { EmployeeStatus } from '@erp-system/shared-models';

interface FilterOptions {
  page: number;
  limit: number;
  search: string;
  department_id?: string;
  designation_id?: string;
  status?: string;
  sort_by: string;
  sort_order: 'asc' | 'desc';
}

interface EmployeeWithRelations {
  employee: {
    id: string;
    profile_picture_url?: string;
    first_name: string;
    last_name: string;
    email: string;
    employee_code: string;
    status: 'active' | 'on_notice' | 'terminated' | 'on_leave' | 'absconding';
  };
  current_department?: {
    name: string;
  };
  current_designation?: {
    title: string;
  };
}

const EmployeeList: React.FC = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    limit: 10,
    search: '',
    sort_by: 'employee_code',
    sort_order: 'asc'
  });

  // Update filters from URL query params
  useEffect(() => {
    const query = router.query;
    const newFilters = { ...filters };
    
    if (query.page) newFilters.page = Number(query.page);
    if (query.limit) newFilters.limit = Number(query.limit);
    if (query.search) newFilters.search = query.search as string;
    if (query.department_id) newFilters.department_id = query.department_id as string;
    if (query.designation_id) newFilters.designation_id = query.designation_id as string;
    if (query.status) newFilters.status = query.status as string;
    if (query.sort_by) newFilters.sort_by = query.sort_by as string;
    if (query.sort_order) newFilters.sort_order = query.sort_order as 'asc' | 'desc';
    
    setFilters(newFilters);
  }, [router.query]);

  // Fetch employees data
  const { data, error, isValidating } = useEmployees(filters);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Update URL with filters
  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: { ...filters }
    }, undefined, { shallow: true });
  }, [filters]);

  // Render loading state
  if (isValidating && !data) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        Failed to load employees: {error.message}
      </div>
    );
  }

  // Get employee data
  const employees = data?.items || [];
  const totalPages = data?.total_pages || 0;
  const totalEmployees = data?.total || 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Employees ({totalEmployees})
        </h2>
        <button
          onClick={() => router.push('/employees/new')}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Add New Employee
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={handleSearch}
            placeholder="Search by name, email, or employee code"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status || ''}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="">All Statuses</option>
            <option value={EmployeeStatus.ACTIVE}>Active</option>
            <option value={EmployeeStatus.ON_NOTICE}>On Notice</option>
            <option value={EmployeeStatus.TERMINATED}>Terminated</option>
            <option value={EmployeeStatus.ON_LEAVE}>On Leave</option>
            <option value={EmployeeStatus.ABSCONDING}>Absconding</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="sort_by" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <div className="flex">
            <select
              id="sort_by"
              name="sort_by"
              value={filters.sort_by}
              onChange={handleFilterChange}
              className="w-2/3 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            >
              <option value="employee_code">Employee Code</option>
              <option value="first_name">First Name</option>
              <option value="email">Email</option>
              <option value="date_of_joining">Date of Joining</option>
            </select>
            <select
              id="sort_order"
              name="sort_order"
              value={filters.sort_order}
              onChange={handleFilterChange}
              className="w-1/3 border border-gray-300 rounded-r-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp: EmployeeWithRelations) => (
                <tr key={emp.employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {emp.employee.profile_picture_url ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={emp.employee.profile_picture_url}
                            alt={`${emp.employee.first_name} ${emp.employee.last_name}`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {emp.employee.first_name[0]}{emp.employee.last_name[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {emp.employee.first_name} {emp.employee.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {emp.employee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{emp.employee.employee_code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{emp.current_department?.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{emp.current_designation?.title || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${emp.employee.status === 'active' ? 'bg-green-100 text-green-800' : 
                        emp.employee.status === 'on_notice' ? 'bg-yellow-100 text-yellow-800' : 
                        emp.employee.status === 'terminated' ? 'bg-red-100 text-red-800' : 
                        emp.employee.status === 'on_leave' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {emp.employee.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/employees/${emp.employee.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/employees/${emp.employee.id}/edit`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
              disabled={filters.page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
              disabled={filters.page === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((filters.page - 1) * filters.limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(filters.page * filters.limit, totalEmployees)}
                </span>{' '}
                of <span className="font-medium">{totalEmployees}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  
                  // If total pages <= 5, show all pages
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } 
                  // If current page is in the first 3 pages, show pages 1-5
                  else if (filters.page <= 3) {
                    pageNumber = i + 1;
                  } 
                  // If current page is in the last 3 pages, show the last 5 pages
                  else if (filters.page >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } 
                  // Otherwise show 2 pages before and 2 pages after the current page
                  else {
                    pageNumber = filters.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      aria-current={filters.page === pageNumber ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        filters.page === pageNumber
                          ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
                  disabled={filters.page === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList; 
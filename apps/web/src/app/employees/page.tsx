import Link from 'next/link';

export default function EmployeesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <Link href="/employees/new" className="btn btn-primary">
            Add Employee
          </Link>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Employee List</h3>
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search employees..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead className="table-header">
                    <tr>
                      <th className="table-header-cell">Employee Code</th>
                      <th className="table-header-cell">Name</th>
                      <th className="table-header-cell">Email</th>
                      <th className="table-header-cell">Phone</th>
                      <th className="table-header-cell">Department</th>
                      <th className="table-header-cell">Designation</th>
                      <th className="table-header-cell">Status</th>
                      <th className="table-header-cell">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {/* Sample data - will be replaced with actual data from API */}
                    <tr className="table-row">
                      <td className="table-cell">EMP-JD-2023</td>
                      <td className="table-cell">John Doe</td>
                      <td className="table-cell">john.doe@example.com</td>
                      <td className="table-cell">+91 9876543210</td>
                      <td className="table-cell">Engineering</td>
                      <td className="table-cell">Software Engineer</td>
                      <td className="table-cell">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <Link href={`/employees/1`} className="text-blue-600 hover:text-blue-900">
                            View
                          </Link>
                          <Link href={`/employees/1/edit`} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr className="table-row">
                      <td className="table-cell">EMP-JS-2023</td>
                      <td className="table-cell">Jane Smith</td>
                      <td className="table-cell">jane.smith@example.com</td>
                      <td className="table-cell">+91 9876543211</td>
                      <td className="table-cell">HR</td>
                      <td className="table-cell">HR Manager</td>
                      <td className="table-cell">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex space-x-2">
                          <Link href={`/employees/2`} className="text-blue-600 hover:text-blue-900">
                            View
                          </Link>
                          <Link href={`/employees/2/edit`} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </a>
                  <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </a>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">2</span> of{' '}
                      <span className="font-medium">2</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        1
                      </a>
                      <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
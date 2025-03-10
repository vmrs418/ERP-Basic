import Link from 'next/link';

export default function NewEmployeePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
          <Link href="/employees" className="btn btn-secondary">
            Back to Employees
          </Link>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="p-6">
                <form>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Personal Information Section */}
                    <div className="sm:col-span-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                      <p className="mt-1 text-sm text-gray-500">Basic personal details of the employee.</p>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="first_name" className="form-label">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="middle_name" className="form-label">Middle Name</label>
                      <input
                        type="text"
                        name="middle_name"
                        id="middle_name"
                        className="form-input"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="last_name" className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="personal_email" className="form-label">Personal Email</label>
                      <input
                        type="email"
                        name="personal_email"
                        id="personal_email"
                        className="form-input"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="alternate_phone" className="form-label">Alternate Phone</label>
                      <input
                        type="tel"
                        name="alternate_phone"
                        id="alternate_phone"
                        className="form-input"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        id="date_of_birth"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="gender" className="form-label">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        className="form-input"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="marital_status" className="form-label">Marital Status</label>
                      <select
                        id="marital_status"
                        name="marital_status"
                        className="form-input"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>

                    {/* Employment Information Section */}
                    <div className="sm:col-span-6 mt-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Employment Information</h3>
                      <p className="mt-1 text-sm text-gray-500">Details related to employment.</p>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="employee_code" className="form-label">Employee Code</label>
                      <input
                        type="text"
                        name="employee_code"
                        id="employee_code"
                        className="form-input"
                        placeholder="Auto-generated if left blank"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="date_of_joining" className="form-label">Date of Joining</label>
                      <input
                        type="date"
                        name="date_of_joining"
                        id="date_of_joining"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="probation_period_months" className="form-label">Probation Period (Months)</label>
                      <input
                        type="number"
                        name="probation_period_months"
                        id="probation_period_months"
                        className="form-input"
                        min="0"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-6 mt-6">
                      <div className="flex justify-end">
                        <Link href="/employees" className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 mr-3">
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          Save Employee
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
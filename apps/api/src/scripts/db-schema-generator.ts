/**
 * Script to generate Supabase database schema
 * 
 * This script creates the SQL statements for creating all the tables
 * defined in the ERP system schema.
 * 
 * Run this script with:
 * npx ts-node apps/api/src/scripts/db-schema-generator.ts > schema.sql
 * 
 * Then use the SQL file to create the schema in Supabase.
 */

const generateSchema = () => {
  const schema = `
-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'YOUR_JWT_SECRET';

-------------------------------------------------------------------------------
-- User & Authorization Schema
-------------------------------------------------------------------------------

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL UNIQUE,
  employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  phone VARCHAR,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Roles Junction Table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  description TEXT,
  module VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Role Permissions Junction Table
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-------------------------------------------------------------------------------
-- Employees Management Schema
-------------------------------------------------------------------------------

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_code VARCHAR NOT NULL UNIQUE,
  first_name VARCHAR NOT NULL,
  middle_name VARCHAR,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  personal_email VARCHAR,
  phone VARCHAR NOT NULL,
  alternate_phone VARCHAR,
  date_of_birth DATE NOT NULL,
  date_of_joining DATE NOT NULL,
  probation_period_months INTEGER NOT NULL,
  confirmation_date DATE,
  gender VARCHAR NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  marital_status VARCHAR NOT NULL CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  blood_group VARCHAR,
  emergency_contact_name VARCHAR NOT NULL,
  emergency_contact_relation VARCHAR NOT NULL,
  emergency_contact_phone VARCHAR NOT NULL,
  current_address TEXT NOT NULL,
  permanent_address TEXT NOT NULL,
  nationality VARCHAR NOT NULL DEFAULT 'Indian',
  aadhaar_number VARCHAR UNIQUE,
  pan_number VARCHAR UNIQUE,
  passport_number VARCHAR UNIQUE,
  passport_expiry DATE,
  profile_picture_url VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_notice', 'terminated', 'on_leave', 'absconding')),
  notice_period_days INTEGER,
  last_working_date DATE,
  termination_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  updated_by UUID NOT NULL REFERENCES users(id)
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  parent_department_id UUID REFERENCES departments(id),
  head_employee_id UUID REFERENCES employees(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Employee Departments Junction Table
CREATE TABLE IF NOT EXISTS employee_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  from_date DATE NOT NULL,
  to_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Designations Table
CREATE TABLE IF NOT EXISTS designations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT,
  level INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Employee Designations Junction Table
CREATE TABLE IF NOT EXISTS employee_designations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  designation_id UUID NOT NULL REFERENCES designations(id) ON DELETE CASCADE,
  from_date DATE NOT NULL,
  to_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Employment Types Table
CREATE TABLE IF NOT EXISTS employment_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Employee Employment Types Junction Table
CREATE TABLE IF NOT EXISTS employee_employment_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  employment_type_id UUID NOT NULL REFERENCES employment_types(id) ON DELETE CASCADE,
  from_date DATE NOT NULL,
  to_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Salary Details Table
CREATE TABLE IF NOT EXISTS salary_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  basic_salary DECIMAL NOT NULL,
  hra DECIMAL NOT NULL,
  conveyance_allowance DECIMAL NOT NULL,
  medical_allowance DECIMAL NOT NULL,
  special_allowance DECIMAL NOT NULL,
  pf_employer_contribution DECIMAL NOT NULL,
  pf_employee_contribution DECIMAL NOT NULL,
  esi_employer_contribution DECIMAL NOT NULL,
  esi_employee_contribution DECIMAL NOT NULL,
  professional_tax DECIMAL NOT NULL,
  tds DECIMAL NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id)
);

-- Bank Details Table
CREATE TABLE IF NOT EXISTS bank_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  account_holder_name VARCHAR NOT NULL,
  account_number VARCHAR NOT NULL,
  bank_name VARCHAR NOT NULL,
  branch_name VARCHAR NOT NULL,
  ifsc_code VARCHAR NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  document_type VARCHAR NOT NULL CHECK (document_type IN ('aadhar', 'pan', 'passport', 'resume', 'offer_letter', 'joining_letter', 'experience_certificate', 'education_certificate', 'other')),
  document_url VARCHAR NOT NULL,
  verification_status VARCHAR NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_notes TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- Attendance Management Schema
-------------------------------------------------------------------------------

-- Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_out_time TIMESTAMPTZ,
  working_hours FLOAT DEFAULT 0,
  status VARCHAR NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'half_day', 'late', 'early_departure', 'on_leave', 'weekend', 'holiday')),
  source VARCHAR NOT NULL DEFAULT 'web' CHECK (source IN ('web', 'mobile', 'biometric', 'manual')),
  location_check_in TEXT,
  location_check_out TEXT,
  ip_address_check_in TEXT,
  ip_address_check_out TEXT,
  is_overtime BOOLEAN DEFAULT FALSE,
  overtime_hours FLOAT DEFAULT 0,
  is_modified BOOLEAN DEFAULT FALSE,
  modified_by UUID REFERENCES users(id),
  modified_at TIMESTAMPTZ,
  modification_reason TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- Attendance Corrections Table
CREATE TABLE IF NOT EXISTS attendance_corrections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attendance_id UUID NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  original_check_in TIMESTAMPTZ,
  original_check_out TIMESTAMPTZ,
  corrected_check_in TIMESTAMPTZ,
  corrected_check_out TIMESTAMPTZ,
  reason TEXT NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  review_comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shifts Table
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  grace_period_minutes INTEGER NOT NULL DEFAULT 15,
  half_day_threshold_hours DECIMAL(3,1) NOT NULL DEFAULT 4.0,
  is_night_shift BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Shifts Junction Table
CREATE TABLE IF NOT EXISTS employee_shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Holidays Table
CREATE TABLE IF NOT EXISTS holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  is_restricted BOOLEAN NOT NULL DEFAULT FALSE,
  applies_to_departments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekend Policies Table
CREATE TABLE IF NOT EXISTS weekend_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  weekends JSONB NOT NULL, -- Array of day numbers (0 = Sunday, 6 = Saturday)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Weekend Policies Junction Table
CREATE TABLE IF NOT EXISTS employee_weekend_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  weekend_policy_id UUID NOT NULL REFERENCES weekend_policies(id) ON DELETE CASCADE,
  from_date DATE NOT NULL,
  to_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-------------------------------------------------------------------------------
-- Leave Management Schema
-------------------------------------------------------------------------------

-- Leave Types Table
CREATE TABLE IF NOT EXISTS leave_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  description TEXT NOT NULL,
  color_code VARCHAR NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT TRUE,
  is_encashable BOOLEAN NOT NULL DEFAULT FALSE,
  requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
  max_consecutive_days INTEGER,
  min_days_before_application INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Policies Table
CREATE TABLE IF NOT EXISTS leave_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_current BOOLEAN NOT NULL DEFAULT FALSE,
  probation_applicable BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Policy Details Table
CREATE TABLE IF NOT EXISTS leave_policy_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leave_policy_id UUID NOT NULL REFERENCES leave_policies(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  annual_quota DECIMAL(5,1) NOT NULL,
  accrual_type VARCHAR NOT NULL DEFAULT 'yearly' CHECK (accrual_type IN ('yearly', 'monthly', 'quarterly')),
  carry_forward_limit DECIMAL(5,1) NOT NULL DEFAULT 0,
  encashment_limit DECIMAL(5,1) NOT NULL DEFAULT 0,
  applicable_from_months INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Leave Balances Table
CREATE TABLE IF NOT EXISTS employee_leave_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  opening_balance DECIMAL(5,1) NOT NULL DEFAULT 0,
  accrued DECIMAL(5,1) NOT NULL DEFAULT 0,
  used DECIMAL(5,1) NOT NULL DEFAULT 0,
  adjusted DECIMAL(5,1) NOT NULL DEFAULT 0,
  encashed DECIMAL(5,1) NOT NULL DEFAULT 0,
  carried_forward DECIMAL(5,1) NOT NULL DEFAULT 0,
  closing_balance DECIMAL(5,1) NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, leave_type_id, year)
);

-- Leave Applications Table
CREATE TABLE IF NOT EXISTS leave_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  duration_days DECIMAL(5,1) NOT NULL,
  first_day_half BOOLEAN NOT NULL DEFAULT FALSE,
  last_day_half BOOLEAN NOT NULL DEFAULT FALSE,
  reason TEXT NOT NULL,
  contact_during_leave VARCHAR NOT NULL,
  handover_to UUID REFERENCES employees(id),
  handover_notes TEXT,
  status VARCHAR NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'cancelled')),
  applied_at TIMESTAMPTZ NOT NULL,
  actioned_by UUID REFERENCES users(id),
  actioned_at TIMESTAMPTZ,
  rejection_reason TEXT,
  attachment_url VARCHAR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Approval Workflow Table
CREATE TABLE IF NOT EXISTS leave_approval_workflow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leave_application_id UUID NOT NULL REFERENCES leave_applications(id) ON DELETE CASCADE,
  approver_level INTEGER NOT NULL,
  approver_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  actioned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_leave_applications_employee_id ON leave_applications(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications(status);
CREATE INDEX IF NOT EXISTS idx_employee_leave_balances_employee_id ON employee_leave_balances(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_departments_employee_id ON employee_departments(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_designations_employee_id ON employee_designations(employee_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_employment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekend_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_weekend_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_policy_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_approval_workflow ENABLE ROW LEVEL SECURITY;

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('SuperAdmin', 'Has full access to all system functions'),
('HR', 'Human Resources staff with employee management permissions'),
('Manager', 'Department manager with team management permissions'),
('Employee', 'Regular employee with self-service permissions');

-- Insert default permissions
INSERT INTO permissions (code, name, description, module) VALUES
-- Employee Module Permissions
('employees.view.all', 'View All Employees', 'Can view all employee records', 'employees'),
('employees.view.own', 'View Own Profile', 'Can view own employee profile', 'employees'),
('employees.view.team', 'View Team Profiles', 'Can view profiles of team members', 'employees'),
('employees.create', 'Create Employee', 'Can create new employee records', 'employees'),
('employees.update.all', 'Update All Employees', 'Can update any employee record', 'employees'),
('employees.update.own', 'Update Own Profile', 'Can update own profile details', 'employees'),
('employees.delete', 'Delete Employee', 'Can delete employee records', 'employees'),

-- Attendance Module Permissions
('attendance.view.all', 'View All Attendance', 'Can view attendance records of all employees', 'attendance'),
('attendance.view.own', 'View Own Attendance', 'Can view own attendance records', 'attendance'),
('attendance.view.team', 'View Team Attendance', 'Can view attendance records of team members', 'attendance'),
('attendance.create', 'Record Attendance', 'Can record attendance for employees', 'attendance'),
('attendance.create.own', 'Record Own Attendance', 'Can record own attendance', 'attendance'),
('attendance.update.all', 'Update Any Attendance', 'Can update any attendance record', 'attendance'),
('attendance.update.own', 'Request Attendance Correction', 'Can request correction for own attendance', 'attendance'),
('attendance.approve', 'Approve Attendance Corrections', 'Can approve attendance correction requests', 'attendance'),

-- Leave Module Permissions
('leave.view.all', 'View All Leave', 'Can view leave records of all employees', 'leave'),
('leave.view.own', 'View Own Leave', 'Can view own leave records', 'leave'),
('leave.view.team', 'View Team Leave', 'Can view leave records of team members', 'leave'),
('leave.apply', 'Apply Leave', 'Can apply for leave', 'leave'),
('leave.approve', 'Approve Leave', 'Can approve leave applications', 'leave'),
('leave.configure', 'Configure Leave Types', 'Can configure leave types and policies', 'leave'),

-- Configuration Permissions
('config.departments', 'Manage Departments', 'Can manage departments', 'configuration'),
('config.designations', 'Manage Designations', 'Can manage designations', 'configuration'),
('config.shifts', 'Manage Shifts', 'Can manage shift configurations', 'configuration'),
('config.holidays', 'Manage Holidays', 'Can manage holidays', 'configuration'),
('config.weekend', 'Manage Weekend Policies', 'Can manage weekend policies', 'configuration'),

-- User Management Permissions
('users.view.all', 'View All Users', 'Can view all system users', 'users'),
('users.create', 'Create User', 'Can create new system users', 'users'),
('users.update', 'Update User', 'Can update user details', 'users'),
('users.delete', 'Delete User', 'Can delete users', 'users'),
('roles.manage', 'Manage Roles', 'Can manage roles and permissions', 'users');

-- Assign permissions to roles
-- SuperAdmin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'SuperAdmin'),
  id
FROM permissions;

-- HR Role Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'HR'),
  id
FROM permissions
WHERE code IN (
  'employees.view.all', 'employees.create', 'employees.update.all',
  'attendance.view.all', 'attendance.create', 'attendance.update.all', 'attendance.approve',
  'leave.view.all', 'leave.approve', 'leave.configure',
  'config.departments', 'config.designations', 'config.shifts', 'config.holidays', 'config.weekend',
  'users.view.all', 'users.create'
);

-- Manager Role Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'Manager'),
  id
FROM permissions
WHERE code IN (
  'employees.view.team', 'employees.view.own',
  'attendance.view.team', 'attendance.view.own', 'attendance.create.own', 'attendance.update.own', 'attendance.approve',
  'leave.view.team', 'leave.view.own', 'leave.apply', 'leave.approve'
);

-- Employee Role Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'Employee'),
  id
FROM permissions
WHERE code IN (
  'employees.view.own', 
  'employees.update.own',
  'attendance.view.own',
  'attendance.create.own',
  'attendance.update.own',
  'leave.view.own',
  'leave.apply'
);

-- Create policies for employees
CREATE POLICY "Employees can view own profile"
  ON employees
  FOR SELECT
  USING (id IN (
    SELECT employee_id FROM users WHERE id = auth.uid() AND employee_id IS NOT NULL
  ));

CREATE POLICY "HR can view all employees"
  ON employees
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND p.code = 'employees.view.all'
    )
  );

-- Policy for attendance records
CREATE POLICY "Users can view own attendance"
  ON attendance_records
  FOR SELECT
  USING (employee_id IN (
    SELECT employee_id FROM users WHERE id = auth.uid() AND employee_id IS NOT NULL
  ));

CREATE POLICY "HR can view all attendance"
  ON attendance_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND p.code = 'attendance.view.all'
    )
  );

-- Policy for leave applications
CREATE POLICY "Users can view own leave applications"
  ON leave_applications
  FOR SELECT
  USING (employee_id IN (
    SELECT employee_id FROM users WHERE id = auth.uid() AND employee_id IS NOT NULL
  ));

CREATE POLICY "HR can view all leave applications"
  ON leave_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = auth.uid()
      AND p.code = 'leave.view.all'
    )
  );
  `;

  return schema;
};

console.log(generateSchema()); 
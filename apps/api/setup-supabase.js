const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function setupSupabase() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.');
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Use SQL queries directly since the tables structure might be giving issues
    console.log('Setting up database...');

    // Execute the schema SQL to ensure all tables exist
    const { data: schemaResult, error: schemaError } = await supabase.rpc('pg_execute', {
      sql: `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create profiles table (for authentication)
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create departments table
      CREATE TABLE IF NOT EXISTS departments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create designations table
      CREATE TABLE IF NOT EXISTS designations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create employees table
      CREATE TABLE IF NOT EXISTS employees (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        employee_code VARCHAR(50) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        date_of_birth DATE,
        date_of_joining DATE,
        department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
        designation_id UUID REFERENCES designations(id) ON DELETE SET NULL,
        reports_to UUID REFERENCES employees(id) ON DELETE SET NULL,
        basic_salary DECIMAL(12, 2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create leave_types table
      CREATE TABLE IF NOT EXISTS leave_types (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        is_paid BOOLEAN DEFAULT TRUE,
        color VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`
    });

    if (schemaError) {
      console.error('Error creating schema:', schemaError);
    } else {
      console.log('Schema created successfully');
    }

    // Insert admin profile
    console.log('Inserting admin profile...');
    const { data: adminProfile, error: adminProfileError } = await supabase
      .from('profiles')
      .upsert({
        id: '00000000-0000-0000-0000-000000000000',
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User'
      })
      .select();

    if (adminProfileError) {
      console.error('Error creating admin profile:', adminProfileError);
    } else {
      console.log('Admin profile created/updated successfully');
    }

    // Insert departments
    console.log('Inserting departments...');
    const { data: depts, error: deptsError } = await supabase
      .from('departments')
      .upsert([
        {
          name: 'Human Resources',
          description: 'Responsible for recruiting, onboarding, and employee relations'
        },
        {
          name: 'Engineering',
          description: 'Software development and technical operations'
        },
        {
          name: 'Finance',
          description: 'Financial planning, accounting, and payroll management'
        }
      ])
      .select();

    if (deptsError) {
      console.error('Error creating departments:', deptsError);
    } else {
      console.log('Departments created/updated successfully');
    }

    // Insert designations
    console.log('Inserting designations...');
    const { data: desigs, error: desigsError } = await supabase
      .from('designations')
      .upsert([
        {
          name: 'Software Engineer',
          description: 'Develops and maintains software applications'
        },
        {
          name: 'HR Manager',
          description: 'Manages HR operations and staff'
        },
        {
          name: 'Finance Analyst',
          description: 'Analyzes financial data and prepares reports'
        }
      ])
      .select();

    if (desigsError) {
      console.error('Error creating designations:', desigsError);
    } else {
      console.log('Designations created/updated successfully');
    }

    // Get department and designation IDs for employee creation
    const { data: deptData } = await supabase
      .from('departments')
      .select('id, name')
      .eq('name', 'Engineering')
      .single();

    const { data: desigData } = await supabase
      .from('designations')
      .select('id, name')
      .eq('name', 'Software Engineer')
      .single();

    const engineeringDeptId = deptData?.id;
    const softwareEngineerDesigId = desigData?.id;

    // Insert leave types
    console.log('Inserting leave types...');
    const { data: leaveTypes, error: leaveTypesError } = await supabase
      .from('leave_types')
      .upsert([
        {
          name: 'Annual Leave',
          description: 'Regular annual leave',
          is_paid: true,
          color: '#4CAF50'
        },
        {
          name: 'Sick Leave',
          description: 'Leave due to illness',
          is_paid: true,
          color: '#F44336'
        },
        {
          name: 'Unpaid Leave',
          description: 'Leave without pay',
          is_paid: false,
          color: '#9E9E9E'
        }
      ])
      .select();

    if (leaveTypesError) {
      console.error('Error creating leave types:', leaveTypesError);
    } else {
      console.log('Leave types created/updated successfully');
    }

    // Insert employees (only if we got department and designation IDs)
    if (engineeringDeptId && softwareEngineerDesigId) {
      console.log('Inserting employees...');
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .upsert([
          {
            id: '11111111-1111-1111-1111-111111111111',
            employee_code: 'EMP001',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '+91 9876543210',
            date_of_birth: '1990-01-01',
            date_of_joining: '2022-01-01',
            department_id: engineeringDeptId,
            designation_id: softwareEngineerDesigId,
            basic_salary: 50000,
            status: 'active'
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            employee_code: 'EMP002',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+91 9876543211',
            date_of_birth: '1992-05-15',
            date_of_joining: '2022-02-01',
            department_id: engineeringDeptId,
            designation_id: softwareEngineerDesigId,
            basic_salary: 55000,
            status: 'active'
          }
        ])
        .select();

      if (employeesError) {
        console.error('Error creating employees:', employeesError);
      } else {
        console.log('Employees created/updated successfully');
      }
    } else {
      console.log('Skipping employee creation due to missing department or designation IDs');
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('An error occurred during database setup:', error);
    process.exit(1);
  }
}

setupSupabase(); 
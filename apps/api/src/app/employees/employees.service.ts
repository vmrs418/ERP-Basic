import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilterDto, IEmployee, IEmployeeResponse, IEmployeeListResponse } from '@erp-system/shared-models';
import { generateEmployeeCode } from '@erp-system/shared-utils';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private supabaseService: SupabaseService
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto, currentUserId: string): Promise<IEmployeeResponse> {
    try {
      // Check if employee with same email, employee_code, aadhaar_number, or pan_number already exists
      const { data: existingEmployee, error: checkError } = await this.supabaseService.client
        .from('employees')
        .select('id, email, employee_code, aadhaar_number, pan_number')
        .or(`email.eq.${createEmployeeDto.email},employee_code.eq.${createEmployeeDto.employee_code},aadhaar_number.eq.${createEmployeeDto.aadhaar_number},pan_number.eq.${createEmployeeDto.pan_number}`)
        .maybeSingle();

      if (checkError) {
        throw new InternalServerErrorException('Error checking for existing employee');
      }

      if (existingEmployee) {
        if (existingEmployee.email === createEmployeeDto.email) {
          throw new ConflictException('Employee with this email already exists');
        }
        if (existingEmployee.employee_code === createEmployeeDto.employee_code) {
          throw new ConflictException('Employee with this employee code already exists');
        }
        if (existingEmployee.aadhaar_number === createEmployeeDto.aadhaar_number) {
          throw new ConflictException('Employee with this Aadhaar number already exists');
        }
        if (existingEmployee.pan_number === createEmployeeDto.pan_number) {
          throw new ConflictException('Employee with this PAN number already exists');
        }
      }

      // Create employee record
      const { data: employee, error } = await this.supabaseService.client
        .from('employees')
        .insert({
          ...createEmployeeDto,
          created_by: currentUserId,
          updated_by: currentUserId
        })
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException('Error creating employee');
      }

      return {
        employee,
        departments: [],
        designations: []
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating employee');
    }
  }

  async findAll(filterDto: EmployeeFilterDto): Promise<IEmployeeListResponse> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        department_id, 
        designation_id, 
        status,
        sort_by = 'employee_code',
        sort_order = 'asc'
      } = filterDto;

      // Calculate pagination parameters
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Start building the query
      let query = this.supabaseService.client
        .from('employees')
        .select('*', { count: 'exact' });

      // Add search filter if provided
      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,employee_code.ilike.%${search}%`
        );
      }

      // Add status filter if provided
      if (status) {
        query = query.eq('status', status);
      }

      // Add department filter if provided
      if (department_id) {
        // This will need to join with employee_departments table
        const { data: employeeIds } = await this.supabaseService.client
          .from('employee_departments')
          .select('employee_id')
          .eq('department_id', department_id)
          .eq('is_primary', true);

        if (employeeIds && employeeIds.length > 0) {
          const ids = employeeIds.map(item => item.employee_id);
          query = query.in('id', ids);
        } else {
          // No employees in this department, return empty result
          return {
            items: [],
            total: 0,
            page,
            limit,
            total_pages: 0
          };
        }
      }

      // Add designation filter if provided
      if (designation_id) {
        // This will need to join with employee_designations table
        const { data: employeeIds } = await this.supabaseService.client
          .from('employee_designations')
          .select('employee_id')
          .eq('designation_id', designation_id)
          .eq('is_current', true);

        if (employeeIds && employeeIds.length > 0) {
          const ids = employeeIds.map(item => item.employee_id);
          query = query.in('id', ids);
        } else {
          // No employees with this designation, return empty result
          return {
            items: [],
            total: 0,
            page,
            limit,
            total_pages: 0
          };
        }
      }

      // Add sorting
      query = query.order(sort_by, { ascending: sort_order === 'asc' });

      // Add pagination
      query = query.range(from, to);

      // Execute the query
      const { data: employees, error, count } = await query;

      if (error) {
        throw new InternalServerErrorException('Error fetching employees');
      }

      // Fetch related data for each employee
      const items = await Promise.all(
        employees.map(async (employee) => {
          // Fetch departments
          const { data: departments } = await this.supabaseService.client
            .from('employee_departments')
            .select(`
              *,
              department:departments(*)
            `)
            .eq('employee_id', employee.id);

          // Fetch designations
          const { data: designations } = await this.supabaseService.client
            .from('employee_designations')
            .select(`
              *,
              designation:designations(*)
            `)
            .eq('employee_id', employee.id);

          // Find current department
          const currentDepartment = departments?.find(d => d.is_primary)?.department;

          // Find current designation
          const currentDesignation = designations?.find(d => d.is_current)?.designation;

          return {
            employee,
            departments: departments || [],
            designations: designations || [],
            current_department: currentDepartment,
            current_designation: currentDesignation
          };
        })
      );

      // Calculate total pages
      const total = count || 0;
      const total_pages = Math.ceil(total / limit);

      return {
        items,
        total,
        page,
        limit,
        total_pages
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching employees');
    }
  }

  async findOne(id: string): Promise<IEmployeeResponse> {
    try {
      // Fetch employee record
      const { data: employee, error } = await this.supabaseService.client
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      // Fetch departments
      const { data: departments } = await this.supabaseService.client
        .from('employee_departments')
        .select(`
          *,
          department:departments(*)
        `)
        .eq('employee_id', id);

      // Fetch designations
      const { data: designations } = await this.supabaseService.client
        .from('employee_designations')
        .select(`
          *,
          designation:designations(*)
        `)
        .eq('employee_id', id);

      // Find current department
      const currentDepartment = departments?.find(d => d.is_primary)?.department;

      // Find current designation
      const currentDesignation = designations?.find(d => d.is_current)?.designation;

      return {
        employee,
        departments: departments || [],
        designations: designations || [],
        current_department: currentDepartment,
        current_designation: currentDesignation
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching employee');
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto, currentUserId: string): Promise<IEmployeeResponse> {
    try {
      // Check if employee exists
      const { data: existingEmployee, error: checkError } = await this.supabaseService.client
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existingEmployee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      // Check if email, employee_code, aadhaar_number, or pan_number is being updated
      // and if so, check if they are unique
      if (
        (updateEmployeeDto.email && updateEmployeeDto.email !== existingEmployee.email) ||
        (updateEmployeeDto.employee_code && updateEmployeeDto.employee_code !== existingEmployee.employee_code) ||
        (updateEmployeeDto.aadhaar_number && updateEmployeeDto.aadhaar_number !== existingEmployee.aadhaar_number) ||
        (updateEmployeeDto.pan_number && updateEmployeeDto.pan_number !== existingEmployee.pan_number)
      ) {
        let orCondition = '';
        if (updateEmployeeDto.email && updateEmployeeDto.email !== existingEmployee.email) {
          orCondition += `email.eq.${updateEmployeeDto.email}`;
        }
        if (updateEmployeeDto.employee_code && updateEmployeeDto.employee_code !== existingEmployee.employee_code) {
          orCondition += orCondition ? `,employee_code.eq.${updateEmployeeDto.employee_code}` : `employee_code.eq.${updateEmployeeDto.employee_code}`;
        }
        if (updateEmployeeDto.aadhaar_number && updateEmployeeDto.aadhaar_number !== existingEmployee.aadhaar_number) {
          orCondition += orCondition ? `,aadhaar_number.eq.${updateEmployeeDto.aadhaar_number}` : `aadhaar_number.eq.${updateEmployeeDto.aadhaar_number}`;
        }
        if (updateEmployeeDto.pan_number && updateEmployeeDto.pan_number !== existingEmployee.pan_number) {
          orCondition += orCondition ? `,pan_number.eq.${updateEmployeeDto.pan_number}` : `pan_number.eq.${updateEmployeeDto.pan_number}`;
        }

        if (orCondition) {
          const { data: duplicateCheck, error: duplicateError } = await this.supabaseService.client
            .from('employees')
            .select('id, email, employee_code, aadhaar_number, pan_number')
            .or(orCondition)
            .neq('id', id)
            .maybeSingle();

          if (duplicateError) {
            throw new InternalServerErrorException('Error checking for duplicate values');
          }

          if (duplicateCheck) {
            if (updateEmployeeDto.email && duplicateCheck.email === updateEmployeeDto.email) {
              throw new ConflictException('Another employee with this email already exists');
            }
            if (updateEmployeeDto.employee_code && duplicateCheck.employee_code === updateEmployeeDto.employee_code) {
              throw new ConflictException('Another employee with this employee code already exists');
            }
            if (updateEmployeeDto.aadhaar_number && duplicateCheck.aadhaar_number === updateEmployeeDto.aadhaar_number) {
              throw new ConflictException('Another employee with this Aadhaar number already exists');
            }
            if (updateEmployeeDto.pan_number && duplicateCheck.pan_number === updateEmployeeDto.pan_number) {
              throw new ConflictException('Another employee with this PAN number already exists');
            }
          }
        }
      }

      // Update employee record
      const { data: updatedEmployee, error } = await this.supabaseService.client
        .from('employees')
        .update({
          ...updateEmployeeDto,
          updated_by: currentUserId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new InternalServerErrorException('Error updating employee');
      }

      // Fetch updated data
      return this.findOne(id);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating employee');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Check if employee exists
      const { data: existingEmployee, error: checkError } = await this.supabaseService.client
        .from('employees')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError || !existingEmployee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      // Check if employee has related records in other tables
      // For example, check if employee has active leave applications or attendance records
      // This could be expanded to include more checks as needed
      const { count: leaveCount } = await this.supabaseService.client
        .from('leave_applications')
        .select('id', { count: 'exact', head: true })
        .eq('employee_id', id);

      if (leaveCount && leaveCount > 0) {
        throw new ConflictException('Cannot delete employee with existing leave applications');
      }

      const { count: attendanceCount } = await this.supabaseService.client
        .from('attendance_records')
        .select('id', { count: 'exact', head: true })
        .eq('employee_id', id);

      if (attendanceCount && attendanceCount > 0) {
        throw new ConflictException('Cannot delete employee with existing attendance records');
      }

      // Delete related records first (in order of dependencies)
      // Delete employee departments
      await this.supabaseService.client
        .from('employee_departments')
        .delete()
        .eq('employee_id', id);

      // Delete employee designations
      await this.supabaseService.client
        .from('employee_designations')
        .delete()
        .eq('employee_id', id);

      // Delete employee documents
      await this.supabaseService.client
        .from('documents')
        .delete()
        .eq('employee_id', id);

      // Delete employee bank details
      await this.supabaseService.client
        .from('bank_details')
        .delete()
        .eq('employee_id', id);

      // Delete employee salary details
      await this.supabaseService.client
        .from('salary_details')
        .delete()
        .eq('employee_id', id);

      // Finally, delete the employee record
      const { error } = await this.supabaseService.client
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        throw new InternalServerErrorException('Error deleting employee');
      }
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting employee');
    }
  }

  async addDepartment(
    employeeId: string, 
    departmentData: { 
      department_id: string; 
      is_primary: boolean; 
      from_date: Date 
    },
    currentUserId: string
  ): Promise<void> {
    try {
      // Check if employee exists
      const { data: existingEmployee, error: checkError } = await this.supabaseService.client
        .from('employees')
        .select('id')
        .eq('id', employeeId)
        .single();

      if (checkError || !existingEmployee) {
        throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      }

      // Check if department exists
      const { data: existingDepartment, error: deptCheckError } = await this.supabaseService.client
        .from('departments')
        .select('id')
        .eq('id', departmentData.department_id)
        .single();

      if (deptCheckError || !existingDepartment) {
        throw new NotFoundException(`Department with ID ${departmentData.department_id} not found`);
      }

      // If this is the primary department, update all other departments to non-primary
      if (departmentData.is_primary) {
        await this.supabaseService.client
          .from('employee_departments')
          .update({ is_primary: false })
          .eq('employee_id', employeeId)
          .eq('is_primary', true);
      }

      // Add department to employee
      const { error } = await this.supabaseService.client
        .from('employee_departments')
        .insert({
          employee_id: employeeId,
          department_id: departmentData.department_id,
          is_primary: departmentData.is_primary,
          from_date: departmentData.from_date
        });

      if (error) {
        throw new InternalServerErrorException('Error adding department to employee');
      }

      // Update employee's updated_by and updated_at
      await this.supabaseService.client
        .from('employees')
        .update({
          updated_by: currentUserId,
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error adding department to employee');
    }
  }

  async addDesignation(
    employeeId: string, 
    designationData: { 
      designation_id: string; 
      from_date: Date; 
      is_current: boolean;
    },
    currentUserId: string
  ): Promise<void> {
    try {
      // Check if employee exists
      const { data: existingEmployee, error: checkError } = await this.supabaseService.client
        .from('employees')
        .select('id')
        .eq('id', employeeId)
        .single();

      if (checkError || !existingEmployee) {
        throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      }

      // Check if designation exists
      const { data: existingDesignation, error: desigCheckError } = await this.supabaseService.client
        .from('designations')
        .select('id')
        .eq('id', designationData.designation_id)
        .single();

      if (desigCheckError || !existingDesignation) {
        throw new NotFoundException(`Designation with ID ${designationData.designation_id} not found`);
      }

      // If this is the current designation, update all other designations to not current
      if (designationData.is_current) {
        await this.supabaseService.client
          .from('employee_designations')
          .update({ is_current: false })
          .eq('employee_id', employeeId)
          .eq('is_current', true);
      }

      // Add designation to employee
      const { error } = await this.supabaseService.client
        .from('employee_designations')
        .insert({
          employee_id: employeeId,
          designation_id: designationData.designation_id,
          from_date: designationData.from_date,
          is_current: designationData.is_current
        });

      if (error) {
        throw new InternalServerErrorException('Error adding designation to employee');
      }

      // Update employee's updated_by and updated_at
      await this.supabaseService.client
        .from('employees')
        .update({
          updated_by: currentUserId,
          updated_at: new Date().toISOString()
        })
        .eq('id', employeeId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error adding designation to employee');
    }
  }
} 
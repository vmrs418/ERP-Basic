"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const supabase_service_1 = require("../supabase/supabase.service");
let EmployeesService = class EmployeesService {
    constructor(employeeRepository, supabaseService) {
        this.employeeRepository = employeeRepository;
        this.supabaseService = supabaseService;
    }
    async create(createEmployeeDto, currentUserId) {
        try {
            const { data: existingEmployee, error: checkError } = await this.supabaseService.client
                .from('employees')
                .select('id, email, employee_code, aadhaar_number, pan_number')
                .or(`email.eq.${createEmployeeDto.email},employee_code.eq.${createEmployeeDto.employee_code},aadhaar_number.eq.${createEmployeeDto.aadhaar_number},pan_number.eq.${createEmployeeDto.pan_number}`)
                .maybeSingle();
            if (checkError) {
                throw new common_1.InternalServerErrorException('Error checking for existing employee');
            }
            if (existingEmployee) {
                if (existingEmployee.email === createEmployeeDto.email) {
                    throw new common_1.ConflictException('Employee with this email already exists');
                }
                if (existingEmployee.employee_code === createEmployeeDto.employee_code) {
                    throw new common_1.ConflictException('Employee with this employee code already exists');
                }
                if (existingEmployee.aadhaar_number === createEmployeeDto.aadhaar_number) {
                    throw new common_1.ConflictException('Employee with this Aadhaar number already exists');
                }
                if (existingEmployee.pan_number === createEmployeeDto.pan_number) {
                    throw new common_1.ConflictException('Employee with this PAN number already exists');
                }
            }
            const { data: employee, error } = await this.supabaseService.client
                .from('employees')
                .insert(Object.assign(Object.assign({}, createEmployeeDto), { created_by: currentUserId, updated_by: currentUserId }))
                .select()
                .single();
            if (error) {
                throw new common_1.InternalServerErrorException('Error creating employee');
            }
            return {
                employee,
                departments: [],
                designations: []
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error creating employee');
        }
    }
    async findAll(filterDto) {
        try {
            const { page = 1, limit = 10, search, department_id, designation_id, status, sort_by = 'employee_code', sort_order = 'asc' } = filterDto;
            const from = (page - 1) * limit;
            const to = from + limit - 1;
            let query = this.supabaseService.client
                .from('employees')
                .select('*', { count: 'exact' });
            if (search) {
                query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,employee_code.ilike.%${search}%`);
            }
            if (status) {
                query = query.eq('status', status);
            }
            if (department_id) {
                const { data: employeeIds } = await this.supabaseService.client
                    .from('employee_departments')
                    .select('employee_id')
                    .eq('department_id', department_id)
                    .eq('is_primary', true);
                if (employeeIds && employeeIds.length > 0) {
                    const ids = employeeIds.map(item => item.employee_id);
                    query = query.in('id', ids);
                }
                else {
                    return {
                        items: [],
                        total: 0,
                        page,
                        limit,
                        total_pages: 0
                    };
                }
            }
            if (designation_id) {
                const { data: employeeIds } = await this.supabaseService.client
                    .from('employee_designations')
                    .select('employee_id')
                    .eq('designation_id', designation_id)
                    .eq('is_current', true);
                if (employeeIds && employeeIds.length > 0) {
                    const ids = employeeIds.map(item => item.employee_id);
                    query = query.in('id', ids);
                }
                else {
                    return {
                        items: [],
                        total: 0,
                        page,
                        limit,
                        total_pages: 0
                    };
                }
            }
            query = query.order(sort_by, { ascending: sort_order === 'asc' });
            query = query.range(from, to);
            const { data: employees, error, count } = await query;
            if (error) {
                throw new common_1.InternalServerErrorException('Error fetching employees');
            }
            const items = await Promise.all(employees.map(async (employee) => {
                var _a, _b;
                const { data: departments } = await this.supabaseService.client
                    .from('employee_departments')
                    .select(`
              *,
              department:departments(*)
            `)
                    .eq('employee_id', employee.id);
                const { data: designations } = await this.supabaseService.client
                    .from('employee_designations')
                    .select(`
              *,
              designation:designations(*)
            `)
                    .eq('employee_id', employee.id);
                const currentDepartment = (_a = departments === null || departments === void 0 ? void 0 : departments.find(d => d.is_primary)) === null || _a === void 0 ? void 0 : _a.department;
                const currentDesignation = (_b = designations === null || designations === void 0 ? void 0 : designations.find(d => d.is_current)) === null || _b === void 0 ? void 0 : _b.designation;
                return {
                    employee,
                    departments: departments || [],
                    designations: designations || [],
                    current_department: currentDepartment,
                    current_designation: currentDesignation
                };
            }));
            const total = count || 0;
            const total_pages = Math.ceil(total / limit);
            return {
                items,
                total,
                page,
                limit,
                total_pages
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error fetching employees');
        }
    }
    async findOne(id) {
        var _a, _b;
        try {
            const { data: employee, error } = await this.supabaseService.client
                .from('employees')
                .select('*')
                .eq('id', id)
                .single();
            if (error || !employee) {
                throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
            }
            const { data: departments } = await this.supabaseService.client
                .from('employee_departments')
                .select(`
          *,
          department:departments(*)
        `)
                .eq('employee_id', id);
            const { data: designations } = await this.supabaseService.client
                .from('employee_designations')
                .select(`
          *,
          designation:designations(*)
        `)
                .eq('employee_id', id);
            const currentDepartment = (_a = departments === null || departments === void 0 ? void 0 : departments.find(d => d.is_primary)) === null || _a === void 0 ? void 0 : _a.department;
            const currentDesignation = (_b = designations === null || designations === void 0 ? void 0 : designations.find(d => d.is_current)) === null || _b === void 0 ? void 0 : _b.designation;
            return {
                employee,
                departments: departments || [],
                designations: designations || [],
                current_department: currentDepartment,
                current_designation: currentDesignation
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error fetching employee');
        }
    }
    async update(id, updateEmployeeDto, currentUserId) {
        try {
            const { data: existingEmployee, error: checkError } = await this.supabaseService.client
                .from('employees')
                .select('*')
                .eq('id', id)
                .single();
            if (checkError || !existingEmployee) {
                throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
            }
            if ((updateEmployeeDto.email && updateEmployeeDto.email !== existingEmployee.email) ||
                (updateEmployeeDto.employee_code && updateEmployeeDto.employee_code !== existingEmployee.employee_code) ||
                (updateEmployeeDto.aadhaar_number && updateEmployeeDto.aadhaar_number !== existingEmployee.aadhaar_number) ||
                (updateEmployeeDto.pan_number && updateEmployeeDto.pan_number !== existingEmployee.pan_number)) {
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
                        throw new common_1.InternalServerErrorException('Error checking for duplicate values');
                    }
                    if (duplicateCheck) {
                        if (updateEmployeeDto.email && duplicateCheck.email === updateEmployeeDto.email) {
                            throw new common_1.ConflictException('Another employee with this email already exists');
                        }
                        if (updateEmployeeDto.employee_code && duplicateCheck.employee_code === updateEmployeeDto.employee_code) {
                            throw new common_1.ConflictException('Another employee with this employee code already exists');
                        }
                        if (updateEmployeeDto.aadhaar_number && duplicateCheck.aadhaar_number === updateEmployeeDto.aadhaar_number) {
                            throw new common_1.ConflictException('Another employee with this Aadhaar number already exists');
                        }
                        if (updateEmployeeDto.pan_number && duplicateCheck.pan_number === updateEmployeeDto.pan_number) {
                            throw new common_1.ConflictException('Another employee with this PAN number already exists');
                        }
                    }
                }
            }
            const { data: updatedEmployee, error } = await this.supabaseService.client
                .from('employees')
                .update(Object.assign(Object.assign({}, updateEmployeeDto), { updated_by: currentUserId, updated_at: new Date().toISOString() }))
                .eq('id', id)
                .select()
                .single();
            if (error) {
                throw new common_1.InternalServerErrorException('Error updating employee');
            }
            return this.findOne(id);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error updating employee');
        }
    }
    async remove(id) {
        try {
            const { data: existingEmployee, error: checkError } = await this.supabaseService.client
                .from('employees')
                .select('id')
                .eq('id', id)
                .single();
            if (checkError || !existingEmployee) {
                throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
            }
            const { count: leaveCount } = await this.supabaseService.client
                .from('leave_applications')
                .select('id', { count: 'exact', head: true })
                .eq('employee_id', id);
            if (leaveCount && leaveCount > 0) {
                throw new common_1.ConflictException('Cannot delete employee with existing leave applications');
            }
            const { count: attendanceCount } = await this.supabaseService.client
                .from('attendance_records')
                .select('id', { count: 'exact', head: true })
                .eq('employee_id', id);
            if (attendanceCount && attendanceCount > 0) {
                throw new common_1.ConflictException('Cannot delete employee with existing attendance records');
            }
            await this.supabaseService.client
                .from('employee_departments')
                .delete()
                .eq('employee_id', id);
            await this.supabaseService.client
                .from('employee_designations')
                .delete()
                .eq('employee_id', id);
            await this.supabaseService.client
                .from('documents')
                .delete()
                .eq('employee_id', id);
            await this.supabaseService.client
                .from('bank_details')
                .delete()
                .eq('employee_id', id);
            await this.supabaseService.client
                .from('salary_details')
                .delete()
                .eq('employee_id', id);
            const { error } = await this.supabaseService.client
                .from('employees')
                .delete()
                .eq('id', id);
            if (error) {
                throw new common_1.InternalServerErrorException('Error deleting employee');
            }
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error deleting employee');
        }
    }
    async addDepartment(employeeId, departmentData, currentUserId) {
        try {
            const { data: existingEmployee, error: checkError } = await this.supabaseService.client
                .from('employees')
                .select('id')
                .eq('id', employeeId)
                .single();
            if (checkError || !existingEmployee) {
                throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
            }
            const { data: existingDepartment, error: deptCheckError } = await this.supabaseService.client
                .from('departments')
                .select('id')
                .eq('id', departmentData.department_id)
                .single();
            if (deptCheckError || !existingDepartment) {
                throw new common_1.NotFoundException(`Department with ID ${departmentData.department_id} not found`);
            }
            if (departmentData.is_primary) {
                await this.supabaseService.client
                    .from('employee_departments')
                    .update({ is_primary: false })
                    .eq('employee_id', employeeId)
                    .eq('is_primary', true);
            }
            const { error } = await this.supabaseService.client
                .from('employee_departments')
                .insert({
                employee_id: employeeId,
                department_id: departmentData.department_id,
                is_primary: departmentData.is_primary,
                from_date: departmentData.from_date
            });
            if (error) {
                throw new common_1.InternalServerErrorException('Error adding department to employee');
            }
            await this.supabaseService.client
                .from('employees')
                .update({
                updated_by: currentUserId,
                updated_at: new Date().toISOString()
            })
                .eq('id', employeeId);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error adding department to employee');
        }
    }
    async addDesignation(employeeId, designationData, currentUserId) {
        try {
            const { data: existingEmployee, error: checkError } = await this.supabaseService.client
                .from('employees')
                .select('id')
                .eq('id', employeeId)
                .single();
            if (checkError || !existingEmployee) {
                throw new common_1.NotFoundException(`Employee with ID ${employeeId} not found`);
            }
            const { data: existingDesignation, error: desigCheckError } = await this.supabaseService.client
                .from('designations')
                .select('id')
                .eq('id', designationData.designation_id)
                .single();
            if (desigCheckError || !existingDesignation) {
                throw new common_1.NotFoundException(`Designation with ID ${designationData.designation_id} not found`);
            }
            if (designationData.is_current) {
                await this.supabaseService.client
                    .from('employee_designations')
                    .update({ is_current: false })
                    .eq('employee_id', employeeId)
                    .eq('is_current', true);
            }
            const { error } = await this.supabaseService.client
                .from('employee_designations')
                .insert({
                employee_id: employeeId,
                designation_id: designationData.designation_id,
                from_date: designationData.from_date,
                is_current: designationData.is_current
            });
            if (error) {
                throw new common_1.InternalServerErrorException('Error adding designation to employee');
            }
            await this.supabaseService.client
                .from('employees')
                .update({
                updated_by: currentUserId,
                updated_at: new Date().toISOString()
            })
                .eq('id', employeeId);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error adding designation to employee');
        }
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        supabase_service_1.SupabaseService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map
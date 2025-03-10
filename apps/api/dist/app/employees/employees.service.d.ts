import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilterDto, IEmployeeResponse, IEmployeeListResponse } from '@erp-system/shared-models';
import { SupabaseService } from '../supabase/supabase.service';
export declare class EmployeesService {
    private employeeRepository;
    private supabaseService;
    constructor(employeeRepository: Repository<Employee>, supabaseService: SupabaseService);
    create(createEmployeeDto: CreateEmployeeDto, currentUserId: string): Promise<IEmployeeResponse>;
    findAll(filterDto: EmployeeFilterDto): Promise<IEmployeeListResponse>;
    findOne(id: string): Promise<IEmployeeResponse>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto, currentUserId: string): Promise<IEmployeeResponse>;
    remove(id: string): Promise<void>;
    addDepartment(employeeId: string, departmentData: {
        department_id: string;
        is_primary: boolean;
        from_date: Date;
    }, currentUserId: string): Promise<void>;
    addDesignation(employeeId: string, designationData: {
        designation_id: string;
        from_date: Date;
        is_current: boolean;
    }, currentUserId: string): Promise<void>;
}

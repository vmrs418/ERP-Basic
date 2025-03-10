import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilterDto, IEmployeeResponse, IEmployeeListResponse } from '@erp-system/shared-models';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createEmployeeDto: CreateEmployeeDto, req: any): Promise<IEmployeeResponse>;
    findAll(filterDto: EmployeeFilterDto): Promise<IEmployeeListResponse>;
    findOne(id: string): Promise<IEmployeeResponse>;
    update(id: string, updateEmployeeDto: UpdateEmployeeDto, req: any): Promise<IEmployeeResponse>;
    remove(id: string): Promise<void>;
    addDepartment(id: string, departmentData: {
        department_id: string;
        is_primary: boolean;
        from_date: Date;
    }, req: any): Promise<void>;
    addDesignation(id: string, designationData: {
        designation_id: string;
        from_date: Date;
        is_current: boolean;
    }, req: any): Promise<void>;
}

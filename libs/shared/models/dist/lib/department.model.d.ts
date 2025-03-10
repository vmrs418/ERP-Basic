export interface Department {
    id: string;
    name: string;
    code: string;
    description?: string;
    parent_department_id?: string;
    head_employee_id?: string;
    created_at: Date;
    updated_at: Date;
    parent_department?: Department;
    head_employee?: any;
}
export type CreateDepartmentDto = Omit<Department, 'id' | 'created_at' | 'updated_at' | 'parent_department' | 'head_employee'>;
export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;

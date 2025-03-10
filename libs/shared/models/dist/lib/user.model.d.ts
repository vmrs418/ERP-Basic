export interface User {
    id: string;
    email: string;
    employee_id?: string;
    phone?: string;
    is_active: boolean;
    last_login?: Date;
    created_at: Date;
    updated_at: Date;
    employee?: any;
    roles?: UserRole[];
}
export interface Role {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    permissions?: RolePermission[];
}
export interface UserRole {
    id: string;
    user_id: string;
    role_id: string;
    created_at: Date;
    updated_at: Date;
    user?: User;
    role?: Role;
}
export interface Permission {
    id: string;
    code: string;
    name: string;
    description: string;
    module: string;
    created_at: Date;
    updated_at: Date;
}
export interface RolePermission {
    id: string;
    role_id: string;
    permission_id: string;
    created_at: Date;
    updated_at: Date;
    role?: Role;
    permission?: Permission;
}
export type CreateUserDto = Omit<User, 'id' | 'created_at' | 'updated_at' | 'last_login' | 'employee' | 'roles'>;
export type UpdateUserDto = Partial<CreateUserDto>;
export type CreateRoleDto = Omit<Role, 'id' | 'created_at' | 'updated_at' | 'permissions'>;
export type UpdateRoleDto = Partial<CreateRoleDto>;
export type CreateUserRoleDto = Omit<UserRole, 'id' | 'created_at' | 'updated_at' | 'user' | 'role'>;
export type UpdateUserRoleDto = Partial<CreateUserRoleDto>;
export type CreatePermissionDto = Omit<Permission, 'id' | 'created_at' | 'updated_at'>;
export type UpdatePermissionDto = Partial<CreatePermissionDto>;
export type CreateRolePermissionDto = Omit<RolePermission, 'id' | 'created_at' | 'updated_at' | 'role' | 'permission'>;
export type UpdateRolePermissionDto = Partial<CreateRolePermissionDto>;

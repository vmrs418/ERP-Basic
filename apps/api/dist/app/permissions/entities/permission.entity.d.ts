import { RolePermission } from '../../role-permissions/entities/role-permission.entity';
export declare class Permission {
    id: string;
    code: string;
    name: string;
    description: string;
    module: string;
    created_at: Date;
    updated_at: Date;
    roles: RolePermission[];
}

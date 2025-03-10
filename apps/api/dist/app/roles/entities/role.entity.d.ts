import { UserRole } from '../../user-roles/entities/user-role.entity';
import { RolePermission } from '../../role-permissions/entities/role-permission.entity';
export declare class Role {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    userRoles: UserRole[];
    permissions: RolePermission[];
}

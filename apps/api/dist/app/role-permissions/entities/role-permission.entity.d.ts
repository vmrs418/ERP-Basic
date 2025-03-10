import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
export declare class RolePermission {
    id: string;
    role_id: string;
    permission_id: string;
    created_at: Date;
    updated_at: Date;
    role: Role;
    permission: Permission;
}

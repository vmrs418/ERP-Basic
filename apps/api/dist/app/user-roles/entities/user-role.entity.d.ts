import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
export declare class UserRole {
    id: string;
    user_id: string;
    role_id: string;
    created_at: Date;
    updated_at: Date;
    user: User;
    role: Role;
}

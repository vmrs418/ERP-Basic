import { User as SupabaseUser } from '@supabase/supabase-js';

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface ExtendedUser extends SupabaseUser {
  roles?: Role[];
}

export type UserWithRoles = SupabaseUser & {
  roles?: Role[];
}; 
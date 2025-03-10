import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
export declare class AuthService {
    private jwtService;
    private supabaseService;
    constructor(jwtService: JwtService, supabaseService: SupabaseService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(userData: any): Promise<{
        success: boolean;
        message: string;
        user: import("@supabase/auth-js").User;
    }>;
    getProfile(userId: string): Promise<any>;
    signOut(token: string): Promise<{
        message: string;
    }>;
    resetPassword(email: string): Promise<{
        message: string;
    }>;
    updatePassword(password: string, userId: string): Promise<{
        message: string;
    }>;
}

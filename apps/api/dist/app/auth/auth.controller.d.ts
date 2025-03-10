import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: any;
    }>;
    register(registerDto: any): Promise<{
        success: boolean;
        message: string;
        user: import("@supabase/auth-js").User;
    }>;
    getProfile(req: any): Promise<any>;
    signOut(req: any): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(req: any, resetPasswordDto: {
        password: string;
    }): Promise<{
        message: string;
    }>;
}

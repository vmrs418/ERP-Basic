import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SupabaseService } from '../../supabase/supabase.service';
export declare class AuthGuard implements CanActivate {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    validateRequest(request: any): Promise<boolean>;
}

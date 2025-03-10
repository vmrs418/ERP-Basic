import { Strategy } from 'passport-jwt';
import { SupabaseService } from '../../supabase/supabase.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    validate(payload: any): Promise<any>;
}
export {};

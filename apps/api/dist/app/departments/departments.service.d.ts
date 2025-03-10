import { SupabaseService } from '../supabase/supabase.service';
export declare class DepartmentsService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(departmentData: any): Promise<any>;
    update(id: string, departmentData: any): Promise<any>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

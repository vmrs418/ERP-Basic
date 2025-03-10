import { Employee } from '../../employees/entities/employee.entity';
export declare class Document {
    id: string;
    employee_id: string;
    document_type: 'aadhar' | 'pan' | 'passport' | 'resume' | 'offer_letter' | 'joining_letter' | 'experience_certificate' | 'education_certificate' | 'other';
    document_url: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    verification_notes?: string;
    verified_by?: string;
    verified_at?: Date;
    created_at: Date;
    updated_at: Date;
    employee: Employee;
}

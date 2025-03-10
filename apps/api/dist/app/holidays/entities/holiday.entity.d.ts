export declare class Holiday {
    id: string;
    name: string;
    date: Date;
    description?: string;
    is_restricted: boolean;
    applies_to_departments?: string[];
    created_at: Date;
    updated_at: Date;
}

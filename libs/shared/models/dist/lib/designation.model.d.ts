export interface Designation {
    id: string;
    title: string;
    code: string;
    description?: string;
    level: number;
    created_at: Date;
    updated_at: Date;
}
export type CreateDesignationDto = Omit<Designation, 'id' | 'created_at' | 'updated_at'>;
export type UpdateDesignationDto = Partial<CreateDesignationDto>;

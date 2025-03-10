// Interface representing a designation
export interface Designation {
  id: string;
  title: string;
  code: string;
  description?: string;
  level: number;
  created_at: Date;
  updated_at: Date;
}

// Interface for creating a new designation
export type CreateDesignationDto = Omit<Designation, 'id' | 'created_at' | 'updated_at'>;

// Interface for updating a designation
export type UpdateDesignationDto = Partial<CreateDesignationDto>; 
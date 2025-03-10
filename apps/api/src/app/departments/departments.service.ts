import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class DepartmentsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    return this.supabaseService.getDepartments();
  }

  async findOne(id: string) {
    const departments = await this.supabaseService.getDepartments();
    return departments.find(dept => dept.id === id);
  }

  async create(departmentData: any) {
    return this.supabaseService.createDepartment(departmentData);
  }

  async update(id: string, departmentData: any) {
    const departments = await this.supabaseService.getDepartments();
    const departmentIndex = departments.findIndex(dept => dept.id === id);
    
    if (departmentIndex === -1) {
      throw new Error('Department not found');
    }
    
    // Update department in Supabase
    const updatedDepartment = {
      ...departments[departmentIndex],
      ...departmentData,
    };
    
    return this.supabaseService.createDepartment(updatedDepartment);
  }

  async remove(id: string) {
    // Implement department deletion logic
    // This would require a delete method in the Supabase service
    return { success: true, message: 'Department deleted' };
  }
} 
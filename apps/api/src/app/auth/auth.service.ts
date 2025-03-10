import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const auth = await this.supabaseService.signIn(email, password);
      if (auth && auth.user) {
        return auth.user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(userData: any) {
    try {
      const { email, password, ...rest } = userData;
      const auth = await this.supabaseService.signUp(email, password, rest);
      
      if (auth && auth.user) {
        // Create an employee record for the user
        const employeeData = {
          id: auth.user.id,
          first_name: rest.firstName || '',
          last_name: rest.lastName || '',
          email: auth.user.email,
          phone: rest.phone || '',
          employee_code: rest.employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
          department: rest.department || null,
          designation: rest.designation || null,
          status: 'active',
        };
        
        await this.supabaseService.createEmployee(employeeData);
        
        return {
          success: true,
          message: 'User registered successfully',
          user: auth.user,
        };
      }
    } catch (error) {
      throw new UnauthorizedException('Registration failed');
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await this.supabaseService.getEmployeeById(userId);
      return user;
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
  }

  async signOut(token: string) {
    try {
      const { error } = await this.supabaseService.client.auth.signOut();
      
      if (error) {
        throw new InternalServerErrorException(error.message);
      }

      return { message: 'Successfully signed out' };
    } catch (error) {
      throw new InternalServerErrorException('Sign out failed');
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.supabaseService.client.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw new UnauthorizedException(error.message);
      }

      return { message: 'Password reset email sent' };
    } catch (error) {
      throw new InternalServerErrorException('Password reset failed');
    }
  }

  async updatePassword(password: string, userId: string) {
    try {
      const { error } = await this.supabaseService.getAdminClient().auth.admin.updateUserById(
        userId,
        { password },
      );
      
      if (error) {
        throw new UnauthorizedException(error.message);
      }

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Password update failed');
    }
  }
} 
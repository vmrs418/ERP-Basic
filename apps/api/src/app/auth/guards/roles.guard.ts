import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No specific roles required
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    
    // For simplicity, we're just checking if the user object has the required role
    // In a real implementation, you would check the user's roles from a database
    // or from a JWT token claim
    const hasRole = () => requiredRoles.some(role => user.app_metadata?.roles?.includes(role));
    
    if (!hasRole()) {
      throw new ForbiddenException(`You don't have the required permissions (${requiredRoles.join(', ')})`);
    }
    
    return true;
  }
} 
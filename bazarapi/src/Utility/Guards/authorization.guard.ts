import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );

    // If no roles are required, allow access
    if (!allowedRoles || allowedRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.currentUser;

    // Check if user is attached by AuthenticationGuard
    if (!user) {
      throw new UnauthorizedException('User not authenticated.');
    }

    // Check if user has roles
    if (!user.roles || !Array.isArray(user.roles)) {
      throw new UnauthorizedException('User has no assigned roles.');
    }

    // Check if user has at least one allowed role
    const hasRole = user.roles.some((role: string) =>
      allowedRoles.includes(role),
    );

    if (!hasRole) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource.',
      );
    }

    return true;
  }
}

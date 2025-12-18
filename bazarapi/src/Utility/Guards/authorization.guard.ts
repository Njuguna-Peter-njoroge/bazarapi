import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { mixin } from '@nestjs/common';

export const AuthorizeGuard = (allowedroles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const result = request?.user?.roles
        .map((role: string) => allowedroles.includes(role))
        .find((val: boolean) => val === true);
      if (result) return true;
      throw new UnauthorizedException('sorry you are not authorized');
    }
  }
  const guard = mixin(RolesGuardMixin);
  return guard;
};

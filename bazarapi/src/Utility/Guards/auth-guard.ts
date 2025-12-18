import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header');
    }

    const token = authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
      if (!secret) {
        throw new Error(
          'ACCESS_TOKEN_SECRET_KEY is missing in environment variables',
        );
      }

      const payload = jwt.verify(token, secret);
      request.user = payload; // payload includes id, email, roles
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

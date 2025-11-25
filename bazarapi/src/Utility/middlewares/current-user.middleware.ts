// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { isArray } from 'node:util';
// import { UsersService } from '../../users/users.service';
// import { JwtPayload, verify } from 'jsonwebtoken';
// import { UserEntity } from '../../users/entities/user.entity';
//
// declare module 'express' {
//   interface Request {
//     currentUser?: UserEntity | null;
//   }
// }
//
// @Injectable()
// export class CurrentUserMiddleware implements NestMiddleware {
//   constructor(private readonly usersService: UsersService) {}
//
//   async use(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers.authorization || req.headers.Authorization;
//
//     if (
//       !authHeader ||
//       isArray(authHeader) ||
//       !authHeader.startsWith('Bearer')
//     ) {
//       req.currentUser = null;
//       return next();
//     }
//
//     const token = authHeader.split('Bearer ')[1];
//     const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
//
//     if (!secret) {
//       req.currentUser = null;
//       return next();
//     }
//
//     try {
//       const payload = verify(token, secret) as JwtPayload;
//       const currentUser = await this.usersService.findOne(+payload.id);
//       req.currentUser = currentUser;
//     } catch (err) {
//       req.currentUser = null; // token invalid or expired
//     }
//
//     next();
//   }catch(err){
//     req.currentUser = null;
//   }
// }
import { NestMiddleware } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';

export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (
      !authHeader ||
      Array.isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];

        const payload = verify(
          token,
          process.env.ACCESS_TOKEN_SECRET_KEY!,
        ) as JwtPayload;

        const currentUser = await this.usersService.findOne(payload.id);
        req.currentUser = currentUser;
        next();
      } catch (err) {
        req.currentUser = null;
        next();
      }
    }
  }
}

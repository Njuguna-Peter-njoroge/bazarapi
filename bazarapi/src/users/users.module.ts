import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationGuard } from '../Utility/Guards/auth-guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthenticationGuard],
  exports: [UsersService],
})
export class UsersModule {}

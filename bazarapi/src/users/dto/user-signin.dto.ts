import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSigninDto {
  @IsNotEmpty({ message: 'email cannot be empty' })
  @IsEmail({}, { message: 'please provide valid email address' })
  email: string;

  @IsNotEmpty({ message: 'password cannot be empty' })
  @MinLength(5, { message: 'password must be at least 5 characters' })
  password: string;
}
import { IsNotEmpty, IsString } from 'class-validator';
import { UserSigninDto } from './user-signin.dto';

export class UserSignUpDto extends UserSigninDto {
  @IsNotEmpty({ message: 'name cannot be null' })
  @IsString({ message: 'name must be string' })
  name: string;


}

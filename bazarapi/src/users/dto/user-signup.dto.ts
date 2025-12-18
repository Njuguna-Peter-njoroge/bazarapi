import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserSigninDto } from './user-signin.dto';
import { Roles } from '../../Utility/common/user-roles.enum';

export class UserSignUpDto extends UserSigninDto {
  @IsNotEmpty({ message: 'name cannot be null' })
  @IsString({ message: 'name must be string' })
  name: string;

  @IsOptional()
  @IsArray({ message: 'roles must be an array' })
  @IsEnum(Roles, { each: true, message: 'invalid role' })
  roles?: Roles[];
}

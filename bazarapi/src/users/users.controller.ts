import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSigninDto } from './dto/user-signin.dto';
import { currentUser } from '../Utility/Decorators/current-user.decotatoer';
import { AuthenticationGuard } from '../Utility/Guards/auth-guard';
import { AuthorizeRoles } from '../Utility/Decorators/authorize.roles.decorator';
import { Roles } from '../Utility/common/user-roles.enum';
import { AuthorizeGuard } from '../Utility/Guards/authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ user: Omit<UserEntity, 'password'> }> {
    return await this.usersService.signup(userSignUpDto);
  }

  @Post('signin')
  async sign(@Body() userSigninDto: UserSigninDto) {
    const { user } = await this.usersService.signin(userSigninDto);
    const accessToken = this.usersService.accessToken(user);
    return { user, accessToken };
  }

  create() {
    // return this.usersService.create(createUserDto);

    return 'hi';
  }
@AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getProfile(@currentUser() currentUser: UserEntity) {
    return currentUser;
  }


}

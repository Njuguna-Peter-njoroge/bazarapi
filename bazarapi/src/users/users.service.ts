import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { compare, hash } from 'bcrypt';
import { UserSigninDto } from './dto/user-signin.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(
    userSignUpDto: UserSignUpDto,
  ): Promise<{ user: Omit<UserEntity, 'password'> }> {
    const userExist = await this.findUserByEmail(userSignUpDto.email);
    if (userExist) throw new BadRequestException('User already exists');
    userSignUpDto.password = await hash(userSignUpDto.password, 10);
    let user = this.usersRepository.create(userSignUpDto);
    user = await this.usersRepository.save(user);
    const { password, ...safeUser } = user;
    return { user: safeUser };
  }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async signin(userSigninDto: UserSigninDto) {
    const userExist = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSigninDto.email })
      .getOne();

    if (!userExist)
      throw new BadRequestException('wrong credential check and try again');

    const matchPassword = await compare(
      userSigninDto.password,
      userExist.password,
    );
    if (!matchPassword) throw new BadRequestException('passwords do not match');
    const { password, ...safeUser } = userExist;
    return { user: safeUser };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }
  // accessToken(user: Omit<UserEntity, 'password'>) {
  //   const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
  //   const expires = process.env.ACCESS_TOKEN_EXPIRE_TIME || '1h';
  //
  //   if (!secret) {
  //     throw new Error(
  //       'ACCESS_TOKEN_SECRET_KEY is missing in environment variables',
  //     );
  //   }
  //
  //   return jwt.sign(
  //     { id: user.id, email: user.email },
  //     secret,
  //     {
  //       expiresIn: expires,
  //   });
  // }

  }

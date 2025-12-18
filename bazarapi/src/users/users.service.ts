import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async signin(
    userSigninDto: UserSigninDto,
  ): Promise<{ accessToken: string; user: Omit<UserEntity, 'password'> }> {
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
    const accessToken = this.accessToken(safeUser);


    return { user: safeUser, accessToken };
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
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

  //
  // async accessToken(user: UserEntity):Promise<string> {
  //   return jwt.sign(
  //     {
  //       id: user.id,
  //       email: user.email,
  //     },
  //     process.env.ACCESS_TOKEN_SECRET_KEY,
  //     { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_TIME });
  // }
  accessToken(user: Pick<UserEntity, 'id' | 'email' | 'roles'>): string {
    const secret = process.env.ACCESS_TOKEN_SECRET_KEY;

    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET_KEY is missing');
    }

    const envExpire = process.env.ACCESS_TOKEN_EXPIRES_TIME;
    let expiresIn: jwt.SignOptions['expiresIn'];

    if (!envExpire) {
      expiresIn = '1h';
    } else if (/^\d+$/.test(envExpire)) {
      expiresIn = Number(envExpire);
    } else {
      expiresIn = envExpire as jwt.SignOptions['expiresIn'];
    }

    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    return jwt.sign(payload, secret, { expiresIn });
  }
}

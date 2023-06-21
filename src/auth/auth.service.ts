import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRegisterDto } from './dtos/user-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dtos/user-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async userRegister(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const { email, password, products_created } = userRegisterDto;
    const user = await this.userRepository.findOneBy({
      email: email,
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await this.userRepository.save({
        ...userRegisterDto,
        password: hashedPassword,
        products_created: [],
      });

      delete user.password;

      return user;
    } else {
      throw new HttpException('Email already exists', HttpStatus.FORBIDDEN);
    }
  }

  async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    return isValidPassword;
  }

  async userLogin(userLoginDto: UserLoginDto): Promise<any> {
    const { email, password } = userLoginDto;
    const user = await this.userRepository.findOneBy({
      email,
    });

    const validPassword = this.checkPassword(password, user.password);

    if (!user) {
      throw new HttpException('Could not find the user', HttpStatus.FORBIDDEN);
    }

    const jwt = await this.jwtService.signAsync({
      user,
    });

    if (user && validPassword) return jwt;
  }

  // async userDetails(user_id: string): Promise<UserEntity> {
  //   const user = await this.userRepository.findOneBy({ user_id });

  //   if (user)
  // }
}

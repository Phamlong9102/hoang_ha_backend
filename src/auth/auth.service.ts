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
    const { email, password } = userRegisterDto;
    const user = await this.userRepository.findOneBy({
      email: email,
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await this.userRepository.save({
        ...userRegisterDto,
        password: hashedPassword,
      });

      delete user.password;

      return user;
    } else {
      throw new HttpException('Email already exists', HttpStatus.FORBIDDEN);
    }
  }

  async checkValidPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    return isValidPassword;
  }

  async userLogin(userLoginDto: UserLoginDto): Promise<string> {
    const { email, password } = userLoginDto;
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new HttpException('Could not find the user', HttpStatus.FORBIDDEN);
    }

    if (user) {
      const isValidPassword = await this.checkValidPassword(
        password,
        user.password,
      );
      if (isValidPassword) {
        const accessToken = await this.jwtService.signAsync({
          user,
        });
        return accessToken;
      }
      return `Email or password is incorrect`;
    }
  }
}

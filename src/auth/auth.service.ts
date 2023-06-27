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
        delete user.password;
        const accessToken = await this.jwtService.signAsync({
          user,
        });
        return accessToken;
      }
      return `Email or password is incorrect`;
    }
  }

  async findUserById(user_id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { user_id },
      relations: ['products_created'],
    });

    if (!user) {
      throw new HttpException('Could not find the user', HttpStatus.FORBIDDEN);
    }

    if (user) {
      delete user.password;
      return user;
    }
  }

  async throwUserId(user_id: string): Promise<string> {
    const user = await this.userRepository.findOneBy({
      user_id,
    });

    if (!user) {
      throw new HttpException('Could not find the user', HttpStatus.FORBIDDEN);
    }

    if (user) {
      console.log('userId: ', user.user_id);

      return user.user_id;
    }
  }
}

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dtos/user-register.dto';
import { UserEntity } from './entities/user.entity';
import { UserLoginDto } from './dtos/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserEntity> {
    return this.authService.userRegister(userRegisterDto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return this.authService.userLogin(userLoginDto);
  }
}

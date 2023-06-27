import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dtos/user-register.dto';
import { UserEntity } from './entities/user.entity';
import { UserLoginDto } from './dtos/user-login.dto';
import { Request, Response } from 'express';
import { JwtGuard } from './guards/jwt.guard';

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
  async login(
    @Body() userLoginDto: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const token = await this.authService.userLogin(userLoginDto);
    res.cookie('access_token', token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: 'strict',
    });
    return token;
  }

  // @UseGuards(JwtGuard)
  // @HttpCode(200)
  @Post('logout')
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    req.logOut();
    res.clearCookie('access_token');
    return 'Log out successfully';
  }
}

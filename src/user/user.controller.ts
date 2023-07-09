import { Controller, Post, Body, Res, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/common/decorator/public/public.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userInfo = await this.userService.login(user);
    if (userInfo) {
      const token = await this.jwtService.signAsync({
        id: userInfo.id,
        username: userInfo.username,
      });

      response.setHeader('authorization', 'bearer ' + token);
      return {
        code: 200,
        message: '登录成功',
        data: {
          token: token,
        },
      };
    } else {
      return {
        code: 500,
        message: '登录失败',
      };
    }
  }

  @Public()
  @Post('register')
  async register(@Body() user: RegisterDto) {
    const newUser = await this.userService.create(user);
    if (newUser) {
      return {
        code: 200,
        msg: '注册成功',
        data: null,
      };
    } else {
      return {
        code: 500,
        msg: '注册失败',
        data: null,
      };
    }
  }
}

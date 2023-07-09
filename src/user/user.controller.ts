import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() user: LoginDto) {
    return await this.userService.findOne(user);
  }

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

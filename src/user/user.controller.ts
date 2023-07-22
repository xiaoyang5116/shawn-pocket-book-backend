import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Inject,
  Request,
  Patch,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/common/decorator/public/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('user')
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
        user: {
          id: userInfo.id,
          username: userInfo.username,
        },
      });

      response.setHeader('authorization', 'bearer ' + token);
      return {
        code: 200,
        message: '登录成功',
        data: {
          token: 'bearer ' + token,
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

  @Get('userInfo')
  async getUserInfo(@Request() request: Request) {
    const userId = request['user'].id;
    const userInfo = await this.userService.findOneById(userId);
    return {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature || '',
        avatar: userInfo.avatar,
      },
    };
  }

  @Patch('edit_userinfo')
  async editUserInfo(
    @Request() request: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = request['user'].id;
    const userInfo = await this.userService.update(userId, updateUserDto);
    return {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature,
        avatar: userInfo.avatar,
      },
    };
  }

  @Patch('reset_password')
  async resetPassword(
    @Body() resetPassword: ResetPasswordDto,
    @Request() request: Request,
  ) {
    const userInfo = await this.userService.resetPassword(
      resetPassword,
      request['user'].id,
    );

    if (userInfo) {
      return {
        code: 200,
        msg: '修改成功',
        data: null,
      };
    }
    return {
      code: 500,
      msg: '服务端错误',
      data: null,
    };
  }

  @Post('upload_avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1000 * 1 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    // @Body() body,
  ) {
    console.log(file);
    return {
      code: 200,
      msg: '上传成功',
      data: file.path.replace('public', '/static'),
    };
  }
}

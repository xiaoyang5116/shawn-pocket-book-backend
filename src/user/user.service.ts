import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Tag } from 'src/tag/entities/tag.entity';

function md5(str: string): string {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

const defaultAvatar = 'static/uploads/avatar/default_avatar.png';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}

  async create(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', 500);
    }
    const tags = await this.tagRepository.find({
      order: {
        id: 'ASC',
      },
      take: 3,
    });

    const newUser = this.userRepository.create({
      username: user.username,
      password: md5(user.password),
      signature: '世界和平。',
      avatar: defaultAvatar,
      tags: tags,
    });

    return this.userRepository.save(newUser);
  }

  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (!foundUser) {
      throw new HttpException('用户名不存在', 500);
    }
    if (foundUser.password !== md5(user.password)) {
      throw new HttpException('密码错误', 500);
    }
    return foundUser;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) throw new HttpException('用户不存在', 500);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userInfo = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
    });

    if (!userInfo) throw new NotFoundException(`用户不存在`);

    return this.userRepository.save(userInfo);
  }
}

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getTag(@Request() res: Request) {
    const tags = await this.tagService.findTagsByUserId(res['user'].id);
    if (!tags) throw new HttpException('服务器错误', HttpStatus.NOT_FOUND);
    // tag 按类型分类
    const tagsData = tags.reduce((curr, tag) => {
      const index = curr.findIndex((item) => item.pay_type === tag.pay_type);
      if (curr && curr.length && index > -1) {
        curr[index].tags.push(tag);
      }
      if (curr.length && index === -1) {
        curr.push({
          pay_type: tag.pay_type,
          tags: [tag],
        });
      }
      if (!curr.length) {
        curr.push({
          pay_type: tag.pay_type,
          tags: [tag],
        });
      }

      return curr;
    }, []);
    return {
      code: 200,
      data: tagsData,
      msg: '请求成功',
    };
  }

  @Post('add')
  async createTag(@Body() createTag: CreateTagDto, @Request() res: Request) {
    if (res['user'].username === 'adminYx') {
      return this.tagService.createTag(createTag, 0);
    } else {
      // return this.tagService.createTag(createTag, 1);
      throw new HttpException('没有权限', 500);
    }
  }
}

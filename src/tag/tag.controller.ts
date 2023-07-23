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

  @Get('init_tag')
  async initTag(@Request() res: Request) {
    if (res['user'].username === 'adminYx') {
      const init_data: (CreateTagDto & { tag_type: number })[] = [
        { name: '餐饮', pay_type: 1, tag_type: 0 },
        { name: '交通', pay_type: 1, tag_type: 0 },
        { name: '服饰', pay_type: 1, tag_type: 0 },
        { name: '购物', pay_type: 1, tag_type: 0 },
        { name: '服务', pay_type: 1, tag_type: 0 },
        { name: '教育', pay_type: 1, tag_type: 0 },
        { name: '娱乐', pay_type: 1, tag_type: 0 },
        { name: '运动', pay_type: 1, tag_type: 0 },
        { name: '生活缴费', pay_type: 1, tag_type: 0 },
        { name: '旅行', pay_type: 1, tag_type: 0 },
        { name: '宠物', pay_type: 1, tag_type: 0 },
        { name: '医疗', pay_type: 1, tag_type: 0 },
        { name: '保险', pay_type: 1, tag_type: 0 },
        { name: '公益', pay_type: 1, tag_type: 0 },
        { name: '发红包', pay_type: 1, tag_type: 0 },
        { name: '转账', pay_type: 1, tag_type: 0 },
        { name: '其他人情', pay_type: 1, tag_type: 0 },
        { name: '其他', pay_type: 1, tag_type: 0 },
        { name: '生意', pay_type: 2, tag_type: 0 },
        { name: '工资', pay_type: 2, tag_type: 0 },
        { name: '奖金', pay_type: 2, tag_type: 0 },
        { name: '其他人情', pay_type: 2, tag_type: 0 },
        { name: '收红包', pay_type: 2, tag_type: 0 },
        { name: '收转账', pay_type: 2, tag_type: 0 },
        { name: '商家转账', pay_type: 2, tag_type: 0 },
        { name: '退款', pay_type: 2, tag_type: 0 },
        { name: '其他', pay_type: 2, tag_type: 0 },
        { name: '理财', pay_type: 0, tag_type: 0 },
        { name: '借还款', pay_type: 0, tag_type: 0 },
        { name: '其他', pay_type: 0, tag_type: 0 },
      ];
      return this.tagService.batchCreateTag(init_data);
    }
    throw new HttpException('没有权限', 500);
  }
}

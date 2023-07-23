import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async findTagsByUserId(id: number) {
    const defaultTag = await this.tagRepository.findBy({
      tag_type: 0,
    });
    const userTag = await this.tagRepository.find({
      where: {
        users: {
          id: id,
        },
      },
    });

    return [...defaultTag, ...userTag];
  }

  async createTag({ name, pay_type }: CreateTagDto, tag_type: number) {
    const tag = await this.tagRepository.findOne({
      where: {
        name: name,
        pay_type,
      },
    });

    if (tag) throw new HttpException('标签已存在', 500);

    const tags = this.tagRepository.create({
      name,
      pay_type,
      tag_type: tag_type,
    });

    return this.tagRepository.save(tags);
  }

  async batchCreateTag(tag: CreateTagDto[]) {
    return await this.tagRepository.manager.save(Tag, tag);
  }
}

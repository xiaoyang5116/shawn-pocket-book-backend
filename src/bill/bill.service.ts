import { Injectable, HttpException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
// import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { UpdateBillDto } from './dto/update-bill.dto';

export enum PAY_TYPE {
  '不计入账',
  '支出',
  '收入',
}

export type BillListType = {
  id: number;
  amount: number;
  createTime: Date;
  remark: string | null;
  tagId: number;
  tagName: string;
  pay_type: number;
};

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(id: number, createBillDto: CreateBillDto) {
    const user = await this.userRepository.findOneBy({ id });
    const tag = await this.tagRepository.findOneBy({ id: createBillDto.tagId });
    if (!user || !tag) {
      throw new HttpException('格式不对', 500);
    }
    const bill = this.billRepository.create({
      ...createBillDto,
      user,
      tag,
    });
    return await this.billRepository.save(bill);
  }

  async billDetailByBillIdAndUserId(id: number, userId: number) {
    const bill = await this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect(Tag, 'tag', 'tag.id = bill.tagId')
      .select(
        `
        bill.id as id,
        bill.amount as amount,
        bill.createTime as createTime,
        bill.remark as remark,
        bill.tagId as tagId,
        tag.name as tagName,
        tag.pay_type as pay_type
        `,
      )
      .where('bill.id = :id and bill.userId = :userId', { id: id, userId })
      .getRawOne();

    return bill;
  }

  async findAllByUserId(id: number): Promise<BillListType[]> {
    return await this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect(Tag, 'tag', 'tag.id = bill.tagId')
      .select(
        `
      bill.id as id,
      bill.amount as amount,
      bill.createTime as createTime,
      bill.remark as remark,
      bill.tagId as tagId,
      tag.name as tagName,
      tag.pay_type as pay_type
      `,
      )
      .where('bill.userId = :id', { id: id })
      .getRawMany();
  }

  async update(id: number, updateBillDto: UpdateBillDto) {
    const tag = updateBillDto.tagId
      ? {
          tag: {
            id: updateBillDto.tagId,
          },
        }
      : {};
    const bill = await this.billRepository.preload({
      id,
      ...updateBillDto,
      ...tag,
    });

    const result = await this.billRepository.save(bill);

    return {
      id: result.id,
      amount: result.amount,
      tagId: result.tag.id,
      tagName: result.tag.name,
      createTime: result.createTime,
      remark: result.remark,
      pay_type: result.tag.pay_type,
    };
  }

  async remove(id: number) {
    return await this.billRepository.delete(id);
  }

  async findByCreateTime(date: string, userId: number) {
    return await this.billRepository
      .createQueryBuilder('bill')
      .leftJoinAndSelect(Tag, 'tag', 'tag.id = bill.tagId')
      .select(
        `
    bill.id as id,
    bill.amount as amount,
    bill.createTime as createTime,
    bill.remark as remark,
    bill.tagId as tagId,
    tag.name as tagName,
    tag.pay_type as pay_type
    `,
      )
      .where('bill.userId = :id and bill.createTime like :date', {
        id: userId,
        date: `${date}%`,
      })
      .getRawMany();
  }
}

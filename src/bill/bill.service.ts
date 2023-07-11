import { Injectable, HttpException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
// import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billRepository: Repository<Bill>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(id: number, createBillDto: CreateBillDto) {
    const user = await this.userRepository.findOneBy({ id });
    const tag = await this.tagRepository.findOneBy({ id: createBillDto.tag });
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

  async findOne(id: number) {
    const bill = await this.billRepository.findOne({
      where: {
        id: id,
      },
      relations: ['user', 'tag'],
    });
    return bill;
  }

  // findAll() {
  //   return `This action returns all bill`;
  // }

  // update(id: number, updateBillDto: UpdateBillDto) {
  //   return `This action updates a #${id} bill`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} bill`;
  // }
}

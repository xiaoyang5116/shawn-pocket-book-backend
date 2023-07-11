import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { User } from 'src/user/entities/user.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, User, Tag])],
  controllers: [BillController],
  providers: [BillService],
})
export class BillModule {}

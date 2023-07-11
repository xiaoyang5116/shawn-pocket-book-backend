import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
// import { UpdateBillDto } from './dto/update-bill.dto';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post('add')
  async create(@Body() createBillDto: CreateBillDto, @Request() res: Request) {
    await this.billService.create(res['user'].id, createBillDto);
    return {
      code: 200,
      msg: '请求成功',
      data: null,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billService.findOne(+id);
  }

  // @Get()
  // findAll() {
  //   return this.billService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
  //   return this.billService.update(+id, updateBillDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.billService.remove(+id);
  // }
}

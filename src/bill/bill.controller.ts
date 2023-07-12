import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  Query,
} from '@nestjs/common';
import { BillListType, BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import * as dayjs from 'dayjs';
import { CheckBillDto } from './dto/check-bill.dot';

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

  @Get('list')
  async list(@Query() checkBillQuery: CheckBillDto, @Request() res: Request) {
    const { date, page = 1, page_size = 5, tagId = 'all' } = checkBillQuery;
    const bills = await this.billService.findAllByUserId(res['user'].id);

    if (bills.length === 0) {
      return {
        code: 200,
        msg: '请求成功',
        date: [],
      };
    }

    // 过滤出月份和类型所对应的账单列表
    const filterBillsByTimeAndTag = bills.filter((item) => {
      if (tagId != 'all') {
        return (
          dayjs(item.createTime).format('YYYY-MM') === date &&
          tagId == item.tagId
        );
      }
      return dayjs(item.createTime).format('YYYY-MM') === date;
    });

    // 格式化数据，将其变成设置好的对象格式
    // [
    //   {
    //     date: '2020-1-1',
    //     bills: [
    //       {
    //         // bill 数据表中的每一项账单
    //       },
    //       {
    //         // bill 数据表中的每一项账单
    //       }
    //     ]
    //   },
    // ]
    const billsMap = filterBillsByTimeAndTag
      .reduce((curr: Array<{ date: string; bills: BillListType[] }>, bill) => {
        const currDate = dayjs(bill.createTime).format('YYYY-MM');

        // 如果能在累加的数组中找到当前项日期 date，那么在数组中的加入当前项到 bills 数组。
        if (
          curr &&
          curr.length &&
          curr.findIndex((item) => item.date == currDate) > -1
        ) {
          const index = curr.findIndex((item) => item.date == currDate);
          curr[index].bills.push(bill);
        }

        // 如果在累加的数组中找不到当前项日期的，那么再新建一项。
        if (
          curr &&
          curr.length &&
          curr.findIndex((item) => item.date == currDate) == -1
        ) {
          curr.push({
            date,
            bills: [bill],
          });
        }

        // 如果 curr 为空数组，则默认添加第一个账单项 item ，格式化为下列模式
        if (!curr.length) {
          curr.push({
            date,
            bills: [bill],
          });
        }

        return curr;
      }, [])
      .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()); // 时间顺序为倒叙，时间约新的，在越上面;

    const billsPaging = billsMap.slice(
      (page - 1) * page_size,
      page * page_size,
    );

    // 计算当月总收入和支出
    // 首先获取当月所有账单列表
    const getCurrMonthBills = bills.filter(
      (bill) => dayjs(bill.createTime).format('YYYY-MM') == date,
    );
    // 累加计算支出
    const totalExpense = getCurrMonthBills.reduce((curr, bill) => {
      if (bill.pay_type === 1) {
        curr += Number(bill.amount);
        return curr;
      }
      return curr;
    }, 0);

    // 累加计算收入
    const totalIncome = getCurrMonthBills.reduce((curr, bill) => {
      if (bill.pay_type === 2) {
        curr += Number(bill.amount);
      }
      return curr;
    }, 0);

    return {
      code: 200,
      msg: '请求成功',
      data: {
        totalExpense, // 当月支出
        totalIncome, // 当月收入
        totalPage: Math.ceil(billsMap.length / page_size), // 总分页
        list: billsPaging || [], // 格式化后，并且经过分页处理的数据
      },
    };
  }

  @Get('detail/:id')
  async detail(@Param('id') id: number, @Request() res: Request) {
    const detail = await this.billService.billDetailByBillIdAndUserId(
      +id,
      res['user'].id,
    );

    if (!detail) {
      return {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }

    return {
      code: 200,
      msg: '请求成功',
      data: detail,
    };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBillDto: UpdateBillDto) {
  //   return this.billService.update(+id, updateBillDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.billService.remove(+id);
  // }
}

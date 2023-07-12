import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBillDto {
  @ApiProperty({ description: '金额' })
  @IsNumber()
  readonly amount: number;

  @ApiProperty({ description: '创建时间' })
  @IsDate()
  readonly createTime: Date;

  @ApiProperty({ description: '备注' })
  @IsOptional()
  readonly remark: string;

  @ApiProperty({ description: '标签id' })
  @IsNumber()
  readonly tagId: number;
}

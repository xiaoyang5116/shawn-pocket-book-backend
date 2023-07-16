import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckBillDto {
  @ApiProperty({ description: '日期' })
  @IsString()
  readonly date: string;

  @ApiProperty({ description: '页数' })
  @IsOptional()
  @IsNumber()
  readonly page: number;

  @ApiProperty({ description: '页面显示个数' })
  @IsOptional()
  @IsNumber()
  readonly page_size: number;

  @ApiProperty({ description: '标签id' })
  @IsOptional()
  readonly tagId: number | 'all';
}

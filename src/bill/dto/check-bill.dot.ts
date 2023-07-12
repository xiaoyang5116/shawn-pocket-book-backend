import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CheckBillDto {
  @IsString()
  date?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  page_size?: number;

  @IsOptional()
  tagId?: number | 'all';
}

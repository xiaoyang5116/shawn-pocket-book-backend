import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class CreateBillDto {
  @IsNumber()
  readonly amount: number;

  @IsDate()
  readonly createTime: Date;

  @IsOptional()
  readonly remark: string;

  @IsNumber()
  readonly tagId: number;
}

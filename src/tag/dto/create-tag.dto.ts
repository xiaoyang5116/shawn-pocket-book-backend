import { IsString, IsNumber } from 'class-validator';

export class CreateTagDto {
  @IsString()
  name: string;

  @IsNumber()
  pay_type: number;
}

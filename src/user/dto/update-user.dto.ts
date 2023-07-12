import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiProperty({ description: '头像' })
  @IsString()
  @IsOptional()
  readonly avatar?: string;

  @ApiProperty({ description: '个性签名' })
  @IsString()
  @IsOptional()
  readonly signature?: string;
}

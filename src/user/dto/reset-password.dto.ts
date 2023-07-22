import { IsString, Matches, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: '原密码' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: '新密码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9#$%_.-]+$/, {
    message: '密码只能是字母、数字或者 #、$、%、_、.、- 这些字符',
  })
  newPassword: string;

  @ApiProperty({ description: '确认密码' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9#$%_.-]+$/, {
    message: '密码只能是字母、数字或者 #、$、%、_、.、- 这些字符',
  })
  confirmPassword: string;
}

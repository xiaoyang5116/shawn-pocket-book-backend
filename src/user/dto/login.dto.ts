import { IsString, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  readonly password: string;
}

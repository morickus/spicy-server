import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}

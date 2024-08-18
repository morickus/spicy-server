import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendCodeDto {
  @ApiProperty({
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;
}

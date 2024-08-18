import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class GetSessionInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  iat: number;

  @ApiProperty()
  exp: number;
}

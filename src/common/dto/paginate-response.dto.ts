import { ApiProperty } from '@nestjs/swagger';

export class PaginateResponseDto<T> {
  data: T[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  hasPrev: boolean;

  @ApiProperty()
  hasNext: boolean;
}

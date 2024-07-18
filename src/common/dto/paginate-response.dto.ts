import { ApiProperty } from '@nestjs/swagger';

export class PaginateResponseDto<T> {
  data: T[];

  @ApiProperty()
  limitPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  hasPrev: boolean;

  @ApiProperty()
  hasNext: boolean;
}

import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class RandomDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  count?: number = 1;
}

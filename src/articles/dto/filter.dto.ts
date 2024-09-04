import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  tags?: string[] = [];
}

export const ApiFilterQuery = () => {
  return applyDecorators(
    ApiQuery({
      name: 'tags',
      required: false,
      type: [String],
      isArray: true,
    }),
  );
};

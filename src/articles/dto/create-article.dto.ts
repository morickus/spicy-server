import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { JsonContentDto } from './content.dto';

export class CreateArticleDto {
  @ApiProperty({
    example: 'title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [JsonContentDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => JsonContentDto)
  content: JsonContentDto[];

  @ApiProperty({
    example: ['category'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  categories: string[];
}

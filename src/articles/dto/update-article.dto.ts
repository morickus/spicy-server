import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { JsonContentDto } from './content.dto';

export class UpdateArticleDto {
  @ApiProperty({ example: 'New Title', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiProperty({
    type: [JsonContentDto],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => JsonContentDto)
  content?: JsonContentDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ example: ['category1', 'category2'], required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayMinSize(1)
  categories?: string[];
}

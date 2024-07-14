import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class DataDto {
  @IsOptional()
  @IsString()
  text?: string;
}

export class JsonContentDto {
  @ApiProperty({ example: 'nQ8SZhVnEY', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'paragraph' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ type: DataDto, example: { text: 'text' } })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DataDto)
  data: DataDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { JsonContentDto } from './content.dto';

export class ArticleAllResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  excerpt: string;

  @ApiProperty({ required: false })
  metaDescription?: string;

  @ApiProperty()
  authorId: number;

  @ApiProperty({ type: [UserResponseDto] })
  @Type(() => UserResponseDto)
  author: UserResponseDto;

  @ApiProperty({ type: [CategoryResponseDto] })
  @Type(() => CategoryResponseDto)
  categories: CategoryResponseDto[];
}

export class ArticleResponseDto extends ArticleAllResponseDto {
  @ApiProperty({ type: [JsonContentDto] })
  content: JsonContentDto[];
}

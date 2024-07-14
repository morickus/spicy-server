import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { GetSessionInfoDto } from '../auth/dto/get-session-info.dto';
import { SessionInfo } from '../auth/session-info.decorator';
import { ApiOkResponsePaginate } from '../common/decorator/api-ok-response-paginate.decorator';
import { ApiPaginationQuery } from '../common/decorator/api-pagination-query.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ArticlesService } from './articles.service';
import {
  ArticleAllResponseDto,
  ArticleResponseDto,
} from './dto/article-response.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: ArticleResponseDto })
  create(
    @SessionInfo() session: GetSessionInfoDto,
    @Body() body: CreateArticleDto,
  ) {
    return this.articlesService.createArticle(session, body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ArticleResponseDto })
  update(
    @SessionInfo() session: GetSessionInfoDto,
    @Param('id') id: number,
    @Body() body: UpdateArticleDto,
  ) {
    return this.articlesService.updateArticle(session, Number(id), body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: ArticleResponseDto })
  delete(@SessionInfo() session: GetSessionInfoDto, @Param('id') id: number) {
    return this.articlesService.deleteArticle(session, Number(id));
  }

  @Get()
  @ApiPaginationQuery()
  @ApiOkResponsePaginate(ArticleAllResponseDto)
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() paginationDto: PaginationDto) {
    return this.articlesService.getAllArticles(paginationDto);
  }

  @Get(':slug')
  @ApiOkResponse({ type: ArticleResponseDto })
  findOne(@Param('slug') slug: string) {
    return this.articlesService.getArticleBySlug(slug);
  }

  @Get('category/:slug')
  @ApiPaginationQuery()
  @ApiOkResponsePaginate(ArticleResponseDto)
  @UsePipes(new ValidationPipe({ transform: true }))
  findByCategory(
    @Param('slug') slug: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.articlesService.getArticlesByCategory(slug, paginationDto);
  }
}

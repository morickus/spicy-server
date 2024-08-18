import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/utils/roles.decorator';
import { RolesGuard } from '../auth/utils/roles.guard';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @ApiCreatedResponse({ type: CategoryResponseDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.createCategory(body);
  }

  @Patch(':id')
  @ApiOkResponse({ type: CategoryResponseDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(@Param('id') id: number, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(Number(id), body);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CategoryResponseDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  delete(@Param('id') id: number) {
    return this.categoriesService.deleteCategory(Number(id));
  }

  @Get()
  @ApiOkResponse({ type: [CategoryResponseDto] })
  findAll() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':slug')
  @ApiOkResponse({ type: CategoryResponseDto })
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.getCategoryBySlug(slug);
  }
}

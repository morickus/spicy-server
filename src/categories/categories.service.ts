import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlugService } from '../slug/slug.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
  ) {}

  async createCategory(name: string) {
    const slug = await this.slugService.generateUniqueSlug(name, 'category');
    return this.prisma.category.create({ data: { name, slug } });
  }

  async updateCategory(id: number, body: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const newSlug = await this.slugService.generateUniqueSlug(
      body.name,
      'category',
    );

    return this.prisma.category.update({
      where: { id },
      data: {
        slug: newSlug,
        name: body.name,
      },
    });
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getAllCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        slug: true,
        name: true,
        _count: {
          select: { articles: true },
        },
      },
    });

    return categories.map((c) => ({
      ...c,
      countArticles: c._count.articles,
    }));
  }
}

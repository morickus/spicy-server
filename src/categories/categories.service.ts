import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlugService } from '../slug/slug.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
  ) {}

  async createCategory(body: CreateCategoryDto) {
    const { name, metaDescription } = body;
    const slug = await this.slugService.generateUniqueSlug(name, 'category');
    return this.prisma.category.create({
      data: {
        slug,
        name,
        metaDescription,
      },
    });
  }

  async updateCategory(id: number, body: UpdateCategoryDto) {
    const { name, metaDescription } = body;
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    let newSlug: string | undefined;
    if (name && category.name !== name) {
      newSlug = await this.slugService.generateUniqueSlug(name, 'category');
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(newSlug && { slug: newSlug }),
        ...(typeof metaDescription === 'string' && { metaDescription }),
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
        id: 'asc',
      },
      select: {
        id: true,
        slug: true,
        name: true,
        metaDescription: true,
        _count: {
          select: { articles: true },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      metaDescription: c.metaDescription,
      countArticles: c._count.articles,
    }));
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        metaDescription: true,
        _count: {
          select: { articles: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      metaDescription: category.metaDescription,
      countArticles: category._count.articles,
    };
  }
}

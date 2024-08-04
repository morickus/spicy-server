import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetSessionInfoDto } from '../auth/dto/get-session-info.dto';
import { Role } from '../auth/enums/role.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { generateExcerpt } from '../common/excerpt';
import { PrismaService } from '../prisma/prisma.service';
import { SlugService } from '../slug/slug.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
  ) {}

  private async validateCategories(
    categories: string[],
  ): Promise<{ id: number }[]> {
    const existingCategories = await this.prisma.category.findMany({
      where: {
        slug: {
          in: categories,
        },
      },
    });

    if (existingCategories.length !== categories.length) {
      throw new NotFoundException('One or more categories not found');
    }

    return existingCategories.map((category) => ({ id: category.id }));
  }

  async createArticle(session: GetSessionInfoDto, body: CreateArticleDto) {
    const { title, content, categories, metaDescription } = body;
    const excerpt = generateExcerpt(content);
    const slug = await this.slugService.generateUniqueSlug(
      body.title,
      'article',
    );
    const categoryConnections = await this.validateCategories(categories);

    try {
      return await this.prisma.article.create({
        data: {
          slug,
          title,
          excerpt,
          metaDescription,
          content: JSON.parse(JSON.stringify(content)),
          author: {
            connect: {
              id: session.id,
            },
          },
          categories: {
            connect: categoryConnections,
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          categories: {
            select: {
              slug: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Error creating article');
    }
  }

  async updateArticle(
    session: GetSessionInfoDto,
    id: number,
    body: UpdateArticleDto,
  ) {
    const { title, content, categories, metaDescription } = body;

    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.authorId !== session.id && session.role !== Role.Admin) {
      throw new ForbiddenException(
        'You do not have permission to update this article',
      );
    }

    const excerpt = content ? generateExcerpt(content) : undefined;
    const categoryConnections = categories
      ? await this.validateCategories(categories)
      : undefined;

    return this.prisma.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(typeof metaDescription === 'string' && { metaDescription }),
        ...(content && { content: JSON.parse(JSON.stringify(content)) }),
        ...(categoryConnections && {
          categories: { set: categoryConnections },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    });
  }

  async deleteArticle(session: GetSessionInfoDto, id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.authorId !== session.id && session.role !== 'ADMIN') {
      throw new ForbiddenException(
        'You do not have permission to delete this article',
      );
    }

    return this.prisma.article.delete({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    });
  }

  async getArticleBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  // TODO: fix params pagination
  private async getPaginatedArticles(where: any, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const data = await this.prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        slug: true,
        title: true,
        excerpt: true,
        metaDescription: true,
        authorId: true,
        author: {
          select: {
            id: true,
            email: true,
          },
        },
        categories: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    });

    // TODO: fix totalArticle and data make one request
    const totalArticle = await this.prisma.article.count({ where });
    const totalPages = Math.ceil(totalArticle / limit);

    // TODO: fix response pagination
    return {
      data,
      totalPages,
      limitPage: limit,
      currentPage: page,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    };
  }

  async getAllArticles(paginationDto: PaginationDto) {
    return this.getPaginatedArticles({}, paginationDto);
  }

  async getArticlesByCategory(slug: string, paginationDto: PaginationDto) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.getPaginatedArticles(
      { categories: { some: { id: category.id } } },
      paginationDto,
    );
  }
}

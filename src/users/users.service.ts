import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string) {
    return this.prisma.user.create({ data: { email } });
  }

  async getAllUsers(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [totalArticle, data] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalArticle / limit);

    return {
      data,
      totalPages,
      limitPage: limit,
      currentPage: page,
      hasPrev: page > 1,
      hasNext: page < totalPages,
    };
  }
}

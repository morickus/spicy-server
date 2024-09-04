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

  async getAllUsers(pagination: PaginationDto) {
    const { page = 1, limit = 10, skip } = pagination;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      page,
      limit,
      total,
      hasPrev: page > 1,
      hasNext: page < total / limit,
    };
  }
}

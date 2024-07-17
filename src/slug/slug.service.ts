import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlugService {
  constructor(private prisma: PrismaService) {}

  async generateUniqueSlug(name: string, tableName: string): Promise<string> {
    const slug = slugify(name, { lower: true, strict: true });
    let uniqueSlug = slug;
    let count = 1;

    try {
      while (await this.isSlugExist(uniqueSlug, tableName)) {
        uniqueSlug = `${slug}-${count}`;
        count++;
      }
    } catch (error) {
      throw new BadRequestException('Error creating slug');
    }

    if (uniqueSlug === '') {
      throw new BadRequestException('Error creating slug');
    }

    return uniqueSlug;
  }

  async isSlugExist(slug: string, tableName: string): Promise<boolean> {
    const entity = await this.prisma[tableName].findUnique({
      where: { slug },
    });

    return entity !== null;
  }
}

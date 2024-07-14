import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SlugModule } from '../slug/slug.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [PrismaModule, SlugModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}

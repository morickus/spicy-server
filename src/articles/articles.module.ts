import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SlugModule } from '../slug/slug.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  imports: [PrismaModule, SlugModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}

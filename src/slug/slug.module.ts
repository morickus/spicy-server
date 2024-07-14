import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SlugService } from './slug.service';

@Module({
  imports: [PrismaModule],
  providers: [SlugService],
  exports: [SlugService],
})
export class SlugModule {}

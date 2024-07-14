import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  providers: [ProfilesService],
  controllers: [ProfilesController],
})
export class ProfilesModule {}

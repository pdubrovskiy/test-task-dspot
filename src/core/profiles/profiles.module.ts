import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profiles } from './profiles.entity';
import { ProfilesRepository } from './profiles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Profiles])],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesRepository],
})
export class ProfilesModule {}

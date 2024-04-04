import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { SeederService } from './seeder.service';
import { Profiles } from 'src/core/profiles/profiles.entity';

@Module({
  imports: [ConfigModule, DatabaseModule, TypeOrmModule.forFeature([Profiles])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}

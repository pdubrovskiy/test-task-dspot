import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { DatabaseModule } from './database/database.module';
import { winstonConfig } from './config/winston.config';
import { AppConfigModule } from './config/app-config.module';
import { ProfilesModule } from './core/profiles/profiles.module';

@Module({
  imports: [AppConfigModule, WinstonModule.forRoot(winstonConfig), DatabaseModule, ProfilesModule],
})
export class AppModule {}

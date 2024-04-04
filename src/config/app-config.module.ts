import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [databaseConfig, appConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}

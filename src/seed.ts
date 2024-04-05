import { winstonConfig } from './config/winston.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger, WinstonModule } from 'nest-winston';
import { SeederService } from './database/seeders/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ ...winstonConfig }),
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const logger: WinstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  const seeder = app.get(SeederService);

  const profilesTotal = Number(process.env.PROFILES_TOTAL) || 40;
  const friendsTotal = Number(process.env.PROFILES_TOTAL) || 10;

  try {
    await seeder.seed(profilesTotal, friendsTotal);
    logger.log('Seeder script completed successfully.');
  } catch (error) {
    logger.error(error);
  }
}
bootstrap();

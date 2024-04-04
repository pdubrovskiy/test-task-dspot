import { winstonConfig } from './config/winston.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger, WinstonModule } from 'nest-winston';
import { setupSwagger } from './swagger';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/interfaces/app-config.interface';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from './config/validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ ...winstonConfig }),
  });

  const configService = app.get(ConfigService);
  const appConfig: AppConfig = configService.get<AppConfig>('app');
  const PORT: string | number = appConfig.port;

  app.setGlobalPrefix('api/v1');
  setupSwagger(app);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalPipes(new ValidationPipe(ValidationPipeOptions));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({ allowedHeaders: '*', exposedHeaders: '*' });

  const logger: WinstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useGlobalFilters(new ValidationExceptionFilter(logger));

  await app.listen(PORT, () => {
    logger.log(`Server works on ${PORT}`);
  });
}
bootstrap();

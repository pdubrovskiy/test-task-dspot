import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from 'src/config/interfaces/database-config.interface';
import { types } from 'pg';
import path, { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const rootDir = path.dirname(__dirname);
        const dbConfig = configService.get<DatabaseConfig>('database');
        const options = {
          ...dbConfig,
          entities: [join(rootDir, 'core', '**', '*.entity.{ts,js}')],
        };
        types.setTypeParser(types.builtins.INT8, (value) => {
          return value === null ? null : Number(value);
        });
        return options;
      },
    }),
  ],
})
export class DatabaseModule {}

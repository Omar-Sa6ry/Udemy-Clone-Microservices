import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './modules/users/users.module';
import {
  // ConfigModule as Config,
  GraphqlModule,
  ThrottlerModule,
  TranslationModule,
} from '@bts-soft/core';
import { AppResolver } from './app.resolver';
import { User } from './modules/users/entities/user.entity';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphqlModule,
    ThrottlerModule,
    TranslationModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging: ['error', 'warn', 'query'],
      }),
      async dataSourceFactory(options) {
        if (!options) throw new Error('Invalid options passed');
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return addTransactionalDataSource(dataSource);
      },
    }),

    UserModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}

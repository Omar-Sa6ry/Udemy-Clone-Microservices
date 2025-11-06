import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import {
  // ConfigModule as Config,
  ThrottlerModule,
  TranslationModule,
  HttpExceptionFilter,
} from '@bts-soft/core';
import { AppResolver } from './app.resolver';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { APP_FILTER } from '@nestjs/core';
import { join } from 'path';
import { AuthUser } from './modules/auth/entity/auth.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule,
    TranslationModule,

    GraphQLModule.forRoot({
      driver: ApolloDriver,
      path: '/auth/graphql',

      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({
        req,
        user: req.user,
        language: req.headers['accept-language'] || 'en',
      }),

      playground: true,
      debug: false,
      uploads: false,
      csrfPrevention: false,

      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          path: '/graphql',
          keepAlive: 10000,
        },
        'graphql-ws': true,
      },

      formatError: (error) => {
        return {
          message: error.message,
          extensions: {
            ...error.extensions,
            stacktrace: undefined,
            locations: undefined,
            path: undefined,
          },
        };
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('DB_NAME_AUTH'),
        entities: [AuthUser],
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

    AuthModule,
  ],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

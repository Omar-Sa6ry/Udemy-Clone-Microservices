// import * as bodyParser from 'body-parser';
import { json } from 'express';
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { I18nValidationException } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { setupInterceptors, setupGraphqlUpload } from '@bts-soft/core';

async function bootstrap() {
  try {
    initializeTransactionalContext();

    const app = await NestFactory.create(AppModule);
    app.enableCors();

    setupGraphqlUpload(app, 1000000, 2);
    setupInterceptors(app);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: true,
        exceptionFactory: (errors) => new I18nValidationException(errors),
      }),
    );

    // app.use('/google/callback', bodyParser.raw({ type: 'application/json' }));
    app.use(json());

    const dataSource = app.get(DataSource);
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    await app.listen(process.env.PORT_USER || 3001);
  } catch (error) {
    console.error(error);
    throw new BadRequestException(error);
  }
}

bootstrap();

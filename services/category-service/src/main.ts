import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import * as bodyParser from 'body-parser';
import { json } from 'express';
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { I18nValidationException } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { setupInterceptors } from '@bts-soft/core';

async function bootstrap() {
  try {
    initializeTransactionalContext();

    const app = await NestFactory.create(AppModule);
    app.enableCors();

    setupInterceptors(app as any);

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

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL || 'nats://localhost:4222'],
        queue: 'category-service',
      },
    });

    await app.startAllMicroservices();

    await app.listen(process.env.PORT_CATEGORY || 3003);
  } catch (error) {
    console.error(error);
    throw new BadRequestException(error);
  }
}

bootstrap();

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryProxy } from './proxy/category.proxy';
import { NatsService } from 'src/common/nats/nats.service';
import { NatsModule } from 'src/common/nats/nats.module';
import { AuthCommonModule } from '@course-plateform/common';
import { UserClientService } from '../user/userClient.service';
import { CategoryNatsController } from './category.controller';
import { CategoryFascade } from './fascade/category.fascade';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import {
  CreateCategoryStrategy,
  UpdateCategoryStrategy,
} from './strategy/category.stategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    NatsModule,
  ],
  providers: [
    CategoryService,
    CategoryProxy,
    CategoryFascade,
    CreateCategoryStrategy,
    UpdateCategoryStrategy,
    CategoryResolver,
    NatsService,
    UserClientService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
  controllers: [CategoryNatsController],

  exports: [CategoryService, CategoryProxy, TypeOrmModule],
})
export class CategoryModule {}

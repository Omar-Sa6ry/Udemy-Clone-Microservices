import { NotificationModule, UploadModule, RedisModule } from '@bts-soft/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { UserFacadeService } from './fascade/user.fascade';
import { User } from './entities/user.entity';
import { UserProxy } from './proxy/user.proxy';
import { Profile } from './entities/profile.entity';
import { UserProfileLoader } from './loader/user.loader';
import { NatsService } from 'src/common/nats/nats.service';
import { UsersController } from './user.controller';
import { NatsModule } from 'src/common/nats/nats.module';
import { ConfigModule } from '@nestjs/config';
import { AuthCommonModule } from '@course-plateform/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    NotificationModule,
    RedisModule,
    NatsModule,
    UploadModule,
    ConfigModule,
    AuthCommonModule.register({ userServiceToken: 'USER_SERVICE' }),
  ],
  providers: [
    UserService,
    UserResolver,
    UserProxy,
    NatsService,
    UserFacadeService,
    UserProfileLoader,
    {
      provide: 'USER_SERVICE',
      useExisting: UserService,
    },
  ],
  controllers: [UsersController],
  exports: [UserService, UserFacadeService, UserProxy, TypeOrmModule],
})
export class UserModule {}

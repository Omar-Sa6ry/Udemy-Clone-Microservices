import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthUser } from './entity/auth.entity';
import { NotificationModule, RedisModule } from '@bts-soft/core';
import { UploadModule } from '@bts-soft/upload';
import { UserClientService } from '../user/userCclient.service';
import { AuthCommonModule } from '@course-plateform/common';
import { ValidatorChain } from './chain/validator.chain';
import { PasswordValidator } from './chain/password.chain';
import { PasswordServiceAdapter } from './adapter/password.adapter';
import { AuthServiceFacade } from './fascade/AuthService.facade';
import { GenerateTokenFactory } from './jwt/jwt.service';
import { NatsModule } from '../../common/nats/nats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUser]),
    UploadModule,
    NotificationModule,
    RedisModule,
    NatsModule,
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    AuthServiceFacade,
    UserClientService,
    GenerateTokenFactory,
    ValidatorChain,
    PasswordValidator,
    PasswordServiceAdapter,
    {
      provide: 'IPasswordStrategy',
      useClass: PasswordServiceAdapter,
    },
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
})
export class AuthModule {}

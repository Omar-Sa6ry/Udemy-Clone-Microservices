import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entity/certificate.entity';
import { CertificateService } from './certificate.service';
import { CertificateResolver } from './certificate.resolver';
import { CertificateLoader } from './dataLoader/certificate.dataLoader';
import { CertificateProxy } from './proxy/certificate.proxy';
import { CertificateFascade } from './fascade/certificate.fascade';
import { NotificationModule, RedisModule } from '@bts-soft/core';
import { UserClientService } from '../user/userClient.service';
import { CourseClientService } from '../course/courseClient.service';
import { AuthCommonModule } from '@course-plateform/common';
import { NatsModule } from 'src/common/nats/nats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    NatsModule,
    RedisModule,
    NotificationModule,
  ],
  providers: [
    CertificateService,
    CertificateResolver,
    CertificateLoader,
    CertificateProxy,
    UserClientService,
    CourseClientService,
    CertificateFascade,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
  exports: [TypeOrmModule, CertificateProxy],
})
export class CertificateModule {}

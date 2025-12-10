import { Module } from '@nestjs/common';
import { UserProgressService } from './userProgress.service';
import { UserProgressResolver } from './userProgress.resolver';
import { UserProgressProxy } from './proxy/userProgress.proxy';
import { UserProgressFascade } from './fascade/userProgress.fascade';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgress } from './entity/userProgress.entity';
import { AuthCommonModule } from '@course-plateform/common';
import { UserClientService } from '../user/userClient.service';
import { NatsModule } from 'src/common/nats/nats.module';
import { CertificateClientService } from '../certificate/certificateClient.service';
import { CourseClientService } from '../course/courseClient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProgress]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    NatsModule,
  ],
  providers: [
    UserProgressResolver,
    UserProgressService,
    UserProgressProxy,
    UserProgressFascade,
    CourseClientService,
    UserClientService,
    CertificateClientService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
  exports: [UserProgressService],
})
export class UserProgressModule {}

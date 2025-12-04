import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { ReviewProxy } from './proxy/review.proxy';
import { ReviewFascade } from './fascade/review.fascade';
import { ReviewLoaders } from './dataLoader/review.dataLoader';
import { CertificateClientService } from '../certificate/certificateClient.service';
import { UserClientService } from '../user/userClient.service';
import { CourseClientService } from '../course/courseClient.service';
import { NatsModule } from 'src/common/nats/nats.module';
import { AuthCommonModule } from '@course-plateform/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    NatsModule,
  ],
  providers: [
    ReviewService,
    ReviewResolver,
    ReviewProxy,
    ReviewFascade,
    ReviewLoaders,
    CourseClientService,
    UserClientService,
    CertificateClientService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
})
export class ReviewModule {}

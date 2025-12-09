import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entity/quiz.entity';
import { AuthCommonModule } from '@course-plateform/common';
import { NatsModule } from 'src/common/nats/nats.module';
import { UserClientService } from '../user/userClient.service';
import { QuizService } from './quiz.service';
import { QuizResolver } from './quiz.resolver';
import { QuizProxy } from './proxy/quiz.proxy';
import { QuizFascade } from './fascade/quiz.fascade';
import { CourseClientService } from '../course/courseClient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    NatsModule,
  ],
  providers: [
    QuizService,
    QuizResolver,
    QuizProxy,
    QuizFascade,
    CourseClientService,
    UserClientService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
  exports: [QuizProxy],
})
export class QuizModule {}

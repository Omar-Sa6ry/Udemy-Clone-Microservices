import { Module } from '@nestjs/common';
import { QuestionProxy } from './proxy/quizQuestion.proxy';
import { QuizAttempsProxy } from './proxy/quizAttemps.proxy';
import { QuizAttemptFascade } from './fascades/quizAttempt.fascade';
import { QuizQuestionFascade } from './fascades/quizQuestion.fascade';
import { QuizQuestionOptionFascade } from './fascades/quizQuestionOption.fascade';
import { QuizDetailsResolver } from './quizDetails.resolver';
import { QuizDetailsService } from './quizDetails.service';
import { QuestionOptionProxy } from './proxy/questionOption.proxy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCommonModule } from '@course-plateform/common';
import { NatsModule } from 'src/common/nats/nats.module';
import { UserClientService } from '../user/userClient.service';
import { QuizAttempt } from './entities/quizAttempts.entity';
import { QuizQuestion } from './entities/question.entity';
import { QuizQuestionOption } from './entities/option.entity';
import { QuizModule } from '../quiz/quiz.module';
import { CourseClientService } from '../course/courseClient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizAttempt, QuizQuestion, QuizQuestionOption]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    NatsModule,
    QuizModule,
  ],
  providers: [
    QuizDetailsResolver,
    QuizDetailsService,
    QuestionProxy,
    QuizAttempsProxy,
    QuestionOptionProxy,
    QuizAttemptFascade,
    QuizQuestionFascade,
    QuizQuestionOptionFascade,
    CourseClientService,
    UserClientService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
  exports: [QuizDetailsService],
})
export class QuizDetailsModule {}

import { Module } from '@nestjs/common';
import { UserClientService } from '../user/userClient.service';
import { NatsService } from 'src/common/nats/nats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from '../courses/course.module';
import { RedisModule } from '@bts-soft/core';
import { NatsModule } from 'src/common/nats/nats.module';
import { AuthCommonModule } from '@course-plateform/common';
import { Lesson } from './entity/lesson.entity';
import { LessonService } from './lesson.service';
import { LessonResolver } from './lesson.resolver';
import { LessonProxy } from './proxy/lesson.proxy';
import { LessonFascade } from './fascade/lesson.fascade';
import { CreateLessonStrategy } from './stratgies/createLesson.stratgy';
import { UpdateLessonStrategy } from './stratgies/updateLesson.stratgy';
import { SectionModule } from '../section/section.module';
import { UploadModule } from '@bts-soft/upload';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    UploadModule,
    CourseModule,
    RedisModule,
    NatsModule,
    SectionModule,
  ],
  providers: [
    LessonService,
    LessonResolver,
    LessonProxy,
    LessonFascade,
    CreateLessonStrategy,
    UpdateLessonStrategy,
    UserClientService,
    NatsService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
})
export class LessonModule {}

import { Module } from '@nestjs/common';
import { Course } from './entity/course.entity';
import { CourseDataLoaders } from './dataloaders/course.loader';
import { CourseService } from './course.service';
import { CourseProxy } from './proxy/course.proxy';
import { CourseFascade } from './fascade/course.fascade';
import { CourseResolver } from './course.resolver';
import { CreateCourseStrategy } from './stratgies/createCourse.stratgy';
import { UpdateCourseStrategy } from './stratgies/updateCourse.stratgy';
import { RedisModule } from '@bts-soft/core';
import { CourseNatsController } from './course.controller';
import { AuthCommonModule } from '@course-plateform/common';
import { NatsModule } from 'src/common/nats/nats.module';
import { UserClientService } from '../user/userClient.service';
import { CategoryClientService } from '../category/categoryClient.service';
import { NatsService } from 'src/common/nats/nats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadModule } from '@bts-soft/upload';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    AuthCommonModule.register({ userService: UserClientService }),
    NatsModule,
    RedisModule,
    UploadModule,
  ],
  providers: [
    CourseService,
    CourseProxy,
    CourseFascade,
    CourseResolver,
    CourseDataLoaders,
    CreateCourseStrategy,
    UpdateCourseStrategy,
    NatsService,
    UserClientService,
    CategoryClientService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
  controllers: [CourseNatsController],
  exports: [CourseService, CourseProxy],
})
export class CourseModule {}

import { Module } from '@nestjs/common';
import { UserClientService } from '../user/userClient.service';
import { NatsService } from 'src/common/nats/nats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseSection } from './entity/courseSection.entity';
import { AuthCommonModule } from '@course-plateform/common';
import { SectionService } from './section.service';
import { SectionResolver } from './section.resolver';
import { SectionProxy } from './proxy/section.proxy';
import { SectionFascade } from './fascade/section.fascade';
import { UpdateSectionStrategy } from './stratgies/updateSection.stratgy';
import { CreateSectionStrategy } from './stratgies/createSection.stratgy';
import { CourseModule } from '../courses/course.module';
import { RedisModule } from '@bts-soft/core';
import { NatsModule } from 'src/common/nats/nats.module';
import { Course } from '../courses/entity/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseSection, Course]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    CourseModule,
    RedisModule,
    NatsModule,
  ],
  providers: [
    SectionService,
    SectionResolver,
    SectionProxy,
    SectionFascade,
    CreateSectionStrategy,
    UpdateSectionStrategy,
    UserClientService,
    NatsService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
  exports: [SectionService, CourseModule, SectionProxy, TypeOrmModule],
})
export class SectionModule {}

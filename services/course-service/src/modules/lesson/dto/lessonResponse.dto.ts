import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';
import { Lesson } from '../entity/lesson.entity';

@ObjectType()
export class LessonResponse extends BaseResponse {
  @Field(() => Lesson, { nullable: true })
  @Expose()
  data: Lesson;
}

@ObjectType()
export class LessonsResponse extends BaseResponse {
  @Field(() => [Lesson], { nullable: true })
  items: Lesson[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

@ObjectType()
export class CourseCountResponse extends BaseResponse {
  @Field(() => Int, { nullable: true })
  @Expose()
  data: number;
}

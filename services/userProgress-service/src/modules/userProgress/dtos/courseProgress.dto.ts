import { BaseResponse } from '@bts-soft/core';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class CourseProgressType {
  @Field(() => String)
  courseId: string;

  @Field(() => Int)
  total_lessons: number;

  @Field(() => Int)
  completed_lessons: number;

  @Field(() => Float)
  progress_percentage: number;

  @Field(() => Int)
  total_watch_time: number;
}

@ObjectType()
export class CourseProgressTypeResponse extends BaseResponse {
  @Field(() => CourseProgressType, { nullable: true })
  @Expose()
  data: CourseProgressType | null;
}

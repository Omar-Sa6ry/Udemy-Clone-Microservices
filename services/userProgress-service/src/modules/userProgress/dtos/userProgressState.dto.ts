import { BaseResponse } from '@bts-soft/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class UserProgressStatsType {
  @Field(() => Int)
  total_courses_enrolled: number;

  @Field(() => Int)
  total_lessons_completed: number;

  @Field(() => Int)
  total_watch_time_hours: number;
}

@ObjectType()
export class UserProgressStatsTypeResponse extends BaseResponse {
  @Field(() => UserProgressStatsType, { nullable: true })
  @Expose()
  data: UserProgressStatsType | null;
}

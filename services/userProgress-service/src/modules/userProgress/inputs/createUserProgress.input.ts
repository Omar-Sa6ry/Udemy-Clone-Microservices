import { IdField } from '@bts-soft/core';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class CreateUserProgressInput {
  @IdField('userId')
  userId: string;

  @IdField('lessonId')
  lessonId: string;

  @IdField('courseId')
  courseId: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  watch_time_seconds?: number;
}

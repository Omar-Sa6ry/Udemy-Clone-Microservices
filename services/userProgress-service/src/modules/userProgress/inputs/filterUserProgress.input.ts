import { IdField } from '@bts-soft/core';
import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class UserProgressFilterInput {
  @Field(() => String)
  @IdField('userId', 26, true)
  userId?: number;

  @Field(() => String)
  @IdField('courseId', 26, true)
  courseId?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

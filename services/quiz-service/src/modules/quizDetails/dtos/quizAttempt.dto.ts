import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';
import { QuizAttempt } from '../entities/quizAttempts.entity';

@ObjectType()
export class QuizAttemptResponse extends BaseResponse {
  @Field(() => QuizAttempt, { nullable: true })
  @Expose()
  data: QuizAttempt | null;
}

@ObjectType()
export class QuizAttemptsResponse extends BaseResponse {
  @Field(() => [QuizAttempt], { nullable: true })
  items: QuizAttempt[] | null;

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

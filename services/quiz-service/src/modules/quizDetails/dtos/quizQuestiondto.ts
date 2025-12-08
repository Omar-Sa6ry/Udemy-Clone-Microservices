import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';
import { QuizQuestion } from '../entities/question.entity';

@ObjectType()
export class QuizQuestionResponse extends BaseResponse {
  @Field(() => QuizQuestion, { nullable: true })
  @Expose()
  data: QuizQuestion | null;
}

@ObjectType()
export class QuizQuestionsResponse extends BaseResponse {
  @Field(() => [QuizQuestion], { nullable: true })
  items: QuizQuestion[] | null;

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

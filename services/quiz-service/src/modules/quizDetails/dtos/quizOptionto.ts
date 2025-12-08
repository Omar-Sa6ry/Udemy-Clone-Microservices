import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';
import { QuizQuestionOption } from '../entities/option.entity';

@ObjectType()
export class QuizQuestionOptionResponse extends BaseResponse {
  @Field(() => QuizQuestionOption, { nullable: true })
  @Expose()
  data: QuizQuestionOption | null;
}

@ObjectType()
export class QuizQuestionOptionsResponse extends BaseResponse {
  @Field(() => [QuizQuestionOption], { nullable: true })
  items: QuizQuestionOption[] | null;

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

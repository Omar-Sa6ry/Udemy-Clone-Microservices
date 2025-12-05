import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';
import { Quiz } from '../entity/quiz.entity';

@ObjectType()
export class QuizResponse extends BaseResponse {
  @Field(() => Quiz, { nullable: true })
  @Expose()
  data: Quiz | null;
}

@ObjectType()
export class QuizsResponse extends BaseResponse {
  @Field(() => [Quiz], { nullable: true })
  items: Quiz[] | null;

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

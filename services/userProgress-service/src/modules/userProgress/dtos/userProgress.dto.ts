import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';
import { UserProgress } from '../entity/userProgress.entity';

@ObjectType()
export class UserProgressResponse extends BaseResponse {
  @Field(() => UserProgress, { nullable: true })
  @Expose()
  data: UserProgress | null;
}

@ObjectType()
export class UserProgresssResponse extends BaseResponse {
  @Field(() => [UserProgress], { nullable: true })
  items: UserProgress[] | null;

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

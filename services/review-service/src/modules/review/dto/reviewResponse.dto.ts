import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Review } from '../entity/review.entity';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';

@ObjectType()
export class ReviewResponse extends BaseResponse {
  @Field(() => Review, { nullable: true })
  @Expose()
  data: Review;
}

@ObjectType()
export class ReviewsResponse extends BaseResponse {
  @Field(() => [Review], { nullable: true })
  items: Review[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

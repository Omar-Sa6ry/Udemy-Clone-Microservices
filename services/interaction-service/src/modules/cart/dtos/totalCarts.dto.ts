import { BaseResponse } from '@bts-soft/core';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class TotalCartsResponse extends BaseResponse {
  @Field(() => Float, { nullable: true })
  @Expose()
  data: number;
}

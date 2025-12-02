import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { Cart } from '../entities/cart.entity';
import { BaseResponse } from '@bts-soft/core';

@ObjectType()
export class CartResponse extends BaseResponse {
  @Field(() => Cart, { nullable: true })
  @Expose()
  data: Cart | null;
}

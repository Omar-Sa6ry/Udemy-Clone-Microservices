import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CartItem } from '../entities/cartItem.enitty';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';

@ObjectType()
export class CartItemResponse extends BaseResponse {
  @Field(() => CartItem, { nullable: true })
  @Expose()
  data: CartItem | null;
}

@ObjectType()
export class CartItemsResponse extends BaseResponse {
  @Field(() => [CartItem], { nullable: true })
  items: CartItem[] | null;

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Wishlist } from '../entity/wishlist.entity';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';

@ObjectType()
export class WishlistResponse extends BaseResponse {
  @Field(() => Wishlist, { nullable: true })
  @Expose()
  data: Wishlist;
}

@ObjectType()
export class WishlistsResponse extends BaseResponse {
  @Field(() => [Wishlist], { nullable: true })
  items: Wishlist[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

@ObjectType()
export class WishlistCountResponse extends BaseResponse {
  @Field(() => Int, { nullable: true })
  @Expose()
  data: number;
}

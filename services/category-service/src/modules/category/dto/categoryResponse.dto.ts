import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Category } from '../entity/category.entity';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';

@ObjectType()
export class CategoryResponse extends BaseResponse {
  @Field(() => Category, { nullable: true })
  @Expose()
  data: Category;
}

@ObjectType()
export class CategoriesResponse extends BaseResponse {
  @Field(() => [Category], { nullable: true })
  items: Category[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

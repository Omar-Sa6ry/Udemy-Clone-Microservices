import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse, PaginationInfo } from '@bts-soft/common';
import { IsOptional } from 'class-validator';

@ObjectType()
export class CategoryDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class CategoryResponse extends BaseResponse {
  @Field(() => CategoryDto, { nullable: true })
  data?: CategoryDto;
}

@ObjectType()
export class CategoriesResponse extends BaseResponse {
  @Field(() => [CategoryDto], { nullable: true })
  items?: CategoryDto[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

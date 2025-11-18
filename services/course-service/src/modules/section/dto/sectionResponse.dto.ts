import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';
import { CourseSection } from '../entity/courseSection.entity';

@ObjectType()
export class SectionResponse extends BaseResponse {
  @Field(() => CourseSection, { nullable: true })
  @Expose()
  data: CourseSection;
}

@ObjectType()
export class SectionsResponse extends BaseResponse {
  @Field(() => [CourseSection], { nullable: true })
  items: CourseSection[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

@ObjectType()
export class CourseCountResponse extends BaseResponse {
  @Field(() => Int, { nullable: true })
  @Expose()
  data: number;
}

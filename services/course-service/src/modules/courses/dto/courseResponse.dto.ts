import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Course } from '../entity/course.entity';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';

@ObjectType()
export class CourseResponse extends BaseResponse {
  @Field(() => Course, { nullable: true })
  @Expose()
  data: Course;
}

@ObjectType()
export class CoursesResponse extends BaseResponse {
  @Field(() => [Course], { nullable: true })
  items: Course[];

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

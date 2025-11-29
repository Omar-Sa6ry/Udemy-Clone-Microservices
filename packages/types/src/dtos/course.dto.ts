import { BaseResponse, PaginationInfo } from '@bts-soft/common';
import { IsOptional } from 'class-validator';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { CourseLevel } from '@course-plateform/common';

@ObjectType()
export class CourseDto {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  categoryId: string;

  @Field(() => String)
  instructorId: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  subtitle: string;

  @Field(() => String)
  description: string;

  @Field(() => [String])
  learningOutcomes: string[];

  @Field(() => [String])
  requirements: string[];

  @Field(() => [String])
  targetAudience: string[];

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  discountPrice?: number;

  @Field(() => CourseLevel)
  level: CourseLevel;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  promoVideoUrl?: string;

  @Field(() => Int)
  totalLectures: number;

  @Field(() => Float)
  totalHours: number;

  @Field(() => Float)
  ratingAvg: number;

  @Field(() => Int)
  ratingCount: number;

  @Field(() => Int)
  studentCount: number;

  @Field(() => Boolean, { nullable: true })
  isActive: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class CourseResponse extends BaseResponse {
  @Field(() => CourseDto, { nullable: true })
  data?: CourseDto;
}

@ObjectType()
export class CoursesResponse extends BaseResponse {
  @Field(() => [CourseDto], { nullable: true })
  items?: CourseDto[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

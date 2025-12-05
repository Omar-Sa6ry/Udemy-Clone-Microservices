import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse, PaginationInfo } from '@bts-soft/common';
import { IsOptional } from 'class-validator';

@ObjectType()
export class Lesson {
  @Field(() => String)
  _id: string;

  @Field()
  title: string;

  @Field()
  videoUrl: string;

  @Field()
  durationSeconds: number;

  @Field()
  fileUrl: string;

  @Field()
  fileSize: number;

  @Field()
  downloadCount: number;

  @Field()
  videoSize: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class LessonResponse extends BaseResponse {
  @Field(() => Lesson, { nullable: true })
  data: Lesson;
}

@ObjectType()
export class LessonsResponse extends BaseResponse {
  @Field(() => [Lesson], { nullable: true })
  items: Lesson[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

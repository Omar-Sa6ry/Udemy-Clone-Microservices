import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse, PaginationInfo } from '@bts-soft/common';
import { IsOptional } from 'class-validator';

@ObjectType()
export class LessonDto {
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
  @Field(() => LessonDto, { nullable: true })
  data: LessonDto;
}

@ObjectType()
export class LessonsResponse extends BaseResponse {
  @Field(() => [LessonDto], { nullable: true })
  items: LessonDto[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

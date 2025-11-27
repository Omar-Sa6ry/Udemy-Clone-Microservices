import { CapitalTextField } from '@bts-soft/core';
import { InputType, Field } from '@nestjs/graphql';
import { CreateFileDto, CreateVideoDto } from '@bts-soft/upload';

@InputType()
export class CreateLessonInput {
  @CapitalTextField('Title', 1, 100)
  title: string;

  @Field()
  id: string;

  @Field()
  sectionId: string;

  @Field()
  courseId: string;

  @Field(() => CreateVideoDto, { nullable: true })
  video: CreateVideoDto;

  @Field(() => CreateFileDto, { nullable: true })
  file: CreateFileDto;
}

import { InputType, Field } from '@nestjs/graphql';
import { CapitalTextField } from '@bts-soft/core';
import { CreateFileDto, CreateVideoDto } from '@bts-soft/upload';

@InputType()
export class UpdateLessonInput {
  @Field()
  id: string;

  @Field()
  sectionId: string;

  @Field()
  courseId: string;

  @CapitalTextField('Title', 1, 100)
  @Field({ nullable: true })
  title?: string;

  @Field(() => CreateVideoDto, { nullable: true })
  video?: CreateVideoDto;

  @Field(() => CreateFileDto, { nullable: true })
  file?: CreateFileDto;
}

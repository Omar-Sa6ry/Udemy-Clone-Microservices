import { InputType, Field } from '@nestjs/graphql';
import { CreateFileDto, CreateVideoDto } from '@bts-soft/upload';

@InputType()
export class CreateLessonInput {
  @Field()
  title: string;

  @Field()
  sectionId: string;

  @Field()
  courseId: string;

  @Field(() => CreateVideoDto, { nullable: true })
  video?: CreateVideoDto;

  @Field(() => CreateFileDto, { nullable: true })
  file?: CreateFileDto;
}

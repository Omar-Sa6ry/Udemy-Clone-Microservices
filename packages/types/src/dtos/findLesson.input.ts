import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FindLessonInput {
  @Field()
  courseId: string;

  @Field()
  sectionId: string;

  @Field()
  id: string;
}

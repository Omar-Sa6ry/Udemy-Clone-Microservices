import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DeleteSectionInput {
  @Field()
  courseId: string;

  @Field()
  sectionId: string;
}

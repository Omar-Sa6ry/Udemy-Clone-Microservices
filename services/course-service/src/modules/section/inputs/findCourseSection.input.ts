import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FindSectionInput {
  @Field()
  courseId: string;

  @Field()
  sectionId: string;
}

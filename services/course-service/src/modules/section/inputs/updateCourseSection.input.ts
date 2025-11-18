import { CapitalTextField } from '@bts-soft/core';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateSectionInput {
  @Field()
  courseId: string;

  @Field()
  sectionId: string;

  @CapitalTextField('Title', 1, 100)
  title: string;
}

import { CapitalTextField } from '@bts-soft/core';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CourseTitleInput {
  @Field(() => String)
  @CapitalTextField('Title', 100)
  title: string;
}

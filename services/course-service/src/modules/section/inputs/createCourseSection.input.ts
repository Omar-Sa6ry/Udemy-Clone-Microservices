import { CapitalTextField } from '@bts-soft/core';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSectionInput {
  @CapitalTextField('Title', 1, 100)
  title: string;

  @Field()
  id: string;
}

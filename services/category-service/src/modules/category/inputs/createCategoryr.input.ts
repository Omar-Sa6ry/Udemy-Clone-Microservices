import { CapitalTextField, TextField } from '@bts-soft/core';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
  @CapitalTextField('Category name', 0,100,false)
  name: string;

  @TextField('Category Description', 0,200, false)
  description: string;
}

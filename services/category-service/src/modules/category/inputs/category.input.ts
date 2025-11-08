import { CapitalTextField, IdField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CategoryIdInput {
  @IdField('Category')
  categoryId: string;
}

@InputType()
export class CategoryNameInput {
  @CapitalTextField('Category', 100)
  name: string;
}

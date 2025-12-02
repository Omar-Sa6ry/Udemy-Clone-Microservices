import { IdField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CartIdInput {
  @IdField('cart Id')
  cartId: string;
}

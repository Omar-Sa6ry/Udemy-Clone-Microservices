import { IdField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';

@InputType()
export class FindWishlistInput {
  @IdField('User', 26, true)
  userId?: string;

  @IdField('Course', 26, true)
  courseId?: string;
}

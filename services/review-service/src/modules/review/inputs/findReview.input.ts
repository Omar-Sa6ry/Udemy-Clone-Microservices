import { IdField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';

@InputType()
export class FindReviewInput {
  @IdField('Course', 26, true)
  courseId?: string;

  @IdField('Student', 26, true)
  studentId?: string;
}

import { IdField } from '@bts-soft/core';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CourseIdInput {
  @IdField('course Id')
  courseId: string;
}

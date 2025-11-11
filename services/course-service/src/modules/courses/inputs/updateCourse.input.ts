import { InputType, PartialType, OmitType } from '@nestjs/graphql';
import { CreateCourseInput } from './createCourse.input';
import { IdField } from '@bts-soft/core';

@InputType()
export class UpdateCourseInput extends PartialType(
  OmitType(CreateCourseInput, ['isActive']),
) {
  @IdField('course')
  id: string;
}

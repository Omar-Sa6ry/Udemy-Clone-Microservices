import { InputType, PartialType, OmitType, Field } from '@nestjs/graphql';
import { CreateCourseInput } from './createCourse.input';

@InputType()
export class UpdateCourseInput extends PartialType(
  OmitType(CreateCourseInput, ['isActive']),
) {
  @Field(() => String)
  id: string;
}

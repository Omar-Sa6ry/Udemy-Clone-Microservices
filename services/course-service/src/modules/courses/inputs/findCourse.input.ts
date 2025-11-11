import { Field, Float, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateCourseInput } from './createCourse.input';

@InputType()
export class FindCourseInput extends PartialType(CreateCourseInput) {
  @Field(() => Float, { nullable: true })
  ratingAvg?: number;

  @Field(() => Int, { nullable: true })
  studentCount?: number;

  @Field(() => String, { nullable: true })
  categoryId?: string | '';
}

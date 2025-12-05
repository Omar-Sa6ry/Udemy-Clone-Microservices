import { Field, InputType, Float } from '@nestjs/graphql';

@InputType()
export class CreateQuizInput {
  @Field(() => String)
  lessonId: string;

  @Field(() => String)
  sectionId: string;

  @Field(() => String)
  courseId: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  time_limit?: number;

  @Field(() => Float, { nullable: true, defaultValue: 70 })
  passing_score?: number;
}

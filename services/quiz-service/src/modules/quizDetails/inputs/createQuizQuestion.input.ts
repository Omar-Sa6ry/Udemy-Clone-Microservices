import { QuestionType } from '@course-plateform/common';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateQuizQuestionInput {
  @Field(() => String)
  quizId: string;

  @Field()
  questionText: string;

  @Field(() => QuestionType)
  questionType: QuestionType;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  points?: number;

  @Field(() => Int)
  position: number;
}

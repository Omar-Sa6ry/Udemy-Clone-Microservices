import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class QuizQuestionOptionInput {
  @Field()
  questionId: string;

  @Field()
  text: string;

  @Field(() => Boolean)
  isCorrect: boolean;
}

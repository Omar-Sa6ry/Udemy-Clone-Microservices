import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SubmitQuizAttemptInput {
  @Field(() => String)
  quizId: string;

  @Field(() => [QuizAnswerInput])
  answers: QuizAnswerInput[];

  @Field(() => Int)
  timeSpent: number;
}

@InputType()
export class QuizAnswerInput {
  @Field(() => String)
  questionId: string;

  @Field(() => [String], { nullable: true })
  selected_option_ids?: string[];

  @Field({ nullable: true })
  short_answer_text?: string;
}

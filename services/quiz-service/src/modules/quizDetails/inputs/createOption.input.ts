import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateQuizQuestionOptionInput {
  @Field()
  optionText: string;

  @Field()
  questionId: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  isCorrect: boolean;

  @Field(() => Int)
  position: number;
}

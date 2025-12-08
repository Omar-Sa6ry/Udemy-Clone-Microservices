import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateQuizQuestionInput } from './createQuizQuestion.input';

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuizQuestionInput) {
  @Field(() => String)
  id: string;
}

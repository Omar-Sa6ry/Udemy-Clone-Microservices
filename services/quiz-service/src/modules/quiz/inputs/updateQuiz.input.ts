import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateQuizInput } from './createQuiz.input';

@InputType()
export class UpdateQuizInput extends PartialType(CreateQuizInput) {
  @Field(() => String)
  id: string;
}

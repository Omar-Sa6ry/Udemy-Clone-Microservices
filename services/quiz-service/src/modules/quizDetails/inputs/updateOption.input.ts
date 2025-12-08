import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateQuizQuestionOptionInput } from './createOption.input';

@InputType()
export class UpdateQuestionOptionInput extends PartialType(
  CreateQuizQuestionOptionInput,
) {
  @Field(() => String)
  id: string;
}

import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class ComplexOrderItemInput {
  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  discount?: number;
}

import { IdField, TextField } from '@bts-soft/core';
import { Field, Float, InputType } from '@nestjs/graphql';
import { IsNumber, Max, Min } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @IdField('Course')
  courseId: string;

  @TextField('comment')
  comment: string;

  @Field(() => Float)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}

import { IdField } from '@bts-soft/core';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCertificateInput {
  @Field()
  courseId: string;

  @IdField('User')
  userId: string;
}

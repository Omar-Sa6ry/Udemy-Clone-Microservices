import { InputType } from '@nestjs/graphql';
import { EmailField, IdField } from '@bts-soft/core';

@InputType()
export class UserIdInput {
  @IdField('User')
  UserId: string;
}

@InputType()
export class EmailInput {
  @EmailField()
  email: string;
}

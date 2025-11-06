import { PasswordField } from '@bts-soft/core';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordDto {
  @Field()
  token: string;

  @PasswordField()
  password: string;
}

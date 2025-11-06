import { EmailField, PasswordField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';

@InputType()
export class LoginDto {
  @EmailField()
  email: string;

  @PasswordField()
  password: string;
}

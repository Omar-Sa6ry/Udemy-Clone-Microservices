import { PasswordField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';

@InputType()
export class ChangePasswordDto {
  @PasswordField()
  password: string;

  @PasswordField()
  newPassword: string;
}

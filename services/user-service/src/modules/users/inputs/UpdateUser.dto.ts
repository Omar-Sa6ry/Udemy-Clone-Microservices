import { CapitalTextField, PhoneField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @CapitalTextField('First name', 1, 100, true)
  firstName?: string;

  @CapitalTextField('Last name', 1, 100, true)
  lastName?: string;

  @PhoneField('EG', true)
  phone?: string;

  @PhoneField('EG', true)
  whatsapp?: string;
}

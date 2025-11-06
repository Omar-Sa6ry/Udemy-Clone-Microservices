import { CapitalTextField, PhoneField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @CapitalTextField('First name', 1, 100)
  firstName: string;

  @CapitalTextField('Last name', 1, 100)
  lastName: string;

  @PhoneField('EG')
  phone: string;

  @PhoneField('EG')
  whatsapp: string;
}

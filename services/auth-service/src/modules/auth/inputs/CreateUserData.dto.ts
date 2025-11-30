import { Field, InputType } from '@nestjs/graphql';
import { CreateImageDto } from '@bts-soft/upload';
import {
  CapitalTextField,
  EmailField,
  PasswordField,
  PhoneField,
  TextField,
  UrlField,
} from '@bts-soft/core';

@InputType()
export class CreateUserInput {
  @CapitalTextField('First name')
  firstName: string;

  @CapitalTextField('Last name')
  lastName: string;

  @CapitalTextField('Headline')
  headline: string;

  @EmailField()
  email: string;

  @PasswordField()
  password: string;

  @PhoneField()
  phone: string;

  @PhoneField()
  whatsapp: string;
}

@InputType()
export class ProfileInput {
  @TextField('bio', 5, 255, true)
  bio?: string | null;

  @CapitalTextField('Headline', 5, 100)
  headline: string;

  @Field(() => CreateImageDto, { nullable: true })
  avatar?: CreateImageDto;

  @UrlField(true, true)
  youtube_url?: string | null;

  @UrlField(true, true)
  website_url?: string | null;

  @UrlField(true, true)
  linkedin_url?: string | null;
}

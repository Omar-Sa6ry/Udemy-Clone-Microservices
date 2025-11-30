import { CapitalTextField, TextField, UrlField } from '@bts-soft/core';
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { CreateImageDto } from '@bts-soft/upload';

@InputType()
export class UpdateProfileInput {
  @TextField('bio', 5, 255, true)
  bio?: string | null;

  @CapitalTextField('Headline', 5, 100, true)
  headline?: string;

  @UrlField(true, true)
  youtube_url?: string | null;

  @UrlField(true, true)
  website_url?: string | null;

  @UrlField(true, true)
  linkedin_url?: string | null;

  @IsOptional()
  @Field(() => CreateImageDto, { nullable: true })
  avatar?: CreateImageDto;
}

import { CapitalTextField, TextField } from '@bts-soft/core';
import { InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
  @IsOptional()
  @CapitalTextField('Category name', 1, 100, true)
  name?: string;

  @IsOptional()
  @TextField('Category Description', 1, 200, true)
  description?: string;
}

import { IdField } from '@bts-soft/core';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class UpdateUserProgressInput {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  watch_time_seconds?: number;

  @IdField('id')
  id: string;
}

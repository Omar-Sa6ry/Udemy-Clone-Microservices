import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { BaseResponse, PaginationInfo } from '@bts-soft/core';
import { Profile } from '../entities/profile.entity';

@ObjectType()
export class ProfileResponse extends BaseResponse {
  @Field(() => Profile, { nullable: true })
  @Expose()
  data: Profile;
}

@ObjectType()
export class ProfilesResponse extends BaseResponse {
  @Field(() => [Profile], { nullable: true })
  items: Profile[];

  @IsOptional()
  @Field(() => PaginationInfo, { nullable: true })
  pagination?: PaginationInfo;
}

@ObjectType()
export class ProfileEmailResponse extends BaseResponse {
  @Field(() => [String])
  items: string[];
}

@ObjectType()
export class ProfileCountResponse extends BaseResponse {
  @Field(() => Int, { nullable: true })
  @Expose()
  data: number;
}

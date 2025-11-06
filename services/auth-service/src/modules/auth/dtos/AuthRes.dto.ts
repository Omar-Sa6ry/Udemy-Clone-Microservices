import { BaseResponse } from '@bts-soft/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IUserResponse } from '../interfaces/IUser.interface';
import { UserObjectType } from './user.dto';

@ObjectType()
export class AuthOutPut {
  @Field(() => UserObjectType)
  @Expose()
  user: IUserResponse;

  @Field()
  @Expose()
  token: string;
}

@ObjectType()
export class AuthResponse extends BaseResponse {
  @Field(() => AuthOutPut, { nullable: true })
  @Expose()
  data: AuthOutPut;
}

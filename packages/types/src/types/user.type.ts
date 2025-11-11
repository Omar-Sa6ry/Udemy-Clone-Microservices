import { Role } from '@course-plateform/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field(() => String)
  id: string;

  @Field(() => String)
  firstName?: string;

  @Field(() => String)
  lastName?: string;

  @Field(() => String)
  fullName?: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  email: string;

  @Field(() => Role)
  role: Role;

  @Field(() => String, { nullable: true })
  profile?: ProfileResponse;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export interface ProfileResponse {
  id: string;
  bio?: string;
  avatar?: string;
  headline?: string;
  website_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
}

export enum UserEvents {
  GET_USER_BY_ID = 'user.get.by.id',
  GET_USER_BY_EMAIL = 'user.get.by.email',
  USER_UPDATED = 'user.updated',
  USER_DATA_EXISTED = 'user.dataExists',
  CREATE_USER_DATA = 'user.createData',
  USER_ROLE_UPDATED = 'user.role.updated',
  FIND_USERS_WITH_IS = 'user.findUsersWithIds',
  CHECK_IF_INSTRACTOR = 'user.checkIfInstractor',
}

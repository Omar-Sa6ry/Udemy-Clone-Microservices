import { Role } from '@course-plateform/common';

export interface UserResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone: string;
  email: string;
  role: Role;
  profile?: ProfileResponse;
  createdAt: Date;
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
}

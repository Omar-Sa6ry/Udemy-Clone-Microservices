import { Role } from '@course-plateform/common';

export interface IUser {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone: string;
  email: string;
  role: Role;
  password?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

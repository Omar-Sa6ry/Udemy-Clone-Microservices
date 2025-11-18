import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  USER = 'user',
}
export const AllRoles: Role[] = Object.values(Role);

export enum Permission {
  // User
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  EDIT_USER_ROLE = 'edit_user_role',
  VIEW_USER = 'view_user',
  CREATE_INSTRUCTOR = 'create_instructor',

  // Auth
  RESET_PASSWORD = 'RESET_PASSWORD',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  LOGOUT = 'LOGOUT',

  // Category
  CREATE_CATEGORY = 'create_category',
  UPDATE_CATEGORY = 'update_category',
  DELETE_CATEGORY = 'delete_category',

  // Course
  CREATE_COURSE = 'create_course',
  UPDATE_COURSE = 'update_course',
  DELETE_COURSE = 'delete_course',

  // Section
  CREATE_SECTION = 'create_section',
  UPDATE_SECTION = 'update_section',
  VIEW_REQUEST_FOR_USER = 'view_request_for_user',
  DELETE_SECTION = 'delete_section',

  // Requests
  CREATE_REQUEST = 'create_request',
  UPDATE_REQUEST = 'update_request',
  DELETE_REQUEST = 'delete_request',
  VIEW_REQUEST = 'view_request',
  UPDATE_REQUESTFORUSER = 'update_requestforuser',

  // Certificate
  CREATE_CERTIFICATE = 'create_certificate',
  VIEW_CERTIFICATE = 'view_certificate',
  VIEW_CERTIFICATE_FOR_USER = 'view_certificate_for_user',
  DELETE_CERTIFICATE = 'delete_certificate',

  // Cart
  CREATE_CART = 'create_cart',
  UPDATE_CART = 'update_cart',
  DELETE_CART = 'delete_cart',
  VIEW_CART = 'view_cart',

  // Wishlist
  CREATE_WISHLIST = 'create_wishlist',
  DELETE_WISHLIST = 'delete_wishlist',
  VIEW_WISHLIST = 'view_wishlist',

  // Reviews
  CREATE_REVIEW = 'create_review',
  UPDATE_REVIEW = 'update_review',
  DELETE_REVIEW = 'delete_review',
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL = 'all',
}

export enum RequestStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
}

registerEnumType(RequestStatus, {
  name: 'RequestStatus',
  description: 'Detailed status of requests in the system',
});

registerEnumType(Permission, {
  name: 'Permission',
  description: 'Detailed permissions in the system',
});

registerEnumType(Role, {
  name: 'Role',
  description: 'User roles in the system',
});

registerEnumType(CourseLevel, {
  name: 'CourseLevel',
  description: 'Detailed CourseLevel in the system',
});

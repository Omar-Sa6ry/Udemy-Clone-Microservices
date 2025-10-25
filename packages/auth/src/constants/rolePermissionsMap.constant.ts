import { Permission, Role } from './enum.constant';

export const rolePermissionsMap: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // User
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.EDIT_USER_ROLE,
    Permission.RESET_PASSWORD,
    Permission.CHANGE_PASSWORD,
    Permission.FORGOT_PASSWORD,
    Permission.LOGOUT,
    Permission.VIEW_USER,
    Permission.CREATE_INSTRUCTOR,

    // Category
    Permission.CREATE_CATEGORY,
    Permission.UPDATE_CATEGORY,
    Permission.DELETE_CATEGORY,

    // Request
    Permission.VIEW_REQUEST,
    Permission.VIEW_REQUEST_FOR_USER,
    Permission.CREATE_REQUEST,
    Permission.UPDATE_REQUEST,
    Permission.DELETE_REQUEST,
    Permission.UPDATE_REQUESTFORUSER,

    // Course
    Permission.CREATE_COURSE,
    Permission.UPDATE_COURSE,
    Permission.DELETE_COURSE,

    // Certificate
    Permission.CREATE_CERTIFICATE,
    Permission.VIEW_CERTIFICATE,
    Permission.VIEW_CERTIFICATE_FOR_USER,
    Permission.DELETE_CERTIFICATE,

    // Cart
    Permission.CREATE_CART,
    Permission.UPDATE_CART,
    Permission.DELETE_CART,
    Permission.VIEW_CART,

    // Wishlist
    Permission.CREATE_WISHLIST,
    Permission.DELETE_WISHLIST,
    Permission.VIEW_WISHLIST,

    // Review
    Permission.CREATE_REVIEW,
    Permission.UPDATE_REVIEW,
    Permission.DELETE_REVIEW,
  ],

  [Role.USER]: [
    // User
    Permission.UPDATE_USER,
    Permission.RESET_PASSWORD,
    Permission.CHANGE_PASSWORD,
    Permission.FORGOT_PASSWORD,
    Permission.LOGOUT,

    // Request
    Permission.UPDATE_REQUESTFORUSER,
    Permission.CREATE_REQUEST,
    Permission.VIEW_REQUEST_FOR_USER,

    // Certificate
    Permission.VIEW_CERTIFICATE_FOR_USER,

    // Cart
    Permission.CREATE_CART,
    Permission.UPDATE_CART,
    Permission.DELETE_CART,
    Permission.VIEW_CART,

    // Wishlist
    Permission.CREATE_WISHLIST,
    Permission.DELETE_WISHLIST,
    Permission.VIEW_WISHLIST,

    // Review
    Permission.CREATE_REVIEW,
    Permission.UPDATE_REVIEW,
    Permission.DELETE_REVIEW,
  ],

  [Role.INSTRUCTOR]: [
    // User
    Permission.UPDATE_USER,
    Permission.RESET_PASSWORD,
    Permission.CHANGE_PASSWORD,
    Permission.FORGOT_PASSWORD,
    Permission.LOGOUT,

    // Certificate
    Permission.VIEW_CERTIFICATE_FOR_USER,

    // Cart
    Permission.CREATE_CART,
    Permission.UPDATE_CART,
    Permission.DELETE_CART,
    Permission.VIEW_CART,

    // Wishlist
    Permission.CREATE_WISHLIST,
    Permission.DELETE_WISHLIST,
    Permission.VIEW_WISHLIST,

    // Review
    Permission.CREATE_REVIEW,
    Permission.UPDATE_REVIEW,
    Permission.DELETE_REVIEW,
  ],
};

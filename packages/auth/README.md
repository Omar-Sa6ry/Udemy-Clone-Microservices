# @course-platform/common

A shared package containing common utilities, guards, decorators, constants, and interfaces for the Course Platform microservices architecture.

## Installation

```bash
npm install @course-platform/common
```

## Features

### Guards
- **RoleGuard**: Authentication and authorization guard that validates JWT tokens and checks user roles and permissions
- Supports both REST and GraphQL contexts

### Decorators
- **@Auth()**: Protects routes with required permissions
- **@Roles()**: Specifies required roles for route access  
- **@CurrentUser()**: Injects the current user from the request context

### Constants
- **Enums**: User roles, permissions, course levels, and request statuses
- **Role-Permissions Mapping**: Defines which permissions each role has
- **Pagination**: Default limit and page values
- **Messages**: Common error and validation messages

### Interfaces
- Common TypeScript interfaces for user, JWT, and context objects

## Usage

### Basic Authentication

```typescript
import { Auth, CurrentUser } from '@course-platform/common';

@Resolver()
export class UserResolver {
  @Query(() => User)
  @Auth()
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
```

### Role-Based Access

```typescript
import { Roles, Role } from '@course-platform/common';

@Resolver()
export class AdminResolver {
  @Mutation(() => User)
  @Roles(Role.ADMIN)
  createUser(@Args('input') input: CreateUserInput) {
    // Only ADMIN role can access this
  }
}
```

### Permission-Based Access

```typescript
import { Auth, Permission } from '@course-platform/common';

@Resolver()
export class CourseResolver {
  @Mutation(() => Course)
  @Auth([Permission.CREATE_COURSE])
  createCourse(@Args('input') input: CreateCourseInput) {
    // Requires CREATE_COURSE permission
  }
}
```

## Available Roles

- **ADMIN**: Full system access with all permissions
- **INSTRUCTOR**: Can create and manage courses
- **USER**: Basic user permissions for learning and purchases

## Available Permissions

### User Management
- UPDATE_USER, DELETE_USER, EDIT_USER_ROLE, VIEW_USER, CREATE_INSTRUCTOR

### Authentication
- RESET_PASSWORD, CHANGE_PASSWORD, FORGOT_PASSWORD, LOGOUT

### Category Management
- CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY

### Course Management
- CREATE_COURSE, UPDATE_COURSE, DELETE_COURSE

### Request Management
- CREATE_REQUEST, UPDATE_REQUEST, DELETE_REQUEST, VIEW_REQUEST

### Certificate Management
- CREATE_CERTIFICATE, VIEW_CERTIFICATE, DELETE_CERTIFICATE

### Shopping Features
- CART operations: CREATE_CART, UPDATE_CART, DELETE_CART, VIEW_CART
- WISHLIST operations: CREATE_WISHLIST, DELETE_WISHLIST, VIEW_WISHLIST
- REVIEW operations: CREATE_REVIEW, UPDATE_REVIEW, DELETE_REVIEW

## Configuration

The RoleGuard requires these environment variables:

```env
JWT_SECRET=your-jwt-secret-key
```

## Dependencies

- @nestjs/common
- @nestjs/core
- @nestjs/graphql
- @nestjs/jwt
- @nestjs/passport
- nestjs-i18n
- passport
- passport-jwt
- typeorm
- reflect-metadata

## Development

### Building the Package

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

## Integration with Services

### In your service module:

```typescript
import { RoleGuard } from '@course-platform/common';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
```

### Required Dependencies in Service:

Make sure your service has these dependencies installed:

```bash
npm install @nestjs/jwt @nestjs/passport passport-jwt nestjs-i18n
```

## Error Messages

Common error messages included in the package:

- "User not found in request"
- "Password should be from 6 to 16 digits"
- "An error occurred"

## Pagination

Default pagination constants:

```typescript
import { LIMIT, PAGE } from '@course-platform/common';

// LIMIT = 12
// PAGE = 1
```

## License

This package is part of the Course Platform microservices architecture.
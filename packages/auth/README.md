@course-plateform/common - Udemy Clone Common Utilities
Overview
@course-plateform/common is a shared NPM package that provides common utilities, guards, decorators, constants, and authentication modules for the Udemy Clone microservices architecture. This package ensures consistency across all microservices by providing reusable components for authentication, authorization, and common functionality.

Features
Authentication & Authorization: Complete JWT-based authentication system
Role-Based Access Control (RBAC): Fine-grained permission management
GraphQL Integration: Decorators and guards optimized for GraphQL
Internationalization Support: Built-in i18n error messages
Type Safety: Full TypeScript support with type definitions
Modular Design: Easy to import and use across multiple services
Installation
From NPM Registry
npm install @course-plateform/common
Local Development
# In the common package directory
npm run build

# In consuming service directory
npm install ../common
Package Structure
dist/
├── index.js                    # Main export
├── index.d.ts                  # Type definitions
└── **/*.js                     # Compiled JavaScript files

src/
├── constants/
│   ├── enum.constant.ts        # Enums (Role, Permission, CourseLevel)
│   ├── messages.constant.ts    # Common messages and constants
│   └── rolePermissionsMap.constant.ts  # Role-permission mappings
├── decorators/
│   ├── auth.decorator.ts       # @Auth decorator
│   └── currentUser.decorator.ts # @CurrentUser decorator
├── guard/
│   └── role.guard.ts           # Role-based authorization guard
├── interfaces/
│   └── user.interface.ts       # TypeScript interfaces
├── modules/
│   └── auth.module.ts          # Dynamic authentication module
└── index.ts                    # Main export file
Usage
1. Authentication Module Setup
In your microservice's app.module.ts:
import { Module } from '@nestjs/common';
import { AuthCommonModule } from '@course-plateform/common';
import { UserService } from './user.service';

@Module({
  imports: [
    AuthCommonModule.register({
      userService: UserService,
      imports: [/* other modules if needed */],
      providers: [/* additional providers */],
    }),
  ],
  // ... other configurations
})
export class AppModule {}
Required Environment Variables:
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=36000s  # 10 hours
2. Using Decorators in Resolvers/Controllers
Protect endpoints with @Auth decorator:
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Auth, CurrentUser, Permission } from '@course-plateform/common';
import { CurrentUserDto } from './dto/current-user.dto';

@Resolver()
export class CourseResolver {
  @Auth([Permission.CREATE_COURSE, Permission.UPDATE_COURSE])
  @Mutation(() => CourseResponse)
  async createCourse(
    @CurrentUser() user: CurrentUserDto,
    @Args('input') createCourseInput: CreateCourseInput,
  ) {
    // Only users with CREATE_COURSE permission can access this
    return this.courseService.create(createCourseInput, user.id);
  }

  @Auth() // No specific permissions required, just authenticated
  @Query(() => UserResponse)
  async getProfile(@CurrentUser() user: CurrentUserDto) {
    return this.userService.findById(user.id);
  }
}
3. Available Constants
Roles:
import { Role } from '@course-plateform/common';

// Available roles:
Role.ADMIN      // 'admin'
Role.INSTRUCTOR // 'instructor'
Role.USER       // 'user'
Permissions:
import { Permission } from '@course-plateform/common';

// User permissions
Permission.UPDATE_USER
Permission.DELETE_USER
Permission.EDIT_USER_ROLE
Permission.VIEW_USER
Permission.CREATE_INSTRUCTOR

// Course permissions
Permission.CREATE_COURSE
Permission.UPDATE_COURSE
Permission.DELETE_COURSE

// Category permissions
Permission.CREATE_CATEGORY
Permission.UPDATE_CATEGORY
Permission.DELETE_CATEGORY

// And many more...
Common Constants:
import { Limit, Page, DelevaryPrice } from '@course-plateform/common';

// Pagination defaults
Limit  // 12 items per page
Page   // Default page 1

// Business constants
DelevaryPrice  // 20 (delivery price constant)
4. Role-Permission Mapping
The package includes predefined role-permission mappings:

Admin Permissions:
Full access to all user management
Category CRUD operations
Course CRUD operations
Request management
Certificate management
Cart and wishlist operations
Review management
User Permissions:
Self-profile management
Request creation and viewing
Certificate viewing
Cart and wishlist operations
Review management
Instructor Permissions:
Self-profile management
Section management (CREATE, UPDATE, DELETE)
Certificate viewing
Cart and wishlist operations
Review management
5. Custom User Service Interface
Your user service must implement the IUserService interface:

import { IUserService, IUser } from '@course-plateform/common';

@Injectable()
export class UserService implements IUserService {
  async findById(id: string): Promise<IUser> {
    // Implementation to find user by ID
    const user = await this.userRepository.findOne({ where: { id } });
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
6. Error Messages (i18n)
The package uses internationalization for error messages. Ensure your service has i18n configured with these keys:

{
  "user": {
    "NO_TOKEN": "No authentication token provided",
    "INVALID_TOKEN": "Invalid or expired token",
    "INSUFFICIENT_PERMISSIONS": "Insufficient permissions to access this resource"
  }
}
API Reference
Decorators
@Auth(permissions?: Permission[])
Protects a resolver/controller method with role-based authorization.

Parameters:

permissions (optional): Array of Permission enums required to access the endpoint
Example:

@Auth([Permission.CREATE_COURSE, Permission.UPDATE_COURSE])
@CurrentUser()
Extracts the current authenticated user from the request context.

Returns: CurrentUserDto containing user ID, email, and role

Example:

@CurrentUser() user: CurrentUserDto
Guards
RoleGuard
Main guard that handles JWT verification, role validation, and permission checking.

Features:

Extracts JWT token from Authorization header
Verifies token validity and expiration
Validates user role against required roles
Checks user permissions against required permissions
Attaches user object to request context
Modules
AuthCommonModule
Dynamic module that provides authentication infrastructure.

Configuration Options:

userService: Your service implementing IUserService interface
imports: Additional modules to import
providers: Additional providers to register
Constants
Enum Constants
Role: User roles (ADMIN, INSTRUCTOR, USER)
Permission: All available permissions in the system
CourseLevel: Course difficulty levels (BEGINNER, INTERMEDIATE, ADVANCED)
QuestionType: Quiz question types (MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER)
Configuration Constants
Limit: Default pagination limit (12)
Page: Default page number (1)
DelevaryPrice: Default delivery price (20)
Message Constants
CurrentUserMsg: "User not found in request"
PasswordValidator: "Password should be from 6 to 16 digits"
ExceptionFilterMsg: "An error occurred"
TypeScript Support
Interfaces
IUser
interface IUser {
  id: string;
  email: string;
  role: string; // Should match Role enum
}
IJwtPayload
interface IJwtPayload {
  sub: string;    // User ID
  email: string;  // User email
  role: string;   // User role
  iat?: number;   // Issued at timestamp
  exp?: number;   // Expiration timestamp
}
IUserService
interface IUserService {
  findById(id: string): Promise<IUser>;
}
Integration Examples
1. Complete Service Integration
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthCommonModule } from '@course-plateform/common';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({ /* database config */ }),
    GraphQLModule.forRoot({ /* GraphQL config */ }),
    AuthCommonModule.register({
      userService: UserService,
      imports: [TypeOrmModule.forFeature([/* entities */])],
    }),
    UserModule,
  ],
})
export class AppModule {}

// user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserService, IUser } from '@course-plateform/common';
import { User } from './user.entity';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}

// course/course.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Auth, CurrentUser, Permission } from '@course-plateform/common';
import { CourseService } from './course.service';
import { CreateCourseInput } from './dto/create-course.input';

@Resolver()
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Auth([Permission.CREATE_COURSE])
  @Mutation(() => CourseResponse)
  async createCourse(
    @CurrentUser() user: CurrentUserDto,
    @Args('input') createCourseInput: CreateCourseInput,
  ) {
    return this.courseService.create({
      ...createCourseInput,
      instructorId: user.id,
    });
  }
}
2. Testing Authorization
import { Test, TestingModule } from '@nestjs/testing';
import { Auth, CurrentUser } from '@course-plateform/common';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should have @Auth decorator on protected methods', () => {
    const metadata = Reflect.getMetadata(
      'permissions',
      UserResolver.prototype.getProfile,
    );
    expect(metadata).toBeDefined();
  });
});
Development
Building the Package
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode for development
npm run dev
Publishing
# Build before publishing
npm run build

# Publish to NPM registry
npm publish --access public
Versioning
The package follows semantic versioning:

Major version: Breaking changes
Minor version: New features, backward compatible
Patch version: Bug fixes, backward compatible
Dependencies
Runtime Dependencies
@nestjs/common: NestJS common utilities
@nestjs/core: NestJS core framework
@nestjs/graphql: GraphQL integration
@nestjs/jwt: JWT handling
@nestjs/passport: Authentication strategies
nestjs-i18n: Internationalization support
passport: Authentication middleware
passport-jwt: JWT authentication strategy
reflect-metadata: TypeScript metadata reflection
typeorm: Database ORM (for type definitions)
Development Dependencies
@types/node: Node.js TypeScript definitions
@types/passport-jwt: JWT TypeScript definitions
typescript: TypeScript compiler
Best Practices
1. Always Implement IUserService
Ensure your user service correctly implements the findById method and returns the required IUser interface.

2. Use Permission-Based Authorization
Prefer specific permissions over role checks for fine-grained control:

// Good
@Auth([Permission.CREATE_COURSE])

// Avoid
@Auth() // Too permissive
3. Handle Errors Gracefully
The guard throws standardized errors. Handle them in your global exception filter:

import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { UnauthorizedException } from '@course-plateform/common';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements GqlExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    // Custom error handling
    return new GraphQLError(exception.message, {
      extensions: { code: 'UNAUTHORIZED' },
    });
  }
}
4. Test Authorization Logic
Write comprehensive tests for your authorization logic:

describe('Authorization', () => {
  it('should allow admin to create categories', async () => {
    // Mock JWT token with admin role
    // Test that endpoint is accessible
  });

  it('should deny user from creating categories', async () => {
    // Mock JWT token with user role
    // Test that endpoint throws UnauthorizedException
  });
});
Troubleshooting
Common Issues
"USER_SERVICE not provided in AuthCommonModule context"

Ensure you're passing your UserService to AuthCommonModule.register()
Verify your UserService implements IUserService interface
JWT verification failures

Check that JWT_SECRET environment variable matches across services
Verify token expiration configuration
Permission validation errors

Check that user roles are correctly mapped in your database
Verify that the role-permission mapping covers all required permissions
GraphQL context issues

Ensure GraphQL context is properly configured to pass the request object
Check that the @CurrentUser() decorator is used within protected resolvers
Debug Mode
For debugging authentication issues, you can enable verbose logging:

// In your guard or service
console.log('Token:', token);
console.log('Payload:', payload);
console.log('User:', user);
console.log('Required permissions:', requiredPermissions);
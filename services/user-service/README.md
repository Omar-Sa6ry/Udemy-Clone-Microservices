# User Service - Udemy Clone

## Overview

User Service is a core microservice in the Udemy Clone application that handles user management, profiles, and authentication-related operations. It manages user accounts, profiles, roles, and provides user data to other services. Built with NestJS, GraphQL, TypeORM, and PostgreSQL, implementing design patterns for maintainability and scalability.

## Features

- Complete user management (create, update, delete users)
- Profile management with avatar uploads
- Role-based access control (User, Instructor, Admin)
- Redis caching for performance optimization
- Observer pattern for cache invalidation
- State pattern for role transitions
- Factory pattern for object creation
- GraphQL API with optimized queries
- Microservice communication via NATS
- Transactional operations
- Authentication and authorization
- Pagination and filtering

## Tech Stack

- **Framework**: NestJS
- **GraphQL**: Apollo Server
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Message Broker**: NATS
- **File Upload**: Integrated upload service
- **Validation**: class-validator with i18n
- **Design Patterns**: Observer, State, Factory, Facade

## Project Structure

```
src/
├── modules/
│   └── users/
│       ├── entities/            # Database entities
│       ├── inputs/              # GraphQL input types
│       ├── dtos/                # Data Transfer Objects
│       ├── loader/              # DataLoader implementations
│       ├── facade/              # Business logic facade
│       ├── proxy/               # Data access proxy
│       ├── factories/           # Factory pattern implementations
│       ├── interfaces/          # TypeScript interfaces
│       ├── observer/            # Observer pattern
│       ├── state/               # State pattern
│       ├── users.controller.ts
│       ├── users.module.ts
│       ├── users.resolver.ts
│       └── users.service.ts
├── common/
│   └── nats/                    # NATS communication service
└── app.module.ts
```

## Design Patterns Implemented

### 1. Factory Pattern

- **UserFactory**: Handles user object creation and updates
- **ProfileFactory**: Manages profile object creation and updates

### 2. State Pattern

- **UserRoleContext**: Manages user role transitions
- **IUserRoleState**: Interface for role state implementations
- **AdminState/UserState**: Concrete state implementations

### 3. Observer Pattern

- **CacheObserver**: Observes user changes for cache invalidation
- **IUserObserver**: Interface for observer implementations

### 4. Facade Pattern

- **UserFacadeService**: Provides simplified interface for complex user operations

### 5. Proxy Pattern

- **UserProxy**: Acts as intermediary for user repository operations with caching

## Core Entities

### 1. User Entity

- User account information
- Role management (USER, INSTRUCTOR, ADMIN)
- Contact information (phone, whatsapp, email)
- One-to-one relationship with Profile

### 2. Profile Entity

- User profile information
- Bio, headline, and social links
- Avatar image upload support
- One-to-one relationship with User

## Roles and Permissions

### User Roles

1. **USER**: Regular student user
2. **INSTRUCTOR**: Course instructor with teaching capabilities
3. **ADMIN**: System administrator with full access

### Role Transitions

- USER → ADMIN (promotion by admin)
- USER → INSTRUCTOR (application approval)
- ADMIN → USER (demotion)
- Role transitions follow state pattern for business logic encapsulation

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- NATS server
- Docker (optional)

### Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create `.env` file):
   ```
   DB_HOST=localhost
   DB_PORT=5432
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   DB_NAME=user_db
   NATS_URL=nats://localhost:4222
   PORT=3001
   REDIS_HOST=localhost
   REDIS_PORT=6379
   UPLOAD_PATH=./uploads
   ```
4. Run database migrations (if applicable)
5. Start the service:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### GraphQL Playground

Access at: `http://localhost:3001/user/graphql`

### Queries

#### Get User by ID

```graphql
query {
  getUserById(id: { UserId: "user_id_here" }) {
    success
    message
    data {
      id
      firstName
      lastName
      fullName
      phone
      email
      role
      profile {
        id
        bio
        headline
        avatar
        website_url
        linkedin_url
        youtube_url
      }
      createdAt
      updatedAt
    }
  }
}
```

#### Get User by Email

```graphql
query {
  getUserByEmail(email: { email: "user@example.com" }) {
    success
    message
    data {
      id
      firstName
      lastName
      fullName
      phone
      email
      role
    }
  }
}
```

#### Get All Users

```graphql
query {
  getUsers(page: 1, limit: 10) {
    success
    message
    items {
      id
      firstName
      lastName
      fullName
      email
      role
    }
    pagination {
      totalItems
      totalPages
      currentPage
    }
  }
}
```

#### Get All Instructors

```graphql
query {
  getInstructors(page: 1, limit: 10) {
    success
    message
    items {
      id
      firstName
      lastName
      fullName
      email
      profile {
        headline
        avatar
      }
    }
    pagination {
      totalItems
      totalPages
      currentPage
    }
  }
}
```

#### Get User Count

```graphql
query {
  getUsersCount {
    success
    message
    data
  }
}
```

#### Get Instructors Count

```graphql
query {
  getInstructorsCount {
    success
    message
    data
  }
}
```

### Mutations (Require Authentication)

#### Update User

```graphql
mutation {
  updateUser(
    updateUserDto: {
      firstName: "John"
      lastName: "Updated"
      phone: "+201234567890"
      whatsapp: "+201234567890"
    }
  ) {
    success
    message
    data {
      id
      firstName
      lastName
      fullName
      phone
      whatsapp
      updatedAt
    }
  }
}
```

#### Update Profile

```graphql
mutation {
  updateProfile(updateUserDto: {
    bio: "Updated bio information",
    headline: "Senior Software Engineer",
    website_url: "https://example.com",
    linkedin_url: "https://linkedin.com/in/example",
    youtube_url: "https://youtube.com/c/example",
    avatar: {
      filename: "avatar.jpg",
      mimetype: "image/jpeg",
      encoding: "base64",
      createReadStream: () => Stream
    }
  }) {
    success
    message
    data {
      id
      bio
      headline
      avatar
      website_url
      linkedin_url
      youtube_url
    }
  }
}
```

#### Delete User

```graphql
mutation {
  deleteUser(id: { UserId: "user_id_here" }) {
    success
    message
  }
}
```

#### Promote User to Admin

```graphql
mutation {
  updateUserRoleToAdmin(id: { UserId: "user_id_here" }) {
    success
    message
    data {
      id
      role
    }
  }
}
```

#### Create Instructor

```graphql
mutation {
  createInstractor(id: { UserId: "user_id_here" }) {
    success
    message
    data {
      id
      role
    }
  }
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(201),
    phone VARCHAR(20) UNIQUE NOT NULL,
    whatsapp VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'USER' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_id ON users(id);
CREATE INDEX idx_users_phone ON users(phone);
```

### Profiles Table

```sql
CREATE TABLE profiles (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio VARCHAR(200),
    headline VARCHAR(100) NOT NULL,
    avatar VARCHAR(255),
    youtube_url VARCHAR(255),
    website_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

## Caching Strategy

### Redis Implementation

- User data cached with key: `user:{id}`
- User email lookup cached with key: `user:email:{email}`
- Counts cached: `user-count`, `instructor-count`
- Cache invalidation via Observer pattern
- Cache-aside pattern for read operations

### Cache Observer

- Automatically invalidates cache on user updates
- Handles cache updates on user deletion
- Ensures cache consistency across operations

## External Service Integrations

### NATS Events

The service emits events for other services:

- `user.updated`: When user information is updated
- `user.profile_updated`: When user profile is updated
- `user.instructor_created`: When a user becomes an instructor
- `user.role_changed`: When user role changes
- `user.deleted`: When a user is deleted
- `user.queried`: When user data is queried

### NATS Message Patterns

The service listens for NATS messages:

- `user.exists`: Check if user exists
- `user.dataExists`: Check if user data (email/phone) exists
- `user.checkIfInstractor`: Check if user is instructor
- `user.findUsersWithIds`: Get multiple users by IDs
- `user.update_user`: Update user information
- `user.update_profile`: Update user profile
- `user.delete`: Delete user
- `user.get_instructors`: Get all instructors
- `UserEvents.GET_USER_BY_ID`: Get user by ID
- `UserEvents.GET_USER_BY_EMAIL`: Get user by email
- `UserEvents.USER_DATA_EXISTED`: Check user data existence
- `UserEvents.CREATE_USER_DATA`: Create new user

## Error Handling

- Custom exceptions with i18n support
- Validation errors for input data
- Service communication timeouts
- Database constraint violations
- Business rule validations

## Security

### Authentication & Authorization

- JWT-based authentication
- Permission-based authorization:
  - `VIEW_USER`: View user information
  - `UPDATE_USER`: Update user information
  - `DELETE_USER`: Delete user
  - `EDIT_USER_ROLE`: Change user roles
- Role-based access control

### Data Validation

- Input validation using class-validator
- Email format validation
- Phone number validation
- Unique constraint enforcement
- SQL injection prevention through TypeORM

### File Upload Security

- File type validation
- File size limits
- Secure file storage
- Avatar image processing

## Performance Optimizations

### 1. Caching

- Redis for user data and counts
- DataLoader for batch profile loading
- Request-scoped caching within GraphQL resolvers
- Reduces N+1 query problems

### 2. Database

- Indexed columns for faster queries
- Unique constraints for data integrity
- Efficient pagination implementation
- Optimized relationships

### 3. Microservices

- Async communication via NATS
- Event-driven architecture
- Timeout handling for external calls
- Circuit breaker pattern implementation

### 4. Design Patterns

- Factory pattern for object creation
- State pattern for role transitions
- Observer pattern for cache invalidation
- Facade pattern for simplified interfaces

## Docker

To run with Docker:

```bash
docker build -t user-service .
docker run -p 3001:3001 --env-file .env user-service
```

## Development

### Available Scripts

- `npm run start`: Start in production mode
- `npm run start:dev`: Start in development mode with watch
- `npm run test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run build`: Build the application

### Code Generation

The service uses GraphQL code-first approach. Schema is automatically generated at `src/schema.gql`.

## Dependencies

### Main Dependencies

- @nestjs/common: NestJS core framework
- @nestjs/graphql: GraphQL integration
- @nestjs/typeorm: TypeORM integration
- typeorm: ORM for PostgreSQL
- @nestjs/microservices: Microservices support
- nats: NATS client
- nestjs-i18n: Internationalization
- typeorm-transactional: Transaction management
- dataloader: GraphQL DataLoader implementation
- ioredis: Redis client
- @bts-soft/upload: File upload service
- @bts-soft/core: Core utilities and interceptors

### Dev Dependencies

- @nestjs/cli: NestJS CLI tools
- typescript: TypeScript compiler
- ts-node: TypeScript execution

## Testing

- Unit tests for user logic and role transitions
- Integration tests for API endpoints
- Mock external service dependencies
- Test database transactions
- Edge case testing for caching

## Monitoring & Logging

- Database query logging
- NATS communication logging
- User activity tracking
- Error logging with stack traces
- Performance metrics for caching

## Contributing

1. Follow the existing code structure and patterns
2. Add tests for new features
3. Update documentation
4. Ensure internationalization support
5. Follow TypeScript best practices
6. Consider performance implications
7. Maintain data consistency

## Notes

- User service is the central identity management service
- Implements multiple design patterns for maintainability
- Caching strategy ensures high performance
- Role transitions follow state pattern for business logic
- Observer pattern ensures cache consistency
- Factory pattern simplifies object creation
- NATS events enable loose coupling with other services
- File uploads handled securely with validation
- The service is designed for scalability and high concurrency

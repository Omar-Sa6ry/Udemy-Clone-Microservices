# Certificate Service - Udemy Clone

## Overview
Certificate Service is a microservice in the Udemy Clone application that handles certificate management for course completions. It manages the issuance, validation, and retrieval of certificates for users who have completed courses, with integration to user and course services.

## Features
- Certificate issuance for completed courses
- Certificate validation and verification
- Redis caching for performance optimization
- Email notifications for certificate issuance
- DataLoader implementation for efficient data fetching
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
- **Email Notifications**: Integrated notification service
- **Validation**: class-validator with i18n

## Project Structure
```
src/
├── modules/
│   └── certificate/
│       ├── entity/              # Database entities
│       ├── inputs/              # GraphQL input types
│       ├── dto/                 # Data Transfer Objects
│       ├── dataLoader/          # DataLoader implementations
│       ├── facade/              # Business logic facade
│       ├── proxy/               # Data access proxy
│       ├── certificate.controller.ts
│       ├── certificate.module.ts
│       ├── certificate.resolver.ts
│       └── certificate.service.ts
├── common/
│   └── nats/                    # NATS communication service
└── app.module.ts
```

## Core Components

### 1. Certificate Entity
- Represents certificate data with user and course references
- Unique constraint on (userId, courseId) pairs
- Indexed for optimized queries

### 2. CertificateProxy
- Handles data access with Redis caching
- Validates certificate existence
- Manages certificate retrieval with user and course data
- Implements pagination and filtering

### 3. CertificateFascade
- Orchestrates certificate creation and deletion
- Sends email notifications
- Manages Redis cache invalidation
- Coordinates with user and course services

### 4. CertificateLoader
- Implements DataLoader pattern for N+1 query optimization
- Batch loads user and course data
- Request-scoped for optimal performance

### 5. CertificateResolver
- GraphQL resolver with field resolvers
- Authentication and authorization
- Query and mutation handlers

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
   DB_NAME_CERTIFICATE=certificate_db
   NATS_URL=nats://localhost:4222
   PORT_CERTIFICATE=3005
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
4. Run database migrations (if applicable)
5. Start the service:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### GraphQL Playground
Access at: `http://localhost:3005/certificate/graphql`

### Queries
1. **Get Certificate by ID**:
   ```graphql
   query {
     getCertificateById(id: { certificateId: "certificate_id_here" }) {
       success
       message
       data {
         id
         createdAt
         user {
           id
           name
           email
         }
         course {
           _id
           title
           description
         }
       }
     }
   }
   ```

2. **Get Certificates (with filtering)**:
   ```graphql
   query {
     getCertificates(
       findCertificateInput: { 
         userId: "user_id_here",
         courseId: "course_id_here"
       },
       page: 1,
       limit: 10
     ) {
       success
       message
       items {
         id
         createdAt
       }
       pagination {
         totalItems
         totalPages
         currentPage
       }
     }
   }
   ```

3. **Get Certificates for Current User**:
   ```graphql
   query {
     getCertificateByIdForUser {
       success
       message
       items {
         id
         createdAt
         course {
           _id
           title
           description
         }
       }
     }
   }
   ```

### Mutations (Require Authentication)
1. **Delete Certificate**:
   ```graphql
   mutation {
     deleteCertificate(id: { certificateId: "certificate_id_here" }) {
       success
       message
     }
   }
   ```

## Microservice Events
The service listens for NATS events:
- `CHECK_CERTIFICATE_EXISTED`: Check if a certificate exists for a user and course

## Database Schema
```sql
CREATE TABLE certificates (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_certificates_user_id ON certificates(user_id);
```

## External Service Integrations

### User Service Integration
- Fetches user details via NATS messages
- Uses `UserEvents.GET_USER_BY_ID` and `UserEvents.GET_USER_BY_IDS`
- Timeout handling for resilience

### Course Service Integration
- Fetches course details via NATS messages
- Uses `CourseEvents.GET_COURSE_BY_ID` and `CourseEvents.GET_COURSES_BY_ID`
- Error handling for service unavailability

### Notification Service
- Sends email notifications for certificate issuance
- Uses `ChannelType.EMAIL` for notification delivery
- Configurable notification templates

## Caching Strategy

### Redis Implementation
- Certificate data cached with key: `certificate:{id}`
- Cache invalidation on updates and deletions
- Cache-aside pattern for read operations
- TTL configuration for automatic expiry

### DataLoader Optimization
- Batch loading of user and course data
- Request-scoped caching within GraphQL resolvers
- Reduces N+1 query problems

## Error Handling
- Custom exceptions with i18n support
- Validation errors for input data
- Service communication timeouts
- Database transaction rollback
- Redis cache fallback mechanisms

## Security
- Authentication decorators (`@Auth`)
- Permission-based authorization:
  - `DELETE_CERTIFICATE`: Delete certificates
  - `VIEW_CERTIFICATE`: View all certificates
  - `VIEW_CERTIFICATE_FOR_USER`: View own certificates
- Input validation using class-validator
- SQL injection prevention through TypeORM

## Performance Optimizations

### 1. Caching
- Redis for certificate data
- DataLoader for batch queries
- Efficient pagination implementation

### 2. Database
- Indexed columns for faster queries
- Unique constraints for data integrity
- Transactional operations for consistency

### 3. Microservices
- Async communication via NATS
- Timeout handling for external calls
- Circuit breaker pattern (implied)

## Docker
To run with Docker:
```bash
docker build -t certificate-service .
docker run -p 3005:3005 --env-file .env certificate-service
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

### Dev Dependencies
- @nestjs/cli: NestJS CLI tools
- typescript: TypeScript compiler
- ts-node: TypeScript execution

## Monitoring & Logging
- Database query logging
- NATS communication logging
- Redis cache operations
- Email notification tracking
- Error logging with stack traces

## Testing
- Unit tests for services and resolvers
- Integration tests for API endpoints
- Mock external service dependencies
- Test database transactions
- Cache invalidation tests

## Contributing
1. Follow the existing code structure and patterns
2. Add tests for new features
3. Update documentation
4. Ensure internationalization support
5. Follow TypeScript best practices
6. Consider performance implications
7. Maintain cache consistency


## Notes
- Certificates are automatically issued upon course completion
- Each user can have only one certificate per course
- Certificates cannot be modified once issued (only deleted)
- Certificate data includes references to user and course for completeness
- The service is designed for high concurrency with caching and batching
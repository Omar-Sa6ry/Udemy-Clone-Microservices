# Review Service - Udemy Clone

## Overview

Review Service is a microservice in the Udemy Clone application that handles course reviews and ratings functionality. It manages user reviews for courses, including rating submission, comment posting, and course rating calculations. Built with NestJS, GraphQL, TypeORM, and PostgreSQL.

## Features

- Complete review management (create, update, delete reviews)
- Rating system with 1-5 star ratings
- Course rating average and count calculations
- DataLoader implementation for efficient data fetching
- Integration with certificate service for purchase validation
- GraphQL API with optimized queries
- Microservice communication via NATS
- Transactional operations with rating updates
- Authentication and authorization
- Pagination and filtering

## Tech Stack

- **Framework**: NestJS
- **GraphQL**: Apollo Server
- **Database**: PostgreSQL with TypeORM
- **Message Broker**: NATS
- **Validation**: class-validator with i18n
- **Transactions**: TypeORM transactional operations

## Project Structure

```
src/
├── modules/
│   └── review/
│       ├── entity/              # Database entities
│       ├── inputs/              # GraphQL input types
│       ├── dto/                 # Data Transfer Objects
│       ├── dataLoader/          # DataLoader implementations
│       ├── facade/              # Business logic facade
│       ├── proxy/               # Data access proxy
│       ├── review.module.ts
│       ├── review.resolver.ts
│       └── review.service.ts
├── common/
│   └── nats/                    # NATS communication service
└── app.module.ts
```

## Core Components

### 1. Review Entity

- Represents user reviews for courses
- Unique constraint on (studentId, courseId) pairs
- Rating validation (1-5 stars)
- Approval status for moderation

### 2. ReviewProxy

- Handles data access and retrieval
- Validates review existence
- Manages review filtering and pagination
- Implements business validation rules

### 3. ReviewFascade

- Orchestrates review creation, update, and deletion
- Updates course rating averages and counts
- Validates certificate ownership
- Manages transactional operations

### 4. ReviewLoaders

- Implements DataLoader pattern for N+1 query optimization
- Batch loads user and course data
- Request-scoped for optimal performance

### 5. ReviewResolver

- GraphQL resolver with field resolvers
- Authentication and authorization
- Query and mutation handlers

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL
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
   DB_NAME_REVIEW=review_db
   NATS_URL=nats://localhost:4222
   PORT_REVIEW=3007
   ```
4. Run database migrations (if applicable)
5. Start the service:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### GraphQL Playground

Access at: `http://localhost:3007/review/graphql`

### Queries

1. **Get Review by ID**:

   ```graphql
   query {
     findReviewById(id: "review_id_here") {
       success
       message
       data {
         id
         rating
         comment
         createdAt
         student {
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

2. **Get Reviews (with filtering)**:
   ```graphql
   query {
     findReviews(
       findReviewInput: {
         courseId: "course_id_here"
         studentId: "student_id_here"
       }
     ) {
       success
       message
       items {
         id
         rating
         comment
         createdAt
         student {
           id
           name
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

### Mutations (Require Authentication)

1. **Create Review**:

   ```graphql
   mutation {
     createReview(
       createReviewInput: {
         courseId: "course_id_here"
         rating: 4.5
         comment: "Great course! Learned a lot."
       }
     ) {
       success
       message
       data {
         id
         rating
         comment
         createdAt
       }
     }
   }
   ```

2. **Update Review**:

   ```graphql
   mutation {
     updateReview(
       updateReviewInput: {
         id: "review_id_here"
         rating: 5
         comment: "Updated review - even better than I thought!"
       }
     ) {
       success
       message
       data {
         id
         rating
         comment
         updatedAt
       }
     }
   }
   ```

3. **Delete Review**:
   ```graphql
   mutation {
     deleteReview(id: "review_id_here") {
       success
       message
     }
   }
   ```

## Business Rules

### Review Creation

1. User must have purchased the course (certificate validation)
2. User can only review a course once
3. Rating must be between 1-5
4. Review is automatically approved (isApproved: true)

### Review Updates

1. Only the original reviewer can update their review
2. Rating updates affect course average rating
3. Comment can be updated independently

### Review Deletion

1. Only the original reviewer can delete their review
2. Deletion affects course rating average and count
3. Course rating is recalculated

### Course Rating Calculations

- When a review is created:

  ```
  new_avg = ((old_avg * (count-1)) + new_rating) / count
  count = count + 1
  ```

- When a review is updated:

  ```
  new_avg = ((old_avg * count) - old_rating + new_rating) / count
  ```

- When a review is deleted:
  ```
  new_avg = ((old_avg * count) - deleted_rating) / (count - 1)
  count = count - 1
  ```

## External Service Integrations

### Certificate Service Integration

- Validates course purchase via NATS
- Uses `CertificateEvents.CHECK_CERTIFICATE_EXISTED`
- Prevents reviews from non-purchasers

### Course Service Integration

- Fetches course details via NATS
- Updates course rating averages using `CourseEvents.UPDATE_COURSE`
- Uses `CourseEvents.GET_COURSE_BY_ID` and `CourseEvents.GET_COURSES_BY_ID`

### User Service Integration

- Fetches user details via NATS
- Uses `UserEvents.GET_USER_BY_ID` and `UserEvents.GET_USER_BY_IDS`
- Timeout handling for resilience

## Database Schema

```sql
CREATE TABLE reviews (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    rating DECIMAL(10,2) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(100),
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(student_id, course_id)
);

CREATE INDEX idx_reviews_course_id ON reviews(course_id);
CREATE INDEX idx_reviews_student_id ON reviews(student_id);
```

## Error Handling

- Custom exceptions with i18n support
- Validation errors for input data
- Service communication timeouts
- Database constraint violations
- Business rule validations

## Security

- Authentication decorators (`@Auth`)
- Permission-based authorization:
  - `CREATE_REVIEW`: Create reviews
  - `UPDATE_REVIEW`: Update reviews
  - `DELETE_REVIEW`: Delete reviews
- Input validation using class-validator
- Rating range validation (1-5)
- SQL injection prevention through TypeORM

## Performance Optimizations

### 1. DataLoader

- Batch loading of user and course data
- Request-scoped caching within GraphQL resolvers
- Reduces N+1 query problems

### 2. Database

- Indexed columns for faster queries
- Unique constraints for data integrity
- Efficient pagination implementation

### 3. Microservices

- Async communication via NATS
- Timeout handling for external calls
- Circuit breaker pattern implementation

### 4. Transactions

- Atomic operations for review and rating updates
- Rollback on failure
- Data consistency guarantees

## Docker

To run with Docker:

```bash
docker build -t review-service .
docker run -p 3007:3007 --env-file .env review-service
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

### Dev Dependencies

- @nestjs/cli: NestJS CLI tools
- typescript: TypeScript compiler
- ts-node: TypeScript execution

## Testing

- Unit tests for review logic and rating calculations
- Integration tests for API endpoints
- Mock external service dependencies
- Test database transactions
- Edge case testing for rating calculations

## Monitoring & Logging

- Database query logging
- NATS communication logging
- Review creation and update tracking
- Error logging with stack traces
- Performance metrics for rating calculations

## Contributing

1. Follow the existing code structure and patterns
2. Add tests for new features
3. Update documentation
4. Ensure internationalization support
5. Follow TypeScript best practices
6. Consider performance implications
7. Maintain data consistency in rating calculations

## License

This project is part of the Udemy Clone application.

## Notes

- Reviews require course purchase verification
- Rating calculations are transactional and consistent
- Each user can review a course only once
- Course ratings are automatically updated
- The service supports review moderation (isApproved flag)
- DataLoader pattern optimizes GraphQL queries
- NATS communication ensures loose coupling with other services

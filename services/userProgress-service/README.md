# User Progress Service - Udemy Clone

## Overview
User Progress Service is a microservice in the Udemy Clone application that tracks and manages user learning progress across courses and lessons. It monitors lesson completion, watch time, course progress, and automatically triggers certificate issuance upon course completion. Built with NestJS, GraphQL, TypeORM, and PostgreSQL.

## Features
- Track user progress across lessons and courses
- Monitor lesson completion status
- Record and accumulate watch time
- Automatic certificate issuance upon course completion
- Progress statistics and analytics
- Course completion percentage calculation
- User learning statistics
- GraphQL API with comprehensive queries
- Microservice communication via NATS
- Transactional operations
- Authentication and authorization

## Tech Stack
- **Framework**: NestJS
- **GraphQL**: Apollo Server
- **Database**: PostgreSQL with TypeORM
- **Message Broker**: NATS
- **Validation**: class-validator with i18n
- **Architecture**: Proxy and Facade patterns

## Project Structure
```
src/
├── modules/
│   └── userProgress/
│       ├── entity/              # Database entities
│       ├── inputs/              # GraphQL input types
│       ├── dtos/                # Data Transfer Objects
│       ├── proxy/               # Data access proxy
│       ├── facade/              # Business logic facade
│       ├── userProgress.module.ts
│       ├── userProgress.resolver.ts
│       └── userProgress.service.ts
├── common/
│   └── nats/                    # NATS communication service
└── app.module.ts
```

## Core Components

### 1. UserProgress Entity
- Tracks user progress for each lesson
- Records completion status and watch time
- Links user, lesson, and course
- Indexed for optimized queries

### 2. UserProgressProxy
- Handles data access and retrieval
- Implements progress calculations and statistics
- Manages complex queries with filtering
- Provides course progress analytics

### 3. UserProgressFascade
- Orchestrates progress tracking operations
- Manages certificate issuance triggers
- Handles business logic for progress updates
- Coordinates with external services

### 4. UserProgressResolver
- GraphQL resolver with comprehensive queries and mutations
- Progress tracking and statistics endpoints
- Course completion management

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
   DB_NAME_USER_PROGRESS=user_progress_db
   NATS_URL=nats://localhost:4222
   PORT_USER_PROGRESS=3009
   ```
4. Run database migrations (if applicable)
5. Start the service:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### GraphQL Playground
Access at: `http://localhost:3009/userProgress/graphql`

### Mutations

#### Create User Progress
```graphql
mutation {
  createUserProgress(
    createUserProgressInput: {
      userId: "user_id_here",
      lessonId: "lesson_id_here",
      courseId: "course_id_here",
      completed: false,
      watch_time_seconds: 0
    }
  ) {
    success
    message
    data {
      id
      userId
      lessonId
      courseId
      completed
      watch_time_seconds
      createdAt
      updatedAt
    }
  }
}
```

#### Update User Progress
```graphql
mutation {
  updateUserProgress(
    updateUserProgressInput: {
      id: "progress_id_here",
      completed: true,
      watch_time_seconds: 1200
    }
  ) {
    success
    message
    data {
      id
      completed
      watch_time_seconds
      updatedAt
    }
  }
}
```

#### Update User Progress by User and Lesson
```graphql
mutation {
  updateUserProgressByUserAndLesson(
    userId: "user_id_here",
    lessonId: "lesson_id_here",
    updateUserProgressInput: {
      id: "progress_id_here",
      completed: true,
      watch_time_seconds: 1800
    }
  ) {
    success
    message
    data {
      id
      completed
      watch_time_seconds
    }
  }
}
```

#### Delete User Progress
```graphql
mutation {
  deleteUserProgress(id: "progress_id_here") {
    success
    message
  }
}
```

#### Mark Lesson as Completed
```graphql
mutation {
  markLessonAsCompleted(
    userId: "user_id_here",
    lessonId: "lesson_id_here"
  ) {
    success
    message
    data {
      id
      completed
      updatedAt
    }
  }
}
```

#### Update Lesson Watch Time
```graphql
mutation {
  updateLessonWatchTime(
    userId: "user_id_here",
    lessonId: "lesson_id_here",
    seconds: 300
  ) {
    success
    message
    data {
      id
      watch_time_seconds
      updatedAt
    }
  }
}
```

### Queries

#### Get User Progress List (with filtering)
```graphql
query {
  userProgressList(
    filter: {
      userId: "user_id_here",
      courseId: "course_id_here",
      completed: true
    },
    page: 1,
    limit: 10
  ) {
    success
    message
    items {
      id
      userId
      lessonId
      courseId
      completed
      watch_time_seconds
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

#### Get User Progress by ID
```graphql
query {
  userProgress(id: "progress_id_here") {
    success
    message
    data {
      id
      userId
      lessonId
      courseId
      completed
      watch_time_seconds
      createdAt
      updatedAt
    }
  }
}
```

#### Get User Progress by User and Lesson
```graphql
query {
  userProgressByUserAndLesson(
    userId: "user_id_here",
    lessonId: "lesson_id_here"
  ) {
    success
    message
    data {
      id
      completed
      watch_time_seconds
      createdAt
      updatedAt
    }
  }
}
```

#### Get Course Progress
```graphql
query {
  getCourseProgress(
    userId: "user_id_here",
    courseId: "course_id_here"
  ) {
    success
    message
    data {
      courseId
      total_lessons
      completed_lessons
      progress_percentage
      total_watch_time
    }
  }
}
```

#### Get User Progress Statistics
```graphql
query {
  getUserProgressStats(userId: "user_id_here") {
    success
    message
    data {
      total_courses_enrolled
      total_lessons_completed
      total_watch_time_hours
    }
  }
}
```

## Database Schema

### User Progress Table
```sql
CREATE TABLE user_progress (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(26) NOT NULL,
    lesson_id VARCHAR(26) NOT NULL,
    course_id VARCHAR(26) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    watch_time_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX idx_user_progress_user_lesson ON user_progress(user_id, lesson_id);
```

## Business Rules

### Progress Tracking
1. Each user can have one progress record per lesson
2. Progress records are unique per (user_id, lesson_id) combination
3. Watch time accumulates with each update
4. Completion status can be toggled

### Certificate Issuance
1. Certificates are automatically created when a lesson is marked as completed
2. Certificate creation triggers via NATS message to Certificate Service
3. Only one certificate per user per course

### Progress Calculations
1. Course progress percentage = (completed_lessons / total_lessons) × 100
2. Watch time is stored in seconds, displayed in hours for statistics
3. Statistics include totals across all courses

## External Service Integrations

### Certificate Service Integration
- Automatically creates certificates via NATS
- Uses `CertificateEvents.CREAE_CERTIFICATE` event
- Triggered when lessons are marked as completed

### Course Service Integration
- Validates course and lesson existence via NATS
- Fetches course details using `CourseEvents.GET_COURSE_BY_ID`
- Gets lesson details using `CourseEvents.GET_LESSON_BY_ID`

### User Service Integration
- Validates user existence via NATS
- Fetches user details using `UserEvents.GET_USER_BY_ID`

## Progress Analytics

### Course Progress Metrics
- Total lessons in course
- Completed lessons count
- Progress percentage
- Total watch time in seconds

### User Statistics
- Total courses enrolled
- Total lessons completed
- Total watch time in hours

## Error Handling
- Custom exceptions with i18n support
- Validation errors for input data
- Service communication timeouts
- Database constraint violations
- Business rule validations

## Security

### Authentication & Authorization
- JWT-based authentication
- Permission-based authorization (implied through Auth decorators)
- User-specific data access control
- Progress data privacy protection

### Data Validation
- Input validation using class-validator
- Foreign key validation for user, lesson, and course IDs
- Business rule validations
- Data integrity constraints

## Performance Optimizations

### 1. Database
- Indexed columns for faster queries
- Efficient aggregate queries for statistics
- Optimized joins and filtering
- Pagination support for large datasets

### 2. Microservices
- Async communication via NATS
- Event-driven certificate issuance
- Timeout handling for external calls
- Circuit breaker pattern implementation

### 3. Query Optimization
- Efficient aggregate calculations
- Optimized filtering with indexes
- Batch processing for statistics
- Cached query results where applicable

## Docker
To run with Docker:
```bash
docker build -t user-progress-service .
docker run -p 3009:3009 --env-file .env user-progress-service
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

### Dev Dependencies
- @nestjs/cli: NestJS CLI tools
- typescript: TypeScript compiler
- ts-node: TypeScript execution

## Testing
- Unit tests for progress logic and calculations
- Integration tests for API endpoints
- Mock external service dependencies
- Test database transactions
- Edge case testing for progress tracking

## Monitoring & Logging
- Database query logging
- NATS communication logging
- Progress tracking events
- Certificate issuance tracking
- Error logging with stack traces
- Performance metrics for aggregate queries

## Use Cases

### 1. Lesson Completion Tracking
- Users mark lessons as completed
- Watch time accumulates
- Progress statistics update automatically

### 2. Course Progress Monitoring
- Real-time progress percentage calculation
- Completion tracking across multiple lessons
- Watch time analytics

### 3. Certificate Automation
- Automatic certificate creation upon course completion
- Integration with certificate service
- Event-driven architecture

### 4. Learning Analytics
- User engagement metrics
- Course completion rates
- Time spent learning

## Contributing
1. Follow the existing code structure and patterns
2. Add tests for new features
3. Update documentation
4. Ensure internationalization support
5. Follow TypeScript best practices
6. Consider performance implications for aggregate queries
7. Maintain data consistency in progress tracking

## Notes
- User progress service is essential for learning platform engagement
- Tracks detailed learning metrics and progress
- Automates certificate issuance upon course completion
- Provides valuable analytics for users and administrators
- Uses event-driven architecture for external service integration
- The service is designed for high concurrency with efficient queries
- Progress data is critical for user engagement and retention tracking
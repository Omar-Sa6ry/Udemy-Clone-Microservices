# Course Service - Udemy Clone

## Overview

Course Service is a core microservice in the Udemy Clone application that handles course management, including courses, sections, and lessons. It provides a comprehensive course creation and management system with multimedia content support. Built with NestJS, GraphQL, TypeORM, and MongoDB, implementing design patterns for maintainability and scalability.

## Features

- Complete course management (create, update, delete courses)
- Section and lesson management within courses
- Multimedia upload support (images, videos, files)
- Redis caching for performance optimization
- Chain of Responsibility pattern for validation
- Strategy pattern for different operations
- GraphQL API with optimized queries
- Microservice communication via NATS
- Transactional operations
- Authentication and authorization
- Pagination and filtering
- Course rating and student count management

## Tech Stack

- **Framework**: NestJS
- **GraphQL**: Apollo Server
- **Database**: MongoDB with TypeORM
- **Cache**: Redis
- **Message Broker**: NATS
- **File Upload**: Integrated upload service
- **Validation**: class-validator with i18n
- **Design Patterns**: Chain of Responsibility, Strategy, Proxy, Facade

## Project Structure

```
src/
├── modules/
│   ├── courses/
│   │   ├── entity/              # Course entities
│   │   ├── inputs/              # Course input types
│   │   ├── dtos/                # Course DTOs
│   │   ├── dataloaders/         # DataLoader implementations
│   │   ├── proxy/               # Course data access
│   │   ├── fascade/             # Course business logic
│   │   ├── stratgies/           # Strategy pattern implementations
│   │   ├── chain/               # Chain of Responsibility handlers
│   │   ├── interfaces/          # TypeScript interfaces
│   │   ├── course.controller.ts
│   │   ├── course.module.ts
│   │   ├── course.resolver.ts
│   │   └── course.service.ts
│   ├── section/
│   │   ├── entity/              # Section entities
│   │   ├── inputs/              # Section input types
│   │   ├── dtos/                # Section DTOs
│   │   ├── proxy/               # Section data access
│   │   ├── fascade/             # Section business logic
│   │   ├── stratgies/           # Section strategy patterns
│   │   └── section.module.ts
│   └── lesson/
│       ├── entity/              # Lesson entities
│       ├── inputs/              # Lesson input types
│       ├── dtos/                # Lesson DTOs
│       ├── proxy/               # Lesson data access
│       ├── fascade/             # Lesson business logic
│       ├── stratgies/           # Lesson strategy patterns
│       └── lesson.module.ts
├── common/
│   └── nats/                    # NATS communication service
└── app.module.ts
```

## Design Patterns Implemented

### 1. Chain of Responsibility Pattern

- **CourseExistsHandler**: Validates course existence by ID
- **CourseExistsByTitleHandler**: Validates course existence by title
- **CourseTitleHandler**: Validates course title uniqueness
- **DeleteMediaHandler**: Handles media deletion

### 2. Strategy Pattern

- **CreateCourseStrategy**: Handles course creation logic
- **UpdateCourseStrategy**: Handles course update logic
- **CreateSectionStrategy**: Handles section creation logic
- **UpdateSectionStrategy**: Handles section update logic
- **CreateLessonStrategy**: Handles lesson creation logic
- **UpdateLessonStrategy**: Handles lesson update logic

### 3. Facade Pattern

- **CourseFascade**: Provides simplified interface for complex course operations
- **SectionFascade**: Provides simplified interface for section operations
- **LessonFascade**: Provides simplified interface for lesson operations

### 4. Proxy Pattern

- **CourseProxy**: Acts as intermediary for course repository operations
- **SectionProxy**: Acts as intermediary for section operations
- **LessonProxy**: Acts as intermediary for lesson operations

## Core Entities

### 1. Course Entity

- Main course information
- Instructor and category references
- Pricing and discount information
- Course level (Beginner, Intermediate, Advanced)
- Multimedia content (image, promo video)
- Sections array containing course content
- Rating and student statistics

### 2. CourseSection Entity

- Section title and ordering
- Lessons array within the section
- Timestamps for tracking

### 3. Lesson Entity

- Lesson title and content
- Video URL and duration
- File attachments and download count
- File size information
- Timestamps for tracking

## Course Levels

1. **BEGINNER**: Suitable for new learners
2. **INTERMEDIATE**: For learners with some experience
3. **ADVANCED**: For experienced professionals

## External Service Integrations

### User Service Integration

- Validates instructor status via NATS
- Fetches user details using `UserEvents.GET_USER_BY_ID`
- Checks instructor permissions using `UserEvents.CHECK_IF_INSTRACTOR`

### Category Service Integration

- Validates category existence via NATS
- Fetches category details using `CategoryEvents.GET_CATEGORY_BY_ID`
- Gets multiple categories using `CategoryEvents.GET_CATEGORIES_BY_IDS`

## Installation

### Prerequisites

- Node.js 18+
- MongoDB
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
   MONGO_URI=mongodb://localhost:27017/course_db
   NATS_URL=nats://localhost:4222
   PORT_COURSE=3004
   REDIS_HOST=localhost
   REDIS_PORT=6379
   UPLOAD_PATH=./uploads
   ```
4. Start the service:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### GraphQL Playground

Access at: `http://localhost:3004/course/graphql`

### Course Management

#### Create Course

```graphql
mutation {
  createCourse(createCourseInput: {
    title: "Complete Web Development Bootcamp",
    subtitle: "Learn HTML, CSS, JavaScript, React, Node.js and more!",
    description: "Become a full-stack web developer with this comprehensive course",
    categoryId: "category_id_here",
    instructorId: "instructor_id_here",
    level: INTERMEDIATE,
    price: 99.99,
    discountPrice: 79.99,
    totalHours: 45.5,
    totalLectures: 320,
    learningOutcomes: ["Build responsive websites", "Create web applications", "Deploy to production"],
    requirements: ["Basic computer knowledge", "Internet connection"],
    targetAudience: ["Beginners", "Career changers", "Students"],
    image: {
      filename: "course-image.jpg",
      mimetype: "image/jpeg",
      encoding: "base64",
      createReadStream: () => Stream
    },
    demo_video: {
      filename: "promo-video.mp4",
      mimetype: "video/mp4",
      encoding: "base64",
      createReadStream: () => Stream
    }
  }) {
    success
    message
    data {
      _id
      title
      subtitle
      price
      discountPrice
      instructorId
      categoryId
      imageUrl
      promoVideoUrl
      createdAt
    }
  }
}
```

#### Update Course

```graphql
mutation {
  updateCourse(
    updateCourseInput: {
      id: "course_id_here"
      title: "Updated Course Title"
      subtitle: "Updated subtitle"
      price: 129.99
      discountPrice: 99.99
    }
  ) {
    success
    message
    data {
      _id
      title
      subtitle
      price
      discountPrice
      updatedAt
    }
  }
}
```

#### Activate/Deactivate Course

```graphql
mutation {
  activationCourse(id: "course_id_here") {
    success
    message
    data {
      _id
      title
      isActive
    }
  }
}

mutation {
  deActivationCourse(id: "course_id_here") {
    success
    message
    data {
      _id
      title
      isActive
    }
  }
}
```

#### Delete Course

```graphql
mutation {
  deleteCourse(id: "course_id_here") {
    success
    message
  }
}
```

#### Find Course by ID

```graphql
query {
  findCourseById(id: "course_id_here") {
    success
    message
    data {
      _id
      title
      subtitle
      description
      price
      discountPrice
      level
      totalHours
      totalLectures
      ratingAvg
      ratingCount
      studentCount
      isActive
      imageUrl
      promoVideoUrl
      instructor {
        id
        firstName
        lastName
        email
      }
      category {
        id
        name
        description
      }
      sections {
        _id
        title
        lessons {
          _id
          title
          videoUrl
          durationSeconds
          fileUrl
          fileSize
          downloadCount
        }
      }
      createdAt
      updatedAt
    }
  }
}
```

#### Find Course by Title

```graphql
query {
  findCourseByTitle(title: "Complete Web Development Bootcamp") {
    success
    message
    data {
      _id
      title
      subtitle
      price
      instructorId
      categoryId
    }
  }
}
```

#### Find All Courses (with filtering)

```graphql
query {
  findAllCourses(
    findCourseInput: {
      title: "web development"
      level: INTERMEDIATE
      categoryId: "category_id_here"
      ratingAvg: 4.5
    }
    page: 1
    limit: 10
    orderby: CREATED_AT
  ) {
    success
    message
    items {
      _id
      title
      subtitle
      price
      ratingAvg
      studentCount
      instructor {
        id
        firstName
        lastName
      }
      category {
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

#### Get Course Counts

```graphql
query {
  countCourses {
    success
    message
    data
  }

  countAllCourses {
    success
    message
    data
  }

  countCoursesActive {
    success
    message
    data
  }
}
```

### Section Management

#### Create Section

```graphql
mutation {
  createCourseSection(
    title: "Introduction to HTML"
    courseId: "course_id_here"
  ) {
    success
    message
    data {
      _id
      title
      createdAt
    }
  }
}
```

#### Update Section

```graphql
mutation {
  updateCourseSection(
    updateSectionInput: {
      courseId: "course_id_here"
      sectionId: "section_id_here"
      title: "Updated Section Title"
    }
  ) {
    success
    message
    data {
      _id
      title
      updatedAt
    }
  }
}
```

#### Delete Section

```graphql
mutation {
  deleteCourseSection(
    deleteSectionInput: {
      courseId: "course_id_here"
      sectionId: "section_id_here"
    }
  ) {
    success
    message
  }
}
```

#### Find Section by ID

```graphql
query {
  findCourseSectionById(
    findSectionInput: {
      courseId: "course_id_here"
      sectionId: "section_id_here"
    }
  ) {
    success
    message
    data {
      _id
      title
      lessons {
        _id
        title
        videoUrl
        durationSeconds
      }
      createdAt
      updatedAt
    }
  }
}
```

#### Find All Sections in Course

```graphql
query {
  findAllCourseSections(
    courseIdInput: { courseId: "course_id_here" }
    page: 1
    limit: 10
  ) {
    success
    message
    items {
      _id
      title
      lessons {
        _id
        title
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

### Lesson Management

#### Create Lesson

```graphql
mutation {
  createLesson(
    title: "HTML Basics",
    courseId: "course_id_here",
    sectionId: "section_id_here",
    video: {
      filename: "lesson-video.mp4",
      mimetype: "video/mp4",
      encoding: "base64",
      createReadStream: () => Stream
    },
    file: {
      filename: "lesson-notes.pdf",
      mimetype: "application/pdf",
      encoding: "base64",
      createReadStream: () => Stream
    }
  ) {
    success
    message
    data {
      _id
      title
      videoUrl
      durationSeconds
      fileUrl
      fileSize
      createdAt
    }
  }
}
```

#### Update Lesson

```graphql
mutation {
  updateLesson(updateLessonInput: {
    id: "lesson_id_here",
    courseId: "course_id_here",
    sectionId: "section_id_here",
    title: "Updated Lesson Title",
    video: {
      filename: "updated-video.mp4",
      mimetype: "video/mp4",
      encoding: "base64",
      createReadStream: () => Stream
    }
  }) {
    success
    message
    data {
      _id
      title
      videoUrl
      durationSeconds
      updatedAt
    }
  }
}
```

#### Delete Lesson

```graphql
mutation {
  deleteLesson(
    findLessonInput: {
      courseId: "course_id_here"
      sectionId: "section_id_here"
      id: "lesson_id_here"
    }
  ) {
    success
    message
  }
}
```

#### Find Lesson by ID

```graphql
query {
  findLessonById(
    findLessonInput: {
      courseId: "course_id_here"
      sectionId: "section_id_here"
      id: "lesson_id_here"
    }
  ) {
    success
    message
    data {
      _id
      title
      videoUrl
      durationSeconds
      fileUrl
      fileSize
      downloadCount
      createdAt
      updatedAt
    }
  }
}
```

#### Find All Lessons in Section

```graphql
query {
  findAllLessons(
    findLessonInput: {
      courseId: "course_id_here"
      sectionId: "section_id_here"
      id: "lesson_id_here"
    }
    page: 1
    limit: 10
  ) {
    success
    message
    items {
      _id
      title
      videoUrl
      durationSeconds
      fileUrl
      fileSize
    }
    pagination {
      totalItems
      totalPages
      currentPage
    }
  }
}
```

## Database Schema

### MongoDB Collections

#### Courses Collection

```javascript
{
  _id: ObjectId,
  categoryId: String,
  instructorId: String,
  title: String,
  subtitle: String,
  description: String,
  learningOutcomes: [String],
  requirements: [String],
  targetAudience: [String],
  price: Number,
  discountPrice: Number,
  level: String, // BEGINNER, INTERMEDIATE, ADVANCED
  imageUrl: String,
  promoVideoUrl: String,
  totalLectures: Number,
  totalHours: Number,
  ratingAvg: Number,
  ratingCount: Number,
  studentCount: Number,
  isActive: Boolean,
  sections: [Section],
  createdAt: Date,
  updatedAt: Date
}
```

#### Section (Embedded in Course)

```javascript
{
  _id: ObjectId,
  title: String,
  lessons: [Lesson],
  createdAt: Date,
  updatedAt: Date
}
```

#### Lesson (Embedded in Section)

```javascript
{
  _id: ObjectId,
  title: String,
  videoUrl: String,
  durationSeconds: Number,
  fileUrl: String,
  fileSize: Number,
  downloadCount: Number,
  videoSize: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Business Rules

### Course Creation

1. Instructor must be validated via User Service
2. Category must exist via Category Service
3. Course title must be unique
4. Price and discount validation
5. Multimedia file upload handling

### Section Management

1. Only course instructor can manage sections
2. Sections are embedded within courses
3. Automatic ordering by creation date

### Lesson Management

1. Only course instructor can manage lessons
2. Lessons are embedded within sections
3. Video and file upload handling
4. Download count tracking

### Course Activation

1. Courses can be activated/deactivated
2. Active courses are visible to students
3. Inactive courses are hidden
4. Activation affects course counts

## Caching Strategy

### Redis Implementation

- Course data cached with key: `course:{id}`
- Course counts cached: `course_count:all`, `course_count:true`
- Cache invalidation on course updates
- Cache-aside pattern for read operations

### Cache Updates

- Course counts updated on activation/deactivation
- Course data updated on modifications
- Cache cleared on course deletion

## External Service Integrations

### NATS Events

The service emits events for other services:

- Course creation, updates, and deletions
- Section and lesson management events

### NATS Message Patterns

The service listens for NATS messages:

- `CourseEvents.GET_COURSE_BY_ID`: Get course by ID
- `CourseEvents.GET_COURSES_BY_ID`: Get multiple courses by IDs
- `CourseEvents.UPDATE_COURSE`: Update course information
- `CourseEvents.GET_LESSON_BY_ID`: Get lesson by ID

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
  - `CREATE_COURSE`: Create new courses
  - `UPDATE_COURSE`: Update course information
  - `DELETE_COURSE`: Delete courses
  - `CREATE_SECTION`: Create course sections
  - `UPDATE_SECTION`: Update sections
  - `DELETE_SECTION`: Delete sections
- Instructor validation for course management

### Data Validation

- Input validation using class-validator
- File type and size validation
- Unique constraint enforcement
- Business rule validations

### File Upload Security

- File type validation (images, videos, documents)
- File size limits
- Secure file storage
- Malware scanning (if implemented)

## Performance Optimizations

### 1. Caching

- Redis for course data and counts
- DataLoader for batch instructor and category loading
- Request-scoped caching within GraphQL resolvers
- Reduces N+1 query problems

### 2. Database

- MongoDB embedded documents for sections/lessons
- Indexed fields for faster queries
- Efficient pagination implementation
- Optimized data structure

### 3. Microservices

- Async communication via NATS
- Event-driven architecture
- Timeout handling for external calls
- Circuit breaker pattern implementation

### 4. Design Patterns

- Chain of Responsibility for validation
- Strategy pattern for different operations
- Facade pattern for simplified interfaces
- Proxy pattern for data access

## File Upload Limits

- Maximum file size: 1GB per file
- Maximum files per request: 6 files
- Supported formats:
  - Images: JPEG, PNG, GIF, WebP
  - Videos: MP4, AVI, MOV, WMV
  - Documents: PDF, DOC, DOCX, PPT, PPTX

## Docker

To run with Docker:

```bash
docker build -t course-service .
docker run -p 3004:3004 --env-file .env course-service
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
- typeorm: ORM for MongoDB
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

- Unit tests for course logic and validation
- Integration tests for API endpoints
- Mock external service dependencies
- Test database transactions
- Edge case testing for file uploads

## Monitoring & Logging

- Database query logging
- NATS communication logging
- File upload tracking
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

- Course service is the central learning management system
- Implements multiple design patterns for maintainability
- MongoDB embedded documents for performance
- Comprehensive file upload and management
- Chain of Responsibility for complex validation
- Strategy pattern for different operation types
- NATS events enable loose coupling with other services
- The service is designed for scalability and high concurrency

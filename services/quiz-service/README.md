# Quiz Service - Udemy Clone

## Overview
Quiz Service is a microservice in the Udemy Clone application that handles quiz management and assessment functionality. It provides a comprehensive quiz system with questions, options, attempts, and scoring for course evaluations. Built with NestJS, GraphQL, TypeORM, and PostgreSQL.

## Features
- Complete quiz management (create, update, delete quizzes)
- Question and option management with different question types
- Quiz attempts and scoring system
- Time limits and passing score configuration
- Maximum attempts enforcement
- Automatic score calculation
- Integration with course and user services
- GraphQL API with optimized queries
- Microservice communication via NATS

## Tech Stack
- **Framework**: NestJS
- **GraphQL**: Apollo Server
- **Database**: PostgreSQL with TypeORM
- **Message Broker**: NATS
- **Validation**: class-validator with i18n
- **Question Types**: Multiple Choice, True/False, Short Answer

## Project Structure
```
src/
├── modules/
│   ├── quiz/
│   │   ├── entity/              # Quiz entities
│   │   ├── inputs/              # Quiz input types
│   │   ├── dto/                 # Quiz DTOs
│   │   ├── proxy/               # Quiz data access
│   │   ├── facade/              # Quiz business logic
│   │   ├── quiz.module.ts
│   │   ├── quiz.resolver.ts
│   │   └── quiz.service.ts
│   └── quizDetails/
│       ├── entities/            # Question, Option, Attempt entities
│       ├── inputs/              # Quiz details input types
│       ├── dtos/                # Quiz details DTOs
│       ├── proxy/               # Details data access
│       ├── fascades/            # Details business logic
│       ├── quizDetails.module.ts
│       ├── quizDetails.resolver.ts
│       └── quizDetails.service.ts
├── common/
│   └── nats/                    # NATS communication service
└── app.module.ts
```

## Core Entities

### 1. Quiz
- Main quiz entity linked to lessons
- Configurable time limits and passing scores
- Maximum attempts enforcement
- One-to-many relationship with questions

### 2. QuizQuestion
- Question entity with different types
- Points allocation for scoring
- Position ordering
- Multiple question types support

### 3. QuizQuestionOption
- Options for multiple choice and true/false questions
- Correct answer flagging
- Position ordering for display

### 4. QuizAttempt
- Tracks user attempts on quizzes
- Stores scores and time spent
- Enforces maximum attempts limits

## Question Types
1. **Multiple Choice**: Users select one or multiple correct options
2. **True/False**: Users choose between true or false
3. **Short Answer**: Users type in text answers

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
   DB_NAME_QUIZ=quiz_db
   NATS_URL=nats://localhost:4222
   PORT_QUIZ=3008
   ```
4. Run database migrations (if applicable)
5. Start the service:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### GraphQL Playground
Access at: `http://localhost:3008/quiz/graphql`

### Quiz Management

#### Create Quiz
```graphql
mutation {
  createQuiz(input: {
    lessonId: "lesson_123",
    sectionId: "section_456",
    courseId: "course_789",
    title: "Introduction to JavaScript",
    description: "Test your JavaScript knowledge",
    timeLimit: 1800,
    passingScore: 70,
    maxAttempts: 3
  }) {
    success
    message
    data {
      id
      title
      description
      timeLimit
      passingScore
      maxAttempts
      createdAt
    }
  }
}
```

#### Update Quiz
```graphql
mutation {
  updateQuiz(input: {
    id: "quiz_123",
    title: "Updated Quiz Title",
    description: "Updated description",
    timeLimit: 2400
  }) {
    success
    message
    data {
      id
      title
      description
      timeLimit
    }
  }
}
```

#### Delete Quiz
```graphql
mutation {
  deleteQuiz(id: "quiz_123") {
    success
    message
  }
}
```

#### Get Quiz by ID
```graphql
query {
  findQuiz(id: "quiz_123") {
    success
    message
    data {
      id
      title
      description
      timeLimit
      passingScore
      maxAttempts
      questions {
        id
        questionText
        questionType
        points
        options {
          id
          optionText
          isCorrect
        }
      }
    }
  }
}
```

#### Get Quiz by Lesson ID
```graphql
query {
  quizzesByLesson(lessonId: "lesson_123") {
    success
    message
    data {
      id
      title
      description
    }
  }
}
```

### Question Management

#### Add Question to Quiz
```graphql
mutation {
  addQuestionToQuiz(input: {
    quizId: "quiz_123",
    questionText: "What is JavaScript?",
    questionType: MULTIPLE_CHOICE,
    points: 5,
    position: 1
  }) {
    success
    message
    data {
      id
      questionText
      questionType
      points
    }
  }
}
```

#### Update Question
```graphql
mutation {
  updateQuestionToQuiz(input: {
    id: "question_123",
    questionText: "Updated question text",
    points: 10
  }) {
    success
    message
    data {
      id
      questionText
      points
    }
  }
}
```

#### Delete Question
```graphql
mutation {
  deleteQuestionToQuiz(id: "question_123") {
    success
    message
  }
}
```

#### Get Question by ID
```graphql
query {
  getQuestionById(id: "question_123") {
    success
    message
    data {
      id
      questionText
      questionType
      points
      options {
        id
        optionText
        isCorrect
      }
    }
  }
}
```

### Option Management

#### Add Option to Question
```graphql
mutation {
  addOptionToQuestion(input: {
    questionId: "question_123",
    optionText: "JavaScript is a programming language",
    isCorrect: true,
    position: 1
  }) {
    success
    message
    data {
      id
      optionText
      isCorrect
    }
  }
}
```

#### Update Option
```graphql
mutation {
  updateOptionToQuestion(input: {
    id: "option_123",
    optionText: "Updated option text",
    isCorrect: false
  }) {
    success
    message
    data {
      id
      optionText
      isCorrect
    }
  }
}
```

#### Delete Option
```graphql
mutation {
  deleteOptionQuestionToQuiz(id: "option_123") {
    success
    message
  }
}
```

#### Get Options for Question
```graphql
query {
  getOptionsForQuestion(questionId: "question_123") {
    success
    message
    items {
      id
      optionText
      isCorrect
      position
    }
  }
}
```

### Quiz Attempts

#### Submit Quiz Attempt
```graphql
mutation {
  submitQuizAttempt(
    userId: "user_123",
    quizId: "quiz_456",
    answers: [
      {
        questionId: "question_789",
        selected_option_ids: ["option_1", "option_2"]
      },
      {
        questionId: "question_987",
        short_answer_text: "JavaScript is a programming language"
      }
    ],
    timeSpent: 1200
  ) {
    success
    message
    data {
      id
      score
      timeSpent
      createdAt
    }
  }
}
```

#### Get User Attempts
```graphql
query {
  getUserAttempts(
    userId: "user_123",
    quizId: "quiz_456"
  ) {
    success
    message
    items {
      id
      score
      timeSpent
      createdAt
      quiz {
        id
        title
      }
    }
  }
}
```

## Database Schema

### Quizzes Table
```sql
CREATE TABLE quizzes (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    time_limit DECIMAL(10,2) DEFAULT 0,
    passing_score DECIMAL(10,2) DEFAULT 70,
    max_attempts INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_quizzes_lesson_id ON quizzes(lesson_id);
```

### Quiz Questions Table
```sql
CREATE TABLE quiz_questions (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id VARCHAR(255) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    points INTEGER DEFAULT 1,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
```

### Quiz Question Options Table
```sql
CREATE TABLE quiz_question_options (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id VARCHAR(255) NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    position INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_quiz_question_options_question_id ON quiz_question_options(question_id);
```

### Quiz Attempts Table
```sql
CREATE TABLE quiz_attempts (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id VARCHAR(255) NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    time_spent INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
```

## Scoring System

### Score Calculation
1. Each question has assigned points
2. Correct answers earn full points
3. Final score = (Earned Points / Total Points) × 100
4. Score is compared against passing score

### Question Type Scoring
1. **Multiple Choice**: All correct options must be selected
2. **True/False**: Exact match required
3. **Short Answer**: Case-insensitive text comparison

## Business Rules

### Quiz Creation
- One quiz per lesson (unique constraint)
- Lesson must exist in course service
- Passing score between 0-100
- Time limit in seconds

### Quiz Attempts
- Maximum attempts enforced per user per quiz
- Attempts are tracked and counted
- Users cannot exceed maxAttempts limit

### Question Management
- Questions can have multiple options
- Options must have correct answer flag
- Position determines display order

## External Service Integrations

### Course Service Integration
- Validates lesson existence via NATS
- Fetches lesson details using `CourseEvents.GET_LESSON_BY_ID`
- Ensures quizzes are linked to valid lessons

### User Service Integration
- Validates user existence via NATS
- Fetches user details using `UserEvents.GET_USER_BY_ID`
- Tracks quiz attempts by user

## Error Handling
- Custom exceptions with i18n support
- Validation errors for input data
- Service communication timeouts
- Database constraint violations
- Maximum attempts enforcement

## Security
- Input validation using class-validator
- SQL injection prevention through TypeORM
- GraphQL query complexity limits
- Rate limiting for quiz attempts

## Performance Optimizations

### 1. Database
- Indexed foreign keys for faster joins
- Unique constraints for data integrity
- Efficient pagination implementation

### 2. Microservices
- Async communication via NATS
- Timeout handling for external calls
- Circuit breaker pattern implementation

### 3. Scoring
- Batch processing for answer validation
- Efficient score calculation algorithms

## Docker
To run with Docker:
```bash
docker build -t quiz-service .
docker run -p 3008:3008 --env-file .env quiz-service
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
- Unit tests for quiz logic and scoring
- Integration tests for API endpoints
- Mock external service dependencies
- Test database transactions
- Edge case testing for attempts

## Monitoring & Logging
- Database query logging
- NATS communication logging
- Quiz attempt tracking
- Error logging with stack traces
- Performance metrics for scoring

## Contributing
1. Follow the existing code structure and patterns
2. Add tests for new features
3. Update documentation
4. Ensure internationalization support
5. Follow TypeScript best practices
6. Consider performance implications
7. Maintain data consistency

## Notes
- Each lesson can have only one quiz
- Questions support multiple types for flexibility
- Scoring system is configurable per quiz
- Maximum attempts prevent abuse
- Time limits ensure fair assessment
- The service is designed for educational assessment scenarios
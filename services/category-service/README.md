# Category Service - Udemy Clone

## Overview
Category Service is a microservice in the Udemy Clone application that handles category management operations. It is built with NestJS, GraphQL, TypeORM, and PostgreSQL, following clean architecture principles and design patterns.

## Features
- Complete CRUD operations for categories
- GraphQL API with queries and mutations
- Microservice communication via NATS
- Design patterns implementation (Strategy, Facade, Chain of Responsibility, Proxy)
- Internationalization support
- Transactional operations
- Authentication and authorization
- Pagination and filtering

## Tech Stack
- **Framework**: NestJS
- **GraphQL**: Apollo Server
- **Database**: PostgreSQL with TypeORM
- **Message Broker**: NATS
- **Validation**: class-validator with i18n
- **Design Patterns**: Strategy, Facade, Chain of Responsibility, Proxy

## Project Structure
```
src/
├── modules/
│   └── category/
│       ├── entity/              # Database entities
│       ├── inputs/              # GraphQL input types
│       ├── interfaces/          # TypeScript interfaces
│       ├── chain/               # Chain of Responsibility handlers
│       ├── strategy/            # Strategy pattern implementations
│       ├── facade/              # Facade pattern
│       ├── proxy/               # Proxy pattern
│       ├── category.controller.ts
│       ├── category.module.ts
│       ├── category.resolver.ts
│       └── category.service.ts
├── common/
│   └── nats/                    # NATS communication service
└── app.module.ts
```

## Architecture Patterns

### 1. Strategy Pattern
- **CreateCategoryStrategy**: Handles category creation logic
- **UpdateCategoryStrategy**: Handles category update logic

### 2. Chain of Responsibility Pattern
- **CategoryExistsHandler**: Validates category existence by ID
- **CategoryExistsHandlerByName**: Validates category existence by name
- **CategoryNameHandler**: Validates category name uniqueness

### 3. Facade Pattern
- **CategoryFascade**: Provides simplified interface for complex category operations

### 4. Proxy Pattern
- **CategoryProxy**: Acts as intermediary for category repository operations

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
   DB_NAME_CATEGORY=category_db
   NATS_URL=nats://localhost:4222
   PORT_CATEGORY=3003
   ```
   
4. Run database migrations (if applicable)
5. Start the service:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### GraphQL Playground
Access at: `http://localhost:3003/category/graphql`

### Queries
1. **Get All Categories** (with pagination):
   ```graphql
   query {
     getAllCategories(page: 1, limit: 10) {
       items {
         id
         name
         description
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

2. **Get All Categories Without Pagination**:
   ```graphql
   query {
     getAllCategoriesWithoutPagingation {
       items {
         id
         name
         description
         createdAt
       }
     }
   }
   ```

3. **Get Category by ID**:
   ```graphql
   query {
     getCategoryById(id: { categoryId: "category_id_here" }) {
       data {
         id
         name
         description
         createdAt
       }
     }
   }
   ```

4. **Get Category by Name**:
   ```graphql
   query {
     getCategoryByName(name: { name: "category_name_here" }) {
       data {
         id
         name
         description
         createdAt
       }
     }
   }
   ```

### Mutations (Require Authentication)
1. **Create Category**:
   ```graphql
   mutation {
     createCategory(
       createCategoryInput: { 
         name: "Web Development", 
         description: "Web development courses" 
       }
     ) {
       success
       message
       data {
         id
         name
         description
         createdAt
       }
     }
   }
   ```

2. **Update Category**:
   ```graphql
   mutation {
     updateCategory(
       id: { categoryId: "category_id_here" }
       updateCategoryInput: { 
         name: "Updated Name", 
         description: "Updated description" 
       }
     ) {
       success
       message
       data {
         id
         name
         description
         updatedAt
       }
     }
   }
   ```

3. **Delete Category**:
   ```graphql
   mutation {
     deleteCategory(id: { categoryId: "category_id_here" }) {
       success
       message
     }
   }
   ```

## Microservice Events
The service listens for NATS events:
- `GET_CATEGORIES_BY_IDS`: Get multiple categories by IDs
- `GET_CATEGORY_BY_ID`: Get single category by ID
- `GET_CATEGORY_BY_NAME`: Get single category by name

## Database Schema
```sql
CREATE TABLE categories (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

## Docker
To run with Docker:
```bash
docker build -t category-service .
docker run -p 3003:3003 --env-file .env category-service
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

## Error Handling
The service includes comprehensive error handling:
- Validation errors with i18n support
- Database transaction rollback
- Microservice communication timeouts
- Custom exceptions for business logic

## Security
- Input validation using class-validator
- Authentication decorators (`@Auth`)
- Permission-based authorization
- SQL injection prevention through TypeORM
- CORS enabled

## Monitoring & Logging
- Database query logging
- NATS communication logging
- Error logging with stack traces
- Request/response logging through interceptors

## Contributing
1. Follow the existing code structure and patterns
2. Add tests for new features
3. Update documentation
4. Ensure internationalization support
5. Follow TypeScript best practices


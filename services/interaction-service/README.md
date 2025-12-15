# Interaction Service - Udemy Clone

## Overview
Interaction Service is a microservice in the Udemy Clone application that handles user interaction features including shopping cart management and wishlist functionality. It manages user carts, cart items, and wishlists for courses, providing a seamless shopping experience. Built with NestJS, GraphQL, TypeORM, and PostgreSQL.

## Features
- Shopping cart management (create, update, delete cart items)
- Wishlist functionality for courses
- Cart pricing strategy implementation
- Factory pattern for object creation
- Chain of Responsibility pattern for validation
- GraphQL API with optimized queries
- Microservice communication via NATS
- Transactional operations
- Authentication and authorization
- DataLoader implementation for efficient data fetching

## Tech Stack
- **Framework**: NestJS
- **GraphQL**: Apollo Server
- **Database**: PostgreSQL with TypeORM
- **Message Broker**: NATS
- **Validation**: class-validator with i18n
- **Design Patterns**: Factory, Chain of Responsibility, Strategy, Proxy, Facade

## Project Structure
```
src/
├── modules/
│   ├── cart/
│   │   ├── entities/             # Cart and CartItem entities
│   │   ├── dtos/                 # Cart DTOs
│   │   ├── inputs/               # GraphQL input types
│   │   ├── factories/            # Factory pattern implementations
│   │   ├── strategy/             # Pricing strategy pattern
│   │   ├── interfaces/           # TypeScript interfaces
│   │   ├── proxy/                # Cart data access
│   │   ├── facade/               # Cart business logic
│   │   ├── cart.module.ts
│   │   ├── cart.resolver.ts
│   │   └── cart.service.ts
│   └── wishlist/
│       ├── entity/               # Wishlist entities
│       ├── dtos/                 # Wishlist DTOs
│       ├── inputs/               # GraphQL input types
│       ├── dataloaders/          # DataLoader implementations
│       ├── interfaces/           # TypeScript interfaces
│       ├── proxy/                # Wishlist data access
│       ├── facade/               # Wishlist business logic
│       ├── chain/                # Chain of Responsibility handlers
│       ├── wishlist.module.ts
│       ├── wishlist.resolver.ts
│       └── wishlist.service.ts
├── common/
│   └── nats/                     # NATS communication service
└── app.module.ts
```

## Design Patterns Implemented

### 1. Factory Pattern
- **CartFactory**: Creates new cart instances
- **CartItemFactory**: Creates new cart item instances

### 2. Strategy Pattern
- **DefaultCartPricingStrategy**: Calculates cart totals
- **ICartPricingStrategy**: Interface for pricing strategies

### 3. Chain of Responsibility Pattern
- **WishlistExistsHandler**: Validates wishlist existence
- **WishlistUniqueHandler**: Validates wishlist uniqueness

### 4. Facade Pattern
- **CartFascade**: Provides simplified interface for cart operations
- **WishlistFascade**: Provides simplified interface for wishlist operations

### 5. Proxy Pattern
- **CartProxy**: Acts as intermediary for cart repository operations
- **WishlistProxy**: Acts as intermediary for wishlist repository operations

## Core Entities

### 1. Cart Entity
- User shopping cart information
- Total price calculation
- One-to-many relationship with CartItem
- User-specific cart management

### 2. CartItem Entity
- Individual items in the cart
- Course references
- Price information
- Many-to-one relationship with Cart

### 3. Wishlist Entity
- User wishlist items
- Unique constraint on (userId, courseId)
- Course references for wishlisted items

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
   DB_NAME_INTERACTION=interaction_db
   NATS_URL=nats://localhost:4222
   PORT_INTERACTION=3006
   ```
4. Run database migrations (if applicable)
5. Start the service:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### GraphQL Playground
Access at: `http://localhost:3006/interaction/graphql`

### Cart Management

#### Add Course to Cart
```graphql
mutation {
  addToCart(courseIdInput: { courseId: "course_id_here" }) {
    success
    message
    data {
      id
      userId
      totalPrice
      cartItems {
        id
        courseId
        totalPrice
        createdAt
      }
      createdAt
      updatedAt
    }
  }
}
```

#### Delete Cart
```graphql
mutation {
  deleteCart(cartIdInput: { cartId: "cart_id_here" }) {
    success
    message
  }
}
```

#### Empty Cart
```graphql
mutation {
  emptyCart {
    success
    message
    data {
      id
      userId
      totalPrice
      cartItems {
        id
        courseId
        totalPrice
      }
    }
  }
}
```

#### Get Cart Total
```graphql
query {
  getCartTotal {
    success
    message
    data
  }
}
```

#### Find Cart Items
```graphql
query {
  findCartItems(cartId: { cartId: "cart_id_here" }) {
    success
    message
    items {
      id
      courseId
      totalPrice
      createdAt
    }
  }
}
```

#### Find User Cart
```graphql
query {
  findCart {
    success
    message
    data {
      id
      userId
      totalPrice
      cartItems {
        id
        courseId
        totalPrice
        createdAt
      }
      createdAt
      updatedAt
    }
  }
}
```

### Wishlist Management

#### Add Course to Wishlist
```graphql
mutation {
  createWishlist(courseIdInput: { courseId: "course_id_here" }) {
    success
    message
    data {
      id
      userId
      courseId
      createdAt
    }
  }
}
```

#### Remove from Wishlist
```graphql
mutation {
  deleteWishlist(wishlistId: "wishlist_id_here") {
    success
    message
    data {
      id
      userId
      courseId
    }
  }
}
```

#### Find Wishlist by ID
```graphql
query {
  findWishlistById(id: "wishlist_id_here") {
    success
    message
    data {
      id
      userId
      courseId
      user {
        id
        firstName
        lastName
        email
      }
      course {
        _id
        title
        price
        imageUrl
      }
      createdAt
    }
  }
}
```

#### Find All Wishlists (with filtering)
```graphql
query {
  findAllWishlists(
    findWishlistInput: { userId: "user_id_here" }
    page: 1
    limit: 10
  ) {
    success
    message
    items {
      id
      userId
      courseId
      createdAt
      user {
        id
        firstName
      }
      course {
        _id
        title
        price
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

#### Find All Wishlists Without Pagination
```graphql
query {
  findAllWishlistsWithoutPag(
    findWishlistInput: { userId: "user_id_here" }
  ) {
    success
    message
    items {
      id
      userId
      courseId
      createdAt
      course {
        _id
        title
      }
    }
  }
}
```

## Database Schema

### Carts Table
```sql
CREATE TABLE carts (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(26) NOT NULL,
    total_price NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id VARCHAR(26) NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    course_id VARCHAR(26) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_course_id ON cart_items(course_id);
```

### Wishlists Table
```sql
CREATE TABLE wishlists (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(26) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(user_id, course_id)
);

CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
```

## Business Rules

### Cart Management
1. Each user has one active cart
2. Cart is automatically created on first item addition
3. Courses cannot be added twice to the same cart
4. Cart total is automatically recalculated
5. Cart can be emptied without deletion

### Wishlist Management
1. Users can wishlist multiple courses
2. Same course cannot be wishlisted twice by same user
3. Wishlist items are unique per user-course combination
4. Wishlist can be managed independently from cart

### Pricing Strategy
1. Default pricing strategy calculates sum of all item prices
2. Cart total is updated on item addition/removal
3. Prices are stored as numeric with 2 decimal precision

## External Service Integrations

### Course Service Integration
- Validates course existence via NATS
- Fetches course details using `CourseEvents.GET_COURSE_BY_ID`
- Gets multiple courses using `CourseEvents.GET_COURSES_BY_IDS`

### User Service Integration
- Validates user existence via NATS
- Fetches user details using `UserEvents.GET_USER_BY_ID`
- Gets multiple users using `UserEvents.GET_USER_BY_IDS`

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
  - `CREATE_CART`: Add items to cart
  - `UPDATE_CART`: Update cart items
  - `DELETE_CART`: Delete cart or items
  - `VIEW_CART`: View cart and items
  - `CREATE_WISHLIST`: Add to wishlist
  - `DELETE_WISHLIST`: Remove from wishlist
  - `VIEW_WISHLIST`: View wishlist items
- User-specific data access control

### Data Validation
- Input validation using class-validator
- Unique constraint enforcement
- Foreign key validation
- Business rule validations

## Performance Optimizations

### 1. DataLoader
- Batch loading of user and course data
- Request-scoped caching within GraphQL resolvers
- Reduces N+1 query problems

### 2. Database
- Indexed columns for faster queries
- Unique constraints for data integrity
- Efficient relationships and joins

### 3. Microservices
- Async communication via NATS
- Timeout handling for external calls
- Circuit breaker pattern implementation

### 4. Design Patterns
- Factory pattern for object creation
- Strategy pattern for pricing calculations
- Chain of Responsibility for validation
- Facade pattern for simplified interfaces

## Docker
To run with Docker:
```bash
docker build -t interaction-service .
docker run -p 3006:3006 --env-file .env interaction-service
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
- Unit tests for cart and wishlist logic
- Integration tests for API endpoints
- Mock external service dependencies
- Test database transactions
- Edge case testing for pricing calculations

## Monitoring & Logging
- Database query logging
- NATS communication logging
- Cart and wishlist activity tracking
- Error logging with stack traces
- Performance metrics for data loading

## Contributing
1. Follow the existing code structure and patterns
2. Add tests for new features
3. Update documentation
4. Ensure internationalization support
5. Follow TypeScript best practices
6. Consider performance implications
7. Maintain data consistency

## Notes
- Interaction service handles user engagement features
- Cart and wishlist functionality are separated but related
- Factory pattern simplifies object creation
- Strategy pattern allows flexible pricing calculations
- Chain of Responsibility handles complex validation
- DataLoader optimizes GraphQL queries
- NATS communication ensures loose coupling with other services
- The service is designed for high concurrency user interactions
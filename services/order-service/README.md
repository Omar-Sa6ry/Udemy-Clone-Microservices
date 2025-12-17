# Order Service - Udemy Clone

## Overview
Order Service is a critical microservice in the Udemy Clone application that handles order management, payment processing, and transaction tracking for course purchases. It implements a comprehensive order management system with multiple design patterns for flexibility, maintainability, and scalability. Built with NestJS, GraphQL, TypeORM, and PostgreSQL.

## Features
- Complete order management (create, update, cancel, refund orders)
- Multiple payment gateway integration (Stripe, Bank Transfer)
- Observer pattern for event notifications
- Strategy pattern for payment processing
- Builder pattern for complex order creation
- Factory pattern for order object creation
- Decorator pattern for cross-cutting concerns
- GraphQL API with comprehensive queries
- Microservice communication via NATS
- Email notifications for order events
- Order statistics and analytics
- Transactional operations
- Authentication and authorization

## Tech Stack
- **Framework**: NestJS
- **GraphQL**: Apollo Server
- **Database**: PostgreSQL with TypeORM
- **Message Broker**: NATS
- **Notification**: Integrated notification service
- **Design Patterns**: Observer, Strategy, Builder, Factory, Decorator, Repository

## Project Structure
```
src/
├── modules/
│   └── order/
│       ├── entities/            # Database entities
│       ├── inputs/              # GraphQL input types
│       ├── enum/                # Enum definitions
│       ├── decorators/          # Custom decorators
│       ├── observers/           # Observer pattern implementations
│       ├── strategies/          # Strategy pattern implementations
│       ├── builders/            # Builder pattern implementations
│       ├── factories/           # Factory pattern implementations
│       ├── repositories/        # Repository pattern implementations
│       ├── order.module.ts
│       ├── order.resolver.ts
│       └── order.service.ts
├── common/
│   └── nats/                    # NATS communication service
└── app.module.ts
```

## Design Patterns Implemented

### 1. Observer Pattern
- **OrderSubject**: Manages observer subscriptions
- **OrderObserver**: Interface for order event observers
- **EmailNotificationObserver**: Sends email notifications
- **AnalyticsObserver**: Tracks order analytics

### 2. Strategy Pattern
- **PaymentStrategy**: Interface for payment processing
- **StripePaymentStrategy**: Implements Stripe payment processing
- **BankTransferStrategy**: Implements bank transfer processing
- **PaymentProcessor**: Context class that uses strategies
- **PaymentStrategyFactory**: Creates appropriate payment strategies

### 3. Builder Pattern
- **OrderBuilder**: Builds complex order objects step by step
- Fluent interface for order configuration

### 4. Factory Pattern
- **OrderFactory**: Creates order instances
- Static methods for different creation scenarios

### 5. Decorator Pattern
- **Cacheable**: Caches method results
- **LogExecution**: Logs method execution
- **Retry**: Retries failed operations

### 6. Repository Pattern
- **IOrderRepository**: Interface for order data access
- **OrderRepository**: Concrete repository implementation

## Core Entities

### 1. Order Entity
- Order information and metadata
- Payment status and gateway
- Financial calculations (amount, tax, discount, total)
- Unique order number generation
- One-to-many relationship with OrderItem

### 2. OrderItem Entity
- Individual items within an order
- Course references and pricing
- Discount calculations
- Many-to-one relationship with Order

## Payment Statuses
1. **PENDING**: Order created but payment not processed
2. **COMPLETED**: Payment successfully processed
3. **FAILED**: Payment processing failed
4. **CANCELLED**: Order cancelled by user or system

## Payment Gateways
1. **STRIPE**: Credit card payments via Stripe
2. **BANK_TRANSFER**: Bank transfer payments
3. **PAYPAL**: PayPal payments (reserved for future)

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
   DB_NAME_ORDER=order_db
   NATS_URL=nats://localhost:4222
   PORT_ORDER=3009
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```
4. Run database migrations (if applicable)
5. Start the service:
   ```bash
   npm run start:dev
   ```

## API Endpoints

### GraphQL Playground
Access at: `http://localhost:3009/order/graphql`

### Queries

#### Get Order by ID
```graphql
query {
  orderById(id: "order_id_here") {
    id
    orderNumber
    userId
    amount
    tax
    discount
    totalAmount
    currency
    paymentMethod
    paymentGateway
    paymentStatus
    items {
      orderId
      courseId
      price
      priceAfterDiscount
    }
    createdAt
    updatedAt
  }
}
```

#### Get Order by Order Number
```graphql
query {
  orderByNumber(orderNumber: "ORD-123456789") {
    id
    orderNumber
    userId
    totalAmount
    paymentStatus
    paymentGateway
    items {
      courseId
      price
      priceAfterDiscount
    }
    createdAt
  }
}
```

#### Get Student Orders
```graphql
query {
  studentOrders(userId: "user_id_here") {
    id
    orderNumber
    totalAmount
    paymentStatus
    createdAt
    items {
      courseId
      price
      priceAfterDiscount
    }
  }
}
```

#### Get Order Statistics
```graphql
query {
  orderStatistics(userId: "user_id_here")
}
```

### Mutations (Require Authentication)

#### Create Simple Order
```graphql
mutation {
  createSimpleOrder(
    userId: "user_id_here",
    email: "user@example.com",
    amount: 99.99,
    paymentMethod: "credit_card"
  ) {
    id
    orderNumber
    userId
    totalAmount
    paymentStatus
    paymentGateway
    createdAt
  }
}
```

#### Create Complex Order
```graphql
mutation {
  createComplexOrder(
    userId: "user_id_here",
    email: "user@example.com",
    amount: 149.99,
    paymentMethod: CREDIT_CARD,
    tax: 14.99,
    discount: 20.00,
    currency: "USD",
    paymentGateway: STRIPE,
    items: [
      { price: 99.99, discount: 10 },
      { price: 49.99, discount: 5 }
    ]
  ) {
    id
    orderNumber
    userId
    amount
    tax
    discount
    totalAmount
    currency
    paymentMethod
    paymentGateway
    paymentStatus
    items {
      courseId
      price
      priceAfterDiscount
    }
    createdAt
  }
}
```

#### Cancel Order
```graphql
mutation {
  cancelOrder(
    orderId: "order_id_here",
    email: "user@example.com"
  ) {
    id
    orderNumber
    paymentStatus
    updatedAt
  }
}
```

#### Refund Order
```graphql
mutation {
  refundOrder(
    email: "user@example.com",
    orderId: "order_id_here",
    refundAmount: 99.99
  ) {
    id
    orderNumber
    paymentStatus
    totalAmount
    updatedAt
  }
}
```

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(26) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    payment_gateway VARCHAR(50) NOT NULL DEFAULT 'stripe',
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    order_id VARCHAR(26) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    course_id VARCHAR(26) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    price_after_discount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id, course_id)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_course_id ON order_items(course_id);
```

## Business Rules

### Order Creation
1. Unique order number generation
2. Automatic total amount calculation
3. Tax and discount application
4. Payment gateway selection
5. Initial payment status: PENDING

### Payment Processing
1. Payment processing via selected gateway
2. Automatic status update based on payment result
3. Email notifications for payment events
4. Analytics tracking

### Order Cancellation
1. Only pending orders can be cancelled
2. Automatic email notification
3. Status update to CANCELLED

### Order Refund
1. Only completed orders within 30 days can be refunded
2. Partial or full refund support
3. Payment gateway-specific refund processing
4. Email notification for refunds

### Order Items
1. Each item has original price and discounted price
2. Discount percentage applied per item
3. Items linked to specific courses

## External Service Integrations

### User Service Integration
- Validates user existence via NATS
- Fetches user details using `UserEvents.GET_USER_BY_ID`
- Gets multiple users using `UserEvents.GET_USER_BY_IDS`

### Course Service Integration
- Validates course existence via NATS
- Fetches course details using `CourseEvents.GET_COURSE_BY_ID`
- Gets lesson details using `CourseEvents.GET_LESSON_BY_ID`

### Notification Service Integration
- Sends email notifications for order events
- Uses `ChannelType.EMAIL` for notification delivery
- Configurable notification templates

## Payment Processing Flow

### 1. Order Creation
- Order created with PENDING status
- Payment gateway selected
- Email notification sent

### 2. Payment Processing
- Payment strategy selected based on gateway
- Payment processed through external gateway
- Result determines order status

### 3. Status Update
- Successful payment: COMPLETED status
- Failed payment: FAILED status
- Email notification based on result

### 4. Post-Processing
- Analytics tracking
- Additional notifications if needed

## Error Handling
- Custom exceptions with detailed messages
- Payment gateway-specific error handling
- Transaction rollback on failure
- Retry mechanism for failed operations
- Comprehensive logging

## Security

### Authentication & Authorization
- JWT-based authentication
- Permission-based authorization (implied through Auth decorators)
- User-specific order access control
- Payment data protection

### Payment Security
- Secure payment gateway integration
- No sensitive data storage (PCI compliance)
- Tokenized payment processing
- Fraud detection mechanisms

### Data Validation
- Input validation for all order data
- Financial data precision validation
- Business rule validations
- Foreign key constraints

## Performance Optimizations

### 1. Caching
- Method-level caching with `@Cacheable` decorator
- Configurable TTL for cache entries
- Reduces database load for frequent queries

### 2. Logging
- Method execution logging with `@LogExecution` decorator
- Performance monitoring
- Debug information collection

### 3. Retry Mechanism
- Automatic retry for failed operations with `@Retry` decorator
- Configurable retry count and delay
- Improves resilience for external service calls

### 4. Database
- Indexed columns for faster queries
- Efficient aggregate queries for statistics
- Optimized joins and filtering

### 5. Microservices
- Async communication via NATS
- Event-driven architecture
- Timeout handling for external calls
- Circuit breaker pattern implementation

## Decorators

### Cacheable
```typescript
@Cacheable(300) // Cache for 5 minutes
async getOrderById(id: string): Promise<Order> {
  // Implementation
}
```

### LogExecution
```typescript
@LogExecution()
async createOrder(orderData: any): Promise<Order> {
  // Implementation
}
```

### Retry
```typescript
@Retry(3, 1000) // Retry 3 times with 1-second delay
async processPayment(order: Order): Promise<void> {
  // Implementation
}
```

## Observer Pattern Implementation

### Order Events
1. **Order Created**: When a new order is created
2. **Order Completed**: When payment is successful
3. **Order Failed**: When payment fails
4. **Order Refunded**: When an order is refunded

### Observers
1. **EmailNotificationObserver**: Sends email notifications
2. **AnalyticsObserver**: Tracks order analytics
3. **Custom Observers**: Can be added for additional functionality

## Strategy Pattern Implementation

### Payment Strategies
1. **StripePaymentStrategy**: Processes payments via Stripe
2. **BankTransferStrategy**: Processes bank transfers
3. **Custom Strategies**: Can be added for new payment gateways

### Strategy Selection
```typescript
const strategy = PaymentStrategyFactory.create('stripe');
const processor = new PaymentProcessor(strategy);
const result = await processor.process(amount, currency, orderData);
```

## Docker
To run with Docker:
```bash
docker build -t order-service .
docker run -p 3009:3009 --env-file .env order-service
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
- @bts-soft/core: Core utilities and notification service

### Dev Dependencies
- @nestjs/cli: NestJS CLI tools
- typescript: TypeScript compiler
- ts-node: TypeScript execution

## Testing
- Unit tests for order logic and calculations
- Integration tests for API endpoints
- Mock payment gateway testing
- Observer pattern testing
- Strategy pattern testing
- Database transaction testing

## Monitoring & Logging
- Database query logging
- NATS communication logging
- Payment processing events
- Order lifecycle tracking
- Error logging with stack traces
- Performance metrics for payment processing

## Statistics and Analytics

### Order Statistics
- Total orders count
- Total revenue
- Average order value
- Pending vs completed orders
- User-specific statistics

### Business Insights
- Popular payment methods
- Revenue trends
- Conversion rates
- Refund analysis

## Contributing
1. Follow the existing code structure and patterns
2. Add tests for new features
3. Update documentation
4. Ensure payment security compliance
5. Follow TypeScript best practices
6. Consider performance implications
7. Maintain data consistency in financial calculations

## Notes
- Order service handles critical financial transactions
- Implements multiple design patterns for flexibility and maintainability
- Observer pattern enables extensible event handling
- Strategy pattern allows easy addition of new payment gateways
- Builder pattern simplifies complex order creation
- Factory pattern encapsulates object creation logic
- Decorator pattern handles cross-cutting concerns elegantly
- Repository pattern abstracts data access
- The service is designed for high concurrency with transactional safety
- Payment processing follows industry security standards
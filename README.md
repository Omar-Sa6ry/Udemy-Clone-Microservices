# Udemy Clone Microservices Platform

## Overview

Udemy Clone is a comprehensive online learning platform built with a microservices architecture. The platform replicates core Udemy functionality including course management, user authentication, shopping cart, wishlist, reviews, quizzes, certificates, and user progress tracking. Built with modern technologies and design patterns, the system is scalable, maintainable, and follows industry best practices.

## Architecture

### Technology Stack

- **Backend Framework**: NestJS
- **API**: GraphQL (primary), REST (where needed)
- **Databases**: PostgreSQL (10 services), MongoDB (1 service)
- **Caching**: Redis
- **Message Broker**: NATS
- **Container Orchestration**: Kubernetes
- **Development Workflow**: Skaffold
- **Design Patterns**: Factory, Strategy, Observer, State, Chain of Responsibility, Facade, Proxy, Decorator

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                       │
├─────────────┬─────────────┬─────────────────┬──────────────┤
│   Ingress   │     NATS    │      Redis      │   Services   │
│   (nginx)   │ (Messaging) │    (Caching)    │              │
└─────────────┴─────────────┴─────────────────┴──────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
┌───▼────┐           ┌─────▼─────┐           ┌────▼────┐
│ Auth   │           │   User    │           │ Course  │
│ Service│           │  Service  │           │ Service │
└───┬────┘           └─────┬─────┘           └────┬────┘
    │                      │                      │
┌───▼────┐           ┌─────▼─────┐           ┌────▼────┐
│ Auth   │           │   User    │           │ Course  │
│  DB    │           │    DB     │           │   DB    │
│(PostgreSQL)        │(PostgreSQL)           │ (MongoDB)│
└────────┘           └───────────┘           └─────────┘
```

## Microservices

### Core Services (10 Independent Services)

| Service                   | Port | Database   | Description                                               |
| ------------------------- | ---- | ---------- | --------------------------------------------------------- |
| **User Service**          | 3001 | PostgreSQL | User management, profiles, roles, and authentication data |
| **Auth Service**          | 3002 | PostgreSQL | Authentication, registration, password management         |
| **Category Service**      | 3003 | PostgreSQL | Course category management                                |
| **Course Service**        | 3004 | MongoDB    | Course, section, and lesson management with multimedia    |
| **Certificate Service**   | 3005 | PostgreSQL | Certificate issuance and management                       |
| **Interaction Service**   | 3006 | PostgreSQL | Shopping cart and wishlist functionality                  |
| **Review Service**        | 3007 | PostgreSQL | Course reviews and ratings                                |
| **Quiz Service**          | 3008 | PostgreSQL | Quizzes, questions, and assessments                       |
| **User Progress Service** | 3009 | PostgreSQL | User learning progress tracking                           |
| **Order Service**         | 3010 | PostgreSQL | Course purchases and payment processing                   |

### Infrastructure Services

| Service                | Port   | Description                                    |
| ---------------------- | ------ | ---------------------------------------------- |
| **NATS**               | 4222   | Message broker for inter-service communication |
| **Redis**              | 6379   | Caching layer for performance optimization     |
| **Ingress Controller** | 80/443 | NGINX ingress for routing and SSL termination  |

## Shared Packages

### @course-plateform/common

Shared utilities, guards, decorators, constants, and authentication modules for consistent microservice development.

**Features:**

- JWT-based authentication system
- Role-Based Access Control (RBAC)
- GraphQL decorators and guards
- Internationalization support
- TypeScript type definitions
- Modular design for easy integration

### @course-plateform/types

Shared TypeScript type definitions, DTOs, GraphQL object types, and event enumerations.

**Features:**

- Comprehensive TypeScript interfaces
- Ready-to-use GraphQL object types
- Standardized NATS event names
- Consistent data structures across services

## Key Features

### Authentication & Authorization

- JWT-based authentication across all services
- Role-based access control (Admin, Instructor, User)
- Permission-based authorization with fine-grained controls
- Google OAuth integration
- Secure password management with bcrypt

### Course Management

- Complete course creation and management
- Section and lesson organization
- Multimedia upload (images, videos, documents)
- Course activation/deactivation
- Pricing and discount management

### Learning Experience

- User progress tracking across courses
- Certificate issuance upon completion
- Quiz system with multiple question types
- Course reviews and ratings
- Shopping cart and wishlist functionality

### Payment & Orders

- Multiple payment gateway integration (Stripe, Bank Transfer)
- Order management and tracking
- Refund processing
- Transaction history

### Performance & Scalability

- Redis caching for frequently accessed data
- Microservices architecture for independent scaling
- NATS for asynchronous communication
- Kubernetes for container orchestration
- DataLoader pattern for GraphQL query optimization

## Design Patterns Implemented

### Across Services:

- **Factory Pattern**: Object creation (UserFactory, CartFactory, OrderFactory)
- **Strategy Pattern**: Payment processing, pricing calculations
- **Observer Pattern**: Event notifications, cache invalidation
- **State Pattern**: User role transitions, password reset states
- **Chain of Responsibility**: Request validation
- **Facade Pattern**: Simplified interfaces for complex operations
- **Proxy Pattern**: Data access with caching
- **Decorator Pattern**: Cross-cutting concerns (logging, caching, retry)
- **Builder Pattern**: Complex object creation (orders)

## Prerequisites

### System Requirements

- Node.js 18+
- Docker & Docker Compose
- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- kubectl configured
- PostgreSQL 16
- MongoDB 6.0
- Redis
- NATS server

### Development Tools

- Skaffold (for local development)
- Git
- IDE with TypeScript support

## Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd udemy-clone
```

### 2. Install Dependencies

```bash
# Install shared packages
cd packages/common && npm install
cd ../types && npm install

# Install service dependencies
cd services/user-service && npm install
cd ../auth-service && npm install
# Repeat for all services
```

### 3. Configure Environment Variables

Create `.env` files in each service directory based on the main `.env` template.

### 4. Database Setup

```bash
# Start databases (using Docker)
docker-compose up -d postgres mongodb redis nats
```

### 5. Kubernetes Deployment (Development)

```bash
# Using Skaffold for development
skaffold dev

# OR manual deployment
kubectl apply -f infra/k8s/
```

### 6. Local Development (without Kubernetes)

```bash
# Start each service individually
cd services/user-service && npm run start:dev
cd services/auth-service && npm run start:dev
# Repeat for all services
```

## Development Workflow

### Using Skaffold

```bash
# Start all services with hot reload
skaffold dev

# Build and deploy once
skaffold run

# Clean up
skaffold delete
```

### Service Ports

Access services at:

- User Service: `http://localhost:3001/user/graphql`
- Auth Service: `http://localhost:3002/auth/graphql`
- Category Service: `http://localhost:3003/category/graphql`
- Course Service: `http://localhost:3004/course/graphql`
- Certificate Service: `http://localhost:3005/certificate/graphql`
- Interaction Service: `http://localhost:3006/interaction/graphql`
- Review Service: `http://localhost:3007/review/graphql`
- Quiz Service: `http://localhost:3008/quiz/graphql`
- User Progress Service: `http://localhost:3009/userProgress/graphql`
- Order Service: `http://localhost:3010/order/graphql`

## API Documentation

### GraphQL Playground

Each service provides a GraphQL Playground at `/graphql` endpoint with:

- Schema documentation
- Query/mutation testing
- Request/response inspection

### Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Common Queries & Mutations

#### User Management

```graphql
# Register user
mutation {
  register(
    input: {
      firstName: "John"
      lastName: "Doe"
      email: "john@example.com"
      password: "Password123"
      phone: "+1234567890"
    }
  ) {
    success
    message
    data {
      user {
        id
        email
        role
      }
      token
    }
  }
}

# Login
mutation {
  login(input: { email: "john@example.com", password: "Password123" }) {
    success
    message
    data {
      user {
        id
        email
        role
      }
      token
    }
  }
}
```

#### Course Management

```graphql
# Create course
mutation {
  createCourse(
    input: {
      title: "Complete Web Development"
      description: "Learn full-stack development"
      price: 99.99
      categoryId: "cat_123"
    }
  ) {
    success
    message
    data {
      id
      title
      price
      createdAt
    }
  }
}

# Get courses with filtering
query {
  courses(filter: { categoryId: "cat_123" }, page: 1, limit: 10) {
    items {
      id
      title
      price
      rating
      instructor {
        name
      }
    }
    pagination {
      totalItems
      currentPage
      totalPages
    }
  }
}
```

## Database Schema

### PostgreSQL Databases (9 services)

Each service has its own dedicated PostgreSQL database with optimized schemas.

### MongoDB Database (Course Service)

Course service uses MongoDB for flexible document storage of courses, sections, and lessons.

## Testing

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Structure

- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Mock external dependencies
- Database transaction testing

## Deployment

### Kubernetes Configuration

The `infra/k8s/` directory contains all Kubernetes manifests:

- Deployments for each service
- Services for internal communication
- ConfigMaps and Secrets
- Ingress configuration
- Persistent volume claims

### Production Considerations

1. **Scaling**: Increase replica counts and configure Horizontal Pod Autoscaler
2. **Monitoring**: Implement Prometheus and Grafana
3. **Logging**: Centralized logging with ELK stack
4. **Security**: Network policies, pod security contexts
5. **Backups**: Regular database backups
6. **CI/CD**: Automated deployment pipeline

## Monitoring & Observability

### Health Checks

- Each service includes health endpoints
- Kubernetes liveness and readiness probes
- Database connection monitoring

### Logging

- Structured JSON logging
- Request/response logging
- Error tracking with stack traces
- Performance metrics

### Metrics

- Request rates and latencies
- Database query performance
- Cache hit ratios
- Service communication metrics

## Security

### Authentication & Authorization

- JWT tokens with expiration
- Role-based access control
- Permission validation
- Secure password hashing

### Data Protection

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens for web forms

### Network Security

- Service-to-service authentication
- TLS for external communication
- Network policies in Kubernetes
- Secret management with Kubernetes Secrets

## Performance Optimizations

### Caching Strategy

- Redis for frequently accessed data
- Cache invalidation patterns
- Request-scoped caching in GraphQL
- Database query optimization

### Microservices Optimization

- Async communication via NATS
- Batch processing with DataLoader
- Connection pooling
- Efficient serialization

### Database Optimization

- Indexed columns for frequent queries
- Query optimization
- Connection management
- Read replicas for high read loads

## Contributing

### Development Guidelines

1. Follow existing code patterns and structure
2. Add comprehensive tests for new features
3. Update documentation
4. Use TypeScript strict mode
5. Follow design patterns where applicable
6. Consider performance implications
7. Maintain backward compatibility

### Code Style

- ESLint configuration provided
- Prettier for code formatting
- TypeScript best practices
- Consistent naming conventions

### Pull Request Process

1. Create feature branch from `main`
2. Add tests and documentation
3. Ensure all tests pass
4. Update shared packages if needed
5. Create pull request with description

## Troubleshooting

### Common Issues

#### Service Communication

```bash
# Check NATS connectivity
kubectl logs deployment/nats-depl

# Check service health
kubectl get pods
kubectl describe pod <pod-name>
```

#### Database Connections

```bash
# Check database pods
kubectl logs deployment/user-db-depl

# Test database connection
kubectl exec -it <db-pod> -- psql -U postgres
```

#### Kubernetes Issues

```bash
# Get all resources
kubectl get all

# Describe specific resource
kubectl describe <resource-type> <resource-name>

# View logs
kubectl logs -f deployment/<deployment-name>
```

### Debugging

- Enable verbose logging in services
- Use GraphQL Playground for API testing
- Check Redis cache contents
- Monitor NATS message flow

## Future Enhancements

### Planned Features

1. **Mobile Applications**: React Native clients
2. **Live Streaming**: Real-time video streaming for courses
3. **Discussion Forums**: Course-specific discussion boards
4. **AI Recommendations**: Personalized course recommendations
5. **Gamification**: Badges and achievement system
6. **Analytics Dashboard**: Detailed learning analytics
7. **Multi-language Support**: Course content translation
8. **Offline Access**: Download courses for offline viewing

### Technical Improvements

1. **Service Mesh**: Implement Istio for better service communication
2. **GraphQL Federation**: Apollo Federation for unified schema
3. **Event Sourcing**: CQRS pattern for complex workflows
4. **Advanced Caching**: Multi-layer caching strategy
5. **Performance Monitoring**: Real-time performance insights
6. **Disaster Recovery**: Multi-region deployment

## License

This project is developed for educational purposes. Refer to individual package and service licenses for specific terms.

## Support

For issues and questions:

1. Check existing documentation
2. Review service-specific README files
3. Examine code examples
4. Contact development team

## Acknowledgments

- Built with [NestJS](https://nestjs.com/) framework
- Uses [GraphQL](https://graphql.org/) for API
- [TypeORM](https://typeorm.io/) for database operations
- [NATS](https://nats.io/) for messaging
- [Kubernetes](https://kubernetes.io/) for orchestration
- Design patterns from Gang of Four

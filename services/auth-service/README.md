
# Auth Service – Udemy Clone

## Overview

The **Auth Service** is a core microservice of the Udemy Clone platform, responsible for managing user authentication, registration, password management, and authorization using **NestJS**, **GraphQL**, **PostgreSQL**, **Redis**, and **NATS** for inter-service communication.

It handles both **email/password** and **Google authentication**, ensures transactional consistency using **TypeORM Transactional Context**, and uses **Redis** for caching and session management.

---

## Key Features

- User registration and login (JWT-based)
    
- Role-based authentication (Admin, Instructor, Student)
    
- Password management (reset, change, forgot password)
    
- Email notifications for account actions
    
- Integration with **User Service** via **NATS microservice**
    
- Internationalization (i18n)
    
- Redis-based caching and token storage
    
- GraphQL API with real-time subscriptions
    

---

## Technologies Used

|Category|Technology|
|---|---|
|**Framework**|[NestJS](https://nestjs.com/)|
|**Language**|TypeScript|
|**Database**|PostgreSQL (via TypeORM)|
|**Cache**|Redis|
|**Communication**|NATS Messaging Queue|
|**API**|GraphQL with Apollo Driver|
|**Validation & i18n**|`nestjs-i18n`, `class-validator`|
|**Transactions**|`typeorm-transactional`|
|**Notifications**|Custom `NotificationService` (Email Channel)|

---

## Architecture

The service follows a **Clean Architecture** and **DDD (Domain-Driven Design)** structure:

```
auth-service/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── modules/
│   │   └── auth/
│   │       ├── entity/
│   │       ├── inputs/
│   │       ├── dtos/
│   │       ├── adapters/
│   │       ├── services/
│   │       ├── commands/
│   │       ├── builder/
│   │       ├── state/
│   │       ├── chain/
│   │       ├── interfaces/
│   │       └── resolvers/
│   ├── modules/user/
│   │   └── userClient.service.ts
│   ├── nats/
│   │   ├── nats.module.ts
│   │   └── nats.service.ts
│   └── ...
└── package.json
```

---

## Environment Variables

Create a `.env` file at the root of the service:

```env
PORT_Auth=3002
DB_HOST=localhost
DB_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_NAME_AUTH=auth_service_db
REDIS_URL=redis://localhost:6379
NATS_URL=nats://localhost:4222
JWT_SECRET=my_jwt_secret
```

---

## Installation

```bash
# Install dependencies
npm install

# Generate GraphQL schema
npm run build

# Run database migrations (if enabled)
npm run typeorm migration:run

# Start the service
npm run start:dev
```

---

## GraphQL Endpoint

Once the service is running, open the GraphQL Playground at:

```
http://localhost:3002/auth/graphql
```

### Example Queries

#### Register a new user

```graphql
mutation Register {
  register(
    createUserInput: {
      firstName: "omar"
      lastName: "sabry"
      email: "omarsabrydevgmail.com"
      password: "Password123"
      phone: "0123456789"
      whatsapp: "0123456789"
      headline: "Software Engineer"
    }
    profileInput: { bio: "Hello world", headline: "Developer" }
  ) {
    data {
      user {
        id
        email
        role
      }
      token
    }
    message
  }
}
```

#### Login

```graphql
mutation Login {
  login(loginDto: { email: "john@gmail.com", password: "Password123" }) {
    data {
      user {
        id
        email
        role
      }
      token
    }
    message
  }
}
```

#### Forgot Password

```graphql
mutation ForgotPassword {
  forgotPassword(email: "john@gmail.com") {
    message
  }
}
```

---

## Microservice Communication (NATS)

This service communicates with other microservices using **NATS**.

### Example Events

- `UserEvents.CREATE_USER_DATA`
    
- `UserEvents.GET_USER_BY_EMAIL`
    
- `UserEvents.USER_ROLE_UPDATED`
    

Communication is handled using the `NatsService` and `UserClientService` classes.

---

## Redis Caching

- Stores temporary authentication and user data.
    
- Example keys:
    
    - `user:{userId}`
        
    - `user:email:{email}`
        
    - `auth:{email}`
        
    - `user-count`
        

Redis helps reduce load on the database and speeds up authentication flows.

---

## Password Management

Password handling is abstracted using the **Strategy Pattern** via `PasswordServiceAdapter`:

- Hashing and comparison use **bcrypt**.
    
- Secure password reset link generation handled by `PasswordResetLinkBuilder`.
    
- Reset states managed using the **State Pattern** (`PasswordResetContext`).
    

---

## Email Notifications

Email sending is command-based:

- `SendWelcomeEmailCommand` → On successful registration
    
- `SendResetPasswordEmailCommand` → On password reset request
    

These commands use the `NotificationService` and `ChannelType.EMAIL`.

---

## Internationalization (i18n)

All messages are localized using **nestjs-i18n**.

Example messages file (`en/user.json`):

```json
{
  "CREATED": "User signed up successfully",
  "LOGIN": "User logged in successfully",
  "UPDATED": "User updated successfully",
  "NOT_FOUND": "User not found",
  "EMAIL_WRONG": "Invalid email address",
  "INVALID_PASSWORD": "Incorrect password"
}
```

---

## Scripts

|Command|Description|
|---|---|
|`npm run start:dev`|Start development server|
|`npm run build`|Build TypeScript project|
|`npm run start:prod`|Start production server|
|`npm run lint`|Run linter|
|`npm run test`|Run unit tests|

---

## Folder Responsibilities

|Folder|Description|
|---|---|
|**auth/entity**|TypeORM entities for authentication|
|**auth/dtos**|Data Transfer Objects for GraphQL responses|
|**auth/inputs**|GraphQL input schemas|
|**auth/adapter**|Password service adapter (bcrypt implementation)|
|**auth/builder**|Password reset link generator|
|**auth/command**|Email command classes|
|**auth/chain**|Password and role validators|
|**auth/state**|Password reset states (initial, completed)|
|**user/**|Handles NATS-based user communication|
|**nats/**|NATS configuration and service layer|


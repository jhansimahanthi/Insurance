# Resume Project Description

## Project Name
**Insurance Management System** — Full-Stack Microservices Application

## Technology
Java, Spring Boot, Microservices, Apache Kafka, REST APIs, Angular, PostgreSQL, Docker, JUnit, Mockito

## Description
Designed and implemented a full-stack insurance management platform using a microservices architecture with 7 independent services communicating via REST APIs and Apache Kafka event-driven messaging.

## Resume Bullets

### Backend / Architecture
- Architected **7 Spring Boot microservices** (User, Policy, Quote, Payment, Claim, Notification, API Gateway) with independent PostgreSQL databases per service, implementing clean layered architecture (Controller → Service → Repository → Entity).

- Implemented **JWT-based authentication** with Spring Security, BCrypt password hashing, role-based authorization (Customer/Admin), and HTTP interceptor for token propagation across all protected endpoints.

- Built **6 Apache Kafka event types** (CustomerRegistered, QuoteGenerated, PolicyPurchased, PaymentCompleted, ClaimSubmitted, ClaimStatusUpdated) enabling asynchronous, decoupled communication between services for non-blocking business workflows.

- Developed a **documented premium calculation engine** using multi-factor formula (coverage, age, risk, duration factors) with configurable parameters, replacing hardcoded random values.

- Designed **RESTful APIs** with consistent `ApiResponse<T>` wrapper format, global exception handling (`@RestControllerAdvice`), Bean Validation, pagination, sorting, and meaningful HTTP status codes across all endpoints.

### Frontend
- Built a **responsive Angular application** with lazy-loaded routes, JWT authentication interceptor, route guards (auth, admin, guest), and reusable components (sidebar navigation, data tables, stat cards, status badges).

- Implemented **15+ page components** including customer portal (dashboard, policy browser, multi-step quote generation, checkout-style payment, claims tracking with timeline) and admin dashboard (customer/policy/claim management with search, filter, and status transitions).

### DevOps & Quality
- Containerized all services with **multi-stage Docker builds** and orchestrated via **Docker Compose** with PostgreSQL, Zookeeper, Kafka, and 7 microservices.

- Wrote **JUnit 5 + Mockito tests** for service layers, controllers with MockMvc, and premium calculation logic, achieving coverage of core business flows.

- Configured **SpringDoc OpenAPI** (Swagger) documentation for all service APIs and Spring Boot Actuator for health monitoring across microservices.

# Interview Guide — Insurance Management System

Based on the actual implementation of this project.

---

## Java

### Why Java 17?
Java 17 is an LTS (Long-Term Support) release with significant improvements: sealed classes, pattern matching for switch, text blocks, and records. It's the minimum version required by Spring Boot 3.x.

### Where did you use OOP?
- **Encapsulation**: Private fields with getters/setters in entity classes (User, Policy, Claim)
- **Inheritance**: BaseEvent class extended by CustomerRegisteredEvent, QuoteGeneratedEvent, etc.
- **Polymorphism**: UserService interface with UserServiceImpl implementation
- **Abstraction**: Service interfaces hiding implementation details from controllers

### Where did you use Streams?
- Converting entity lists to DTO lists: `policies.getContent().stream().map(policyMapper::toResponse).toList()`
- Filtering active policies: `policies.filter(p -> p.getStatus() == ACTIVE)`
- Aggregating totals: `purchases.stream().mapToDouble(p -> p.getPremium()).sum()`

### Why Optional?
- Used in repository methods: `findByEmail()` returns `Optional<User>` to avoid null pointer exceptions
- Checked before accessing: `user.orElseThrow(() -> new ResourceNotFoundException(...))`

---

## Spring Boot

### How does dependency injection work?
Spring uses IoC (Inversion of Control) to manage bean lifecycle. Constructor injection is preferred — Spring automatically wires dependencies. For example, `UserServiceImpl` receives `UserRepository`, `PasswordEncoder`, `JwtTokenProvider`, etc. through constructor injection.

### Why DTOs?
DTOs prevent exposing JPA entities directly through APIs. This avoids:
- Circular references in JSON serialization
- Exposing sensitive fields (password hashes)
- Coupling API contracts to database schema
- Lazy loading issues

### How does global exception handling work?
`@RestControllerAdvice` with `@ExceptionHandler` methods catches exceptions across all controllers. Each exception type maps to an appropriate HTTP status and returns a consistent `ApiResponse` format.

### How does validation work?
- **Backend**: Jakarta Bean Validation (`@NotBlank`, `@Email`, `@Min`, `@DecimalMin`) on DTOs
- **Frontend**: Angular Reactive Forms with validators
- Backend validation is authoritative — frontend validation is for UX only

---

## Microservices

### Why microservices?
- **Independent deployment**: Each service can be deployed independently
- **Technology flexibility**: Different services can use different data stores
- **Scalability**: Scale policy service independently if it's under heavy load
- **Fault isolation**: A failure in notification service doesn't bring down the policy service

### How do services communicate?
- **Synchronous (REST)**: Quote Service calls Policy Service to get policy details using WebClient
- **Asynchronous (Kafka)**: Events like PolicyPurchased are published to Kafka topics; Payment and Notification services consume them independently

### What happens if one service is unavailable?
- REST calls use WebClient with error handling — returns null or throws exceptions gracefully
- Kafka-based communication is decoupled — producers and consumers are independent
- API Gateway routes requests and can be configured for fallbacks

### Why API Gateway?
- Single entry point for all client requests
- Routing to appropriate microservice
- Cross-cutting concerns (logging, CORS)
- Hides internal service architecture from clients

---

## Kafka

### Why Kafka?
- Decoupled, asynchronous communication between services
- Event sourcing: Services react to business events without tight coupling
- High throughput and fault tolerance
- Replay capability for debugging and recovery

### Producer vs Consumer?
- **Producer**: Publishes events to topics (e.g., PolicyService publishes PolicyPurchasedEvent)
- **Consumer**: Subscribes to topics and processes events (e.g., NotificationService consumes PolicyPurchasedEvent)

### Why asynchronous communication?
- Non-blocking: Policy Service doesn't wait for Notification Service to send notifications
- Better performance: Services process requests independently
- Resilience: If Notification Service is down, events are queued and processed later

### What happens if a consumer fails?
Kafka retains messages based on retention policy. The consumer can restart and reprocess messages from the last committed offset. Each service has its own consumer group.

### What is a Kafka topic?
A topic is a named channel for message streaming. We use: `customer-events`, `quote-events`, `policy-events`, `payment-events`, `claim-events`.

### How are events structured?
Each event extends `BaseEvent` with: `eventId` (UUID), `eventType`, `timestamp`, `correlationId` (for tracing), plus event-specific payload.

---

## Database

### Why PostgreSQL?
- ACID compliance for financial transactions
- Strong JSON support for flexible data
- Excellent performance and reliability
- Rich ecosystem and community support

### How are transactions handled?
Spring `@Transactional` annotation on service methods ensures atomic operations. If any step fails, the entire operation rolls back.

### Why database-per-service?
Each microservice owns its data. This ensures:
- Loose coupling between services
- Independent schema evolution
- No cross-service data joins (use REST/Kafka instead)

---

## Angular

### How does routing work?
Angular Router maps URLs to components. We use lazy loading (`loadComponent`) for performance — components load only when navigated to.

### What are guards?
Route guards control navigation access. We use:
- `authGuard`: Redirects unauthenticated users to login
- `adminGuard`: Restricts admin routes to ADMIN role
- `guestGuard`: Redirects authenticated users to their dashboard

### What are interceptors?
HTTP interceptors modify outgoing requests. Our `authInterceptor` automatically attaches JWT tokens to all API requests.

### Why reactive forms?
Reactive forms provide programmatic control over form state, validation, and submission. They're more testable and maintainable than template-driven forms for complex forms.

---

## Security

### How does JWT work?
1. User sends credentials to `/api/auth/login`
2. Server validates credentials and generates JWT with email and role
3. JWT is sent to client and stored in localStorage
4. Client attaches JWT in Authorization header for each request
5. Server validates JWT signature and expiration on each request

### How does role-based authorization work?
JWT contains a `role` claim (CUSTOMER/ADMIN). Spring Security checks `@PreAuthorize` or URL-based role requirements. `hasRole("ADMIN")` is added as `ROLE_ADMIN` authority.

---

## Testing

### Unit test vs integration test?
- **Unit tests**: Test individual components in isolation with mocks (Service layer)
- **Integration tests**: Test component interaction with real dependencies (Database, Kafka)

### Why Mockito?
Mockito creates mock objects to isolate the unit under test. For example, mocking `UserRepository` when testing `UserService`.

---

## Docker

### Why Docker?
- Consistent environments across development and production
- Easy service orchestration with Docker Compose
- Isolated services with their own dependencies

### How do services communicate inside Docker?
Services communicate via Docker network using service names as hostnames (e.g., `kafka:29092`, `user-db:5432`).

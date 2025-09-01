# Detailed System Design Fundamentals

## Understanding System Requirements

### Functional Requirements vs Non-Functional Requirements

#### Functional Requirements (What the system should do)
- User authentication and authorization
- Data storage and retrieval
- Business logic processing
- User interface interactions
- API endpoints and data formats

#### Non-Functional Requirements (How the system should perform)
- **Performance**: Response time < 200ms for 95% of requests
- **Scalability**: Handle 10x traffic increase without degradation
- **Availability**: 99.9% uptime (8.77 hours downtime/year)
- **Reliability**: Mean Time Between Failures (MTBF) > 30 days
- **Security**: Data encryption, secure authentication
- **Maintainability**: Code should be easily modifiable
- **Usability**: Intuitive user interface

### Requirement Gathering Techniques

#### User Stories
```
As a [user type], I want [functionality] so that [benefit]
```
- As a user, I want to login securely so that my data is protected
- As an admin, I want to view user analytics so that I can make business decisions

#### Use Cases
- **Primary Actor**: User
- **Preconditions**: User is registered
- **Main Flow**:
  1. User enters credentials
  2. System validates credentials
  3. System grants access
- **Alternative Flows**: Invalid credentials, account locked

## System Architecture Patterns

### Layered Architecture (N-Tier)

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  ┌─────────────────────────────────┐ │
│  │   Web Browsers, Mobile Apps     │ │
│  │   API Gateways, Load Balancers  │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
                   │
┌─────────────────────────────────────┐
│       Application Layer             │
│  ┌─────────────────────────────────┐ │
│  │   Business Logic, Services      │ │
│  │   API Controllers, Middleware   │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
                   │
┌─────────────────────────────────────┐
│         Data Layer                  │
│  ┌─────────────────────────────────┐ │
│  │   Databases, File Systems       │ │
│  │   Cache, Message Queues         │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Benefits
- **Separation of Concerns**: Each layer has specific responsibility
- **Maintainability**: Changes in one layer don't affect others
- **Testability**: Each layer can be tested independently
- **Scalability**: Layers can be scaled independently

#### Implementation Example (Node.js/Express)
```javascript
// Presentation Layer - Routes
app.get('/users', authenticate, userController.getUsers);

// Application Layer - Controllers
const userController = {
  async getUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Data Layer - Services
const userService = {
  async getAllUsers() {
    return await User.findAll();
  }
};
```

### Hexagonal Architecture (Ports and Adapters)

```
┌─────────────────────────────────────┐
│            Application Core         │
│  ┌─────────────────────────────────┐ │
│  │   Business Logic, Domain        │ │
│  │   Entities, Use Cases           │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
         │          │
    ┌────┴────┐ ┌───┴────┐
    │  Ports  │ │ Ports  │
    │(Driving)│ │(Driven)│
    └────┼────┘ └────┼───┘
         │          │
    ┌────┴────┐ ┌───┴────┐
    │Adapters │ │Adapters│
    │(Controllers││(Repositories│
    │ Web, CLI)│ │ Database) │
    └─────────┘ └─────────┘
```

#### Ports
- **Driving Ports**: Interfaces that the application implements (use cases)
- **Driven Ports**: Interfaces that the application depends on (repositories)

#### Adapters
- **Driving Adapters**: Controllers, CLI, API endpoints
- **Driven Adapters**: Database implementations, external APIs

## Data Flow Diagrams

### Level 0 DFD (Context Diagram)
```
┌─────────────────────────────────────┐
│           External Entities         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │  Users  │ │ Admins  │ │Systems │ │
│  └─────────┘ └─────────┘ └─────────┘ │
└─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│         Your System                 │
│  ┌─────────────────────────────────┐ │
│  │   Process Data, Generate        │ │
│  │   Reports, Handle Requests      │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│           Data Stores               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │Database │ │  Files │ │  Cache  │ │
│  └─────────┘ └─────────┘ └─────────┘ │
└─────────────────────────────────────┘
```

### Level 1 DFD (System Overview)
```
┌─────────┐    ┌─────────────┐    ┌─────────┐
│  Login  │───▶│ Authenticate │───▶│  User  │
│ Request │    │   User      │    │ Session│
└─────────┘    └─────────────┘    └─────────┘
      ▲               │                │
      │               ▼                ▼
┌─────────┐    ┌─────────────┐    ┌─────────┐
│  User   │◀───│   Validate  │◀───│Session │
│  Data   │    │ Credentials │    │ Store  │
└─────────┘    └─────────────┘    └─────────┘
```

## Performance Metrics and Benchmarks

### Response Time Benchmarks
- **Excellent**: < 100ms
- **Good**: 100-500ms
- **Acceptable**: 500ms-2s
- **Poor**: > 2s
- **Unacceptable**: > 10s

### Throughput Benchmarks
- **Small Application**: 100-1000 requests/second
- **Medium Application**: 1000-10000 requests/second
- **Large Application**: 10000-100000 requests/second
- **High-Traffic Application**: > 100000 requests/second

### Error Rate Benchmarks
- **Excellent**: < 0.1%
- **Good**: 0.1-1%
- **Acceptable**: 1-5%
- **Poor**: > 5%

## Capacity Planning

### Estimating User Load
```
Daily Active Users (DAU): 1,000,000
Peak Hours: 20% of DAU = 200,000 concurrent users
Requests per User per Hour: 10
Peak Requests per Second: (200,000 * 10) / 3600 = 556 RPS
```

### Resource Estimation
```
CPU Cores = (Requests/second * Avg Response Time) / 1000
Memory = (Concurrent Users * Avg Session Size) + Buffer
Storage = (Data Growth Rate * Retention Period) + Indexes
Network = (Requests/second * Avg Response Size) * 8 / 1000000 Mbps
```

## Security Fundamentals

### Authentication Methods
- **Basic Auth**: Username:Password encoded in Base64
- **JWT**: JSON Web Tokens with claims
- **OAuth 2.0**: Authorization framework
- **SAML**: XML-based authentication
- **Multi-Factor Authentication**: Something you know + something you have

### Authorization Models
- **Role-Based Access Control (RBAC)**: Permissions based on roles
- **Attribute-Based Access Control (ABAC)**: Permissions based on attributes
- **Access Control Lists (ACL)**: Permissions per resource

### Security Best Practices
- **Defense in Depth**: Multiple security layers
- **Least Privilege**: Minimum required permissions
- **Fail-Safe Defaults**: Deny by default
- **Security by Design**: Security from the beginning

## Monitoring and Observability

### Key Metrics to Monitor
- **Business Metrics**: User signups, revenue, conversion rates
- **System Metrics**: CPU, memory, disk, network
- **Application Metrics**: Response time, error rate, throughput
- **Infrastructure Metrics**: Server health, database connections

### Logging Levels
- **DEBUG**: Detailed debugging information
- **INFO**: General information about application operation
- **WARN**: Potentially harmful situations
- **ERROR**: Error conditions that don't stop the application
- **FATAL**: Severe errors that cause application termination

### Alerting Rules
- Response time > 2 seconds for 5 minutes
- Error rate > 5% for 10 minutes
- CPU usage > 90% for 15 minutes
- Memory usage > 85% for 20 minutes

## Case Study: Designing a Social Media Platform

### Requirements Analysis
- **Functional**: User registration, posting, following, timeline
- **Non-Functional**: 99.9% availability, < 500ms response time, scalable to 100M users

### Architecture Design
```
┌─────────────────────────────────────┐
│         Load Balancer (AWS ALB)     │
└─────────────────────────────────────┘
                   │
          ┌────────┼────────┐
          │        │        │
┌─────────┴─┐ ┌────┴─────┐ ┌─┴─────────┐
│  Web API  │ │ User API │ │ Post API  │
│  Gateway  │ │ Service  │ │ Service   │
└───────────┘ └──────────┘ └───────────┘
      │            │            │
┌─────┼────────────┼────────────┼─────┐
│     │            │            │     │
│ ┌───┴───┐   ┌────┴────┐  ┌────┴────┐ │
│ │Redis │   │PostgreSQL│  │Cassandra│ │
│ │Cache │   │  Users   │  │  Posts  │ │
│ └───────┘   └─────────┘  └─────────┘ │
└─────────────────────────────────────┘
```

### Scaling Strategy
- **Horizontal Scaling**: Auto-scaling groups for API services
- **Database Sharding**: Users by region, posts by timeline
- **Caching**: Redis for user sessions and hot data
- **CDN**: CloudFront for static assets

### Performance Optimization
- **Database Indexing**: Optimized queries with proper indexes
- **Caching Strategy**: 80% cache hit rate target
- **Async Processing**: Background jobs for notifications
- **Compression**: Gzip for API responses

## Common Design Patterns

### Singleton Pattern
```javascript
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    this.connection = createConnection();
    DatabaseConnection.instance = this;
  }
}
```

### Factory Pattern
```javascript
class PaymentProcessorFactory {
  static createProcessor(type) {
    switch(type) {
      case 'stripe':
        return new StripeProcessor();
      case 'paypal':
        return new PayPalProcessor();
      default:
        throw new Error('Unknown processor type');
    }
  }
}
```

### Observer Pattern
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}
```

## Troubleshooting Common Issues

### Performance Issues
- **High Response Time**: Check database queries, add indexes, implement caching
- **High CPU Usage**: Profile code, optimize algorithms, consider horizontal scaling
- **High Memory Usage**: Check for memory leaks, optimize data structures
- **Slow Database Queries**: Analyze query plans, add indexes, denormalize data

### Availability Issues
- **Service Downtime**: Implement health checks, auto-healing, redundancy
- **Database Connection Issues**: Connection pooling, retry logic, failover
- **Network Issues**: Load balancing, circuit breakers, timeouts

### Scalability Issues
- **Traffic Spikes**: Auto-scaling, rate limiting, queuing
- **Data Growth**: Database sharding, archiving, partitioning
- **Resource Constraints**: Vertical scaling, optimization, architecture changes

## Learning Assessment

### Quiz Questions

1. **What is the difference between functional and non-functional requirements?**
   - Functional: What the system does
   - Non-functional: How well the system performs

2. **What are the three main layers in a typical web application architecture?**
   - Presentation, Application, Data

3. **What is the CAP theorem?**
   - You can only guarantee 2 out of 3: Consistency, Availability, Partition Tolerance

4. **What is the difference between horizontal and vertical scaling?**
   - Horizontal: Add more servers
   - Vertical: Add more power to existing server

5. **What are the main components of a load balancer?**
   - Distribution algorithm, health checks, session persistence

### Practical Exercises

1. **Design a URL Shortening Service**
   - Requirements: Shorten URLs, redirect, analytics
   - Scale: Handle millions of URLs
   - Constraints: Fast redirects, custom aliases

2. **Design a Chat Application**
   - Real-time messaging
   - Group chats
   - Message history
   - Online status

3. **Design a File Storage System**
   - Upload/download files
   - Sharing permissions
   - Version control
   - Large file support

## Resources for Further Learning

### Books
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "System Design Interview" by Alex Xu
- "Building Microservices" by Sam Newman
- "Clean Architecture" by Robert C. Martin

### Online Courses
- System Design courses on Udemy, Coursera
- Distributed Systems courses on edX
- Architecture patterns on Pluralsight

### Tools
- Draw.io for diagrams
- PlantUML for text-based diagrams
- Lucidchart for collaborative diagramming
- AWS Architecture Diagrams

Remember: System design is both an art and a science. It requires understanding business requirements, technical constraints, and making trade-offs. Practice designing systems for different scenarios to build your expertise.
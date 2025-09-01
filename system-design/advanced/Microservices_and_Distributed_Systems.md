# Microservices and Distributed Systems

## Microservices Architecture

### What are Microservices?
Microservices are an architectural style where applications are built as a collection of small, independent services that communicate over well-defined APIs. Each service is responsible for a specific business capability.

### Characteristics of Microservices

#### Small and Focused
- Each service has a single responsibility
- Easier to understand and maintain
- Can be developed by small teams

#### Independently Deployable
- Services can be deployed independently
- Reduces deployment risk
- Enables continuous deployment

#### Technology Agnostic
- Different services can use different technologies
- Choose best tool for each job
- Technology diversity

#### Decentralized Data Management
- Each service manages its own data
- Can choose appropriate data store
- Data consistency challenges

### Microservices vs Monolithic Architecture

#### Monolithic Architecture
```
┌─────────────────────────────────┐
│         Monolithic App          │
│ ┌─────────────┐ ┌─────────────┐ │
│ │   User      │ │   Product   │ │
│ │ Management │ │ Management │ │
│ └─────────────┘ └─────────────┘ │
│ ┌─────────────┐ ┌─────────────┐ │
│ │   Order     │ │   Payment   │ │
│ │ Management │ │ Management │ │
│ └─────────────┘ └─────────────┘ │
└─────────────────────────────────┘
```

- Single codebase
- Shared database
- Simple deployment
- Scaling requires scaling entire app

#### Microservices Architecture
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ User Service│ │Product Svc │ │Order Service│ │Payment Svc │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
       │              │              │              │
       └──────────────┼──────────────┼──────────────┘
                     API Gateway
```

- Multiple codebases
- Service-specific databases
- Complex deployment
- Independent scaling

### Service Communication

#### Synchronous Communication
- REST APIs
- GraphQL
- gRPC
- Direct service-to-service calls

#### Asynchronous Communication
- Message queues
- Event streaming
- Publish-subscribe patterns

### API Gateway Pattern
```
┌─────────────┐
│   Client    │
│  (Mobile)   │
└─────────────┘
       │
┌─────────────┐ ← Authentication
│ API Gateway │ ← Rate Limiting
│             │ ← Request Routing
└─────────────┘ ← Response Transformation
       │
   ┌───┼───┐
   │   │   │
┌─────┐┌─────┐┌─────┐
│Svc A││Svc B││Svc C│
└─────┘└─────┘└─────┘
```

- Single entry point for all clients
- Handles cross-cutting concerns
- Service discovery and routing

### Service Discovery
- **Client-side**: Clients query registry for service locations
- **Server-side**: Load balancer handles service discovery
- **Service Mesh**: Infrastructure layer handles service-to-service communication

### Data Management in Microservices

#### Database per Service
```
┌─────────────┐ ┌─────────────┐
│User Service │ │Order Service│
│            │ │             │
│┌───────────┐│ │┌───────────┐│
││ User DB   ││ ││ Order DB  ││
│└───────────┘│ │└───────────┘│
└─────────────┘ └─────────────┘
```

- Each service owns its data
- Technology choice flexibility
- Data consistency challenges

#### Shared Database
```
┌─────────────┐ ┌─────────────┐
│User Service │ │Order Service│
│            │ │             │
└─────────────┘ └─────────────┘
         │             │
         └─────────────┘
           Shared DB
```

- Simpler data consistency
- Tight coupling
- Single point of failure

### Event Sourcing and CQRS

#### Event Sourcing
```
Commands → Aggregate → Events → Event Store
```

- Store all changes as events
- Rebuild state from events
- Audit trail
- Temporal queries

#### CQRS (Command Query Responsibility Segregation)
```
┌─────────────┐     ┌─────────────┐
│   Commands  │────▶│  Write Model│
│   (Create,  │     │             │
│    Update)  │     └─────────────┘
└─────────────┘            │
                           ▼
┌─────────────┐     ┌─────────────┐
│   Queries   │◀────│  Read Model │
│   (Get,     │     │             │
│    List)    │     └─────────────┘
└─────────────┘
```

- Separate read and write models
- Optimize each for its purpose
- Eventual consistency

## Distributed Systems

### What are Distributed Systems?
Distributed systems are systems where components are located on different networked computers that communicate and coordinate their actions by passing messages to achieve a common goal.

### Challenges in Distributed Systems

#### Network Reliability
- Networks are unreliable
- Messages can be lost, delayed, or reordered
- Network partitions can occur

#### Latency
- Communication over network is slower than local calls
- Geographic distribution adds latency
- Need to minimize round trips

#### Concurrency
- Multiple processes running simultaneously
- Race conditions and deadlocks
- Coordination and synchronization

#### Partial Failures
- Some components may fail while others continue
- Difficult to detect failures
- Need fault-tolerant designs

### Consistency Models

#### Strong Consistency
- All reads return the most recent write
- Linearizability
- High latency and low availability

#### Eventual Consistency
- All replicas eventually converge
- Reads may return stale data
- High availability and low latency

#### Causal Consistency
- Causally related operations are seen in order
- Concurrent operations may be seen in different orders

### CAP Theorem

#### The CAP Triangle
```
┌─────────────┐
│             │
│ Consistency │
│             │
└──────┬──────┘
       │
┌──────┼──────┐
│      │      │
│Availability│
│      │      │
└──────┼──────┘
       │
┌──────┴──────┐
│            │
│  Partition  │
│  Tolerance  │
└─────────────┘
```

- **Consistency**: All nodes see the same data simultaneously
- **Availability**: System remains operational despite failures
- **Partition Tolerance**: System continues despite network partitions

#### CAP Theorem Statement
"In a distributed system, you can only guarantee 2 out of the 3 properties at any given time."

#### Practical Implications
- **CP Systems**: Choose consistency over availability (e.g., banking systems)
- **AP Systems**: Choose availability over consistency (e.g., social networks)
- **CA Systems**: Not possible in distributed systems with network partitions

### Consensus Algorithms

#### Paxos
- Classic consensus algorithm
- Ensures agreement on a single value
- Complex to implement
- Used in Google Chubby, ZooKeeper

#### Raft
- Easier to understand than Paxos
- Leader election and log replication
- Used in etcd, Consul

#### Byzantine Fault Tolerance
- Tolerates arbitrary failures
- Used in blockchain systems
- Higher overhead

### Distributed Transactions

#### Two-Phase Commit (2PC)
```
Phase 1: Prepare
Coordinator → Participants: "Prepare to commit?"
Participants → Coordinator: "Yes/No"

Phase 2: Commit
Coordinator → Participants: "Commit"
Participants → Coordinator: "Committed"
```

- Atomic commitment protocol
- Blocking protocol
- Vulnerable to coordinator failure

#### Saga Pattern
```
Service A → Service B → Service C
    ↓         ↓         ↓
Rollback A ← Rollback B ← Rollback C
```

- Sequence of local transactions
- Compensating transactions for rollback
- Eventual consistency

### Distributed Locking

#### Distributed Locks
- Prevent concurrent access to shared resources
- Redis, ZooKeeper provide distributed locks
- Need to handle lock expiration and renewal

#### Optimistic Locking
- Allow concurrent access
- Detect conflicts and resolve them
- Better performance for low contention

### Service Mesh

#### What is a Service Mesh?
A service mesh is a dedicated infrastructure layer for handling service-to-service communication. It provides features like load balancing, service discovery, encryption, and observability.

#### Components
- **Data Plane**: Handles actual communication
- **Control Plane**: Manages configuration and policies

#### Popular Service Meshes
- Istio
- Linkerd
- Consul Connect

### Observability in Distributed Systems

#### Metrics
- System performance indicators
- Resource utilization
- Error rates
- Response times

#### Logging
- Centralized log aggregation
- Structured logging
- Log correlation across services

#### Tracing
- Distributed request tracing
- End-to-end latency analysis
- Performance bottleneck identification

### Fault Tolerance Patterns

#### Circuit Breaker
```
Closed → Open → Half-Open → Closed
```

- Stop calling failing services
- Allow recovery attempts
- Prevent cascade failures

#### Bulkhead
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Service A  │ │  Service B  │ │  Service C  │
│             │ │             │ │             │
│ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │
│ │Resource │ │ │ │Resource │ │ │ │Resource │ │
│ │ Pool 1  │ │ │ │ Pool 2  │ │ │ │ Pool 3  │ │
│ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │
└─────────────┘ └─────────────┘ └─────────────┘
```

- Isolate failures to specific parts
- Prevent resource exhaustion
- Independent scaling

#### Retry with Backoff
```
Attempt 1: Immediate
Attempt 2: 1 second delay
Attempt 3: 2 second delay
Attempt 4: 4 second delay
```

- Handle transient failures
- Exponential backoff
- Jitter to prevent thundering herd

### Scaling Distributed Systems

#### Horizontal Scaling
- Add more instances
- Load balancing
- Stateless services

#### Vertical Scaling
- Add more resources to existing instances
- Limited by hardware
- Simpler management

#### Auto-scaling
- Automatic scaling based on metrics
- Cloud-native feature
- Cost optimization

### Best Practices

#### Microservices
1. Design for failure
2. Implement proper monitoring
3. Use API versioning
4. Automate deployment
5. Implement circuit breakers

#### Distributed Systems
1. Embrace eventual consistency
2. Design for partition tolerance
3. Implement proper logging and tracing
4. Use idempotent operations
5. Plan for capacity and failure

Remember: Distributed systems are complex. Start simple, understand your requirements, and evolve your architecture as needed. Focus on observability, fault tolerance, and scalability from the beginning.
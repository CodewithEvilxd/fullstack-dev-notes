# Load Balancing and Database Design

## Load Balancing

### What is Load Balancing?
Load balancing is the process of distributing network traffic across multiple servers to ensure no single server becomes overwhelmed, improving performance, reliability, and availability.

### Types of Load Balancers

#### Hardware Load Balancers
- Dedicated hardware appliances
- High performance and reliability
- Expensive and less flexible
- Examples: F5, Citrix NetScaler

#### Software Load Balancers
- Software running on commodity hardware
- More flexible and cost-effective
- Examples: NGINX, HAProxy, Apache

#### Cloud Load Balancers
- Managed by cloud providers
- Auto-scaling capabilities
- Examples: AWS ELB, Google Cloud Load Balancing

### Load Balancing Algorithms

#### Round Robin
```
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A
```

- Simple and fair distribution
- Doesn't consider server load or capacity

#### Least Connections
```
Server A: 5 connections
Server B: 3 connections ← Next request
Server C: 7 connections
```

- Routes to server with fewest active connections
- Better for variable request processing times

#### IP Hash
```
Client IP: 192.168.1.100 → Hash → Server B
Client IP: 192.168.1.101 → Hash → Server A
```

- Routes requests from same IP to same server
- Useful for session persistence

#### Weighted Round Robin
```
Server A: Weight 3
Server B: Weight 1
Server C: Weight 2

Requests: A, A, A, B, C, C, A, A, A, B, C, C...
```

- Assigns different capacities to servers
- Useful for heterogeneous server configurations

### Load Balancing Strategies

#### Layer 4 (Transport Layer)
- Routes based on IP address and port
- Fast and efficient
- No awareness of application content

#### Layer 7 (Application Layer)
- Routes based on application content
- Can make intelligent routing decisions
- More processing overhead

### High Availability and Failover

#### Active-Passive
```
┌─────────────┐
│   Active    │ ← Traffic
│ Load Balancer│
└─────────────┘
        │
┌─────────────┐
│   Passive   │ ← Standby
│ Load Balancer│
└─────────────┘
```

- One active, one passive load balancer
- Passive takes over if active fails

#### Active-Active
```
┌─────────────┐ ┌─────────────┐
│   Active    │ │   Active    │
│ Load Balancer│ │ Load Balancer│ ← Traffic
└─────────────┘ └─────────────┘
```

- Both load balancers active
- Higher capacity and better redundancy

### Health Checks
- Regular checks of server health
- Remove unhealthy servers from pool
- Add servers back when they recover
- Types: TCP, HTTP, application-specific

## Database Design

### Database Types

#### Relational Databases (SQL)
- Structured data with predefined schema
- ACID transactions
- Complex queries with JOINs
- Examples: MySQL, PostgreSQL, Oracle

#### NoSQL Databases
- Flexible schema
- Horizontal scalability
- Various data models
- Examples: MongoDB, Cassandra, Redis

### Database Design Principles

#### Normalization
- Eliminate data redundancy
- Ensure data integrity
- Improve update performance
- Can impact read performance

#### Denormalization
- Add redundancy for better read performance
- Reduce JOIN operations
- May impact write performance
- Common in data warehouses

### Indexing Strategies

#### B-Tree Index
```
Root
├── Branch 1
│   ├── Leaf A
│   └── Leaf B
└── Branch 2
    ├── Leaf C
    └── Leaf D
```

- Balanced tree structure
- Good for range queries
- Used in most relational databases

#### Hash Index
```
Key → Hash Function → Bucket
"John" → hash() → Bucket 3
"Mary" → hash() → Bucket 7
```

- Fast exact lookups
- Poor for range queries
- Used in hash tables and some databases

### Database Scaling

#### Vertical Scaling
- Add more resources to single server
- CPU, RAM, storage upgrades
- Simpler but limited

#### Horizontal Scaling (Sharding)
```
User Table Sharded by User ID
┌─────────────────┐
│ Shard 1: ID 1-100│
│ Server A         │
└─────────────────┘
┌─────────────────┐
│ Shard 2: ID 101-200│
│ Server B         │
└─────────────────┘
```

- Distribute data across multiple servers
- Better scalability
- More complex management

### Replication

#### Master-Slave Replication
```
┌─────────────┐
│   Master    │ ← Writes
│  Database   │
└─────────────┘
       ↓
┌─────────────┐ ┌─────────────┐
│   Slave 1   │ │   Slave 2   │ ← Reads
│  Database   │ │  Database   │
└─────────────┘ └─────────────┘
```

- Master handles writes
- Slaves handle reads
- Improves read performance

#### Master-Master Replication
```
┌─────────────┐ ↔ ┌─────────────┐
│   Master 1  │   │   Master 2  │
│  Database   │   │  Database   │
└─────────────┘   └─────────────┘
       ↑               ↑
    Writes          Writes
```

- Both masters can handle writes
- Conflict resolution needed
- Higher availability

### Connection Pooling
- Reuse database connections
- Reduce connection overhead
- Limit maximum connections
- Handle connection failures gracefully

### Database Optimization Techniques

#### Query Optimization
- Use EXPLAIN to analyze query execution
- Add appropriate indexes
- Avoid SELECT *
- Use prepared statements

#### Schema Optimization
- Choose correct data types
- Use foreign keys for referential integrity
- Partition large tables
- Archive old data

#### Caching Layer
- Cache frequently accessed data
- Use Redis or Memcached
- Implement cache invalidation strategies

### Backup and Recovery

#### Backup Types
- **Full Backup**: Complete database copy
- **Incremental Backup**: Only changes since last backup
- **Differential Backup**: Changes since last full backup

#### Recovery Strategies
- Point-in-time recovery
- Disaster recovery plans
- Regular backup testing
- Offsite backup storage

### Monitoring and Alerting

#### Key Metrics
- Query performance
- Connection count
- Disk usage
- Replication lag
- Error rates

#### Tools
- Database monitoring: Percona Monitoring, Datadog
- Query analysis: Slow query logs
- Performance profiling: Database profilers

## Best Practices

### Load Balancing
1. Use health checks to detect failed servers
2. Implement session persistence when needed
3. Monitor load balancer performance
4. Plan for capacity and failover
5. Use SSL termination at load balancer

### Database Design
1. Start with normalized schema
2. Add indexes based on query patterns
3. Use connection pooling
4. Implement proper backup strategies
5. Monitor performance regularly
6. Plan for scaling from day one

Remember: Database design decisions have long-term impacts. Consider your access patterns, scalability needs, and maintenance requirements when making choices.
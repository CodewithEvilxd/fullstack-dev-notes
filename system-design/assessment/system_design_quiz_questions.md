# System Design Quiz Questions

## Basic Level Questions

### Question 1: Client-Server Architecture
**What is the main difference between client-server and peer-to-peer architecture?**

A) Client-server uses more bandwidth
B) Client-server has dedicated servers providing services
C) Peer-to-peer is more secure
D) Peer-to-peer requires less hardware

**Answer: B) Client-server has dedicated servers providing services**

**Explanation:** In client-server architecture, dedicated servers provide services to clients, while in peer-to-peer, all nodes act as both clients and servers.

### Question 2: HTTP Methods
**Which HTTP method should be used to retrieve data from a server without modifying it?**

A) POST
B) PUT
C) GET
D) DELETE

**Answer: C) GET**

**Explanation:** GET is used to retrieve data from the server. POST is for creating, PUT for updating, DELETE for removing.

### Question 3: Scalability
**What is vertical scaling?**

A) Adding more servers
B) Adding more power to existing server
C) Using load balancers
D) Implementing caching

**Answer: B) Adding more power to existing server**

**Explanation:** Vertical scaling means adding more CPU, RAM, or storage to an existing server.

### Question 4: REST APIs
**What does REST stand for?**

A) Representational State Transfer
B) Remote Execution and Storage Technology
C) Reliable Enterprise Service Transport
D) Resource Exchange and Synchronization Tool

**Answer: A) Representational State Transfer**

**Explanation:** REST is an architectural style for designing networked applications.

## Intermediate Level Questions

### Question 5: Load Balancing
**Which load balancing algorithm distributes requests sequentially to servers?**

A) Least Connections
B) IP Hash
C) Round Robin
D) Weighted Round Robin

**Answer: C) Round Robin**

**Explanation:** Round Robin distributes requests sequentially: Server 1, Server 2, Server 3, Server 1, etc.

### Question 6: Database Design
**What is database normalization?**

A) Adding redundancy to improve performance
B) Eliminating redundancy and ensuring data integrity
C) Creating multiple copies of data
D) Compressing data to save space

**Answer: B) Eliminating redundancy and ensuring data integrity**

**Explanation:** Normalization organizes data to reduce redundancy and improve data integrity.

### Question 7: Caching
**What is cache invalidation?**

A) Removing expired data from cache
B) Adding new data to cache
C) Updating cache when source data changes
D) Compressing cache data

**Answer: C) Updating cache when source data changes**

**Explanation:** Cache invalidation ensures cache stays consistent with the source of truth.

### Question 8: Message Queues
**What is the main benefit of using message queues?**

A) Faster processing
B) Decoupling producers and consumers
C) Data compression
D) Real-time communication

**Answer: B) Decoupling producers and consumers**

**Explanation:** Message queues allow producers and consumers to operate independently.

## Advanced Level Questions

### Question 9: CAP Theorem
**According to CAP theorem, which combination is impossible in a distributed system?**

A) Consistency and Availability
B) Consistency and Partition Tolerance
C) Availability and Partition Tolerance
D) All combinations are possible

**Answer: D) All combinations are impossible simultaneously**

**Explanation:** CAP theorem states you can only guarantee 2 out of 3: Consistency, Availability, Partition Tolerance.

### Question 10: Microservices
**What is a major challenge when implementing microservices?**

A) Service discovery
B) Data consistency across services
C) Independent deployment
D) Technology diversity

**Answer: B) Data consistency across services**

**Explanation:** Maintaining data consistency across multiple independent services is challenging.

### Question 11: Distributed Systems
**What is eventual consistency?**

A) Data is always consistent
B) Data becomes consistent over time
C) Data is never consistent
D) Data consistency is guaranteed

**Answer: B) Data becomes consistent over time**

**Explanation:** Eventual consistency means that if no new updates are made, all replicas will eventually have the same data.

### Question 12: Fault Tolerance
**What is a circuit breaker pattern used for?**

A) Load balancing
B) Preventing cascade failures
C) Data encryption
D) User authentication

**Answer: B) Preventing cascade failures**

**Explanation:** Circuit breaker stops calling failing services to prevent cascade failures.

## Scenario-Based Questions

### Question 13: Design a URL Shortener
**You're designing a URL shortener service. Which database would you choose for storing the mapping between short URLs and original URLs?**

A) Relational database with indexing
B) Document database
C) Graph database
D) Time-series database

**Answer: A) Relational database with indexing**

**Explanation:** Relational databases with proper indexing provide fast lookups for URL mappings.

### Question 14: E-commerce Platform
**For an e-commerce platform expecting 10,000 concurrent users, which caching strategy would you recommend?**

A) Client-side caching only
B) Multi-level caching (CDN + Application + Database)
C) Database caching only
D) No caching needed

**Answer: B) Multi-level caching (CDN + Application + Database)**

**Explanation:** Multi-level caching provides optimal performance for high-traffic applications.

### Question 15: Real-time Chat Application
**For a real-time chat application, which technology would you choose for message delivery?**

A) HTTP polling
B) WebSockets
C) Email
D) SMS

**Answer: B) WebSockets**

**Explanation:** WebSockets provide full-duplex communication for real-time messaging.

### Question 16: Global User Base
**Your application has users worldwide. Which strategy would you use for global data distribution?**

A) Single data center
B) Multi-region deployment with data replication
C) Local storage on user devices
D) Email-based data sync

**Answer: B) Multi-region deployment with data replication**

**Explanation:** Multi-region deployment reduces latency and improves availability for global users.

## Performance Questions

### Question 17: Database Optimization
**Your database queries are slow. What's the first thing you should check?**

A) Add more RAM to server
B) Check query execution plans
C) Use NoSQL database
D) Implement caching

**Answer: B) Check query execution plans**

**Explanation:** Query execution plans help identify bottlenecks in database queries.

### Question 18: API Performance
**Your API response time is 2 seconds. What's the most effective optimization?**

A) Add more servers
B) Implement database indexing
C) Use faster programming language
D) Compress responses

**Answer: B) Implement database indexing**

**Explanation:** Database indexing often provides the biggest performance improvement for slow queries.

### Question 19: Memory Issues
**Your application is experiencing memory leaks. Which tool would help identify the issue?**

A) Network analyzer
B) Memory profiler
C) CPU monitor
D) Disk usage analyzer

**Answer: B) Memory profiler**

**Explanation:** Memory profilers help identify memory leaks and excessive memory usage.

### Question 20: Scaling Strategy
**Your application handles 1,000 requests/second. How would you scale to 10,000 requests/second?**

A) Vertical scaling only
B) Horizontal scaling with load balancer
C) Database optimization only
D) Add more developers

**Answer: B) Horizontal scaling with load balancer**

**Explanation:** Horizontal scaling with load balancing is the most effective way to handle increased traffic.

## Security Questions

### Question 21: Authentication
**Which authentication method is most secure for APIs?**

A) Basic Authentication
B) API Keys
C) JWT with expiration
D) Username/password only

**Answer: C) JWT with expiration**

**Explanation:** JWT provides stateless authentication with expiration for better security.

### Question 22: Data Protection
**How should sensitive data be stored in databases?**

A) Plain text
B) Encrypted at rest
C) Compressed
D) In separate database

**Answer: B) Encrypted at rest**

**Explanation:** Sensitive data should be encrypted to protect against breaches.

### Question 23: Rate Limiting
**Why is rate limiting important for APIs?**

A) To charge users more
B) To prevent abuse and ensure fair usage
C) To slow down users
D) To collect user data

**Answer: B) To prevent abuse and ensure fair usage**

**Explanation:** Rate limiting protects against abuse, DDoS attacks, and ensures fair resource usage.

### Question 24: HTTPS
**Why should all web applications use HTTPS?**

A) It's faster
B) It encrypts data in transit
C) It's required by law
D) It improves SEO

**Answer: B) It encrypts data in transit**

**Explanation:** HTTPS encrypts data between client and server, protecting against eavesdropping.

## Practical Implementation Questions

### Question 25: Error Handling
**What's the best practice for handling database connection failures?**

A) Show error to user immediately
B) Retry with exponential backoff
C) Switch to different database
D) Restart application

**Answer: B) Retry with exponential backoff**

**Explanation:** Retry with exponential backoff handles transient failures gracefully.

### Question 26: Logging
**What information should be included in application logs?**

A) User passwords
B) Request IDs, timestamps, error messages
C) Credit card numbers
D) Personal identifiable information

**Answer: B) Request IDs, timestamps, error messages**

**Explanation:** Logs should contain debugging information but never sensitive data.

### Question 27: Monitoring
**Which metric is most important for system health?**

A) CPU usage
B) Error rate
C) Memory usage
D) Disk space

**Answer: B) Error rate**

**Explanation:** Error rate indicates system reliability and user experience issues.

### Question 28: Backup Strategy
**How often should you backup critical data?**

A) Once a year
B) Daily with weekly full backups
C) Only when needed
D) Never, use cloud storage

**Answer: B) Daily with weekly full backups**

**Explanation:** Regular backups ensure data can be recovered in case of failures.

## Advanced Scenario Questions

### Question 29: High Traffic Spike
**Your e-commerce site expects 10x traffic during Black Friday. How do you prepare?**

A) Add more servers manually
B) Use auto-scaling with load balancers
C) Tell users to come back later
D) Use caching only

**Answer: B) Use auto-scaling with load balancers**

**Explanation:** Auto-scaling automatically handles traffic spikes by adding/removing servers.

### Question 30: Data Consistency
**In a distributed system, how do you ensure data consistency across regions?**

A) Use synchronous replication
B) Use eventual consistency
C) Store data locally only
D) Use manual synchronization

**Answer: B) Use eventual consistency**

**Explanation:** Eventual consistency balances consistency with availability in distributed systems.

## Answer Key Summary

| Question | Answer | Key Concept |
|----------|--------|-------------|
| 1 | B | Client-Server Architecture |
| 2 | C | HTTP Methods |
| 3 | B | Vertical Scaling |
| 4 | A | REST APIs |
| 5 | C | Load Balancing |
| 6 | B | Database Normalization |
| 7 | C | Cache Invalidation |
| 8 | B | Message Queues |
| 9 | D | CAP Theorem |
| 10 | B | Microservices |
| 11 | B | Eventual Consistency |
| 12 | B | Circuit Breaker |
| 13 | A | URL Shortener Design |
| 14 | B | Multi-level Caching |
| 15 | B | Real-time Communication |
| 16 | B | Global Distribution |
| 17 | B | Query Optimization |
| 18 | B | Database Indexing |
| 19 | B | Memory Profiling |
| 20 | B | Horizontal Scaling |
| 21 | C | JWT Authentication |
| 22 | B | Data Encryption |
| 23 | B | Rate Limiting |
| 24 | B | HTTPS Security |
| 25 | B | Error Handling |
| 26 | B | Logging Best Practices |
| 27 | B | Error Rate Monitoring |
| 28 | B | Backup Strategy |
| 29 | B | Auto-scaling |
| 30 | B | Distributed Consistency |

These quiz questions cover fundamental to advanced system design concepts. Use them to assess understanding and identify areas for further study.
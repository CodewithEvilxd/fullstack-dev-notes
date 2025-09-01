# HTTP, REST APIs, and Basic Scalability

## HTTP (HyperText Transfer Protocol)

### Overview
HTTP is the foundation of data communication on the World Wide Web. It's a protocol for transferring hypertext requests and information between clients and servers.

### HTTP Methods
- **GET**: Retrieve data from server
- **POST**: Send data to server to create resource
- **PUT**: Update existing resource
- **DELETE**: Remove resource
- **PATCH**: Partial update of resource
- **HEAD**: Get headers without body
- **OPTIONS**: Get supported methods

### HTTP Status Codes
- **1xx**: Informational
- **2xx**: Success (200 OK, 201 Created, 204 No Content)
- **3xx**: Redirection (301 Moved Permanently, 302 Found)
- **4xx**: Client Error (400 Bad Request, 401 Unauthorized, 404 Not Found)
- **5xx**: Server Error (500 Internal Server Error, 502 Bad Gateway)

### HTTP Headers
- **Content-Type**: Type of data being sent
- **Authorization**: Authentication credentials
- **Cache-Control**: Caching directives
- **User-Agent**: Client information

## REST (Representational State Transfer)

### Principles
1. **Client-Server**: Separation of concerns
2. **Stateless**: Each request contains all necessary information
3. **Cacheable**: Responses can be cached
4. **Uniform Interface**: Consistent interface across resources
5. **Layered System**: Client doesn't know if connected directly or through intermediaries

### REST API Design
- Use nouns for resources: `/users`, `/products`
- Use HTTP methods appropriately
- Use plural nouns for collections
- Use query parameters for filtering: `/users?age=25`
- Use path parameters for specific resources: `/users/123`

### Example REST API
```
GET    /api/users          # Get all users
GET    /api/users/123      # Get user with ID 123
POST   /api/users          # Create new user
PUT    /api/users/123      # Update user 123
DELETE /api/users/123      # Delete user 123
GET    /api/users/123/posts # Get posts for user 123
```

## Basic Scalability Concepts

### Vertical Scaling (Scale Up)
```
Before:
┌─────────────┐
│   Server    │
│ CPU: 4 cores│
│ RAM: 8GB    │
└─────────────┘

After:
┌─────────────┐
│   Server    │
│ CPU: 8 cores│
│ RAM: 16GB   │
└─────────────┘
```

- Add more resources to existing server
- Simpler to implement
- Hardware limitations
- Single point of failure

### Horizontal Scaling (Scale Out)
```
Before:
┌─────────────┐
│   Server 1  │
└─────────────┘

After:
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Server 1  │ │   Server 2  │ │   Server 3  │
└─────────────┘ └─────────────┘ └─────────────┘
     ↑               ↑               ↑
     └───────────────┼───────────────┘
                 Load Balancer
```

- Add more servers
- Distribute load across servers
- Better fault tolerance
- More complex to manage

### Load Balancing
- **Round Robin**: Distribute requests sequentially
- **Least Connections**: Send to server with fewest active connections
- **IP Hash**: Route based on client IP for session persistence
- **Weighted**: Assign different weights to servers

### Caching Strategies
- **Client-side Caching**: Browser caches static resources
- **Server-side Caching**: Cache frequently accessed data
- **CDN (Content Delivery Network)**: Distribute content geographically

### Database Scaling
- **Read Replicas**: Multiple copies for read operations
- **Sharding**: Split data across multiple databases
- **Connection Pooling**: Reuse database connections

## Performance Optimization

### Frontend Optimization
- Minimize HTTP requests
- Compress resources (Gzip)
- Use CDN for static assets
- Optimize images
- Minify CSS/JavaScript

### Backend Optimization
- Use efficient algorithms
- Optimize database queries
- Implement caching
- Use asynchronous processing
- Monitor and profile performance

### Network Optimization
- Reduce latency with CDNs
- Use HTTP/2 for multiplexing
- Implement compression
- Minimize round trips

## Monitoring and Metrics

### Key Metrics
- Response Time
- Throughput (requests per second)
- Error Rate
- CPU/Memory Usage
- Network I/O

### Tools
- **Application Monitoring**: New Relic, Datadog
- **Infrastructure Monitoring**: Prometheus, Grafana
- **Load Testing**: JMeter, Artillery
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

## Common Scalability Patterns

### Microservices
- Break application into smaller services
- Each service can scale independently
- Use APIs for communication

### Message Queues
- Decouple components
- Handle asynchronous processing
- Buffer requests during peak loads

### Auto-scaling
- Automatically adjust resources based on demand
- Cloud providers offer auto-scaling features
- Cost-effective resource management

## Best Practices

1. Design for failure
2. Use stateless services when possible
3. Implement proper error handling
4. Monitor everything
5. Automate deployment and scaling
6. Use appropriate data structures
7. Consider cost vs performance trade-offs
8. Plan for disaster recovery

Remember: Scalability is about designing systems that can grow. Start simple, measure, and scale as needed.
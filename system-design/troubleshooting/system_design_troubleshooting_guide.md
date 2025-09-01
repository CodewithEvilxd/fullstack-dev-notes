# System Design Troubleshooting Guide

## Performance Issues

### High Response Time

**Symptoms:**
- API responses taking > 2 seconds
- User complaints about slow loading
- Database query timeouts

**Common Causes:**
1. **Database Issues**
   - Missing indexes on frequently queried columns
   - Inefficient SQL queries (no JOIN optimization)
   - Database connection pool exhaustion
   - Slow disk I/O

2. **Application Issues**
   - Memory leaks causing garbage collection pauses
   - Inefficient algorithms (O(n²) complexity)
   - Blocking I/O operations
   - Large object serialization

3. **Infrastructure Issues**
   - Insufficient CPU/memory resources
   - Network latency between services
   - Load balancer misconfiguration

**Diagnostic Steps:**
```bash
# Check database query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

# Monitor application metrics
curl http://localhost:9090/metrics

# Check system resources
top -p $(pgrep java)
iostat -x 1
```

**Solutions:**
1. **Database Optimization**
   ```sql
   -- Add missing indexes
   CREATE INDEX idx_users_email ON users(email);

   -- Optimize query
   SELECT u.name, p.title
   FROM users u
   INNER JOIN posts p ON u.id = p.user_id
   WHERE u.created_at > '2024-01-01';
   ```

2. **Application Optimization**
   ```java
   // Use connection pooling
   HikariConfig config = new HikariConfig();
   config.setMaximumPoolSize(20);
   config.setMinimumIdle(5);

   // Implement caching
   @Cacheable("userProfile")
   public User getUserProfile(Long userId) {
       return userRepository.findById(userId);
   }
   ```

3. **Infrastructure Scaling**
   ```yaml
   # Kubernetes horizontal scaling
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   spec:
     minReplicas: 3
     maxReplicas: 10
     metrics:
     - type: Resource
       resource:
         name: cpu
         target:
           type: Utilization
           averageUtilization: 70
   ```

### High Error Rate

**Symptoms:**
- 5xx HTTP status codes > 1%
- Application crashes or restarts
- Database connection failures

**Common Causes:**
1. **Resource Exhaustion**
   - Out of memory errors
   - Database connection limits reached
   - Thread pool exhaustion

2. **External Service Failures**
   - Third-party API timeouts
   - Database server unavailability
   - Message queue connectivity issues

3. **Application Bugs**
   - Null pointer exceptions
   - Race conditions
   - Improper error handling

**Diagnostic Steps:**
```bash
# Check application logs
tail -f /var/log/application.log | grep ERROR

# Monitor error rates
curl -s http://localhost:9090/metrics | grep error

# Check external service health
curl -f https://api.third-party.com/health
```

**Solutions:**
1. **Implement Circuit Breaker**
   ```java
   @CircuitBreaker(name = "externalService", fallbackMethod = "fallbackMethod")
   public String callExternalService() {
       return restTemplate.getForObject("https://api.example.com/data", String.class);
   }

   public String fallbackMethod(Exception e) {
       return "Service temporarily unavailable";
   }
   ```

2. **Add Retry Logic**
   ```python
   @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
   def call_external_api():
       response = requests.get('https://api.example.com/data', timeout=5)
       response.raise_for_status()
       return response.json()
   ```

3. **Resource Monitoring**
   ```yaml
   # Prometheus alerting rules
   groups:
   - name: application_alerts
     rules:
     - alert: HighErrorRate
       expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
       for: 5m
       labels:
         severity: critical
   ```

## Scalability Issues

### Database Bottlenecks

**Symptoms:**
- Slow query response times
- Database CPU usage > 80%
- Connection pool exhaustion
- Lock wait timeouts

**Common Causes:**
1. **Poor Schema Design**
   - Missing indexes
   - Inefficient data types
   - Lack of partitioning

2. **Query Issues**
   - N+1 query problems
   - Complex joins on large tables
   - Full table scans

3. **Concurrency Issues**
   - Lock contention
   - Deadlock situations
   - Long-running transactions

**Diagnostic Steps:**
```sql
-- Check slow queries
SELECT query, exec_count, total_elapsed_time/exec_count as avg_time
FROM sys.dm_exec_query_stats
CROSS APPLY sys.dm_exec_sql_text(sql_handle)
ORDER BY avg_time DESC;

-- Check lock waits
SELECT wait_type, waiting_tasks_count, wait_time_ms
FROM sys.dm_os_wait_stats
WHERE wait_type LIKE '%LOCK%';
```

**Solutions:**
1. **Index Optimization**
   ```sql
   -- Create composite indexes
   CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

   -- Analyze index usage
   SELECT index_name, avg_fragmentation_in_percent
   FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, NULL) AS ps
   INNER JOIN sys.indexes AS i ON ps.object_id = i.object_id;
   ```

2. **Query Optimization**
   ```sql
   -- Before: N+1 queries
   SELECT * FROM users;
   foreach(user in users) {
       SELECT * FROM posts WHERE user_id = user.id;
   }

   -- After: Single query with JOIN
   SELECT u.*, p.title, p.content
   FROM users u
   LEFT JOIN posts p ON u.id = p.user_id;
   ```

3. **Read Replicas**
   ```yaml
   # Kubernetes read replica configuration
   apiVersion: v1
   kind: Service
   metadata:
     name: postgres-read
   spec:
     selector:
       app: postgres
       role: replica
   ---
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: postgres-replica
   spec:
     replicas: 2
   ```

### Cache Performance Issues

**Symptoms:**
- High cache miss rates
- Cache server high CPU usage
- Memory exhaustion on cache servers
- Stale data issues

**Common Causes:**
1. **Cache Configuration Issues**
   - Insufficient memory allocation
   - Poor key design
   - Inappropriate TTL values

2. **Cache Invalidation Problems**
   - Missing invalidation on data updates
   - Cache and database inconsistency
   - Race conditions in cache updates

3. **Hot Key Issues**
   - Single key accessed by many users
   - Uneven key distribution

**Diagnostic Steps:**
```bash
# Redis performance monitoring
redis-cli info stats
redis-cli --stat

# Check cache hit rates
redis-cli info | grep keyspace_hits
redis-cli info | grep keyspace_misses
```

**Solutions:**
1. **Cache Key Optimization**
   ```python
   # Good key design
   def get_cache_key(user_id, resource_type, resource_id):
       return f"user:{user_id}:{resource_type}:{resource_id}"

   # Use hash tags for Redis cluster
   cache_key = f"user:{user_id}:{resource_type}:{resource_id}"
   ```

2. **Cache Warming**
   ```python
   @app.on_event("startup")
   async def warmup_cache():
       """Pre-populate cache with frequently accessed data"""
       popular_users = await get_popular_users()
       for user in popular_users:
           await cache.set(f"user:{user.id}", user.dict(), ttl=3600)
   ```

3. **Cache Partitioning**
   ```python
   # Distribute hot keys across multiple cache instances
   def get_cache_instance(key):
       hash_value = hash(key) % NUM_CACHE_INSTANCES
       return cache_instances[hash_value]
   ```

## Availability Issues

### Service Outages

**Symptoms:**
- Service returning 5xx errors
- Complete service unavailability
- Database connection failures
- Message queue disconnections

**Common Causes:**
1. **Resource Exhaustion**
   - Memory leaks
   - CPU spikes
   - Disk space full

2. **Dependency Failures**
   - Database server crash
   - External API downtime
   - Network connectivity issues

3. **Deployment Issues**
   - Failed deployments
   - Configuration errors
   - Resource constraints

**Diagnostic Steps:**
```bash
# Check service health
curl -f http://localhost:8080/health

# Check system resources
df -h  # Disk usage
free -h  # Memory usage
uptime  # System load

# Check application logs
docker logs --tail 100 myapp
```

**Solutions:**
1. **Health Checks and Auto-healing**
   ```yaml
   # Kubernetes liveness and readiness probes
   apiVersion: v1
   kind: Pod
   spec:
     containers:
     - name: app
       livenessProbe:
         httpGet:
           path: /health
           port: 8080
         initialDelaySeconds: 30
         periodSeconds: 10
       readinessProbe:
         httpGet:
           path: /ready
           port: 8080
         initialDelaySeconds: 5
         periodSeconds: 5
   ```

2. **Graceful Shutdown**
   ```python
   import signal
   import sys

   def signal_handler(signum, frame):
       print("Received signal, shutting down gracefully...")
       # Stop accepting new requests
       server.should_stop = True
       # Wait for existing requests to complete
       server.wait_for_completion(timeout=30)
       # Close database connections
       db_pool.close()
       sys.exit(0)

   signal.signal(signal.SIGTERM, signal_handler)
   signal.signal(signal.SIGINT, signal_handler)
   ```

3. **Circuit Breaker Implementation**
   ```java
   @CircuitBreaker(name = "database", fallbackMethod = "fallbackQuery")
   public List<User> getUsers() {
       return userRepository.findAll();
   }

   public List<User> fallbackQuery(Exception e) {
       // Return cached data or empty list
       return cache.get("all_users", List.class);
   }
   ```

## Data Consistency Issues

### Cache-Data Inconsistency

**Symptoms:**
- Users seeing stale data
- Inconsistent state between cache and database
- Race conditions in data updates

**Common Causes:**
1. **Improper Cache Invalidation**
   - Missing invalidation on updates
   - Incorrect cache keys
   - Timing issues

2. **Race Conditions**
   - Concurrent updates to same data
   - Cache and database update ordering

**Solutions:**
1. **Cache-Aside Pattern**
   ```python
   async def get_user(user_id):
       # Try cache first
       user = await cache.get(f"user:{user_id}")
       if user:
           return user

       # Cache miss - get from database
       user = await db.get_user(user_id)
       if user:
           await cache.set(f"user:{user_id}", user, ttl=3600)
       return user

   async def update_user(user_id, user_data):
       # Update database first
       await db.update_user(user_id, user_data)

       # Invalidate cache
       await cache.delete(f"user:{user_id}")
   ```

2. **Write-Through Caching**
   ```python
   async def update_user_write_through(user_id, user_data):
       # Update cache first
       await cache.set(f"user:{user_id}", user_data, ttl=3600)

       # Then update database
       await db.update_user(user_id, user_data)
   ```

### Database Replication Lag

**Symptoms:**
- Read replicas returning stale data
- Inconsistent data across replicas
- Replication errors in logs

**Common Causes:**
1. **High Write Load**
   - Too many writes overwhelming replicas
   - Large transactions blocking replication

2. **Network Issues**
   - Network latency between master and replicas
   - Network partitions

3. **Configuration Issues**
   - Insufficient replica resources
   - Incorrect replication settings

**Diagnostic Steps:**
```sql
-- Check replication lag
SELECT
    replica_server_name,
    last_received_time,
    last_committed_time,
    datediff(second, last_received_time, last_committed_time) as lag_seconds
FROM sys.dm_hadr_database_replica_states;
```

**Solutions:**
1. **Monitor Replication Health**
   ```sql
   -- Create replication monitoring job
   CREATE EVENT SESSION replication_monitor
   ON SERVER
   ADD EVENT sqlserver.replication_distributor_firing,
   ADD EVENT sqlserver.replication_subscriber_firing
   ADD TARGET package0.event_file(SET filename=N'replication_monitor');
   ```

2. **Optimize Replication Performance**
   ```sql
   -- Increase replication worker threads
   EXEC sp_configure 'max worker threads', 1024;
   RECONFIGURE;

   -- Use row-based replication for better performance
   ALTER TABLE users ADD COLUMN replication_filter INT DEFAULT 1;
   ```

## Network Issues

### High Latency

**Symptoms:**
- Slow API responses
- Timeout errors
- User complaints about delays

**Common Causes:**
1. **Network Congestion**
   - High traffic volumes
   - Bandwidth limitations
   - Network equipment issues

2. **Geographic Distance**
   - Users far from data centers
   - Cross-region communication

3. **DNS Issues**
   - DNS resolution failures
   - Slow DNS responses

**Diagnostic Steps:**
```bash
# Network latency testing
ping -c 10 api.example.com
traceroute api.example.com

# DNS resolution time
time nslookup api.example.com

# Bandwidth testing
iperf -c server_ip -t 30
```

**Solutions:**
1. **CDN Implementation**
   ```yaml
   # CloudFront distribution configuration
   apiVersion: cloudfront.aws.com/v1
   kind: Distribution
   metadata:
     name: api-distribution
   spec:
     origins:
     - domainName: api.example.com
       id: api-origin
     defaultCacheBehavior:
       targetOriginId: api-origin
       viewerProtocolPolicy: redirect-to-https
       minTtl: 0
       maxTtl: 86400
   ```

2. **DNS Optimization**
   ```bash
   # Use DNS prefetching in HTML
   <link rel="dns-prefetch" href="//api.example.com">

   # Configure DNS TTL appropriately
   # Low TTL for dynamic content, high TTL for static
   ```

3. **Connection Optimization**
   ```nginx
   # Nginx configuration for connection optimization
   upstream backend {
       server backend1.example.com;
       server backend2.example.com;
       keepalive 32;
   }

   server {
       listen 80;
       location /api {
           proxy_pass http://backend;
           proxy_http_version 1.1;
           proxy_set_header Connection "";
           proxy_buffering off;
       }
   }
   ```

## Security Issues

### Unauthorized Access

**Symptoms:**
- Unexpected user permissions
- Data breaches
- Security audit failures

**Common Causes:**
1. **Authentication Issues**
   - Weak password policies
   - Session management problems
   - Token exposure

2. **Authorization Issues**
   - Incorrect role assignments
   - Missing access controls
   - Privilege escalation

**Solutions:**
1. **Implement Proper Authentication**
   ```python
   from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

   app.config['JWT_SECRET_KEY'] = 'your-secret-key'
   jwt = JWTManager(app)

   @app.route('/protected')
   @jwt_required()
   def protected():
       current_user = get_jwt_identity()
       return jsonify(logged_in_as=current_user)
   ```

2. **Role-Based Access Control**
   ```java
   @PreAuthorize("hasRole('ADMIN')")
   public void deleteUser(Long userId) {
       userRepository.deleteById(userId);
   }

   @PreAuthorize("hasPermission(#userId, 'User', 'read')")
   public User getUser(Long userId) {
       return userRepository.findById(userId);
   }
   ```

## Monitoring and Alerting Setup

### Comprehensive Monitoring Stack

**Application Metrics:**
```python
from prometheus_client import Counter, Histogram, Gauge
import time

# Business metrics
orders_created = Counter('orders_created_total', 'Total orders created')
revenue = Counter('revenue_total', 'Total revenue', ['currency'])

# Performance metrics
request_duration = Histogram('request_duration_seconds', 'Request duration')
active_users = Gauge('active_users', 'Number of active users')

# System metrics
cpu_usage = Gauge('cpu_usage_percent', 'CPU usage percentage')
memory_usage = Gauge('memory_usage_bytes', 'Memory usage in bytes')
```

**Alerting Rules:**
```yaml
groups:
- name: application_alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }}%"

  - alert: SlowResponseTime
    expr: histogram_quantile(0.95, rate(request_duration_seconds_bucket[5m])) > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Slow response time detected"
      description: "95th percentile response time is {{ $value }}s"
```

**Log Aggregation:**
```python
import logging
import json
from datetime import datetime

class StructuredLogger:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)

        # JSON formatter for structured logging
        formatter = logging.Formatter(
            json.dumps({
                'timestamp': '%(asctime)s',
                'level': '%(levelname)s',
                'message': '%(message)s',
                'module': '%(module)s',
                'function': '%(funcName)s'
            })
        )

        handler = logging.StreamHandler()
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

    def log_request(self, method, url, status_code, duration):
        self.logger.info('API Request', extra={
            'method': method,
            'url': url,
            'status_code': status_code,
            'duration': duration,
            'user_id': getattr(g, 'user_id', None),
            'request_id': getattr(g, 'request_id', None)
        })
```

## Emergency Response Procedures

### Incident Response Plan

1. **Detection Phase**
   - Monitor alerts and dashboards
   - Check application logs
   - Verify service health endpoints

2. **Assessment Phase**
   - Determine impact and scope
   - Identify root cause
   - Assess business impact

3. **Containment Phase**
   - Stop the bleeding (rollback, circuit breakers)
   - Implement temporary fixes
   - Communicate with stakeholders

4. **Recovery Phase**
   - Apply permanent fixes
   - Test fixes in staging
   - Gradual rollout to production

5. **Post-Mortem Phase**
   - Document incident timeline
   - Identify improvement opportunities
   - Update runbooks and procedures

### Runbook Template
```markdown
# Service Outage Runbook

## Overview
Steps to handle [Service Name] outages

## Detection
- Alert: [Alert Name]
- Dashboard: [Dashboard URL]
- Logs: [Log location]

## Initial Assessment
1. Check service health endpoint
2. Review recent deployments
3. Check system resources
4. Review error logs

## Common Solutions
1. **Memory Issues**: Restart service
2. **Database Connection**: Check connection pool
3. **External Service**: Enable circuit breaker
4. **Deployment Issue**: Rollback to previous version

## Escalation
- After 15 minutes: Notify engineering team
- After 30 minutes: Notify management
- After 1 hour: Notify customers (if applicable)

## Prevention
- [List preventive measures]
```

This troubleshooting guide provides systematic approaches to identify and resolve common system design issues. Remember to always start with monitoring data, implement proper logging, and have clear incident response procedures in place.
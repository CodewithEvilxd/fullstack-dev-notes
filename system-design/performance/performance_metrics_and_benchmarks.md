# Performance Metrics and Benchmarks

## System Performance Benchmarks

### Response Time Benchmarks
| Service Type | Excellent | Good | Acceptable | Poor |
|-------------|-----------|------|------------|------|
| Static Content | < 100ms | 100-300ms | 300ms-1s | > 1s |
| Dynamic API | < 200ms | 200-500ms | 500ms-2s | > 2s |
| Database Query | < 50ms | 50-200ms | 200ms-1s | > 1s |
| File Upload | < 2s | 2-5s | 5-10s | > 10s |
| Search Results | < 300ms | 300ms-1s | 1-3s | > 3s |

### Throughput Benchmarks
| System Size | Requests/Second | Concurrent Users | Data Transfer |
|-------------|-----------------|------------------|----------------|
| Small App | 100-500 | 50-200 | 10-50 MB/s |
| Medium App | 500-2000 | 200-1000 | 50-200 MB/s |
| Large App | 2000-10000 | 1000-5000 | 200-1000 MB/s |
| Enterprise | 10000-50000 | 5000-25000 | 1-5 GB/s |

### Error Rate Benchmarks
- **Excellent**: < 0.01% (1 in 10,000 requests)
- **Good**: 0.01-0.1% (1 in 1,000 to 10,000)
- **Acceptable**: 0.1-1% (1 in 100 to 1,000)
- **Poor**: 1-5% (1 in 20 to 100)
- **Critical**: > 5% (more than 1 in 20)

## Database Performance Metrics

### Query Performance
```sql
-- Slow query identification
SELECT
    query,
    exec_count,
    total_elapsed_time / exec_count as avg_time,
    total_logical_reads / exec_count as avg_reads
FROM sys.dm_exec_query_stats
CROSS APPLY sys.dm_exec_sql_text(sql_handle)
WHERE last_execution_time > DATEADD(hour, -24, GETDATE())
ORDER BY avg_time DESC;
```

### Index Effectiveness
- **Index Hit Ratio**: > 95% (excellent), 90-95% (good), < 90% (needs optimization)
- **Index Fragmentation**: < 10% (excellent), 10-30% (good), > 30% (rebuild needed)
- **Index Usage**: Unused indexes should be removed

### Connection Pool Metrics
- **Pool Utilization**: < 80% (good), 80-95% (monitor), > 95% (increase pool size)
- **Connection Wait Time**: < 10ms (excellent), 10-100ms (good), > 100ms (increase pool)
- **Failed Connections**: < 0.1% of total connection attempts

## Caching Performance Benchmarks

### Cache Hit Ratios by Use Case
| Use Case | Target Hit Ratio | Acceptable | Poor |
|----------|------------------|------------|------|
| User Sessions | 95-99% | 90-95% | < 90% |
| API Responses | 80-95% | 70-80% | < 70% |
| Database Queries | 85-95% | 75-85% | < 75% |
| Static Content | 90-99% | 85-90% | < 85% |

### Cache Performance Metrics
```python
# Redis performance monitoring
import redis
import time

def benchmark_cache_performance(redis_client, iterations=1000):
    """Benchmark Redis cache performance"""
    set_times = []
    get_times = []

    for i in range(iterations):
        # Benchmark SET operations
        start = time.time()
        redis_client.set(f"key:{i}", f"value:{i}")
        set_times.append(time.time() - start)

        # Benchmark GET operations
        start = time.time()
        redis_client.get(f"key:{i}")
        get_times.append(time.time() - start)

    avg_set_time = sum(set_times) / len(set_times) * 1000  # ms
    avg_get_time = sum(get_times) / len(get_times) * 1000  # ms

    print(f"Average SET time: {avg_set_time:.2f}ms")
    print(f"Average GET time: {avg_get_time:.2f}ms")
    print(f"P95 SET time: {sorted(set_times)[int(0.95 * len(set_times))] * 1000:.2f}ms")
    print(f"P95 GET time: {sorted(get_times)[int(0.95 * len(get_times))] * 1000:.2f}ms")
```

## Load Testing Benchmarks

### JMeter Test Configuration
```xml
<!-- JMeter test plan for API load testing -->
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.4.1">
    <hashTree>
        <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="API Load Test">
            <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="API Users">
                <num_threads>100</num_threads>
                <ramp_time>30</ramp_time>
                <duration>300</duration>
                <scheduler>true</scheduler>
            </ThreadGroup>
            <hashTree>
                <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="API Request">
                    <domain>api.example.com</domain>
                    <port>443</port>
                    <protocol>https</protocol>
                    <method>GET</method>
                    <path>/api/v1/users</path>
                </HTTPSamplerProxy>
                <hashTree>
                    <ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="Response Code">
                        <collectionProp name="Asserion.test_strings">
                            <stringProp name="90939">200</stringProp>
                        </collectionProp>
                    </ResponseAssertion>
                </hashTree>
            </hashTree>
        </TestPlan>
    </hashTree>
</jmeterTestPlan>
```

### Artillery Load Test
```yaml
config:
  target: 'https://api.example.com'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 300
      arrivalRate: 50
      name: Load test
    - duration: 60
      arrivalRate: 100
      name: Stress test
  processor: './processors.js'

scenarios:
  - name: 'User registration'
    weight: 20
    requests:
      - method: 'POST'
        url: '/api/users'
        json:
          email: 'user{{ $randomInt }}@example.com'
          password: 'password123'

  - name: 'Get user profile'
    weight: 60
    requests:
      - method: 'GET'
        url: '/api/users/{{ userId }}'

  - name: 'Update user profile'
    weight: 20
    requests:
      - method: 'PUT'
        url: '/api/users/{{ userId }}'
        json:
          name: 'Updated Name'
```

## Microservices Performance Metrics

### Service Mesh Metrics
```yaml
# Istio metrics configuration
apiVersion: telemetry.istio.io/v1alpha1
kind: Telemetry
metadata:
  name: mesh-default
  namespace: istio-system
spec:
  metrics:
  - providers:
    - name: prometheus
    overrides:
    - match:
        metric: REQUEST_COUNT
        mode: CLIENT_AND_SERVER
      tagOverrides:
        request_protocol:
          value: "http"
```

### Service Performance Dashboard
```json
{
  "dashboard": {
    "title": "Microservices Performance",
    "panels": [
      {
        "title": "Service Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Service Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m]) * 100",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Service Throughput",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{service}}"
          }
        ]
      }
    ]
  }
}
```

## Infrastructure Performance Benchmarks

### Server Performance Metrics
| Component | Metric | Excellent | Good | Acceptable |
|-----------|--------|-----------|------|------------|
| CPU | Utilization | < 70% | 70-85% | 85-95% |
| Memory | Usage | < 80% | 80-90% | 90-95% |
| Disk I/O | Latency | < 10ms | 10-20ms | 20-50ms |
| Network | Latency | < 1ms | 1-5ms | 5-20ms |
| Network | Throughput | > 80% | 60-80% | 40-60% |

### Container Performance
```yaml
# Kubernetes resource limits and requests
apiVersion: v1
kind: Pod
metadata:
  name: api-server
spec:
  containers:
  - name: api
    image: api-server:latest
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
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

## Application Performance Monitoring

### Custom Metrics Implementation
```python
from prometheus_client import Counter, Histogram, Gauge
import time

# Business metrics
user_registrations = Counter('user_registrations_total', 'Total user registrations')
order_creations = Counter('order_creations_total', 'Total orders created')

# Performance metrics
request_duration = Histogram('request_duration_seconds', 'Request duration in seconds',
                           buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0])

# System metrics
active_connections = Gauge('active_connections', 'Number of active connections')
queue_size = Gauge('queue_size', 'Current queue size')

class MetricsMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        start_time = time.time()

        def custom_start_response(status, headers, exc_info=None):
            # Record metrics
            duration = time.time() - start_time
            request_duration.observe(duration)

            # Track active connections
            active_connections.inc()

            return start_response(status, headers, exc_info)

        try:
            return self.app(environ, custom_start_response)
        finally:
            active_connections.dec()
```

### Performance Profiling
```python
import cProfile
import pstats
from io import StringIO

def profile_function(func):
    """Decorator to profile function performance"""
    def wrapper(*args, **kwargs):
        pr = cProfile.Profile()
        pr.enable()

        result = func(*args, **kwargs)

        pr.disable()
        s = StringIO()
        sortby = 'cumulative'
        ps = pstats.Stats(pr, stream=s).sort_stats(sortby)
        ps.print_stats()
        print(s.getvalue())

        return result
    return wrapper

@profile_function
def expensive_operation():
    # Your code here
    pass
```

## Benchmarking Tools and Commands

### Network Performance
```bash
# Bandwidth test
iperf -c server_ip -t 60

# Latency test
ping -c 100 server_ip

# Packet loss test
mtr server_ip

# DNS resolution time
dig @dns_server domain.com
```

### Database Performance
```sql
-- PostgreSQL performance analysis
SELECT * FROM pg_stat_activity;
SELECT * FROM pg_stat_user_tables;
SELECT * FROM pg_stat_user_indexes;

-- MySQL performance analysis
SHOW PROCESSLIST;
SHOW ENGINE INNODB STATUS;
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

### Application Performance
```bash
# CPU profiling
perf record -F 99 -p $(pidof your_app) -g -- sleep 60
perf report

# Memory profiling
valgrind --tool=massif --stacks=yes your_app
ms_print massif.out.*

# System monitoring
sar -u 1 10  # CPU usage
sar -r 1 10  # Memory usage
sar -n DEV 1 10  # Network usage
```

## Performance Optimization Checklist

### Application Level
- [ ] Database query optimization
- [ ] Caching implementation
- [ ] Code profiling and optimization
- [ ] Memory leak detection
- [ ] Asynchronous processing
- [ ] Connection pooling

### Infrastructure Level
- [ ] Load balancer configuration
- [ ] Auto-scaling policies
- [ ] CDN implementation
- [ ] Database replication
- [ ] Monitoring and alerting

### Network Level
- [ ] Compression enabled
- [ ] CDN for static assets
- [ ] DNS optimization
- [ ] SSL/TLS optimization
- [ ] Keep-alive connections

### Database Level
- [ ] Index optimization
- [ ] Query optimization
- [ ] Connection pooling
- [ ] Read replicas
- [ ] Partitioning/sharding

## Performance Testing Strategy

### Testing Pyramid
```
End-to-End Tests (Slow, Expensive)
        │
   Integration Tests (Medium)
        │
     Unit Tests (Fast, Cheap)
```

### Load Testing Scenarios
1. **Normal Load**: Expected daily traffic
2. **Peak Load**: Highest expected traffic
3. **Stress Test**: Beyond peak load to find breaking points
4. **Spike Test**: Sudden traffic spikes
5. **Volume Test**: Large data sets
6. **Endurance Test**: Prolonged load testing

### Performance Testing Checklist
- [ ] Define performance requirements
- [ ] Set up test environment
- [ ] Create realistic test data
- [ ] Implement monitoring
- [ ] Execute tests incrementally
- [ ] Analyze results
- [ ] Identify bottlenecks
- [ ] Optimize and retest
- [ ] Document findings

Remember: Performance optimization is an iterative process. Monitor continuously, identify bottlenecks, optimize systematically, and validate improvements with benchmarks.
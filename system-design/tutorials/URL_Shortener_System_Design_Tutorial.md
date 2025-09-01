# URL Shortener System Design Tutorial

## Overview
This tutorial will guide you through designing a complete URL shortener service like Bitly or TinyURL. We'll cover everything from requirements analysis to implementation details.

## Step 1: Requirements Analysis

### Functional Requirements
- **Shorten URLs**: Convert long URLs to short aliases
- **Redirect**: Redirect short URLs to original URLs
- **Custom Aliases**: Allow users to create custom short URLs
- **Analytics**: Track click statistics
- **User Management**: Registration and authentication
- **API Access**: RESTful API for programmatic access

### Non-Functional Requirements
- **High Availability**: 99.9% uptime
- **Low Latency**: < 100ms for redirects
- **Scalability**: Handle millions of URLs and redirects
- **Security**: Prevent malicious URLs and abuse
- **Data Retention**: Store URLs and analytics for 5+ years

### Constraints
- **Traffic**: 100 million URLs created per month
- **Reads/Writes Ratio**: 100:1 (more redirects than creations)
- **URL Length**: Short URLs should be 6-8 characters
- **Custom Aliases**: Support user-defined aliases

## Step 2: Capacity Estimation

### Storage Estimation
```
URLs created per month: 100 million
Average URL length: 100 characters
Metadata per URL: 50 bytes (timestamps, user info, etc.)
Analytics data: 20 bytes per click

Monthly storage:
- URLs: 100M * (100 + 50) = 15GB
- Analytics: 100M * 100 * 20 = 200GB (assuming 100 clicks/URL)
- Total monthly: ~215GB
- 5-year retention: ~12.9TB
```

### Traffic Estimation
```
Daily URL creations: 100M / 30 = 3.3M
Daily redirects: 3.3M * 100 = 330M
Peak QPS (creates): 3.3M * 2 / 86400 = 76
Peak QPS (redirects): 330M * 2 / 86400 = 7,638
```

### Bandwidth Estimation
```
Average redirect response: 500 bytes
Daily bandwidth: 330M * 500 = 165GB
Peak bandwidth: 165GB * 2 / 86400 = 3.8Gbps
```

## Step 3: System Architecture Design

### High-Level Architecture
```
┌─────────────────────────────────────┐
│           Clients                    │
│  ┌─────────┐ ┌─────┐ ┌─────────────┐ │
│  │ Web App │ │ API │ │ Mobile Apps │ │
│  └─────────┘ └─────┘ └─────────────┘ │
└─────────────────────────────────────┘
                   │
┌─────────────────────────────────────┐
│         Load Balancer               │
└─────────────────────────────────────┘
                   │
          ┌────────┼────────┐
          │        │        │
┌─────────┴─┐ ┌────┴─────┐ ┌─┴─────────┐
│URL Service│ │Analytics │ │User Service│
│           │ │ Service  │ │            │
│• Shorten  │ │• Tracking│ │• Auth      │
│• Redirect │ │• Stats   │ │• Profiles  │
└───────────┘ └──────────┘ └────────────┘
      │            │            │
┌─────┼────────────┼────────────┼─────┐
│     │            │            │     │
│ ┌───┴───┐   ┌────┴────┐  ┌────┴────┐ │
│ │Redis │   │PostgreSQL│  │Cassandra│ │
│ │Cache │   │  URLs    │  │Analytics│ │
│ └───────┘   └─────────┘  └─────────┘ │
└─────────────────────────────────────┘
```

### API Design

#### RESTful Endpoints
```http
# Create short URL
POST /api/v1/urls
Content-Type: application/json
Authorization: Bearer <token>

{
  "longUrl": "https://example.com/very/long/url",
  "customAlias": "my-link",  // optional
  "expiresAt": "2024-12-31"  // optional
}

Response:
{
  "shortUrl": "https://short.ly/abc123",
  "alias": "abc123",
  "longUrl": "https://example.com/very/long/url",
  "createdAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-12-31T00:00:00Z"
}

# Redirect to long URL
GET /api/v1/{alias}

# Get URL statistics
GET /api/v1/urls/{alias}/stats
Authorization: Bearer <token>

Response:
{
  "totalClicks": 1250,
  "uniqueClicks": 890,
  "clicksByCountry": {
    "US": 450,
    "UK": 120,
    "DE": 89
  },
  "clicksByDate": [
    {"date": "2024-01-01", "clicks": 45},
    {"date": "2024-01-02", "clicks": 67}
  ]
}
```

## Step 4: Database Design

### URL Storage Schema (PostgreSQL)
```sql
-- URLs table
CREATE TABLE urls (
    id BIGSERIAL PRIMARY KEY,
    alias VARCHAR(20) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    click_count BIGINT DEFAULT 0
);

-- Create indexes
CREATE INDEX idx_urls_alias ON urls(alias);
CREATE INDEX idx_urls_user_id ON urls(user_id);
CREATE INDEX idx_urls_created_at ON urls(created_at);
CREATE INDEX idx_urls_expires_at ON urls(expires_at);

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Analytics Storage Schema (Cassandra)
```sql
-- Click events (time series)
CREATE TABLE click_events (
    short_url TEXT,
    clicked_at TIMESTAMP,
    user_agent TEXT,
    ip_address INET,
    country_code TEXT,
    referrer TEXT,
    PRIMARY KEY ((short_url, clicked_at), clicked_at)
) WITH CLUSTERING ORDER BY (clicked_at DESC);

-- Daily statistics
CREATE TABLE daily_stats (
    short_url TEXT,
    date DATE,
    total_clicks BIGINT,
    unique_clicks BIGINT,
    PRIMARY KEY (short_url, date)
);
```

## Step 5: URL Generation Algorithm

### Base62 Encoding
```python
import string

class URLShortener:
    def __init__(self):
        self.alphabet = string.ascii_letters + string.digits
        self.base = len(self.alphabet)

    def encode(self, num):
        """Convert number to base62 string"""
        if num == 0:
            return self.alphabet[0]

        result = []
        while num > 0:
            result.append(self.alphabet[num % self.base])
            num //= self.base

        return ''.join(reversed(result))

    def decode(self, short_url):
        """Convert base62 string back to number"""
        num = 0
        for char in short_url:
            num = num * self.base + self.alphabet.index(char)
        return num
```

### Distributed ID Generation
```python
import time
import random

class SnowflakeIDGenerator:
    def __init__(self, datacenter_id, worker_id):
        self.datacenter_id = datacenter_id
        self.worker_id = worker_id
        self.sequence = 0
        self.last_timestamp = -1

    def generate_id(self):
        timestamp = int(time.time() * 1000)

        if timestamp == self.last_timestamp:
            self.sequence = (self.sequence + 1) & 4095  # 12 bits
            if self.sequence == 0:
                # Wait for next millisecond
                timestamp = self._wait_next_millis(timestamp)
        else:
            self.sequence = 0

        self.last_timestamp = timestamp

        # Generate 64-bit ID
        # 41 bits timestamp, 5 bits datacenter, 5 bits worker, 12 bits sequence
        id = ((timestamp - 1288834974657) << 22) | \
             (self.datacenter_id << 17) | \
             (self.worker_id << 12) | \
             self.sequence

        return id
```

## Step 6: Caching Strategy

### Multi-Level Caching Architecture
```
┌─────────────┐
│   Browser   │ ← 0ms (client-side cache)
│   Cache     │
└─────────────┘
        │
┌─────────────┐
│   CDN       │ ← 50-200ms (edge cache)
│   Cache     │
└─────────────┘
        │
┌─────────────┐
│Application │ ← 1-5ms (server cache)
│   Cache     │
└─────────────┘
        │
┌─────────────┐
│ Database   │ ← 10-50ms (persistent storage)
│   Cache     │
└─────────────┘
```

### Redis Cache Implementation
```python
import redis
import json

class URLCache:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.url_ttl = 3600  # 1 hour
        self.stats_ttl = 300  # 5 minutes

    def get_url(self, alias):
        """Get URL from cache"""
        key = f"url:{alias}"
        data = self.redis.get(key)
        if data:
            return json.loads(data)
        return None

    def set_url(self, alias, url_data):
        """Store URL in cache"""
        key = f"url:{alias}"
        self.redis.setex(key, self.url_ttl, json.dumps(url_data))

    def increment_clicks(self, alias):
        """Increment click counter"""
        key = f"clicks:{alias}"
        self.redis.incr(key)

    def get_clicks(self, alias):
        """Get click count"""
        key = f"clicks:{alias}"
        return int(self.redis.get(key) or 0)
```

## Step 7: Rate Limiting and Security

### Rate Limiting Implementation
```python
from collections import defaultdict
import time

class RateLimiter:
    def __init__(self, requests_per_minute=60):
        self.requests_per_minute = requests_per_minute
        self.user_requests = defaultdict(list)

    def is_allowed(self, user_id):
        """Check if request is allowed"""
        now = time.time()
        user_reqs = self.user_requests[user_id]

        # Remove old requests
        user_reqs[:] = [req for req in user_reqs if now - req < 60]

        if len(user_reqs) >= self.requests_per_minute:
            return False

        user_reqs.append(now)
        return True
```

### Security Measures
```python
import re
from urllib.parse import urlparse

class URLValidator:
    @staticmethod
    def is_valid_url(url):
        """Validate URL format and safety"""
        try:
            parsed = urlparse(url)
            # Check scheme
            if parsed.scheme not in ['http', 'https']:
                return False
            # Check domain
            if not parsed.netloc:
                return False
            # Check for malicious patterns
            malicious_patterns = [
                r'<script', r'javascript:', r'data:', r'vbscript:'
            ]
            for pattern in malicious_patterns:
                if re.search(pattern, url, re.IGNORECASE):
                    return False
            return True
        except:
            return False

    @staticmethod
    def is_safe_domain(domain):
        """Check if domain is in safe list or not blacklisted"""
        # Implementation would check against domain reputation services
        # For now, return True
        return True
```

## Step 8: Analytics and Monitoring

### Click Tracking Implementation
```python
import asyncio
from datetime import datetime
import aiohttp

class AnalyticsService:
    def __init__(self, kafka_producer, redis_client):
        self.kafka = kafka_producer
        self.redis = redis_client

    async def track_click(self, short_url, request_data):
        """Track URL click asynchronously"""
        click_event = {
            'short_url': short_url,
            'timestamp': datetime.utcnow().isoformat(),
            'user_agent': request_data.get('user_agent', ''),
            'ip_address': request_data.get('ip_address', ''),
            'referrer': request_data.get('referrer', ''),
            'country': self._get_country_from_ip(request_data.get('ip_address'))
        }

        # Send to Kafka for processing
        await self.kafka.send('click_events', click_event)

        # Update Redis counters
        await self._update_counters(short_url, click_event)

    async def _update_counters(self, short_url, click_event):
        """Update click counters in Redis"""
        # Daily clicks
        date_key = f"daily:{short_url}:{click_event['timestamp'][:10]}"
        await self.redis.incr(date_key)
        await self.redis.expire(date_key, 86400 * 30)  # 30 days

        # Total clicks
        total_key = f"total:{short_url}"
        await self.redis.incr(total_key)

    def _get_country_from_ip(self, ip_address):
        """Get country from IP address (simplified)"""
        # In production, use GeoIP database
        return "US"
```

### Monitoring Dashboard
```python
import prometheus_client as prom

# Metrics
url_creations = prom.Counter('url_shortener_creations_total', 'Total URLs created')
url_redirects = prom.Counter('url_shortener_redirects_total', 'Total URL redirects')
response_time = prom.Histogram('url_shortener_response_time', 'Response time in seconds')
active_users = prom.Gauge('url_shortener_active_users', 'Number of active users')

class MonitoringService:
    def record_url_creation(self):
        url_creations.inc()

    def record_redirect(self, response_time_seconds):
        url_redirects.inc()
        response_time.observe(response_time_seconds)

    def update_active_users(self, count):
        active_users.set(count)
```

## Step 9: Deployment and Scaling

### Docker Configuration
```dockerfile
# Dockerfile for URL Shortener Service
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: url-shortener
spec:
  replicas: 3
  selector:
    matchLabels:
      app: url-shortener
  template:
    metadata:
      labels:
        app: url-shortener
    spec:
      containers:
      - name: url-shortener
        image: url-shortener:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          value: "postgresql://..."
        - name: REDIS_URL
          value: "redis://..."
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### Horizontal Pod Autoscaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: url-shortener-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: url-shortener
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Step 10: Performance Testing

### Load Testing Script (using Artillery)
```yaml
config:
  target: 'http://localhost:3000'
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

scenarios:
  - name: Create short URL
    weight: 10
    requests:
      - method: POST
        url: '/api/v1/urls'
        json:
          longUrl: 'https://example.com/test'

  - name: Redirect URL
    weight: 90
    requests:
      - method: GET
        url: '/api/v1/abc123'
```

### Performance Benchmarks
- **URL Creation**: < 50ms average response time
- **URL Redirect**: < 20ms average response time
- **Throughput**: 1000+ requests/second per instance
- **Error Rate**: < 0.1% under normal load
- **Cache Hit Rate**: > 95%

## Step 11: Troubleshooting Guide

### Common Issues and Solutions

#### High Latency Issues
**Symptoms**: Slow response times, timeouts
**Causes**:
- Database connection pool exhausted
- Cache miss rate too high
- Network congestion
**Solutions**:
- Increase database connection pool size
- Optimize cache strategy
- Implement request queuing

#### Database Connection Issues
**Symptoms**: Connection timeouts, failed queries
**Causes**:
- Database server overloaded
- Network issues
- Connection pool misconfiguration
**Solutions**:
- Implement connection pooling
- Add database read replicas
- Use database connection monitoring

#### Cache Performance Issues
**Symptoms**: High cache miss rate, slow cache responses
**Causes**:
- Inefficient cache key design
- Cache size too small
- Cache server overloaded
**Solutions**:
- Optimize cache key strategy
- Increase cache memory
- Implement cache clustering

## Summary

This tutorial covered the complete design and implementation of a URL shortener service. Key takeaways:

1. **Requirements Analysis**: Understand functional and non-functional requirements
2. **Capacity Planning**: Estimate storage, traffic, and resource needs
3. **System Design**: Create scalable, maintainable architecture
4. **Database Design**: Choose appropriate storage solutions
5. **Caching Strategy**: Implement multi-level caching
6. **Security**: Protect against abuse and malicious content
7. **Analytics**: Track and analyze system usage
8. **Monitoring**: Implement comprehensive observability
9. **Deployment**: Use containerization and orchestration
10. **Performance Testing**: Validate system performance

The final architecture should handle millions of URLs and billions of redirects while maintaining high availability and low latency. Remember to continuously monitor, test, and optimize your system as it grows.
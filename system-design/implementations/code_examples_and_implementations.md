# Code Examples and Implementation Guides

## 1. Load Balancer Implementation

### Simple Round-Robin Load Balancer
```python
import itertools
import requests
from typing import List

class RoundRobinLoadBalancer:
    def __init__(self, servers: List[str]):
        self.servers = servers
        self.server_cycle = itertools.cycle(servers)

    def get_next_server(self) -> str:
        return next(self.server_cycle)

    def forward_request(self, path: str, method: str = 'GET', **kwargs):
        server = self.get_next_server()
        url = f"http://{server}{path}"

        try:
            response = requests.request(method, url, **kwargs)
            return response
        except requests.RequestException as e:
            print(f"Request failed for {server}: {e}")
            # Try next server
            return self.forward_request(path, method, **kwargs)

# Usage
servers = ["server1:8080", "server2:8080", "server3:8080"]
lb = RoundRobinLoadBalancer(servers)

response = lb.forward_request("/api/users", "GET")
print(response.json())
```

### Weighted Load Balancer
```python
import random
from typing import List, Tuple

class WeightedLoadBalancer:
    def __init__(self, servers_with_weights: List[Tuple[str, int]]):
        self.servers = []
        for server, weight in servers_with_weights:
            self.servers.extend([server] * weight)

    def get_server(self) -> str:
        return random.choice(self.servers)

# Usage
servers = [
    ("server1:8080", 3),  # 30% traffic
    ("server2:8080", 5),  # 50% traffic
    ("server3:8080", 2),  # 20% traffic
]
lb = WeightedLoadBalancer(servers)
```

## 2. Database Connection Pool

### PostgreSQL Connection Pool
```python
import psycopg2
from psycopg2 import pool
import threading

class DatabaseConnectionPool:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, 'pool'):
            try:
                self.pool = psycopg2.pool.SimpleConnectionPool(
                    minconn=5,
                    maxconn=20,
                    host='localhost',
                    database='mydb',
                    user='myuser',
                    password='mypassword'
                )
            except Exception as e:
                print(f"Error creating connection pool: {e}")

    def get_connection(self):
        try:
            return self.pool.getconn()
        except Exception as e:
            print(f"Error getting connection: {e}")
            return None

    def release_connection(self, conn):
        try:
            self.pool.putconn(conn)
        except Exception as e:
            print(f"Error releasing connection: {e}")

    def close_all_connections(self):
        if self.pool:
            self.pool.closeall()

# Usage
db_pool = DatabaseConnectionPool()

def execute_query(query: str, params=None):
    conn = db_pool.get_connection()
    if conn:
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                result = cursor.fetchall()
                conn.commit()
                return result
        except Exception as e:
            print(f"Query execution error: {e}")
            conn.rollback()
        finally:
            db_pool.release_connection(conn)
    return None
```

## 3. Redis Caching Implementation

### Multi-Level Caching Strategy
```python
import redis
import json
import time
from typing import Any, Optional
from functools import wraps

class CacheManager:
    def __init__(self, redis_host='localhost', redis_port=6379):
        self.redis = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)
        self.local_cache = {}  # Simple in-memory cache
        self.local_cache_ttl = {}

    def set(self, key: str, value: Any, ttl: int = 3600):
        """Set value in both Redis and local cache"""
        try:
            # Store in Redis
            self.redis.setex(key, ttl, json.dumps(value))

            # Store in local cache
            self.local_cache[key] = value
            self.local_cache_ttl[key] = time.time() + ttl

        except Exception as e:
            print(f"Cache set error: {e}")

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache with fallback"""
        # Check local cache first
        if key in self.local_cache:
            if time.time() < self.local_cache_ttl.get(key, 0):
                return self.local_cache[key]
            else:
                # Expired, remove from local cache
                del self.local_cache[key]
                del self.local_cache_ttl[key]

        # Check Redis
        try:
            value = self.redis.get(key)
            if value:
                parsed_value = json.loads(value)
                # Update local cache
                self.local_cache[key] = parsed_value
                self.local_cache_ttl[key] = time.time() + 3600  # 1 hour
                return parsed_value
        except Exception as e:
            print(f"Cache get error: {e}")

        return None

    def delete(self, key: str):
        """Delete from both caches"""
        try:
            self.redis.delete(key)
        except Exception as e:
            print(f"Redis delete error: {e}")

        if key in self.local_cache:
            del self.local_cache[key]
        if key in self.local_cache_ttl:
            del self.local_cache_ttl[key]

# Decorator for caching function results
def cached(cache_manager: CacheManager, ttl: int = 3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            key = f"{func.__name__}:{str(args)}:{str(kwargs)}"

            # Try to get from cache
            result = cache_manager.get(key)
            if result is not None:
                return result

            # Execute function
            result = func(*args, **kwargs)

            # Cache the result
            cache_manager.set(key, result, ttl)

            return result
        return wrapper
    return decorator

# Usage
cache = CacheManager()

@cached(cache, ttl=300)  # Cache for 5 minutes
def get_user_profile(user_id: int):
    # Simulate database query
    return {"id": user_id, "name": f"User {user_id}", "email": f"user{user_id}@example.com"}
```

## 4. Message Queue Implementation

### Simple In-Memory Message Queue
```python
import queue
import threading
import time
from typing import Any, Callable

class SimpleMessageQueue:
    def __init__(self):
        self.queue = queue.Queue()
        self.consumers = []
        self.running = False

    def publish(self, message: Any):
        """Publish a message to the queue"""
        self.queue.put(message)

    def subscribe(self, consumer_func: Callable):
        """Subscribe a consumer function"""
        self.consumers.append(consumer_func)

    def start_consuming(self):
        """Start consuming messages"""
        self.running = True
        for consumer in self.consumers:
            thread = threading.Thread(target=self._consume_loop, args=(consumer,))
            thread.daemon = True
            thread.start()

    def stop_consuming(self):
        """Stop consuming messages"""
        self.running = False

    def _consume_loop(self, consumer_func: Callable):
        """Consumer loop"""
        while self.running:
            try:
                message = self.queue.get(timeout=1)
                consumer_func(message)
                self.queue.task_done()
            except queue.Empty:
                continue

# Usage
mq = SimpleMessageQueue()

def email_consumer(message):
    print(f"Sending email: {message}")

def sms_consumer(message):
    print(f"Sending SMS: {message}")

mq.subscribe(email_consumer)
mq.subscribe(sms_consumer)
mq.start_consuming()

# Publish messages
mq.publish({"type": "email", "to": "user@example.com", "subject": "Welcome"})
mq.publish({"type": "sms", "to": "+1234567890", "message": "Your code is 1234"})
```

### Kafka Producer and Consumer
```python
from kafka import KafkaProducer, KafkaConsumer
import json
import threading

class KafkaMessageQueue:
    def __init__(self, bootstrap_servers=['localhost:9092']):
        self.bootstrap_servers = bootstrap_servers
        self.producer = None
        self.consumers = []

    def connect_producer(self):
        """Connect to Kafka producer"""
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                key_serializer=lambda k: str(k).encode('utf-8') if k else None
            )
        except Exception as e:
            print(f"Producer connection error: {e}")

    def publish(self, topic: str, message: Any, key: str = None):
        """Publish message to Kafka topic"""
        if not self.producer:
            self.connect_producer()

        try:
            future = self.producer.send(topic, value=message, key=key)
            future.get(timeout=10)  # Wait for confirmation
            print(f"Message published to {topic}")
        except Exception as e:
            print(f"Publish error: {e}")

    def subscribe(self, topic: str, consumer_func: Callable, group_id: str = 'default'):
        """Subscribe to Kafka topic"""
        def consumer_thread():
            consumer = KafkaConsumer(
                topic,
                bootstrap_servers=self.bootstrap_servers,
                group_id=group_id,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                key_deserializer=lambda k: k.decode('utf-8') if k else None,
                auto_offset_reset='earliest',
                enable_auto_commit=True
            )

            print(f"Subscribed to topic: {topic}")

            for message in consumer:
                try:
                    consumer_func(message.value, message.key)
                except Exception as e:
                    print(f"Consumer error: {e}")

        thread = threading.Thread(target=consumer_thread)
        thread.daemon = True
        thread.start()
        self.consumers.append(thread)

# Usage
mq = KafkaMessageQueue()

def order_processor(order_data, order_id):
    print(f"Processing order {order_id}: {order_data}")

mq.subscribe('orders', order_processor, group_id='order_processors')

# Publish order
order = {
    "id": "12345",
    "user_id": "user123",
    "items": ["item1", "item2"],
    "total": 99.99
}
mq.publish('orders', order, key="12345")
```

## 5. Circuit Breaker Implementation

### Circuit Breaker Pattern
```python
import time
import threading
from enum import Enum
from typing import Callable, Any

class CircuitBreakerState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 60,
                 expected_exception: Exception = Exception):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.expected_exception = expected_exception

        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitBreakerState.CLOSED
        self._lock = threading.Lock()

    def call(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker protection"""
        with self._lock:
            if self.state == CircuitBreakerState.OPEN:
                if self._should_attempt_reset():
                    self.state = CircuitBreakerState.HALF_OPEN
                else:
                    raise Exception("Circuit breaker is OPEN")

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except self.expected_exception as e:
            self._on_failure()
            raise e

    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to attempt reset"""
        if self.last_failure_time is None:
            return True
        return time.time() - self.last_failure_time >= self.recovery_timeout

    def _on_success(self):
        """Handle successful call"""
        self.failure_count = 0
        self.state = CircuitBreakerState.CLOSED

    def _on_failure(self):
        """Handle failed call"""
        self.failure_count += 1
        self.last_failure_time = time.time()

        if self.failure_count >= self.failure_threshold:
            self.state = CircuitBreakerState.OPEN

# Usage
import requests

def api_call(url):
    response = requests.get(url, timeout=5)
    response.raise_for_status()
    return response.json()

circuit_breaker = CircuitBreaker(failure_threshold=3, recovery_timeout=30)

try:
    result = circuit_breaker.call(api_call, "https://api.example.com/data")
    print(f"Success: {result}")
except Exception as e:
    print(f"Failed: {e}")
```

## 6. Rate Limiter Implementation

### Token Bucket Algorithm
```python
import time
import threading
from collections import defaultdict

class TokenBucketRateLimiter:
    def __init__(self, capacity: int, refill_rate: float):
        """
        capacity: Maximum tokens in bucket
        refill_rate: Tokens added per second
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = time.time()
        self.lock = threading.Lock()
        self.user_buckets = defaultdict(lambda: {
            'tokens': capacity,
            'last_refill': time.time()
        })

    def _refill_tokens(self, user_id: str):
        """Refill tokens for a user"""
        bucket = self.user_buckets[user_id]
        now = time.time()
        time_passed = now - bucket['last_refill']
        tokens_to_add = time_passed * self.refill_rate

        bucket['tokens'] = min(self.capacity, bucket['tokens'] + tokens_to_add)
        bucket['last_refill'] = now

    def is_allowed(self, user_id: str, tokens_needed: int = 1) -> bool:
        """Check if request is allowed"""
        with self.lock:
            self._refill_tokens(user_id)
            bucket = self.user_buckets[user_id]

            if bucket['tokens'] >= tokens_needed:
                bucket['tokens'] -= tokens_needed
                return True
            return False

    def get_remaining_tokens(self, user_id: str) -> float:
        """Get remaining tokens for user"""
        with self.lock:
            self._refill_tokens(user_id)
            return self.user_buckets[user_id]['tokens']

# Usage
limiter = TokenBucketRateLimiter(capacity=10, refill_rate=1)  # 10 requests, refill 1 per second

for i in range(15):
    if limiter.is_allowed("user123"):
        print(f"Request {i+1}: Allowed")
    else:
        print(f"Request {i+1}: Rate limited")

    time.sleep(0.5)
```

### Sliding Window Rate Limiter
```python
import time
from collections import deque

class SlidingWindowRateLimiter:
    def __init__(self, window_size: int, max_requests: int):
        """
        window_size: Time window in seconds
        max_requests: Maximum requests allowed in window
        """
        self.window_size = window_size
        self.max_requests = max_requests
        self.user_requests = defaultdict(deque)

    def is_allowed(self, user_id: str) -> bool:
        """Check if request is allowed"""
        now = time.time()
        user_queue = self.user_requests[user_id]

        # Remove old requests outside the window
        while user_queue and now - user_queue[0] > self.window_size:
            user_queue.popleft()

        # Check if under limit
        if len(user_queue) < self.max_requests:
            user_queue.append(now)
            return True

        return False

# Usage
limiter = SlidingWindowRateLimiter(window_size=60, max_requests=5)  # 5 requests per minute

for i in range(10):
    if limiter.is_allowed("user123"):
        print(f"Request {i+1}: Allowed")
    else:
        print(f"Request {i+1}: Rate limited")

    time.sleep(10)  # Wait 10 seconds between requests
```

## 7. Distributed Lock Implementation

### Redis-based Distributed Lock
```python
import redis
import time
import uuid
from typing import Optional

class DistributedLock:
    def __init__(self, redis_client: redis.Redis, lock_name: str, ttl: int = 30):
        self.redis = redis_client
        self.lock_name = lock_name
        self.ttl = ttl
        self.lock_value = None

    def acquire(self, timeout: int = 10) -> bool:
        """Acquire distributed lock"""
        self.lock_value = str(uuid.uuid4())
        end_time = time.time() + timeout

        while time.time() < end_time:
            # Try to set the lock
            if self.redis.set(self.lock_name, self.lock_value, ex=self.ttl, nx=True):
                return True

            # Wait a bit before retrying
            time.sleep(0.1)

        return False

    def release(self) -> bool:
        """Release distributed lock"""
        if not self.lock_value:
            return False

        # Use Lua script for atomic check-and-delete
        unlock_script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
        """

        try:
            result = self.redis.eval(unlock_script, 1, self.lock_name, self.lock_value)
            return result == 1
        except Exception as e:
            print(f"Unlock error: {e}")
            return False

    def extend(self, additional_ttl: int = 30) -> bool:
        """Extend lock TTL"""
        if not self.lock_value:
            return False

        # Use Lua script for atomic check-and-extend
        extend_script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("expire", KEYS[1], ARGV[2])
        else
            return 0
        end
        """

        try:
            result = self.redis.eval(extend_script, 1, self.lock_name, self.lock_value, additional_ttl)
            return result == 1
        except Exception as e:
            print(f"Extend error: {e}")
            return False

# Usage
redis_client = redis.Redis(host='localhost', port=6379)
lock = DistributedLock(redis_client, 'resource_lock')

if lock.acquire(timeout=5):
    try:
        # Critical section
        print("Lock acquired, performing critical operation")
        time.sleep(2)

        # Extend lock if needed
        lock.extend(30)

        print("Operation completed")
    finally:
        lock.release()
        print("Lock released")
else:
    print("Failed to acquire lock")
```

## 8. API Gateway Implementation

### Simple API Gateway
```python
from flask import Flask, request, jsonify
import requests
import time
import json
from functools import wraps

app = Flask(__name__)

# Service registry
SERVICES = {
    'user': 'http://localhost:8081',
    'product': 'http://localhost:8082',
    'order': 'http://localhost:8083'
}

# Rate limiting storage
rate_limit_store = {}

def rate_limit(max_requests: int, window_seconds: int):
    """Rate limiting decorator"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            client_ip = request.remote_addr
            current_time = time.time()

            if client_ip not in rate_limit_store:
                rate_limit_store[client_ip] = []

            # Clean old requests
            rate_limit_store[client_ip] = [
                req_time for req_time in rate_limit_store[client_ip]
                if current_time - req_time < window_seconds
            ]

            if len(rate_limit_store[client_ip]) >= max_requests:
                return jsonify({'error': 'Rate limit exceeded'}), 429

            rate_limit_store[client_ip].append(current_time)
            return func(*args, **kwargs)
        return wrapper
    return decorator

@app.route('/api/<service>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@rate_limit(max_requests=100, window_seconds=60)
def api_gateway(service, path):
    """Route requests to appropriate services"""
    if service not in SERVICES:
        return jsonify({'error': 'Service not found'}), 404

    service_url = f"{SERVICES[service]}/{path}"

    try:
        # Forward request to service
        response = requests.request(
            method=request.method,
            url=service_url,
            headers={key: value for key, value in request.headers if key != 'Host'},
            data=request.get_data(),
            params=request.args,
            timeout=30
        )

        # Return response
        return response.content, response.status_code, dict(response.headers)

    except requests.RequestException as e:
        return jsonify({'error': 'Service unavailable', 'details': str(e)}), 503

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
```

These implementations provide practical examples of common system design patterns and can be used as starting points for building scalable distributed systems. Each example includes error handling, best practices, and usage instructions.
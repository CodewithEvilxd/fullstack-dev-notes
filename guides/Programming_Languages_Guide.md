# Programming Languages Guide - Full-Stack Development

## JavaScript - The Foundation

### Core Concepts and Best Practices

#### Variable Declarations
```javascript
// ES6+ variable declarations
const PI = 3.14159;        // Immutable constant
let counter = 0;           // Mutable variable
var legacy = "avoid";      // Legacy, avoid using

// Best practices
const CONFIG = Object.freeze({
  API_URL: 'https://api.example.com',
  TIMEOUT: 5000
});
```

#### Modern JavaScript Features (ES6+)
```javascript
// Arrow functions
const add = (a, b) => a + b;
const greet = name => `Hello, ${name}!`;

// Template literals
const user = { name: 'John', age: 30 };
const message = `User ${user.name} is ${user.age} years old.`;

// Destructuring
const { name, age } = user;
const [first, second] = ['apple', 'banana'];

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Optional chaining
const userName = user?.profile?.name ?? 'Anonymous';

// Nullish coalescing
const timeout = config.timeout ?? 3000;
```

#### Asynchronous Programming
```javascript
// Promises
function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(user => {
      console.log('User:', user);
      return user;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

// Async/await (preferred modern approach)
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    console.log('User:', user);
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Parallel execution
async function fetchMultipleUsers(ids) {
  const promises = ids.map(id => fetchUser(id));
  const users = await Promise.all(promises);
  return users;
}

// Race condition handling
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}
```

#### Error Handling Patterns
```javascript
// Custom error classes
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

// Error handling with custom errors
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
  return true;
}

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error reporting service
  reportError(event.reason);
});

window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
  // Send to error reporting service
  reportError(event.error);
});
```

#### Memory Management
```javascript
// Avoiding memory leaks
class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  destroy() {
    this.listeners.clear(); // Clean up all listeners
  }
}

// Proper cleanup in React components
import { useEffect, useRef } from 'react';

function DataFetcher() {
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    fetchData(abortControllerRef.current.signal);

    return () => {
      // Cleanup on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = async (signal) => {
    try {
      const response = await fetch('/api/data', { signal });
      const data = await response.json();
      // Process data
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    }
  };

  return <div>Data component</div>;
}
```

## TypeScript - JavaScript with Superpowers

### Type System Fundamentals
```typescript
// Basic types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// Union types
type StringOrNumber = string | number;
let value: StringOrNumber = "hello";
value = 42; // Also valid

// Intersection types
type Name = { name: string };
type Age = { age: number };
type Person = Name & Age;

const person: Person = {
  name: "John",
  age: 30
};

// Generic types
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
let output2 = identity("myString"); // Type inference

// Generic interfaces
interface GenericIdentityFn<T> {
  (arg: T): T;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### Advanced TypeScript Patterns
```typescript
// Conditional types
type IsString<T> = T extends string ? true : false;
type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Utility types
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
type TodoOmit = Omit<Todo, "description">;

// Discriminated unions
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number }
  | { kind: "triangle"; base: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}
```

### TypeScript Best Practices
```typescript
// Strict mode configuration (tsconfig.json)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}

// Type guards
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(obj: any): obj is User {
  return obj && typeof obj.name === 'string' && typeof obj.email === 'string';
}

// Assertion functions
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Value must be a string');
  }
}

// Branded types for type safety
type UserId = string & { readonly __brand: unique symbol };
type Email = string & { readonly __brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}

function createEmail(email: string): Email {
  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }
  return email as Email;
}
```

## Python - Versatile Backend Language

### Pythonic Code Patterns
```python
# List comprehensions
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
even_squares = [x**2 for x in numbers if x % 2 == 0]

# Dictionary comprehensions
names = ['Alice', 'Bob', 'Charlie']
name_lengths = {name: len(name) for name in names}

# Generator expressions (memory efficient)
large_squares = (x**2 for x in range(1000000))

# Context managers
class DatabaseConnection:
    def __enter__(self):
        self.connection = create_connection()
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.connection.close()

# Usage
with DatabaseConnection() as conn:
    conn.execute("SELECT * FROM users")

# Or using contextlib
from contextlib import contextmanager

@contextmanager
def database_connection():
    conn = create_connection()
    try:
        yield conn
    finally:
        conn.close()

with database_connection() as conn:
    conn.execute("SELECT * FROM users")
```

### Advanced Python Features
```python
# Decorators
def timing_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.2f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(2)
    return "Done"

# Class decorators
def singleton(cls):
    instances = {}
    @functools.wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    def __init__(self):
        self.connection = create_connection()

# Property decorators
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("Radius must be positive")
        self._radius = value

    @property
    def area(self):
        return math.pi * self._radius ** 2
```

### Async Programming in Python
```python
import asyncio
import aiohttp

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.text()

async def fetch_multiple_urls(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

# Usage
async def main():
    urls = [
        'https://api.github.com/users/octocat',
        'https://api.github.com/users/defunkt'
    ]
    results = await fetch_multiple_urls(urls)
    for result in results:
        if isinstance(result, Exception):
            print(f"Error: {result}")
        else:
            print(f"Success: {len(result)} characters")

asyncio.run(main())
```

### Data Classes and Type Hints
```python
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
import datetime

@dataclass
class User:
    id: int
    name: str
    email: str
    created_at: datetime.datetime
    is_active: bool = True
    metadata: Optional[Dict[str, Any]] = None

@dataclass
class Post:
    id: int
    title: str
    content: str
    author: User
    tags: List[str]
    published_at: Optional[datetime.datetime] = None

# Type hints for functions
def create_user(name: str, email: str) -> User:
    return User(
        id=get_next_id(),
        name=name,
        email=email,
        created_at=datetime.datetime.now()
    )

def get_users_by_status(is_active: bool = True) -> List[User]:
    # Implementation
    pass

# Generic types
from typing import TypeVar, Generic

T = TypeVar('T')

class Repository(Generic[T]):
    def __init__(self, model_class: type):
        self.model_class = model_class
        self.items: List[T] = []

    def add(self, item: T) -> None:
        self.items.append(item)

    def get_all(self) -> List[T]:
        return self.items.copy()

user_repo = Repository[User]()
```

## Language Comparison and Selection

### JavaScript vs TypeScript

| Aspect | JavaScript | TypeScript |
|--------|------------|------------|
| **Type Safety** | Dynamic typing | Static typing |
| **IDE Support** | Basic | Advanced (intellisense, refactoring) |
| **Learning Curve** | Easy | Moderate |
| **Runtime** | Direct execution | Compilation to JS |
| **Ecosystem** | Massive | Subset of JS ecosystem |
| **Error Detection** | Runtime | Compile-time + runtime |
| **Best For** | Prototyping, small projects | Large applications, teams |

### Python vs JavaScript

| Aspect | Python | JavaScript |
|--------|--------|------------|
| **Performance** | Generally faster | V8 engine optimization |
| **Concurrency** | Async/await, threading | Event loop, Web Workers |
| **Ecosystem** | Scientific computing, AI | Web development, Node.js |
| **Learning Curve** | Gentle | Moderate |
| **Deployment** | Multiple options | Web-focused |
| **Best For** | Data science, backend APIs | Full-stack web, real-time apps |

### When to Choose Each Language

#### JavaScript/Node.js
- **Web applications** (frontend and backend)
- **Real-time applications** (WebSockets, chat apps)
- **API development** (REST, GraphQL)
- **Microservices** architecture
- **Cross-platform mobile** (React Native)
- **Desktop applications** (Electron)

#### TypeScript
- **Large-scale applications** requiring type safety
- **Team development** with better tooling
- **Complex business logic** with refactoring needs
- **Long-term maintainability** concerns
- **Enterprise applications** with strict requirements

#### Python
- **Data science and machine learning**
- **Scientific computing** and research
- **Backend APIs** with rapid development
- **Automation and scripting**
- **Web applications** (Django, Flask)
- **DevOps and infrastructure** tools

#### Go
- **High-performance backend services**
- **Microservices architecture**
- **Cloud-native applications**
- **Concurrent systems** (goroutines)
- **CLI tools and utilities**

#### Rust
- **System-level programming**
- **High-performance applications**
- **WebAssembly** development
- **Memory-safe systems**
- **Embedded systems**

## Performance Optimization

### JavaScript Performance Tips
```javascript
// Efficient loops
// Bad
for (let i = 0; i < array.length; i++) {
  // array.length calculated on every iteration
}

// Good
const length = array.length;
for (let i = 0; i < length; i++) {
  // length cached
}

// Function debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Memoization
function memoize(func) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### Python Performance Optimization
```python
# List comprehensions vs loops
import time

# Less efficient
def slow_squares(n):
    result = []
    for i in range(n):
        result.append(i ** 2)
    return result

# More efficient
def fast_squares(n):
    return [i ** 2 for i in range(n)]

# Generator for memory efficiency
def fibonacci_generator():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Efficient string concatenation
# Bad
result = ""
for word in words:
    result += word  # Creates new string each time

# Good
result = "".join(words)  # Single operation

# Context manager for resource management
import psycopg2

class DatabaseConnection:
    def __init__(self, connection_string):
        self.connection_string = connection_string

    def __enter__(self):
        self.conn = psycopg2.connect(self.connection_string)
        return self.conn

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()
```

## Security Best Practices

### Input Validation and Sanitization
```javascript
// Client-side validation (JavaScript)
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input) {
  return input.replace(/[<>]/g, ''); // Basic XSS prevention
}

// Server-side validation (Node.js/Express)
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(13).max(120)
});

app.post('/api/users', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  // Process validated data
});
```

### Secure Coding Patterns
```python
# Secure password hashing
import bcrypt
import secrets

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

# Secure random token generation
def generate_secure_token(length: int = 32) -> str:
    return secrets.token_urlsafe(length)

# SQL injection prevention
import sqlite3

def get_user_by_id(user_id: int):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    # Safe parameterized query
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    conn.close()
    return user
```

## Testing Strategies

### Unit Testing Patterns
```javascript
// Jest testing example
const { add, multiply } = require('./math');

describe('Math utilities', () => {
  describe('add', () => {
    test('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('adds positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });

    test('handles zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    test('multiplies two numbers', () => {
      expect(multiply(2, 3)).toBe(6);
    });

    test('handles multiplication by zero', () => {
      expect(multiply(0, 5)).toBe(0);
    });
  });
});
```

```python
# Pytest testing example
import pytest
from math_utils import add, multiply, divide

class TestMathUtils:
    def test_add_positive_numbers(self):
        assert add(2, 3) == 5

    def test_add_mixed_numbers(self):
        assert add(5, -3) == 2

    def test_multiply_numbers(self):
        assert multiply(2, 3) == 6

    def test_multiply_by_zero(self):
        assert multiply(0, 5) == 0

    def test_divide_numbers(self):
        assert divide(6, 3) == 2

    def test_divide_by_zero_raises_error(self):
        with pytest.raises(ZeroDivisionError):
            divide(5, 0)

    @pytest.mark.parametrize("a,b,expected", [
        (1, 2, 3),
        (0, 5, 5),
        (-1, 1, 0)
    ])
    def test_add_parametrized(self, a, b, expected):
        assert add(a, b) == expected
```

## Language-Specific Frameworks

### JavaScript Frameworks
- **Express.js** - Minimalist web framework
- **Fastify** - High-performance web framework
- **Koa.js** - Next-generation web framework
- **NestJS** - Progressive Node.js framework
- **Sails.js** - MVC framework for Node.js

### Python Frameworks
- **Django** - Full-featured web framework
- **Flask** - Lightweight web framework
- **FastAPI** - Modern async web framework
- **Tornado** - Scalable web framework
- **Sanic** - Async web framework

### TypeScript Frameworks
- **Angular** - Full-featured frontend framework
- **Vue.js** - Progressive frontend framework
- **React** - Component-based UI library
- **Svelte** - Compiler-based frontend framework
- **Ionic** - Cross-platform mobile framework

## Best Practices Summary

### Code Quality
- **Consistent naming conventions**
- **DRY (Don't Repeat Yourself)** principle
- **SOLID principles** for object-oriented design
- **Clean code** practices
- **Documentation** and comments

### Performance
- **Efficient algorithms** and data structures
- **Memory management** and optimization
- **Caching strategies**
- **Lazy loading** and code splitting
- **Bundle optimization**

### Security
- **Input validation** and sanitization
- **Authentication and authorization**
- **Secure coding practices**
- **Regular security updates**
- **Security testing and auditing**

### Maintainability
- **Modular architecture**
- **Version control** best practices
- **Code reviews** and quality checks
- **Automated testing**
- **Continuous integration/delivery**

This comprehensive guide covers the essential aspects of major programming languages used in full-stack development. Each language has its strengths and use cases, and the choice depends on project requirements, team expertise, and scalability needs.
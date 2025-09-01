# Lesson 08.5: PostgreSQL Database

## Overview
PostgreSQL is a powerful, open-source relational database management system known for its robustness, extensibility, and standards compliance. This lesson covers PostgreSQL fundamentals and advanced features for full-stack development.

## What is PostgreSQL?

### Key Features
```
Advanced Features:
├── ACID compliance (Atomicity, Consistency, Isolation, Durability)
├── Multi-version concurrency control (MVCC)
├── Table inheritance
├── Asynchronous replication
├── Native JSON and JSONB support
├── Full-text search
├── Custom data types and functions
├── Extensible indexing (GiST, GIN, SP-GiST)
└── Support for multiple programming languages
```

### PostgreSQL vs Other Databases

| Feature | PostgreSQL | MySQL | MongoDB |
|---------|------------|-------|---------|
| **Data Model** | Relational | Relational | Document |
| **ACID** | ✅ Full | ✅ Full | ❌ BASE |
| **JSON Support** | ✅ Native | ✅ Limited | ✅ Native |
| **Extensibility** | ✅ High | ⚠️ Medium | ⚠️ Medium |
| **Performance** | ✅ Excellent | ✅ Excellent | ✅ High |
| **Complexity** | ⚠️ Medium | ✅ Simple | ✅ Simple |

## Installation and Setup

### Installing PostgreSQL

#### Windows
```bash
# Download from postgresql.org
# Run installer
# Set password for postgres user
# Start PostgreSQL service
```

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb mydb
```

#### Linux (Ubuntu)
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create user and database
sudo -u postgres createuser --interactive --pwprompt myuser
sudo -u postgres createdb mydb
```

### GUI Tools
```
Popular PostgreSQL GUI Tools:
├── pgAdmin 4 (Official, free)
├── DBeaver (Universal, free)
├── DataGrip (JetBrains, paid)
├── TablePlus (Modern, paid)
└── Postico (macOS, paid)
```

## Basic PostgreSQL Commands

### Connecting to Database
```bash
# Connect to database
psql -h localhost -p 5432 -U myuser -d mydb

# Connect as postgres user
sudo -u postgres psql

# Show databases
\l

# Switch database
\c mydb

# Show tables
\dt

# Show users
\du

# Exit
\q
```

### Database Operations
```sql
-- Create database
CREATE DATABASE ecommerce;

-- Drop database
DROP DATABASE ecommerce;

-- Create user
CREATE USER app_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO app_user;

-- Revoke permissions
REVOKE ALL PRIVILEGES ON DATABASE ecommerce FROM app_user;
```

## Data Types in PostgreSQL

### Numeric Types
```sql
-- Integer types
SMALLINT     -- 2 bytes (-32,768 to +32,767)
INTEGER      -- 4 bytes (-2,147,483,648 to +2,147,483,647)
BIGINT       -- 8 bytes (-9,223,372,036,854,775,808 to +9,223,372,036,854,775,807)

-- Floating-point types
REAL         -- 4 bytes (6 decimal digits precision)
DOUBLE PRECISION -- 8 bytes (15 decimal digits precision)

-- Exact numeric types
NUMERIC(precision, scale)  -- e.g., NUMERIC(10,2) for money
DECIMAL(precision, scale)  -- Same as NUMERIC
```

### Character Types
```sql
-- Fixed-length
CHAR(n)      -- Fixed length, padded with spaces
VARCHAR(n)   -- Variable length with limit
TEXT         -- Unlimited length

-- Examples
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT
);
```

### Date and Time Types
```sql
-- Date and time types
DATE         -- Date only (YYYY-MM-DD)
TIME         -- Time only (HH:MM:SS)
TIMESTAMP    -- Date and time
TIMESTAMPTZ  -- Timestamp with timezone
INTERVAL     -- Time interval

-- Examples
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ
);
```

### Boolean and JSON Types
```sql
-- Boolean
BOOLEAN      -- TRUE, FALSE, NULL

-- JSON types
JSON         -- Stored as text, validated
JSONB        -- Binary storage, indexed, faster operations

-- Examples
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    specifications JSON
);
```

## Table Creation and Constraints

### Primary Keys and Auto-Increment
```sql
-- Using SERIAL for auto-increment
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Using IDENTITY (PostgreSQL 10+)
CREATE TABLE orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
);
```

### Foreign Keys and Relationships
```sql
-- One-to-many relationship
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
);

-- Many-to-many relationship
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE product_tags (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);
```

### Check Constraints and Defaults
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    salary DECIMAL(10,2) CHECK (salary > 0),
    department VARCHAR(50) NOT NULL,
    hire_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated'))
);
```

## CRUD Operations

### INSERT Operations
```sql
-- Basic insert
INSERT INTO users (username, email)
VALUES ('johndoe', 'john@example.com');

-- Insert multiple rows
INSERT INTO products (name, price, category_id)
VALUES
    ('Laptop', 999.99, 1),
    ('Mouse', 29.99, 2),
    ('Keyboard', 79.99, 2);

-- Insert with returning
INSERT INTO users (username, email)
VALUES ('janedoe', 'jane@example.com')
RETURNING id, username, email;
```

### SELECT Operations
```sql
-- Basic select
SELECT * FROM users;

-- Select specific columns
SELECT username, email FROM users WHERE id = 1;

-- Joins
SELECT p.name, p.price, c.name as category
FROM products p
JOIN categories c ON p.category_id = c.id;

-- Aggregations
SELECT
    COUNT(*) as total_products,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products;

-- Group by
SELECT category_id, COUNT(*) as product_count, AVG(price) as avg_price
FROM products
GROUP BY category_id
HAVING COUNT(*) > 5;
```

### UPDATE Operations
```sql
-- Basic update
UPDATE users
SET email = 'newemail@example.com'
WHERE id = 1;

-- Update with conditions
UPDATE products
SET price = price * 1.1
WHERE category_id = 1;

-- Update with returning
UPDATE users
SET last_login = CURRENT_TIMESTAMP
WHERE id = 1
RETURNING id, username, last_login;
```

### DELETE Operations
```sql
-- Basic delete
DELETE FROM users WHERE id = 1;

-- Delete with cascade (if foreign keys allow)
DELETE FROM categories WHERE id = 1;

-- Safe delete with confirmation
DELETE FROM products
WHERE id = 1
RETURNING name, price;
```

## Advanced Queries

### Subqueries
```sql
-- Subquery in WHERE clause
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Subquery in FROM clause
SELECT category_name, avg_price
FROM (
    SELECT c.name as category_name, AVG(p.price) as avg_price
    FROM products p
    JOIN categories c ON p.category_id = c.id
    GROUP BY c.id, c.name
) as category_stats
WHERE avg_price > 100;
```

### Common Table Expressions (CTEs)
```sql
-- Recursive CTE for hierarchical data
WITH RECURSIVE category_tree AS (
    -- Base case
    SELECT id, name, parent_id, 0 as level
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive case
    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY level, name;
```

### Window Functions
```sql
-- Ranking products by price within categories
SELECT
    name,
    category_id,
    price,
    RANK() OVER (PARTITION BY category_id ORDER BY price DESC) as price_rank,
    ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY price DESC) as row_num
FROM products;

-- Running totals
SELECT
    id,
    amount,
    SUM(amount) OVER (ORDER BY created_at) as running_total
FROM transactions
ORDER BY created_at;
```

## Indexing Strategies

### Types of Indexes
```sql
-- B-tree index (default, good for equality and range queries)
CREATE INDEX idx_users_email ON users(email);

-- Hash index (good for equality only)
CREATE INDEX idx_users_username ON users USING HASH(username);

-- GIN index (good for arrays and full-text search)
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Partial index (index only certain rows)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;

-- Expression index (index on computed values)
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
```

### Index Best Practices
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Index foreign keys
CREATE INDEX idx_products_category_id ON products(category_id);

-- Composite indexes for multi-column queries
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Avoid over-indexing
-- Monitor index usage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Transactions and Concurrency

### ACID Properties
```sql
-- Basic transaction
BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Transaction with error handling
BEGIN;
    UPDATE accounts SET balance = balance - 100 WHERE id = 1;
    UPDATE accounts SET balance = balance + 100 WHERE id = 2;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
```

### Isolation Levels
```sql
-- Set transaction isolation level
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    -- Your queries here
COMMIT;

-- Available levels:
-- READ UNCOMMITTED (lowest isolation)
-- READ COMMITTED (default)
-- REPEATABLE READ
-- SERIALIZABLE (highest isolation)
```

### Locking Mechanisms
```sql
-- Row-level locking
SELECT * FROM products WHERE id = 1 FOR UPDATE;

-- Table-level locking
LOCK TABLE products IN EXCLUSIVE MODE;

-- Advisory locks for application-level locking
SELECT pg_advisory_lock(123);
-- Do work
SELECT pg_advisory_unlock(123);
```

## Views and Functions

### Views
```sql
-- Simple view
CREATE VIEW active_users AS
SELECT id, username, email, created_at
FROM users
WHERE active = true;

-- Materialized view (cached results)
CREATE MATERIALIZED VIEW product_stats AS
SELECT
    category_id,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM products
GROUP BY category_id;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW product_stats;
```

### Functions
```sql
-- Simple function
CREATE OR REPLACE FUNCTION get_user_by_id(user_id INTEGER)
RETURNS TABLE(id INTEGER, username VARCHAR, email VARCHAR)
AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.username, u.email
    FROM users u
    WHERE u.id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function with parameters
CREATE OR REPLACE FUNCTION calculate_discount(price DECIMAL, discount_percent DECIMAL)
RETURNS DECIMAL
AS $$
BEGIN
    RETURN price * (1 - discount_percent / 100);
END;
$$ LANGUAGE plpgsql;

-- Trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

## JSON and JSONB Operations

### JSON Data Handling
```sql
-- Insert JSON data
INSERT INTO products (name, metadata)
VALUES ('iPhone 14', '{"brand": "Apple", "specs": {"storage": "128GB", "color": "Blue"}}');

-- Query JSON data
SELECT name, metadata->>'brand' as brand
FROM products
WHERE metadata->>'brand' = 'Apple';

-- Query nested JSON
SELECT name, metadata->'specs'->>'storage' as storage
FROM products;

-- Update JSON field
UPDATE products
SET metadata = metadata || '{"warranty": "2 years"}'
WHERE id = 1;
```

### JSONB Indexing and Performance
```sql
-- Create GIN index for JSONB
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);

-- JSONB operators
SELECT * FROM products WHERE metadata @> '{"brand": "Apple"}';
SELECT * FROM products WHERE metadata ? 'warranty';
SELECT * FROM products WHERE metadata ?| array['warranty', 'insurance'];
```

## Full-Text Search

### Basic Full-Text Search
```sql
-- Create full-text search vector
ALTER TABLE posts ADD COLUMN search_vector TSVECTOR;

-- Create GIN index
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Update search vector
UPDATE posts SET search_vector =
    to_tsvector('english', title || ' ' || content);

-- Search query
SELECT title, ts_rank(search_vector, query) as rank
FROM posts, to_tsquery('english', 'database & performance') as query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

### Advanced Search Features
```sql
-- Weighted search
SELECT title,
       ts_rank('{0.1, 0.2, 1.0}', search_vector, query) as rank
FROM posts, to_tsquery('english', 'database') as query
WHERE search_vector @@ query;

-- Highlight search results
SELECT title,
       ts_headline('english', content, query) as highlight
FROM posts, to_tsquery('english', 'database') as query
WHERE search_vector @@ query;
```

## Backup and Recovery

### Backup Strategies
```bash
# Logical backup (pg_dump)
pg_dump -h localhost -U postgres -d mydb > mydb_backup.sql

# Custom format backup
pg_dump -h localhost -U postgres -d mydb -Fc > mydb_backup.dump

# Directory format backup
pg_dump -h localhost -U postgres -d mydb -Fd -j 4 > mydb_backup_dir

# Continuous archiving (WAL)
# Configure postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/archive/%f'
```

### Restore Strategies
```bash
# Restore from SQL dump
psql -h localhost -U postgres -d mydb < mydb_backup.sql

# Restore from custom format
pg_restore -h localhost -U postgres -d mydb mydb_backup.dump

# Restore from directory format
pg_restore -h localhost -U postgres -d mydb mydb_backup_dir

# Point-in-time recovery
# Configure recovery.conf
restore_command = 'cp /var/lib/postgresql/archive/%f %p'
recovery_target_time = '2024-01-01 12:00:00'
```

## Performance Optimization

### Query Optimization
```sql
-- Analyze query execution
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Use EXPLAIN options
EXPLAIN (ANALYZE, VERBOSE, COSTS, BUFFERS, TIMING)
SELECT * FROM users WHERE email = 'test@example.com';

-- Query optimization tips
-- 1. Use appropriate indexes
-- 2. Avoid SELECT *
-- 3. Use LIMIT for large result sets
-- 4. Use UNION ALL instead of UNION when possible
-- 5. Use EXISTS instead of IN for subqueries
```

### Configuration Tuning
```sql
-- Memory settings
shared_buffers = 256MB          -- 25% of RAM
effective_cache_size = 1GB      -- 75% of RAM
work_mem = 4MB                  -- Per-connection working memory
maintenance_work_mem = 64MB     -- Maintenance operations

-- Connection settings
max_connections = 100           -- Maximum concurrent connections
shared_preload_libraries = 'pg_stat_statements'  -- Query statistics

-- Logging
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_statement = 'ddl'           -- Log DDL statements
log_duration = on               -- Log query duration
```

### Monitoring Queries
```sql
-- Enable pg_stat_statements
CREATE EXTENSION pg_stat_statements;

-- Query performance statistics
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Active queries
SELECT
    pid,
    now() - query_start as duration,
    query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

## Security Best Practices

### User Management
```sql
-- Create role with specific permissions
CREATE ROLE app_user LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE myapp TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;

-- Create read-only user
CREATE ROLE readonly_user LOGIN PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE myapp TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

### Row Level Security (RLS)
```sql
-- Enable RLS on table
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY user_data_policy ON user_data
    FOR ALL
    USING (user_id = current_user_id());

-- Create function for current user
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS INTEGER
AS $$
    SELECT id FROM users WHERE username = current_user;
$$ LANGUAGE sql SECURITY DEFINER;
```

### Data Encryption
```sql
-- Encrypt sensitive data
CREATE EXTENSION pgcrypto;

-- Store encrypted password
UPDATE users
SET password_hash = crypt('mypassword', gen_salt('bf', 8))
WHERE id = 1;

-- Verify password
SELECT id FROM users
WHERE id = 1
  AND password_hash = crypt('mypassword', password_hash);
```

## Integration with Node.js

### Using pg Library
```javascript
const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'myuser',
  password: 'mypassword',
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Query example
async function getUsers() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users');
    return result.rows;
  } finally {
    client.release();
  }
}

// Transaction example
async function transferMoney(fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromId]
    );
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toId]
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### Using Prisma ORM
```javascript
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}

// Usage
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUser() {
  const user = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: {
        create: {
          title: 'My first post',
          content: 'Hello world!'
        }
      }
    },
    include: {
      posts: true
    }
  });
  return user;
}
```

## Common PostgreSQL Patterns

### Audit Logging
```sql
-- Create audit table
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by INTEGER,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit trigger
CREATE TRIGGER users_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_function();
```

### Pagination
```sql
-- Offset-based pagination (simple but slow for large datasets)
SELECT * FROM products
ORDER BY id
LIMIT 10 OFFSET 20;

-- Cursor-based pagination (efficient)
SELECT * FROM products
WHERE id > 100
ORDER BY id
LIMIT 10;

-- Keyset pagination with multiple columns
SELECT * FROM products
WHERE (category_id, id) > (1, 100)
ORDER BY category_id, id
LIMIT 10;
```

## Summary

PostgreSQL is a powerful relational database that offers:

1. **Robustness**: ACID compliance, MVCC, crash recovery
2. **Extensibility**: Custom types, functions, operators
3. **Performance**: Advanced indexing, query optimization
4. **Features**: JSON support, full-text search, geospatial data
5. **Ecosystem**: Rich tooling, community support

### Key Takeaways
- Use appropriate data types for optimal storage and performance
- Design proper indexes based on query patterns
- Implement transactions for data consistency
- Use connection pooling for better performance
- Monitor and optimize query performance
- Implement proper security measures
- Plan backup and recovery strategies

PostgreSQL is an excellent choice for applications requiring complex queries, data integrity, and scalability. It's particularly well-suited for full-stack applications with Node.js backends.

### Next Steps
1. Install PostgreSQL locally
2. Practice basic CRUD operations
3. Learn advanced querying techniques
4. Implement proper indexing strategies
5. Study performance optimization
6. Integrate with your Node.js applications

Happy learning! 🚀
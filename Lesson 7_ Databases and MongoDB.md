### **Lesson 7: Databases and MongoDB - NoSQL Document Database**

## **1. What is a Database?**

A database is an organized collection of structured data that is stored and accessed electronically. Databases are designed to efficiently store, retrieve, and manage large amounts of data for various applications.

### **Types of Databases:**

#### **Relational Databases (SQL):**
- Data stored in tables with predefined schemas
- Uses SQL (Structured Query Language) for queries
- ACID transactions (Atomicity, Consistency, Isolation, Durability)
- Examples: MySQL, PostgreSQL, SQL Server, Oracle
- Best for: Complex queries, transactions, structured data

#### **Non-Relational Databases (NoSQL):**
- Flexible data models (document, key-value, graph, column-family)
- Horizontal scaling and high performance
- Eventual consistency (BASE: Basically Available, Soft state, Eventually consistent)
- Examples: MongoDB, Cassandra, Redis, DynamoDB
- Best for: Large-scale applications, unstructured data, real-time analytics

#### **Other Database Types:**
- **Key-Value Stores:** Redis, DynamoDB
- **Document Databases:** MongoDB, CouchDB
- **Column-Family:** Cassandra, HBase
- **Graph Databases:** Neo4j, Amazon Neptune
- **Time-Series:** InfluxDB, TimescaleDB

## **2. Introduction to MongoDB**

MongoDB is a popular NoSQL document database that stores data in flexible, JSON-like documents. It provides high performance, high availability, and easy scalability.

### **Key Features:**

#### **Core Features:**
- **Document-Oriented:** Stores data as BSON (Binary JSON) documents
- **Schema-less:** No predefined schema required
- **Horizontal Scaling:** Sharding for distributing data across multiple servers
- **Replication:** Replica sets for high availability
- **Rich Query Language:** Powerful querying capabilities
- **Indexing:** Multiple indexing strategies for performance
- **Aggregation Framework:** Advanced data processing pipelines

#### **Advanced Features:**
- **Change Streams:** Real-time data change notifications
- **Transactions:** Multi-document ACID transactions
- **GridFS:** Large file storage system
- **Geospatial Queries:** Location-based queries and indexing
- **Text Search:** Full-text search capabilities
- **Time Series Collections:** Optimized for time-series data
- **Client-Side Field Level Encryption:** Field-level data encryption
- **Atlas Search:** Advanced search with Lucene

### **When to Use MongoDB:**

- Applications with rapidly changing schemas
- Real-time analytics and high-speed logging
- Content management systems
- Mobile and social applications
- IoT applications
- Big data applications

## **3. MongoDB Architecture**

### **Documents and Advanced Data Types:**
MongoDB stores data as documents, which are JSON-like structures composed of field-value pairs.

#### **Basic Document Structure:**
```javascript
{
    _id: ObjectId("507f1f77bcf86cd799439011"),
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    address: {
        street: "123 Main St",
        city: "New York",
        zip: "10001"
    },
    hobbies: ["reading", "coding", "gaming"],
    createdAt: ISODate("2023-01-01T00:00:00Z")
}
```

#### **Advanced Data Types:**
```javascript
// ObjectId - 12-byte identifier
_id: ObjectId("507f1f77bcf86cd799439011")

// ISODate - Date/time with timezone
createdAt: ISODate("2023-01-01T00:00:00Z")
lastLogin: new Date()

// Binary Data
avatar: BinData(0, "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==")

// Regular Expressions
emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// JavaScript Code
validationFunction: function(value) {
    return value > 0;
}

// DBRef - References to other documents
author: {
    $ref: "users",
    $id: ObjectId("507f1f77bcf86cd799439011"),
    $db: "blog"
}

// Geospatial Data
location: {
    type: "Point",
    coordinates: [-73.97, 40.77]  // [longitude, latitude]
}

// Arrays with mixed types
tags: ["javascript", "mongodb", 2023, true]

// Nested objects
metadata: {
    version: "1.0",
    lastModified: new Date(),
    tags: ["important", "urgent"],
    stats: {
        views: 150,
        likes: 25,
        comments: 8
    }
}
```

#### **Document Size Limits and Best Practices:**
```javascript
// Maximum document size: 16MB
// For larger data, use GridFS or separate collections

// Embedding vs Referencing
// Embed for frequently accessed related data
{
    _id: ObjectId("..."),
    title: "Blog Post",
    content: "Post content...",
    author: {
        name: "John Doe",
        email: "john@example.com"
    },
    comments: [
        {
            text: "Great post!",
            author: "Jane Smith",
            createdAt: new Date()
        }
    ]
}

// Reference for large or frequently changing data
{
    _id: ObjectId("..."),
    title: "Blog Post",
    content: "Post content...",
    authorId: ObjectId("..."),  // Reference to users collection
    commentIds: [ObjectId("...")] // References to comments collection
}
```

### **Collections:**
Documents are stored in collections, which are analogous to tables in relational databases.

### **Databases:**
Collections are organized within databases. A MongoDB server can host multiple databases.

### **Key Concepts:**
- **Field:** A key-value pair in a document
- **Document:** A set of key-value pairs (equivalent to a row in SQL)
- **Collection:** A group of documents (equivalent to a table in SQL)
- **Database:** A container for collections

## **4. Installation and Setup**

### **Installing MongoDB:**

#### **Windows:**
```bash
# Using Chocolatey
choco install mongodb

# Or download from mongodb.com
```

#### **macOS:**
```bash
# Using Homebrew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### **Linux (Ubuntu):**
```bash
# Import MongoDB public GPG Key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### **MongoDB Atlas (Cloud):**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string

## **5. Connecting to MongoDB**

### **Using MongoDB Driver:**

```javascript
const { MongoClient } = require('mongodb');

async function connectToMongoDB() {
    const uri = "mongodb://localhost:27017";
    // For Atlas: "mongodb+srv://username:password@cluster.mongodb.net/database"

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Access database
        const database = client.db('mydatabase');

        // Access collection
        const collection = database.collection('mycollection');

        return { client, database, collection };
    } catch (error) {
        console.error("Connection failed:", error);
        throw error;
    }
}

module.exports = connectToMongoDB;
```

### **Connection Options:**

```javascript
const client = new MongoClient(uri, {
    // Connection pool settings
    maxPoolSize: 10,
    minPoolSize: 5,

    // Timeout settings
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,

    // Authentication
    auth: {
        username: 'username',
        password: 'password'
    },

    // SSL/TLS
    ssl: true,
    sslValidate: true,

    // Retry settings
    retryWrites: true,
    retryReads: true
});
```

## **6. CRUD Operations**

### **Create Operations:**

```javascript
// Insert one document
async function insertOne(collection, document) {
    try {
        const result = await collection.insertOne(document);
        console.log(`Document inserted with _id: ${result.insertedId}`);
        return result;
    } catch (error) {
        console.error("Insert failed:", error);
        throw error;
    }
}

// Insert multiple documents
async function insertMany(collection, documents) {
    try {
        const result = await collection.insertMany(documents);
        console.log(`${result.insertedCount} documents inserted`);
        return result;
    } catch (error) {
        console.error("Insert many failed:", error);
        throw error;
    }
}

// Usage
const user = {
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    createdAt: new Date()
};

await insertOne(collection, user);
```

### **Read Operations:**

```javascript
// Find one document
async function findOne(collection, query) {
    try {
        const result = await collection.findOne(query);
        return result;
    } catch (error) {
        console.error("Find one failed:", error);
        throw error;
    }
}

// Find multiple documents
async function findMany(collection, query = {}, options = {}) {
    try {
        const cursor = collection.find(query, options);
        const results = await cursor.toArray();
        return results;
    } catch (error) {
        console.error("Find many failed:", error);
        throw error;
    }
}

// Usage
// Find by ID
const user = await findOne(collection, { _id: ObjectId("507f1f77bcf86cd799439011") });

// Find with conditions
const activeUsers = await findMany(collection, { status: "active" });

// Find with projection (select specific fields)
const users = await findMany(
    collection,
    { age: { $gte: 18 } },
    { projection: { name: 1, email: 1, _id: 0 } }
);

// Find with sorting and limiting
const recentUsers = await findMany(
    collection,
    {},
    {
        sort: { createdAt: -1 },
        limit: 10
    }
);
```

### **Update Operations:**

```javascript
// Update one document
async function updateOne(collection, filter, update) {
    try {
        const result = await collection.updateOne(filter, update);
        console.log(`${result.modifiedCount} document updated`);
        return result;
    } catch (error) {
        console.error("Update failed:", error);
        throw error;
    }
}

// Update many documents
async function updateMany(collection, filter, update) {
    try {
        const result = await collection.updateMany(filter, update);
        console.log(`${result.modifiedCount} documents updated`);
        return result;
    } catch (error) {
        console.error("Update many failed:", error);
        throw error;
    }
}

// Replace one document
async function replaceOne(collection, filter, replacement) {
    try {
        const result = await collection.replaceOne(filter, replacement);
        console.log(`${result.modifiedCount} document replaced`);
        return result;
    } catch (error) {
        console.error("Replace failed:", error);
        throw error;
    }
}

// Usage
// Update specific fields
await updateOne(
    collection,
    { email: "john@example.com" },
    { $set: { name: "John Smith", updatedAt: new Date() } }
);

// Increment a field
await updateOne(
    collection,
    { _id: ObjectId("507f1f77bcf86cd799439011") },
    { $inc: { loginCount: 1 } }
);

// Add to array
await updateOne(
    collection,
    { _id: ObjectId("507f1f77bcf86cd799439011") },
    { $push: { hobbies: "photography" } }
);
```

### **Delete Operations:**

```javascript
// Delete one document
async function deleteOne(collection, filter) {
    try {
        const result = await collection.deleteOne(filter);
        console.log(`${result.deletedCount} document deleted`);
        return result;
    } catch (error) {
        console.error("Delete failed:", error);
        throw error;
    }
}

// Delete many documents
async function deleteMany(collection, filter) {
    try {
        const result = await collection.deleteMany(filter);
        console.log(`${result.deletedCount} documents deleted`);
        return result;
    } catch (error) {
        console.error("Delete many failed:", error);
        throw error;
    }
}

// Usage
// Delete by ID
await deleteOne(collection, { _id: ObjectId("507f1f77bcf86cd799439011") });

// Delete with conditions
await deleteMany(collection, { status: "inactive" });
```

## **7. Query Operators**

### **Comparison Operators:**

```javascript
// Equality
{ age: 25 }

// Comparison
{ age: { $gt: 18 } }      // Greater than
{ age: { $gte: 18 } }     // Greater than or equal
{ age: { $lt: 65 } }      // Less than
{ age: { $lte: 65 } }     // Less than or equal
{ age: { $ne: 30 } }      // Not equal
{ age: { $in: [20, 25, 30] } }  // In array
{ age: { $nin: [15, 20] } }     // Not in array
```

### **Logical Operators:**

```javascript
// AND (implicit)
{ age: { $gte: 18 }, status: "active" }

// OR
{ $or: [
    { age: { $lt: 18 } },
    { age: { $gt: 65 } }
] }

// AND with OR
{ $and: [
    { age: { $gte: 18 } },
    { $or: [
        { status: "active" },
        { status: "pending" }
    ]}
] }

// NOR
{ $nor: [
    { age: { $lt: 18 } },
    { status: "inactive" }
] }
```

### **Element Operators:**

```javascript
// Check if field exists
{ email: { $exists: true } }

// Check field type
{ age: { $type: "number" } }

// Check if field is null or missing
{ email: { $in: [null], $exists: true } }
```

### **Array Operators:**

```javascript
// Match array elements
{ hobbies: "reading" }

// Match all elements in array
{ hobbies: { $all: ["reading", "coding"] } }

// Match array size
{ hobbies: { $size: 3 } }

// Match elements in array
{ hobbies: { $in: ["reading", "gaming"] } }

// Match elements not in array
{ hobbies: { $nin: ["smoking"] } }
```

## **8. Indexing**

### **Creating Indexes:**

```javascript
// Single field index
await collection.createIndex({ email: 1 });

// Compound index
await collection.createIndex({ name: 1, age: -1 });

// Unique index
await collection.createIndex({ email: 1 }, { unique: true });

// Text index for text search
await collection.createIndex({ description: "text" });

// Geospatial index
await collection.createIndex({ location: "2dsphere" });
```

### **Index Management:**

```javascript
// List indexes
const indexes = await collection.listIndexes().toArray();

// Drop index
await collection.dropIndex("email_1");

// Drop all indexes
await collection.dropIndexes();
```

## **9. Aggregation Framework**

### **Basic Aggregation:**

```javascript
// Count documents
const count = await collection.countDocuments({ status: "active" });

// Group and count
const result = await collection.aggregate([
    { $match: { status: "active" } },
    { $group: {
        _id: "$department",
        count: { $sum: 1 },
        avgAge: { $avg: "$age" }
    }},
    { $sort: { count: -1 } }
]).toArray();

// Lookup (join)
const usersWithPosts = await collection.aggregate([
    {
        $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "authorId",
            as: "posts"
        }
    },
    {
        $project: {
            name: 1,
            email: 1,
            postCount: { $size: "$posts" }
        }
    }
]).toArray();
```

## **10. Code Examples**

### **Example 1: User Management System**

```javascript
const { MongoClient, ObjectId } = require('mongodb');

class UserManager {
    constructor(uri, dbName) {
        this.uri = uri;
        this.dbName = dbName;
        this.client = null;
        this.db = null;
    }

    async connect() {
        try {
            this.client = new MongoClient(this.uri);
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Connection failed:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
            console.log('Disconnected from MongoDB');
        }
    }

    // Create user
    async createUser(userData) {
        try {
            const users = this.db.collection('users');
            const result = await users.insertOne({
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return result.insertedId;
        } catch (error) {
            console.error('Create user failed:', error);
            throw error;
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            const users = this.db.collection('users');
            const user = await users.findOne({ _id: new ObjectId(userId) });
            return user;
        } catch (error) {
            console.error('Get user failed:', error);
            throw error;
        }
    }

    // Update user
    async updateUser(userId, updateData) {
        try {
            const users = this.db.collection('users');
            const result = await users.updateOne(
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        ...updateData,
                        updatedAt: new Date()
                    }
                }
            );
            return result.modifiedCount;
        } catch (error) {
            console.error('Update user failed:', error);
            throw error;
        }
    }

    // Delete user
    async deleteUser(userId) {
        try {
            const users = this.db.collection('users');
            const result = await users.deleteOne({ _id: new ObjectId(userId) });
            return result.deletedCount;
        } catch (error) {
            console.error('Delete user failed:', error);
            throw error;
        }
    }

    // Get all users with pagination
    async getUsers(page = 1, limit = 10) {
        try {
            const users = this.db.collection('users');
            const skip = (page - 1) * limit;

            const total = await users.countDocuments();
            const data = await users
                .find({})
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .toArray();

            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Get users failed:', error);
            throw error;
        }
    }

    // Search users
    async searchUsers(query, page = 1, limit = 10) {
        try {
            const users = this.db.collection('users');
            const skip = (page - 1) * limit;

            const searchQuery = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            };

            const total = await users.countDocuments(searchQuery);
            const data = await users
                .find(searchQuery)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .toArray();

            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Search users failed:', error);
            throw error;
        }
    }
}

// Usage
async function main() {
    const userManager = new UserManager('mongodb://localhost:27017', 'userdb');

    try {
        await userManager.connect();

        // Create a user
        const userId = await userManager.createUser({
            name: 'John Doe',
            email: 'john@example.com',
            age: 30
        });
        console.log('Created user with ID:', userId);

        // Get user
        const user = await userManager.getUserById(userId);
        console.log('Retrieved user:', user);

        // Update user
        await userManager.updateUser(userId, { age: 31 });

        // Get all users
        const users = await userManager.getUsers(1, 5);
        console.log('Users:', users);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await userManager.disconnect();
    }
}

main();
```

### **Example 2: Blog System with Comments**

```javascript
const { MongoClient, ObjectId } = require('mongodb');

class BlogManager {
    constructor(uri, dbName) {
        this.uri = uri;
        this.dbName = dbName;
        this.client = null;
        this.db = null;
    }

    async connect() {
        this.client = new MongoClient(this.uri);
        await this.client.connect();
        this.db = this.client.db(this.dbName);
    }

    async disconnect() {
        if (this.client) {
            await this.client.close();
        }
    }

    // Create post
    async createPost(postData) {
        const posts = this.db.collection('posts');
        const result = await posts.insertOne({
            ...postData,
            createdAt: new Date(),
            updatedAt: new Date(),
            comments: []
        });
        return result.insertedId;
    }

    // Get post with comments
    async getPostWithComments(postId) {
        const posts = this.db.collection('posts');
        const post = await posts.aggregate([
            { $match: { _id: new ObjectId(postId) } },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'postId',
                    as: 'comments'
                }
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    author: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    comments: {
                        $sortArray: { input: '$comments', sortBy: { createdAt: -1 } }
                    }
                }
            }
        ]).toArray();

        return post[0];
    }

    // Add comment
    async addComment(postId, commentData) {
        const comments = this.db.collection('comments');
        const result = await comments.insertOne({
            postId: new ObjectId(postId),
            ...commentData,
            createdAt: new Date()
        });

        // Update post's comment count
        const posts = this.db.collection('posts');
        await posts.updateOne(
            { _id: new ObjectId(postId) },
            { $inc: { commentCount: 1 } }
        );

        return result.insertedId;
    }

    // Get posts with pagination
    async getPosts(page = 1, limit = 10) {
        const posts = this.db.collection('posts');
        const skip = (page - 1) * limit;

        const total = await posts.countDocuments();
        const data = await posts
            .find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    // Search posts
    async searchPosts(query) {
        const posts = this.db.collection('posts');
        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        };

        return await posts.find(searchQuery).sort({ createdAt: -1 }).toArray();
    }
}

// Usage
async function main() {
    const blogManager = new BlogManager('mongodb://localhost:27017', 'blogdb');

    try {
        await blogManager.connect();

        // Create a post
        const postId = await blogManager.createPost({
            title: 'My First Blog Post',
            content: 'This is the content of my first blog post.',
            author: 'John Doe'
        });

        // Add a comment
        await blogManager.addComment(postId, {
            author: 'Jane Smith',
            content: 'Great post!'
        });

        // Get post with comments
        const post = await blogManager.getPostWithComments(postId);
        console.log('Post with comments:', JSON.stringify(post, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await blogManager.disconnect();
    }
}

main();
```

## **11. Assignments and Projects**

### **Assignment 7.1: MongoDB Basics**
Create MongoDB operations that demonstrate:
- Connecting to MongoDB
- Creating databases and collections
- Inserting documents
- Querying with various conditions
- Updating documents
- Deleting documents

### **Assignment 7.2: Data Modeling**
Design MongoDB schemas for:
- E-commerce application (products, orders, users)
- Social media platform (users, posts, comments)
- Blog system (posts, categories, tags)
- Task management app (users, projects, tasks)

### **Project 7: Inventory Management System**
Build a complete inventory system with:
- Product catalog management
- Stock tracking
- Supplier management
- Purchase orders
- Sales tracking
- Reporting features

### **Challenge Project: Social Media Analytics**
Create a social media analytics system that:
- Stores user posts and interactions
- Tracks engagement metrics
- Generates analytics reports
- Supports real-time updates
- Implements data aggregation pipelines

## **12. Best Practices**

### **Schema Design:**
- Embed related data when read frequently together
- Use references for large or frequently changing data
- Consider data access patterns
- Use appropriate data types
- Plan for growth and scaling

### **Indexing Strategy:**
- Index fields used in queries
- Use compound indexes for multiple fields
- Consider index selectivity
- Monitor index performance
- Remove unused indexes

### **Performance Optimization:**
- Use appropriate read preferences
- Implement connection pooling
- Optimize queries and aggregations
- Use sharding for large datasets
- Monitor database performance

### **Security:**
- Enable authentication and authorization
- Use SSL/TLS encryption
- Implement field-level encryption
- Regular security audits
- Backup and recovery planning

## **13. MongoDB Tools**

### **MongoDB Shell:**
```bash
# Connect to MongoDB
mongo

# Show databases
show dbs

# Use database
use mydatabase

# Show collections
show collections

# Query documents
db.users.find()
db.users.find({ age: { $gte: 18 } })

# Insert document
db.users.insertOne({ name: "John", age: 30 })
```

### **MongoDB Compass:**
- GUI for MongoDB
- Visual query builder
- Schema analysis
- Performance monitoring
- Data import/export

### **Backup and Restore:**
```bash
# Create backup
mongodump --db mydatabase --out /path/to/backup

# Restore from backup
mongorestore --db mydatabase /path/to/backup/mydatabase
```

## **14. Resources**

- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)

## **15. Next Steps**

In the next lesson, we'll explore Mongoose, an ODM (Object Data Modeling) library for MongoDB and Node.js. You'll learn about:
- Schema definition
- Model creation
- Validation and middleware
- Population and relationships

Practice working with MongoDB and experiment with different query patterns to strengthen your database skills!

---

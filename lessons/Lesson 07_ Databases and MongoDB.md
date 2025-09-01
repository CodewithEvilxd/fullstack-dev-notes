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

## **14. Advanced MongoDB Patterns and Architecture**

### **Advanced Query Patterns and Optimization**

#### **Complex Aggregation Pipelines**
```javascript
// Advanced aggregation with multiple stages
async function getUserAnalytics(collection) {
    const analytics = await collection.aggregate([
        // Stage 1: Filter active users
        {
            $match: {
                status: 'active',
                createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } // Last year
            }
        },

        // Stage 2: Add computed fields
        {
            $addFields: {
                accountAge: {
                    $divide: [
                        { $subtract: [new Date(), '$createdAt'] },
                        1000 * 60 * 60 * 24 // Convert to days
                    ]
                },
                engagementScore: {
                    $add: [
                        { $multiply: ['$postCount', 2] },
                        { $multiply: ['$commentCount', 1] },
                        { $multiply: ['$likeCount', 0.5] }
                    ]
                }
            }
        },

        // Stage 3: Group by age ranges
        {
            $group: {
                _id: {
                    $switch: {
                        branches: [
                            { case: { $lt: ['$accountAge', 30] }, then: '0-30 days' },
                            { case: { $lt: ['$accountAge', 90] }, then: '30-90 days' },
                            { case: { $lt: ['$accountAge', 365] }, then: '90-365 days' }
                        ],
                        default: '365+ days'
                    }
                },
                users: { $push: '$$ROOT' },
                count: { $sum: 1 },
                avgEngagement: { $avg: '$engagementScore' },
                totalPosts: { $sum: '$postCount' },
                totalComments: { $sum: '$commentCount' }
            }
        },

        // Stage 4: Sort and format
        {
            $sort: { count: -1 }
        },

        // Stage 5: Reshape output
        {
            $project: {
                _id: 0,
                ageGroup: '$_id',
                userCount: '$count',
                averageEngagement: { $round: ['$avgEngagement', 2] },
                totalActivity: { $add: ['$totalPosts', '$totalComments'] },
                topUsers: { $slice: ['$users', 3] }
            }
        }
    ]).toArray();

    return analytics;
}

// Real-time analytics with change streams
async function watchUserActivity(collection) {
    const changeStream = collection.watch([
        {
            $match: {
                'operationType': { $in: ['insert', 'update', 'delete'] }
            }
        }
    ]);

    changeStream.on('change', (change) => {
        console.log('User activity detected:', change.operationType);

        switch (change.operationType) {
            case 'insert':
                console.log('New user created:', change.fullDocument.name);
                break;
            case 'update':
                const updatedFields = change.updateDescription.updatedFields;
                if (updatedFields.lastLogin) {
                    console.log('User logged in:', change.documentKey._id);
                }
                break;
            case 'delete':
                console.log('User deleted:', change.documentKey._id);
                break;
        }
    });

    return changeStream;
}

// Geospatial queries for location-based features
async function findNearbyUsers(collection, longitude, latitude, maxDistance = 10000) {
    const users = await collection.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: maxDistance
            }
        },
        status: 'active'
    }).limit(20).toArray();

    return users;
}

// Text search with scoring and highlighting
async function searchContent(collection, query, options = {}) {
    const {
        limit = 10,
        skip = 0,
        sort = 'score',
        highlight = true
    } = options;

    const pipeline = [
        {
            $search: {
                text: {
                    query: query,
                    path: ['title', 'content', 'tags'],
                    fuzzy: { maxEdits: 1 }
                }
            }
        },
        {
            $addFields: {
                score: { $meta: 'searchScore' }
            }
        },
        {
            $sort: { score: -1 }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ];

    if (highlight) {
        pipeline.splice(1, 0, {
            $addFields: {
                highlights: { $meta: 'searchHighlights' }
            }
        });
    }

    const results = await collection.aggregate(pipeline).toArray();
    return results;
}
```

#### **Advanced Indexing Strategies**
```javascript
// Compound indexes for complex queries
async function createOptimizedIndexes(collection) {
    // Compound index for user posts sorted by date
    await collection.createIndex(
        { userId: 1, createdAt: -1 },
        { name: 'user_posts_date' }
    );

    // Partial index for active users only
    await collection.createIndex(
        { email: 1 },
        {
            name: 'active_users_email',
            partialFilterExpression: { status: 'active' }
        }
    );

    // Text index with weights
    await collection.createIndex(
        { title: 'text', content: 'text', tags: 'text' },
        {
            name: 'content_search',
            weights: { title: 10, content: 5, tags: 3 }
        }
    );

    // Geospatial index for location queries
    await collection.createIndex(
        { location: '2dsphere' },
        { name: 'location_2dsphere' }
    );

    // TTL index for automatic document expiration
    await collection.createIndex(
        { createdAt: 1 },
        {
            name: 'session_ttl',
            expireAfterSeconds: 24 * 60 * 60 // 24 hours
        }
    );

    // Unique compound index
    await collection.createIndex(
        { email: 1, organizationId: 1 },
        {
            name: 'unique_email_org',
            unique: true
        }
    );

    // Sparse index for optional fields
    await collection.createIndex(
        { phoneNumber: 1 },
        {
            name: 'phone_sparse',
            sparse: true
        }
    );
}

// Index performance monitoring
async function analyzeIndexUsage(collection) {
    const indexStats = await collection.aggregate([
        { $indexStats: {} }
    ]).toArray();

    const analysis = indexStats.map(stat => ({
        name: stat.name,
        usageCount: stat.accesses?.ops || 0,
        since: stat.accesses?.since || null,
        size: stat.size || 0
    }));

    return analysis;
}

// Query plan analysis
async function analyzeQueryPerformance(collection, query) {
    const explain = await collection.find(query).explain('executionStats');

    return {
        executionTime: explain.executionStats.executionTimeMillis,
        documentsExamined: explain.executionStats.totalDocsExamined,
        documentsReturned: explain.executionStats.totalDocsReturned,
        indexesUsed: explain.executionStats.winningPlan?.inputStage?.indexName || 'No index',
        isIndexUsed: explain.executionStats.winningPlan?.inputStage?.stage === 'IXSCAN'
    };
}
```

### **Data Modeling and Schema Design Patterns**

#### **Polymorphic Collections**
```javascript
// Base schema for polymorphic collection
const eventSchema = {
    _id: ObjectId,
    type: String, // 'user_login', 'post_created', 'comment_added', etc.
    actor: {
        id: ObjectId,
        type: String, // 'user', 'system', 'admin'
        name: String
    },
    target: {
        id: ObjectId,
        type: String, // 'user', 'post', 'comment'
        title: String // Optional, for display
    },
    metadata: Object, // Type-specific data
    timestamp: Date,
    ip: String,
    userAgent: String
};

// Event creation helpers
function createUserLoginEvent(user, ip, userAgent) {
    return {
        type: 'user_login',
        actor: {
            id: user._id,
            type: 'user',
            name: user.name
        },
        metadata: {
            loginMethod: 'email',
            deviceType: getDeviceType(userAgent)
        },
        timestamp: new Date(),
        ip,
        userAgent
    };
}

function createPostCreatedEvent(user, post) {
    return {
        type: 'post_created',
        actor: {
            id: user._id,
            type: 'user',
            name: user.name
        },
        target: {
            id: post._id,
            type: 'post',
            title: post.title
        },
        metadata: {
            wordCount: post.content.split(' ').length,
            tags: post.tags
        },
        timestamp: new Date()
    };
}

// Query polymorphic data
async function getUserActivity(collection, userId, limit = 20) {
    const activities = await collection.find({
        'actor.id': new ObjectId(userId)
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();

    return activities;
}

async function getRecentActivities(collection, types = [], limit = 50) {
    const query = types.length > 0 ? { type: { $in: types } } : {};

    const activities = await collection.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();

    return activities;
}
```

#### **Time Series Collections**
```javascript
// Create time series collection
async function createTimeSeriesCollection(db) {
    await db.createCollection('sensor_readings', {
        timeseries: {
            timeField: 'timestamp',
            metaField: 'sensorId',
            granularity: 'minutes' // 'seconds', 'minutes', 'hours'
        }
    });

    // Create indexes for efficient queries
    await db.collection('sensor_readings').createIndex({
        'sensorId': 1,
        'timestamp': 1
    });
}

// Insert time series data
async function insertSensorReading(collection, sensorId, value, metadata = {}) {
    const reading = {
        sensorId,
        timestamp: new Date(),
        value,
        ...metadata
    };

    await collection.insertOne(reading);
    return reading;
}

// Query time series data with aggregation
async function getSensorStats(collection, sensorId, startDate, endDate) {
    const stats = await collection.aggregate([
        {
            $match: {
                sensorId,
                timestamp: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    sensorId: '$sensorId',
                    hour: {
                        $dateToString: {
                            format: '%Y-%m-%d %H:00:00',
                            date: '$timestamp'
                        }
                    }
                },
                readings: { $push: '$value' },
                count: { $sum: 1 },
                avgValue: { $avg: '$value' },
                minValue: { $min: '$value' },
                maxValue: { $max: '$value' }
            }
        },
        {
            $sort: { '_id.hour': 1 }
        }
    ]).toArray();

    return stats;
}

// Downsampling for long-term storage
async function downsampleSensorData(collection, sensorId, interval = '1h') {
    const pipeline = [
        {
            $match: {
                sensorId,
                timestamp: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
            }
        },
        {
            $group: {
                _id: {
                    sensorId: '$sensorId',
                    interval: {
                        $dateTrunc: {
                            date: '$timestamp',
                            unit: interval,
                            binSize: 1
                        }
                    }
                },
                avgValue: { $avg: '$value' },
                minValue: { $min: '$value' },
                maxValue: { $max: '$value' },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                sensorId: '$_id.sensorId',
                timestamp: '$_id.interval',
                avgValue: 1,
                minValue: 1,
                maxValue: 1,
                count: 1,
                _id: 0
            }
        },
        {
            $out: 'sensor_readings_downsampled'
        }
    ];

    await collection.aggregate(pipeline).toArray();
}
```

### **Advanced Security and Encryption**

#### **Field-Level Encryption**
```javascript
const { MongoClient, ClientEncryption } = require('mongodb');

// Configure encryption
async function setupEncryption() {
    const kmsProviders = {
        local: {
            key: Buffer.from(process.env.LOCAL_MASTER_KEY, 'base64')
        }
    };

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await client.connect();

    // Create encryption client
    const encryption = new ClientEncryption(client, {
        keyVaultNamespace: 'encryption.__keyVault',
        kmsProviders
    });

    // Create data encryption keys
    const dataKey1 = await encryption.createDataKey('local');
    const dataKey2 = await encryption.createDataKey('local');

    return { client, encryption, dataKey1, dataKey2 };
}

// Encrypt sensitive fields
async function encryptUserData(encryption, dataKey, userData) {
    const encryptedSSN = await encryption.encrypt(
        userData.ssn,
        {
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
            keyId: dataKey
        }
    );

    const encryptedEmail = await encryption.encrypt(
        userData.email,
        {
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
            keyId: dataKey
        }
    );

    return {
        ...userData,
        ssn: encryptedSSN,
        email: encryptedEmail
    };
}

// Automatic encryption/decryption with MongoDB client
async function createEncryptedClient() {
    const kmsProviders = {
        local: {
            key: Buffer.from(process.env.LOCAL_MASTER_KEY, 'base64')
        }
    };

    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoEncryption: {
            keyVaultNamespace: 'encryption.__keyVault',
            kmsProviders,
            schemaMap: {
                'medical.patients': {
                    bsonType: 'object',
                    properties: {
                        ssn: {
                            encrypt: {
                                algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
                                keyId: '/key1'
                            }
                        },
                        medicalHistory: {
                            encrypt: {
                                algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
                                keyId: '/key2'
                            }
                        }
                    }
                }
            }
        }
    });

    await client.connect();
    return client;
}
```

#### **Role-Based Access Control (RBAC)**
```javascript
// Define roles and permissions
const ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user',
    GUEST: 'guest'
};

const PERMISSIONS = {
    READ_USERS: 'read:users',
    WRITE_USERS: 'write:users',
    DELETE_USERS: 'delete:users',
    READ_POSTS: 'read:posts',
    WRITE_POSTS: 'write:posts',
    DELETE_POSTS: 'delete:posts',
    MODERATE_CONTENT: 'moderate:content'
};

const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        PERMISSIONS.READ_USERS,
        PERMISSIONS.WRITE_USERS,
        PERMISSIONS.DELETE_USERS,
        PERMISSIONS.READ_POSTS,
        PERMISSIONS.WRITE_POSTS,
        PERMISSIONS.DELETE_POSTS,
        PERMISSIONS.MODERATE_CONTENT
    ],
    [ROLES.MODERATOR]: [
        PERMISSIONS.READ_USERS,
        PERMISSIONS.READ_POSTS,
        PERMISSIONS.WRITE_POSTS,
        PERMISSIONS.DELETE_POSTS,
        PERMISSIONS.MODERATE_CONTENT
    ],
    [ROLES.USER]: [
        PERMISSIONS.READ_USERS,
        PERMISSIONS.READ_POSTS,
        PERMISSIONS.WRITE_POSTS
    ],
    [ROLES.GUEST]: [
        PERMISSIONS.READ_POSTS
    ]
};

// Permission checking utility
class PermissionChecker {
    constructor(userRole) {
        this.userRole = userRole;
        this.userPermissions = ROLE_PERMISSIONS[userRole] || [];
    }

    hasPermission(permission) {
        return this.userPermissions.includes(permission);
    }

    hasAnyPermission(permissions) {
        return permissions.some(permission => this.hasPermission(permission));
    }

    hasAllPermissions(permissions) {
        return permissions.every(permission => this.hasPermission(permission));
    }

    canRead(resource) {
        return this.hasPermission(`read:${resource}`);
    }

    canWrite(resource) {
        return this.hasPermission(`write:${resource}`);
    }

    canDelete(resource) {
        return this.hasPermission(`delete:${resource}`);
    }
}

// MongoDB query filtering based on permissions
function createPermissionFilter(userRole, resource) {
    const checker = new PermissionChecker(userRole);

    if (!checker.canRead(resource)) {
        // Return a filter that matches nothing
        return { _id: null };
    }

    // Add role-based filters
    const baseFilter = {};

    if (userRole === ROLES.USER) {
        // Users can only see their own data or public data
        baseFilter.$or = [
            { ownerId: userId },
            { visibility: 'public' }
        ];
    }

    return baseFilter;
}

// Middleware for permission checking
function requirePermission(permission) {
    return (req, res, next) => {
        const userRole = req.user?.role;
        const checker = new PermissionChecker(userRole);

        if (!checker.hasPermission(permission)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: permission,
                userRole: userRole
            });
        }

        next();
    };
}

// Usage in routes
app.get('/api/users',
    authenticateToken,
    requirePermission(PERMISSIONS.READ_USERS),
    async (req, res) => {
        const filter = createPermissionFilter(req.user.role, 'users');
        const users = await User.find(filter);
        res.json(users);
    }
);

app.post('/api/posts',
    authenticateToken,
    requirePermission(PERMISSIONS.WRITE_POSTS),
    async (req, res) => {
        const post = new Post({
            ...req.body,
            authorId: req.user.id
        });
        await post.save();
        res.status(201).json(post);
    }
);
```

### **Performance Monitoring and Optimization**

#### **Database Performance Monitoring**
```javascript
// Connection pool monitoring
function monitorConnectionPool(client) {
    setInterval(() => {
        const poolStats = {
            totalConnections: client.topology.s?.pool?.totalConnectionCount || 0,
            availableConnections: client.topology.s?.pool?.availableConnectionCount || 0,
            pendingConnections: client.topology.s?.pool?.pendingConnectionCount || 0,
            borrowedConnections: client.topology.s?.pool?.borrowedConnectionCount || 0
        };

        console.log('Connection Pool Stats:', poolStats);

        // Alert if pool is heavily utilized
        if (poolStats.availableConnections < 2) {
            console.warn('Low available connections in pool!');
        }
    }, 30000); // Check every 30 seconds
}

// Query performance monitoring
async function monitorQueryPerformance(collection, operation, ...args) {
    const startTime = Date.now();

    try {
        const result = await collection[operation](...args);
        const duration = Date.now() - startTime;

        // Log slow queries
        if (duration > 1000) { // More than 1 second
            console.warn(`Slow query detected: ${operation} took ${duration}ms`);
        }

        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`Query error in ${operation}: ${error.message} (${duration}ms)`);
        throw error;
    }
}

// Database profiling
async function enableProfiling(db, level = 2, slowMs = 100) {
    // level: 0=off, 1=slow queries only, 2=all queries
    await db.setProfilingLevel(level, { slowms: slowMs });

    console.log(`Database profiling enabled (level: ${level}, slowMs: ${slowMs})`);
}

// Get profiling data
async function getProfilingData(db, limit = 10) {
    const profilingData = await db.collection('system.profile')
        .find({})
        .sort({ ts: -1 })
        .limit(limit)
        .toArray();

    return profilingData.map(doc => ({
        operation: doc.op,
        collection: doc.ns,
        duration: doc.millis,
        timestamp: doc.ts,
        query: doc.query,
        planSummary: doc.planSummary
    }));
}

// Index usage analysis
async function analyzeIndexUsage(db) {
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
        const coll = db.collection(collection.name);
        const indexes = await coll.listIndexes().toArray();

        for (const index of indexes) {
            const stats = await coll.aggregate([
                { $indexStats: { name: index.name } }
            ]).toArray();

            if (stats.length > 0) {
                const usage = stats[0];
                console.log(`Index ${index.name} in ${collection.name}:`);
                console.log(`  - Accesses: ${usage.accesses?.ops || 0}`);
                console.log(`  - Size: ${usage.size || 0} bytes`);
            }
        }
    }
}

// Memory usage monitoring
function monitorMemoryUsage() {
    setInterval(() => {
        const memUsage = process.memoryUsage();

        console.log('Memory Usage:');
        console.log(`  RSS: ${Math.round(memUsage.rss / 1024 / 1024)} MB`);
        console.log(`  Heap Used: ${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`);
        console.log(`  Heap Total: ${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`);
        console.log(`  External: ${Math.round(memUsage.external / 1024 / 1024)} MB`);

        // Alert if heap usage is high
        const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
        if (heapUsagePercent > 80) {
            console.warn(`High heap usage: ${heapUsagePercent.toFixed(1)}%`);
        }
    }, 60000); // Check every minute
}

// Database health check
async function performHealthCheck(db) {
    const health = {
        timestamp: new Date(),
        status: 'unknown',
        checks: {}
    };

    try {
        // Check database connectivity
        const pingResult = await db.admin().ping();
        health.checks.connectivity = {
            status: 'pass',
            responseTime: pingResult.ok ? 'OK' : 'Failed'
        };

        // Check replica set status (if applicable)
        try {
            const replStatus = await db.admin().replSetGetStatus();
            health.checks.replication = {
                status: 'pass',
                members: replStatus.members.length,
                primary: replStatus.members.find(m => m.state === 1)?.name
            };
        } catch (error) {
            health.checks.replication = {
                status: 'not_applicable',
                message: 'Not a replica set'
            };
        }

        // Check collection counts
        const collections = await db.listCollections().toArray();
        health.checks.collections = {
            status: 'pass',
            count: collections.length
        };

        health.status = 'healthy';

    } catch (error) {
        health.status = 'unhealthy';
        health.error = error.message;
    }

    return health;
}
```

## **14. Resources**

- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [MongoDB Security Best Practices](https://docs.mongodb.com/manual/security/)
- [MongoDB Performance Best Practices](https://docs.mongodb.com/manual/performance/)

## **15. Next Steps**

In the next lesson, we'll explore Mongoose, an ODM (Object Data Modeling) library for MongoDB and Node.js. You'll learn about:
- Schema definition
- Model creation
- Validation and middleware
- Population and relationships

Practice working with MongoDB and experiment with different query patterns to strengthen your database skills!

---

This comprehensive MongoDB documentation covers everything from basic CRUD operations to advanced patterns like aggregation pipelines, geospatial queries, time series collections, field-level encryption, RBAC, and performance monitoring. The examples are production-ready and follow current best practices for professional MongoDB development.

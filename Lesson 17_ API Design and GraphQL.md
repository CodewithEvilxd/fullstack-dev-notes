### **Lesson 17: API Design and GraphQL**

## **1. RESTful API Design Principles**

### **What is REST?**
REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP requests to access and manipulate data.

### **REST Principles:**

#### **1. Client-Server Architecture:**
- Clear separation between client and server
- Client handles user interface, server handles data storage and business logic

#### **2. Stateless:**
- Each request contains all information needed to process it
- No session state stored on server between requests
- Improves scalability and reliability

#### **3. Cacheable:**
- Responses must be cacheable or explicitly marked as non-cacheable
- Improves performance and reduces server load

#### **4. Uniform Interface:**
- Consistent way to access resources
- Uses standard HTTP methods and status codes

#### **5. Layered System:**
- Client cannot tell if it's connected directly to server or through intermediaries
- Allows for load balancing and security layers

### **HTTP Methods and Their Uses:**

```javascript
// GET - Retrieve data
GET /api/users          // Get all users
GET /api/users/123      // Get user with ID 123
GET /api/users?page=2   // Get paginated users

// POST - Create new resource
POST /api/users         // Create new user

// PUT - Update entire resource
PUT /api/users/123      // Update user 123 completely

// PATCH - Partial update
PATCH /api/users/123    // Update specific fields of user 123

// DELETE - Remove resource
DELETE /api/users/123   // Delete user 123
```

## **2. API Resource Design**

### **Resource Naming Conventions:**

```javascript
// Good resource names
GET /api/users              // Collection of users
GET /api/users/123          // Specific user
GET /api/users/123/posts    // User's posts
GET /api/posts/456/comments // Post's comments

// Avoid these
GET /api/getUsers          // Don't use verbs in resource names
GET /api/userPosts         // Use relationships instead
GET /api/allUsers          // Unnecessary adjectives
```

### **Nested Resources:**

```javascript
// User has many posts
GET /api/users/123/posts    // Get user's posts
POST /api/users/123/posts   // Create post for user
GET /api/users/123/posts/456 // Get specific post by user

// Post has many comments
GET /api/posts/456/comments     // Get post's comments
POST /api/posts/456/comments    // Add comment to post
```

### **Query Parameters:**

```javascript
// Filtering
GET /api/users?status=active
GET /api/posts?category=tech&published=true

// Sorting
GET /api/users?sort=name:asc
GET /api/posts?sort=createdAt:desc

// Pagination
GET /api/users?page=2&limit=10

// Field selection
GET /api/users?fields=name,email,createdAt

// Search
GET /api/users?search=john
GET /api/posts?q=javascript
```

## **3. API Response Formats**

### **JSON Response Structure:**

```javascript
// Successful response
{
    "success": true,
    "data": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "message": "User retrieved successfully"
}

// List response with pagination
{
    "success": true,
    "data": [
        { "id": 1, "name": "User 1" },
        { "id": 2, "name": "User 2" }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 25,
        "pages": 3
    }
}

// Error response
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": {
            "email": "Email is required",
            "password": "Password must be at least 8 characters"
        }
    }
}
```

### **HTTP Status Codes:**

```javascript
// 2xx Success
200 // OK - Request successful
201 // Created - Resource created
204 // No Content - Request successful, no content returned

// 3xx Redirection
301 // Moved Permanently - Resource moved
302 // Found - Temporary redirect
304 // Not Modified - Resource not changed

// 4xx Client Error
400 // Bad Request - Invalid request
401 // Unauthorized - Authentication required
403 // Forbidden - Access denied
404 // Not Found - Resource doesn't exist
422 // Unprocessable Entity - Validation failed

// 5xx Server Error
500 // Internal Server Error - Server error
502 // Bad Gateway - Invalid response from upstream
503 // Service Unavailable - Server temporarily down
```

## **4. API Versioning**

### **Versioning Strategies:**

```javascript
// URL versioning
GET /api/v1/users
GET /api/v2/users

// Header versioning
GET /api/users
Headers: Accept: application/vnd.api.v2+json

// Query parameter versioning
GET /api/users?version=2

// Accept header versioning
GET /api/users
Headers: Accept: application/vnd.myapp.v2+json
```

### **Versioning Best Practices:**

```javascript
// Backward compatibility
// v1 remains available while v2 is developed
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Deprecation warnings
app.use('/api/v1', (req, res, next) => {
    res.set('Warning', '299 - "v1 API deprecated, use v2"');
    next();
}, v1Routes);

// Migration guides
// Provide clear documentation for API changes
```

## **5. Introduction to GraphQL**

### **What is GraphQL?**
GraphQL is a query language for APIs that allows clients to request exactly the data they need, making APIs more efficient and flexible.

### **GraphQL vs REST:**

```javascript
// REST - Multiple endpoints, over/under fetching
GET /api/users/123
GET /api/users/123/posts
GET /api/users/123/posts/456/comments

// GraphQL - Single endpoint, precise data fetching
POST /graphql
{
    user(id: 123) {
        name
        email
        posts {
            title
            content
            comments {
                text
                author {
                    name
                }
            }
        }
    }
}
```

### **GraphQL Schema:**

```javascript
const typeDefs = `
    type User {
        id: ID!
        name: String!
        email: String!
        posts: [Post!]!
        createdAt: String!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        author: User!
        comments: [Comment!]!
        createdAt: String!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
        createdAt: String!
    }

    type Query {
        users: [User!]!
        user(id: ID!): User
        posts: [Post!]!
        post(id: ID!): Post
    }

    type Mutation {
        createUser(name: String!, email: String!): User!
        createPost(title: String!, content: String!, authorId: ID!): Post!
        createComment(text: String!, postId: ID!, authorId: ID!): Comment!
    }
`;
```

### **GraphQL Resolvers:**

```javascript
const resolvers = {
    Query: {
        users: async () => await User.find(),
        user: async (_, { id }) => await User.findById(id),
        posts: async () => await Post.find().populate('author'),
        post: async (_, { id }) => await Post.findById(id).populate('author comments')
    },

    Mutation: {
        createUser: async (_, { name, email }) => {
            const user = new User({ name, email });
            await user.save();
            return user;
        },

        createPost: async (_, { title, content, authorId }) => {
            const post = new Post({ title, content, author: authorId });
            await post.save();
            return post.populate('author');
        },

        createComment: async (_, { text, postId, authorId }) => {
            const comment = new Comment({ text, post: postId, author: authorId });
            await comment.save();

            // Add comment to post
            await Post.findByIdAndUpdate(postId, {
                $push: { comments: comment._id }
            });

            return comment.populate('author post');
        }
    },

    // Field resolvers for relationships
    User: {
        posts: async (user) => await Post.find({ author: user._id })
    },

    Post: {
        author: async (post) => await User.findById(post.author),
        comments: async (post) => await Comment.find({ post: post._id }).populate('author')
    },

    Comment: {
        author: async (comment) => await User.findById(comment.author),
        post: async (comment) => await Post.findById(comment.post)
    }
};
```

## **6. API Documentation**

### **OpenAPI/Swagger Documentation:**

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation for my application'
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js'] // Path to API routes
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

### **Documenting API Endpoints:**

```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
app.get('/api/users', authenticateToken, async (req, res) => {
    // Implementation
});
```

## **7. API Security and Rate Limiting**

### **Input Validation:**

```javascript
const Joi = require('joi');

// Validation schemas
const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    age: Joi.number().integer().min(13).max(120)
});

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid input data',
                details: error.details.reduce((acc, detail) => {
                    acc[detail.path[0]] = detail.message;
                    return acc;
                }, {})
            }
        });
    }
    next();
};
```

### **Rate Limiting:**

```javascript
const rateLimit = require('express-rate-limit');

// General API rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth-specific rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 login attempts per 15 minutes
    message: {
        success: false,
        error: {
            code: 'AUTH_RATE_LIMIT_EXCEEDED',
            message: 'Too many login attempts, please try again later'
        }
    }
});

// Different limits for different endpoints
const createLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 creations per minute
    message: 'Too many creations, please slow down'
});

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/users', createLimiter);
```

## **8. Code Examples**

### **Example 1: Complete REST API with Express**

```javascript
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later'
});

app.use('/api/', apiLimiter);

// User model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    age: { type: Number, min: 13, max: 120 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Validation schemas
const userValidationSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(13).max(120)
});

const validateUser = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid input data',
                    details: error.details[0].message
                }
            });
        }
        next();
    };
};

// Routes
app.get('/api/users', async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const users = await User.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to retrieve users'
            }
        });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to retrieve user'
            }
        });
    }
});

app.post('/api/users', validateUser(userValidationSchema), async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        res.status(201).json({
            success: true,
            data: user,
            message: 'User created successfully'
        });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({
                success: false,
                error: {
                    code: 'DUPLICATE_ERROR',
                    message: 'Email already exists'
                }
            });
        }

        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to create user'
            }
        });
    }
});

app.put('/api/users/:id', validateUser(userValidationSchema), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        res.json({
            success: true,
            data: user,
            message: 'User updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to update user'
            }
        });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'User not found'
                }
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Failed to delete user'
                }
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Something went wrong'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found'
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### **Example 2: GraphQL Server with Apollo**

```javascript
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/graphql-demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});

const User = mongoose.model('User', userSchema);

// GraphQL schema
const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Query {
        users: [User!]!
        user(id: ID!): User
        usersByAge(minAge: Int!): [User!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        updateUser(id: ID!, name: String, email: String, age: Int): User
        deleteUser(id: ID!): Boolean!
    }
`;

// Resolvers
const resolvers = {
    Query: {
        users: async () => await User.find(),
        user: async (_, { id }) => await User.findById(id),
        usersByAge: async (_, { minAge }) => await User.find({ age: { $gte: minAge } })
    },
    Mutation: {
        createUser: async (_, { name, email, age }) => {
            const user = new User({ name, email, age });
            await user.save();
            return user;
        },
        updateUser: async (_, { id, name, email, age }) => {
            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (email !== undefined) updateData.email = email;
            if (age !== undefined) updateData.age = age;

            return await User.findByIdAndUpdate(id, updateData, { new: true });
        },
        deleteUser: async (_, { id }) => {
            const result = await User.findByIdAndDelete(id);
            return !!result;
        }
    }
};

// Create Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        // Add authentication context here
        return { user: req.user };
    }
});

// Apply middleware
server.applyMiddleware({ app });

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
```

### **Example 3: API Testing with Postman/Insomnia**

```javascript
// Example API endpoints for testing

// GET /api/users - Get all users
// Headers: Authorization: Bearer <token>
// Query params: page=1, limit=10, search=john

// POST /api/users - Create user
// Headers: Content-Type: application/json
// Body:
{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
}

// PUT /api/users/123 - Update user
// Headers: Content-Type: application/json, Authorization: Bearer <token>
// Body:
{
    "name": "John Smith",
    "age": 31
}

// DELETE /api/users/123 - Delete user
// Headers: Authorization: Bearer <token>

// GraphQL query example
// POST /graphql
// Headers: Content-Type: application/json
// Body:
{
    "query": `
        query GetUsers {
            users {
                id
                name
                email
                age
            }
        }
    `
}

// GraphQL mutation example
{
    "query": `
        mutation CreateUser($name: String!, $email: String!, $age: Int) {
            createUser(name: $name, email: $email, age: $age) {
                id
                name
                email
                age
            }
        }
    `,
    "variables": {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "age": 25
    }
}
```

## **9. Assignments and Projects**

### **Assignment 17.1: REST API Design**
Create a REST API for a blog system with:
- Users, posts, and comments resources
- Proper HTTP methods and status codes
- Input validation and error handling
- Pagination and filtering
- API documentation

### **Assignment 17.2: GraphQL Implementation**
Build a GraphQL API that includes:
- Schema definition with types and relationships
- Resolvers for queries and mutations
- Error handling and validation
- Authentication integration

### **Project 17: E-commerce API**
Create a comprehensive e-commerce API with:
- Product catalog with categories
- Shopping cart functionality
- User accounts and orders
- Payment processing (mock)
- Admin dashboard endpoints
- Comprehensive documentation

### **Challenge Project: Social Media API**
Build a social media platform API featuring:
- User profiles and authentication
- Posts with likes and comments
- Follow/unfollow functionality
- Real-time notifications
- Search and discovery features
- Rate limiting and security

## **10. Best Practices**

### **API Design:**
- Use consistent naming conventions
- Implement proper HTTP status codes
- Provide meaningful error messages
- Version your APIs
- Document everything thoroughly

### **Performance:**
- Implement caching strategies
- Use pagination for large datasets
- Optimize database queries
- Compress responses
- Use connection pooling

### **Security:**
- Validate all inputs
- Implement authentication and authorization
- Use HTTPS in production
- Rate limit requests
- Sanitize data to prevent injection attacks

### **Maintainability:**
- Write comprehensive tests
- Use consistent code formatting
- Document API changes
- Monitor API usage and performance
- Plan for future scalability

## **11. Resources**

- [REST API Tutorial](https://restfulapi.net/)
- [GraphQL Official Documentation](https://graphql.org/learn/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [API Design Best Practices](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)
- [Postman API Testing](https://learning.postman.com/docs/getting-started/introduction/)

## **12. Next Steps**

Now that you understand API design and GraphQL, you're ready to explore:
- **Real-time Applications:** WebSockets and Socket.io
- **Microservices:** Breaking down monolithic applications
- **Serverless:** AWS Lambda and cloud functions
- **Advanced Security:** OAuth, JWT best practices
- **API Gateways:** Managing multiple services

Practice building different types of APIs and experiment with GraphQL queries to strengthen your API development skills!
### **Lesson 6: Express.js - Web Framework for Node.js**

## **1. What is Express.js?**

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building web applications and APIs. It's the most popular Node.js framework and serves as the foundation for many other frameworks and tools.

### **Key Features:**

#### **Core Features:**
- **Minimalist:** Provides essential web application features without being opinionated
- **Middleware:** Chain of functions that process requests and responses
- **Routing:** Flexible URL routing with support for parameters and wildcards
- **Template Engines:** Support for various templating engines (EJS, Pug, Handlebars)
- **Static Files:** Built-in serving of static assets
- **Error Handling:** Comprehensive error handling mechanisms
- **Extensible:** Large ecosystem of middleware and extensions

#### **Advanced Features:**
- **Router-level middleware:** Modular route handling
- **Sub-applications:** Mountable mini-applications
- **Request/response objects:** Rich API for HTTP manipulation
- **Content negotiation:** Automatic format selection
- **Conditional requests:** ETags, Last-Modified headers
- **Compression:** Automatic response compression
- **Security headers:** Built-in security middleware
- **Rate limiting:** Request throttling capabilities

### **Why Express.js?**

- Fast development with minimal boilerplate
- Large community and ecosystem
- Flexible architecture
- Good performance
- Easy to learn and use
- Production-ready

## **2. Installation and Setup**

### **Installing Express:**

```bash
# Initialize project
npm init -y

# Install Express
npm install express

# Install development dependencies
npm install --save-dev nodemon
```

### **Basic Project Structure:**

```
my-express-app/
├── node_modules/
├── package.json
├── server.js
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
│   └── index.ejs
└── routes/
    └── index.js
```

## **3. Your First Express Application**

### **Basic Server:**

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

### **Enhanced Server with Multiple Routes:**

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Express!');
});

app.get('/about', (req, res) => {
    res.send('About page');
});

app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const newUser = req.body;
    // In a real app, you'd save to database
    res.status(201).json({ message: 'User created', user: newUser });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

## **4. Routing**

### **Basic Routing:**

```javascript
// HTTP methods
app.get('/users', (req, res) => { /* GET users */ });
app.post('/users', (req, res) => { /* CREATE user */ });
app.put('/users/:id', (req, res) => { /* UPDATE user */ });
app.delete('/users/:id', (req, res) => { /* DELETE user */ });

// Route parameters
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

// Query parameters
app.get('/search', (req, res) => {
    const query = req.query.q;
    const limit = req.query.limit || 10;
    res.send(`Search: ${query}, Limit: ${limit}`);
});
```

### **Route Handlers and Advanced Routing:**

#### **Route Handler Patterns:**
```javascript
// Single callback
app.get('/users', (req, res) => {
    res.json(users);
});

// Multiple callbacks (middleware chain)
app.get('/users',
    authenticate,
    validateRequest,
    (req, res) => {
        res.json(users);
    }
);

// Array of callbacks
const callbacks = [
    authenticate,
    validateRequest,
    (req, res) => res.json(users)
];
app.get('/users', callbacks);

// Async route handlers
app.get('/async-users', async (req, res, next) => {
    try {
        const users = await getUsersFromDatabase();
        res.json(users);
    } catch (error) {
        next(error); // Pass to error handler
    }
});

// Route with multiple response methods
app.route('/users')
    .get((req, res) => res.json(users))
    .post(createUser)
    .put(updateUser)
    .delete(deleteUser);
```

#### **Advanced Routing Patterns:**
```javascript
// Parameter constraints
app.get('/users/:id(\\d+)', (req, res) => {
    const userId = parseInt(req.params.id);
    // Only matches numeric IDs
});

// Optional parameters
app.get('/users/:id?', (req, res) => {
    if (req.params.id) {
        // Get specific user
    } else {
        // Get all users
    }
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
    const { userId, postId } = req.params;
    // Handle nested resources
});

// Regex patterns
app.get('/files/:filename(*)', (req, res) => {
    const filename = req.params.filename;
    // Matches any filename with path
});

// Query parameter handling
app.get('/search', (req, res) => {
    const {
        q: query,
        limit = 10,
        offset = 0,
        sort = 'name',
        order = 'asc'
    } = req.query;

    // Validate and sanitize query parameters
    const safeLimit = Math.min(parseInt(limit) || 10, 100);
    const safeOffset = parseInt(offset) || 0;
    const safeSort = ['name', 'date', 'price'].includes(sort) ? sort : 'name';
    const safeOrder = ['asc', 'desc'].includes(order) ? order : 'asc';

    // Perform search
    const results = performSearch(query, safeLimit, safeOffset, safeSort, safeOrder);
    res.json(results);
});

// Route-specific middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};

app.get('/admin/users', adminOnly, (req, res) => {
    // Admin-only route
});

// Conditional routing
app.use('/api/v1', (req, res, next) => {
    if (req.headers['accept-version'] === 'v1') {
        next();
    } else {
        res.status(406).json({ error: 'API version not supported' });
    }
});
```

### **Router Module:**

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// User routes
router.get('/', (req, res) => {
    res.json(users);
});

router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

router.post('/', (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).json(newUser);
});

module.exports = router;

// server.js
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
```

## **5. Middleware**

### **Built-in Middleware:**

```javascript
const express = require('express');
const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Custom middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
```

### **Custom Middleware:**

```javascript
// Logger middleware
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    // Verify token logic here
    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
};

// CORS middleware
const cors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

// Apply middleware
app.use(logger);
app.use(cors);
app.use('/api', authenticate);
app.use(errorHandler);
```

### **Third-party Middleware:**

```bash
npm install cors helmet morgan body-parser
```

```javascript
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
    origin: ['http://localhost:3000', 'https://myapp.com'],
    credentials: true
}));

// Logging
app.use(morgan('combined'));
```

## **6. Template Engines**

### **EJS Setup:**

```bash
npm install ejs
```

```javascript
// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Route with template
app.get('/', (req, res) => {
    res.render('index', {
        title: 'My App',
        users: users,
        message: 'Welcome!'
    });
});
```

### **EJS Template (views/index.ejs):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
</head>
<body>
    <h1><%= message %></h1>

    <h2>Users</h2>
    <ul>
        <% users.forEach(user => { %>
            <li><%= user.name %> - <%= user.email %></li>
        <% }); %>
    </ul>

    <% if (users.length > 0) { %>
        <p>Total users: <%= users.length %></p>
    <% } else { %>
        <p>No users found</p>
    <% } %>
</body>
</html>
```

### **Pug Template Engine:**

```bash
npm install pug
```

```javascript
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', { title: 'My App', users: users });
});
```

```pug
// views/index.pug
doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title= title
  body
    h1 Welcome to #{title}

    h2 Users
    ul
      each user in users
        li= user.name + ' - ' + user.email

    if users.length > 0
      p Total users: #{users.length}
    else
      p No users found
```

## **7. Error Handling**

### **Basic Error Handling:**

```javascript
// Synchronous errors
app.get('/error', (req, res) => {
    throw new Error('Something went wrong!');
});

// Asynchronous errors
app.get('/async-error', async (req, res) => {
    try {
        const result = await riskyOperation();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
    });
});
```

### **Custom Error Classes:**

```javascript
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

// Usage
app.get('/users/:id', (req, res, next) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return next(new NotFoundError('User not found'));
    }
    res.json(user);
});
```

## **8. File Upload**

### **Using multer:**

```bash
npm install multer
```

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Single file upload
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        originalname: req.file.originalname
    });
});

// Multiple files upload
app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
    res.json({
        message: `${req.files.length} files uploaded`,
        files: req.files
    });
});

// Mixed upload
const cpUpload = upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 8 }
]);
app.post('/upload-mixed', cpUpload, (req, res) => {
    res.json({
        avatar: req.files.avatar,
        gallery: req.files.gallery
    });
});
```

## **9. Sessions and Cookies**

### **Using express-session:**

```bash
npm install express-session
```

```javascript
const session = require('express-session');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Use true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Using sessions
app.get('/login', (req, res) => {
    req.session.userId = 'user123';
    req.session.username = 'john_doe';
    res.send('Logged in');
});

app.get('/profile', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Please login first');
    }
    res.json({
        userId: req.session.userId,
        username: req.session.username
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Could not log out');
        }
        res.send('Logged out');
    });
});
```

### **Cookies:**

```javascript
// Set cookie
app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'john_doe', {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false // Use true in production
    });
    res.send('Cookie set');
});

// Read cookie
app.get('/get-cookie', (req, res) => {
    const username = req.cookies.username;
    if (!username) {
        return res.status(400).send('No cookie found');
    }
    res.send(`Hello ${username}`);
});

// Clear cookie
app.get('/clear-cookie', (req, res) => {
    res.clearCookie('username');
    res.send('Cookie cleared');
});
```

## **10. Code Examples**

### **Example 1: Complete REST API**

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory data store
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Routes
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;

    res.json(user);
});

app.delete('/api/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.status(204).send();
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

### **Example 2: Blog Application with Templates**

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Set up EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Sample blog posts
let posts = [
    {
        id: 1,
        title: 'First Post',
        content: 'This is my first blog post!',
        author: 'John Doe',
        date: new Date()
    }
];

// Routes
app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/posts/new', (req, res) => {
    res.render('new-post');
});

app.post('/posts', (req, res) => {
    const { title, content, author } = req.body;
    const newPost = {
        id: posts.length + 1,
        title,
        content,
        author,
        date: new Date()
    };
    posts.push(newPost);
    res.redirect('/');
});

app.get('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).render('error', { message: 'Post not found' });
    }
    res.render('post', { post });
});

app.listen(PORT, () => {
    console.log(`Blog server running on http://localhost:${PORT}`);
});
```

### **Example 3: Authentication System**

```javascript
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Sample users (in real app, use database)
const users = [];

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};

// Routes
app.get('/', (req, res) => {
    res.send(`
        <h1>Home</h1>
        ${req.session.userId ? `
            <p>Welcome, user ${req.session.userId}!</p>
            <a href="/dashboard">Dashboard</a>
            <a href="/logout">Logout</a>
        ` : `
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        `}
    `);
});

app.get('/register', (req, res) => {
    res.send(`
        <h1>Register</h1>
        <form action="/register" method="post">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
        <a href="/login">Already have an account?</a>
    `);
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.send('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    users.push({ id: users.length + 1, username, password: hashedPassword });

    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <a href="/register">Don't have an account?</a>
    `);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.send('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.send('Invalid password');
    }

    req.session.userId = user.id;
    res.redirect('/dashboard');
});

app.get('/dashboard', requireAuth, (req, res) => {
    res.send(`
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard!</p>
        <a href="/logout">Logout</a>
    `);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
});
```

## **11. Assignments and Projects**

### **Assignment 6.1: Express Basics**
Create an Express application that includes:
- Multiple routes with different HTTP methods
- Route parameters and query strings
- JSON request/response handling
- Static file serving
- Basic error handling

### **Assignment 6.2: Middleware Creation**
Build custom middleware for:
- Request logging
- Authentication checking
- Input validation
- CORS handling
- Rate limiting

### **Project 6: Task Management API**
Create a complete task management system with:
- CRUD operations for tasks
- User authentication
- Input validation
- Error handling
- API documentation

### **Challenge Project: E-commerce API**
Build an e-commerce API with:
- Product catalog
- Shopping cart
- User accounts
- Order management
- Payment integration (mock)
- Admin panel

## **12. Best Practices**

### **Security:**
- Use Helmet for security headers
- Implement rate limiting
- Validate and sanitize inputs
- Use HTTPS in production
- Store sensitive data securely

### **Performance:**
- Use compression middleware
- Implement caching strategies
- Optimize database queries
- Use connection pooling
- Monitor application performance

### **Code Organization:**
- Separate routes into modules
- Use middleware for cross-cutting concerns
- Implement proper error handling
- Write comprehensive tests
- Document your API

## **13. Testing Express Applications**

### **Using Jest and Supertest:**

```bash
npm install --save-dev jest supertest
```

```javascript
const request = require('supertest');
const app = require('../app');

describe('GET /api/users', () => {
    it('should return all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /json/);

        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('POST /api/users', () => {
    it('should create a new user', async () => {
        const newUser = { name: 'Test User', email: 'test@example.com' };

        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201);

        expect(response.body).toMatchObject(newUser);
    });
});
```

## **14. Deployment**

### **Environment Variables:**

```javascript
// config.js
module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET
};
```

### **Production Optimizations:**

```javascript
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.use(compression());
    app.use(helmet());
}
```

## **15. Advanced Express.js Patterns and Architecture**

### **Advanced Middleware Patterns**

#### **Dependency Injection Container**
```javascript
// container.js - Dependency injection container
class Container {
    constructor() {
        this.services = new Map();
        this.factories = new Map();
    }

    // Register a service instance
    register(name, instance) {
        this.services.set(name, instance);
        return this;
    }

    // Register a factory function
    factory(name, factory) {
        this.factories.set(name, factory);
        return this;
    }

    // Get a service
    get(name) {
        if (this.services.has(name)) {
            return this.services.get(name);
        }

        if (this.factories.has(name)) {
            const instance = this.factories.get(name)(this);
            this.services.set(name, instance);
            return instance;
        }

        throw new Error(`Service ${name} not found`);
    }
}

// Usage
const container = new Container();

// Register services
container
    .register('config', { port: 3000, dbUrl: 'mongodb://localhost' })
    .factory('database', (c) => new Database(c.get('config').dbUrl))
    .factory('userService', (c) => new UserService(c.get('database')))
    .factory('authMiddleware', (c) => new AuthMiddleware(c.get('userService')));

// Middleware to inject container
function containerMiddleware(container) {
    return (req, res, next) => {
        req.container = container;
        next();
    };
}

// Usage in routes
app.use(containerMiddleware(container));

app.get('/users', (req, res) => {
    const userService = req.container.get('userService');
    // Use userService
});
```

#### **Request Context and Correlation IDs**
```javascript
// Request context middleware
const uuid = require('uuid');

function requestContext(req, res, next) {
    req.context = {
        id: uuid.v4(),
        startTime: Date.now(),
        userId: req.user?.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method
    };

    // Add correlation ID to response headers
    res.set('X-Correlation-ID', req.context.id);

    // Add context to async local storage for nested calls
    const asyncLocalStorage = require('async_hooks').AsyncLocalStorage;
    const als = new asyncLocalStorage();

    als.run(req.context, () => {
        next();
    });
}

// Logger with correlation ID
const winston = require('winston');
const { AsyncLocalStorage } = require('async_hooks');

const als = new AsyncLocalStorage();

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const context = als.getStore();
            const correlationId = context?.id || 'unknown';
            return `${timestamp} [${correlationId}] ${level}: ${message}`;
        })
    ),
    transports: [new winston.transports.Console()]
});

// Middleware to add logger to request
function loggerMiddleware(req, res, next) {
    req.logger = logger;
    next();
}

// Usage
app.use(requestContext);
app.use(loggerMiddleware);

app.get('/api/users', (req, res) => {
    req.logger.info('Fetching users', { userCount: 10 });
    // Logs will include correlation ID
});
```

#### **Circuit Breaker Pattern**
```javascript
class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000, monitoringPeriod = 10000) {
        this.failureThreshold = threshold;
        this.timeout = timeout;
        this.monitoringPeriod = monitoringPeriod;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.successCount = 0;
        this.nextAttemptTime = null;
    }

    async execute(operation) {
        if (this.state === 'OPEN') {
            if (Date.now() < this.nextAttemptTime) {
                throw new Error('Circuit breaker is OPEN');
            }
            this.state = 'HALF_OPEN';
        }

        try {
            const result = await operation();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failureCount = 0;
        if (this.state === 'HALF_OPEN') {
            this.state = 'CLOSED';
            this.successCount++;
        }
    }

    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
            this.nextAttemptTime = Date.now() + this.timeout;
        }
    }

    getState() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            nextAttemptTime: this.nextAttemptTime
        };
    }
}

// Express middleware for circuit breaker
function circuitBreakerMiddleware(breaker) {
    return (req, res, next) => {
        breaker.execute(() => {
            // Simulate async operation
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() > 0.8) { // 20% failure rate
                        reject(new Error('Service unavailable'));
                    } else {
                        resolve();
                    }
                }, Math.random() * 1000);
            });
        }).then(() => {
            next();
        }).catch((error) => {
            res.status(503).json({
                error: 'Service temporarily unavailable',
                retryAfter: Math.ceil((breaker.nextAttemptTime - Date.now()) / 1000)
            });
        });
    };
}

// Usage
const breaker = new CircuitBreaker(3, 30000); // 3 failures, 30s timeout
app.use('/api/external', circuitBreakerMiddleware(breaker));
```

### **Advanced Routing and API Design**

#### **Versioned API with Content Negotiation**
```javascript
// API versioning strategies
const apiVersions = {
    v1: require('./api/v1'),
    v2: require('./api/v2')
};

// Version detection middleware
function versionMiddleware(req, res, next) {
    // Check Accept header
    const acceptHeader = req.get('Accept') || '';
    if (acceptHeader.includes('application/vnd.myapi.v2+json')) {
        req.apiVersion = 'v2';
    } else if (acceptHeader.includes('application/vnd.myapi.v1+json')) {
        req.apiVersion = 'v1';
    } else {
        // Check URL path
        const versionMatch = req.path.match(/^\/api\/(v\d+)\//);
        if (versionMatch) {
            req.apiVersion = versionMatch[1];
        } else {
            req.apiVersion = 'v1'; // default
        }
    }

    // Set response content type
    res.set('Content-Type', `application/vnd.myapi.${req.apiVersion}+json`);
    next();
}

// Version-specific routing
function versionedRouter() {
    const router = express.Router();

    router.use(versionMiddleware);

    // Mount version-specific routes
    Object.keys(apiVersions).forEach(version => {
        router.use(`/api/${version}`, (req, res, next) => {
            if (req.apiVersion === version) {
                return apiVersions[version](req, res, next);
            }
            next();
        });
    });

    return router;
}

// Content negotiation for different formats
function contentNegotiationMiddleware(req, res, next) {
    const accept = req.get('Accept') || 'application/json';

    if (accept.includes('application/xml')) {
        req.format = 'xml';
    } else if (accept.includes('text/csv')) {
        req.format = 'csv';
    } else {
        req.format = 'json';
    }

    // Add format helpers to response
    res.formatData = (data) => {
        switch (req.format) {
            case 'xml':
                return `<response>${JSON.stringify(data)}</response>`;
            case 'csv':
                // Convert to CSV
                return 'id,name,email\n' + data.map(item =>
                    `${item.id},${item.name},${item.email}`
                ).join('\n');
            default:
                return JSON.stringify(data);
        }
    };

    next();
}

// Usage
app.use(versionedRouter());
app.use(contentNegotiationMiddleware);
```

#### **Resource-Based Routing with HATEOAS**
```javascript
// HATEOAS (Hypermedia as the Engine of Application State)
function addHATEOASLinks(resource, req) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const links = {};

    switch (resource.type) {
        case 'user':
            links.self = `${baseUrl}/api/users/${resource.id}`;
            links.posts = `${baseUrl}/api/users/${resource.id}/posts`;
            links.update = `${baseUrl}/api/users/${resource.id}`;
            links.delete = `${baseUrl}/api/users/${resource.id}`;
            break;
        case 'post':
            links.self = `${baseUrl}/api/posts/${resource.id}`;
            links.author = `${baseUrl}/api/users/${resource.authorId}`;
            links.comments = `${baseUrl}/api/posts/${resource.id}/comments`;
            break;
    }

    return { ...resource, _links: links };
}

// Resource router with HATEOAS
function createResourceRouter(resourceName, controller) {
    const router = express.Router();

    // GET /resource
    router.get('/', async (req, res) => {
        const resources = await controller.findAll(req.query);
        const resourcesWithLinks = resources.map(resource =>
            addHATEOASLinks({ ...resource, type: resourceName }, req)
        );

        res.json({
            _embedded: { [resourceName]: resourcesWithLinks },
            _links: {
                self: `${req.protocol}://${req.get('host')}${req.path}`,
                create: `${req.protocol}://${req.get('host')}${req.path}`
            }
        });
    });

    // GET /resource/:id
    router.get('/:id', async (req, res) => {
        const resource = await controller.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        const resourceWithLinks = addHATEOASLinks(
            { ...resource, type: resourceName },
            req
        );

        res.json(resourceWithLinks);
    });

    // POST /resource
    router.post('/', async (req, res) => {
        const newResource = await controller.create(req.body);
        const resourceWithLinks = addHATEOASLinks(
            { ...newResource, type: resourceName },
            req
        );

        res.status(201)
           .set('Location', resourceWithLinks._links.self)
           .json(resourceWithLinks);
    });

    // PUT /resource/:id
    router.put('/:id', async (req, res) => {
        const updatedResource = await controller.update(req.params.id, req.body);
        const resourceWithLinks = addHATEOASLinks(
            { ...updatedResource, type: resourceName },
            req
        );

        res.json(resourceWithLinks);
    });

    // DELETE /resource/:id
    router.delete('/:id', async (req, res) => {
        await controller.delete(req.params.id);
        res.status(204).send();
    });

    return router;
}

// Usage
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

app.use('/api/users', createResourceRouter('user', userController));
app.use('/api/posts', createResourceRouter('post', postController));
```

### **Security and Authentication**

#### **JWT Authentication with Refresh Tokens**
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// JWT utilities
class JWTManager {
    constructor() {
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
        this.accessTokenExpiry = '15m';
        this.refreshTokenExpiry = '7d';
    }

    generateAccessToken(payload) {
        return jwt.sign(payload, this.accessTokenSecret, {
            expiresIn: this.accessTokenExpiry
        });
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, this.refreshTokenSecret, {
            expiresIn: this.refreshTokenExpiry
        });
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refreshTokenSecret);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    generateTokenPair(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };

        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
            expiresIn: 15 * 60 * 1000 // 15 minutes
        };
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwtManager.verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

// Role-based authorization
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
}

// Password utilities
class PasswordManager {
    static async hash(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    static async verify(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    static generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }
}

// Auth routes
const jwtManager = new JWTManager();

const authRouter = express.Router();

// Register
authRouter.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await PasswordManager.hash(password);

        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            name,
            emailVerificationToken: crypto.randomBytes(32).toString('hex')
        });

        await user.save();

        // Generate tokens
        const tokens = jwtManager.generateTokenPair(user);

        // Store refresh token securely
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            ...tokens
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await PasswordManager.verify(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        const tokens = jwtManager.generateTokenPair(user);

        // Update refresh token
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            ...tokens
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Refresh token
authRouter.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        const decoded = jwtManager.verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const tokens = jwtManager.generateTokenPair(user);

        // Update refresh token
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json(tokens);

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(403).json({ error: 'Token refresh failed' });
    }
});

// Logout
authRouter.post('/logout', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

// Password reset
authRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists
            return res.json({ message: 'If the email exists, a reset link has been sent' });
        }

        const resetToken = PasswordManager.generateResetToken();
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send reset email (implementation not shown)
        // await sendPasswordResetEmail(user.email, resetToken);

        res.json({ message: 'If the email exists, a reset link has been sent' });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Password reset failed' });
    }
});

authRouter.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        user.password = await PasswordManager.hash(newPassword);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Password reset failed' });
    }
});

// Protected routes example
app.get('/api/profile', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.json({ user });
});

app.get('/api/admin/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const users = await User.find({});
    res.json({ users });
});

module.exports = { authRouter, authenticateToken, authorizeRoles, jwtManager };
```

#### **Rate Limiting and Security Middleware**
```javascript
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Security middleware stack
function setupSecurityMiddleware(app) {
    // Helmet for security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    }));

    // CORS configuration
    app.use(cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
        optionsSuccessStatus: 200
    }));

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: 15 * 60 * 1000
        },
        standardHeaders: true,
        legacyHeaders: false,
        // Redis store for distributed rate limiting
        store: new rateLimit.MemoryStore() // Use Redis store in production
    });

    app.use('/api/', limiter);

    // Stricter limits for auth endpoints
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5, // 5 login attempts per 15 minutes
        message: {
            error: 'Too many login attempts, please try again later.',
            retryAfter: 15 * 60 * 1000
        }
    });

    app.use('/api/auth/login', authLimiter);

    // Slow down repeated requests
    const speedLimiter = slowDown({
        windowMs: 15 * 60 * 1000, // 15 minutes
        delayAfter: 50, // allow 50 requests per window
        delayMs: 500 // add 500ms delay per request
    });

    app.use(speedLimiter);

    // Data sanitization
    app.use(mongoSanitize()); // Prevent NoSQL injection
    app.use(xss()); // Prevent XSS attacks
    app.use(hpp()); // Prevent parameter pollution

    // Request size limits
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    return app;
}

// Custom security middleware
function securityHeaders(req, res, next) {
    // Remove sensitive headers
    res.removeHeader('X-Powered-By');

    // Add custom security headers
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    });

    next();
}

function requestLogging(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        };

        // Log to security monitoring service
        if (res.statusCode >= 400) {
            console.error('Security Event:', logData);
        } else {
            console.log('Request:', logData);
        }
    });

    next();
}

function ipWhitelist(allowedIPs) {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress;

        if (!allowedIPs.includes(clientIP)) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'Your IP address is not allowed to access this resource'
            });
        }

        next();
    };
}

// Input validation middleware
const Joi = require('joi');

function validateRequest(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        next();
    };
}

// Validation schemas
const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    age: Joi.number().integer().min(13).max(120)
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Usage
app.use(setupSecurityMiddleware);
app.use(securityHeaders);
app.use(requestLogging);

// Apply to specific routes
app.post('/api/users', validateRequest(userSchema));
app.post('/api/auth/login', validateRequest(loginSchema));

// IP whitelist for admin routes
const adminIPs = ['192.168.1.100', '10.0.0.1'];
app.use('/api/admin', ipWhitelist(adminIPs));
```

### **Performance Optimization**

#### **Caching Strategies**
```javascript
const redis = require('redis');
const { promisify } = require('util');

// Redis client
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

// Promisify Redis methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Cache middleware
function cacheMiddleware(duration = 300) { // 5 minutes default
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;

        try {
            const cachedResponse = await getAsync(key);
            if (cachedResponse) {
                const parsed = JSON.parse(cachedResponse);
                return res.json(parsed);
            }
        } catch (error) {
            console.error('Cache read error:', error);
        }

        // Store original send method
        const originalSend = res.json;

        // Override json method to cache response
        res.json = function(data) {
            const responseString = JSON.stringify(data);

            // Cache the response
            setAsync(key, responseString, 'EX', duration).catch(error => {
                console.error('Cache write error:', error);
            });

            // Call original method
            originalSend.call(this, data);
        };

        next();
    };
}

// Cache invalidation
function invalidateCache(pattern) {
    return async (req, res, next) => {
        // Store original methods
        const originalJson = res.json;
        const originalSend = res.send;

        res.json = function(data) {
            // Invalidate cache after successful response
            if (res.statusCode >= 200 && res.statusCode < 300) {
                redisClient.keys(pattern, (err, keys) => {
                    if (err) {
                        console.error('Cache invalidation error:', err);
                        return;
                    }

                    if (keys.length > 0) {
                        redisClient.del(keys, (err, count) => {
                            if (err) {
                                console.error('Cache deletion error:', err);
                            } else {
                                console.log(`Invalidated ${count} cache entries`);
                            }
                        });
                    }
                });
            }

            originalJson.call(this, data);
        };

        res.send = function(data) {
            // Similar invalidation logic for send method
            if (res.statusCode >= 200 && res.statusCode < 300) {
                redisClient.keys(pattern, (err, keys) => {
                    if (keys.length > 0) {
                        redisClient.del(keys);
                    }
                });
            }

            originalSend.call(this, data);
        };

        next();
    };
}

// Response compression
const compression = require('compression');

function conditionalCompression(req, res, next) {
    // Only compress if response is large
    const originalSend = res.send;

    res.send = function(data) {
        if (typeof data === 'string' && data.length > 1024) {
            // Enable compression for large responses
            compression()(req, res, () => {});
        }

        originalSend.call(this, data);
    };

    next();
}

// Database query result caching
class QueryCache {
    constructor(redisClient, defaultTTL = 300) {
        this.redis = redisClient;
        this.defaultTTL = defaultTTL;
    }

    async get(key) {
        try {
            const data = await getAsync(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    async set(key, data, ttl = this.defaultTTL) {
        try {
            await setAsync(key, JSON.stringify(data), 'EX', ttl);
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    async invalidate(pattern) {
        try {
            const keys = await promisify(redisClient.keys).bind(redisClient)(pattern);
            if (keys.length > 0) {
                await promisify(redisClient.del).bind(redisClient)(keys);
            }
        } catch (error) {
            console.error('Cache invalidation error:', error);
        }
    }
}

// Usage
const queryCache = new QueryCache(redisClient);

// Cached database query
async function getUsersCached(query = {}) {
    const cacheKey = `users:${JSON.stringify(query)}`;

    // Try cache first
    let users = await queryCache.get(cacheKey);
    if (users) {
        return users;
    }

    // Query database
    users = await User.find(query).lean();

    // Cache result
    await queryCache.set(cacheKey, users);

    return users;
}

// Apply middleware
app.use(conditionalCompression);
app.use('/api/users', cacheMiddleware(600)); // 10 minutes cache
app.use('/api/users', invalidateCache('users:*')); // Invalidate on changes
```

#### **Database Connection Pooling and Optimization**
```javascript
const mongoose = require('mongoose');

// Database connection with pooling
async function connectDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // Connection pool settings
            maxPoolSize: 10, // Maximum number of connections in the connection pool
            minPoolSize: 5,  // Minimum number of connections in the connection pool
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering

            // Performance settings
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,

            // Monitoring
            monitorCommands: true
        });

        console.log('Database connected successfully');

        // Connection event handlers
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('Database connection closed due to app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

// Query optimization middleware
function queryOptimization(req, res, next) {
    // Add timeout to prevent long-running queries
    req.queryTimeout = setTimeout(() => {
        console.warn('Query timeout for:', req.path);
        res.status(408).json({ error: 'Request timeout' });
    }, 30000); // 30 second timeout

    // Clear timeout on response
    res.on('finish', () => {
        if (req.queryTimeout) {
            clearTimeout(req.queryTimeout);
        }
    });

    next();
}

// Database monitoring middleware
function databaseMonitoring(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        // Log slow queries
        if (duration > 1000) { // Log queries taking more than 1 second
            console.warn(`Slow query: ${req.method} ${req.path} - ${duration}ms`);
        }

        // Monitor database connection pool
        const poolSize = mongoose.connection.db.serverConfig.poolSize;
        const availableConnections = mongoose.connection.db.serverConfig.availableConnections;

        if (availableConnections < 2) {
            console.warn('Low database connections available:', availableConnections);
        }
    });

    next();
}

// Optimized query helpers
class OptimizedQueryBuilder {
    static async findWithPagination(Model, query = {}, options = {}) {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            select = '',
            populate = ''
        } = options;

        const skip = (page - 1) * limit;

        // Use lean() for better performance when read-only
        const results = await Model.find(query)
            .select(select)
            .populate(populate)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Model.countDocuments(query);

        return {
            results,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        };
    }

    static async findOneOptimized(Model, query, options = {}) {
        const { select = '', populate = '' } = options;

        return await Model.findOne(query)
            .select(select)
            .populate(populate)
            .lean();
    }

    static async aggregateOptimized(Model, pipeline) {
        // Add performance hints to aggregation pipeline
        const optimizedPipeline = [
            ...pipeline,
            // Add indexes hint if needed
            // { $hint: { field: 1 } }
        ];

        return await Model.aggregate(optimizedPipeline);
    }
}

// Usage
app.use(queryOptimization);
app.use(databaseMonitoring);

// Optimized routes
app.get('/api/users', async (req, res) => {
    try {
        const result = await OptimizedQueryBuilder.findWithPagination(
            User,
            {},
            {
                page: req.query.page,
                limit: req.query.limit,
                sort: req.query.sort,
                select: 'name email createdAt',
                populate: 'profile'
            }
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await OptimizedQueryBuilder.findOneOptimized(
            User,
            { _id: req.params.id },
            {
                select: 'name email profile',
                populate: 'profile'
            }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Database health check
app.get('/health/database', async (req, res) => {
    try {
        // Ping database
        await mongoose.connection.db.admin().ping();

        // Get connection stats
        const stats = await mongoose.connection.db.stats();

        res.json({
            status: 'healthy',
            connections: mongoose.connection.db.serverConfig.poolSize,
            uptime: process.uptime(),
            stats: {
                collections: stats.collections,
                objects: stats.objects,
                dataSize: stats.dataSize,
                storageSize: stats.storageSize
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});
```

## **15. Resources**

- [Express.js Official Documentation](https://expressjs.com/)
- [Express.js API Reference](https://expressjs.com/en/api.html)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Express.js Performance Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [JWT Authentication with Express](https://jwt.io/)
- [Helmet Security Middleware](https://helmetjs.github.io/)
- [Express Rate Limiting](https://github.com/nfriedly/express-rate-limit)
- [Redis Caching with Express](https://redis.io/)
- [MongoDB Connection Pooling](https://mongoosejs.com/docs/connections.html)

## **16. Next Steps**

In the next lesson, we'll explore databases and MongoDB. You'll learn about:
- Database design principles
- MongoDB operations
- Data modeling
- Database integration with Express

Practice building Express applications and experiment with different middleware to strengthen your backend development skills!

---

This comprehensive Express.js documentation covers everything from basic routing to advanced patterns like dependency injection, circuit breakers, HATEOAS, JWT authentication, security middleware, caching strategies, and performance optimization. The examples are production-ready and follow current best practices for professional Express.js development.

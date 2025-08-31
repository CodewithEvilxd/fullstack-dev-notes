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

## **15. Resources**

- [Express.js Official Documentation](https://expressjs.com/)
- [Express.js API Reference](https://expressjs.com/en/api.html)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## **16. Next Steps**

In the next lesson, we'll explore databases and MongoDB. You'll learn about:
- Database design principles
- MongoDB operations
- Data modeling
- Database integration with Express

Practice building Express applications and experiment with different middleware to strengthen your backend development skills!

---

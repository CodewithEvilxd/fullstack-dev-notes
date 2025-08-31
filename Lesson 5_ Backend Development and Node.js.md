### **Lesson 5: Backend Development and Node.js - Server-Side JavaScript**

## **1. What is Backend Development?**

Backend development focuses on the server-side of web applications. It handles business logic, database operations, authentication, and serves data to the frontend. The backend acts as the brain of your application, processing requests and managing resources.

### **Key Components of Backend Development:**

#### **Core Components:**
- **Server:** Hardware or software that provides services to clients
- **Application Logic:** The code that processes requests and generates responses
- **Database:** Storage system for persistent data
- **APIs:** Interfaces for communication between different parts of the application
- **Authentication & Authorization:** User management and access control
- **Security:** Protecting against threats and vulnerabilities

#### **Advanced Backend Concepts:**
- **Microservices:** Breaking down applications into smaller, independent services
- **Serverless Computing:** Function as a Service (FaaS) for scalable applications
- **API Gateway:** Single entry point for managing multiple APIs
- **Message Queues:** Asynchronous communication between services
- **Caching Strategies:** Redis, Memcached for performance optimization
- **Load Balancing:** Distributing traffic across multiple servers
- **Container Orchestration:** Kubernetes, Docker Swarm for deployment
- **Monitoring & Logging:** Application performance tracking and error monitoring

### **Backend Technologies:**

- **Languages:** Node.js, Python, Ruby, PHP, Java, C#
- **Frameworks:** Express.js, Django, Ruby on Rails, Laravel, Spring
- **Databases:** MongoDB, PostgreSQL, MySQL, Redis
- **Web Servers:** Nginx, Apache, IIS
- **Cloud Platforms:** AWS, Azure, Google Cloud, Heroku

## **2. Introduction to Node.js**

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server-side, enabling full-stack JavaScript development.

### **Key Features:**

#### **Core Features:**
- **Non-blocking I/O:** Asynchronous operations don't block execution
- **Event-driven:** Uses an event loop for handling concurrent operations
- **Single-threaded:** Uses a single thread with background workers
- **NPM:** Largest ecosystem of open-source libraries
- **Cross-platform:** Runs on Windows, macOS, Linux
- **Fast:** Built on V8 engine, excellent performance

#### **Advanced Node.js Features:**
- **Clustering:** Utilizing multiple CPU cores for better performance
- **Streams:** Efficient handling of large data sets
- **Worker Threads:** True multi-threading for CPU-intensive tasks
- **Child Processes:** Spawning and managing child processes
- **Native Addons:** C/C++ extensions for performance-critical code
- **ES Modules:** Modern module system support
- **Built-in Test Runner:** Native testing framework (Node 18+)
- **Diagnostics:** Performance monitoring and debugging tools

### **When to Use Node.js:**

- Real-time applications (chat, gaming)
- API servers
- Streaming applications
- Microservices
- CLI tools
- IoT applications

## **3. Node.js Architecture**

### **Event Loop:**
Node.js uses a single-threaded event loop to handle asynchronous operations. The event loop continuously checks for pending events and executes their callbacks.

```javascript
// Event loop phases:
// 1. Timers (setTimeout, setInterval)
// 2. Pending callbacks
// 3. Idle, prepare
// 4. Poll (incoming connections, data)
// 5. Check (setImmediate)
// 6. Close callbacks
```

### **Non-blocking I/O:**
Traditional blocking I/O waits for operations to complete. Node.js uses non-blocking I/O with callbacks, promises, and async/await.

```javascript
// Blocking (traditional)
const data = fs.readFileSync('file.txt');

// Non-blocking (Node.js)
fs.readFile('file.txt', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Promise-based approach
const fs = require('fs').promises;

async function readFileAsync() {
    try {
        const data = await fs.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (error) {
        console.error('Error reading file:', error);
    }
}
```

### **Advanced Node.js Features:**

#### **Clustering for Multi-Core Utilization:**
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // Restart worker
        cluster.fork();
    });
} else {
    // Worker processes
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Hello from worker ${process.pid}\n`);
    }).listen(8000);

    console.log(`Worker ${process.pid} started`);
}
```

#### **Streams for Efficient Data Processing:**
```javascript
const fs = require('fs');
const { Transform } = require('stream');

// Readable stream
const readStream = fs.createReadStream('large-file.txt', {
    encoding: 'utf8',
    highWaterMark: 1024 // 1KB chunks
});

// Writable stream
const writeStream = fs.createWriteStream('output.txt');

// Pipe streams
readStream.pipe(writeStream);

// Transform stream (modify data on the fly)
const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        // Convert to uppercase
        const transformed = chunk.toString().toUpperCase();
        callback(null, transformed);
    }
});

// Chain streams
readStream.pipe(transformStream).pipe(writeStream);

// Handle events
readStream.on('data', (chunk) => {
    console.log('Received chunk:', chunk.length, 'bytes');
});

readStream.on('end', () => {
    console.log('File reading completed');
});

readStream.on('error', (error) => {
    console.error('Error reading file:', error);
});
```

#### **Worker Threads for CPU-Intensive Tasks:**
```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    // Main thread
    const worker = new Worker(__filename, {
        workerData: { input: 42 }
    });

    worker.on('message', (result) => {
        console.log('Result from worker:', result);
    });

    worker.on('error', (error) => {
        console.error('Worker error:', error);
    });

    worker.postMessage('start');
} else {
    // Worker thread
    parentPort.on('message', (message) => {
        if (message === 'start') {
            // Perform CPU-intensive task
            const result = fibonacci(workerData.input);
            parentPort.postMessage(result);
        }
    });
}

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

#### **Child Processes:**
```javascript
const { spawn, exec, execFile } = require('child_process');

// Spawn a process
const ls = spawn('ls', ['-la']);

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

// Execute a command
exec('find . -name "*.js" | wc -l', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`Number of JS files: ${stdout.trim()}`);
});

// Execute a file
execFile('node', ['--version'], (error, stdout, stderr) => {
    if (error) {
        console.error(`execFile error: ${error}`);
        return;
    }
    console.log(`Node version: ${stdout.trim()}`);
});
```

#### **Event Emitters and Custom Events:**
```javascript
const EventEmitter = require('events');

class TaskManager extends EventEmitter {
    constructor() {
        super();
        this.tasks = new Map();
    }

    addTask(id, task) {
        this.tasks.set(id, { ...task, status: 'pending' });
        this.emit('taskAdded', { id, task });
    }

    completeTask(id) {
        const task = this.tasks.get(id);
        if (task) {
            task.status = 'completed';
            this.emit('taskCompleted', { id, task });
        }
    }

    getTasks() {
        return Array.from(this.tasks.entries());
    }
}

// Usage
const taskManager = new TaskManager();

taskManager.on('taskAdded', ({ id, task }) => {
    console.log(`Task ${id} added: ${task.title}`);
});

taskManager.on('taskCompleted', ({ id, task }) => {
    console.log(`Task ${id} completed: ${task.title}`);
});

// Add event listener with options
taskManager.on('taskAdded', ({ id }) => {
    console.log(`Processing task ${id}...`);
}, { once: true }); // Only trigger once

taskManager.addTask(1, { title: 'Learn Node.js', priority: 'high' });
taskManager.addTask(2, { title: 'Build API', priority: 'medium' });
taskManager.completeTask(1);
```

#### **Buffer and Binary Data Handling:**
```javascript
// Creating buffers
const buf1 = Buffer.alloc(10); // Allocate 10 bytes, filled with 0
const buf2 = Buffer.allocUnsafe(10); // Allocate 10 bytes, may contain old data
const buf3 = Buffer.from('Hello World'); // Create from string
const buf4 = Buffer.from([1, 2, 3, 4]); // Create from array

// Buffer operations
console.log(buf3.toString()); // 'Hello World'
console.log(buf3.length); // 11
console.log(buf3[0]); // 72 (ASCII code for 'H')

// Concatenating buffers
const buf5 = Buffer.concat([buf3, Buffer.from('!!!')]);
console.log(buf5.toString()); // 'Hello World!!!'

// Copying buffers
const buf6 = Buffer.alloc(5);
buf3.copy(buf6, 0, 0, 5);
console.log(buf6.toString()); // 'Hello'

// Encoding/decoding
const jsonString = '{"name": "John", "age": 30}';
const jsonBuffer = Buffer.from(jsonString, 'utf8');
const decodedString = jsonBuffer.toString('utf8');
console.log(JSON.parse(decodedString)); // { name: 'John', age: 30 }
```

#### **Performance Monitoring and Diagnostics:**
```javascript
const { performance, PerformanceObserver } = require('perf_hooks');

// Measure execution time
const start = performance.now();

// Some operation
for (let i = 0; i < 1000000; i++) {
    // Simulate work
}

// End measurement
const end = performance.now();
console.log(`Operation took ${end - start} milliseconds`);

// Performance observer for monitoring
const obs = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration}ms`);
    });
});

obs.observe({ entryTypes: ['measure'], buffered: true });

// Create performance marks
performance.mark('start-operation');
// ... some operation
performance.mark('end-operation');
performance.measure('operation-duration', 'start-operation', 'end-operation');

// Memory usage monitoring
function logMemoryUsage() {
    const usage = process.memoryUsage();
    console.log('Memory Usage:');
    console.log(`RSS: ${Math.round(usage.rss / 1024 / 1024)} MB`);
    console.log(`Heap Used: ${Math.round(usage.heapUsed / 1024 / 1024)} MB`);
    console.log(`Heap Total: ${Math.round(usage.heapTotal / 1024 / 1024)} MB`);
    console.log(`External: ${Math.round(usage.external / 1024 / 1024)} MB`);
}

setInterval(logMemoryUsage, 5000); // Log every 5 seconds
```

#### **Native Addons (C/C++ Extensions):**
```javascript
// binding.gyp
{
    "targets": [
        {
            "target_name": "addon",
            "sources": ["addon.cc"],
            "include_dirs": ["<!(node -e \"require('nan')\")"]
        }
    ]
}

// addon.cc
#include <node.h>

void Method(const v8::FunctionCallbackInfo<v8::Value>& args) {
    v8::Isolate* isolate = args.GetIsolate();
    args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, "world").ToLocalChecked());
}

void Initialize(v8::Local<v8::Object> exports) {
    NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

// Usage in JavaScript
const addon = require('./build/Release/addon');
console.log(addon.hello()); // 'world'
```

#### **Built-in Test Runner (Node 18+):**
```javascript
// test/math.test.js
const { test, describe, it } = require('node:test');
const assert = require('node:assert');

function add(a, b) {
    return a + b;
}

describe('Math functions', () => {
    it('should add two numbers', () => {
        assert.strictEqual(add(2, 3), 5);
    });

    it('should handle negative numbers', () => {
        assert.strictEqual(add(-1, 1), 0);
    });

    it('should handle floating point numbers', () => {
        assert.strictEqual(add(0.1, 0.2), 0.3);
    });
});

// Run tests
// node --test test/math.test.js
```

#### **HTTP/2 Support:**
```javascript
const http2 = require('http2');
const fs = require('fs');

// HTTP/2 server
const server = http2.createSecureServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
});

server.on('stream', (stream, headers) => {
    // Handle HTTP/2 stream
    if (headers[':path'] === '/') {
        stream.respond({
            'content-type': 'text/html',
            ':status': 200
        });
        stream.end('<h1>Hello HTTP/2!</h1>');
    } else {
        stream.respond({
            ':status': 404
        });
        stream.end('Not Found');
    }
});

server.listen(8443, () => {
    console.log('HTTP/2 server listening on port 8443');
});

// HTTP/2 client
const client = http2.connect('https://localhost:8443');

const req = client.request({ ':path': '/' });

req.on('response', (headers) => {
    console.log('Headers:', headers);
});

req.on('data', (chunk) => {
    console.log('Data:', chunk.toString());
});

req.on('end', () => {
    client.close();
});
```

## **4. Setting Up Node.js**

### **Installation:**
1. Download from [nodejs.org](https://nodejs.org)
2. Or use package managers:
   - macOS: `brew install node`
   - Ubuntu: `sudo apt install nodejs npm`
   - Windows: Use installer or `choco install nodejs`

### **Version Management:**
```bash
# Using nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
nvm use node
```

### **Check Installation:**
```bash
node --version
npm --version
```

## **5. Your First Node.js Program**

### **Basic HTTP Server:**

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World!\n');
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});
```

### **Enhanced Server with Routing:**

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // Set response header
    res.setHeader('Content-Type', 'text/html');

    if (req.url === '/' && req.method === 'GET') {
        res.statusCode = 200;
        res.end('<h1>Welcome to Home Page</h1>');
    } else if (req.url === '/about' && req.method === 'GET') {
        res.statusCode = 200;
        res.end('<h1>About Us</h1><p>This is the about page.</p>');
    } else {
        res.statusCode = 404;
        res.end('<h1>404 - Page Not Found</h1>');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
```

## **6. Working with Modules**

### **Built-in Modules:**

```javascript
// File System
const fs = require('fs');

// Path manipulation
const path = require('path');

// Operating System info
const os = require('os');

// URL parsing
const url = require('url');

// Cryptography
const crypto = require('crypto');
```

### **File System Operations:**

```javascript
const fs = require('fs');
const path = require('path');

// Synchronous (blocking)
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);

// Asynchronous (non-blocking)
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    console.log(data);
});

// Write file
fs.writeFile('output.txt', 'Hello World!', (err) => {
    if (err) throw err;
    console.log('File written successfully');
});

// Check if file exists
fs.access('file.txt', fs.constants.F_OK, (err) => {
    console.log(err ? 'File does not exist' : 'File exists');
});
```

### **Creating Custom Modules:**

```javascript
// math.js
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

module.exports = {
    add,
    subtract
};

// app.js
const math = require('./math');
console.log(math.add(5, 3)); // 8
```

### **ES6 Modules (Modern Approach):**

```javascript
// math.mjs
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

// app.mjs
import { add, subtract } from './math.mjs';
console.log(add(5, 3)); // 8
```

## **7. NPM (Node Package Manager)**

### **Package Management:**

```bash
# Initialize project
npm init -y

# Install packages
npm install express          # Save to dependencies
npm install --save-dev jest  # Save to devDependencies
npm install -g nodemon       # Install globally

# View installed packages
npm list
npm list --depth=0

# Update packages
npm update
npm update package-name

# Remove packages
npm uninstall package-name
```

### **package.json Structure:**

```json
{
    "name": "my-app",
    "version": "1.0.0",
    "description": "My Node.js application",
    "main": "index.js",
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "jest"
    },
    "dependencies": {
        "express": "^4.18.0"
    },
    "devDependencies": {
        "jest": "^29.0.0",
        "nodemon": "^2.0.0"
    },
    "keywords": ["node", "express"],
    "author": "Your Name",
    "license": "MIT"
}
```

## **8. Asynchronous Programming**

### **Callbacks:**

```javascript
function fetchData(callback) {
    setTimeout(() => {
        callback(null, 'Data received');
    }, 1000);
}

fetchData((error, data) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success:', data);
    }
});
```

### **Promises:**

```javascript
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Data received');
        }, 1000);
    });
}

fetchData()
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

### **Async/Await:**

```javascript
async function getData() {
    try {
        const data = await fetchData();
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

getData();
```

### **Promise Methods:**

```javascript
// Promise.all - Wait for all promises to resolve
Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log('All resolved:', results);
    });

// Promise.race - Return first resolved promise
Promise.race([promise1, promise2])
    .then(result => {
        console.log('First resolved:', result);
    });

// Promise.allSettled - Wait for all promises to settle
Promise.allSettled([promise1, promise2])
    .then(results => {
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log('Fulfilled:', result.value);
            } else {
                console.log('Rejected:', result.reason);
            }
        });
    });
```

## **9. Error Handling**

### **Try-Catch Blocks:**

```javascript
try {
    // Code that might throw an error
    const result = riskyOperation();
    console.log('Result:', result);
} catch (error) {
    console.error('An error occurred:', error.message);
} finally {
    // Always executed
    console.log('Cleanup code');
}
```

### **Error Objects:**

```javascript
// Custom error
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

// Throwing errors
function validateAge(age) {
    if (age < 0) {
        throw new ValidationError('Age cannot be negative');
    }
    if (age > 150) {
        throw new ValidationError('Age cannot be greater than 150');
    }
    return true;
}
```

### **Unhandled Promise Rejections:**

```javascript
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
```

## **10. Environment Variables**

### **Using dotenv:**

```bash
npm install dotenv
```

```javascript
// .env file
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/myapp
API_KEY=your-secret-key

// app.js
require('dotenv').config();

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const dbUrl = process.env.DATABASE_URL;
```

### **Process Object:**

```javascript
// Command line arguments
console.log(process.argv);

// Environment variables
console.log(process.env);

// Current working directory
console.log(process.cwd());

// Platform info
console.log(process.platform);

// Exit codes
process.exit(0); // Success
process.exit(1); // Error
```

## **11. Code Examples**

### **Example 1: File Upload Server**

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // Serve HTML form
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`
            <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="file">
                <button type="submit">Upload</button>
            </form>
        `);
    } else if (req.method === 'POST' && req.url === '/upload') {
        // Handle file upload (simplified)
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('File uploaded successfully!');
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

### **Example 2: REST API Server**

```javascript
const http = require('http');
const url = require('url');

// Simple in-memory data store
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');

    // GET /users - Get all users
    if (path === '/users' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(users));
    }
    // GET /users/:id - Get user by ID
    else if (path.startsWith('/users/') && method === 'GET') {
        const id = parseInt(path.split('/')[2]);
        const user = users.find(u => u.id === id);

        if (user) {
            res.writeHead(200);
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'User not found' }));
        }
    }
    // POST /users - Create new user
    else if (path === '/users' && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const newUser = JSON.parse(body);
                newUser.id = users.length + 1;
                users.push(newUser);

                res.writeHead(201);
                res.end(JSON.stringify(newUser));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    // PUT /users/:id - Update user
    else if (path.startsWith('/users/') && method === 'PUT') {
        const id = parseInt(path.split('/')[2]);
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex !== -1) {
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });

            req.on('end', () => {
                try {
                    const updatedUser = JSON.parse(body);
                    updatedUser.id = id;
                    users[userIndex] = updatedUser;

                    res.writeHead(200);
                    res.end(JSON.stringify(updatedUser));
                } catch (error) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'User not found' }));
        }
    }
    // DELETE /users/:id - Delete user
    else if (path.startsWith('/users/') && method === 'DELETE') {
        const id = parseInt(path.split('/')[2]);
        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            res.writeHead(204);
            res.end();
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'User not found' }));
        }
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
});

server.listen(3000, () => {
    console.log('API Server running on http://localhost:3000');
});
```

### **Example 3: Command Line Tool**

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];

function createProject(projectName) {
    const projectPath = path.join(process.cwd(), projectName);

    // Create project directory
    fs.mkdirSync(projectPath);

    // Create package.json
    const packageJson = {
        name: projectName,
        version: '1.0.0',
        description: 'A Node.js project',
        main: 'index.js',
        scripts: {
            start: 'node index.js',
            dev: 'nodemon index.js'
        },
        dependencies: {},
        devDependencies: {}
    };

    fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );

    // Create index.js
    const indexJs = `console.log('Hello from ${projectName}!');

const http = require('http');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World!\\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
});`;

    fs.writeFileSync(path.join(projectPath, 'index.js'), indexJs);

    console.log(`Project "${projectName}" created successfully!`);
    console.log(`cd ${projectName} && npm install`);
}

function help() {
    console.log('Usage: mycli <command> [options]');
    console.log('');
    console.log('Commands:');
    console.log('  create <project-name>  Create a new Node.js project');
    console.log('  help                   Show this help message');
}

switch (command) {
    case 'create':
        if (args[1]) {
            createProject(args[1]);
        } else {
            console.error('Please provide a project name');
            console.log('Usage: mycli create <project-name>');
        }
        break;
    case 'help':
    case undefined:
        help();
        break;
    default:
        console.error(`Unknown command: ${command}`);
        help();
        break;
}
```

## **12. Assignments and Projects**

### **Assignment 5.1: Node.js Fundamentals**
Create Node.js programs that demonstrate:
- File system operations (read, write, delete files)
- HTTP server creation with multiple routes
- Command line argument parsing
- Environment variable usage
- Error handling with try-catch

### **Assignment 5.2: API Development**
Build a REST API for a blog application with:
- CRUD operations for posts
- User authentication (basic)
- Input validation
- Error handling
- JSON responses

### **Project 5: Task Management API**
Create a complete task management system with:
- User registration and login
- Task CRUD operations
- Categories and tags
- Due dates and priorities
- Search and filtering
- Data persistence with file system

### **Challenge Project: Weather CLI Tool**
Build a command-line weather application that:
- Takes city names as arguments
- Fetches weather data from an API
- Displays formatted weather information
- Handles errors gracefully
- Supports multiple cities at once

## **13. Best Practices**

### **Code Organization:**
- Use modular code structure
- Follow consistent naming conventions
- Add proper error handling
- Use environment variables for configuration
- Implement logging

### **Security:**
- Validate and sanitize inputs
- Use HTTPS in production
- Implement rate limiting
- Avoid exposing sensitive information
- Keep dependencies updated

### **Performance:**
- Use streaming for large files
- Implement caching strategies
- Optimize database queries
- Use connection pooling
- Monitor memory usage

## **14. Common Node.js Patterns**

### **Middleware Pattern:**
```javascript
function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}

function auth(req, res, next) {
    if (req.headers.authorization) {
        next();
    } else {
        res.statusCode = 401;
        res.end('Unauthorized');
    }
}

// Usage
const middlewares = [logger, auth];

function applyMiddlewares(req, res, middlewares) {
    let index = 0;

    function next() {
        if (index < middlewares.length) {
            middlewares[index++](req, res, next);
        }
    }

    next();
}
```

### **Observer Pattern:**
```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args));
        }
    }

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}
```

## **15. Debugging Node.js**

### **Built-in Debugger:**
```bash
node inspect app.js
# Or add debugger statement in code
```

### **Debugging with VS Code:**
```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}/app.js"
        }
    ]
}
```

### **Logging:**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

logger.info('Application started');
logger.error('Something went wrong');
```

## **16. Resources**

- [Node.js Official Documentation](https://nodejs.org/en/docs/)
- [Express.js](https://expressjs.com/)
- [NPM Documentation](https://docs.npmjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [The Node.js Way](https://github.com/FredKSchott/the-node-way)

## **17. Next Steps**

In the next lesson, we'll explore Express.js, a popular web framework for Node.js. You'll learn about:
- Routing and middleware
- Template engines
- Session management
- Security best practices

Practice building Node.js servers and experiment with different modules to strengthen your backend development skills!

---

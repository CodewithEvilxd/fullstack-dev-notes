
# Ultimate Full-Stack Web Development Guide

## Table of Contents

### Foundation (Lessons 0-0.75)
1. [Computer Basics & Development Environment](#computer-basics)
2. [Internet Concepts & Web Fundamentals](#internet-concepts)
3. [Git & Version Control Mastery](#git-version-control)

### Frontend Development (Lessons 1-4)
4. [HTML5 & Semantic Web Development](#html5-development)
5. [CSS3 & Modern Styling Techniques](#css3-styling)
6. [JavaScript ES6+ & DOM Mastery](#javascript-mastery)
7. [Advanced JavaScript Patterns](#advanced-js-patterns)

### Backend Development (Lessons 5-8)
8. [Node.js & Server-Side JavaScript](#nodejs-backend)
9. [Express.js Framework & API Development](#express-framework)
10. [MongoDB & NoSQL Database Design](#mongodb-nosql)
11. [Mongoose ODM & Data Modeling](#mongoose-odm)

### React Ecosystem (Lessons 9-12)
12. [React Fundamentals & Component Architecture](#react-fundamentals)
13. [React Hooks & State Management](#react-hooks)
14. [React Router & Single Page Applications](#react-router)
15. [Redux & Advanced State Management](#redux-advanced)

### Advanced Topics (Lessons 13-18)
16. [Authentication & Security](#authentication-security)
17. [Testing Strategies & Quality Assurance](#testing-strategies)
18. [Deployment & DevOps](#deployment-devops)
19. [API Design & GraphQL](#api-design-graphql)
20. [Real-Time Applications & WebSockets](#realtime-websockets)

### Production & Best Practices
21. [Full-Stack Project Architecture](#project-architecture)
22. [Performance Optimization](#performance-optimization)
23. [Security Best Practices](#security-practices)
24. [Career Development & Next Steps](#career-development)

---

## 1. Computer Basics & Development Environment

### Hardware Architecture & System Components

#### CPU (Central Processing Unit)
```javascript
// Understanding CPU cores and threads
const os = require('os');

// Get CPU information
console.log('CPU Cores:', os.cpus().length);
console.log('CPU Model:', os.cpus()[0].model);
console.log('CPU Speed:', os.cpus()[0].speed, 'MHz');

// Multi-threading considerations for Node.js
const cluster = require('cluster');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;

    console.log(`Master ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Restart worker
    });
} else {
    // Worker process
    require('./server.js');
    console.log(`Worker ${process.pid} started`);
}
```

#### Memory Management
```javascript
// Memory monitoring and optimization
const memUsage = process.memoryUsage();

console.log('RSS:', (memUsage.rss / 1024 / 1024).toFixed(2), 'MB');
console.log('Heap Used:', (memUsage.heapUsed / 1024 / 1024).toFixed(2), 'MB');
console.log('Heap Total:', (memUsage.heapTotal / 1024 / 1024).toFixed(2), 'MB');
console.log('External:', (memUsage.external / 1024 / 1024).toFixed(2), 'MB');

// Memory leak detection
const heapdump = require('heapdump');

setInterval(() => {
    heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');
}, 60000); // Every minute

// Garbage collection hints
if (global.gc) {
    global.gc();
} else {
    console.log('Garbage collection unavailable. Run with --expose-gc');
}
```

### Operating System Optimization

#### Windows Development Environment
```batch
# Windows optimization script
@echo off
echo Optimizing Windows for development...

# Disable Windows Defender real-time protection temporarily
powershell -Command "Set-MpPreference -DisableRealtimeMonitoring $true"

# Enable developer mode
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" /v AllowDevelopmentWithoutDevLicense /t REG_DWORD /d 1 /f

# Increase file handles limit
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v MaxMpxCt /t REG_DWORD /d 2048 /f

# Enable long paths
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f

echo Windows optimization complete!
```

#### Linux Development Environment
```bash
#!/bin/bash
# Linux development environment setup

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential development tools
sudo apt install -y build-essential curl wget git vim nano htop tree

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Configure development directories
mkdir -p ~/Projects ~/Scripts ~/Tools

# Set up Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global core.editor "nano"
git config --global init.defaultBranch main

echo "Linux development environment setup complete!"
```

### Development Tools & IDE Configuration

#### VS Code Extensions & Settings
```json
// .vscode/settings.json
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
    },
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "files.associations": {
        "*.js": "javascript",
        "*.jsx": "javascriptreact",
        "*.ts": "typescript",
        "*.tsx": "typescriptreact"
    },
    "emmet.includeLanguages": {
        "javascript": "javascriptreact",
        "typescript": "typescriptreact"
    },
    "javascript.preferences.importModuleSpecifier": "relative",
    "typescript.preferences.importModuleSpecifier": "relative",
    "eslint.workingDirectories": ["."],
    "prettier.configPath": ".prettierrc",
    "files.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/.git": true,
        "**/.DS_Store": true
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/coverage": true
    }
}
```

#### Essential VS Code Extensions
```json
{
    "recommendations": [
        "ms-vscode.vscode-typescript-next",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "ms-vscode.vscode-json",
        "christian-kohler.path-intellisense",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-css-peek",
        "formulahendry.auto-rename-tag",
        "christian-kohler.npm-intellisense",
        "ms-vscode.vscode-css-intellisense",
        "usernamehw.errorlens",
        "ms-vscode.vscode-git-graph",
        "gruntfuggly.todo-tree",
        "ms-vscode.vscode-docker",
        "redhat.vscode-yaml",
        "ms-vscode.vscode-jest",
        "humao.rest-client"
    ]
}
```

---

## 2. Internet Concepts & Web Fundamentals

### TCP/IP Protocol Suite Deep Dive

#### TCP Connection Establishment (Three-Way Handshake)
```javascript
// Understanding TCP connections in Node.js
const net = require('net');

// TCP server demonstrating connection handling
const server = net.createServer((socket) => {
    console.log('Client connected:', socket.remoteAddress, socket.remotePort);

    // Handle data
    socket.on('data', (data) => {
        console.log('Received:', data.toString());
        socket.write('Echo: ' + data.toString());
    });

    // Handle connection end
    socket.on('end', () => {
        console.log('Client disconnected');
    });

    // Handle errors
    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

server.listen(8080, () => {
    console.log('TCP server listening on port 8080');
});

// TCP client
const client = net.createConnection({ port: 8080, host: 'localhost' }, () => {
    console.log('Connected to server');
    client.write('Hello from client!');
});

client.on('data', (data) => {
    console.log('Received from server:', data.toString());
    client.end();
});

client.on('end', () => {
    console.log('Disconnected from server');
});
```

#### HTTP/2 vs HTTP/1.1 Performance Comparison
```javascript
// HTTP/1.1 server
const http = require('http');

const server1 = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from HTTP/1.1');
});

server1.listen(3000);

// HTTP/2 server (requires SSL)
const http2 = require('http2');
const fs = require('fs');

const server2 = http2.createSecureServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
});

server2.on('stream', (stream, headers) => {
    stream.respond({
        'content-type': 'text/plain',
        ':status': 200
    });
    stream.end('Hello from HTTP/2');
});

server2.listen(3443);
```

### Advanced API Patterns

#### RESTful API with HATEOAS
```javascript
// HATEOAS (Hypermedia As The Engine Of Application State)
const express = require('express');
const app = express();

app.use(express.json());

// User model with relationships
const users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        _links: {
            self: { href: '/api/users/1' },
            posts: { href: '/api/users/1/posts' },
            update: { href: '/api/users/1', method: 'PUT' },
            delete: { href: '/api/users/1', method: 'DELETE' }
        }
    }
];

// HATEOAS response
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({
            error: 'User not found',
            _links: {
                users: { href: '/api/users' }
            }
        });
    }

    res.json({
        data: user,
        _links: {
            collection: { href: '/api/users' },
            ...user._links
        }
    });
});

// Collection with pagination links
app.get('/api/users', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = users.slice(startIndex, endIndex);

    const response = {
        data: results,
        _links: {
            self: { href: `/api/users?page=${page}&limit=${limit}` },
            create: { href: '/api/users', method: 'POST' }
        }
    };

    if (startIndex > 0) {
        response._links.prev = {
            href: `/api/users?page=${page - 1}&limit=${limit}`
        };
    }

    if (endIndex < users.length) {
        response._links.next = {
            href: `/api/users?page=${page + 1}&limit=${limit}`
        };
    }

    res.json(response);
});
```

#### API Rate Limiting & Throttling
```javascript
const express = require('express');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const app = express();

// Redis client for distributed rate limiting
const redis = new Redis();

// Different rate limiters for different endpoints
const createLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 creations per window
    message: {
        error: 'Too many creations',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.user && req.user.role === 'admin' // Skip for admins
});

const readLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 reads per minute
    message: 'Too many requests',
    standardHeaders: true
});

// Burst rate limiting
const burstLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
    }),
    windowMs: 1000, // 1 second
    max: 10, // 10 requests per second
    message: 'Rate limit exceeded',
    standardHeaders: true
});

// Apply rate limiters
app.use('/api/users', createLimiter); // POST only
app.use('/api/', readLimiter); // All GET requests
app.post('/api/users', burstLimiter); // Additional burst protection

// Dynamic rate limiting based on user
const dynamicLimiter = (req, res, next) => {
    const limiter = rateLimit({
        windowMs: 60 * 1000,
        max: req.user ? (req.user.role === 'premium' ? 1000 : 100) : 10,
        message: 'Rate limit exceeded for your account type'
    });

    limiter(req, res, next);
};

app.use('/api/premium', dynamicLimiter);
```

---

## 3. Git & Version Control Mastery

### Advanced Git Workflows

#### Git Flow Workflow
```bash
# Initialize Git Flow
git flow init

# Feature development
git flow feature start user-authentication
# Make changes and commits
git flow feature finish user-authentication

# Release preparation
git flow release start v1.0.0
# Update version numbers, changelog
git flow release finish v1.0.0

# Hotfix for production issues
git flow hotfix start critical-security-fix
# Fix the issue
git flow hotfix finish critical-security-fix
```

#### Git Hooks for Automation
```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Run linting
npm run lint

# Run tests
npm test

# Check for console.log statements
if git diff --cached --name-only | xargs grep -l "console.log" > /dev/null; then
    echo "Error: console.log statements found in committed files"
    exit 1
fi

# Check commit message format
commit_msg=$(cat $1)
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,}"; then
    echo "Error: Commit message must follow conventional format"
    echo "Example: feat: add user authentication"
    exit 1
fi

echo "Pre-commit checks passed!"
```

#### Git Submodules for Multi-Repository Projects
```bash
# Add a submodule
git submodule add https://github.com/user/shared-library libs/shared

# Clone project with submodules
git clone --recursive https://github.com/user/main-project.git

# Update submodules
git submodule update --remote

# Initialize submodules in existing repo
git submodule init
git submodule update
```

### GitHub Advanced Features

#### GitHub Actions CI/CD Pipeline
```yaml
# .github/workflows/complete-ci-cd.yml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: 18
  DOCKER_IMAGE: myapp

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run security audit
      run: npm audit --audit-level high

    - name: Run linting
      run: npm run lint

    - name: Run unit tests
      run: npm run test:unit
      env:
        MONGODB_URI: mongodb://localhost:27017/test
        REDIS_URL: redis://localhost:6379

    - name: Run integration tests
      run: npm run test:integration
      env:
        MONGODB_URI: mongodb://localhost:27017/test
        REDIS_URL: redis://localhost:6379

    - name: Generate coverage report
      run: npm run test:coverage

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Build Docker image
      run: |
        docker build -t ${{ env.DOCKER_IMAGE }}:${{ github.sha }} .
        docker tag ${{ env.DOCKER_IMAGE }}:${{ github.sha }} ${{ env.DOCKER_IMAGE }}:latest

    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Push Docker image
      run: |
        docker push ${{ env.DOCKER_IMAGE }}:${{ github.sha }}
        docker push ${{ env.DOCKER_IMAGE }}:latest

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'

    steps:
    - name: Deploy to staging
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.STAGING_HOST }}
        username: ${{ secrets.STAGING_USER }}
        key: ${{ secrets.STAGING_SSH_KEY }}
        script: |
          cd /opt/myapp
          docker pull ${{ env.DOCKER_IMAGE }}:latest
          docker-compose -f docker-compose.staging.yml down
          docker-compose -f docker-compose.staging.yml up -d
          docker system prune -f

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.PRODUCTION_HOST }}
        username: ${{ secrets.PRODUCTION_USER }}
        key: ${{ secrets.PRODUCTION_SSH_KEY }}
        script: |
          cd /opt/myapp
          docker pull ${{ env.DOCKER_IMAGE }}:latest
          docker-compose -f docker-compose.prod.yml down
          docker-compose -f docker-compose.prod.yml up -d
          docker system prune -f

  notify:
    needs: [deploy-staging, deploy-production]
    runs-on: ubuntu-latest
    if: always()

    steps:
    - name: Send notification
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'Deployment ${{ job.status }}'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 4. HTML5 & Semantic Web Development

### Advanced HTML5 Features

#### Web Components
```html
<!-- Custom Element Definition -->
<template id="user-card-template">
  <style>
    .user-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      margin: 8px;
      display: inline-block;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-bottom: 12px;
    }
    .user-name {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
    }
    .user-email {
      color: #666;
      margin: 4px 0;
    }
  </style>
  <div class="user-card">
    <img class="user-avatar" src="" alt="User Avatar">
    <h3 class="user-name"></h3>
    <p class="user-email"></p>
    <slot name="actions"></slot>
  </div>
</template>

<script>
class UserCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const template = document.getElementById('user-card-template');
    const templateContent = template.content;

    this.shadowRoot.appendChild(templateContent.cloneNode(true));

    // Set attributes
    const avatar = this.shadowRoot.querySelector('.user-avatar');
    const name = this.shadowRoot.querySelector('.user-name');
    const email = this.shadowRoot.querySelector('.user-email');

    avatar.src = this.getAttribute('avatar') || 'https://via.placeholder.com/60';
    name.textContent = this.getAttribute('name') || 'Unknown User';
    email.textContent = this.getAttribute('email') || 'No email provided';
  }

  static get observedAttributes() {
    return ['name', 'email', 'avatar'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      switch (name) {
        case 'name':
          this.shadowRoot.querySelector('.user-name').textContent = newValue;
          break;
        case 'email':
          this.shadowRoot.querySelector('.user-email').textContent = newValue;
          break;
        case 'avatar':
          this.shadowRoot.querySelector('.user-avatar').src = newValue;
          break;
      }
    }
  }
}

// Register the custom element
customElements.define('user-card', UserCard);
</script>

<!-- Usage -->
<user-card
  name="John Doe"
  email="john@example.com"
  avatar="https://via.placeholder.com/60/007bff/ffffff?text=JD">
  <div slot="actions">
    <button>Edit</button>
    <button>Delete</button>
  </div>
</user-card>
```

#### Progressive Web App (PWA) Structure
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#007bff">

  <!-- PWA Meta Tags -->
  <meta name="description" content="My Progressive Web App">
  <meta name="author" content="Your Name">
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Web App Manifest -->
  <link rel="manifest" href="/manifest.json">

  <!-- Preload critical resources -->
  <link rel="preload" href="/css/main.css" as="style">
  <link rel="preload" href="/js/app.js" as="script">
  <link rel="dns-prefetch" href="//api.example.com">

  <title>My PWA</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
  <div id="app">
    <header>
      <h1>My Progressive Web App</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </header>

    <main>
      <section id="content">
        <!-- Dynamic content will be loaded here -->
      </section>
    </main>

    <footer>
      <p>&copy; 2024 My PWA. All rights reserved.</p>
    </footer>
  </div>

  <!-- Service Worker Registration -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered:', registration);
          })
          .catch(error => {
            console.log('SW registration failed:', error);
          });
      });
    }
  </script>

  <script src="/js/app.js"></script>
</body>
</html>
```

```json
// manifest.json
{
  "name": "My Progressive Web App",
  "short_name": "MyPWA",
  "description": "A progressive web application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "orientation": "portrait-primary",
  "scope": "/",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["productivity", "utilities"],
  "lang": "en-US",
  "dir": "ltr"
}
```

---

## 5. CSS3 & Modern Styling Techniques

### Advanced CSS Grid & Flexbox

#### Complex Grid Layouts
```css
/* Advanced CSS Grid Layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-template-rows: auto;
  grid-gap: 20px;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "sidebar content aside"
    "footer footer footer";
}

.header {
  grid-area: header;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.sidebar {
  grid-area: sidebar;
  background: #f8f9fa;
  padding: 20px;
}

.main {
  grid-area: main;
  background: #ffffff;
  padding: 20px;
}

.content {
  grid-area: content;
  background: #e9ecef;
  padding: 20px;
}

.aside {
  grid-area: aside;
  background: #d1ecf1;
  padding: 20px;
}

.footer {
  grid-area: footer;
  background: #343a40;
  color: white;
  padding: 20px;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .grid-container {
    grid-template-areas:
      "header"
      "sidebar"
      "main"
      "content"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

#### Flexbox Holy Grail Layout
```css
/* Holy Grail Layout with Flexbox */
.holy-grail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.holy-grail-header {
  flex: 0 0 auto;
  background: #2c3e50;
  color: white;
  padding: 1rem;
}

.holy-grail-body {
  display: flex;
  flex: 1;
}

.holy-grail-sidebar {
  flex: 0 0 250px;
  background: #34495e;
  color: white;
  padding: 1rem;
  order: -1; /* Move sidebar before main content */
}

.holy-grail-main {
  flex: 1;
  background: #ecf0f1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.holy-grail-content {
  flex: 1;
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.holy-grail-aside {
  flex: 0 0 200px;
  background: #3498db;
  color: white;
  padding: 1rem;
}

.holy-grail-footer {
  flex: 0 0 auto;
  background: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .holy-grail-body {
    flex-direction: column;
  }

  .holy-grail-sidebar,
  .holy-grail-aside {
    flex: 0 0 auto;
    order: 0;
  }
}
```

### CSS Custom Properties & Theming

#### Dynamic Theme System
```css
/* CSS Custom Properties for Theming */
:root {
  /* Light theme */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;

  --background-color: #ffffff;
  --surface-color: #f8f9fa;
  --text-color: #212529;
  --text-muted: #6c757d;

  --border-color: #dee2e6;
  --shadow: 0 2px 4px rgba(0,0,0,0.1);

  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 3rem;

  --border-radius: 4px;
  --border-radius-lg: 8px;

  --transition: all 0.3s ease;
}

/* Dark theme */
[data-theme="dark"] {
  --primary-color: #4dabf7;
  --background-color: #121212;
  --surface-color: #1e1e1e;
  --text-color: #ffffff;
  --text-muted: #b0b0b0;
  --border-color: #333333;
  --shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* High contrast theme */
[data-theme="high-contrast"] {
  --primary-color: #ffff00;
  --secondary-color: #ffffff;
  --background-color: #000000;
  --surface-color: #000000;
  --text-color: #ffffff;
  --border-color: #ffffff;
  --shadow: none;
}

/* Utility classes using custom properties */
.btn {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  font-family: var(--font-family);
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

.card {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow);
  color: var(--text-color);
}

.text-primary { color: var(--primary-color); }
.text-muted { color: var(--text-muted); }
.bg-primary { background-color: var(--primary-color); }
```

#### Theme Switcher JavaScript
```javascript
// Theme management
class ThemeManager {
  constructor() {
    this.themes = ['light', 'dark', 'high-contrast'];
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeSwitcher();
    this.bindEvents();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColors = {
        light: '#ffffff',
        dark: '#121212',
        'high-contrast': '#000000'
      };
      metaThemeColor.setAttribute('content', themeColors[theme]);
    }
  }

  createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.innerHTML = `
      <button class="theme-btn" data-theme="light">☀️ Light</button>
      <button class="theme-btn" data-theme="dark">🌙 Dark</button>
      <button class="theme-btn" data-theme="high-contrast">🔆 High Contrast</button>
    `;

    document.body.appendChild(switcher);

    // Mark active theme
    this.updateActiveThemeButton();
  }

  updateActiveThemeButton() {
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === this.currentTheme);
    });
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('theme-btn')) {
        const theme = e.target.dataset.theme;
        this.applyTheme(theme);
        this.updateActiveThemeButton();
      }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Reset to system preference
  resetToSystem() {
    localStorage.removeItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme(prefersDark ? 'dark' : 'light');
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for use in other modules
window.themeManager = themeManager;
```

---

## 6. JavaScript ES6+ & DOM Mastery

### Advanced JavaScript Patterns

#### Module Pattern with ES6 Modules
```javascript
// utils/math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export default class Calculator {
  constructor() {
    this.result = 0;
  }

  add(value) {
    this.result += value;
    return this;
  }

  subtract(value) {
    this.result -= value;
    return this;
  }

  getResult() {
    return this.result;
  }

  reset() {
    this.result = 0;
    return this;
  }
}

// utils/validation.js
export const validators = {
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^\+?[\d\s\-\(\)]+$/.test(value),
  url: (value) => /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(value),
  required: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
  minLength: (min) => (value) => value && value.length >= min,
  maxLength: (max) => (value) => !value || value.length <= max
};

export function validateField(value, rules) {
  const errors = [];

  for (const [rule, param] of Object.entries(rules)) {
    if (typeof validators[rule] === 'function') {
      const validator = typeof param === 'function' ? param : validators[rule];
      if (!validator(value)) {
        errors.push(`${rule} validation failed`);
      }
    }
  }

  return errors;
}

export class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.rules = new Map();
    this.errors = new Map();
  }

  addRule(fieldName, rules) {
    this.rules.set(fieldName, rules);
  }

  validate() {
    this.errors.clear();
    let isValid = true;

    for (const [fieldName, rules] of this.rules) {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        const value = field.value;
        const fieldErrors = validateField(value, rules);

        if (fieldErrors.length > 0) {
          this.errors.set(fieldName, fieldErrors);
          isValid = false;
        }
      }
    }

    return isValid;
  }

  getErrors() {
    return Object.fromEntries(this.errors);
  }

  showErrors() {
    for (const [fieldName, errors] of this.errors) {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      const errorElement = this.form.querySelector(`[data-error="${fieldName}"]`);

      if (errorElement) {
        errorElement.textContent = errors.join(', ');
        errorElement.style.display = 'block';
      }

      field.classList.add('error');
    }
  }

  clearErrors() {
    this.errors.clear();

    this.form.querySelectorAll('[data-error]').forEach(el => {
      el.style.display = 'none';
    });

    this.form.querySelectorAll('.error').forEach(el => {
      el.classList.remove('error');
    });
  }
}

// main.js
import Calculator, { add, multiply, PI } from './utils/math.js';
import { FormValidator, validators } from './utils/validation.js';

// Use calculator
const calc = new Calculator();
const result = calc.add(10).subtract(3).getResult();
console.log('Calculator result:', result);

// Use validators
console.log('Email valid:', validators.email('test@example.com'));

// Form validation example
const form = document.getElementById('myForm');
const validator = new FormValidator(form);

validator.addRule('email', {
  required: true,
  email: true
});

validator.addRule('password', {
  required: true,
  minLength: validators.minLength(8)
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  validator.clearErrors();

  if (validator.validate()) {
    console.log('Form is valid!');
    // Submit form
  } else {
    validator.showErrors();
  }
});
```

#### Advanced DOM Manipulation
```javascript
// Advanced DOM manipulation utilities
class DOMUtils {
  static createElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    // Set attributes
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    // Set properties
    if (options.properties) {
      Object.assign(element, options.properties);
    }

    // Add classes
    if (options.classes) {
      element.classList.add(...options.classes);
    }

    // Set text content
    if (options.text) {
      element.textContent = options.text;
    }

    // Set HTML content
    if (options.html) {
      element.innerHTML = options.html;
    }

    // Add event listeners
    if (options.events) {
      Object.entries(options.events).forEach(([event, handler]) => {
        element.addEventListener(event, handler);
      });
    }

    // Append children
    if (options.children) {
      options.children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
    }

    return element;
  }

  static $(selector, context = document) {
    return context.querySelector(selector);
  }

  static $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  static on(element, event, selector, handler) {
    element.addEventListener(event, (e) => {
      if (e.target.matches(selector)) {
        handler.call(e.target, e);
      }
    });
  }

  static delegate(element, event, selector, handler) {
    return this.on(element, event, selector, handler);
  }

  static ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  static loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }

  static animate(element, properties, duration = 300, easing = 'ease') {
    return new Promise(resolve => {
      const start = performance.now();
      const startValues = {};

      // Get starting values
      Object.keys(properties).forEach(prop => {
        if (prop === 'scrollTop' || prop === 'scrollLeft') {
          startValues[prop] = element[prop];
        } else {
          startValues[prop] = parseFloat(getComputedStyle(element)[prop]);
        }
      });

      const animate = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        // Apply easing
        const easedProgress = easing === 'ease' ?
          (progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2) :
          progress;

        // Update properties
        Object.entries(properties).forEach(([prop, endValue]) => {
          const startValue = startValues[prop];
          const currentValue = startValue + (endValue - startValue) * easedProgress;

          if (prop === 'scrollTop' || prop === 'scrollLeft') {
            element[prop] = currentValue;
          } else {
            element.style[prop] = currentValue + (typeof endValue === 'number' ? 'px' : '');
          }
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  static serialize(form) {
    const data = new FormData(form);
    const result = {};

    for (const [key, value] of data.entries()) {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          result[key
          if (prop === 'scrollTop' || prop === 'scrollLeft') {
            element[prop] = currentValue;
          } else {
            element.style[prop] = currentValue + (typeof endValue === 'number' ? 'px' : '');
          }
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  static serialize(form) {
    const data = new FormData(form);
    const result = {};

    for (const [key, value] of data.entries()) {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  static ajax(url, options = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(options.method || 'GET', url);

      // Set headers
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.timeout = options.timeout || 5000;
      xhr.ontimeout = () => reject(new Error('Request timeout'));

      if (options.data) {
        if (typeof options.data === 'object') {
          xhr.send(JSON.stringify(options.data));
        } else {
          xhr.send(options.data);
        }
      } else {
        xhr.send();
      }
    });
  }
}

// Usage examples
DOMUtils.ready(() => {
  console.log('DOM is ready!');

  // Create elements dynamically
  const card = DOMUtils.createElement('div', {
    classes: ['card'],
    attributes: { 'data-id': '123' },
    html: '<h2>Dynamic Card</h2><p>This card was created dynamically!</p>',
    events: {
      click: () => console.log('Card clicked!')
    }
  });

  document.body.appendChild(card);

  // Event delegation
  DOMUtils.delegate(document.body, 'click', '.btn', function(e) {
    console.log('Button clicked:', this.textContent);
  });

  // Animation
  const element = DOMUtils.$('.animate-me');
  if (element) {
    DOMUtils.animate(element, {
      opacity: 1,
      transform: 'translateY(0px)'
    }, 500);
  }

  // AJAX request
  DOMUtils.ajax('/api/users', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer token' }
  })
  .then(data => console.log('Users:', data))
  .catch(error => console.error('Error:', error));
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DOMUtils;
      // Fallback to source if cache fails
      return await fetchFunction();
    }
  }

  async set(key, value, ttl = this.ttl) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }
}

// Usage
const cacheManager = new CacheManager(redis);

// Cached API response
app.get('/api/users/:id', cache(300), async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Cache with custom key
app.get('/api/posts', async (req, res) => {
  const cacheKey = `posts:${JSON.stringify(req.query)}`;

  const posts = await cacheManager.get(cacheKey, async () => {
    return await Post.find(req.query).populate('author');
  });

  res.json(posts);
});
```

---

## 23. Security Best Practices

### Advanced Security Implementation
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

// Security middleware setup
const setupSecurity = (app) => {
  // Set security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.stripe.com"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.ip === '127.0.0.1' // Skip for localhost
  });

  app.use('/api/', limiter);

  // More strict rate limiting for auth routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts, please try again later.'
  });

  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);

  // CORS configuration
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));

  // Data sanitization against NoSQL injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
  }));

  return app;
};

// Input validation and sanitization
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

const validationRules = {
  email: (value) => validator.isEmail(value),
  password: (value) => validator.isStrongPassword(value, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  }),
  name: (value) => validator.isLength(value, { min: 2, max: 50 }),
  url: (value) => validator.isURL(value),
  phone: (value) => validator.isMobilePhone(value, 'any'),
  objectId: (value) => validator.isMongoId(value)
};

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Remove HTML tags
    input = sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {}
    });

    // Trim whitespace
    input = validator.trim(input);

    // Escape special characters
    input = validator.escape(input);
  }

  return input;
};

const validateAndSanitize = (data, rules) => {
  const errors = [];
  const sanitized = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    if (rule.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value) {
      // Sanitize input
      const sanitizedValue = sanitizeInput(value);

      // Validate input
      if (rule.validator && !rule.validator(sanitizedValue)) {
        errors.push(`${field} is invalid`);
        continue;
      }

      sanitized[field] = sanitizedValue;
    }
  }

  return { errors, sanitized };
};

// Usage in routes
app.post('/api/users', (req, res) => {
  const rules = {
    name: { required: true, validator: validationRules.name },
    email: { required: true, validator: validationRules.email },
    password: { required: true, validator: validationRules.password }
  };

  const { errors, sanitized } = validateAndSanitize(req.body, rules);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Proceed with sanitized data
  createUser(sanitized);
});
```

#### Secure Authentication System
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// JWT utilities with refresh token rotation
class SecureAuth {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = '15m';
    this.refreshTokenExpiry = '7d';
  }

  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'myapp',
      audience: 'users'
    });

    const refreshToken = jwt.sign(
      { userId: payload.userId, tokenVersion: payload.tokenVersion },
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiry }
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: 'myapp',
        audience: 'users'
      });
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

  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }
}

// Session management with Redis
class SessionManager {
  constructor(redisClient) {
    this.redis = redisClient;
    this.sessionPrefix = 'session:';
    this.userSessionsPrefix = 'user_sessions:';
  }

  async createSession(userId, userAgent, ip) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const sessionData = {
      userId,
      userAgent,
      ip,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    await this.redis.setex(
      `${this.sessionPrefix}${sessionId}`,
      24 * 60 * 60, // 24 hours
      JSON.stringify(sessionData)
    );

    // Track user's active sessions
    await this.redis.sadd(`${this.userSessionsPrefix}${userId}`, sessionId);

    return sessionId;
  }

  async getSession(sessionId) {
    const sessionData = await this.redis.get(`${this.sessionPrefix}${sessionId}`);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  async updateSessionActivity(sessionId) {
    const sessionData = await this.getSession(sessionId);
    if (sessionData) {
      sessionData.lastActivity = new Date().toISOString();
      await this.redis.setex(
        `${this.sessionPrefix}${sessionId}`,
        24 * 60 * 60,
        JSON.stringify(sessionData)
      );
    }
  }

  async destroySession(sessionId) {
    const sessionData = await this.getSession(sessionId);
    if (sessionData) {
      await this.redis.del(`${this.sessionPrefix}${sessionId}`);
      await this.redis.srem(`${this.userSessionsPrefix}${sessionData.userId}`, sessionId);
    }
  }

  async destroyAllUserSessions(userId) {
    const sessionIds = await this.redis.smembers(`${this.userSessionsPrefix}${userId}`);

    if (sessionIds.length > 0) {
      const pipeline = this.redis.pipeline();

      sessionIds.forEach(sessionId => {
        pipeline.del(`${this.sessionPrefix}${sessionId}`);
      });

      pipeline.del(`${this.userSessionsPrefix}${userId}`);
      await pipeline.exec();
    }
  }

  async getUserActiveSessions(userId) {
    const sessionIds = await this.redis.smembers(`${this.userSessionsPrefix}${userId}`);
    const sessions = [];

    for (const sessionId of sessionIds) {
      const session = await this.getSession(sessionId);
      if (session) {
        sessions.push({ sessionId, ...session });
      }
    }

    return sessions;
  }
}

// Password security
class PasswordSecurity {
  static validatePassword(password) {
    const errors = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  }

  static checkPasswordHistory(password, user) {
    // Check if password was used recently
    if (user.passwordHistory) {
      for (const oldPassword of user.passwordHistory) {
        if (bcrypt.compareSync(password, oldPassword)) {
          return false; // Password was used before
        }
      }
    }
    return true;
  }

  static generatePasswordResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}

// Two-factor authentication
class TwoFactorAuth {
  constructor() {
    this.speakeasy = require('speakeasy');
    this.qrcode = require('qrcode');
  }

  generateSecret(userId) {
    return this.speakeasy.generateSecret({
      name: `MyApp (${userId})`,
      issuer: 'MyApp'
    });
  }

  async generateQRCode(secret) {
    return await this.qrcode.toDataURL(secret.otpauth_url);
  }

  verifyToken(secret, token) {
    return this.speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time windows (30 seconds each)
    });
  }
}

// Security monitoring and logging
class SecurityLogger {
  constructor() {
    this.winston = require('winston');
    this.logger = this.winston.createLogger({
      level: 'info',
      format: this.winston.format.combine(
        this.winston.format.timestamp(),
        this.winston.format.errors({ stack: true }),
        this.winston.format.json()
      ),
      defaultMeta: { service: 'auth-service' },
      transports: [
        new this.winston.transports.File({ filename: 'security.log' }),
        new this.winston.transports.Console({
          format: this.winston.format.simple()
        })
      ]
    });
  }

  logFailedLogin(attempt) {
    this.logger.warn('Failed login attempt', {
      type: 'FAILED_LOGIN',
      ip: attempt.ip,
      userAgent: attempt.userAgent,
      email: attempt.email,
      timestamp: new Date().toISOString()
    });
  }

  logSuccessfulLogin(user, session) {
    this.logger.info('Successful login', {
      type: 'SUCCESSFUL_LOGIN',
      userId: user.id,
      email: user.email,
      ip: session.ip,
      userAgent: session.userAgent,
      sessionId: session.id
    });
  }

  logSuspiciousActivity(activity) {
    this.logger.error('Suspicious activity detected', {
      type: 'SUSPICIOUS_ACTIVITY',
      ...activity
    });
  }

  logPasswordChange(userId, ip) {
    this.logger.info('Password changed', {
      type: 'PASSWORD_CHANGE',
      userId,
      ip,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  SecureAuth,
  SessionManager,
  PasswordSecurity,
  TwoFactorAuth,
  SecurityLogger
};
```

---

## 24. Career Development & Next Steps

### Professional Development Roadmap

#### Junior Developer (0-2 years)
```javascript
// Focus areas for junior developers
const juniorDeveloperRoadmap = {
  fundamentals: {
    'Programming Basics': ['Variables', 'Data Types', 'Control Flow', 'Functions'],
    'Web Fundamentals': ['HTML', 'CSS', 'JavaScript', 'HTTP/HTTPS'],
    'Version Control': ['Git', 'GitHub', 'Branching Strategies'],
    'Basic Tools': ['VS Code', 'Terminal', 'Package Managers']
  },

  technologies: {
    frontend: ['React', 'CSS Frameworks', 'Responsive Design'],
    backend: ['Node.js', 'Express.js', 'REST APIs'],
    database: ['MongoDB', 'SQL Basics'],
    tools: ['Postman', 'Browser DevTools', 'npm/yarn']
  },

  skills: {
    soft: ['Communication', 'Problem Solving', 'Time Management'],
    technical: ['Debugging', 'Code Review', 'Documentation'],
    learning: ['Research Skills', 'Online Learning', 'Community Engagement']
  },

  projects: [
    'Personal Portfolio Website',
    'Todo Application',
    'Blog Platform',
    'E-commerce Store',
    'Social Media Dashboard'
  ]
};
```

#### Mid-Level Developer (2-5 years)
```javascript
// Focus areas for mid-level developers
const midLevelDeveloperRoadmap = {
  advanced: {
    'Architecture Patterns': ['MVC', 'MVVM', 'Microservices', 'Serverless'],
    'State Management': ['Redux', 'Context API', 'Zustand'],
    'Testing': ['Unit Testing', 'Integration Testing', 'E2E Testing'],
    'Performance': ['Optimization', 'Caching', 'CDN', 'Lazy Loading']
  },

  technologies: {
    frontend: ['TypeScript', 'Next.js', 'GraphQL', 'WebSockets'],
    backend: ['Authentication', 'Authorization', 'API Design', 'Database Design'],
    devops: ['Docker', 'CI/CD', 'Monitoring', 'Cloud Platforms'],
    tools: ['Webpack', 'Babel', 'ESLint', 'Prettier']
  },

  skills: {
    leadership: ['Mentoring', 'Code Reviews', 'Technical Leadership'],
    architecture: ['System Design', 'Scalability', 'Security'],
    business: ['Requirements Analysis', 'Agile/Scrum', 'Client Communication']
  },

  certifications: [
    'AWS Certified Developer',
    'Google Cloud Professional',
    'MongoDB Certified Developer',
    'React Developer Certification'
  ]
};
```

#### Senior Developer (5+ years)
```javascript
// Focus areas for senior developers
const seniorDeveloperRoadmap = {
  expert: {
    'System Architecture': ['Distributed Systems', 'Event-Driven Architecture', 'CQRS'],
    'Advanced Patterns': ['Domain-Driven Design', 'Clean Architecture', 'SOLID Principles'],
    'Performance': ['High-Performance Computing', 'Real-Time Systems', 'Optimization'],
    'Security': ['Advanced Security', 'Cryptography', 'Compliance']
  },

  technologies: {
    cloud: ['AWS/Azure/GCP Advanced', 'Kubernetes', 'Service Mesh'],
    data: ['Data Warehousing', 'Big Data', 'Machine Learning'],
    mobile: ['React Native', 'Flutter', 'Progressive Web Apps'],
    emerging: ['WebAssembly', 'Edge Computing', 'IoT']
  },

  skills: {
    leadership: ['Team Leadership', 'Project Management', 'Strategic Planning'],
    mentoring: ['Knowledge Sharing', 'Career Development', 'Technical Coaching'],
    business: ['Product Strategy', 'Technical Strategy', 'Stakeholder Management']
  },

  contributions: [
    'Open Source Projects',
    'Technical Blogging',
    'Conference Speaking',
    'Book Writing',
    'Community Leadership'
  ]
};
```

### Interview Preparation

#### Technical Interview Questions
```javascript
// Common JavaScript interview questions and solutions
const interviewQuestions = {
  javascript: {
    'Explain closures': `
      A closure is a function that has access to variables in its outer scope,
      even after the outer function has returned. This allows for data privacy
      and function factories.
    `,

    'What is the event loop?': `
      The event loop is a mechanism that allows JavaScript to perform non-blocking
      operations. It continuously checks the call stack and callback queue,
      moving callbacks to the call stack when it's empty.
    `,

    'Difference between == and ===': `
      == performs type coercion before comparison, while === performs strict
      comparison without type coercion. Always use === for better predictability.
    `
  },

  react: {
    'What are hooks?': `
      Hooks are functions that let you use state and lifecycle features in
      functional components. They allow you to reuse stateful logic without
      changing your component hierarchy.
    `,

    'Explain useEffect': `
      useEffect is a hook that runs side effects in functional components.
      It can be used for data fetching, subscriptions, or DOM manipulation.
      It runs after every render by default, but can be optimized with dependencies.
    `,

    'Virtual DOM': `
      Virtual DOM is a lightweight copy of the actual DOM. React uses it to
      optimize rendering by comparing changes and only updating what's necessary.
    `
  },

  nodejs: {
    'What is the event-driven architecture?': `
      Node.js uses an event-driven, non-blocking I/O model. It uses events and
      callbacks to handle asynchronous operations efficiently.
    `,

    'Explain streams': `
      Streams are objects that let you read data from a source or write data
      to a destination in continuous fashion. They're useful for handling large
      amounts of data without loading everything into memory.
    `,

    'Middleware in Express': `
      Middleware functions are functions that have access to the request object,
      response object, and the next middleware function. They can execute code,
      modify request/response objects, end the request-response cycle, or call
      the next middleware.
    `
  },

  database: {
    'Explain indexing': `
      Indexes are data structures that improve the speed of data retrieval
      operations on a database table. They work like book indexes, allowing
      faster lookups at the cost of additional storage and slower writes.
    `,

    'ACID properties': `
      ACID stands for Atomicity, Consistency, Isolation, Durability:
      - Atomicity: All operations in a transaction succeed or none do
      - Consistency: Database remains in a consistent state
      - Isolation: Transactions don't interfere with each other
      - Durability: Committed transactions survive permanently
    `,

    'Normalization': `
      Normalization is the process of organizing data to minimize redundancy
      and improve data integrity. It involves dividing large tables into smaller,
      related tables and defining relationships between them.
    `
  }
};
```

#### System Design Interview Preparation
```javascript
// System design interview preparation
const systemDesignTopics = {
  scalability: {
    'Horizontal vs Vertical Scaling': `
      Vertical scaling: Adding more power to existing server
      Horizontal scaling: Adding more servers to distribute load
    `,

    'Load Balancing': `
      Distributing incoming network traffic across multiple servers
      to ensure no single server becomes overwhelmed.
    `,

    'Caching Strategies': `
      - Browser caching
      - CDN caching
      - Application caching (Redis, Memcached)
      - Database caching
    `,

    'Database Sharding': `
      Splitting large databases into smaller, more manageable pieces
      called shards, distributed across multiple servers.
    `
  },

  reliability: {
    'Redundancy': `
      Having backup components that can take over when primary
      components fail.
    `,

    'Failover': `
      Automatic switching to a redundant system when the primary
      system fails.
    `,

    'Circuit Breaker': `
      Pattern that prevents cascading failures by stopping calls
      to failing services.
    `,

    'Health Checks': `
      Monitoring system components to ensure they're functioning
      properly and can handle requests.
    `
  },

  security: {
    'Authentication & Authorization': `
      Authentication: Verifying user identity
      Authorization: Determining user permissions
    `,

    'OAuth 2.0': `
      Authorization framework that enables third-party applications
      to obtain limited access to user accounts.
    `,

    'JWT': `
      JSON Web Tokens for securely transmitting information between
      parties as a JSON object.
    `,

    'HTTPS': `
      Protocol for secure communication over the internet using
      SSL/TLS encryption.
    `
  },

  performance: {
    'CDN': `
      Content Delivery Network distributes content geographically
      to reduce latency and improve performance.
    `,

    'Database Optimization': `
      - Indexing
      - Query optimization
      - Connection pooling
      - Read replicas
    `,

    'Caching Layers': `
      - Browser cache
      - Application cache
      - Database cache
      - CDN cache
    `,

    'Compression': `
      Reducing data size for faster transmission:
      - Gzip compression
      - Image optimization
      - Minification
    `
  }
};
```

### Building a Professional Portfolio

#### Portfolio Project Ideas
```javascript
// Advanced portfolio project ideas
const portfolioProjects = {
  beginner: [
    {
      name: 'Personal Blog',
      tech: ['HTML', 'CSS', 'JavaScript'],
      features: ['Responsive design', 'Contact form', 'Blog posts']
    },
    {
      name: 'Weather App',
      tech: ['React', 'API integration'],
      features: ['Current weather', 'Forecast', 'Location detection']
    },
    {
      name: 'Todo Application',
      tech: ['React', 'Local Storage'],
      features: ['Add/edit/delete todos', 'Categories', 'Due dates']
    }
  ],

  intermediate: [
    {
      name: 'E-commerce Platform',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      features: [
        'User authentication',
        'Product catalog',
        'Shopping cart',
        'Payment processing',
        'Order management'
      ]
    },
    {
      name: 'Social Media Dashboard',
      tech: ['React', 'Express', 'PostgreSQL', 'Socket.io'],
      features: [
        'Real-time messaging',
        'User profiles',
        'Post creation',
        'Like/comment system',
        'Notifications'
      ]
    },
    {
      name: 'Project Management Tool',
      tech: ['React', 'Node.js', 'MongoDB', 'JWT'],
      features: [
        'Team collaboration',
        'Task management',
        'File uploads',
        'Progress tracking',
        'Role-based access'
      ]
    }
  ],

  advanced: [
    {
      name: 'Microservices E-commerce',
      tech: ['Docker', 'Kubernetes', 'React', 'Node.js', 'MongoDB', 'Redis'],
      features: [
        'Microservices architecture',
        'API gateway',
        'Service discovery',
        'Distributed caching',
        'Event-driven communication'
      ]
    },
    {
      name: 'Real-time Collaboration Platform',
      tech: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Redis', 'WebRTC'],
      features: [
        'Real-time document editing',
        'Video conferencing',
        'Screen sharing',
        'File collaboration',
        'User presence'
      ]
    },
    {
      name: 'AI-Powered Analytics Dashboard',
      tech: ['React', 'Python', 'TensorFlow', 'Node.js', 'PostgreSQL'],
      features: [
        'Data visualization',
        'Machine learning models',
        'Predictive analytics',
        'Real-time data processing',
        'Custom dashboards'
      ]
    }
  ]
};
```

#### Professional Development Resources
```javascript
// Professional development resources
const professionalResources = {
  learning: {
    platforms: [
      'Udemy', 'Coursera', 'Pluralsight', 'LinkedIn Learning',
      'freeCodeCamp', 'MDN Web Docs', 'W3Schools'
    ],
    communities: [
      'Stack Overflow', 'Reddit (r/learnprogramming)', 'Dev.to',
      'Hashnode', 'GitHub', 'Discord communities'
    ],
    newsletters: [
      'JavaScript Weekly', 'Node Weekly', 'React Status',
      'CSS Weekly', 'DevOps Weekly'
    ]
  },

  networking: {
    conferences: [
      'JSConf', 'React Conf', 'Node.js Interactive',
      'CSS Conf', 'DevOps Days', 'AWS re:Invent'
    ],
    meetups: [
      'Local tech meetups', 'Women Who Code', 'GDG (Google Developer Groups)',
      'Microsoft Developer Communities'
    ],
    online: [
      'Twitter', 'LinkedIn', 'AngelList', 'HackerNews',
      'Indie Hackers', 'Remote.co'
    ]
  },

  career: {
    jobBoards: [
      'LinkedIn', 'Indeed', 'Glassdoor', 'Remote.co',
      'We Work Remotely', 'AngelList', 'HackerRank'
    ],
    resume: [
      'GitHub profile optimization', 'Personal website',
      'LinkedIn profile', 'Portfolio projects'
    ],
    interview: [
      'LeetCode', 'HackerRank', 'CodeSignal',
      'Pramp', 'Interviewing.io', 'System design resources'
    ]
  },

  stayingCurrent: {
    blogs: [
      'CSS-Tricks', 'Smashing Magazine', 'A List Apart',
      'SitePoint', 'David Walsh Blog', '2ality'
    ],
    podcasts: [
      'Syntax', 'Full Stack Radio', 'The Changelog',
      'ShopTalk Show', 'CodePen Radio'
    ],
    youtube: [
      'Traversy Media', 'Academind', 'The Net Ninja',
      'freeCodeCamp', 'Kevin Powell', 'Wes Bos'
    ]
  }
};
```

### Final Thoughts

Congratulations on completing this comprehensive full-stack web development guide! You've learned:

1. **Computer Basics & Development Environment**
   - Hardware and software fundamentals
   - Development tools and IDEs
   - Command line proficiency

2. **Internet Concepts & Web Fundamentals**
   - HTTP/HTTPS protocols
   - Client-server architecture
   - Web security basics

3. **Version Control & Git**
   - Git workflows and branching strategies
   - GitHub collaboration
   - CI/CD with GitHub Actions

4. **Frontend Development**
   - HTML5 semantic markup
   - CSS3 advanced styling and layouts
   - JavaScript ES6+ features and patterns
   - React ecosystem and component architecture

5. **Backend Development**
   - Node.js server-side programming
   - Express.js framework and API development
   - MongoDB database design and queries
   - Mongoose ODM for data modeling

6. **Advanced Topics**
   - Authentication and authorization systems
   - Testing strategies (unit, integration, E2E)
   - Deployment and DevOps practices
   - API design and GraphQL implementation
   - Real-time applications with WebSockets

7. **Production-Ready Skills**
   - Performance optimization techniques
   - Security best practices
   - System architecture patterns
   - Professional development and career guidance

Remember that becoming a proficient full-stack developer is a journey, not a destination. Keep practicing, building projects, and staying current with new technologies. The key to success is consistent learning and hands-on experience.

**Next Steps:**
1. Build real-world projects using the patterns you've learned
2. Contribute to open-source projects
3. Network with other developers
4. Stay updated with industry trends
5. Consider specializing in areas that interest you most

Good luck on your journey to becoming a full-stack developer! 🚀

---

*This guide was created to provide comprehensive knowledge for aspiring full-stack web developers. Regular updates and improvements are made to keep the content current with industry best practices.*

      await request(app)
        .post('/api/users')
        .send(userData);

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);
    });
  });

  describe('GET /api/users', () => {
    beforeEach(async () => {
      await User.create([
        { name: 'User 1', email: 'user1@example.com', password: 'pass1' },
        { name: 'User 2', email: 'user2@example.com', password: 'pass2' }
      ]);
    });

    test('returns all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
    });

    test('supports pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=1')
        .expect(200);

      expect(response.body).toHaveLength(1);
    });
  });
});
```

#### E2E Testing with Cypress
```javascript
// cypress/integration/auth.spec.js
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('[data-cy=email]').type('user@example.com');
    cy.get('[data-cy=password]').type('password123');
    cy.get('[data-cy=login-button]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-cy=welcome-message]').should('contain', 'Welcome');
  });

  it('should show error with invalid credentials', () => {
    cy.get('[data-cy=email]').type('invalid@example.com');
    cy.get('[data-cy=password]').type('wrongpassword');
    cy.get('[data-cy=login-button]').click();

    cy.get('[data-cy=error-message]').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should redirect to login when accessing protected route', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});

// cypress/integration/user-management.spec.js
describe('User Management', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'admin123'); // Custom command
    cy.visit('/admin/users');
  });

  it('should display user list', () => {
    cy.get('[data-cy=user-list]').should('be.visible');
    cy.get('[data-cy=user-item]').should('have.length.greaterThan', 0);
  });

  it('should create new user', () => {
    cy.get('[data-cy=add-user-button]').click();
    cy.get('[data-cy=user-form]').should('be.visible');

    cy.get('[data-cy=name]').type('New User');
    cy.get('[data-cy=email]').type('newuser@example.com');
    cy.get('[data-cy=submit-button]').click();

    cy.get('[data-cy=success-message]').should('be.visible');
    cy.get('[data-cy=user-list]').should('contain', 'New User');
  });

  it('should edit existing user', () => {
    cy.get('[data-cy=user-item]').first().within(() => {
      cy.get('[data-cy=edit-button]').click();
    });

    cy.get('[data-cy=user-form]').should('be.visible');
    cy.get('[data-cy=name]').clear().type('Updated Name');
    cy.get('[data-cy=submit-button]').click();

    cy.get('[data-cy=user-list]').should('contain', 'Updated Name');
  });

  it('should delete user with confirmation', () => {
    cy.get('[data-cy=user-item]').first().within(() => {
      cy.get('[data-cy=delete-button]').click();
    });

    cy.get('[data-cy=confirm-dialog]').should('be.visible');
    cy.get('[data-cy=confirm-button]').click();

    cy.get('[data-cy=success-message]').should('contain', 'deleted');
  });
});

// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=password]').type(password);
    cy.get('[data-cy=login-button]').click();
    cy.url().should('not.include', '/login');
  });
});

Cypress.Commands.add('createUser', (userData) => {
  cy.request('POST', '/api/users', userData).then((response) => {
    expect(response.status).to.eq(201);
    return response.body;
  });
});

// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/index.js'
  },
  video: true,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000,
  requestTimeout: 15000,
  responseTimeout: 15000
});
```

---

## 18. Deployment & DevOps

### Docker & Containerization
```dockerfile
# Dockerfile for Node.js application
FROM node:18-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY package*.json ./

# Dependencies stage
FROM base AS dependencies

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Development dependencies stage
FROM dependencies AS dev-dependencies

# Install all dependencies (including dev)
RUN npm ci

# Build stage
FROM dev-dependencies AS build

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM base AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
```

#### Docker Compose for Full-Stack
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - app-network

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=myapp
    volumes:
      - mongodb_data:/data/db
      - ./docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d:ro
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  mongodb_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

#### Kubernetes Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          value: "mongodb://mongodb:27017/myapp"
        - name: REDIS_URL
          value: "redis://redis:6379"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
      - name: mongodb
        image: mongo:6.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "admin"
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        volumeMounts:
        - name: mongodb-storage
          mountPath: /data/db
      volumes:
      - name: mongodb-storage
        persistentVolumeClaim:
          claimName: mongodb-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 3000
```

#### CI/CD Pipeline with GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Run linting
      run: npm run lint

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.PRODUCTION_HOST }}
        username: ${{ secrets.PRODUCTION_USER }}
        key: ${{ secrets.PRODUCTION_SSH_KEY }}
        script: |
          cd /opt/myapp
          docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          docker-compose -f docker-compose.prod.yml down
          docker-compose -f docker-compose.prod.yml up -d
          docker system prune -f

  notify:
    needs: [deploy]
    runs-on: ubuntu-latest
    if: always()

    steps:
    - name: Send notification
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'Production deployment ${{ job.status }}'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 19. API Design & GraphQL

### REST API Best Practices
```javascript
// Advanced REST API with Express
const express = require('express');
const router = express.Router();

// Content negotiation middleware
const contentNegotiation = (req, res, next) => {
  const accept = req.headers.accept || '';

  if (accept.includes('application/json')) {
    res.type('json');
  } else if (accept.includes('application/xml')) {
    res.type('xml');
  }

  next();
};

// API versioning middleware
const apiVersioning = (version) => (req, res, next) => {
  req.apiVersion = version;
  next();
};

// Rate limiting for API
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// HATEOAS links generator
const generateLinks = (req, resource, id = null) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/api/v1`;
  const links = {
    self: id ? `${baseUrl}/${resource}/${id}` : `${baseUrl}/${resource}`
  };

  // Add pagination links if applicable
  if (req.query.page) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;

    links.first = `${baseUrl}/${resource}?page=1&limit=${limit}`;
    links.prev = page > 1 ? `${baseUrl}/${resource}?page=${page - 1}&limit=${limit}` : null;
    links.next = `${baseUrl}/${resource}?page=${page + 1}&limit=${limit}`;
  }

  return links;
};

// Enhanced error handling
class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler
const handleError = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new APIError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new APIError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new APIError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Success response formatter
const successResponse = (res, data, statusCode = 200, links = null) => {
  const response = {
    success: true,
    data,
    ...(links && { _links: links })
  };

  res.status(statusCode).json(response);
};

// Apply middleware
router.use(contentNegotiation);
router.use(apiVersioning('v1'));
router.use(apiLimiter);

// Users API
router.get('/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const links = generateLinks(req, 'users');

    successResponse(res, {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, 200, links);

  } catch (error) {
    next(error);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      throw new APIError('User not found', 404);
    }

    const links = generateLinks(req, 'users', req.params.id);
    successResponse(res, { user }, 200, links);

  } catch (error) {
    next(error);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    // Remove password from response
    user.password = undefined;

    const links = generateLinks(req, 'users', user._id);
    successResponse(res, { user }, 201, links);

  } catch (error) {
    next(error);
  }
});

router.put('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      throw new APIError('User not found', 404);
    }

    const links = generateLinks(req, 'users', req.params.id);
    successResponse(res, { user }, 200, links);

  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw new APIError('User not found', 404);
    }

    res.status(204).json({
      success: true,
      data: null
    });

  } catch (error) {
    next(error);
  }
});

// Apply error handling
router.use(handleError);

module.exports = router;
```

#### GraphQL API Implementation
```javascript
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');

// GraphQL Schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
    createdAt: String!
    updatedAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    tags: [String!]!
    published: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users(limit: Int, offset: Int): [User!]!
    user(id: ID!): User
    posts(limit: Int, offset: Int, published: Boolean): [Post!]!
    post(id: ID!): Post
    searchPosts(query: String!, limit: Int): [Post!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): Boolean!

    createPost(title: String!, content: String!, tags: [String!]): Post!
    updatePost(id: ID!, title: String, content: String, tags: [String!]): Post!
    deletePost(id: ID!): Boolean!
    publishPost(id: ID!): Post!
  }

  type Subscription {
    postCreated: Post!
    postUpdated: Post!
    userCreated: User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: async (_, { limit = 10, offset = 0 }) => {
      return await User.find().skip(offset).limit(limit);
    },

    user: async (_, { id }) => {
      return await User.findById(id);
    },

    posts: async (_, { limit = 10, offset = 0, published }) => {
      const query = published !== undefined ? { published } : {};
      return await Post.find(query)
        .populate('author')
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 });
    },

    post: async (_, { id }) => {
      return await Post.findById(id).populate('author');
    },

    searchPosts: async (_, { query, limit = 10 }) => {
      return await Post.find({
        $text: { $search: query }
      })
      .populate('author')
      .limit(limit)
      .sort({ score: { $meta: 'textScore' } });
    }
  },

  Mutation: {
    createUser: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      return user;
    },

    updateUser: async (_, { id, name, email }) => {
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      return await User.findByIdAndUpdate(id, updateData, { new: true });
    },

    deleteUser: async (_, { id }) => {
      await User.findByIdAndDelete(id);
      return true;
    },

    createPost: async (_, { title, content, tags }, { user }) => {
      if (!user) throw new Error('Authentication required');

      const post = new Post({
        title,
        content,
        tags,
        author: user.id
      });

      await post.save();
      await post.populate('author');

      // Publish to subscribers
      pubsub.publish('POST_CREATED', { postCreated: post });

      return post;
    },

    updatePost: async (_, { id, title, content, tags }, { user }) => {
      const post = await Post.findById(id);
      if (!post) throw new Error('Post not found');

      if (post.author.toString() !== user.id) {
        throw new Error('Not authorized to update this post');
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (tags) updateData.tags = tags;

      const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true })
        .populate('author');

      // Publish to subscribers
      pubsub.publish('POST_UPDATED', { postUpdated: updatedPost });

      return updatedPost;
    },

    deletePost: async (_, { id }, { user }) => {
      const post = await Post.findById(id);
      if (!post) throw new Error('Post not found');

      if (post.author.toString() !== user.id) {
        throw new Error('Not authorized to delete this post');
      }

      await Post.findByIdAndDelete(id);
      return true;
    },

    publishPost: async (_, { id }, { user }) => {
      const post = await Post.findById(id);
      if (!post) throw new Error('Post not found');

      if (post.author.toString() !== user.id) {
        throw new Error('Not authorized to publish this post');
      }

      post.published = true;
      await post.save();
      await post.populate('author');

      return post;
    }
  },

  Subscription: {
    postCreated: {
      subscribe: () => pubsub.asyncIterator(['POST_CREATED'])
    },

    postUpdated: {
      subscribe: () => pubsub.asyncIterator(['POST_UPDATED'])
    },

    userCreated: {
      subscribe: () => pubsub.asyncIterator(['USER_CREATED'])
    }
  },

  User: {
    posts: async (user) => {
      return await Post.find({ author: user.id, published: true });
    }
  },

  Post: {
    author: async (post) => {
      return await User.findById(post.author);
    }
  }
};

// Authentication middleware for GraphQL
const getUserFromToken = async (token) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.userId);
  } catch (error) {
    return null;
  }
};

const context = async ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = await getUserFromToken(token);

  return { user };
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production'
});

const app = express();
server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
```

---

## 20. Real-Time Applications & WebSockets

### Advanced WebSocket Implementation
```javascript
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Redis for scaling
const redis = new Redis(process.env.REDIS_URL);
const pubClient = new Redis(process.env.REDIS_URL);
const subClient = pubClient.duplicate();

// Redis adapter for scaling across multiple servers
const { createAdapter } = require('@socket.io/redis-adapter');
io.adapter(createAdapter(pubClient, subClient));

// In-memory storage (use Redis/database in production)
const users = new Map();
const rooms = new Map();
const onlineUsers = new Set();

// Authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.username = decoded.username;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

// Connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.username} (${socket.id})`);

  // Add user to online list
  onlineUsers.add(socket.userId);
  users.set(socket.userId, {
    id: socket.userId,
    username: socket.username,
    socketId: socket.id,
    connectedAt: new Date()
  });

  // Broadcast online users
  io.emit('online-users', Array.from(onlineUsers).map(id => users.get(id)));

  // Send recent messages
  socket.emit('recent-messages', getRecentMessages());

  // Handle joining rooms
  socket.on('join-room', (roomId) => {
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.userId);

    // Notify others in room
    socket.to(roomId).emit('user-joined', {
      userId: socket.userId,
      username: socket.username,
      roomId
    });

    // Send room info
    socket.emit('room-info', {
      roomId,
      users: Array.from(rooms.get(roomId)).map(id => users.get(id)),
      messageCount: getRoomMessageCount(roomId)
    });
  });

  // Handle leaving rooms
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);

    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.userId);

      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }

    // Notify others in room
    socket.to(roomId).emit('user-left', {
      userId: socket.userId,
      username: socket.username,
      roomId
    });
  });

  // Handle new messages
  socket.on('send-message', async (data) => {
    const { content, roomId, type = 'text' } = data;

    const message = {
      id: generateMessageId(),
      userId: socket.userId,
      username: socket.username,
      content,
      type,
      timestamp: new Date(),
      roomId
    };

    // Save message (in production, save to database)
    await saveMessage(message);

    // Broadcast to room or all users
    if (roomId) {
      io.to(roomId).emit('new-message', message);
    } else {
      io.emit('new-message', message);
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const { roomId } = data;

    const typingData = {
      userId: socket.userId,
      username: socket.username,
      roomId
    };

    if (roomId) {
      socket.to(roomId).emit('user-typing', typingData);
    } else {
      socket.broadcast.emit('user-typing', typingData);
    }
  });

  socket.on('typing-stop', (data) => {
    const { roomId } = data;

    if (roomId) {
      socket.to(roomId).emit('user-stop-typing', {
        userId: socket.userId,
        roomId
      });
    } else {
      socket.broadcast.emit('user-stop-typing', {
        userId: socket.userId
      });
    }
  });

  // Handle private messages
  socket.on('send-private-message', async (data) => {
    const { targetUserId, content } = data;

    const targetUser = users.get(targetUserId);
    if (!targetUser) {
      socket.emit('error', { message: 'User not found' });
      return;
    }

    const privateMessage = {
      id: generateMessageId(),
      from: socket.userId,
      to: targetUserId,
      content,
      timestamp: new Date()
    };

    // Save private message
    await savePrivateMessage(privateMessage);

    // Send to target user
    io.to(targetUser.socketId).emit('private-message', privateMessage);

    // Send confirmation to sender
    socket.emit('private-message-sent', privateMessage);
  });

  // Handle file uploads
  socket.on('send-file', async (data) => {
    const { fileName, fileData, roomId } = data;

    // In production, save file to cloud storage
    const fileUrl = await saveFile(fileName, fileData);

    const message = {
      id: generateMessageId(),
      userId: socket.userId,
      username: socket.username,
      content: fileUrl,
      type: 'file',
      fileName,
      timestamp: new Date(),
      roomId
    };

    await saveMessage(message);

    if (roomId) {
      io.to(roomId).emit('new-message', message);
    } else {
      io.emit('new-message', message);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.username}`);

    onlineUsers.delete(socket.userId);
    users.delete(socket.userId);

    // Remove from all rooms
    for (const [roomId, roomUsers] of rooms) {
      roomUsers.delete(socket.userId);

      if (roomUsers.size === 0) {
        rooms.delete(roomId);
      } else {
        // Notify others in room
        socket.to(roomId).emit('user-left', {
          userId: socket.userId,
          username: socket.username,
          roomId
        });
      }
    }

    // Broadcast updated online users
    io.emit('online-users', Array.from(onlineUsers).map(id => users.get(id)));
  });
});

// Helper functions
function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getRecentMessages(limit = 50) {
  // In production, fetch from database
  return [];
}

function getRoomMessageCount(roomId) {
  // In production, fetch from database
  return 0;
}

async function saveMessage(message) {
  // In production, save to database
  console.log('Saving message:', message);
}

async function savePrivateMessage(message) {
  // In production, save to database
  console.log('Saving private message:', message);
}

async function saveFile(fileName, fileData) {
  // In production, save to cloud storage
  console.log('Saving file:', fileName);
  return `https://storage.example.com/files/${fileName}`;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connections: io.engine.clientsCount,
    onlineUsers: onlineUsers.size
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Real-time server running on port ${PORT}`);
});
```

---

## 21. Full-Stack Project Architecture

### Microservices Architecture
```javascript
// API Gateway
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use(limiter);

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Service routes
const userService = createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
});

const postService = createProxyMiddleware({
  target: 'http://post-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/api/posts': '' }
});

const notificationService = createProxyMiddleware({
  target: 'http://notification-service:3003',
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '' }
});

// Apply authentication to protected routes
app.use('/api/users', authenticate, userService);
app.use('/api/posts', authenticate, postService);
app.use('/api/notifications', authenticate, notificationService);

// Public routes (no authentication required)
app.use('/api/auth', createProxyMiddleware({
  target: 'http://auth-service:3004',
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' }
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is healthy' });
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});
```

#### Event-Driven Architecture
```javascript
// Event bus using Redis
const Redis = require('ioredis');
const EventEmitter = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.publisher = new Redis(process.env.REDIS_URL);
    this.subscriber = new Redis(process.env.REDIS_URL);

    this.subscriber.on('message', (channel, message) => {
      try {
        const event = JSON.parse(message);
        this.emit(channel, event);
      } catch (error) {
        console.error('Error parsing event:', error);
      }
    });
  }

  async publish(eventType, eventData) {
    const message = JSON.stringify({
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
      id: this.generateId()
    });

    await this.publisher.publish(eventType, message);
  }

  subscribe(eventType, handler) {
    this.subscriber.subscribe(eventType);
    this.on(eventType, handler);
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async close() {
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}

// Usage in services
const eventBus = new EventBus();

// User service
eventBus.subscribe('user.created', async (event) => {
  console.log('New user created:', event.data);

  // Send welcome email
  await sendWelcomeEmail(event.data.email);

  // Create user profile
  await createUserProfile(event.data.id);
});

// Post service
eventBus.subscribe('post.created', async (event) => {
  console.log('New post created:', event.data);

  // Update user post count
  await updateUserPostCount(event.data.authorId);

  // Notify followers
  await notifyFollowers(event.data.authorId, event.data.id);
});

// Publish events
const createUser = async (userData) => {
  const user = await User.create(userData);

  await eventBus.publish('user.created', {
    id: user.id,
    email: user.email,
    name: user.name
  });

  return user;
};

const createPost = async (postData) => {
  const post = await Post.create(postData);

  await eventBus.publish('post.created', {
    id: post.id,
    title: post.title,
    authorId: post.author
  });

  return post;
};
```

---

## 22. Performance Optimization

### Database Optimization
```javascript
// Optimized MongoDB queries
const optimizedQueries = {
  // Use indexes effectively
  async getUsersWithPosts(options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1 } = options;

    return await User.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts'
        }
      },
      {
        $addFields: {
          postCount: { $size: '$posts' }
        }
      },
      {
        $sort: { [sortBy]: sortOrder }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      },
      {
        $project: {
          password: 0,
          posts: { $slice: ['$posts', 3] } // Only return last 3 posts
        }
      }
    ]);
  },

  // Use covered queries
  async getUserByEmail(email) {
    return await User.findOne({ email })
      .select('email name role')
      .lean(); // Return plain object for better performance
  },

  // Batch operations
  async bulkUpdateUsers(updates) {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: update.data },
        upsert: false
      }
    }));

    return await User.bulkWrite(bulkOps);
  },

  // Pagination with cursor
  async getPostsCursor(options = {}) {
    const { limit = 10, cursor } = options;

    let query = {};
    if (cursor) {
      query._id = { $gt: cursor };
    }

    return await Post.find(query)
      .sort({ _id: 1 })
      .limit(limit)
      .populate('author', 'name email')
      .lean();
  }
};

// Database connection optimization
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,

      // Retry settings
      retryWrites: true,
      retryReads: true,

      // Timeout settings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      // Compression
      compressors: 'zlib'
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
```

#### Caching Strategies
```javascript
const Redis = require('ioredis');
const crypto = require('crypto');

// Redis client
const redis = new Redis(process.env.REDIS_URL);

// Cache middleware
const cache = (duration = 300) => {
  return async (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key
    const key = crypto.createHash('md5')
      .update(req.originalUrl + JSON.stringify(req.query))
      .digest('hex');

    try {
      // Check cache
      const cached = await redis.get(key);
      if (cached) {
        const data = JSON.parse(cached);
        return res.json(data);
      }

      // Store original send method
      const originalSend = res.json;

      // Override send method to cache response
      res.json = function(data) {
        redis.setex(key, duration, JSON.stringify(data));
        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Cache invalidation
const cacheInvalidation = {
  async invalidateUser(userId) {
    const keys = await redis.keys(`*user:${userId}*`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  },

  async invalidatePost(postId) {
    const keys = await redis.keys(`*post:${postId}*`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  },

  async invalidatePattern(pattern) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
};

// Advanced caching with cache-aside pattern
class CacheManager {
  constructor(redisClient) {
    this.redis = redisClient;
    this.ttl = 3600; // 1 hour default
  }

  async get(key, fetchFunction, ttl = this.ttl) {
    try {
      // Try to get from cache
      const cached = await this.redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }

      // Fetch from source
      const data = await fetchFunction();

      // Cache the result
      if (data) {
        await this.redis.setex(key, ttl, JSON.stringify(data));
      }

      return data;
    } catch (error) {
      console.error('Cache get error:', error);
      // Fallback to source if cache fails
      return await fetchFunction

        const { values, errors, touched, isSubmitting, isValid } = this.state;

        return (
          <WrappedComponent
            {...this.props}
            formState={this.state}
            handleChange={this.handleChange}
            handleBlur={this.handleBlur}
            handleSubmit={this.handleSubmit}
            setFieldValue={this.setFieldValue}
            resetForm={this.resetForm}
          />
        );
      }
    };
  };
}

// Usage examples
const AuthenticatedDashboard = withAuth(Dashboard);
const UserProfile = withData(fetchUserProfile, 'user')(Profile);
const LoginForm = withForm({ email: '', password: '' })(FormComponent);

export { withAuth, withData, withForm };
```

#### Render Props Pattern
```jsx
import React, { Component } from 'react';

// Mouse position tracker using render props
class MouseTracker extends Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  };

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// Data fetching with render props
class DataFetcher extends Component {
  state = {
    data: null,
    loading: true,
    error: null
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.fetchData();
    }
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });

    try {
      const response = await fetch(this.props.url);
      const data = await response.json();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  };

  render() {
    return this.props.children(this.state);
  }
}

// Usage
function App() {
  return (
    <div>
      <MouseTracker
        render={({ x, y }) => (
          <div>
            Mouse position: {x}, {y}
          </div>
        )}
      />

      <DataFetcher url="/api/users">
        {({ data, loading, error }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error: {error.message}</div>;
          return (
            <ul>
              {data.map(user => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          );
        }}
      </DataFetcher>
    </div>
  );
}
```

#### Compound Components Pattern
```jsx
import React, { createContext, useContext, useState } from 'react';

// Create context for compound components
const TabsContext = createContext();

// Main Tabs component
function Tabs({ children, defaultActive = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultActive);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// TabList component
function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

// Individual Tab component
function Tab({ index, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  return (
    <button
      className={`tab ${activeTab === index ? 'active' : ''}`}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
}

// TabPanels component
function TabPanels({ children }) {
  return <div className="tab-panels">{children}</div>;
}

// Individual TabPanel component
function TabPanel({ index, children }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== index) return null;

  return <div className="tab-panel">{children}</div>;
}

// Assign compound components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = TabPanels;
Tabs.Panel = TabPanel;

// Usage
function App() {
  return (
    <Tabs defaultActive={0}>
      <Tabs.List>
        <Tabs.Tab index={0}>Home</Tabs.Tab>
        <Tabs.Tab index={1}>Profile</Tabs.Tab>
        <Tabs.Tab index={2}>Settings</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panels>
        <Tabs.Panel index={0}>
          <h2>Home</h2>
          <p>Welcome to the home page!</p>
        </Tabs.Panel>
        <Tabs.Panel index={1}>
          <h2>Profile</h2>
          <p>This is your profile page.</p>
        </Tabs.Panel>
        <Tabs.Panel index={2}>
          <h2>Settings</h2>
          <p>Configure your settings here.</p>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
}
```

---

## 13. React Hooks & State Management

### Advanced Custom Hooks

#### useLocalStorage Hook
```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', 'John');
  const [todos, setTodos] = useLocalStorage('todos', []);

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>

      <button onClick={() => setTodos([...todos, `Task ${todos.length + 1}`])}>
        Add Todo
      </button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### useAsync Hook for Data Fetching
```jsx
import { useState, useEffect, useCallback, useRef } from 'react';

function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // Use useRef to store the latest function
  const asyncFunctionRef = useRef();
  asyncFunctionRef.current = asyncFunction;

  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);

    return asyncFunctionRef.current()
      .then((response) => {
        setValue(response);
        setStatus('success');
        return response;
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
        throw error;
      });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  // Reset function
  const reset = useCallback(() => {
    setStatus('idle');
    setValue(null);
    setError(null);
  }, []);

  return { execute, status, value, error, reset };
}

// Usage
function UserProfile({ userId }) {
  const {
    execute: fetchUser,
    status,
    value: user,
    error
  } = useAsync(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  }, false); // Don't execute immediately

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  if (status === 'idle') return <div>Ready to fetch user</div>;
  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

#### useDebounce Hook
```jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage for search
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

#### useIntersectionObserver Hook
```jsx
import { useEffect, useRef, useState } from 'react';

function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0,
        root: null,
        rootMargin: '0%',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [ref, isIntersecting, entry];
}

// Usage for infinite scroll
function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [sentinelRef, isIntersecting] = useIntersectionObserver({
    threshold: 1.0
  });

  useEffect(() => {
    if (isIntersecting && !loading && hasMore) {
      loadMoreItems();
    }
  }, [isIntersecting, loading, hasMore]);

  const loadMoreItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items?page=${items.length / 10 + 1}`);
      const newItems = await response.json();

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="item">
          {item.title}
        </div>
      ))}

      {loading && <div>Loading...</div>}

      {hasMore && (
        <div ref={sentinelRef} style={{ height: '20px' }}>
          Loading more...
        </div>
      )}
    </div>
  );
}
```

---

## 14. React Router & Single Page Applications

### Advanced Routing Patterns

#### Protected Routes with Authentication
```jsx
import React, { useContext, createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Auth Context
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData);
      return { success: true };
    } else {
      return { success: false, error: await response.text() };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected Route Component
function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <Admin />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
```

#### Nested Routes and Layouts
```jsx
import React from 'react';
import { Routes, Route, Outlet, Link, useParams, useNavigate } from 'react-router-dom';

// Layout component with nested routes
function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/profile">Profile</Link>
        <Link to="/dashboard/settings">Settings</Link>
        <Link to="/dashboard/posts">Posts</Link>
      </nav>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

// Posts layout with sub-navigation
function PostsLayout() {
  return (
    <div className="posts">
      <nav className="posts-nav">
        <Link to="/dashboard/posts">All Posts</Link>
        <Link to="/dashboard/posts/drafts">Drafts</Link>
        <Link to="/dashboard/posts/published">Published</Link>
      </nav>

      <div className="posts-content">
        <Outlet />
      </div>
    </div>
  );
}

// Individual post component
function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Post {postId}</h2>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate('/dashboard/posts')}>All Posts</button>
    </div>
  );
}

// Main App with nested routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />

        <Route path="posts" element={<PostsLayout />}>
          <Route index element={<AllPosts />} />
          <Route path="drafts" element={<DraftPosts />} />
          <Route path="published" element={<PublishedPosts />} />
          <Route path=":postId" element={<Post />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

#### Route Guards and Navigation
```jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Route guard hook
function useRouteGuard(guardFunction) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const shouldAllow = guardFunction();

    if (!shouldAllow) {
      navigate('/login', {
        state: { from: location },
        replace: true
      });
    }
  }, [guardFunction, navigate, location]);
}

// Navigation prompt for unsaved changes
function useNavigationPrompt(hasUnsavedChanges) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const confirmNavigation = (to) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );

      if (confirmed) {
        navigate(to);
      }
    } else {
      navigate(to);
    }
  };

  return confirmNavigation;
}

// Breadcrumb navigation
function useBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbs = pathnames.map((pathname, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const name = pathname.charAt(0).toUpperCase() + pathname.slice(1);

    return {
      name,
      path: routeTo
    };
  });

  return [{ name: 'Home', path: '/' }, ...breadcrumbs];
}

function BreadcrumbNav() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="breadcrumb-item">
            {index === breadcrumbs.length - 1 ? (
              <span>{crumb.name}</span>
            ) : (
              <Link to={crumb.path}>{crumb.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

---

## 15. Redux & Advanced State Management

### Advanced Redux Patterns

#### Redux Toolkit Setup
```jsx
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for API calls
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      role: 'all',
      status: 'all'
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, setPage, clearError, updateUser, removeUser } = usersSlice.actions;

// Store configuration
export const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
    // Add other slices here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(/* custom middleware */),
  devTools: process.env.NODE_ENV !== 'production'
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### Custom Redux Middleware
```javascript
// Logger middleware
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('Previous State:', store.getState());
  console.log('Action:', action);
  const result = next(action);
  console.log('Next State:', store.getState());
  console.groupEnd();
  return result;
};

// API middleware
const api = (store) => (next) => async (action) => {
  if (!action.meta || !action.meta.api) {
    return next(action);
  }

  const { url, method = 'GET', data, onSuccess, onError } = action.meta.api;

  next({ ...action, type: `${action.type}_PENDING` });

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    next({
      type: `${action.type}_SUCCESS`,
      payload: result,
      meta: action.meta
    });

    if (onSuccess) {
      store.dispatch(onSuccess(result));
    }

  } catch (error) {
    next({
      type: `${action.type}_ERROR`,
      error: error.message,
      meta: action.meta
    });

    if (onError) {
      store.dispatch(onError(error));
    }
  }
};

// Throttle middleware for actions
const throttle = (delay) => {
  let lastExecution = 0;
  return (store) => (next) => (action) => {
    if (action.meta && action.meta.throttle) {
      const now = Date.now();
      if (now - lastExecution < delay) {
        return;
      }
      lastExecution = now;
    }
    return next(action);
  };
};

// Crash reporting middleware
const crashReporter = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Caught an exception!', error);

    // Send error to crash reporting service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        action: action,
        state: store.getState()
      })
    });

    throw error;
  }
};

// Apply middleware
const store = createStore(
  rootReducer,
  applyMiddleware(
    crashReporter,
    logger,
    api,
    throttle(1000) // 1 second throttle
  )
);
```

#### Redux Saga for Complex Async Logic
```javascript
import { call, put, takeEvery, takeLatest, all, delay } from 'redux-saga/effects';

// Worker saga
function* fetchUsersSaga(action) {
  try {
    yield put({ type: 'FETCH_USERS_PENDING' });

    const users = yield call(fetchUsersAPI, action.payload);
    yield put({ type: 'FETCH_USERS_SUCCESS', payload: users });

    // Dispatch success notification
    yield put({
      type: 'SHOW_NOTIFICATION',
      payload: { message: 'Users loaded successfully', type: 'success' }
    });

  } catch (error) {
    yield put({ type: 'FETCH_USERS_ERROR', error: error.message });

    // Dispatch error notification
    yield put({
      type: 'SHOW_NOTIFICATION',
      payload: { message: error.message, type: 'error' }
    });
  }
}

// Watcher saga
function* watchFetchUsers() {
  yield takeLatest('FETCH_USERS_REQUEST', fetchUsersSaga);
}

// Debounced search saga
function* searchSaga(action) {
  yield delay(300); // Debounce for 300ms
  yield put({ type: 'SEARCH_REQUEST', payload: action.payload });
}

// Watcher for debounced search
function* watchSearch() {
  yield takeLatest('SEARCH_INPUT', searchSaga);
}

// Infinite scroll saga
function* loadMoreSaga(action) {
  try {
    const { page, limit } = action.payload;
    const items = yield call(fetchItemsAPI, { page, limit });

    if (items.length > 0) {
      yield put({ type: 'LOAD_MORE_SUCCESS', payload: items });
    } else {
      yield put({ type: 'LOAD_MORE_END' });
    }
  } catch (error) {
    yield put({ type: 'LOAD_MORE_ERROR', error: error.message });
  }
}

function* watchLoadMore() {
  yield takeEvery('LOAD_MORE_REQUEST', loadMoreSaga);
}

// Authentication saga
function* loginSaga(action) {
  try {
    const { email, password } = action.payload;

    const user = yield call(loginAPI, { email, password });
    yield put({ type: 'LOGIN_SUCCESS', payload: user });

    // Redirect after successful login
    yield put({ type: 'NAVIGATE', payload: '/dashboard' });

  } catch (error) {
    yield put({ type: 'LOGIN_ERROR', error: error.message });
  }
}

function* logoutSaga() {
  try {
    yield call(logoutAPI);
    yield put({ type: 'LOGOUT_SUCCESS' });
    yield put({ type: 'NAVIGATE', payload: '/login' });
  } catch (error) {
    // Even if logout fails, clear local state
    yield put({ type: 'LOGOUT_SUCCESS' });
  }
}

function* watchAuth() {
  yield takeLatest('LOGIN_REQUEST', loginSaga);
  yield takeLatest('LOGOUT_REQUEST', logoutSaga);
}

// Root saga
export default function* rootSaga() {
  yield all([
    watchFetchUsers(),
    watchSearch(),
    watchLoadMore(),
    watchAuth()
  ]);
}

// API functions
function* fetchUsersAPI(params) {
  const response = yield call(fetch, '/api/users', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return yield call([response, response.json]);
}

function* loginAPI(credentials) {
  const response = yield call(fetch, '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return yield call([response, response.json]);
}
```

---

## 16. Authentication & Security

### JWT Authentication System
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// JWT utilities
class JWTUtils {
  static generateAccessToken(payload, expiresIn = '15m') {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });
  }

  static generateRefreshToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static generateTokenPair(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresIn: 15 * 60 * 1000 // 15 minutes in milliseconds
    };
  }
}

// Password utilities
class PasswordUtils {
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

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = JWTUtils.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

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

// Auth routes
const express = require('express');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await PasswordUtils.hash(password);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      emailVerificationToken: crypto.randomBytes(32).toString('hex')
    });

    await user.save();

    // Send verification email (implementation not shown)
    // await sendVerificationEmail(user.email, user.emailVerificationToken);

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await PasswordUtils.verify(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    const tokens = JWTUtils.generateTokenPair(user);

    // Store refresh token securely (in production, use Redis)
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
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = JWTUtils.verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const tokens = JWTUtils.generateTokenPair(user);

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
router.post('/logout', authenticateToken, async (req, res) => {
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
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    const resetToken = PasswordUtils.generateResetToken();
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

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = await PasswordUtils.hash(newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = { router, authenticateToken, authorizeRoles, JWTUtils, PasswordUtils };
```

---

## 17. Testing Strategies & Quality Assurance

### Comprehensive Testing Setup
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.js',
    '!src/setupTests.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ]
};
```

#### Unit Testing with Jest
```javascript
// src/utils/math.test.js
const { add, subtract, multiply, divide } = require('./math');

describe('Math Utilities', () => {
  describe('add', () => {
    test('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('adds positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });

    test('adds two negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    test('adds with zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    test('subtracts two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    test('subtracts negative numbers', () => {
      expect(subtract(5, -3)).toBe(8);
    });
  });

  describe('multiply', () => {
    test('multiplies two numbers', () => {
      expect(multiply(2, 3)).toBe(6);
    });

    test('multiplies with zero', () => {
      expect(multiply(0, 5)).toBe(0);
    });

    test('multiplies negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6);
      expect(multiply(-2, -3)).toBe(6);
    });
  });

  describe('divide', () => {
    test('divides two numbers', () => {
      expect(divide(6, 3)).toBe(2);
    });

    test('divides with decimal result', () => {
      expect(divide(5, 2)).toBe(2.5);
    });

    test('throws error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('Cannot divide by zero');
    });

    test('divides negative numbers', () => {
      expect(divide(-6, 3)).toBe(-2);
      expect(divide(-6, -3)).toBe(2);
    });
  });
});

// src/components/Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('btn-primary');

    rerender(<Button variant="secondary">Button</Button>);
    expect(screen.getByText('Button')).toHaveClass('btn-secondary');
  });

  test('is disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('shows loading state', () => {
    render(<Button loading>Submit</Button>);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });
});
```

#### Integration Testing
```javascript
// src/__tests__/integration/UserManagement.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Management Integration', () => {
  describe('POST /api/users', () => {
    test('creates a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password'); // Password should not be returned

      // Verify user was saved to database
      const savedUser = await User.findById(response.body._id);
      expect(savedUser).toBeTruthy();
      expect(savedUser.name).toBe(userData.name);
    });

    test('fails with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('fails with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      //

}

export default App;
```

## 7. Advanced JavaScript Patterns

### Design Patterns in JavaScript

#### Singleton Pattern
```javascript
// Database connection singleton
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.connection = null;
    DatabaseConnection.instance = this;
  }

  async connect(uri) {
    if (this.connection) {
      return this.connection;
    }

    try {
      this.connection = await mongoose.connect(uri);
      console.log('Database connected successfully');
      return this.connection;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      DatabaseConnection.instance = null;
    }
  }
}

// Usage
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();

console.log(db1 === db2); // true - same instance
```

#### Factory Pattern
```javascript
// Notification factory
class NotificationFactory {
  static createNotification(type, config) {
    switch (type) {
      case 'email':
        return new EmailNotification(config);
      case 'sms':
        return new SMSNotification(config);
      case 'push':
        return new PushNotification(config);
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

class EmailNotification {
  constructor({ to, subject, body }) {
    this.to = to;
    this.subject = subject;
    this.body = body;
  }

  async send() {
    // Send email logic
    console.log(`Sending email to ${this.to}: ${this.subject}`);
  }
}

class SMSNotification {
  constructor({ phone, message }) {
    this.phone = phone;
    this.message = message;
  }

  async send() {
    // Send SMS logic
    console.log(`Sending SMS to ${this.phone}: ${this.message}`);
  }
}

// Usage
const emailNotification = NotificationFactory.createNotification('email', {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Welcome to our platform'
});

const smsNotification = NotificationFactory.createNotification('sms', {
  phone: '+1234567890',
  message: 'Your verification code is 123456'
});
```

#### Observer Pattern
```javascript
// Event system using Observer pattern
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

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in ${event} callback:`, error);
      }
    });
  }

  once(event, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
}

// Usage
const userEvents = new EventEmitter();

userEvents.on('userRegistered', (user) => {
  console.log(`New user registered: ${user.name}`);
  // Send welcome email
});

userEvents.on('userLoggedIn', (user) => {
  console.log(`User logged in: ${user.name}`);
  // Update last login time
});

// Emit events
userEvents.emit('userRegistered', { id: 1, name: 'John Doe' });
userEvents.emit('userLoggedIn', { id: 1, name: 'John Doe' });
```

---

## 8. Node.js & Server-Side JavaScript

### Advanced Node.js Patterns

#### Clustering for Multi-Core Utilization
```javascript
const cluster = require('cluster');
const os = require('os');
const express = require('express');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.log('Starting a new worker');
    cluster.fork();
  });

  // Handle messages from workers
  cluster.on('message', (worker, message) => {
    console.log(`Message from worker ${worker.process.pid}:`, message);
  });

} else {
  // Worker process
  const app = express();

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello from worker ' + process.pid,
      timestamp: new Date().toISOString()
    });
  });

  app.get('/cluster-info', (req, res) => {
    res.json({
      workerId: cluster.worker.id,
      processId: process.pid,
      uptime: process.uptime()
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} listening on port ${PORT}`);
  });

  // Send message to master
  process.send({ type: 'worker-started', pid: process.pid });
}
```

#### Worker Threads for CPU-Intensive Tasks
```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const express = require('express');

if (isMainThread) {
  // Main thread
  const app = express();
  const workers = new Map();

  app.get('/calculate/:number', (req, res) => {
    const number = parseInt(req.params.number);

    // Create worker for CPU-intensive calculation
    const worker = new Worker(__filename, {
      workerData: { number }
    });

    const workerId = Date.now().toString();
    workers.set(workerId, worker);

    worker.on('message', (result) => {
      res.json({
        input: number,
        result: result,
        calculatedBy: 'worker-thread'
      });
      workers.delete(workerId);
    });

    worker.on('error', (error) => {
      res.status(500).json({ error: error.message });
      workers.delete(workerId);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      worker.terminate();
      workers.delete(workerId);
      if (!res.headersSent) {
        res.status(408).json({ error: 'Calculation timeout' });
      }
    }, 30000);
  });

  app.listen(3000, () => {
    console.log('Main thread listening on port 3000');
  });

} else {
  // Worker thread
  const { number } = workerData;

  // Simulate CPU-intensive calculation (Fibonacci)
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  const result = fibonacci(number);
  parentPort.postMessage(result);
}
```

#### Streams for Large File Processing
```javascript
const fs = require('fs');
const path = require('path');
const { Transform, pipeline } = require('stream');
const express = require('express');

const app = express();

// File upload with streaming
app.post('/upload', (req, res) => {
  const uploadPath = path.join(__dirname, 'uploads');
  const fileName = `upload_${Date.now()}.txt`;
  const filePath = path.join(uploadPath, fileName);

  // Create write stream
  const writeStream = fs.createWriteStream(filePath);

  // Handle upload stream
  req.pipe(writeStream);

  writeStream.on('finish', () => {
    res.json({
      message: 'File uploaded successfully',
      fileName: fileName,
      size: req.headers['content-length']
    });
  });

  writeStream.on('error', (error) => {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  });
});

// Large file processing with transform streams
class DataProcessor extends Transform {
  constructor(options = {}) {
    super(options);
    this.lineCount = 0;
    this.processedData = [];
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');

    for (const line of lines) {
      if (line.trim()) {
        this.lineCount++;
        // Process each line (e.g., parse JSON, validate data, etc.)
        try {
          const data = JSON.parse(line);
          this.processedData.push({
            ...data,
            processed: true,
            lineNumber: this.lineCount
          });
        } catch (error) {
          // Handle invalid JSON
          this.processedData.push({
            error: 'Invalid JSON',
            line: line,
            lineNumber: this.lineCount
          });
        }
      }
    }

    callback();
  }

  _flush(callback) {
    // Final processing
    this.push(JSON.stringify({
      totalLines: this.lineCount,
      processedData: this.processedData,
      summary: {
        validRecords: this.processedData.filter(item => !item.error).length,
        invalidRecords: this.processedData.filter(item => item.error).length
      }
    }, null, 2));

    callback();
  }
}

// Process large file
app.get('/process-file/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const readStream = fs.createReadStream(filePath);
  const processor = new DataProcessor();

  res.setHeader('Content-Type', 'application/json');

  pipeline(readStream, processor, res, (error) => {
    if (error) {
      console.error('Pipeline error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Processing failed' });
      }
    }
  });
});

// File download with streaming
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const stat = fs.statSync(filePath);
  const readStream = fs.createReadStream(filePath);

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`);
  res.setHeader('Content-Length', stat.size);

  readStream.pipe(res);

  readStream.on('error', (error) => {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 9. Express.js Framework & API Development

### Advanced Express Patterns

#### Middleware Architecture
```javascript
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom middleware for request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// API versioning middleware
app.use('/api/v1', (req, res, next) => {
  req.apiVersion = 'v1';
  next();
});

app.use('/api/v2', (req, res, next) => {
  req.apiVersion = 'v2';
  next();
});

// Authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.substring(7);

  try {
    // Verify JWT token (simplified)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Role-based authorization middleware
function authorize(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(err.status || 500).json({
    error: {
      message: isDevelopment ? err.message : 'Internal server error',
      ...(isDevelopment && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      path: req.path,
      method: req.method
    }
  });
});

// Routes with middleware
app.get('/api/public', (req, res) => {
  res.json({ message: 'Public endpoint' });
});

app.get('/api/protected', authenticate, (req, res) => {
  res.json({
    message: 'Protected endpoint',
    user: req.user
  });
});

app.get('/api/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({
    message: 'Admin only endpoint',
    user: req.user
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Advanced Routing Patterns
```javascript
const express = require('express');
const router = express.Router();

// Parameter validation middleware
function validateObjectId(req, res, next) {
  const id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
}

// Query parameter validation
function validateQuery(req, res, next) {
  const { page, limit, sort } = req.query;

  if (page && (isNaN(page) || page < 1)) {
    return res.status(400).json({ error: 'Invalid page number' });
  }

  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    return res.status(400).json({ error: 'Invalid limit (1-100)' });
  }

  if (sort && !['asc', 'desc'].includes(sort.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid sort order' });
  }

  next();
}

// Nested routes
const usersRouter = express.Router();
const postsRouter = express.Router();

// Users routes
usersRouter.get('/', validateQuery, async (req, res) => {
  const { page = 1, limit = 10, sort = 'desc' } = req.query;

  // Fetch users with pagination
  const users = await User.find()
    .sort({ createdAt: sort })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments();

  res.json({
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

usersRouter.get('/:id', validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

usersRouter.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

usersRouter.put('/:id', validateObjectId, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

usersRouter.delete('/:id', validateObjectId, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'User deleted successfully' });
});

// Nested posts routes under users
usersRouter.use('/:userId/posts', postsRouter);

// Posts routes (nested under users)
postsRouter.get('/', validateObjectId, async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const posts = await Post.find({ author: userId })
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Post.countDocuments({ author: userId });

  res.json({
    posts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

postsRouter.post('/', validateObjectId, async (req, res) => {
  try {
    const { userId } = req.params;
    const post = new Post({
      ...req.body,
      author: userId
    });

    await post.save();
    await post.populate('author', 'name email');

    res.status(201).json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mount routers
app.use('/api/users', usersRouter);

// Export for testing
module.exports = app;
```

---

## 10. MongoDB & NoSQL Database Design

### Advanced MongoDB Patterns

#### Database Schema Design
```javascript
const mongoose = require('mongoose');

// User schema with validation
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 50,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Don't include in queries by default
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: {
      type: String,
      maxlength: 500
    },
    location: String,
    website: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(v);
        },
        message: 'Invalid website URL'
      }
    }
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Instance method for password verification
userSchema.methods.verifyPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Post-save middleware for logging
userSchema.post('save', function(doc) {
  console.log(`User ${doc.username} saved with ID: ${doc._id}`);
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'profile.location': 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

// Post schema with relationships
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['technology', 'lifestyle', 'business', 'health', 'education']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate excerpt and slug
postSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 300) + '...';
  }

  if (this.isModified('title') && !this.seo.slug) {
    this.seo.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Method to check if user liked the post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Static method for popular posts
postSchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ views: -1, likes: -1 })
    .limit(limit)
    .populate('author', 'username profile');
};

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ category: 1 });
postSchema.index({ 'seo.slug': 1 });

const Post = mongoose.model('Post', postSchema);

// Comment schema
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date
}, {
  timestamps: true
});

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { User, Post, Comment };
```

#### Advanced Query Patterns
```javascript
const mongoose = require('mongoose');
const { User, Post, Comment } = require('./models');

// Complex aggregation pipeline
async function getUserAnalytics(userId) {
  const analytics = await User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'author',
        as: 'posts'
      }
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'author',
        as: 'comments'
      }
    },
    {
      $project: {
        username: 1,
        email: 1,
        profile: 1,
        createdAt: 1,
        postCount: { $size: '$posts' },
        commentCount: { $size: '$comments' },
        totalViews: { $sum: '$posts.views' },
        totalLikes: { $sum: '$posts.likes' },
        recentPosts: {
          $slice: ['$posts', 5]
        }
      }
    }
  ]);

  return analytics[0];
}

// Text search with scoring
async function searchPosts(query, options = {}) {
  const { page = 1, limit = 10, category, tags } = options;

  let matchStage = {
    status: 'published',
    $text: { $search: query }
  };

  if (category) {
    matchStage.category = category;
  }

  if (tags && tags.length > 0) {
    matchStage.tags = { $in: tags };
  }

  const posts = await Post.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    { $unwind: '$author' },
    {
      $project: {
        title: 1,
        excerpt: 1,
        category: 1,
        tags: 1,
        publishedAt: 1,
        views: 1,
        likeCount: { $size: '$likes' },
        commentCount: { $size: '$comments' },
        score: { $meta: 'textScore' },
        author: {
          username: '$author.username',
          profile: '$author.profile'
        }
      }
    },
    { $sort: { score: { $meta: 'textScore' }, publishedAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ]);

  const total = await Post.countDocuments(matchStage);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// Real-time analytics with change streams
function watchPostAnalytics() {
  const changeStream = Post.watch();

  changeStream.on('change', (change) => {
    switch (change.operationType) {
      case 'insert':
        console.log('New post created:', change.fullDocument.title);
        break;
      case 'update':
        const updatedFields = change.updateDescription.updatedFields;
        if (updatedFields.views) {
          console.log(`Post views updated: ${change.documentKey._id} - ${updatedFields.views}`);
        }
        break;
      case 'delete':
        console.log('Post deleted:', change.documentKey._id);
        break;
    }
  });

  return changeStream;
}

// Bulk operations for performance
async function bulkUpdatePostViews(postIds, increment = 1) {
  const bulkOps = postIds.map(postId => ({
    updateOne: {
      filter: { _id: mongoose.Types.ObjectId(postId) },
      update: { $inc: { views: increment } }
    }
  }));

  const result = await Post.bulkWrite(bulkOps);
  return result.modifiedCount;
}

// Geospatial queries (if using location data)
async function findNearbyUsers(longitude, latitude, maxDistance = 10000) {
  const users = await User.find({
    'profile.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  }).limit(20);

  return users;
}

module.exports = {
  getUserAnalytics,
  searchPosts,
  watchPostAnalytics,
  bulkUpdatePostViews,
  findNearbyUsers
};
```

---

## 11. Mongoose ODM & Data Modeling

### Advanced Mongoose Features

#### Plugins and Middleware
```javascript
const mongoose = require('mongoose');

// Soft delete plugin
function softDeletePlugin(schema, options) {
  // Add fields to schema
  schema.add({
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  });

  // Add instance methods
  schema.methods.softDelete = function() {
    this.deleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = function() {
    this.deleted = false;
    this.deletedAt = undefined;
    return this.save();
  };

  // Add static methods
  schema.statics.findNotDeleted = function(...args) {
    return this.find({ deleted: { $ne: true } }, ...args);
  };

  schema.statics.findDeleted = function(...args) {
    return this.find({ deleted: true }, ...args);
  };

  // Add query helpers
  schema.query.notDeleted = function() {
    return this.where({ deleted: { $ne: true } });
  };

  schema.query.deleted = function() {
    return this.where({ deleted: true });
  };

  // Pre-find middleware to exclude deleted documents
  schema.pre(/^find/, function(next) {
    if (!this._conditions.deleted) {
      this.where({ deleted: { $ne: true } });
    }
    next();
  });
}

// Pagination plugin
function paginationPlugin(schema, options) {
  schema.statics.paginate = async function(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;

    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.countDocuments(query)
    ]);

    return {
      docs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    };
  };
}

// Audit trail plugin
function auditPlugin(schema, options) {
  schema.add({
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  });

  schema.pre('save', function(next) {
    if (this.isNew) {
      this.createdAt = new Date();
      this.createdBy = this._user; // Set by middleware
    } else {
      this.updatedAt = new Date();
      this.updatedBy = this._user;
    }
    next();
  });

  // Method to set current user for audit
  schema.methods.setAuditUser = function(userId) {
    this._user = userId;
    return this;
  };
}

// Rate limiting plugin for documents
function rateLimitPlugin(schema, options) {
  const { windowMs = 15 * 60 * 1000, max = 100 } = options;

  schema.add({
    rateLimit: [{
      timestamp: Date,
      count: { type: Number, default: 1 }
    }]
  });

  schema.methods.checkRateLimit = function() {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);

    // Clean old entries
    this.rateLimit = this.rateLimit.filter(entry => entry.timestamp > windowStart);

    // Count requests in current window
    const currentCount = this.rateLimit.reduce((sum, entry) => sum + entry.count, 0);

    if (currentCount >= max) {
      return false; // Rate limit exceeded
    }

    // Add new entry
    this.rateLimit.push({ timestamp: now });
    return true;
  };

  schema.methods.getRemainingRequests = function() {
    const now = new Date();
    const windowStart = new Date(now.getTime() - windowMs);

    this.rateLimit = this.rateLimit.filter(entry => entry.timestamp > windowStart);
    const currentCount = this.rateLimit.reduce((sum, entry) => sum + entry.count, 0);

    return Math.max(0, max - currentCount);
  };
}

// Usage example
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' }
});

// Apply plugins
userSchema.plugin(softDeletePlugin);
userSchema.plugin(paginationPlugin);
userSchema.plugin(auditPlugin);
userSchema.plugin(rateLimitPlugin, { windowMs: 60 * 1000, max: 10 }); // 10 requests per minute

const User = mongoose.model('User', userSchema);

// Usage
async function exampleUsage() {
  // Create user with audit
  const user = new User({
    username: 'johndoe',
    email: 'john@example.com'
  }).setAuditUser(currentUserId);

  await user.save();

  // Check rate limit
  if (!user.checkRateLimit()) {
    throw new Error('Rate limit exceeded');
  }

  // Paginated query
  const result = await User.paginate(
    { role: 'user' },
    { page: 1, limit: 10 }
  );

  // Soft delete
  await user.softDelete();

  // Find not deleted
  const activeUsers = await User.findNotDeleted();
}
```

#### Advanced Population and Relationships
```javascript
const mongoose = require('mongoose');

// Define schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  profile: {
    firstName: String,
    lastName: String,
    avatar: String
  }
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const commentSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const tagSchema = new mongoose.Schema({
  name: String,
  slug: String,
  color: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

// Create models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Tag = mongoose.model('Tag', tagSchema);
const Category = mongoose.model('Category', categorySchema);

// Advanced population examples
async function getPostsWithFullDetails() {
  return await Post.find()
    .populate({
      path: 'author',
      select: 'username profile',
      populate: {
        path: 'profile',
        select: 'firstName lastName avatar'
      }
    })
    .populate({
      path: 'tags',
      select: 'name color'
    })
    .populate({
      path: 'category',
      select: 'name slug'
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'author',
          select: 'username profile.avatar'
        },
        {
          path: 'replies',
          populate: {
            path: 'author',
            select: 'username'
          }
        }
      ]
    })
    .sort({ createdAt: -1 });
}

// Selective population based on conditions
async function getPostSummary(postId, includeComments = false) {
  const query = Post.findById(postId)
    .populate('author', 'username profile.firstName profile.lastName')
    .populate('tags', 'name')
    .populate('category', 'name');

  if (includeComments) {
    query.populate({
      path: 'comments',
      select: 'content createdAt',
      populate: {
        path: 'author',
        select: 'username'
      }
    });
  }

  return await query;
}

// Virtual population for reverse relationships
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author'
});

userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'author'
});

// Enable virtuals in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Usage with virtuals
async function getUserWithPosts(userId) {
  return await User.findById(userId)
    .populate('posts', 'title createdAt')
    .populate('comments', 'content createdAt');
}

// Aggregation with population
async function getPopularTags() {
  return await Tag.aggregate([
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'tags',
        as: 'posts'
      }
    },
    {
      $addFields: {
        postCount: { $size: '$posts' }
      }
    },
    {
      $sort: { postCount: -1 }
    },
    {
      $limit: 10
    },
    {
      $project: {
        name: 1,
        slug: 1,
        color: 1,
        postCount: 1
      }
    }
  ]);
}

// Deep population with custom options
async function getPostWithDeepPopulation(postId) {
  return await Post.findById(postId)
    .populate({
      path: 'comments',
      populate: {
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username profile.avatar'
        }
      },
      options: { sort: { createdAt: 1 } }
    })
    .populate('author', 'username profile')
    .populate('tags', 'name slug color');
}

module.exports = {
  User,
  Post,
  Comment,
  Tag,
  Category,
  getPostsWithFullDetails,
  getPostSummary,
  getUserWithPosts,
  getPopularTags,
  getPostWithDeepPopulation
};
```

---

## 12. React Fundamentals & Component Architecture

### Advanced React Patterns

#### Higher-Order Components (HOC)
```jsx
import React, { Component } from 'react';

// Basic HOC for authentication
function withAuth(WrappedComponent) {
  return class extends Component {
    state = {
      isAuthenticated: false,
      user: null,
      loading: true
    };

    componentDidMount() {
      this.checkAuthStatus();
    }

    checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
          const user = await response.json();
          this.setState({ isAuthenticated: true, user, loading: false });
        } else {
          this.setState({ isAuthenticated: false, loading: false });
        }
      } catch (error) {
        this.setState({ isAuthenticated: false, loading: false });
      }
    };

    render() {
      const { isAuthenticated, user, loading } = this.state;

      if (loading) {
        return <div>Loading...</div>;
      }

      return (
        <WrappedComponent
          {...this.props}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={this.handleLogout}
        />
      );
    }
  };
}

// HOC for data fetching
function withData(fetchFunction, dataPropName = 'data') {
  return function(WrappedComponent) {
    return class extends Component {
      state = {
        data: null,
        loading: true,
        error: null
      };

      componentDidMount() {
        this.fetchData();
      }

      componentDidUpdate(prevProps) {
        // Refetch if props changed
        if (JSON.stringify(this.props) !== JSON.stringify(prevProps)) {
          this.fetchData();
        }
      }

      fetchData = async () => {
        this.setState({ loading: true, error: null });

        try {
          const data = await fetchFunction(this.props);
          this.setState({ data, loading: false });
        } catch (error) {
          this.setState({ error, loading: false });
        }
      };

      render() {
        const { data, loading, error } = this.state;

        return (
          <WrappedComponent
            {...this.props}
            {...{ [dataPropName]: data }}
            loading={loading}
            error={error}
            refetch={this.fetchData}
          />
        );
      }
    };
  };
}

// HOC for form handling
function withForm(initialValues = {}, validationSchema = null) {
  return function(WrappedComponent) {
    return class extends Component {
      state = {
        values: { ...initialValues },
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: true
      };

      handleChange = (field) => (event) => {
        const value = event.target.value;
        this.setState(prev
}
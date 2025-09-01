### **Lesson 15: Deployment & DevOps**

## **1. What is Deployment?**

Deployment is the process of making your application available to users. It involves packaging your code, configuring environments, and making it accessible on servers or cloud platforms.

### **Deployment Types:**

- **Manual Deployment:** Manually uploading files to servers
- **Automated Deployment:** Using scripts and tools to automate the process
- **Continuous Deployment:** Automatic deployment on every code change
- **Blue-Green Deployment:** Switching between two identical environments
- **Canary Deployment:** Gradually rolling out changes to subsets of users

### **DevOps Principles:**

- **Automation:** Automate repetitive tasks
- **Continuous Integration:** Frequent code integration
- **Continuous Delivery:** Automated release process
- **Infrastructure as Code:** Manage infrastructure with code
- **Monitoring:** Track application performance and errors

## **2. Environment Management**

### **Environment Types:**

- **Development:** Local development environment
- **Staging:** Pre-production testing environment
- **Production:** Live environment for end users

### **Environment Variables:**

```javascript
// .env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
API_KEY=your-api-key

// config.js
require('dotenv').config();

const config = {
    development: {
        port: process.env.PORT || 3000,
        databaseUrl: process.env.DATABASE_URL,
        jwtSecret: process.env.JWT_SECRET
    },
    production: {
        port: process.env.PORT || 8080,
        databaseUrl: process.env.DATABASE_URL,
        jwtSecret: process.env.JWT_SECRET
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];
```

### **Environment-Specific Configurations:**

```javascript
// webpack.config.js
const path = require('path');

module.exports = (env) => {
    const isProduction = env.production;

    return {
        mode: isProduction ? 'production' : 'development',
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? '[name].[contenthash].js' : '[name].js'
        },
        // ... other config
    };
};
```

## **3. Docker Containerization**

### **What is Docker?**

Docker is a platform for developing, shipping, and running applications in containers. Containers package software with all its dependencies.

### **Dockerfile for Node.js:**

```dockerfile
# Use official Node.js runtime as base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

### **Docker Compose for Multi-Service Apps:**

```yaml
# docker-compose.yml
version: '3.8'

services:
    app:
        build: .
        ports:
            - "3000:3000"
        environment:
            - NODE_ENV=production
            - DATABASE_URL=mongodb://db:27017/myapp
        depends_on:
            - db
        volumes:
            - ./logs:/app/logs

    db:
        image: mongo:5.0
        ports:
            - "27017:27017"
        volumes:
            - mongodb_data:/data/db
        environment:
            - MONGO_INITDB_ROOT_USERNAME=admin
            - MONGO_INITDB_ROOT_PASSWORD=password

    nginx:
        image: nginx:alpine
        ports:
            - "80:80"
        volumes:
            - ./nginx.conf:/etc/nginx/nginx.conf
        depends_on:
            - app

volumes:
    mongodb_data:
```

### **Docker Commands:**

```bash
# Build image
docker build -t myapp .

# Run container
docker run -p 3000:3000 myapp

# Run with compose
docker-compose up -d

# View logs
docker logs container_name

# Execute commands in container
docker exec -it container_name sh

# Stop containers
docker-compose down

# Remove unused images
docker image prune -f
```

## **4. Cloud Platforms**

### **Heroku Deployment:**

```json
// package.json
{
    "scripts": {
        "start": "node server.js",
        "build": "npm run build",
        "heroku-postbuild": "npm run build"
    },
    "engines": {
        "node": "16.x"
    }
}
```

```javascript
// server.js
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello from Heroku!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

```bash
# Deploy to Heroku
heroku create my-app-name
git push heroku main
heroku open
```

### **Vercel Deployment (Frontend):**

```json
// vercel.json
{
    "version": 2,
    "builds": [
        {
            "src": "package.json",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "build"
            }
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "/index.html"
        }
    ]
}
```

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### **AWS Deployment:**

```javascript
// AWS Lambda function
exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Hello from AWS Lambda!'
        })
    };
};
```

```yaml
# serverless.yml
service: my-service

provider:
    name: aws
    runtime: nodejs16.x
    region: us-east-1

functions:
    api:
        handler: handler.handler
        events:
            - http:
                  path: /
                  method: get
```

## **5. CI/CD Pipelines**

### **GitHub Actions:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v3

        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
              node-version: '16'
              cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Run tests
          run: npm test

        - name: Build application
          run: npm run build

    deploy:
        needs: test
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'

        steps:
        - uses: actions/checkout@v3

        - name: Deploy to Heroku
          uses: akhileshns/heroku-deploy@v3.12.12
          with:
              heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
              heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
              heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

### **Jenkins Pipeline:**

```groovy
// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/user/repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker build -t myapp .'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            junit 'test-results/*.xml'
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
    }
}
```

## **6. Process Management**

### **PM2 for Node.js:**

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start app.js --name "my-app"

# Start with ecosystem file
pm2 start ecosystem.config.js

# View status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart my-app

# Stop application
pm2 stop my-app

# Delete application
pm2 delete my-app
```

```javascript
// ecosystem.config.js
module.exports = {
    apps: [{
        name: 'my-app',
        script: 'app.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'development',
            PORT: 3000
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 8080
        }
    }]
};
```

### **Systemd Service:**

```bash
# /etc/systemd/system/myapp.service
[Unit]
Description=My Node.js Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/node app.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable myapp
sudo systemctl start myapp

# View status
sudo systemctl status myapp

# View logs
sudo journalctl -u myapp -f
```

## **7. Database Deployment**

### **MongoDB Atlas (Cloud):**

```javascript
// Connection to MongoDB Atlas
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Additional options for production
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
```

### **PostgreSQL with Connection Pooling:**

```javascript
const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Query helper
const query = async (text, params) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing database connection pool...');
    await pool.end();
    console.log('Database connection pool closed.');
    process.exit(0);
});

module.exports = { query, pool };
```

## **8. Monitoring and Logging**

### **Application Monitoring:**

```javascript
// Winston for logging
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'my-app' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// If we're not in production then log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = logger;
```

### **Error Tracking:**

```javascript
// Sentry for error tracking
const Sentry = require('@sentry/node');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
});

// Error handling middleware
app.use(Sentry.Handlers.errorHandler());

// Custom error logging
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    Sentry.captureException(err);

    res.status(500).json({
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
```

### **Performance Monitoring:**

```javascript
// Response time middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});
```

## **9. Security Best Practices**

### **HTTPS Configuration:**

```javascript
const https = require('https');
const fs = require('fs');

// SSL certificates
const options = {
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem')
};

// HTTPS server
const server = https.createServer(options, app);

server.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

// Redirect HTTP to HTTPS
const httpApp = express();
httpApp.use((req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
});
httpApp.listen(80);
```

### **Security Headers:**

```javascript
const helmet = require('helmet');

// Basic security headers
app.use(helmet());

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
    },
}));

// CORS configuration
const cors = require('cors');
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));
```

### **Rate Limiting:**

```javascript
const rateLimit = require('express-rate-limit');

// General API rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Auth-specific rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit login attempts
    message: 'Too many authentication attempts, please try again later.',
});

app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);
```

## **10. Backup and Recovery**

### **Database Backup:**

```bash
# MongoDB backup
mongodump --db mydatabase --out /path/to/backup

# PostgreSQL backup
pg_dump mydatabase > backup.sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db mydatabase --out /backups/backup_$DATE

# Keep only last 7 backups
ls -t /backups | tail -n +8 | xargs -I {} rm /backups/{}
```

### **File Backup:**

```javascript
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create backup of uploads directory
const createBackup = () => {
    const output = fs.createWriteStream(`backup_${Date.now()}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        console.log(`Backup created: ${archive.pointer()} bytes`);
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);
    archive.directory('uploads/', false);
    archive.finalize();
};
```

## **11. Scaling Strategies**

### **Horizontal Scaling:**

```javascript
// Load balancer configuration (nginx)
upstream app_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://app_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **Caching Strategies:**

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache middleware
const cache = (duration) => {
    return (req, res, next) => {
        const key = `__express__${req.originalUrl}`;
        client.get(key, (err, cachedData) => {
            if (cachedData) {
                res.send(JSON.parse(cachedData));
            } else {
                const originalSend = res.send;
                res.send = (data) => {
                    client.setex(key, duration, JSON.stringify(data));
                    originalSend.call(res, data);
                };
                next();
            }
        });
    };
};

// Usage
app.get('/api/products', cache(300), (req, res) => {
    // Fetch products from database
    res.json(products);
});
```

## **12. Code Examples**

### **Example 1: Complete Docker Setup**

```dockerfile
# Dockerfile
FROM node:16-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S appuser -u 1001

# Change ownership and switch user
RUN chown -R appuser:nodejs /app
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
```

```javascript
// healthcheck.js
const http = require('http');

const options = {
    host: 'localhost',
    port: process.env.PORT || 3000,
    path: '/health',
    timeout: 2000
};

const request = http.request(options, (res) => {
    if (res.statusCode === 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

request.on('error', () => {
    process.exit(1);
});

request.end();
```

```yaml
# docker-compose.yml
version: '3.8'

services:
    app:
        build: .
        ports:
            - "3000:3000"
        environment:
            - NODE_ENV=production
            - DATABASE_URL=mongodb://db:27017/myapp
            - REDIS_URL=redis://redis:6379
        depends_on:
            - db
            - redis
        volumes:
            - ./logs:/app/logs
        restart: unless-stopped

    db:
        image: mongo:5.0
        volumes:
            - mongodb_data:/data/db
        environment:
            - MONGO_INITDB_ROOT_USERNAME=admin
            - MONGO_INITDB_ROOT_PASSWORD=securepassword
        restart: unless-stopped

    redis:
        image: redis:7-alpine
        volumes:
            - redis_data:/data
        restart: unless-stopped

    nginx:
        image: nginx:alpine
        ports:
            - "80:80"
            - "443:443"
        volumes:
            - ./nginx.conf:/etc/nginx/nginx.conf
            - ./ssl:/etc/ssl/certs
        depends_on:
            - app
        restart: unless-stopped

volumes:
    mongodb_data:
    redis_data:
```

### **Example 2: CI/CD Pipeline**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

env:
    NODE_VERSION: 16

jobs:
    test:
        runs-on: ubuntu-latest

        services:
            mongo:
                image: mongo:5.0
                ports:
                    - 27017:27017

        steps:
        - uses: actions/checkout@v3

        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
              node-version: ${{ env.NODE_VERSION }}
              cache: 'npm'

        - name: Install dependencies
          run: npm ci

        - name: Run linting
          run: npm run lint

        - name: Run tests
          run: npm test
          env:
              DATABASE_URL: mongodb://localhost:27017/test

        - name: Generate coverage report
          run: npm run test:coverage

        - name: Upload coverage to Codecov
          uses: codecov/codecov-action@v3
          with:
              file: ./coverage/lcov.info

    build-and-deploy:
        needs: test
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'

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
          run: docker build -t myapp:${{ github.sha }} .

        - name: Login to Docker Hub
          uses: docker/login-action@v2
          with:
              username: ${{ secrets.DOCKER_USERNAME }}
              password: ${{ secrets.DOCKER_PASSWORD }}

        - name: Push Docker image
          run: |
              docker tag myapp:${{ github.sha }} myapp:latest
              docker push myapp:latest

        - name: Deploy to production
          uses: appleboy/ssh-action@v0.1.7
          with:
              host: ${{ secrets.PRODUCTION_HOST }}
              username: ${{ secrets.PRODUCTION_USER }}
              key: ${{ secrets.PRODUCTION_SSH_KEY }}
              script: |
                  cd /opt/myapp
                  docker pull myapp:latest
                  docker-compose down
                  docker-compose up -d
                  docker system prune -f

        - name: Health check
          run: |
              sleep 30
              curl -f https://myapp.com/health || exit 1
```

### **Example 3: Production-Ready Express App**

```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const logger = require('./utils/logger');

const app = express();

// Trust proxy (important for rate limiting behind load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || false,
    credentials: true,
    optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
}).then(() => {
    logger.info('Connected to MongoDB');
}).catch((error) => {
    logger.error('Database connection error:', error);
    process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// Static files
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(err.status || 500).json({
        error: isDevelopment ? err.message : 'Internal server error',
        ...(isDevelopment && { stack: err.stack })
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    mongoose.connection.close(() => {
        logger.info('MongoDB connection closed');
        process.exit(0);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
```

## **13. Assignments and Projects**

### **Assignment 15.1: Docker Containerization**
Create Docker configurations for:
- Node.js application with multi-stage build
- Database service with persistent volumes
- Nginx reverse proxy
- Docker Compose for local development

### **Assignment 15.2: CI/CD Pipeline**
Build a complete CI/CD pipeline that includes:
- Automated testing on pull requests
- Code quality checks
- Security scanning
- Automated deployment to staging
- Manual deployment to production

### **Project 15: Production-Ready Application**
Deploy a full-stack application with:
- Docker containerization
- Environment-specific configurations
- Database setup and migrations
- Monitoring and logging
- Security hardening
- Backup and recovery procedures

### **Challenge Project: Microservices Deployment**
Create a microservices architecture with:
- Service discovery
- API gateway
- Container orchestration
- Distributed logging
- Health checks and monitoring
- Rolling deployments

## **14. Best Practices**

### **Deployment:**
- Use environment-specific configurations
- Implement health checks
- Set up proper logging
- Use reverse proxies
- Implement graceful shutdowns

### **Security:**
- Use HTTPS in production
- Implement proper authentication
- Validate all inputs
- Use security headers
- Regular security updates

### **Monitoring:**
- Track application metrics
- Set up error tracking
- Monitor resource usage
- Implement alerting
- Keep detailed logs

### **Scalability:**
- Design for horizontal scaling
- Implement caching strategies
- Use connection pooling
- Optimize database queries
- Consider CDN for static assets

## **15. Resources**

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Vercel Documentation](https://vercel.com/docs)

## **16. Next Steps**

Congratulations! You've learned the fundamentals of full-stack web development and deployment. To continue your journey:

- **Practice:** Build and deploy real applications
- **Learn Advanced Topics:** GraphQL, microservices, serverless
- **Contribute:** Open source projects, blog posts
- **Certifications:** AWS, Docker, Kubernetes certifications
- **Networking:** Join developer communities, attend conferences

Remember, deployment is an iterative process. Start simple, monitor your applications, and gradually improve your infrastructure as your needs grow!

## **17. Advanced Deployment Patterns and Infrastructure as Code**

### **Infrastructure as Code (IaC)**

#### **Terraform for AWS Infrastructure**
```hcl
# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "myapp-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Environment = var.environment
    Project     = "myapp"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
  }
}

# Application Load Balancer
resource "aws_lb" "app" {
  name               = "${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = var.environment == "prod"

  tags = {
    Environment = var.environment
  }
}
```

#### **AWS CDK for Infrastructure**
```typescript
// lib/stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';

export class MyAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'MyAppVpc', {
      maxAzs: 3,
      natGateways: 1,
    });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'MyAppCluster', {
      vpc,
      containerInsights: true,
    });

    // Application Load Balanced Fargate Service
    const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'MyAppService', {
      cluster,
      memoryLimitMiB: 512,
      cpu: 256,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('myapp:latest'),
        containerPort: 3000,
        environment: {
          NODE_ENV: 'production',
          DATABASE_URL: `postgresql://db:27017/myapp`,
          REDIS_URL: `redis://redis:6379`,
        },
      },
      publicLoadBalancer: true,
    });

    // Auto scaling
    const scaling = loadBalancedFargateService.service.autoScaleTaskCount({
      minCapacity: 2,
      maxCapacity: 10,
    });

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70,
    });
  }
}
```

### **Kubernetes Orchestration**

#### **Kubernetes Manifests**
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
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
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
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### **Serverless Deployment**

#### **AWS Lambda with API Gateway**
```typescript
// lambda/index.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { MongoClient } from 'mongodb';

let cachedDb: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);
  cachedDb = await client.connect();
  return cachedDb;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const db = await connectToDatabase();
    const collection = db.db('myapp').collection('items');

    switch (event.httpMethod) {
      case 'GET':
        const items = await collection.find({}).toArray();
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(items)
        };

      case 'POST':
        const newItem = JSON.parse(event.body || '{}');
        newItem.createdAt = new Date().toISOString();
        await collection.insertOne(newItem);

        return {
          statusCode: 201,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newItem)
        };

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
```

### **Advanced Monitoring and Observability**

#### **Prometheus and Grafana Setup**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node-app'
    static_configs:
      - targets: ['app:3000']
    scrape_interval: 5s
    metrics_path: '/metrics'

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']
    scrape_interval: 10s
```

#### **Application Metrics**
```javascript
const promClient = require('prom-client');

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.end(metrics);
});
```

## **18. Resources**

### **📖 Documentation & Guides**
- [Docker Docs](https://docs.docker.com/) - Complete Docker documentation
- [Heroku Deployment Guide](https://devcenter.heroku.com/) - Heroku deployment tutorials
- [Vercel & Netlify Docs](https://vercel.com/docs) - Modern deployment platforms
- [Terraform Documentation](https://www.terraform.io/docs) - Infrastructure as Code
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/) - AWS infrastructure
- [Kubernetes Documentation](https://kubernetes.io/docs/) - Container orchestration

### **🎥 Video Tutorials**
- [CI/CD Basics – freeCodeCamp](https://www.youtube.com/watch?v=) - Complete CI/CD tutorial
- [Docker Tutorial for Beginners](https://www.youtube.com/watch?v=) - Docker fundamentals
- [Heroku Deployment Guide](https://www.youtube.com/watch?v=) - Cloud deployment
- [Kubernetes Crash Course](https://www.youtube.com/watch?v=) - K8s basics

### **📗 Project Ideas & Examples**
- **Docker Containerization**: Containerize a Node.js application
- **CI/CD Pipeline**: Set up automated deployment with GitHub Actions
- **Heroku Deployment**: Deploy a full-stack app to Heroku
- **Vercel Deployment**: Deploy a React app with Vercel
- **Infrastructure as Code**: Create AWS infrastructure with Terraform
- **Kubernetes Orchestration**: Deploy microservices to K8s

### **🛠️ Tools & Platforms**
- [Helm Documentation](https://helm.sh/docs/) - Kubernetes package manager
- [Prometheus Documentation](https://prometheus.io/docs/) - Monitoring system
- [Grafana Documentation](https://grafana.com/docs/) - Visualization platform
- [Jenkins](https://www.jenkins.io/) - CI/CD automation server
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/) - Integrated DevOps platform

## **19. Next Steps**

Congratulations! You've mastered deployment and DevOps fundamentals. To continue your journey:

- **Infrastructure as Code:** Learn Terraform, AWS CDK, Pulumi
- **Container Orchestration:** Master Kubernetes, Docker Swarm
- **Cloud Platforms:** Deep dive into AWS, Azure, GCP
- **Monitoring:** Implement ELK stack, DataDog, New Relic
- **Security:** Learn DevSecOps, container security, compliance
- **Site Reliability Engineering (SRE):** Study reliability engineering principles

Remember, deployment is an iterative process. Start simple, monitor your applications, and gradually improve your infrastructure as your needs grow!

---

This comprehensive deployment guide covers everything from basic Docker setup to advanced infrastructure as code, Kubernetes orchestration, serverless deployment, and enterprise-grade monitoring. The examples are production-ready and follow current DevOps best practices for professional application deployment.
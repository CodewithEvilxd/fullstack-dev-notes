# Lesson 19: Docker for Full-Stack Development

## Overview
Docker is a platform for developing, shipping, and running applications in containers. This lesson covers Docker fundamentals and its application in full-stack development.

## What is Docker?

### Containerization vs Virtualization
```
Traditional Virtualization:
┌─────────────────────────────────────┐
│         Host Operating System       │
├─────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐     │
│ │   VM 1      │ │   VM 2      │     │
│ │ ┌─────────┐ │ │ ┌─────────┐ │     │
│ │ │  App 1  │ │ │ │  App 2  │ │     │
│ │ │ ┌─────┐ │ │ │ │ ┌─────┐ │ │     │
│ │ │ │ OS  │ │ │ │ │ │ OS  │ │ │     │
│ │ │ └─────┘ │ │ │ │ └─────┘ │ │     │
│ │ └─────────┘ │ │ └─────────┘ │     │
│ └─────────────┘ └─────────────┘     │
└─────────────────────────────────────┘

Docker Containers:
┌─────────────────────────────────────┐
│         Host Operating System       │
├─────────────────────────────────────┤
│         Docker Engine               │
├─────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐     │
│ │ Container 1 │ │ Container 2 │     │
│ │ ┌─────────┐ │ │ ┌─────────┐ │     │
│ │ │  App 1  │ │ │ │  App 2  │ │     │
│ │ │ ┌─────┐ │ │ │ │ ┌─────┐ │ │     │
│ │ │ │Bins│ │ │ │ │ │Bins│ │ │     │
│ │ │ │Libs│ │ │ │ │ │Libs│ │ │     │
│ │ │ └─────┘ │ │ │ └─────┘ │ │     │
│ │ └─────────┘ │ │ └─────────┘ │     │
│ └─────────────┘ └─────────────┘     │
└─────────────────────────────────────┘
```

### Key Benefits
```
Portability: Run anywhere
Consistency: Same environment everywhere
Isolation: No conflicts between applications
Efficiency: Lightweight compared to VMs
Scalability: Easy horizontal scaling
Version Control: Container versioning
```

## Docker Architecture

### Core Components
```
Docker Client: CLI interface for commands
Docker Daemon: Background service managing containers
Docker Images: Read-only templates for containers
Docker Containers: Running instances of images
Docker Registry: Repository for storing images
Docker Compose: Multi-container applications
Docker Swarm: Container orchestration
```

### Docker Images vs Containers
```
Docker Image:
├── Read-only template
├── Contains application code
├── Includes dependencies
├── Base OS and libraries
└── Immutable

Docker Container:
├── Running instance of image
├── Read-write layer on top
├── Isolated process space
├── Network interfaces
└── Can be started/stopped
```

## Installation and Setup

### Installing Docker

#### Windows
```bash
# Download Docker Desktop from docker.com
# Run installer
# Start Docker Desktop
# Verify installation
docker --version
docker run hello-world
```

#### macOS
```bash
# Using Homebrew
brew install --cask docker

# Or download Docker Desktop
# Start Docker Desktop
# Verify installation
docker --version
docker run hello-world
```

#### Linux (Ubuntu)
```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker run hello-world
```

## Basic Docker Commands

### Working with Images
```bash
# List images
docker images

# Pull image from registry
docker pull ubuntu:20.04
docker pull nginx:latest

# Build image from Dockerfile
docker build -t myapp:1.0 .

# Remove image
docker rmi ubuntu:20.04

# Clean up unused images
docker image prune -f
```

### Working with Containers
```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Run container
docker run -d --name mynginx nginx:latest

# Run container with port mapping
docker run -d -p 8080:80 --name myweb nginx:latest

# Run interactive container
docker run -it ubuntu:20.04 /bin/bash

# Stop container
docker stop mynginx

# Start container
docker start mynginx

# Restart container
docker restart mynginx

# Remove container
docker rm mynginx

# Remove all stopped containers
docker container prune -f
```

### Container Management
```bash
# View container logs
docker logs mynginx

# Execute command in running container
docker exec -it mynginx /bin/bash

# Copy files to/from container
docker cp mynginx:/etc/nginx/nginx.conf .
docker cp nginx.conf mynginx:/etc/nginx/nginx.conf

# Inspect container details
docker inspect mynginx

# View container resource usage
docker stats mynginx
```

## Dockerfile Fundamentals

### Basic Dockerfile Structure
```dockerfile
# Use official Node.js runtime as base image
FROM node:16-alpine

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Define startup command
CMD ["npm", "start"]
```

### Multi-Stage Dockerfile
```dockerfile
# Build stage
FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Best Practices for Dockerfiles
```dockerfile
# 1. Use specific base image versions
FROM node:16.14.0-alpine3.15

# 2. Use multi-stage builds for smaller images
FROM node:16-alpine AS builder
# ... build steps

FROM nginx:alpine
# ... production setup

# 3. Minimize layers by combining commands
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# 4. Use .dockerignore file
# .dockerignore
node_modules
.git
.env
*.log

# 5. Use non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# 6. Leverage build cache
COPY package*.json ./
RUN npm ci --only=production
COPY . .
```

## Docker Compose for Multi-Container Apps

### Basic docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Advanced Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    driver: bridge
```

### Docker Compose Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale web=3

# Execute commands in containers
docker-compose exec web bash

# Rebuild and restart
docker-compose up -d --build
```

## Full-Stack Development with Docker

### Node.js + PostgreSQL + Redis
```yaml
version: '3.8'

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@postgres:5432/myapp
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./api:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### React + Node.js + MongoDB
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:3001

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/myapp
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - mongo

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Docker Networking

### Network Types
```bash
# Bridge network (default)
docker network create mynetwork
docker run -d --network mynetwork --name web nginx

# Host network (direct host access)
docker run -d --network host --name web nginx

# None network (isolated)
docker run -d --network none --name web nginx

# Overlay network (multi-host)
docker network create -d overlay myoverlay
```

### Service Discovery
```yaml
version: '3.8'

services:
  web:
    image: nginx
    networks:
      - frontend

  api:
    image: node:16
    networks:
      - frontend
      - backend

  db:
    image: postgres
    networks:
      - backend

networks:
  frontend:
  backend:
```

## Docker Volumes and Data Persistence

### Volume Types
```bash
# Named volumes
docker volume create myvolume
docker run -v myvolume:/data ubuntu

# Bind mounts (host directories)
docker run -v /host/path:/container/path ubuntu

# tmpfs (in-memory)
docker run --tmpfs /tmp ubuntu
```

### Volume Management
```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect myvolume

# Remove volume
docker volume rm myvolume

# Clean up unused volumes
docker volume prune -f
```

## Docker Security Best Practices

### Image Security
```dockerfile
# Use official base images
FROM ubuntu:20.04

# Avoid running as root
RUN useradd -m myuser
USER myuser

# Update packages and install security updates
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Minimize attack surface
RUN apt-get remove -y curl

# Use specific versions
FROM node:16.14.0-alpine3.15
```

### Container Security
```bash
# Run containers with limited privileges
docker run --read-only --tmpfs /tmp ubuntu

# Use security options
docker run --security-opt no-new-privileges ubuntu

# Limit resources
docker run --memory 512m --cpus 0.5 ubuntu

# Use secrets for sensitive data
echo "mypassword" | docker secret create db_password -
docker service create --secret db_password postgres:13
```

### Docker Bench Security
```bash
# Run security audit
docker run --net host --pid host --userns host --cap-add audit_control \
  -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
  -v /var/lib:/var/lib \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /usr/lib/systemd:/usr/lib/systemd \
  -v /etc:/etc --label docker_bench_security \
  docker/docker-bench-security
```

## Docker in Development Workflow

### Development Setup
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    command: npm run dev

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp_dev
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_dev_data:
```

### Hot Reloading
```dockerfile
# Dockerfile.dev
FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start with hot reloading
CMD ["npm", "run", "dev"]
```

### Testing with Docker
```yaml
version: '3.8'

services:
  app:
    build: .
    command: npm test
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://user:password@db:5432/myapp_test
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp_test
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_test_data:/var/lib/postgresql/data

volumes:
  postgres_test_data:
```

## Docker in CI/CD Pipeline

### GitHub Actions with Docker
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Build Docker image
      run: docker build -t myapp .

    - name: Run tests
      run: docker run myapp npm test

    - name: Push to Docker Hub
      if: github.ref == 'refs/heads/main'
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker tag myapp ${{ secrets.DOCKER_USERNAME }}/myapp:latest
        docker push ${{ secrets.DOCKER_USERNAME }}/myapp:latest
```

### Jenkins Pipeline
```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    docker.build('myapp')
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    docker.image('myapp').inside {
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    docker.withRegistry('https://registry.example.com', 'registry-credentials') {
                        docker.image('myapp').push('latest')
                    }
                }
            }
        }
    }
}
```

## Docker Swarm and Kubernetes

### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Create service
docker service create --name web --replicas 3 -p 80:80 nginx

# Scale service
docker service scale web=5

# Update service
docker service update --image nginx:1.20 web

# View services
docker service ls
docker service ps web
```

### Kubernetes Integration
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
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
```

## Troubleshooting Docker

### Common Issues and Solutions

#### Container Won't Start
```bash
# Check container logs
docker logs container_name

# Inspect container
docker inspect container_name

# Check resource limits
docker stats

# Check network connectivity
docker exec container_name ping google.com
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 PID

# Or use different port
docker run -p 8081:80 nginx
```

#### Disk Space Issues
```bash
# Check disk usage
docker system df

# Clean up unused resources
docker system prune -a --volumes

# Remove specific images/containers
docker rmi image_name
docker rm container_name
```

#### Performance Issues
```bash
# Monitor container performance
docker stats

# Check resource limits
docker inspect container_name | grep -A 10 "HostConfig"

# Optimize Docker daemon
# /etc/docker/daemon.json
{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## Advanced Docker Features

### Docker BuildKit
```bash
# Enable BuildKit
export DOCKER_BUILDKIT=1

# Use advanced Dockerfile features
# syntax=docker/dockerfile:1
FROM node:16-alpine
RUN --mount=type=cache,target=/root/.npm \
    npm install
```

### Multi-Architecture Builds
```dockerfile
# Build for multiple architectures
FROM --platform=$BUILDPLATFORM node:16-alpine AS builder
# ... build steps

FROM node:16-alpine
# ... final image
```

### Docker Desktop Extensions
```bash
# Install extensions
docker extension install <extension-name>

# Popular extensions:
# - Docker Scout (security scanning)
# - Docker Desktop (enhanced UI)
# - Portainer (container management)
```

## Docker in Production

### Production Best Practices
```dockerfile
# Use distroless images for security
FROM gcr.io/distroless/nodejs:16

# Multi-stage builds for smaller images
FROM node:16-alpine AS builder
# ... build

FROM alpine:latest
# ... runtime

# Health checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Proper logging
ENV NODE_ENV=production
RUN ln -sf /dev/stdout /app/logs/app.log

# Security scanning
# Use tools like Clair, Trivy, or Docker Scout
```

### Monitoring and Logging
```yaml
version: '3.8'

services:
  app:
    image: myapp
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  monitoring:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

## Summary

Docker is essential for modern full-stack development because it:

1. **Standardizes Environments**: Same setup across development, testing, production
2. **Simplifies Deployment**: Package application with all dependencies
3. **Enables Microservices**: Isolated, scalable service architecture
4. **Improves Development Workflow**: Consistent development environments
5. **Facilitates CI/CD**: Automated testing and deployment pipelines
6. **Enhances Scalability**: Easy horizontal scaling with orchestration

### Key Takeaways
- Use multi-stage builds for smaller images
- Implement proper security practices
- Leverage Docker Compose for multi-container apps
- Use volumes for persistent data
- Implement health checks and monitoring
- Follow container best practices

### Next Steps
1. Install Docker and Docker Compose
2. Create Dockerfiles for your applications
3. Set up development environment with Docker
4. Learn container orchestration (Docker Swarm/Kubernetes)
5. Implement CI/CD pipelines with Docker
6. Deploy applications to cloud platforms

Docker will revolutionize your development workflow and make your applications more portable and scalable! 🚀
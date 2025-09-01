
# Code Examples & Practical Implementations

## Real-World Application Patterns

### 1. User Authentication System

#### JWT Authentication with Refresh Tokens
```javascript
// server/auth/auth.service.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class AuthService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = '15m';
    this.refreshTokenExpiry = '7d';
  }

  // Hash password
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Generate tokens
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry
    });

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry
    });

    return { accessToken, refreshToken };
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Generate secure reset token
  generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}

module.exports = new AuthService();
```

```javascript
// server/auth/auth.controller.js
const AuthService = require('./auth.service');
const User = require('../models/User');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists'
        });
      }

      // Hash password
      const hashedPassword = await AuthService.hashPassword(password);

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        name,
        emailVerificationToken: AuthService.generateResetToken()
      });

      await user.save();

      // Generate tokens
      const tokens = AuthService.generateTokens({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      // Store refresh token
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
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
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await AuthService.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Account is deactivated'
        });
      }

      // Generate tokens
      const tokens = AuthService.generateTokens({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      // Update refresh token
      user.refreshToken = tokens.refreshToken;
      user.lastLogin = new Date();
      await user.save();

      res.json({
        success: true,
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
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  }

  // Refresh access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token required'
        });
      }

      // Verify refresh token
      const decoded = AuthService.verifyRefreshToken(refreshToken);

      // Find user and validate refresh token
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({
          success: false,
          error: 'Invalid refresh token'
        });
      }

      // Generate new tokens
      const tokens = AuthService.generateTokens({
        userId: user._id,
        email: user.email,
        role: user.role
      });

      // Update refresh token
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.json({
        success: true,
        ...tokens
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(403).json({
        success: false,
        error: 'Token refresh failed'
      });
    }
  }

  // Logout user
  async logout(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  }
}

module.exports = new AuthController();
```

#### Authentication Middleware
```javascript
// server/middleware/auth.middleware.js
const AuthService = require('../auth/auth.service');
const User = require('../models/User');

// Authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = AuthService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

// Role-based authorization
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
}

// Optional authentication (for public endpoints that benefit from user context)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = AuthService.verifyAccessToken(token);
      req.user = decoded;
    } catch (error) {
      // Ignore invalid tokens for optional auth
    }
  }

  next();
}

module.exports = {
  authenticateToken,
  authorizeRoles,
  optionalAuth
};
```

### 2. Database Design Patterns

#### Repository Pattern Implementation
```javascript
// models/base/BaseRepository.js
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findOne(query) {
    return await this.model.findOne(query);
  }

  async find(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt', populate = [] } = options;

    const skip = (page - 1) * limit;
    let queryBuilder = this.model.find(query);

    // Apply population
    populate.forEach(pop => {
      if (typeof pop === 'string') {
        queryBuilder = queryBuilder.populate(pop);
      } else {
        queryBuilder = queryBuilder.populate(pop);
      }
    });

    const [docs, total] = await Promise.all([
      queryBuilder
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(query)
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
  }

  async create(data) {
    const document = new this.model(data);
    return await document.save();
  }

  async updateById(id, data, options = {}) {
    return await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      ...options
    });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await this.model.countDocuments(query);
  }

  async exists(query = {}) {
    const count = await this.model.countDocuments(query).limit(1);
    return count > 0;
  }
}

module.exports = BaseRepository;
```

```javascript
// repositories/UserRepository.js
const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.findOne({ email });
  }

  async findActiveUsers(options = {}) {
    return await this.find({ isActive: true }, options);
  }

  async updateLastLogin(userId) {
    return await this.updateById(userId, { lastLogin: new Date() });
  }

  async deactivateUser(userId) {
    return await this.updateById(userId, { isActive: false });
  }

  async findUsersByRole(role, options = {}) {
    return await this.find({ role }, options);
  }

  async searchUsers(searchTerm, options = {}) {
    const searchQuery = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    return await this.find(searchQuery, options);
  }
}

module.exports = new UserRepository();
```

#### Data Transfer Object (DTO) Pattern
```javascript
// dtos/UserDTO.js
class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.lastLogin = user.lastLogin;
  }

  // Exclude sensitive information
  static toPublic(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }

  // Include profile information
  static toProfile(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin
    };
  }

  // For admin use
  static toAdmin(user) {
    return {
      ...this.toProfile(user),
      emailVerificationToken: user.emailVerificationToken,
      passwordResetToken: user.passwordResetToken,
      refreshToken: user.refreshToken
    };
  }
}

module.exports = UserDTO;
```

### 3. API Design Patterns

#### RESTful API with Express.js
```javascript
// routes/api/v1/users.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');
const UserRepository = require('../../repositories/UserRepository');
const UserDTO = require('../../dtos/UserDTO');

// GET /api/v1/users - Get all users (Admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, isActive } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: '-createdAt',
      populate: []
    };

    const result = await UserRepository.find(query, options);

    const users = result.docs.map(user => UserDTO.toPublic(user));

    res.json({
      success: true,
      data: users,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        pages: result.pages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users'
    });
  }
});

// GET /api/v1/users/:id - Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await UserRepository.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Users can only view their own profile unless they're admin
    if (req.user.userId !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const userDTO = req.user.role === 'admin'
      ? UserDTO.toAdmin(user)
      : UserDTO.toProfile(user);

    res.json({
      success: true,
      data: userDTO
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user'
    });
  }
});

// POST /api/v1/users - Create new user (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user
    const userData = {
      name,
      email,
      password, // Will be hashed by pre-save middleware
      role
    };

    const user = await UserRepository.create(userData);

    res.status(201).json({
      success: true,
      data: UserDTO.toPublic(user),
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// PUT /api/v1/users/:id - Update user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Users can only update their own profile unless they're admin
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Prevent non-admin users from changing sensitive fields
    if (req.user.role !== 'admin') {
      delete updates.role;
      delete updates.isActive;
    }

    // Remove password from updates (use separate endpoint)
    delete updates.password;

    const user = await UserRepository.updateById(userId, updates);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userDTO = req.user.role === 'admin'
      ? UserDTO.toAdmin(user)
      : UserDTO.toProfile(user);

    res.json({
      success: true,
      data: userDTO,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// DELETE /api/v1/users/:id - Delete user (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await UserRepository.deleteById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

module.exports = router;
```

### 4. Error Handling and Logging

#### Global Error Handler
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

#### Logging Service
```javascript
// services/logger.service.js
const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define transports
const transports = [
  // Error log file
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: logFormat
  }),

  // Combined log file
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: logFormat
  })
];

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );
}

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logsDir, 'exceptions.log') })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logsDir, 'rejections.log') })
  ]
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });

  next();
};

// Error logging function
const logError = (error, req = null) => {
  const logData = {
    message: error.message,
    stack: error.stack,
    name: error.name
  };

  if (req) {
    logData.url = req.url;
    logData.method = req.method;
    logData.ip = req.ip;
    logData.userId = req.user?.userId;
  }

  logger.error('Application error', logData);
};

// Performance logging
const logPerformance = (operation, duration, metadata = {}) => {
  logger.info('Performance metric', {
    operation,
    duration: `${duration}ms`,
    ...metadata
  });
};

module.exports = {
  logger,
  requestLogger,
  logError,
  logPerformance
};
```

### 5. Caching Strategies

#### Redis Caching Implementation
```javascript
// services/cache.service.js
const redis = require('redis');
const { promisify } = require('util');

class CacheService {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    // Promisify Redis methods
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.expireAsync = promisify(this.client.expire).bind(this.client);
    this.existsAsync = promisify(this.client.exists).bind(this.client);
  }

  // Get cached value
  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set cached value with expiration
  async set(key, value, expireInSeconds = 3600) {
    try {
      await this.setAsync(key, JSON.stringify(value), 'EX', expireInSeconds);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete cached value
  async delete(key) {
    try {
      await this.delAsync(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Check if key exists
  async exists(key) {
    try {
      const result = await this.existsAsync(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Set multiple values
  async mset(keyValuePairs, expireInSeconds = 3600) {
    try {
      const pipeline = this.client.multi();
      keyValuePairs.forEach(({ key, value }) => {
        pipeline.set(key, JSON.stringify(value), 'EX', expireInSeconds);
      });
      await promisify(pipeline.exec).bind(pipeline)();
      return true;
    } catch (error) {
      console.error('Cache mset error:', error);
      return false;
    }
  }

  // Get multiple values
  async mget(keys) {
    try {
      const pipeline = this.client.multi();
      keys.forEach(key => pipeline.get(key));
      const results = await promisify(pipeline.exec).bind(pipeline)();

      return results.map(([err, value]) => {
        if (err) return null;
        return value ? JSON.parse(value) : null;
      });
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  // Increment counter
  async increment(key, amount = 1) {
    try {
      const result = await promisify(this.client.incrby).bind(this.client)(key, amount);
      return result;
    } catch (error) {
      console.error('Cache increment error:', error);
      return null;
    }
  }

  // Set with conditional expiration
  async setIfNotExists(key, value, expireInSeconds = 3600) {
    try {
      const result = await promisify(this.client.setnx).bind(this.client)(key, JSON.stringify(value));
      if (result === 1 && expireInSeconds) {
        await this.expireAsync(key, expireInSeconds);
      }
      return result === 1;
    } catch (error) {
      console.error('Cache setIfNotExists error:', error);
      return false;
    }
  }

  // Close connection
  async close() {
    this.client.quit();
  }
}

module.exports = new CacheService();
```

#### Application-Level Caching Middleware
```javascript
// middleware/cache.middleware.js
const CacheService = require('../services/cache.service');

const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query parameters
    const cacheKey = `api:${req.originalUrl}`;

    try {
      // Check if response is cached
      const cachedResponse = await CacheService.get(cacheKey);
      if (cachedResponse) {
        return res.json(cachedResponse);
      }

      // Store original json method
      const originalJson = res.json;

      // Override json method to cache response
      res.json = function(data) {
        // Cache the response
        CacheService.set(cacheKey, data, duration).catch(err => {
          console.error('Cache storage error:', err);
        });

        // Call original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Cache invalidation helper
const invalidateCache = async (pattern) => {
  // Note: This is a simplified version. In production,
  // you might want to use Redis SCAN or KEYS command
  try {
    const keys = await CacheService.client.keys(pattern);
    if (keys.length > 0) {
      await CacheService.client.del(keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

module.exports = {
  cacheMiddleware,
  invalidateCache
};
```

### 6. File Upload and Processing

#### Multer Configuration for File Uploads
```javascript
// middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

// Create uploads directory if it doesn't exist
const createUploadsDir = async () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

// Storage configuration
const createStorage = (destination) => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadsDir = await createUploadsDir();
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      const basename = path.basename(file.originalname, extension);
      cb(null, `${basename}-${uniqueSuffix}${extension}`);
    }
  });
};

// Single file upload
const uploadSingle = (fieldName, options = {}) => {
  const storage = createStorage();
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: options.maxSize || 5 * 1024 * 1024, // 5MB default
    }
  }).single(fieldName);
};

// Multiple files upload
const uploadMultiple = (fieldName, maxCount = 5, options = {}) => {
  const storage = createStorage();
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: options.maxSize || 5 * 1024 * 1024, // 5MB default
      files: maxCount
    }
  }).array(fieldName, maxCount);
};

// Mixed file upload (different fields)
const uploadFields = (fields, options = {}) => {
  const storage = createStorage();
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: options.maxSize || 5 * 1024 * 1024, // 5MB default
    }
  }).fields(fields);
};

// Memory storage for processing
const uploadMemory = (fieldName) => {
  return multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB for memory
    }
  }).single(fieldName);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  uploadMemory
};
```

#### File Processing Service
```javascript
// services/file.service.js
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

class FileService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads');
    this.tempDir = path.join(__dirname, '../temp');
  }

  // Save uploaded file
  async saveFile(file, options = {}) {
    const {
      destination = this.uploadsDir,
      filename,
      createDir = true
    } = options;

    if (createDir) {
      await fs.mkdir(destination, { recursive: true });
    }

    const finalFilename = filename || `${uuidv4()}${path.extname(file.originalname)}`;
    const filepath = path.join(destination, finalFilename);

    if (file.buffer) {
      // Memory storage
      await fs.writeFile(filepath, file.buffer);
    } else {
      // Disk storage - file already saved by multer
      if (file.path !== filepath) {
        await fs.rename(file.path, filepath);
      }
    }

    return {
      filename: finalFilename,
      path: filepath,
      size: file.size,
      mimetype: file.mimetype,
      originalname: file.originalname
    };
  }

  // Process image
  async processImage(inputPath, outputPath, options = {}) {
    const {
      width,
      height,
      quality = 80,
      format = 'jpeg'
    } = options;

    let sharpInstance = sharp(inputPath);

    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }

    if (format === 'jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality });
    } else if (format === 'png') {
      sharpInstance = sharpInstance.png({ quality });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality });
    }

    await sharpInstance.toFile(outputPath);

    // Get processed file info
    const stats = await fs.stat(outputPath);
    return {
      path: outputPath,
      size: stats.size,
      format
    };
  }

  // Generate image thumbnails
  async generateThumbnails(inputPath, options = {}) {
    const {
      sizes = [100, 300, 600],
      quality = 80
    } = options;

    const thumbnails = [];
    const filename = path.basename(inputPath, path.extname(inputPath));

    for (const size of sizes) {
      const outputPath = path.join(
        path.dirname(inputPath),
        `${filename}_${size}.jpg`
      );

      await this.processImage(inputPath, outputPath, {
        width: size,
        height: size,
        quality,
        format: 'jpeg'
      });

      thumbnails.push({
        size,
        path: outputPath
      });
    }

    return thumbnails;
  }

  // Delete file
  async deleteFile(filepath) {
    try {
      await fs.unlink(filepath);
      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  // Get file info
  async getFileInfo(filepath) {
    try {
      const stats = await fs.stat(filepath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        extension: path.extname(filepath)
      };
    } catch (error) {
      console.error('File info error:', error);
      return null;
    }
  }

  // Clean up old files
  async cleanupOldFiles(directory = this.uploadsDir, maxAge = 30 * 24 * 60 * 60 * 1000) {
    try {
      const files = await fs.readdir(directory);
      const now = Date.now();

      for (const file of files) {
        const filepath = path.join(directory, file);
        const stats = await fs.stat(filepath);

        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filepath);
          console.log(`Deleted old file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  // Validate file type
  validateFileType(file, allowedTypes) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    return allowedTypes.includes(fileExtension) || allowedTypes.includes(file.mimetype);
  }

  // Generate secure filename
  generateSecureFilename(originalname) {
    const extension = path.extname(originalname);
    const basename = path.basename(originalname, extension);
    const sanitized = basename.replace(/[^a-zA-Z0-9]/g, '_');
    return `${sanitized}_${Date.now()}${extension}`;
  }
}

module.exports = new FileService();
```

### 7. Background Job Processing

#### Queue System with Bull
```javascript
// services/queue.service.js
const Queue = require('bull');
const { logger } = require('./logger.service');

class QueueService {
  constructor() {
    this.queues = new Map();
    this.redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD
    };
  }

  // Create or get queue
  getQueue(name) {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        redis: this.redisConfig,
        defaultJobOptions: {
          removeOnComplete: 50,
          removeOnFail: 100,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000
          }
        }
      });

      // Add event listeners
      queue.on('completed', (job) => {
        logger.info(`Job ${job.id} completed in queue ${name}`, {
          jobId: job.id,
          duration: Date.now() - job.timestamp
        });
      });

      queue.on('failed', (job, err) => {
        logger.error(`Job ${job.id} failed in queue ${name}`, {
          jobId: job.id,
          error: err.message,
          attempts: job.attemptsMade
        });
      });

      this.queues.set(name, queue);
    }

    return this.queues.get(name);
  }

  // Add job to queue
  async addJob(queueName, jobName, data, options = {}) {
    const queue = this.getQueue(queueName);
    const job = await queue.add(jobName, data, {
      priority: options.priority || 0,
      delay: options.delay || 0,
      ...options
    });

    logger.info(`Job ${job.id} added to queue ${queueName}`, {
      jobId: job.id,
      jobName,
      data: JSON.stringify(data).substring(0, 200)
    });

    return job;
  }

  // Process jobs
  processJob(queueName, jobName, handler) {
    const queue = this.getQueue(queueName);

    queue.process(jobName, async (job) => {
      logger.info(`Processing job ${job.id} in queue ${queueName}`, {
        jobId: job.id,
        jobName
      });

      try {
        const result = await handler(job.data);
        return result;
      } catch (error) {
        logger.error(`Job ${job.id} processing failed`, {
          jobId: job.id,
          error: error.message,
          stack: error.stack
        });
        throw error;
      }
    });
  }

  // Get queue statistics
  async getQueueStats(queueName) {
    const queue = this.getQueue(queueName);
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed()
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length
    };
  }

  // Clean up old jobs
  async cleanQueue(queueName, grace = 24 * 60 * 60 * 1000) {
    const queue = this.getQueue(queueName);
    await queue.clean(grace, 'completed');
    await queue.clean(grace, 'failed');
  }

  // Close all queues
  async closeAll() {
    for (const [name, queue] of this.queues) {
      await queue.close();
      logger.info(`Queue ${name} closed`);
    }
    this.queues.clear();
  }
}

module.exports = new QueueService();
```

#### Email Service with Background Jobs
```javascript
// services/email.service.js
const nodemailer = require('nodemailer');
const QueueService = require('./queue.service');
const { logger } = require('./logger.service');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Initialize email queue
    this.setupEmailQueue();
  }

  // Setup email processing queue
  setupEmailQueue() {
    QueueService.processJob('emails', 'send-email', async (emailData) => {
      return await this.sendEmailImmediate(emailData);
    });

    QueueService.processJob('emails', 'send-bulk-email', async (bulkData) => {
      return await this.sendBulkEmail(bulkData);
    });
  }

  // Send email immediately
  async sendEmailImmediate({ to, subject, html, text, attachments = [] }) {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html,
        text,
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to,
        subject
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Email sending failed', {
        error: error.message,
        to,
        subject
      });
      throw error;
    }
  }

  // Send email via queue
  async sendEmail(emailData) {
    return await QueueService.addJob('emails', 'send-email', emailData);
  }

  // Send bulk emails
  async sendBulkEmail({ recipients, subject, html, text }) {
    const results = [];

    for (const recipient of recipients) {
      try {
        await this.sendEmailImmediate({
          to: recipient,
          subject,
          html,
          text
        });
        results.push({ email: recipient, success: true });
      } catch (error) {
        results.push({ email: recipient, success: false, error: error.message });
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  // Send bulk email via queue
  async sendBulkEmailQueued(bulkData) {
    return await QueueService.addJob('emails', 'send-bulk-email', bulkData);
  }

  // Email templates
  getWelcomeEmailTemplate(user) {
    return {
      subject: 'Welcome to Our Platform!',
      html: `
        <h1>Welcome ${user.name}!</h1>
        <p>Thank you for joining our platform.</p>
        <p>Your account has been created successfully.</p>
        <a href="${process.env.FRONTEND_URL}/login">Login to your account</a>
      `,
      text: `Welcome ${user.name}! Thank you for joining our platform. Your account has been created successfully.`
    };
  }

  getPasswordResetTemplate(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    return {
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
      text: `Hello ${user.name}, you requested a password reset. Click here to reset: ${resetUrl}`
    };
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const template = this.getWelcomeEmailTemplate(user);
    return await this.sendEmail({
      to: user.email,
      ...template
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const template = this.getPasswordResetTemplate(user, resetToken);
    return await this.sendEmail({
      to: user.email,
      ...template
    });
  }

  // Verify email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed', { error: error.message });
      return false;
    }
  }
}

module.exports = new EmailService();
```

### 8. Real-Time Communication

#### WebSocket Service with Socket.io
```javascript
// services/websocket.service.js
const { logger } = require('./logger.service');

class WebSocketService {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map();
    this.userSockets = new Map();
    this.setupEventHandlers();
  }

  // Setup event handlers
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info('User connected', { socketId: socket.id });

      // Handle user authentication
      socket.on('authenticate', (data) => {
        this.handleAuthentication(socket, data);
      });

      // Handle joining rooms
      socket.on('join-room', (data) => {
        this.handleJoinRoom(socket, data);
      });

      // Handle leaving rooms
      socket.on('leave-room', (data) => {
        this.handleLeaveRoom(socket, data);
      });

      // Handle private messages
      socket.on('private-message', (data) => {
        this.handlePrivateMessage(socket, data);
      });

      // Handle typing indicators
      socket.on('typing-start', (data) => {
        this.handleTypingStart(socket, data);
      });

      socket.on('typing-stop', (data) => {
        this.handleTypingStop(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  // Handle user authentication
  handleAuthentication(socket, data) {
    try {
      const { userId, token } = data;

      // Verify token (implement your JWT verification)
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.userId = userId;
      this.connectedUsers.set(userId, socket.id);
      this.userSockets.set(socket.id, userId);

      socket.emit('authenticated', { success: true });

      logger.info('User authenticated', { userId, socketId: socket.id });

    } catch (error) {
      socket.emit('authentication-error', { error: 'Invalid token' });
      logger.error('Authentication failed', { error: error.message });
    }
  }

  // Handle joining rooms
  handleJoinRoom(socket, data) {
    const { roomName, userData } = data;

    socket.join(roomName);

    // Notify others in the room
    socket.to(roomName).emit('user-joined', {
      userId: socket.userId,
      userData,
      timestamp: new Date()
    });

    logger.info('User joined room', {
      userId: socket.userId,
      roomName,
      socketId: socket.id
    });
  }

  // Handle leaving rooms
  handleLeaveRoom(socket, data) {
    const { roomName } = data;

    socket.leave(roomName);

    // Notify others in the room
    socket.to(roomName).emit('user-left', {
      userId: socket.userId,
      timestamp: new Date()
    });

    logger.info('User left room', {
      userId: socket.userId,
      roomName,
      socketId: socket.id
    });
  }

  // Handle private messages
  handlePrivateMessage(socket, data) {
    const { targetUserId, message, messageType = 'text' } = data;

    const targetSocketId = this.connectedUsers.get(targetUserId);
    if (targetSocketId) {
      this.io.to(targetSocketId).emit('private-message', {
        from: socket.userId,
        message,
        messageType,
        timestamp: new Date()
      });

      // Send confirmation to sender
      socket.emit('message-sent', {
        to: targetUserId,
        message,
        timestamp: new Date()
      });
    } else {
      socket.emit('message-error', {
        error: 'User not connected',
        targetUserId
      });
    }
  }

  // Handle typing indicators
  handleTypingStart(socket, data) {
    const { roomName } = data;
    socket.to(roomName).emit('user-typing', {
      userId: socket.userId,
      timestamp: new Date()
    });
  }

  handleTypingStop(socket, data) {
    const { roomName } = data;
    socket.to(roomName).emit('user-stopped-typing', {
      userId: socket.userId,
      timestamp: new Date()
    });
  }

  // Handle disconnection
  handleDisconnect(socket) {
    const userId = this.userSockets.get(socket.id);
    if (userId) {
      this.connectedUsers.delete(userId);
      this.userSockets.delete(socket.id);

      // Notify all rooms the user was in
      socket.rooms.forEach(room => {
        if (room !== socket.id) { // Skip the default room
          socket.to(room).emit('user-disconnected', {
            userId,
            timestamp: new Date()
          });
        }
      });

      logger.info('User disconnected', { userId, socketId: socket.id });
    }
  }

  // Broadcast to all connected users
  broadcast(event, data, excludeUserId = null) {
    const emitData = { ...data, timestamp: new Date() };

    if (excludeUserId) {
      const excludeSocketId = this.connectedUsers.get(excludeUserId);
      if (excludeSocketId) {
        this.io.sockets.sockets.forEach((socket) => {
          if (socket.id !== excludeSocketId) {
            socket.emit(event, emitData);
          }
        });
      } else {
        this.io.emit(event, emitData);
      }
    } else {
      this.io.emit(event, emitData);
    }
  }

  // Send to specific user
  sendToUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, {
        ...data,
        timestamp: new Date()
      });
      return true;
    }
    return false;
  }

  // Send to room
  sendToRoom(roomName, event, data, excludeSocketId = null) {
    const emitData = { ...data, timestamp: new Date() };

    if (excludeSocketId) {
      this.io.to(roomName).except(excludeSocketId).emit(event, emitData);
    } else {
      this.io.to(roomName).emit(event, emitData);
    }
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get users in room
  getUsersInRoom(roomName) {
    const room = this.io.sockets.adapter.rooms.get(roomName);
    if (!room) return [];

    const userIds = [];
    for (const socketId of room) {
      const userId = this.userSockets.get(socketId);
      if (userId) {
        userIds.push(userId);
      }
    }

    return userIds;
  }

  // Check if user is connected
  isUserConnected(userId) {
    return this.connectedUsers.has(userId);
  }
}

module.exports = WebSocketService;
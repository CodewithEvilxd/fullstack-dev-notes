
# Advanced Topics in Full-Stack Development

## 1. Microservices Architecture

### What are Microservices?
Microservices is an architectural style that structures an application as a collection of small, independent services that communicate over well-defined APIs.

### Key Principles
- **Single Responsibility** - Each service has one specific purpose
- **Independence** - Services can be developed, deployed, and scaled independently
- **Decentralized Data Management** - Each service manages its own data
- **API Communication** - Services communicate through APIs (REST, GraphQL, gRPC)
- **Fault Tolerance** - System continues to function even if one service fails

### Microservices Implementation

#### Service Discovery Pattern
```javascript
// service-discovery.js
const express = require('express');
const axios = require('axios');

class ServiceDiscovery {
  constructor() {
    this.services = new Map();
    this.healthChecks = new Map();
  }

  // Register a service
  register(serviceName, serviceInfo) {
    this.services.set(serviceName, {
      ...serviceInfo,
      registeredAt: new Date(),
      status: 'healthy'
    });

    // Start health checking
    this.startHealthCheck(serviceName, serviceInfo);
  }

  // Unregister a service
  unregister(serviceName) {
    this.services.delete(serviceName);
    if (this.healthChecks.has(serviceName)) {
      clearInterval(this.healthChecks.get(serviceName));
      this.healthChecks.delete(serviceName);
    }
  }

  // Get service instance
  async getService(serviceName) {
    const service = this.services.get(serviceName);
    if (!service || service.status !== 'healthy') {
      throw new Error(`Service ${serviceName} not available`);
    }
    return service;
  }

  // Health check implementation
  async startHealthCheck(serviceName, serviceInfo) {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${serviceInfo.url}/health`, {
          timeout: 5000
        });

        if (response.status === 200) {
          this.updateServiceStatus(serviceName, 'healthy');
        } else {
          this.updateServiceStatus(serviceName, 'unhealthy');
        }
      } catch (error) {
        this.updateServiceStatus(serviceName, 'unhealthy');
      }
    }, 30000); // Check every 30 seconds

    this.healthChecks.set(serviceName, interval);
  }

  updateServiceStatus(serviceName, status) {
    const service = this.services.get(serviceName);
    if (service) {
      service.status = status;
      service.lastChecked = new Date();
    }
  }

  // Get all services
  getAllServices() {
    return Array.from(this.services.entries()).map(([name, info]) => ({
      name,
      ...info
    }));
  }
}

module.exports = new ServiceDiscovery();
```

#### API Gateway Implementation
```javascript
// api-gateway.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const ServiceDiscovery = require('./service-discovery');

const app = express();
app.use(express.json());

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// Route to user service
app.use('/api/users', authenticateToken, async (req, res) => {
  try {
    const userService = await ServiceDiscovery.getService('user-service');
    const response = await axios({
      method: req.method,
      url: `${userService.url}/api/users${req.path}`,
      data: req.body,
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': req.headers['content-type'],
        'X-User-ID': req.user.userId
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('User service error:', error.message);
    res.status(500).json({ error: 'User service unavailable' });
  }
});

// Route to product service
app.use('/api/products', async (req, res) => {
  try {
    const productService = await ServiceDiscovery.getService('product-service');
    const response = await axios({
      method: req.method,
      url: `${productService.url}/api/products${req.path}`,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type']
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Product service error:', error.message);
    res.status(500).json({ error: 'Product service unavailable' });
  }
});

// Route to order service
app.use('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orderService = await ServiceDiscovery.getService('order-service');
    const response = await axios({
      method: req.method,
      url: `${orderService.url}/api/orders${req.path}`,
      data: req.body,
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': req.headers['content-type'],
        'X-User-ID': req.user.userId
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Order service error:', error.message);
    res.status(500).json({ error: 'Order service unavailable' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: ServiceDiscovery.getAllServices()
  });
});

// Register services (in production, this would be dynamic)
ServiceDiscovery.register('user-service', {
  url: 'http://localhost:3001',
  version: '1.0.0'
});

ServiceDiscovery.register('product-service', {
  url: 'http://localhost:3002',
  version: '1.0.0'
});

ServiceDiscovery.register('order-service', {
  url: 'http://localhost:3003',
  version: '1.0.0'
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
```

#### Circuit Breaker Pattern
```javascript
// circuit-breaker.js
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, monitoringPeriod = 10000) {
    this.threshold = threshold; // Number of failures before opening
    this.timeout = timeout; // Time to wait before trying again
    this.monitoringPeriod = monitoringPeriod; // How often to check

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
      this.successCount = 0;
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.timeout;
    } else if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.timeout;
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime
    };
  }
}

// Usage example
const axios = require('axios');

const circuitBreaker = new CircuitBreaker(3, 30000); // 3 failures, 30s timeout

async function callExternalService() {
  return circuitBreaker.execute(async () => {
    const response = await axios.get('https://api.external-service.com/data');
    return response.data;
  });
}
```

## 2. Serverless Computing

### What is Serverless?
Serverless computing is a cloud computing model where the cloud provider manages the infrastructure and automatically provisions, scales, and manages the servers.

### Key Benefits
- **No Server Management** - Focus on code, not infrastructure
- **Auto Scaling** - Automatically scales based on demand
- **Pay-per-Use** - Only pay for what you use
- **High Availability** - Built-in redundancy and fault tolerance
- **Fast Deployment** - Deploy functions instantly

### AWS Lambda Implementation

#### Basic Lambda Function
```javascript
// lambda/user-service/index.js
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB (connection pooling handled by Lambda)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  cachedDb = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return cachedDb;
}

// Lambda handler for creating a user
exports.createUser = async (event) => {
  try {
    await connectToDatabase();

    const { name, email, password } = JSON.parse(event.body);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'User already exists'
        })
      };
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      })
    };

  } catch (error) {
    console.error('Create user error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
};

// Lambda handler for getting a user
exports.getUser = async (event) => {
  try {
    await connectToDatabase();

    const { id } = event.pathParameters;

    const user = await User.findById(id);
    if (!user) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'User not found'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      })
    };

  } catch (error) {
    console.error('Get user error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      })
    };
  }
};
```

#### API Gateway Integration
```javascript
// lambda/auth-middleware/index.js
const jwt = require('jsonwebtoken');

// Middleware for authentication
exports.authenticate = async (event) => {
  try {
    const authHeader = event.headers.Authorization || event.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Access token required'
        })
      };
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to the event for next Lambda
    event.user = decoded;

    return event;

  } catch (error) {
    return {
      statusCode: 403,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Invalid token'
      })
    };
  }
};

// Middleware for authorization
exports.authorize = (roles = []) => {
  return async (event) => {
    if (!event.user) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Authentication required'
        })
      };
    }

    if (roles.length && !roles.includes(event.user.role)) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Insufficient permissions'
        })
      };
    }

    return event;
  };
};
```

#### Serverless Framework Configuration
```yaml
# serverless.yml
service: fullstack-app

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    MONGODB_URI: ${env:MONGODB_URI}
    JWT_SECRET: ${env:JWT_SECRET}

functions:
  createUser:
    handler: user-service/index.createUser
    events:
      - http:
          path: /users
          method: post
          cors: true

  getUser:
    handler: user-service/index.getUser
    events:
      - http:
          path: /users/{id}
          method: get
          cors: true

  updateUser:
    handler: user-service/index.updateUser
    events:
      - http:
          path: /users/{id}
          method: put
          cors: true
          authorizer: authenticate

  deleteUser:
    handler: user-service/index.deleteUser
    events:
      - http:
          path: /users/{id}
          method: delete
          cors: true
          authorizer: authenticate

  getUsers:
    handler: user-service/index.getUsers
    events:
      - http:
          path: /users
          method: get
          cors: true
          authorizer: authenticate

plugins:
  - serverless-offline
  - serverless-dotenv-plugin

custom:
  dotenv:
    path: .env
```

### Step Functions for Complex Workflows
```javascript
// lambda/step-functions/workflow.js
const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();

exports.startOrderProcessing = async (event) => {
  const { orderId, userId, items } = JSON.parse(event.body);

  const params = {
    stateMachineArn: process.env.ORDER_PROCESSING_STATE_MACHINE_ARN,
    input: JSON.stringify({
      orderId,
      userId,
      items,
      timestamp: new Date().toISOString()
    })
  };

  try {
    const result = await stepfunctions.startExecution(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        executionArn: result.executionArn,
        message: 'Order processing started'
      })
    };
  } catch (error) {
    console.error('Step Functions error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to start order processing'
      })
    };
  }
};

// Step Functions state definitions (in ASL - Amazon States Language)
const orderProcessingDefinition = {
  Comment: "Order Processing Workflow",
  StartAt: "ValidateOrder",
  States: {
    ValidateOrder: {
      Type: "Task",
      Resource: "arn:aws:lambda:us-east-1:123456789012:function:validate-order",
      Next: "ProcessPayment",
      Catch: [
        {
          ErrorEquals: ["ValidationError"],
          Next: "OrderFailed"
        }
      ]
    },
    ProcessPayment: {
      Type: "Task",
      Resource: "arn:aws:lambda:us-east-1:123456789012:function:process-payment",
      Next: "UpdateInventory",
      Catch: [
        {
          ErrorEquals: ["PaymentError"],
          Next: "OrderFailed"
        }
      ]
    },
    UpdateInventory: {
      Type: "Task",
      Resource: "arn:aws:lambda:us-east-1:123456789012:function:update-inventory",
      Next: "SendConfirmation",
      Catch: [
        {
          ErrorEquals: ["InventoryError"],
          Next: "OrderFailed"
        }
      ]
    },
    SendConfirmation: {
      Type: "Task",
      Resource: "arn:aws:lambda:us-east-1:123456789012:function:send-confirmation",
      Next: "OrderCompleted"
    },
    OrderCompleted: {
      Type: "Succeed"
    },
    OrderFailed: {
      Type: "Fail",
      Cause: "Order processing failed"
    }
  }
};
```

## 3. AI/ML Integration

### Machine Learning in Web Applications

#### Sentiment Analysis Service
```javascript
// services/sentiment-analysis.js
const axios = require('axios');

class SentimentAnalysisService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async analyzeSentiment(text) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with only: positive, negative, or neutral.'
            },
            {
              role: 'user',
              content: `Analyze the sentiment of this text: "${text}"`
            }
          ],
          max_tokens: 10,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const sentiment = response.data.choices[0].message.content.trim().toLowerCase();

      return {
        text,
        sentiment,
        confidence: this.calculateConfidence(sentiment, response.data.choices[0])
      };

    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }

  calculateConfidence(sentiment, choice) {
    // Simplified confidence calculation
    const content = choice.message.content.toLowerCase();
    if (content.includes(sentiment)) {
      return 0.9; // High confidence
    }
    return 0.5; // Medium confidence
  }

  async analyzeMultiple(texts) {
    const results = [];

    for (const text of texts) {
      try {
        const result = await this.analyzeSentiment(text);
        results.push(result);
      } catch (error) {
        results.push({
          text,
          sentiment: 'error',
          error: error.message
        });
      }

      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

module.exports = new SentimentAnalysisService();
```

#### Content Moderation System
```javascript
// services/content-moderation.js
const axios = require('axios');

class ContentModerationService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.moderationEndpoint = 'https://api.openai.com/v1/moderations';
  }

  async moderateContent(content) {
    try {
      const response = await axios.post(
        this.moderationEndpoint,
        {
          input: content
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data.results[0];

      return {
        content,
        flagged: result.flagged,
        categories: result.categories,
        category_scores: result.category_scores,
        moderated: this.shouldBlockContent(result)
      };

    } catch (error) {
      console.error('Content moderation error:', error);
      // Fallback to basic filtering if API fails
      return this.basicContentFilter(content);
    }
  }

  shouldBlockContent(result) {
    // Block content that violates community guidelines
    const blockedCategories = [
      'hate',
      'hate/threatening',
      'self-harm',
      'sexual/minors',
      'violence/graphic'
    ];

    return blockedCategories.some(category => result.categories[category]);
  }

  basicContentFilter(content) {
    // Simple regex-based filtering as fallback
    const blockedWords = ['spam', 'offensive', 'inappropriate'];
    const lowerContent = content.toLowerCase();

    const flagged = blockedWords.some(word => lowerContent.includes(word));

    return {
      content,
      flagged,
      categories: { basic_filter: flagged },
      category_scores: { basic_filter: flagged ? 1 : 0 },
      moderated: flagged
    };
  }

  async moderateBatch(contents) {
    const results = [];

    for (const content of contents) {
      const result = await this.moderateContent(content);
      results.push(result);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

module.exports = new ContentModerationService();
```

#### Recommendation Engine
```javascript
// services/recommendation-engine.js
const mongoose = require('mongoose');

class RecommendationEngine {
  constructor() {
    this.User = mongoose.model('User');
    this.Product = mongoose.model('Product');
    this.Interaction = mongoose.model('Interaction');
  }

  // Collaborative filtering based recommendations
  async getCollaborativeRecommendations(userId, limit = 10) {
    try {
      // Find users with similar preferences
      const similarUsers = await this.findSimilarUsers(userId);

      // Get products liked by similar users
      const recommendedProducts = await this.getProductsFromSimilarUsers(
        similarUsers,
        userId,
        limit
      );

      return recommendedProducts;

    } catch (error) {
      console.error('Collaborative recommendation error:', error);
      return this.getPopularProducts(limit);
    }
  }

  // Content-based recommendations
  async getContentBasedRecommendations(userId, limit = 10) {
    try {
      // Get user's interaction history
      const userInteractions = await this.Interaction.find({ user: userId })
        .populate('product')
        .sort({ createdAt: -1 })
        .limit(20);

      // Extract preferred categories and tags
      const preferences = this.extractUserPreferences(userInteractions);

      // Find products with similar characteristics
      const recommendedProducts = await this.findSimilarProducts(
        preferences,
        userId,
        limit
      );

      return recommendedProducts;

    } catch (error) {
      console.error('Content-based recommendation error:', error);
      return this.getPopularProducts(limit);
    }
  }

  // Hybrid recommendation system
  async getHybridRecommendations(userId, limit = 10) {
    const [collaborative, contentBased] = await Promise.all([
      this.getCollaborativeRecommendations(userId, limit * 2),
      this.getContentBasedRecommendations(userId, limit * 2)
    ]);

    // Combine and deduplicate recommendations
    const combined = [...collaborative, ...contentBased];
    const uniqueProducts = this.deduplicateProducts(combined);

    // Score and rank products
    const scoredProducts = await this.scoreProducts(uniqueProducts, userId);

    return scoredProducts.slice(0, limit);
  }

  async findSimilarUsers(userId) {
    // Find users who have interacted with similar products
    const userInteractions = await this.Interaction.find({ user: userId })
      .select('product')
      .limit(50);

    const productIds = userInteractions.map(i => i.product);

    // Find other users who interacted with these products
    const similarUsers = await this.Interaction.aggregate([
      { $match: { product: { $in: productIds }, user: { $ne: userId } } },
      { $group: { _id: '$user', interactionCount: { $sum: 1 } } },
      { $sort: { interactionCount: -1 } },
      { $limit: 20 }
    ]);

    return similarUsers.map(u => u._id);
  }

  async getProductsFromSimilarUsers(similarUsers, excludeUserId, limit) {
    // Get products liked by similar users that the current user hasn't seen
    const userInteractions = await this.Interaction.find({ user: excludeUserId })
      .select('product');

    const seenProducts = userInteractions.map(i => i.product);

    const recommendedProducts = await this.Interaction.aggregate([
      {
        $match: {
          user: { $in: similarUsers },
          product: { $nin: seenProducts },
          type: 'like' // Only positive interactions
        }
      },
      {
        $group: {
          _id: '$product',
          score: { $sum: 1 },
          users: { $addToSet: '$user' }
        }
      },
      { $sort: { score: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: '$product._id',
          name: '$product.name',
          category: '$product.category',
          price: '$product.price',
          score: 1
        }
      }
    ]);

    return recommendedProducts;
  }

  extractUserPreferences(interactions) {
    const categories = {};
    const tags = {};

    interactions.forEach(interaction => {
      const product = interaction.product;

      // Count categories
      if (product.category) {
        categories[product.category] = (categories[product.category] || 0) + 1;
      }

      // Count tags
      if (product.tags) {
        product.tags.forEach(tag => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
      }
    });

    return { categories, tags };
  }

  async findSimilarProducts(preferences, excludeUserId, limit) {
    const { categories, tags } = preferences;

    // Build query based on preferences
    const query = { _id: { $nin: await this.getUserSeenProducts(excludeUserId) } };

    // Add category preferences
    const topCategories = Object.keys(categories).slice(0, 3);
    if (topCategories.length > 0) {
      query.category = { $in: topCategories };
    }

    // Add tag preferences
    const topTags = Object.keys(tags).slice(0, 5);
    if (topTags.length > 0) {
      query.tags = { $in: topTags };
    }

    const products = await this.Product.find(query)
      .limit(limit)
      .sort({ rating: -1, createdAt: -1 });

    return products.map(product => ({
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      score: this.calculateContentScore(product, preferences)
    }));
  }

  async getUserSeenProducts(userId) {
    const interactions = await this.Interaction.find({ user: userId })
      .select('product');
    return interactions.map(i => i.product);
  }

  calculateContentScore(product, preferences) {
    let score = 0;

    // Category match
    if (preferences.categories[product.category]) {
      score += preferences.categories[product.category] * 2;
    }

    // Tag matches
    if (product.tags) {
      product.tags.forEach(tag => {
        if (preferences.tags[tag]) {
          score += preferences.tags[tag];
        }
      });
    }

    return score;
  }

  deduplicateProducts(products) {
    const seen = new Set();
    return products.filter(product => {
      if (seen.has(product._id.toString())) {
        return false;
      }
      seen.add(product._id.toString());
      return true;
    });
  }

  async scoreProducts(products, userId) {
    // Add additional scoring factors
    for (const product of products) {
      // Popularity score
      const interactionCount = await this.Interaction.countDocuments({
        product: product._id,
        type: 'like'
      });

      // Recency score
      const productData = await this.Product.findById(product._id);
      const daysSinceCreated = (Date.now() - productData.createdAt) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.max(0, 30 - daysSinceCreated);

      // Combined score
      product.finalScore = (product.score || 0) + interactionCount + recencyScore;
    }

    return products.sort((a, b) => b.finalScore - a.finalScore);
  }

  async getPopularProducts(limit = 10) {
    // Fallback to popular products
    const products = await this.Product.aggregate([
      {
        $lookup: {
          from: 'interactions',
          localField: '_id',
          foreignField: 'product',
          as: 'interactions'
        }
      },
      {
        $addFields: {
          interactionCount: { $size: '$interactions' }
        }
      },
      { $sort: { interactionCount: -1, rating: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          name: 1,
          category: 1,
          price: 1,
          interactionCount: 1
        }
      }
    ]);

    return products;
  }
}

module.exports = new RecommendationEngine();
```

## 4. Blockchain Integration

### Smart Contract Development

#### Basic ERC-20 Token Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant INITIAL_SUPPLY = 100000 * 10**18; // 100k initial supply

    constructor() ERC20("My Token", "MTK") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply");
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
}
```

#### NFT Marketplace Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public userTokens;

    uint256 public platformFee = 25; // 2.5% platform fee
    address public feeRecipient;

    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event NFTDelisted(uint256 indexed tokenId, address indexed seller);

    constructor(address _feeRecipient) ERC721("NFT Marketplace", "NFTM") {
        feeRecipient = _feeRecipient;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        userTokens[msg.sender].push(newTokenId);

        return newTokenId;
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenId].isActive, "Already listed");

        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true
        });

        emit NFTListed(tokenId, msg.sender, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "NFT not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        address seller = listing.seller;
        uint256 price = listing.price;

        // Calculate platform fee
        uint256 fee = (price * platformFee) / 1000;
        uint256 sellerAmount = price - fee;

        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);

        // Transfer payments
        payable(feeRecipient).transfer(fee);
        payable(seller).transfer(sellerAmount);

        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        // Remove listing
        delete listings[tokenId];

        // Update user tokens
        _removeTokenFromUser(seller, tokenId);
        userTokens[msg.sender].push(tokenId);

        emit NFTSold(tokenId, seller, msg.sender, price);
    }

    function delistNFT(uint256 tokenId) public {
        require(listings[tokenId].seller == msg.sender, "Not the seller");
        require(listings[tokenId].isActive, "Not listed");

        delete listings[tokenId];

        emit NFTDelisted(tokenId, msg.sender);
    }

    function getListing(uint256 tokenId) public view returns (Listing memory) {
        return listings[tokenId];
    }

    function getUserTokens(address user) public view returns (uint256[] memory) {
        return userTokens[user];
    }

    function _removeTokenFromUser(address user, uint256 tokenId) private {
        uint256[] storage tokens = userTokens[user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    function setPlatformFee(uint256 _fee) public onlyOwner {
        require(_fee <= 100, "Fee too high"); // Max 10%
        platformFee = _fee;
    }

    function setFeeRecipient(address _recipient) public onlyOwner {
        feeRecipient = _recipient;
    }

    // Override functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
```

### Web3 Integration

#### Ethereum Connection Service
```javascript
// services/web3.service.js
const Web3 = require('web3');
const MyTokenABI = require('../contracts/MyToken.json');

class Web3Service {
  constructor() {
    // Connect to Ethereum network
    this.web3 = new Web3(process.env.ETHEREUM_RPC_URL || 'http://localhost:8545');

    // Contract addresses
    this.contracts = {
      myToken: process.env.MY_TOKEN_CONTRACT_ADDRESS
    };

    // Initialize contracts
    this.myTokenContract = new this.web3.eth.Contract(
      MyTokenABI,
      this.contracts.myToken
    );
  }

  // Get account balance
  async getBalance(address) {
    try {
      const balance = await this.web3.eth.getBalance(address);
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Get balance error:', error);
      throw new Error('Failed to get balance');
    }
  }

  // Get token balance
  async getTokenBalance(address) {
    try {
      const balance = await this.myTokenContract.methods.balanceOf(address).call();
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Get token balance error:', error);
      throw new Error('Failed to get token balance');
    }
  }

  // Transfer tokens
  async transferTokens(fromAddress, toAddress, amount, privateKey) {
    try {
      const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');

      // Get nonce
      const nonce = await this.web3.eth.getTransactionCount(fromAddress);

      // Create transaction
      const tx = {
        from: fromAddress,
        to: this.contracts.myToken,
        nonce: nonce,
        gas: 200000,
        data: this.myTokenContract.methods.transfer(toAddress, amountWei).encodeABI()
      };

      // Sign transaction
      const signedTx = await this.web3.eth.accounts.signTransaction(tx, privateKey);

      // Send transaction
      const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      return {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed
      };

    } catch (error) {
      console.error('Transfer tokens error:', error);
      throw new Error('Failed to transfer tokens');
    }
  }

  // Get transaction details
  async getTransaction(txHash) {
    try {
      const transaction = await this.web3.eth.getTransaction(txHash);
      const receipt = await this.web3.eth.getTransactionReceipt(txHash);

      return {
        hash: transaction.hash,
        from: transaction.from,
        to: transaction.to,
        value: this.web3.utils.fromWei(transaction.value, 'ether'),
        gasPrice: this.web3.utils.fromWei(transaction.gasPrice, 'gwei'),
        gasLimit: transaction.gas,
        blockNumber: transaction.blockNumber,
        status: receipt.status,
        gasUsed: receipt.gasUsed
      };
    } catch (error) {
      console.error('Get transaction error:', error);
      throw new Error('Failed to get transaction details');
    }
  }

  // Listen for events
  subscribeToEvents() {
    // Listen for Transfer events
    this.myTokenContract.events.Transfer({
      fromBlock: 'latest'
    })
    .on('data', (event) => {
      console.log('Transfer event:', {
        from: event.returnValues.from,
        to: event.returnValues.to,
        value: this.web3.utils.fromWei(event.returnValues.value, 'ether'),
        blockNumber: event.blockNumber
      });
    })
    .on('error', (error) => {
      console.error('Event subscription error:', error);
    });
  }

  // Estimate gas
  async estimateGas(from, to, amount) {
    try {
      const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');

      const gasEstimate = await this.myTokenContract.methods
        .transfer(to, amountWei)
        .estimateGas({ from });

      return gasEstimate;
    } catch (error) {
      console.error('Gas estimation error:', error);
      throw new Error('Failed to estimate gas');
    }
  }

  // Get gas price
  async getGasPrice() {
    try {
      const gasPrice = await this.web3.eth.getGasPrice();
      return {
        wei: gasPrice,
        gwei: this.web3.utils.fromWei(gasPrice, 'gwei'),
        ether: this.web3.utils.fromWei(gasPrice, 'ether')
      };
    } catch (error) {
      console.error('Get gas price error:', error);
      throw new Error('Failed to get gas price');
    }
  }

  // Validate address
  isValidAddress(address) {
    return this.web3.utils.isAddress(address);
  }

  // Convert between units
  toWei(amount, unit = 'ether') {
    return this.web3.utils.toWei(amount.toString(), unit);
  }

  fromWei(amount, unit = 'ether') {
    return this.web3.utils.fromWei(amount.toString(), unit);
  }
}

module.exports = new Web3Service();
```

#### Decentralized Identity (DID) Integration
```javascript
// services/did.service.js
const { DIDDocument } = require('did-resolver');
const { Ed25519KeyPair } = require('@transmute/ed25519-key-pair');
const { Ed25519Signature2018 } = require('@transmute/ed25519-signature-2018');

class DIDService {
  constructor() {
    this.resolver = {}; // DID resolver instance
  }

  // Create a new DID
  async createDID(publicKey, controller) {
    const did = `did:example:${this.generateDIDId()}`;

    const didDocument = {
      '@context': 'https://www.w3.org/ns/did/v1',
      id: did,
      controller: controller,
      verificationMethod: [{
        id: `${did}#keys-1`,
        type: 'Ed25519VerificationKey2018',
        controller: did,
        publicKeyBase58: publicKey
      }],
      authentication: [`${did}#keys-1`],
      assertionMethod: [`${did}#keys-1`],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };

    return didDocument;
  }

  // Resolve a DID
  async resolveDID(did) {
    try {
      // In a real implementation, this would query a DID registry
      const didDocument = await this.resolver.resolve(did);
      return didDocument;
    } catch (error) {
      console.error('DID resolution error:', error);
      throw new Error('Failed to resolve DID');
    }
  }

  // Update DID document
  async updateDID(did, updates, privateKey) {
    try {
      const currentDoc = await this.resolveDID(did);

      // Verify authorization (simplified)
      const isAuthorized = await this.verifyAuthorization(did, updates, privateKey);
      if (!isAuthorized) {
        throw new Error('Unauthorized to update DID');
      }

      const updatedDoc = {
        ...currentDoc,
        ...updates,
        updated: new Date().toISOString()
      };

      // In a real implementation, this would update the DID registry
      return updatedDoc;

    } catch (error) {
      console.error('DID update error:', error);
      throw new Error('Failed to update DID');
    }
  }

  // Verify credential
  async verifyCredential(credential) {
    try {
      // Verify the credential's digital signature
      const isValid = await this.verifySignature(credential);

      // Check if credential is not expired
      const isNotExpired = !credential.expirationDate ||
        new Date(credential.expirationDate) > new Date();

      // Check if credential is not revoked
      const isNotRevoked = await this.checkRevocationStatus(credential.id);

      return {
        verified: isValid && isNotExpired && isNotRevoked,
        checks: {
          signature: isValid,
          expiration: isNotExpired,
          revocation: !isNotRevoked
        }
      };

    } catch (error) {
      console.error('Credential verification error:', error);
      return { verified: false, error: error.message };
    }
  }

  // Issue verifiable credential
  async issueCredential(subject, claims, issuer, privateKey) {
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      type: ['VerifiableCredential'],
      issuer: issuer,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: subject,
        ...claims
      }
    };

    //
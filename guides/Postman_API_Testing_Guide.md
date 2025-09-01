# Postman API Testing Guide

## 1. Getting Started with Postman

### Installation & Setup
```bash
# Download and install Postman
# Visit: https://www.postman.com/downloads/

# Alternative: Use Postman Web version
# Visit: https://web.postman.co/
```

### First API Request
```
Method: GET
URL: https://jsonplaceholder.typicode.com/posts
Headers: (none required)
Body: (none)
```

## 2. HTTP Methods in Postman

### GET Requests
```
Method: GET
URL: https://api.example.com/users
Headers:
  Content-Type: application/json
  Authorization: Bearer your-token-here

Query Parameters:
  page: 1
  limit: 10
  search: john
```

### POST Requests
```
Method: POST
URL: https://api.example.com/users
Headers:
  Content-Type: application/json
  Authorization: Bearer your-token-here

Body (raw JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

### PUT Requests
```
Method: PUT
URL: https://api.example.com/users/123
Headers:
  Content-Type: application/json
  Authorization: Bearer your-token-here

Body (raw JSON):
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "age": 31
}
```

### PATCH Requests
```
Method: PATCH
URL: https://api.example.com/users/123
Headers:
  Content-Type: application/json
  Authorization: Bearer your-token-here

Body (raw JSON):
{
  "age": 32
}
```

### DELETE Requests
```
Method: DELETE
URL: https://api.example.com/users/123
Headers:
  Authorization: Bearer your-token-here
```

## 3. Working with Collections

### Creating Collections
```javascript
// Collection structure example
My API Collection/
├── Authentication/
│   ├── Login
│   ├── Register
│   └── Logout
├── Users/
│   ├── Get All Users
│   ├── Get User by ID
│   ├── Create User
│   ├── Update User
│   └── Delete User
├── Posts/
│   ├── Get All Posts
│   ├── Get Post by ID
│   ├── Create Post
│   ├── Update Post
│   └── Delete Post
└── Utils/
    ├── Health Check
    └── API Status
```

### Collection Variables
```javascript
// Collection Variables Setup
baseUrl: https://api.example.com
token: (will be set after login)
userId: (will be set dynamically)

// Using variables in requests
URL: {{baseUrl}}/users/{{userId}}
Headers:
  Authorization: Bearer {{token}}
```

### Collection Runner
```javascript
// Run multiple requests in sequence
// Useful for testing workflows

// Example: User registration flow
1. Register new user
2. Login with credentials
3. Get user profile
4. Update user information
5. Logout
```

## 4. Environments & Variables

### Environment Setup
```json
// Development Environment
{
  "baseUrl": "http://localhost:3001/api",
  "token": "",
  "userId": "",
  "database": "dev_db"
}

// Production Environment
{
  "baseUrl": "https://api.myapp.com",
  "token": "",
  "userId": "",
  "database": "prod_db"
}

// Staging Environment
{
  "baseUrl": "https://staging-api.myapp.com",
  "token": "",
  "userId": "",
  "database": "staging_db"
}
```

### Dynamic Variables
```javascript
// Pre-request Scripts for dynamic variables
pm.environment.set("timestamp", new Date().toISOString());
pm.environment.set("randomId", Math.random().toString(36).substr(2, 9));

// Tests for setting variables from responses
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    pm.environment.set("userId", jsonData.user.id);
});
```

## 5. Authentication Methods

### Bearer Token Authentication
```javascript
// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Or use variables
Authorization: Bearer {{token}}
```

### Basic Authentication
```javascript
// Username: your-username
// Password: your-password

// Headers (auto-generated)
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

### API Key Authentication
```javascript
// Headers
X-API-Key: your-api-key-here
api_key: your-api-key-here

// Query Parameters
?api_key=your-api-key-here
```

### OAuth 2.0
```javascript
// Postman OAuth 2.0 setup
Type: OAuth 2.0
Add auth data to: Request Headers
Header Prefix: Bearer
Grant Type: Authorization Code
Callback URL: https://oauth.pstmn.io/v1/browser-callback
Auth URL: https://accounts.google.com/oauth/authorize
Access Token URL: https://oauth2.googleapis.com/token
Client ID: your-client-id
Client Secret: your-client-secret
Scope: openid email profile
```

## 6. Writing Tests

### Basic Test Structure
```javascript
// Tests tab in Postman
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});

pm.test("Response has success status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("Response contains required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.have.property('id');
    pm.expect(jsonData.data).to.have.property('name');
});
```

### Advanced Tests
```javascript
// Test response structure
pm.test("User object has correct structure", function () {
    var jsonData = pm.response.json();

    // Check data types
    pm.expect(jsonData.data.id).to.be.a('string');
    pm.expect(jsonData.data.name).to.be.a('string');
    pm.expect(jsonData.data.email).to.be.a('string');
    pm.expect(jsonData.data.createdAt).to.be.a('string');

    // Check email format
    pm.expect(jsonData.data.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    // Check date format
    pm.expect(jsonData.data.createdAt).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
});

// Test array responses
pm.test("Users array is properly formatted", function () {
    var jsonData = pm.response.json();

    pm.expect(jsonData.data).to.be.an('array');
    pm.expect(jsonData.data).to.have.length.of.at.least(1);

    // Check each user in array
    jsonData.data.forEach(function(user) {
        pm.expect(user).to.have.property('id');
        pm.expect(user).to.have.property('name');
        pm.expect(user).to.have.property('email');
    });
});

// Test pagination
pm.test("Pagination works correctly", function () {
    var jsonData = pm.response.json();

    pm.expect(jsonData).to.have.property('pagination');
    pm.expect(jsonData.pagination).to.have.property('page');
    pm.expect(jsonData.pagination).to.have.property('limit');
    pm.expect(jsonData.pagination).to.have.property('total');
    pm.expect(jsonData.pagination).to.have.property('pages');

    // Check data length matches limit
    pm.expect(jsonData.data).to.have.length.of.at.most(jsonData.pagination.limit);
});
```

### Authentication Tests
```javascript
// Test login response
pm.test("Login returns valid token", function () {
    var jsonData = pm.response.json();

    pm.expect(jsonData).to.have.property('token');
    pm.expect(jsonData.token).to.be.a('string');
    pm.expect(jsonData.token.length).to.be.greaterThan(10);

    // Set token for future requests
    pm.environment.set("token", jsonData.token);
});

// Test protected route
pm.test("Protected route requires authentication", function () {
    if (pm.response.code === 401) {
        pm.expect(pm.response.json().error).to.include('Authentication');
    } else {
        pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
    }
});

// Test token expiration
pm.test("Token is not expired", function () {
    var jsonData = pm.response.json();

    if (jsonData.error && jsonData.error.includes('expired')) {
        pm.environment.unset("token");
        pm.expect.fail('Token has expired');
    }
});
```

## 7. Pre-request Scripts

### Setting Up Request Data
```javascript
// Generate random data for testing
pm.environment.set("randomEmail", "test" + Math.random().toString(36).substr(2, 9) + "@example.com");
pm.environment.set("timestamp", new Date().toISOString());
pm.environment.set("randomId", Math.random().toString(36).substr(2, 9));

// Generate UUID
pm.environment.set("uuid", 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
}));
```

### Authentication Setup
```javascript
// Automatic token refresh
if (!pm.environment.get("token") || pm.environment.get("tokenExpiry") < Date.now()) {
    // Token is missing or expired, get a new one
    pm.sendRequest({
        url: pm.environment.get("baseUrl") + "/auth/refresh",
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                refreshToken: pm.environment.get("refreshToken")
            })
        }
    }, function (err, response) {
        if (!err && response.code === 200) {
            var jsonData = response.json();
            pm.environment.set("token", jsonData.token);
            pm.environment.set("tokenExpiry", Date.now() + (15 * 60 * 1000)); // 15 minutes
        }
    });
}
```

### Data Preparation
```javascript
// Prepare test data
var testUser = {
    name: "Test User " + pm.environment.get("timestamp"),
    email: pm.environment.get("randomEmail"),
    password: "testpassword123",
    role: "user"
};

// Set as environment variable for use in request body
pm.environment.set("testUserData", JSON.stringify(testUser));

// Or set individual fields
pm.environment.set("testUserName", testUser.name);
pm.environment.set("testUserEmail", testUser.email);
```

## 8. Automated Testing with Newman

### Installing Newman
```bash
# Install Newman globally
npm install -g newman

# Or install locally
npm install newman --save-dev
```

### Running Collections
```bash
# Run a collection
newman run my-api-collection.json

# Run with environment
newman run my-api-collection.json --environment dev-env.json

# Run with data file
newman run my-api-collection.json --data test-data.json

# Run with reporters
newman run my-api-collection.json --reporters cli,json --reporter-json-export results.json

# Run with specific folder
newman run my-api-collection.json --folder "Authentication"
```

### CI/CD Integration
```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'

    - name: Install Newman
      run: npm install -g newman newman-reporter-htmlextra

    - name: Run API Tests
      run: |
        newman run postman_collection.json \
          --environment postman_environment.json \
          --reporters cli,htmlextra \
          --reporter-htmlextra-export reports/api-test-results.html

    - name: Upload test results
      uses: actions/upload-artifact@v2
      with:
        name: api-test-results
        path: reports/
```

### Newman with Data Files
```json
// test-data.json
[
  {
    "email": "user1@example.com",
    "password": "password123",
    "expectedStatus": 200
  },
  {
    "email": "user2@example.com",
    "password": "password123",
    "expectedStatus": 200
  },
  {
    "email": "invalid@example.com",
    "password": "wrongpassword",
    "expectedStatus": 401
  }
]
```

```javascript
// In Postman test scripts, use data from CSV/JSON files
pm.test("Login test with data", function () {
    var expectedStatus = pm.iterationData.get("expectedStatus");

    if (expectedStatus === 200) {
        pm.test("Login successful", function () {
            pm.response.to.have.status(200);
            var jsonData = pm.response.json();
            pm.expect(jsonData).to.have.property('token');
        });
    } else {
        pm.test("Login failed as expected", function () {
            pm.response.to.have.status(expectedStatus);
        });
    }
});
```

## 9. Advanced Features

### Mock Servers
```javascript
// Create mock responses for development/testing
// Useful when backend is not ready

// Mock response example
{
  "status": "success",
  "data": {
    "id": "mock-user-123",
    "name": "Mock User",
    "email": "mock@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### API Monitoring
```javascript
// Monitor API endpoints
// Set up monitors to run collections at regular intervals

// Monitor configuration
{
  "name": "API Health Check",
  "collection": "health-check-collection",
  "environment": "production-env",
  "schedule": "every 5 minutes",
  "notifications": {
    "onError": true,
    "onFailure": true,
    "email": "team@example.com"
  }
}
```

### API Documentation Generation
```javascript
// Generate API documentation from collections
// Export collection as OpenAPI/Swagger

// Example OpenAPI spec generated from Postman
{
  "openapi": "3.0.0",
  "info": {
    "title": "My API",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        "summary": "Get all users",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/User" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## 10. Best Practices

### Collection Organization
```javascript
// Best practices for organizing collections
├── Root Collection
│   ├── 1. Authentication
│   │   ├── Login
│   │   ├── Register
│   │   ├── Refresh Token
│   │   └── Logout
│   ├── 2. Users
│   │   ├── Get Users
│   │   ├── Get User by ID
│   │   ├── Create User
│   │   ├── Update User
│   │   └── Delete User
│   ├── 3. Posts
│   │   ├── Get Posts
│   │   ├── Create Post
│   │   ├── Update Post
│   │   └── Delete Post
│   └── 4. Utils
│       ├── Health Check
│       └── API Documentation
```

### Test Organization
```javascript
// Comprehensive test suite
pm.test("API Response Tests", function () {
    // Status code tests
    pm.test("Status code is correct", function () {
        pm.response.to.have.status(200);
    });

    // Response time tests
    pm.test("Response time is acceptable", function () {
        pm.expect(pm.response.responseTime).to.be.below(1000);
    });

    // Content type tests
    pm.test("Content-Type is JSON", function () {
        pm.response.to.have.header("Content-Type", "application/json");
    });

    // Schema validation
    pm.test("Response matches schema", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property('success');
        pm.expect(jsonData).to.have.property('data');
    });
});
```

### Environment Management
```javascript
// Environment best practices
{
  "development": {
    "baseUrl": "http://localhost:3001/api",
    "timeout": 5000,
    "retries": 1
  },
  "staging": {
    "baseUrl": "https://staging-api.example.com",
    "timeout": 10000,
    "retries": 2
  },
  "production": {
    "baseUrl": "https://api.example.com",
    "timeout": 15000,
    "retries": 3
  }
}
```

### Security Considerations
```javascript
// Security best practices
// 1. Never commit sensitive data
// 2. Use environment variables for secrets
// 3. Rotate API keys regularly
// 4. Use HTTPS in production
// 5. Implement rate limiting tests
// 6. Test authentication thoroughly

// Example security test
pm.test("Security Headers Present", function () {
    pm.response.to.have.header("X-Content-Type-Options", "nosniff");
    pm.response.to.have.header("X-Frame-Options", "DENY");
    pm.response.to.have.header("X-XSS-Protection", "1; mode=block");
    pm.response.to.have.header("Strict-Transport-Security");
});
```

This comprehensive Postman guide covers everything from basic API testing to advanced automation, CI/CD integration, and best practices for professional API development and testing workflows.
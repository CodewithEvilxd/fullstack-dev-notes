# API Calling & HTTP Methods Guide

## 1. HTTP Methods & REST API Design

### HTTP Methods Overview

#### GET - Retrieve Data
```javascript
// Basic GET request with fetch
async function getUsers() {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// GET with query parameters
async function getUsersWithParams(page = 1, limit = 10, search = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search
  });

  const response = await fetch(`/api/users?${params}`);
  return response.json();
}

// GET with authentication
async function getUserProfile() {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/users/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/login';
  }

  return response.json();
}
```

#### POST - Create New Resources
```javascript
// Basic POST request
async function createUser(userData) {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newUser = await response.json();
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// POST with file upload
async function uploadFile(file, metadata = {}) {
  const formData = new FormData();
  formData.append('file', file);

  // Add metadata
  Object.keys(metadata).forEach(key => {
    formData.append(key, metadata[key]);
  });

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
    // Don't set Content-Type header for FormData
  });

  return response.json();
}

// POST with authentication
async function createPost(postData) {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });

  return response.json();
}
```

#### PUT - Update Entire Resource
```javascript
// PUT request to update entire resource
async function updateUser(userId, userData) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// PUT with conditional updates
async function updateUserIfNotModified(userId, userData, lastModified) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'If-Unmodified-Since': lastModified
    },
    body: JSON.stringify(userData)
  });

  if (response.status === 412) {
    throw new Error('Resource was modified by another user');
  }

  return response.json();
}
```

#### PATCH - Partial Resource Update
```javascript
// PATCH request for partial updates
async function updateUserProfile(userId, updates) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// PATCH with JSON Patch format
async function applyJsonPatch(userId, patches) {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(patches)
  });

  return response.json();
}

// Example JSON Patch operations
const patches = [
  { op: 'replace', path: '/name', value: 'John Smith' },
  { op: 'add', path: '/age', value: 30 },
  { op: 'remove', path: '/oldField' }
];
```

#### DELETE - Remove Resources
```javascript
// Basic DELETE request
async function deleteUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Soft delete with confirmation
async function softDeleteUser(userId) {
  // First, confirm deletion
  const confirmResponse = await fetch(`/api/users/${userId}/confirm-delete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!confirmResponse.ok) {
    throw new Error('Cannot delete user');
  }

  // Then perform soft delete
  const deleteResponse = await fetch(`/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'X-Delete-Type': 'soft'
    }
  });

  return deleteResponse.json();
}

// Bulk delete
async function deleteMultipleUsers(userIds) {
  const response = await fetch('/api/users/bulk-delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ ids: userIds })
  });

  return response.json();
}
```

## 2. Advanced HTTP Features

### Request/Response Headers
```javascript
// Custom headers for API versioning
async function getUsersV2() {
  const response = await fetch('/api/users', {
    headers: {
      'Accept': 'application/vnd.api.v2+json',
      'X-API-Key': process.env.API_KEY
    }
  });
  return response.json();
}

// Content negotiation
async function getData(format = 'json') {
  const acceptHeader = format === 'xml'
    ? 'application/xml'
    : 'application/json';

  const response = await fetch('/api/data', {
    headers: {
      'Accept': acceptHeader
    }
  });

  if (format === 'xml') {
    return response.text();
  }
  return response.json();
}

// Cache control headers
async function getCachedData() {
  const response = await fetch('/api/data', {
    headers: {
      'Cache-Control': 'max-age=300' // Cache for 5 minutes
    }
  });
  return response.json();
}

// CORS handling
async function makeCorsRequest() {
  const response = await fetch('https://api.example.com/data', {
    method: 'GET',
    mode: 'cors', // or 'no-cors' for simple requests
    credentials: 'include' // or 'same-origin'
  });
  return response.json();
}
```

### HTTP Status Codes Handling
```javascript
// Comprehensive status code handling
async function handleApiResponse(response) {
  switch (response.status) {
    case 200:
    case 201:
      return await response.json();

    case 204:
      return { success: true, data: null };

    case 400:
      const badRequestData = await response.json();
      throw new Error(`Bad Request: ${badRequestData.message}`);

    case 401:
      // Token expired
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication required');

    case 403:
      throw new Error('Access denied');

    case 404:
      throw new Error('Resource not found');

    case 409:
      const conflictData = await response.json();
      throw new Error(`Conflict: ${conflictData.message}`);

    case 422:
      const validationData = await response.json();
      throw new Error(`Validation failed: ${validationData.errors.join(', ')}`);

    case 429:
      // Rate limited
      const retryAfter = response.headers.get('Retry-After');
      throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);

    case 500:
    case 502:
    case 503:
    case 504:
      throw new Error('Server error. Please try again later');

    default:
      throw new Error(`Unexpected status code: ${response.status}`);
  }
}

// Usage
async function safeApiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

### Request/Response Interceptors
```javascript
// Request interceptor class
class ApiClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Apply request interceptors
  async applyRequestInterceptors(url, options) {
    let processedOptions = { ...options };

    for (const interceptor of this.requestInterceptors) {
      const result = await interceptor(url, processedOptions);
      if (result) {
        processedOptions = result;
      }
    }

    return processedOptions;
  }

  // Apply response interceptors
  async applyResponseInterceptors(response) {
    let processedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      const result = await interceptor(processedResponse);
      if (result) {
        processedResponse = result;
      }
    }

    return processedResponse;
  }

  // Make request with interceptors
  async request(url, options = {}) {
    const fullUrl = this.baseURL + url;

    // Apply request interceptors
    const processedOptions = await this.applyRequestInterceptors(fullUrl, options);

    // Make the request
    const response = await fetch(fullUrl, processedOptions);

    // Apply response interceptors
    return await this.applyResponseInterceptors(response);
  }

  // Convenience methods
  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient('/api');

// Add authentication interceptor
apiClient.addRequestInterceptor(async (url, options) => {
  const token = localStorage.getItem('token');
  if (token) {
    return {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    };
  }
  return options;
});

// Add response interceptor for error handling
apiClient.addResponseInterceptor(async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  return response;
});

// Add logging interceptor
apiClient.addRequestInterceptor(async (url, options) => {
  console.log(`Making ${options.method} request to ${url}`);
  return options;
});

apiClient.addResponseInterceptor(async (response) => {
  console.log(`Response status: ${response.status}`);
  return response;
});
```

## 3. Axios HTTP Client Library

### Axios Configuration & Setup
```javascript
// axios-config.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.metadata = { requestId: Date.now() };

    // Log request
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`Response received: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);

    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access denied');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429:
          console.error('Rate limited');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error(`API error: ${status}`, data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      // Other error
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Axios API Methods
```javascript
// api/auth.js
import api from './axios-config';

export const authAPI = {
  // Login
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;

    // Store token
    localStorage.setItem('token', token);

    return { token, user };
  },

  // Register
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  // Get current user profile
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', { refreshToken });
    const { token } = response.data;

    localStorage.setItem('token', token);
    return token;
  }
};
```

```javascript
// api/users.js
import api from './axios-config';

export const usersAPI = {
  // Get users with pagination and filtering
  async getUsers(params = {}) {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get single user
  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Create user
  async createUser(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user
  async updateUser(userId, userData) {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Partial update user
  async patchUser(userId, updates) {
    const response = await api.patch(`/users/${userId}`, updates);
    return response.data;
  },

  // Delete user
  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Upload user avatar
  async uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Search users
  async searchUsers(query, params = {}) {
    const response = await api.get('/users/search', {
      params: { q: query, ...params }
    });
    return response.data;
  }
};
```

### Axios Advanced Features
```javascript
// Advanced axios features
import axios from 'axios';

// Cancel tokens for request cancellation
const CancelToken = axios.CancelToken;
let cancel;

export const searchAPI = {
  // Search with cancellation
  async search(query) {
    // Cancel previous request
    if (cancel) {
      cancel();
    }

    try {
      const response = await axios.get('/api/search', {
        params: { q: query },
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled');
      } else {
        throw error;
      }
    }
  }
};

// Axios with retry logic
const axiosRetry = require('axios-retry');

const retryApi = axios.create();
axiosRetry(retryApi, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // 1s, 2s, 3s
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
  }
});

// Progress tracking
export const uploadAPI = {
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      }
    });

    return response.data;
  }
};

// Axios transformers
const transformApi = axios.create({
  transformRequest: [(data) => {
    // Transform request data
    if (data && typeof data === 'object') {
      // Add timestamp to all requests
      data.timestamp = new Date().toISOString();
    }
    return JSON.stringify(data);
  }],

  transformResponse: [(data) => {
    // Transform response data
    const parsed = JSON.parse(data);
    if (parsed.success) {
      // Add metadata
      parsed.metadata = {
        receivedAt: new Date().toISOString(),
        fromCache: false
      };
    }
    return parsed;
  }]
});
```

## 4. Error Handling & Retry Logic

### Comprehensive Error Handling
```javascript
// error-handler.js
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Error handler utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        throw new ApiError(data.message || 'Bad request', status, data);
      case 401:
        // Handle authentication error
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new ApiError('Authentication required', status, data);
      case 403:
        throw new ApiError('Access denied', status, data);
      case 404:
        throw new ApiError('Resource not found', status, data);
      case 409:
        throw new ApiError('Conflict', status, data);
      case 422:
        throw new ApiError('Validation failed', status, data);
      case 429:
        throw new ApiError('Rate limited', status, data);
      case 500:
      case 502:
      case 503:
      case 504:
        throw new ApiError('Server error', status, data);
      default:
        throw new ApiError(`Unexpected error: ${status}`, status, data);
    }
  } else if (error.request) {
    // Network error
    if (error.code === 'ECONNABORTED') {
      throw new TimeoutError('Request timeout');
    }
    throw new NetworkError('Network error');
  } else {
    // Other error
    throw new Error(error.message || 'Unknown error');
  }
};

// Retry utility
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Don't retry on authentication errors
      if (error.status === 401) {
        throw error;
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
};

// Usage example
export const safeApiCall = async (url, options = {}) => {
  const apiCall = () => fetch(url, options).then(response => {
    if (!response.ok) {
      throw { status: response.status, response };
    }
    return response.json();
  });

  try {
    return await retryApiCall(apiCall);
  } catch (error) {
    handleApiError(error);
  }
};
```

### Request Caching & Optimization
```javascript
// cache.js
class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  // Generate cache key
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    return `${url}?${sortedParams}`;
  }

  // Get cached data
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Set cache data
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Clear cache
  clear() {
    this.cache.clear();
  }

  // Remove specific key
  remove(key) {
    this.cache.delete(key);
  }

  // Clean expired entries
  cleanExpired() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Cached API client
class CachedApiClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.cache = new ApiCache();
  }

  async get(url, params = {}, useCache = true) {
    const fullUrl = this.baseURL + url;
    const cacheKey = this.cache.generateKey(fullUrl, params);

    // Check cache first
    if (useCache) {
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        console.log('Returning cached data for:', cacheKey);
        return cachedData;
      }
    }

    // Make API call
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the response
    if (useCache) {
      this.cache.set(cacheKey, data);
    }

    return data;
  }

  // Invalidate cache for specific patterns
  invalidateCache(pattern) {
    // Simple pattern matching
    for (const key of this.cache.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.remove(key);
      }
    }
  }

  // Clear all cache
  clearCache() {
    this.cache.clear();
  }
}

// Usage
const apiClient = new CachedApiClient('/api');

// Cached request
const users = await apiClient.get('/users', { page: 1, limit: 10 });

// Invalidate user cache after update
apiClient.invalidateCache('/users');
```

This comprehensive guide covers all aspects of API calling, from basic HTTP methods to advanced features like caching, error handling, and retry logic. The examples show both native fetch API and popular libraries like Axios, with practical implementations for real-world applications.

## 5. Advanced API Development Patterns

### REST API Design Principles

#### Resource Modeling and URI Design
```javascript
// Good URI design patterns
/api/v1/users                    // Collection of users
/api/v1/users/{id}              // Specific user
/api/v1/users/{id}/posts        // User's posts
/api/v1/posts/{id}/comments     // Post's comments
/api/v1/users/{id}/relationships/friends  // User's friends

// Avoid these patterns
/api/v1/getUsers                // Don't use verbs in URIs
/api/v1/users/getById/{id}      // Redundant
/api/v1/userPosts/{id}          // Inconsistent naming

// URI design best practices
const apiRoutes = {
  // Users
  users: '/api/v1/users',
  userById: '/api/v1/users/:id',
  userPosts: '/api/v1/users/:id/posts',
  userFriends: '/api/v1/users/:id/friends',

  // Posts
  posts: '/api/v1/posts',
  postById: '/api/v1/posts/:id',
  postComments: '/api/v1/posts/:id/comments',
  postLikes: '/api/v1/posts/:id/likes',

  // Search and filtering
  searchUsers: '/api/v1/users/search',
  searchPosts: '/api/v1/posts/search',

  // Analytics
  userStats: '/api/v1/users/:id/stats',
  postAnalytics: '/api/v1/posts/:id/analytics'
};
```

#### Content Negotiation and API Versioning
```javascript
// API versioning strategies
const versioningStrategies = {
  // URI versioning
  uri: '/api/v1/users',

  // Query parameter versioning
  query: '/api/users?version=1',

  // Header versioning
  header: '/api/users', // with Accept: application/vnd.api.v1+json

  // Media type versioning
  mediaType: '/api/users' // with Accept: application/vnd.myapp.v1+json
};

// Content negotiation middleware
function contentNegotiation(req, res, next) {
  const accept = req.get('Accept') || 'application/json';

  // Determine response format
  if (accept.includes('application/xml')) {
    req.format = 'xml';
  } else if (accept.includes('application/vnd.api+json')) {
    req.format = 'json-api';
  } else if (accept.includes('text/csv')) {
    req.format = 'csv';
  } else {
    req.format = 'json';
  }

  // Set appropriate content type
  const contentTypes = {
    json: 'application/json',
    xml: 'application/xml',
    'json-api': 'application/vnd.api+json',
    csv: 'text/csv'
  };

  res.set('Content-Type', contentTypes[req.format]);
  next();
}

// Version negotiation
function apiVersioning(req, res, next) {
  // Check URI version
  const uriMatch = req.path.match(/^\/api\/v(\d+)\//);
  if (uriMatch) {
    req.apiVersion = parseInt(uriMatch[1]);
  }

  // Check header version
  const headerVersion = req.get('X-API-Version');
  if (headerVersion) {
    req.apiVersion = parseInt(headerVersion);
  }

  // Check Accept header
  const acceptMatch = req.get('Accept')?.match(/vnd\.api\.v(\d+)/);
  if (acceptMatch) {
    req.apiVersion = parseInt(acceptMatch[1]);
  }

  // Default to latest version
  req.apiVersion = req.apiVersion || 1;

  // Check if version is supported
  const supportedVersions = [1, 2];
  if (!supportedVersions.includes(req.apiVersion)) {
    return res.status(406).json({
      error: 'API version not supported',
      supportedVersions
    });
  }

  next();
}
```

#### HATEOAS (Hypermedia as the Engine of Application State)
```javascript
// HATEOAS response format
function createHATEOASResponse(resource, req, links = {}) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const resourceUrl = `${baseUrl}${req.path}`;

  const defaultLinks = {
    self: { href: resourceUrl },
    collection: { href: resourceUrl.replace(/\/\d+$/, '') }
  };

  // Add resource-specific links
  if (resource.type === 'user') {
    defaultLinks.posts = { href: `${resourceUrl}/posts` };
    defaultLinks.friends = { href: `${resourceUrl}/friends` };
  } else if (resource.type === 'post') {
    defaultLinks.author = { href: `${baseUrl}/api/users/${resource.authorId}` };
    defaultLinks.comments = { href: `${resourceUrl}/comments` };
  }

  return {
    data: resource,
    _links: { ...defaultLinks, ...links },
    _embedded: {} // For embedded resources
  };
}

// Usage in API routes
app.get('/api/users/:id', (req, res) => {
  const user = getUserById(req.params.id);
  const response = createHATEOASResponse(user, req);

  res.json(response);
});

// Pagination with HATEOAS
app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const users = getUsersPaginated(page, limit);
  const totalPages = Math.ceil(getTotalUsers() / limit);

  const links = {};

  if (page > 1) {
    links.prev = {
      href: `${req.protocol}://${req.get('host')}${req.path}?page=${page - 1}&limit=${limit}`
    };
  }

  if (page < totalPages) {
    links.next = {
      href: `${req.protocol}://${req.get('host')}${req.path}?page=${page + 1}&limit=${limit}`
    };
  }

  links.first = {
    href: `${req.protocol}://${req.get('host')}${req.path}?page=1&limit=${limit}`
  };

  links.last = {
    href: `${req.protocol}://${req.get('host')}${req.path}?page=${totalPages}&limit=${limit}`
  };

  const response = createHATEOASResponse(users, req, links);
  response._embedded = { users: users.data };

  res.json(response);
});
```

### GraphQL API Development

#### GraphQL Schema Design
```javascript
const { ApolloServer, gql } = require('apollo-server-express');

// GraphQL schema definition
const typeDefs = gql`
  # Interfaces
  interface Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Enums
  enum UserRole {
    ADMIN
    MODERATOR
    USER
  }

  enum PostStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  # Custom scalars
  scalar DateTime
  scalar Email
  scalar URL

  # Types
  type User implements Node {
    id: ID!
    email: Email!
    username: String!
    name: String
    avatar: URL
    role: UserRole!
    posts: [Post!]!
    friends: [User!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Post implements Node {
    id: ID!
    title: String!
    content: String!
    excerpt: String
    author: User!
    tags: [String!]!
    status: PostStatus!
    publishedAt: DateTime
    comments: [Comment!]!
    likes: [User!]!
    likeCount: Int!
    commentCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment implements Node {
    id: ID!
    content: String!
    author: User!
    post: Post!
    parent: Comment
    replies: [Comment!]!
    likes: [User!]!
    likeCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Input types
  input CreateUserInput {
    email: Email!
    username: String!
    name: String
    password: String!
  }

  input UpdateUserInput {
    name: String
    avatar: URL
  }

  input CreatePostInput {
    title: String!
    content: String!
    tags: [String!]
    status: PostStatus
  }

  input UpdatePostInput {
    title: String
    content: String
    tags: [String!]
    status: PostStatus
  }

  input CreateCommentInput {
    content: String!
    postId: ID!
    parentId: ID
  }

  # Pagination
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type UserEdge {
    node: User!
    cursor: String!
  }

  # Queries
  type Query {
    # Users
    me: User
    user(id: ID!): User
    users(
      first: Int
      after: String
      last: Int
      before: String
      filter: UserFilter
    ): UserConnection!

    # Posts
    post(id: ID!): Post
    posts(
      first: Int
      after: String
      last: Int
      before: String
      filter: PostFilter
    ): PostConnection!

    # Search
    search(query: String!, type: SearchType): SearchResult!
  }

  # Mutations
  type Mutation {
    # Authentication
    signUp(input: CreateUserInput!): AuthPayload!
    signIn(email: Email!, password: String!): AuthPayload!
    signOut: Boolean!

    # Users
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Posts
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    publishPost(id: ID!): Post!

    # Comments
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!

    # Social features
    likePost(postId: ID!): Post!
    unlikePost(postId: ID!): Post!
    addFriend(userId: ID!): User!
    removeFriend(userId: ID!): User!
  }

  # Subscriptions
  type Subscription {
    postCreated: Post!
    commentAdded(postId: ID!): Comment!
    userOnline(userId: ID!): UserStatus!
  }

  # Supporting types
  type AuthPayload {
    token: String!
    user: User!
  }

  type SearchResult {
    users: [User!]!
    posts: [Post!]!
    totalCount: Int!
  }

  type UserStatus {
    userId: ID!
    isOnline: Boolean!
    lastSeen: DateTime
  }

  # Filters
  input UserFilter {
    role: UserRole
    name: String
    email: String
  }

  input PostFilter {
    status: PostStatus
    authorId: ID
    tags: [String!]
    publishedAfter: DateTime
    publishedBefore: DateTime
  }

  enum SearchType {
    ALL
    USERS
    POSTS
  }

  # Similar types for PostConnection, PostEdge, etc.
  type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PostEdge {
    node: Post!
    cursor: String!
  }
`;
```

#### GraphQL Resolvers with Data Loaders
```javascript
const { ApolloServer } = require('apollo-server-express');
const DataLoader = require('dataloader');

// Data loaders for batching and caching
const createDataLoaders = (db) => ({
  userLoader: new DataLoader(async (userIds) => {
    const users = await db.collection('users').find({
      _id: { $in: userIds.map(id => ObjectId(id)) }
    }).toArray();

    // Return users in the same order as requested IDs
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    return userIds.map(id => userMap[id] || null);
  }),

  postLoader: new DataLoader(async (postIds) => {
    const posts = await db.collection('posts').find({
      _id: { $in: postIds.map(id => ObjectId(id)) }
    }).toArray();

    const postMap = {};
    posts.forEach(post => {
      postMap[post._id.toString()] = post;
    });

    return postIds.map(id => postMap[id] || null);
  }),

  commentLoader: new DataLoader(async (commentIds) => {
    const comments = await db.collection('comments').find({
      _id: { $in: commentIds.map(id => ObjectId(id)) }
    }).toArray();

    const commentMap = {};
    comments.forEach(comment => {
      commentMap[comment._id.toString()] = comment;
    });

    return commentIds.map(id => commentMap[id] || null);
  })
});

// Resolvers
const resolvers = {
  // Custom scalar resolvers
  DateTime: {
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    }
  },

  Email: {
    parseValue(value) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('Invalid email format');
      }
      return value;
    },
    serialize(value) {
      return value;
    }
  },

  // Query resolvers
  Query: {
    me: async (_, __, { user, dataLoaders }) => {
      if (!user) return null;
      return await dataLoaders.userLoader.load(user.id);
    },

    user: async (_, { id }, { dataLoaders }) => {
      return await dataLoaders.userLoader.load(id);
    },

    users: async (_, { first, after, filter = {} }, { db }) => {
      const limit = Math.min(first || 10, 50); // Max 50 items
      const query = {};

      // Apply filters
      if (filter.role) query.role = filter.role;
      if (filter.name) query.name = { $regex: filter.name, $options: 'i' };
      if (filter.email) query.email = { $regex: filter.email, $options: 'i' };

      const users = await db.collection('users')
        .find(query)
        .limit(limit + 1) // +1 to check if there are more
        .toArray();

      const hasNextPage = users.length > limit;
      const edges = users.slice(0, limit).map(user => ({
        node: user,
        cursor: user._id.toString()
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: edges[0]?.cursor,
          endCursor: edges[edges.length - 1]?.cursor
        },
        totalCount: await db.collection('users').countDocuments(query)
      };
    },

    post: async (_, { id }, { dataLoaders }) => {
      return await dataLoaders.postLoader.load(id);
    },

    search: async (_, { query, type }, { db }) => {
      const searchRegex = { $regex: query, $options: 'i' };
      const searchQuery = {
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex }
        ]
      };

      let users = [];
      let posts = [];

      if (type === 'ALL' || type === 'USERS') {
        users = await db.collection('users')
          .find({
            $or: [
              { name: searchRegex },
              { username: searchRegex },
              { email: searchRegex }
            ]
          })
          .limit(20)
          .toArray();
      }

      if (type === 'ALL' || type === 'POSTS') {
        posts = await db.collection('posts')
          .find(searchQuery)
          .limit(20)
          .toArray();
      }

      return {
        users,
        posts,
        totalCount: users.length + posts.length
      };
    }
  },

  // Mutation resolvers
  Mutation: {
    signUp: async (_, { input }, { db, jwt }) => {
      // Check if user exists
      const existingUser = await db.collection('users').findOne({
        $or: [
          { email: input.email },
          { username: input.username }
        ]
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Create user
      const user = {
        ...input,
        password: hashedPassword,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await db.collection('users').insertOne(user);
      const createdUser = { ...user, _id: result.insertedId };

      // Generate token
      const token = jwt.sign(
        { userId: createdUser._id, email: createdUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        token,
        user: createdUser
      };
    },

    createPost: async (_, { input }, { user, db }) => {
      if (!user) throw new Error('Authentication required');

      const post = {
        ...input,
        authorId: user.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        likeCount: 0,
        commentCount: 0
      };

      const result = await db.collection('posts').insertOne(post);
      return { ...post, _id: result.insertedId };
    },

    likePost: async (_, { postId }, { user, db }) => {
      if (!user) throw new Error('Authentication required');

      // Check if already liked
      const existingLike = await db.collection('likes').findOne({
        postId: ObjectId(postId),
        userId: ObjectId(user.userId)
      });

      if (existingLike) {
        throw new Error('Post already liked');
      }

      // Add like
      await db.collection('likes').insertOne({
        postId: ObjectId(postId),
        userId: ObjectId(user.userId),
        createdAt: new Date()
      });

      // Update post like count
      await db.collection('posts').updateOne(
        { _id: ObjectId(postId) },
        { $inc: { likeCount: 1 } }
      );

      return await db.collection('posts').findOne({ _id: ObjectId(postId) });
    }
  },

  // Field resolvers
  User: {
    posts: async (user, _, { db }) => {
      return await db.collection('posts')
        .find({ authorId: ObjectId(user._id) })
        .sort({ createdAt: -1 })
        .toArray();
    },

    friends: async (user, _, { db }) => {
      const friendships = await db.collection('friendships')
        .find({
          $or: [
            { userId1: ObjectId(user._id) },
            { userId2: ObjectId(user._id) }
          ],
          status: 'accepted'
        })
        .toArray();

      const friendIds = friendships.map(f =>
        f.userId1.equals(user._id) ? f.userId2 : f.userId1
      );

      return await db.collection('users')
        .find({ _id: { $in: friendIds } })
        .toArray();
    }
  },

  Post: {
    author: async (post, _, { dataLoaders }) => {
      return await dataLoaders.userLoader.load(post.authorId.toString());
    },

    comments: async (post, _, { db }) => {
      return await db.collection('comments')
        .find({ postId: ObjectId(post._id) })
        .sort({ createdAt: 1 })
        .toArray();
    },

    likes: async (post, _, { db }) => {
      const likes = await db.collection('likes')
        .find({ postId: ObjectId(post._id) })
        .toArray();

      const userIds = likes.map(like => like.userId);
      return await db.collection('users')
        .find({ _id: { $in: userIds } })
        .toArray();
    }
  },

  Comment: {
    author: async (comment, _, { dataLoaders }) => {
      return await dataLoaders.userLoader.load(comment.authorId.toString());
    },

    post: async (comment, _, { dataLoaders }) => {
      return await dataLoaders.postLoader.load(comment.postId.toString());
    },

    replies: async (comment, _, { db }) => {
      return await db.collection('comments')
        .find({ parentId: ObjectId(comment._id) })
        .sort({ createdAt: 1 })
        .toArray();
    }
  }
};

// Context function
const getContext = async ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Invalid token
    }
  }

  return {
    user,
    db: req.app.locals.db,
    dataLoaders: createDataLoaders(req.app.locals.db)
  };
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: getContext,
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production'
});

module.exports = server;
```

### API Gateway and Microservices

#### API Gateway Implementation
```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const CircuitBreaker = require('opossum');

const app = express();

// Service registry
const services = {
  auth: { url: 'http://localhost:3001', prefix: '/auth' },
  users: { url: 'http://localhost:3002', prefix: '/users' },
  posts: { url: 'http://localhost:3003', prefix: '/posts' },
  notifications: { url: 'http://localhost:3004', prefix: '/notifications' }
};

// Circuit breakers for each service
const circuitBreakers = {};
Object.keys(services).forEach(serviceName => {
  circuitBreakers[serviceName] = new CircuitBreaker(async (req, res) => {
    // This will be called by the proxy
    return new Promise((resolve, reject) => {
      const proxy = createProxyMiddleware({
        target: services[serviceName].url,
        changeOrigin: true,
        pathRewrite: {
          [`^${services[serviceName].prefix}`]: ''
        },
        onError: (err, req, res) => {
          reject(err);
        },
        onProxyRes: (proxyRes, req, res) => {
          resolve(proxyRes);
        }
      });

      proxy(req, res, () => {});
    });
  }, {
    timeout: 5000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000
  });
});

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

// Rate limiting
const createRateLimit = (windowMs, max) => rateLimit({
  windowMs,
  max,
  message: {
    error: 'Too many requests',
    retryAfter: Math.ceil(windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes
const authLimiter = createRateLimit(15 * 60 * 1000, 5); // 5 auth requests per 15 minutes

// Request logging and monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {}
  };

  for (const [serviceName, service] of Object.entries(services)) {
    try {
      const response = await fetch(`${service.url}/health`);
      health.services[serviceName] = {
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - Date.now() // Simplified
      };
    } catch (error) {
      health.services[serviceName] = {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  const overallStatus = Object.values(health.services).every(s => s.status === 'healthy')
    ? 'healthy' : 'degraded';

  res.status(overallStatus === 'healthy' ? 200 : 503).json(health);
});

// API documentation
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'API Gateway Documentation',
    version: '1.0.0',
    services: Object.keys(services).map(name => ({
      name,
      url: services[name].url,
      prefix: services[name].prefix
    }))
  });
});

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// Service routing with circuit breakers
Object.keys(services).forEach(serviceName => {
  const service = services[serviceName];
  const breaker = circuitBreakers[serviceName];

  app.use(service.prefix, (req, res, next) => {
    // Add service name to request for logging
    req.serviceName = serviceName;

    // Use circuit breaker
    breaker.fire(req, res).catch(error => {
      console.error(`Circuit breaker tripped for ${serviceName}:`, error);
      res.status(503).json({
        error: 'Service temporarily unavailable',
        service: serviceName,
        retryAfter: Math.ceil(breaker.options.resetTimeout / 1000)
      });
    });
  });
});

// Request transformation middleware
app.use('/api/users', (req, res, next) => {
  // Add user context to requests going to user service
  if (req.user) {
    req.headers['x-user-id'] = req.user.userId;
    req.headers['x-user-role'] = req.user.role;
  }
  next();
});

// Response transformation
app.use('/api/posts', (req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    // Add gateway metadata
    const enhancedData = {
      ...data,
      _metadata: {
        gateway: 'api-gateway-v1',
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] || 'unknown'
      }
    };

    originalJson.call(this, enhancedData);
  };
  next();
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Gateway error:', error);

  if (error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Service unavailable',
      service: req.serviceName || 'unknown'
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableServices: Object.keys(services)
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Available services:', Object.keys(services));
});
```

#### Service Discovery and Load Balancing
```javascript
const express = require('express');
const axios = require('axios');

class ServiceDiscovery {
  constructor() {
    this.services = new Map();
    this.healthChecks = new Map();
  }

  // Register a service
  register(name, instances) {
    this.services.set(name, instances);

    // Start health checks
    this.startHealthChecks(name, instances);
  }

  // Get healthy instances of a service
  getHealthyInstances(name) {
    const instances = this.services.get(name) || [];
    return instances.filter(instance => instance.healthy);
  }

  // Load balancing: round-robin
  getNextInstance(name) {
    const healthyInstances = this.getHealthyInstances(name);
    if (healthyInstances.length === 0) {
      throw new Error(`No healthy instances available for service: ${name}`);
    }

    // Simple round-robin
    const instance = healthyInstances.shift();
    healthyInstances.push(instance);

    return instance;
  }

  // Health check for instances
  async startHealthChecks(name, instances) {
    const checkInterval = setInterval(async () => {
      for (const instance of instances) {
        try {
          const response = await axios.get(`${instance.url}/health`, {
            timeout: 5000
          });
          instance.healthy = response.status === 200;
          instance.lastHealthCheck = new Date();
        } catch (error) {
          instance.healthy = false;
          instance.lastHealthCheck = new Date();
          console.warn(`Health check failed for ${name} at ${instance.url}`);
        }
      }
    }, 30000); // Check every 30 seconds

    this.healthChecks.set(name, checkInterval);
  }

  // Unregister service
  unregister(name) {
    const checkInterval = this.healthChecks.get(name);
    if (checkInterval) {
      clearInterval(checkInterval);
      this.healthChecks.delete(name);
    }
    this.services.delete(name);
  }
}

// Load balancer middleware
function createLoadBalancer(serviceDiscovery) {
  return (serviceName) => {
    return (req, res, next) => {
      try {
        const instance = serviceDiscovery.getNextInstance(serviceName);
        req.targetUrl = instance.url;
        next();
      } catch (error) {
        res.status(503).json({
          error: 'Service unavailable',
          service: serviceName,
          message: error.message
        });
      }
    };
  };
}

// Usage
const serviceDiscovery = new ServiceDiscovery();
const loadBalancer = createLoadBalancer(serviceDiscovery);

// Register services
serviceDiscovery.register('user-service', [
  { url: 'http://localhost:3001', healthy: true },
  { url: 'http://localhost:3002', healthy: true }
]);

serviceDiscovery.register('post-service', [
  { url: 'http://localhost:3003', healthy: true },
  { url: 'http://localhost:3004', healthy: true }
]);

// Use in routes
app.use('/api/users', loadBalancer('user-service'), (req, res) => {
  // Proxy to user service
  proxy.web(req, res, { target: req.targetUrl });
});

app.use('/api/posts', loadBalancer('post-service'), (req, res) => {
  // Proxy to post service
  proxy.web(req, res, { target: req.targetUrl });
});
```

### API Security and Best Practices

#### Advanced Authentication Patterns
```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// JWT with refresh tokens
class TokenManager {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = '15m';
    this.refreshTokenExpiry = '7d';
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'api-server',
      audience: 'api-client'
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry
    });
  }

  generateTokenPair(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || []
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 * 1000 // 15 minutes
    };
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret, {
        issuer: 'api-server',
        audience: 'api-client'
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

  // Token rotation
  async rotateTokens(refreshToken, user) {
    // Verify refresh token
    const decoded = this.verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await TokenStore.findOne({
      userId: decoded.userId,
      token: crypto.createHash('sha256').update(refreshToken).digest('hex')
    });

    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    // Generate new token pair
    const tokens = this.generateTokenPair(user);

    // Update stored refresh token
    storedToken.token = crypto.createHash('sha256').update(tokens.refreshToken).digest('hex');
    await storedToken.save();

    return tokens;
  }
}

// OAuth 2.0 implementation
class OAuthManager {
  constructor() {
    this.clients = new Map();
    this.authorizationCodes = new Map();
    this.accessTokens = new Map();
  }

  // Register OAuth client
  registerClient(clientId, clientSecret, redirectUris) {
    this.clients.set(clientId, {
      clientSecret,
      redirectUris,
      grants: ['authorization_code', 'refresh_token']
    });
  }

  // Authorization code flow
  async authorize(clientId, redirectUri, scope, userId) {
    // Validate client
    const client = this.clients.get(clientId);
    if (!client || !client.redirectUris.includes(redirectUri)) {
      throw new Error('Invalid client or redirect URI');
    }

    // Generate authorization code
    const code = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.authorizationCodes.set(code, {
      clientId,
      redirectUri,
      scope,
      userId,
      expiresAt
    });

    return code;
  }

  // Token exchange
  async tokenExchange(code, clientId, clientSecret, redirectUri) {
    // Validate authorization code
    const authCode = this.authorizationCodes.get(code);
    if (!authCode || authCode.expiresAt < Date.now()) {
      throw new Error('Invalid or expired authorization code');
    }

    // Validate client
    const client = this.clients.get(clientId);
    if (!client || client.clientSecret !== clientSecret) {
      throw new Error('Invalid client credentials');
    }

    if (authCode.redirectUri !== redirectUri) {
      throw new Error('Redirect URI mismatch');
    }

    // Generate access token
    const accessToken = crypto.randomBytes(32).toString('hex');
    const refreshToken = crypto.randomBytes(32).toString('hex');

    this.accessTokens.set(accessToken, {
      clientId,
      userId: authCode.userId,
      scope: authCode.scope,
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
    });

    // Remove used authorization code
    this.authorizationCodes.delete(code);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600
    };
  }

  // Validate access token
  validateAccessToken(token) {
    const tokenData = this.accessTokens.get(token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return null;
    }
    return tokenData;
  }
}

// API key authentication
class APIKeyManager {
  constructor() {
    this.keys = new Map();
  }

  // Generate API key
  generateKey(userId, permissions = []) {
    const key = crypto.randomBytes(32).toString('hex');
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');

    this.keys.set(hashedKey, {
      userId,
      permissions,
      createdAt: new Date(),
      lastUsed: null,
      usageCount: 0
    });

    return key; // Return plain key to user
  }

  // Validate API key
  async validateKey(key) {
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
    const keyData = this.keys.get(hashedKey);

    if (!keyData) {
      return null;
    }

    // Update usage statistics
    keyData.lastUsed = new Date();
    keyData.usageCount++;

    return keyData;
  }

  // Revoke API key
  revokeKey(key) {
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
    return this.keys.delete(hashedKey);
  }
}

// Multi-factor authentication
class MFAManager {
  constructor() {
    this.secrets = new Map();
    this.backupCodes = new Map();
  }

  // Setup TOTP
  setupTOTP(userId) {
    const secret = crypto.randomBytes(32).toString('hex');
    this.secrets.set(userId, secret);

    // Generate backup codes
    const backupCodes = [];
    for (let i = 0; i < 10; i++) {
      backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    this.backupCodes.set(userId, backupCodes);

    return { secret, backupCodes };
  }

  // Verify TOTP
  verifyTOTP(userId, token) {
    const secret = this.secrets.get(userId);
    if (!secret) {
      return false;
    }

    // In a real implementation, use a TOTP library like speakeasy
    // This is a simplified version
    const expectedToken = this.generateTOTP(secret);
    return token === expectedToken;
  }

  // Verify backup code
  verifyBackupCode(userId, code) {
    const backupCodes = this.backupCodes.get(userId);
    if (!backupCodes) {
      return false;
    }

    const index = backupCodes.indexOf(code);
    if (index === -1) {
      return false;
    }

    // Remove used backup code
    backupCodes.splice(index, 1);
    return true;
  }

  generateTOTP(secret) {
    // Simplified TOTP generation (use a proper library in production)
    const time = Math.floor(Date.now() / 30000); // 30-second windows
    return crypto.createHash('sha256')
      .update(secret + time.toString())
      .digest('hex')
      .substring(0, 6);
  }
}
```

This comprehensive guide covers advanced API development patterns including REST API design, GraphQL, microservices, API gateways, authentication, and security. The examples show production-ready implementations with proper error handling, caching, and scalability considerations.
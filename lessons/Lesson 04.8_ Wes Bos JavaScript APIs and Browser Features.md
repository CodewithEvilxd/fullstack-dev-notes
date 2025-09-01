essons/Lesson 04.8_ Wes Bos JavaScript APIs and Browser Features.md</path>
<content">  return stats;
}, { totalUsers: 0, totalAge: 0, activeUsers: 0 });

// find with complex conditions
const user = users.find(user => user.age > 30 && user.active);

// some/every for validation
const hasActiveUsers = users.some(user => user.active);
const allUsersAdult = users.every(user => user.age >= 18);

// Advanced for...of with destructuring
for (let { name, age, active } of users) {
  console.log(`${name} (${age}): ${active ? 'Active' : 'Inactive'}`);
}

// Error handling in loops
for (let user of users) {
  try {
    processUser(user);
  } catch (error) {
    console.error(`Error processing user ${user.name}:`, error);
  }
}

// Async iteration
async function processUsersAsync(users) {
  for await (let user of users) {
    await sendEmail(user);
  }
}

// Control flow with early returns
function validateUser(user) {
  if (!user) return { valid: false, error: 'User is required' };
  if (!user.name) return { valid: false, error: 'Name is required' };
  if (user.age < 18) return { valid: false, error: 'Must be 18 or older' };

  return { valid: true };
}

// Guard clauses
function processOrder(order) {
  if (!order) throw new Error('Order is required');
  if (!order.items?.length) throw new Error('Order must have items');
  if (order.total <= 0) throw new Error('Order total must be positive');

  // Process order...
  return { success: true, orderId: generateId() };
}

// Complex conditional logic
function getShippingCost(order) {
  const baseCost = 5.99;
  const weight = order.totalWeight || 0;

  if (weight === 0) return 0; // Free shipping for digital goods
  if (weight < 1) return baseCost;
  if (weight < 5) return baseCost + (weight - 1) * 2;
  if (weight < 10) return baseCost + 8 + (weight - 5) * 1.5;

  return baseCost + 8 + 7.5 + (weight - 10) * 1; // $1 per pound over 10
}

// State machines
const OrderStates = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

function getNextState(currentState, action) {
  switch (currentState) {
    case OrderStates.PENDING:
      return action === 'confirm' ? OrderStates.CONFIRMED : currentState;
    case OrderStates.CONFIRMED:
      return action === 'process' ? OrderStates.PROCESSING : currentState;
    case OrderStates.PROCESSING:
      return action === 'ship' ? OrderStates.SHIPPED : currentState;
    case OrderStates.SHIPPED:
      return action === 'deliver' ? OrderStates.DELIVERED : currentState;
    default:
      return currentState;
  }
}
```

### **13. Ajax and Fetching Data**

```javascript
// XMLHttpRequest (old way)
function makeXHRRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = function() {
      reject(new Error('Network error'));
    };

    xhr.onabort = function() {
      reject(new Error('Request aborted'));
    };

    // Set headers
    if (data && !(data instanceof FormData)) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      data = JSON.stringify(data);
    }

    xhr.send(data);
  });
}

// Usage
makeXHRRequest('https://api.example.com/users')
  .then(users => console.log('Users:', users))
  .catch(error => console.error('Error:', error));

// Fetch API (modern way)
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': options.token ? `Bearer ${options.token}` : undefined,
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Usage examples
// GET request
const users = await fetchData('https://api.example.com/users');

// POST request
const newUser = await fetchData('https://api.example.com/users', {
  method: 'POST',
  body: { name: 'John', email: 'john@example.com' }
});

// With authentication
const userProfile = await fetchData('https://api.example.com/profile', {
  token: 'your-jwt-token'
});

// Error handling
try {
  const data = await fetchData('https://api.example.com/data');
  console.log('Data:', data);
} catch (error) {
  console.error('Failed to fetch data:', error.message);
  // Show user-friendly error message
  showErrorMessage('Unable to load data. Please try again later.');
}

// Parallel requests
async function fetchMultipleResources() {
  const [users, posts, comments] = await Promise.all([
    fetchData('/api/users'),
    fetchData('/api/posts'),
    fetchData('/api/comments')
  ]);

  return { users, posts, comments };
}

// Sequential requests with dependencies
async function fetchUserWithPosts(userId) {
  const user = await fetchData(`/api/users/${userId}`);
  const posts = await fetchData(`/api/users/${userId}/posts`);
  const comments = await fetchData(`/api/posts/${posts[0].id}/comments`);

  return { user, posts, comments };
}

// Request cancellation with AbortController
function createCancellableFetch() {
  const controller = new AbortController();
  const signal = controller.signal;

  const cancellableFetch = (url, options = {}) => {
    return fetch(url, {
      ...options,
      signal
    });
  };

  return { fetch: cancellableFetch, cancel: () => controller.abort() };
}

// Usage
const { fetch: cancellableFetch, cancel } = createCancellableFetch();

try {
  const data = await cancellableFetch('https://api.example.com/data');
  console.log('Data:', data);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled');
  } else {
    console.error('Fetch error:', error);
  }
}

// Timeout wrapper
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

// Retry mechanism
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt} failed:`, error.message);

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// API client class
class APIClient {
  constructor(baseURL, defaultOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = defaultOptions;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const mergedOptions = { ...this.defaultOptions, ...options };

    try {
      const response = await fetch(url, mergedOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Convenience methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: JSON.stringify(data)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Usage
const api = new APIClient('https://api.example.com', {
  headers: { 'Authorization': 'Bearer token' }
});

const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'John', email: 'john@example.com' });

// Handling different response types
async function fetchWithResponseType(url, responseType = 'json') {
  const response = await fetch(url);

  switch (responseType) {
    case 'json':
      return await response.json();
    case 'text':
      return await response.text();
    case 'blob':
      return await response.blob();
    case 'arrayBuffer':
      return await response.arrayBuffer();
    default:
      return response;
  }
}

// Form data handling
async function submitForm(formData) {
  const response = await fetch('/api/submit', {
    method: 'POST',
    body: formData // FormData object
  });

  return await response.json();
}

// File upload with progress
async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  // Note: Progress tracking requires XMLHttpRequest for upload progress
  // Fetch API doesn't support upload progress yet

  return await response.json();
}

// WebSocket for real-time data
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  handleMessage(data) {
    // Handle incoming messages
    console.log('Received:', data);
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      setTimeout(() => this.connect(), delay);
    }
  }
}

// Server-Sent Events (SSE)
class SSEClient {
  constructor(url) {
    this.url = url;
    this.eventSource = null;
  }

  connect() {
    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('SSE message:', data);
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    // Custom event types
    this.eventSource.addEventListener('user-update', (event) => {
      const userData = JSON.parse(event.data);
      updateUserInterface(userData);
    });
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
```

### **14. ES Modules and Structuring Larger Apps**

```javascript
// Basic module exports
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export function square(x) {
  return multiply(x, x);
}

// Default export
export default function calculateArea(radius) {
  return multiply(PI, square(radius));
}

// Named exports with alias
export { add as sum, multiply as product };

// Importing modules
// main.js
import { add, multiply, PI } from './math.js';
import calculateArea from './math.js';

console.log(add(2, 3)); // 5
console.log(multiply(4, 5)); // 20
console.log(PI); // 3.14159
console.log(calculateArea(5)); // 78.53975

// Import with aliases
import { add as sum, multiply as product } from './math.js';

// Import all as namespace
import * as MathUtils from './math.js';
console.log(MathUtils.add(2, 3)); // 5

// Dynamic imports
async function loadModule() {
  try {
    const mathModule = await import('./math.js');
    console.log(mathModule.add(2, 3)); // 5
  } catch (error) {
    console.error('Failed to load module:', error);
  }
}

// Conditional imports
if (typeof window !== 'undefined') {
  // Browser-specific imports
  import('./browser-utils.js').then(module => {
    // Use browser utilities
  });
} else {
  // Node.js specific imports
  import('./node-utils.js').then(module => {
    // Use Node.js utilities
  });
}

// Module with side effects
// analytics.js
let analyticsLoaded = false;

export function initAnalytics() {
  if (!analyticsLoaded) {
    // Load analytics script
    const script = document.createElement('script');
    script.src = 'https://analytics.example.com/tracker.js';
    document.head.appendChild(script);
    analyticsLoaded = true;
  }
}

export function trackEvent(eventName, data) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, data);
  }
}

// Import with side effects
import { initAnalytics, trackEvent } from './analytics.js';

// Initialize analytics when module loads
initAnalytics();

// Module composition
// user.js
export class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  get displayName() {
    return `${this.name} <${this.email}>`;
  }
}

export function createUser(name, email) {
  return new User(name, email);
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// posts.js
import { User } from './user.js';

export class Post {
  constructor(title, content, author) {
    this.title = title;
    this.content = content;
    this.author = author;
    this.createdAt = new Date();
  }

  get summary() {
    return `${this.title} by ${this.author.name}`;
  }
}

export function createPost(title, content, author) {
  if (!title || !content) {
    throw new Error('Title and content are required');
  }
  return new Post(title, content, author);
}

// app.js
import { createUser, validateEmail } from './user.js';
import { createPost } from './posts.js';

function initApp() {
  const email = 'john@example.com';

  if (!validateEmail(email)) {
    console.error('Invalid email');
    return;
  }

  const user = createUser('John Doe', email);
  const post = createPost('My First Post', 'Hello World!', user);

  console.log(user.displayName); // "John Doe <john@example.com>"
  console.log(post.summary); // "My First Post by John Doe"
}

// Module configuration and barrel exports
// utils/index.js
export { default as formatDate } from './date-utils.js';
export { default as formatNumber } from './number-utils.js';
export { default as truncateText } from './text-utils.js';

// Usage
import { formatDate, formatNumber, truncateText } from './utils/index.js';

// Module with configuration
// config.js
export const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  debug: process.env.NODE_ENV === 'development',
  timeout: 5000
};

export default config;

// api.js
import config from './config.js';

class APIClient {
  constructor() {
    this.baseURL = config.apiUrl;
    this.timeout = config.timeout;
  }

  async get(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      timeout: this.timeout
    });

    if (config.debug) {
      console.log(`API GET ${url}`, response.status);
    }

    return response.json();
  }
}

export default APIClient;

// Circular dependency handling
// moduleA.js
import moduleB from './moduleB.js';

export function funcA() {
  return moduleB.funcB();
}

// moduleB.js
import { funcA } from './moduleA.js';

export function funcB() {
  // Use funcA here - it will be available due to hoisting
  return 'funcB result';
}

// Tree shaking friendly exports
// Only export what's actually used
export const VERSION = '1.0.0';
export const API_ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts'
};

export function getUsers() { /* ... */ }
export function createUser() { /* ... */ }
export function updateUser() { /* ... */ }
export function deleteUser() { /* ... */ }

// Avoid default exports for better tree shaking
// Instead of: export default { getUsers, createUser, ... }

// Module initialization patterns
// Singleton pattern
// database.js
let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = createDatabaseConnection();
  }
  return dbInstance;
}

// Factory pattern
// logger.js
export function createLogger(level = 'info') {
  return {
    log: (message) => {
      if (level === 'debug') {
        console.log(`[DEBUG] ${message}`);
      }
    },
    info: (message) => console.log(`[INFO] ${message}`),
    error: (message) => console.error(`[ERROR] ${message}`)
  };
}

// Plugin architecture
// plugins.js
const plugins = new Map();

export function registerPlugin(name, plugin) {
  plugins.set(name, plugin);
}

export function getPlugin(name) {
  return plugins.get(name);
}

export function executePlugin(name, ...args) {
  const plugin = plugins.get(name);
  if (plugin && typeof plugin.execute === 'function') {
    return plugin.execute(...args);
  }
  throw new Error(`Plugin ${name} not found or invalid`);
}

// Usage
// myPlugin.js
export const myPlugin = {
  name: 'myPlugin',
  execute: (data) => {
    console.log('Executing plugin with data:', data);
    return data.toUpperCase();
  }
};

// main.js
import { registerPlugin, executePlugin } from './plugins.js';
import { myPlugin } from './myPlugin.js';

registerPlugin('myPlugin', myPlugin);
const result = executePlugin('myPlugin', 'hello world');
console.log(result); // "HELLO WORLD"

// Module hot reloading (development)
if (module.hot) {
  module.hot.accept('./user.js', () => {
    console.log('User module updated, reloading...');
    // Handle module updates
  });
}
```

### **15. Final Round of Exercises**

```javascript
// Exercise 1: Implement a Simple Router
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    const handler = this.routes[path];
    if (handler) {
      this.currentRoute = path;
      handler();
      this.updateURL(path);
    } else {
      console.error(`Route ${path} not found`);
    }
  }

  updateURL(path) {
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(null, '', path);
    }
  }

  start() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      const path = window.location.pathname;
      this.navigate(path);
    });

    // Handle initial route
    const initialPath = window.location.pathname;
    this.navigate(initialPath);
  }
}

// Usage
const router = new Router();

router.addRoute('/', () => {
  document.getElementById('content').innerHTML = '<h1>Home</h1>';
});

router.addRoute('/about', () => {
  document.getElementById('content').innerHTML = '<h1>About</h1>';
});

router.addRoute('/contact', () => {
  document.getElementById('content').innerHTML = '<h1>Contact</h1>';
});

// Start the router
router.start();

// Exercise 2: Implement a Simple State Management System
class Store {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = [];
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // Action creators
  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  decrement() {
    this.setState({ count: this.state.count - 1 });
  }

  setName(name) {
    this.setState({ name });
  }
}

// Usage
const store = new Store({ count: 0, name: 'John' });

// Subscribe to state changes
const unsubscribe = store.subscribe((state) => {
  console.log('State changed:', state);
  updateUI(state);
});

function updateUI(state) {
  document.getElementById('count').textContent = state.count;
  document.getElementById('name').textContent = state.name;
}

// Dispatch actions
document.getElementById('increment').addEventListener('click', () => {
  store.increment();
});

document.getElementById('decrement').addEventListener('click', () => {
  store.decrement();
});

document.getElementById('setName').addEventListener('click', () => {
  const name = document.getElementById('nameInput').value;
  store.setName(name);
});

// Exercise 3: Implement a Simple Virtual DOM
class VNode {
  constructor(tag, props = {}, children = []) {
    this.tag = tag;
    this.props = props;
    this.children = children;
  }
}

function h(tag, props = {}, ...children) {
  return new VNode(tag, props, children.flat());
}

class VirtualDOM {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.currentTree = null;
  }

  render(vnode) {
    const newTree = this.createElement(vnode);
    if (this.currentTree) {
      this.updateElement(this.rootElement, this.currentTree, newTree);
    } else {
      this.rootElement.appendChild(newTree);
    }
    this.currentTree = newTree;
  }

  createElement(vnode) {
    if (typeof vnode === 'string') {
      return document.createTextNode(vnode);
    }

    const element = document.createElement(vnode.tag);

    // Set properties
    Object.keys(vnode.props).forEach(key => {
      if (key === 'className') {
        element.className = vnode.props[key];
      } else if (key.startsWith('on')) {
        const eventName = key.toLowerCase().substring(2);
        element.addEventListener(eventName, vnode.props[key]);
      } else {
        element.setAttribute(key, vnode.props[key]);
      }
    });

    // Create children
    vnode.children.forEach(child => {
      element.appendChild(this.createElement(child));
    });

    return element;
  }

  updateElement(parent, oldNode, newNode) {
    if (!oldNode) {
      parent.appendChild(newNode);
    } else if (!newNode) {
      parent.removeChild(oldNode);
    } else if (this.changed(oldNode, newNode)) {
      parent.replaceChild(newNode, oldNode);
    } else if (newNode.nodeType === Node.ELEMENT_NODE) {
      this.updateProps(oldNode, newNode);
      this.updateChildren(oldNode, newNode);
    }
  }

  changed(oldNode, newNode) {
    return (
      oldNode.nodeType !== newNode.nodeType ||
      (oldNode.nodeType === Node.TEXT_NODE && oldNode.textContent !== newNode.textContent) ||
      oldNode.tagName !== newNode.tagName
    );
  }

  updateProps(oldElement, newElement) {
    // Remove old properties
    Array.from(oldElement.attributes).forEach(attr => {
      if (!newElement.hasAttribute(attr.name)) {
        oldElement.removeAttribute(attr.name);
      }
    });

    // Add/update new properties
    Array.from(newElement.attributes).forEach(attr => {
      oldElement.setAttribute(attr.name, attr.value);
    });
  }

  updateChildren(oldElement, newElement) {
    const oldChildren = Array.from(oldElement.childNodes);
    const newChildren = Array.from(newElement.childNodes);

    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
      this.updateElement(oldElement, oldChildren[i], newChildren[i]);
    }
  }
}

// Usage
const vdom = new VirtualDOM(document.getElementById('app'));

function render(count) {
  const vnode = h('div', { className: 'counter' }, [
    h('h1', {}, 'Counter'),
    h('p', {}, `Count: ${count}`),
    h('button', { onclick: () => render(count + 1) }, '+'),
    h('button', { onclick: () => render(count - 1) }, '-')
  ]);

  vdom.render(vnode);
}

render(0);

// Exercise 4: Implement a Simple Testing Framework
class TestFramework {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  test(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  async run() {
    console.log('Running tests...\n');

    for (const test of this.tests) {
      try {
        await test.testFunction();
        this.results.push({ name: test.name, status: 'PASS' });
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.results.push({ name: test.name, status: 'FAIL', error: error.message });
        console.log(`❌ ${test.name}: ${error.message}`);
      }
    }

    this.printSummary();
  }

  printSummary() {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;

    console.log(`\nTest Summary:`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${this.results.length}`);
  }

  assert(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`${message} Expected ${expected}, but got ${actual}`);
    }
  }

  assertThrows(func, message = 'Expected function to throw') {
    try {
      func();
      throw new Error(message);
    } catch (error) {
      if (error.message === message) {
        throw error; // Re-throw our custom error
      }
      // Function threw as expected
    }
  }
}

// Usage
const test = new TestFramework();

// Test cases
test.test('Basic assertion', () => {
  test.assert(1 + 1 === 2, 'Math should work');
});

test.test('Array methods', () => {
  const arr = [1, 2, 3];
  test.assertEqual(arr.length, 3);
  test.assertEqual(arr[0], 1);
  test.assert(arr.includes(2));
});

test.test('Async test', async () => {
  const result = await new Promise(resolve => setTimeout(() => resolve(42), 100));
  test.assertEqual(result, 42);
});

test.test('Exception handling', () => {
  test.assertThrows(() => {
    throw new Error('Test error');
  }, 'Should throw error');
});

// Run tests
test.run();

// Exercise 5: Implement a Simple Build Tool
class BuildTool {
  constructor() {
    this.tasks = new Map();
    this.files = new Map();
  }

  task(name, dependencies = [], handler) {
    this.tasks.set(name, { dependencies, handler });
  }

  file(name, dependencies = [], handler) {
    this.files.set(name, { dependencies, handler });
  }

  async run(target) {
    const executed = new Set();

    const executeTask = async (name) => {
      if (executed.has(name)) return;

      const task = this.tasks.get(name) || this.files.get(name);
      if (!task) {
        throw new Error(`Task/File ${name} not found`);
      }

      // Execute dependencies first
      for (const dep of task.dependencies) {
        await executeTask(dep);
      }

      console.log(`Executing: ${name}`);
      if (task.handler) {
        await task.handler();
      }
      executed.add(name);
    };

    await executeTask(target);
  }

  // Utility methods
  async readFile(filePath) {
    // Simulate file reading
    return `Content of ${filePath}`;
  }

  async writeFile(filePath, content) {
    console.log(`Writing to ${filePath}: ${content.substring(0, 50)}...`);
  }

  async compileJS(input, output) {
    const content = await this.readFile(input);
    const compiled = content.replace(/console\.log/g, '// console.log');
    await this.writeFile(output, compiled);
  }

  async minifyCSS(input, output) {
    const content = await this.readFile(input);
    const minified = content.replace(/\s+/g, ' ').trim();
    await this.writeFile(output, minified);
  }
}

// Usage
const build = new BuildTool();

// Define files
build.file('dist/app.js', ['src/app.js'], async () => {
  await build.compileJS('src/app.js', 'dist/app.js');
});

build.file('dist/styles.css', ['src/styles.css'], async () => {
  await build.minifyCSS('src/styles.css', 'dist/styles.css');
});

// Define tasks
build.task('build', ['dist/app.js', 'dist/styles.css'], async () => {
  console.log('Build completed!');
});

build.task('clean', [], async () => {
  console.log('Cleaning build directory...');
});

build.task('deploy', ['build'], async () => {
  console.log('Deploying to production...');
});

// Run build
build.run('deploy');

// Exercise 6: Implement a Simple CLI Tool
class CLI {
  constructor() {
    this.commands = new Map();
    this.options = {};
  }

  command(name, description, handler) {
    this.commands.set(name, { description, handler });
  }

  option(flags, description, defaultValue) {
    const [short, long] = flags.split(', ');
    this.options[long || short] = { description, defaultValue };
  }

  parse(args = process.argv.slice(2)) {
    const command = args[0];
    const cmd = this.commands.get(command);

    if (!cmd) {
      this.showHelp();
      return;
    }

    // Parse options (simplified)
    const options = {};
    for (let i = 1; i < args.length; i++) {
      if (args[i].startsWith('--')) {
        const option = args[i].substring(2);
        options[option] = args[i + 1] || true;
        i++; // Skip next arg if it's a value
      }
    }

    cmd.handler(options);
  }

  showHelp() {
    console.log('Available commands:');
    for (const [name, cmd] of this.commands) {
      console.log(`  ${name}: ${cmd.description}`);
    }
    console.log('\nAvailable options:');
    for (const [name, option] of Object.entries(this.options)) {
      console.log(`  --${name}: ${option.description}`);
    }
  }
}

// Usage
const cli = new CLI();

cli.command('build', 'Build the project', (options) => {
  console.log('Building project...', options);
});

cli.command('test', 'Run tests', (options) => {
  console.log('Running tests...', options);
});

cli.command('deploy', 'Deploy to production', (options) => {
  console.log('Deploying...', options);
});

cli.option('--env, --environment', 'Set environment', 'development');
cli.option('--verbose, --v', 'Enable verbose output', false);

// Parse command line arguments
cli.parse();

// Exercise 7: Implement a Simple Web Component
class TodoList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    this.render();
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
    this.shadowRoot.addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  handleClick(e) {
    if (e.target.classList.contains('add-btn')) {
      this.addTodo();
    } else if (e.target.classList.contains('delete-btn')) {
      const index = parseInt(e.target.dataset.index);
      this.deleteTodo(index);
    } else if (e.target.classList.contains('toggle-btn')) {
      const index = parseInt(e.target.dataset.index);
      this.toggleTodo(index);
    }
  }

  handleKeyPress(e) {
    if (e.target.classList.contains('todo-input') && e.key === 'Enter') {
      this.addTodo();
    }
  }

  addTodo() {
    const input = this.shadowRoot.querySelector('.todo-input');
    const text = input.value.trim();
    if (text) {
      this.todos.push({ text, completed: false });
      this.saveTodos();
      this.render();
      input.value = '';
    }
  }

  deleteTodo(index) {
    this.todos.splice(index, 1);
    this.saveTodos();
    this.render();
  }

  toggleTodo(index) {
    this.todos[index].completed = !this.todos[index].completed;
    this.saveTodos();
    this.render();
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .todo-list { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; }
        .todo-input { width: 70%; padding: 8px; margin-right: 10px; }
        .add-btn { padding: 8px 16px; background: #4CAF50; color: white; border: none; cursor: pointer; }
        .todo-item { display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #ddd; }
        .todo-text { flex: 1; text-decoration: ${todo => todo.completed ? 'line-through' : 'none'}; }
        .toggle-btn { margin-right: 10px; }
        .delete-btn { background: #f44336; color: white; border: none; padding: 4px 8px; cursor: pointer; }
      </style>

      <div class="todo-list">
        <h2>My Todo List</h2>
        <div>
          <input type="text" class="todo-input" placeholder="Add a new todo...">
          <button class="add-btn">Add</button>
        </div>
        <div class="todos">
          ${this.todos.map((todo, index) => `
            <div class="todo-item">
              <button class="toggle-btn" data-index="${index}">
                ${todo.completed ? '✓' : '○'}
              </button>
              <span class="todo-text" style="text-decoration: ${todo.completed ? 'line-through' : 'none'}">
                ${todo.text}
              </span>
              <button class="delete-btn" data-index="${index}">Delete</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Register the custom element
customElements.define('todo-list', TodoList);

// Usage in HTML
// <todo-list></todo-list>
```

This comprehensive addition covers all the remaining Wes Bos JavaScript course sections, providing students with a complete JavaScript learning experience that includes advanced concepts, practical exercises, and real-world implementation examples.
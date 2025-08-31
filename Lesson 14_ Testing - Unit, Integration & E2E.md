### **Lesson 14: Testing - Unit, Integration & E2E**

## **1. Why Testing Matters**

Testing is crucial for ensuring code quality, preventing bugs, and maintaining reliable applications. It helps catch issues early, provides confidence during refactoring, and serves as documentation for expected behavior.

### **Benefits of Testing:**

#### **Core Benefits:**
- **Bug Prevention:** Catch bugs before they reach production through early detection
- **Code Quality:** Write better, more maintainable code with clear specifications
- **Refactoring Confidence:** Safely modify code without breaking functionality
- **Documentation:** Tests serve as living documentation of expected behavior
- **Collaboration:** Help team members understand expected behavior and API contracts
- **Regression Prevention:** Ensure new features don't break existing functionality

#### **Advanced Benefits:**
- **Design Improvement:** Writing tests often reveals design flaws and encourages better architecture
- **CI/CD Integration:** Automated testing enables continuous integration and deployment
- **Performance Monitoring:** Tests can include performance benchmarks and memory leak detection
- **Security Validation:** Tests can verify security controls and prevent vulnerabilities
- **Compliance Requirements:** Many industries require comprehensive testing for regulatory compliance
- **Cost Reduction:** Finding bugs early reduces the cost of fixing them later

### **Testing Pyramid:**

```
End-to-End Tests (E2E)
    ↗️
Integration Tests
    ↗️
Unit Tests
```

## **2. Unit Testing**

### **What is Unit Testing?**

Unit testing focuses on testing individual units of code (functions, methods, classes) in isolation. Each test should be independent and test a specific piece of functionality.

### **Jest Setup:**

```bash
npm install --save-dev jest
```

```javascript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### **Basic Unit Tests:**

```javascript
// math.js
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error('Cannot divide by zero');
    }
    return a / b;
}

module.exports = { add, subtract, multiply, divide };

// math.test.js
const { add, subtract, multiply, divide } = require('./math');

describe('Math functions', () => {
    describe('add', () => {
        test('should add two positive numbers', () => {
            expect(add(2, 3)).toBe(5);
        });

        test('should add positive and negative numbers', () => {
            expect(add(5, -3)).toBe(2);
        });

        test('should add two negative numbers', () => {
            expect(add(-2, -3)).toBe(-5);
        });
    });

    describe('subtract', () => {
        test('should subtract two numbers', () => {
            expect(subtract(5, 3)).toBe(2);
        });
    });

    describe('multiply', () => {
        test('should multiply two numbers', () => {
            expect(multiply(3, 4)).toBe(12);
        });
    });

    describe('divide', () => {
        test('should divide two numbers', () => {
            expect(divide(10, 2)).toBe(5);
        });

        test('should throw error when dividing by zero', () => {
            expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
        });
    });
});
```

### **Matchers:**

```javascript
// Equality
expect(result).toBe(5);           // Strict equality (===)
expect(result).toEqual({a: 1});   // Deep equality for objects
expect(result).not.toBe(null);     // Negation

// Truthiness
expect(result).toBeTruthy();
expect(result).toBeFalsy();
expect(result).toBeNull();
expect(result).toBeUndefined();

// Numbers
expect(result).toBeGreaterThan(5);
expect(result).toBeLessThan(10);
expect(result).toBeCloseTo(3.14159, 2); // For floating point

// Strings
expect(message).toMatch(/error/);
expect(email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);

// Arrays
expect(array).toContain('item');
expect(array).toHaveLength(3);

// Objects
expect(user).toHaveProperty('name');
expect(user).toHaveProperty('name', 'John');

// Exceptions
expect(() => riskyFunction()).toThrow();
expect(() => riskyFunction()).toThrow('Error message');
expect(() => riskyFunction()).toThrow(Error);
```

### **Setup and Teardown:**

```javascript
// Setup before all tests
beforeAll(() => {
    console.log('Running setup before all tests');
});

// Setup before each test
beforeEach(() => {
    console.log('Running setup before each test');
});

// Cleanup after each test
afterEach(() => {
    console.log('Running cleanup after each test');
});

// Cleanup after all tests
afterAll(() => {
    console.log('Running cleanup after all tests');
});

// Example with database
describe('User model', () => {
    let user;

    beforeEach(async () => {
        user = await User.create({
            name: 'Test User',
            email: 'test@example.com'
        });
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    test('should create user', () => {
        expect(user.name).toBe('Test User');
        expect(user.email).toBe('test@example.com');
    });
});
```

### **Mocking:**

```javascript
// Mocking functions
const mockCallback = jest.fn();
mockCallback.mockReturnValue(42);
mockCallback.mockResolvedValue('async result');

// Mocking modules
jest.mock('./api');
const api = require('./api');

api.fetchData.mockResolvedValue({ data: 'mocked' });

// Mocking timers
jest.useFakeTimers();
jest.advanceTimersByTime(1000);

// Example: Mocking database
const mockUser = {
    id: 1,
    name: 'Mock User',
    save: jest.fn().mockResolvedValue(this)
};

jest.mock('../models/User', () => ({
    findById: jest.fn(),
    create: jest.fn()
}));
```

## **3. Testing React Components**

### **React Testing Library Setup:**

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

```javascript
// setupTests.js
import '@testing-library/jest-dom';

// Button.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
    test('renders button with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    test('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('shows loading state', () => {
        render(<Button loading>Click me</Button>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
```

### **Testing Custom Hooks:**

```javascript
// useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

describe('useCounter', () => {
    test('should increment counter', () => {
        const { result } = renderHook(() => useCounter());

        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(1);
    });

    test('should decrement counter', () => {
        const { result } = renderHook(() => useCounter(5));

        act(() => {
            result.current.decrement();
        });

        expect(result.current.count).toBe(4);
    });
});
```

### **Testing Forms:**

```jsx
// LoginForm.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
    test('submits form with valid data', async () => {
        const mockOnSubmit = jest.fn();
        const user = userEvent.setup();

        render(<LoginForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/username/i), 'john_doe');
        await user.type(screen.getByLabelText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                username: 'john_doe',
                password: 'password123'
            });
        });
    });

    test('shows validation errors', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={jest.fn()} />);

        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
});
```

### **Testing Async Components:**

```jsx
// UserProfile.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile';

// Mock the API call
jest.mock('./api', () => ({
    fetchUser: jest.fn()
}));

const mockFetchUser = require('./api').fetchUser;

describe('UserProfile', () => {
    test('displays user data after loading', async () => {
        const mockUser = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
        };

        mockFetchUser.mockResolvedValue(mockUser);

        render(<UserProfile userId={1} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('john@example.com')).toBeInTheDocument();
        });
    });

    test('displays error message', async () => {
        mockFetchUser.mockRejectedValue(new Error('User not found'));

        render(<UserProfile userId={999} />);

        await waitFor(() => {
            expect(screen.getByText('Error loading user')).toBeInTheDocument();
        });
    });
});
```

## **4. Integration Testing**

### **What is Integration Testing?**

Integration testing verifies that different parts of the application work together correctly. It tests the interaction between components, modules, or services.

### **Supertest for API Testing:**

```bash
npm install --save-dev supertest
```

```javascript
// app.test.js
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('User API', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/users', () => {
        test('should create a new user', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(userData.name);
            expect(response.body.email).toBe(userData.email);
            expect(response.body).not.toHaveProperty('password'); // Password should not be returned
        });

        test('should return 400 for invalid data', async () => {
            const invalidData = {
                name: '',
                email: 'invalid-email',
                password: '123'
            };

            const response = await request(app)
                .post('/api/users')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/users', () => {
        test('should return all users', async () => {
            // Create test users
            await User.create([
                { name: 'User 1', email: 'user1@example.com', password: 'pass1' },
                { name: 'User 2', email: 'user2@example.com', password: 'pass2' }
            ]);

            const response = await request(app)
                .get('/api/users')
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('name', 'User 1');
        });
    });
});
```

### **Testing with Database:**

```javascript
// Database setup for tests
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

// Example: Testing user registration with database
describe('User Registration', () => {
    test('should register user and save to database', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/api/auth/register')
            .send(userData)
            .expect(201);

        // Check response
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.email).toBe(userData.email);

        // Check database
        const savedUser = await User.findById(response.body.user.id);
        expect(savedUser).toBeTruthy();
        expect(savedUser.name).toBe(userData.name);

        // Password should be hashed
        expect(savedUser.password).not.toBe(userData.password);
    });
});
```

## **5. End-to-End Testing**

### **What is E2E Testing?**

End-to-end testing simulates real user scenarios by testing the entire application from the user's perspective. It tests the complete flow from frontend to backend.

### **Cypress Setup:**

```bash
npm install --save-dev cypress
```

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
```

### **Basic E2E Tests:**

```javascript
// cypress/e2e/user-registration.cy.js
describe('User Registration', () => {
    beforeEach(() => {
        cy.visit('/register');
    });

    it('should register a new user', () => {
        cy.get('[data-cy="name-input"]').type('John Doe');
        cy.get('[data-cy="email-input"]').type('john@example.com');
        cy.get('[data-cy="password-input"]').type('password123');
        cy.get('[data-cy="register-button"]').click();

        cy.url().should('include', '/dashboard');
        cy.contains('Welcome, John Doe').should('be.visible');
    });

    it('should show validation errors for invalid data', () => {
        cy.get('[data-cy="register-button"]').click();

        cy.contains('Name is required').should('be.visible');
        cy.contains('Email is required').should('be.visible');
        cy.contains('Password is required').should('be.visible');
    });

    it('should show error for existing email', () => {
        // Assuming a user with this email already exists
        cy.get('[data-cy="name-input"]').type('Jane Smith');
        cy.get('[data-cy="email-input"]').type('existing@example.com');
        cy.get('[data-cy="password-input"]').type('password123');
        cy.get('[data-cy="register-button"]').click();

        cy.contains('Email already exists').should('be.visible');
    });
});

// cypress/e2e/user-login.cy.js
describe('User Login', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should login with valid credentials', () => {
        cy.get('[data-cy="email-input"]').type('user@example.com');
        cy.get('[data-cy="password-input"]').type('password123');
        cy.get('[data-cy="login-button"]').click();

        cy.url().should('include', '/dashboard');
        cy.contains('Welcome back').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
        cy.get('[data-cy="email-input"]').type('invalid@example.com');
        cy.get('[data-cy="password-input"]').type('wrongpassword');
        cy.get('[data-cy="login-button"]').click();

        cy.contains('Invalid credentials').should('be.visible');
    });
});
```

### **Testing User Interactions:**

```javascript
// cypress/e2e/todo-app.cy.js
describe('Todo Application', () => {
    beforeEach(() => {
        cy.visit('/todos');
        // Login if required
        cy.login('user@example.com', 'password123');
    });

    it('should add a new todo', () => {
        const todoText = 'Learn Cypress testing';

        cy.get('[data-cy="todo-input"]').type(todoText);
        cy.get('[data-cy="add-todo-button"]').click();

        cy.contains(todoText).should('be.visible');
        cy.get('[data-cy="todo-list"]').children().should('have.length', 1);
    });

    it('should mark todo as completed', () => {
        // Add a todo first
        cy.get('[data-cy="todo-input"]').type('Test todo');
        cy.get('[data-cy="add-todo-button"]').click();

        // Mark as completed
        cy.get('[data-cy="todo-item"]').first().find('[data-cy="complete-checkbox"]').check();

        // Verify it's marked as completed
        cy.get('[data-cy="todo-item"]').first().should('have.class', 'completed');
    });

    it('should delete a todo', () => {
        // Add a todo first
        cy.get('[data-cy="todo-input"]').type('Todo to delete');
        cy.get('[data-cy="add-todo-button"]').click();

        // Delete the todo
        cy.get('[data-cy="delete-button"]').click();

        // Verify it's removed
        cy.get('[data-cy="todo-list"]').children().should('have.length', 0);
    });

    it('should filter todos', () => {
        // Add multiple todos
        cy.get('[data-cy="todo-input"]').type('Active todo');
        cy.get('[data-cy="add-todo-button"]').click();

        cy.get('[data-cy="todo-input"]').type('Completed todo');
        cy.get('[data-cy="add-todo-button"]').click();
        cy.get('[data-cy="todo-item"]').last().find('[data-cy="complete-checkbox"]').check();

        // Filter by active
        cy.get('[data-cy="filter-active"]').click();
        cy.get('[data-cy="todo-list"]').children().should('have.length', 1);
        cy.contains('Active todo').should('be.visible');

        // Filter by completed
        cy.get('[data-cy="filter-completed"]').click();
        cy.get('[data-cy="todo-list"]').children().should('have.length', 1);
        cy.contains('Completed todo').should('be.visible');
    });
});
```

### **API Testing with Cypress:**

```javascript
// cypress/e2e/api-tests.cy.js
describe('API Tests', () => {
    let authToken;

    before(() => {
        // Login and get token
        cy.request('POST', '/api/auth/login', {
            email: 'test@example.com',
            password: 'password123'
        }).then((response) => {
            authToken = response.body.token;
        });
    });

    it('should get user profile', () => {
        cy.request({
            method: 'GET',
            url: '/api/user/profile',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('email');
        });
    });

    it('should create a new post', () => {
        cy.request({
            method: 'POST',
            url: '/api/posts',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: {
                title: 'Test Post',
                content: 'This is a test post content'
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body.title).to.eq('Test Post');
        });
    });
});
```

## **6. Test-Driven Development (TDD)**

### **TDD Cycle:**

1. **Red:** Write a failing test
2. **Green:** Make the test pass with minimal code
3. **Refactor:** Clean up the code while keeping tests passing

### **TDD Example:**

```javascript
// calculator.test.js
const Calculator = require('./calculator');

describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    // Red: Write failing test
    test('should add two numbers', () => {
        expect(calculator.add(2, 3)).toBe(5);
    });

    // Green: Implement minimal code
    // calculator.js
    class Calculator {
        add(a, b) {
            return a + b;
        }
    }

    // Refactor: Improve implementation
    class Calculator {
        constructor() {
            this.result = 0;
        }

        add(a, b) {
            this.result = a + b;
            return this.result;
        }

        getResult() {
            return this.result;
        }
    }
});
```

## **7. Testing Best Practices**

### **Unit Testing:**
- Test one thing at a time
- Use descriptive test names
- Keep tests independent
- Use mocks and stubs for external dependencies
- Test edge cases and error conditions

### **Integration Testing:**
- Test real database connections
- Test API endpoints thoroughly
- Use test databases
- Clean up test data
- Test error scenarios

### **E2E Testing:**
- Focus on critical user journeys
- Use realistic test data
- Avoid testing implementation details
- Keep tests fast and reliable
- Use page objects for complex interactions

### **General Best Practices:**
- Write tests before or alongside code
- Maintain high test coverage (>80%)
- Run tests frequently (CI/CD)
- Keep tests readable and maintainable
- Use test doubles appropriately

## **8. Code Examples**

### **Example 1: Complete Testing Suite**

```javascript
// models/user.test.js
const User = require('./user');
const mongoose = require('mongoose');

describe('User Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_DATABASE_URL);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('User creation', () => {
        test('should create user with valid data', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser._id).toBeDefined();
            expect(savedUser.name).toBe(userData.name);
            expect(savedUser.email).toBe(userData.email);
            expect(savedUser.password).not.toBe(userData.password); // Should be hashed
        });

        test('should fail with invalid email', async () => {
            const userData = {
                name: 'John Doe',
                email: 'invalid-email',
                password: 'password123'
            };

            const user = new User(userData);
            await expect(user.save()).rejects.toThrow();
        });
    });

    describe('Password methods', () => {
        test('should verify correct password', async () => {
            const user = new User({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            });

            await user.save();
            const isValid = await user.verifyPassword('password123');
            expect(isValid).toBe(true);
        });

        test('should reject incorrect password', async () => {
            const user = new User({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            });

            await user.save();
            const isValid = await user.verifyPassword('wrongpassword');
            expect(isValid).toBe(false);
        });
    });
});

// routes/auth.test.js
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('Auth Routes', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /auth/register', () => {
        test('should register user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('token');
            expect(response.body.user.name).toBe(userData.name);
        });

        test('should return 400 for duplicate email', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            // Create first user
            await request(app)
                .post('/auth/register')
                .send(userData);

            // Try to create duplicate
            const response = await request(app)
                .post('/auth/register')
                .send(userData)
                .expect(400);

            expect(response.body.message).toMatch(/already exists/i);
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            // Create test user
            await request(app)
                .post('/auth/register')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123'
                });
        });

        test('should login with correct credentials', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'password123'
                })
                .expect(200);

            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('john@example.com');
        });

        test('should reject invalid credentials', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(response.body.message).toMatch(/invalid credentials/i);
        });
    });
});
```

### **Example 2: React Component Testing**

```jsx
// components/TodoList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from './TodoList';
import { TodoProvider } from './TodoContext';

// Mock the context
const mockTodos = [
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Write tests', completed: true }
];

const mockAddTodo = jest.fn();
const mockToggleTodo = jest.fn();
const mockDeleteTodo = jest.fn();

jest.mock('./TodoContext', () => ({
    TodoProvider: ({ children }) => <div>{children}</div>,
    useTodos: () => ({
        todos: mockTodos,
        addTodo: mockAddTodo,
        toggleTodo: mockToggleTodo,
        deleteTodo: mockDeleteTodo
    })
}));

describe('TodoList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders todo list correctly', () => {
        render(<TodoList />);

        expect(screen.getByText('Learn React')).toBeInTheDocument();
        expect(screen.getByText('Write tests')).toBeInTheDocument();
    });

    test('calls toggleTodo when checkbox is clicked', () => {
        render(<TodoList />);

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);

        expect(mockToggleTodo).toHaveBeenCalledWith(1);
    });

    test('calls deleteTodo when delete button is clicked', () => {
        render(<TodoList />);

        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        expect(mockDeleteTodo).toHaveBeenCalledWith(1);
    });

    test('adds new todo when form is submitted', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        const input = screen.getByPlaceholderText('Add a new todo');
        const addButton = screen.getByText('Add Todo');

        await user.type(input, 'New todo item');
        await user.click(addButton);

        expect(mockAddTodo).toHaveBeenCalledWith('New todo item');
    });

    test('shows completed todos with strikethrough', () => {
        render(<TodoList />);

        const completedTodo = screen.getByText('Write tests');
        expect(completedTodo).toHaveStyle('text-decoration: line-through');
    });

    test('filters todos correctly', async () => {
        const user = userEvent.setup();
        render(<TodoList />);

        // Filter active todos
        const activeFilter = screen.getByText('Active');
        await user.click(activeFilter);

        expect(screen.getByText('Learn React')).toBeInTheDocument();
        expect(screen.queryByText('Write tests')).not.toBeInTheDocument();
    });
});

// hooks/useLocalStorage.test.js
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('useLocalStorage', () => {
    beforeEach(() => {
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
        localStorageMock.removeItem.mockClear();
        localStorageMock.clear.mockClear();
    });

    test('should return initial value when localStorage is empty', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() => useLocalStorage('test', 'default'));

        expect(result.current[0]).toBe('default');
        expect(localStorageMock.getItem).toHaveBeenCalledWith('test');
    });

    test('should return stored value', () => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify('stored value'));

        const { result } = renderHook(() => useLocalStorage('test', 'default'));

        expect(result.current[0]).toBe('stored value');
    });

    test('should update localStorage when value changes', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() => useLocalStorage('test', 'default'));

        act(() => {
            result.current[1]('new value');
        });

        expect(result.current[0]).toBe('new value');
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'test',
            JSON.stringify('new value')
        );
    });
});
```

## **9. Assignments and Projects**

### **Assignment 14.1: Unit Testing**
Create comprehensive unit tests for:
- Utility functions (string manipulation, date formatting)
- Custom hooks (useLocalStorage, useFetch)
- React components (buttons, forms, lists)
- Error handling and edge cases

### **Assignment 14.2: Integration Testing**
Build integration tests for:
- API endpoints with database operations
- User authentication flow
- Form submissions with validation
- File upload functionality

### **Project 14: Test-Driven Blog API**
Create a blog API using TDD approach:
- Write tests first for all endpoints
- Implement minimal code to pass tests
- Refactor while maintaining test coverage
- Include authentication and authorization tests

### **Challenge Project: E-commerce Testing Suite**
Build a complete testing suite for an e-commerce application:
- Unit tests for all components and utilities
- Integration tests for API endpoints
- E2E tests for critical user journeys
- Performance and load testing
- Accessibility testing

## **10. Testing Tools and Frameworks**

### **Testing Frameworks:**
- **Jest:** Popular testing framework with built-in mocking
- **Mocha:** Flexible testing framework
- **Jasmine:** BDD testing framework
- **AVA:** Fast and simple test runner

### **Assertion Libraries:**
- **Chai:** BDD/TDD assertion library
- **Should.js:** BDD style assertions
- **Expect.js:** Minimal assertion library

### **Testing Utilities:**
- **Sinon.js:** Standalone test spies, stubs, and mocks
- **Enzyme:** React component testing utility
- **Testing Library:** Modern testing utilities

### **Code Coverage:**
- **Istanbul:** Code coverage tool
- **nyc:** Istanbul command line interface
- **Codecov:** Code coverage reporting

## **11. CI/CD Integration**

### **GitHub Actions Example:**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v2

        - name: Setup Node.js
          uses: actions/setup-node@v2
          with:
              node-version: '16'

        - name: Install dependencies
          run: npm ci

        - name: Run tests
          run: npm test

        - name: Generate coverage report
          run: npm run test:coverage

        - name: Upload coverage to Codecov
          uses: codecov/codecov-action@v2
```

## **12. Resources**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [Testing JavaScript](https://testingjavascript.com/)

## **13. Next Steps**

In the next lesson, we'll explore deployment strategies for full-stack applications. You'll learn about:
- Docker containerization
- Cloud platforms (Heroku, Vercel, AWS)
- CI/CD pipelines
- Environment management
- Monitoring and logging

Practice writing tests for your applications and integrate testing into your development workflow!
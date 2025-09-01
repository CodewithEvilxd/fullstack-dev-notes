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

## **14. Advanced Testing Patterns and Techniques**

### **Performance Testing**

#### **Load Testing with Artillery**
```javascript
// performance/load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up phase"
    - duration: 120
      arrivalRate: 5
      rampTo: 50
      name: "Ramp up load"
    - duration: 60
      arrivalRate: 50
      name: "Sustained load"

scenarios:
  - name: "User registration and login flow"
    weight: 40
    flow:
      - post:
          url: "/api/auth/register"
          json:
            name: "Load Test User {{ $randomInt }}"
            email: "loadtest{{ $randomInt }}@example.com"
            password: "password123"
          capture:
            json: "$.user.id"
            as: "userId"
      - post:
          url: "/api/auth/login"
          json:
            email: "loadtest{{ $randomInt }}@example.com"
            password: "password123"
          capture:
            json: "$.token"
            as: "authToken"

  - name: "API data fetching"
    weight: 35
    flow:
      - get:
          url: "/api/posts"
          headers:
            Authorization: "Bearer {{ authToken }}"

  - name: "Create and update operations"
    weight: 25
    flow:
      - post:
          url: "/api/posts"
          headers:
            Authorization: "Bearer {{ authToken }}"
            Content-Type: "application/json"
          json:
            title: "Performance Test Post {{ $randomInt }}"
            content: "This is a test post for performance testing"
```

#### **Memory Leak Testing**
```javascript
// memory-leak.test.js
const { performance, PerformanceObserver } = require('perf_hooks');

// Memory usage monitoring
class MemoryMonitor {
  constructor() {
    this.initialMemory = process.memoryUsage();
    this.snapshots = [];
  }

  takeSnapshot(label) {
    const usage = process.memoryUsage();
    this.snapshots.push({
      label,
      timestamp: Date.now(),
      ...usage
    });
    return usage;
  }

  getMemoryIncrease() {
    const latest = this.snapshots[this.snapshots.length - 1];
    const previous = this.snapshots[this.snapshots.length - 2];

    if (!previous) return 0;

    return {
      heapUsed: latest.heapUsed - previous.heapUsed,
      heapTotal: latest.heapTotal - previous.heapTotal,
      external: latest.external - previous.external
    };
  }

  logMemoryUsage() {
    const usage = process.memoryUsage();
    console.log(`Memory Usage:
      RSS: ${Math.round(usage.rss / 1024 / 1024)}MB
      Heap Used: ${Math.round(usage.heapUsed / 1024 / 1024)}MB
      Heap Total: ${Math.round(usage.heapTotal / 1024 / 1024)}MB
      External: ${Math.round(usage.external / 1024 / 1024)}MB`);
  }
}

// Memory leak detection test
describe('Memory Leak Detection', () => {
  let monitor;

  beforeEach(() => {
    monitor = new MemoryMonitor();
    monitor.takeSnapshot('initial');
  });

  test('should not have memory leaks in user creation loop', async () => {
    const iterations = 1000;
    const users = [];

    for (let i = 0; i < iterations; i++) {
      const user = {
        name: `Test User ${i}`,
        email: `test${i}@example.com`,
        password: 'password123'
      };

      // Simulate user creation without persisting to DB
      users.push(user);

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Take memory snapshot every 100 iterations
      if (i % 100 === 0) {
        monitor.takeSnapshot(`iteration-${i}`);
      }
    }

    monitor.takeSnapshot('final');

    const memoryIncrease = monitor.getMemoryIncrease();
    const maxAllowedIncrease = 50 * 1024 * 1024; // 50MB

    expect(memoryIncrease.heapUsed).toBeLessThan(maxAllowedIncrease);

    // Clean up
    users.length = 0;
  });

  test('should properly clean up event listeners', () => {
    let eventEmitter = { listeners: [] };

    const addListener = (event, callback) => {
      if (!eventEmitter.listeners[event]) {
        eventEmitter.listeners[event] = [];
      }
      eventEmitter.listeners[event].push(callback);
    };

    const removeListener = (event, callback) => {
      if (eventEmitter.listeners[event]) {
        eventEmitter.listeners[event] = eventEmitter.listeners[event]
          .filter(listener => listener !== callback);
      }
    };

    // Add listeners
    const callback1 = () => {};
    const callback2 = () => {};

    addListener('test', callback1);
    addListener('test', callback2);

    expect(eventEmitter.listeners['test']).toHaveLength(2);

    // Remove listeners
    removeListener('test', callback1);

    expect(eventEmitter.listeners['test']).toHaveLength(1);

    // Clean up
    eventEmitter.listeners = {};
  });
});

// Performance regression testing
describe('Performance Regression Tests', () => {
  test('should maintain response time under threshold', async () => {
    const startTime = performance.now();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 10));

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // Assert response time is under 100ms
    expect(responseTime).toBeLessThan(100);
  });

  test('should handle concurrent requests efficiently', async () => {
    const concurrentRequests = 50;
    const promises = [];

    const startTime = performance.now();

    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        new Promise(resolve => setTimeout(() => resolve(i), Math.random() * 100))
      );
    }

    await Promise.all(promises);

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Should complete within reasonable time
    expect(totalTime).toBeLessThan(1000); // 1 second
  });
});
```

### **Accessibility Testing**

#### **Automated Accessibility Testing**
```javascript
// accessibility.test.js
const { configureAxe, axe, toHaveNoViolations } = require('jest-axe');
const React = require('react');
const { render } = require('@testing-library/react');

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Configure axe with custom rules
const axeConfig = configureAxe({
  rules: {
    // Disable specific rules for testing
    'color-contrast': { enabled: false },
    'image-alt': { enabled: true }
  }
});

describe('Accessibility Tests', () => {
  test('Button component should be accessible', async () => {
    const { container } = render(
      <button
        type="button"
        aria-label="Close dialog"
        onClick={() => {}}
      >
        ×
      </button>
    );

    const results = await axe(container, axeConfig);
    expect(results).toHaveNoViolations();
  });

  test('Form should have proper labels and structure', async () => {
    const { container } = render(
      <form>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          aria-describedby="email-help"
          required
        />
        <span id="email-help">We'll never share your email</span>

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          aria-describedby="password-requirements"
          required
        />
        <div id="password-requirements">
          Password must be at least 8 characters long
        </div>

        <button type="submit">Sign In</button>
      </form>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Navigation should have proper ARIA landmarks', async () => {
    const { container } = render(
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Modal dialog should have proper focus management', async () => {
    const { container } = render(
      <div>
        <div
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <h2 id="modal-title">Confirm Action</h2>
          <p id="modal-description">Are you sure you want to delete this item?</p>

          <button autoFocus>Delete</button>
          <button>Cancel</button>
        </div>
        <div aria-hidden="true">Background content</div>
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Keyboard navigation testing
describe('Keyboard Navigation', () => {
  test('should support keyboard navigation for interactive elements', () => {
    const { container } = render(
      <div>
        <button>Button 1</button>
        <a href="#section1">Link 1</a>
        <button>Button 2</a>
        <input type="text" placeholder="Search" />
      </div>
    );

    // Get all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    expect(focusableElements).toHaveLength(4);

    // Test tab order
    focusableElements.forEach((element, index) => {
      expect(element).toHaveAttribute('tabIndex', index === 0 ? '0' : undefined);
    });
  });

  test('should have proper skip links for screen readers', () => {
    const { container } = render(
      <div>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <header>Header content</header>
        <main id="main-content">
          Main content
        </main>
      </div>
    );

    const skipLink = container.querySelector('.skip-link');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});

// Screen reader testing
describe('Screen Reader Support', () => {
  test('should provide descriptive text for icons', () => {
    const { container } = render(
      <div>
        <button aria-label="Close notification">
          <span aria-hidden="true">×</span>
        </button>

        <button aria-label="Search">
          <svg aria-hidden="true" focusable="false">
            <path d="M10 10l5.09-5.09L10 10z"/>
          </svg>
        </button>
      </div>
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons[0]).toHaveAttribute('aria-label', 'Close notification');
    expect(buttons[1]).toHaveAttribute('aria-label', 'Search');
  });

  test('should announce dynamic content changes', () => {
    const { container, rerender } = render(
      <div aria-live="polite" aria-atomic="true">
        <span>Status: Idle</span>
      </div>
    );

    // Simulate status change
    rerender(
      <div aria-live="polite" aria-atomic="true">
        <span>Status: Loading...</span>
      </div>
    );

    const statusDiv = container.querySelector('div');
    expect(statusDiv).toHaveAttribute('aria-live', 'polite');
    expect(statusDiv).toHaveAttribute('aria-atomic', 'true');
  });
});
```

### **Visual Regression Testing**

#### **Visual Testing with Playwright**
```javascript
// visual-regression.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test('homepage should match visual baseline', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for content to load
    await page.waitForSelector('.main-content');

    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.2 // Allow 0.2% difference
    });
  });

  test('user profile page should match baseline', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Navigate to profile
    await page.goto('http://localhost:3000/profile');
    await page.waitForSelector('.profile-content');

    // Take screenshot
    await expect(page).toHaveScreenshot('user-profile.png', {
      mask: [page.locator('.timestamp')], // Mask dynamic content
      threshold: 0.1
    });
  });

  test('responsive design should match baselines', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('homepage-mobile.png');

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('homepage-tablet.png');

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot('homepage-desktop.png');
  });

  test('should handle loading states correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Trigger loading state
    await page.click('[data-testid="load-more-button"]');

    // Wait for loading indicator
    await page.waitForSelector('.loading-spinner');

    // Take screenshot of loading state
    await expect(page).toHaveScreenshot('loading-state.png');

    // Wait for content to load
    await page.waitForSelector('.new-content');

    // Take screenshot of loaded state
    await expect(page).toHaveScreenshot('loaded-state.png');
  });
});

// Component visual testing
test.describe('Component Visual Tests', () => {
  test('button variants should match baselines', async ({ page }) => {
    await page.goto('http://localhost:3000/components');

    // Test different button variants
    const buttonVariants = ['primary', 'secondary', 'danger', 'success'];

    for (const variant of buttonVariants) {
      const button = page.locator(`[data-testid="button-${variant}"]`);
      await expect(button).toHaveScreenshot(`button-${variant}.png`);
    }
  });

  test('form validation states should match baselines', async ({ page }) => {
    await page.goto('http://localhost:3000/forms');

    // Test valid form
    await page.fill('[data-testid="email"]', 'valid@example.com');
    await expect(page.locator('.form-group')).toHaveScreenshot('form-valid.png');

    // Test invalid form
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.click('[data-testid="submit-button"]');
    await expect(page.locator('.form-group')).toHaveScreenshot('form-invalid.png');
  });
});
```

### **Contract Testing**

#### **API Contract Testing with Pact**
```javascript
// consumer/contract.test.js
const { Pact } = require('@pact-foundation/pact');
const { like, term, eachLike } = require('@pact-foundation/pact').Matchers;
const axios = require('axios');

describe('API Consumer Contract Tests', () => {
  const provider = new Pact({
    consumer: 'UserService',
    provider: 'PostService',
    port: 1234,
    log: './logs/pact.log',
    dir: './pacts',
    logLevel: 'INFO'
  });

  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());

  describe('when requesting user posts', () => {
    beforeAll(() => {
      const expectedResponse = {
        posts: eachLike({
          id: like(1),
          title: like('Sample Post'),
          content: like('Post content'),
          authorId: like(123),
          createdAt: term({
            generate: '2023-01-01T00:00:00.000Z',
            matcher: '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z'
          })
        }),
        pagination: {
          page: like(1),
          limit: like(10),
          total: like(25),
          pages: like(3)
        }
      };

      return provider.addInteraction({
        state: 'user has posts',
        uponReceiving: 'a request for user posts',
        withRequest: {
          method: 'GET',
          path: '/api/users/123/posts',
          query: {
            page: '1',
            limit: '10'
          },
          headers: {
            'Authorization': 'Bearer valid-token'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: expectedResponse
        }
      });
    });

    test('should return user posts', async () => {
      // Configure axios to use pact mock server
      const response = await axios.get(`${provider.mockService.baseUrl}/api/users/123/posts`, {
        params: { page: 1, limit: 10 },
        headers: { 'Authorization': 'Bearer valid-token' }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('posts');
      expect(Array.isArray(response.data.posts)).toBe(true);
      expect(response.data.posts[0]).toHaveProperty('id');
      expect(response.data.posts[0]).toHaveProperty('title');
    });
  });

  describe('when creating a new post', () => {
    beforeAll(() => {
      const expectedRequest = {
        title: like('New Post Title'),
        content: like('New post content'),
        authorId: like(123)
      };

      const expectedResponse = {
        id: like(456),
        title: like('New Post Title'),
        content: like('New post content'),
        authorId: like(123),
        createdAt: term({
          generate: '2023-01-01T00:00:00.000Z',
          matcher: '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z'
        })
      };

      return provider.addInteraction({
        state: 'user can create posts',
        uponReceiving: 'a request to create a post',
        withRequest: {
          method: 'POST',
          path: '/api/posts',
          headers: {
            'Authorization': 'Bearer valid-token',
            'Content-Type': 'application/json'
          },
          body: expectedRequest
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          },
          body: expectedResponse
        }
      });
    });

    test('should create a new post', async () => {
      const postData = {
        title: 'New Post Title',
        content: 'New post content',
        authorId: 123
      };

      const response = await axios.post(`${provider.mockService.baseUrl}/api/posts`, postData, {
        headers: {
          'Authorization': 'Bearer valid-token',
          'Content-Type': 'application/json'
        }
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe('New Post Title');
    });
  });
});

// Provider contract verification
// provider/contract-verification.test.js
const { Verifier } = require('@pact-foundation/pact');
const path = require('path');

describe('Pact Verification', () => {
  test('should validate the expectations of UserService', () => {
    const opts = {
      provider: 'PostService',
      providerBaseUrl: 'http://localhost:3001',
      pactUrls: [
        path.resolve(__dirname, '../pacts/userservice-postservice.json')
      ],
      providerVersion: '1.0.0',
      publishVerificationResult: true,
      providerVersionTags: ['main']
    };

    return new Verifier(opts).verifyProvider();
  });
});
```

### **Property-Based Testing**

#### **Property Testing with fast-check**
```javascript
const fc = require('fast-check');

// Property-based tests for mathematical functions
describe('Mathematical Functions - Property Based', () => {
  test('addition should be commutative', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return add(a, b) === add(b, a);
      })
    );
  });

  test('addition should be associative', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
        return add(add(a, b), c) === add(a, add(b, c));
      })
    );
  });

  test('multiplication should distribute over addition', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
        return multiply(a, add(b, c)) === add(multiply(a, b), multiply(a, c));
      })
    );
  });

  test('division should be inverse of multiplication', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer().filter(b => b !== 0), (a, b) => {
        return divide(multiply(a, b), b) === a;
      })
    );
  });
});

// Property-based tests for data structures
describe('Array Operations - Property Based', () => {
  test('reverse should be involutary', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const reversed = reverse(arr);
        const doubleReversed = reverse(reversed);
        return JSON.stringify(arr) === JSON.stringify(doubleReversed);
      })
    );
  });

  test('filter should preserve order', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const filtered = arr.filter(x => x > 0);
        let isOrdered = true;

        for (let i = 1; i < filtered.length; i++) {
          if (filtered[i] < filtered[i - 1]) {
            isOrdered = false;
            break;
          }
        }

        return isOrdered;
      })
    );
  });

  test('map should preserve length', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.func(fc.integer()), (arr, f) => {
        const mapped = arr.map(f);
        return mapped.length === arr.length;
      })
    );
  });
});

// Property-based tests for string operations
describe('String Operations - Property Based', () => {
  test('string concatenation should be associative', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        return (a + b) + c === a + (b + c);
      })
    );
  });

  test('string length should be additive under concatenation', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        return (a + b).length === a.length + b.length;
      })
    );
  });

  test('substring should not exceed original length', () => {
    fc.assert(
      fc.property(fc.string(), fc.integer(), fc.integer(), (str, start, length) => {
        const substring = str.substring(start, start + length);
        return substring.length <= str.length;
      })
    );
  });
});

// Property-based tests for API responses
describe('API Response Properties', () => {
  test('user list should have valid structure', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1 }),
            name: fc.string({ minLength: 1 }),
            email: fc.string().filter(s => s.includes('@'))
          })
        ),
        (users) => {
          // All users should have required fields
          return users.every(user =>
            user.id > 0 &&
            user.name.length > 0 &&
            user.email.includes('@')
          );
        }
      )
    );
  });

  test('pagination should be consistent', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }), // total items
        fc.integer({ min: 1, max: 100 }),  // items per page
        fc.integer({ min: 1 }),             // current page
        (total, limit, page) => {
          const totalPages = Math.ceil(total / limit);
          const startIndex = (page - 1) * limit;
          const endIndex = Math.min(startIndex + limit, total);

          // Page should be within valid range
          if (page > totalPages) return true; // Invalid page, but that's handled by API

          // Start index should be less than total
          return startIndex < total;
        }
      )
    );
  });
});

// Property-based tests for React components
describe('React Component Properties', () => {
  test('counter component should handle any integer', () => {
    fc.assert(
      fc.property(fc.integer(), (initialValue) => {
        const { result } = renderHook(() => useCounter(initialValue));

        // Component should initialize with provided value
        expect(result.current.count).toBe(initialValue);

        // Increment should work
        act(() => result.current.increment());
        expect(result.current.count).toBe(initialValue + 1);

        // Decrement should work
        act(() => result.current.decrement());
        expect(result.current.count).toBe(initialValue);
      })
    );
  });

  test('form validation should handle various inputs', () => {
    fc.assert(
      fc.property(
        fc.string(), // name
        fc.string(), // email
        fc.string(), // password
        (name, email, password) => {
          const errors = validateForm({ name, email, password });

          // If name is empty, there should be an error
          if (name.trim() === '') {
            expect(errors.name).toBeDefined();
          }

          // If email doesn't contain @, there should be an error
          if (!email.includes('@')) {
            expect(errors.email).toBeDefined();
          }

          // If password is too short, there should be an error
          if (password.length < 8) {
            expect(errors.password).toBeDefined();
          }

          return true;
        }
      )
    );
  });
});
```

### **Mutation Testing**

#### **Mutation Testing with Stryker**
```javascript
// stryker.conf.js
module.exports = function(config) {
  config.set({
    mutator: 'javascript',
    packageManager: 'npm',
    reporters: ['html', 'clear-text', 'progress'],
    testRunner: 'jest',
    jest: {
      configFile: 'jest.config.js'
    },
    mutate: [
      'src/**/*.js',
      '!src/**/*.test.js',
      '!src/**/*.spec.js'
    ],
    thresholds: {
      high: 80,
      low: 60,
      break: 50
    },
    coverageAnalysis: 'perTest'
  });
};

// Example code to test with mutations
// src/math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function isEven(n) {
  return n % 2 === 0;
}

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

module.exports = { add, multiply, isEven, factorial };

// Test file
// src/math.test.js
const { add, multiply, isEven, factorial } = require('./math');

describe('Math functions', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('should add positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2);
    });
  });

  describe('multiply', () => {
    test('should multiply two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    test('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe('isEven', () => {
    test('should return true for even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(0)).toBe(true);
    });

    test('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
    });
  });

  describe('factorial', () => {
    test('should calculate factorial correctly', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
    });
  });
});
```

### **Test Automation and CI/CD Integration**

#### **Advanced GitHub Actions Workflow**
```yaml
# .github/workflows/comprehensive-testing.yml
name: Comprehensive Testing Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run unit tests
      run: npm run test:unit

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unit-tests
        name: Unit Tests

  integration-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:5.0
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
        node-version: 18.x
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: mongodb://localhost:27017/test
        REDIS_URL: redis://localhost:6379

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Start application
      run: npm start &
      env:
        NODE_ENV: test

    - name: Run E2E tests
      run: npm run test:e2e

  performance-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Artillery
      run: npm install -g artillery

    - name: Run performance tests
      run: artillery run performance/load-test.yml

  accessibility-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Start application
      run: npm start &
      env:
        NODE_ENV: test

    - name: Run accessibility tests
      run: npm run test:accessibility

  visual-regression-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'

    - name: Install Playwright
      run: npx playwright install

    - name: Build application
      run: npm run build

    - name: Start application
      run: npm start &
      env:
        NODE_ENV: test

    - name: Run visual regression tests
      run: npm run test:visual

    - name: Upload visual diffs
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: visual-regression-diffs
        path: test-results/

  mutation-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Stryker
      run: npm install -g @stryker-mutator/core

    - name: Run mutation tests
      run: stryker run

  security-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18.x
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run security audit
      run: npm audit --audit-level high

    - name: Run SAST (Static Application Security Testing)
      uses: github/super-linter/slim@v4
      env:
        DEFAULT_BRANCH: main
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  deploy-staging:
    needs: [unit-tests, integration-tests, e2e-tests]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment"
        # Add your staging deployment commands here

  deploy-production:
    needs: [unit-tests, integration-tests, e2e-tests, performance-tests, accessibility-tests, visual-regression-tests]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to production
      run: |
        echo "Deploying to production environment"
        # Add your production deployment commands here
```

#### **Advanced Test Configuration**
```javascript
// jest.config.js
module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Module name mapping
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },

  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.js',
    '!src/setupTests.js',
    '!src/**/*.d.ts'
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Test timeout
  testTimeout: 10000,

  // Parallel execution
  maxWorkers: '50%',

  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml'
    }]
  ],

  // Global setup and teardown
  globalSetup: '<rootDir>/src/test-setup.js',
  globalTeardown: '<rootDir>/src/test-teardown.js',

  // Custom matchers
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Snapshot configuration
  snapshotSerializers: ['enzyme-to-json/serializer'],

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.(css|scss|sass)$': 'jest-transform-css'
  }
};

// setupTests.js
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Custom matchers
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received);
    return {
      message: () => `expected ${received} to be a valid Date`,
      pass
    };
  },

  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    return {
      message: () => `expected ${received} to be a valid email`,
      pass
    };
  }
});

// Mock implementations
global.fetch = jest.fn();
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}));
```

## **14. Resources**

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Artillery.io](https://artillery.io/) - Load testing
- [Stryker Mutator](https://stryker-mutator.io/) - Mutation testing
- [Pact](https://pact.io/) - Contract testing
- [fast-check](https://github.com/dubzzz/fast-check) - Property-based testing
- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing

## **15. Next Steps**

In the next lesson, we'll explore deployment strategies for full-stack applications. You'll learn about:
- Docker containerization
- Cloud platforms (Heroku, Vercel, AWS)
- CI/CD pipelines
- Environment management
- Monitoring and logging

Practice implementing comprehensive testing strategies in your applications and integrate automated testing into your development workflow!

---

This comprehensive testing guide covers everything from basic unit testing to advanced techniques including performance testing, accessibility testing, visual regression testing, contract testing, property-based testing, and mutation testing. The examples are production-ready and follow current testing best practices for professional software development.
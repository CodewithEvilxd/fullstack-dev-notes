# Lesson 04.7: TypeScript for Full-Stack Development

## Overview
TypeScript is a superset of JavaScript that adds static typing, making it easier to write robust, maintainable code. This lesson covers TypeScript fundamentals and its application in full-stack development.

## Why TypeScript?

### Benefits of TypeScript
```
Static Typing: Catch errors at compile time
Better IDE Support: Enhanced autocomplete and refactoring
Improved Code Quality: Self-documenting code with types
Easier Refactoring: Safe code changes with type checking
Enhanced Maintainability: Clear contracts between components
Better Team Collaboration: Type definitions serve as documentation
```

### TypeScript vs JavaScript
```javascript
// JavaScript (Dynamic typing)
function add(a, b) {
  return a + b;
}

add(5, 10);        // 15
add('5', '10');    // '510' (string concatenation)
add(5, '10');      // '510' (type coercion)
```

```typescript
// TypeScript (Static typing)
function add(a: number, b: number): number {
  return a + b;
}

add(5, 10);        // 15 ✅
add('5', '10');    // Error: Argument of type 'string' is not assignable to parameter of type 'number'
add(5, '10');      // Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

## Basic Types

### Primitive Types
```typescript
// String, Number, Boolean
let name: string = 'Alice';
let age: number = 30;
let isStudent: boolean = false;

// Array types
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ['Alice', 'Bob', 'Charlie'];

// Tuple (fixed-length array with specific types)
let person: [string, number] = ['Alice', 30];

// Enum
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}

let favoriteColor: Color = Color.Red;

// Any (avoid when possible)
let anything: any = 'could be anything';

// Void (for functions that don't return anything)
function logMessage(message: string): void {
  console.log(message);
}

// Null and Undefined
let nullableValue: string | null = null;
let undefinedValue: string | undefined = undefined;
```

### Object Types
```typescript
// Interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // Optional property
  readonly createdAt: Date; // Read-only property
}

// Type alias
type UserID = string | number;

// Using interfaces
const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date()
};

// Extending interfaces
interface Admin extends User {
  role: string;
  permissions: string[];
}

const admin: Admin = {
  id: 1,
  name: 'Admin',
  email: 'admin@example.com',
  createdAt: new Date(),
  role: 'superuser',
  permissions: ['read', 'write', 'delete']
};
```

## Functions and Methods

### Function Types
```typescript
// Function declaration with types
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function with types
const greetArrow = (name: string): string => `Hello, ${name}!`;

// Function with optional parameters
function createUser(name: string, email?: string): User {
  return {
    id: Date.now(),
    name,
    email: email || `${name.toLowerCase()}@example.com`,
    createdAt: new Date()
  };
}

// Function with default parameters
function createPost(title: string, content: string = ''): Post {
  return {
    id: Date.now(),
    title,
    content,
    createdAt: new Date()
  };
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15
```

### Function Overloads
```typescript
// Function overloads
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: any): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  } else if (typeof value === 'number') {
    return value.toFixed(2);
  } else if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return String(value);
}

console.log(format('hello'));    // "hello"
console.log(format(3.14159));    // "3.14"
console.log(format(true));       // "true"
```

## Classes and Object-Oriented Programming

### Class Definition
```typescript
class Person {
  // Properties
  public name: string;
  private age: number;
  protected email: string;

  // Constructor
  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }

  // Methods
  public greet(): string {
    return `Hello, I'm ${this.name}`;
  }

  // Getter
  get isAdult(): boolean {
    return this.age >= 18;
  }

  // Setter
  set updateEmail(newEmail: string) {
    if (newEmail.includes('@')) {
      this.email = newEmail;
    }
  }
}

// Usage
const person = new Person('Alice', 30, 'alice@example.com');
console.log(person.greet());     // "Hello, I'm Alice"
console.log(person.isAdult);     // true
person.updateEmail = 'alice@newdomain.com';
```

### Inheritance
```typescript
class Employee extends Person {
  public position: string;
  private salary: number;

  constructor(name: string, age: number, email: string, position: string, salary: number) {
    super(name, age, email);
    this.position = position;
    this.salary = salary;
  }

  // Override method
  greet(): string {
    return `${super.greet()} and I work as a ${this.position}`;
  }

  // New method
  getAnnualSalary(): number {
    return this.salary * 12;
  }
}

const employee = new Employee('Bob', 28, 'bob@company.com', 'Developer', 5000);
console.log(employee.greet());           // "Hello, I'm Bob and I work as a Developer"
console.log(employee.getAnnualSalary()); // 60000
```

### Abstract Classes
```typescript
abstract class Shape {
  abstract getArea(): number;
  abstract getPerimeter(): number;

  // Concrete method
  describe(): string {
    return `Area: ${this.getArea()}, Perimeter: ${this.getPerimeter()}`;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const rectangle = new Rectangle(10, 5);
console.log(rectangle.describe()); // "Area: 50, Perimeter: 30"
```

## Generics

### Generic Functions
```typescript
// Generic function
function identity<T>(value: T): T {
  return value;
}

const stringIdentity = identity<string>('hello');
const numberIdentity = identity<number>(42);

// Generic function with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 30 };
const name = getProperty(user, 'name');     // string
const age = getProperty(user, 'age');      // number
```

### Generic Classes
```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Usage
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 2

const stringStack = new Stack<string>();
stringStack.push('hello');
stringStack.push('world');
console.log(stringStack.pop()); // 'world'
```

### Generic Interfaces
```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: string, item: T): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // Implementation
    return null;
  }

  async findAll(): Promise<User[]> {
    // Implementation
    return [];
  }

  async create(item: User): Promise<User> {
    // Implementation
    return item;
  }

  async update(id: string, item: User): Promise<User | null> {
    // Implementation
    return null;
  }

  async delete(id: string): Promise<boolean> {
    // Implementation
    return true;
  }
}
```

## Advanced Types

### Union Types
```typescript
// Union type
type StringOrNumber = string | number;

function formatValue(value: StringOrNumber): string {
  if (typeof value === 'string') {
    return `"${value}"`;
  } else {
    return value.toString();
  }
}

// Union with literal types
type Status = 'pending' | 'approved' | 'rejected';

function updateStatus(status: Status): void {
  // Implementation
}
```

### Intersection Types
```typescript
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

type Person = HasName & HasAge;

const person: Person = {
  name: 'Alice',
  age: 30
};
```

### Type Guards
```typescript
// Type guard function
function isString(value: any): value is string {
  return typeof value === 'string';
}

// Using type guards
function processValue(value: string | number): string {
  if (isString(value)) {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

// Built-in type guards
function processArray(items: any[]): void {
  if (Array.isArray(items)) {
    items.forEach(item => console.log(item));
  }
}
```

### Conditional Types
```typescript
// Conditional type
type IsString<T> = T extends string ? 'Yes' : 'No';

type Test1 = IsString<string>;  // 'Yes'
type Test2 = IsString<number>;  // 'No'

// Advanced conditional type
type NonNullable<T> = T extends null | undefined ? never : T;

type Test3 = NonNullable<string | null>;  // string
```

## Modules and Namespaces

### ES6 Modules
```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// main.ts
import { add, PI } from './math';
import Calculator from './math';

console.log(add(5, 3)); // 8
console.log(PI);        // 3.14159

const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
```

### Declaration Files
```typescript
// node_modules/@types/express/index.d.ts
declare module 'express' {
  interface Request {
    user?: User;
  }

  interface Response {
    sendJson(data: any): void;
  }

  export function express(): Application;
  export interface Application {
    use(middleware: Function): Application;
    get(path: string, handler: Function): Application;
    post(path: string, handler: Function): Application;
    listen(port: number, callback?: Function): void;
  }
}
```

## TypeScript Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts"
  ]
}
```

## TypeScript with React

### Functional Components
```tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onUserSelect }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    onUserSelect(user);
  };

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => handleUserClick(user)}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div>
          <h3>Selected User</h3>
          <p>Name: {selectedUser.name}</p>
          <p>Email: {selectedUser.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserList;
```

### Custom Hooks
```typescript
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers
  };
};
```

## TypeScript with Node.js/Express

### Express Server
```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Routes
app.get('/api/users', async (req: Request, res: Response<ApiResponse<User[]>>) => {
  try {
    // Simulate database query
    const users: User[] = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ];

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

app.post('/api/users', async (req: Request<{}, ApiResponse<User>, Omit<User, 'id'>>, res: Response<ApiResponse<User>>) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    // Simulate creating user
    const newUser: User = {
      id: Date.now(),
      name,
      email
    };

    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Advanced TypeScript Features

### Mapped Types
```typescript
// Create a type with all properties optional
type PartialUser = Partial<User>;

// Create a type with all properties required
type RequiredUser = Required<User>;

// Create a type with all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit specific properties
type UserWithoutId = Omit<User, 'id'>;

// Custom mapped type
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type NullableUser = Nullable<User>;
```

### Utility Types
```typescript
// Record type
type UserRoles = Record<string, 'admin' | 'user' | 'moderator'>;

const roles: UserRoles = {
  'alice@example.com': 'admin',
  'bob@example.com': 'user'
};

// Extract type from function return
function createUser(name: string, email: string): User {
  return { id: 1, name, email, createdAt: new Date() };
}

type CreateUserReturn = ReturnType<typeof createUser>; // User

// Extract parameter types
type CreateUserParams = Parameters<typeof createUser>; // [string, string]

// Extract instance type from class
class UserService {
  getUser(id: number): User {
    // Implementation
    return {} as User;
  }
}

type UserServiceInstance = InstanceType<typeof UserService>;
```

### Decorators
```typescript
// Class decorator
function Service(target: Function) {
  console.log(`Service ${target.name} registered`);
}

// Method decorator
function LogExecution(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Executing ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
}

// Property decorator
function Required(target: any, propertyKey: string) {
  // Store metadata about required properties
  const required = Reflect.getMetadata('required', target) || [];
  required.push(propertyKey);
  Reflect.defineMetadata('required', required, target);
}

// Usage
@Service
class UserService {
  @Required
  name: string;

  @LogExecution
  createUser(name: string, email: string): User {
    return {
      id: Date.now(),
      name,
      email,
      createdAt: new Date()
    };
  }
}
```

## Testing with TypeScript

### Unit Testing
```typescript
// userService.test.ts
import { UserService } from '../src/UserService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a user with valid data', () => {
      const userData = {
        name: 'Alice',
        email: 'alice@example.com'
      };

      const result = userService.createUser(userData);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(userData.name);
      expect(result.email).toBe(userData.email);
      expect(result).toHaveProperty('createdAt');
    });

    it('should throw error for invalid email', () => {
      const userData = {
        name: 'Alice',
        email: 'invalid-email'
      };

      expect(() => {
        userService.createUser(userData);
      }).toThrow('Invalid email format');
    });
  });
});
```

## Best Practices

### Code Organization
```
src/
├── types/           # Type definitions
│   ├── user.ts
│   └── api.ts
├── services/        # Business logic
│   ├── UserService.ts
│   └── EmailService.ts
├── controllers/     # HTTP handlers
│   ├── userController.ts
│   └── authController.ts
├── middleware/      # Express middleware
│   ├── auth.ts
│   └── validation.ts
├── utils/          # Utility functions
│   ├── logger.ts
│   └── validation.ts
└── index.ts        # Application entry point
```

### TypeScript Best Practices
1. **Use strict mode**: Enable all strict TypeScript options
2. **Avoid any**: Use specific types instead of `any`
3. **Use interfaces for objects**: Prefer interfaces over type aliases for objects
4. **Leverage utility types**: Use built-in utility types when possible
5. **Write tests**: Ensure type safety with comprehensive tests
6. **Use linters**: Configure ESLint with TypeScript rules
7. **Document complex types**: Use JSDoc comments for complex type definitions

### Common Patterns
```typescript
// Builder pattern
class UserBuilder {
  private user: Partial<User> = {};

  setName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  setEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  setAge(age: number): UserBuilder {
    this.user.age = age;
    return this;
  }

  build(): User {
    if (!this.user.name || !this.user.email) {
      throw new Error('Name and email are required');
    }

    return {
      id: Date.now(),
      name: this.user.name,
      email: this.user.email,
      age: this.user.age || 0,
      createdAt: new Date()
    };
  }
}

// Usage
const user = new UserBuilder()
  .setName('Alice')
  .setEmail('alice@example.com')
  .setAge(30)
  .build();
```

## Summary

TypeScript enhances JavaScript development by adding:

1. **Static Typing**: Catch errors at compile time
2. **Better IDE Support**: Enhanced autocomplete and refactoring
3. **Improved Code Quality**: Self-documenting code with types
4. **Advanced Features**: Generics, decorators, conditional types
5. **Full-Stack Support**: Works with React, Node.js, Express

### Key Takeaways
- Use interfaces for object shapes
- Leverage generics for reusable code
- Implement proper error handling with typed exceptions
- Use utility types for common transformations
- Write comprehensive tests for type safety
- Follow TypeScript best practices for maintainable code

### Migration from JavaScript
1. Start with `any` types and gradually add specific types
2. Use `// @ts-ignore` sparingly and only temporarily
3. Enable strict mode incrementally
4. Use type assertion (`as` keyword) when necessary
5. Leverage DefinitelyTyped for existing libraries

### Next Steps
1. Set up a TypeScript project
2. Convert existing JavaScript code to TypeScript
3. Learn advanced patterns and best practices
4. Explore TypeScript with popular frameworks
5. Contribute to TypeScript open-source projects

TypeScript will significantly improve your code quality and developer experience in full-stack development! 🚀
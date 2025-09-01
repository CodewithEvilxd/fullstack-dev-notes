# Lesson 04.5: Advanced JavaScript Concepts

## Overview
This lesson covers advanced JavaScript concepts that are essential for full-stack development, including closures, prototypes, async programming, and modern ES6+ features.

## Closures

### What are Closures?
A closure is a function that has access to variables in its outer (enclosing) scope, even after the outer function has returned.

```javascript
function createCounter() {
  let count = 0; // This variable is "closed over"

  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

### Practical Uses of Closures

#### 1. Data Privacy
```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance;

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },

    withdraw(amount) {
      if (amount > balance) {
        return 'Insufficient funds';
      }
      balance -= amount;
      return balance;
    },

    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);
console.log(account.getBalance()); // 1000
console.log(account.deposit(500));  // 1500
console.log(account.withdraw(200)); // 1300
```

#### 2. Function Factories
```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

#### 3. Memoization
```javascript
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);
console.log(memoizedFib(40)); // Much faster on subsequent calls
```

## Prototypes and Inheritance

### Prototype Chain
```javascript
// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Adding method to prototype
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

// Creating instances
const person1 = new Person('Alice', 30);
const person2 = new Person('Bob', 25);

console.log(person1.greet()); // "Hello, I'm Alice"
console.log(person2.greet()); // "Hello, I'm Bob"

// Checking prototype
console.log(person1.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
```

### ES6 Classes (Syntactic Sugar)
```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static createAnonymous() {
    return new Person('Anonymous', 0);
  }
}

class Employee extends Person {
  constructor(name, age, position) {
    super(name, age);
    this.position = position;
  }

  greet() {
    return `${super.greet()} and I work as a ${this.position}`;
  }
}

const employee = new Employee('Charlie', 28, 'Developer');
console.log(employee.greet()); // "Hello, I'm Charlie and I work as a Developer"
```

### Object.create() Method
```javascript
const personPrototype = {
  greet() {
    return `Hello, I'm ${this.name}`;
  },

  celebrateBirthday() {
    this.age++;
    return `Happy ${this.age}th birthday!`;
  }
};

function createPerson(name, age) {
  const person = Object.create(personPrototype);
  person.name = name;
  person.age = age;
  return person;
}

const person = createPerson('David', 35);
console.log(person.greet()); // "Hello, I'm David"
console.log(person.celebrateBirthday()); // "Happy 36th birthday!"
```

## Asynchronous JavaScript

### Callbacks
```javascript
function fetchUserData(userId, callback) {
  // Simulate API call
  setTimeout(() => {
    const user = { id: userId, name: 'John Doe' };
    callback(null, user);
  }, 1000);
}

function handleUserData(error, user) {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('User:', user);
}

fetchUserData(123, handleUserData);
```

### Promises
```javascript
function fetchUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) {
        const user = { id: userId, name: 'John Doe' };
        resolve(user);
      } else {
        reject(new Error('Invalid user ID'));
      }
    }, 1000);
  });
}

// Using promises
fetchUserData(123)
  .then(user => {
    console.log('User:', user);
    return fetchUserData(user.id + 1);
  })
  .then(nextUser => {
    console.log('Next user:', nextUser);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Async/Await
```javascript
async function getUserData(userId) {
  try {
    const user = await fetchUserData(userId);
    console.log('User:', user);

    const posts = await fetchUserPosts(user.id);
    console.log('Posts:', posts);

    return { user, posts };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Using async function
getUserData(123)
  .then(data => console.log('All data:', data))
  .catch(error => console.error('Final error:', error));
```

### Promise Methods
```javascript
// Promise.all - All promises must resolve
const promises = [
  fetchUserData(1),
  fetchUserData(2),
  fetchUserData(3)
];

Promise.all(promises)
  .then(users => console.log('All users:', users))
  .catch(error => console.error('One failed:', error));

// Promise.race - First to resolve/reject
Promise.race(promises)
  .then(firstUser => console.log('First user:', firstUser))
  .catch(error => console.error('First error:', error));

// Promise.allSettled - Wait for all to settle
Promise.allSettled(promises)
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Promise ${index} succeeded:`, result.value);
      } else {
        console.log(`Promise ${index} failed:`, result.reason);
      }
    });
  });
```

## ES6+ Features

### Destructuring
```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first, second, rest); // 1, 2, [3, 4, 5]

// Object destructuring
const person = { name: 'Alice', age: 30, city: 'NYC' };
const { name, age, city: location } = person;
console.log(name, age, location); // Alice, 30, NYC

// Function parameters
function printUser({ name, age, city = 'Unknown' }) {
  console.log(`${name} (${age}) from ${city}`);
}

printUser(person); // Alice (30) from NYC
```

### Spread and Rest Operators
```javascript
// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Rest operator
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 10

function createUser(name, ...additionalInfo) {
  return {
    name,
    info: additionalInfo
  };
}

console.log(createUser('Alice', 30, 'NYC', 'Developer'));
// { name: 'Alice', info: [30, 'NYC', 'Developer'] }
```

### Template Literals
```javascript
const name = 'Alice';
const age = 30;

// Basic template literal
const greeting = `Hello, ${name}! You are ${age} years old.`;
console.log(greeting); // "Hello, Alice! You are 30 years old."

// Multi-line strings
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] ? `<strong>${values[i]}</strong>` : '');
  }, '');
}

const highlighted = highlight`Hello, ${name}! You are ${age} years old.`;
console.log(highlighted); // "Hello, <strong>Alice</strong>! You are <strong>30</strong> years old."
```

### Modules (ES6)
```javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export default function subtract(a, b) {
  return a - b;
}

// main.js
import subtract, { PI, add, multiply } from './math.js';

console.log(add(5, 3));        // 8
console.log(multiply(5, 3));   // 15
console.log(subtract(5, 3));   // 2
console.log(PI);               // 3.14159
```

## Advanced Array Methods

### Map, Filter, Reduce
```javascript
const numbers = [1, 2, 3, 4, 5];

// Map: Transform each element
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter: Select elements based on condition
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// Reduce: Accumulate values
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

const max = numbers.reduce((max, num) => num > max ? num : max);
console.log(max); // 5
```

### Find and FindIndex
```javascript
const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 }
];

// Find: Get first matching element
const user = users.find(u => u.age > 28);
console.log(user); // { id: 2, name: 'Bob', age: 30 }

// FindIndex: Get index of first matching element
const index = users.findIndex(u => u.name === 'Charlie');
console.log(index); // 2
```

### Some and Every
```javascript
const numbers = [1, 2, 3, 4, 5];

// Some: Check if at least one element matches
const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

// Every: Check if all elements match
const allEven = numbers.every(num => num % 2 === 0);
console.log(allEven); // false
```

### Flat and FlatMap
```javascript
const nestedArray = [1, [2, 3], [4, [5, 6]]];

// Flat: Flatten nested arrays
const flattened = nestedArray.flat();
console.log(flattened); // [1, 2, 3, 4, [5, 6]]

const deeplyFlattened = nestedArray.flat(2);
console.log(deeplyFlattened); // [1, 2, 3, 4, 5, 6]

// FlatMap: Map and then flatten
const sentences = ['Hello world', 'How are you'];
const words = sentences.flatMap(sentence => sentence.split(' '));
console.log(words); // ['Hello', 'world', 'How', 'are', 'you']
```

## Error Handling

### Try-Catch-Finally
```javascript
function divide(a, b) {
  try {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  } finally {
    console.log('Division operation completed');
  }
}

console.log(divide(10, 2));  // 5
console.log(divide(10, 0));  // null
```

### Custom Error Classes
```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class DatabaseError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
  }
}

function validateUser(user) {
  if (!user.name) {
    throw new ValidationError('Name is required', 'name');
  }
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
}

try {
  validateUser({ name: 'Alice' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation error in ${error.field}: ${error.message}`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Event Loop and Concurrency

### Understanding the Event Loop
```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise callback');
});

console.log('End');

// Output:
// Start
// End
// Promise callback
// Timeout callback
```

### Microtasks vs Macrotasks
```javascript
console.log('Script start');

setTimeout(() => console.log('setTimeout'), 0);

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

console.log('Script end');

// Output:
// Script start
// Script end
// Promise 1
// Promise 2
// setTimeout
```

## Memory Management

### Garbage Collection
```javascript
// Memory leak example
function createLeak() {
  const leaks = [];

  return function() {
    leaks.push(new Array(1000000)); // Creates memory leak
  };
}

// Proper cleanup
function createNoLeak() {
  return function() {
    const temp = new Array(1000000);
    // temp is garbage collected after function ends
  };
}
```

### WeakMap and WeakSet
```javascript
// WeakMap for private data
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { name });
  }

  getName() {
    return privateData.get(this).name;
  }
}

const user = new User('Alice');
console.log(user.getName()); // Alice

// Data is automatically garbage collected when user is deleted
// privateData.get(user) would return undefined after GC
```

## Performance Optimization

### Debouncing and Throttling
```javascript
// Debounce: Delay execution until after wait time
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle: Limit execution to once per wait time
function throttle(func, wait) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

// Usage
const debouncedSearch = debounce(searchAPI, 300);
const throttledScroll = throttle(handleScroll, 100);
```

### Efficient Data Structures
```javascript
// Using Map for frequent lookups
const userMap = new Map();
userMap.set('alice', { name: 'Alice', age: 30 });
userMap.set('bob', { name: 'Bob', age: 25 });

// Fast lookup
console.log(userMap.get('alice')); // { name: 'Alice', age: 30 }

// Using Set for unique values
const uniqueTags = new Set(['javascript', 'react', 'node']);
uniqueTags.add('javascript'); // Won't add duplicate
console.log(uniqueTags.has('react')); // true
```

## Modern JavaScript Patterns

### Module Pattern
```javascript
const Calculator = (function() {
  let result = 0;

  function add(number) {
    result += number;
    return result;
  }

  function subtract(number) {
    result -= number;
    return result;
  }

  function getResult() {
    return result;
  }

  function reset() {
    result = 0;
  }

  return {
    add,
    subtract,
    getResult,
    reset
  };
})();

Calculator.add(5);
Calculator.add(3);
console.log(Calculator.getResult()); // 8
```

### Factory Pattern
```javascript
function createUser(type) {
  const userTypes = {
    admin: () => ({
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users']
    }),

    editor: () => ({
      role: 'editor',
      permissions: ['read', 'write']
    }),

    viewer: () => ({
      role: 'viewer',
      permissions: ['read']
    })
  };

  return userTypes[type] ? userTypes[type]() : userTypes.viewer();
}

const admin = createUser('admin');
const editor = createUser('editor');
const viewer = createUser('unknown');
```

### Observer Pattern
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(...args));
  }
}

// Usage
const emitter = new EventEmitter();

function userLoggedIn(user) {
  console.log(`${user} logged in`);
}

emitter.on('login', userLoggedIn);
emitter.emit('login', 'Alice'); // Alice logged in
```

## Summary

Advanced JavaScript concepts are crucial for full-stack development:

1. **Closures**: Enable data privacy and function factories
2. **Prototypes**: Understanding inheritance and object creation
3. **Async Programming**: Callbacks, promises, and async/await
4. **ES6+ Features**: Modern syntax and powerful new capabilities
5. **Error Handling**: Robust error management and custom error types
6. **Performance**: Optimization techniques and efficient patterns

### Key Takeaways
- Master closures for data encapsulation
- Use promises and async/await for clean async code
- Leverage ES6+ features for modern development
- Implement proper error handling
- Optimize performance with efficient patterns
- Understand the event loop and concurrency

### Practice Exercises
1. Implement a memoization function
2. Create a custom promise-based API wrapper
3. Build an event emitter system
4. Implement debouncing and throttling
5. Create a module system without ES6 imports

### Next Steps
1. Learn TypeScript for type safety
2. Study design patterns and architecture
3. Explore functional programming concepts
4. Practice with real-world projects
5. Contribute to open-source JavaScript projects

Mastering these advanced concepts will make you a proficient JavaScript developer capable of building complex, scalable applications! 🚀
# Advanced JavaScript Guide - ES6+ Features & Patterns

## 1. ES6+ Features Deep Dive

### Destructuring & Spread Syntax
```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first, second, rest); // 1, 2, [3, 4, 5]

// Object destructuring with defaults
const { name = 'Anonymous', age = 25, ...otherProps } = user || {};
console.log(name, age, otherProps);

// Nested destructuring
const {
  user: {
    profile: { firstName, lastName },
    settings: { theme = 'light' }
  },
  metadata: { createdAt }
} = response.data;

// Function parameters with destructuring
function createUser({ name, email, age = 18, ...otherData }) {
  return {
    id: generateId(),
    name,
    email,
    age,
    ...otherData,
    createdAt: new Date()
  };
}

// Spread syntax
const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 }; // { a: 1, b: 2, c: 3 }

// Merging objects
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };
const config = { ...defaults, ...userPrefs }; // { theme: 'dark', lang: 'en' }

// Spread in function calls
const numbers = [1, 2, 3];
Math.max(...numbers); // 3

// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Cloning arrays/objects
const originalArray = [1, 2, 3];
const clonedArray = [...originalArray];

const originalObject = { a: 1, b: 2 };
const clonedObject = { ...originalObject };
```

### Arrow Functions & Lexical This
```javascript
// Basic arrow function
const add = (a, b) => a + b;

// Single parameter (parentheses optional)
const square = x => x * x;

// No parameters
const getRandom = () => Math.random();

// Multi-line with body
const calculateTotal = (items) => {
  let total = 0;
  items.forEach(item => {
    total += item.price * item.quantity;
  });
  return total;
};

// Lexical this - traditional function
function Timer() {
  this.seconds = 0;

  setInterval(function() {
    this.seconds++; // 'this' refers to global/window
    console.log(this.seconds);
  }, 1000);
}

// Lexical this - arrow function
function Timer() {
  this.seconds = 0;

  setInterval(() => {
    this.seconds++; // 'this' refers to Timer instance
    console.log(this.seconds);
  }, 1000);
}

// Arrow functions in callbacks
const users = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 }
];

// Traditional callback
const names = users.map(function(user) {
  return user.name;
});

// Arrow function callback
const names = users.map(user => user.name);

// Arrow function with object return
const userObjects = users.map(user => ({
  id: user.id,
  displayName: `${user.name} (${user.age})`
}));

// Arrow functions in promises
const fetchUserData = (userId) => {
  return fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(data => {
      console.log('User data:', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      throw error;
    });
};

// Async arrow functions
const fetchUserDataAsync = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    console.log('User data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
```

### Template Literals & Tagged Templates
```javascript
// Basic template literals
const name = 'John';
const age = 30;
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;
console.log(greeting); // "Hello, my name is John and I am 30 years old."

// Multi-line strings
const html = `
  <div class="user-card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
    <p>Status: ${age >= 18 ? 'Adult' : 'Minor'}</p>
  </div>
`;

// Expression interpolation
const calculateTax = (amount, rate) => amount * rate / 100;
const invoice = `
  Invoice Total: $${amount}
  Tax (${taxRate}%): $${calculateTax(amount, taxRate)}
  Grand Total: $${amount + calculateTax(amount, taxRate)}
`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

const user = 'John';
const action = 'logged in';
const message = highlight`User ${user} has ${action} to the system.`;
console.log(message); // "User <mark>John</mark> has <mark>logged in</mark> to the system."

// SQL query builder with tagged templates
function sql(strings, ...values) {
  const query = strings.reduce((result, string, i) => {
    return result + string + (values[i] !== undefined ? `'${values[i]}'` : '');
  }, '');

  console.log('Executing SQL:', query);
  return query;
}

const tableName = 'users';
const userId = 123;
const query = sql`SELECT * FROM ${tableName} WHERE id = ${userId}`;

// Internationalization with tagged templates
function i18n(strings, ...values) {
  const key = strings.join('{{}}');
  // Look up translation
  const translation = translations[key] || key;

  return translation.split('{{}}').reduce((result, part, i) => {
    return result + part + (values[i] || '');
  }, '');
}

const productName = 'Widget';
const price = 29.99;
const message = i18n`The product ${productName} costs $${price}.`;

// Styled components with tagged templates
function styled(strings, ...values) {
  const styles = strings.reduce((result, string, i) => {
    return result + string + (values[i] || '');
  }, '');

  return {
    css: styles,
    toString: () => styles
  };
}

const primaryColor = '#007bff';
const buttonStyles = styled`
  background-color: ${primaryColor};
  border: 1px solid ${primaryColor};
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
`;
```

### Modules (ES6 Modules)
```javascript
// math.js - Module definition
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

// Default export
export default class Calculator {
  constructor() {
    this.history = [];
  }

  calculate(operation, a, b) {
    const result = operation(a, b);
    this.history.push({ operation: operation.name, a, b, result });
    return result;
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}

// utils.js - Another module
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function formatDate(date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
}

export function debounce(func, wait) {
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

export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// main.js - Module usage
// Named imports
import { add, multiply, PI } from './math.js';
import { formatCurrency, formatDate, debounce } from './utils.js';

// Default import
import Calculator from './math.js';

// Using imported functions
console.log('PI:', PI);
console.log('2 + 3 =', add(2, 3));
console.log('4 * 5 =', multiply(4, 5));

console.log('Price:', formatCurrency(29.99));
console.log('Date:', formatDate('2023-01-15'));

// Using default import
const calc = new Calculator();
console.log('5 + 3 =', calc.calculate(add, 5, 3));
console.log('History:', calc.getHistory());

// Import everything
import * as MathUtils from './math.js';
console.log('Using namespace:', MathUtils.add(10, 5));

// Dynamic imports
async function loadModule() {
  try {
    const module = await import('./dynamic-module.js');
    module.doSomething();
  } catch (error) {
    console.error('Error loading module:', error);
  }
}

// Conditional imports
if (process.env.NODE_ENV === 'development') {
  import('./dev-tools.js').then(module => {
    module.enableDevTools();
  });
}

// Re-exporting
export { add as sum, multiply as product } from './math.js';
export { formatCurrency as currency, formatDate as date } from './utils.js';
```

### Classes & Inheritance
```javascript
// Base class
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.energy = 100;
  }

  // Instance method
  eat(amount = 10) {
    this.energy = Math.min(100, this.energy + amount);
    console.log(`${this.name} ate and gained ${amount} energy.`);
  }

  sleep(hours = 8) {
    this.energy = Math.min(100, this.energy + (hours * 10));
    console.log(`${this.name} slept for ${hours} hours.`);
  }

  // Getter
  get isHungry() {
    return this.energy < 30;
  }

  // Setter
  set nickname(value) {
    this._nickname = value;
  }

  get nickname() {
    return this._nickname || this.name;
  }

  // Static method
  static createRandom() {
    const names = ['Fluffy', 'Spot', 'Max', 'Bella'];
    const species = ['Dog', 'Cat', 'Bird', 'Fish'];
    const name = names[Math.floor(Math.random() * names.length)];
    const spec = species[Math.floor(Math.random() * species.length)];
    return new Animal(name, spec);
  }

  // Method that can be overridden
  makeSound() {
    console.log(`${this.name} makes a sound.`);
  }
}

// Inheritance
class Dog extends Animal {
  constructor(name, breed) {
    super(name, 'Dog'); // Call parent constructor
    this.breed = breed;
    this.loyalty = 100;
  }

  // Override parent method
  makeSound() {
    console.log(`${this.name} barks: Woof!`);
  }

  // New method
  fetch(item) {
    if (this.energy > 20) {
      this.energy -= 10;
      console.log(`${this.name} fetched the ${item}!`);
      return true;
    } else {
      console.log(`${this.name} is too tired to fetch.`);
      return false;
    }
  }

  // Override getter
  get isHungry() {
    return this.energy < 20; // Dogs get hungry faster
  }
}

// Another subclass
class Cat extends Animal {
  constructor(name, color) {
    super(name, 'Cat');
    this.color = color;
    this.independence = 80;
  }

  makeSound() {
    console.log(`${this.name} meows: Meow!`);
  }

  knockThingsOffTable() {
    console.log(`${this.name} knocked something off the table!`);
  }

  // Method specific to cats
  useLitterBox() {
    console.log(`${this.name} used the litter box.`);
  }
}

// Using classes
const dog = new Dog('Buddy', 'Golden Retriever');
const cat = new Cat('Whiskers', 'Black');

console.log(dog.name, dog.species, dog.breed); // Buddy Dog Golden Retriever
console.log(cat.name, cat.species, cat.color); // Whiskers Cat Black

dog.makeSound(); // Buddy barks: Woof!
cat.makeSound(); // Whiskers meows: Meow!

dog.eat(20);
console.log(dog.isHungry); // false

cat.sleep(5);
console.log(cat.energy); // 100 (maxed out)

// Static method
const randomAnimal = Animal.createRandom();
console.log(randomAnimal.name, randomAnimal.species);

// Inheritance check
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
console.log(cat instanceof Dog); // false
```

### Promises & Async/Await
```javascript
// Basic Promise
const simplePromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const random = Math.random();
    if (random > 0.5) {
      resolve(`Success! Random value: ${random}`);
    } else {
      reject(new Error(`Failed! Random value: ${random}`));
    }
  }, 1000);
});

// Using the promise
simplePromise
  .then(result => {
    console.log('Promise resolved:', result);
  })
  .catch(error => {
    console.error('Promise rejected:', error.message);
  })
  .finally(() => {
    console.log('Promise completed');
  });

// Promise.all - Run multiple promises in parallel
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.all(promises)
  .then(responses => {
    return Promise.all(responses.map(response => response.json()));
  })
  .then(data => {
    console.log('All data loaded:', data);
  })
  .catch(error => {
    console.error('One of the promises failed:', error);
  });

// Promise.race - Get result of first completed promise
const racePromises = [
  fetch('/api/fast-endpoint'),
  fetch('/api/slow-endpoint'),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
];

Promise.race(racePromises)
  .then(result => {
    console.log('First result:', result);
  })
  .catch(error => {
    console.error('Race failed:', error);
  });

// Promise.allSettled - Wait for all promises to settle
Promise.allSettled([
  Promise.resolve('Success 1'),
  Promise.reject(new Error('Error 1')),
  Promise.resolve('Success 2')
]).then(results => {
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Promise ${index + 1} fulfilled:`, result.value);
    } else {
      console.log(`Promise ${index + 1} rejected:`, result.reason.message);
    }
  });
});

// Async/Await
async function fetchUserData(userId) {
  try {
    console.log('Fetching user data...');

    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const userData = await response.json();
    console.log('User data:', userData);

    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Using async function
async function processUser(userId) {
  try {
    const user = await fetchUserData(userId);

    // Process user data
    const processedUser = {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      isAdult: user.age >= 18
    };

    console.log('Processed user:', processedUser);
    return processedUser;
  } catch (error) {
    console.error('Error processing user:', error);
    throw error;
  }
}

// Parallel async operations
async function fetchMultipleUsers(userIds) {
  try {
    console.log('Fetching multiple users...');

    // Start all requests in parallel
    const promises = userIds.map(id => fetchUserData(id));

    // Wait for all to complete
    const users = await Promise.all(promises);

    console.log('All users fetched:', users);
    return users;
  } catch (error) {
    console.error('Error fetching multiple users:', error);
    throw error;
  }
}

// Sequential async operations
async function processUsersSequentially(userIds) {
  const results = [];

  for (const userId of userIds) {
    try {
      const user = await fetchUserData(userId);
      const processed = await processUser(user.id);
      results.push(processed);
    } catch (error) {
      console.error(`Error processing user ${userId}:`, error);
      results.push({ id: userId, error: error.message });
    }
  }

  return results;
}

// Error handling with async/await
async function robustApiCall(url, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Promise utility functions
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryAsync(fn, maxRetries = 3, delayMs = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt} failed:`, error.message);

      if (attempt < maxRetries) {
        await delay(delayMs * attempt); // Exponential backoff
      }
    }
  }

  throw lastError;
}

// Usage
async function main() {
  try {
    // Single user
    const user = await fetchUserData(123);
    console.log('Single user:', user);

    // Multiple users in parallel
    const users = await fetchMultipleUsers([123, 456, 789]);
    console.log('Multiple users:', users);

    // With retry logic
    const data = await retryAsync(() => robustApiCall('/api/unreliable-endpoint'));
    console.log('Data with retry:', data);

  } catch (error) {
    console.error('Main function error:', error);
  }
}
```

### Generators & Iterators
```javascript
// Basic generator function
function* simpleGenerator() {
  console.log('Generator started');
  yield 1;
  console.log('After first yield');
  yield 2;
  console.log('After second yield');
  yield 3;
  console.log('Generator finished');
}

// Using generator
const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Generator with parameters
function* rangeGenerator(start, end, step = 1) {
  for (let i = start; i <= end; i += step) {
    yield i;
  }
}

const range = rangeGenerator(1, 10, 2);
for (const num of range) {
  console.log(num); // 1, 3, 5, 7, 9
}

// Infinite generator
function* infiniteCounter() {
  let count = 0;
  while (true) {
    yield count++;
  }
}

const counter = infiniteCounter();
console.log(counter.next().value); // 0
console.log(counter.next().value); // 1
console.log(counter.next().value); // 2

// Generator for Fibonacci sequence
function* fibonacciGenerator() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacciGenerator();
for (let i = 0; i < 10; i++) {
  console.log(fib.next().value); // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
}

// Async generator
async function* asyncDataGenerator(urls) {
  for (const url of urls) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      yield data;
    } catch (error) {
      yield { error: error.message, url };
    }
  }
}

// Using async generator
async function processAsyncGenerator() {
  const urls = [
    'https://api.example.com/data1',
    'https://api.example.com/data2',
    'https://api.example.com/data3'
  ];

  const asyncGen = asyncDataGenerator(urls);

  for await (const data of asyncGen) {
    if (data.error) {
      console.error('Error fetching data:', data.error);
    } else {
      console.log('Received data:', data);
    }
  }
}

// Custom iterator
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    const step = this.step;

    return {
      next() {
        if (current <= end) {
          const value = current;
          current += step;
          return { value, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
}

// Using custom iterator
const range = new Range(1, 10, 2);
for (const num of range) {
  console.log(num); // 1, 3, 5, 7, 9
}

// Generator delegation
function* generatorA() {
  yield 1;
  yield 2;
  yield* generatorB(); // Delegate to another generator
  yield 6;
}

function* generatorB() {
  yield 3;
  yield 4;
  yield 5;
}

const genAB = generatorA();
for (const value of genAB) {
  console.log(value); // 1, 2, 3, 4, 5, 6
}

// Generator for async operations
function* asyncOperationGenerator() {
  try {
    console.log('Starting async operation...');
    yield 'step1';

    // Simulate async operation
    yield new Promise(resolve => setTimeout(() => resolve('step2'), 1000));

    console.log('Async operation completed');
    yield 'step3';
  } catch (error) {
    console.error('Generator error:', error);
  }
}

// Using generator with promises
function runGenerator(gen) {
  const iterator = gen();

  function handleNext(value) {
    const result = iterator.next(value);

    if (result.done) {
      return result.value;
    }

    if (result.value instanceof Promise) {
      return result.value.then(handleNext);
    }

    return handleNext(result.value);
  }

  return handleNext();
}

runGenerator(asyncOperationGenerator).then(result => {
  console.log('Generator completed with result:', result);
});
```

### Symbols & Meta Programming
```javascript
// Creating symbols
const symbol1 = Symbol();
const symbol2 = Symbol('description');
const symbol3 = Symbol('description');

console.log(symbol1 === symbol2); // false
console.log(symbol2 === symbol3); // false (even with same description)

// Symbol as object keys
const user = {
  name: 'John',
  [Symbol('id')]: 123,
  [Symbol('secret')]: 'hidden data'
};

console.log(user.name); // 'John'
console.log(Object.keys(user)); // ['name'] - symbols not included
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id), Symbol(secret)]

// Well-known symbols
class CustomArray extends Array {
  constructor(...args) {
    super(...args);
  }

  // Custom iterator
  *[Symbol.iterator]() {
    for (let i = this.length - 1; i >= 0; i--) {
      yield this[i];
    }
  }

  // Custom toString
  [Symbol.toStringTag]() {
    return 'CustomArray';
  }

  // Custom toPrimitive
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.length;
    }
    return `[${this.join(', ')}]`;
  }
}

const arr = new CustomArray(1, 2, 3, 4, 5);
console.log([...arr]); // [5, 4, 3, 2, 1] - reversed iteration
console.log(arr.toString()); // 'CustomArray'
console.log(+arr); // 5 - length as number
console.log(String(arr)); // '[1, 2, 3, 4, 5]'

// Symbol.hasInstance
class MyClass {
  static [Symbol.hasInstance](instance) {
    return instance && instance.customProperty === 'valid';
  }
}

const obj1 = { customProperty: 'valid' };
const obj2 = { customProperty: 'invalid' };

console.log(obj1 instanceof MyClass); // true
console.log(obj2 instanceof MyClass); // false

// Symbol.isConcatSpreadable
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

arr2[Symbol.isConcatSpreadable] = false;
console.log(arr1.concat(arr2)); // [1, 2, 3, [4, 5, 6]]

arr2[Symbol.isConcatSpreadable] = true;
console.log(arr1.concat(arr2)); // [1, 2, 3, 4, 5, 6]

// Symbol.species
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array; // Return base Array constructor
  }
}

const myArr = new MyArray(1, 2, 3);
const sliced = myArr.slice(1, 3);
console.log(sliced instanceof MyArray); // false
console.log(sliced instanceof Array); // true

// Symbol.replace, Symbol.search, Symbol.split
class CustomString {
  constructor(value) {
    this.value = value;
  }

  [Symbol.replace](searchValue, replaceValue) {
    return this.value.split(searchValue).join(replaceValue);
  }

  [Symbol.search](searchValue) {
    return this.value.indexOf(searchValue);
  }

  [Symbol.split](separator) {
    return this.value.split(separator);
  }
}

const customStr = new CustomString('hello world hello');
console.log('world'.replace(customStr, 'universe')); // 'hello universe hello'
console.log('world'.search(customStr)); // 6
console.log(','.split(customStr)); // ['hello world hello']

// Symbol.toStringTag
class CustomObject {
  [Symbol.toStringTag] = 'CustomObject';
}

const obj = new CustomObject();
console.log(Object.prototype.toString.call(obj)); // '[object CustomObject]'

// Symbol.unscopables
const objWithUnscopables = {
  a: 1,
  b: 2,
  c: 3,
  [Symbol.unscopables]: {
    b: true // Make 'b' unscopable
  }
};

with (objWithUnscopables) {
  console.log(a); // 1
  console.log(c); // 3
  // console.log(b); // ReferenceError: b is not defined
}

// Global symbol registry
const globalSymbol1 = Symbol.for('myGlobalSymbol');
const globalSymbol2 = Symbol.for('myGlobalSymbol');

console.log(globalSymbol1 === globalSymbol2); // true
console.log(Symbol.keyFor(globalSymbol1)); // 'myGlobalSymbol'
```

### Proxies & Reflection
```javascript
// Basic proxy
const target = {
  name: 'John',
  age: 30
};

const handler = {
  get(target, property) {
    console.log(`Getting property: ${property}`);
    return target[property];
  },

  set(target, property, value) {
    console.log(`Setting property: ${property} = ${value}`);
    target[property] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name); // Getting property: name, then: John
proxy.age = 31; // Setting property: age = 31

// Validation proxy
function createValidatedObject(schema) {
  return new Proxy({}, {
    set(target, property, value) {
      const validator = schema[property];
      if (validator && !validator(value)) {
        throw new Error(`Invalid value for ${property}`);
      }
      target[property] = value;
      return true;
    }
  });
}

const personSchema = {
  name: (value) => typeof value === 'string' && value.length > 0,
  age: (value) => typeof value === 'number' && value >= 0 && value <= 150,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
};

const person = createValidatedObject(personSchema);
person.name = 'John'; // OK
person.age = 30; // OK
person.email = 'john@example.com'; // OK
// person.age = -5; // Error: Invalid value for age

// Logging proxy
function createLoggingProxy(target) {
  return new Proxy(target, {
    get(target, property) {
      const value = Reflect.get(target, property);
      console.log(`GET ${property}:`, value);
      return value;
    },

    set(target, property, value) {
      console.log(`SET ${property}:`, value);
      return Reflect.set(target, property, value);
    },

    deleteProperty(target, property) {
      console.log(`DELETE ${property}`);
      return Reflect.deleteProperty(target, property);
    }
  });
}

const loggedObject = createLoggingProxy({ a: 1, b: 2 });
loggedObject.a; // GET a: 1
loggedObject.c = 3; // SET c: 3
delete loggedObject.b; // DELETE b

// Caching proxy
function createCachingProxy(target, cache = new Map()) {
  return new Proxy(target, {
    get(target, property) {
      if (cache.has(property)) {
        console.log(`Cache hit for ${property}`);
        return cache.get(property);
      }

      const value = Reflect.get(target, property);
      cache.set(property, value);
      console.log(`Cache miss for ${property}, stored in cache`);
      return value;
    }
  });
}

// Expensive computation object
const expensiveObject = {
  fibonacci(n) {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  },

  factorial(n) {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
};

const cachedExpensiveObject = createCachingProxy(expensiveObject);
console.log(cachedExpensiveObject.fibonacci(10)); // Cache miss
console.log(cachedExpensiveObject.fibonacci(10)); // Cache hit

// Negative array index proxy
function createNegativeIndexArray(arr = []) {
  return new Proxy(arr, {
    get(target, property) {
      const index = parseInt(property);
      if (!isNaN(index) && index < 0) {
        return target[target.length + index];
      }
      return Reflect.get(target, property);
    },

    set(target, property, value) {
      const index = parseInt(property);
      if (!isNaN(index) && index < 0) {
        target[target.length + index] = value;
        return true;
      }
      return Reflect.set(target, property, value);
    }
  });
}

const arr = createNegativeIndexArray([1, 2, 3, 4, 5]);
console.log(arr[-1]); // 5
console.log(arr[-2]); // 4
arr[-1] = 10;
console.log(arr); // [1, 2, 3, 4, 10]

// Read-only proxy
function createReadOnlyProxy(target) {
  return new Proxy(target, {
    set() {
      throw new Error('This object is read-only');
    },

    deleteProperty() {
      throw new Error('Cannot delete properties from read-only object');
    },

    defineProperty() {
      throw new Error('Cannot define properties on read-only object');
    }
  });
}

const readOnlyObj = createReadOnlyProxy({ a: 1, b: 2 });
console.log(readOnlyObj.a); // 1
// readOnlyObj.c = 3; // Error: This object is read-only

// Observable proxy
function createObservable(target, callback) {
  return new Proxy(target, {
    set(target, property, value) {
      const oldValue = target[property];
      const result = Reflect.set(target, property, value);

      if (oldValue !== value) {
        callback(property, oldValue, value);
      }

      return result;
    }
  });
}

const observed = createObservable({ count: 0 }, (prop, oldVal, newVal) => {
  console.log(`${prop} changed from ${oldVal} to ${newVal}`);
});

observed.count = 1; // count changed from 0 to 1
observed.count = 2; // count changed from 1 to 2
observed.count = 2; // No change, no callback

// Using Reflect API
const obj = { a: 1, b: 2 };

console.log(Reflect.get(obj, 'a')); // 1
console.log(Reflect.set(obj, 'c', 3)); // true
console.log(Reflect.has(obj, 'c')); // true
console.log(Reflect.deleteProperty(obj, 'b')); // true
console.log(Reflect.ownKeys(obj)); // ['a', 'c']
console.log(Reflect.getOwnPropertyDescriptor(obj, 'a'));
// { value: 1, writable: true, enumerable: true, configurable: true }
```

This comprehensive guide covers all major ES6+ features with practical examples and advanced usage patterns. The examples demonstrate modern JavaScript development practices and patterns that are essential for professional web development.
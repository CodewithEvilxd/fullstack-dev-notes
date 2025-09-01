### **Lesson 4: JavaScript Basics - Programming Fundamentals**

## **1. What is JavaScript?**

JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It's primarily used for web development to add interactivity and dynamic behavior to websites. JavaScript can run in browsers, on servers (Node.js), and even on devices.

### **Key Characteristics:**

- **Dynamic:** Variables can hold different types of data
- **Interpreted:** Code is executed line by line
- **Object-oriented:** Supports objects and inheritance
- **Functional:** Functions are first-class citizens
- **Event-driven:** Responds to user interactions
- **Cross-platform:** Runs on multiple platforms

### **JavaScript Versions:**
- ES5 (2009): Basic version with traditional syntax
- ES6/ES2015: Major update with arrow functions, classes, modules, promises
- ES2016-ES2023: Annual updates with new features like async/await, optional chaining, nullish coalescing
- **Current Recommendation:** Use ES2022+ features with transpilation for older browsers

## **2. Including JavaScript in HTML**

### **Internal JavaScript:**
```html
<script>
    // JavaScript code here
    console.log("Hello from internal script!");
</script>
```

### **External JavaScript:**
```html
<script src="script.js"></script>
```

### **Best Practices:**
- Place scripts at the bottom of `<body>` for better performance
- Use `defer` for non-blocking script loading
- Use `async` for independent scripts

```html
<!-- Non-blocking, maintains order -->
<script defer src="script.js"></script>

<!-- Independent scripts -->
<script async src="analytics.js"></script>
```

## **3. Variables and Data Types**

### **Variable Declaration:**

```javascript
// var (avoid using, has scoping issues)
var oldWay = "Don't use this";

// let (block-scoped, can be reassigned)
let name = "John";
name = "Jane"; // OK

// const (block-scoped, cannot be reassigned)
const PI = 3.14159;
// PI = 3.14; // Error!
```

### **Data Types and Advanced Type Handling:**

#### **Primitive Types:**
```javascript
// String - immutable sequence of characters
let string = "Hello World";        // String literal
let template = `Hello ${name}!`;   // Template literal
let multiLine = `Line 1
Line 2`;                            // Multi-line string

// Number - 64-bit floating point
let integer = 42;                  // Integer
let float = 3.14159;              // Floating point
let scientific = 1.23e5;          // Scientific notation
let infinity = Infinity;          // Special number value
let notANumber = NaN;             // Not a Number

// Boolean - true or false
let isActive = true;
let isComplete = false;

// undefined - uninitialized variable
let undefinedVar;                  // undefined
let explicitlyUndefined = undefined;

// null - intentional absence of value
let nullVar = null;

// Symbol - unique identifiers
let symbol1 = Symbol('description');
let symbol2 = Symbol('description');
console.log(symbol1 === symbol2); // false

// BigInt - arbitrary precision integers
let bigInt = 123n;
let bigInt2 = BigInt(123);
let bigInt3 = BigInt("123");
```

#### **Reference Types:**
```javascript
// Array - ordered collection
let array = [1, 2, 3, 4, 5];
let mixedArray = [1, "hello", true, null, {key: "value"}];
let sparseArray = [1, , 3]; // Sparse array with empty slot

// Object - collection of key-value pairs
let object = {
    name: "John",
    age: 30,
    hobbies: ["reading", "coding"],
    address: {
        street: "123 Main St",
        city: "Anytown"
    }
};

// Function - reusable code block
let func = function() {
    return "Hello!";
};

// Advanced object creation
let person = Object.create(null); // Object with no prototype
let sealedObj = Object.seal({});  // Prevent adding/removing properties
let frozenObj = Object.freeze({}); // Prevent any modifications
```

#### **Type Conversion and Coercion:**
```javascript
// Explicit conversion
let num = Number("123");           // "123" → 123
let str = String(123);             // 123 → "123"
let bool = Boolean(1);             // 1 → true

// Implicit coercion (avoid when possible)
console.log("5" + 3);              // "53" (string concatenation)
console.log("5" - 3);              // 2 (numeric subtraction)
console.log(5 + true);             // 6 (true → 1)
console.log(5 + false);            // 5 (false → 0)

// Truthy/Falsy values
// Falsy: false, 0, "", null, undefined, NaN
// Truthy: Everything else

// Safe type checking
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

// Type guards
function processValue(value) {
    if (typeof value === 'string') {
        return value.toUpperCase();
    } else if (typeof value === 'number') {
        return value * 2;
    } else if (Array.isArray(value)) {
        return value.length;
    } else {
        return 'Unknown type';
    }
}
```

### **Type Checking:**
```javascript
typeof "string";     // "string"
typeof 42;           // "number"
typeof true;         // "boolean"
typeof undefined;    // "undefined"
typeof null;         // "object" (quirk)
typeof [1,2,3];      // "object"
typeof function(){}; // "function"
```

## **4. Operators**

### **Arithmetic Operators:**
```javascript
let a = 10, b = 3;

a + b;  // 13 (addition)
a - b;  // 7 (subtraction)
a * b;  // 30 (multiplication)
a / b;  // 3.333... (division)
a % b;  // 1 (modulus)
a ** b; // 1000 (exponentiation)
```

### **Comparison Operators:**
```javascript
a == b;   // false (loose equality)
a === b;  // false (strict equality)
a != b;   // true (loose inequality)
a !== b;  // true (strict inequality)
a > b;    // true (greater than)
a < b;    // false (less than)
a >= b;   // true (greater than or equal)
a <= b;   // false (less than or equal)
```

### **Logical Operators:**
```javascript
true && false;  // false (AND)
true || false;  // true (OR)
!true;          // false (NOT)
```

### **Assignment Operators:**
```javascript
let x = 5;
x += 3;  // x = x + 3 (8)
x -= 2;  // x = x - 2 (6)
x *= 4;  // x = x * 4 (24)
x /= 3;  // x = x / 3 (8)
x %= 5;  // x = x % 5 (3)
```

## **5. Control Structures**

### **Conditional Statements:**

```javascript
// if-else
if (condition) {
    // code to execute if condition is true
} else if (anotherCondition) {
    // code to execute if anotherCondition is true
} else {
    // code to execute if no conditions are true
}

// Ternary operator
let result = condition ? valueIfTrue : valueIfFalse;

// Switch statement
switch (expression) {
    case value1:
        // code
        break;
    case value2:
        // code
        break;
    default:
        // code
}
```

### **Loops:**

```javascript
// for loop
for (let i = 0; i < 5; i++) {
    console.log(i); // 0, 1, 2, 3, 4
}

// while loop
let i = 0;
while (i < 5) {
    console.log(i);
    i++;
}

// do-while loop
let j = 0;
do {
    console.log(j);
    j++;
} while (j < 5);

// for-of loop (for arrays)
let array = [1, 2, 3];
for (let item of array) {
    console.log(item);
}

// for-in loop (for objects)
let object = {a: 1, b: 2, c: 3};
for (let key in object) {
    console.log(key, object[key]);
}
```

## **6. Functions**

### **Function Declaration:**
```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("John")); // "Hello, John!"
```

### **Function Expression:**
```javascript
const greet = function(name) {
    return `Hello, ${name}!`;
};
```

### **Arrow Functions (ES6):**
```javascript
const greet = (name) => `Hello, ${name}!`;

const add = (a, b) => a + b;

const complexFunction = (a, b) => {
    let result = a + b;
    return result * 2;
};
```

### **Function Parameters:**
```javascript
// Default parameters
function greet(name = "Guest") {
    return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // 10
```

### **Higher-Order Functions and Functional Programming:**
```javascript
// Higher-order function that returns a function
function createMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Function composition
function compose(f, g) {
    return function(x) {
        return f(g(x));
    };
}

const add1 = x => x + 1;
const multiply2 = x => x * 2;
const add1ThenMultiply2 = compose(multiply2, add1);

console.log(add1ThenMultiply2(3)); // (3 + 1) * 2 = 8

// Currying
function curryAdd(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}

const add5 = curryAdd(5);
const add5And3 = add5(3);
console.log(add5And3(2)); // 5 + 3 + 2 = 10

// Partial application
function partial(func, ...args) {
    return function(...moreArgs) {
        return func(...args, ...moreArgs);
    };
}

const add = (a, b, c) => a + b + c;
const add5 = partial(add, 5);
console.log(add5(3, 2)); // 5 + 3 + 2 = 10
```

### **Asynchronous JavaScript:**

#### **Promises:**
```javascript
// Creating a promise
function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

// Using promises
delay(1000)
    .then(() => {
        console.log('1 second passed');
        return delay(2000);
    })
    .then(() => {
        console.log('Another 2 seconds passed');
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Promise.all for parallel execution
const promises = [
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/comments')
];

Promise.all(promises)
    .then(responses => {
        return Promise.all(responses.map(r => r.json()));
    })
    .then(data => {
        console.log('All data loaded:', data);
    });

// Promise.race for first completion
Promise.race([
    fetch('/api/fast'),
    delay(5000).then(() => ({ timeout: true }))
])
.then(result => {
    if (result.timeout) {
        console.log('Request timed out');
    } else {
        console.log('Fast response:', result);
    }
});
```

#### **Async/Await:**
```javascript
// Async function
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

// Using async functions
async function processUser(userId) {
    try {
        const user = await fetchUserData(userId);
        const posts = await fetchUserPosts(userId);
        const comments = await fetchUserComments(userId);

        return {
            user,
            posts,
            comments,
            summary: `${user.name} has ${posts.length} posts and ${comments.length} comments`
        };
    } catch (error) {
        console.error('Error processing user:', error);
        return null;
    }
}

// Parallel execution with async/await
async function loadDashboardData() {
    const [users, posts, analytics] = await Promise.all([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/posts').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json())
    ]);

    return { users, posts, analytics };
}
```

#### **Modern JavaScript Features (ES6+):**

##### **Destructuring:**
```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first, second, rest); // 1, 2, [3, 4, 5]

// Object destructuring
const { name, age, ...otherProps } = {
    name: 'John',
    age: 30,
    city: 'NYC',
    country: 'USA'
};
console.log(name, age, otherProps); // John, 30, {city: 'NYC', country: 'USA'}

// Default values
const { name = 'Anonymous', age = 18 } = user || {};

// Nested destructuring
const {
    user: { name, profile: { avatar } },
    settings: { theme = 'light' }
} = data;
```

##### **Spread and Rest Operators:**
```javascript
// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // {a: 1, b: 2, c: 3, d: 4}

// Rest operator (already shown in function parameters)
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}
```

##### **Optional Chaining and Nullish Coalescing:**
```javascript
// Optional chaining
const userName = user?.profile?.name;
const firstPost = posts?.[0]?.title;

// Nullish coalescing
const theme = user.settings?.theme ?? 'light';
const timeout = config.timeout ?? 5000;

// Combining both
const displayName = user?.profile?.displayName ?? 'Anonymous';
```

##### **Modules:**
```javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export default function multiply(a, b) {
    return a * b;
}

// main.js
import multiply, { PI, add } from './math.js';

console.log(add(2, 3));        // 5
console.log(multiply(2, 3));   // 6
console.log(PI);               // 3.14159

// Dynamic imports
const module = await import('./math.js');
```

##### **Classes and Inheritance:**
```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a sound.`);
    }

    static createAnimal(type, name) {
        return new type(name);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }

    speak() {
        console.log(`${this.name} barks!`);
    }

    fetch() {
        console.log(`${this.name} fetches the ball!`);
    }
}

// Usage
const dog = new Dog('Buddy', 'Golden Retriever');
dog.speak();    // Buddy barks!
dog.fetch();    // Buddy fetches the ball!

const cat = Animal.createAnimal(Cat, 'Whiskers');
```

##### **Maps and Sets:**
```javascript
// Map - key-value pairs with any type of key
const userRoles = new Map();
userRoles.set('john@example.com', 'admin');
userRoles.set('jane@example.com', 'user');
userRoles.set(123, 'moderator'); // Number as key

console.log(userRoles.get('john@example.com')); // 'admin'
console.log(userRoles.has('jane@example.com')); // true
console.log(userRoles.size); // 3

// Set - unique values
const uniqueTags = new Set(['javascript', 'web', 'programming']);
uniqueTags.add('javascript'); // Won't add duplicate
uniqueTags.add('react');

console.log(uniqueTags.has('react')); // true
console.log(uniqueTags.size); // 3

// WeakMap and WeakSet for memory management
const weakMap = new WeakMap();
const obj = {};
weakMap.set(obj, 'some value');
// When obj is garbage collected, weakMap entry is automatically removed
```

##### **Generators and Iterators:**
```javascript
// Generator function
function* fibonacci() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

// Using generator
const fib = fibonacci();
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3

// Custom iterator
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    *[Symbol.iterator]() {
        for (let i = this.start; i <= this.end; i++) {
            yield i;
        }
    }
}

const range = new Range(1, 5);
for (const num of range) {
    console.log(num); // 1, 2, 3, 4, 5
}
```

##### **Error Handling:**
```javascript
// Custom error classes
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

class NetworkError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'NetworkError';
        this.statusCode = statusCode;
    }
}

// Error handling with try-catch-finally
async function processData(data) {
    try {
        // Validate input
        if (!data.name) {
            throw new ValidationError('Name is required', 'name');
        }

        // Process data
        const result = await apiCall(data);

        return result;
    } catch (error) {
        if (error instanceof ValidationError) {
            console.error(`Validation failed for ${error.field}: ${error.message}`);
            // Handle validation error
        } else if (error instanceof NetworkError) {
            console.error(`Network error (${error.statusCode}): ${error.message}`);
            // Handle network error
        } else {
            console.error('Unexpected error:', error);
            // Handle unexpected errors
        }
        throw error; // Re-throw if needed
    } finally {
        // Cleanup code that always runs
        console.log('Processing complete');
    }
}

// Error boundaries (for frameworks like React)
class ErrorBoundary {
    constructor() {
        this.hasError = false;
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }
}
```

## **7. Arrays**

### **Array Creation and Access:**
```javascript
// Array literal
let fruits = ["apple", "banana", "orange"];

// Array constructor
let numbers = new Array(1, 2, 3);

// Accessing elements
console.log(fruits[0]); // "apple"
console.log(fruits.length); // 3
```

### **Array Methods:**

```javascript
let fruits = ["apple", "banana", "orange"];

// Adding elements
fruits.push("grape");        // ["apple", "banana", "orange", "grape"]
fruits.unshift("mango");     // ["mango", "apple", "banana", "orange", "grape"]

// Removing elements
fruits.pop();                // ["mango", "apple", "banana", "orange"]
fruits.shift();              // ["apple", "banana", "orange"]

// Finding elements
fruits.indexOf("banana");    // 1
fruits.includes("apple");    // true

// Slicing and splicing
let citrus = fruits.slice(1, 3);  // ["banana", "orange"]
fruits.splice(1, 1, "kiwi");      // ["apple", "kiwi", "orange"]

// Iteration
fruits.forEach(fruit => console.log(fruit));

let upperFruits = fruits.map(fruit => fruit.toUpperCase());
let longFruits = fruits.filter(fruit => fruit.length > 5);
let totalLength = fruits.reduce((total, fruit) => total + fruit.length, 0);
```

## **8. Objects**

### **Object Creation:**
```javascript
// Object literal
let person = {
    name: "John",
    age: 30,
    hobbies: ["reading", "coding"],
    greet: function() {
        return `Hello, I'm ${this.name}`;
    }
};

// Constructor function
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// ES6 Classes
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        return `Hello, I'm ${this.name}`;
    }
}
```

### **Object Methods:**
```javascript
let person = {name: "John", age: 30};

// Accessing properties
console.log(person.name);     // "John"
console.log(person["age"]);   // 30

// Adding/modifying properties
person.email = "john@example.com";
person.age = 31;

// Checking properties
console.log("name" in person);        // true
console.log(person.hasOwnProperty("name")); // true

// Getting keys/values
Object.keys(person);     // ["name", "age", "email"]
Object.values(person);   // ["John", 31, "john@example.com"]
Object.entries(person);  // [["name", "John"], ["age", 31], ...]
```

## **9. DOM Manipulation**

### **Selecting Elements:**
```javascript
// Single element
document.getElementById("myId");
document.querySelector(".myClass");
document.querySelector("#myId");

// Multiple elements
document.getElementsByClassName("myClass");
document.getElementsByTagName("div");
document.querySelectorAll(".myClass");
```

### **Modifying Elements:**
```javascript
let element = document.getElementById("myElement");

// Content
element.textContent = "New text content";
element.innerHTML = "<strong>New HTML content</strong>";

// Attributes
element.setAttribute("class", "newClass");
element.classList.add("anotherClass");
element.classList.remove("oldClass");
element.classList.toggle("active");

// Styles
element.style.color = "red";
element.style.fontSize = "20px";
```

### **Creating and Inserting Elements:**
```javascript
// Create element
let newDiv = document.createElement("div");
newDiv.textContent = "New div";
newDiv.className = "myClass";

// Insert element
document.body.appendChild(newDiv);

// Insert before/after
let referenceElement = document.getElementById("reference");
referenceElement.parentNode.insertBefore(newDiv, referenceElement);

// Remove element
element.parentNode.removeChild(element);
```

## **10. Event Handling**

### **Event Listeners:**
```javascript
let button = document.getElementById("myButton");

// Method 1: addEventListener
button.addEventListener("click", function(event) {
    console.log("Button clicked!");
    console.log(event.target); // The element that triggered the event
});

// Method 2: Inline (not recommended)
<button onclick="handleClick()">Click me</button>

// Method 3: Property assignment
button.onclick = function() {
    console.log("Button clicked!");
};
```

### **Common Events:**
```javascript
element.addEventListener("click", handleClick);
element.addEventListener("mouseover", handleMouseOver);
element.addEventListener("mouseout", handleMouseOut);
element.addEventListener("keydown", handleKeyDown);
element.addEventListener("keyup", handleKeyUp);
element.addEventListener("submit", handleSubmit);
element.addEventListener("change", handleChange);
element.addEventListener("focus", handleFocus);
element.addEventListener("blur", handleBlur);
```

### **Event Object:**
```javascript
function handleClick(event) {
    event.preventDefault();        // Prevent default behavior
    event.stopPropagation();       // Stop event bubbling

    console.log(event.type);       // "click"
    console.log(event.target);     // Element that triggered event
    console.log(event.currentTarget); // Element with listener
}
```

## **11. Code Examples**

### **Example 1: Interactive To-Do List**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>To-Do List</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .todo-item { display: flex; align-items: center; margin: 10px 0; }
        .completed { text-decoration: line-through; color: #888; }
        input[type="text"] { flex: 1; padding: 8px; margin-right: 10px; }
        button { padding: 8px 16px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>My To-Do List</h1>

    <div class="todo-input">
        <input type="text" id="todoInput" placeholder="Add a new task...">
        <button id="addButton">Add Task</button>
    </div>

    <ul id="todoList"></ul>

    <script>
        const todoInput = document.getElementById('todoInput');
        const addButton = document.getElementById('addButton');
        const todoList = document.getElementById('todoList');

        addButton.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        function addTodo() {
            const taskText = todoInput.value.trim();
            if (taskText === '') return;

            const li = document.createElement('li');
            li.className = 'todo-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', toggleComplete);

            const span = document.createElement('span');
            span.textContent = taskText;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', deleteTodo);

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteButton);
            todoList.appendChild(li);

            todoInput.value = '';
        }

        function toggleComplete(event) {
            const span = event.target.nextElementSibling;
            span.classList.toggle('completed');
        }

        function deleteTodo(event) {
            const li = event.target.parentElement;
            todoList.removeChild(li);
        }
    </script>
</body>
</html>
```

### **Example 2: Form Validation**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form Validation</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input { width: 100%; padding: 8px; box-sizing: border-box; }
        .error { color: red; font-size: 0.9em; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1>Contact Form</h1>
    <form id="contactForm">
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
            <div class="error" id="nameError"></div>
        </div>

        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
            <div class="error" id="emailError"></div>
        </div>

        <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="5"></textarea>
            <div class="error" id="messageError"></div>
        </div>

        <button type="submit">Send Message</button>
    </form>

    <script>
        const form = document.getElementById('contactForm');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            clearErrors();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            let isValid = true;

            if (name === '') {
                showError('nameError', 'Name is required');
                isValid = false;
            }

            if (email === '') {
                showError('emailError', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('emailError', 'Please enter a valid email');
                isValid = false;
            }

            if (message === '') {
                showError('messageError', 'Message is required');
                isValid = false;
            }

            if (isValid) {
                alert('Form submitted successfully!');
                form.reset();
            }
        });

        function showError(elementId, message) {
            document.getElementById(elementId).textContent = message;
        }

        function clearErrors() {
            const errors = document.querySelectorAll('.error');
            errors.forEach(error => error.textContent = '');
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    </script>
</body>
</html>
```

### **Example 3: Simple Calculator**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Calculator</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f0f0; }
        .calculator { background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .display { background: #222; color: white; padding: 10px; text-align: right; font-size: 24px; border-radius: 5px; margin-bottom: 10px; }
        .buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        button { padding: 15px; font-size: 18px; border: none; border-radius: 5px; cursor: pointer; }
        .number { background: #e0e0e0; }
        .operator { background: #f8a100; color: white; }
        .equals { background: #4CAF50; color: white; grid-column: span 2; }
        .clear { background: #f44336; color: white; }
    </style>
</head>
<body>
    <div class="calculator">
        <div class="display" id="display">0</div>
        <div class="buttons">
            <button class="clear" onclick="clearDisplay()">C</button>
            <button onclick="appendToDisplay('(')">(</button>
            <button onclick="appendToDisplay(')')">)</button>
            <button class="operator" onclick="appendToDisplay('/')">/</button>

            <button class="number" onclick="appendToDisplay('7')">7</button>
            <button class="number" onclick="appendToDisplay('8')">8</button>
            <button class="number" onclick="appendToDisplay('9')">9</button>
            <button class="operator" onclick="appendToDisplay('*')">*</button>

            <button class="number" onclick="appendToDisplay('4')">4</button>
            <button class="number" onclick="appendToDisplay('5')">5</button>
            <button class="number" onclick="appendToDisplay('6')">6</button>
            <button class="operator" onclick="appendToDisplay('-')">-</button>

            <button class="number" onclick="appendToDisplay('1')">1</button>
            <button class="number" onclick="appendToDisplay('2')">2</button>
            <button class="number" onclick="appendToDisplay('3')">3</button>
            <button class="operator" onclick="appendToDisplay('+')">+</button>

            <button class="number" onclick="appendToDisplay('0')">0</button>
            <button onclick="appendToDisplay('.')">.</button>
            <button class="equals" onclick="calculate()">=</button>
        </div>
    </div>

    <script>
        let display = document.getElementById('display');

        function appendToDisplay(value) {
            if (display.textContent === '0') {
                display.textContent = value;
            } else {
                display.textContent += value;
            }
        }

        function clearDisplay() {
            display.textContent = '0';
        }

        function calculate() {
            try {
                let result = eval(display.textContent);
                display.textContent = result;
            } catch (error) {
                display.textContent = 'Error';
            }
        }

        // Keyboard support
        document.addEventListener('keydown', function(e) {
            if (e.key >= '0' && e.key <= '9') {
                appendToDisplay(e.key);
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                appendToDisplay(e.key);
            } else if (e.key === 'Enter') {
                calculate();
            } else if (e.key === 'Escape') {
                clearDisplay();
            } else if (e.key === '.') {
                appendToDisplay('.');
            }
        });
    </script>
</body>
</html>
```

## **12. Assignments and Projects**

### **Assignment 4.1: JavaScript Fundamentals**
Create scripts that demonstrate:
- Variable declarations with different data types
- Arithmetic, comparison, and logical operations
- Conditional statements and loops
- Function declarations and expressions
- Array and object manipulation

### **Assignment 4.2: DOM Manipulation**
Build an interactive page that includes:
- Dynamic content creation and removal
- Event handling for user interactions
- Form validation
- Style manipulation through JavaScript

### **Project 4: Interactive Quiz Application**
Create a quiz application with:
- Multiple choice questions
- Score tracking
- Timer functionality
- Results display
- Question navigation

### **Challenge Project: Memory Card Game**
Build a memory card matching game featuring:
- Card flipping animations
- Score tracking
- Timer
- Difficulty levels
- Game restart functionality

## **13. JavaScript Best Practices**

### **Code Quality:**
- Use meaningful variable and function names
- Follow consistent indentation and formatting
- Add comments for complex logic
- Avoid global variables when possible
- Use strict mode: `'use strict';`

### **Performance:**
- Minimize DOM manipulations
- Use efficient loops and algorithms
- Cache DOM selections
- Debounce expensive operations
- Use `requestAnimationFrame` for animations

### **Error Handling:**
```javascript
try {
    // Code that might throw an error
    riskyOperation();
} catch (error) {
    console.error('An error occurred:', error);
} finally {
    // Code that always runs
    cleanup();
}
```

## **14. Common JavaScript Errors**

- `ReferenceError`: Variable not declared
- `TypeError`: Operation on wrong type
- `SyntaxError`: Invalid syntax
- `RangeError`: Value out of range

## **15. Debugging JavaScript**

### **Console Methods:**
```javascript
console.log('Basic logging');
console.warn('Warning message');
console.error('Error message');
console.table(arrayOrObject);
console.time('timerName');
// ... code to time ...
console.timeEnd('timerName');
```

### **Browser Developer Tools:**
- Use breakpoints to pause execution
- Step through code line by line
- Inspect variables and call stack
- Monitor network requests

## **16. Advanced JavaScript Concepts**

### **Memory Management and Garbage Collection**

#### **Memory Leaks Prevention**
```javascript
// Common memory leak patterns and solutions

// 1. Closures can cause memory leaks
function createLeak() {
    const largeData = new Array(1000000).fill('data');

    return function() {
        console.log(largeData.length);
    };
}

// Solution: Clean up references
function createNoLeak() {
    let largeData = new Array(1000000).fill('data');

    const cleanup = () => {
        largeData = null; // Allow garbage collection
    };

    const useData = () => {
        if (largeData) {
            console.log(largeData.length);
        }
    };

    return { useData, cleanup };
}

// 2. Event listeners
class EventManager {
    constructor() {
        this.listeners = new Map();
    }

    addListener(element, event, handler) {
        if (!this.listeners.has(element)) {
            this.listeners.set(element, new Map());
        }

        const elementListeners = this.listeners.get(element);
        if (!elementListeners.has(event)) {
            elementListeners.set(event, new Set());
        }

        elementListeners.get(event).add(handler);
        element.addEventListener(event, handler);
    }

    removeListener(element, event, handler) {
        element.removeEventListener(event, handler);

        const elementListeners = this.listeners.get(element);
        if (elementListeners && elementListeners.has(event)) {
            elementListeners.get(event).delete(handler);
        }
    }

    removeAllListeners(element) {
        const elementListeners = this.listeners.get(element);
        if (elementListeners) {
            for (const [event, handlers] of elementListeners) {
                for (const handler of handlers) {
                    element.removeEventListener(event, handler);
                }
            }
            this.listeners.delete(element);
        }
    }

    destroy() {
        for (const [element] of this.listeners) {
            this.removeAllListeners(element);
        }
    }
}

// 3. Timers
class TimerManager {
    constructor() {
        this.timers = new Set();
    }

    setTimeout(handler, delay) {
        const id = setTimeout(() => {
            this.timers.delete(id);
            handler();
        }, delay);

        this.timers.add(id);
        return id;
    }

    setInterval(handler, delay) {
        const id = setInterval(handler, delay);
        this.timers.add(id);
        return id;
    }

    clearTimeout(id) {
        clearTimeout(id);
        this.timers.delete(id);
    }

    clearInterval(id) {
        clearInterval(id);
        this.timers.delete(id);
    }

    clearAll() {
        for (const id of this.timers) {
            clearTimeout(id);
            clearInterval(id);
        }
        this.timers.clear();
    }
}
```

#### **Weak References**
```javascript
// WeakMap for caching without memory leaks
class Cache {
    constructor() {
        this.cache = new WeakMap();
    }

    set(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    get(key) {
        const entry = this.cache.get(key);
        if (entry) {
            return entry.value;
        }
        return undefined;
    }

    has(key) {
        return this.cache.has(key);
    }

    delete(key) {
        return this.cache.delete(key);
    }

    // Automatic cleanup when objects are garbage collected
}

// WeakSet for tracking objects
class ObjectTracker {
    constructor() {
        this.tracked = new WeakSet();
    }

    track(obj) {
        this.tracked.add(obj);
    }

    isTracked(obj) {
        return this.tracked.has(obj);
    }

    untrack(obj) {
        this.tracked.delete(obj);
    }
}
```

### **Performance Optimization Techniques**

#### **Debouncing and Throttling**
```javascript
// Debounce: Execute function after delay, cancel if called again
function debounce(func, delay) {
    let timeoutId;

    return function(...args) {
        const context = this;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// Throttle: Execute function at most once per delay period
function throttle(func, delay) {
    let lastCall = 0;

    return function(...args) {
        const context = this;
        const now = Date.now();

        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(context, args);
        }
    };
}

// Advanced throttle with leading and trailing options
function advancedThrottle(func, delay, options = {}) {
    const { leading = true, trailing = true } = options;
    let lastCall = 0;
    let timeoutId = null;

    return function(...args) {
        const context = this;
        const now = Date.now();

        if (now - lastCall >= delay) {
            if (leading) {
                func.apply(context, args);
            }
            lastCall = now;
        } else if (trailing && !timeoutId) {
            timeoutId = setTimeout(() => {
                func.apply(context, args);
                lastCall = Date.now();
                timeoutId = null;
            }, delay - (now - lastCall));
        }
    };
}

// Usage examples
const debouncedSearch = debounce(searchAPI, 300);
const throttledScroll = throttle(handleScroll, 100);

// Input event with debounce
searchInput.addEventListener('input', debouncedSearch);

// Scroll event with throttle
window.addEventListener('scroll', throttledScroll);
```

#### **Memoization**
```javascript
// Simple memoization
function memoize(func) {
    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = func.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Advanced memoization with TTL
function memoizeWithTTL(func, ttl = 60000) {
    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);
        const now = Date.now();

        if (cache.has(key)) {
            const { value, timestamp } = cache.get(key);
            if (now - timestamp < ttl) {
                return value;
            }
            cache.delete(key);
        }

        const result = func.apply(this, args);
        cache.set(key, { value: result, timestamp: now });
        return result;
    };
}

// Memoization for methods
function memoizeMethod(target, methodName, ttl) {
    const originalMethod = target[methodName];
    const memoized = memoizeWithTTL(originalMethod, ttl);

    target[methodName] = memoized;
    return target;
}

// Usage
const expensiveCalculation = memoize((n) => {
    console.log(`Calculating for ${n}`);
    return n * n;
});

console.log(expensiveCalculation(5)); // Calculates
console.log(expensiveCalculation(5)); // Returns cached result

// Memoize class method
class Calculator {
    fibonacci(n) {
        if (n <= 1) return n;
        return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
}

const calc = new Calculator();
memoizeMethod(calc, 'fib

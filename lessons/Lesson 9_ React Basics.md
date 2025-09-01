### **Lesson 9: React Basics - Building User Interfaces**

## **1. What is React?**

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components". React was created by Facebook and is maintained by Facebook and a community of individual developers and companies.

### **Key Concepts:**

#### **Core Concepts:**
- **Components:** Reusable pieces of UI that manage their own state
- **JSX:** Syntax extension that allows writing HTML-like code in JavaScript
- **Virtual DOM:** In-memory representation of the real DOM for efficient updates
- **One-way Data Flow:** Data flows down from parent to child components
- **Declarative:** Describe what you want, React handles how to achieve it

#### **Advanced Concepts:**
- **Reconciliation:** React's algorithm for updating the DOM efficiently
- **Fiber Architecture:** React's new reconciliation engine for better performance
- **Concurrent Mode:** Non-blocking rendering for better user experience
- **Suspense:** Declarative loading states and code splitting
- **Error Boundaries:** Graceful error handling in component trees
- **Portals:** Rendering children outside the DOM hierarchy
- **Fragments:** Grouping multiple children without wrapper elements
- **Refs:** Direct access to DOM elements and component instances

### **Why React?**

- **Component-Based:** Build encapsulated components that manage their own state
- **Learn Once, Write Anywhere:** Use React for web, mobile (React Native), and more
- **Declarative:** Easy to reason about and debug
- **Efficient:** Virtual DOM minimizes DOM manipulation
- **Large Ecosystem:** Rich ecosystem of tools and libraries
- **Strong Community:** Active community and excellent documentation

## **2. Setting Up React**

### **Create React App (CRA):**

```bash
# Create a new React app
npx create-react-app my-app

# Navigate to the project
cd my-app

# Start the development server
npm start
```

### **Project Structure:**

```
my-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.css
│   ├── App.test.js
│   ├── index.js
│   ├── index.css
│   └── logo.svg
├── package.json
└── README.md
```

### **Vite (Modern Alternative):**

```bash
# Create a new React app with Vite
npm create vite@latest my-app -- --template react

# Navigate and install dependencies
cd my-app
npm install

# Start development server
npm run dev
```

## **3. JSX - JavaScript XML**

### **Basic JSX:**

```jsx
// JSX allows you to write HTML-like syntax in JavaScript
const element = <h1>Hello, World!</h1>;

// JSX is compiled to React.createElement calls
const element = React.createElement('h1', null, 'Hello, World!');
```

### **Embedding Expressions:**

```jsx
const name = 'John';
const element = <h1>Hello, {name}!</h1>;

const user = {
    firstName: 'John',
    lastName: 'Doe'
};

const element = <h1>Hello, {user.firstName} {user.lastName}!</h1>;
```

### **JSX Attributes:**

```jsx
const element = <img src={user.avatarUrl} alt={user.name} />;

// Boolean attributes
const element = <input type="checkbox" checked={true} />;

// Spread attributes
const props = { type: 'text', placeholder: 'Enter name' };
const element = <input {...props} />;
```

### **JSX and Children:**

```jsx
// Text children
const element = <h1>Hello!</h1>;

// Element children
const element = (
    <div>
        <h1>Hello!</h1>
        <p>Welcome to React</p>
    </div>
);

// Expression children
const items = ['Apple', 'Banana', 'Orange'];
const element = (
    <ul>
        {items.map(item => <li key={item}>{item}</li>)}
    </ul>
);
```

## **4. Components**

### **Function Components and Advanced Patterns:**

#### **Basic Function Components:**
```jsx
// Simple function component
function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
}

// Arrow function component
const Welcome = (props) => {
    return <h1>Hello, {props.name}!</h1>;
};

// Component with destructuring
const Welcome = ({ name, age }) => {
    return (
        <div>
            <h1>Hello, {name}!</h1>
            <p>You are {age} years old.</p>
        </div>
    );
};
```

#### **Advanced Component Patterns:**

##### **Compound Components:**
```jsx
// Compound component pattern
function Tabs({ children }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="tabs">
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child, {
                    isActive: index === activeTab,
                    onClick: () => setActiveTab(index)
                })
            )}
        </div>
    );
}

function Tab({ children, isActive, onClick }) {
    return (
        <button
            className={`tab ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function TabPanel({ children, isActive }) {
    return isActive ? <div className="tab-panel">{children}</div> : null;
}

// Usage
function App() {
    return (
        <Tabs>
            <Tab>Home</Tab>
            <Tab>Profile</Tab>
            <Tab>Settings</Tab>
        </Tabs>
    );
}
```

##### **Render Props Pattern:**
```jsx
function MouseTracker({ render }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        setPosition({
            x: event.clientX,
            y: event.clientY
        });
    };

    return (
        <div onMouseMove={handleMouseMove}>
            {render(position)}
        </div>
    );
}

// Usage
function App() {
    return (
        <MouseTracker
            render={({ x, y }) => (
                <div>
                    Mouse position: {x}, {y}
                </div>
            )}
        />
    );
}
```

##### **Higher-Order Components (HOC):**
```jsx
function withLoading(Component) {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (isLoading) {
            return <div className="loading-spinner">Loading...</div>;
        }
        return <Component {...props} />;
    };
}

function withErrorBoundary(Component) {
    return class WithErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error) {
            return { hasError: true };
        }

        componentDidCatch(error, errorInfo) {
            console.error('Error caught by boundary:', error, errorInfo);
        }

        render() {
            if (this.state.hasError) {
                return <div>Something went wrong.</div>;
            }

            return <Component {...this.props} />;
        }
    };
}

// Usage
const UserListWithLoading = withLoading(UserList);
const UserListWithErrorBoundary = withErrorBoundary(UserListWithLoading);
```

##### **Controlled vs Uncontrolled Components:**
```jsx
// Controlled component (recommended)
function ControlledInput() {
    const [value, setValue] = useState('');

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

// Uncontrolled component with ref
function UncontrolledInput() {
    const inputRef = useRef();

    const handleSubmit = () => {
        console.log('Input value:', inputRef.current.value);
    };

    return (
        <div>
            <input type="text" ref={inputRef} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

// Uncontrolled with default value
function UncontrolledWithDefault() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log('Form data:', Object.fromEntries(formData));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" defaultValue="John" />
            <input type="email" name="email" defaultValue="john@example.com" />
            <button type="submit">Submit</button>
        </form>
    );
}
```

##### **Portals for Modal/Dialog Components:**
```jsx
function Modal({ children, onClose }) {
    const modalRoot = document.getElementById('modal-root');

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>,
        modalRoot
    );
}

// Usage
function App() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <button onClick={() => setShowModal(true)}>Open Modal</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h2>Modal Title</h2>
                    <p>Modal content goes here...</p>
                </Modal>
            )}
        </div>
    );
}
```

##### **Error Boundaries:**
```jsx
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to service
        console.error('Error boundary caught an error:', error, errorInfo);

        // You can also send this to an error reporting service
        // errorReportingService.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Something went wrong.</h2>
                    <p>Please try refreshing the page.</p>
                    {process.env.NODE_ENV === 'development' && (
                        <details>
                            <summary>Error Details</summary>
                            <pre>{this.state.error?.toString()}</pre>
                        </details>
                    )}
                    <button onClick={() => this.setState({ hasError: false })}>
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Usage
function App() {
    return (
        <ErrorBoundary>
            <MyComponent />
        </ErrorBoundary>
    );
}
```

##### **Fragments for Cleaner JSX:**
```jsx
// Without fragments (extra div)
function ListItems() {
    return (
        <div>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </div>
    );
}

// With fragments (no extra wrapper)
function ListItems() {
    return (
        <>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </>
    );
}

// Named fragments
function ListItems() {
    return (
        <React.Fragment>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </React.Fragment>
    );
}

// Fragments with keys (for lists)
function ListItems({ items }) {
    return (
        <>
            {items.map(item => (
                <React.Fragment key={item.id}>
                    <li>{item.name}</li>
                    <span>{item.description}</span>
                </React.Fragment>
            ))}
        </>
    );
}
```

##### **Refs for DOM Access:**
```jsx
// Class component ref
class TextInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    focusInput = () => {
        this.inputRef.current.focus();
    };

    render() {
        return (
            <div>
                <input ref={this.inputRef} type="text" />
                <button onClick={this.focusInput}>Focus Input</button>
            </div>
        );
    }
}

// Function component ref
function TextInput() {
    const inputRef = useRef();

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={focusInput}>Focus Input</button>
        </div>
    );
}

// Forwarding refs
const FancyInput = React.forwardRef((props, ref) => (
    <input ref={ref} {...props} className="fancy-input" />
));

// Usage
function App() {
    const inputRef = useRef();

    return (
        <div>
            <FancyInput ref={inputRef} placeholder="Type here..." />
            <button onClick={() => inputRef.current.focus()}>
                Focus Fancy Input
            </button>
        </div>
    );
}
```

##### **Memoization for Performance:**
```jsx
// React.memo for component memoization
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data, onClick }) {
    console.log('ExpensiveComponent rendered');
    return (
        <div>
            <h2>{data.title}</h2>
            <p>{data.description}</p>
            <button onClick={onClick}>Click me</button>
        </div>
    );
});

// Custom comparison function
const CustomMemoComponent = React.memo(
    function CustomMemoComponent({ items }) {
        return (
            <ul>
                {items.map(item => <li key={item.id}>{item.name}</li>)}
            </ul>
        );
    },
    (prevProps, nextProps) => {
        // Custom comparison logic
        return prevProps.items.length === nextProps.items.length &&
               prevProps.items.every((item, index) =>
                   item.id === nextProps.items[index]?.id
               );
    }
);

// useMemo for expensive calculations
function ExpensiveCalculation({ numbers }) {
    const sum = useMemo(() => {
        console.log('Calculating sum...');
        return numbers.reduce((acc, num) => acc + num, 0);
    }, [numbers]);

    return <div>Sum: {sum}</div>;
}

// useCallback for stable function references
function ParentComponent() {
    const [count, setCount] = useState(0);

    const handleClick = useCallback(() => {
        setCount(prev => prev + 1);
    }, []); // Empty dependency array means function never changes

    return (
        <div>
            <ChildComponent onClick={handleClick} />
            <p>Count: {count}</p>
        </div>
    );
}

const ChildComponent = React.memo(function ChildComponent({ onClick }) {
    console.log('ChildComponent rendered');
    return <button onClick={onClick}>Increment</button>;
});
```

##### **Lazy Loading and Code Splitting:**
```jsx
// Dynamic imports with React.lazy
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <LazyComponent />
            </Suspense>
        </div>
    );
}

// Route-based code splitting
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

function App() {
    return (
        <Router>
            <Suspense fallback={<div>Loading page...</div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </Suspense>
        </Router>
    );
}
```

##### **Context for Global State:**
```jsx
// Create context
const ThemeContext = React.createContext();

// Context provider
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const value = {
        theme,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook for using context
function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

// Usage
function ThemedButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                backgroundColor: theme === 'light' ? '#fff' : '#333',
                color: theme === 'light' ? '#333' : '#fff'
            }}
        >
            Toggle Theme
        </button>
    );
}

function App() {
    return (
        <ThemeProvider>
            <ThemedButton />
        </ThemeProvider>
    );
}
```

### **Class Components:**

```jsx
import React, { Component } from 'react';

class Welcome extends Component {
    render() {
        return <h1>Hello, {this.props.name}!</h1>;
    }
}
```

### **Component Composition:**

```jsx
// Parent component
function App() {
    return (
        <div>
            <Welcome name="John" />
            <Welcome name="Jane" />
            <Welcome name="Bob" />
        </div>
    );
}

// Child component
function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
}
```

## **5. Props**

### **Passing Props:**

```jsx
// Passing props to components
function App() {
    return <Welcome name="John" age={30} isActive={true} />;
}

// Receiving props
function Welcome(props) {
    return (
        <div>
            <h1>Hello, {props.name}!</h1>
            <p>Age: {props.age}</p>
            <p>Status: {props.isActive ? 'Active' : 'Inactive'}</p>
        </div>
    );
}
```

### **Default Props:**

```jsx
// Function component default props
function Welcome({ name = 'Guest', age = 18 }) {
    return <h1>Hello, {name}! You are {age} years old.</h1>;
}

// Class component default props
class Welcome extends React.Component {
    static defaultProps = {
        name: 'Guest',
        age: 18
    };

    render() {
        return <h1>Hello, {this.props.name}! You are {this.props.age} years old.</h1>;
    }
}
```

### **Prop Types (Type Checking):**

```bash
npm install prop-types
```

```jsx
import PropTypes from 'prop-types';

function Welcome(props) {
    return <h1>Hello, {props.name}!</h1>;
}

Welcome.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    isActive: PropTypes.bool,
    hobbies: PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func
};
```

## **6. State**

### **useState Hook:**

```jsx
import React, { useState } from 'react';

function Counter() {
    // Declare state variable
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
```

### **Multiple State Variables:**

```jsx
function UserForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(18);

    return (
        <form>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                placeholder="Age"
            />
        </form>
    );
}
```

### **State with Objects:**

```jsx
function UserProfile() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: 18
    });

    const updateUser = (field, value) => {
        setUser(prevUser => ({
            ...prevUser,
            [field]: value
        }));
    };

    return (
        <div>
            <input
                type="text"
                value={user.name}
                onChange={(e) => updateUser('name', e.target.value)}
                placeholder="Name"
            />
            <input
                type="email"
                value={user.email}
                onChange={(e) => updateUser('email', e.target.value)}
                placeholder="Email"
            />
        </div>
    );
}
```

## **7. Event Handling**

### **Basic Event Handling:**

```jsx
function Button() {
    const handleClick = () => {
        alert('Button clicked!');
    };

    return <button onClick={handleClick}>Click me</button>;
}
```

### **Event Object:**

```jsx
function Form() {
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Form submitted');
    };

    const handleChange = (event) => {
        console.log('Input value:', event.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### **Passing Arguments to Event Handlers:**

```jsx
function List() {
    const items = ['Apple', 'Banana', 'Orange'];

    const handleClick = (item, index) => {
        console.log(`Clicked ${item} at index ${index}`);
    };

    return (
        <ul>
            {items.map((item, index) => (
                <li key={item}>
                    <button onClick={() => handleClick(item, index)}>
                        {item}
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

## **8. Conditional Rendering**

### **If-Else Rendering:**

```jsx
function Greeting(props) {
    if (props.isLoggedIn) {
        return <h1>Welcome back!</h1>;
    } else {
        return <h1>Please sign in.</h1>;
    }
}
```

### **Ternary Operator:**

```jsx
function Greeting(props) {
    return (
        <div>
            {props.isLoggedIn ? (
                <h1>Welcome back!</h1>
            ) : (
                <h1>Please sign in.</h1>
            )}
        </div>
    );
}
```

### **Logical AND Operator:**

```jsx
function Mailbox(props) {
    return (
        <div>
            <h1>Hello!</h1>
            {props.unreadMessages.length > 0 && (
                <h2>You have {props.unreadMessages.length} unread messages.</h2>
            )}
        </div>
    );
}
```

### **Conditional Styling:**

```jsx
function Button({ isActive }) {
    return (
        <button
            style={{
                backgroundColor: isActive ? 'blue' : 'gray',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px'
            }}
        >
            {isActive ? 'Active' : 'Inactive'}
        </button>
    );
}
```

## **9. Lists and Keys**

### **Rendering Lists:**

```jsx
function NumberList(props) {
    const numbers = props.numbers;

    return (
        <ul>
            {numbers.map((number) => (
                <li key={number.toString()}>
                    {number}
                </li>
            ))}
        </ul>
    );
}
```

### **Keys:**

```jsx
// Good: Using unique IDs
const todoItems = todos.map((todo) =>
    <li key={todo.id}>
        {todo.text}
    </li>
);

// Good: Using array index (only if items don't change order)
const todoItems = todos.map((todo, index) =>
    <li key={index}>
        {todo.text}
    </li>
);

// Bad: No key (causes warnings)
const todoItems = todos.map((todo) =>
    <li>
        {todo.text}
    </li>
);
```

### **List with Components:**

```jsx
function TodoList({ todos }) {
    return (
        <ul>
            {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </ul>
    );
}

function TodoItem({ todo }) {
    return <li>{todo.text}</li>;
}
```

## **10. Forms**

### **Controlled Components:**

```jsx
function NameForm() {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert('A name was submitted: ' + value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={value} onChange={handleChange} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
}
```

### **Multiple Input Form:**

```jsx
function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### **Select Dropdown:**

```jsx
function FlavorForm() {
    const [value, setValue] = useState('coconut');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert('Your favorite flavor is: ' + value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Pick your favorite flavor:
                <select value={value} onChange={handleChange}>
                    <option value="grapefruit">Grapefruit</option>
                    <option value="lime">Lime</option>
                    <option value="coconut">Coconut</option>
                    <option value="mango">Mango</option>
                </select>
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
}
```

## **11. Code Examples**

### **Example 1: Complete To-Do Application**

```jsx
import React, { useState } from 'react';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const addTodo = (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            setTodos([...todos, {
                id: Date.now(),
                text: inputValue,
                completed: false
            }]);
            setInputValue('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="App">
            <h1>To-Do List</h1>
            <form onSubmit={addTodo}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a new task..."
                />
                <button type="submit">Add</button>
            </form>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <span onClick={() => toggleTodo(todo.id)}>
                            {todo.text}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
```

```css
/* App.css */
.App {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

h1 {
    text-align: center;
    color: #333;
}

form {
    display: flex;
    margin-bottom: 20px;
}

input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
}

button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #45a049;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
}

li.completed {
    text-decoration: line-through;
    opacity: 0.6;
}

li span {
    flex: 1;
    cursor: pointer;
}

li button {
    background-color: #f44336;
    border-radius: 4px;
    margin-left: 10px;
}

li button:hover {
    background-color: #da190b;
}
```

### **Example 2: User Profile Card**

```jsx
import React, { useState } from 'react';

function UserProfile({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: user.name,
        email: user.email,
        bio: user.bio
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Here you would typically save to a backend
        console.log('Saving user data:', editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({
            name: user.name,
            email: user.email,
            bio: user.bio
        });
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="user-profile">
            <div className="profile-header">
                <img src={user.avatar} alt={user.name} className="avatar" />
                <div className="user-info">
                    {isEditing ? (
                        <div>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Name"
                            />
                            <input
                                type="email"
                                value={editData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="Email"
                            />
                        </div>
                    ) : (
                        <div>
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-bio">
                {isEditing ? (
                    <textarea
                        value={editData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows="4"
                    />
                ) : (
                    <p>{user.bio}</p>
                )}
            </div>

            <div className="profile-actions">
                {isEditing ? (
                    <div>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={handleEdit}>Edit Profile</button>
                )}
            </div>
        </div>
    );
}

// Usage
function App() {
    const user = {
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'I am a software developer passionate about React and web development.',
        avatar: 'https://via.placeholder.com/100'
    };

    return <UserProfile user={user} />;
}

export default App;
```

### **Example 3: Product Catalog**

```jsx
import React, { useState } from 'react';

function ProductCard({ product, onAddToCart }) {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="description">{product.description}</p>
            <button onClick={() => onAddToCart(product)}>
                Add to Cart
            </button>
        </div>
    );
}

function ProductList({ products, onAddToCart }) {
    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}

function ShoppingCart({ cart, onRemoveFromCart }) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="shopping-cart">
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <span>{item.name}</span>
                            <span>${item.price}</span>
                            <button onClick={() => onRemoveFromCart(item.id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <div className="cart-total">
                        <strong>Total: ${total.toFixed(2)}</strong>
                    </div>
                </div>
            )}
        </div>
    );
}

function App() {
    const [cart, setCart] = useState([]);

    const products = [
        {
            id: 1,
            name: 'Laptop',
            price: 999.99,
            description: 'High-performance laptop for work and gaming',
            image: 'https://via.placeholder.com/200x150'
        },
        {
            id: 2,
            name: 'Smartphone',
            price: 699.99,
            description: 'Latest smartphone with advanced features',
            image: 'https://via.placeholder.com/200x150'
        },
        {
            id: 3,
            name: 'Headphones',
            price: 199.99,
            description: 'Wireless headphones with noise cancellation',
            image: 'https://via.placeholder.com/200x150'
        }
    ];

    const addToCart = (product) => {
        setCart(prevCart => [...prevCart, product]);
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    return (
        <div className="App">
            <h1>Product Catalog</h1>
            <div className="container">
                <ProductList products={products} onAddToCart={addToCart} />
                <ShoppingCart cart={cart} onRemoveFromCart={removeFromCart} />
            </div>
        </div>
    );
}

export default App;
```

## **12. Assignments and Projects**

### **Assignment 9.1: Component Creation**
Create various React components that demonstrate:
- Function and class components
- Props passing and validation
- State management
- Event handling
- Conditional rendering

### **Assignment 9.2: Form Handling**
Build forms with different input types:
- Text inputs with validation
- Select dropdowns
- Radio buttons and checkboxes
- File uploads
- Form submission handling

### **Project 9: Personal Portfolio**
Create a personal portfolio website with:
- Navigation between sections
- About section with personal information
- Skills showcase
- Project gallery
- Contact form
- Responsive design

### **Challenge Project: Weather Dashboard**
Build a weather dashboard that:
- Fetches weather data from an API
- Displays current weather and forecast
- Allows searching for different cities
- Shows weather icons and animations
- Handles loading and error states

## **13. Best Practices**

### **Component Design:**
- Keep components small and focused
- Use meaningful names
- Follow single responsibility principle
- Use composition over inheritance
- Document component props and behavior

### **State Management:**
- Lift state up when needed
- Use appropriate state granularity
- Avoid unnecessary re-renders
- Use useCallback and useMemo for optimization
- Consider state management libraries for complex apps

### **Performance:**
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images and assets
- Use code splitting
- Monitor bundle size

### **Code Quality:**
- Use ESLint and Prettier
- Write meaningful tests
- Follow consistent naming conventions
- Add proper error boundaries
- Document your code

## **14. Common Patterns**

### **Container/Presentational Pattern:**

```jsx
// Presentational component (dumb)
function UserList({ users, onUserClick }) {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id} onClick={() => onUserClick(user)}>
                    {user.name}
                </li>
            ))}
        </ul>
    );
}

// Container component (smart)
function UserListContainer() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers().then(users => {
            setUsers(users);
            setLoading(false);
        });
    }, []);

    const handleUserClick = (user) => {
        console.log('Clicked user:', user);
    };

    if (loading) return <div>Loading...</div>;

    return <UserList users={users} onUserClick={handleUserClick} />;
}
```

### **Higher-Order Components (HOC):**

```jsx
function withLoading(Component) {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (isLoading) return <div>Loading...</div>;
        return <Component {...props} />;
    };
}

// Usage
const UserListWithLoading = withLoading(UserList);
```

### **Render Props Pattern:**

```jsx
function DataProvider({ render }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData().then(data => {
            setData(data);
            setLoading(false);
        });
    }, []);

    return render({ data, loading });
}

// Usage
<DataProvider render={({ data, loading }) => (
    loading ? <div>Loading...</div> : <UserList users={data} />
)} />
```

## **15. Advanced React Patterns and Performance**

### **Advanced Hooks and Custom Hooks**

#### **useReducer for Complex State Logic**
```jsx
// Reducer function
function todoReducer(state, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, {
                    id: Date.now(),
                    text: action.payload,
                    completed: false
                }]
            };
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            };
        case 'SET_FILTER':
            return {
                ...state,
                filter: action.payload
            };
        default:
            return state;
    }
}

// Custom hook using useReducer
function useTodos() {
    const [state, dispatch] = useReducer(todoReducer, {
        todos: [],
        filter: 'all'
    });

    const addTodo = (text) => {
        dispatch({ type: 'ADD_TODO', payload: text });
    };

    const toggleTodo = (id) => {
        dispatch({ type: 'TOGGLE_TODO', payload: id });
    };

    const deleteTodo = (id) => {
        dispatch({ type: 'DELETE_TODO', payload: id });
    };

    const setFilter = (filter) => {
        dispatch({ type: 'SET_FILTER', payload: filter });
    };

    const filteredTodos = useMemo(() => {
        switch (state.filter) {
            case 'active':
                return state.todos.filter(todo => !todo.completed);
            case 'completed':
                return state.todos.filter(todo => todo.completed);
            default:
                return state.todos;
        }
    }, [state.todos, state.filter]);

    return {
        todos: filteredTodos,
        filter: state.filter,
        addTodo,
        toggleTodo,
        deleteTodo,
        setFilter
    };
}

// Usage
function TodoApp() {
    const {
        todos,
        filter,
        addTodo,
        toggleTodo,
        deleteTodo,
        setFilter
    } = useTodos();

    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addTodo(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="todo-app">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a todo..."
                />
                <button type="submit">Add</button>
            </form>

            <div className="filters">
                {['all', 'active', 'completed'].map(filterType => (
                    <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={filter === filterType ? 'active' : ''}
                    >
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                ))}
            </div>

            <ul className="todo-list">
                {todos.map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                        <span>{todo.text}</span>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

#### **useImperativeHandle for Component API**
```jsx
// Child component exposing imperative API
const FancyInput = React.forwardRef((props, ref) => {
    const inputRef = useRef();

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current.focus();
        },
        blur: () => {
            inputRef.current.blur();
        },
        getValue: () => {
            return inputRef.current.value;
        },
        setValue: (value) => {
            inputRef.current.value = value;
        },
        shake: () => {
            inputRef.current.style.animation = 'shake 0.5s';
            setTimeout(() => {
                inputRef.current.style.animation = '';
            }, 500);
        }
    }));

    return (
        <input
            ref={inputRef}
            type="text"
            className="fancy-input"
            {...props}
        />
    );
});

// Parent component using the imperative API
function Form() {
    const inputRef = useRef();

    const handleFocus = () => {
        inputRef.current.focus();
    };

    const handleShake = () => {
        inputRef.current.shake();
    };

    const handleGetValue = () => {
        console.log('Current value:', inputRef.current.getValue());
    };

    const handleSetValue = () => {
        inputRef.current.setValue('Hello World!');
    };

    return (
        <div>
            <FancyInput ref={inputRef} placeholder="Type something..." />
            <div className="buttons">
                <button onClick={handleFocus}>Focus</button>
                <button onClick={handleShake}>Shake</button>
                <button onClick={handleGetValue}>Get Value</button>
                <button onClick={handleSetValue}>Set Value</button>
            </div>
        </div>
    );
}
```

#### **useLayoutEffect vs useEffect**
```jsx
// useLayoutEffect runs synchronously after DOM mutations
function Modal({ isOpen, children }) {
    const modalRef = useRef();

    useLayoutEffect(() => {
        if (isOpen) {
            // Measure the modal content
            const rect = modalRef.current.getBoundingClientRect();
            console.log('Modal dimensions:', rect);

            // Center the modal
            modalRef.current.style.left = `calc(50% - ${rect.width / 2}px)`;
            modalRef.current.style.top = `calc(50% - ${rect.height / 2}px)`;
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div ref={modalRef} className="modal">
            {children}
        </div>,
        document.body
    );
}

// useEffect runs asynchronously after render
function DataFetcher({ url }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url);
                const result = await response.json();
                if (isMounted) {
                    setData(result);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Fetch error:', error);
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [url]);

    if (loading) return <div>Loading...</div>;
    return <div>{JSON.stringify(data)}</div>;
}
```

#### **useDeferredValue for Non-Urgent Updates**
```jsx
// Expensive component that might cause UI blocking
function ExpensiveList({ items, query }) {
    const deferredQuery = useDeferredValue(query);

    const filteredItems = useMemo(() => {
        // Expensive filtering operation
        return items.filter(item =>
            item.name.toLowerCase().includes(deferredQuery.toLowerCase())
        );
    }, [items, deferredQuery]);

    return (
        <ul>
            {filteredItems.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}

// Parent component
function SearchApp() {
    const [query, setQuery] = useState('');
    const [items] = useState(
        Array.from({ length: 10000 }, (_, i) => ({
            id: i,
            name: `Item ${i}`
        }))
    );

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items..."
            />
            <ExpensiveList items={items} query={query} />
        </div>
    );
}
```

#### **useTransition for Concurrent Features**
```jsx
function SearchApp() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (searchQuery) => {
        setQuery(searchQuery);

        // Mark this as a non-urgent update
        startTransition(() => {
            // Expensive search operation
            const searchResults = performExpensiveSearch(searchQuery);
            setResults(searchResults);
        });
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
            />

            {isPending && <div className="loading">Searching...</div>}

            <div className="results">
                {results.map(result => (
                    <div key={result.id} className="result-item">
                        {result.title}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### **Advanced State Management Patterns**

#### **Zustand for Lightweight State Management**
```jsx
// Store definition
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
    devtools(
        persist(
            (set, get) => ({
                // State
                user: null,
                todos: [],
                theme: 'light',

                // Actions
                setUser: (user) => set({ user }),
                addTodo: (todo) => set(state => ({
                    todos: [...state.todos, { ...todo, id: Date.now() }]
                })),
                toggleTodo: (id) => set(state => ({
                    todos: state.todos.map(todo =>
                        todo.id === id
                            ? { ...todo, completed: !todo.completed }
                            : todo
                    )
                })),
                deleteTodo: (id) => set(state => ({
                    todos: state.todos.filter(todo => todo.id !== id)
                })),
                setTheme: (theme) => set({ theme }),

                // Computed properties
                get completedTodos() {
                    return get().todos.filter(todo => todo.completed);
                },

                get activeTodos() {
                    return get().todos.filter(todo => !todo.completed);
                }
            }),
            {
                name: 'app-storage',
                partialize: (state) => ({
                    theme: state.theme,
                    user: state.user
                })
            }
        ),
        { name: 'app-store' }
    )
);

// Usage in components
function TodoApp() {
    const {
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        completedTodos,
        activeTodos
    } = useStore();

    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addTodo({ text: inputValue.trim(), completed: false });
            setInputValue('');
        }
    };

    return (
        <div>
            <h2>Active: {activeTodos.length}, Completed: {completedTodos.length}</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add todo..."
                />
                <button type="submit">Add</button>
            </form>

            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                        <span style={{
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }}>
                            {todo.text}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ThemeToggle() {
    const { theme, setTheme } = useStore();

    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Toggle to {theme === 'light' ? 'dark' : 'light'} theme
        </button>
    );
}
```

#### **Recoil for Complex State Management**
```jsx
// Atoms
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

const userState = atom({
    key: 'userState',
    default: null,
});

const todosState = atom({
    key: 'todosState',
    default: [],
});

const todoFilterState = atom({
    key: 'todoFilterState',
    default: 'all',
});

// Selectors
const filteredTodosState = selector({
    key: 'filteredTodosState',
    get: ({ get }) => {
        const todos = get(todosState);
        const filter = get(todoFilterState);

        switch (filter) {
            case 'completed':
                return todos.filter(todo => todo.completed);
            case 'active':
                return todos.filter(todo => !todo.completed);
            default:
                return todos;
        }
    },
});

const todoStatsState = selector({
    key: 'todoStatsState',
    get: ({ get }) => {
        const todos = get(todosState);
        const completed = todos.filter(todo => todo.completed).length;
        const active = todos.length - completed;

        return { total: todos.length, completed, active };
    },
});

// Async selectors
const userProfileState = selector({
    key: 'userProfileState',
    get: async ({ get }) => {
        const user = get(userState);
        if (!user) return null;

        try {
            const response = await fetch(`/api/users/${user.id}/profile`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    },
});

// Usage
function TodoApp() {
    const [todos, setTodos] = useRecoilState(todosState);
    const [filter, setFilter] = useRecoilState(todoFilterState);
    const filteredTodos = useRecoilValue(filteredTodosState);
    const stats = useRecoilValue(todoStatsState);

    const addTodo = (text) => {
        setTodos(prev => [...prev, {
            id: Date.now(),
            text,
            completed: false
        }]);
    };

    const toggleTodo = (id) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    return (
        <div>
            <div className="stats">
                Total: {stats.total}, Active: {stats.active}, Completed: {stats.completed}
            </div>

            <div className="filters">
                {['all', 'active', 'completed'].map(filterType => (
                    <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={filter === filterType ? 'active' : ''}
                    >
                        {filterType}
                    </button>
                ))}
            </div>

            <TodoList todos={filteredTodos} onToggle={toggleTodo} />
            <AddTodo onAdd={addTodo} />
        </div>
    );
}

function UserProfile() {
    const userProfile = useRecoilValue(userProfileState);

    if (!userProfile) return <div>No user profile</div>;

    return (
        <div>
            <h2>{userProfile.name}</h2>
            <p>{userProfile.bio}</p>
        </div>
    );
}
```

### **Server-Side Rendering and Static Generation**

#### **Next.js App Router (Modern)**
```jsx
// app/layout.js
import './globals.css';

export const metadata = {
    title: 'My App',
    description: 'A modern web application',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <header>
                    <nav>
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                        <Link href="/posts">Posts</Link>
                    </nav>
                </header>
                <main>{children}</main>
                <footer>© 2024 My App</footer>
            </body>
        </html>
    );
}

// app/page.js
import Link from 'next/link';

export default function HomePage() {
    return (
        <div>
            <h1>Welcome to My App</h1>
            <p>This is the home page.</p>
            <Link href="/posts">View Posts</Link>
        </div>
    );
}

// app/posts/page.js
import { getPosts } from '@/lib/posts';

export default async function PostsPage() {
    const posts = await getPosts();

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <Link href={`/posts/${post.id}`}>
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// app/posts/[id]/page.js
import { getPost } from '@/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const posts = await getPosts();

    return posts.map(post => ({
        id: post.id.toString(),
    }));
}

export async function generateMetadata({ params }) {
    const post = await getPost(params.id);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
    };
}

export default async function PostPage({ params }) {
    const post = await getPost(params.id);

    if (!post) {
        notFound();
    }

    return (
        <article>
            <h1>{post.title}</h1>
            <p className="date">{post.date}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
    );
}
```

#### **Remix for Web Standards**
```jsx
// app/root.jsx
import { Links, LiveReload, Meta, Outlet, Scripts } from '@remix-run/react';

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <header>
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/posts">Posts</Link>
                    </nav>
                </header>
                <main>
                    <Outlet />
                </main>
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

// app/routes/index.jsx
export default function Index() {
    return (
        <div>
            <h1>Welcome to Remix</h1>
            <p>This is a modern web application.</p>
        </div>
    );
}

// app/routes/posts.jsx
import { json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';

export async function loader() {
    const posts = await getPosts();
    return json({ posts });
}

export default function Posts() {
    const { posts } = useLoaderData();

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <Link to={`/posts/${post.id}`}>
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// app/routes/posts.$id.jsx
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader({ params }) {
    const post = await getPost(params.id);

    if (!post) {
        throw new Response('Not Found', { status: 404 });
    }

    return json({ post });
}

export default function Post() {
    const { post } = useLoaderData();

    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.date}</p>
            <div>{post.content}</div>
        </article>
    );
}
```

### **Testing Advanced React Components**

#### **Testing Custom Hooks**
```jsx
// hooks/useCounter.js
import { useState, useCallback } from 'react';

function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue);

    const increment = useCallback(() => {
        setCount(prev => prev + 1);
    }, []);

    const decrement = useCallback(() => {
        setCount(prev => prev - 1);
    }, []);

    const reset = useCallback(() => {
        setCount(initialValue);
    }, [initialValue]);

    const setValue = useCallback((value) => {
        setCount(value);
    }, []);

    return {
        count,
        increment,
        decrement,
        reset,
        setValue
    };
}

export default useCounter;

// hooks/__tests__/useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import useCounter from '../useCounter';

describe('useCounter', () => {
    test('should initialize with default value', () => {
        const { result } = renderHook(() => useCounter());
        expect(result.current.count).toBe(0);
    });

    test('should initialize with custom value', () => {
        const { result } = renderHook(() => useCounter(10));
        expect(result.current.count).toBe(10);
    });

    test('should increment count', () => {
        const { result } = renderHook(() => useCounter());

        act(() => {
            result.current.increment();
        });

        expect(result.current.count).toBe(1);
    });

    test('should decrement count', () => {
        const { result } = renderHook(() => useCounter(5));

        act(() => {
            result.current.decrement();
        });

        expect(result.current.count).toBe(4);
    });

    test('should reset to initial value', () => {
        const { result } = renderHook(() => useCounter(10));

        act(() => {
            result.current.increment();
            result.current.reset();
        });

        expect(result.current.count).toBe(10);
    });

    test('should set specific value', () => {
        const { result } = renderHook(() => useCounter());

        act(() => {
            result.current.setValue(42);
        });

        expect(result.current.count).toBe(42);
    });
});
```

#### **Testing Context Providers**
```jsx
// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                return { success: true };
            } else {
                return { success: false, error: 'Login failed' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

// context/__tests__/AuthContext.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock fetch
global.fetch = jest.fn();

function TestComponent() {
    const { user, loading, isAuthenticated, login, logout } = useAuth();

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div data-testid="auth-status">
                {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
            </div>
            {user && <div data-testid="user-name">{user.name}</div>}
            <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
                Login
            </button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

describe('AuthContext', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('should show loading initially', () => {
        fetch.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve({ name: 'John Doe' })
            }), 100))
        );

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should authenticate user on successful API call', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ name: 'John Doe', id: 1 })
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
            expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
        });
    });

    test('should handle login', async () => {
        fetch
            .mockResolvedValueOnce({
                ok: false // Initial auth check fails
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ name: 'John Doe', id: 1 })
            });

        const { user } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
        });

        const loginButton = screen.getByText('Login');
        loginButton.click();

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
        });
    });
});
```

## **16. Resources**

- [React Official Documentation](https://reactjs.org/docs/)
- [React Hooks Reference](https://reactjs.org/docs/hooks-reference.html)
- [Create React App](https://create-react-app.dev/)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Next.js Documentation](https://nextjs.org/docs/)
- [Remix Documentation](https://remix.run/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [Recoil Documentation](https://recoiljs.org/docs/introduction/getting-started/)

## **17. Next Steps**

In the next lesson, we'll explore React Hooks in depth. You'll learn about:
- useEffect for side effects
- useContext for state sharing
- Custom hooks creation
- Advanced hook patterns
- Performance optimization with hooks

Practice building React components and experiment with different patterns to strengthen your frontend development skills!

---

This comprehensive React documentation covers everything from basic components to advanced patterns, modern hooks, state management, server-side rendering, and testing strategies. The examples are production-ready and follow current best practices for professional React development.

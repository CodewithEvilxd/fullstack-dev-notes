### **Lesson 10: React Hooks - Advanced State Management**

## **1. Introduction to React Hooks**

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 as an alternative to class components, allowing you to use state and other React features without writing classes.

### **Why Hooks?**

- **Simpler Code:** No need for class components and `this` binding
- **Reusable Logic:** Custom hooks allow code reuse across components
- **Better Performance:** Smaller bundle size and better tree-shaking
- **Easier Testing:** Hooks are easier to test than class methods
- **Better Composition:** Hooks compose better than higher-order components

### **Rules of Hooks:**

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call them from React function components or custom hooks
3. **Hook names always start with "use"** - This is a convention for custom hooks

#### **Additional Rules and Best Practices:**
4. **Hooks must be called in the same order** - Every render should call hooks in the same sequence
5. **Don't call hooks from regular JavaScript functions** - Only from React components or custom hooks
6. **Use ESLint rules** - Install `eslint-plugin-react-hooks` for automatic rule enforcement
7. **Custom hooks can call other hooks** - But follow the same rules
8. **Hooks are not classes** - Don't try to use class lifecycle methods with hooks

## **2. useState Hook**

### **Basic Usage:**

```jsx
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
```

### **State with Objects:**

```jsx
function UserForm() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: 18
    });

    const updateField = (field, value) => {
        setUser(prevUser => ({
            ...prevUser,
            [field]: value
        }));
    };

    return (
        <form>
            <input
                type="text"
                value={user.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Name"
            />
            <input
                type="email"
                value={user.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Email"
            />
            <input
                type="number"
                value={user.age}
                onChange={(e) => updateField('age', parseInt(e.target.value))}
                placeholder="Age"
            />
        </form>
    );
}
```

### **State with Arrays:**

```jsx
function TodoList() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const addTodo = () => {
        if (inputValue.trim()) {
            setTodos(prevTodos => [
                ...prevTodos,
                {
                    id: Date.now(),
                    text: inputValue,
                    completed: false
                }
            ]);
            setInputValue('');
        }
    };

    const toggleTodo = (id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a todo"
            />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <span
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                            onClick={() => toggleTodo(todo.id)}
                        >
                            {todo.text}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

### **Lazy Initial State:**

```jsx
function ExpensiveComponent() {
    // Only called on first render
    const [count, setCount] = useState(() => {
        console.log('Computing initial state...');
        return expensiveComputation();
    });

    return <div>Count: {count}</div>;
}
```

## **3. useEffect Hook**

### **Basic Usage:**

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
    const [count, setCount] = useState(0);

    // Runs after every render
    useEffect(() => {
        document.title = `Count: ${count}`;
    });

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
```

### **Effect with Cleanup:**

```jsx
function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);

        // Cleanup function
        return () => {
            clearInterval(interval);
        };
    }, []); // Empty dependency array means run only once

    return <div>Seconds: {seconds}</div>;
}
```

### **Conditional Effects:**

```jsx
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/users/${userId}`);
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]); // Re-run when userId changes

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    return <div>Welcome, {user.name}!</div>;
}
```

### **Multiple Effects:**

```jsx
function ComplexComponent({ userId, theme }) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    // Effect for fetching user
    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);

    // Effect for fetching posts
    useEffect(() => {
        if (user) {
            fetchUserPosts(user.id).then(setPosts);
        }
    }, [user]);

    // Effect for theme changes
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            // Cleanup code here
        };
    }, []);
}
```

## **4. useContext Hook**

### **Creating Context:**

```jsx
import React, { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook for using theme
function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
```

### **Using Context in Components:**

```jsx
function ThemedButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            style={{
                backgroundColor: theme === 'light' ? '#fff' : '#333',
                color: theme === 'light' ? '#333' : '#fff'
            }}
            onClick={toggleTheme}
        >
            Toggle Theme
        </button>
    );
}

function App() {
    return (
        <ThemeProvider>
            <div>
                <h1>My App</h1>
                <ThemedButton />
            </div>
        </ThemeProvider>
    );
}
```

## **5. useReducer Hook**

### **Basic Reducer:**

```jsx
import React, { useReducer } from 'react';

// Reducer function
function counterReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        case 'RESET':
            return { count: 0 };
        case 'SET':
            return { count: action.payload };
        default:
            return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(counterReducer, { count: 0 });

    return (
        <div>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>
                Increment
            </button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>
                Decrement
            </button>
            <button onClick={() => dispatch({ type: 'RESET' })}>
                Reset
            </button>
            <button onClick={() => dispatch({ type: 'SET', payload: 10 })}>
                Set to 10
            </button>
        </div>
    );
}
```

### **Complex State with useReducer:**

```jsx
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

function TodoApp() {
    const [state, dispatch] = useReducer(todoReducer, {
        todos: [],
        filter: 'all'
    });

    const filteredTodos = state.todos.filter(todo => {
        if (state.filter === 'completed') return todo.completed;
        if (state.filter === 'active') return !todo.completed;
        return true;
    });

    return (
        <div>
            <input
                type="text"
                placeholder="Add todo"
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        dispatch({ type: 'ADD_TODO', payload: e.target.value });
                        e.target.value = '';
                    }
                }}
            />
            <div>
                <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}>
                    All
                </button>
                <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}>
                    Active
                </button>
                <button onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}>
                    Completed
                </button>
            </div>
            <ul>
                {filteredTodos.map(todo => (
                    <li key={todo.id}>
                        <span
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                            onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                        >
                            {todo.text}
                        </span>
                        <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

## **6. useCallback and useMemo Hooks**

### **useCallback:**

```jsx
import React, { useState, useCallback } from 'react';

function ParentComponent() {
    const [count, setCount] = useState(0);
    const [todos, setTodos] = useState([]);

    // Without useCallback, this function is recreated on every render
    const addTodo = useCallback(() => {
        setTodos(prevTodos => [...prevTodos, `Todo ${prevTodos.length + 1}`]);
    }, []); // Empty dependency array means function is stable

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>
                Count: {count}
            </button>
            <TodoList todos={todos} addTodo={addTodo} />
        </div>
    );
}

function TodoList({ todos, addTodo }) {
    console.log('TodoList rendered');
    return (
        <div>
            <button onClick={addTodo}>Add Todo</button>
            {todos.map((todo, index) => <div key={index}>{todo}</div>)}
        </div>
    );
}
```

### **useMemo:**

```jsx
import React, { useState, useMemo } from 'react';

function ExpensiveCalculation({ numbers }) {
    // Without useMemo, this calculation runs on every render
    const sum = useMemo(() => {
        console.log('Calculating sum...');
        return numbers.reduce((acc, num) => acc + num, 0);
    }, [numbers]); // Only recalculate when numbers change

    return <div>Sum: {sum}</div>;
}

function App() {
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
    const [count, setCount] = useState(0);

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>
                Re-render count: {count}
            </button>
            <ExpensiveCalculation numbers={numbers} />
        </div>
    );
}
```

## **7. useRef Hook and Advanced Refs**

### **Basic Usage:**

```jsx
import React, { useRef, useEffect } from 'react';

function TextInput() {
    const inputRef = useRef(null);

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
```

### **Storing Mutable Values:**

```jsx
function Timer() {
    const [count, setCount] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCount(prevCount => prevCount + 1);
        }, 1000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    const stopTimer = () => {
        clearInterval(intervalRef.current);
    };

    return (
        <div>
            <div>Count: {count}</div>
            <button onClick={stopTimer}>Stop Timer</button>
        </div>
    );
}
```

### **useImperativeHandle for Custom Refs:**

```jsx
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

// Child component that exposes imperative methods
const FancyInput = forwardRef((props, ref) => {
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
            <div>
                <button onClick={handleFocus}>Focus</button>
                <button onClick={handleShake}>Shake</button>
                <button onClick={handleGetValue}>Get Value</button>
                <button onClick={handleSetValue}>Set Value</button>
            </div>
        </div>
    );
}
```

### **useLayoutEffect for DOM Measurements:**

```jsx
import React, { useLayoutEffect, useRef, useState } from 'react';

function ResizableBox() {
    const boxRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const updateDimensions = () => {
            if (boxRef.current) {
                const { width, height } = boxRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        updateDimensions();

        // Update dimensions on window resize
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    return (
        <div>
            <div
                ref={boxRef}
                style={{
                    width: '200px',
                    height: '200px',
                    backgroundColor: 'lightblue',
                    border: '1px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {dimensions.width} x {dimensions.height}
            </div>
        </div>
    );
}

// Measuring element before paint
function MeasureBeforePaint() {
    const [height, setHeight] = useState(0);
    const elementRef = useRef();

    useLayoutEffect(() => {
        if (elementRef.current) {
            setHeight(elementRef.current.offsetHeight);
        }
    });

    return (
        <div>
            <div ref={elementRef}>
                <h1>This is a heading</h1>
                <p>This is some content that might wrap to multiple lines.</p>
            </div>
            <p>Element height: {height}px</p>
        </div>
    );
}
```

### **useDeferredValue for Non-Urgent Updates:**

```jsx
import React, { useState, useDeferredValue, useMemo } from 'react';

// Expensive component that filters a large list
function ExpensiveList({ query, items }) {
    const deferredQuery = useDeferredValue(query);

    const filteredItems = useMemo(() => {
        // Expensive filtering operation
        return items.filter(item =>
            item.name.toLowerCase().includes(deferredQuery.toLowerCase())
        );
    }, [deferredQuery, items]);

    return (
        <div>
            <h3>Filtered Results ({filteredItems.length})</h3>
            <ul>
                {filteredItems.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}

// Main component with search
function SearchApp() {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    // Large dataset
    const items = useMemo(() => {
        return Array.from({ length: 10000 }, (_, i) => ({
            id: i,
            name: `Item ${i}`
        }));
    }, []);

    const isStale = query !== deferredQuery;

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items..."
            />
            {isStale && <div style={{ color: 'orange' }}>Updating...</div>}
            <ExpensiveList query={deferredQuery} items={items} />
        </div>
    );
}
```

### **useTransition for Concurrent Features:**

```jsx
import React, { useState, useTransition, Suspense } from 'react';

// Simulate slow data loading
function fetchSlowData(query) {
    return new Promise(resolve => {
        setTimeout(() => {
            const results = Array.from({ length: 100 }, (_, i) => ({
                id: i,
                name: `${query} result ${i}`
            }));
            resolve(results);
        }, 1000);
    });
}

function SearchResults({ query }) {
    const [results, setResults] = useState([]);

    React.useEffect(() => {
        let isMounted = true;
        fetchSlowData(query).then(data => {
            if (isMounted) setResults(data);
        });
        return () => { isMounted = false; };
    }, [query]);

    return (
        <ul>
            {results.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}

function SearchApp() {
    const [query, setQuery] = useState('');
    const [deferredQuery, setDeferredQuery] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        // Mark this update as non-urgent
        startTransition(() => {
            setDeferredQuery(value);
        });
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search..."
            />
            {isPending && <div style={{ color: 'blue' }}>Loading...</div>}
            <Suspense fallback={<div>Loading results...</div>}>
                <SearchResults query={deferredQuery} />
            </Suspense>
        </div>
    );
}
```

### **useId for Unique IDs:**

```jsx
import React, { useId } from 'react';

function FormField({ label, type = 'text' }) {
    const id = useId();

    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input id={id} type={type} />
        </div>
    );
}

function ContactForm() {
    return (
        <form>
            <FormField label="Name" />
            <FormField label="Email" type="email" />
            <FormField label="Phone" type="tel" />
            <button type="submit">Submit</button>
        </form>
    );
}

// For accessibility and form associations
function AccessibleForm() {
    const nameId = useId();
    const emailId = useId();
    const descriptionId = useId();

    return (
        <form>
            <div>
                <label htmlFor={nameId}>Name:</label>
                <input id={nameId} type="text" />
            </div>
            <div>
                <label htmlFor={emailId}>Email:</label>
                <input id={emailId} type="email" />
            </div>
            <div>
                <label htmlFor={descriptionId}>Description:</label>
                <textarea id={descriptionId} />
            </div>
        </form>
    );
}
```

### **useSyncExternalStore for External State:**

```jsx
import React, { useSyncExternalStore } from 'react';

// Simple store implementation
let store = { count: 0, listeners: [] };

function subscribe(listener) {
    store.listeners.push(listener);
    return () => {
        store.listeners = store.listeners.filter(l => l !== listener);
    };
}

function getSnapshot() {
    return store.count;
}

function increment() {
    store.count += 1;
    store.listeners.forEach(listener => listener());
}

function decrement() {
    store.count -= 1;
    store.listeners.forEach(listener => listener());
}

// React component using external store
function Counter() {
    const count = useSyncExternalStore(subscribe, getSnapshot);

    return (
        <div>
            <h2>External Store Counter: {count}</h2>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
        </div>
    );
}

// Redux-like store integration
function createStore(reducer, initialState) {
    let state = initialState;
    let listeners = [];

    function subscribe(listener) {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }

    function getSnapshot() {
        return state;
    }

    function dispatch(action) {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    }

    return { subscribe, getSnapshot, dispatch };
}

// Usage with Redux-like store
const todoStore = createStore(todoReducer, { todos: [] });

function useStore(selector = state => state) {
    return useSyncExternalStore(
        todoStore.subscribe,
        () => selector(todoStore.getSnapshot())
    );
}

function TodoApp() {
    const todos = useStore(state => state.todos);
    const dispatch = todoStore.dispatch;

    return (
        <div>
            <button onClick={() => dispatch({ type: 'ADD_TODO', payload: 'New Todo' })}>
                Add Todo
            </button>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>{todo}</li>
                ))}
            </ul>
        </div>
    );
}
```

## **8. Custom Hooks**

### **Creating Custom Hooks:**

```jsx
// useLocalStorage hook
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

// Usage
function App() {
    const [name, setName] = useLocalStorage('name', 'John');

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </div>
    );
}
```

### **useFetch Hook:**

```jsx
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
    const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>Welcome, {user.name}!</div>;
}
```

### **useDebounce Hook:**

```jsx
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Usage
function SearchComponent() {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
        if (debouncedSearchTerm) {
            // Perform search
            console.log('Searching for:', debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    return (
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
        />
    );
}
```

## **9. Code Examples**

### **Example 1: Complete Todo App with Hooks**

```jsx
import React, { useState, useEffect, useCallback } from 'react';

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

function TodoApp() {
    const [todos, setTodos] = useLocalStorage('todos', []);
    const [filter, setFilter] = useState('all');
    const [inputValue, setInputValue] = useState('');

    const addTodo = useCallback(() => {
        if (inputValue.trim()) {
            const newTodo = {
                id: Date.now(),
                text: inputValue,
                completed: false,
                createdAt: new Date()
            };
            setTodos(prevTodos => [...prevTodos, newTodo]);
            setInputValue('');
        }
    }, [inputValue, setTodos]);

    const toggleTodo = useCallback((id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    }, [setTodos]);

    const deleteTodo = useCallback((id) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }, [setTodos]);

    const clearCompleted = useCallback(() => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    }, [setTodos]);

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const activeCount = todos.filter(todo => !todo.completed).length;

    return (
        <div className="todo-app">
            <h1>Todo App</h1>

            <div className="add-todo">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="What needs to be done?"
                />
                <button onClick={addTodo}>Add Todo</button>
            </div>

            <div className="filters">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All ({todos.length})
                </button>
                <button
                    className={filter === 'active' ? 'active' : ''}
                    onClick={() => setFilter('active')}
                >
                    Active ({activeCount})
                </button>
                <button
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => setFilter('completed')}
                >
                    Completed ({todos.length - activeCount})
                </button>
                {todos.length > activeCount && (
                    <button onClick={clearCompleted}>Clear Completed</button>
                )}
            </div>

            <ul className="todo-list">
                {filteredTodos.map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                        />
                        <span>{todo.text}</span>
                        <button onClick={() => deleteTodo(todo.id)}>×</button>
                    </li>
                ))}
            </ul>

            {todos.length === 0 && (
                <p className="empty-state">No todos yet. Add one above!</p>
            )}
        </div>
    );
}

export default TodoApp;
```

### **Example 2: Data Fetching with Custom Hooks**

```jsx
import React, { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls
function useApi(endpoint) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

// Custom hook for form handling
function useForm(initialValues) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (callback) => (e) => {
        e.preventDefault();
        const validationErrors = validateForm(values);
        if (Object.keys(validationErrors).length === 0) {
            callback(values);
        } else {
            setErrors(validationErrors);
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
        reset,
        setErrors
    };
}

function validateForm(values) {
    const errors = {};
    if (!values.name) errors.name = 'Name is required';
    if (!values.email) errors.email = 'Email is required';
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Email is invalid';
    }
    return errors;
}

// Main component
function UserManagement() {
    const { data: users, loading, error, refetch } = useApi('/api/users');
    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        reset
    } = useForm({ name: '', email: '' });

    const handleCreateUser = async (userData) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                reset();
                refetch(); // Refresh the user list
            } else {
                console.error('Failed to create user');
            }
        } catch (err) {
            console.error('Error creating user:', err);
        }
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="user-management">
            <h1>User Management</h1>

            <form onSubmit={handleSubmit(handleCreateUser)}>
                <div>
                    <input
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Name"
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div>
                    <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <button type="submit">Create User</button>
            </form>

            <h2>Users</h2>
            <ul>
                {users && users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserManagement;
```

### **Example 3: Real-time Chat with Hooks**

```jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Custom hook for WebSocket connection
function useWebSocket(url) {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [...prev, message]);
        };

        ws.onclose = () => {
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = useCallback((message) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    return { messages, isConnected, sendMessage };
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [key]);

    return [storedValue, setValue];
}

function ChatApp() {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useLocalStorage('chatUsername', '');
    const messagesEndRef = useRef(null);

    const { messages, isConnected, sendMessage } = useWebSocket('ws://localhost:8080');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && username.trim()) {
            sendMessage({
                type: 'message',
                username,
                text: message,
                timestamp: new Date().toISOString()
            });
            setMessage('');
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    return (
        <div className="chat-app">
            <div className="connection-status">
                Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>

            {!username && (
                <div className="username-setup">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={handleUsernameChange}
                        onKeyPress={(e) => e.key === 'Enter' && e.target.blur()}
                    />
                </div>
            )}

            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.username}:</strong> {msg.text}
                        <span className="timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!isConnected || !username}
                />
                <button
                    type="submit"
                    disabled={!isConnected || !username || !message.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default ChatApp;
```

## **10. Assignments and Projects**

### **Assignment 10.1: Hook Implementation**
Create components that demonstrate:
- useState with different data types
- useEffect with cleanup functions
- useContext for theme management
- useReducer for complex state
- Custom hooks for reusable logic

### **Assignment 10.2: Performance Optimization**
Build components that use:
- useCallback to prevent unnecessary re-renders
- useMemo for expensive calculations
- React.memo for component memoization
- Proper dependency arrays

### **Project 10: Advanced Todo Application**
Create a comprehensive todo app with:
- Multiple lists/categories
- Due dates and priorities
- Search and filtering
- Data persistence with localStorage
- Drag and drop functionality
- Real-time updates

### **Challenge Project: E-commerce Dashboard**
Build an admin dashboard with:
- Product management
- Order tracking
- User analytics
- Real-time notifications
- Data visualization
- Export functionality

## **11. Best Practices**

### **Hook Usage:**
- Always use hooks at the top level of components
- Don't call hooks inside loops or conditions
- Use custom hooks for reusable logic
- Keep hooks simple and focused
- Use proper dependency arrays

### **Performance:**
- Use useCallback for event handlers
- Use useMemo for expensive computations
- Avoid unnecessary re-renders
- Use React.memo when appropriate
- Profile performance with React DevTools

### **State Management:**
- Choose the right hook for the job
- Keep state as local as possible
- Use useReducer for complex state logic
- Consider context for global state
- Avoid prop drilling with context

## **12. Common Patterns**

### **Data Fetching Pattern:**

```jsx
function useData(endpoint) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(endpoint);
                const result = await response.json();

                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [endpoint]);

    return { data, loading, error };
}
```

### **Form Handling Pattern:**

```jsx
function useForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));

        if (touched[name] && validate) {
            const fieldErrors = validate({ [name]: value });
            setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
        }
    }, [touched, validate]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        if (validate) {
            const fieldErrors = validate(values);
            setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
        }
    }, [values, validate]);

    const handleSubmit = useCallback((onSubmit) => (e) => {
        e.preventDefault();

        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0) {
                onSubmit(values);
            }
        } else {
            onSubmit(values);
        }
    }, [values, validate]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        reset
    };
}
```

## **13. Resources**

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [React Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
- [Awesome React Hooks](https://github.com/rehooks/awesome-react-hooks)
- [useHooks](https://usehooks.com/)

## **14. Next Steps**

In the next lesson, we'll explore React Router for client-side routing. You'll learn about:
- Setting up routing in React apps
- Navigation between components
- Route parameters and queries
- Protected routes
- Nested routes

Practice using different hooks and creating custom hooks to strengthen your React development skills!

---

# Advanced React Guide - Hooks, Patterns & Optimization

## 1. Advanced Hooks Usage

### Custom Hooks - Building Reusable Logic
```jsx
// useLocalStorage hook
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', 'John');
  const [todos, setTodos] = useLocalStorage('todos', []);

  return (
    <div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

```jsx
// useAsync hook for API calls
import { useState, useEffect, useCallback } from 'react';

function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus('success');
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
      });
  }, [asyncFunction]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

// Usage
function UserProfile({ userId }) {
  const {
    execute: fetchUser,
    status,
    value: user,
    error
  } = useAsync(async () => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }, false); // Don't execute immediately

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  if (status === 'idle' || status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

```jsx
// useDebounce hook
import { useState, useEffect } from 'react';

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
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

```jsx
// usePrevious hook
import { useRef, useEffect } from 'react';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Advanced useEffect Patterns
```jsx
// useEffect with cleanup
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const connection = createConnection(roomId);
    connection.connect();

    connection.onMessage = (message) => {
      if (isMounted) {
        setMessages(prev => [...prev, message]);
      }
    };

    return () => {
      isMounted = false;
      connection.disconnect();
    };
  }, [roomId]);

  return <div>{/* Render messages */}</div>;
}

// Multiple effects
function MultiEffectComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Effect for count changes
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  // Effect for name changes
  useEffect(() => {
    console.log('Name changed to:', name);
  }, [name]);

  // Effect that runs on every render
  useEffect(() => {
    console.log('Component rendered');
  });

  // Effect with cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter name"
      />
    </div>
  );
}
```

### useReducer for Complex State
```jsx
// Complex state management with useReducer
const initialState = {
  todos: [],
  filter: 'all',
  loading: false,
  error: null
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'FETCH_TODOS_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_TODOS_SUCCESS':
      return {
        ...state,
        loading: false,
        todos: action.payload,
        error: null
      };

    case 'FETCH_TODOS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

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
      return { ...state, filter: action.payload };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    default:
      return state;
  }
}

// Custom hook using useReducer
function useTodos() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = useCallback(async () => {
    dispatch({ type: 'FETCH_TODOS_START' });
    try {
      const response = await fetch('/api/todos');
      const todos = await response.json();
      dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: todos });
    } catch (error) {
      dispatch({ type: 'FETCH_TODOS_ERROR', payload: error.message });
    }
  }, []);

  const addTodo = useCallback((text) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  }, []);

  const toggleTodo = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }, []);

  const deleteTodo = useCallback((id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  }, []);

  // Computed values
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

  const activeCount = useMemo(() => {
    return state.todos.filter(todo => !todo.completed).length;
  }, [state.todos]);

  return {
    // State
    todos: filteredTodos,
    filter: state.filter,
    loading: state.loading,
    error: state.error,
    activeCount,

    // Actions
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted
  };
}

// Usage
function TodoApp() {
  const {
    todos,
    filter,
    loading,
    error,
    activeCount,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted
  } = useTodos();

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="todo-app">
      <h1>Todos ({activeCount})</h1>

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
            {filterType}
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

      {todos.some(todo => todo.completed) && (
        <button onClick={clearCompleted}>Clear Completed</button>
      )}
    </div>
  );
}
```

## 2. Advanced React Patterns

### Render Props Pattern
```jsx
// Mouse tracker with render props
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  };

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// Usage
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <div>
          <h1>Mouse position:</h1>
          <p>X: {x}, Y: {y}</p>
        </div>
      )}
    />
  );
}

// Data fetching with render props
class DataFetcher extends React.Component {
  state = {
    data: null,
    loading: true,
    error: null
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.fetchData();
    }
  }

  async fetchData() {
    this.setState({ loading: true, error: null });

    try {
      const response = await fetch(this.props.url);
      const data = await response.json();
      this.setState({ data, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }

  render() {
    return this.props.render(this.state);
  }
}

// Usage
function UserProfile({ userId }) {
  return (
    <DataFetcher
      url={`/api/users/${userId}`}
      render={({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;
        return (
          <div>
            <h2>{data.name}</h2>
            <p>{data.email}</p>
          </div>
        );
      }}
    />
  );
}
```

### Compound Components Pattern
```jsx
// Compound components for tabs
const TabsContext = React.createContext();

function Tabs({ children, defaultActive = 0 }) {
  const [activeIndex, setActiveIndex] = React.useState(defaultActive);

  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = React.useContext(TabsContext);

  return (
    <button
      className={`tab ${activeIndex === index ? 'active' : ''}`}
      onClick={() => setActiveIndex(index)}
    >
      {children}
    </button>
  );
}

function TabPanel({ index, children }) {
  const { activeIndex } = React.useContext(TabsContext);

  if (activeIndex !== index) return null;

  return <div className="tab-panel">{children}</div>;
}

// Usage
function App() {
  return (
    <Tabs defaultActive={0}>
      <TabList>
        <Tab index={0}>Home</Tab>
        <Tab index={1}>Profile</Tab>
        <Tab index={2}>Settings</Tab>
      </TabList>

      <TabPanel index={0}>
        <h2>Home Content</h2>
        <p>Welcome to the home page!</p>
      </TabPanel>

      <TabPanel index={1}>
        <h2>Profile Content</h2>
        <p>This is your profile page.</p>
      </TabPanel>

      <TabPanel index={2}>
        <h2>Settings Content</h2>
        <p>Configure your settings here.</p>
      </TabPanel>
    </Tabs>
  );
}
```

### Higher-Order Components (HOC)
```jsx
// Authentication HOC
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      checkAuth();
    }, []);

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

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <div>Please log in to access this content.</div>;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}

// Data loading HOC
function withData(WrappedComponent, dataUrl) {
  return function DataComponent(props) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
      fetchData();
    }, []);

    const fetchData = async () => {
      try {
        const response = await fetch(dataUrl);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <WrappedComponent
        {...props}
        data={data}
        loading={loading}
        error={error}
        refetch={fetchData}
      />
    );
  };
}

// Theme HOC
const ThemeContext = React.createContext();

function withTheme(WrappedComponent) {
  return function ThemedComponent(props) {
    const [theme, setTheme] = React.useState('light');

    const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={`theme-${theme}`}>
          <WrappedComponent {...props} />
        </div>
      </ThemeContext.Provider>
    );
  };
}

// Usage
const AuthenticatedProfile = withAuth(UserProfile);
const UserListWithData = withData(UserList, '/api/users');
const ThemedApp = withTheme(App);

// Multiple HOCs composition
const EnhancedComponent = withTheme(withAuth(withData(MyComponent, '/api/data')));
```

### Controlled vs Uncontrolled Components
```jsx
// Uncontrolled component
function UncontrolledForm() {
  const nameRef = React.useRef();
  const emailRef = React.useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value
    };
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} type="text" placeholder="Name" />
      <input ref={emailRef} type="email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}

// Controlled component
function ControlledForm() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        type="text"
        placeholder="Name"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// Custom controlled input
function ControlledInput({ value, onChange, ...props }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}

// Form validation with controlled components
function ValidatedForm() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
      setTouched(prev => ({ ...prev, [field]: true }));
    });

    if (Object.keys(errors).length === 0) {
      console.log('Form submitted:', formData);
    }
  };

  const isFormValid = Object.keys(errors).length === 0 &&
                     Object.keys(touched).length === Object.keys(formData).length;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          type="text"
          placeholder="Name"
          className={errors.name && touched.name ? 'error' : ''}
        />
        {errors.name && touched.name && (
          <span className="error-message">{errors.name}</span>
        )}
      </div>

      <div>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          type="email"
          placeholder="Email"
          className={errors.email && touched.email ? 'error' : ''}
        />
        {errors.email && touched.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          type="password"
          placeholder="Password"
          className={errors.password && touched.password ? 'error' : ''}
        />
        {errors.password && touched.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={!isFormValid}>
        Submit
      </button>
    </form>
  );
}
```

## 3. Performance Optimization

### React.memo for Component Memoization
```jsx
// Without memoization - re-renders on every parent render
function UserCard({ user, onEdit }) {
  console.log('UserCard rendered for:', user.name);
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
}

// With memoization - only re-renders when props change
const UserCard = React.memo(function UserCard({ user, onEdit }) {
  console.log('UserCard rendered for:', user.name);
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
});

// Custom comparison function
const UserCard = React.memo(function UserCard({ user, onEdit }) {
  console.log('UserCard rendered for:', user.name);
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if user data actually changed
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email
  );
});

// Usage
function UserList({ users, onEditUser }) {
  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEditUser}
        />
      ))}
    </div>
  );
}
```

### useMemo and useCallback
```jsx
// useMemo for expensive calculations
function ExpensiveCalculation({ numbers }) {
  const sum = React.useMemo(() => {
    console.log('Calculating sum...');
    return numbers.reduce((acc, num) => acc + num, 0);
  }, [numbers]);

  const average = React.useMemo(() => {
    console.log('Calculating average...');
    return numbers.length > 0 ? sum / numbers.length : 0;
  }, [sum, numbers.length]);

  return (
    <div>
      <p>Sum: {sum}</p>
      <p>Average: {average}</p>
    </div>
  );
}

// useCallback for stable function references
function ParentComponent() {
  const [count, setCount] = React.useState(0);
  const [items, setItems] = React.useState([1, 2, 3, 4, 5]);

  // Without useCallback - function recreated on every render
  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
  };

  // With useCallback - stable function reference
  const handleItemClickStable = React.useCallback((item) => {
    console.log('Item clicked:', item);
  }, []); // Empty dependency array

  // With dependencies
  const addItem = React.useCallback(() => {
    setItems(prev => [...prev, Math.max(...prev) + 1]);
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      <ExpensiveCalculation numbers={items} />

      <ChildComponent
        items={items}
        onItemClick={handleItemClickStable}
        onAddItem={addItem}
      />
    </div>
  );
}

// Memoized child component
const ChildComponent = React.memo(function ChildComponent({ items, onItemClick, onAddItem }) {
  console.log('ChildComponent rendered');

  return (
    <div>
      <button onClick={onAddItem}>Add Item</button>
      <ul>
        {items.map(item => (
          <li key={item} onClick={() => onItemClick(item)}>
            Item {item}
          </li>
        ))}
      </ul>
    </div>
  );
});
```

### Code Splitting and Lazy Loading
```jsx
// Route-based code splitting
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Error boundary for lazy loading
class LazyErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong loading this component.</div>;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <LazyErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </LazyErrorBoundary>
    </Router>
  );
}

// Component-based code splitting
const ExpensiveComponent = lazy(() =>
  import('./components/ExpensiveComponent')
);

// Conditional loading
function ConditionalComponent({ shouldLoad, ...props }) {
  if (!shouldLoad) {
    return <div>Component not loaded yet</div>;
  }

  return (
    <Suspense fallback={<div>Loading expensive component...</div>}>
      <ExpensiveComponent {...props} />
    </Suspense>
  );
}

// Dynamic imports with error handling
function DynamicImporter({ componentName }) {
  const [Component, setComponent] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    import(`./components/${componentName}`)
      .then(module => {
        setComponent(() => module.default);
      })
      .catch(err => {
        setError(err);
      });
  }, [componentName]);

  if (error) {
    return <div>Error loading component: {error.message}</div>;
  }

  if (!Component) {
    return <div>Loading...</div>;
  }

  return <Component />;
}
```

### Virtual Scrolling for Large Lists
```jsx
// Virtual scrolling component
function VirtualList({ items, itemHeight, containerHeight, renderItem }) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef();

  const totalHeight = items.length * itemHeight;
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + visibleItemCount + 1, // +1 for buffer
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Usage
function LargeUserList({ users }) {
  const renderUser = (user, index) => (
    <div className="user-item" key={user.id}>
      <span>{index + 1}. {user.name}</span>
      <span>{user.email}</span>
    </div>
  );

  return (
    <div>
      <h2>Users ({users.length})</h2>
      <VirtualList
        items={users}
        itemHeight={50}
        containerHeight={400}
        renderItem={renderUser}
      />
    </div>
  );
}
```

### React DevTools Profiler
```jsx
// Using React DevTools Profiler API
import React from 'react';

// Profiler component for performance monitoring
function PerformanceProfiler({ id, children }) {
  const handleRender = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log(`${id} - ${phase}:`, {
      actualDuration,
      baseDuration,
      startTime,
      commitTime
    });

    // Log slow renders
    if (actualDuration > 16.67) { // More than one frame at 60fps
      console.warn(`Slow render detected in ${id}: ${actualDuration}ms`);
    }
  };

  return (
    <React.Profiler id={id} onRender={handleRender}>
      {children}
    </React.Profiler>
  );
}

// Usage
function App() {
  return (
    <PerformanceProfiler id="App">
      <div>
        <PerformanceProfiler id="Header">
          <Header />
        </PerformanceProfiler>

        <PerformanceProfiler id="UserList">
          <UserList />
        </PerformanceProfiler>

        <PerformanceProfiler id="Footer">
          <Footer />
        </PerformanceProfiler>
      </div>
    </PerformanceProfiler>
  );
}

// Custom performance hook
function usePerformanceMonitor(componentName) {
  const renderCount = React.useRef(0);
  const lastRenderTime = React.useRef(Date.now());

  React.useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;

    console.log(`${componentName} rendered ${renderCount.current} times`);
    console.log(`Time since last render: ${timeSinceLastRender}ms`);

    lastRenderTime.current = now;
  });

  return renderCount.current;
}

// Usage in component
function OptimizedComponent() {
  const renderCount = usePerformanceMonitor('OptimizedComponent');

  return (
    <div>
      <p>This component has rendered {renderCount} times</p>
    </div>
  );
}
```

This comprehensive guide covers advanced React concepts including custom hooks, complex patterns, performance optimization techniques, and best practices for building scalable React applications. The examples demonstrate real-world implementations that can be directly applied to production applications.
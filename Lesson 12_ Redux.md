### **Lesson 12: Redux - Predictable State Management**

## **1. What is Redux?**

Redux is a predictable state container for JavaScript applications. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. Redux maintains the state of your application in a single, immutable store.

### **Key Principles:**

#### **Core Principles:**
- **Single Source of Truth:** The entire application state is stored in a single object tree
- **State is Read-Only:** The only way to change state is by dispatching actions
- **Changes are Made with Pure Functions:** Reducers are pure functions that take the previous state and an action, and return the next state

#### **Advanced Principles:**
- **Predictable State Updates:** State changes are deterministic and traceable
- **Immutable State:** State is never mutated directly, always returns new state
- **Time-Travel Debugging:** Ability to replay actions and inspect state history
- **Hot Reloading:** Code changes without losing application state
- **Testable:** Pure functions and predictable state make testing straightforward

### **Why Redux?**

- Predictable state updates
- Centralized state management
- Easy debugging with time-travel
- Great developer tools
- Large ecosystem and community
- Works well with React (but not limited to it)

### **When to Use Redux:**

- Complex state logic
- Multiple components need same data
- Frequent state updates
- Large applications with many components
- Need for predictable state changes

## **2. Core Concepts**

### **Actions:**
Actions are plain JavaScript objects that describe what happened. They must have a `type` property and can optionally have a `payload`.

```javascript
// Action types (constants)
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';

// Action creators
function addTodo(text) {
    return {
        type: ADD_TODO,
        payload: {
            id: Date.now(),
            text,
            completed: false
        }
    };
}

function toggleTodo(id) {
    return {
        type: TOGGLE_TODO,
        payload: { id }
    };
}

function deleteTodo(id) {
    return {
        type: DELETE_TODO,
        payload: { id }
    };
}
```

### **Reducers:**
Reducers are pure functions that take the current state and an action, and return the new state.

```javascript
// Initial state
const initialState = {
    todos: [],
    filter: 'all'
};

// Reducer function
function todoReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, action.payload]
            };

        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };

        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload.id)
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
```

### **Store:**
The store holds the application state and provides methods to dispatch actions and subscribe to state changes.

```javascript
import { createStore } from 'redux';

// Create store
const store = createStore(todoReducer);

// Subscribe to state changes
const unsubscribe = store.subscribe(() => {
    console.log('State changed:', store.getState());
});

// Dispatch actions
store.dispatch(addTodo('Learn Redux'));
store.dispatch(addTodo('Build an app'));
store.dispatch(toggleTodo(1));

// Get current state
const currentState = store.getState();

// Unsubscribe
unsubscribe();
```

## **3. Redux with React**

### **Installation:**

```bash
npm install redux react-redux
```

### **Provider Setup:**

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import App from './App';

const store = createStore(rootReducer);

function Root() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

export default Root;
```

### **Connecting Components:**

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo } from './actions';

// Component
function TodoList({ todos, addTodo, toggleTodo, deleteTodo }) {
    const [inputValue, setInputValue] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addTodo(inputValue);
            setInputValue('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a todo"
                />
                <button type="submit">Add</button>
            </form>

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

// Map state to props
const mapStateToProps = (state) => ({
    todos: state.todos
});

// Map dispatch to props
const mapDispatchToProps = {
    addTodo,
    toggleTodo,
    deleteTodo
};

// Connect component
export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

### **Using Hooks (Modern Approach):**

```jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo } from './actions';

function TodoList() {
    const todos = useSelector(state => state.todos);
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            dispatch(addTodo(inputValue));
            setInputValue('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a todo"
                />
                <button type="submit">Add</button>
            </form>

            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <span
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                            onClick={() => dispatch(toggleTodo(todo.id))}
                        >
                            {todo.text}
                        </span>
                        <button onClick={() => dispatch(deleteTodo(todo.id))}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
```

## **4. Advanced Redux Patterns and Middleware**

### **Action Creators with Thunks:**

```javascript
// Async action creator
function fetchTodos() {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_TODOS_REQUEST' });

        try {
            const response = await fetch('/api/todos');
            const todos = await response.json();

            dispatch({
                type: 'FETCH_TODOS_SUCCESS',
                payload: todos
            });
        } catch (error) {
            dispatch({
                type: 'FETCH_TODOS_FAILURE',
                payload: error.message
            });
        }
    };
}

// Usage
dispatch(fetchTodos());
```

### **Custom Middleware:**

##### **Logger Middleware:**
```javascript
// Logger middleware
const logger = store => next => action => {
    console.log('Dispatching:', action);
    const result = next(action);
    console.log('Next state:', store.getState());
    return result;
};

// Thunk middleware
const thunk = store => next => action => {
    if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
    }
    return next(action);
};

// Crash reporter middleware
const crashReporter = store => next => action => {
    try {
        return next(action);
    } catch (error) {
        console.error('Caught an exception!', error);
        // Send error to monitoring service
        // Raven.captureException(error, { extra: { action, state: store.getState() } });
        throw error;
    }
};

// Usage
const store = createStore(
    rootReducer,
    applyMiddleware(thunk, logger, crashReporter)
);
```

##### **API Middleware:**
```javascript
// API middleware for handling async requests
const api = ({ dispatch }) => next => action => {
    if (action.type !== 'API') {
        return next(action);
    }

    const { url, method = 'GET', data, onSuccess, onError } = action.payload;

    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
    })
        .then(response => response.json())
        .then(data => {
            if (onSuccess) {
                dispatch({ type: onSuccess, payload: data });
            }
        })
        .catch(error => {
            if (onError) {
                dispatch({ type: onError, payload: error.message });
            }
        });
};

// Action creator using API middleware
const fetchUser = (userId) => ({
    type: 'API',
    payload: {
        url: `/api/users/${userId}`,
        onSuccess: 'FETCH_USER_SUCCESS',
        onError: 'FETCH_USER_ERROR'
    }
});
```

##### **Saga Middleware (Advanced):**
```javascript
// Redux Saga for complex async flows
import { call, put, takeEvery, all } from 'redux-saga/effects';

// Worker saga
function* fetchUserSaga(action) {
    try {
        const user = yield call(fetch, `/api/users/${action.payload}`);
        const userData = yield call([user, user.json]);

        yield put({ type: 'FETCH_USER_SUCCESS', payload: userData });
    } catch (error) {
        yield put({ type: 'FETCH_USER_ERROR', payload: error.message });
    }
}

// Watcher saga
function* watchFetchUser() {
    yield takeEvery('FETCH_USER_REQUEST', fetchUserSaga);
}

// Root saga
function* rootSaga() {
    yield all([
        watchFetchUser(),
        // other sagas
    ]);
}

// Store setup
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
```

### **Advanced Reducer Patterns:**

##### **Higher-Order Reducers:**
```javascript
// Generic reducer for CRUD operations
function createCrudReducer(entityName) {
    const initialState = {
        items: [],
        loading: false,
        error: null
    };

    return (state = initialState, action) => {
        const { type, payload } = action;

        switch (type) {
            case `${entityName}/FETCH_REQUEST`:
                return { ...state, loading: true, error: null };

            case `${entityName}/FETCH_SUCCESS`:
                return { ...state, loading: false, items: payload };

            case `${entityName}/FETCH_ERROR`:
                return { ...state, loading: false, error: payload };

            case `${entityName}/CREATE_SUCCESS`:
                return { ...state, items: [...state.items, payload] };

            case `${entityName}/UPDATE_SUCCESS`:
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === payload.id ? payload : item
                    )
                };

            case `${entityName}/DELETE_SUCCESS`:
                return {
                    ...state,
                    items: state.items.filter(item => item.id !== payload)
                };

            default:
                return state;
        }
    };
}

// Usage
const usersReducer = createCrudReducer('USERS');
const postsReducer = createCrudReducer('POSTS');
```

##### **Normalized State Structure:**
```javascript
// Normalized state for better performance
const initialState = {
    users: {
        byId: {},
        allIds: [],
        loading: false,
        error: null
    },
    posts: {
        byId: {},
        allIds: [],
        loading: false,
        error: null
    },
    comments: {
        byId: {},
        allIds: [],
        loading: false,
        error: null
    }
};

// Normalized reducer
function usersReducer(state = initialState.users, action) {
    switch (action.type) {
        case 'FETCH_USERS_SUCCESS':
            const usersById = {};
            const userIds = [];

            action.payload.forEach(user => {
                usersById[user.id] = user;
                userIds.push(user.id);
            });

            return {
                ...state,
                byId: usersById,
                allIds: userIds,
                loading: false
            };

        case 'UPDATE_USER_SUCCESS':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.payload.id]: action.payload
                }
            };

        default:
            return state;
    }
}

// Selectors for normalized state
const selectUserById = (state, userId) => state.users.byId[userId];
const selectAllUsers = (state) =>
    state.users.allIds.map(id => state.users.byId[id]);
```

##### **Reducer Composition:**
```javascript
// Cross-cutting concerns with reducer composition
function withLoading(reducer) {
    return (state = { loading: false }, action) => {
        switch (action.type) {
            case 'LOADING_START':
                return { ...state, loading: true };
            case 'LOADING_END':
                return { ...state, loading: false };
            default:
                return {
                    ...state,
                    ...reducer(state, action)
                };
        }
    };
}

function withError(reducer) {
    return (state = { error: null }, action) => {
        switch (action.type) {
            case 'ERROR_SET':
                return { ...state, error: action.payload };
            case 'ERROR_CLEAR':
                return { ...state, error: null };
            default:
                return {
                    ...state,
                    ...reducer(state, action)
                };
        }
    };
}

// Compose reducers
const baseUsersReducer = (state, action) => {
    // User-specific logic
    switch (action.type) {
        case 'ADD_USER':
            return { ...state, users: [...state.users, action.payload] };
        default:
            return state;
    }
};

const usersReducer = withError(withLoading(baseUsersReducer));
```

### **Advanced Selectors:**

##### **Reselect for Memoized Selectors:**
```javascript
import { createSelector } from 'reselect';

// Input selectors
const selectUsers = state => state.users;
const selectPosts = state => state.posts;
const selectCurrentUserId = state => state.auth.currentUserId;

// Memoized selectors
const selectCurrentUser = createSelector(
    [selectUsers, selectCurrentUserId],
    (users, currentUserId) => users.find(user => user.id === currentUserId)
);

const selectUserPosts = createSelector(
    [selectPosts, selectCurrentUserId],
    (posts, currentUserId) =>
        posts.filter(post => post.authorId === currentUserId)
);

const selectUserStats = createSelector(
    [selectCurrentUser, selectUserPosts],
    (user, posts) => ({
        user,
        postCount: posts.length,
        lastPostDate: posts.length > 0
            ? Math.max(...posts.map(p => p.createdAt))
            : null
    })
);

// Usage in component
function UserProfile() {
    const userStats = useSelector(selectUserStats);

    return (
        <div>
            <h1>{userStats.user?.name}</h1>
            <p>Posts: {userStats.postCount}</p>
            <p>Last post: {userStats.lastPostDate}</p>
        </div>
    );
}
```

##### **Parameterized Selectors:**
```javascript
// Factory function for parameterized selectors
const makeSelectUserById = () => createSelector(
    [state => state.users, (state, userId) => userId],
    (users, userId) => users.find(user => user.id === userId)
);

// Usage
function UserCard({ userId }) {
    const selectUserById = useMemo(makeSelectUserById, []);
    const user = useSelector(state => selectUserById(state, userId));

    return <div>{user?.name}</div>;
}
```

### **Store Enhancers and Advanced Configuration:**

##### **Store Enhancers:**
```javascript
// Custom store enhancer for logging
function loggingEnhancer(createStore) {
    return (reducer, preloadedState) => {
        const store = createStore(reducer, preloadedState);

        const originalDispatch = store.dispatch;
        store.dispatch = (action) => {
            console.log('Dispatching action:', action);
            const result = originalDispatch(action);
            console.log('New state:', store.getState());
            return result;
        };

        return store;
    };
}

// Persistence enhancer
function persistEnhancer(createStore) {
    return (reducer, preloadedState) => {
        const store = createStore(reducer, preloadedState);

        // Load persisted state
        const persistedState = localStorage.getItem('reduxState');
        if (persistedState) {
            store.dispatch({
                type: 'LOAD_PERSISTED_STATE',
                payload: JSON.parse(persistedState)
            });
        }

        // Save state on changes
        store.subscribe(() => {
            const state = store.getState();
            localStorage.setItem('reduxState', JSON.stringify(state));
        });

        return store;
    };
}

// Combine enhancers
const enhancers = compose(
    loggingEnhancer,
    persistEnhancer,
    applyMiddleware(thunk)
);

const store = createStore(rootReducer, enhancers);
```

##### **Hot Module Replacement:**
```javascript
// Enable hot reloading for reducers
if (module.hot) {
    module.hot.accept('./reducers', () => {
        const newRootReducer = require('./reducers').default;
        store.replaceReducer(newRootReducer);
    });
}
```

### **Advanced Redux Toolkit Patterns:**

##### **RTK Query for API Integration:**
```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Users', 'Posts'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['Users'],
        }),
        getUser: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        createUser: builder.mutation({
            query: (user) => ({
                url: '/users',
                method: 'POST',
                body: user,
            }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
        }),
    }),
});

// Auto-generated hooks
export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
} = apiSlice;

// Store configuration
export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        // other reducers
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

// Usage in component
function UsersList() {
    const { data: users, isLoading, error } = useGetUsersQuery();
    const [createUser] = useCreateUserMutation();

    const handleCreateUser = async (userData) => {
        try {
            await createUser(userData).unwrap();
            // Success handling
        } catch (error) {
            // Error handling
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {users?.map(user => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
}
```

##### **Entity Adapters for Normalized State:**
```javascript
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

// Entity adapter for users
const usersAdapter = createEntityAdapter({
    selectId: (user) => user.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// Users slice with entity adapter
const usersSlice = createSlice({
    name: 'users',
    initialState: usersAdapter.getInitialState({
        loading: false,
        error: null,
    }),
    reducers: {
        userAdded: usersAdapter.addOne,
        usersReceived: usersAdapter.setAll,
        userUpdated: usersAdapter.updateOne,
        userRemoved: usersAdapter.removeOne,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                usersAdapter.setAll(state, action.payload);
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Selectors
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds,
} = usersAdapter.getSelectors((state) => state.users);

export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

// Usage
function UsersList() {
    const users = useSelector(selectAllUsers);
    const loading = useSelector(selectUsersLoading);

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                users.map(user => <UserCard key={user.id} user={user} />)
            )}
        </div>
    );
}
```

### **Performance Optimization Techniques:**

##### **Memoized Selectors with Reselect:**
```javascript
import { createSelector } from 'reselect';

// Complex selector with memoization
const selectFilteredAndSortedTodos = createSelector(
    [
        (state) => state.todos.items,
        (state) => state.todos.filter,
        (state) => state.todos.sortBy,
    ],
    (todos, filter, sortBy) => {
        let filtered = todos;

        // Apply filter
        if (filter === 'completed') {
            filtered = todos.filter(todo => todo.completed);
        } else if (filter === 'active') {
            filtered = todos.filter(todo => !todo.completed);
        }

        // Apply sorting
        if (sortBy === 'date') {
            filtered = [...filtered].sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else if (sortBy === 'priority') {
            filtered = [...filtered].sort((a, b) => b.priority - a.priority);
        }

        return filtered;
    }
);
```

##### **Component Optimization with Redux:**
```javascript
// Optimized component with shallow comparison
const TodoItem = React.memo(({ todo, onToggle, onDelete }) => {
    console.log('TodoItem rendered:', todo.id);

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
    );
});

// Custom comparison function
const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.todo.id === nextProps.todo.id &&
        prevProps.todo.completed === nextProps.todo.completed &&
        prevProps.todo.text === nextProps.todo.text
    );
};

const OptimizedTodoItem = React.memo(TodoItem, areEqual);
```

##### **Batch Updates:**
```javascript
import { batch } from 'react-redux';

// Batch multiple dispatches
function batchUpdateTodos(updates) {
    return (dispatch) => {
        batch(() => {
            updates.forEach(update => {
                dispatch(update);
            });
        });
    };
}

// Usage
const updates = [
    toggleTodo(1),
    toggleTodo(2),
    deleteTodo(3),
];

dispatch(batchUpdateTodos(updates));
```

### **Testing Redux Applications:**

##### **Testing Actions:**
```javascript
// Action testing
describe('todo actions', () => {
    it('should create an add todo action', () => {
        const text = 'Test todo';
        const expectedAction = {
            type: 'ADD_TODO',
            payload: {
                id: expect.any(Number),
                text,
                completed: false
            }
        };

        expect(addTodo(text)).toEqual(expectedAction);
    });
});
```

##### **Testing Reducers:**
```javascript
// Reducer testing
describe('todos reducer', () => {
    const initialState = {
        todos: [],
        filter: 'all'
    };

    it('should return the initial state', () => {
        expect(todosReducer(undefined, {})).toEqual(initialState);
    });

    it('should handle ADD_TODO', () => {
        const action = {
            type: 'ADD_TODO',
            payload: { id: 1, text: 'Test todo', completed: false }
        };

        const expectedState = {
            todos: [{ id: 1, text: 'Test todo', completed: false }],
            filter: 'all'
        };

        expect(todosReducer(initialState, action)).toEqual(expectedState);
    });
});
```

##### **Testing Async Thunks:**
```javascript
// Async thunk testing
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('creates FETCH_TODOS_SUCCESS when fetching todos succeeds', () => {
        fetchMock.getOnce('/api/todos', {
            body: [{ id: 1, text: 'Test todo' }],
            headers: { 'content-type': 'application/json' }
        });

        const expectedActions = [
            { type: 'FETCH_TODOS_REQUEST' },
            {
                type: 'FETCH_TODOS_SUCCESS',
                payload: [{ id: 1, text: 'Test todo' }]
            }
        ];

        const store = mockStore({ todos: [] });

        return store.dispatch(fetchTodos()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
```

##### **Testing Connected Components:**
```javascript
// Connected component testing
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('TodoList component', () => {
    let store;
    let component;

    beforeEach(() => {
        store = mockStore({
            todos: {
                todos: [
                    { id: 1, text: 'Test todo', completed: false }
                ],
                filter: 'all'
            }
        });

        component = render(
            <Provider store={store}>
                <TodoList />
            </Provider>
        );
    });

    it('should render todos', () => {
        expect(component.getByText('Test todo')).toBeInTheDocument();
    });
});
```

### **Redux Ecosystem and Alternatives:**

##### **Redux Observable for Reactive Programming:**
```javascript
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { map, mergeMap, catchError } from 'rxjs/operators';

// Epic for handling user search
const searchUsersEpic = (action$) =>
    action$.ofType('SEARCH_USERS')
        .pipe(
            mergeMap(action =>
                ajax.getJSON(`/api/users?q=${action.payload}`)
                    .pipe(
                        map(response => ({
                            type: 'SEARCH_USERS_SUCCESS',
                            payload: response
                        })),
                        catchError(error => [{
                            type: 'SEARCH_USERS_ERROR',
                            payload: error.message
                        }])
                    )
            )
        );

// Root epic
const rootEpic = combineEpics(searchUsersEpic);

// Store setup
const epicMiddleware = createEpicMiddleware();
const store = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware)
);

epicMiddleware.run(rootEpic);
```

##### **Zustand as a Redux Alternative:**
```javascript
import create from 'zustand';

// Zustand store
const useStore = create((set, get) => ({
    todos: [],
    filter: 'all',

    // Actions
    addTodo: (text) => set(state => ({
        todos: [...state.todos, {
            id: Date.now(),
            text,
            completed: false
        }]
    })),

    toggleTodo: (id) => set(state => ({
        todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
    })),

    // Computed values
    filteredTodos: () => {
        const { todos, filter } = get();
        if (filter === 'completed') return todos.filter(t => t.completed);
        if (filter === 'active') return todos.filter(t => !t.completed);
        return todos;
    },

    // Async actions
    fetchTodos: async () => {
        const response = await fetch('/api/todos');
        const todos = await response.json();
        set({ todos });
    }
}));

// Usage in component
function TodoList() {
    const {
        filteredTodos,
        addTodo,
        toggleTodo,
        fetchTodos
    } = useStore();

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    return (
        <div>
            {filteredTodos().map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                />
            ))}
        </div>
    );
}
```

##### **Recoil for React State Management:**
```javascript
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// Atoms
const todosState = atom({
    key: 'todosState',
    default: []
});

const filterState = atom({
    key: 'filterState',
    default: 'all'
});

// Selectors
const filteredTodosState = selector({
    key: 'filteredTodosState',
    get: ({ get }) => {
        const todos = get(todosState);
        const filter = get(filterState);

        if (filter === 'completed') return todos.filter(t => t.completed);
        if (filter === 'active') return todos.filter(t => !t.completed);
        return todos;
    }
});

// Async data fetching
const usersQuery = selectorFamily({
    key: 'usersQuery',
    get: (userId) => async () => {
        const response = await fetch(`/api/users/${userId}`);
        return response.json();
    }
});

// Usage
function TodoList() {
    const [todos, setTodos] = useRecoilState(todosState);
    const [filter, setFilter] = useRecoilState(filterState);
    const filteredTodos = useRecoilValue(filteredTodosState);

    const addTodo = (text) => {
        setTodos([...todos, {
            id: Date.now(),
            text,
            completed: false
        }]);
    };

    return (
        <div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
            </select>

            {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </div>
    );
}
```

### **Middleware Setup:**

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk, logger)
);
```

### **Combining Reducers:**

```javascript
import { combineReducers } from 'redux';

// Individual reducers
function todosReducer(state = [], action) {
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, action.payload];
        case 'TOGGLE_TODO':
            return state.map(todo =>
                todo.id === action.payload
                    ? { ...todo, completed: !todo.completed }
                    : todo
            );
        default:
            return state;
    }
}

function filterReducer(state = 'all', action) {
    switch (action.type) {
        case 'SET_FILTER':
            return action.payload;
        default:
            return state;
    }
}

// Combine reducers
const rootReducer = combineReducers({
    todos: todosReducer,
    filter: filterReducer
});

export default rootReducer;
```

### **Selectors:**

```javascript
// Selectors
const selectTodos = (state) => state.todos;
const selectFilter = (state) => state.filter;

const selectVisibleTodos = (state) => {
    const todos = selectTodos(state);
    const filter = selectFilter(state);

    switch (filter) {
        case 'completed':
            return todos.filter(todo => todo.completed);
        case 'active':
            return todos.filter(todo => !todo.completed);
        default:
            return todos;
    }
};

const selectCompletedCount = (state) =>
    selectTodos(state).filter(todo => todo.completed).length;

// Usage in component
function TodoStats() {
    const completedCount = useSelector(selectCompletedCount);
    const totalCount = useSelector(state => state.todos.length);

    return (
        <div>
            {completedCount} of {totalCount} todos completed
        </div>
    );
}
```

## **5. Redux Toolkit (Modern Redux)**

### **Installation:**

```bash
npm install @reduxjs/toolkit
```

### **Creating a Slice:**

```jsx
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
    name: 'todos',
    initialState: [],
    reducers: {
        addTodo: (state, action) => {
            state.push({
                id: Date.now(),
                text: action.payload,
                completed: false
            });
        },
        toggleTodo: (state, action) => {
            const todo = state.find(todo => todo.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        deleteTodo: (state, action) => {
            return state.filter(todo => todo.id !== action.payload);
        }
    }
});

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

### **Store Configuration:**

```jsx
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './features/todos/todosSlice';

export const store = configureStore({
    reducer: {
        todos: todosReducer
    }
});
```

### **Async Thunks:**

```jsx
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async thunk
export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async () => {
        const response = await fetch('/api/todos');
        return response.json();
    }
);

// Slice with async thunk
const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});
```

## **6. Redux DevTools**

### **Browser Extension:**
Install Redux DevTools extension for Chrome/Firefox

### **Store Enhancement:**

```jsx
import { compose } from 'redux';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);
```

### **Time Travel Debugging:**
- Inspect every state change
- Jump to any previous state
- Replay actions
- Export/import state for debugging

## **7. Code Examples**

### **Example 1: Complete Todo Application**

```jsx
// actions.js
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const SET_FILTER = 'SET_FILTER';

export const addTodo = (text) => ({
    type: ADD_TODO,
    payload: { id: Date.now(), text, completed: false }
});

export const toggleTodo = (id) => ({
    type: TOGGLE_TODO,
    payload: { id }
});

export const deleteTodo = (id) => ({
    type: DELETE_TODO,
    payload: { id }
});

export const setFilter = (filter) => ({
    type: SET_FILTER,
    payload: filter
});

// reducers.js
const initialState = {
    todos: [],
    filter: 'all'
};

export function todosReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload]
            };
        case TOGGLE_TODO:
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            };
        case DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload.id)
            };
        case SET_FILTER:
            return {
                ...state,
                filter: action.payload
            };
        default:
            return state;
    }
}

// store.js
import { createStore, combineReducers } from 'redux';
import { todosReducer } from './reducers';

const rootReducer = combineReducers({
    todos: todosReducer
});

const store = createStore(rootReducer);

export default store;

// TodoList.js
import React from 'react';
import { connect } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, setFilter } from './actions';

function TodoList({
    todos,
    filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter
}) {
    const [inputValue, setInputValue] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addTodo(inputValue);
            setInputValue('');
        }
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'completed') return todo.completed;
        if (filter === 'active') return !todo.completed;
        return true;
    });

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a todo"
                />
                <button type="submit">Add</button>
            </form>

            <div>
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('active')}>Active</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
            </div>

            <ul>
                {filteredTodos.map(todo => (
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

const mapStateToProps = (state) => ({
    todos: state.todos.todos,
    filter: state.todos.filter
});

const mapDispatchToProps = {
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

### **Example 2: Shopping Cart with Redux Toolkit**

```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Product slice
const productsSlice = createSlice({
    name: 'products',
    initialState: [
        { id: 1, name: 'Laptop', price: 999 },
        { id: 2, name: 'Phone', price: 699 },
        { id: 3, name: 'Headphones', price: 199 }
    ],
    reducers: {}
});

export const selectProducts = (state) => state.products;

// Cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState: [],
    reducers: {
        addToCart: (state, action) => {
            const item = state.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity += 1;
            } else {
                state.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            return state.filter(item => item.id !== action.payload);
        },
        updateQuantity: (state, action) => {
            const item = state.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        clearCart: (state) => {
            return [];
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart;
export const selectCartTotal = (state) =>
    state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemCount = (state) =>
    state.cart.reduce((count, item) => count + item.quantity, 0);

// Store
export const store = configureStore({
    reducer: {
        products: productsSlice.reducer,
        cart: cartSlice.reducer
    }
});

// ProductList component
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProducts, addToCart } from './store';

function ProductList() {
    const products = useSelector(selectProducts);
    const dispatch = useDispatch();

    return (
        <div>
            <h2>Products</h2>
            {products.map(product => (
                <div key={product.id} className="product">
                    <h3>{product.name}</h3>
                    <p>${product.price}</p>
                    <button onClick={() => dispatch(addToCart(product))}>
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
}

// Cart component
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCartItems,
    selectCartTotal,
    removeFromCart,
    updateQuantity,
    clearCart
} from './store';

function Cart() {
    const cartItems = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const dispatch = useDispatch();

    return (
        <div>
            <h2>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <h4>{item.name}</h4>
                            <p>${item.price}</p>
                            <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => dispatch(updateQuantity({
                                    id: item.id,
                                    quantity: parseInt(e.target.value)
                                }))}
                            />
                            <button onClick={() => dispatch(removeFromCart(item.id))}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <div className="cart-total">
                        <h3>Total: ${total.toFixed(2)}</h3>
                        <button onClick={() => dispatch(clearCart())}>
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// App component
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import ProductList from './ProductList';
import Cart from './Cart';

function App() {
    return (
        <Provider store={store}>
            <div className="app">
                <ProductList />
                <Cart />
            </div>
        </Provider>
    );
}

export default App;
```

### **Example 3: Async Data Fetching**

```jsx
// Async actions
export const fetchUsers = () => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_USERS_REQUEST' });

        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            dispatch({
                type: 'FETCH_USERS_SUCCESS',
                payload: users
            });
        } catch (error) {
            dispatch({
                type: 'FETCH_USERS_FAILURE',
                payload: error.message
            });
        }
    };
};

export const createUser = (userData) => {
    return async (dispatch) => {
        dispatch({ type: 'CREATE_USER_REQUEST' });

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const newUser = await response.json();

            dispatch({
                type: 'CREATE_USER_SUCCESS',
                payload: newUser
            });
        } catch (error) {
            dispatch({
                type: 'CREATE_USER_FAILURE',
                payload: error.message
            });
        }
    };
};

// Reducer
const initialState = {
    users: [],
    loading: false,
    error: null
};

export function usersReducer(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_USERS_REQUEST':
        case 'CREATE_USER_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };

        case 'FETCH_USERS_SUCCESS':
            return {
                ...state,
                loading: false,
                users: action.payload
            };

        case 'CREATE_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                users: [...state.users, action.payload]
            };

        case 'FETCH_USERS_FAILURE':
        case 'CREATE_USER_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
}

// Component
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, createUser } from './actions';

function Users() {
    const { users, loading, error } = useSelector(state => state.users);
    const dispatch = useDispatch();
    const [newUser, setNewUser] = React.useState({ name: '', email: '' });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createUser(newUser));
        setNewUser({ name: '', email: '' });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Users</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <button type="submit">Add User</button>
            </form>

            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Users;
```

## **13. Assignments and Projects**

### **Assignment 12.1: Redux Fundamentals**
Create a Redux store with:
- Basic actions and reducers
- Store subscription
- State updates through actions
- Multiple reducers combined

### **Assignment 12.2: React Redux Integration**
Build React components that:
- Connect to Redux store
- Dispatch actions
- Subscribe to state changes
- Use mapStateToProps and mapDispatchToProps

### **Project 12: E-commerce Store**
Create a complete e-commerce application with:
- Product catalog
- Shopping cart
- User authentication
- Order management
- Admin dashboard

### **Challenge Project: Social Media Dashboard**
Build a social media analytics dashboard with:
- Multiple data sources
- Real-time updates
- Complex state management
- Data visualization
- User preferences

## **14. Best Practices**

### **State Design:**
- Keep state normalized
- Use appropriate data structures
- Avoid deeply nested objects
- Plan state shape carefully
- Document state structure

### **Actions:**
- Use action constants
- Keep actions serializable
- Create action creators
- Follow naming conventions
- Document action payloads

### **Reducers:**
- Keep reducers pure
- Handle default cases
- Use immutable updates
- Split complex reducers
- Test reducer logic

### **Performance:**
- Use selectors for computed data
- Avoid unnecessary re-renders
- Use React.memo when appropriate
- Implement proper memoization
- Monitor bundle size

## **15. Common Patterns**

### **Ducks Pattern:**

```javascript
// widgets.js
const LOAD = 'my-app/widgets/LOAD';
const CREATE = 'my-app/widgets/CREATE';
const UPDATE = 'my-app/widgets/UPDATE';
const REMOVE = 'my-app/widgets/REMOVE';

const loadWidgets = (widgets) => ({ type: LOAD, widgets });
const createWidget = (widget) => ({ type: CREATE, widget });
const updateWidget = (widget) => ({ type: UPDATE, widget });
const removeWidget = (id) => ({ type: REMOVE, id });

const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD:
            return action.widgets;
        case CREATE:
            return [...state, action.widget];
        case UPDATE:
            return state.map(w =>
                w.id === action.widget.id ? action.widget : w
            );
        case REMOVE:
            return state.filter(w => w.id !== action.id);
        default:
            return state;
    }
};

export default reducer;
export { loadWidgets, createWidget, updateWidget, removeWidget };
```

### **Container/Presentational Pattern:**

```jsx
// Presentational component
const TodoList = ({ todos, onToggle, onDelete }) => (
    <ul>
        {todos.map(todo => (
            <li key={todo.id}>
                <span onClick={() => onToggle(todo.id)}>{todo.text}</span>
                <button onClick={() => onDelete(todo.id)}>Delete</button>
            </li>
        ))}
    </ul>
);

// Container component
const TodoListContainer = () => {
    const todos = useSelector(state => state.todos);
    const dispatch = useDispatch();

    return (
        <TodoList
            todos={todos}
            onToggle={(id) => dispatch(toggleTodo(id))}
            onDelete={(id) => dispatch(deleteTodo(id))}
        />
    );
};
```

## **16. Resources**

- [Redux Official Documentation](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Redux](https://react-redux.js.org/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

## **17. Next Steps**

Now that you've learned the core concepts of full-stack web development, you can explore advanced topics like:

- **Authentication & Authorization:** JWT, OAuth, sessions
- **Testing:** Unit tests, integration tests, E2E tests
- **Deployment:** Docker, CI/CD, cloud platforms
- **Performance:** Optimization, caching, monitoring
- **Security:** Best practices, common vulnerabilities
- **Advanced Patterns:** Microservices, serverless, GraphQL

Practice building applications with the technologies you've learned and experiment with different architectures and patterns!

---

# Website Libraries & Framework Guide

## 1. Frontend Framework Comparison

### React vs Vue vs Angular - Complete Comparison

#### React.js - The Flexible Choice
```jsx
// React Component Example
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

export default UserProfile;
```

**React Advantages:**
- Largest ecosystem and community
- Flexible - can be used for web, mobile, desktop
- Virtual DOM for optimal performance
- One-way data binding (predictable)
- Rich ecosystem of libraries and tools
- Easy learning curve for JavaScript developers

**React Best For:**
- Single Page Applications (SPAs)
- Complex user interfaces
- Real-time applications
- Mobile apps (React Native)
- Large-scale applications

#### Vue.js - The Progressive Framework
```vue
<template>
  <div class="user-profile">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="!user" class="error">User not found</div>
    <div v-else class="profile">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <p>Member since: {{ formatDate(user.createdAt) }}</p>
      <button @click="editProfile" class="btn">Edit Profile</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: null,
      loading: true
    }
  },
  async created() {
    await this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const response = await fetch(`/api/users/${this.userId}`);
        this.user = await response.json();
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    editProfile() {
      this.$emit('edit-user', this.user);
    }
  }
}
</script>

<style scoped>
.user-profile {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.profile {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: #0056b3;
}
</style>
```

**Vue Advantages:**
- Gentle learning curve
- Excellent documentation
- Built-in state management (Pinia)
- Template syntax similar to HTML
- Small bundle size
- Great for progressive enhancement

**Vue Best For:**
- Small to medium applications
- Progressive web apps
- Applications requiring quick development
- Teams familiar with HTML/CSS
- Applications needing SEO optimization

#### Angular - The Enterprise Framework
```typescript
// user-profile.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() userId!: string;
  @Output() editUser = new EventEmitter<User>();

  user: User | null = null;
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser(): void {
    this.loading = true;
    this.error = null;

    this.http.get<User>(`/api/users/${this.userId}`)
      .pipe(
        catchError(error => {
          this.error = 'Failed to load user';
          console.error('Error fetching user:', error);
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(user => {
        this.user = user;
      });
  }

  onEditProfile(): void {
    if (this.user) {
      this.editUser.emit(this.user);
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
```

```html
<!-- user-profile.component.html -->
<div class="user-profile">
  <div *ngIf="loading" class="loading">
    Loading...
  </div>

  <div *ngIf="error" class="error">
    {{ error }}
  </div>

  <div *ngIf="!loading && !error && user" class="profile">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <p>Member since: {{ formatDate(user.createdAt) }}</p>
    <button (click)="onEditProfile()" class="btn">Edit Profile</button>
  </div>
</div>
```

```css
/* user-profile.component.css */
.user-profile {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.error {
  color: #dc3545;
  text-align: center;
  padding: 20px;
}

.profile {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: #0056b3;
}
```

**Angular Advantages:**
- Full framework with everything included
- TypeScript support (type safety)
- Dependency injection system
- RxJS for reactive programming
- CLI for scaffolding and tooling
- Enterprise-grade architecture

**Angular Best For:**
- Large enterprise applications
- Complex applications with many developers
- Applications requiring strong typing
- Long-term maintenance projects
- Applications with complex state management

## 2. UI Component Libraries

### Material-UI (MUI) - React
```jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Favorite, Share, MoreVert } from '@mui/icons-material';

function UserCard({ user, onEdit, onDelete }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Card sx={{ maxWidth: 345, m: 2 }}>
        <CardContent>
          <Avatar
            src={user.avatar}
            sx={{ width: 56, height: 56, mb: 2 }}
          >
            {user.name.charAt(0)}
          </Avatar>

          <Typography variant="h5" component="div">
            {user.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </Typography>

          <Chip
            label={user.role}
            color={user.role === 'admin' ? 'primary' : 'default'}
            size="small"
            sx={{ mt: 1 }}
          />
        </CardContent>

        <CardActions>
          <IconButton aria-label="add to favorites">
            <Favorite />
          </IconButton>
          <IconButton aria-label="share">
            <Share />
          </IconButton>
          <IconButton aria-label="more options">
            <MoreVert />
          </IconButton>

          <Button size="small" onClick={() => setOpen(true)}>
            Edit
          </Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="standard"
            defaultValue={user.name}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="standard"
            defaultValue={user.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            onEdit(user.id);
            setOpen(false);
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserCard;
```

### Ant Design - React
```jsx
import React from 'react';
import {
  Card,
  Avatar,
  Typography,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  message
} from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Meta } = Card;

function UserCard({ user, onEdit, onDelete }) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      name: user.name,
      email: user.email
    });
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      onEdit(user.id, values);
      setIsModalVisible(false);
      message.success('User updated successfully');
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete User',
      content: `Are you sure you want to delete ${user.name}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDelete(user.id);
        message.success('User deleted successfully');
      }
    });
  };

  return (
    <>
      <Card
        style={{ width: 300, margin: 16 }}
        actions={[
          <EditOutlined key="edit" onClick={showModal} />,
          <DeleteOutlined key="delete" onClick={handleDelete} />
        ]}
      >
        <Meta
          avatar={
            <Avatar
              src={user.avatar}
              icon={<UserOutlined />}
              size={64}
            />
          }
          title={user.name}
          description={
            <div>
              <Text type="secondary">{user.email}</Text>
              <br />
              <Text type="secondary">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </Text>
              <br />
              <Tag color={user.role === 'admin' ? 'blue' : 'green'}>
                {user.role}
              </Tag>
            </div>
          }
        />
      </Card>

      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserCard;
```

### Bootstrap - CSS Framework
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Profile - Bootstrap</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body text-center">
            <img src="https://via.placeholder.com/150" class="rounded-circle mb-3" alt="User Avatar">
            <h5 class="card-title">John Doe</h5>
            <p class="card-text text-muted">john.doe@example.com</p>
            <span class="badge bg-primary">Admin</span>
            <p class="mt-2 text-muted small">Member since: January 15, 2023</p>

            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
              <button class="btn btn-primary me-md-2" type="button">Edit Profile</button>
              <button class="btn btn-outline-danger" type="button">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### Tailwind CSS - Utility-First Framework
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Profile - Tailwind CSS</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="p-6">
        <div class="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            class="w-24 h-24 rounded-full mb-4"
          >

          <h2 class="text-2xl font-bold text-gray-800 mb-2">John Doe</h2>
          <p class="text-gray-600 mb-2">john.doe@example.com</p>

          <span class="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mb-4">
            Admin
          </span>

          <p class="text-gray-500 text-sm mb-6">Member since: January 15, 2023</p>

          <div class="flex space-x-3">
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200">
              Edit Profile
            </button>
            <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

## 3. State Management Libraries

### Redux Toolkit - React
```javascript
// store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import usersReducer from './usersSlice';
import postsReducer from './postsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Pinia - Vue.js
```javascript
// stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  getters: {
    fullName: (state) => {
      if (state.user) {
        return `${state.user.firstName} ${state.user.lastName}`;
      }
      return '';
    },

    userRole: (state) => state.user?.role || 'user',

    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    async login(credentials) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/auth/login', credentials);

        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      try {
        await axios.post('/api/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        this.error = null;

        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    },

    async fetchUserProfile() {
      if (!this.token) return;

      this.isLoading = true;

      try {
        const response = await axios.get('/api/users/profile');
        this.user = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch profile';
        // If token is invalid, logout
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile(userData) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.put('/api/users/profile', userData);
        this.user = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Update failed';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    clearError() {
      this.error = null;
    }
  }
});
```

### NgRx - Angular
```typescript
// store/auth/auth.actions.ts
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: any; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const fetchUserProfile = createAction('[Auth] Fetch User Profile');

export const fetchUserProfileSuccess = createAction(
  '[Auth] Fetch User Profile Success',
  props<{ user: any }>()
);

export const fetchUserProfileFailure = createAction(
  '[Auth] Fetch User Profile Failure',
  props<{ error: string }>()
);
```

```typescript
// store/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: any;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token')
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isLoading: false,
    isAuthenticated: true,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    error: null
  })),

  on(AuthActions.fetchUserProfile, (state) => ({
    ...state,
    isLoading: true
  })),

  on(AuthActions.fetchUserProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false
  })),

  on(AuthActions.fetchUserProfileFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
```

## 4. HTTP Client Libraries

### Axios - Promise-based HTTP client
```javascript
// services/api.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.error('Access denied');
    }

    if (error.response?.status >= 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: (token) => api.post('/auth/refresh', { token }),
  getProfile: () => api.get('/auth/profile')
};

export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

export const postsAPI = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
  unlikePost: (id) => api.delete(`/posts/${id}/like`)
};

export default api;
```

### Fetch API - Modern browser API
```javascript
// services/fetchAPI.js
class FetchAPI {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  // Helper method to build full URL
  buildURL(endpoint) {
    return this.baseURL + endpoint;
  }

  // Helper method to handle responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Helper method to get headers with auth
  getHeaders(additionalHeaders = {}) {
    const token = localStorage.getItem('token');
    const headers = { ...this.defaultHeaders, ...additionalHeaders };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // GET request
  async get(endpoint, params = {}) {
    const url = new URL(this.buildURL(endpoint));

    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  // POST request
  async post(endpoint, data = {}) {
    const response = await fetch(this.buildURL(endpoint), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  // PUT request
  async put(endpoint, data = {}) {
    const response = await fetch(this.buildURL(endpoint), {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    const response = await fetch(this.buildURL(endpoint), {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });

    return this.handleResponse(response);
  }

  // DELETE request
  async delete(endpoint) {
    const response = await fetch(this.buildURL(endpoint), {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleResponse(response);
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);

    // Add additional data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const response = await fetch(this.buildURL(endpoint), {
      method: 'POST',
      headers: {
        Authorization: this.getHeaders().Authorization
        // Don't set Content-Type for FormData
      },
      body: formData
    });

    return this.handleResponse(response);
  }
}

// Create API instance
const api = new FetchAPI(process.env.REACT_APP_API_URL || 'http://localhost:3001/api');

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile')
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', params),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

export default api;
```

## 5. Animation Libraries

### Framer Motion - React
```jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedUserCard({ user, onDelete }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDelete = () => {
    setIsVisible(false);
    setTimeout(() => onDelete(user.id), 300); // Wait for animation
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="user-card"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="card-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.img
              src={user.avatar}
              alt={user.name}
              className="avatar"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            <motion.h3
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {user.name}
            </motion.h3>

            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {user.email}
            </motion.p>

            <motion.button
              className="delete-btn"
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Delete
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function UserList({ users, onDeleteUser }) {
  return (
    <motion.div
      className="user-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1
            }}
          >
            <AnimatedUserCard
              user={user}
              onDelete={onDeleteUser}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export { AnimatedUserCard, UserList };
```

### GSAP - High-performance animation library
```javascript
// animations/userCardAnimation.js
import { gsap } from 'gsap';

export class UserCardAnimation {
  constructor(cardElement) {
    this.card = cardElement;
    this.timeline = gsap.timeline({ paused: true });
    this.isAnimating = false;
  }

  // Entrance animation
  enter() {
    if (this.isAnimating) return;

    this.isAnimating = true;

    this.timeline
      .fromTo(this.card,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      )
      .fromTo(this.card.querySelector('.avatar'),
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.3"
      )
      .fromTo(this.card.querySelector('.user-info'),
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
        "-=0.2"
      )
      .fromTo(this.card.querySelector('.action-buttons'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        "-=0.1"
      )
      .then(() => {
        this.isAnimating = false;
      });

    this.timeline.play();
  }

  // Hover animation
  hover() {
    gsap.to(this.card, {
      scale: 1.05,
      y: -5,
      duration: 0.3,
      ease: "power2.out"
    });

    gsap.to(this.card.querySelector('.avatar'), {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out"
    });
  }

  // Hover out animation
  hoverOut() {
    gsap.to(this.card, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    });

    gsap.to(this.card.querySelector('.avatar'), {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  }

  // Delete animation
  delete(callback) {
    if (this.isAnimating) return;

    this.isAnimating = true;

    this.timeline
      .to(this.card.querySelector('.action-buttons'), {
        y: 20,
        opacity: 0,
        duration: 0.2
      })
      .to(this.card.querySelector('.user-info'), {
        x: -20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.1
      }, "-=0.1")
      .to(this.card.querySelector('.avatar'), {
        scale: 0,
        rotation: 180,
        duration: 0.4,
        ease: "back.in(1.7)"
      }, "-=0.2")
      .to(this.card, {
        opacity: 0,
        y: -30,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.in"
      }, "-=0.1")
      .then(() => {
        this.isAnimating = false;
        if (callback) callback();
      });

    this.timeline.play();
  }

  // Stagger animation for list
  static staggerEnter(cards, delay = 0.1) {
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: delay,
        ease: "back.out(1.7)"
      }
    );
  }
}

// Usage in React component
import React, { useEffect, useRef } from 'react';
import { UserCardAnimation } from './animations/userCardAnimation';

function UserCard({ user, onDelete }) {
  const cardRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      animationRef.current = new UserCardAnimation(cardRef.current);
      animationRef.current.enter();
    }
  }, []);

  const handleMouseEnter = () => {
    animationRef.current?.hover();
  };

  const handleMouseLeave = () => {
    animationRef.current?.hoverOut();
  };

  const handleDelete = () => {
    animationRef.current?.delete(() => onDelete(user.id));
  };

  return (
    <div
      ref={cardRef}
      className="user-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={user.avatar} alt={user.name} className="avatar" />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
      <div className="action-buttons">
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default UserCard;
```

This comprehensive guide covers the most popular and powerful website libraries and frameworks, with practical examples and comparisons to help you choose the right tools for your projects.
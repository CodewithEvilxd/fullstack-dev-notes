### **Lesson 13: Authentication & Authorization**

## **1. What is Authentication and Authorization?**

**Authentication** is the process of verifying who a user is. It answers the question "Who are you?"

**Authorization** is the process of determining what a user is allowed to do. It answers the question "What can you do?"

### **Key Concepts:**

#### **Core Authentication Concepts:**
- **Authentication:** The process of verifying who a user is (login, signup, biometric verification)
- **Authorization:** Determining what a user is allowed to do after authentication
- **Session Management:** Maintaining user state across multiple requests
- **Token-based Authentication:** Using tokens for stateless, scalable authentication
- **Role-Based Access Control (RBAC):** Permissions based on user roles and responsibilities
- **Attribute-Based Access Control (ABAC):** Permissions based on user attributes and context
- **OAuth 2.0:** Industry-standard protocol for delegated authorization
- **OpenID Connect:** Identity layer built on top of OAuth 2.0

#### **Advanced Security Concepts:**
- **Multi-Factor Authentication (MFA):** Multiple verification methods for enhanced security
- **Single Sign-On (SSO):** One login for multiple applications
- **Federated Identity:** Trust relationships between identity providers
- **Zero Trust Architecture:** Never trust, always verify
- **JWT Token Rotation:** Automatic token refresh for enhanced security
- **Session Fixation Protection:** Preventing session hijacking attacks
- **Brute Force Protection:** Rate limiting and account lockout mechanisms

## **2. Session-Based Authentication**

Session-based authentication stores user session data on the server and uses session cookies to maintain user state across requests. This approach is stateful and requires server-side storage for session data.

### **How Session Authentication Works:**
1. **User Login:** Server validates credentials and creates a session
2. **Session Storage:** Session data is stored on the server (memory, database, Redis)
3. **Cookie Creation:** Server sends session ID in HTTP cookie to client
4. **Subsequent Requests:** Client sends session cookie with each request
5. **Session Validation:** Server validates session ID and retrieves user data
6. **Session Expiration:** Sessions can be configured to expire after a period of inactivity

### **Advantages:**
- **Simple Implementation:** Easy to understand and implement
- **Automatic Cleanup:** Sessions can be invalidated server-side
- **Framework Support:** Built-in support in most web frameworks

### **Disadvantages:**
- **Server State:** Requires server-side storage for session data
- **Scalability:** Can be challenging to scale across multiple servers
- **CSRF Vulnerability:** Requires additional protection against CSRF attacks

## **3. JWT (JSON Web Tokens)**

JSON Web Tokens are a compact, URL-safe means of representing claims between two parties. They are commonly used for authentication and information exchange in web applications.

### **JWT Components:**
- **Header:** Contains algorithm and token type
- **Payload:** Contains claims (user data, expiration, etc.)
- **Signature:** Verifies the token's integrity

### **JWT Authentication Flow:**
1. **User Login:** Client sends credentials to server
2. **Token Generation:** Server validates credentials and generates JWT
3. **Token Storage:** Client stores token (localStorage, cookies, etc.)
4. **Token Transmission:** Client includes token in Authorization header
5. **Token Verification:** Server verifies token and extracts user information
6. **Request Processing:** Server processes request with authenticated user context

### **Advantages:**
- **Stateless:** No server-side session storage required
- **Scalable:** Easy to scale across multiple servers
- **Cross-Domain:** Can be used across different domains
- **Mobile-Friendly:** Works well with mobile applications

### **Disadvantages:**
- **Token Size:** Can be larger than session IDs
- **Revocation:** Difficult to revoke tokens before expiration
- **Storage Security:** Requires secure client-side storage

## **4. Password Security**

Password security is crucial for protecting user accounts and preventing unauthorized access. Proper password handling involves secure storage, validation, and protection against common attacks.

### **Password Security Principles:**
- **Strong Hashing:** Use cryptographically secure hashing algorithms
- **Salt Usage:** Add random salt to prevent rainbow table attacks
- **Work Factor:** Use appropriate computational cost for hashing
- **Regular Updates:** Update hashing parameters as hardware improves

### **Common Password Attacks:**
- **Brute Force:** Systematic guessing of passwords
- **Dictionary Attacks:** Using common words and phrases
- **Rainbow Table:** Pre-computed hash tables for common passwords
- **Credential Stuffing:** Using leaked credentials from other sites

## **5. OAuth and Social Login**

OAuth is an open standard for access delegation, commonly used for social login and third-party API access. It allows users to grant third-party applications limited access to their resources without sharing credentials.

### **OAuth 2.0 Roles:**
- **Resource Owner:** The user who owns the protected resources
- **Client:** The application requesting access to resources
- **Authorization Server:** Issues access tokens after authentication
- **Resource Server:** Hosts the protected resources

### **OAuth 2.0 Grant Types:**
- **Authorization Code:** Most secure, used for web applications
- **Implicit:** Simplified flow for client-side applications
- **Resource Owner Password Credentials:** Direct username/password exchange
- **Client Credentials:** Machine-to-machine authentication

## **6. Role-Based Access Control (RBAC)**

RBAC is a security model that restricts system access based on user roles and permissions. It simplifies access management by grouping permissions into roles that can be assigned to users.

### **RBAC Components:**
- **Users:** Individuals who interact with the system
- **Roles:** Collections of permissions that define what users can do
- **Permissions:** Specific actions or operations that can be performed
- **Sessions:** Temporary activation of user roles

### **RBAC Principles:**
- **Role Assignment:** Users are assigned to roles based on job functions
- **Role Authorization:** Roles are authorized to perform specific operations
- **Permission Assignment:** Permissions are assigned to roles, not directly to users
- **Separation of Duties:** Ensures no single user has conflicting responsibilities

## **7. Security Best Practices**

Implementing security best practices is essential for protecting applications and user data from various threats and vulnerabilities.

### **Authentication Security:**
- **Multi-Factor Authentication:** Add additional verification layers
- **Account Lockout:** Temporarily lock accounts after failed attempts
- **Password Policies:** Enforce strong password requirements
- **Session Management:** Implement proper session handling and timeouts

### **Input Security:**
- **Input Validation:** Validate all user inputs on client and server
- **Data Sanitization:** Clean user inputs to prevent injection attacks
- **Output Encoding:** Properly encode data before displaying
- **Content Security Policy:** Prevent XSS attacks with CSP headers

### **Network Security:**
- **HTTPS Everywhere:** Use SSL/TLS encryption for all communications
- **Secure Cookies:** Set appropriate cookie security flags
- **CORS Configuration:** Properly configure cross-origin resource sharing
- **Rate Limiting:** Prevent abuse with request rate limiting

## **8. Frontend Authentication**

Frontend authentication involves managing user authentication state in client-side applications and communicating with backend authentication services.

### **Frontend Authentication Patterns:**
- **Token Storage:** Secure storage of authentication tokens
- **State Management:** Managing authentication state across the application
- **Route Protection:** Preventing unauthorized access to protected routes
- **Automatic Refresh:** Handling token expiration and refresh
- **Error Handling:** Graceful handling of authentication errors

### **Client-Side Security Considerations:**
- **Secure Storage:** Use secure methods for storing sensitive data
- **XSS Protection:** Prevent cross-site scripting attacks
- **CSRF Protection:** Implement CSRF tokens for state-changing operations
- **Secure Communication:** Always use HTTPS for authentication requests

## **9. Code Examples**

### **Example 1: Session-Based Authentication**

```javascript
const express = require('express');
const session = require('express-session');
const app = express();

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Use true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate credentials (simplified)
    if (username === 'admin' && password === 'password') {
        req.session.userId = 1;
        req.session.username = username;
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Protected route
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Please login first' });
    }

    res.json({
        message: `Welcome ${req.session.username}!`,
        userId: req.session.userId
    });
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.json({ message: 'Logout successful' });
    });
});
```

### **Example 2: JWT Authentication**

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
}

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user and verify password
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

// Protected route
app.get('/profile', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    res.json({ user });
});
```

### **Example 3: Password Security**

```javascript
const bcrypt = require('bcrypt');

// Hash password
async function hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

// Verify password
async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

// Usage in user model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }
    next();
});

// Instance method to verify password
userSchema.methods.verifyPassword = async function(candidatePassword) {
    return await verifyPassword(candidatePassword, this.password);
});

// Password validation
function validatePassword(password) {
    const errors = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return errors;
}
```

### **Example 4: OAuth with Google**

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create user
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value
            });
            await user.save();
        }

        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/dashboard');
    }
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
```

### **Example 5: Role-Based Access Control**

```javascript
const ROLES = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user',
    GUEST: 'guest'
};

const PERMISSIONS = {
    READ_POSTS: 'read_posts',
    WRITE_POSTS: 'write_posts',
    DELETE_POSTS: 'delete_posts',
    MANAGE_USERS: 'manage_users',
    VIEW_ANALYTICS: 'view_analytics'
};

const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        PERMISSIONS.READ_POSTS,
        PERMISSIONS.WRITE_POSTS,
        PERMISSIONS.DELETE_POSTS,
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.VIEW_ANALYTICS
    ],
    [ROLES.MODERATOR]: [
        PERMISSIONS.READ_POSTS,
        PERMISSIONS.WRITE_POSTS,
        PERMISSIONS.DELETE_POSTS
    ],
    [ROLES.USER]: [
        PERMISSIONS.READ_POSTS,
        PERMISSIONS.WRITE_POSTS
    ],
    [ROLES.GUEST]: [
        PERMISSIONS.READ_POSTS
    ]
};

// Authorization middleware
function authorize(permission) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];

        if (!userPermissions.includes(permission)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

        next();
    };
}

// Usage
app.get('/admin/users',
    authenticateToken,
    authorize(PERMISSIONS.MANAGE_USERS),
    async (req, res) => {
        const users = await User.find();
        res.json(users);
    }
);

app.post('/posts',
    authenticateToken,
    authorize(PERMISSIONS.WRITE_POSTS),
    async (req, res) => {
        const post = new Post({
            ...req.body,
            author: req.user.userId
        });
        await post.save();
        res.status(201).json(post);
    }
);
```

### **Example 6: Security Best Practices**

```javascript
const validator = require('validator');
const xss = require('xss');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Input validation middleware
function validateUserInput(req, res, next) {
    const { username, email, password } = req.body;

    const errors = [];

    // Validate username
    if (!username || username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }

    // Validate email
    if (!email || !validator.isEmail(email)) {
        errors.push('Valid email is required');
    }

    // Validate password
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Sanitize inputs
    req.body.username = validator.escape(username);
    req.body.email = validator.normalizeEmail(email);

    next();
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit login attempts
    message: 'Too many login attempts, please try again later'
});

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            'https://yourapp.com'
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// Apply middleware
app.use(cors(corsOptions));
app.use('/api/', limiter);
app.use('/login', authLimiter);
app.use('/register', authLimiter);
```

### **Example 7: React Authentication Context**

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token with backend
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setUser(data.user);
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
```

### **Example 8: Protected Route Component**

```jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

// Usage
function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}
```

## **9. Code Examples**

### **Example 1: Complete Authentication System**

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts, please try again later'
});

app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);

// User model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    isActive: { type: Boolean, default: true },
    lastLogin: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.verifyPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

function authorize(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
}

// Routes
app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email or username already exists'
            });
        }

        // Create user
        const user = new User({ username, email, password });
        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await user.verifyPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/auth/verify', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Protected routes
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/admin/users', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### **Example 2: React Authentication with Protected Routes**

```jsx
// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await fetch('/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setUser(data.user);
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setUser(data.user);
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

// Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Login() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(credentials);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;
```

## **10. Assignments and Projects**

### **Assignment 13.1: Basic Authentication**
Create a login and registration system with:
- User registration with validation
- Password hashing
- JWT token generation
- Protected routes
- Logout functionality

### **Assignment 13.2: Role-Based Authorization**
Implement role-based access control with:
- User roles (admin, moderator, user)
- Permission-based access
- Protected routes by role
- Admin dashboard

### **Project 13: Secure Blog Platform**
Build a blog platform with authentication featuring:
- User registration and login
- JWT-based authentication
- Role-based permissions
- Protected CRUD operations
- User profiles and settings

### **Challenge Project: Social Media Authentication**
Create an application with multiple authentication methods:
- Traditional email/password
- OAuth with Google and GitHub
- Social login integration
- Account linking
- Profile management

## **11. Best Practices**

### **Security:**
- Always hash passwords
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Use secure session settings
- Regularly update dependencies

### **User Experience:**
- Clear error messages
- Loading states
- Remember login state
- Password reset functionality
- Account verification

### **Performance:**
- Cache authentication results
- Use efficient database queries
- Implement token refresh
- Optimize session storage

## **12. Resources**

- [JWT.io](https://jwt.io/) - JWT debugger and library
- [OAuth 2.0](https://oauth.net/2/) - OAuth specification
- [Passport.js](http://www.passportjs.org/) - Authentication middleware
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing

## **13. Next Steps**

In the next lesson, we'll explore testing methodologies for full-stack applications. You'll learn about:
- Unit testing with Jest
- Integration testing
- End-to-end testing with Cypress
- Test-driven development (TDD)
- Testing best practices

Practice implementing authentication in your applications and experiment with different authorization patterns!
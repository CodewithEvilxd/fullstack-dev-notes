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

## **14. Advanced Authentication Patterns and Security**

### **JWT Token Management and Security**

#### **Advanced JWT Implementation with Refresh Tokens**
```javascript
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// JWT Manager class for advanced token handling
class JWTManager {
  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    this.accessTokenExpiry = '15m';
    this.refreshTokenExpiry = '7d';
  }

  // Generate access token with enhanced claims
  generateAccessToken(payload) {
    const enhancedPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      iss: 'your-app-name',
      aud: 'your-app-audience',
      jti: crypto.randomUUID() // Unique token ID for tracking
    };

    return jwt.sign(enhancedPayload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      algorithm: 'HS256'
    });
  }

  // Generate refresh token with rotation
  generateRefreshToken(payload) {
    const refreshPayload = {
      userId: payload.userId,
      tokenVersion: payload.tokenVersion || 1,
      jti: crypto.randomUUID()
    };

    return jwt.sign(refreshPayload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      algorithm: 'HS256'
    });
  }

  // Generate token pair
  generateTokenPair(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      tokenVersion: user.tokenVersion || 1
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60 * 1000, // 15 minutes in milliseconds
      tokenType: 'Bearer'
    };
  }

  // Verify access token with enhanced validation
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'your-app-name',
        audience: 'your-app-audience',
        algorithms: ['HS256']
      });

      // Check if token is blacklisted (for logout scenarios)
      if (this.isTokenBlacklisted(decoded.jti)) {
        throw new Error('Token has been revoked');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret, {
        algorithms: ['HS256']
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Token rotation for enhanced security
  async rotateTokens(refreshToken, user) {
    // Verify refresh token
    const decoded = this.verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database and matches user
    const storedToken = await RefreshToken.findOne({
      userId: decoded.userId,
      tokenHash: crypto.createHash('sha256').update(refreshToken).digest('hex'),
      revoked: false
    });

    if (!storedToken) {
      throw new Error('Refresh token not found or revoked');
    }

    // Revoke old refresh token
    storedToken.revoked = true;
    await storedToken.save();

    // Generate new token pair
    const tokens = this.generateTokenPair(user);

    // Store new refresh token
    const newRefreshTokenHash = crypto.createHash('sha256')
      .update(tokens.refreshToken)
      .digest('hex');

    await RefreshToken.create({
      userId: user.id,
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return tokens;
  }

  // Blacklist token (for immediate logout)
  async blacklistToken(tokenId) {
    // Store in Redis or database for quick lookup
    await TokenBlacklist.create({
      tokenId,
      blacklistedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
  }

  // Check if token is blacklisted
  async isTokenBlacklisted(tokenId) {
    const blacklisted = await TokenBlacklist.findOne({
      tokenId,
      expiresAt: { $gt: new Date() }
    });
    return !!blacklisted;
  }

  // Decode token without verification (for debugging)
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      return null;
    }
  }
}

// Refresh token model
const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true
  },
  revoked: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Token blacklist model
const tokenBlacklistSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  blacklistedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
```

#### **Multi-Factor Authentication (MFA)**
```javascript
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// TOTP (Time-based One-Time Password) implementation
class MFAController {
  constructor() {
    this.issuer = 'YourApp';
    this.algorithm = 'sha1';
    this.digits = 6;
    this.period = 30; // 30 seconds
  }

  // Generate TOTP secret for user
  generateTOTPSecret(userId) {
    const secret = speakeasy.generateSecret({
      name: `${this.issuer}:${userId}`,
      issuer: this.issuer,
      length: 32
    });

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url
    };
  }

  // Generate QR code for TOTP setup
  async generateQRCode(otpauthUrl) {
    try {
      const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl);
      return qrCodeDataURL;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  // Verify TOTP token
  verifyTOTP(secret, token) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2, // Allow 2 time windows (1 minute)
      algorithm: this.algorithm,
      digits: this.digits,
      step: this.period
    });
  }

  // Generate backup codes
  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  // Hash backup codes for storage
  hashBackupCodes(codes) {
    return codes.map(code =>
      crypto.createHash('sha256').update(code).digest('hex')
    );
  }

  // Verify backup code
  verifyBackupCode(hashedCodes, code) {
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    const index = hashedCodes.indexOf(hashedCode);

    if (index === -1) {
      return false;
    }

    // Remove used backup code
    hashedCodes.splice(index, 1);
    return true;
  }
}

// MFA-enabled authentication middleware
function requireMFA(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user has MFA enabled
  if (!req.user.mfaEnabled) {
    return next(); // Skip MFA if not enabled
  }

  // Check if MFA has been verified in this session
  if (req.session.mfaVerified) {
    return next();
  }

  // MFA required but not verified
  return res.status(403).json({
    error: 'Multi-factor authentication required',
    mfaRequired: true,
    mfaMethod: req.user.mfaMethod
  });
}

// MFA verification endpoint
app.post('/auth/verify-mfa', authenticateToken, async (req, res) => {
  try {
    const { token, method } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let verified = false;

    if (method === 'totp') {
      const mfa = new MFAController();
      verified = mfa.verifyTOTP(user.mfaSecret, token);
    } else if (method === 'backup') {
      const mfa = new MFAController();
      verified = mfa.verifyBackupCode(user.backupCodes, token);

      // Update backup codes if one was used
      if (verified) {
        await User.findByIdAndUpdate(user._id, {
          backupCodes: user.backupCodes
        });
      }
    }

    if (!verified) {
      return res.status(401).json({ error: 'Invalid MFA token' });
    }

    // Mark MFA as verified for this session
    req.session.mfaVerified = true;

    res.json({ message: 'MFA verification successful' });
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ error: 'MFA verification failed' });
  }
});

// Setup MFA endpoint
app.post('/auth/setup-mfa', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const mfa = new MFAController();

    // Generate TOTP secret
    const { secret, otpauthUrl } = mfa.generateTOTPSecret(user._id.toString());

    // Generate QR code
    const qrCode = await mfa.generateQRCode(otpauthUrl);

    // Generate backup codes
    const backupCodes = mfa.generateBackupCodes();
    const hashedBackupCodes = mfa.hashBackupCodes(backupCodes);

    // Store in database (don't store plain backup codes)
    user.mfaSecret = secret;
    user.backupCodes = hashedBackupCodes;
    user.mfaEnabled = false; // Will be enabled after verification
    await user.save();

    res.json({
      secret: secret,
      qrCode: qrCode,
      backupCodes: backupCodes, // Send plain codes to user once
      message: 'Scan QR code with authenticator app and verify setup'
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    res.status(500).json({ error: 'MFA setup failed' });
  }
});

// Verify MFA setup
app.post('/auth/verify-mfa-setup', authenticateToken, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.userId);
    const mfa = new MFAController();

    const verified = mfa.verifyTOTP(user.mfaSecret, token);

    if (!verified) {
      return res.status(401).json({ error: 'Invalid verification token' });
    }

    // Enable MFA
    user.mfaEnabled = true;
    user.mfaMethod = 'totp';
    await user.save();

    res.json({ message: 'MFA setup completed successfully' });
  } catch (error) {
    console.error('MFA setup verification error:', error);
    res.status(500).json({ error: 'MFA setup verification failed' });
  }
});
```

#### **OAuth 2.0 and OpenID Connect Implementation**
```javascript
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const { Issuer, Strategy: OpenIDStrategy } = require('openid-client');

// OAuth 2.0 Client Configuration
class OAuthClient {
  constructor(config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.authorizationURL = config.authorizationURL;
    this.tokenURL = config.tokenURL;
    this.callbackURL = config.callbackURL;
    this.scope = config.scope || ['openid', 'profile', 'email'];
  }

  // Initialize OAuth 2.0 strategy
  initialize() {
    passport.use('oauth2', new OAuth2Strategy({
      authorizationURL: this.authorizationURL,
      tokenURL: this.tokenURL,
      clientID: this.clientId,
      clientSecret: this.clientSecret,
      callbackURL: this.callbackURL,
      scope: this.scope
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Fetch user profile from OAuth provider
        const userProfile = await this.fetchUserProfile(accessToken);

        // Find or create user in your database
        let user = await User.findOne({
          oauthId: userProfile.id,
          oauthProvider: 'oauth2'
        });

        if (!user) {
          user = new User({
            oauthId: userProfile.id,
            oauthProvider: 'oauth2',
            email: userProfile.email,
            name: userProfile.name,
            avatar: userProfile.avatar,
            oauthTokens: {
              accessToken,
              refreshToken
            }
          });
          await user.save();
        } else {
          // Update tokens
          user.oauthTokens = { accessToken, refreshToken };
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }));
  }

  // Fetch user profile from OAuth provider
  async fetchUserProfile(accessToken) {
    // This would vary based on the OAuth provider
    // Example for a generic OAuth 2.0 provider
    const response = await fetch('https://oauth-provider.com/api/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  }
}

// OpenID Connect Implementation
class OpenIDClient {
  constructor(config) {
    this.issuerUrl = config.issuerUrl;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
  }

  async initialize() {
    // Discover OpenID provider configuration
    const issuer = await Issuer.discover(this.issuerUrl);

    const client = new issuer.Client({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uris: [this.redirectUri],
      response_types: ['code']
    });

    // Initialize OpenID strategy
    passport.use('openid', new OpenIDStrategy({
      client,
      params: {
        scope: 'openid profile email'
      }
    },
    async (tokenset, userinfo, done) => {
      try {
        // Extract user information
        const userProfile = {
          id: userinfo.sub,
          email: userinfo.email,
          name: userinfo.name,
          givenName: userinfo.given_name,
          familyName: userinfo.family_name,
          avatar: userinfo.picture
        };

        // Find or create user
        let user = await User.findOne({
          openidSub: userProfile.id,
          openidIssuer: this.issuerUrl
        });

        if (!user) {
          user = new User({
            openidSub: userProfile.id,
            openidIssuer: this.issuerUrl,
            email: userProfile.email,
            name: userProfile.name,
            avatar: userProfile.avatar,
            openidTokens: {
              accessToken: tokenset.access_token,
              refreshToken: tokenset.refresh_token,
              idToken: tokenset.id_token
            }
          });
          await user.save();
        } else {
          // Update tokens
          user.openidTokens = {
            accessToken: tokenset.access_token,
            refreshToken: tokenset.refresh_token,
            idToken: tokenset.id_token
          };
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }));

    return client;
  }
}

// Social Login Manager
class SocialLoginManager {
  constructor() {
    this.providers = new Map();
  }

  // Register OAuth provider
  registerProvider(name, provider) {
    this.providers.set(name, provider);
  }

  // Get authorization URL
  getAuthorizationUrl(providerName, options = {}) {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not registered`);
    }

    return provider.getAuthorizationUrl(options);
  }

  // Handle callback
  async handleCallback(providerName, code, state) {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not registered`);
    }

    return await provider.handleCallback(code, state);
  }

  // Get user profile
  async getUserProfile(providerName, accessToken) {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not registered`);
    }

    return await provider.getUserProfile(accessToken);
  }
}

// Usage example
const socialLogin = new SocialLoginManager();

// Register Google OAuth
socialLogin.registerProvider('google', new OAuthClient({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenURL: 'https://oauth2.googleapis.com/token',
  callbackURL: '/auth/google/callback',
  scope: ['openid', 'profile', 'email']
}));

// Register GitHub OAuth
socialLogin.registerProvider('github', new OAuthClient({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  authorizationURL: 'https://github.com/login/oauth/authorize',
  tokenURL: 'https://github.com/login/oauth/access_token',
  callbackURL: '/auth/github/callback',
  scope: ['user:email', 'read:user']
}));

// Routes
app.get('/auth/:provider', (req, res) => {
  const { provider } = req.params;
  const authUrl = socialLogin.getAuthorizationUrl(provider, {
    state: crypto.randomBytes(32).toString('hex') // CSRF protection
  });
  res.redirect(authUrl);
});

app.get('/auth/:provider/callback', async (req, res) => {
  try {
    const { provider } = req.params;
    const { code, state } = req.query;

    // Verify state parameter for CSRF protection
    if (!state || state !== req.session.oauthState) {
      return res.status(400).json({ error: 'Invalid state parameter' });
    }

    const tokens = await socialLogin.handleCallback(provider, code, state);
    const userProfile = await socialLogin.getUserProfile(provider, tokens.accessToken);

    // Create or update user
    let user = await User.findOne({
      [`${provider}Id`]: userProfile.id
    });

    if (!user) {
      user = new User({
        [`${provider}Id`]: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        avatar: userProfile.avatar,
        authProvider: provider
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Authentication successful',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});
```

#### **Advanced Security Patterns**
```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Security middleware stack
class SecurityMiddleware {
  static applySecurityHeaders(app) {
    // Helmet for security headers
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.example.com"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }));
  }

  static applyRateLimiting(app) {
    // General API rate limiting
    const apiLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per window
      message: {
        error: 'Too many requests from this IP',
        retryAfter: Math.ceil(15 * 60)
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
      }
    });

    // Auth-specific rate limiting
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too many authentication attempts',
      skipSuccessfulRequests: true
    });

    // Password reset rate limiting
    const passwordResetLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3,
      message: 'Too many password reset attempts'
    });

    // Progressive delay for brute force protection
    const speedLimiter = slowDown({
      windowMs: 15 * 60 * 1000,
      delayAfter: 10,
      delayMs: 500,
      maxDelayMs: 20000
    });

    app.use('/api/', apiLimiter);
    app.use('/auth/login', authLimiter);
    app.use('/auth/register', authLimiter);
    app.use('/auth/forgot-password', passwordResetLimiter);
    app.use('/auth/', speedLimiter);
  }

  static applyInputValidation(app) {
    // Data sanitization
    app.use(mongoSanitize()); // Prevent MongoDB injection
    app.use(hpp()); // Prevent HTTP parameter pollution
    app.use(xss()); // Prevent XSS attacks

    // CORS configuration
    const cors = require('cors');
    app.use(cors({
      origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200
    }));
  }

  static applySecurityMonitoring(app) {
    // Request logging with security focus
    app.use((req, res, next) => {
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date().toISOString()
        };

        // Log suspicious activities
        if (res.statusCode === 401 || res.statusCode === 403) {
          console.warn('Security event:', logData);
        } else if (duration > 10000) { // Slow requests might indicate attacks
          console.warn('Slow request:', logData);
        } else {
          console.log('Request:', logData);
        }
      });

      next();
    });
  }

  // Apply all security middleware
  static applyAll(app) {
    this.applySecurityHeaders(app);
    this.applyRateLimiting(app);
    this.applyInputValidation(app);
    this.applySecurityMonitoring(app);
  }
}

// Security audit logging
class SecurityAuditor {
  constructor() {
    this.auditLog = [];
  }

  logSecurityEvent(event) {
    const auditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...event
    };

    this.auditLog.push(auditEntry);

    // In production, send to security monitoring service
    console.log('Security Audit:', auditEntry);

    // Keep only last 1000 entries
    if (this.auditLog.length > 1000) {
      this.auditLog.shift();
    }
  }

  logFailedLogin(credentials, ip, userAgent) {
    this.logSecurityEvent({
      type: 'FAILED_LOGIN',
      credentials: { ...credentials, password: '[REDACTED]' },
      ip,
      userAgent,
      severity: 'medium'
    });
  }

  logSuccessfulLogin(user, ip, userAgent) {
    this.logSecurityEvent({
      type: 'SUCCESSFUL_LOGIN',
      userId: user.id,
      email: user.email,
      ip,
      userAgent,
      severity: 'low'
    });
  }

  logSuspiciousActivity(activity, ip, userAgent) {
    this.logSecurityEvent({
      type: 'SUSPICIOUS_ACTIVITY',
      activity,
      ip,
      userAgent,
      severity: 'high'
    });
  }

  getAuditLog(hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.auditLog.filter(entry =>
      new Date(entry.timestamp) > cutoff
    );
  }
}

// Usage
const securityAuditor = new SecurityAuditor();

// Apply security middleware
SecurityMiddleware.applyAll(app);

// Audit login attempts
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip;
  const userAgent = req.get('User-Agent');

  try {
    // Authentication logic
    const user = await authenticateUser(email, password);

    if (user) {
      securityAuditor.logSuccessfulLogin(user, ip, userAgent);
      // Generate token and respond
    } else {
      securityAuditor.logFailedLogin({ email }, ip, userAgent);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    securityAuditor.logFailedLogin({ email }, ip, userAgent);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Suspicious activity detection
app.use((req, res, next) => {
  // Detect potential SQL injection attempts
  const suspiciousPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\\#)|(\%27)|(\%22)|(\%23))/i
  ];

  const requestData = JSON.stringify({
    url: req.url,
    body: req.body,
    query: req.query,
    headers: req.headers
  });

  const isSuspicious = suspiciousPatterns.some(pattern =>
    pattern.test(requestData)
  );

  if (isSuspicious) {
    securityAuditor.logSuspiciousActivity(
      'Potential injection attempt',
      req.ip,
      req.get('User-Agent')
    );
  }

  next();
});
```

## **14. Resources**

- [JWT.io](https://jwt.io/) - JWT debugger and library
- [OAuth 2.0](https://oauth.net/2/) - OAuth specification
- [OpenID Connect](https://openid.net/connect/) - OpenID Connect specification
- [Passport.js](http://www.passportjs.org/) - Authentication middleware
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
- [speakeasy](https://www.npmjs.com/package/speakeasy) - TOTP implementation
- [helmet](https://helmetjs.github.io/) - Security headers
- [OWASP](https://owasp.org/) - Web application security

## **15. Next Steps**

In the next lesson, we'll explore testing methodologies for full-stack applications. You'll learn about:
- Unit testing with Jest
- Integration testing
- End-to-end testing with Cypress
- Test-driven development (TDD)
- Testing best practices

Practice implementing authentication in your applications and experiment with different authorization patterns!

---

This comprehensive authentication guide covers everything from basic JWT implementation to advanced security patterns including MFA, OAuth 2.0, OpenID Connect, and enterprise-grade security measures. The examples are production-ready and follow current security best practices for professional authentication systems.
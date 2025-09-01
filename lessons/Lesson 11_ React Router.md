### **Lesson 11: React Router - Client-Side Routing**

## **1. What is React Router?**

React Router is the de facto standard routing library for React applications. It enables navigation between different components in a React app, synchronizes the UI with the URL, and provides a seamless single-page application (SPA) experience.

### **Key Features:**

#### **Core Features:**
- **Declarative Routing:** Define routes using JSX components
- **Nested Routes:** Create complex route hierarchies
- **Dynamic Routing:** Handle dynamic parameters and queries
- **Code Splitting:** Lazy load route components
- **History Management:** Control browser history programmatically
- **Navigation Guards:** Protect routes and handle authentication

#### **Advanced Features:**
- **Route Preloading:** Preload route components for better UX
- **Route Transitions:** Smooth transitions between routes
- **Route-based Code Splitting:** Automatic code splitting by routes
- **Route Meta Fields:** Attach metadata to routes
- **Route Resolvers:** Load data before route activation
- **Route Guards with Context:** Advanced authentication patterns
- **Scroll Restoration:** Restore scroll position on navigation
- **Route-based Error Boundaries:** Error handling per route

### **Why React Router?**

- Official routing solution for React
- Large ecosystem and community support
- Flexible and powerful routing capabilities
- Works with React's component model
- Supports server-side rendering
- Active development and maintenance

## **2. Installation and Setup**

### **Installing React Router:**

```bash
npm install react-router-dom
```

### **Basic Setup:**

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/users" element={<Users />} />
            </Routes>
        </BrowserRouter>
    );
}
```

## **3. Core Components**

### **Router Types and Advanced Setup:**

#### **BrowserRouter (HTML5 History API):**
```jsx
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter
            basename="/my-app"  // For apps served from subdirectory
            forceRefresh={false} // Set to true for server-side routing
            getUserConfirmation={(message, callback) => {
                // Custom confirmation dialog
                const allowTransition = window.confirm(message);
                callback(allowTransition);
            }}
        >
            {/* Your routes go here */}
        </BrowserRouter>
    );
}
```

#### **HashRouter (Hash-based routing):**
```jsx
import { HashRouter } from 'react-router-dom';

function App() {
    return (
        <HashRouter
            basename="/my-app"
            getUserConfirmation={(message, callback) => {
                callback(window.confirm(message));
            }}
            hashType="slash" // Can be "slash", "noslash", "hashbang"
        >
            {/* Your routes go here */}
        </HashRouter>
    );
}
```

#### **MemoryRouter (For testing and non-browser environments):**
```jsx
import { MemoryRouter } from 'react-router-dom';

function TestApp() {
    return (
        <MemoryRouter
            initialEntries={['/home', '/about', '/users/1']}
            initialIndex={0}
        >
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/users/:id" element={<User />} />
            </Routes>
        </MemoryRouter>
    );
}
```

#### **StaticRouter (For server-side rendering):**
```jsx
import { StaticRouter } from 'react-router-dom';

function ServerApp({ location, context }) {
    return (
        <StaticRouter
            location={location}
            context={context}
        >
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </StaticRouter>
    );
}
```

#### **Router Composition and Advanced Patterns:**

##### **Router Provider Pattern:**
```jsx
// Router configuration
const routerConfig = {
    basename: process.env.PUBLIC_URL,
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
    }
};

// Router provider component
function RouterProvider({ children }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Perform any initialization logic here
        // e.g., check authentication, load user preferences
        setIsReady(true);
    }, []);

    if (!isReady) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter {...routerConfig}>
            {children}
        </BrowserRouter>
    );
}

// Usage
function App() {
    return (
        <RouterProvider>
            <AppRoutes />
        </RouterProvider>
    );
}
```

##### **Route Configuration Object:**
```jsx
// Route configuration with metadata
const routeConfig = [
    {
        path: '/',
        element: <Home />,
        title: 'Home',
        requiresAuth: false,
        roles: [],
        meta: {
            showInNav: true,
            icon: 'home'
        }
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        title: 'Dashboard',
        requiresAuth: true,
        roles: ['user', 'admin'],
        meta: {
            showInNav: true,
            icon: 'dashboard'
        }
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        title: 'Admin',
        requiresAuth: true,
        roles: ['admin'],
        meta: {
            showInNav: false,
            icon: 'admin'
        },
        children: [
            {
                path: 'users',
                element: <AdminUsers />,
                title: 'User Management',
                meta: { showInNav: true }
            },
            {
                path: 'settings',
                element: <AdminSettings />,
                title: 'Settings',
                meta: { showInNav: true }
            }
        ]
    }
];

// Recursive route renderer
function renderRoutes(routes, user = null) {
    return routes.map(route => {
        // Check authentication
        if (route.requiresAuth && !user) {
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<Navigate to="/login" replace />}
                />
            );
        }

        // Check roles
        if (route.roles.length > 0 && !route.roles.includes(user?.role)) {
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<Navigate to="/unauthorized" replace />}
                />
            );
        }

        // Render route with children
        if (route.children) {
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                >
                    {renderRoutes(route.children, user)}
                </Route>
            );
        }

        return (
            <Route
                key={route.path}
                path={route.path}
                element={route.element}
            />
        );
    });
}

// Usage
function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            {renderRoutes(routeConfig, user)}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
```

##### **Route Preloading:**
```jsx
// Preload component
function preloadComponent(importFunc) {
    const Component = lazy(importFunc);

    // Preload the component
    Component.preload = importFunc;

    return Component;
}

// Usage
const Home = preloadComponent(() => import('./pages/Home'));
const About = preloadComponent(() => import('./pages/About'));

// Preload on hover
function NavLink({ to, children, preloadComponent }) {
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        if (preloadComponent?.preload) {
            preloadComponent.preload();
        }
    };

    return (
        <Link
            to={to}
            onMouseEnter={handleMouseEnter}
            onClick={(e) => {
                e.preventDefault();
                navigate(to);
            }}
        >
            {children}
        </Link>
    );
}

// Automatic preloading based on user interaction
function useRoutePreloader(routes) {
    const [preloadedRoutes, setPreloadedRoutes] = useState(new Set());

    const preloadRoute = useCallback((routePath) => {
        if (preloadedRoutes.has(routePath)) return;

        const route = routes.find(r => r.path === routePath);
        if (route?.preload) {
            route.preload();
            setPreloadedRoutes(prev => new Set([...prev, routePath]));
        }
    }, [routes, preloadedRoutes]);

    // Preload routes on visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Preload critical routes when tab becomes visible
                routes.filter(r => r.critical).forEach(r => preloadRoute(r.path));
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [routes, preloadRoute]);

    return { preloadRoute, preloadedRoutes };
}
```

##### **Route Transitions and Animations:**
```jsx
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// Route transition wrapper
function RouteTransition({ children, location }) {
    return (
        <TransitionGroup>
            <CSSTransition
                key={location.key}
                classNames="page"
                timeout={300}
            >
                {children}
            </CSSTransition>
        </TransitionGroup>
    );
}

// Usage with React Router
function App() {
    const location = useLocation();

    return (
        <div className="app">
            <RouteTransition location={location}>
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </RouteTransition>
        </div>
    );
}

// CSS transitions
// Add to your CSS file
.page-enter {
    opacity: 0;
    transform: translateX(100%);
}

.page-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
}

.page-exit {
    opacity: 1;
    transform: translateX(0);
}

.page-exit-active {
    opacity: 0;
    transform: translateX(-100%);
    transition: opacity 300ms, transform 300ms;
}
```

##### **Route-based Error Boundaries:**
```jsx
class RouteErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to monitoring service
        console.error('Route error:', error, errorInfo);

        // You can send this to an error reporting service
        // errorReportingService.captureException(error, { extra: errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="route-error">
                    <h2>Something went wrong</h2>
                    <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
                    <button onClick={this.handleRetry}>Try Again</button>
                    <details>
                        <summary>Error Details</summary>
                        <pre>{this.state.error?.stack}</pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

// Usage
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <RouteErrorBoundary>
                            <Home />
                        </RouteErrorBoundary>
                    }
                />
                <Route
                    path="/dashboard/*"
                    element={
                        <RouteErrorBoundary>
                            <Dashboard />
                        </RouteErrorBoundary>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
```

##### **Scroll Restoration:**
```jsx
// Scroll restoration hook
function useScrollRestoration() {
    const location = useLocation();

    useEffect(() => {
        // Save scroll position when leaving
        const saveScrollPosition = () => {
            sessionStorage.setItem(
                `scrollPosition_${location.pathname}`,
                JSON.stringify({ x: window.scrollX, y: window.scrollY })
            );
        };

        // Restore scroll position when entering
        const restoreScrollPosition = () => {
            const savedPosition = sessionStorage.getItem(
                `scrollPosition_${location.pathname}`
            );

            if (savedPosition) {
                const { x, y } = JSON.parse(savedPosition);
                window.scrollTo(x, y);
            }
        };

        // Small delay to ensure DOM is ready
        const timeoutId = setTimeout(restoreScrollPosition, 100);

        // Save position on beforeunload
        window.addEventListener('beforeunload', saveScrollPosition);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('beforeunload', saveScrollPosition);
        };
    }, [location.pathname]);
}

// Usage
function App() {
    useScrollRestoration();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
        </Routes>
    );
}

// Alternative: Using React Router's built-in scroll restoration
import { ScrollRestoration } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <ScrollRestoration />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}
```

##### **Route Resolvers and Data Loading:**
```jsx
// Route resolver hook
function useRouteResolver(resolver) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const resolveData = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await resolver(location);
                if (isMounted) {
                    setData(result);
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

        resolveData();

        return () => {
            isMounted = false;
        };
    }, [resolver, location]);

    return { data, loading, error };
}

// Route component with data loading
function UserProfile() {
    const { id } = useParams();

    const { data: user, loading, error } = useRouteResolver(async (location) => {
        // Simulate API call
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
            throw new Error('Failed to load user');
        }
        return response.json();
    });

    if (loading) return <div>Loading user...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}

// Route guard with data loading
function ProtectedRoute({ children, requiredData }) {
    const { data, loading, error } = useRouteResolver(async () => {
        // Load required data (e.g., user permissions)
        return await loadUserPermissions();
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <Navigate to="/error" replace />;
    if (!data.hasPermission) return <Navigate to="/unauthorized" replace />;

    return children;
}
```

##### **Advanced Navigation Patterns:**

###### **Programmatic Navigation with Search Params:**
```jsx
function useNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateWithParams = useCallback((to, params = {}, options = {}) => {
        const searchParams = new URLSearchParams(location.search);

        // Update search params
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                searchParams.delete(key);
            } else {
                searchParams.set(key, String(value));
            }
        });

        const search = searchParams.toString();
        const url = search ? `${to}?${search}` : to;

        navigate(url, options);
    }, [navigate, location.search]);

    const updateParams = useCallback((params) => {
        navigateWithParams(location.pathname, params, { replace: true });
    }, [navigateWithParams, location.pathname]);

    return { navigateWithParams, updateParams };
}

// Usage
function ProductList() {
    const { navigateWithParams, updateParams } = useNavigation();
    const [searchParams] = useSearchParams();

    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    const handleCategoryChange = (newCategory) => {
        updateParams({ category: newCategory, page: 1 }); // Reset page
    };

    const handleSortChange = (newSort) => {
        updateParams({ sort: newSort });
    };

    return (
        <div>
            <select value={category || ''} onChange={(e) => handleCategoryChange(e.target.value)}>
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
            </select>

            <select value={sort || ''} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
            </select>
        </div>
    );
}
```

###### **Navigation Blocking and Confirmation:**
```jsx
function useNavigationBlocker(shouldBlock, message = "You have unsaved changes. Leave anyway?") {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!shouldBlock) return;

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = message;
            return message;
        };

        const handlePopState = (e) => {
            if (window.confirm(message)) {
                return;
            }
            // Restore the previous URL
            window.history.pushState(null, '', location.pathname + location.search);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [shouldBlock, message, location]);

    const confirmNavigation = useCallback((to, options = {}) => {
        if (shouldBlock && !window.confirm(message)) {
            return false;
        }
        navigate(to, options);
        return true;
    }, [shouldBlock, message, navigate]);

    return { confirmNavigation };
}

// Usage
function EditForm() {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const { confirmNavigation } = useNavigationBlocker(hasUnsavedChanges);

    const handleSave = () => {
        // Save logic
        setHasUnsavedChanges(false);
        confirmNavigation('/dashboard');
    };

    return (
        <form>
            <input
                type="text"
                onChange={() => setHasUnsavedChanges(true)}
                placeholder="Edit something..."
            />
            <button type="button" onClick={handleSave}>Save</button>
            <button
                type="button"
                onClick={() => confirmNavigation('/dashboard')}
            >
                Cancel
            </button>
        </form>
    );
}
```

##### **Route-based Meta Tags and SEO:**
```jsx
function useMetaTags(title, description, keywords = []) {
    useEffect(() => {
        // Update document title
        document.title = title;

        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description;

        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = keywords.join(', ');

        // Update Open Graph tags
        const updateOGTag = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.content = content;
        };

        updateOGTag('og:title', title);
        updateOGTag('og:description', description);
        updateOGTag('og:url', window.location.href);

        // Cleanup function to reset title when component unmounts
        return () => {
            document.title = 'My App'; // Reset to default title
        };
    }, [title, description, keywords]);
}

// Usage in route components
function HomePage() {
    useMetaTags(
        'Home - My Awesome App',
        'Welcome to our amazing application with great features',
        ['home', 'welcome', 'app', 'awesome']
    );

    return <div>Home Page Content</div>;
}

function BlogPost() {
    const { slug } = useParams();

    useMetaTags(
        `Blog Post: ${slug}`,
        'Read this amazing blog post about web development',
        ['blog', 'post', 'web development', slug]
    );

    return <div>Blog Post Content</div>;
}
```

##### **Route-based Analytics and Tracking:**
```jsx
function usePageTracking() {
    const location = useLocation();

    useEffect(() => {
        // Track page view
        if (window.gtag) {
            window.gtag('config', 'GA_TRACKING_ID', {
                page_path: location.pathname + location.search,
            });
        }

        // Track with other analytics services
        if (window.analytics) {
            window.analytics.page(location.pathname);
        }

        // Custom tracking
        console.log('Page viewed:', location.pathname);
    }, [location]);
}

// Route wrapper with tracking
function TrackedRoute({ children, title }) {
    usePageTracking();
    useMetaTags(title, `Page: ${title}`);

    return children;
}

// Usage
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <TrackedRoute title="Home">
                            <Home />
                        </TrackedRoute>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <TrackedRoute title="About Us">
                            <About />
                        </TrackedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
```

### **Routes and Route:**
```jsx
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
```

### **Link and NavLink:**
```jsx
import { Link, NavLink } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <NavLink
                        to="/about"
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        About
                    </NavLink>
                </li>
                <li>
                    <Link to="/users">Users</Link>
                </li>
            </ul>
        </nav>
    );
}
```

## **4. Route Parameters**

### **Path Parameters:**
```jsx
// Route definition
<Route path="/users/:id" element={<UserDetail />} />

// Component usage
import { useParams } from 'react-router-dom';

function UserDetail() {
    const { id } = useParams();
    // id will be the value from the URL

    return <div>User ID: {id}</div>;
}
```

### **Query Parameters:**
```jsx
import { useSearchParams } from 'react-router-dom';

function UserList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const updateParams = (newParams) => {
        setSearchParams({ ...Object.fromEntries(searchParams), ...newParams });
    };

    return (
        <div>
            <p>Page: {page}, Limit: {limit}</p>
            <button onClick={() => updateParams({ page: '2' })}>
                Go to page 2
            </button>
        </div>
    );
}
```

### **Optional Parameters:**
```jsx
// Optional parameter
<Route path="/users/:id?" element={<UserDetail />} />

// Multiple parameters
<Route path="/posts/:year/:month/:day" element={<PostDetail />} />
```

## **5. Navigation**

### **Programmatic Navigation:**
```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Login logic
        const success = await loginUser(credentials);

        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div>
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
}
```

### **Navigation with State:**
```jsx
// Navigate with state
navigate('/dashboard', {
    state: {
        user: loggedInUser,
        from: 'login'
    }
});

// Access state in destination component
import { useLocation } from 'react-router-dom';

function Dashboard() {
    const location = useLocation();
    const { user, from } = location.state || {};

    return <div>Welcome {user?.name} from {from}!</div>;
}
```

### **Replace Navigation:**
```jsx
// Replace current history entry
navigate('/dashboard', { replace: true });
```

## **6. Nested Routes**

### **Basic Nested Routes:**
```jsx
function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="users" element={<Users />}>
                    <Route index element={<UserList />} />
                    <Route path=":id" element={<UserDetail />} />
                </Route>
            </Route>
        </Routes>
    );
}

function Layout() {
    return (
        <div>
            <header>
                <Navigation />
            </header>
            <main>
                <Outlet /> {/* This renders the nested routes */}
            </main>
            <footer>
                <p>Footer</p>
            </footer>
        </div>
    );
}
```

### **Outlet Component:**
```jsx
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div>
            <h1>My App</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/users">Users</Link>
            </nav>
            <Outlet />
        </div>
    );
}
```

## **7. Route Guards and Protection**

### **Basic Route Protection:**
```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated }) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Usage
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
```

### **Role-Based Protection:**
```jsx
function RoleProtectedRoute({ children, requiredRole, userRole }) {
    if (!userRole) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
```

## **8. Code Splitting and Lazy Loading**

### **Route-Based Code Splitting:**
```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Users = lazy(() => import('./pages/Users'));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/users" element={<Users />} />
            </Routes>
        </Suspense>
    );
}
```

### **Component-Level Code Splitting:**
```jsx
const ExpensiveComponent = lazy(() =>
    import('./components/ExpensiveComponent')
);

function MyComponent() {
    const [showExpensive, setShowExpensive] = useState(false);

    return (
        <div>
            <button onClick={() => setShowExpensive(true)}>
                Load Expensive Component
            </button>
            {showExpensive && (
                <Suspense fallback={<div>Loading...</div>}>
                    <ExpensiveComponent />
                </Suspense>
            )}
        </div>
    );
}
```

## **9. Advanced Routing Patterns**

### **Dynamic Route Matching:**
```jsx
// Multiple route patterns
<Routes>
    <Route path="/users" element={<UserList />} />
    <Route path="/users/:id" element={<UserDetail />} />
    <Route path="/users/new" element={<CreateUser />} />
</Routes>

// Order matters! More specific routes first
```

### **Route with Multiple Components:**
```jsx
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

function DashboardLayout() {
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
}
```

### **404 Handling:**
```jsx
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

function NotFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/">Go Home</Link>
        </div>
    );
}
```

## **10. Navigation Components**

### **Custom Link Component:**
```jsx
function CustomLink({ to, children, ...props }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = location.pathname === to;

    return (
        <button
            onClick={() => navigate(to)}
            className={isActive ? 'active' : ''}
            {...props}
        >
            {children}
        </button>
    );
}
```

### **Breadcrumb Navigation:**
```jsx
import { useLocation, Link } from 'react-router-dom';

function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    return (
        <nav aria-label="breadcrumb">
            <ol>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    return (
                        <li key={name}>
                            {isLast ? (
                                <span>{name}</span>
                            ) : (
                                <Link to={routeTo}>{name}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
```

## **11. Form Handling with Routing**

### **Form Submission with Redirect:**
```jsx
import { useNavigate } from 'react-router-dom';

function CreateUserForm() {
    const navigate = useNavigate();

    const handleSubmit = async (userData) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                navigate('/users'); // Redirect after successful creation
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return <UserForm onSubmit={handleSubmit} />;
}
```

### **Confirm Navigation:**
```jsx
import { useNavigate, useBlocker } from 'react-router-dom';

function EditForm() {
    const navigate = useNavigate();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useBlocker((tx) => {
        if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Leave anyway?')) {
            return false;
        }
        return true;
    });

    return (
        <form>
            <input
                type="text"
                onChange={() => setHasUnsavedChanges(true)}
            />
        </form>
    );
}
```

## **12. Code Examples**

### **Example 1: Complete Blog Application**

```jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <header>
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/about">About</Link>
                        <Link to="/blog">Blog</Link>
                        <Link to="/blog/create">Create Post</Link>
                    </nav>
                </header>

                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/blog" element={<BlogLayout />}>
                            <Route index element={<Blog />} />
                            <Route path="create" element={<CreatePost />} />
                            <Route path=":slug" element={<PostDetail />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </div>
        </BrowserRouter>
    );
}

function BlogLayout() {
    return (
        <div className="blog-layout">
            <aside>
                <h3>Categories</h3>
                <ul>
                    <li><Link to="/blog?category=tech">Technology</Link></li>
                    <li><Link to="/blog?category=lifestyle">Lifestyle</Link></li>
                    <li><Link to="/blog?category=tutorial">Tutorials</Link></li>
                </ul>
            </aside>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default App;
```

### **Example 2: E-commerce Product Pages**

```jsx
import React from 'react';
import { Routes, Route, useParams, useNavigate, useSearchParams } from 'react-router-dom';

function App() {
    return (
        <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
        </Routes>
    );
}

function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    const products = [
        { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
        { id: 2, name: 'Book', price: 20, category: 'books' },
        { id: 3, name: 'Headphones', price: 199, category: 'electronics' }
    ];

    const filteredProducts = category
        ? products.filter(p => p.category === category)
        : products;

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        return 0;
    });

    return (
        <div>
            <h1>Products</h1>

            <div className="filters">
                <select
                    value={category || ''}
                    onChange={(e) => setSearchParams({
                        category: e.target.value,
                        sort: sort || ''
                    })}
                >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="books">Books</option>
                </select>

                <select
                    value={sort || ''}
                    onChange={(e) => setSearchParams({
                        category: category || '',
                        sort: e.target.value
                    })}
                >
                    <option value="">Sort by</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>

            <div className="products">
                {sortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div
            className="product-card"
            onClick={() => navigate(`/products/${product.id}`)}
        >
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button>Add to Cart</button>
        </div>
    );
}

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock product data
    const product = {
        id: parseInt(id),
        name: 'Laptop',
        price: 999,
        description: 'High-performance laptop for work and gaming',
        specs: ['16GB RAM', '512GB SSD', 'Intel i7']
    };

    return (
        <div>
            <button onClick={() => navigate(-1)}>← Back</button>
            <h1>{product.name}</h1>
            <p className="price">${product.price}</p>
            <p>{product.description}</p>
            <h3>Specifications:</h3>
            <ul>
                {product.specs.map((spec, index) => (
                    <li key={index}>{spec}</li>
                ))}
            </ul>
            <button>Add to Cart</button>
        </div>
    );
}

function Cart() {
    return <h1>Shopping Cart</h1>;
}

function Checkout() {
    return <h1>Checkout</h1>;
}

export default App;
```

### **Example 3: Admin Dashboard with Protected Routes**

```jsx
import React, { useState, createContext, useContext } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link,
    Outlet
} from 'react-router-dom';

// Auth Context
const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = { user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

// Layout Components
function Layout() {
    const { user, logout } = useAuth();

    return (
        <div>
            <header>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin">Admin</Link>
                    )}
                    <span>Welcome, {user?.name}</span>
                    <button onClick={logout}>Logout</button>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

function AdminLayout() {
    return (
        <div>
            <h2>Admin Panel</h2>
            <nav>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/settings">Settings</Link>
            </nav>
            <Outlet />
        </div>
    );
}

// Page Components
function Home() {
    return <h1>Home Page</h1>;
}

function Login() {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login
        if (credentials.email === 'admin@example.com') {
            login({
                id: 1,
                name: 'Admin User',
                email: credentials.email,
                role: 'admin'
            });
        } else {
            login({
                id: 2,
                name: 'Regular User',
                email: credentials.email,
                role: 'user'
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => setCredentials({
                    ...credentials,
                    email: e.target.value
                })}
            />
            <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({
                    ...credentials,
                    password: e.target.value
                })}
            />
            <button type="submit">Login</button>
        </form>
    );
}

function Dashboard() {
    const { user } = useAuth();
    return <h1>Dashboard - Welcome {user?.name}</h1>;
}

function AdminUsers() {
    return <h1>Admin - User Management</h1>;
}

function AdminSettings() {
    return <h1>Admin - Settings</h1>;
}

function Unauthorized() {
    return <h1>Unauthorized Access</h1>;
}

// Main App
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="admin"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="settings" element={<AdminSettings />} />
                        </Route>
                    </Route>
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
```

## **13. Assignments and Projects**

### **Assignment 11.1: Basic Routing**
Create a multi-page application with:
- Home, About, and Contact pages
- Navigation between pages
- Active link highlighting
- 404 page for invalid routes

### **Assignment 11.2: Dynamic Routing**
Build an application with:
- Dynamic route parameters
- Query parameter handling
- Programmatic navigation
- Route guards

### **Project 11: Blog Platform**
Create a complete blog application with:
- Post listing and detail pages
- Category-based navigation
- Search functionality
- User authentication
- Admin panel for content management

### **Challenge Project: E-commerce Store**
Build a full-featured e-commerce site with:
- Product catalog with categories
- Shopping cart functionality
- User accounts and profiles
- Order history
- Admin dashboard
- Search and filtering

## **14. Best Practices**

### **Route Organization:**
- Group related routes together
- Use consistent URL patterns
- Keep routes shallow when possible
- Use descriptive route names

### **Performance:**
- Use code splitting for large applications
- Lazy load route components
- Optimize bundle sizes
- Cache route components when appropriate

### **User Experience:**
- Provide clear navigation
- Use breadcrumbs for deep navigation
- Handle loading states
- Provide meaningful error pages

### **Security:**
- Validate route parameters
- Implement proper authentication
- Use HTTPS in production
- Sanitize user inputs

## **15. Common Patterns**

### **Route Configuration Pattern:**

```jsx
const routes = [
    {
        path: '/',
        element: <Home />,
        protected: false
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        protected: true
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        protected: true,
        role: 'admin',
        children: [
            {
                path: 'users',
                element: <AdminUsers />
            },
            {
                path: 'settings',
                element: <AdminSettings />
            }
        ]
    }
];

function renderRoutes(routes) {
    return routes.map(route => {
        if (route.children) {
            return (
                <Route
                    key={route.path}
                    path={route.path}
                    element={
                        route.protected ? (
                            <ProtectedRoute role={route.role}>
                                {route.element}
                            </ProtectedRoute>
                        ) : (
                            route.element
                        )
                    }
                >
                    {renderRoutes(route.children)}
                </Route>
            );
        }

        return (
            <Route
                key={route.path}
                path={route.path}
                element={
                    route.protected ? (
                        <ProtectedRoute role={route.role}>
                            {route.element}
                        </ProtectedRoute>
                    ) : (
                        route.element
                    )
                }
            />
        );
    });
}
```

### **Route Hooks Pattern:**

```jsx
function useRouteGuard(condition, redirectTo = '/') {
    const navigate = useNavigate();

    useEffect(() => {
        if (!condition) {
            navigate(redirectTo, { replace: true });
        }
    }, [condition, navigate, redirectTo]);
}

// Usage
function ProtectedComponent() {
    const { user } = useAuth();
    useRouteGuard(user, '/login');

    return <div>Protected Content</div>;
}
```

## **16. Resources**

- [React Router Documentation](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/docs/en/v6/getting-started/tutorial)
- [React Router Examples](https://reactrouter.com/docs/en/v6/examples)

## **17. Next Steps**

In the next lesson, we'll explore Redux for state management. You'll learn about:
- Actions and reducers
- Store configuration
- Connecting components to Redux
- Middleware and async actions
- Redux DevTools

Practice implementing different routing patterns and experiment with nested routes to strengthen your React Router skills!

---

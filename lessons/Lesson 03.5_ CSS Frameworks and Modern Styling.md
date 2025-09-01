# Lesson 03.5: CSS Frameworks and Modern Styling

## Overview
CSS frameworks provide pre-built components and utilities that speed up development and ensure consistency. This lesson covers popular CSS frameworks and modern styling approaches for full-stack development.

## Why Use CSS Frameworks?

### Benefits
```
Faster Development: Pre-built components and utilities
Consistency: Standardized design patterns
Responsive Design: Mobile-first approach
Cross-browser Compatibility: Tested across browsers
Accessibility: Built-in accessibility features
Community Support: Large communities and documentation
Maintainability: Organized and scalable CSS architecture
```

## Bootstrap

### Getting Started
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bootstrap App</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <!-- Your content here -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
```

### Grid System
```html
<!-- Container -->
<div class="container">
  <!-- Row -->
  <div class="row">
    <!-- Columns -->
    <div class="col-md-8">Main content (8/12 columns on medium+ screens)</div>
    <div class="col-md-4">Sidebar (4/12 columns on medium+ screens)</div>
  </div>
</div>

<!-- Responsive breakpoints -->
<!-- col-sm-* (≥576px) -->
<!-- col-md-* (≥768px) -->
<!-- col-lg-* (≥992px) -->
<!-- col-xl-* (≥1200px) -->
<!-- col-xxl-* (≥1400px) -->
```

### Components
```html
<!-- Buttons -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-success btn-lg">Large Success Button</button>

<!-- Cards -->
<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

<!-- Navigation -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Features</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Pricing</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<!-- Forms -->
<form>
  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input type="email" class="form-control" id="email" placeholder="name@example.com">
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password">
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
```

### Utility Classes
```html
<!-- Spacing -->
<div class="m-3">Margin all sides</div>
<div class="mt-4 mb-2">Margin top and bottom</div>
<div class="p-3">Padding all sides</div>

<!-- Colors -->
<div class="text-primary">Primary text</div>
<div class="bg-success text-white">Success background</div>

<!-- Display -->
<div class="d-none d-md-block">Hidden on mobile, visible on medium+</div>
<div class="d-flex justify-content-center align-items-center">Centered content</div>

<!-- Borders -->
<div class="border border-primary rounded">Bordered element</div>

<!-- Shadows -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow-lg">Large shadow</div>
```

## Tailwind CSS

### Installation
```bash
# Install Tailwind CSS
npm install -D tailwindcss
npx tailwindcss init

# Configure tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

# Add to CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Utility-First Approach
```html
<!-- Layout -->
<div class="container mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-blue-500 text-white p-4 rounded-lg">Item 1</div>
    <div class="bg-green-500 text-white p-4 rounded-lg">Item 2</div>
    <div class="bg-red-500 text-white p-4 rounded-lg">Item 3</div>
  </div>
</div>

<!-- Typography -->
<h1 class="text-4xl font-bold text-gray-900 mb-4">Heading</h1>
<p class="text-lg text-gray-700 leading-relaxed">Paragraph text</p>

<!-- Buttons -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>

<!-- Forms -->
<form class="max-w-md mx-auto">
  <input class="w-full px-3 py-2 border border-gray-300 rounded-md" type="email" placeholder="Email">
  <button class="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-2">Submit</button>
</form>

<!-- Cards -->
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <img class="w-full" src="..." alt="Card image">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">Card Title</div>
    <p class="text-gray-700 text-base">Card description</p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#tag1</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#tag2</span>
  </div>
</div>
```

### Responsive Design
```html
<!-- Responsive utilities -->
<div class="w-full md:w-1/2 lg:w-1/3">Responsive width</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div class="bg-blue-500 p-4">Item 1</div>
  <div class="bg-green-500 p-4">Item 2</div>
  <div class="bg-red-500 p-4">Item 3</div>
  <div class="bg-yellow-500 p-4">Item 4</div>
</div>

<!-- Responsive text -->
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Responsive heading</h1>
```

### Custom Components
```css
/* components.css */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

## Material-UI (MUI)

### React Integration
```bash
npm install @mui/material @emotion/react @emotion/styled
```

### Basic Components
```jsx
import React from 'react';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';

function App() {
  return (
    <div>
      {/* Button */}
      <Button variant="contained" color="primary">
        Click me
      </Button>

      {/* Text Field */}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
      />

      {/* Card */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Card Title
          </Typography>
          <Typography color="textSecondary">
            Card description
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Theme Customization
```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your components */}
    </ThemeProvider>
  );
}
```

## CSS-in-JS Solutions

### Styled Components
```bash
npm install styled-components
```

```jsx
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${props => props.primary ? '#0056b3' : '#545b62'};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 10px;
  }
`;

// Usage
function App() {
  return (
    <Container>
      <Button primary>Primary Button</Button>
      <Button>Secondary Button</Button>
    </Container>
  );
}
```

### Emotion
```jsx
import { css, jsx } from '@emotion/react';

/** @jsx jsx */
const buttonStyles = css`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

function App() {
  return (
    <div>
      <button css={buttonStyles}>Click me</button>
    </div>
  );
}
```

## Modern CSS Features

### CSS Grid
```css
/* Grid container */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 20px;
  padding: 20px;
}

/* Grid items */
.grid-item {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}

/* Named grid areas */
.page-layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### CSS Flexbox
```css
/* Flex container */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

/* Flex items */
.flex-item {
  flex: 1 1 200px;
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}

/* Navigation with flexbox */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}
```

### CSS Custom Properties (Variables)
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --font-size-base: 16px;
  --spacing-unit: 1rem;
  --border-radius: 4px;
}

.button {
  background: var(--primary-color);
  color: white;
  padding: var(--spacing-unit);
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
}

.button:hover {
  background: color-mix(in srgb, var(--primary-color) 80%, black);
}

/* Theme switching */
[data-theme="dark"] {
  --primary-color: #0d6efd;
  --bg-color: #212529;
  --text-color: #ffffff;
}
```

### CSS Modules
```css
/* Button.module.css */
.button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.primary {
  composes: button;
  background: #007bff;
}

.secondary {
  composes: button;
  background: #6c757d;
}
```

```jsx
import styles from './Button.module.css';

function Button({ variant, children }) {
  return (
    <button className={styles[variant]}>
      {children}
    </button>
  );
}
```

## CSS Architecture Patterns

### BEM (Block Element Modifier)
```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__content { }
.card__footer { }

/* Modifier */
.card--featured { }
.card__title--large { }
```

```html
<div class="card card--featured">
  <h2 class="card__title card__title--large">Title</h2>
  <div class="card__content">Content</div>
  <div class="card__footer">Footer</div>
</div>
```

### SMACSS (Scalable and Modular Architecture for CSS)
```css
/* Base rules */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

/* Layout rules */
.l-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.l-sidebar {
  width: 300px;
  float: left;
}

/* Module rules */
.btn { }
.btn-primary { }
.btn-secondary { }

/* State rules */
.is-hidden {
  display: none;
}

.is-active {
  background: #007bff;
}

/* Theme rules */
.theme-dark {
  background: #333;
  color: #fff;
}
```

### Atomic CSS
```css
/* Atomic classes */
.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }

.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }

.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

.bg-white { background-color: white; }
.bg-gray { background-color: #f0f0f0; }
.bg-blue { background-color: #007bff; }
```

## Performance Optimization

### Critical CSS
```html
<head>
  <style>
    /* Critical CSS inlined */
    .hero { background: #007bff; color: white; padding: 2rem; }
    .hero h1 { font-size: 2.5rem; margin: 0; }
    .hero p { font-size: 1.2rem; margin: 1rem 0; }
  </style>
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
```

### CSS Optimization Techniques
```css
/* Minimize specificity */
.btn { }                    /* Good */
div .btn { }               /* Avoid */
body div .btn { }          /* Avoid */

/* Use shorthand properties */
.margin {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 10px;
  margin-left: 20px;
}

/* Better: use shorthand */
.margin {
  margin: 10px 20px;
}
```

### Web Vitals Optimization
```css
/* Optimize for Largest Contentful Paint (LCP) */
.hero-image {
  /* Preload critical images */
}

/* Optimize for First Input Delay (FID) */
.interactive-element {
  /* Avoid layout shifts */
  transform: translateZ(0);
}

/* Optimize for Cumulative Layout Shift (CLS) */
.responsive-image {
  aspect-ratio: 16 / 9;
}
```

## Accessibility (A11y)

### Accessible CSS
```css
/* Focus indicators */
.button:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animation {
    animation: none;
  }
}

/* Color blindness support */
.text-success {
  color: #28a745;
}

/* Also provide icons or other indicators */
.text-success::before {
  content: "✓";
  margin-right: 0.5rem;
}
```

### Semantic HTML with CSS
```html
<!-- Good: semantic HTML -->
<header class="site-header">
  <nav class="main-nav">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main class="main-content">
  <article class="post">
    <h1>Post Title</h1>
    <p>Post content...</p>
  </article>
</main>
```

## CSS Preprocessors

### Sass/SCSS
```scss
// Variables
$primary-color: #007bff;
$spacing-unit: 1rem;

// Mixins
@mixin button-variant($color) {
  background: $color;
  border: 1px solid darken($color, 10%);

  &:hover {
    background: darken($color, 10%);
  }
}

// Functions
@function calculate-rem($px) {
  @return $px / 16px * 1rem;
}

// Usage
.button {
  padding: $spacing-unit;
  @include button-variant($primary-color);
}

.heading {
  font-size: calculate-rem(24px);
}
```

### Less
```less
// Variables
@primary-color: #007bff;
@spacing-unit: 1rem;

// Mixins
.button-variant(@color) {
  background: @color;
  border: 1px solid darken(@color, 10%);

  &:hover {
    background: darken(@color, 10%);
  }
}

// Usage
.button {
  padding: @spacing-unit;
  .button-variant(@primary-color);
}
```

## Build Tools and Automation

### PostCSS
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
    require('postcss-preset-env')({
      stage: 1,
    }),
  ],
};
```

### CSS-in-JS with Build Tools
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
```

## Summary

CSS frameworks and modern styling approaches provide:

1. **Bootstrap**: Component library with responsive grid
2. **Tailwind CSS**: Utility-first approach for rapid development
3. **Material-UI**: React component library with Material Design
4. **CSS-in-JS**: Styled-components and Emotion for component styling
5. **Modern CSS**: Grid, Flexbox, Custom Properties
6. **Architecture**: BEM, SMACSS, Atomic CSS patterns
7. **Performance**: Critical CSS, optimization techniques
8. **Accessibility**: WCAG compliance and inclusive design

### Key Takeaways
- Choose framework based on project requirements
- Use utility-first approach for rapid prototyping
- Implement responsive design from the start
- Follow consistent naming conventions
- Optimize for performance and accessibility
- Use build tools for preprocessing and optimization

### Best Practices
1. **Mobile-first**: Design for mobile, enhance for desktop
2. **Progressive enhancement**: Basic functionality without CSS
3. **Performance**: Minimize CSS, use efficient selectors
4. **Maintainability**: Use consistent patterns and documentation
5. **Accessibility**: Ensure sufficient color contrast and focus indicators
6. **Cross-browser**: Test across different browsers and versions

### Next Steps
1. Choose a CSS framework for your next project
2. Learn modern CSS features (Grid, Flexbox, Custom Properties)
3. Implement responsive design patterns
4. Set up a CSS build pipeline
5. Focus on accessibility and performance
6. Explore CSS-in-JS solutions for React applications

Mastering CSS frameworks and modern styling will make you a more efficient and effective front-end developer! 🚀
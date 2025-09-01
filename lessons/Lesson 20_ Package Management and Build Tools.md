# Lesson 20: Package Management and Build Tools

## Overview
Package management and build tools are essential for modern full-stack development. This lesson covers npm/yarn for package management and webpack/vite for build processes.

## Package Management

### npm (Node Package Manager)

#### Installation and Setup
```bash
# Check npm version
npm --version

# Initialize a new project
npm init

# Initialize with default settings
npm init -y

# View npm configuration
npm config list
```

#### package.json Structure
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My awesome project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint src/"
  },
  "keywords": ["nodejs", "express", "mongodb"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "webpack": "^5.75.0",
    "jest": "^29.3.1"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

#### Package Installation
```bash
# Install package (adds to dependencies)
npm install express

# Install dev dependency
npm install --save-dev webpack

# Install specific version
npm install express@4.18.0

# Install globally
npm install -g create-react-app

# Install from GitHub
npm install https://github.com/user/repo.git

# Install peer dependencies
npm install --include=peer
```

#### Package Management Commands
```bash
# List installed packages
npm list
npm list --depth=0

# Check for outdated packages
npm outdated

# Update packages
npm update
npm update express

# Remove package
npm uninstall express

# Clean cache
npm cache clean --force

# Audit for security vulnerabilities
npm audit
npm audit fix
```

### Yarn

#### Yarn Installation and Setup
```bash
# Install Yarn globally
npm install -g yarn

# Check version
yarn --version

# Initialize project
yarn init

# Install all dependencies
yarn install
```

#### Yarn Commands
```bash
# Add package
yarn add express
yarn add -D webpack

# Remove package
yarn remove express

# Upgrade packages
yarn upgrade
yarn upgrade express

# List packages
yarn list

# Clean cache
yarn cache clean
```

#### Yarn vs npm Comparison

| Feature | npm | Yarn |
|---------|-----|------|
| **Installation** | `npm install` | `yarn install` |
| **Add Package** | `npm install pkg` | `yarn add pkg` |
| **Remove Package** | `npm uninstall pkg` | `yarn remove pkg` |
| **Speed** | Moderate | Fast (with cache) |
| **Lock File** | package-lock.json | yarn.lock |
| **Workspaces** | Limited | Advanced |
| **Security** | npm audit | yarn audit |

## Build Tools

### Webpack

#### Basic Configuration
```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  // Entry point
  entry: './src/index.js',

  // Output configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean dist folder before build
  },

  // Module rules
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },

  // Development server
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },

  // Mode
  mode: 'development',
};
```

#### Advanced Webpack Configuration
```javascript
// webpack.config.js with plugins
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
    vendor: ['react', 'react-dom'],
  },

  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production'
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};
```

#### Webpack Loaders
```javascript
// Common loaders configuration
module.exports = {
  module: {
    rules: [
      // JavaScript/JSX
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          },
        },
      },

      // TypeScript
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      // CSS
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'postcss-loader',
        ],
      },

      // Sass/SCSS
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },

      // Images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },

      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
    ],
  },
};
```

### Vite

#### Vite Setup
```bash
# Create Vite project
npm create vite@latest my-app
cd my-app
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
});
```

### Parcel

#### Parcel Setup
```bash
# Install Parcel
npm install -D parcel

# Update package.json scripts
{
  "scripts": {
    "dev": "parcel index.html",
    "build": "parcel build index.html"
  }
}
```

#### Parcel Configuration
```javascript
// .parcelrc
{
  "extends": "@parcel/config-default",
  "transformers": {
    "*.{ts,tsx}": ["@parcel/transformer-typescript-tsc"]
  }
}
```

## Task Runners

### npm Scripts
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "build:watch": "webpack --mode development --watch",
    "serve": "webpack serve",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean && npm run lint",
    "analyze": "webpack-bundle-analyzer dist/static/js/*.js"
  }
}
```

### Gulp
```javascript
// gulpfile.js
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const clean = require('gulp-clean');

function cleanDist() {
  return gulp.src('dist', { read: false, allowEmpty: true })
    .pipe(clean());
}

function compileSass() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
}

function minifyJs() {
  return gulp.src('src/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
}

function copyHtml() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
}

function watch() {
  gulp.watch('src/scss/**/*.scss', compileSass);
  gulp.watch('src/js/**/*.js', minifyJs);
  gulp.watch('src/*.html', copyHtml);
}

exports.clean = cleanDist;
exports.sass = compileSass;
exports.js = minifyJs;
exports.html = copyHtml;
exports.watch = watch;

exports.build = gulp.series(cleanDist, gulp.parallel(compileSass, minifyJs, copyHtml));
exports.default = gulp.series(cleanDist, gulp.parallel(compileSass, minifyJs, copyHtml), watch);
```

## Module Bundlers Comparison

| Feature | Webpack | Vite | Parcel | Rollup |
|---------|---------|------|--------|--------|
| **Setup Complexity** | High | Low | Low | Medium |
| **Build Speed** | Medium | Fast | Fast | Fast |
| **Configuration** | Complex | Simple | Zero-config | Medium |
| **Ecosystem** | Large | Growing | Medium | Medium |
| **Tree Shaking** | Good | Excellent | Good | Excellent |
| **Code Splitting** | Excellent | Good | Good | Excellent |
| **HMR** | Good | Excellent | Good | Limited |
| **Production Builds** | Excellent | Good | Good | Excellent |

## Development Tools

### ESLint
```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': 'warn',
  },
};
```

### Prettier
```javascript
// .prettierrc.js
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
};

# .prettierignore
node_modules/
dist/
build/
*.min.js
```

### Husky (Git Hooks)
```bash
# Install Husky
npm install --save-dev husky

# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"

# Add commit-msg hook
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

### lint-staged
```javascript
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "stylelint --fix"
    ]
  }
}
```

## Testing Setup

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.js',
    '!src/serviceWorker.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Testing Libraries
```javascript
// setupTests.js
import '@testing-library/jest-dom';

// Component test example
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  fireEvent.click(buttonElement);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm run test:coverage

    - name: Build
      run: npm run build

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
```

### Deployment Scripts
```javascript
// deploy.js
const { execSync } = require('child_process');
const fs = require('fs');

function deploy() {
  try {
    console.log('🚀 Starting deployment...');

    // Run tests
    console.log('🧪 Running tests...');
    execSync('npm test', { stdio: 'inherit' });

    // Build application
    console.log('🔨 Building application...');
    execSync('npm run build', { stdio: 'inherit' });

    // Deploy to server
    console.log('📦 Deploying to server...');
    execSync('rsync -avz dist/ user@server:/var/www/app/', { stdio: 'inherit' });

    // Restart services
    console.log('🔄 Restarting services...');
    execSync('ssh user@server "sudo systemctl restart nginx"', { stdio: 'inherit' });

    console.log('✅ Deployment successful!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  deploy();
}
```

## Performance Optimization

### Bundle Analysis
```javascript
// webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
};
```

### Code Splitting
```javascript
// Dynamic imports
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// Route-based splitting
const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Suspense>
  </Router>
);
```

### Asset Optimization
```javascript
// Image optimization
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

(async () => {
  await imagemin(['images/*.{jpg,png}'], {
    destination: 'build/images',
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });
})();
```

## Security Considerations

### Dependency Scanning
```bash
# Audit dependencies
npm audit
yarn audit

# Fix vulnerabilities
npm audit fix
yarn audit fix

# Use Snyk for advanced scanning
npx snyk test
npx snyk wizard
```

### Environment Variables
```javascript
// .env.example
DATABASE_URL=postgresql://localhost:5432/myapp
JWT_SECRET=your-secret-key
API_KEY=your-api-key
NODE_ENV=development

// .env (gitignored)
DATABASE_URL=postgresql://prod-server:5432/myapp
JWT_SECRET=production-secret-key
API_KEY=production-api-key
NODE_ENV=production
```

### Secure Package Management
```json
// package.json with integrity checks
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0"
  },
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "security": "npm run audit && npx snyk test"
  }
}
```

## Summary

Package management and build tools are crucial for:

1. **Dependency Management**: npm/yarn for package handling
2. **Build Process**: Webpack/Vite for bundling and optimization
3. **Development Workflow**: Hot reloading, linting, testing
4. **Performance**: Code splitting, asset optimization
5. **Quality**: Linting, testing, security scanning
6. **Deployment**: Automated build and deployment pipelines

### Key Takeaways
- Choose package manager based on project needs (npm for simplicity, yarn for speed)
- Use appropriate build tool (Vite for modern apps, Webpack for complex configurations)
- Implement comprehensive testing and linting
- Optimize bundles for production
- Automate repetitive tasks with scripts
- Maintain security through regular audits

### Best Practices
1. **Version Control**: Use semantic versioning
2. **Lock Files**: Commit package-lock.json or yarn.lock
3. **Security**: Regular dependency audits
4. **Performance**: Bundle analysis and optimization
5. **Automation**: CI/CD pipelines for consistency
6. **Documentation**: Clear setup and deployment instructions

### Next Steps
1. Set up a new project with your preferred tools
2. Configure development workflow (linting, testing, building)
3. Implement CI/CD pipeline
4. Learn advanced build optimizations
5. Explore new tools and stay updated

Mastering package management and build tools will significantly improve your development efficiency and code quality! 🚀
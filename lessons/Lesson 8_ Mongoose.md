### **Lesson 8: Mongoose - MongoDB Object Modeling for Node.js**

## **1. What is Mongoose?**

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data and includes built-in type casting, validation, query building, and business logic hooks.

### **Key Features:**

#### **Core Features:**
- **Schema Definition:** Define document structure with data types and validation
- **Models:** Constructors for creating and querying documents
- **Validation:** Built-in and custom validation rules
- **Middleware:** Pre and post hooks for document lifecycle events
- **Population:** Automatic joining of referenced documents
- **Plugins:** Extensible architecture for additional functionality
- **Query Building:** Chainable query API

#### **Advanced Features:**
- **Transactions:** Multi-document ACID transactions
- **Aggregation Pipelines:** Advanced data processing and analytics
- **Change Streams:** Real-time data change notifications
- **Schema Inheritance:** Base schemas with extensions
- **Discriminators:** Multiple models with shared schema
- **Virtual Populate:** Reverse population without storing references
- **Pre/Post Hooks:** Extensive middleware system
- **Connection Pooling:** Efficient database connection management

### **Why Use Mongoose?**

- Provides structure to MongoDB's flexible schema
- Built-in validation and type casting
- Easy population of referenced documents
- Middleware for business logic
- Active development and community support
- Reduces boilerplate code

## **2. Installation and Setup**

### **Installing Mongoose:**

```bash
npm install mongoose
```

### **Basic Connection:**

```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/myapp', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Additional options
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Connection error:', error);
        process.exit(1);
    }
}

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});

module.exports = connectDB;
```

## **3. Schemas**

### **Basic Schema Definition:**

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    age: {
        type: Number,
        min: 0,
        max: 120
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ name: 1, createdAt: -1 });
```

### **Schema Types and Advanced Schema Patterns:**

#### **Comprehensive Schema Types:**
```javascript
const comprehensiveSchema = new mongoose.Schema({
    // String with advanced options
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
        lowercase: true,  // Convert to lowercase
        uppercase: false // Convert to uppercase
    },

    // Number with precision
    age: {
        type: Number,
        min: 0,
        max: 120,
        validate: {
            validator: Number.isInteger,
            message: 'Age must be an integer'
        }
    },

    price: {
        type: mongoose.Schema.Types.Decimal128, // For precise decimal calculations
        required: true,
        min: 0
    },

    // Boolean with custom logic
    isActive: {
        type: Boolean,
        default: true,
        set: function(value) {
            // Custom setter logic
            return value === 'true' || value === 1 || value === '1';
        }
    },

    // Date with timezone handling
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 365 * 24 * 60 * 60 // TTL index (1 year)
    },

    // Buffer for binary data
    avatar: {
        data: Buffer,
        contentType: String,
        size: Number
    },

    // Mixed type for flexible data
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // UUID
    uuid: {
        type: String,
        default: () => require('crypto').randomUUID()
    },

    // Arrays with validation
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50
    }],

    // Embedded documents with validation
    address: new mongoose.Schema({
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: String,
        zipCode: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\d{5}(-\d{4})?$/.test(v);
                },
                message: 'Invalid ZIP code format'
            }
        },
        coordinates: {
            lat: { type: Number, min: -90, max: 90 },
            lng: { type: Number, min: -180, max: 180 }
        }
    }, { _id: false }), // Don't create _id for subdocuments

    // References with population options
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: true // Auto-populate on find operations
    },

    // Map type for key-value pairs
    settings: {
        type: Map,
        of: String, // Values are strings
        default: new Map()
    },

    // Enum with custom values
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'archived'],
            message: 'Status must be draft, published, or archived'
        },
        default: 'draft'
    }
});
```

#### **Advanced Schema Patterns:**

##### **Schema Inheritance (Base Schema):**
```javascript
// Base schema for common fields
const baseEntitySchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    version: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true,
    discriminatorKey: 'entityType' // For discriminators
});

// Add common methods
baseEntitySchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.updatedAt = new Date();
    return this.save();
};

baseEntitySchema.methods.restore = function() {
    this.isDeleted = false;
    this.updatedAt = new Date();
    return this.save();
};

// Pre-save middleware for versioning
baseEntitySchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) {
        this.version += 1;
    }
    next();
});

// Extend base schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

// Inherit from base schema
userSchema.add(baseEntitySchema);

// Add user-specific methods
userSchema.methods.getFullName = function() {
    return this.username;
};

userSchema.methods.hasRole = function(role) {
    return this.role === role;
};
```

##### **Discriminators for Polymorphism:**
```javascript
// Base content schema
const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    published: { type: Boolean, default: false },
    publishedAt: Date
}, { timestamps: true });

// Base model
const Content = mongoose.model('Content', contentSchema);

// Article discriminator
const articleSchema = new mongoose.Schema({
    excerpt: { type: String, maxlength: 300 },
    readingTime: Number,
    category: { type: String, required: true }
});

// Blog post discriminator
const blogPostSchema = new mongoose.Schema({
    excerpt: { type: String, maxlength: 200 },
    featured: { type: Boolean, default: false },
    series: String
});

// Video discriminator
const videoSchema = new mongoose.Schema({
    videoUrl: { type: String, required: true },
    duration: Number,
    thumbnail: String,
    transcript: String
});

// Create discriminator models
const Article = Content.discriminator('Article', articleSchema);
const BlogPost = Content.discriminator('BlogPost', blogPostSchema);
const Video = Content.discriminator('Video', videoSchema);

// Usage
async function createContent() {
    // Create different types of content
    const article = new Article({
        title: 'Advanced JavaScript Patterns',
        content: 'Article content...',
        excerpt: 'Learn advanced JS patterns',
        category: 'JavaScript'
    });

    const blogPost = new BlogPost({
        title: 'My Development Journey',
        content: 'Blog post content...',
        excerpt: 'A personal story',
        featured: true
    });

    const video = new Video({
        title: 'React Tutorial',
        content: 'Video description...',
        videoUrl: 'https://example.com/video',
        duration: 1800
    });

    await article.save();
    await blogPost.save();
    await video.save();

    // Query all content types
    const allContent = await Content.find().sort({ createdAt: -1 });

    // Query specific type
    const articles = await Article.find({ category: 'JavaScript' });
}
```

##### **Schema Composition with Mixins:**
```javascript
// Mixin for timestamp fields
const timestampMixin = {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

// Mixin for soft delete
const softDeleteMixin = {
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date
};

// Mixin for versioning
const versionMixin = {
    version: { type: Number, default: 1 }
};

// Function to apply mixins
function applyMixins(schema, mixins) {
    mixins.forEach(mixin => {
        schema.add(mixin);
    });
}

// Usage
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true }
});

// Apply mixins
applyMixins(userSchema, [timestampMixin, softDeleteMixin, versionMixin]);

// Add mixin methods
userSchema.methods.softDelete = function() {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};
```

##### **Dynamic Schemas:**
```javascript
// Schema for dynamic forms
const dynamicFieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['string', 'number', 'boolean', 'date', 'array'],
        required: true
    },
    required: { type: Boolean, default: false },
    default: mongoose.Schema.Types.Mixed,
    validation: mongoose.Schema.Types.Mixed
});

const formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fields: [dynamicFieldSchema],
    submissions: [{
        data: { type: Map, of: mongoose.Schema.Types.Mixed },
        submittedAt: { type: Date, default: Date.now },
        submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
});

// Dynamic validation based on field definitions
formSchema.methods.validateSubmission = function(submissionData) {
    const errors = [];

    this.fields.forEach(field => {
        const value = submissionData[field.name];

        // Check required fields
        if (field.required && (value === undefined || value === null || value === '')) {
            errors.push(`${field.name} is required`);
        }

        // Type validation
        if (value !== undefined && value !== null) {
            switch (field.type) {
                case 'number':
                    if (typeof value !== 'number' && isNaN(Number(value))) {
                        errors.push(`${field.name} must be a number`);
                    }
                    break;
                case 'boolean':
                    if (typeof value !== 'boolean' && !['true', 'false', '1', '0'].includes(String(value))) {
                        errors.push(`${field.name} must be a boolean`);
                    }
                    break;
                case 'date':
                    if (isNaN(Date.parse(value))) {
                        errors.push(`${field.name} must be a valid date`);
                    }
                    break;
            }
        }
    });

    return errors;
};
```

### **Schema Options:**

```javascript
const advancedSchema = new mongoose.Schema({
    // Schema options
}, {
    // Collection name (default is pluralized model name)
    collection: 'myCollection',

    // Timestamps (adds createdAt and updatedAt)
    timestamps: true,

    // Strict mode (default: true)
    strict: true,

    // Version key (__v field)
    versionKey: '__v',

    // Custom toJSON transformation
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
});
```

## **4. Models**

### **Creating Models:**

```javascript
// Create model from schema
const User = mongoose.model('User', userSchema);

// The model name 'User' will create a collection called 'users'

// Model methods
const User = mongoose.model('User', userSchema);

// Static methods (called on the model)
User.findByEmail = function(email) {
    return this.findOne({ email: email });
};

// Instance methods (called on document instances)
userSchema.methods.getFullName = function() {
    return this.name;
};

userSchema.methods.isAdult = function() {
    return this.age >= 18;
};
```

### **Creating Documents:**

```javascript
// Create new document
const user = new User({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
});

// Save to database
await user.save();

// Create and save in one step
const user = await User.create({
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25
});
```

## **5. Queries**

### **Basic Queries:**

```javascript
// Find all documents
const users = await User.find();

// Find with conditions
const activeUsers = await User.find({ isActive: true });

// Find one document
const user = await User.findOne({ email: 'john@example.com' });

// Find by ID
const user = await User.findById('507f1f77bcf86cd799439011');

// Count documents
const count = await User.countDocuments({ age: { $gte: 18 } });
```

### **Advanced Queries:**

```javascript
// Select specific fields
const users = await User.find({}, 'name email age');

// Exclude fields
const users = await User.find({}, '-password -__v');

// Sort results
const users = await User.find().sort({ createdAt: -1 });

// Limit results
const users = await User.find().limit(10);

// Skip results (pagination)
const users = await User.find().skip(20).limit(10);

// Chain methods
const users = await User
    .find({ age: { $gte: 18 } })
    .select('name email age')
    .sort({ name: 1 })
    .limit(50);
```

### **Query Operators:**

```javascript
// Comparison operators
const youngUsers = await User.find({ age: { $lt: 30 } });
const adultUsers = await User.find({ age: { $gte: 18 } });

// Logical operators
const users = await User.find({
    $and: [
        { age: { $gte: 18 } },
        { isActive: true }
    ]
});

// Regex search
const users = await User.find({
    name: { $regex: 'John', $options: 'i' }
});

// In operator
const users = await User.find({
    age: { $in: [20, 25, 30] }
});
```

## **6. Updating Documents**

### **Update Methods:**

```javascript
// Update one document
const result = await User.updateOne(
    { email: 'john@example.com' },
    { $set: { name: 'John Smith' } }
);

// Update many documents
const result = await User.updateMany(
    { isActive: false },
    { $set: { lastLogin: new Date() } }
);

// Find and update (returns updated document)
const user = await User.findOneAndUpdate(
    { email: 'john@example.com' },
    { $set: { name: 'John Smith' } },
    { new: true } // Return updated document
);

// Update by ID
const user = await User.findByIdAndUpdate(
    '507f1f77bcf86cd799439011',
    { $inc: { loginCount: 1 } },
    { new: true }
);
```

### **Update Operators:**

```javascript
// Set fields
await User.updateOne({ _id: id }, { $set: { name: 'New Name' } });

// Increment
await User.updateOne({ _id: id }, { $inc: { loginCount: 1 } });

// Push to array
await User.updateOne({ _id: id }, { $push: { tags: 'new-tag' } });

// Pull from array
await User.updateOne({ _id: id }, { $pull: { tags: 'old-tag' } });

// Add to set (only if not exists)
await User.updateOne({ _id: id }, { $addToSet: { tags: 'new-tag' } });

// Current date
await User.updateOne({ _id: id }, { $currentDate: { lastLogin: true } });
```

## **7. Deleting Documents**

### **Delete Methods:**

```javascript
// Delete one document
const result = await User.deleteOne({ email: 'john@example.com' });

// Delete many documents
const result = await User.deleteMany({ isActive: false });

// Find and delete
const user = await User.findOneAndDelete({ email: 'john@example.com' });

// Delete by ID
const user = await User.findByIdAndDelete('507f1f77bcf86cd799439011');
```

## **8. Validation**

### **Built-in Validators:**

```javascript
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age cannot exceed 120']
    }
});
```

### **Custom Validators:**

```javascript
// Custom validator function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Schema with custom validation
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: [validateEmail, 'Invalid email format']
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Password must be at least 8 characters with numbers and letters
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v);
            },
            message: 'Password must be at least 8 characters with letters and numbers'
        }
    }
});
```

### **Validation Options:**

```javascript
const schema = new mongoose.Schema({
    // Skip validation
}, {
    // Run validators on update operations
    runValidators: true,

    // Set validation context
    context: 'query'
});
```

## **9. Middleware**

### **Pre Middleware:**

```javascript
// Pre-save middleware
userSchema.pre('save', async function(next) {
    // Hash password before saving
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }

    // Update timestamp
    this.updatedAt = new Date();

    next();
});

// Pre-find middleware
userSchema.pre('find', function(next) {
    // Add default filter
    this.where({ isDeleted: { $ne: true } });
    next();
});

// Pre-remove middleware
userSchema.pre('remove', async function(next) {
    // Clean up related documents
    await Comment.deleteMany({ author: this._id });
    next();
});
```

### **Post Middleware:**

```javascript
// Post-save middleware
userSchema.post('save', function(doc) {
    console.log('User saved:', doc.name);
});

// Post-find middleware
userSchema.post('find', function(docs) {
    console.log(`${docs.length} users found`);
});
```

### **Error Handling Middleware:**

```javascript
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email already exists'));
    } else {
        next(error);
    }
});
```

## **10. Population**

### **Basic Population:**

```javascript
// Schema with reference
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Populate single reference
const posts = await Post.find().populate('author');

// Populate with specific fields
const posts = await Post.find().populate('author', 'name email');

// Populate multiple levels
const posts = await Post.find()
    .populate({
        path: 'author',
        select: 'name email',
        populate: {
            path: 'profile',
            select: 'avatar bio'
        }
    });
```

### **Advanced Population:**

```javascript
// Conditional population
const posts = await Post.find()
    .populate({
        path: 'author',
        match: { isActive: true },
        select: 'name email'
    });

// Population with options
const posts = await Post.find()
    .populate({
        path: 'comments',
        options: {
            sort: { createdAt: -1 },
            limit: 10
        },
        populate: {
            path: 'author',
            select: 'name'
        }
    });
```

## **11. Virtuals**

### **Basic Virtuals:**

```javascript
// Virtual property
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual setter
userSchema.virtual('fullName').set(function(name) {
    const [firstName, lastName] = name.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
});

// Include virtuals in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
```

### **Virtual Population:**

```javascript
// Virtual for reverse population
userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'author',
    justOne: false
});

// Use virtual
const user = await User.findById(id).populate('posts');
```

## **12. Plugins**

### **Creating Plugins:**

```javascript
// Soft delete plugin
function softDeletePlugin(schema) {
    schema.add({
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    });

    schema.methods.softDelete = function() {
        this.isDeleted = true;
        this.deletedAt = new Date();
        return this.save();
    };

    schema.methods.restore = function() {
        this.isDeleted = false;
        this.deletedAt = undefined;
        return this.save();
    };

    // Add to queries
    schema.pre('find', function() {
        this.where({ isDeleted: false });
    });

    schema.pre('findOne', function() {
        this.where({ isDeleted: false });
    });
}

// Use plugin
userSchema.plugin(softDeletePlugin);
```

### **Popular Plugins:**

```javascript
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
const mongooseAutopopulate = require('mongoose-autopopulate');

// Add plugins to schema
userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);
userSchema.plugin(mongooseAutopopulate);
```

## **13. Code Examples**

### **Example 1: Complete User Management System**

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstName: String,
    lastName: String,
    age: {
        type: Number,
        min: 0,
        max: 120
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    profile: {
        avatar: String,
        bio: String,
        website: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    if (this.firstName && this.lastName) {
        return `${this.firstName} ${this.lastName}`;
    }
    return this.username;
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getPublicProfile = function() {
    return {
        _id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName,
        profile: this.profile,
        lastLogin: this.lastLogin
    };
};

// Static methods
userSchema.statics.findByUsername = function(username) {
    return this.findOne({ username: username });
};

userSchema.statics.findActiveUsers = function() {
    return this.find({ isActive: true });
};

// Pre-save middleware
userSchema.pre('save', async function(next) {
    // Hash password
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }

    // Update last modified
    this.updatedAt = new Date();

    next();
});

// Post-save middleware
userSchema.post('save', function(doc) {
    console.log(`User ${doc.username} has been saved`);
});

// Model
const User = mongoose.model('User', userSchema);

// Usage
async function createUser(userData) {
    try {
        const user = new User(userData);
        await user.save();
        return user.getPublicProfile();
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Username or email already exists');
        }
        throw error;
    }
}

async function authenticateUser(username, password) {
    const user = await User.findByUsername(username);
    if (!user) {
        throw new Error('User not found');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        throw new Error('Invalid password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return user.getPublicProfile();
}

async function getUsers(page = 1, limit = 10) {
    const options = {
        page: page,
        limit: limit,
        select: 'username email fullName profile lastLogin',
        sort: { createdAt: -1 }
    };

    return await User.paginate({}, options);
}

module.exports = {
    User,
    createUser,
    authenticateUser,
    getUsers
};
```

### **Example 2: Blog System with Relationships**

```javascript
const mongoose = require('mongoose');

// Category Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true });

// Post Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        maxlength: 300
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    publishedAt: Date,
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: 1000
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isApproved: {
            type: Boolean,
            default: true
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, status: 1, publishedAt: -1 });

// Virtuals
postSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

postSchema.virtual('likeCount').get(function() {
    return this.likes.length;
});

// Instance methods
postSchema.methods.addView = function() {
    this.views += 1;
    return this.save();
};

postSchema.methods.addLike = function(userId) {
    if (!this.likes.some(like => like.user.toString() === userId.toString())) {
        this.likes.push({ user: userId });
        return this.save();
    }
    return this;
};

postSchema.methods.addComment = function(userId, content) {
    this.comments.push({
        author: userId,
        content: content
    });
    return this.save();
};

// Static methods
postSchema.statics.findPublished = function() {
    return this.find({ status: 'published' });
};

postSchema.statics.findByCategory = function(categoryId) {
    return this.find({ category: categoryId, status: 'published' });
};

postSchema.statics.findByTag = function(tag) {
    return this.find({
        tags: tag,
        status: 'published'
    });
};

// Pre-save middleware
postSchema.pre('save', function(next) {
    // Generate slug from title
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-');
    }

    // Set published date
    if (this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    next();
});

// Models
const Category = mongoose.model('Category', categorySchema);
const Post = mongoose.model('Post', postSchema);

// Usage functions
async function createPost(postData) {
    const post = new Post(postData);
    await post.save();

    // Populate author and category
    await post.populate('author', 'username fullName');
    await post.populate('category', 'name');

    return post;
}

async function getPosts(options = {}) {
    const {
        page = 1,
        limit = 10,
        category,
        tag,
        author,
        status = 'published'
    } = options;

    let query = { status };

    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (author) query.author = author;

    const posts = await Post
        .find(query)
        .populate('author', 'username fullName profile.avatar')
        .populate('category', 'name slug')
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-__v');

    const total = await Post.countDocuments(query);

    return {
        posts,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
}

async function getPostBySlug(slug) {
    const post = await Post
        .findOne({ slug, status: 'published' })
        .populate('author', 'username fullName profile')
        .populate('category', 'name slug')
        .populate('comments.author', 'username fullName profile.avatar');

    if (post) {
        await post.addView();
    }

    return post;
}

module.exports = {
    Category,
    Post,
    createPost,
    getPosts,
    getPostBySlug
};
```

## **14. Assignments and Projects**

### **Assignment 8.1: Schema Design**
Design Mongoose schemas for different applications:
- E-commerce (products, orders, customers)
- Social media (users, posts, comments, likes)
- Learning management system (courses, students, assignments)
- Project management (projects, tasks, teams)

### **Assignment 8.2: CRUD Operations**
Implement complete CRUD operations with:
- Input validation
- Error handling
- Pagination
- Filtering and sorting
- Population of references

### **Project 8: Blog API with Authentication**
Build a complete blog API with:
- User registration and authentication
- Post creation and management
- Comment system
- Category and tag management
- Search functionality
- File upload for images

### **Challenge Project: E-commerce Platform**
Create an e-commerce API featuring:
- Product catalog with categories
- Shopping cart functionality
- Order management
- Payment processing (mock)
- User reviews and ratings
- Inventory management
- Admin dashboard

## **15. Best Practices**

### **Schema Design:**
- Keep schemas simple and focused
- Use appropriate data types
- Implement proper validation
- Plan for scalability
- Document schema relationships

### **Performance:**
- Use indexes strategically
- Implement pagination for large datasets
- Use lean queries when possible
- Monitor query performance
- Optimize population queries

### **Security:**
- Never store plain text passwords
- Validate and sanitize inputs
- Implement proper authentication
- Use HTTPS in production
- Regular security updates

### **Error Handling:**
- Use try-catch blocks
- Provide meaningful error messages
- Log errors appropriately
- Handle validation errors
- Implement graceful degradation

## **16. Common Patterns**

### **Repository Pattern:**

```javascript
class UserRepository {
    async findById(id) {
        return await User.findById(id);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async update(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}
```

### **Service Layer Pattern:**

```javascript
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(userData) {
        // Business logic
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        userData.password = await bcrypt.hash(userData.password, 12);

        return await this.userRepository.create(userData);
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        return user;
    }
}
```

## **17. Resources**

- [Mongoose Official Documentation](https://mongoosejs.com/docs/)
- [Mongoose API Reference](https://mongoosejs.com/docs/api.html)
- [Mongoose Plugins](https://plugins.mongoosejs.io/)
- [Mongoose Best Practices](https://mongoosejs.com/docs/guide.html)

## **18. Next Steps**

In the next lesson, we'll explore React basics for building interactive user interfaces. You'll learn about:
- Component-based architecture
- JSX syntax
- State and props
- Event handling
- Component lifecycle

Practice working with Mongoose and experiment with different schema designs and query patterns to strengthen your database modeling skills!

---

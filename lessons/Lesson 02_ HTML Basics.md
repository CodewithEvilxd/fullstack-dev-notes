### **Lesson 2: HTML Basics - Elements, Attributes, and Structure**

## **1. What is HTML?**

HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications. It provides the structure and content of web documents, defining elements like headings, paragraphs, links, images, and more.

### **HTML Evolution Timeline:**

#### **HTML 1.0 (1993):**
- Basic structure with headings, paragraphs, links
- Simple text formatting
- No CSS or JavaScript integration

#### **HTML 2.0 (1995):**
- Forms support
- Tables for layout
- Image embedding
- Basic interactivity

#### **HTML 3.2 (1997):**
- Tables, applets, text flow
- Superscripts, subscripts
- Client-side image maps

#### **HTML 4.01 (1999):**
- Strict, Transitional, Frameset variants
- Cascading Style Sheets (CSS) integration
- Accessibility features
- Deprecated presentational elements

#### **XHTML 1.0 (2000):**
- XML-based syntax
- Strict markup requirements
- Better compatibility

#### **HTML5 (2014):**
- Semantic elements
- Multimedia support
- Canvas and SVG
- Geolocation API
- Web Storage
- WebSockets
- Drag and drop

#### **Living Standard (2019+):**
- Continuous updates
- Modern web features
- Progressive enhancement
- Accessibility improvements

### **Key Concepts:**

- **Elements:** The building blocks of HTML. Each element is defined by a start tag, content, and an end tag.
- **Tags:** The markup that defines elements. Tags are enclosed in angle brackets `< >`.
- **Attributes:** Provide additional information about elements. Always specified in the start tag.
- **Content:** The text or nested elements between the start and end tags.
- **Self-closing tags:** Elements that don't have content (like `<img>`, `<br>`, `<input>`).
- **Void elements:** Elements that cannot have content (area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr).
- **Semantic HTML:** Elements that convey meaning about their content and purpose.
- **Accessibility:** Making web content usable for people with disabilities.
- **SEO:** Search engine optimization techniques.

### **HTML Element Anatomy:**

```html
<!-- Complete element -->
<tagname attribute="value">Content goes here</tagname>

<!-- Self-closing element -->
<tagname attribute="value" />

<!-- Element with multiple attributes -->
<tagname attr1="value1" attr2="value2">Content</tagname>

<!-- Element with boolean attribute -->
<input type="checkbox" checked>

<!-- Element with data attributes -->
<div data-user-id="123" data-role="admin">User Info</div>
```

## **2. Document Structure and Metadata**

### **Essential Meta Tags:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A brief description of the page for search engines">
    <meta name="keywords" content="keyword1, keyword2, keyword3">
    <meta name="author" content="Your Name">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#007bff">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="format-detection" content="telephone=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
    <title>Page Title - Max 60 characters for SEO</title>
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
    <link rel="canonical" href="https://example.com/page">
</head>
```

### **Meta Tag Explanations:**

- `charset="UTF-8"`: Specifies character encoding (supports international characters)
- `viewport`: Controls layout on mobile devices (essential for responsive design)
- `description`: Used by search engines (max 160 characters, appears in search results)
- `keywords`: Search engine optimization keywords (less important now, but still useful)
- `author`: Page author information
- `robots`: Instructions for search engine crawlers (`index, follow`, `noindex, nofollow`)
- `theme-color`: Browser UI color on mobile devices
- `mobile-web-app-capable`: Enables web app mode on mobile
- `apple-mobile-web-app-*`: iOS-specific web app settings
- `format-detection`: Prevents automatic phone number detection
- `X-UA-Compatible`: Forces specific IE rendering mode
- `Content-Security-Policy`: Security policy for content sources
- `canonical`: Prevents duplicate content issues

### **Advanced Meta Tags for SEO and Social Media:**

```html
<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="Page Title for Social Media">
<meta property="og:description" content="Description for social sharing">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Your Website Name">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourusername">
<meta name="twitter:creator" content="@yourusername">
<meta name="twitter:title" content="Page Title for Twitter">
<meta name="twitter:description" content="Description for Twitter sharing">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">

<!-- Additional SEO meta tags -->
<meta name="language" content="en-US">
<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="San Francisco">
<meta name="geo.position" content="37.7749;-122.4194">
<meta name="ICBM" content="37.7749, -122.4194">
<meta name="revisit-after" content="7 days">
<meta name="distribution" content="global">
<meta name="rating" content="general">
```

### **Link Tags for External Resources:**

```html
<!-- Stylesheets -->
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">

<!-- Preconnect to external domains for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Favicons -->
<link rel="icon" href="favicon.ico" type="image/x-icon">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">

<!-- RSS/Atom feeds -->
<link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml">
<link rel="alternate" type="application/atom+xml" title="Atom" href="/feed.atom">

<!-- Canonical URL -->
<link rel="canonical" href="https://example.com/page">

<!-- DNS prefetch for performance -->
<link rel="dns-prefetch" href="//example.com">
<link rel="prefetch" href="critical-resource.js">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

## **3. Text Content Elements**

### **Headings:**
```html
<h1>Main heading (only one per page for SEO)</h1>
<h2>Section heading</h2>
<h3>Subsection heading</h3>
<h4>Sub-subsection heading</h4>
<h5>Minor heading</h5>
<h6>Smallest heading</h6>
```

### **Paragraphs and Text Formatting:**
```html
<p>This is a regular paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>

<p>You can also use <b>bold</b> and <i>italic</i> tags, but semantic tags are preferred.</p>

<p>For code snippets, use <code>inline code</code> or <pre>preformatted text</pre>.</p>

<p>This shows <sub>subscript</sub> and <sup>superscript</sup> text.</p>

<p><small>This is smaller text, often used for disclaimers</small></p>

<p><mark>This text is highlighted for emphasis</mark></p>

<p><del>This text is deleted/strikethrough</del></p>

<p><ins>This text is inserted/underlined</ins></p>

<p><abbr title="HyperText Markup Language">HTML</abbr> is the standard markup language.</p>

<p><cite>This is a citation</cite> from a book or article.</p>

<p><dfn>HTML</dfn> is a markup language for creating web pages.</p>

<p><kbd>Ctrl</kbd> + <kbd>C</kbd> copies selected text.</p>

<p><samp>This is sample output from a program.</samp></p>

<p><var>x</var> = <var>y</var> + 2 is a mathematical equation.</p>
```

### **Line Breaks and Horizontal Rules:**
```html
<p>First line<br>Second line on new row</p>
<hr>
<p>Content after horizontal rule</p>
```

### **Quotations and Citations:**
```html
<blockquote>
    <p>This is a long quotation that spans multiple lines and paragraphs.</p>
    <p>It can contain multiple paragraphs and other elements.</p>
    <cite>- Famous Person, Book Title, 2024</cite>
</blockquote>

<p>As Shakespeare said, <q>To be or not to be</q> is a famous question.</p>
```

## **4. Links and Navigation**

### **Basic Links:**
```html
<!-- External link -->
<a href="https://www.google.com">Visit Google</a>

<!-- Internal link -->
<a href="about.html">About Page</a>

<!-- Link to section on same page -->
<a href="#section1">Jump to Section 1</a>

<!-- Email link -->
<a href="mailto:someone@example.com">Send Email</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call Us</a>

<!-- SMS link -->
<a href="sms:+1234567890">Send SMS</a>

<!-- WhatsApp link -->
<a href="https://wa.me/1234567890">Chat on WhatsApp</a>
```

### **Link Attributes:**
```html
<!-- Open in new tab -->
<a href="https://example.com" target="_blank">External Link</a>

<!-- Download link -->
<a href="document.pdf" download>Download PDF</a>
<a href="document.pdf" download="my-document.pdf">Download with custom name</a>

<!-- Link with title tooltip -->
<a href="https://example.com" title="Visit our website">Website</a>

<!-- Link with relationship -->
<a href="https://example.com" rel="noopener noreferrer">Secure External Link</a>

<!-- Link with specific language -->
<a href="https://example.com" hreflang="es">Spanish Version</a>

<!-- Link with media queries -->
<a href="mobile-page.html" media="screen and (max-width: 768px)">Mobile Version</a>
```

### **Advanced Link Techniques:**
```html
<!-- Image as link -->
<a href="product.html">
    <img src="product.jpg" alt="Product Image">
</a>

<!-- Button as link -->
<a href="contact.html" class="button">Contact Us</a>

<!-- Link with icon -->
<a href="https://github.com" aria-label="GitHub Profile">
    <svg class="icon" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    GitHub
</a>

<!-- Skip links for accessibility -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

## **5. Images and Multimedia**

### **Image Basics:**
```html
<!-- Basic image -->
<img src="image.jpg" alt="Description of image">

<!-- Image with dimensions -->
<img src="image.jpg" alt="Description" width="300" height="200">

<!-- Responsive image -->
<img src="image.jpg" alt="Description" style="max-width: 100%; height: auto;">

<!-- Image with loading optimization -->
<img src="image.jpg" alt="Description" loading="lazy" decoding="async">
```

### **Advanced Image Features:**
```html
<!-- Responsive images with srcset -->
<img src="image-small.jpg"
     srcset="image-small.jpg 480w,
             image-medium.jpg 768w,
             image-large.jpg 1024w"
     sizes="(max-width: 480px) 100vw,
            (max-width: 768px) 50vw,
            33vw"
     alt="Responsive image">

<!-- Image with multiple formats (WebP fallback) -->
<picture>
    <source srcset="image.webp" type="image/webp">
    <source srcset="image.jpg" type="image/jpeg">
    <img src="image.jpg" alt="Description">
</picture>

<!-- Image map for clickable areas -->
<img src="planets.jpg" alt="Solar System" usemap="#planetmap">
<map name="planetmap">
    <area shape="rect" coords="0,0,82,126" href="sun.html" alt="Sun">
    <area shape="circle" coords="90,58,3" href="mercury.html" alt="Mercury">
    <area shape="circle" coords="124,58,8" href="venus.html" alt="Venus">
    <area shape="circle" coords="162,58,10" href="earth.html" alt="Earth">
</map>

<!-- Figure with caption -->
<figure>
    <img src="diagram.jpg" alt="Process diagram">
    <figcaption>Figure 1: Overview of the development process</figcaption>
</figure>
```

### **Audio and Video:**
```html
<!-- Audio player -->
<audio controls preload="metadata">
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    <track src="captions.vtt" kind="captions" srclang="en" label="English">
    Your browser does not support the audio element.
</audio>

<!-- Video player -->
<video controls width="640" height="360" poster="thumbnail.jpg" preload="metadata">
    <source src="movie.mp4" type="video/mp4">
    <source src="movie.webm" type="video/webm">
    <track src="subtitles.vtt" kind="subtitles" srclang="en" label="English">
    <track src="chapters.vtt" kind="chapters" srclang="en" label="Chapters">
    Your browser does not support the video tag.
</video>

<!-- Embedded content -->
<iframe src="https://www.youtube.com/embed/video-id"
        width="560" height="315"
        frameborder="0"
        allowfullscreen
        loading="lazy">
</iframe>

<!-- Embedded interactive content -->
<iframe src="https://codepen.io/username/embed/pen-id"
        width="100%" height="400"
        frameborder="0">
</iframe>
```

### **Multimedia Best Practices:**
```html
<!-- Video with multiple quality options -->
<video controls>
    <source src="video-1080p.mp4" type="video/mp4" media="(min-width: 768px)">
    <source src="video-720p.mp4" type="video/mp4" media="(min-width: 480px)">
    <source src="video-480p.mp4" type="video/mp4">
    <track src="subtitles.vtt" kind="subtitles" srclang="en" label="English">
</video>

<!-- Audio with chapters -->
<audio controls>
    <source src="podcast.mp3" type="audio/mpeg">
    <track src="chapters.vtt" kind="chapters" srclang="en" label="Chapters">
</audio>
```

## **6. Lists**

### **Unordered Lists:**
```html
<ul>
    <li>First item</li>
    <li>Second item
        <ul>
            <li>Nested item</li>
            <li>Another nested item</li>
        </ul>
    </li>
    <li>Third item</li>
</ul>

<!-- Custom bullet points -->
<ul style="list-style-type: square;">
    <li>Square bullets</li>
    <li>Another item</li>
</ul>

<ul style="list-style-type: none;">
    <li style="background: url('bullet.png') no-repeat left center; padding-left: 20px;">Custom bullet</li>
</ul>
```

### **Ordered Lists:**
```html
<ol>
    <li>First step</li>
    <li>Second step</li>
    <li>Third step</li>
</ol>

<!-- Different numbering styles -->
<ol type="A">
    <li>Uppercase letters</li>
    <li>Another item</li>
</ol>

<ol type="i">
    <li>Lowercase Roman numerals</li>
    <li>Another item</li>
</ol>

<ol type="I">
    <li>Uppercase Roman numerals</li>
    <li>Another item</li>
</ol>

<ol start="5">
    <li>Fifth item</li>
    <li>Sixth item</li>
</ol>

<!-- Reversed numbering -->
<ol reversed>
    <li>Last item</li>
    <li>Second to last</li>
    <li>Third to last</li>
</ol>
```

### **Definition Lists:**
```html
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language - the standard markup language for web pages</dd>
    <dd>A system of marking up text for display on the World Wide Web</dd>

    <dt>CSS</dt>
    <dd>Cascading Style Sheets - a style sheet language for describing presentation</dd>

    <dt>JavaScript</dt>
    <dd>A programming language that enables interactive web pages</dd>
    <dd>Also known as ECMAScript, the standardized specification</dd>
</dl>
```

### **Advanced List Techniques:**
```html
<!-- Task list with checkboxes -->
<ul class="task-list">
    <li><input type="checkbox" id="task1"> <label for="task1">Complete project proposal</label></li>
    <li><input type="checkbox" id="task2"> <label for="task2">Review code changes</label></li>
    <li><input type="checkbox" id="task3" checked> <label for="task3">Update documentation</label></li>
</ul>

<!-- Navigation menu -->
<nav>
    <ul class="nav-menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a>
            <ul class="submenu">
                <li><a href="#team">Our Team</a></li>
                <li><a href="#history">Company History</a></li>
            </ul>
        </li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
    </ul>
</nav>

<!-- Breadcrumb navigation -->
<nav aria-label="Breadcrumb">
    <ol class="breadcrumb">
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/products/laptops">Laptops</a></li>
        <li aria-current="page">Gaming Laptop</li>
    </ol>
</nav>
```

## **7. Tables**

### **Basic Table Structure:**
```html
<table>
    <caption>Employee Information</caption>
    <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Position</th>
            <th scope="col">Department</th>
            <th scope="col">Salary</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John Doe</td>
            <td>Developer</td>
            <td>Engineering</td>
            <td>$75,000</td>
        </tr>
        <tr>
            <td>Jane Smith</td>
            <td>Designer</td>
            <td>Design</td>
            <td>$70,000</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="3"><strong>Total Employees:</strong></td>
            <td><strong>2</strong></td>
        </tr>
    </tfoot>
</table>
```

### **Advanced Table Features:**
```html
<!-- Table with colgroup for styling -->
<table>
    <caption>Product Comparison</caption>
    <colgroup>
        <col style="width: 30%">
        <col style="width: 20%">
        <col style="width: 25%">
        <col style="width: 25%">
    </colgroup>
    <thead>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Features</th>
            <th>Rating</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Product A</td>
            <td>$99</td>
            <td>Feature 1, Feature 2</td>
            <td>★★★★☆</td>
        </tr>
    </tbody>
</table>

<!-- Responsive table -->
<div class="table-container">
    <table class="responsive-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td data-label="Name">John Doe</td>
                <td data-label="Email">john@example.com</td>
                <td data-label="Phone">555-0123</td>
                <td data-label="Actions">
                    <button>Edit</button>
                    <button>Delete</button>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<!-- Table with sorting and filtering -->
<table class="sortable-table">
    <thead>
        <tr>
            <th data-sort="string">Name</th>
            <th data-sort="number">Age</th>
            <th data-sort="string">Department</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Alice Johnson</td>
            <td>28</td>
            <td>Engineering</td>
        </tr>
        <tr>
            <td>Bob Smith</td>
            <td>34</td>
            <td>Marketing</td>
        </tr>
    </tbody>
</table>
```

### **Table Accessibility:**
```html
<table role="table" aria-label="Employee data" aria-describedby="table-description">
    <caption id="table-description">Current employee information including names, positions, and departments</caption>
    <thead>
        <tr>
            <th scope="col" aria-sort="none">Name</th>
            <th scope="col" aria-sort="none">Position</th>
            <th scope="col" aria-sort="none">Department</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John Doe</td>
            <td>Developer</td>
            <td>Engineering</td>
        </tr>
    </tbody>
</table>
```

## **8. Forms**

### **Basic Form Structure:**
```html
<form action="/submit" method="post" enctype="application/x-www-form-urlencoded">
    <fieldset>
        <legend>Personal Information</legend>

        <div class="form-group">
            <label for="firstname">First Name:</label>
            <input type="text" id="firstname" name="firstname" required minlength="2" maxlength="50">
        </div>

        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required autocomplete="email">
        </div>

        <div class="form-group">
            <label for="age">Age:</label>
            <input type="number" id="age" name="age" min="18" max="120" required>
        </div>
    </fieldset>

    <div class="form-actions">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
    </div>
</form>
```

### **Input Types:**
```html
<!-- Text inputs -->
<input type="text" placeholder="Enter text" pattern="[A-Za-z\s]+" title="Only letters and spaces">
<input type="password" placeholder="Enter password" minlength="8">
<input type="email" placeholder="Enter email" multiple>
<input type="url" placeholder="Enter URL">
<input type="tel" placeholder="Enter phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}">
<input type="search" placeholder="Search...">

<!-- Number and date inputs -->
<input type="number" min="1" max="100" step="5" value="50">
<input type="range" min="0" max="100" step="10" value="50">
<input type="date" min="2020-01-01" max="2030-12-31">
<input type="datetime-local">
<input type="time" step="900"> <!-- 15-minute intervals -->
<input type="month">
<input type="week">

<!-- Selection inputs -->
<input type="checkbox" id="agree" name="agree" value="yes" required>
<label for="agree">I agree to the terms and conditions</label>

<input type="radio" id="male" name="gender" value="male">
<label for="male">Male</label>
<input type="radio" id="female" name="gender" value="female">
<label for="female">Female</label>
<input type="radio" id="other" name="gender" value="other">
<label for="other">Other</label>

<select name="country" required>
    <option value="">Select your country</option>
    <optgroup label="North America">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
        <option value="mx">Mexico</option>
    </optgroup>
    <optgroup label="Europe">
        <option value="uk">United Kingdom</option>
        <option value="de">Germany</option>
        <option value="fr">France</option>
    </optgroup>
</select>

<!-- Text area -->
<textarea name="message" rows="4" cols="50" placeholder="Enter your message..." maxlength="500" required></textarea>

<!-- File upload -->
<input type="file" name="document" accept=".pdf,.doc,.docx" multiple>

<!-- Hidden input -->
<input type="hidden" name="csrf_token" value="abc123">

<!-- Buttons -->
<button type="submit" disabled>Submit Form</button>
<button type="reset">Clear Form</button>
<button type="button" onclick="validateForm()">Validate</button>
```

### **Form Validation:**
```html
<form novalidate>
    <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username"
               required minlength="3" maxlength="20"
               pattern="[a-zA-Z0-9_]+" title="Only letters, numbers, and underscores">
        <div class="error-message" id="username-error"></div>
    </div>

    <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <div class="error-message" id="email-error"></div>
    </div>

    <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password"
               required minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}">
        <div class="error-message" id="password-error"></div>
    </div>

    <div class="form-group">
        <label for="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" name="confirm-password" required>
        <div class="error-message" id="confirm-error"></div>
    </div>

    <button type="submit">Create Account</button>
</form>
```

### **Advanced Form Features:**
```html
<!-- Multi-step form -->
<form id="multi-step-form">
    <div class="step" data-step="1">
        <h3>Step 1: Personal Information</h3>
        <input type="text" name="firstname" placeholder="First Name" required>
        <input type="text" name="lastname" placeholder="Last Name" required>
        <button type="button" onclick="nextStep()">Next</button>
    </div>

    <div class="step" data-step="2" style="display: none;">
        <h3>Step 2: Contact Information</h3>
        <input type="email" name="email" placeholder="Email" required>
        <input type="tel" name="phone" placeholder="Phone" required>
        <button type="button" onclick="prevStep()">Previous</button>
        <button type="button" onclick="nextStep()">Next</button>
    </div>

    <div class="step" data-step="3" style="display: none;">
        <h3>Step 3: Review and Submit</h3>
        <div id="review-data"></div>
        <button type="button" onclick="prevStep()">Previous</button>
        <button type="submit">Submit</button>
    </div>
</form>

<!-- Form with progress indicator -->
<form id="progress-form">
    <div class="progress-bar">
        <div class="progress-fill" style="width: 0%"></div>
    </div>

    <div class="form-step active" data-step="1">
        <h3>Account Information</h3>
        <input type="text" name="username" required>
        <input type="email" name="email" required>
    </div>

    <div class="form-step" data-step="2">
        <h3>Personal Information</h3>
        <input type="text" name="firstname" required>
        <input type="text" name="lastname" required>
    </div>

    <div class="form-step" data-step="3">
        <h3>Complete Setup</h3>
        <button type="submit">Create Account</button>
    </div>
</form>

<!-- Accessible form with ARIA -->
<form role="form" aria-labelledby="form-title">
    <h2 id="form-title">Contact Form</h2>

    <div role="group" aria-labelledby="personal-info">
        <h3 id="personal-info">Personal Information</h3>
        <div>
            <label for="name">Full Name:</label>
            <input type="text" id="name" name="name"
                   aria-required="true"
                   aria-describedby="name-help">
            <div id="name-help">Enter your full legal name</div>
        </div>
    </div>

    <button type="submit" aria-describedby="submit-help">Send Message</button>
    <div id="submit-help">Click to submit your contact information</div>
</form>
```

## **9. Semantic HTML Elements**

### **Layout Elements:**
```html
<header>
    <nav>
        <div class="logo">
            <a href="/">Company Logo</a>
        </div>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <button class="mobile-menu-toggle" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
        </button>
    </nav>
</header>

<main>
    <section id="hero">
        <div class="hero-content">
            <h1>Welcome to Our Website</h1>
            <p>Discover amazing products and services</p>
            <a href="#products" class="cta-button">Get Started</a>
        </div>
    </section>

    <section id="features">
        <h2>Why Choose Us?</h2>
        <div class="features-grid">
            <article class="feature">
                <h3>Quality Products</h3>
                <p>We offer only the highest quality products</p>
            </article>
            <article class="feature">
                <h3>Expert Support</h3>
                <p>Our team of experts is here to help you</p>
            </article>
        </div>
    </section>

    <aside class="sidebar">
        <h3>Latest News</h3>
        <ul>
            <li><a href="/news/1">New Product Launch</a></li>
            <li><a href="/news/2">Company Milestone</a></li>
        </ul>
    </aside>
</main>

<footer>
    <div class="footer-content">
        <div class="footer-section">
            <h3>Company</h3>
            <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/press">Press</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Support</h3>
            <ul>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/status">System Status</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h3>Legal</h3>
            <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/cookies">Cookie Policy</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2024 Company Name. All rights reserved.</p>
    </div>
</footer>
```

### **Other Semantic Elements:**
```html
<!-- Article for self-contained content -->
<article>
    <header>
        <h2>Blog Post Title</h2>
        <p>Published on <time datetime="2024-01-15">January 15, 2024</time></p>
    </header>
    <p>Article content goes here...</p>
    <footer>
        <p>Tags: <a href="/tag/web-development">web development</a></p>
    </footer>
</article>

<!-- Section for thematic grouping -->
<section id="testimonials">
    <h2>What Our Customers Say</h2>
    <blockquote>
        <p>"Amazing service and quality products!"</p>
        <cite>- John Doe, CEO</cite>
    </blockquote>
</section>

<!-- Figure for self-contained content -->
<figure>
    <img src="chart.jpg" alt="Sales growth chart">
    <figcaption>Figure 1: Sales growth over the past year</figcaption>
</figure>

<!-- Details for collapsible content -->
<details>
    <summary>Frequently Asked Questions</summary>
    <div class="faq-content">
        <h3>How do I get started?</h3>
        <p>Simply sign up for an account and follow our quick start guide.</p>
    </div>
</details>

<!-- Time for date/time information -->
<p>The event starts at <time datetime="2024-03-15T19:00">7:00 PM on March 15, 2024</time>.</p>

<!-- Address for contact information -->
<address>
    <strong>Company Name</strong><br>
    123 Business Street<br>
    City, State 12345<br>
    <a href="tel:+1234567890">+1 (234) 567-8900</a><br>
    <a href="mailto:info@company.com">info@company.com</a>
</address>

<!-- Progress for progress indication -->
<label for="file-progress">Upload Progress:</label>
<progress id="file-progress" value="70" max="100">70%</progress>

<!-- Meter for scalar measurement -->
<label for="disk-usage">Disk Usage:</label>
<meter id="disk-usage" value="0.8" min="0" max="1">80%</meter>

<!-- Output for calculation results -->
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
    <input type="number" id="a" value="0"> +
    <input type="number" id="b" value="0"> =
    <output name="result" for="a b">0</output>
</form>
```

### **HTML5 Microdata and Schema.org:**
```html
<!-- Product schema -->
<div itemscope itemtype="https://schema.org/Product">
    <h1 itemprop="name">Premium Laptop</h1>
    <img itemprop="image" src="laptop.jpg" alt="Premium Laptop">
    <p itemprop="description">High-performance laptop for professionals</p>
    <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
        <span itemprop="price">$1,299</span>
        <meta itemprop="priceCurrency" content="USD">
        <span itemprop="availability" content="InStock">In Stock</span>
    </div>
    <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
        <span itemprop="ratingValue">4.5</span> stars based on
        <span itemprop="reviewCount">120</span> reviews
    </div>
</div>

<!-- Article schema -->
<article itemscope itemtype="https://schema.org/Article">
    <h1 itemprop="headline">Complete Web Development Guide</h1>
    <p itemprop="author" itemscope itemtype="https://schema.org/Person">
        By <span itemprop="name">Jane Smith</span>
    </p>
    <time itemprop="datePublished" datetime="2024-01-15">January 15, 2024</time>
    <time itemprop="dateModified" datetime="2024-01-20">January 20, 2024</time>
    <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
        <span itemprop="name">Web Dev Academy</span>
        <div itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
            <img itemprop="url" src="logo.png" alt="Web Dev Academy Logo">
        </div>
    </div>
    <div itemprop="articleBody">
        <p>Web development encompasses...</p>
    </div>
</article>

<!-- Organization schema -->
<div itemscope itemtype="https://schema.org/Organization">
    <h1 itemprop="name">Tech Solutions Inc.</h1>
    <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
        <span itemprop="streetAddress">123 Tech Street</span>
        <span itemprop="addressLocality">San Francisco</span>,
        <span itemprop="addressRegion">CA</span>
        <span itemprop="postalCode">94105</span>
    </div>
    <span itemprop="telephone">+1-555-123-4567</span>
    <a itemprop="email" href="mailto:info@techsolutions.com">info@techsolutions.com</a>
    <a itemprop="url" href="https://techsolutions.com">techsolutions.com</a>
</div>
```

### **HTML5 Accessibility Features:**
```html
<!-- ARIA labels and roles -->
<nav role="navigation" aria-label="Main navigation">
    <ul>
        <li><a href="#home" aria-current="page">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
    </ul>
</nav>

<!-- Form accessibility -->
<form>
    <fieldset>
        <legend>Shipping Information</legend>

        <div>
            <label for="name">Full Name:</label>
            <input id="name" name="name" type="text"
                   aria-required="true"
                   aria-describedby="name-help"
                   autocomplete="name">
            <div id="name-help" class="help-text">
                Enter your full legal name as it appears on your ID
            </div>
        </div>

        <div>
            <label for="email">Email Address:</label>
            <input id="email" name="email" type="email"
                   aria-required="true"
                   aria-describedby="email-error"
                   autocomplete="email">
            <div id="email-error" class="error-message" role="alert" aria-live="polite"></div>
        </div>
    </fieldset>

    <button type="submit" aria-describedby="submit-help">
        Complete Order
    </button>
    <div id="submit-help" class="sr-only">
        Click this button to submit your order and complete the purchase
    </div>
</form>

<!-- Skip links for keyboard navigation -->
<a href="#main-content" class="skip-link" accesskey="s">
    Skip to main content (S)
</a>

<!-- Screen reader only content -->
<div class="sr-only" aria-live="polite" id="status-message"></div>

<!-- Live regions for dynamic content -->
<div aria-live="assertive" aria-atomic="true" id="notification-area"></div>
```

### **HTML5 APIs and Features:**
```html
<!-- Geolocation API -->
<button onclick="getLocation()">Share My Location</button>
<div id="location-info"></div>

<script>
function getLocation() {
    const output = document.getElementById('location-info');

    if (navigator.geolocation) {
        output.textContent = 'Getting location...';

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude, accuracy } = position.coords;
                output.innerHTML = `
                    <strong>Latitude:</strong> ${latitude.toFixed(6)}<br>
                    <strong>Longitude:</strong> ${longitude.toFixed(6)}<br>
                    <strong>Accuracy:</strong> ±${accuracy} meters
                `;
            },
            error => {
                let message;
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Location access denied by user';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        message = 'Location request timed out';
                        break;
                    default:
                        message = 'Unknown location error';
                }
                output.textContent = `Error: ${message}`;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    } else {
        output.textContent = 'Geolocation is not supported by this browser';
    }
}
</script>
```

#### **Web Storage API**
```html
<!-- Web Storage API -->
<div class="storage-demo">
    <h3>Web Storage Demo</h3>
    <input type="text" id="storage-key" placeholder="Key">
    <input type="text" id="storage-value" placeholder="Value">
    <button onclick="saveToStorage()">Save to LocalStorage</button>
    <button onclick="saveToSessionStorage()">Save to SessionStorage</button>
    <button onclick="loadFromStorage()">Load from Storage</button>
    <button onclick="clearStorage()">Clear All</button>
    <div id="storage-output"></div>
</div>

<script>
// LocalStorage - persists until manually cleared
function saveToStorage() {
    const key = document.getElementById('storage-key').value;
    const value = document.getElementById('storage-value').value;

    if (key && value) {
        localStorage.setItem(key, value);
        displayStorageData();
    }
}

// SessionStorage - persists until tab is closed
function saveToSessionStorage() {
    const key = document.getElementById('storage-key').value;
    const value = document.getElementById('storage-value').value;

    if (key && value) {
        sessionStorage.setItem(key, value);
        displayStorageData();
    }
}

function loadFromStorage() {
    const key = document.getElementById('storage-key').value;
    const localValue = localStorage.getItem(key);
    const sessionValue = sessionStorage.getItem(key);

    const output = document.getElementById('storage-output');
    output.innerHTML = `
        <strong>Key:</strong> ${key}<br>
        <strong>LocalStorage:</strong> ${localValue || 'Not found'}<br>
        <strong>SessionStorage:</strong> ${sessionValue || 'Not found'}
    `;
}

function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
    displayStorageData();
}

function displayStorageData() {
    const output = document.getElementById('storage-output');
    const localData = Object.keys(localStorage).map(key =>
        `<li><strong>${key}:</strong> ${localStorage.getItem(key)}</li>`
    ).join('');

    const sessionData = Object.keys(sessionStorage).map(key =>
        `<li><strong>${key}:</strong> ${sessionStorage.getItem(key)}</li>`
    ).join('');

    output.innerHTML = `
        <h4>LocalStorage (${localStorage.length} items):</h4>
        <ul>${localData || '<li>No data</li>'}</ul>
        <h4>SessionStorage (${sessionStorage.length} items):</h4>
        <ul>${sessionData || '<li>No data</li>'}</ul>
    `;
}

// Storage event listener
window.addEventListener('storage', (e) => {
    console.log('Storage changed:', e.key, e.oldValue, e.newValue);
});

// Initialize display
displayStorageData();
</script>
```

#### **Canvas API**
```html
<!-- Canvas API -->
<canvas id="myCanvas" width="400" height="300" style="border: 1px solid #ccc;">
    Your browser does not support the HTML5 Canvas element.
</canvas>

<div class="canvas-controls">
    <button onclick="drawRectangle()">Draw Rectangle</button>
    <button onclick="drawCircle()">Draw Circle</button>
    <button onclick="drawText()">Draw Text</button>
    <button onclick="clearCanvas()">Clear Canvas</button>
    <input type="color" id="colorPicker" value="#ff0000">
    <input type="range" id="brushSize" min="1" max="20" value="5">
</div>

<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

// Set initial canvas properties
ctx.fillStyle = colorPicker.value;
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = brushSize.value;

// Update color when changed
colorPicker.addEventListener('change', (e) => {
    ctx.fillStyle = e.target.value;
    ctx.strokeStyle = e.target.value;
});

// Update brush size when changed
brushSize.addEventListener('input', (e) => {
    ctx.lineWidth = e.target.value;
});

function drawRectangle() {
    ctx.fillRect(50, 50, 150, 100);
}

function drawCircle() {
    ctx.beginPath();
    ctx.arc(200, 150, 50, 0, 2 * Math.PI);
    ctx.fill();
}

function drawText() {
    ctx.font = '24px Arial';
    ctx.fillText('Hello Canvas!', 100, 200);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Mouse drawing functionality
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

// Touch support for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startDrawing({
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
    });
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw({
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
    });
});

canvas.addEventListener('touchend', stopDrawing);
</script>
```

#### **Service Workers API**
```html
<!-- Service Worker Registration -->
<div class="sw-demo">
    <h3>Service Worker Demo</h3>
    <button onclick="registerSW()">Register Service Worker</button>
    <button onclick="unregisterSW()">Unregister Service Worker</button>
    <div id="sw-status">Service Worker Status: Not registered</div>
</div>

<script>
// Check if Service Workers are supported
if ('serviceWorker' in navigator) {
    // Register service worker
    async function registerSW() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);

            updateSWStatus('Service Worker registered successfully');

            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            updateSWStatus('New version available! Please refresh.');
                        } else {
                            updateSWStatus('Service Worker installed for offline use.');
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            updateSWStatus('Service Worker registration failed');
        }
    }

    // Unregister service worker
    async function unregisterSW() {
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
            updateSWStatus('Service Worker unregistered');
        } catch (error) {
            console.error('Service Worker unregistration failed:', error);
            updateSWStatus('Service Worker unregistration failed');
        }
    }

    // Update status display
    function updateSWStatus(message) {
        document.getElementById('sw-status').textContent = message;
    }

    // Check current registration status
    navigator.serviceWorker.ready.then(registration => {
        if (registration) {
            updateSWStatus('Service Worker is active');
        }
    });

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed');
        window.location.reload();
    });
} else {
    document.getElementById('sw-status').textContent =
        'Service Workers are not supported in this browser';
}
</script>
```

#### **Intersection Observer API**
```html
<!-- Intersection Observer API -->
<div class="observer-demo">
    <h3>Intersection Observer Demo</h3>
    <div class="scroll-container">
        <div class="observed-element" data-id="1">Element 1</div>
        <div class="observed-element" data-id="2">Element 2</div>
        <div class="observed-element" data-id="3">Element 3</div>
        <div class="observed-element" data-id="4">Element 4</div>
        <div class="observed-element" data-id="5">Element 5</div>
        <div class="observed-element" data-id="6">Element 6</div>
        <div class="observed-element" data-id="7">Element 7</div>
        <div class="observed-element" data-id="8">Element 8</div>
        <div class="observed-element" data-id="9">Element 9</div>
        <div class="observed-element" data-id="10">Element 10</div>
    </div>
    <div id="observer-log"></div>
</div>

<style>
.scroll-container {
    height: 300px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
}

.observed-element {
    height: 80px;
    margin: 10px 0;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.observed-element.visible {
    background: #4CAF50;
    color: white;
}
</style>

<script>
// Create intersection observer
const observer = new IntersectionObserver((entries) => {
    const log = document.getElementById('observer-log');

    entries.forEach(entry => {
        const element = entry.target;
        const id = element.dataset.id;

        if (entry.isIntersecting) {
            element.classList.add('visible');
            log.innerHTML += `<div>Element ${id} entered viewport</div>`;
        } else {
            element.classList.remove('visible');
            log.innerHTML += `<div>Element ${id} left viewport</div>`;
        }
    });

    // Keep only last 10 log entries
    const logEntries = log.children;
    if (logEntries.length > 10) {
        while (logEntries.length > 10) {
            log.removeChild(logEntries[0]);
        }
    }
}, {
    root: document.querySelector('.scroll-container'),
    rootMargin: '0px',
    threshold: 0.5 // Trigger when 50% of element is visible
});

// Observe all elements
document.querySelectorAll('.observed-element').forEach(element => {
    observer.observe(element);
});

// Lazy loading images with Intersection Observer
function createLazyImage(src, alt) {
    const img = document.createElement('img');
    img.alt = alt;
    img.dataset.src = src;
    img.className = 'lazy-image';

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-image');
                observer.unobserve(img);
            }
        });
    });

    imageObserver.observe(img);
    return img;
}

// Infinite scroll with Intersection Observer
function createInfiniteScroll(container, loadMoreCallback) {
    const sentinel = document.createElement('div');
    sentinel.className = 'sentinel';
    container.appendChild(sentinel);

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadMoreCallback();
            }
        });
    }, {
        root: container,
        rootMargin: '100px'
    });

    scrollObserver.observe(sentinel);

    return {
        disconnect: () => scrollObserver.disconnect(),
        removeSentinel: () => container.removeChild(sentinel)
    };
}
</script>
```

#### **Drag and Drop API**
```html
<!-- Drag and Drop API -->
<div class="drag-drop-demo">
    <h3>Drag and Drop Demo</h3>

    <div class="drag-zone">
        <h4>Drag Zone</h4>
        <div class="draggable-item" draggable="true" data-id="1">Item 1</div>
        <div class="draggable-item" draggable="true" data-id="2">Item 2</div>
        <div class="draggable-item" draggable="true" data-id="3">Item 3</div>
    </div>

    <div class="drop-zone" id="drop-zone">
        <h4>Drop Zone</h4>
        <p>Drop items here</p>
    </div>

    <div id="drag-feedback"></div>
</div>

<style>
.drag-zone, .drop-zone {
    min-height: 200px;
    border: 2px dashed #ccc;
    padding: 20px;
    margin: 10px;
    border-radius: 4px;
}

.draggable-item {
    background: #4CAF50;
    color: white;
    padding: 10px;
    margin: 5px 0;
    border-radius: 4px;
    cursor: move;
}

.draggable-item:hover {
    background: #45a049;
}

.drop-zone.drag-over {
    background: #e8f5e8;
    border-color: #4CAF50;
}

.dropped-item {
    background: #2196F3;
}
</style>

<script>
// Drag and Drop functionality
const draggableItems = document.querySelectorAll('.draggable-item');
const dropZone = document.getElementById('drop-zone');
const feedback = document.getElementById('drag-feedback');

// Add drag event listeners to draggable items
draggableItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
});

// Add drop zone event listeners
dropZone.addEventListener('dragenter', handleDragEnter);
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
    feedback.textContent = `Dragging: ${e.target.textContent}`;
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    feedback.textContent = '';
}

function handleDragEnter(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragLeave(e) {
    if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const itemId = e.dataTransfer.getData('text/plain');
    const draggedItem = document.querySelector(`[data-id="${itemId}"]`);

    if (draggedItem) {
        // Clone the item and add to drop zone
        const clonedItem = draggedItem.cloneNode(true);
        clonedItem.classList.add('dropped-item');
        clonedItem.classList.remove('draggable-item');
        clonedItem.draggable = false;

        dropZone.appendChild(clonedItem);
        feedback.textContent = `Dropped: ${draggedItem.textContent}`;
    }
}

// File drag and drop
const fileDropZone = document.createElement('div');
fileDropZone.innerHTML = '<p>Drop files here</p>';
fileDropZone.style.cssText = `
    border: 2px dashed #ccc;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
    border-radius: 4px;
`;

document.body.appendChild(fileDropZone);

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileDropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    fileDropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileDropZone.addEventListener(eventName, unhighlight, false);
});

fileDropZone.addEventListener('drop', handleFileDrop, false);

function highlight() {
    fileDropZone.style.backgroundColor = '#e8f5e8';
    fileDropZone.style.borderColor = '#4CAF50';
}

function unhighlight() {
    fileDropZone.style.backgroundColor = '';
    fileDropZone.style.borderColor = '#ccc';
}

function handleFileDrop(e) {
    const files = e.dataTransfer.files;

    for (const file of files) {
        console.log('Dropped file:', file.name, file.type, file.size);
        // Handle file processing here
    }

    feedback.textContent = `Dropped ${files.length} file(s)`;
}
</script>
```

## **10. HTML Best Practices and Performance**

### **Performance Optimization**
```html
<!-- Optimized HTML structure -->
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- DNS prefetch for other domains -->
    <link rel="dns-prefetch" href="//api.example.com">
    <link rel="dns-prefetch" href="//cdn.example.com">

    <!-- Preload critical resources -->
    <link rel="preload" href="critical.css" as="style">
    <link rel="preload" href="critical.js" as="script">
    <link rel="preload" href="hero-image.jpg" as="image">

    <!-- Module preload for JavaScript modules -->
    <link rel="modulepreload" href="app.js">

    <!-- Resource hints -->
    <link rel="prefetch" href="next-page.html">
    <link rel="prerender" href="likely-next-page.html">
</head>
<body>
    <!-- Above the fold content first -->
    <header>
        <h1>Page Title</h1>
        <nav>
            <!-- Critical navigation -->
        </nav>
    </header>

    <!-- Defer non-critical content -->
    <main>
        <section id="hero">
            <!-- Hero content -->
        </section>

        <!-- Lazy load below the fold content -->
        <section class="lazy-load">
            <!-- Content loaded via JavaScript -->
        </section>
    </main>

    <!-- Defer non-critical scripts -->
    <script src="non-critical.js" defer></script>

    <!-- Critical scripts in head with async -->
    <script src="critical.js" async></script>
</body>
</html>
```

### **SEO Best Practices**
```html
<!-- Complete SEO-optimized HTML -->
<!DOCTYPE html>
<html lang="en" itemscope itemtype="https://schema.org/WebPage">
<head>
    <!-- Basic meta tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO meta tags -->
    <title>Complete Guide to Web Development | Learn HTML, CSS, JavaScript</title>
    <meta name="description" content="Master web development with our comprehensive guide covering HTML5, CSS3, JavaScript, React, Node.js, and more. Start your journey today!">
    <meta name="keywords" content="web development, HTML, CSS, JavaScript, React, Node.js, programming, coding">
    <meta name="author" content="Web Dev Academy">

    <!-- Open Graph meta tags -->
    <meta property="og:title" content="Complete Guide to Web Development">
    <meta property="og:description" content="Master web development with our comprehensive guide">
    <meta property="og:image" content="https://example.com/og-image.jpg">
    <meta property="og:url" content="https://example.com/guide">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Web Dev Academy">

    <!-- Twitter Card meta tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@webdevacademy">
    <meta name="twitter:creator" content="@webdevacademy">
    <meta name="twitter:title" content="Complete Guide to Web Development">
    <meta name="twitter:description" content="Master web development with our comprehensive guide">
    <meta name="twitter:image" content="https://example.com/twitter-image.jpg">

    <!-- Technical meta tags -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="googlebot" content="index, follow">
    <meta name="theme-color" content="#007bff">
    <meta name="mobile-web-app-capable" content="yes">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://example.com/guide">

    <!-- Favicon -->
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header>
        <nav aria-label="Main navigation">
            <ul>
                <li><a href="/" aria-current="page">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main id="main-content">
        <article itemscope itemtype="https://schema.org/Article">
            <header>
                <h1 itemprop="headline">Complete Guide to Web Development</h1>
                <p itemprop="description">Learn everything you need to know about modern web development</p>
                <meta itemprop="datePublished" content="2024-01-15">
                <meta itemprop="dateModified" content="2024-01-20">
            </header>

            <div itemprop="articleBody">
                <section>
                    <h2>Introduction to Web Development</h2>
                    <p>Web development encompasses the creation and maintenance of websites...</p>
                </section>

                <section>
                    <h2>HTML Fundamentals</h2>
                    <p>HTML (HyperText Markup Language) is the foundation of web development...</p>
                </section>
            </div>
        </article>
    </main>

    <footer>
        <p>&copy; 2024 Web Dev Academy. All rights reserved.</p>
    </footer>

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Complete Guide to Web Development",
        "description": "Master web development with our comprehensive guide covering HTML5, CSS3, JavaScript, React, Node.js, and more",
        "author": {
            "@type": "Organization",
            "name": "Web Dev Academy"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Web Dev Academy"
        },
        "datePublished": "2024-01-15",
        "dateModified": "2024-01-20",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://example.com/guide"
        }
    }
    </script>
</body>
</html>
```

### **Accessibility Best Practices**
```html
<!-- Complete accessible HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Accessible Web Page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <!-- Skip links -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#navigation" class="skip-link">Skip to navigation</a>

    <header role="banner">
        <h1>Company Name</h1>
        <nav id="navigation" role="navigation" aria-label="Main navigation">
            <ul>
                <li><a href="#home" aria-current="page">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main id="main-content" role="main">
        <section aria-labelledby="welcome-heading">
            <h2 id="welcome-heading">Welcome to Our Website</h2>
            <p>This website is designed with accessibility in mind.</p>
        </section>

        <section aria-labelledby="contact-form">
            <h2 id="contact-form">Contact Us</h2>
            <form action="/submit" method="post" novalidate>
                <fieldset>
                    <legend>Personal Information</legend>

                    <div>
                        <label for="name">Full Name:</label>
                        <input type="text"
                               id="name"
                               name="name"
                               required
                               aria-required="true"
                               aria-describedby="name-help">
                        <div id="name-help">Enter your full legal name</div>
                    </div>

                    <div>
                        <label for="email">Email Address:</label>
                        <input type="email"
                               id="email"
                               name="email"
                               required
                               aria-required="true"
                               aria-describedby="email-error">
                        <div id="email-error" role="alert" aria-live="polite"></div>
                    </div>
                </fieldset>

                <button type="submit" aria-describedby="submit-help">Send Message</button>
                <div id="submit-help">Click to submit your contact information</div>
            </form>
        </section>

        <!-- Live region for dynamic content -->
        <div aria-live="polite" aria-atomic="true" id="status-messages"></div>
    </main>

    <footer role="contentinfo">
        <p>&copy; 2024 Company Name. All rights reserved.</p>
    </footer>

    <!-- Screen reader only content -->
    <div class="sr-only" aria-live="assertive" id="error-announcements"></div>
</body>
</html>
```

## **11. HTML5 Web Components**

### **Custom Elements**
```html
<!-- Custom Element Definition -->
<script>
// Define a custom element
class UserCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    static get observedAttributes() {
        return ['name', 'email', 'avatar'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const name = this.getAttribute('name') || 'Anonymous';
        const email = this.getAttribute('email') || '';
        const avatar = this.getAttribute('avatar') || 'https://via.placeholder.com/100';

        this.shadowRoot.innerHTML = `
            <style>
                .user-card {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    max-width: 300px;
                    font-family: Arial, sans-serif;
                }
                .avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right: 16px;
                }
                .info h3 {
                    margin: 0 0 4px 0;
                    color: #333;
                }
                .info p {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                }
                .edit-btn {
                    margin-left: auto;
                    padding: 6px 12px;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>
            <div class="user-card">
                <img src="${avatar}" alt="${name}" class="avatar">
                <div class="info">
                    <h3>${name}</h3>
                    <p>${email}</p>
                </div>
                <button class="edit-btn">Edit</button>
            </div>
        `;
    }

    addEventListeners() {
        const editBtn = this.shadowRoot.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('edit-user', {
                detail: {
                    name: this.getAttribute('name'),
                    email: this.getAttribute('email')
                },
                bubbles: true
            }));
        });
    }

    removeEventListeners() {
        const editBtn = this.shadowRoot.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.removeEventListener('click', this.handleEdit);
        }
    }
}

// Register the custom element
customElements.define('user-card', UserCard);
</script>

<!-- Using the custom element -->
<user-card
    name="John Doe"
    email="john@example.com"
    avatar="https://via.placeholder.com/100/007bff/ffffff">
</user-card>

<user-card
    name="Jane Smith"
    email="jane@example.com">
</user-card>
```

### **Shadow DOM**
```html
<!-- Shadow DOM Example -->
<div id="host"></div>

<script>
class ShadowHost extends HTMLElement {
    constructor() {
        super();

        // Create shadow root
        const shadow = this.attachShadow({ mode: 'open' });

        // Add styles and content
        shadow.innerHTML = `
            <style>
                .shadow-content {
                    background: #f0f0f0;
                    padding: 20px;
                    border-radius: 8px;
                    border: 2px solid #007bff;
                }
                .shadow-title {
                    color: #007bff;
                    margin: 0 0 10px 0;
                }
                .shadow-button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
            </style>

            <div class="shadow-content">
                <h3 class="shadow-title">Shadow DOM Content</h3>
                <p>This content is encapsulated in Shadow DOM.</p>
                <button class="shadow-button">Shadow Button</button>
            </div>
        `;

        // Add event listener
        const button = shadow.querySelector('.shadow-button');
        button.addEventListener('click', () => {
            alert('Button clicked from Shadow DOM!');
        });
    }
}

customElements.define('shadow-host', ShadowHost);

// Add to page
const host = document.getElementById('host');
host.innerHTML = '<shadow-host></shadow-host>';
</script>
```

### **HTML Templates**
```html
<!-- HTML Templates -->
<template id="user-card-template">
    <style>
        .user-card {
            display: flex;
            align-items: center;
            padding: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            max-width: 300px;
            margin: 10px 0;
        }
        .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 12px;
        }
        .info h4 {
            margin: 0 0 4px 0;
        }
        .info p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
    </style>

    <div class="user-card">
        <img class="avatar" src="" alt="">
        <div class="info">
            <h4 class="name"></h4>
            <p class="email"></p>
        </div>
    </div>
</template>

<div id="user-container"></div>

<script>
function createUserCard(user) {
    // Get template
    const template = document.getElementById('user-card-template');
    const clone = template.content.cloneNode(true);

    // Fill in user data
    const avatar = clone.querySelector('.avatar');
    const name = clone.querySelector('.name');
    const email = clone.querySelector('.email');

    avatar.src = user.avatar || 'https://via.placeholder.com/50';
    avatar.alt = user.name;
    name.textContent = user.name;
    email.textContent = user.email;

    return clone;
}

// Sample users
const users = [
    { name: 'John Doe', email: 'john@example.com', avatar: 'https://via.placeholder.com/50/007bff/ffffff' },
    { name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://via.placeholder.com/50/ff69b4/ffffff' },
    { name: 'Bob Johnson', email: 'bob@example.com' }
];

// Add user cards to container
const container = document.getElementById('user-container');
users.forEach(user => {
    const userCard = createUserCard(user);
    container.appendChild(userCard);
});
</script>
```

## **12. Modern HTML Development Workflow**

### **HTML with Build Tools**
```html
<!-- index.html with build tool integration -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= htmlWebpackPlugin.options.title %></title>

    <!-- Preload critical resources -->
    <link rel="preload" href="bundle.js" as="script">
    <link rel="preload" href="styles.css" as="style">

    <!-- Favicon -->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">

    <!-- Meta tags -->
    <meta name="description" content="<%= htmlWebpackPlugin.options.description %>">
</head>
<body>
    <div id="root">
        <!-- React app will be mounted here -->
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading application...</p>
        </div>
    </div>

    <!-- Load bundled JavaScript -->
    <script src="bundle.js"></script>
</body>
</html>
```

### **HTML Modules and Components**
```html
<!-- Component-based HTML structure -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Component-Based HTML</title>
    <link rel="stylesheet" href="components.css">
</head>
<body>
    <!-- Header Component -->
    <header class="header-component">
        <nav class="nav-component">
            <div class="logo-component">
                <a href="/">Logo</a>
            </div>
            <ul class="menu-component">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Hero Component -->
        <section class="hero-component">
            <div class="hero-content">
                <h1>Welcome to Our Website</h1>
                <p>Discover amazing things</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>

        <!-- Card Grid Component -->
        <section class="card-grid-component">
            <div class="card-component">
                <img src="feature1.jpg" alt="Feature 1">
                <h3>Feature 1</h3>
                <p>Description of feature 1</p>
            </div>
            <div class="card-component">
                <img src="feature2.jpg" alt="Feature 2">
                <h3>Feature 2</h3>
                <p>Description of feature 2</p>
            </div>
        </section>
    </main>

    <!-- Footer Component -->
    <footer class="footer-component">
        <div class="footer-content">
            <p>&copy; 2024 Company Name</p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="components.js"></script>
</body>
</html>
```

This comprehensive HTML documentation now covers everything from basic structure to advanced HTML5 features, APIs, accessibility, SEO, performance optimization, and modern development workflows. The examples are production-ready and include best practices for professional web development.

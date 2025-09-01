### **Lesson 3: CSS Basics - Advanced Styling and Modern Techniques**

## **1. What is CSS?**

CSS (Cascading Style Sheets) is the styling language that controls the visual presentation of web documents. It separates content (HTML) from presentation, enabling maintainable, scalable, and responsive web designs.

### **CSS Evolution Timeline:**

#### **CSS Level 1 (1996):**
- Basic text formatting and colors
- Font properties and spacing
- Backgrounds and borders
- Simple box model

#### **CSS Level 2 (1998):**
- Positioning and layout
- Media types and paged media
- Aural style sheets
- International features

#### **CSS Level 2.1 (2004):**
- Bug fixes and clarifications
- Better browser support
- Foundation for modern CSS

#### **CSS Level 3 (2005+):**
- Modular specification
- Advanced selectors
- Border-radius, box-shadow
- Multiple background images
- Transitions and animations
- Media queries

#### **Modern CSS (2020+):**
- CSS Grid and Flexbox
- Custom properties (variables)
- Container queries
- Logical properties
- Modern color spaces
- Performance optimizations

### **Key Concepts:**

- **Selectors:** Patterns for targeting HTML elements
- **Properties:** Aspects of elements to style (color, size, position)
- **Values:** Specific settings for properties
- **Declarations:** Property-value pairs
- **Declaration Blocks:** Groups of declarations in curly braces `{}`
- **Rules:** Selectors combined with declaration blocks
- **Specificity:** How browsers determine which rule applies
- **Cascade:** How styles inherit and override
- **Box Model:** How elements are sized and spaced
- **Layout Systems:** Methods for arranging elements

### **CSS Architecture Patterns:**

#### **BEM (Block Element Modifier):**
```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__content { }

/* Modifier */
.card--featured { }
.card__title--large { }
```

#### **SMACSS (Scalable and Modular Architecture for CSS):**
```css
/* Base rules */
body, h1, p { }

/* Layout rules */
.l-container { }
.l-sidebar { }

/* Module rules */
.btn { }
.card { }

/* State rules */
.is-hidden { }
.is-active { }

/* Theme rules */
.theme-dark { }
```

#### **CSS-in-JS Patterns:**
```javascript
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px'
    }
};
```

## **2. Advanced CSS Selectors**

### **Basic Selectors:**

```css
/* Universal selector */
* { margin: 0; padding: 0; }

/* Type selector */
h1, h2, h3 { color: #333; }

/* Class selector */
.highlight { background-color: yellow; }

/* ID selector */
#main { width: 100%; }

/* Attribute selectors */
input[type="text"] { border: 1px solid #ccc; }
input[type="email"] { background-color: #f9f9f9; }
[href^="https"] { color: green; } /* Starts with */
[href$=".pdf"] { background: url(pdf-icon.png) no-repeat; } /* Ends with */
[class*="btn"] { border-radius: 4px; } /* Contains */
[href|="en"] { font-weight: bold; } /* Exact or starts with hyphen */
```

### **Combinator Selectors:**

```css
/* Descendant combinator (space) */
article p { line-height: 1.6; }

/* Child combinator (>) */
nav > ul > li { display: inline-block; }

/* Adjacent sibling combinator (+) */
h1 + p { font-weight: bold; }

/* General sibling combinator (~) */
h1 ~ p { margin-left: 20px; }
```

### **Pseudo-Classes and Pseudo-Elements:**

#### **Link and User Action Pseudo-Classes:**
```css
/* Link states */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; text-decoration: underline; }
a:active { color: orange; }
a:focus { outline: 2px solid blue; outline-offset: 2px; }

/* Form states */
input:focus { border-color: blue; box-shadow: 0 0 0 3px rgba(0,123,255,0.25); }
input:valid { border-color: green; }
input:invalid { border-color: red; }
input:required { border-left: 3px solid red; }
input:optional { border-left: 3px solid green; }
input:checked + label { font-weight: bold; }
input:disabled { opacity: 0.5; cursor: not-allowed; }
```

#### **Structural Pseudo-Classes:**
```css
/* Position-based */
li:first-child { font-weight: bold; }
li:last-child { margin-bottom: 0; }
li:only-child { text-align: center; }
li:nth-child(odd) { background-color: #f2f2f2; }
li:nth-child(even) { background-color: #ffffff; }
li:nth-child(3n+1) { color: blue; } /* Every 3rd item starting from 1 */
li:nth-last-child(2) { color: red; } /* Second to last */

/* Type-based */
p:first-of-type { font-size: 1.2em; }
p:last-of-type { margin-bottom: 0; }
p:nth-of-type(2) { color: green; }
p:only-of-type { text-align: center; }
```

#### **Advanced Pseudo-Classes:**
```css
/* Negation */
div:not(.special) { color: gray; }
button:not(:disabled) { cursor: pointer; }

/* Empty elements */
p:empty { display: none; }
div:empty::before { content: "This element is empty"; }

/* Content-based */
p:has(img) { border: 1px solid #ccc; padding: 10px; }
article:has(h2) { background: linear-gradient(45deg, #f0f0f0, #e0e0e0); }

/* Form interaction */
input:in-range { border-color: green; }
input:out-of-range { border-color: red; }
input:placeholder-shown { background-color: #f8f9fa; }

/* Language */
p:lang(fr) { font-style: italic; }
q:lang(de)::before { content: '"'; }
q:lang(de)::after { content: '"'; }

/* Target for anchor links */
section:target { background-color: yellow; animation: highlight 2s ease; }

/* Focus states */
button:focus-visible { outline: 2px solid blue; outline-offset: 2px; }
button:focus:not(:focus-visible) { outline: none; }
```

#### **Pseudo-Elements:**
```css
/* Content generation */
h1::before { content: "📖 "; }
h1::after { content: " ★"; color: gold; }
a::after { content: " (" attr(href) ")"; font-size: 0.8em; color: #666; }

/* Text styling */
p::first-letter { font-size: 2em; font-weight: bold; float: left; margin-right: 5px; }
p::first-line { font-variant: small-caps; text-transform: uppercase; }

/* Selection styling */
::selection { background-color: #007bff; color: white; }
::-moz-selection { background-color: #007bff; color: white; }

/* Placeholder styling */
::placeholder { color: #999; font-style: italic; opacity: 1; }
::-webkit-input-placeholder { color: #999; font-style: italic; }
::-moz-placeholder { color: #999; font-style: italic; }
::-ms-input-placeholder { color: #999; font-style: italic; }

/* Scrollbar styling */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; border-radius: 5px; }
::-webkit-scrollbar-thumb:hover { background: #555; }
```

## **3. CSS Properties and Values**

### **Color Values and Advanced Color Techniques:**

#### **Modern Color Formats:**
```css
/* Named colors */
color: red;
background-color: white;

/* Hexadecimal */
color: #ff0000;
color: #f00; /* Short form */
color: #ff0000ff; /* With alpha */
color: #f00f; /* Short with alpha */

/* RGB and RGBA */
color: rgb(255, 0, 0);
background-color: rgba(255, 255, 255, 0.8);

/* HSL and HSLA */
color: hsl(0, 100%, 50%);
background-color: hsla(0, 0%, 100%, 0.8);

/* HWB (Hue, Whiteness, Blackness) */
color: hwb(0 0% 0%);
color: hwb(120 30% 40%);

/* LAB color space */
color: lab(50% 40 59.5);
background-color: lch(50% 40 59.5);

/* Color functions */
color: color(display-p3 1 0 0); /* Wide color gamut */
color: color(rec2020 1 0 0); /* Ultra-wide color gamut */

/* Relative colors */
color: rgb(from var(--primary-color) r g b / 0.8);
background-color: hsl(from var(--accent-color) h s l / 0.9);
```

#### **CSS Custom Properties (Variables):**
```css
/* Define variables */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --font-size-base: 16px;
    --spacing-unit: 1rem;
    --border-radius: 4px;
    --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    --gradient: linear-gradient(45deg, #007bff, #6610f2);
}

/* Use variables */
.button {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing-unit);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    font-size: var(--font-size-base);
}

/* Variable composition */
--spacing-large: calc(var(--spacing-unit) * 2);
--border: 1px solid var(--primary-color);
--button-hover: color-mix(in srgb, var(--primary-color) 90%, black);

/* Dynamic variables with JavaScript */
document.documentElement.style.setProperty('--primary-color', '#ff6b6b');

/* Fallback values */
color: var(--text-color, #333);
background: var(--bg-color, white);

/* Scoped variables */
.component {
    --component-color: blue;
}

.component .child {
    color: var(--component-color);
}
```

### **Typography and Text Properties:**

```css
/* Font properties */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-size: 16px;
font-weight: 400; /* normal | bold | 100-900 */
font-style: normal; /* normal | italic | oblique */
font-variant: normal; /* normal | small-caps */
line-height: 1.5;
letter-spacing: 0.5px;
word-spacing: 2px;
text-align: left; /* left | right | center | justify */
text-decoration: none; /* none | underline | overline | line-through */
text-decoration-color: currentColor;
text-decoration-style: solid; /* solid | double | dotted | dashed | wavy */
text-decoration-thickness: 1px;
text-transform: none; /* none | capitalize | uppercase | lowercase */
text-indent: 0;
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
white-space: normal; /* normal | nowrap | pre | pre-wrap | pre-line */
word-break: normal; /* normal | break-all | keep-all | break-word */
overflow-wrap: break-word;
hyphens: manual; /* none | manual | auto */
```

### **Box Model and Spacing:**

```css
/* Content dimensions */
width: 300px;
height: 200px;
min-width: 200px;
max-width: 100%;
min-height: 100px;
max-height: 500px;

/* Padding */
padding: 10px; /* All sides */
padding: 10px 20px; /* Top/bottom, left/right */
padding: 10px 20px 30px; /* Top, left/right, bottom */
padding: 10px 20px 30px 40px; /* Top, right, bottom, left */
padding-block: 10px 20px; /* Logical: block start/end */
padding-inline: 15px 25px; /* Logical: inline start/end */

/* Border */
border: 1px solid #ccc;
border-width: 2px;
border-style: solid; /* none | solid | dashed | dotted | double | groove | ridge | inset | outset */
border-color: #333;
border-radius: 4px;
border-top-left-radius: 8px;
border-image: linear-gradient(45deg, #ff6b6b, #4ecdc4) 1;

/* Margin */
margin: 20px auto; /* Center horizontally */
margin-top: 10px;
margin-bottom: 10px;
margin-block: 10px 20px; /* Logical properties */
margin-inline: 15px 25px;

/* Outline */
outline: 2px solid blue;
outline-offset: 2px;
outline-style: dashed;
```

### **Box-Sizing Property:**

```css
/* Default box-sizing */
.box {
    box-sizing: content-box; /* Width/height = content only */
    width: 300px;
    padding: 20px;
    border: 2px solid #ccc;
    /* Total width = 300px + 40px + 4px = 344px */
}

/* Modern approach */
.box {
    box-sizing: border-box; /* Width/height = content + padding + border */
    width: 300px;
    padding: 20px;
    border: 2px solid #ccc;
    /* Total width = 300px (padding and border included) */
}

/* Apply to all elements */
*, *::before, *::after {
    box-sizing: border-box;
}
```

## **4. Advanced Layout Techniques**

### **CSS Grid Layout:**

```css
/* Grid container */
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
    grid-template-rows: auto auto; /* 2 rows with auto height */
    gap: 20px;
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";
}

/* Grid items */
.header {
    grid-area: header;
    grid-column: 1 / -1; /* Span all columns */
}

.sidebar {
    grid-area: sidebar;
    grid-row: 2 / 3;
}

.main {
    grid-area: main;
    grid-column: 2 / -1; /* Start at column 2, end at last */
}

.footer {
    grid-area: footer;
    grid-column: 1 / -1;
}

/* Advanced grid patterns */
.masonry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-template-rows: masonry; /* CSS masonry layout */
    gap: 20px;
}

.responsive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

/* Grid alignment */
.grid-item {
    display: grid;
    place-items: center; /* Center both axes */
    place-content: center; /* Center grid content */
    align-items: center;
    justify-items: center;
    align-content: center;
    justify-content: center;
}
```

### **Flexbox Layout:**

```css
/* Flex container */
.flex-container {
    display: flex;
    flex-direction: row; /* row | row-reverse | column | column-reverse */
    flex-wrap: nowrap; /* nowrap | wrap | wrap-reverse */
    justify-content: flex-start; /* flex-start | flex-end | center | space-between | space-around | space-evenly */
    align-items: stretch; /* stretch | flex-start | flex-end | center | baseline */
    align-content: stretch; /* For multi-line flexbox */
    gap: 20px; /* Modern gap property */
}

/* Flex items */
.flex-item {
    flex: 1; /* flex-grow: 1; flex-shrink: 1; flex-basis: 0% */
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 200px;
    align-self: center; /* Override container's align-items */
    order: 0; /* Change visual order */
}

/* Common flexbox patterns */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    flex: 1 1 300px; /* Grow, shrink, basis */
}

.center-content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.equal-height-cards {
    display: flex;
    flex-direction: column;
}

@media (min-width: 768px) {
    .equal-height-cards {
        flex-direction: row;
    }
}
```

### **CSS Positioning:**

```css
/* Static positioning (default) */
.static-element {
    position: static;
}

/* Relative positioning */
.relative-element {
    position: relative;
    top: 10px;
    left: 20px;
}

/* Absolute positioning */
.absolute-element {
    position: absolute;
    top: 50px;
    right: 30px;
}

/* Fixed positioning */
.fixed-element {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
}

/* Sticky positioning */
.sticky-element {
    position: sticky;
    top: 20px;
}

/* Z-index for layering */
.layered-element {
    position: relative;
    z-index: 10;
}

/* Modern positioning with anchor positioning */
.anchor-element {
    position: absolute;
    position-anchor: --my-anchor;
    top: anchor(bottom);
    left: anchor(center);
}
```

## **5. Responsive Design and Media Queries**

### **Media Query Basics:**

```css
/* Basic media query */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
}

/* Multiple conditions */
@media (min-width: 768px) and (max-width: 1024px) {
    .sidebar {
        display: none;
    }
}

/* Orientation */
@media (orientation: landscape) {
    .hero {
        height: 50vh;
    }
}

/* Device pixel ratio */
@media (-webkit-min-device-pixel-ratio: 2) {
    .logo {
        background-image: url('logo@2x.png');
    }
}

/* Color scheme preference */
@media (prefers-color-scheme: dark) {
    body {
        background-color: #1a1a1a;
        color: #ffffff;
    }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### **Container Queries (Modern Approach):**

```css
/* Container setup */
.card-container {
    container-type: inline-size;
    container-name: card-container;
}

/* Container queries */
@container card-container (min-width: 400px) {
    .card {
        display: flex;
        align-items: center;
    }

    .card-content {
        margin-left: 20px;
    }
}

@container card-container (min-width: 600px) {
    .card {
        padding: 30px;
    }

    .card-title {
        font-size: 1.5rem;
    }
}
```

### **Responsive Images:**

```css
/* Responsive image */
.responsive-image {
    max-width: 100%;
    height: auto;
}

/* Picture element for art direction */
<picture>
    <source media="(min-width: 768px)" srcset="hero-large.jpg">
    <source media="(min-width: 480px)" srcset="hero-medium.jpg">
    <img src="hero-small.jpg" alt="Hero image">
</picture>

/* Image with multiple resolutions */
<img src="image-400.jpg"
     srcset="image-400.jpg 400w,
             image-800.jpg 800w,
             image-1200.jpg 1200w"
     sizes="(max-width: 400px) 100vw,
            (max-width: 800px) 50vw,
            33vw"
     alt="Responsive image">
```

### **Fluid Typography:**

```css
/* Fluid typography with clamp */
html {
    font-size: clamp(16px, 2vw, 24px);
}

/* CSS custom properties for fluid values */
:root {
    --fluid-font-size: clamp(1rem, 2vw, 1.5rem);
    --fluid-spacing: clamp(1rem, 3vw, 2rem);
}

.heading {
    font-size: var(--fluid-font-size);
}

.section {
    padding: var(--fluid-spacing);
}
```

## **6. CSS Transitions and Animations**

### **Transitions:**

```css
/* Basic transition */
.button {
    background-color: blue;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: red;
}

/* Multiple properties */
.card {
    transform: scale(1);
    opacity: 1;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.card:hover {
    transform: scale(1.05);
    opacity: 0.9;
}

/* Transition with delay */
.modal {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
}

.modal.show {
    opacity: 1;
    transform: translateY(0);
}
```

### **Keyframes and Animations:**

```css
/* Basic keyframe animation */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.fade-in-element {
    animation: fadeIn 0.5s ease-in-out;
}

/* Complex keyframe animation */
@keyframes slideInFromLeft {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    60% {
        transform: translateX(10px);
        opacity: 0.8;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-in {
    animation: slideInFromLeft 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Multiple animations */
.bounce-and-rotate {
    animation:
        bounce 1s ease-in-out,
        rotate 2s linear infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
```

### **Advanced Animation Techniques:**

```css
/* Scroll-triggered animations */
.scroll-animation {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-animation.animate {
    opacity: 1;
    transform: translateY(0);
}

/* CSS-only loading spinner */
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Typing effect */
.typing {
    overflow: hidden;
    border-right: 2px solid;
    white-space: nowrap;
    animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
}

@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: currentColor; }
}
```

## **7. Modern CSS Features**

### **CSS Logical Properties:**

```css
/* Physical properties (old way) */
.element {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    margin-right: 20px;
    padding-top: 15px;
    padding-bottom: 15px;
    border-top: 1px solid #ccc;
}

/* Logical properties (new way) */
.element {
    margin-block: 10px; /* top and bottom */
    margin-inline: 20px; /* left and right */
    padding-block: 15px;
    border-block-start: 1px solid #ccc;
}

/* Works with different writing modes */
.writing-mode-vertical {
    writing-mode: vertical-rl;
    /* margin-inline now affects top/bottom instead of left/right */
}
```

### **CSS Aspect Ratio:**

```css
/* Maintain aspect ratio */
.video-container {
    aspect-ratio: 16 / 9;
}

.square {
    aspect-ratio: 1;
}

.card-image {
    aspect-ratio: 4 / 3;
    object-fit: cover;
}
```

### **CSS Subgrid:**

```css
/* Subgrid for nested grids */
.grid-container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 20px;
}

.nested-grid {
    display: grid;
    grid-template-columns: subgrid; /* Inherit parent grid */
    grid-column: 2; /* Span from column 2 to end */
}
```

### **CSS Scoping:**

```css
/* @scope for component scoping */
@scope (.component) {
    :scope { display: block; }
    .title { font-size: 1.5rem; }
    .content { line-height: 1.6; }
}

/* Style scoping with :scope */
.component:scope(.title) {
    color: blue;
}
```

## **8. Performance Optimization**

### **CSS Performance Best Practices:**

```css
/* Avoid expensive selectors */
.slow-selector * .deeply .nested .selector { } /* Bad */
.simple-class { } /* Good */

/* Use transform instead of changing layout properties */
.element {
    transform: translateX(100px); /* GPU accelerated */
    left: 100px; /* Causes layout recalculation */
}

/* Use will-change for animations */
.animated-element {
    will-change: transform;
}

/* Optimize font loading */
@font-face {
    font-family: 'Inter';
    src: url('inter.woff2') format('woff2');
    font-display: swap; /* Show fallback font while loading */
}

/* Use CSS containment */
.contained-element {
    contain: layout style paint; /* Isolate from document flow */
}
```

### **Critical CSS and Code Splitting:**

```html
<!-- Load critical CSS inline -->
<style>
    /* Critical CSS for above-the-fold content */
    .hero { background: #007bff; color: white; }
    .nav { position: fixed; top: 0; }
</style>

<!-- Load non-critical CSS asynchronously -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

## **9. CSS Architecture and Methodologies**

### **CSS-in-JS with Styled Components:**

```javascript
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

    @media (max-width: 768px) {
        padding: 8px 16px;
        font-size: 14px;
    }
`;

// Usage
<Button primary>Primary Button</Button>
<Button>Secondary Button</Button>
```

### **Utility-First CSS with Tailwind:**

```html
<!-- Traditional approach -->
<div class="card">
    <h2 class="card-title">Title</h2>
    <p class="card-description">Description</p>
</div>

<style>
    .card { padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .card-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; }
    .card-description { color: #666; line-height: 1.6; }
</style>

<!-- Utility-first approach -->
<div class="p-5 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-2">Title</h2>
    <p class="text-gray-600 leading-relaxed">Description</p>
</div>
```

### **CSS Modules:**

```css
/* styles.module.css */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.title {
    font-size: 2rem;
    color: var(--primary-color);
}

@media (max-width: 768px) {
    .title {
        font-size: 1.5rem;
    }
}
```

```javascript
import styles from './styles.module.css';

function Component() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Hello World</h1>
        </div>
    );
}
```

## **10. Code Examples**

### **Example 1: Modern Card Component with CSS Grid and Custom Properties**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern CSS Card Grid</title>
    <style>
        :root {
            --primary-color: #007bff;
            --secondary-color: #6c757d;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --warning-color: #ffc107;
            --info-color: #17a2b8;
            --light-color: #f8f9fa;
            --dark-color: #343a40;

            --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --border-radius: 8px;
            --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-family);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }

        .header h1 {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }

        .card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            overflow: hidden;
            transition: var(--transition);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .card-header {
            padding: 20px;
            background: linear-gradient(135deg, var(--primary-color), #0056b3);
            color: white;
        }

        .card-icon {
            font-size: 2rem;
            margin-bottom: 10px;
            display: block;
        }

        .card-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .card-subtitle {
            opacity: 0.9;
            font-size: 0.9rem;
        }

        .card-body {
            padding: 20px;
        }

        .card-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .card-features {
            list-style: none;
            margin-bottom: 20px;
        }

        .card-features li {
            padding: 5px 0;
            position: relative;
            padding-left: 20px;
        }

        .card-features li::before {
            content: '✓';
            color: var(--success-color);
            font-weight: bold;
            position: absolute;
            left: 0;
        }

        .card-footer {
            padding: 20px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
        }

        .card-button {
            display: inline-block;
            background: var(--primary-color);
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: var(--border-radius);
            font-weight: 500;
            transition: var(--transition);
            border: 2px solid var(--primary-color);
        }

        .card-button:hover {
            background: transparent;
            color: var(--primary-color);
            transform: translateY(-2px);
        }

        .stats-section {
            background: rgba(255, 255, 255, 0.95);
            border-radius: var(--border-radius);
            padding: 30px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 30px;
            text-align: center;
        }

        .stat-item {
            padding: 20px;
            border-radius: var(--border-radius);
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            display: block;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        @media (max-width: 768px) {
            .card-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }

            .header {
                margin-bottom: 30px;
            }

            .header h1 {
                font-size: 2rem;
            }
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --primary-color: #4dabf7;
                --light-color: #2d3748;
                --dark-color: #e2e8f0;
            }

            body {
                background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            }

            .card {
                background: rgba(45, 55, 72, 0.95);
                color: #e2e8f0;
            }

            .card-description {
                color: #a0aec0;
            }

            .stats-section {
                background: rgba(45, 55, 72, 0.95);
                color: #e2e8f0;
            }
        }

        /* Animation keyframes */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .card {
            animation: fadeInUp 0.6s ease-out;
        }

        .card:nth-child(1) { animation-delay: 0.1s; }
        .card:nth-child(2) { animation-delay: 0.2s; }
        .card:nth-child(3) { animation-delay: 0.3s; }
        .card:nth-child(4) { animation-delay: 0.4s; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Modern CSS Showcase</h1>
            <p>Exploring advanced CSS features and techniques</p>
        </header>

        <section class="card-grid">
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🚀</span>
                    <h3 class="card-title">CSS Grid</h3>
                    <p class="card-subtitle">Two-dimensional layout</p>
                </div>
                <div class="card-body">
                    <p class="card-description">
                        Create complex layouts with CSS Grid. Perfect for responsive designs and precise positioning.
                    </p>
                    <ul class="card-features">
                        <li>Two-dimensional layouts</li>
                        <li>Flexible grid tracks</li>
                        <li>Grid areas and templates</li>
                        <li>Auto-placement algorithm</li>
                    </ul>
                </div>
                <div class="card-footer">
                    <a href="#" class="card-button">Learn More</a>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🎨</span>
                    <h3 class="card-title">CSS Variables</h3>
                    <p class="card-subtitle">Dynamic styling</p>
                </div>
                <div class="card-body">
                    <p class="card-description">
                        Use CSS custom properties for maintainable and dynamic stylesheets.
                    </p>
                    <ul class="card-features">
                        <li>Reusable color schemes</li>
                        <li>Theme switching</li>
                        <li>Responsive values</li>
                        <li>JavaScript integration</li>
                    </ul>
                </div>
                <div class="card-footer">
                    <a href="#" class="card-button">Learn More</a>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-icon">📱</span>
                    <h3 class="card-title">Responsive Design</h3>
                    <p class="card-subtitle">Mobile-first approach</p>
                </div>
                <div class="card-body">
                    <p class="card-description">
                        Build websites that work perfectly on all devices and screen sizes.
                    </p>
                    <ul class="card-features">
                        <li>Fluid layouts</li>
                        <li>Flexible images</li>
                        <li>Media queries</li>
                        <li>Container queries</li>
                    </ul>
                </div>
                <div class="card-footer">
                    <a href="#" class="card-button">Learn More</a>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-icon">⚡</span>
                    <h3 class="card-title">Performance</h3>
                    <p class="card-subtitle">Optimized CSS</p>
                </div>
                <div class="card-body">
                    <p class="card-description">
                        Write efficient CSS that loads fast and performs well.
                    </p>
                    <ul class="card-features">
                        <li>GPU acceleration</li>
                        <li>Critical CSS</li>
                        <li>Code splitting</li>
                        <li>Font optimization</li>
                    </ul>
                </div>
                <div class="card-footer">
                    <a href="#" class="card-button">Learn More</a>
                </div>
            </div>
        </section>

        <section class="stats-section">
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number">500+</span>
                    <span class="stat-label">CSS Properties</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">Responsive</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">60fps</span>
                    <span class="stat-label">Smooth Animations</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">0</span>
                    <span class="stat-label">Layout Shifts</span>
                </div>
            </div>
        </section>
    </div>
</body>
</html>
```

### **Example 2: Advanced Flexbox Layout with Modern CSS**

```css
/* Modern Flexbox Layout System */
.flex-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    align-content: space-around;
    gap: 20px;
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.flex-item {
    flex: 1 1 300px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.flex-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.flex-item:hover::before {
    left: 100%;
}

.flex-item:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.flex-item:nth-child(1) { order: 1; }
.flex-item:nth-child(2) { order: 3; }
.flex-item:nth-child(3) { order: 2; }
.flex-item:nth-child(4) { order: 4; }

/* Responsive adjustments */
@media (max-width: 768px) {
    .flex-container {
        flex-direction: column;
        gap: 15px;
        padding: 15px;
    }

    .flex-item {
        flex: 1 1 100%;
        padding: 20px;
    }
}

/* Container queries for component-based design */
@container (min-width: 500px) {
    .flex-item {
        padding: 40px;
    }
}
```

### **Example 3: CSS Grid Magazine Layout**

```css
/* CSS Grid Magazine Layout */
.magazine-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    grid-template-rows: auto 1fr auto;
    gap: 30px;
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.magazine-header {
    grid-column: 1 / -1;
    grid-row: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
}

.magazine-main {
    grid-column: 1;
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.article-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.article-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.article-content {
    padding: 20px;
}

.article-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
}

.article-excerpt {
    color: #666;
    line-height: 1.6;
    margin-bottom: 15px;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: #888;
}

.magazine-sidebar {
    grid-column: 2;
    grid-row: 2;
}

.sidebar-widget {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.widget-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
}

.magazine-footer {
    grid-column: 1 / -1;
    grid-row: 3;
    text-align: center;
    padding: 20px;
    color: #666;
}

/* Responsive design */
@media (max-width: 768px) {
    .magazine-layout {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;
    }

    .magazine-header {
        grid-column: 1;
        grid-row: 1;
    }

    .magazine-main {
        grid-column: 1;
        grid-row: 2;
        grid-template-columns: 1fr;
    }

    .magazine-sidebar {
        grid-column: 1;
        grid-row: 3;
    }

    .magazine-footer {
        grid-column: 1;
        grid-row: 4;
    }
}

/* Print styles */
@media print {
    .magazine-layout {
        display: block;
    }

    .article-card {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ccc;
    }
}
```

## **11. Advanced CSS Features**

### **CSS Houdini - Next Generation CSS**

#### **CSS Properties and Values API**
```css
/* Register custom CSS properties */
CSS.registerProperty({
    name: '--my-color',
    syntax: '<color>',
    initialValue: 'black',
    inherits: true
});

CSS.registerProperty({
    name: '--my-length',
    syntax: '<length>',
    initialValue: '0px',
    inherits: false
});

/* Use custom properties */
.element {
    --my-color: red;
    --my-length: 20px;
    color: var(--my-color);
    margin: var(--my-length);
    transition: --my-color 0.3s ease;
}

.element:hover {
    --my-color: blue;
}
```

#### **CSS Painting API**
```javascript
// custom-painter.js
class MyPainter {
    static get inputProperties() {
        return ['--my-color', '--my-size'];
    }

    paint(ctx, geom, properties) {
        const color = properties.get('--my-color').toString();
        const size = parseInt(properties.get('--my-size').toString());

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, size, size);
    }
}

// Register the painter
registerPaint('myPainter', MyPainter);
```

```css
/* Use the custom painter */
.element {
    --my-color: red;
    --my-size: 100px;
    background-image: paint(myPainter);
}
```

### **CSS Containment**
```css
/* Layout containment - isolates element from document flow */
.contained-layout {
    contain: layout;
}

/* Style containment - isolates style calculations */
.contained-style {
    contain: style;
}

/* Paint containment - creates stacking context */
.contained-paint {
    contain: paint;
}

/* Size containment - prevents size changes from affecting ancestors */
.contained-size {
    contain: size;
}

/* Content containment - combines layout and style */
.contained-content {
    contain: content;
}

/* Strict containment - isolates completely */
.contained-strict {
    contain: strict;
}
```

### **CSS Scroll Snap**
```css
/* Scroll container */
.scroll-container {
    height: 100vh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
}

/* Snap points */
.scroll-section {
    height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
}

/* Horizontal scroll snap */
.horizontal-scroll {
    width: 100%;
    height: 300px;
    overflow-x: scroll;
    scroll-snap-type: x proximity;
    scroll-behavior: smooth;
}

.horizontal-item {
    width: 300px;
    height: 300px;
    flex-shrink: 0;
    scroll-snap-align: center;
}
```

### **CSS Writing Modes**
```css
/* Vertical writing */
.vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
}

/* Horizontal writing (default) */
.horizontal-text {
    writing-mode: horizontal-tb;
}

/* Vertical with upright text */
.vertical-upright {
    writing-mode: vertical-rl;
    text-orientation: upright;
}

/* Sideways text */
.sideways-text {
    writing-mode: horizontal-tb;
    text-orientation: sideways;
}
```

## **12. CSS Performance Optimization**

### **GPU Acceleration**
```css
/* Force GPU acceleration */
.accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}

/* Optimize animations */
.smooth-animation {
    will-change: transform;
    transform: translateZ(0);
}

/* Reset after animation */
.smooth-animation:not(:hover) {
    will-change: auto;
}
```

### **Font Loading Optimization**
```css
/* Font display strategies */
@font-face {
    font-family: 'Inter';
    src: url('inter.woff2') format('woff2');
    font-display: swap; /* Show fallback, swap when loaded */
}

@font-face {
    font-family: 'Inter';
    src: url('inter.woff2') format('woff2');
    font-display: optional; /* Use fallback if not loaded quickly */
}

@font-face {
    font-family: 'Inter';
    src: url('inter.woff2') format('woff2');
    font-display: fallback; /* Brief invisible period, then fallback */
}

/* Preload critical fonts */
<link rel="preload" href="inter.woff2" as="font" type="font/woff2" crossorigin>
```

### **CSS Code Splitting**
```html
<!-- Critical CSS inline -->
<style>
    /* Above-the-fold styles */
    .hero { background: #007bff; color: white; }
    .nav { position: fixed; top: 0; }
</style>

<!-- Non-critical CSS async -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

### **CSS Performance Best Practices**
```css
/* Avoid expensive selectors */
.slow-selector * .deeply .nested .selector { } /* Bad */
.simple-class { } /* Good */

/* Use transform instead of changing layout properties */
.element {
    transform: translateX(100px); /* GPU accelerated */
    left: 100px; /* Causes layout recalculation */
}

/* Minimize repaints and reflows */
.efficient-updates {
    transform: translateX(var(--position));
    opacity: var(--opacity);
}

/* Use CSS containment */
.isolated-component {
    contain: layout style paint;
}
```

## **13. Modern CSS Architecture**

### **CSS-in-JS with Emotion**
```javascript
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const Button = styled.button`
    background: ${props => props.primary ? '#007bff' : '#6c757d'};
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    animation: ${fadeIn} 0.5s ease-in;

    &:hover {
        background: ${props => props.primary ? '#0056b3' : '#545b62'};
    }

    ${props => props.size === 'large' && css`
        padding: 15px 30px;
        font-size: 1.2rem;
    `}
`;

const dynamicStyles = css`
    color: ${props => props.color};
    font-size: ${props => props.size}px;
`;
```

### **CSS Modules with React**
```css
/* Button.module.css */
.button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.button:hover {
    background: var(--primary-hover);
}

.primary {
    composes: button;
    background: #007bff;
}

.secondary {
    composes: button;
    background: #6c757d;
}

.large {
    padding: 15px 30px;
    font-size: 1.2rem;
}
```

```javascript
import styles from './Button.module.css';

function Button({ variant, size, children }) {
    const className = [
        styles.button,
        styles[variant],
        size && styles[size]
    ].filter(Boolean).join(' ');

    return (
        <button className={className}>
            {children}
        </button>
    );
}
```

### **PostCSS and Autoprefixing**
```javascript
// postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')({
            grid: true, // Enable grid autoprefixing
            flexbox: 'no-2009' // Avoid old flexbox syntax
        }),
        require('postcss-preset-env')({
            stage: 1, // Enable modern CSS features
            autoprefixer: { grid: true },
            features: {
                'custom-properties': true,
                'nesting-rules': true
            }
        }),
        require('cssnano')({
            preset: 'default'
        })
    ]
};
```

### **CSS Architecture Patterns**

#### **ITCSS (Inverted Triangle CSS)**
```css
/* Settings - Global configuration */
:root {
    --color-primary: #007bff;
    --font-size-base: 16px;
}

/* Tools - Mixins and functions */
@import 'tools/mixins.css';
@import 'tools/functions.css';

/* Generic - Reset and normalize */
@import 'generic/reset.css';
@import 'generic/normalize.css';

/* Elements - Base HTML elements */
@import 'elements/headings.css';
@import 'elements/links.css';

/* Objects - Design patterns */
@import 'objects/grid.css';
@import 'objects/container.css';

/* Components - UI components */
@import 'components/button.css';
@import 'components/card.css';

/* Utilities - Helper classes */
@import 'utilities/spacing.css';
@import 'utilities/text.css';
```

#### **CUBE CSS**
```css
/* Composition - Layout and structure */
.layout-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Utilities - Single-purpose classes */
.text-center { text-align: center; }
.bg-primary { background: var(--color-primary); }
.p-4 { padding: 1rem; }

/* Exceptions - Component-specific overrides */
.card--featured {
    border: 2px solid var(--color-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

## **14. CSS Debugging and Development Tools**

### **CSS Debugging Techniques**
```css
/* Highlight all elements */
* {
    outline: 1px solid red;
}

/* Debug flexbox */
.debug-flex {
    * {
        outline: 1px solid blue;
    }

    &::before {
        content: 'Flex container';
        background: yellow;
        padding: 2px 4px;
        font-size: 12px;
    }
}

/* Debug grid */
.debug-grid {
    background: repeating-linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.1) 0px,
        rgba(0, 0, 0, 0.1) 1px,
        transparent 1px,
        transparent 20px
    );
}

/* Show box model */
.debug-box {
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid red;
    padding: 2px;
}

/* Debug typography */
.debug-text::after {
    content: ' ' attr(style);
    background: yellow;
    font-size: 10px;
    padding: 1px 3px;
}
```

### **CSS Custom DevTools**
```javascript
// Add CSS debugging utilities to window
window.CSSDebug = {
    // Highlight all elements
    highlightAll() {
        const style = document.createElement('style');
        style.textContent = '* { outline: 1px solid red !important; }';
        document.head.appendChild(style);
        this._highlightStyle = style;
    },

    // Remove highlights
    removeHighlights() {
        if (this._highlightStyle) {
            document.head.removeChild(this._highlightStyle);
            this._highlightStyle = null;
        }
    },

    // Show computed styles
    showComputedStyles(element) {
        const styles = window.getComputedStyle(element);
        console.table({
            display: styles.display,
            position: styles.position,
            width: styles.width,
            height: styles.height,
            margin: styles.margin,
            padding: styles.padding,
            background: styles.background,
            color: styles.color,
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily
        });
    },

    // Toggle CSS class
    toggleClass(element, className) {
        element.classList.toggle(className);
    }
};
```

### **CSS Performance Monitoring**
```javascript
// Monitor CSS performance
class CSSPerformanceMonitor {
    constructor() {
        this.observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('.css')) {
                    console.log('CSS loaded:', entry.name, entry.duration + 'ms');
                }
            }
        });

        this.observer.observe({ entryTypes: ['resource'] });
    }

    // Monitor layout shifts
    monitorLayoutShifts() {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('Cumulative Layout Shift:', clsValue);
        });

        observer.observe({ entryTypes: ['layout-shift'] });
        return observer;
    }

    // Monitor paint timing
    monitorPaintTiming() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('Paint timing:', entry.name, entry.startTime + 'ms');
            }
        });

        observer.observe({ entryTypes: ['paint'] });
        return observer;
    }
}

// Usage
const monitor = new CSSPerformanceMonitor();
monitor.monitorLayoutShifts();
monitor.monitorPaintTiming();
```

## **15. Future of CSS**

### **CSS Level 5 and Beyond**
```css
/* CSS Nesting (coming soon) */
.card {
    background: white;

    .title {
        font-size: 1.5rem;
    }

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
}

/* CSS @when/@else (coming soon) */
@when media(width >= 768px) and supports(display: grid) {
    .container {
        display: grid;
    }
} @else {
    .container {
        display: flex;
    }
}

/* CSS Trigonometric functions */
.element {
    width: calc(100px * sin(45deg));
    height: calc(100px * cos(45deg));
}

/* CSS Anchor Positioning */
.anchor-element {
    position: absolute;
    position-anchor: --my-anchor;
    top: anchor(bottom);
    left: anchor(center);
}

/* CSS Masonry Layout */
.masonry {
    display: grid;
    grid-template-rows: masonry;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

### **Modern CSS Ecosystem**
```javascript
// CSS with JavaScript frameworks
import styles from './Component.module.css';

// CSS-in-JS with theme support
const theme = {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745'
    },
    spacing: {
        small: '8px',
        medium: '16px',
        large: '24px'
    }
};

const styledComponent = styled.div`
    background: ${props => props.theme.colors.primary};
    padding: ${props => props.theme.spacing.medium};
    border-radius: 4px;
`;

// CSS with build tools
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer'),
                                    require('cssnano')
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
};
```

This comprehensive CSS documentation covers everything from basic styling to advanced modern techniques, performance optimization, architecture patterns, and future CSS features. The examples are production-ready and follow current best practices for professional web development.

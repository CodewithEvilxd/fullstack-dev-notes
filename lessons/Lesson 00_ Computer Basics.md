### **Lesson 0: Computer Basics - Foundation for Programming**

## **1. What is a Computer?**

A computer is an electronic device that can receive, process, store, and output data. It performs calculations and logical operations at high speeds. Modern computers follow the von Neumann architecture, which consists of:

- **Input Unit:** Receives data from external devices
- **Output Unit:** Sends processed data to external devices
- **Memory Unit:** Stores data and instructions temporarily (RAM) and permanently (storage)
- **Control Unit:** Directs the flow of data and instructions
- **Arithmetic Logic Unit (ALU):** Performs mathematical and logical operations

### **Computer Generations and Evolution**

#### **First Generation (1940s-1950s):**
- **Technology:** Vacuum tubes
- **Programming:** Machine language
- **Memory:** Magnetic drums
- **Size:** Room-sized
- **Examples:** ENIAC, UNIVAC

#### **Second Generation (1950s-1960s):**
- **Technology:** Transistors
- **Programming:** Assembly language
- **Memory:** Magnetic core memory
- **Size:** Smaller, refrigerator-sized
- **Examples:** IBM 1401, PDP-1

#### **Third Generation (1960s-1970s):**
- **Technology:** Integrated circuits
- **Programming:** High-level languages (COBOL, FORTRAN)
- **Memory:** Semiconductor memory
- **Size:** Minicomputer-sized
- **Examples:** IBM System/360, PDP-11

#### **Fourth Generation (1970s-Present):**
- **Technology:** Microprocessors
- **Programming:** GUI-based systems
- **Memory:** Large-scale integration
- **Size:** Personal computers
- **Examples:** IBM PC, Apple Macintosh, modern smartphones

#### **Fifth Generation (Present-Future):**
- **Technology:** Artificial intelligence, quantum computing
- **Programming:** Natural language processing
- **Memory:** Massive parallel processing
- **Size:** Ubiquitous computing
- **Examples:** AI assistants, quantum computers

### **Basic Components of a Computer:**

#### **Hardware Components:**

##### **Central Processing Unit (CPU):**
- **Core Components:**
  - Control Unit (CU): Manages instruction execution
  - Arithmetic Logic Unit (ALU): Performs calculations
  - Registers: High-speed temporary storage
- **Key Metrics:**
  - Clock Speed (GHz): Instructions per second
  - Cores: Number of processing units
  - Cache: Fast memory for frequently used data
  - Threads: Simultaneous execution paths
- **Popular CPUs:** Intel Core i7/9/11/13, AMD Ryzen 5/7/9, Apple M1/M2/M3

##### **Memory Hierarchy:**
- **L1 Cache:** Smallest, fastest (typically 64KB-256KB per core)
- **L2 Cache:** Medium speed, larger (256KB-1MB per core)
- **L3 Cache:** Shared among cores (2MB-32MB)
- **RAM:** Main memory (8GB-128GB typical)
- **Virtual Memory:** Disk space used as extended RAM
- **Storage:** SSD/HDD for permanent storage

##### **Storage Devices:**

###### **Hard Disk Drives (HDD):**
- **Mechanical platters** with magnetic coating
- **5400/7200 RPM** speeds
- **Cheaper per GB**, slower access times
- **Higher capacity** (up to 20TB)
- **Moving parts** make them susceptible to shock

###### **Solid State Drives (SSD):**
- **Flash memory chips** (NAND)
- **No moving parts**, much faster
- **NVMe protocol** for PCIe connection
- **SATA** for older systems
- **Lower latency** (microseconds vs milliseconds)

###### **Advanced Storage Technologies:**
- **NVMe SSDs:** PCIe 4.0/5.0 for maximum speed
- **Optane Memory:** Intel's 3D XPoint technology
- **RAID Arrays:** Redundant storage configurations
- **Network Attached Storage (NAS):** Shared storage over network
- **Storage Area Network (SAN):** High-performance block storage

##### **Motherboard:**
- **Chipset:** Manages communication between CPU, RAM, and peripherals
- **Expansion Slots:** PCIe for graphics cards, network cards, SSDs
- **Power Connectors:** 24-pin ATX, 8-pin CPU power, 6-pin PCIe power
- **Form Factors:** ATX, Micro-ATX, Mini-ITX, E-ATX
- **Integrated Components:** Network, audio, USB controllers

##### **Power Supply Unit (PSU):**
- **Wattage:** 450W, 650W, 850W, 1000W+ common sizes
- **Efficiency Ratings:** 80+ Bronze/Silver/Gold/Platinum/Titanium
- **Modular vs Non-Modular:** Cable management options
- **Power Factor Correction (PFC):** Active vs passive
- **Protection Features:** Over-voltage, over-current, short-circuit protection

##### **Input/Output Devices:**
- **Input:** Keyboard, mouse, touchscreen, microphone, webcam, scanner, game controllers
- **Output:** Monitor (LED/LCD/OLED/QLED), speakers, printer, projector
- **Hybrid:** Touchscreen displays, gaming controllers with haptic feedback
- **Advanced:** VR headsets, motion controllers, biometric scanners

#### **Software Components:**

##### **Operating System (OS):**
- **Kernel:** Core of OS managing hardware resources
- **Shell:** Command-line interface
- **GUI:** Graphical user interface
- **Device Drivers:** Software for hardware communication
- **System Libraries:** Shared code for applications

##### **Application Software:**
- **Productivity:** Microsoft Office, Google Workspace, LibreOffice
- **Creative:** Adobe Creative Suite, Blender, GIMP, Inkscape
- **Development:** Visual Studio Code, IntelliJ IDEA, Eclipse, Xcode
- **Entertainment:** Games, media players, streaming services
- **Communication:** Email clients, video conferencing, messaging apps

##### **System Software:**
- **Firmware:** Low-level software in hardware devices
- **BIOS/UEFI:** Basic input/output system for boot process
- **Utilities:** Disk cleanup, system monitoring, backup tools
- **Antivirus:** Malware protection and system security
- **Virtualization:** VMware, VirtualBox, Hyper-V

## **2. Understanding Operating Systems**

### **Popular Operating Systems:**

#### **Windows:**
- **Architecture:** NT kernel-based operating system
- **User Interface:** Graphical user interface with Start menu, taskbar, desktop
- **File System:** NTFS (New Technology File System)
- **Package Management:** Windows Installer (.msi), Microsoft Store, Chocolatey
- **Key Features:**
  - Extensive hardware compatibility
  - Large ecosystem of software
  - Gaming optimization (DirectX, Game Mode)
  - Built-in security features (Windows Defender, BitLocker)
  - Regular updates through Windows Update
  - Windows Subsystem for Linux (WSL)
  - Microsoft Store and UWP applications

#### **macOS:**
- **Architecture:** Darwin (BSD Unix-based) with XNU kernel
- **User Interface:** Aqua interface with Dock, Finder, Spotlight, Mission Control
- **File System:** APFS (Apple File System) on newer versions
- **Package Management:** App Store, Homebrew for command-line packages, MacPorts
- **Key Features:**
  - Seamless integration with Apple ecosystem
  - Built-in development tools (Xcode, Instruments)
  - Excellent multimedia support (Final Cut Pro, Logic Pro)
  - Strong focus on user experience and design
  - Time Machine for backups
  - iCloud integration
  - Gatekeeper security system

#### **Linux:**
- **Architecture:** Monolithic kernel (Linux kernel) with GNU tools
- **Distributions:** Ubuntu, Fedora, CentOS, Arch Linux, Debian, SUSE, Red Hat
- **Package Managers:** apt (Debian/Ubuntu), yum/dnf (Red Hat), pacman (Arch), zypper (SUSE)
- **Key Features:**
  - Open-source and free
  - Highly customizable and configurable
  - Strong command-line interface
  - Excellent for development and server environments
  - Multiple desktop environments (GNOME, KDE, XFCE, LXDE, Cinnamon)
  - Package management systems
  - Kernel customization capabilities

#### **Mobile Operating Systems:**
- **Android:** Linux-based, open-source, Google Play Store
- **iOS:** Darwin-based, closed-source, App Store
- **HarmonyOS:** Huawei's distributed OS
- **KaiOS:** Feature phones with app support

### **File System Basics:**

#### **Windows File System Structure:**
```
C:/
├── Windows/           # OS files
│   ├── System32/     # System binaries
│   ├── SysWOW64/     # 32-bit system files
│   ├── WinSxS/       # Side-by-side assemblies
│   └── SystemApps/   # Built-in system apps
├── Program Files/     # 64-bit applications
├── Program Files (x86)/ # 32-bit applications
├── Users/            # User directories
│   └── [username]/
│       ├── Desktop/
│       ├── Documents/
│       ├── Downloads/
│       ├── Pictures/
│       ├── Videos/
│       ├── Music/
│       ├── AppData/  # Application data
│       │   ├── Local/
│       │   ├── Roaming/
│       │   └── LocalLow/
│       └── OneDrive/ # Cloud storage
├── System Volume Information/ # System restore points
└── ProgramData/      # Application data (all users)
```

#### **Linux/macOS File System Structure:**
```
/ (root)
├── bin/              # Essential user binaries
├── sbin/             # System administration binaries
├── etc/              # Configuration files
│   ├── passwd       # User accounts
│   ├── shadow       # Password hashes
│   ├── fstab        # File system table
│   └── hosts        # Hostname resolution
├── home/             # User home directories
│   └── [username]/
│       ├── Desktop/
│       ├── Documents/
│       ├── Downloads/
│       ├── Pictures/
│       ├── Videos/
│       ├── Music/
│       └── .config/ # Configuration files
├── usr/              # User programs and data
│   ├── bin/         # User binaries
│   ├── lib/         # Libraries
│   ├── share/       # Shared data
│   ├── local/       # Locally installed software
│   └── src/         # Source code
├── var/              # Variable data (logs, databases)
│   ├── log/         # System logs
│   ├── lib/         # Variable state information
│   ├── cache/       # Application cache
│   └── spool/       # Spool directories
├── tmp/              # Temporary files
├── opt/              # Optional software packages
├── boot/             # Boot loader files
├── dev/              # Device files
├── proc/             # Process information
├── sys/              # System information
└── mnt/              # Mount points
```

### **File Extensions and MIME Types:**

#### **Documents:**
- **Office Documents:** `.docx`, `.xlsx`, `.pptx`, `.odt`, `.ods`, `.odp`
- **Text Files:** `.txt`, `.rtf`, `.md`, `.tex`
- **PDF:** `.pdf`, `.xps`
- **E-books:** `.epub`, `.mobi`, `.azw`

#### **Images:**
- **Raster:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.webp`
- **Vector:** `.svg`, `.ai`, `.eps`, `.cdr`
- **Raw:** `.cr2`, `.nef`, `.arw`, `.dng`

#### **Audio:**
- **Lossy:** `.mp3`, `.aac`, `.ogg`, `.wma`
- **Lossless:** `.flac`, `.alac`, `.wav`, `.aiff`
- **Streaming:** `.m4a`, `.opus`

#### **Video:**
- **Container Formats:** `.mp4`, `.avi`, `.mkv`, `.mov`, `.wmv`, `.flv`
- **Codecs:** H.264, H.265, VP9, AV1
- **Streaming:** `.m3u8`, `.mpd`

#### **Archives:**
- **Common:** `.zip`, `.rar`, `.7z`, `.tar`, `.gz`, `.bz2`
- **Self-extracting:** `.exe`, `.dmg`, `.deb`, `.rpm`

#### **Code Files:**
- **Web:** `.html`, `.css`, `.js`, `.ts`, `.jsx`, `.tsx`
- **Backend:** `.py`, `.java`, `.cpp`, `.c`, `.php`, `.rb`, `.go`
- **Databases:** `.sql`, `.json`, `.xml`, `.yaml`
- **Config:** `.json`, `.xml`, `.yaml`, `.toml`, `.ini`

#### **System Files:**
- **Executables:** `.exe`, `.msi`, `.dmg`, `.deb`, `.rpm`, `.app`
- **Libraries:** `.dll`, `.so`, `.dylib`, `.lib`
- **System:** `.sys`, `.drv`, `.vxd`

### **File Permissions (Linux/macOS):**
```bash
# Permission structure: rwxrwxrwx
# Owner | Group | Others
# r = read (4), w = write (2), x = execute (1)

# View permissions
ls -l file.txt
# -rw-r--r-- 1 user group 1024 Jan 1 12:00 file.txt

# Change permissions
chmod 755 script.sh    # rwxr-xr-x
chmod u+x script.sh    # Add execute for owner
chmod g-w file.txt     # Remove write for group
chmod o+r file.txt     # Add read for others
chmod a=rwx file.txt   # Give all permissions to all

# Advanced permissions
chmod +t directory     # Sticky bit
chmod +s script.sh     # Setuid/setgid
chmod u=rw,g=r,o= file.txt  # Symbolic notation

# Default permissions
umask 022              # Default: 755 for directories, 644 for files
```

## **3. Computer Networks and Internet**

### **Network Basics:**
- **LAN (Local Area Network):** Computers connected in a small area (home, office)
- **WAN (Wide Area Network):** Large networks spanning cities or countries
- **Internet:** Global network of networks
- **MAN (Metropolitan Area Network):** City-wide networks
- **PAN (Personal Area Network):** Personal devices (Bluetooth, NFC)

### **Network Devices:**
- **Router:** Directs network traffic between devices and networks
- **Switch:** Connects multiple devices within a network (Layer 2)
- **Hub:** Basic device for connecting multiple devices (deprecated)
- **Modem:** Converts digital signals to analog for internet transmission
- **Access Point:** Wireless network access point
- **Firewall:** Network security device
- **Load Balancer:** Distributes network traffic
- **Network Interface Card (NIC):** Hardware for network connectivity

### **Network Topologies:**
- **Bus Topology:** All devices on single cable
- **Star Topology:** All devices connected to central hub
- **Ring Topology:** Devices in circular connection
- **Mesh Topology:** Every device connected to every other device
- **Tree Topology:** Hierarchical structure
- **Hybrid Topology:** Combination of different topologies

### **IP Addresses:**
- **IPv4:** 192.168.1.1 (four numbers separated by dots, 0-255 each)
- **IPv6:** 2001:0db8:85a3:0000:0000:8a2e:0370:7334 (128-bit addressing)
- **Private IP Ranges:**
  - 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)
  - 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
  - 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)
- **Public IP:** Globally routable addresses
- **NAT (Network Address Translation):** Maps private to public IPs

### **DNS (Domain Name System):**
- **Translates domain names** (google.com) to IP addresses (172.217.14.206)
- **Hierarchical structure:** Root → TLD → Domain → Subdomain
- **Record Types:**
  - A: IPv4 address
  - AAAA: IPv6 address
  - CNAME: Canonical name (alias)
  - MX: Mail exchange
  - TXT: Text records
  - SRV: Service records
- **DNS Resolution Process:**
  1. Check local cache
  2. Query local DNS server
  3. Query root DNS servers
  4. Query TLD DNS servers
  5. Query authoritative DNS servers

### **Network Protocols:**
- **TCP (Transmission Control Protocol):** Reliable, connection-oriented
- **UDP (User Datagram Protocol):** Fast, connectionless
- **HTTP/HTTPS:** Web communication
- **FTP:** File transfer
- **SMTP:** Email sending
- **POP3/IMAP:** Email receiving
- **SSH:** Secure shell access
- **Telnet:** Remote terminal access (insecure)

## **4. Introduction to Programming**

### **What is Programming?**
Programming is writing instructions for computers to follow. These instructions are written in programming languages that translate human-readable code into machine-executable instructions.

### **Programming Paradigms:**

#### **Imperative Programming:**
- **Step-by-step instructions** (C, Java, Python)
- **Focus on how** to solve problems
- **State changes** through assignments
- **Control structures:** loops, conditionals

#### **Object-Oriented Programming (OOP):**
- **Code organized around objects** (Java, C++, Python)
- **Classes and objects** as building blocks
- **Encapsulation, inheritance, polymorphism**
- **Real-world modeling**

#### **Functional Programming:**
- **Functions as first-class citizens** (JavaScript, Haskell, Lisp)
- **Immutability and pure functions**
- **Higher-order functions**
- **Declarative style**

#### **Procedural Programming:**
- **Procedures/functions as building blocks** (C, Pascal)
- **Top-down design**
- **Modular programming**

#### **Declarative Programming:**
- **Describe what you want, not how** (SQL, HTML, CSS)
- **Domain-specific languages**
- **Configuration over code**

#### **Event-Driven Programming:**
- **Respond to events** (JavaScript, GUI applications)
- **Asynchronous programming**
- **Callback functions**

#### **Aspect-Oriented Programming (AOP):**
- **Cross-cutting concerns** (logging, security)
- **Separation of concerns**
- **Modularization of aspects**

### **Programming Languages Categories:**

#### **High-Level Languages:**
- **Interpreted:** Python, Ruby, JavaScript, PHP, Perl
- **Compiled:** Java, C#, Go, Rust, Swift, Kotlin
- **Hybrid:** C++ (compiled), C# (.NET compilation)
- **Just-In-Time (JIT):** Java (JVM), C# (.NET), JavaScript (V8)

#### **Low-Level Languages:**
- **Assembly Language:** Human-readable machine code
- **Machine Code:** Binary instructions (0s and 1s)
- **Direct hardware control**

#### **Specialized Languages:**
- **Scripting:** Bash, PowerShell, Lua, Tcl
- **Markup:** HTML, XML, Markdown, LaTeX
- **Query:** SQL, GraphQL, Cypher, SPARQL
- **Domain-Specific:** R (statistics), MATLAB (mathematical), Verilog (hardware)

#### **Emerging Languages:**
- **Rust:** Memory safety without garbage collection
- **Go:** Concurrency and simplicity
- **Kotlin:** Modern JVM language
- **TypeScript:** JavaScript with types
- **Dart:** For Flutter mobile development

### **Compilation vs Interpretation:**

#### **Compiled Languages:**
```c
// Source code (high-level)
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}

// Compilation process:
// 1. Preprocessing (#include expansion)
// 2. Compilation (source to assembly)
// 3. Assembly (assembly to object code)
// 4. Linking (object code to executable)
// 5. Optimization

// Result: Executable binary file
```

#### **Interpreted Languages:**
```python
# Source code executed line by line
print("Hello, World!")

# Interpretation process:
# 1. Read source code
# 2. Parse into AST (Abstract Syntax Tree)
# 3. Execute immediately
# 4. No intermediate binary file
```

#### **Just-In-Time (JIT) Compilation:**
- **JavaScript (V8 Engine):** Compiles hot code paths to machine code
- **Java (JVM):** Bytecode compiled to machine code at runtime
- **.NET (CLR):** IL code compiled to machine code at runtime
- **Advantages:** Combines speed of compiled with flexibility of interpreted

### **Basic Programming Concepts:**

#### **Variables and Data Types:**
```javascript
// Primitive data types
let age = 25;              // Number (integer/floating point)
let name = "John";         // String
let isStudent = true;      // Boolean
let score = null;          // Null (intentional absence)
let grade;                 // Undefined (uninitialized)

// Complex data types
let person = {             // Object
    name: "John",
    age: 25,
    hobbies: ["reading", "coding"],
    address: {
        street: "123 Main St",
        city: "Anytown"
    }
};

let numbers = [1, 2, 3, 4, 5]; // Array
let uniqueIds = new Set([1, 2, 3]); // Set
let userMap = new Map(); // Map
```

#### **Control Structures:**
```javascript
// Conditional statements
if (age >= 18) {
    console.log("Adult");
} else if (age >= 13) {
    console.log("Teenager");
} else {
    console.log("Child");
}

// Ternary operator
let status = age >= 18 ? "Adult" : "Minor";

// Switch statement
switch (dayOfWeek) {
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    default:
        console.log("Other day");
}

// Loops
for (let i = 0; i < 5; i++) {
    console.log(i);
}

while (condition) {
    // Code to execute
}

do {
    // Code to execute at least once
} while (condition);

// For-of loop (iterables)
for (let item of array) {
    console.log(item);
}

// For-in loop (object properties)
for (let key in object) {
    console.log(key, object[key]);
}
```

#### **Functions:**
```javascript
// Function declaration
function add(a, b) {
    return a + b;
}

// Function expression
const multiply = function(a, b) {
    return a * b;
};

// Arrow function (ES6+)
const divide = (a, b) => a / b;
const greet = name => `Hello, ${name}!`;

// Higher-order function
function calculator(operation, a, b) {
    return operation(a, b);
}

const result = calculator(add, 5, 3); // 8

// Function with default parameters
function createUser(name, age = 18, role = "user") {
    return { name, age, role };
}

// Rest parameters
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// Callback functions
function fetchData(callback) {
    setTimeout(() => {
        callback("Data received");
    }, 1000);
}

fetchData(result => console.log(result));
```

#### **Error Handling:**
```javascript
// Try-catch blocks
try {
    // Code that might throw an error
    let result = riskyOperation();
    console.log("Success:", result);
} catch (error) {
    // Handle the error
    console.error("Error occurred:", error.message);
} finally {
    // Always execute (cleanup)
    console.log("Cleanup completed");
}

// Throwing custom errors
function validateAge(age) {
    if (age < 0) {
        throw new Error("Age cannot be negative");
    }
    if (age > 150) {
        throw new RangeError("Age seems unrealistic");
    }
    return true;
}

// Error types
// - Error: Generic error
// - TypeError: Wrong type
// - ReferenceError: Undefined variable
// - RangeError: Out of range
// - SyntaxError: Invalid syntax
// - EvalError: eval() error
```

## **5. Development Environment Setup**

### **Text Editors vs IDEs:**

#### **Modern Text Editors:**
- **Visual Studio Code (VS Code):**
  - Built on Electron framework
  - Extensive extension marketplace (40,000+ extensions)
  - Integrated terminal and debugging
  - Git integration and version control
  - IntelliSense for multiple languages
  - Remote development capabilities (SSH, WSL, Containers)
  - Live Share for collaborative coding
  - Settings synchronization across devices

- **Sublime Text:**
  - Extremely fast and lightweight
  - Multiple cursor editing
  - Command palette for quick actions
  - Package control system
  - Distraction-free mode
  - Vintage mode (Vim emulation)

- **Atom (Legacy):**
  - GitHub's former editor
  - Highly customizable
  - Built-in package manager
  - Teletype for collaborative coding
  - Git integration

- **Notepad++ (Windows):**
  - Lightweight and fast
  - Syntax highlighting for 80+ languages
  - Macro recording and playback
  - Plugin system
  - Regular expression search/replace

- **Vim/Neovim:**
  - Modal editing
  - Extremely efficient for power users
  - Plugin ecosystem (vim-plug, packer)
  - Works in terminal
  - Steep learning curve but very powerful

#### **Integrated Development Environments (IDEs):**
- **Visual Studio:** Microsoft's flagship IDE
  - Excellent for .NET development
  - Advanced debugging capabilities
  - Integrated testing tools
  - Azure integration
  - IntelliCode AI assistance

- **IntelliJ IDEA:**
  - Intelligent code completion
  - Advanced refactoring tools
  - Built-in version control
  - Database tools integration
  - Multiple language support
  - Plugin ecosystem

- **Eclipse:**
  - Extensible plugin architecture
  - Strong Java support
  - Enterprise development tools
  - Customizable workspace
  - Large community

- **Xcode (macOS):**
  - Apple's development environment
  - iOS/macOS app development
  - Interface Builder for UI design
  - Simulator for testing
  - App Store integration
  - Swift and Objective-C support

- **Android Studio:**
  - Official Android development IDE
  - Gradle build system
  - Android emulator
  - Firebase integration
  - Layout editor

### **Installing and Configuring VS Code:**

#### **Installation Steps:**
1. Download from [code.visualstudio.com](https://code.visualstudio.com/)
2. Run installer with administrator privileges
3. Choose installation location and options
4. Select additional tasks (Add to PATH, etc.)
5. Launch VS Code

#### **Essential Extensions:**
```json
// Recommended extensions for full-stack development
{
    "recommendations": [
        // Core Development
        "ms-vscode.vscode-typescript-next",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "ms-vscode.vscode-json",
        "ritwickdey.liveserver",
        "formulahendry.auto-rename-tag",
        "christian-kohler.path-intellisense",
        "ms-vscode.vscode-css-peek",
        "ecmel.vscode-html-css",
        "ms-vscode.vscode-html-format",

        // React Development
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-css-intellisense",
        "usernamehw.errorlens",
        "ms-vscode.vscode-js-profile-flame",

        // Backend Development
        "ms-python.python",
        "ms-vscode.vscode-node-debug",
        "ms-vscode.vscode-node-debug2",
        "humao.rest-client",

        // Database
        "ms-mssql.mssql",
        "mongodb.mongodb-vscode",

        // Version Control
        "ms-vscode.vscode-git-graph",
        "ms-vscode.vscode-gitlens",
        "gruntfuggly.todo-tree",

        // DevOps & Deployment
        "ms-vscode.vscode-docker",
        "ms-vscode.vscode-remote-ssh",
        "ms-vscode.vscode-remote-containers",

        // Productivity
        "ms-vscode.vscode-icons",
        "shardulm94.trailing-spaces",
        "streetsidesoftware.code-spell-checker",
        "ms-vscode.vscode-word-wrap",
        "ms-vscode.vscode-settings-cycler"
    ]
}
```

#### **VS Code Settings Configuration:**
```json
// settings.json
{
    // Editor
    "editor.fontSize": 14,
    "editor.fontFamily": "JetBrains Mono, Fira Code, Consolas, monospace",
    "editor.fontLigatures": true,
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
        "source.organizeImports": true
    },
    "editor.minimap.enabled": true,
    "editor.wordWrap": "on",
    "editor.bracketPairColorization.enabled": true,
    "editor.guides.bracketPairs": true,

    // Files
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,
    "files.exclude": {
        "**/node_modules": true,
        "**/.git": true,
        "**/.DS_Store": true
    },

    // Terminal
    "terminal.integrated.shell.windows": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    "terminal.integrated.shell.osx": "/bin/zsh",
    "terminal.integrated.shell.linux": "/bin/bash",

    // Git
    "git.enableSmartCommit": true,
    "git.confirmSync": false,
    "git.autofetch": true,

    // Extensions
    "emmet.includeLanguages": {
        "javascript": "javascriptreact",
        "typescript": "typescriptreact"
    },
    "emmet.triggerExpansionOnTab": true,

    // Theme
    "workbench.iconTheme": "material-icon-theme",
    "workbench.colorTheme": "One Dark Pro",

    // Language Specific
    "javascript.preferences.quoteStyle": "single",
    "typescript.preferences.quoteStyle": "single",
    "prettier.singleQuote": true,
    "prettier.trailingComma": "es5",

    // Remote Development
    "remote.SSH.configFile": "~/.ssh/config",
    "remote.SSH.showLoginTerminal": true
}
```

### **Command Line Interface (CLI):**

#### **Windows:**
- **Command Prompt (cmd.exe):** Legacy command line
- **PowerShell:** Modern shell with scripting capabilities
- **Windows Terminal:** Modern terminal with tabs and customization
- **WSL (Windows Subsystem for Linux):** Run Linux distributions on Windows

#### **macOS:**
- **Terminal (bash/zsh):** Built-in command line
- **iTerm2:** Enhanced terminal for macOS
- **Hyper:** Modern terminal built with web technologies

#### **Linux:**
- **GNOME Terminal/Konsole:** Desktop terminals
- **Alacritty:** GPU-accelerated terminal
- **Terminator:** Multi-pane terminal

### **Advanced Command Line Commands:**

#### **File and Directory Operations:**
```bash
# Advanced navigation
pwd              # Print working directory
ls -la           # List all files with details
cd ~/Documents   # Go to Documents folder
cd -             # Go to previous directory
pushd /path      # Push directory to stack
popd             # Pop directory from stack

# File operations
touch file.txt   # Create empty file
mkdir -p folder/subfolder # Create nested directories
cp -r source dest # Copy recursively
mv oldname newname # Rename/move file
rm -rf folder    # Remove directory recursively
find . -name "*.js" # Find JavaScript files
locate filename  # Find files by name (requires updatedb)

# File viewing and editing
cat file.txt     # Display entire file
less file.txt    # View file with navigation
head -20 file.txt # First 20 lines
tail -20 file.txt # Last 20 lines
tail -f logfile.log # Follow file changes
grep -r "pattern" . # Recursive search
sed 's/old/new/g' file.txt # Find and replace
```

#### **System Information and Monitoring:**
```bash
# System information
uname -a         # System details
whoami           # Current user
id               # User ID and groups
df -h            # Disk usage
du -sh *         # Directory sizes
free -h          # Memory usage
lscpu            # CPU information
lspci            # PCI devices
lsusb            # USB devices

# Process management
ps aux           # All processes
top              # Process monitor
htop             # Enhanced process monitor
pgrep processname # Find process by name
pkill processname # Kill process by name
nice -n 10 command # Run with priority
nohup command &  # Run in background

# Network commands
ifconfig         # Network interfaces
ip addr          # IP addresses
ping host        # Test connectivity
curl url         # HTTP requests
wget url         # Download files
netstat -tlnp    # Network connections
ss -tlnp         # Socket statistics
```

#### **Package Management:**
```bash
# Ubuntu/Debian
sudo apt update              # Update package list
sudo apt upgrade             # Upgrade packages
sudo apt install package     # Install package
sudo apt remove package      # Remove package
sudo apt search keyword      # Search packages
sudo apt autoremove          # Remove unused packages
dpkg -l                      # List installed packages

# CentOS/RHEL/Fedora
sudo yum update              # Update packages
sudo yum install package     # Install package
sudo dnf install package     # Newer Fedora
sudo rpm -qa                 # List installed packages

# macOS (Homebrew)
brew update                  # Update Homebrew
brew install package         # Install package
brew list                    # List installed packages
brew search keyword          # Search packages
brew cleanup                 # Clean up old versions

# Node.js (npm)
npm install package          # Install package
npm install -g package       # Install globally
npm list                     # List installed packages
npm update                   # Update packages
npm cache clean --force      # Clean cache

# Python (pip)
pip install package          # Install package
pip list                     # List installed packages
pip freeze > requirements.txt # Export requirements
```

#### **Text Processing and Automation:**
```bash
# Text processing
cut -d',' -f1 file.csv       # Extract CSV column
sort file.txt                # Sort lines
uniq file.txt                # Remove duplicates
wc -l file.txt               # Count lines
tr 'a-z' 'A-Z' < file.txt    # Convert to uppercase
awk '{print $1}' file.txt    # Print first column
cut -c 1-10 file.txt         # Extract first 10 characters

# Automation and scripting
echo "Hello World"           # Print text
echo $PATH                   # Print environment variable
export VAR=value             # Set environment variable
alias ll='ls -la'            # Create alias
source ~/.bashrc             # Reload shell configuration

# Cron jobs (Linux/macOS)
crontab -l                   # List cron jobs
crontab -e                   # Edit cron jobs
# Example: Run script every day at 2 AM
# 0 2 * * * /path/to/script.sh

# Windows Task Scheduler
schtasks /create /tn "MyTask" /tr "cmd /c script.bat" /sc daily /st 02:00
```

## **6. Understanding Web Browsers**

### **Popular Web Browsers:**
- **Google Chrome:** Fast, developer tools, extensive extensions
- **Mozilla Firefox:** Privacy-focused, customizable, excellent developer tools
- **Microsoft Edge:** Windows integration, Chromium-based, enterprise features
- **Safari:** macOS integration, excellent performance, privacy features
- **Opera:** Built-in VPN, ad blocker, battery saver
- **Brave:** Privacy-focused, built-in ad blocker, crypto integration

### **Browser Components:**
- **Address Bar:** Enter website URLs, search queries
- **Tabs:** Multiple pages in one window
- **Bookmarks:** Save favorite websites
- **History:** Previously visited sites
- **Settings:** Customize browser behavior
- **Extensions/Add-ons:** Additional functionality

### **Browser Developer Tools:**
- **Elements:** Inspect HTML/CSS, modify DOM
- **Console:** JavaScript debugging, logging
- **Network:** Monitor HTTP requests, responses
- **Sources:** View and edit code, set breakpoints
- **Application:** Storage, cookies, local storage, service workers
- **Performance:** Analyze page performance, memory usage
- **Security:** Check security headers, certificates

### **Browser Engines:**
- **Blink:** Chrome, Edge, Opera, Brave
- **Gecko:** Firefox
- **WebKit:** Safari, older versions
- **Servo:** Experimental browser engine (Rust)

### **Browser Storage:**
- **Cookies:** Small text files for session management
- **Local Storage:** Key-value storage, persists across sessions
- **Session Storage:** Key-value storage, cleared when tab closes
- **IndexedDB:** NoSQL database for complex data
- **WebSQL:** SQL database (deprecated)
- **Cache Storage:** Service worker cache

## **7. File Management Best Practices**

### **Organizing Files:**
```bash
# Recommended project structure
Projects/
├── Web_Development/
│   ├── HTML_Practice/
│   │   ├── basics/
│   │   ├── forms/
│   │   ├── semantic-html/
│   │   └── responsive-design/
│   ├── CSS_Practice/
│   │   ├── layouts/
│   │   ├── animations/
│   │   └── frameworks/
│   ├── JavaScript_Practice/
│   │   ├── fundamentals/
│   │   ├── dom-manipulation/
│   │   └── async-programming/
│   └── Full_Stack_Projects/
│       ├── blog-app/
│       ├── e-commerce/
│       └── social-media/
├── Documents/
│   ├── Personal/
│   ├── Work/
│   └── Education/
├── Images/
│   ├── Photos/
│   ├── Screenshots/
│   └── Graphics/
├── Videos/
│   ├── Movies/
│   ├── Tutorials/
│   └── Recordings/
├── Music/
│   ├── Albums/
│   ├── Playlists/
│   └── Podcasts/
└── Downloads/
    ├── Software/
    ├── Documents/
    └── Media/
```

### **File Naming Conventions:**
- **Kebab Case:** `user-profile-page.html`
- **Camel Case:** `userProfilePage.html`
- **Snake Case:** `user_profile_page.html`
- **Pascal Case:** `UserProfilePage.html`

#### **Best Practices:**
- Use lowercase letters
- Use hyphens or underscores instead of spaces
- Be descriptive but concise
- Include dates for version control: `project_v1_20231201.html`
- Avoid special characters except hyphens and underscores
- Use consistent naming across projects

### **Backup Strategies:**
- **3-2-1 Rule:** 3 copies, 2 different media, 1 off-site
- **External Hard Drives:** Physical backup storage
- **Cloud Storage:** Google Drive, Dropbox, OneDrive, iCloud
- **Version Control:** Git for code, Git LFS for large files
- **Automated Backups:** Schedule regular backups
- **RAID Arrays:** Redundant storage configurations

### **File System Maintenance:**
```bash
# Disk cleanup (Windows)
cleanmgr /sagerun:1

# Disk cleanup (Linux)
sudo apt autoremove
sudo apt autoclean
du -h /var/cache/apt

# Find large files
find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null

# Find duplicate files
fdupes -r /path/to/directory

# Disk usage analysis
ncdu /path/to/directory
```

## **8. Computer Security Basics**

### **Password Security:**
- **Length:** Minimum 12 characters, ideally 16+
- **Complexity:** Include uppercase, lowercase, numbers, symbols
- **Uniqueness:** Different passwords for different accounts
- **Password Managers:** LastPass, Bitwarden, 1Password, KeePass
- **Two-Factor Authentication (2FA):** Add extra security layer
- **Passwordless Authentication:** Biometrics, hardware keys

### **Safe Computing Practices:**
- **Keep software updated:** Enable automatic updates
- **Use antivirus software:** Windows Defender, Malwarebytes, Bitdefender
- **Be cautious with email attachments:** Scan before opening
- **Use HTTPS websites:** Look for padlock icon
- **Enable firewall:** Windows Firewall, ufw (Linux)
- **Lock your computer:** When away from device
- **Use VPN:** For public Wi-Fi networks
- **Regular backups:** Protect against ransomware

### **Common Threats:**
- **Malware:** Viruses, trojans, ransomware, spyware
- **Phishing:** Fake websites/emails to steal information
- **Social Engineering:** Manipulating people for information
- **Weak Passwords:** Easily guessable passwords
- **Unpatched Software:** Known vulnerabilities
- **Physical Security:** Unattended devices

### **Security Tools:**
- **Antivirus:** Real-time protection
- **Firewall:** Network traffic control
- **VPN:** Encrypted internet connection
- **Password Manager:** Secure password storage
- **Two-Factor Authentication:** Extra security layer
- **Encryption:** Protect sensitive data

## **9. System Administration Basics**

### **User Account Management:**

#### **Windows:**
```cmd
# Create new user
net user username password /add

# Add user to administrators group
net localgroup administrators username /add

# Change password
net user username newpassword

# Delete user
net user username /delete

# List all users
net user

# User account control
net accounts /maxpwage:90 /minpwage:7 /minpwlen:8
```

#### **Linux/macOS:**
```bash
# Create new user
sudo useradd -m username
sudo passwd username

# Add user to sudo group
sudo usermod -aG sudo username

# Change password
sudo passwd username

# Delete user
sudo userdel -r username

# List all users
cat /etc/passwd
getent passwd

# User management
sudo chage -m 7 -M 90 -W 7 username  # Password policy
```

### **Service Management:**

#### **Windows Services:**
```cmd
# List services
sc query

# Start service
sc start servicename

# Stop service
sc stop servicename

# Service status
sc query servicename

# Service configuration
sc config servicename start= auto
```

#### **Linux Systemd:**
```bash
# List services
systemctl list-units --type=service

# Start service
sudo systemctl start servicename

# Stop service
sudo systemctl stop servicename

# Enable service at boot
sudo systemctl enable servicename

# Service status
sudo systemctl status servicename

# View service logs
sudo journalctl -u servicename
sudo journalctl -u servicename -f  # Follow logs
```

### **System Monitoring and Performance:**

#### **Windows Performance Monitoring:**
```cmd
# Task Manager (GUI)
# Ctrl + Shift + Esc

# Performance Monitor
perfmon /report

# Resource Monitor
resmon

# Command line tools
tasklist /FI "IMAGENAME eq processname"
taskkill /PID pid /F
wmic cpu get loadpercentage
wmic os get freephysicalmemory
wmic logicaldisk get size,freespace
```

#### **Linux Performance Monitoring:**
```bash
# System load and uptime
uptime
w
who

# CPU information
lscpu
cat /proc/cpuinfo
mpstat 1

# Memory information
free -h
cat /proc/meminfo
vmstat 1

# Disk usage
df -h
du -sh /path/to/directory
iotop  # I/O monitoring

# Network monitoring
ifconfig
ip addr show
netstat -tlnp
ss -tlnp
iftop  # Network bandwidth

# Process monitoring
ps aux
top
htop
pgrep processname
pkill processname
```

### **Backup and Recovery:**

#### **Windows Backup:**
```cmd
# Create system image backup
wbadmin start backup -backupTarget:D: -include:C: -allCritical -quiet

# File backup with robocopy
robocopy C:\source D:\backup /MIR /Z /W:5 /R:3 /LOG:backup.log

# System restore
rstrui.exe

# Create restore point
wmic.exe /Namespace:\\root\default Path SystemRestore Call CreateRestorePoint "Manual Restore Point", 100, 7
```

#### **Linux Backup:**
```bash
# Archive directory
tar -czf backup.tar.gz /path/to/directory

# Rsync for incremental backups
rsync -avz --delete source/ destination/

# Create disk image
dd if=/dev/sda of=/path/to/backup.img bs=4M status=progress

# Cron-based automated backup
# Add to crontab: 0 2 * * * /path/to/backup-script.sh

# Database backups
mysqldump -u username -p database > backup.sql
pg_dump database > backup.sql
```

## **10. Performance Optimization**

### **System Performance Tuning:**

#### **Windows Optimization:**
```cmd

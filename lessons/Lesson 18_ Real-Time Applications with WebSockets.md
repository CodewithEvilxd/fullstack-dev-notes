### **Lesson 18: Real-Time Applications with WebSockets**

## **1. What are Real-Time Applications?**

Real-time applications provide instant communication and data synchronization between clients and servers. Unlike traditional request-response models, real-time apps maintain persistent connections for immediate data exchange.

### **Common Use Cases:**

- **Chat Applications:** Instant messaging
- **Live Notifications:** Push notifications, alerts
- **Collaborative Editing:** Google Docs, Figma
- **Live Streaming:** Video/audio broadcasting
- **Online Gaming:** Multiplayer games
- **Financial Trading:** Real-time stock prices
- **IoT Dashboards:** Sensor data monitoring
- **Live Sports Scores:** Real-time updates

### **Traditional vs Real-Time Communication:**

```javascript
// Traditional HTTP (Polling)
setInterval(() => {
    fetch('/api/messages')
        .then(res => res.json())
        .then(messages => updateUI(messages));
}, 5000); // Check every 5 seconds

// Real-Time WebSocket
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    updateUI(message); // Instant update
};
```

## **2. Understanding WebSockets**

### **What are WebSockets?**
WebSockets provide full-duplex communication channels over a single TCP connection. They enable real-time, bidirectional communication between web browsers and servers.

### **WebSocket Protocol:**

```javascript
// Client-side WebSocket
const ws = new WebSocket('ws://localhost:3000');

// Connection opened
ws.onopen = (event) => {
    console.log('Connected to WebSocket server');
    ws.send(JSON.stringify({
        type: 'join',
        room: 'general'
    }));
};

// Listen for messages
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleMessage(data);
};

// Handle errors
ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

// Connection closed
ws.onclose = (event) => {
    console.log('Disconnected from WebSocket server');
    // Attempt to reconnect
    setTimeout(() => {
        connectWebSocket();
    }, 3000);
};

// Send messages
function sendMessage(message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    }
}
```

### **WebSocket Lifecycle:**

```
1. Connection Establishment
   Client → Server: HTTP Upgrade Request
   Server → Client: HTTP 101 Switching Protocols

2. Data Exchange
   Client ↔ Server: Full-duplex communication

3. Connection Termination
   Client/Server → Other: Close frame
   Other → Sender: Close frame acknowledgment
```

## **3. Socket.IO - Enhanced WebSockets**

### **What is Socket.IO?**
Socket.IO is a library that enables real-time, bidirectional communication between web clients and servers. It provides additional features like automatic reconnection, acknowledgments, and broadcasting.

### **Socket.IO Server Setup:**

```javascript
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room
    socket.on('join-room', (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);

        // Notify others in the room
        socket.to(roomName).emit('user-joined', {
            userId: socket.id,
            message: 'A new user joined the room'
        });
    });

    // Handle chat messages
    socket.on('send-message', (data) => {
        const { room, message, username } = data;

        // Send to all users in the room (including sender)
        io.to(room).emit('receive-message', {
            message,
            username,
            timestamp: new Date(),
            userId: socket.id
        });
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
        socket.to(data.room).emit('user-typing', {
            username: data.username,
            userId: socket.id
        });
    });

    socket.on('stop-typing', (data) => {
        socket.to(data.room).emit('user-stop-typing', {
            userId: socket.id
        });
    });

    // Handle private messages
    socket.on('private-message', (data) => {
        const { targetUserId, message } = data;
        io.to(targetUserId).emit('receive-private-message', {
            message,
            from: socket.id,
            timestamp: new Date()
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Express routes for additional functionality
app.get('/api/rooms', (req, res) => {
    // Get list of active rooms
    const rooms = [];
    io.sockets.adapter.rooms.forEach((value, key) => {
        if (!value.has(key)) { // Filter out user-specific rooms
            rooms.push({
                name: key,
                userCount: value.size
            });
        }
    });
    res.json(rooms);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### **Socket.IO Client Setup:**

```javascript
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('general');
    const [isConnected, setIsConnected] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Connection events
        socket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from server');
        });

        // Message events
        socket.on('receive-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Room events
        socket.on('user-joined', (data) => {
            setMessages(prev => [...prev, {
                message: data.message,
                username: 'System',
                timestamp: new Date(),
                isSystem: true
            }]);
        });

        // Typing events
        socket.on('user-typing', (data) => {
            setTypingUsers(prev => [...prev, data.username]);
        });

        socket.on('user-stop-typing', (data) => {
            setTypingUsers(prev => prev.filter(user => user !== data.username));
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('receive-message');
            socket.off('user-joined');
            socket.off('user-typing');
            socket.off('user-stop-typing');
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const joinRoom = () => {
        if (username && room) {
            socket.emit('join-room', room);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (currentMessage.trim() && username) {
            socket.emit('send-message', {
                room,
                message: currentMessage,
                username
            });
            setCurrentMessage('');
            socket.emit('stop-typing', { room });
        }
    };

    const handleTyping = () => {
        if (currentMessage && !typingUsers.includes(username)) {
            socket.emit('typing', { room, username });
        }
    };

    const handleStopTyping = () => {
        socket.emit('stop-typing', { room });
    };

    return (
        <div className="chat-app">
            <div className="connection-status">
                Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </div>

            {!username ? (
                <div className="login">
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter room"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            ) : (
                <div className="chat-container">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`message ${msg.isSystem ? 'system' : ''}`}
                            >
                                <strong>{msg.username}:</strong> {msg.message}
                                <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {typingUsers.length > 0 && (
                        <div className="typing-indicator">
                            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                        </div>
                    )}

                    <form onSubmit={sendMessage} className="message-form">
                        <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={handleTyping}
                            onKeyUp={handleStopTyping}
                            placeholder="Type a message..."
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ChatApp;
```

## **4. Advanced Socket.IO Features**

### **Namespaces and Rooms:**

```javascript
// Server-side namespaces
const chatNamespace = io.of('/chat');
const gameNamespace = io.of('/game');

chatNamespace.on('connection', (socket) => {
    console.log('User connected to chat');

    socket.on('join-room', (roomName) => {
        socket.join(roomName);
        console.log(`User joined room: ${roomName}`);
    });

    socket.on('send-message', (data) => {
        // Send to specific room
        chatNamespace.to(data.room).emit('message', data);
    });
});

gameNamespace.on('connection', (socket) => {
    console.log('User connected to game');

    socket.on('join-game', (gameId) => {
        socket.join(`game-${gameId}`);
    });

    socket.on('game-move', (data) => {
        gameNamespace.to(`game-${data.gameId}`).emit('opponent-move', data);
    });
});
```

### **Middleware and Authentication:**

```javascript
// Authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error'));
    }

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error'));
        }

        socket.userId = decoded.userId;
        socket.username = decoded.username;
        next();
    });
});

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const socketLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 messages per minute per user
    message: 'Too many messages, please slow down'
});

io.use((socket, next) => {
    socketLimiter(socket.request, socket.request.res, next);
});
```

### **Binary Data and File Uploads:**

```javascript
// Handle binary data
socket.on('send-file', (fileData) => {
    // fileData contains ArrayBuffer
    const buffer = Buffer.from(fileData);

    // Save file or process binary data
    fs.writeFile(`uploads/${Date.now()}-file.bin`, buffer, (err) => {
        if (err) {
            socket.emit('file-error', 'Failed to save file');
        } else {
            socket.emit('file-saved', 'File uploaded successfully');
        }
    });
});

// Stream large files
const fs = require('fs');

socket.on('start-upload', (fileInfo) => {
    const { filename, size } = fileInfo;
    const writeStream = fs.createWriteStream(`uploads/${filename}`);

    socket.fileStream = writeStream;
    socket.fileSize = size;
    socket.receivedSize = 0;

    socket.emit('ready-for-upload');
});

socket.on('upload-chunk', (chunk) => {
    if (socket.fileStream) {
        socket.fileStream.write(Buffer.from(chunk));
        socket.receivedSize += chunk.byteLength;

        // Send progress
        const progress = (socket.receivedSize / socket.fileSize) * 100;
        socket.emit('upload-progress', Math.round(progress));

        if (socket.receivedSize >= socket.fileSize) {
            socket.fileStream.end();
            socket.emit('upload-complete');
        }
    }
});
```

## **5. Real-Time Data Synchronization**

### **Operational Transforms (OT):**

```javascript
class DocumentManager {
    constructor() {
        this.documents = new Map();
        this.operations = new Map();
    }

    // Apply operation to document
    applyOperation(docId, operation) {
        const doc = this.documents.get(docId);
        if (!doc) return;

        // Apply the operation
        const newContent = this.applyOpToContent(doc.content, operation);

        // Store operation for conflict resolution
        if (!this.operations.has(docId)) {
            this.operations.set(docId, []);
        }
        this.operations.get(docId).push(operation);

        // Update document
        doc.content = newContent;
        doc.lastModified = Date.now();

        // Broadcast to all clients except sender
        io.to(`doc-${docId}`).emit('document-updated', {
            docId,
            content: newContent,
            operation
        });
    }

    applyOpToContent(content, operation) {
        const { type, position, text, length } = operation;

        switch (type) {
            case 'insert':
                return content.slice(0, position) + text + content.slice(position);
            case 'delete':
                return content.slice(0, position) + content.slice(position + length);
            default:
                return content;
        }
    }

    // Handle concurrent operations
    transformOperations(op1, op2) {
        // Implement operational transformation logic
        // This is complex and would require a full OT library in production
        return [op1, op2];
    }
}
```

### **Conflict Resolution:**

```javascript
// Client-side conflict resolution
class ConflictResolver {
    constructor() {
        this.pendingOperations = [];
        this.lastSyncedVersion = 0;
    }

    // Queue operation for sending
    queueOperation(operation) {
        this.pendingOperations.push({
            ...operation,
            version: this.lastSyncedVersion + this.pendingOperations.length + 1
        });

        this.sendPendingOperations();
    }

    // Send operations to server
    async sendPendingOperations() {
        if (this.pendingOperations.length === 0) return;

        try {
            const response = await fetch('/api/operations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    operations: this.pendingOperations,
                    lastVersion: this.lastSyncedVersion
                })
            });

            if (response.ok) {
                this.pendingOperations = [];
                this.lastSyncedVersion += this.pendingOperations.length;
            } else if (response.status === 409) {
                // Handle conflicts
                const { serverOperations } = await response.json();
                this.resolveConflicts(serverOperations);
            }
        } catch (error) {
            console.error('Failed to send operations:', error);
        }
    }

    resolveConflicts(serverOperations) {
        // Implement conflict resolution logic
        // Transform local operations based on server operations
        this.pendingOperations = this.transformOperations(
            this.pendingOperations,
            serverOperations
        );
    }
}
```

## **6. Scaling Real-Time Applications**

### **Horizontal Scaling with Redis:**

```javascript
const redis = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

// Redis clients for pub/sub
const pubClient = redis.createClient({ host: 'localhost', port: 6379 });
const subClient = pubClient.duplicate();

// Use Redis adapter for scaling across multiple server instances
io.adapter(createAdapter(pubClient, subClient));

// Store session data in Redis
const redisSession = require('connect-redis')(session);

app.use(session({
    store: new redisSession({
        client: redis.createClient(),
        ttl: 86400 // 24 hours
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
```

### **Load Balancing:**

```nginx
# Nginx configuration for load balancing
upstream websocket_backend {
    ip_hash; # Sticky sessions for WebSocket
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 80;
    server_name your-app.com;

    location /socket.io/ {
        proxy_pass http://websocket_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **Database Optimization for Real-Time:**

```javascript
// Use MongoDB change streams for real-time data
const changeStream = collection.watch();

changeStream.on('change', (change) => {
    switch (change.operationType) {
        case 'insert':
            io.emit('item-added', change.fullDocument);
            break;
        case 'update':
            io.emit('item-updated', {
                id: change.documentKey._id,
                updates: change.updateDescription.updatedFields
            });
            break;
        case 'delete':
            io.emit('item-deleted', change.documentKey._id);
            break;
    }
});

// Optimized queries for real-time data
const getRealtimeData = async (userId) => {
    return await collection.aggregate([
        { $match: { userId: ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
        { $limit: 50 },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                content: 1,
                createdAt: 1,
                'user.name': 1,
                'user.avatar': 1
            }
        }
    ]).toArray();
};
```

## **7. Code Examples**

### **Example 1: Real-Time Chat Application**

```javascript
// server.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// In-memory storage (use database in production)
const users = new Map();
const messages = [];
const onlineUsers = new Set();

// Authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication required'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.username = decoded.username;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
});

// Socket connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.username} (${socket.id})`);

    // Add user to online list
    onlineUsers.add(socket.userId);
    users.set(socket.userId, {
        id: socket.userId,
        username: socket.username,
        socketId: socket.id
    });

    // Broadcast online users
    io.emit('online-users', Array.from(onlineUsers).map(id => users.get(id)));

    // Send recent messages
    socket.emit('recent-messages', messages.slice(-50));

    // Handle new messages
    socket.on('send-message', (data) => {
        const message = {
            id: Date.now().toString(),
            userId: socket.userId,
            username: socket.username,
            content: data.content,
            timestamp: new Date(),
            type: 'text'
        };

        messages.push(message);

        // Keep only last 1000 messages
        if (messages.length > 1000) {
            messages.shift();
        }

        // Broadcast to all connected clients
        io.emit('new-message', message);
    });

    // Handle typing indicators
    socket.on('typing-start', () => {
        socket.broadcast.emit('user-typing', {
            userId: socket.userId,
            username: socket.username
        });
    });

    socket.on('typing-stop', () => {
        socket.broadcast.emit('user-stop-typing', {
            userId: socket.userId
        });
    });

    // Handle private messages
    socket.on('send-private-message', (data) => {
        const targetUser = users.get(data.targetUserId);
        if (targetUser) {
            const privateMessage = {
                id: Date.now().toString(),
                from: socket.userId,
                to: data.targetUserId,
                content: data.content,
                timestamp: new Date()
            };

            // Send to target user
            io.to(targetUser.socketId).emit('private-message', privateMessage);

            // Send confirmation to sender
            socket.emit('private-message-sent', privateMessage);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.username}`);
        onlineUsers.delete(socket.userId);
        users.delete(socket.userId);

        // Broadcast updated online users
        io.emit('online-users', Array.from(onlineUsers).map(id => users.get(id)));
    });
});

// REST API for additional functionality
app.get('/api/messages', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    res.json({
        messages: messages.slice(offset, offset + limit),
        total: messages.length,
        hasMore: offset + limit < messages.length
    });
});

app.get('/api/online-users', (req, res) => {
    res.json({
        users: Array.from(onlineUsers).map(id => users.get(id)),
        count: onlineUsers.size
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Real-time chat server running on port ${PORT}`);
});
```

### **Example 2: Collaborative Drawing App**

```javascript
// server.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Store drawing data
let drawingData = [];
let connectedUsers = 0;

// Socket handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    connectedUsers++;

    // Send current drawing data to new user
    socket.emit('load-drawing', drawingData);

    // Broadcast user count
    io.emit('user-count', connectedUsers);

    // Handle drawing events
    socket.on('draw', (data) => {
        drawingData.push(data);
        socket.broadcast.emit('draw', data); // Send to all except sender
    });

    // Handle clear canvas
    socket.on('clear-canvas', () => {
        drawingData = [];
        socket.broadcast.emit('clear-canvas');
    });

    // Handle undo
    socket.on('undo', () => {
        if (drawingData.length > 0) {
            drawingData.pop();
            socket.broadcast.emit('undo');
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        connectedUsers--;
        io.emit('user-count', connectedUsers);
    });
});

server.listen(3000, () => {
    console.log('Drawing server running on port 3000');
});
```

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaborative Drawing</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f0f0f0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .toolbar {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        button {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background: #007bff;
            color: white;
        }
        button:hover {
            background: #0056b3;
        }
        .color-picker {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
        }
        canvas {
            border: 2px solid #ddd;
            border-radius: 5px;
            background: white;
            cursor: crosshair;
        }
        .status {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Collaborative Drawing</h1>

        <div class="toolbar">
            <button id="clearBtn">Clear Canvas</button>
            <button id="undoBtn">Undo</button>
            <input type="color" id="colorPicker" class="color-picker" value="#000000">
            <span>Brush Size:</span>
            <input type="range" id="brushSize" min="1" max="20" value="5">
            <span id="brushSizeValue">5</span>
            <div class="status">
                <span id="userCount">0</span> users online
            </div>
        </div>

        <canvas id="drawingCanvas" width="800" height="600"></canvas>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        const canvas = document.getElementById('drawingCanvas');
        const ctx = canvas.getContext('2d');
        const clearBtn = document.getElementById('clearBtn');
        const undoBtn = document.getElementById('undoBtn');
        const colorPicker = document.getElementById('colorPicker');
        const brushSize = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        const userCount = document.getElementById('userCount');

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let drawingData = [];

        // Update brush size display
        brushSize.addEventListener('input', () => {
            brushSizeValue.textContent = brushSize.value;
        });

        // Drawing functions
        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        function draw(e) {
            if (!isDrawing) return;

            const drawData = {
                x: e.offsetX,
                y: e.offsetY,
                lastX: lastX,
                lastY: lastY,
                color: colorPicker.value,
                size: brushSize.value
            };

            // Draw locally
            drawLine(drawData);

            // Send to server
            socket.emit('draw', drawData);

            [lastX, lastY] = [e.offsetX, e.offsetY];
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function drawLine(data) {
            ctx.beginPath();
            ctx.moveTo(data.lastX, data.lastY);
            ctx.lineTo(data.x, data.y);
            ctx.strokeStyle = data.color;
            ctx.lineWidth = data.size;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        // Event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            socket.emit('clear-canvas');
        });

        undoBtn.addEventListener('click', () => {
            socket.emit('undo');
        });

        // Socket event handlers
        socket.on('load-drawing', (data) => {
            drawingData = data;
            redrawCanvas();
        });

        socket.on('draw', (data) => {
            drawLine(data);
        });

        socket.on('clear-canvas', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        socket.on('undo', () => {
            // Simple undo - clear and redraw without last item
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawingData.pop();
            redrawCanvas();
        });

        socket.on('user-count', (count) => {
            userCount.textContent = count;
        });

        function redrawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawingData.forEach(drawData => {
                drawLine(drawData);
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            // Adjust canvas size if needed
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        });
    </script>
</body>
</html>
```

### **Example 3: Real-Time Notification System**

```javascript
// notification-server.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = createServer(app);
const io = new Server(server);

// In-memory storage (use Redis/database in production)
const userSockets = new Map();
const notifications = new Map();

// Authentication middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication required'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        socket.username = decoded.username;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.username}`);

    // Store user socket mapping
    userSockets.set(socket.userId, socket.id);

    // Send pending notifications
    const userNotifications = notifications.get(socket.userId) || [];
    if (userNotifications.length > 0) {
        socket.emit('pending-notifications', userNotifications);
        notifications.delete(socket.userId);
    }

    // Handle notification preferences
    socket.on('update-preferences', (preferences) => {
        socket.preferences = preferences;
    });

    // Handle mark as read
    socket.on('mark-read', (notificationId) => {
        // Update notification status in database
        socket.emit('notification-read', notificationId);
    });

    socket.on('disconnect', () => {
        userSockets.delete(socket.userId);
        console.log(`User disconnected: ${socket.username}`);
    });
});

// Notification functions
function sendNotification(userId, notification) {
    const socketId = userSockets.get(userId);

    if (socketId) {
        // User is online, send immediately
        io.to(socketId).emit('notification', notification);
    } else {
        // User is offline, store for later
        if (!notifications.has(userId)) {
            notifications.set(userId, []);
        }
        notifications.get(userId).push(notification);
    }
}

function broadcastNotification(notification, excludeUserId = null) {
    io.sockets.sockets.forEach((socket) => {
        if (socket.userId !== excludeUserId) {
            socket.emit('notification', notification);
        }
    });
}

// Example usage
app.post('/api/notify', (req, res) => {
    const { userId, title, message, type = 'info' } = req.body;

    const notification = {
        id: Date.now().toString(),
        title,
        message,
        type,
        timestamp: new Date(),
        read: false
    };

    sendNotification(userId, notification);
    res.json({ success: true });
});

app.post('/api/broadcast', (req, res) => {
    const { title, message, type = 'info', excludeUserId } = req.body;

    const notification = {
        id: Date.now().toString(),
        title,
        message,
        type,
        timestamp: new Date(),
        read: false
    };

    broadcastNotification(notification, excludeUserId);
    res.json({ success: true });
});

server.listen(3002, () => {
    console.log('Notification server running on port 3002');
});
```

## **8. Assignments and Projects**

### **Assignment 18.1: Basic WebSocket Chat**
Create a simple chat application with:
- Real-time message sending and receiving
- User join/leave notifications
- Online user list
- Message history
- Basic styling

### **Assignment 18.2: Socket.IO Features**
Implement advanced Socket.IO features:
- Rooms for private conversations
- Typing indicators
- Message acknowledgments
- Connection status monitoring
- Error handling and reconnection

### **Project 18: Real-Time Collaborative Editor**
Build a collaborative text editor with:
- Multiple users editing simultaneously
- Real-time synchronization
- Operational transforms for conflict resolution
- User cursors and selections
- Document versioning
- User permissions

### **Challenge Project: Multiplayer Game**
Create a real-time multiplayer game with:
- Game state synchronization
- Player matchmaking
- Real-time player movements
- Chat system
- Leaderboards
- Spectator mode

## **9. Best Practices**

### **Connection Management:**
- Handle connection drops gracefully
- Implement reconnection logic
- Monitor connection health
- Clean up resources on disconnect
- Use connection pooling for scalability

### **Performance Optimization:**
- Minimize message size
- Use binary data when appropriate
- Implement message batching
- Use compression for large payloads
- Monitor server resource usage

### **Security Considerations:**
- Authenticate WebSocket connections
- Validate all incoming messages
- Implement rate limiting
- Use secure WebSocket (WSS) in production
- Sanitize user-generated content

### **Scalability:**
- Use Redis for pub/sub in multi-server setups
- Implement load balancing
- Monitor connection counts
- Use horizontal scaling
- Optimize database queries for real-time data

## **10. Resources**

- [Socket.IO Documentation](https://socket.io/docs/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Real-Time Web Apps with Socket.IO](https://socket.io/get-started/chat/)
- [Operational Transforms](https://operational-transformation.github.io/)
- [WebRTC for Real-Time Communication](https://webrtc.org/)

## **11. Next Steps**

Now that you understand real-time applications, you're ready to explore:
- **Microservices Architecture:** Breaking down applications into smaller services
- **Serverless Computing:** AWS Lambda and cloud functions
- **Advanced State Management:** Redux with real-time updates
- **WebRTC:** Browser-to-browser communication
- **Progressive Web Apps:** Offline-capable web applications

Practice building real-time features and experiment with different synchronization patterns to strengthen your real-time development skills!
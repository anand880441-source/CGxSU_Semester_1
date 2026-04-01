# Express.js Middleware — Complete Guide
**Level:** Basic → Advanced

---


## 1. What is Middleware?

### The Concept

Before jumping into code, understand this through a real-world example.

> Imagine you are at an airport.
> You walk in → **Check-in counter** verifies your ticket → **Baggage drop** takes your luggage → **Security** scans you → **Boarding gate** lets you in → You board the plane.

Nobody lets you board directly. Every step does one specific job and then passes you to the next step.

**This is exactly how middleware works in Express.**

```
Client Request  →  Middleware 1  →  Middleware 2  →  Route Handler  →  Response
```

Every middleware function does its job and then either:
- Passes control to the next function using `next()`
- Or ends the request by sending a response

### Definition

> **Middleware** is a function that has access to the `req` (request), `res` (response), and `next` objects. It executes during the request-response cycle, between the client sending the request and the server sending the response.

### The Middleware Signature

Every middleware function — without exception — follows this structure:

```js
function middlewareName(req, res, next) {
  // your logic here
  next(); // pass control to the next middleware
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `req` | Object | Incoming request — contains URL, body, headers, params |
| `res` | Object | Outgoing response — used to send data back to client |
| `next` | Function | Call it to move to the next middleware or route handler |

### The Flow

```
Client sends Request
        │
        ▼
  ┌─────────────┐
  │ Middleware 1 │  →  logs the request  →  next()
  └─────────────┘
        │
        ▼
  ┌─────────────┐
  │ Middleware 2 │  →  checks token  →  next()
  └─────────────┘
        │
        ▼
  ┌──────────────┐
  │ Route Handler │  →  sends response  →  res.json()
  └──────────────┘
        │
        ▼
Client receives Response
```

> **Golden Rule:** Always call `next()` at the end of a middleware function — unless you are intentionally sending a response and stopping the chain. If `next()` is never called and no response is sent, the request will hang and the client will wait forever.

---

## 2. Types of Middleware

Express has five types of middleware. Understanding this classification is important for interviews and for writing clean code.

| # | Type | How it is registered | Scope |
|---|------|----------------------|-------|
| 1 | Application-Level | `app.use()` or `app.get()` | Entire application |
| 2 | Router-Level | `router.use()` | Specific router only |
| 3 | Built-in | Ships with Express | Used directly — no install |
| 4 | Third-Party | Installed via `npm` | Plugged in via `app.use()` |
| 5 | Error-Handling | `(err, req, res, next)` | Catches errors — always last |

Each type is covered in detail in the sections below.

---

## 3. How to Register Middleware

Use `app.use()` to attach middleware to your Express application.

```js
// Applies to ALL routes — every request passes through this
app.use(myMiddleware);

// Applies to a specific path — only requests to /api go through this
app.use('/api', myMiddleware);

// Applies to one specific route only
app.get('/dashboard', myMiddleware, (req, res) => {
  res.send('Dashboard');
});
```

### Global vs Route-Level

```js
// Global — runs for every single request
app.use(logger);

// Route-level — runs only when /profile is hit
app.get('/profile', authMiddleware, (req, res) => {
  res.send('Profile page');
});
```

---

## 4. Built-in Middleware

These come included with Express. No installation needed.

### 4.1 `express.json()`

Parses incoming requests that have a JSON body. Without this, `req.body` will be `undefined` for any POST or PUT request.

```js
app.use(express.json());

app.post('/users', (req, res) => {
  console.log(req.body); // { name: 'Rahul', email: 'rahul@example.com' }
  res.status(201).json({ message: 'User created', data: req.body });
});
```

**When is it needed?** Any time a client sends JSON data — which is almost always the case when building REST APIs.

---

### 4.2 `express.urlencoded()`

Parses data submitted through HTML forms (Content-Type: `application/x-www-form-urlencoded`).

```js
app.use(express.urlencoded({ extended: true }));
```

> **Note:** When building REST APIs, you will primarily use `express.json()`. `express.urlencoded()` is needed when working with traditional browser-based HTML forms.

---

## 5. Custom Middleware

Custom middleware is code you write for your specific application needs. The key benefit is reusability — write once, apply anywhere.

### 5.1 Logger Middleware

Logs the method and URL of every incoming request. Extremely useful during development and debugging.

```js
// src/middlewares/logger.js

function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]  ${req.method}  ${req.url}`);
  next();
}

module.exports = logger;
```

Register it in `app.js`:

```js
const logger = require('./middlewares/logger');
app.use(logger); // runs for every request
```

**Terminal output:**

```
[2025-01-15T10:30:00.000Z]  GET     /users
[2025-01-15T10:30:05.000Z]  POST    /users
[2025-01-15T10:30:10.000Z]  DELETE  /users/3
```

---

### 5.2 Authentication Middleware

Checks whether a request has a valid token before allowing access to a protected route.

```js
// src/middlewares/auth.js

function auth(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    // No token — stop here and send 401
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  if (token !== 'valid_token') {
    // Wrong token — stop here and send 403
    return res.status(403).json({ message: 'Invalid token.' });
  }

  // Token is valid — pass control forward
  next();
}

module.exports = auth;
```

Apply it on specific protected routes:

```js
const auth = require('./middlewares/auth');

// Public — anyone can access
app.get('/products', (req, res) => {
  res.json({ products: [] });
});

// Protected — auth runs first
app.get('/dashboard', auth, (req, res) => {
  res.json({ message: 'Welcome to the dashboard.' });
});
```

**HTTP Status Code Reference:**

| Code | Meaning | When to use |
|------|---------|-------------|
| `401 Unauthorized` | Not authenticated | No token present |
| `403 Forbidden` | Authenticated but not allowed | Wrong token or insufficient permission |

> **Note on `return`:** Always use `return res.status(...).json(...)` when stopping inside middleware. The `return` keyword ensures the function exits immediately and `next()` is never accidentally called after the response is sent.

---

### 5.3 Role-Based Middleware (Reusable Pattern)

When different routes need different permission levels, use a factory function — a function that returns a middleware.

```js
// src/middlewares/role.js

function requireRole(role) {
  return function (req, res, next) {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
  };
}

module.exports = requireRole;
```

Usage:

```js
const requireRole = require('./middlewares/role');

app.get('/admin',   requireRole('admin'),  handler);
app.get('/editor',  requireRole('editor'), handler);
```

One middleware function — used for any role. This is the reusable design pattern.

---

### 5.4 Async Middleware

When your middleware performs an async operation (like a database call), use `async/await` and always wrap it in a `try/catch` to forward errors properly.

```js
const asyncMiddleware = async (req, res, next) => {
  try {
    const data = await someAsyncDatabaseCall();
    req.data = data; // attach to req for use in route handler
    next();
  } catch (err) {
    next(err); // forward error to the error handler
  }
};
```

---

## 6. Execution Order

### Order Matters — Always

Express executes middleware in the exact order it is registered — top to bottom. This is one of the most critical concepts to understand.

**Correct Order:**

```js
// app.js

app.use(helmet());          // 1. Security headers first
app.use(cors());            // 2. Allow cross-origin requests
app.use(morgan('dev'));     // 3. Log the incoming request
app.use(express.json());   // 4. Parse the request body
app.use(logger);           // 5. Custom logger
app.use('/api', routes);   // 6. Route handling
app.use(errorHandler);     // 7. Error handler — ALWAYS last
```

**Wrong Order — and what breaks:**

```js
// ❌ Bug: Body not parsed before route handler runs
app.post('/users', (req, res) => {
  console.log(req.body); // undefined ❌
});
app.use(express.json());   // Too late — route already executed
```

### Chaining Middleware on a Single Route

```js
// Multiple middleware as arguments
app.get('/admin', auth, requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin panel' });
});

// Or as an array — same behavior
app.get('/admin', [auth, requireRole('admin')], (req, res) => {
  res.json({ message: 'Admin panel' });
});
```

Flow: `auth` → `requireRole('admin')` → route handler. Each must call `next()` to continue.

---

## 7. Error-Handling Middleware

### What Makes It Special

Error-handling middleware has **four parameters** instead of three. Express identifies it as an error handler specifically because of the `err` parameter in the first position.

```js
// Normal middleware — 3 params
function myMiddleware(req, res, next) { }

// Error handler — 4 params (err is first)
function errorHandler(err, req, res, next) { }
```

### Writing the Error Handler

```js
// src/middlewares/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
```

### Triggering the Error Handler

Call `next(err)` from any route or middleware when something goes wrong. Express will skip all remaining middleware and route handlers and go directly to the error handler.

```js
app.get('/users/:id', (req, res, next) => {
  const user = getUserById(req.params.id);

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    return next(err); // jumps to errorHandler
  }

  res.json(user);
});
```

### Register It Last

```js
// app.js — error handler must be the very last middleware

app.use('/api', routes);
app.use(errorHandler); // ← last
```

> **Important:** Error-handling middleware does **not** catch errors automatically. You must explicitly call `next(err)` to send the error to it. And it must always be registered after all routes.

---

## 8. Third-Party Middleware — morgan, cors, helmet

Install all three:

```bash
npm install morgan cors helmet
```

---

### 8.1 morgan — HTTP Request Logger

A production-quality request logger. It replaces the need to write your own.

```js
const morgan = require('morgan');

app.use(morgan('dev')); // colored, concise output for development
```

**Output:**

```
GET    /users      200  5.123 ms  -  128
POST   /users      201  8.456 ms  -  64
GET    /users/99   404  2.100 ms  -  45
```

| Format | When to use |
|--------|-------------|
| `'dev'` | Local development — colorful and concise |
| `'combined'` | Production — full Apache-style logs |
| `'tiny'` | Minimal output |

---

### 8.2 cors — Cross-Origin Resource Sharing

**The Problem:** Browsers block requests made from one URL to a different URL by default. This is a browser security policy.

For example, your React frontend is on `http://localhost:5173` and your Express backend is on `http://localhost:3000`. The browser will block this request unless the backend explicitly permits it.

**Without cors:**

```
Access to fetch at 'http://localhost:3000' from origin 'http://localhost:5173'
has been blocked by CORS policy.
```

**With cors:**

```js
const cors = require('cors');

// Allow all origins — acceptable during development
app.use(cors());

// Allow specific origins — required in production
app.use(cors({
  origin: 'https://yourfrontend.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

---

### 8.3 helmet — Security Headers

Helmet adds a set of HTTP security headers to every response. It protects against common web vulnerabilities like XSS, clickjacking, and MIME sniffing.

```js
const helmet = require('helmet');

app.use(helmet()); // one line — significant security improvement
```

You do not need to understand every header it sets right now. The rule is simple: **always include helmet in any production Express application.**

---

## 9. Folder Structure

As your application grows, keeping all code in a single file becomes unmanageable. A clear folder structure separates concerns and makes the codebase readable, maintainable, and team-friendly.

```
my-app/
│
├── src/
│   ├── config/           # DB connection
│   │   └── db.js
│
│   ├── models/           # Schema / Database logic
│   │   └── user.model.js
│
│   ├── controllers/      # Business logic
│   │   └── user.controller.js
│
│   ├── routes/           # API routes
│   │   └── user.routes.js
│
│   ├── middlewares/      # Auth, logger etc
│   │   └── auth.js
│
│   ├── app.js            # Express setup
│   └── index.js          # Server start
│
├── package.json
└── .env
```

**Each file has one responsibility:**

## 📁 File Responsibility (MVC Structure)

| File / Folder | Responsibility |
|---|---|
| `index.js` | Starts the HTTP server (port listen) — no business logic |
| `app.js` | Sets up Express app — registers middleware and routes |
| `config/` | Handles configuration (e.g., database connection) |
| `models/` | Defines database schemas and data structure |
| `controllers/` | Contains business logic (CRUD operations, processing) |
| `routes/` | Defines API endpoints and connects them to controllers |
| `middlewares/` | Reusable middleware (auth, logger, validation, error handling) |
| `.env` | Stores sensitive data (DB URI, JWT secret, PORT, etc.) |
| `package.json` | Project metadata, dependencies, and scripts |

---

## 🔄 Request Flow (MVC)

| Step | Layer |
|------|------|
| Request received | `routes/` |
| Logic execution | `controllers/` |
| Database interaction | `models/` |
| Response sent | `controllers/` |

---

##  MVC Summary

- **Model → Data layer**
- **Controller → Logic layer**
- **Route → Flow control**

---
> Route request ko controller tak le jata hai, controller model se baat karta hai
---

## 10. Mini Project

A complete working example with everything covered so far — folder structure, all middleware types, error handling.

---

### `src/index.js`

```js
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

---

### `src/app.js`

```js
const express = require('express');
const morgan  = require('morgan');
const cors    = require('cors');
const helmet  = require('helmet');

const userRoutes   = require('./routes/user.routes');
const logger       = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// 1. Security
app.use(helmet());

// 2. CORS
app.use(cors());

// 3. HTTP Logger
app.use(morgan('dev'));

// 4. Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Custom Logger
app.use(logger);

// 6. Routes
app.use('/api/users', userRoutes);

// 7. 404 — no route matched
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// 8. Error Handler — must be last
app.use(errorHandler);

module.exports = app;
```

---

### `src/middlewares/logger.js`

```js
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}]  ${req.method}  ${req.url}`);
  next();
}

module.exports = logger;
```

---

### `src/middlewares/auth.js`

```js
function auth(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  if (token !== 'valid_token') {
    return res.status(403).json({ message: 'Invalid token.' });
  }

  next();
}

module.exports = auth;
```

---

### `src/middlewares/errorHandler.js`

```js
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
```

---

### `src/routes/user.routes.js`

```js
const express = require('express');
const router  = express.Router();
const auth    = require('../middlewares/auth');

// Public — no authentication required
router.get('/', (req, res) => {
  res.json({
    success: true,
    users: ['Rahul', 'Ayesha', 'Priya'],
  });
});

// Protected — auth middleware runs first
router.get('/:id', auth, (req, res, next) => {
  const id = parseInt(req.params.id);

  if (id !== 1) {
    const err = new Error('User not found.');
    err.status = 404;
    return next(err);
  }

  res.json({ success: true, user: { id: 1, name: 'Rahul' } });
});

module.exports = router;
```

---

### Testing the API

```bash
# Get all users — public route
curl http://localhost:3000/api/users

# Get a specific user — protected (will return 401)
curl http://localhost:3000/api/users/1

# Get a specific user — with valid token
curl -H "authorization: valid_token" http://localhost:3000/api/users/1

# Trigger 404 error
curl http://localhost:3000/api/unknown

# Trigger route-level 404 (user not found)
curl -H "authorization: valid_token" http://localhost:3000/api/users/99
```

---


## 12. Assignments

### 🟢 Beginner

Write a middleware that logs the IP address of every incoming request.

```js
// Hint: IP address is available on req.ip
function ipLogger(req, res, next) {
  // your code here
}
```

---

### 🟡 Intermediate

Build a middleware that checks for a `Content-Type: application/json` header on POST requests. If the header is missing, respond with a `400 Bad Request` error. If it is present, call `next()`.

---

### 🔴 Advanced

Build a mini API with the following requirements:

1. `POST /login` — accepts `{ username, password }` in the request body and returns a fake token
2. `GET /orders` — a protected route (use auth middleware)
3. Logger middleware — every request must be logged to the console
4. Error-handling middleware — handle all errors centrally, including a `404` for unknown routes
5. Folder structure — follow the structure from Section 9

---

## 13. Interview Revision

### Quick Reference Table

| Topic | Key Point |
|-------|-----------|
| Definition | Function between request and response — runs `next()` to continue |
| Signature | `(req, res, next)` — error handler is `(err, req, res, next)` |
| `next()` | Must be called or request hangs — never call after `res.send()` |
| Execution order | Top to bottom — order of registration matters |
| `express.json()` | Parses JSON body — without it `req.body` is `undefined` |
| `express.static()` | Serves static files from a folder |
| `morgan` | HTTP request logger — shows method, URL, status, time |
| `cors` | Allows frontend on a different URL to call the backend |
| `helmet` | Adds HTTP security headers — always use in production |
| Error handler | 4 params — triggered by `next(err)` — must be registered last |
| Global vs local | `app.use(fn)` = all routes. `app.get('/path', fn)` = one route |

---

### Frequently Asked Interview Questions

**Q: What is middleware in Express?**

Middleware is a function with access to `req`, `res`, and `next`. It executes between the incoming request and the final response. It is used for logging, authentication, body parsing, error handling, and more. Each middleware calls `next()` to pass control to the next function in the chain.

---

**Q: What happens if `next()` is not called?**

The request hangs indefinitely. The client will not receive any response. Execution stops at the middleware where `next()` was not called.

---

**Q: Why does the order of middleware registration matter?**

Express runs middleware in the order it is registered — top to bottom. If `express.json()` is registered after routes, the request body will be `undefined` inside those routes. Error handlers must always be last because they are meant to catch errors from all the middleware and routes above them.

---

**Q: What is the difference between `app.use()` and route-level middleware?**

`app.use(fn)` applies the middleware globally — it runs for every incoming request. Passing middleware as an argument to a specific route like `app.get('/path', fn, handler)` applies it locally — it only runs when that particular route is matched.

---

**Q: How is error-handling middleware different from normal middleware?**

It has four parameters: `err`, `req`, `res`, `next`. Express recognizes the four-parameter signature and treats the function as an error handler. It is triggered by calling `next(err)` from anywhere in the application and must always be the last registered middleware.

---

**Q: What does `cors` do and why is it needed?**

CORS stands for Cross-Origin Resource Sharing. Browsers enforce a security policy that blocks HTTP requests made from one origin to a different origin. The `cors` middleware adds the appropriate `Access-Control-Allow-Origin` headers to responses, which tells the browser that the server permits such requests.

---

**Q: Why should `helmet` always be used in production?**

Helmet sets several HTTP security headers that protect against common web vulnerabilities — including XSS, clickjacking, and MIME sniffing. It is a single line of code that provides significant security improvements with no performance cost.

---

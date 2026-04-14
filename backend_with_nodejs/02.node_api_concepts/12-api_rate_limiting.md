# API Rate Limiting 

>  **Topic:** Preventing API abuse with `express-rate-limit` | **Database:** MongoDB + Mongoose | **Architecture:** MVC Folder Structure

---

## What Is Rate Limiting?

Imagine you have a coffee shop. You can serve 100 customers an hour. If 10,000 people storm in at once, your shop collapses. You'd put a bouncer at the door — "only 100 people per hour, others wait."

**Rate limiting is that bouncer for your API.**

It controls how many requests a single client (identified by IP address) can make to your server within a given time window. Once they exceed the limit, the server rejects further requests until the window resets.

---

## Why Is Rate Limiting Important?

Without rate limiting, your API is wide open to abuse:

| Threat | What Happens Without Rate Limiting |
|---|---|
| **Brute-force attack** | A hacker tries 100,000 password combinations on your `/login` route |
| **DDoS (flooding)** | A bot sends 50,000 requests per second and crashes your server |
| **Credential stuffing** | Attacker tries stolen username/password pairs from other breaches |
| **Resource exhaustion** | One heavy user consumes all server memory, blocking everyone else |
| **Scraping** | A bot reads your entire database through your public API in seconds |

With rate limiting:
- After **5 failed login attempts**, the attacker is locked out for 15 minutes
- After **100 requests in 15 minutes**, the bot gets a `429 Too Many Requests` error
- Legitimate users are barely affected — they rarely hit these limits

> **Real-world example:** GitHub limits unauthenticated API calls to 60 per hour. Twitter limits timeline reads. Stripe limits API calls per second. Every serious API uses rate limiting.

---

## How Does `express-rate-limit` Work?

`express-rate-limit` is a middleware package for Express. When a request comes in, it:

1. Identifies the client by their **IP address**
2. Checks how many requests that IP has made in the current window
3. If under the limit → **allows the request through**
4. If over the limit → **rejects with 429** and sends your custom message

It stores the count **in memory** by default (resets when server restarts). For production, you'd connect it to Redis — but memory is fine for learning.

```
Request arrives
      │
      ▼
Is this IP under the limit?
      │
    ┌─┴──────────────────────┐
   YES                       NO
    │                         │
    ▼                         ▼
Pass request through     Return 429 error
to your route handler    "Too many requests"
```

---

## Key Concepts

| Concept | What It Means | Example |
|---|---|---|
| `windowMs` | The time window in milliseconds | `15 * 60 * 1000` = 15 minutes |
| `max` | Max requests allowed per IP in that window | `100` |
| `message` | The response sent when limit is exceeded | Custom JSON object |
| `standardHeaders` | Sends limit info in response headers | `RateLimit-Remaining: 4` |
| **Global limiter** | Applied to every route with `app.use()` | Protects the whole API |
| **Route limiter** | Applied to one specific route only | Extra protection on `/login` |

---

## Global vs Route-Level Limiters

You will create **two** limiters in this task. Understanding the difference is important:

```
All Requests
     │
     ▼
┌─────────────────────────┐
│   Global Limiter        │  ← 100 requests per 15 min (all routes)
│   app.use(globalLimiter)│
└────────────┬────────────┘
             │
        ┌────┴─────────────────────────┐
        │                              │
        ▼                              ▼
   GET /users                    POST /login
   (global limit only)       ┌───────────────────┐
                              │  Login Limiter    │  ← 5 attempts per 15 min
                              │  (extra strict)   │
                              └───────────────────┘
```

The login route has **both** limiters applied — global AND its own strict one. The stricter one (5 max) will kick in first.

---

## Folder Structure

```
task-11-rate-limiting/
│
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   │
│   ├── models/
│   │   └── user.model.js          # User schema
│   │
│   ├── controllers/
│   │   └── user.controller.js     # Register, Login, Get Users logic
│   │
│   ├── routes/
│   │   └── user.routes.js         # Route definitions with limiters attached
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js        # Global error handler
│   │   └── rateLimiter.js         # All rate limiter definitions live here
│   │
│   └── app.js                     # Express setup
│
├── index.js                       # Server start
└── package.json
```

> **Notice:** All rate limiter configurations are in their own file `middlewares/rateLimiter.js`. This keeps them easy to find and adjust — you never have to dig through controller code to change a time window.

---

## Project Setup

### Step 1 — Create your project and initialize it

```bash
mkdir task-11-rate-limiting
cd task-11-rate-limiting
npm init -y
```

### Step 2 — Install the required packages

```bash
npm install express mongoose bcrypt express-rate-limit
```

### Step 3 — Create the folder structure

```bash
mkdir -p src/config src/models src/controllers src/routes src/middlewares
touch src/config/db.js
touch src/models/user.model.js
touch src/controllers/user.controller.js
touch src/routes/user.routes.js
touch src/middlewares/rateLimiter.js
touch src/middlewares/errorHandler.js
touch src/app.js
touch index.js
```

---

## Writing the Code

### Step 4 — Database Connection (`src/config/db.js`)

```js
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://yourname:yourpassword@cluster0.mongodb.net/task11")
    console.log("✅ Connected to MongoDB")
  } catch (err) {
    console.log("❌ Connection error:", err.message)
    process.exit(1)
  }
}

module.exports = connectDB
```

---

### Step 5 — User Model (`src/models/user.model.js`)

```js
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User
```

---

### Step 6 — Rate Limiters (`src/middlewares/rateLimiter.js`)

This is the most important file in this task. All rate limiter configurations live here and are exported individually so any route can import what it needs.

```js
const rateLimit = require("express-rate-limit")

// ─── Global Limiter ────────────────────────────────────────────────────────
// Applied to every route in the app.
// Allows 100 requests per IP every 15 minutes.
// This prevents general flooding and bot scraping.

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes in milliseconds
  max: 100,                    // max requests per IP in that window
  standardHeaders: true,       // sends RateLimit-* headers in the response
  legacyHeaders: false,        // disables the old X-RateLimit-* headers
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
})

// ─── Login Limiter ─────────────────────────────────────────────────────────
// Applied ONLY to the /login route.
// Allows only 5 attempts per IP every 15 minutes.
// This is specifically designed to stop brute-force password attacks.
// Even if an attacker has the correct email, they get locked out after 5 wrong passwords.

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // same 15-minute window
  max: 5,                      // but only 5 attempts allowed
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
})

module.exports = { globalLimiter, loginLimiter }
```

**Breaking down `windowMs: 15 * 60 * 1000`:**

```
15 * 60 * 1000
│    │    │
│    │    └── 1000ms = 1 second
│    └──────── 60 seconds = 1 minute
└───────────── 15 minutes
= 900,000 milliseconds total
```

JavaScript timers always work in milliseconds, so this is just a readable way to write "15 minutes" without memorizing `900000`.

**What does `standardHeaders: true` do?**

When this is enabled, every response includes headers telling the client about their rate limit status:

```
RateLimit-Limit: 5          ← max allowed
RateLimit-Remaining: 3      ← how many left in this window
RateLimit-Reset: 1700000000 ← Unix timestamp when the window resets
```

This is useful because good API clients (like mobile apps) can read these headers and slow themselves down before hitting the limit — instead of waiting for a `429` error.

---

### Step 7 — User Controller (`src/controllers/user.controller.js`)

```js
const bcrypt = require("bcrypt")
const User = require("../models/user.model")

// POST /register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" })
    }

    // Never store plain text passwords — always hash first
    // 10 is the "salt rounds" — higher = more secure but slower
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" })
    }

    // bcrypt.compare hashes the incoming password and checks it against the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Incorrect password" })
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /users
const getAllUsers = async (req, res) => {
  try {
    // .select("-password") excludes the password field from the response
    const users = await User.find().select("-password")
    res.status(200).json({ success: true, count: users.length, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { register, login, getAllUsers }
```

---

### Step 8 — User Routes (`src/routes/user.routes.js`)

This is where rate limiters are **attached to routes**. Pass the limiter as a middleware argument before the controller function.

```js
const express = require("express")
const router = express.Router()

const { register, login, getAllUsers } = require("../controllers/user.controller")
const { loginLimiter } = require("../middlewares/rateLimiter")

// No extra limiter — global limiter from app.js already covers this
router.post("/register", register)

// loginLimiter runs FIRST — if limit exceeded, request never reaches the login controller
router.post("/login", loginLimiter, login)

// No extra limiter needed for reading users
router.get("/", getAllUsers)

module.exports = router
```

> **How does `loginLimiter` as a second argument work?**
>
> Express routes accept multiple middleware functions before the final handler:
> ```
> router.post("/login",  loginLimiter,  login)
>                             │            │
>                         runs first    runs second (only if limiter allows)
> ```
> If `loginLimiter` blocks the request, `login` never runs. The limiter sends the `429` response and the chain stops.

---

### Step 9 — Global Error Handler (`src/middlewares/errorHandler.js`)

```js
const errorHandler = (err, req, res, next) => {
  console.error("🔥 Global error caught:", err.message)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  })
}

module.exports = errorHandler
```

---

### Step 10 — App Setup (`src/app.js`)

```js
const express = require("express")
const { globalLimiter } = require("./middlewares/rateLimiter")
const userRoutes = require("./routes/user.routes")
const errorHandler = require("./middlewares/errorHandler")

const app = express()
app.use(express.json())

// Global limiter — applies to ALL routes below this line
app.use(globalLimiter)

// Routes
app.use("/users", userRoutes)

// Catch-all for unknown routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
})

// Global error handler — always last
app.use(errorHandler)

module.exports = app
```

> **Why does `app.use(globalLimiter)` go before routes?**
>
> Express executes middleware in the order it is registered. If the global limiter is placed after your routes, it will never run — the routes will already have handled the request. Always register `app.use(globalLimiter)` **before** `app.use("/users", ...)`.

---

### Step 11 — Start the Server (`index.js`)

```js
const app = require("./src/app")
const connectDB = require("./src/config/db")

const PORT = 3000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  })
})
```

---

## How to Run

```bash
node index.js
```

---

## How to Test

### 1. Register a user

```
POST http://localhost:3000/users/register
Body: { "name": "Alice", "email": "alice@email.com", "password": "secret123" }
```

### 2. Test the login rate limiter — send a wrong password 6 times in a row

```
POST http://localhost:3000/users/login
Body: { "email": "alice@email.com", "password": "wrongpassword" }
```

After the **5th attempt**, you will receive:

```json
{
  "success": false,
  "message": "Too many login attempts. Please try again after 15 minutes."
}
```

With HTTP status: **`429 Too Many Requests`**

### 3. Check the response headers in Postman

After each login attempt, look at the **Headers** tab in Postman:

```
RateLimit-Limit: 5
RateLimit-Remaining: 3     ← counts down with each attempt
RateLimit-Reset: 1700000000
```

### 4. Full test matrix

| Request | Expected Result |
|---|---|
| `POST /users/register` with all fields | `201` — account created |
| `POST /users/register` with missing fields | `400` — validation error |
| `POST /users/register` with duplicate email | `400` — already registered |
| `POST /users/login` with correct credentials | `200` — login successful |
| `POST /users/login` with wrong password | `401` — incorrect password |
| `POST /users/login` wrong password × 6 times | `429` — rate limit exceeded |
| `GET /users` | `200` — list of users (no passwords) |

---

## What Happens to the Counter When You Restart the Server?

Since `express-rate-limit` stores counts **in memory** by default, restarting the server resets all counters. This is fine for development.

In production, you would connect it to a persistent store like **Redis** so the counter survives restarts and works across multiple server instances. That's an advanced topic — for now, memory is perfect.

---

## Responsibility of Each File

| File | Responsibility |
|---|---|
| `src/config/db.js` | Connect to MongoDB |
| `src/models/user.model.js` | Define user data shape |
| `src/controllers/user.controller.js` | Register, login, get users logic |
| `src/routes/user.routes.js` | Map URLs + attach route-level limiters |
| `src/middlewares/rateLimiter.js` | All rate limiter configurations |
| `src/middlewares/errorHandler.js` | Catch unhandled errors |
| `src/app.js` | Wire everything, apply global limiter |
| `index.js` | Start the server |

---

## Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Login successful |
| `201` | Created — Account registered |
| `400` | Bad Request — Missing or duplicate fields |
| `401` | Unauthorized — Wrong password |
| `404` | Not Found — No account with that email |
| `429` | Too Many Requests — Rate limit exceeded |
| `500` | Server Error — Something broke |

---

## ✅ What You Learned

- What rate limiting is and **why every API needs it**
- What real threats it protects against (brute-force, DDoS, scraping)
- How `express-rate-limit` tracks requests by IP address
- How `windowMs` and `max` control the limit window
- The difference between a **global limiter** and a **route-level limiter**
- How to pass a limiter as middleware directly inside a route definition
- What `standardHeaders: true` does and how clients can read rate limit headers
- How to organise limiters in their own dedicated middleware file

#  Logging with Morgan 

> **Topic:** Request logging with `morgan` | **Database:** MongoDB + Mongoose | **Architecture:** MVC Folder Structure

---

## What Is Logging?

Logging means recording what happens inside your server — every request that comes in, every error that occurs, and exactly when it happened.

Think of it like a CCTV camera for your API. When something breaks, you rewind the footage and see exactly what happened, which route was called, what the response was, and how long it took.

**Without logging**, when something breaks you are completely blind:
- You don't know which route was called
- You don't know what time it happened
- You don't know if it was a client mistake or a server crash
- You have no history to trace back through

**With logging**, your terminal becomes a live feed:
```
GET /users 200 5.123 ms
POST /users/login 401 3.211 ms
GET /users/badid 500 2.543 ms
```

You can see every request, its result, and how fast your server responded — in real time.

---

## What Is Morgan?

Morgan is the most popular HTTP request logger for Express. It is a middleware package — meaning you plug it in once with `app.use(morgan("dev"))` and it automatically logs **every single request** that hits your server from that point on.

You do not have to write any logging code inside your routes. Morgan sits between the incoming request and your route handler, records the details, and prints them to the terminal before passing the request forward.

```
Request comes in
      │
      ▼
app.use(morgan("dev"))    ← logs: GET /users 200 5ms
      │
      ▼
your route handler runs
```

> **Morgan only logs HTTP requests.** It does not log your custom errors or application messages. For that, you write a simple custom logger — which you will also do in this task.

---

## Morgan Log Formats

Morgan has five built-in formats. You pass the format name as a string when setting it up:

| Format | What It Prints | Best Used For |
|---|---|---|
| `dev` | `GET /users 200 5.123 ms` | Development — colourful, easy to read |
| `tiny` | `GET /users 200 - 5ms` | Minimal, clean output |
| `common` | IP + date + method + URL + status | Basic production logs |
| `combined` | Everything — IP, date, browser, referrer | Full production logs |
| `short` | Shorter than combined, longer than tiny | Balanced production |

For learning and development, always use **`dev`**. It is coloured by status code so you can spot errors at a glance.

---

## What Does `dev` Format Look Like?

```
GET    /users          200   5.123 ms
POST   /users/login    401   3.211 ms
GET    /users/badid    500   2.543 ms
DELETE /users/64f3...  200   6.891 ms
```

Morgan's `dev` format colours the status codes in your terminal:

| Colour | Status Code Range | Meaning |
|---|---|---|
| 🟢 Green | `2xx` | Success |
| 🟡 Yellow | `3xx` | Redirect |
| 🔴 Red | `4xx` | Client error |
| 🔴 Red | `5xx` | Server error |

This means you can scan a busy terminal and immediately spot which requests are failing — without reading every line carefully.

---

## Custom Morgan Format

Besides the five built-ins, you can define your own format using **tokens**. Tokens are placeholders that Morgan replaces with real values from each request:

| Token | What It Prints |
|---|---|
| `:method` | `GET`, `POST`, `DELETE` etc. |
| `:url` | `/users`, `/users/login` etc. |
| `:status` | `200`, `404`, `500` etc. |
| `:response-time` | Time in milliseconds |
| `:date[iso]` | Timestamp like `2024-11-10T10:20:35.000Z` |
| `:res[content-length]` | Size of the response in bytes |

Example custom format:

```js
const customFormat = "[:date[iso]] :method :url :status :response-time ms"
app.use(morgan(customFormat))
```

Output:
```
[2024-11-10T10:20:35.000Z] GET /users 200 5.123 ms
[2024-11-10T10:20:40.000Z] POST /users/login 401 3.211 ms
```

This is useful when you want timestamps included alongside every request log.

---

## Custom Error Logger

Morgan handles request logging automatically. But when a server-side error happens inside your `catch` block, you want to log that too — with a timestamp and the route where it occurred.

You write a simple function for this:

```js
const logError = (route, error) => {
  const timestamp = new Date().toISOString()
  console.error(`[ERROR] ${timestamp} | Route: ${route} | Message: ${error.message}`)
}
```

**What `new Date().toISOString()` produces:**
```
"2024-11-10T10:20:35.123Z"
```

This is a standard universal timestamp. It is always the same format regardless of what country the server is in — making logs consistent and sortable.

You call it inside your `catch` blocks like this:
```js
catch (error) {
  logError("GET /users", error)
  res.status(500).json({ success: false, message: error.message })
}
```

Terminal output when an error occurs:
```
[ERROR] 2024-11-10T10:20:35.000Z | Route: GET /users/:id | Message: Cast to ObjectId failed
```

---

## Folder Structure

```
task-15-logging/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   └── user.model.js
│   │
│   ├── controllers/
│   │   └── user.controller.js
│   │
│   ├── routes/
│   │   └── user.routes.js
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── logger.js              # morgan setup + custom error logger
│   │
│   └── app.js
│
├── index.js
└── package.json
```

> **Notice:** Morgan setup and the custom error logger both live in `src/middlewares/logger.js`. Logging is a cross-cutting concern — it belongs in middlewares, not scattered inside controllers.

---

## Project Setup

### Step 1 — Create your project and initialize it

```bash
mkdir task-15-logging
cd task-15-logging
npm init -y
```

### Step 2 — Install the required packages

```bash
npm install express mongoose morgan
```

### Step 3 — Create the folder structure

```bash
mkdir -p src/config src/models src/controllers src/routes src/middlewares
touch src/config/db.js
touch src/models/user.model.js
touch src/controllers/user.controller.js
touch src/routes/user.routes.js
touch src/middlewares/logger.js
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
    await mongoose.connect("mongodb+srv://yourname:yourpassword@cluster0.mongodb.net/task15")
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
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  city:  { type: String },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User
```

---

### Step 6 — Logger Middleware (`src/middlewares/logger.js`)

This file exports two things — the morgan middleware ready to use, and the custom error logger function.

```js
const morgan = require("morgan")

// Morgan request logger — logs every HTTP request automatically
// "dev" format: GET /users 200 5.123 ms  (coloured by status code)
const requestLogger = morgan("dev")

// Custom error logger — call this inside catch blocks
// Prints a timestamped error message to the terminal
const logError = (route, error) => {
  const timestamp = new Date().toISOString()
  console.error(`[ERROR] ${timestamp} | Route: ${route} | Message: ${error.message}`)
}

module.exports = { requestLogger, logError }
```

---

### Step 7 — User Controller (`src/controllers/user.controller.js`)

Notice how `logError` is imported and called inside every `catch` block. Morgan logs the request automatically — `logError` logs the specific error details.

```js
const User = require("../models/user.model")
const { logError } = require("../middlewares/logger")

// GET /users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({ success: true, count: users.length, data: users })
  } catch (error) {
    logError("GET /users", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    logError("GET /users/:id", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /users
const createUser = async (req, res) => {
  try {
    const { name, email, city } = req.body

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" })
    }

    const user = await User.create({ name, email, city })
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    logError("POST /users", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }
    res.status(200).json({ success: true, message: "User deleted" })
  } catch (error) {
    logError("DELETE /users/:id", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getAllUsers, getUserById, createUser, deleteUser }
```

---

### Step 8 — User Routes (`src/routes/user.routes.js`)

```js
const express = require("express")
const router = express.Router()
const { getAllUsers, getUserById, createUser, deleteUser } = require("../controllers/user.controller")

router.get("/",      getAllUsers)
router.get("/:id",   getUserById)
router.post("/",     createUser)
router.delete("/:id", deleteUser)

module.exports = router
```

---

### Step 9 — Global Error Handler (`src/middlewares/errorHandler.js`)

The global error handler also uses `logError` so any error passed via `next(error)` gets logged too.

```js
const { logError } = require("./logger")

const errorHandler = (err, req, res, next) => {
  logError(`${req.method} ${req.originalUrl}`, err)

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
const { requestLogger } = require("./middlewares/logger")
const userRoutes = require("./routes/user.routes")
const errorHandler = require("./middlewares/errorHandler")

const app = express()
app.use(express.json())

// Morgan logs every request — must be before routes
app.use(requestLogger)

app.use("/users", userRoutes)

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
})

app.use(errorHandler)

module.exports = app
```

> **Why must `requestLogger` go before routes?** Morgan is middleware — it runs in registration order. If you place it after routes, the routes handle and respond to requests before Morgan ever sees them. Put it at the top so it intercepts every request first.

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

### Step 1 — Create a user

```
POST http://localhost:3000/users
Body: { "name": "Alice", "email": "alice@email.com", "city": "Mumbai" }
```

Watch your terminal — Morgan will immediately print:
```
POST /users 201 12.543 ms
```

### Step 2 — Get all users

```
GET http://localhost:3000/users
```

Terminal:
```
GET /users 200 5.123 ms
```

### Step 3 — Trigger a 500 error (bad ID format)

```
GET http://localhost:3000/users/badid123
```

Terminal will show two lines — Morgan's request log AND your custom error log:
```
GET /users/badid123 500 2.543 ms
[ERROR] 2024-11-10T10:20:35.000Z | Route: GET /users/:id | Message: Cast to ObjectId failed
```

This is the key difference — **Morgan logs the request**, **logError logs the reason**.

### Full Test Matrix

| Request | Terminal Output |
|---|---|
| `POST /users` with valid body | `POST /users 201 12ms` |
| `POST /users` with missing fields | `POST /users 400 2ms` |
| `GET /users` | `GET /users 200 5ms` |
| `GET /users/VALID_ID` | `GET /users/... 200 4ms` |
| `GET /users/badid123` | `GET /users/badid123 500 2ms` + `[ERROR]` line |
| `DELETE /users/VALID_ID` | `DELETE /users/... 200 6ms` |

---

## Responsibility of Each File

| File | Responsibility |
|---|---|
| `src/config/db.js` | Connect to MongoDB |
| `src/models/user.model.js` | Define user data shape |
| `src/controllers/user.controller.js` | Route logic + call `logError` on errors |
| `src/routes/user.routes.js` | Map URLs to controller functions |
| `src/middlewares/logger.js` | Morgan setup + custom error logger |
| `src/middlewares/errorHandler.js` | Catch unhandled errors + log them |
| `src/app.js` | Apply morgan globally before routes |
| `index.js` | Start the server |

---

## Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Request successful |
| `201` | Created — New user added |
| `400` | Bad Request — Missing required fields |
| `404` | Not Found — User not found |
| `500` | Server Error — Something broke |

---

## ✅ What You Learned

- What logging is and why every API needs it
- What Morgan is and how it works as middleware
- The five built-in Morgan formats and when to use each
- How the `dev` format colours status codes in the terminal
- How to build a custom Morgan format using tokens
- How to write a custom error logger with timestamps
- The difference between Morgan's request log and a custom error log
- Why Morgan must be registered before routes in Express

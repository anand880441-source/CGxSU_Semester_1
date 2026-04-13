#  Error Handling

>  **Topic:** Try-catch, status codes, and global error handling | **Database:** MongoDB + Mongoose | **Architecture:** MVC Folder Structure

---

## What Is Error Handling?

When something goes wrong in your API — a user is not found, invalid data is sent, or the database crashes — you must send back a clear, helpful error response instead of crashing or sending nothing.

Good error handling means:
- The server **never crashes** unexpectedly
- The client **always gets a clear message** about what went wrong
- The **correct HTTP status code** is used
- Error responses are **consistent in shape** across the entire API

---

## The Three Types of Errors

To handle errors well, you first need to understand *what kind* of error happened. We generally group errors into three main buckets based on HTTP Status Codes:

### 1. `400 Bad Request` (The Client Messed Up)
This means the client (frontend, mobile app, or user in Postman) sent data that the server cannot process. The server is working perfectly, but it's rejecting the bad input.

*   **Analogy:** Trying to use a fake ID at a club, or putting letters into an ATM pin pad.
*   **Examples:**
    *   Missing a required field (e.g., trying to register without an email).
    *   Sending invalid data formats (e.g., `{ "age": "twenty" }` instead of `{ "age": 20 }`).
    *   Validation failures (password is too short).
*   **How to Handle:** You must explicitly check the data and return a `400` status with a message telling the client *exactly* what fields they need to fix.

### 2. `404 Not Found` (The Thing Doesn't Exist)
The client sent a valid request, but the server couldn't find the requested resource or URL.

*   **Analogy:** Looking for a book at the library, but someone checked it out, or you typed the wrong web address.
*   **Examples:**
    *   Requesting a specific user that doesn't exist: `GET /users/99999`.
    *   Hitting a route you haven't built: `GET /apple`.
    *   `findOne()` or `findById()` in MongoDB returns `null`.
*   **How to Handle:** Return a `404` status with a clear message like "User not found" or "Route not found."

### 3. `500 Internal Server Error` (The Server Broke)
The client sent a perfect request, but something went catastrophically wrong on your server's side.

*   **Analogy:** You order food perfectly, but the restaurant's kitchen catches fire.
*   **Examples:**
    *   The database is offline or the connection dropped.
    *   A syntax error in your code (e.g., trying to read a property of `undefined`).
    *   A third-party API you depend on is down.
*   **How to Handle:** These are usually caught in the `catch` block of your `try...catch`. You should log the technical error for yourself (so you can fix it), but return a generic `500` "Server Error" message to the client (don't leak sensitive database error details to users).

> **A Note on Auth Errors (401 & 403):** You'll learn these later, but `401 Unauthorized` means "you need to log in first", and `403 Forbidden` means "you are logged in, but you aren't allowed to do this (like an admin action)".

## Folder Structure

This task uses the MVC (Model-View-Controller) structure. Every file has **one responsibility**.

```
my-app/
│
├── src/
│   ├── config/               # DB connection
│   │   └── db.js
│   │
│   ├── models/               # Schema / Database logic
│   │   └── user.model.js
│   │
│   ├── controllers/          # Business logic (all your try-catch lives here)
│   │   └── user.controller.js
│   │
│   ├── routes/               # API route definitions
│   │   └── user.routes.js
│   │
│   ├── middlewares/          # Global error handler lives here
│   │   └── errorHandler.js
│   │
│   └── app.js                # Express setup
│
├── index.js                  # Server start
└── package.json
```

> **Why this structure?** As your app grows, keeping all code in a single `index.js` becomes unmanageable. Splitting into folders makes each part easier to find, test, and maintain independently.

---

## Project Setup

### Step 1 — Create your project and initialize it

```bash
mkdir task-08-error-handling
cd task-08-error-handling
npm init -y
```

### Step 2 — Install the required packages

```bash
npm install express mongoose
```

### Step 3 — Create the folder structure

```bash
mkdir -p src/config src/models src/controllers src/routes src/middlewares
touch src/config/db.js
touch src/models/user.model.js
touch src/controllers/user.controller.js
touch src/routes/user.routes.js
touch src/middlewares/errorHandler.js
touch src/app.js
touch index.js
```

---

## Writing the Code

### Step 4 — Database Connection (`src/config/db.js`)

This file handles connecting to MongoDB. Keeping it separate means you only ever change DB config in one place.

```js
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://yourname:yourpassword@cluster0.mongodb.net/task08")
    console.log("✅ Connected to MongoDB")
  } catch (err) {
    console.log("❌ Connection error:", err.message)
    process.exit(1)  // Stop the server if DB fails — no point running without it
  }
}

module.exports = connectDB
```

> **Why `process.exit(1)`?** If the database can't connect, the whole server is useless. Exiting immediately is better than letting the server start and then fail silently on every request.

---

### Step 5 — User Model (`src/models/user.model.js`)

The model defines the shape of your data and enforces rules like `required`.

```js
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true },
  age:   { type: Number },
}, { timestamps: true })  // adds createdAt and updatedAt automatically

const User = mongoose.model("User", userSchema)

module.exports = User
```

> **Note:** `{ timestamps: true }` is a handy option that automatically adds `createdAt` and `updatedAt` fields to every document — very useful for debugging.

---

### Step 6 — User Controller (`src/controllers/user.controller.js`)

The controller contains your **business logic**. This is where all `try-catch` blocks live.

Each function handles one action: get all, get one, create, delete.

```js
const User = require("../models/user.model")

// GET /users — Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// GET /users/:id — Get one user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    // This catches invalid ID formats (e.g. "abc123" is not a valid MongoDB ObjectId)
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// POST /users — Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body

    // Manual 400 check — client sent incomplete data
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      })
    }

    const user = await User.create({ name, email })
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// DELETE /users/:id — Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    // findByIdAndDelete returns null if nothing matched
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, nothing was deleted",
      })
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

// GET /seed — Add test data
const seedUsers = async (req, res) => {
  try {
    await User.deleteMany()
    await User.create([
      { name: "Alice", email: "alice@email.com", age: 25 },
      { name: "Bob",   email: "bob@email.com",   age: 30 },
    ])
    res.status(200).json({ success: true, message: "✅ Test data added!" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

module.exports = { getAllUsers, getUserById, createUser, deleteUser, seedUsers }
```

---

### Step 7 — User Routes (`src/routes/user.routes.js`)

Routes only define **which URL maps to which controller function**. No logic here.

```js
const express = require("express")
const router = express.Router()

const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  seedUsers,
} = require("../controllers/user.controller")

router.get("/seed",    seedUsers)
router.get("/",        getAllUsers)
router.get("/:id",     getUserById)
router.post("/",       createUser)
router.delete("/:id",  deleteUser)

module.exports = router
```

> **Tip:** Always place `/seed` above `/:id`. If you put `/:id` first, Express will treat `"seed"` as an ID and route it to the wrong controller.

---

### Step 8 — Global Error Handler (`src/middlewares/errorHandler.js`)

This is a special Express middleware with **four parameters** `(err, req, res, next)`. Express recognizes it as an error handler because of the four parameters — this is a required signature.

It catches any error passed using `next(error)` from any route or controller anywhere in the app.

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

> **Why have this?** Even if you forget a `try-catch` somewhere, or a third-party library throws unexpectedly, the global handler is your safety net. It ensures the server never crashes and always returns a proper JSON error.

---

### Step 9 — Catch-All 404 Route & App Setup (`src/app.js`)

```js
const express = require("express")
const userRoutes = require("./routes/user.routes")
const errorHandler = require("./middlewares/errorHandler")

const app = express()
app.use(express.json())

// Mount routes
app.use("/users", userRoutes)

// Catch-all for unknown routes — must come AFTER all real routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
})

// Global error handler — must be LAST (after routes AND catch-all)
app.use(errorHandler)

module.exports = app
```

> **Order matters!** Express reads middleware from top to bottom. The catch-all `*` must be below your real routes or it will intercept every request. The global error handler must be at the very bottom.

---

### Step 10 — Start the Server (`index.js`)

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

> **Why connect first, then listen?** You don't want the server accepting requests before the database is ready. Calling `connectDB()` first ensures everything is in order before traffic arrives.

---

## How to Run

```bash
node index.js
```

---

## How to Test

First, seed some test data by visiting: `http://localhost:3000/users/seed`

| Request | Expected Result |
|---|---|
| `GET /users` | `200` — list of all users |
| `GET /users/VALID_ID` | `200` — single user object |
| `GET /users/invalidid123` | `500` — bad ObjectId format |
| `GET /users/000000000000000000000000` | `404` — valid format, no match |
| `POST /users` with empty body `{}` | `400` — missing name and email |
| `POST /users` with `{ "name": "Diana", "email": "d@email.com" }` | `201` — new user created |
| `DELETE /users/VALID_ID` | `200` — deleted successfully |
| `GET /anything-random` | `404` — no such route |

---

## Standard Response Shape

Always return errors in the **same shape** so the frontend knows what to expect.

**Error response:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Success response:**
```json
{
  "success": true,
  "data": { ... }
}
```

Consistency makes your API predictable and easy to integrate with.

---

## Where Does Each Error Type Live?

| Situation | Error Type | Where It's Handled |
|---|---|---|
| Missing name or email in body | `400 Bad Request` | Controller — manual `if` check |
| Valid ObjectId but no user found | `404 Not Found` | Controller — `if (!user)` check |
| Invalid ObjectId format (e.g. `abc`) | `500 Server Error` | Controller — `catch` block |
| Database crashes | `500 Server Error` | Controller — `catch` block |
| Unknown URL (e.g. `/blah`) | `404 Not Found` | App — catch-all `*` route |
| Unhandled error passed via `next(err)` | `500 Server Error` | Middleware — global error handler |

---

## Responsibility of Each File

| File | Responsibility |
|---|---|
| `src/config/db.js` | Connect to MongoDB once |
| `src/models/user.model.js` | Define data shape and rules |
| `src/controllers/user.controller.js` | Business logic + all `try-catch` blocks |
| `src/routes/user.routes.js` | Map URLs to controller functions |
| `src/middlewares/errorHandler.js` | Catch anything that falls through |
| `src/app.js` | Wire everything together |
| `index.js` | Start the server |

---

## Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Request succeeded |
| `201` | Created — New resource was created |
| `400` | Bad Request — Client sent wrong or missing data |
| `404` | Not Found — Resource or route doesn't exist |
| `500` | Server Error — Something broke on the server |

---

## ✅ What You Learned

- How `try-catch` prevents server crashes in every route
- The difference between `400`, `404`, and `500` errors — and when to use each
- How to manually return a `404` when a resource isn't found
- How to write a catch-all `*` route for unknown URLs
- How a **global error handler middleware** (4 params) works in Express
- How to **split code across files** using the MVC folder structure
- Why **order of middleware matters** in Express

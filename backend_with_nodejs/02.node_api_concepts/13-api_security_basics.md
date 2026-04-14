# API Security Basics 

> **Topic:** Securing your API with `helmet` | **Database:** MongoDB + Mongoose | **Architecture:** MVC Folder Structure

---

## What Is API Security?

When you build an API, by default Express sends almost no protection in its responses. It even tells attackers exactly what framework you are using:

```
X-Powered-By: Express
```

An attacker sees this and knows your exact stack. They can search for known exploits and target your server.

**Helmet fixes this with one line of code.** It removes `X-Powered-By` and adds security headers to every response automatically.

---

## What Is Helmet?

Helmet is an npm package that adds **HTTP security headers** to every response your server sends.

HTTP headers are small pieces of information sent along with every response. Security headers tell the browser how to handle your content safely — for example, "never load this page inside another website's iframe" or "always use HTTPS."

Without Helmet, Express sends no such instructions. The browser is left to make its own decisions, which attackers can exploit.

> One line — `app.use(helmet())` — and your API is protected.

---

## What Headers Does Helmet Add?

After calling `app.use(helmet())`, every response will include these headers:

| Header | What It Does |
|---|---|
| `X-Frame-Options: SAMEORIGIN` | Prevents your page from being loaded inside an iframe on another website |
| `X-Content-Type-Options: nosniff` | Stops the browser from guessing file types — it must use what the server says |
| `Content-Security-Policy` | Controls which scripts and resources the browser is allowed to load |
| `Strict-Transport-Security` | Forces the browser to always use HTTPS instead of HTTP |
| `X-DNS-Prefetch-Control: off` | Stops the browser from silently pre-loading domains in the background |

And most importantly — **`X-Powered-By: Express` is removed.**

---

## Without Helmet vs With Helmet

**Without Helmet** — open Postman, check the Headers tab on any response:
```
X-Powered-By: Express
Content-Type: application/json
```

**With Helmet** — the same response now shows:
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=15552000
```

`X-Powered-By` is gone. Security headers are in.

---

## Folder Structure

```
task-14-security/
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
│   │   └── errorHandler.js
│   │
│   └── app.js
│
├── index.js
└── package.json
```

---

## Project Setup

### Step 1 — Create your project and initialize it

```bash
mkdir task-14-security
cd task-14-security
npm init -y
```

### Step 2 — Install the required packages

```bash
npm install express mongoose helmet bcrypt
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

```js
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://yourname:yourpassword@cluster0.mongodb.net/task14")
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
})

const User = mongoose.model("User", userSchema)

module.exports = User
```

---

### Step 6 — User Controller (`src/controllers/user.controller.js`)

```js
const bcrypt = require("bcrypt")
const User = require("../models/user.model")

// POST /users/register
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

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    res.status(201).json({
      success: true,
      message: "User created",
      data: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
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
    const users = await User.find().select("-password")
    res.status(200).json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { register, login, getAllUsers }
```

---

### Step 7 — User Routes (`src/routes/user.routes.js`)

```js
const express = require("express")
const router = express.Router()
const { register, login, getAllUsers } = require("../controllers/user.controller")

router.post("/register", register)
router.post("/login",    login)
router.get("/",          getAllUsers)

module.exports = router
```

---

### Step 8 — Global Error Handler (`src/middlewares/errorHandler.js`)

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

### Step 9 — App Setup (`src/app.js`)

This is the most important step in this task. Notice where `helmet()` is placed — **before routes**.

```js
const express = require("express")
const helmet = require("helmet")
const userRoutes = require("./routes/user.routes")
const errorHandler = require("./middlewares/errorHandler")

const app = express()
app.use(express.json())

// Helmet adds security headers to every response.
// It must go BEFORE routes so all responses are protected.
app.use(helmet())

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

> **Why before routes?** Express runs middleware top to bottom. If helmet is placed after routes, responses leave the server before helmet can add any headers. Always register `app.use(helmet())` at the top.

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

---

## How to Run

```bash
node index.js
```

---

## How to Test

### Step 1 — Register a user

```
POST http://localhost:3000/users/register
Body: { "name": "Alice", "email": "alice@email.com", "password": "secret123" }
```

### Step 2 — See Helmet working

After any request, open the **Headers** tab in Postman. You will see the security headers helmet added:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=15552000
```

And `X-Powered-By` is **not there** — helmet removed it.

### Step 3 — Login

```
POST http://localhost:3000/users/login
Body: { "email": "alice@email.com", "password": "secret123" }
```

---

## Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Request successful |
| `201` | Created — User registered |
| `400` | Bad Request — Missing or duplicate fields |
| `401` | Unauthorized — Invalid credentials |
| `500` | Server Error — Something broke |

---

## ✅ What You Learned

- Why `X-Powered-By: Express` is a security risk
- What HTTP security headers are and why they matter
- How `helmet()` adds 14+ security headers with one line
- What each helmet header protects against
- Why helmet must be registered before routes in Express
- How to verify helmet is working using Postman's Headers tab

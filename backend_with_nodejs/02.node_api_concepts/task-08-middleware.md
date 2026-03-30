# Task 06 — Basic Middleware 

**Topic:** Understanding and writing Express Middleware | **Database:** MongoDB + Mongoose

---

##  What Is Middleware?

Middleware is a function that runs **between** the request arriving and the response being sent. Think of it like a security guard at a door — every person (request) must pass through the guard before entering the building (route handler).

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

Every middleware function receives three things:
- `req` — the incoming request
- `res` — the response we will send
- `next` — a function that says "I'm done, pass to the next step"

If you forget to call `next()`, the request gets stuck and never reaches your route.

---

##  Key Concepts

| Concept | What it means |
|---|---|
| `app.use()` | Registers middleware that runs on ALL routes |
| `next()` | Passes control to the next middleware or route |
| Order matters | Middleware runs in the order you write it |
| Application middleware | Runs for every single request |

---

##  Project Setup

### Step 1 — Create your project folder and initialize it

```bash
mkdir task-06-middleware
cd task-06-middleware
npm init -y
```

### Step 2 — Install the required packages

```bash
npm install express mongoose
```

### Step 3 — Create your main file

```bash
touch index.js
```

---

##  Writing the Code

### Step 4 — Import packages and create the Express app

```js
const express = require("express")
const mongoose = require("mongoose")

const app = express()
app.use(express.json())
```

---

### Step 5 — Connect to MongoDB

```js
mongoose.connect("mongodb+srv://yourname:yourpassword@cluster0.mongodb.net/task06")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Connection error:", err))
```

---

### Step 6 — Create Schema and Model

```js
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  city: String,
})
const User = mongoose.model("User", userSchema)
```

---

### Step 7 — Write a Logger Middleware

This middleware runs before every route. It prints the request method and URL to the terminal. Notice it calls `next()` at the end — this is required to move to the next step.

```js
const requestLogger = (req, res, next) => {
  console.log(`[${req.method}] ${req.url}`)
  next()
}
```

---

### Step 8 — Write a Timestamp Middleware

This middleware logs the exact time each request arrived. Both middlewares will run one after the other for every request.

```js
const timestampLogger = (req, res, next) => {
  const time = new Date().toLocaleTimeString()
  console.log(`Request received at: ${time}`)
  next()
}
```

---

### Step 9 — Register the Middleware with `app.use()`

`app.use()` tells Express to run these functions for EVERY request, no matter which route is called. The order here matters — they run top to bottom.

```js
app.use(requestLogger)
app.use(timestampLogger)
```

---

### Step 10 — Write a Route-Level Middleware

This middleware only runs on one specific route — not all routes. We pass it directly as a second argument before the route handler.

```js
const checkCity = (req, res, next) => {
  if (!req.query.city) {
    return res.status(400).json({
      success: false,
      message: "City is required as a query param. Example: ?city=Mumbai"
    })
  }
  next()
}
```

---

### Step 11 — Write the Routes

```js
app.get("/users", async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({ success: true, count: users.length, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

app.get("/users/by-city", checkCity, async (req, res) => {
  try {
    const users = await User.find({ city: req.query.city })
    res.status(200).json({ success: true, count: users.length, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})
```

---

### Step 12 — Seed Route

```js
app.get("/seed", async (req, res) => {
  await User.deleteMany()
  await User.create([
    { name: "Alice", email: "alice@email.com", city: "Mumbai" },
    { name: "Bob", email: "bob@email.com", city: "Delhi" },
    { name: "Charlie", email: "charlie@email.com", city: "Mumbai" },
  ])
  res.json({ message: "Test data added!" })
})
```

---

### Step 13 — Start the Server

```js
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
```

---

##  How to Run

```bash
node index.js
```

Every time you make a request, you will see this in your terminal:
```
[GET] /users
Request received at: 10:20:35 AM
```

---

## 🧪 How to Test

First add test data: `http://localhost:3000/seed`

```
GET  http://localhost:3000/users
GET  http://localhost:3000/users/by-city?city=Mumbai
GET  http://localhost:3000/users/by-city          ← will be blocked by checkCity middleware
POST http://localhost:3000/users
Body: { "name": "Diana", "email": "diana@email.com", "city": "Pune" }
```

Watch your terminal — you will see the logger printing for every request.

---

##  What Happens Without `next()`?

```js
const badMiddleware = (req, res, next) => {
  console.log("I ran!")
  // ❌ forgot next() — request hangs here forever, no response sent
}

const goodMiddleware = (req, res, next) => {
  console.log("I ran!")
  next() // passes to the next middleware or route
}
```

---

##  What You Learned

- What middleware is and why it is useful
- How `req`, `res`, and `next` work in middleware
- How `app.use()` applies middleware to all routes
- How to apply middleware to only one specific route
- Why the order of `app.use()` calls matters

---

##  Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Request successful |
| `201` | Created — New item was created |
| `400` | Bad Request — Missing required data |
| `500` | Server Error — Something broke |

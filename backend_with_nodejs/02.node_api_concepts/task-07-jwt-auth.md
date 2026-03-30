# Task 7 — JWT Authentication 

**Topic:** Creating and verifying JSON Web Tokens | **Database:** MongoDB + Mongoose
---

##  What Is JWT?

After a user logs in, we need a way to let them access protected pages without logging in again on every request. This is what **JWT (JSON Web Token)** solves.

The flow works like this:

```
1. User logs in with email + password
2. Server verifies password, then creates a JWT token
3. Server sends the token back to the user
4. User sends this token with every future request
5. Server checks the token and allows or blocks access
```

The token looks like three parts separated by dots:
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
    HEADER                    PAYLOAD                        SIGNATURE
```

---

##  Key Concepts

| Concept | What it means |
|---|---|
| `jwt.sign()` | Creates a new token containing user data |
| `jwt.verify()` | Checks if a token is valid and not expired |
| `SECRET_KEY` | A secret password used to sign tokens — keep it private |
| `Authorization` header | Where the token is sent: `Bearer <token>` |
| Protected route | A route that requires a valid token to access |

---

##  Project Setup

### Step 1 — Create your project folder and initialize it

```bash
mkdir task-10-jwt-auth
cd task-10-jwt-auth
npm init -y
```

### Step 2 — Install the required packages

```bash
npm install express mongoose bcrypt jsonwebtoken
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
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())
```

---

### Step 5 — Define Your Secret Key

This is the private key used to sign and verify tokens. In a real app, store this in a `.env` file — never hardcode it in production.

```js
const SECRET_KEY = "mysecretkey123"
```

---

### Step 6 — Connect to MongoDB

```js
mongoose.connect("mongodb+srv://yourname:yourpassword@cluster0.mongodb.net/task10")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Connection error:", err))
```

---

### Step 7 — Create User Schema and Model

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
```

---

### Step 8 — Route: Register

Same as Task 09 — hash the password before saving.

```js
app.post("/register", async (req, res) => {
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
      message: "Account created. You can now login.",
      data: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})
```

---

### Step 9 — Route: Login and Return a Token

After verifying the password, we use `jwt.sign()` to create a token. We put the user's ID inside the token payload — this is how we know who the token belongs to later.

```js
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Incorrect password" })
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      SECRET_KEY,
      { expiresIn: "1d" }
    )

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})
```

---

### Step 10 — Write the Auth Middleware

This middleware reads the token from the `Authorization` header, verifies it, and attaches the decoded user info to `req.user`. Any route that uses this middleware becomes a protected route.

The token must be sent in this format:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

```js
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Please login first.",
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again.",
    })
  }
}
```

---

### Step 11 — Protected Route: Get Profile

We pass the `protect` middleware before the route handler. If the token is missing or invalid, the middleware blocks the request and the handler never runs.

```js
app.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    res.status(200).json({
      success: true,
      message: "Here is your profile",
      data: user,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})
```

---

### Step 12 — Start the Server

```js
const PORT = 3000
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
```

---

##  How to Run

```bash
node index.js
```

---

##  How to Test (Step by Step)

**Step 1 — Register:**
```json
POST http://localhost:3000/register
Body: { "name": "Alice", "email": "alice@email.com", "password": "secret123" }
```

**Step 2 — Login (copy the token from the response):**
```json
POST http://localhost:3000/login
Body: { "email": "alice@email.com", "password": "secret123" }
```

**Step 3 — Access Profile WITH token (in Postman, go to Headers tab):**
```
GET http://localhost:3000/profile
Header:  Authorization: Bearer PASTE_YOUR_TOKEN_HERE
```

**Step 4 — Try without token (should be blocked):**
```
GET http://localhost:3000/profile
(no Authorization header)
```

---

## 💡 How `split(" ")[1]` Works

The header value looks like: `"Bearer eyJhbGciOi..."`

```js
"Bearer eyJhbGciOi...".split(" ")
// Result: ["Bearer", "eyJhbGciOi..."]

"Bearer eyJhbGciOi...".split(" ")[1]
// Result: "eyJhbGciOi..."  ← just the token
```

---

## ✅ What You Learned

- What a JWT token is and what it contains
- How `jwt.sign()` creates a token with a payload and expiry
- How `jwt.verify()` validates a token
- How to write an auth middleware (`protect`)
- How to send a token in the Authorization header
- How `req.user` carries the decoded token data into route handlers

---

## 🔢 Status Codes Reference

| Code | Meaning |
|---|---|
| `201` | Created — Registered successfully |
| `200` | OK — Login or profile fetch successful |
| `400` | Bad Request — Missing fields or email taken |
| `401` | Unauthorized — No token, bad token, or wrong password |
| `404` | Not Found — Email not registered |
| `500` | Server Error — Something broke |

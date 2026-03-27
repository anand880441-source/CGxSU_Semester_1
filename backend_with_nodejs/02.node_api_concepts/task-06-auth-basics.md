# Task 06 — Authentication Basics 

**Topic:** Register & Login with bcrypt password hashing | **Database:** MongoDB + Mongoose

---

## What Is Authentication?

Authentication is the process of verifying **who a user is**. The most basic form is:
1. User creates an account with an email and password **(Register)**
2. User proves who they are by entering their password **(Login)**

---

## Why We Never Store Plain Passwords

If you store passwords as plain text like `"mypassword123"` and your database gets hacked, every user's password is exposed.

Instead, we use **hashing** — a one-way transformation:

```
"mypassword123"  →  bcrypt  →  "$2b$10$xK9mN..."
```

- The hash looks like random characters
- You **cannot reverse** a hash back to the original password
- Every time you hash the same password, bcrypt produces a **different** hash (because of "salt")
- To check a password, bcrypt compares it against the stored hash using `bcrypt.compare()`

---

## Key Concepts

| Concept | What it means |
|---|---|
| `bcrypt.hash()` | Converts plain password into a secure hash |
| `bcrypt.compare()` | Checks if a plain password matches a stored hash |
| Salt rounds | How many times the password is processed — `10` is standard |
| Hash | A one-way scrambled version of the password |

---

## Project Setup

### Step 1 — Create your project folder and initialize it

```bash
mkdir task-09-auth-basics
cd task-09-auth-basics
npm init -y
```

### Step 2 — Install the required packages

`bcrypt` is the package we use to hash passwords.

```bash
npm install express mongoose bcrypt
```

### Step 3 — Create your main file

```bash
touch index.js
```

---

## Writing the Code

### Step 4 — Import packages and create the Express app

```js
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const app = express()
app.use(express.json())
```

---

### Step 5 — Connect to MongoDB

```js
mongoose.connect("mongodb+srv://yourname:yourpassword@cluster0.mongodb.net/task09")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Connection error:", err))
```

---

### Step 6 — Create User Schema and Model

Notice the password field is just a `String` — bcrypt will handle the security. We also store `createdAt` automatically.

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)
```

---

### Step 7 — Route: Register a New User

The key step here is `bcrypt.hash(password, 10)`. The `10` is the number of "salt rounds" — how hard the hashing process is. Higher = more secure but slower. `10` is the industry standard for most apps.

```js
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are all required",
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})
```

---

### Step 8 — Route: Login

`bcrypt.compare()` takes the plain password the user typed and the hash stored in the database. It returns `true` if they match, `false` if they don't. We never need to "unhash" anything.

```js
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      })
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})
```

---

### Step 9 — Route: Get All Users (never return passwords)

When returning user data, always exclude the password field. We use `.select("-password")` to remove it from the result.

```js
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})
```

---

### Step 10 — Start the Server

```js
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
```

---

## How to Run

```bash
node index.js
```

---

## How to Test

Use **Postman** — all these routes require a `POST` request with a JSON body.

**Register a new user:**
```json
POST http://localhost:3000/register
Body: { "name": "Alice", "email": "alice@email.com", "password": "secret123" }
```

**Try registering the same email again (should fail):**
```json
POST http://localhost:3000/register
Body: { "name": "Alice", "email": "alice@email.com", "password": "secret123" }
```

**Login with correct password:**
```json
POST http://localhost:3000/login
Body: { "email": "alice@email.com", "password": "secret123" }
```

**Login with wrong password:**
```json
POST http://localhost:3000/login
Body: { "email": "alice@email.com", "password": "wrongpassword" }
```

**Check stored users (notice password is hidden):**
```
GET http://localhost:3000/users
```

---

## What a Stored Hash Looks Like

When you register with password `"secret123"`, the database stores something like:

```
$2b$10$xK9mNzQvL8Yp3eRt7UwXOeHhGnM1sFzqDlVkJc4yAiBrP0mNsT6
```

This is the bcrypt hash. It is completely different from `"secret123"` and cannot be reversed.

---

## What You Learned

- Why we never store plain text passwords
- How `bcrypt.hash()` creates a one-way hash
- What "salt rounds" means
- How `bcrypt.compare()` checks a password without unhashing
- How `.select("-password")` hides fields from MongoDB results
- The standard register and login API pattern

---

## Status Codes Reference

| Code | Meaning |
|---|---|
| `201` | Created — Account registered |
| `200` | OK — Login successful |
| `400` | Bad Request — Missing fields or email already exists |
| `401` | Unauthorized — Wrong password |
| `404` | Not Found — Email not registered |
| `500` | Server Error — Something broke |

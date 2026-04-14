#  Request Validation 
> **Topic:** Validating incoming data with `express-validator` | **Database:** MongoDB + Mongoose

---

##  What Is Request Validation?

When users send data to your API (like a registration form), you must check that the data is correct **before** saving it to the database. This is called **validation**.

Without validation, users could:
- Register with an empty name
- Submit a broken email like `"notanemail"`
- Set a password of just `"1"` which is too short

Validation catches these problems early and sends back helpful error messages.

> **Real-world analogy:**
> Think of a bank's online form. Before you can open an account, the form checks — is the email valid? Is the phone number 10 digits? Is the date of birth realistic? That is exactly what validation does in your API.

---

##  What is `express-validator`?

`express-validator` is a **popular npm package** used in Node.js + Express applications to validate and sanitize data coming from HTTP requests.

It wraps the well-known `validator.js` library and makes it easy to use validation rules directly inside your Express routes.

### Install it with:

```bash
npm install express-validator
```

### Import what you need:

```js
const { body, validationResult } = require("express-validator")
```

You only need **two things** from this package:

| Import | What it does |
|---|---|
| `body` | Used to create validation rules for fields in `req.body` |
| `validationResult` | Used to collect all the errors after rules have run |

---

##  Why is `express-validator` Important?

### Without it — Your API is broken and unsafe:

```js
// ❌ No validation — anything gets saved to DB
app.post("/register", async (req, res) => {
  const user = await User.create(req.body)  // empty name? fake email? password "1"? all saved!
  res.json({ data: user })
})
```

### With it — Your API is safe and professional:

```js
// ✅ With validation — bad data is rejected before it reaches the DB
router.post("/register", userValidationRules, validate, registerUser)
```

### Why you MUST validate:

| Problem (without validation) | What goes wrong |
|---|---|
| Empty name saved | Database has useless/corrupt records |
| Fake email saved | Password reset emails never reach user |
| Weak password saved | User account is insecure |
| Wrong data types | Mongoose throws ugly crashes |
| Missing required fields | Business logic breaks silently |

---

##  When Should You Use `express-validator`?

Use it on **every route where the client sends data** — especially:

| Route | Why validate? |
|---|---|
| `POST /register` | Check name, email, password before creating a user |
| `POST /login` | Check email format and password is not empty |
| `POST /products` | Check price is a number, name is not empty |
| `PUT /profile` | Check updated fields are in correct format |
| `POST /orders` | Check quantity is a positive number |

> **Rule of thumb:** Any route that reads from `req.body` needs validation.

---

##  How Does `express-validator` Work? (Step by Step)

It works in **3 stages** — think of it as a pipeline:

```
Request comes in
      ↓
 [Stage 1] Validation Rules run  ← body("name").notEmpty(), body("email").isEmail(), ...
      ↓
 [Stage 2] validationResult(req) ← collects all errors found in Stage 1
      ↓
 [Stage 3] Controller runs       ← only reached if zero errors
```

---

##  `express-validator` Cheat Sheet

### Validators — Check if data is valid

| Method | What it checks | Example |
|---|---|---|
| `.notEmpty()` | Field is not empty string | `body("name").notEmpty()` |
| `.isEmail()` | Valid email format | `body("email").isEmail()` |
| `.isLength({ min, max })` | String length in range | `body("password").isLength({ min: 6 })` |
| `.isNumeric()` | Value is a number | `body("age").isNumeric()` |
| `.isInt({ min, max })` | Integer within range | `body("age").isInt({ min: 1, max: 120 })` |
| `.isAlpha()` | Only letters (a-z) | `body("name").isAlpha()` |
| `.isURL()` | Valid URL format | `body("website").isURL()` |
| `.optional()` | Field is not required | `body("age").optional().isNumeric()` |

### `.withMessage()` — Custom error messages

Every validator can be followed by `.withMessage()` to give a student-friendly error message:

```js
body("email")
  .notEmpty().withMessage("Email is required")         // shown if empty
  .isEmail().withMessage("Please enter a valid email")  // shown if bad format
```

### Collecting errors with `validationResult()`

```js
const errors = validationResult(req)

if (!errors.isEmpty()) {
  // errors.array() gives you a list of all failed rules
  console.log(errors.array())
  // [
  //   { path: 'email', msg: 'Please enter a valid email' },
  //   { path: 'password', msg: 'Password must be at least 6 characters long' }
  // ]
}
```

---

##  Folder Structure

In this task, we follow a clean **MVC (Model-View-Controller)** folder structure. Each file has a single responsibility.

```
task-07-validation/
│
├── src/
│   ├── config/
│   │   └── db.js                # DB connection
│   │
│   ├── models/
│   │   └── user.model.js        # Schema / Database logic
│   │
│   ├── controllers/
│   │   └── user.controller.js   # Business logic
│   │
│   ├── routes/
│   │   └── user.routes.js       # API routes
│   │
│   ├── middlewares/
│   │   └── validate.js          # Validation middleware
│   │
│   ├── app.js                   # Express setup
│   └── index.js                 # Server start
│
├── package.json
└── .env
```

---

##  Project Setup

### Step 1 — Create your project folder and initialize it

```bash
mkdir task-07-validation
cd task-07-validation
npm init -y
```

### Step 2 — Install the required packages

```bash
npm install express mongoose express-validator dotenv
```

### Step 3 — Create the folder structure

```bash
mkdir -p src/config src/models src/controllers src/routes src/middlewares
```

Then create the files:

```bash
touch src/config/db.js
touch src/models/user.model.js
touch src/controllers/user.controller.js
touch src/routes/user.routes.js
touch src/middlewares/validate.js
touch src/app.js
touch src/index.js
touch .env
```

---

##  Writing the Code — File by File

---

### `src/config/db.js` — Database Connection

This file handles the MongoDB connection. We keep it separate so the connection logic is not mixed with anything else.

```js
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connected to MongoDB")
  } catch (error) {
    console.log("❌ Connection error:", error.message)
    process.exit(1)
  }
}

module.exports = connectDB
```

---

### `src/models/user.model.js` — Schema / Database Logic

The model defines what a User looks like in the database.

```js
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
})

const User = mongoose.model("User", userSchema)

module.exports = User
```

---

### `src/middlewares/validate.js` — Validation Rules & Middleware

This file contains two things:
1. **`userValidationRules`** — the array of validation rules for each field
2. **`validate`** — a reusable middleware that checks if any rule failed and returns errors

```js
const { body, validationResult } = require("express-validator")

// Validation rules for user registration
const userValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("age")
    .optional()
    .isNumeric()
    .withMessage("Age must be a number")
    .isInt({ min: 1, max: 120 })
    .withMessage("Age must be between 1 and 120"),
]

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    })
  }

  next()
}

module.exports = { userValidationRules, validate }
```

> **Why in middlewares folder?**
> The `validate` function is a middleware — it runs *between* the route and the controller. Keeping it in `middlewares/` follows the MVC principle of separating concerns.

---

### `src/controllers/user.controller.js` — Business Logic

Controllers handle what actually happens when a route is hit. They talk to the model and send back a response.

```js
const User = require("../models/user.model")

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, age } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      })
    }

    const user = await User.create({ name, email, password, age })

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({ success: true, count: users.length, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { registerUser, getAllUsers }
```

---

### `src/routes/user.routes.js` — API Routes

Routes connect the URL paths to the correct controller functions. Validation middleware is applied here, before the controller runs.

```js
const express = require("express")
const router = express.Router()

const { registerUser, getAllUsers } = require("../controllers/user.controller")
const { userValidationRules, validate } = require("../middlewares/validate")

// POST /users/register
router.post("/register", userValidationRules, validate, registerUser)

// GET /users
router.get("/", getAllUsers)

module.exports = router
```

> **How the chain works:**
> `userValidationRules` checks the fields → `validate` checks for errors → `registerUser` runs only if there are no errors.

---

### `src/app.js` — Express Setup

This file creates and configures the Express app. It does NOT start the server — that is `index.js`'s job.

```js
const express = require("express")
const userRoutes = require("./routes/user.routes")

const app = express()

// Middleware
app.use(express.json())

// Routes
app.use("/users", userRoutes)

module.exports = app
```

---

### `src/index.js` — Server Start

This is the entry point of the application. It connects to the database, then starts the server.

```js
require("dotenv").config()
const app = require("./app")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 3000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  })
})
```

---

### `.env` — Environment Variables

```env
MONGO_URI=mongodb+srv://yourname:yourpassword@cluster0.mongodb.net/task07
PORT=3000
```

> Never push your `.env` file to GitHub. Add `.env` to your `.gitignore`.

---

##  How to Run

```bash
node src/index.js
```

---

##  How to Test

Use **Postman** or any API tool. Set the method to `POST` and the body to `JSON`.

**Test 1 — Send empty body (should fail all validations):**
```
POST http://localhost:3000/users/register
Body: {}
```

Expected response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name is required" },
    { "field": "email", "message": "Email is required" },
    { "field": "password", "message": "Password is required" }
  ]
}
```

**Test 2 — Send bad email and short password:**
```
POST http://localhost:3000/users/register
Body: { "name": "Alice", "email": "notanemail", "password": "123" }
```

**Test 3 — Send valid data (should succeed):**
```
POST http://localhost:3000/users/register
Body: { "name": "Alice", "email": "alice@email.com", "password": "secret123", "age": 25 }
```

**Test 4 — Get all users:**
```
GET http://localhost:3000/users
```

---

##  What `.optional()` Means

```js
body("age").optional().isNumeric()
```

This means: if `age` is included in the request, it must be a number. But if `age` is NOT included, that is perfectly fine — no error.

Without `.optional()`, the field is effectively required.

---

##  What You Learned

- Why request validation is important
- How to use `body()` to define validation rules
- How `.notEmpty()`, `.isEmail()`, and `.isLength()` work
- How `validationResult()` collects errors
- How to return structured error messages to the client
- How `.optional()` makes a field not required
- How to split code across MVC folders (`models`, `controllers`, `routes`, `middlewares`, `config`)
- How `app.js` and `index.js` have separate responsibilities

---

##  Status Codes Reference

| Code | Meaning |
|---|---|
| `201` | Created — User registered successfully |
| `400` | Bad Request — Validation failed or email already exists |
| `500` | Server Error — Something broke |

---

##  MVC Responsibility Summary

| File | Responsibility |
|---|---|
| `config/db.js` | Connects to MongoDB |
| `models/user.model.js` | Defines the User schema |
| `middlewares/validate.js` | Validation rules + error checker middleware |
| `controllers/user.controller.js` | Business logic (create user, get users) |
| `routes/user.routes.js` | Maps URLs to controllers |
| `app.js` | Express app setup and route mounting |
| `index.js` | Starts the server |

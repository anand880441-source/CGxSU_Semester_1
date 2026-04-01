# MVC Folder Structure — Class Notes

> **Track:** Backend Development &nbsp;|&nbsp; **Technology:** Node.js + Express + MongoDB &nbsp;|&nbsp;
---

## 1. What is MVC?

MVC stands for **Model — View — Controller**. It is a design pattern — a standard way of organizing your project so that every file has **one clear job and nothing else**.

| Letter | Full Name | Job |
|--------|-----------|-----|
| **M** | Model | Talks to the database — defines the schema, reads and writes data |
| **V** | View | What the user sees — in a REST API, this is the JSON response |
| **C** | Controller | The brain — contains all the business logic for each operation |

> In a REST API, there are no HTML pages. So the **View** is simply the JSON response you send back. In practice, when building APIs you focus entirely on **Model** and **Controller**.

### The Restaurant Analogy

| Restaurant | MVC |
|------------|-----|
| Waiter — takes the order | **Route** — receives the request |
| Chef — prepares the food | **Controller** — processes the logic |
| Storage room — holds ingredients | **Model** — holds and manages data |
| Finished plate sent to customer | **View / Response** — JSON sent back |

Nobody asks the storage room to cook. Nobody asks the chef to take orders. Every person has one job. MVC works the same way.

---

## 2. Why We Are Shifting from Single File

You have been writing CRUD in a single `index.js` file. That was the right way to learn. But now look at what that file contains:

```
index.js
  ├── DB connection
  ├── Schema definition
  ├── Create route + logic
  ├── Read all route + logic
  ├── Read one route + logic
  ├── Update route + logic
  └── Delete route + logic
```

Everything is in one place. As your app grows, this becomes a serious problem.

**Problems with a single file:**

| Problem | What happens |
|---------|--------------|
| All logic in one place | Finding and fixing bugs takes much longer |
| No separation | Changing one thing can accidentally break another |
| Team work is impossible | Two people cannot work on the same file at the same time |
| Hard to scale | Adding 10 more routes makes the file impossible to read |
| Cannot reuse code | Same logic gets copy-pasted into every route |

**In MVC, the same app looks like this:**

```
config/db.js          → only DB connection
models/user.model.js  → only schema
controllers/          → only logic
routes/               → only URL mapping
app.js                → only Express setup
index.js              → only server start
```

Every file is small, focused, and easy to understand. This is how real projects are built.

---

## 3. The Folder Structure

```
my-app/
│
├── src/
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   │
│   ├── models/
│   │   └── user.model.js          ← User schema + model
│   │
│   ├── controllers/
│   │   └── user.controller.js     ← All CRUD logic
│   │
│   ├── routes/
│   │   └── user.routes.js         ← API endpoints
│   │
│   ├── middlewares/               ← Empty for now — used in next class
│   │
│   ├── app.js                     ← Express setup + middleware + routes
│   └── index.js                   ← Starts the server
│
├── .env                           ← Environment variables
└── package.json
```

> **Note:** The `middlewares/` folder is created now as part of the structure but will be used in the next class when we add authentication.

---

## 4. Responsibility of Each Layer

This is the most important concept of this class. Read this carefully.

### `config/db.js`
Connects to MongoDB. That is its only job. No schema, no routes, no logic.

### `models/user.model.js`
Defines the shape of a User in the database. No logic about what to do with the data — just what the data looks like.

### `controllers/user.controller.js`
Every operation — create a user, get all users, update a user, delete a user — is written here as a separate function. The controller talks to the model to get or save data, then sends the response.

### `routes/user.routes.js`
Maps each URL and HTTP method to the right controller function. This file should be very short. There is **no logic here** — only connections.

### `app.js`
Creates the Express app, registers middleware, and connects route files. Does not start the server.

### `index.js`
Connects to the database and starts the server. Nothing else.

---

> **The Rule:** If you find yourself writing database queries inside a route file, stop — that belongs in the controller. If you find yourself defining routes inside a controller, stop — that belongs in the route file.

---

## 5. Project Setup

### Initialize

```bash
mkdir my-app && cd my-app
npm init -y
```

### Install dependencies

```bash
npm install express mongoose dotenv
npm install --save-dev nodemon
```

| Package | Purpose |
|---------|---------|
| `express` | Web framework — handles HTTP requests |
| `mongoose` | Connects to MongoDB, defines schemas |
| `dotenv` | Reads `.env` file into `process.env` |
| `nodemon` | Restarts server automatically on file change (dev only) |

### Update `package.json`

```json
"scripts": {
  "start": "node src/index.js",
  "dev":   "nodemon src/index.js"
}
```

---

## 6. Step 1 — Config: Database Connection

**File:** `src/config/db.js`

```js
// src/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**Two things to understand here:**

**`process.env.MONGO_URI`** — The database URL is stored in `.env`, not written directly in code. You will never hardcode a database URL because it contains sensitive credentials. `dotenv` makes it available through `process.env`.

**`process.exit(1)`** — If the database fails to connect, the application stops immediately. There is no point running a server that cannot talk to its database.

---

## 7. Step 2 — Model: User Schema

**File:** `src/models/user.model.js`

This is the exact same schema you wrote before — now it lives in its own file instead of sitting inside `index.js`.

```js
// src/models/user.model.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    email: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    age: {
      type:   Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
```

**`timestamps: true`** — Mongoose automatically adds `createdAt` and `updatedAt` to every document. You do not write these manually.

**`module.exports = User`** — The controller will import this model to talk to the database.

---

## 8. Step 3 — Controller: CRUD Logic

**File:** `src/controllers/user.controller.js`

This is the heart of the application. All five CRUD operations are written here as separate named functions. Notice there are **no route definitions** in this file — only logic.

```js
// src/controllers/user.controller.js

const User = require('../models/user.model');

// ─────────────────────────────────────────────
// CREATE — POST /api/users
// ─────────────────────────────────────────────
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const newUser = new User({ name, email, age });
    await newUser.save();

    res.status(201).json({
      msg:  'User created successfully.',
      user: newUser,
    });

  } catch (error) {
    res.status(500).json({ msg: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// READ ALL — GET /api/users
// ─────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      msg:   'Users fetched successfully.',
      count: users.length,
      users,
    });

  } catch (error) {
    res.status(500).json({ msg: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// READ ONE — GET /api/users/:id
// ─────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    res.status(200).json({ user });

  } catch (error) {
    res.status(500).json({ msg: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE — PUT /api/users/:id
// ─────────────────────────────────────────────
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    res.status(200).json({
      msg:  'User updated successfully.',
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ msg: 'Server error.', error: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE — DELETE /api/users/:id
// ─────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    res.status(200).json({ msg: 'User deleted successfully.' });

  } catch (error) {
    res.status(500).json({ msg: 'Server error.', error: error.message });
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
```

**Key points:**

**`{ new: true }`** in `findByIdAndUpdate` — by default, Mongoose returns the document as it was **before** the update. `new: true` tells it to return the document **after** the update, which is almost always what you want.

**`runValidators: true`** — by default, Mongoose does not run schema validators on updates. This option forces it to, so rules like `required` and `unique` still apply on update.

**Every function checks if the document exists** — `findById` and `findByIdAndUpdate` return `null` if nothing is found. Always check for `null` and return a `404` before trying to use the result.

**`module.exports`** — all five functions are exported together as an object. The route file will destructure and use them by name.

---

## 9. Step 4 — Routes: Wire Everything

**File:** `src/routes/user.routes.js`

This file only maps URLs to controller functions. There is no logic here at all.

```js
// src/routes/user.routes.js

const express = require('express');
const router  = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

// CRUD routes
router.post('/',    createUser);
router.get('/',     getAllUsers);
router.get('/:id',  getUserById);
router.put('/:id',  updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
```

**Why is this file so short?**

Because the route file's only job is to say: *"when this URL is hit, call this function."* The function itself lives in the controller. This makes both files easy to read and easy to change independently.

---

## 10. Step 5 — app.js: Express Setup

**File:** `src/app.js`

```js
// src/app.js

const express    = require('express');
const userRoutes = require('./routes/user.routes');

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// 404 — no route matched
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found.' });
});

module.exports = app;
```

**`app.use('/api/users', userRoutes)`** — this mounts the entire user router at `/api/users`. So inside `user.routes.js`, when you write `router.get('/')`, the full URL becomes `GET /api/users/`. When you write `router.get('/:id')`, it becomes `GET /api/users/:id`.

---

## 11. Step 6 — index.js: Start the Server

**File:** `src/index.js`

```js
// src/index.js

require('dotenv').config();       // Must be the very first line

const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();              // Connect to DB first

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
```

**Why `require('dotenv').config()` must be first?**

`dotenv` reads your `.env` file and loads all values into `process.env`. If any other file is loaded before this — like `app.js` or `db.js` — those files will try to read `process.env.MONGO_URI` and get `undefined` because dotenv has not run yet. Always load it first.

**Why `await connectDB()` before `app.listen()`?**

The server should not accept requests before the database is ready. If it did, every route that touches the database would fail. We wait for the connection to succeed, then open the server for traffic.

---

## 12. The .env File

**File:** `.env`

```
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myapp
```

**Always add `.env` to `.gitignore`:**

```
# .gitignore
node_modules/
.env
```

Your `.env` file contains database credentials. If you push it to GitHub, it is publicly visible to anyone. It must always be excluded from version control.

---

## 13. Complete Request Flow

Let us trace what happens when a client sends `POST /api/users` to create a new user.

```
Client sends:
POST /api/users
Body: { "name": "Rahul", "email": "rahul@gmail.com", "age": 22 }
        │
        ▼
  index.js
  — dotenv loaded, DB connected, server listening on PORT 3000
        │
        ▼
  app.js
  — express.json() parses the request body → req.body is now available
  — /api/users matched → passed to user.routes.js
        │
        ▼
  user.routes.js
  — POST / matched → calls createUser controller function
        │
        ▼
  user.controller.js → createUser()
  — destructures name, email, age from req.body
  — creates new User document
  — saves to MongoDB via newUser.save()
  — sends res.status(201).json({ msg, user })
        │
        ▼
Client receives:
{
  "msg": "User created successfully.",
  "user": { "_id": "...", "name": "Rahul", "email": "rahul@gmail.com", "age": 22 }
}
```

---

## 14. Tasks

### 🟢 Beginner

Set up the complete MVC folder structure from this class and make all five CRUD routes work:

| Method | Route | Action |
|--------|-------|--------|
| POST | `/api/users` | Create a user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get one user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

Test all five routes using Postman or Thunder Client.

---

### 🟡 Intermediate

Add a **Product** resource to the same project following the exact same MVC pattern:

1. `src/models/product.model.js` — fields: `title`, `price`, `category`
2. `src/controllers/product.controller.js` — all five CRUD functions
3. `src/routes/product.routes.js` — all five routes
4. Mount it in `app.js` at `/api/products`

The User code should not change at all. This tests whether the structure is truly modular.

---

### 🔴 Advanced

Add a search feature to `GET /api/users`:

- If a query param `name` is provided — `GET /api/users?name=Rahul` — return only users whose name matches (case-insensitive)
- If no query param — return all users as normal

Handle this entirely inside the `getAllUsers` controller function. The route file should not change.

```js
// Hint — Mongoose regex query for case-insensitive search
const users = await User.find({
  name: { $regex: req.query.name, $options: 'i' }
});
```

---

## 15. Interview Revision

### Quick Reference Table

| Term | Meaning |
|------|---------|
| MVC | Design pattern — separates Model, View, Controller into distinct layers |
| Model | Mongoose schema and model — defines data structure, talks to DB |
| Controller | Contains business logic — called by the route, talks to the model |
| Route | Maps URL + HTTP method to a controller function — no logic here |
| `{ new: true }` | Returns the updated document after `findByIdAndUpdate` |
| `runValidators: true` | Forces schema validators to run on update operations |
| `timestamps: true` | Auto-adds `createdAt` and `updatedAt` to every document |
| `process.env` | Object that holds environment variables loaded by `dotenv` |
| `process.exit(1)` | Stops the Node.js process — used when DB connection fails |
| `app.use('/api/users', router)` | Mounts a router at a base path |

---

### Frequently Asked Interview Questions

**Q: What is MVC and why is it used?**

MVC stands for Model-View-Controller. It is a design pattern that separates an application into three layers. The Model handles data and database logic. The View is what the user sees — in an API, this is the JSON response. The Controller contains the business logic. It is used because it keeps code organized, makes it easier to find and fix bugs, and allows teams to work on different parts of the application without interfering with each other.

---

**Q: What is the difference between a route file and a controller?**

A route file only defines which URL and HTTP method maps to which function — it contains no logic. A controller contains the actual logic — it reads from `req`, interacts with the database through the model, and sends the response. Keeping them separate means the route file stays short and readable, and the logic stays in one predictable place.

---

**Q: What does `{ new: true }` do in `findByIdAndUpdate`?**

By default, `findByIdAndUpdate` returns the document as it was before the update. Passing `{ new: true }` tells Mongoose to return the document after the update has been applied. This is almost always what you want — to confirm what the data looks like after the change.

---

**Q: Why must `require('dotenv').config()` be the first line in `index.js`?**

Because `dotenv` loads the `.env` file and makes its values available through `process.env`. If any other file is imported before dotenv runs, those files will try to read `process.env.MONGO_URI` or similar values and get `undefined`. Loading dotenv first ensures all values are available before any other code executes.

---

**Q: Why do we connect to the database before calling `app.listen()`?**

If the server starts accepting requests before the database connection is ready, any route that queries the database will fail. By awaiting the DB connection first and only then starting the server, we guarantee that the application is fully ready before it accepts any traffic.

---

**Q: What is `module.exports` and why do we use it?**

`module.exports` is how a file exposes its functions or values to other files in Node.js. When a controller exports `{ createUser, getAllUsers }`, the route file can import exactly those functions by name using `require`. Without `module.exports`, nothing leaves the file and nothing can be shared across the project.

---

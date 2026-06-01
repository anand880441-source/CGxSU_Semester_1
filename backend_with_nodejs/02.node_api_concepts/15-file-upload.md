# File Upload with Multer 

**Topic:** Uploading files and images with `multer` | **Database:** MongoDB + Mongoose

---

## 1. What Is File Upload & Why Do We Need Multer?

By default, Express can only read standard text/JSON data (`req.body`). 

When a user uploads a file (like a profile picture, resume, or image), it is sent in a special format called **`multipart/form-data`**. Express does not know how to read this format on its own.

To handle files, we use a popular middleware called **Multer**.

### How Multer Works:
1. **Intercepts** the incoming request.
2. **Saves** the uploaded file to a folder on your server (e.g., `uploads/`).
3. **Attaches** the file details to **`req.file`** so you can access it in your controller.

```
[User Uploads Image] ──> [Multer Middleware] ──> Saves file to "uploads/" folder
                                           └──> Puts file details in req.file
```

---

## 2. Project Folder Structure

Keep your project organized using this simple structure:

```
file-upload-app/
│
├── src/
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   │
│   ├── models/
│   │   └── user.model.js          ← Schema (stores only the file name)
│   │
│   ├── controllers/
│   │   └── user.controller.js     ← Register user & fetch users logic
│   │
│   ├── routes/
│   │   └── user.routes.js         ← Route definitions
│   │
│   ├── middlewares/
│   │   └── upload.js              ← Multer configuration (destination & filename)
│   │
│   ├── app.js                     ← Express setup
│   └── index.js                   ← Start the server
│
├── uploads/                       ← Folder where files will be saved
├── .env                           ← Environment variables
└── package.json
```

> [!IMPORTANT]
> Create the `uploads/` folder manually in the root directory before running the server.

---

## 3. Installation

Run this command in your terminal to install the required packages:

```bash
npm install express mongoose multer dotenv
npm install --save-dev nodemon
```

Add these scripts to your `package.json`:

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

---

## 4. Step-by-Step Implementation

---

### Step 1 — Database Connection (`src/config/db.js`)

Connect your application to MongoDB.

```js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### Step 2 — Create the User Schema (`src/models/user.model.js`)

> [!NOTE]
> We **never** save the actual image/file in the database. Instead, we save the file on the server's disk and store only the **filename** (e.g., `1716304523-avatar.png`) as a String in the database.

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"] 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true 
    },
    avatar: { 
      type: String, 
      default: null 
    } // Will store the filename: e.g., "1716304523-pic.jpg"
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

---

### Step 3 — Set Up Multer Middleware (`src/middlewares/upload.js`)

Here we configure where to save files and how to name them. We also restrict uploads to image files only.

```js
const multer = require("multer");
const path = require("path");

// 1. Configure where to save files and what to name them
const storage = multer.diskStorage({
  // destination: Where the file will be saved
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  
  // filename: How the file will be named
  // We add Date.now() to make sure every file name is unique
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// 2. Filter: Only allow images (jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only images (jpeg, jpg, png) are allowed!"), false); // Reject file
  }
};

// 3. Create the Multer Instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 2 * 1024 * 1024 // Limit file size to 2MB
  }
});

module.exports = upload;
```

---

### Step 4 — Create the User Controller (`src/controllers/user.controller.js`)

This handles user registration (saving text + filename) and getting the users.

```js
const User = require("../models/user.model");

// 1. Register a new user with an avatar
const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if the user uploaded a file
    // Multer places the file information in req.file
    const avatar = req.file ? req.file.filename : null;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required"
      });
    }

    // Create user in the database
    const newUser = await User.create({
      name,
      email,
      avatar
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    // Format response to include the full URL to access the avatar
    const usersWithAvatarUrl = users.map(user => {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatar 
          ? `${req.protocol}://${req.get("host")}/uploads/${user.avatar}` 
          : null,
        createdAt: user.createdAt
      };
    });

    res.status(200).json({
      success: true,
      data: usersWithAvatarUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  registerUser,
  getUsers
};
```

---

### Step 5 — Set Up Routes (`src/routes/user.routes.js`)

We apply the `upload.single("avatar")` middleware to the register route. The word `"avatar"` inside `single()` must match the key name we use in Postman/Frontend.

```js
const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { registerUser, getUsers } = require("../controllers/user.controller");

// Route: Register a user with single image upload
// 'upload.single("avatar")' intercepts the request first, saves the file, and then passes control to 'registerUser'
router.post("/", upload.single("avatar"), registerUser);

// Route: Get all users
router.get("/", getUsers);

module.exports = router;
```

---

### Step 6 — Configure Express App (`src/app.js`)

We need to tell Express to make the `uploads` folder static so anyone can access the images via a URL.

```js
const express = require("express");
const path = require("path");
const userRoutes = require("./routes/user.routes");

const app = express();

// Middleware to read JSON
app.use(express.json());

// Make 'uploads' folder publicly accessible
// Now you can view files at: http://localhost:5000/uploads/filename.png
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API Routes
app.use("/api/users", userRoutes);

// Global Error Handler (Handles Multer errors like file size limits or wrong format)
app.use((err, req, res, next) => {
  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong!"
  });
});

module.exports = app;
```

---

### Step 7 — Server Entry Point (`src/index.js`)

```js
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
```

---

### Step 8 — Environment Variables (`.env`)

```env
MONGO_URI=mongodb://127.0.0.1:27017/multer-beginner-db
PORT=5000
```

---

## 5. How to Test in Postman

You **cannot** use the default JSON tab to test file uploads in Postman. Follow these steps:

1. Set request method to **`POST`** and URL to `http://localhost:5000/api/users`.
2. Go to the **Body** tab.
3. Select **form-data**.
4. In the key/value table:
   - Row 1: Key = `name`, Value = `John Doe` (Type: Text)
   - Row 2: Key = `email`, Value = `john@example.com` (Type: Text)
   - Row 3: Key = `avatar`, change the type dropdown from **Text** to **File**. Click **Select Files** and choose an image from your computer.
5. Click **Send**.

---

## 6. What does `req.file` contain?

When Multer runs successfully, it attaches an object to `req.file` containing these key properties:

| Property | Example Value | Description |
|---|---|---|
| `req.file.fieldname` | `"avatar"` | The name used in the key field (from Postman/Form) |
| `req.file.originalname` | `"myphoto.jpg"` | The original name of the file on user's computer |
| `req.file.mimetype` | `"image/jpeg"` | The file type |
| `req.file.filename` | `"1716304523-myphoto.jpg"` | The unique name saved in the `uploads/` folder |
| `req.file.path` | `"uploads/1716304523-myphoto.jpg"` | The full path to the saved file |

---

## 7. Common Mistakes & Quick Troubleshooting

* **Error: `req.file is undefined`**
  * *Reason 1:* You forgot to use `upload.single("fieldname")` in your route.
  * *Reason 2:* You tested using JSON instead of **form-data** in Postman.
  * *Reason 3:* The key name in Postman (`avatar`) does not match the name in `upload.single("avatar")`.

* **Error: `MulterError: Unexpected field`**
  * *Reason:* The key name you sent from Postman doesn't match the string inside `upload.single()`. Ensure both are exactly the same (e.g., `"avatar"`).

* **Error: `Cannot find uploads folder`**
  * *Reason:* Multer doesn't always automatically create the destination folder. Make sure you manually create a folder named `uploads` in the root of your project directory.

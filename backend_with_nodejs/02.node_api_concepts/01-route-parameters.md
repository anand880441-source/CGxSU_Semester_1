#  Route Parameters 

**Topic:** Dynamic URLs with `req.params` | **Database:** MongoDB + Mongoose

---



##  What Are Route Parameters?

When you visit a URL like `/product/123`, the `123` is a **route parameter** — it tells the server which specific product to load.

In Express, route parameters are written with a colon `:` before the name:

```
GET /product/:id
```

The `:id` is a placeholder. When someone requests `/product/123`, Express sets `req.params.id = "123"` automatically.

---

##  Key Concepts

| Concept | What it means |
|---|---|
| `req.params` | Object that holds all route parameter values |
| `:id` | A named placeholder in the URL |
| `findById()` | Mongoose method to find one document by its `_id` |
| Multiple params | You can have more than one, like `/:category/:brand` |

---

##  Project Setup

### Step 1 — Create your project folder and initialize it

```bash
mkdir task-01-route-params
cd task-01-route-params
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

const PORT = 5000
```

---

### Step 5 — Connect to MongoDB

```js
mongoose.connect("mongodb://127.0.0.1:27017/backendClassDB")
  .then(() => {
    console.log("MongoDB Connected Successfully")
  })
  .catch((err) => {
    console.log("Database connection error", err)
  })
```

---

### Step 6 — Create Schema and Model

A **Schema** is the blueprint of your data. A **Model** is what you use to talk to the MongoDB collection.

```js
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  }
})

const Product = mongoose.model("Product", ProductSchema)
```

---

### Step 7 — Route: Add a Single Product

We need data in the database first. This route saves one product at a time.

```js
app.post("/product", async (req, res) => {
  const { title, Price, category, brand } = req.body

  const ProductData = { title, Price, category, brand }

  try {
    const NewProduct = new Product(ProductData)
    await NewProduct.save()
    res.status(200).json(NewProduct)
  } catch (error) {
    res.status(404).send(error)
  }
})
```

---

### Step 8 — Route: Add Many Products at Once

`insertMany()` saves an entire array of products in one shot.

```js
app.post("/products/bulk", async (req, res) => {
  const products = req.body

  try {
    const newProducts = await Product.insertMany(products)
    res.status(201).json({
      message: "Multiple products added successfully",
      data: newProducts
    })
  } catch (error) {
    res.status(500).send(error)
  }
})
```

---

### Step 9 — Route: Get All Products

```js
app.get("/get-products", async (req, res) => {
  try {
    const product = await Product.find()
    if (!product) {
      return res.status(404).send("Product Not Found")
    }
    res.json(product)
  } catch (error) {
    res.status(404).send(error)
  }
})
```

---

### Step 10 — Route: Find Product by ID

`req.params.id` reads the `:id` value from the URL. We pass it to `findById()` to search MongoDB for that exact document. MongoDB auto-generates a unique `_id` for every document — that is what we use here.

```js
app.get("/product/:id", async (req, res) => {
  try {
    const ProductId = req.params.id
    const product = await Product.findById(ProductId)

    if (!product) {
      return res.status(404).send("Product Not Found")
    }

    res.json(product)
  } catch (error) {
    res.status(404).send(error)
  }
})
```

---

### Step 11 — Route: Find Products by Category (Multiple Params)

Here we use two route parameters at the same time — `:category` and `:brand`. Both are available inside `req.params` together.

```js
app.get("/products/:category/:brand", async (req, res) => {
  try {
    const { category, brand } = req.params

    const products = await Product.find({ category: category, brand: brand })

    if (!products) {
      return res.status(404).send("Products Not Found")
    }

    res.json(products)
  } catch (error) {
    res.status(404).send(error)
  }
})
```

---

### Step 12 — Start the Server

```js
app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})
```

---

## ▶️ How to Run

```bash
node index.js
```

You should see:
```
Server running on port 5000
MongoDB Connected Successfully
```

---

## 🧪 How to Test

First add test data in Postman:

```json
POST http://localhost:5000/products/bulk
Body (raw JSON):

[
  { "title": "Samsung Galaxy S23", "Price": 60000, "category": "smartphones", "brand": "Samsung" },
  { "title": "iPhone 15",          "Price": 90000, "category": "smartphones", "brand": "Apple"   },
  { "title": "Dell Laptop",        "Price": 75000, "category": "laptops",     "brand": "Dell"    },
  { "title": "MacBook Pro",        "Price": 120000,"category": "laptops",     "brand": "Apple"   },
  { "title": "Sony Headphones",    "Price": 8000,  "category": "audio",       "brand": "Sony"    }
]
```

Then test your routes:

```
# Get all products
GET http://localhost:5000/get-products

# Get one product by ID (copy an _id from the bulk response)
GET http://localhost:5000/product/PASTE_ID_HERE

# Get all products in a category and brand
GET http://localhost:5000/products/smartphones/Apple
GET http://localhost:5000/products/laptops/Dell
```

---

## 💡 Route Params vs Query Params — What is the Difference?

```
/product/64f3a...        ← Route param  → req.params.id
/products?category=audio ← Query param  → req.query.category
```

Route params are part of the URL path. Query params come after `?`. Use route params when you are identifying one specific item. Use query params for filtering a list.

---

## ✅ What You Learned

- How `req.params` reads values from the URL path
- How `:id` and `:category` work as named placeholders
- How `findById()` fetches one document from MongoDB
- How to use multiple route parameters at the same time
- The difference between route params and query params

---

## 🔢 Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Product found and returned |
| `201` | Created — Products added |
| `404` | Not Found — Product doesn't exist |
| `500` | Server Error — Something broke |

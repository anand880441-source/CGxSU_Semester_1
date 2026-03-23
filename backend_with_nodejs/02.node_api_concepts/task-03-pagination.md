# Task 03 — Pagination 

> **Topic:** Handling large data with `skip` and `limit` | **Database:** MongoDB + Mongoose

---



##  What Is Pagination?

Imagine you have 1000 products in your database. Sending all 1000 at once is slow and heavy. Instead, we send them in small pages — 10 at a time.

```
Page 1 → products 1  to 10
Page 2 → products 11 to 20
Page 3 → products 21 to 30
```

---

##  The Formula

Two MongoDB concepts power pagination:

- **`limit`** — How many items to return
- **`skip`** — How many items to jump over before returning

```
skip = (page - 1) × limit
```

| Page | Limit | Skip | Returns |
|---|---|---|---|
| 1 | 10 | (1-1)×10 = 0  | Items 1–10  |
| 2 | 10 | (2-1)×10 = 10 | Items 11–20 |
| 3 | 10 | (3-1)×10 = 20 | Items 21–30 |

---

##  Project Setup

### Step 1 — Create your project folder and initialize it

```bash
mkdir task-03-pagination
cd task-03-pagination
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

### Step 10 — Route: Paginated Products

We use `parseInt()` to convert the query param strings into numbers. We set default values — `page = 1` and `limit = 10` — so the route still works if no params are sent. Then we calculate `skip` using the formula and pass it to Mongoose.

```js
app.get("/products-pagination", async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10

    const skip = (page - 1) * limit

    const product = await Product.find().skip(skip).limit(limit)

    res.status(201).json(product)
  } catch (error) {
    res.status(404).send(error)
  }
})
```

---

### Step 11 — Start the Server

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

First add test data in Postman — we add 12 products so pagination is visible:

```json
POST http://localhost:5000/products/bulk
Body (raw JSON):

[
  { "title": "Product 1",  "Price": 1000,  "category": "electronics", "brand": "BrandA" },
  { "title": "Product 2",  "Price": 2000,  "category": "electronics", "brand": "BrandB" },
  { "title": "Product 3",  "Price": 3000,  "category": "clothing",    "brand": "BrandA" },
  { "title": "Product 4",  "Price": 4000,  "category": "clothing",    "brand": "BrandC" },
  { "title": "Product 5",  "Price": 5000,  "category": "electronics", "brand": "BrandB" },
  { "title": "Product 6",  "Price": 6000,  "category": "audio",       "brand": "BrandA" },
  { "title": "Product 7",  "Price": 7000,  "category": "audio",       "brand": "BrandC" },
  { "title": "Product 8",  "Price": 8000,  "category": "laptops",     "brand": "BrandB" },
  { "title": "Product 9",  "Price": 9000,  "category": "laptops",     "brand": "BrandA" },
  { "title": "Product 10", "Price": 10000, "category": "electronics", "brand": "BrandC" },
  { "title": "Product 11", "Price": 11000, "category": "clothing",    "brand": "BrandA" },
  { "title": "Product 12", "Price": 12000, "category": "audio",       "brand": "BrandB" }
]
```

Now test pagination:

```
# Page 1 with 5 per page → returns Product 1 to 5
GET http://localhost:5000/products-pagination?page=1&limit=5

# Page 2 with 5 per page → returns Product 6 to 10
GET http://localhost:5000/products-pagination?page=2&limit=5

# Page 3 with 5 per page → returns Product 11 to 12 (only 2 left)
GET http://localhost:5000/products-pagination?page=3&limit=5

# Default (no params) → page 1, 10 per page
GET http://localhost:5000/products-pagination
```

---

## 💡 The `skip` Formula Step by Step

```
page = 2, limit = 5

skip = (page - 1) * limit
skip = (2 - 1) * 5
skip = 1 * 5
skip = 5

→ MongoDB jumps over the first 5 products
→ Then returns the next 5
```

---

## 💡 Why `parseInt()`?

Query params always arrive as strings. `parseInt()` converts them to numbers so the math works correctly.

```js
req.query.page   // "2"  ← string
parseInt("2")    // 2    ← number  ✅
(2 - 1) * 5     // 5    ← correct

("2" - 1) * 5   // 5    ← also works by accident
("2" - 1) * "5" // NaN  ← breaks! always use parseInt() to be safe
```

---

## ✅ What You Learned

- What pagination is and why it is important for large data
- The formula: `skip = (page - 1) * limit`
- How `.skip()` and `.limit()` work in Mongoose
- How `parseInt()` converts string query params to numbers
- How default values work with `|| 1` and `|| 10`

---

## 🔢 Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Product saved |
| `201` | Created — Paginated products returned |
| `404` | Not Found — Error or no products |
| `500` | Server Error — Something broke |

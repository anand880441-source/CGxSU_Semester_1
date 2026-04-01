# Query Parameters 

 **Topic:** Filtering data with `req.query` | **Database:** MongoDB + Mongoose

---




##  What Are Query Parameters?

Query parameters are the part of a URL that comes **after the `?` symbol**.

```
GET /brandproducts?category=laptops&brand=Apple
```

- `?` marks the start of query parameters
- `category=laptops` is one parameter
- `&` separates multiple parameters
- `brand=Apple` is another parameter

In Express, all of these are available inside `req.query` automatically.

---

##  Route Params vs Query Params

| | Route Params | Query Params |
|---|---|---|
| **URL example** | `/product/123` | `/brandproducts?brand=Apple` |
| **How to access** | `req.params.id` | `req.query.brand` |
| **Used for** | One specific item by ID | Filtering a list |
| **Required?** | Yes, part of the URL | No, always optional |

---

##  Project Setup

### Step 1 — Create your project folder and initialize it

```bash
mkdir task-02-query-params
cd task-02-query-params
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

### Step 10 — Route: Filter by Category and Brand

This is the key route. We start with an empty `filter` object. We only add `category` to the filter if it was actually sent — same for `brand`. This way the same route works for one filter, both filters, or no filter at all.

```js
app.get("/brandproducts", async (req, res) => {
  try {
    const { category, brand } = req.query

    const filter = {}

    if (category) {
      filter.category = category
    }

    if (brand) {
      filter.brand = brand
    }

    const products = await Product.find(filter)

    if (!products) {
      return res.status(404).send("This category not Found")
    }

    res.json(products)
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

First add test data in Postman:

```json
POST http://localhost:5000/products/bulk
Body (raw JSON):

[
  { "title": "Samsung Galaxy S23", "Price": 60000, "category": "smartphones", "brand": "Samsung" },
  { "title": "iPhone 15",          "Price": 90000, "category": "smartphones", "brand": "Apple"   },
  { "title": "Dell Laptop",        "Price": 75000, "category": "laptops",     "brand": "Dell"    },
  { "title": "MacBook Pro",        "Price": 120000,"category": "laptops",     "brand": "Apple"   },
  { "title": "Sony Headphones",    "Price": 8000,  "category": "audio",       "brand": "Sony"    },
  { "title": "Samsung TV",         "Price": 45000, "category": "television",  "brand": "Samsung" }
]
```

Now test your filter routes:

```
# Get all products (no filter)
GET http://localhost:5000/brandproducts

# Filter by category only
GET http://localhost:5000/brandproducts?category=smartphones
GET http://localhost:5000/brandproducts?category=laptops

# Filter by brand only
GET http://localhost:5000/brandproducts?brand=Apple
GET http://localhost:5000/brandproducts?brand=Samsung

# Filter by both category AND brand
GET http://localhost:5000/brandproducts?category=smartphones&brand=Apple
GET http://localhost:5000/brandproducts?category=laptops&brand=Apple
```

---

## 💡 How the Dynamic Filter Works

This is the most important concept in this task. The `filter` object grows based on what is sent:

```js
// Only category sent → filter = { category: "laptops" }
// Only brand sent    → filter = { brand: "Apple" }
// Both sent          → filter = { category: "laptops", brand: "Apple" }
// Nothing sent       → filter = {}  → returns all products
```

`Product.find(filter)` then uses whatever is inside `filter` as the search condition.

---

## 💡 Query Params Are Always Strings

```js
// Price comes as "60000" (string), not 60000 (number)
const price = req.query.Price       // "60000"
const price = Number(req.query.Price) // 60000  ← convert when needed
```

For `category` and `brand` this does not matter since they are already strings. But remember this if you ever filter by a number field.

---

## ✅ What You Learned

- How `req.query` reads values from the URL after `?`
- How to destructure multiple query params at once
- How to build a dynamic `filter` object step by step
- How `if (category)` safely skips undefined values
- How `Product.find(filter)` applies all filters at once

---

## 🔢 Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Product saved |
| `201` | Created — Bulk products added |
| `404` | Not Found — No products found |
| `500` | Server Error — Something broke |

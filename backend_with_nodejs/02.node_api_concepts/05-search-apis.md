#  Search APIs 

**Topic:** Text-based searching with `$regex` | **Database:** MongoDB + Mongoose

---



##  What Is a Search API?

A search API lets users find data by typing **part of a word**. For example:

- User types `"sam"` → API returns `"Samsung Galaxy"`, `"Samsung TV"`
- User types `"lap"` → API returns `"Laptop"`, `"Dell Laptop"`, `"Gaming Laptop"`

This is called a **partial match** search. MongoDB does this using `$regex`.

---

##  What Is `$regex`?

`$regex` is a MongoDB operator that searches inside a text field — like a "contains" filter.

```js
{ title: { $regex: "phone", $options: "i" } }
```

| Part | Meaning |
|---|---|
| `$regex: "phone"` | Find documents where title **contains** "phone" |
| `$options: "i"` | Case-insensitive — matches "Phone", "PHONE", "phone" |

---

##  Exact Match vs `$regex`

```js
Product.find({ title: "Phone" })
// Only finds exactly "Phone" — nothing else

Product.find({ title: { $regex: "pho", $options: "i" } })
// Finds "Phone", "iPhone", "Earphone", "Smartphone"
```

---

##  What Is `$or`?

`$or` means "return this document if ANY one of these conditions is true". It lets you search across multiple fields at the same time.

```js
Product.find({
  $or: [
    { category: { $regex: search, $options: "i" } },
    { brand:    { $regex: search, $options: "i" } }
  ]
})
```

This returns products where EITHER category OR brand contains the search word.

---

##  Project Setup

### Step 1 — Create your project folder and initialize it

```bash
mkdir task-05-search
cd task-05-search
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

We need data in the database to search. This route saves one product at a time.

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

`insertMany()` takes an array and saves all items in one single database call — much faster than saving one by one.

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

### Step 9 — Route: Search in Category and Brand Fields

`$or` searches across two fields at the same time. If EITHER the category OR the brand contains the search word, the product is returned.

```js
app.get("/products-search", async (req, res) => {
  try {
    const search = req.query.search

    const products = await Product.find({
      $or: [
        { category: { $regex: search, $options: "i" } },
        { brand:    { $regex: search, $options: "i" } }
      ]
    })

    res.status(201).json(products)
  } catch (error) {
    res.status(404).send(error)
  }
})
```

---

### Step 10 — Route: Search in Title Only

When you want to search inside just one specific field, you do not need `$or` — just apply `$regex` directly to that field.

```js
app.get("/search-title", async (req, res) => {
  try {
    const search = req.query.search

    const products = await Product.find({
      title: { $regex: search, $options: "i" }
    })

    res.status(201).json(products)
  } catch (error) {
    res.status(404).send(error)
  }
})
```

---

### Step 11 — Route: Search + Filter + Sort + Pagination Together

This is the master route that combines all concepts. We build the filter step by step — adding each feature only if the query param was actually sent.

```js
app.get("/products", async (req, res) => {
  try {
    const { category, brand, search, page = 1, limit = 10, sort } = req.query

    // Step A: Start with empty filter
    const filter = {}

    if (category) {
      filter.category = category
    }

    if (brand) {
      filter.brand = brand
    }

    // Step B: Add search using $or across title, category, and brand
    if (search) {
      filter.$or = [
        { title:    { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand:    { $regex: search, $options: "i" } }
      ]
    }

    // Step C: Pagination calculation
    const pageNumber  = parseInt(page)
    const limitNumber = parseInt(limit)
    const skip        = (pageNumber - 1) * limitNumber

    // Step D: Sort by Price
    const sortOption = {}

    if (sort === "asc") {
      sortOption.Price = 1
    }

    if (sort === "desc") {
      sortOption.Price = -1
    }

    // Step E: Run the final query
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .sort(sortOption)

    if (!products) {
      return res.status(404).send("No products found")
    }

    res.json(products)
  } catch (error) {
    res.status(401).json({ error: "Product Not Found" })
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

##  How to Run

```bash
node index.js
```

You should see:
```
Server running on port 5000
MongoDB Connected Successfully
```

---

## How to Test

First add test data using the bulk route in Postman:

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

Now test the search routes:

```
# Finds Samsung Galaxy S23 + Samsung TV (brand matches)
GET http://localhost:5000/products-search?search=samsung

# Finds all Apple products (brand matches)
GET http://localhost:5000/products-search?search=apple

# Finds "Dell Laptop" and "MacBook Pro" (title matches)
GET http://localhost:5000/search-title?search=laptop

# Search + filter by category
GET http://localhost:5000/products?search=samsung&category=smartphones

# Search + sort price low to high
GET http://localhost:5000/products?search=apple&sort=asc

# Filter + sort + pagination
GET http://localhost:5000/products?brand=Apple&sort=desc&page=1&limit=2
```

---

##  How `$or` Works Visually

```
Search term: "samsung"

$or checks each product:
  → Does category contain "samsung"?  ✅ match → include it
  → Does brand contain "samsung"?     ✅ match → include it

If EITHER condition is true → product is returned
If NEITHER is true → product is skipped
```

---

##  The Combined Route Breakdown

When you call `/products?search=apple&sort=asc&page=1&limit=2`:

```
filter = {}
↓
search = "apple"  → filter.$or = [title/category/brand regex for "apple"]
↓
page=1, limit=2   → skip = (1-1)*2 = 0
↓
sort = "asc"      → sortOption = { Price: 1 }
↓
Product.find(filter).skip(0).limit(2).sort({ Price: 1 })
```

---

##  What You Learned

- How `$regex` does partial text matching in MongoDB
- How `$options: "i"` makes search case-insensitive
- How `$or` searches across multiple fields at the same time
- The difference between single-field and multi-field search
- How to combine search + filter + sort + pagination in one route using step-by-step filter building

---

##  Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Single product added |
| `201` | OK — Multiple products / search results returned |
| `404` | Not Found — No products matched |
| `500` | Server Error — Something broke |

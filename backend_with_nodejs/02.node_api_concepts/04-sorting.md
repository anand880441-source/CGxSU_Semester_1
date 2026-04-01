#  Sorting 

 **Topic:** Sorting results by Price using `asc` and `desc` | **Database:** MongoDB + Mongoose

---



##  What Is Sorting?

Sorting arranges your results in a specific order. For example:
- Show products **cheapest first** → ascending order
- Show products **most expensive first** → descending order

---

##  How MongoDB Sorting Works

In Mongoose you chain `.sort()` after `.find()`. You pass it an object with the field name and a direction value:

```js
Product.find().sort({ Price: 1 })   // ascending  → 1000, 2000, 3000
Product.find().sort({ Price: -1 })  // descending → 3000, 2000, 1000
```

| Value | Direction |
|---|---|
| `1`  | Ascending — smallest first (1→10, A→Z) |
| `-1` | Descending — largest first (10→1, Z→A) |

---

##  Project Setup

### Step 1 — Create your project folder and initialize it

```bash
mkdir task-04-sorting
cd task-04-sorting
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

### Step 10 — Route: Sort Products by Price

We start with an empty `sortePrice` object. We check if `Price` is `"asc"` or `"desc"` and set the value to `1` or `-1` accordingly. If nothing is sent, `.sort({})` just returns products in their default order.

```js
app.get("/sortedproduct", async (req, res) => {
  try {
    const Price = req.query.Price

    const sortePrice = {}

    if (Price === "asc") {
      sortePrice.Price = 1
    }

    if (Price === "desc") {
      sortePrice.Price = -1
    }

    const products = await Product.find().sort(sortePrice)

    res.status(201).json(products)
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

##  How to Test

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

Now test sorting:

```
# Cheapest first → Sony Headphones (8000) comes first
GET http://localhost:5000/sortedproduct?Price=asc

# Most expensive first → MacBook Pro (120000) comes first
GET http://localhost:5000/sortedproduct?Price=desc

# No sort param → default order (insertion order)
GET http://localhost:5000/sortedproduct
```

---

##  How the Sort Object Builds Up

```js
// When Price = "asc"
sortePrice = {}
sortePrice.Price = 1
// sortePrice is now { Price: 1 }
// Product.find().sort({ Price: 1 }) → cheapest first

// When Price = "desc"
sortePrice = {}
sortePrice.Price = -1
// sortePrice is now { Price: -1 }
// Product.find().sort({ Price: -1 }) → most expensive first

// When Price is not sent
sortePrice = {}
// Product.find().sort({}) → default order, no sorting applied
```

---

##  Why Two Separate `if` Statements?

We use two separate `if` statements instead of `if / else if`. Both check for their own value independently. This is a clean and readable pattern — easy to extend if you later add more sort options like `title=asc`.

```js
if (Price === "asc")  { sortePrice.Price = 1  }
if (Price === "desc") { sortePrice.Price = -1 }
```

---

## ✅ What You Learned

- What ascending and descending order means
- How `.sort()` works in Mongoose with `1` and `-1`
- How to build a sort object dynamically using `if` checks
- How `asc` and `desc` strings map to `1` and `-1`
- How an empty `.sort({})` returns products in default order

---

## 🔢 Status Codes Reference

| Code | Meaning |
|---|---|
| `200` | OK — Product saved |
| `201` | Created — Sorted products returned |
| `404` | Not Found — Error occurred |
| `500` | Server Error — Something broke |

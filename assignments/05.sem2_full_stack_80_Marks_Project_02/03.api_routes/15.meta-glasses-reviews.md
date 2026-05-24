# Meta Glasses Reviews

GOOGLE DRIVE DATASET LINK: https://drive.google.com/file/d/1nQNBucieSkpd6ykgwNiqR0NCtKX5l6P1/view?usp=drive_link
---

# Basic CRUD Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/reviews` | Fetch all reviews |
| **GET** | `/reviews/:reviewID` | Fetch single review by ID |
| **POST** | `/reviews` | Create new review |
| **PUT** | `/reviews/:reviewID` | Replace complete review |
| **PATCH** | `/reviews/:reviewID/rating` | Update review rating |
| **DELETE** | `/reviews/:reviewID` | Delete review |
| **GET** | `/users` | Fetch all users |
| **GET** | `/countries` | Fetch all countries |
| **GET** | `/ratings` | Fetch ratings data |
| **GET** | `/verified` | Fetch verified reviews |

---

# Route Parameters

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/users/:name/reviews` | Fetch reviews by user |
| **GET** | `/country/:country/reviews` | Fetch reviews by country |
| **GET** | `/ratings/:rating` | Fetch reviews by rating |
| **GET** | `/verified/:status` | Fetch verified/unverified reviews |
| **GET** | `/reviews/title/:title` | Fetch reviews by title |
| **GET** | `/reviews/date/:date` | Fetch reviews by date |
| **GET** | `/reviews/helpful/:count` | Fetch reviews by helpful count |
| **GET** | `/reviews/positive/:status` | Fetch positive/negative reviews |
| **GET** | `/reviews/country/:country/rating/:rating` | Fetch country reviews by rating |
| **GET** | `/stats/user/:name` | Fetch user statistics |
| **GET** | `/stats/country/:country` | Fetch country statistics |
| **GET** | `/reviews/year/:year` | Fetch reviews by year |
| **GET** | `/reviews/month/:month` | Fetch reviews by month |
| **GET** | `/reviews/day/:day` | Fetch reviews by day |
| **GET** | `/reviews/user/:name/rating/:rating` | Fetch user reviews by rating |
| **GET** | `/reviews/country/:country/verified/:status` | Fetch verified country reviews |
| **GET** | `/reviews/helpfulness/:score` | Fetch reviews by helpfulness score |
| **GET** | `/reviews/profile/:profileID` | Fetch reviews by profile ID |
| **GET** | `/reviews/review-link/:reviewID` | Fetch review link |
| **GET** | `/reviews/image/:status` | Fetch reviews with/without images |
| **GET** | `/reviews/device/:deviceName` | Fetch reviews by device name |

---

# Query Parameters

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/reviews?rating=5` | Filter reviews by rating |
| **GET** | `/reviews?country=United States` | Filter reviews by country |
| **GET** | `/reviews?verifiedPurchase=True` | Fetch verified purchase reviews |
| **GET** | `/reviews?positive=1` | Fetch positive reviews |
| **GET** | `/reviews?minHelpful=100` | Fetch reviews above helpful count |
| **GET** | `/reviews?maxHelpful=500` | Fetch reviews below helpful count |
| **GET** | `/reviews?name=HebeZ&rating=4` | Filter reviews by user and rating |
| **GET** | `/reviews?country=USA&positive=1` | Fetch positive USA reviews |
| **GET** | `/reviews?sort=rating&order=desc` | Sort reviews by rating descending |
| **GET** | `/reviews?fields=name,rating,title` | Fetch selected review fields |
| **GET** | `/reviews?search=battery` | Search reviews containing battery |
| **GET** | `/reviews?contains=Meta` | Search reviews containing Meta |
| **GET** | `/reviews?exactRating=5` | Fetch exact 5-star reviews |
| **GET** | `/reviews?year=2025` | Fetch reviews by year |
| **GET** | `/reviews?month=12` | Fetch reviews by month |
| **GET** | `/reviews?day=25` | Fetch reviews by day |
| **GET** | `/reviews?title=Great` | Filter reviews by title |
| **GET** | `/reviews?minRating=3&maxRating=5` | Fetch reviews within rating range |
| **GET** | `/reviews?hasImage=true` | Fetch reviews containing images |
| **GET** | `/reviews?hasReviewText=true` | Fetch reviews with review text |
| **GET** | `/reviews?hasHelpful=true` | Fetch helpful reviews |
| **GET** | `/reviews?language=english` | Filter reviews by language |
| **GET** | `/reviews?keyword=AI&country=USA` | Search AI reviews in USA |
| **GET** | `/reviews?keyword=audio&rating=5` | Search audio reviews with 5-star rating |
| **GET** | `/reviews?verifiedPurchase=True&positive=1` | Fetch verified positive reviews |
| **GET** | `/reviews?date=2025-12-25` | Fetch reviews by exact date |
| **GET** | `/reviews?titleContains=smart` | Search titles containing smart |
| **GET** | `/reviews?reviewContains=battery` | Search review text containing battery |

---

# Pagination Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/reviews?page=1&limit=10` | Paginate reviews |
| **GET** | `/reviews?page=2&limit=5` | Fetch second page of reviews |
| **GET** | `/reviews/positive?page=1&limit=8` | Paginate positive reviews |
| **GET** | `/reviews/negative?page=1&limit=5` | Paginate negative reviews |
| **GET** | `/users?page=1&limit=10` | Paginate users |
| **GET** | `/countries?page=1&limit=5` | Paginate countries |
| **GET** | `/reviews/latest?page=1&limit=10` | Paginate latest reviews |
| **GET** | `/stats/reviews?page=1&limit=20` | Paginate review statistics |
| **GET** | `/reviews?page=10&limit=10` | Fetch tenth page of reviews |
| **GET** | `/reviews/helpful?page=1&limit=20` | Paginate helpful reviews |

---

# Sorting Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/reviews?sort=rating` | Sort reviews ascending by rating |
| **GET** | `/reviews?sort=-rating` | Sort reviews descending by rating |
| **GET** | `/reviews?sort=helpfulness_score` | Sort reviews by helpfulness |
| **GET** | `/reviews?sort=-helpful` | Sort reviews descending by helpful count |
| **GET** | `/reviews?sort=date` | Sort reviews by date |
| **GET** | `/reviews?sort=name` | Sort reviews by user name |
| **GET** | `/reviews?sort=country` | Sort reviews by country |
| **GET** | `/reviews?sort=verifiedPurchase` | Sort reviews by verification status |
| **GET** | `/reviews?sort=rating,-helpful` | Sort by rating and helpful count |
| **GET** | `/reviews?sort=country,date` | Sort by country and date |

---

# Combined Query + Pagination + Sorting

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/reviews?country=USA&page=1&limit=10&sort=-rating` | Fetch paginated USA reviews sorted by rating |
| **GET** | `/reviews?rating=5&page=2&limit=5` | Fetch paginated 5-star reviews |
| **GET** | `/reviews?positive=1&sort=helpful` | Fetch positive reviews sorted by helpfulness |
| **GET** | `/reviews?verifiedPurchase=True&page=1&limit=20` | Fetch paginated verified reviews |
| **GET** | `/reviews?keyword=AI&sort=-date` | Fetch latest AI reviews |
| **GET** | `/reviews?country=IND&rating=4&page=1&limit=10` | Fetch Indian 4-star reviews |

---

# Search Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/search?keyword=battery` | Search reviews containing battery |
| **GET** | `/search?keyword=camera` | Search reviews containing camera |
| **GET** | `/search?keyword=Meta AI` | Search Meta AI reviews |
| **GET** | `/search/title?keyword=Great` | Search review titles |
| **GET** | `/search/user?keyword=Karla` | Search reviews by user |
| **GET** | `/search/reviews?q=audio` | Search audio reviews |
| **GET** | `/search/reviews?q=video` | Search video reviews |
| **GET** | `/search/reviews?q=privacy` | Search privacy reviews |
| **GET** | `/search/country?q=United` | Search countries |
| **GET** | `/search/users?q=Scott` | Search users |

---

# Statistics Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/stats/average-rating` | Fetch average rating |
| **GET** | `/stats/highest-rating` | Fetch highest rating |
| **GET** | `/stats/lowest-rating` | Fetch lowest rating |
| **GET** | `/stats/country/:country` | Fetch country statistics |
| **GET** | `/stats/user/:name` | Fetch user statistics |
| **GET** | `/stats/positive-reviews` | Fetch positive reviews statistics |
| **GET** | `/stats/negative-reviews` | Fetch negative reviews statistics |
| **GET** | `/stats/top-reviewers` | Fetch top reviewers |
| **GET** | `/stats/most-helpful` | Fetch most helpful reviews |
| **GET** | `/stats/verified-purchases` | Fetch verified purchase statistics |

---

# Authentication Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/auth/register` | Register new user |
| **POST** | `/auth/login` | Login existing user |
| **POST** | `/auth/logout` | Logout authenticated user |
| **GET** | `/profile` | Fetch user profile |
| **PATCH** | `/profile` | Update user profile |
| **POST** | `/auth/forgot-password` | Request password reset |
| **POST** | `/auth/reset-password` | Reset forgotten password |
| **POST** | `/auth/refresh-token` | Refresh access token |
| **GET** | `/auth/me` | Fetch authenticated user |
| **DELETE** | `/auth/account` | Delete user account |

---

# JWT Authentication Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/jwt/profile` | Access JWT protected profile |
| **GET** | `/jwt/dashboard` | Access JWT protected dashboard |
| **POST** | `/jwt/generate-token` | Generate JWT token |
| **POST** | `/jwt/verify-token` | Verify JWT token |
| **POST** | `/jwt/refresh-token` | Refresh JWT token |
| **GET** | `/jwt/admin` | Access admin protected route |
| **GET** | `/jwt/user` | Access user protected route |
| **DELETE** | `/jwt/logout` | Logout JWT session |

---

# Middleware Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/admin/reviews` | Access admin reviews |
| **POST** | `/admin/reviews` | Admin create review |
| **DELETE** | `/admin/reviews/:reviewID` | Admin delete review |
| **PATCH** | `/admin/reviews/:reviewID` | Admin update review |
| **GET** | `/admin/dashboard` | Access admin dashboard |
| **GET** | `/protected/reviews` | Access protected reviews |
| **POST** | `/protected/reviews` | Create protected review |
| **DELETE** | `/protected/reviews/:reviewID` | Delete protected review |

---

# Error Handling Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/reviews/:reviewID` | Handle invalid review ID |
| **POST** | `/reviews` | Handle missing required fields |
| **PATCH** | `/reviews/:reviewID` | Handle invalid update data |
| **DELETE** | `/reviews/:reviewID` | Handle already deleted review |
| **GET** | `/admin/reviews` | Handle unauthorized access |
| **POST** | `/auth/login` | Handle invalid credentials |
| **POST** | `/reviews` | Handle duplicate review ID |
| **GET** | `/reviews/:reviewID` | Handle malformed ID |

---

# Request Validation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/reviews` | Validate rating between 1–5 |
| **POST** | `/reviews` | Validate minimum title length |
| **POST** | `/reviews` | Validate required review field |
| **POST** | `/reviews` | Validate verified purchase field |
| **POST** | `/reviews` | Validate review ID format |
| **POST** | `/reviews` | Validate country field |
| **PATCH** | `/reviews/:reviewID` | Prevent invalid field updates |
| **POST** | `/auth/register` | Validate strong password |

---

# API Rate Limiting

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/reviews` | Limit requests per minute |
| **POST** | `/auth/login` | Prevent brute force attacks |
| **POST** | `/auth/register` | Limit registration requests |
| **GET** | `/search` | Limit excessive searches |
| **GET** | `/admin/dashboard` | Strict admin rate limiting |
| **POST** | `/reviews` | Prevent spam review creation |
| **DELETE** | `/reviews/:reviewID` | Limit delete requests |
| **POST** | `/import/json` | Limit bulk uploads |

---


# Advance Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/reviews/top/highest-rated` | Fetch highest rated reviews |
| **GET** | `/reviews/top/lowest-rated` | Fetch lowest rated reviews |
| **GET** | `/stats/monthly-average` | Calculate monthly average rating |
| **GET** | `/compare?user1=HebeZ&user2=Karla` | Compare two users |
| **GET** | `/compare/rating?rating1=4&rating2=5` | Compare ratings |
| **GET** | `/reviews/random` | Fetch random review |
| **GET** | `/reviews/trending` | Fetch trending reviews |
| **GET** | `/reviews/recent` | Fetch recent reviews |
| **GET** | `/reviews/latest` | Fetch latest reviews |
| **GET** | `/health` | Check API health |
| **GET** | `/version` | Fetch API version |
| **GET** | `/reviews/ai-summary` | Generate AI review summary |
| **GET** | `/reviews/sentiment-analysis` | Analyze review sentiment |

---

# Good to Have Routes (HEAD & OPTIONS)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **HEAD** | `/reviews` | Fetch only headers for reviews collection |
| **HEAD** | `/reviews/:reviewID` | Fetch headers for single review resource |
| **HEAD** | `/stats/average-rating` | Check metadata for rating statistics |
| **HEAD** | `/auth/me` | Verify authenticated user session headers |
| **HEAD** | `/health` | Check API health status headers only |
| **OPTIONS** | `/reviews` | List supported methods for reviews route |
| **OPTIONS** | `/reviews/:reviewID` | List allowed methods for single review route |
| **OPTIONS** | `/auth/login` | Fetch allowed methods for login endpoint |
| **OPTIONS** | `/admin/reviews` | Check supported admin route methods |
| **OPTIONS** | `/search` | Fetch supported search endpoint methods |
| **OPTIONS** | `/jwt/profile` | Fetch JWT route communication options |
| **OPTIONS** | `/health` | Fetch API communication capabilities |


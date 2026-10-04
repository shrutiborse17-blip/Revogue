# REVOGUE • RESTful API Documentation

All API endpoints return and accept JSON. Base URL: `/api`.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new user account.
- **Request Body:**
  ```json
  {
    "full_name": "Aarav Mehta",
    "email": "aarav@example.com",
    "password": "password123",
    "phone": "+91 98230 66778",
    "city": "Pune",
    "state": "Maharashtra"
  }
  ```
- **Response (201):** `{ "success": true, "user": {...}, "token": "..." }`

### `POST /api/auth/login`
Authenticates a user via bcrypt password check.
- **Request Body:** `{ "email": "admin@revogue.demo", "password": "revogue123" }`
- **Response (200):** `{ "success": true, "user": {...}, "token": "..." }`

### `GET /api/auth/me`
Retrieves current authenticated session data using the Bearer token.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):** `{ "user": {...} }`

---

## 2. Products Endpoints

### `GET /api/products`
Query pre-loved products with filtering and sorting.
- **Query Parameters:**
  - `search` (string): matches title, brand, description
  - `category` (string / id): category slug or ID
  - `condition` (string): 'Like New', 'Excellent', 'Good', 'Fair'
  - `min_price` / `max_price` (number)
  - `sort` (string): `price_asc`, `price_desc`, `newest`, `score_desc`
  - `seller_id` (number): filter by specific seller
  - `creator_handle` (string): filter by creator closet
- **Response (200):** `{ "products": [...], "total": 60 }`

### `GET /api/products/:id`
Retrieves full details of a specific item, including gallery images, condition score metrics, seller trust breakdown, and similar products.
- **Response (200):** `{ "product": {...}, "similar": [...] }`

### `POST /api/products` (Authenticated)
Sellers list a new pre-loved product. Automatically queued for admin approval.
- **Request Body:**
  ```json
  {
    "title": "Zara Tailored Trench",
    "brand": "Zara",
    "category_id": 1,
    "description": "...",
    "original_price": 5990,
    "selling_price": 2450,
    "condition_grade": "Like New",
    "times_worn": 1,
    "why_selling": "Worn only a few times",
    "size": "M",
    "color": "Beige",
    "material": "Cotton Blend",
    "images": ["https://..."]
  }
  ```
- **Response (201):** `{ "success": true, "product": {...} }`

---

## 3. Cart & Wishlist Endpoints

### `GET /api/cart` (Authenticated)
- **Response (200):** `{ "items": [...], "summary": { "subtotal": 3200, "delivery_charge": 0, "platform_fee": 29, "total": 3229 } }`

### `POST /api/cart` (Authenticated)
Adds a product to user cart. Body: `{ "product_id": 6, "quantity": 1 }`.

### `DELETE /api/cart/:id` (Authenticated)
Removes an item from cart.

### `GET /api/wishlist` & `POST /api/wishlist` & `DELETE /api/wishlist/:productId`
Manages saved items.

---

## 4. Orders, Payments & Delivery Tracking

### `POST /api/orders` (Authenticated)
Places an order with address, payment simulation, and creates delivery timeline.
- **Request Body:**
  ```json
  {
    "delivery_address": {
      "recipient_name": "Ananya Deshmukh",
      "phone": "+91 98233 99887",
      "street_address": "Flat 402, Shivshrushti Apts",
      "city": "Nashik",
      "state": "Maharashtra",
      "pincode": "422005"
    },
    "payment_method": "UPI",
    "payment_details": { "upi_id": "ananya@oksbi" }
  }
  ```
- **Response (201):** `{ "order": {...}, "receipt": {...} }`

### `GET /api/orders` (Authenticated)
List buyer's placed orders or seller's incoming sales.

### `GET /api/orders/:id` (Authenticated)
Returns order with complete 7-step delivery tracking timeline and printable receipt data.

### `GET /api/delivery/:orderId`
Returns status of all 7 delivery milestones:
1. Order Confirmed
2. Seller Preparing
3. Ready for Pickup
4. Picked Up
5. In Transit
6. Out for Delivery
7. Delivered

---

## 5. Admin Endpoints (Admin Role Required)

### `GET /api/admin/analytics`
Returns total gross sales, commission earned (5%), seller payouts, active seller count, and category volume.

### `GET /api/admin/products/pending`
Returns queue of items awaiting moderation.

### `PUT /api/admin/products/:id/approve` & `PUT /api/admin/products/:id/reject`
Moderates listings.

### `PUT /api/admin/orders/:id/status`
Updates delivery milestone to simulate courier advancement.

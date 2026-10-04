# REVOGUE • Local Setup & Execution Guide

This guide details how to run the full-stack REVOGUE application locally for university viva and grading.

---

## Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PHP** (optional, for standalone Practical 12 & 13 demo): PHP 8.0+
- **MySQL** (optional for standalone database hosting; Express includes an embedded relational engine preloaded with 60+ products and 30 users for zero-configuration execution).

---

## 1. Quick Start (Vite + Express Full-Stack Server)

1. Clone or extract the project files into your working directory.
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

The application will start with full REST API routes mounted at `/api/*` and client routes managed by React.

---

## 2. Default Demo Credentials

You can log in manually or use the **Quick Demo Switcher** bar at the top of the header:

| Role | Demo Email | Demo Password | Purpose |
|---|---|---|---|
| **Administrator** | `admin@revogue.demo` | `revogue123` | View revenue analytics, approve/reject listings, control courier delivery statuses. |
| **Seller** | `seller@revogue.demo` | `revogue123` | Create pre-loved listings, view earnings (5% commission deducted), manage incoming orders. |
| **Buyer** | `buyer@revogue.demo` | `revogue123` | Browse catalog, add to cart/wishlist, test checkout, track 7-step delivery timeline, download receipt. |
| **Creator** | `fashionbyriya@revogue.demo` | `revogue123` | Influencer closet with verified badge, curated pieces, and stylist bio. |

---

## 3. Importing the MySQL Database into XAMPP / MySQL Workbench

1. Open **phpMyAdmin** (`http://localhost/phpmyadmin`) or MySQL Workbench.
2. Create a new database named `revogue_db` (or run `database/schema.sql`).
3. Import `database/schema.sql` to generate all 18 tables with primary/foreign keys.
4. Import `database/seed.sql` to populate 30+ users, 10+ categories, 60+ products, orders, delivery tracking, and reviews.

---

## 4. Running the Standalone PHP Module (Practicals 12 & 13)

To test the native PHP scripts:
```bash
php -S localhost:8000 -t php-demo/
```
Visit:
- Form Handling & String Manipulation: `http://localhost:8000/forms/contact.php`
- Session Management: `http://localhost:8000/sessions/login.php`
- Category MySQL CRUD: `http://localhost:8000/crud/categories.php`

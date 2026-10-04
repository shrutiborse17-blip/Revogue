# REVOGUE — "Give Good Things a Second Life."

> A realistic, professional, full-stack pre-loved fashion and lifestyle marketplace developed for a Third Year B.Tech Computer Engineering **Web Technology Laboratory (WTL)** course project.

[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Express%20%7C%20MySQL%20%7C%20PHP-blue.svg)](https://github.com)
[![WTL Practicals](https://img.shields.io/badge/WTL%20Syllabus-Practical%201%20to%2016%20Complete-green.svg)](docs/WTL_SYLLABUS_MAPPING.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-lightgrey.svg)](LICENSE)

---

## 🌟 Executive Summary & Concept

REVOGUE solves the fast-fashion problem by creating a circular resale ecosystem where quality items in excellent condition are re-loved rather than discarded. The application enables users to act simultaneously as both **Buyers** and **Sellers**, supported by an **Admin Moderation & Logistics Engine** and verified **Creator Closets**.

### Key Highlights
- **100% Relational Architecture**: 18 normalized tables with foreign keys and cascade integrity in `database/schema.sql`.
- **Pre-Seeded Dataset**: 30+ realistic users (Mumbai, Pune, Nashik), 10+ categories, 60+ pre-loved products with realistic INR pricing and condition badges in `database/seed.sql`.
- **Unique REVOGUE Features**:
  - *Revogue Condition Score* (0–100 algorithm based on usage frequency, material integrity, and age).
  - *Seller Trust Score* (Verified badges, cancellation rate, transaction count).
  - *"Why Are You Selling?"* transparency badge on every listing.
  - *Creator Closets* (@fashionbyriya, @kabirstreetwear, @kavyastylenotes).
  - *Revogue Match* questionnaire recommendation engine (zero paid AI dependencies).
  - *Estimated Revogue Sustainability Impact* (estimated water liters saved and carbon offset).
  - *7-Step Delivery Timeline* with live checkpoint progression.
  - *Printable Transaction Receipts* with itemized GST and platform commission breakdown.
- **WTL Syllabus Fulfillment**: Full 16-practical mapping (`docs/WTL_SYLLABUS_MAPPING.md`) plus a dedicated native PHP demonstration folder (`php-demo/`).

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion.
- **Backend**: Node.js, Express.js REST API with JSON body parsing, bcryptjs password hashing, JWT/token verification.
- **Database**: MySQL 8.0+ Schema (`database/schema.sql`) + Embedded relational database store for instant preview.
- **PHP Module**: Native PHP scripts demonstrating form validation, string manipulation, session handling, and MySQL PDO CRUD (`php-demo/`).

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack dev server
npm run dev

# 3. Access in browser
http://localhost:3000
```

### Demo Accounts
- **Admin**: `admin@revogue.demo` (Password: `revogue123`)
- **Seller**: `seller@revogue.demo` (Password: `revogue123`)
- **Buyer**: `buyer@revogue.demo` (Password: `revogue123`)
- **Creator**: `fashionbyriya@revogue.demo` (Password: `revogue123`)
*(Use the convenient 1-Click Quick Demo Bar in the header during viva presentations!)*

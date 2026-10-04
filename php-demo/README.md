# REVOGUE - PHP Module (WTL Practicals 12 & 13)

This standalone folder contains native PHP scripts prepared specifically to fulfill the **University B.Tech Web Technology Laboratory (WTL)** syllabus requirements.

---

## Syllabus Practical Mappings

### Practical 12: PHP Form Handling, Input Validation, and String Manipulation
- **File:** `php-demo/forms/contact.php`
- **Concepts Demonstrated:**
  1. `$_POST` form submission handling
  2. Input sanitization (`trim`, `stripslashes`, `htmlspecialchars`)
  3. Form validation rules:
     - Required field checks (`empty()`)
     - Regular expression pattern matching (`preg_match` for alphabets)
     - Standard email verification (`filter_var(..., FILTER_VALIDATE_EMAIL)`)
     - Minimum length validation (`strlen`)
  4. String manipulation functions:
     - `ucwords()` and `strtolower()` for Title Casing
     - `strtoupper()`
     - `str_word_count()`
     - `substr()` and `explode()` for email masking
     - `md5()`, `uniqid()` for unique ticket slug generation
     - `nl2br()` for line breaks

- **File:** `php-demo/sessions/login.php`
- **Concepts Demonstrated:**
  1. `session_start()` initialization
  2. Storing user state in `$_SESSION['user_name']`, `$_SESSION['user_role']`, etc.
  3. Session fixation defense using `session_regenerate_id(true)`
  4. Explicit session termination and cookie clearing (`session_destroy()`)

---

### Practical 13: PHP + MySQL Database Connectivity & CRUD
- **File:** `php-demo/crud/categories.php`
- **Concepts Demonstrated:**
  1. PHP Data Objects (PDO) connection with connection options (`ATTR_ERRMODE => ERRMODE_EXCEPTION`)
  2. Prepared statements with named parameters to defend against **SQL Injection**
  3. **CREATE**: `INSERT INTO categories (category_name, slug, description, icon) VALUES (:name, :slug, :desc, :icon)`
  4. **READ**: `SELECT * FROM categories ORDER BY category_id ASC` with `fetchAll()`
  5. **UPDATE**: Parameterized update queries
  6. **DELETE**: `DELETE FROM categories WHERE category_id = :id`

---

## How to Run the PHP Scripts Locally

### Option 1: Native PHP Built-in Server (Zero Configuration)
Run from the root of this repository:
```bash
php -S localhost:8000 -t php-demo/
```
Then navigate to:
- `http://localhost:8000/forms/contact.php`
- `http://localhost:8000/sessions/login.php`
- `http://localhost:8000/crud/categories.php`

### Option 2: XAMPP / WAMP / LAMP
1. Copy the `php-demo/` folder into your `htdocs` or `www` directory.
2. Start Apache and MySQL services in the XAMPP Control Panel.
3. Import `database/schema.sql` and `database/seed.sql` in phpMyAdmin (`http://localhost/phpmyadmin`).
4. Access via browser: `http://localhost/php-demo/crud/categories.php`.

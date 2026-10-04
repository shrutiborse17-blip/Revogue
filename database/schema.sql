-- =====================================================================
-- REVOGUE - Pre-loved Fashion & Lifestyle Marketplace
-- Enterprise Relational Database Specification (MySQL 8.0+)
-- =====================================================================

DROP DATABASE IF EXISTS revogue_db;
CREATE DATABASE revogue_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE revogue_db;

-- ---------------------------------------------------------------------
-- 1. Roles Table
-- ---------------------------------------------------------------------
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. Users Table
-- ---------------------------------------------------------------------
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    city VARCHAR(100) DEFAULT 'Mumbai',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    role_id INT NOT NULL DEFAULT 1,
    is_seller BOOLEAN DEFAULT FALSE,
    is_creator BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT,
    INDEX idx_user_email (email),
    INDEX idx_user_city (city)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. Seller Profiles Table
-- ---------------------------------------------------------------------
CREATE TABLE seller_profiles (
    seller_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    store_name VARCHAR(100) NOT NULL,
    bio TEXT,
    trust_score INT DEFAULT 90,
    rating DECIMAL(3, 2) DEFAULT 4.80,
    total_sales INT DEFAULT 0,
    cancellation_rate DECIMAL(4, 2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT TRUE,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    pending_payout DECIMAL(10, 2) DEFAULT 0.00,
    upi_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_seller_rating (rating)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. Creator Profiles Table (Creator Closets)
-- ---------------------------------------------------------------------
CREATE TABLE creator_profiles (
    creator_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    handle VARCHAR(50) NOT NULL UNIQUE,
    social_bio TEXT,
    followers_count VARCHAR(20) DEFAULT '45.2K',
    featured_badge VARCHAR(100) DEFAULT 'Top Stylist',
    cover_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. Categories Table
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. Products Table
-- ---------------------------------------------------------------------
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    discount_pct INT GENERATED ALWAYS AS (ROUND(((original_price - selling_price) / original_price) * 100)) STORED,
    condition_grade ENUM('Like New', 'Excellent', 'Good', 'Fair') NOT NULL DEFAULT 'Excellent',
    condition_score INT NOT NULL DEFAULT 90, -- Revogue Condition Score (0-100)
    times_worn INT DEFAULT 2,
    why_selling VARCHAR(150) NOT NULL DEFAULT 'Worn only a few times',
    size VARCHAR(30) DEFAULT 'M',
    color VARCHAR(50) DEFAULT 'Black',
    material VARCHAR(100) DEFAULT 'Cotton',
    target_gender ENUM('Women', 'Men', 'Unisex', 'Kids') DEFAULT 'Unisex',
    location VARCHAR(100) DEFAULT 'Mumbai, MH',
    is_available BOOLEAN DEFAULT TRUE,
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    INDEX idx_prod_status (approval_status, is_available),
    INDEX idx_prod_category (category_id),
    INDEX idx_prod_brand (brand),
    INDEX idx_prod_price (selling_price)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. Product Images Table
-- ---------------------------------------------------------------------
CREATE TABLE product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_prod_img (product_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. Wishlists Table
-- ---------------------------------------------------------------------
CREATE TABLE wishlists (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_product_wishlist (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. Cart Items Table
-- ---------------------------------------------------------------------
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_product_cart (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. Addresses Table
-- ---------------------------------------------------------------------
CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street_address TEXT NOT NULL,
    landmark VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    address_type ENUM('Home', 'Office', 'Other') DEFAULT 'Home',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. Orders Table
-- ---------------------------------------------------------------------
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    buyer_id INT NOT NULL,
    delivery_address_id INT,
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) DEFAULT 79.00,
    platform_fee DECIMAL(10, 2) DEFAULT 29.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status ENUM('Order Confirmed', 'Seller Preparing', 'Ready for Pickup', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Order Confirmed',
    payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (delivery_address_id) REFERENCES addresses(address_id) ON DELETE SET NULL,
    INDEX idx_order_buyer (buyer_id),
    INDEX idx_order_status (order_status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 12. Order Items Table
-- ---------------------------------------------------------------------
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    seller_id INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    platform_commission_pct DECIMAL(5, 2) DEFAULT 5.00,
    platform_commission_amount DECIMAL(10, 2) NOT NULL,
    seller_earnings DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_order_items_seller (seller_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 13. Payments Table
-- ---------------------------------------------------------------------
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    transaction_ref VARCHAR(100) NOT NULL UNIQUE,
    payment_method ENUM('UPI', 'Card', 'COD', 'NetBanking') DEFAULT 'UPI',
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Success', 'Pending', 'Failed') DEFAULT 'Success',
    payment_gateway_response TEXT,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 14. Delivery Tracking Table
-- ---------------------------------------------------------------------
CREATE TABLE delivery_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status_step VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    location_checkpoint VARCHAR(150),
    is_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    INDEX idx_tracking_order (order_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 15. Reviews Table
-- ---------------------------------------------------------------------
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    order_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    seller_id INT NOT NULL,
    product_rating INT NOT NULL CHECK (product_rating BETWEEN 1 AND 5),
    seller_rating INT NOT NULL CHECK (seller_rating BETWEEN 1 AND 5),
    comment TEXT,
    condition_matched BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_review_prod (product_id),
    INDEX idx_review_seller (seller_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 16. Notifications Table
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order', 'approval', 'delivery', 'payout', 'review', 'system') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    link_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id, is_read)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 17. Reports Table
-- ---------------------------------------------------------------------
CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    product_id INT,
    seller_id INT,
    reason ENUM('Counterfeit / Fake', 'Misleading Description', 'Condition Discrepancy', 'Inappropriate Content', 'Suspicious Seller', 'Other') NOT NULL,
    details TEXT,
    status ENUM('Pending Review', 'Investigating', 'Resolved', 'Dismissed') DEFAULT 'Pending Review',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 18. Platform Settings Table
-- ---------------------------------------------------------------------
CREATE TABLE platform_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

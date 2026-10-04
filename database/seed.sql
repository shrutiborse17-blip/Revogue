-- =====================================================================
-- REVOGUE - Pre-loved Fashion & Lifestyle Marketplace
-- Database: Realistic Seed Data (30+ Users, 10+ Categories, 60+ Products)
-- =====================================================================

USE revogue_db;

-- ---------------------------------------------------------------------
-- 1. Insert Roles
-- ---------------------------------------------------------------------
INSERT INTO roles (role_id, role_name, description) VALUES
(1, 'User', 'Standard user who can buy and sell pre-loved fashion'),
(2, 'Admin', 'Platform administrator with moderation and analytics access'),
(3, 'Creator', 'Verified creator/stylist with a featured Creator Closet');

-- ---------------------------------------------------------------------
-- 2. Insert Platform Settings
-- ---------------------------------------------------------------------
INSERT INTO platform_settings (setting_key, setting_value, description) VALUES
('platform_commission_pct', '5.0', 'Percentage commission deducted per sale'),
('flat_delivery_charge', '79.0', 'Standard buyer shipping fee in INR'),
('min_free_delivery_subtotal', '1999.0', 'Threshold for free shipping in INR'),
('platform_fee', '29.0', 'Revogue quality inspection and buyer protection fee in INR'),
('active_sellers_count', '18', 'Cache of active approved sellers');

-- ---------------------------------------------------------------------
-- 3. Insert Users (30+ realistic users with Indian names & cities)
-- Default bcrypt hash for 'revogue123'
-- ---------------------------------------------------------------------
INSERT INTO users (user_id, full_name, email, password_hash, phone, avatar_url, city, state, role_id, is_seller, is_creator) VALUES
(1, 'Admin Controller', 'admin@revogue.demo', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98200 11223', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Mumbai', 'Maharashtra', 2, TRUE, FALSE),
(2, 'Priya Sharma (@fashionbyriya)', 'fashionbyriya@revogue.demo', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98221 44556', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 'Bandra, Mumbai', 'Maharashtra', 3, TRUE, TRUE),
(3, 'Aarav Mehta', 'seller@revogue.demo', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98230 66778', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Kothrud, Pune', 'Maharashtra', 1, TRUE, FALSE),
(4, 'Ananya Deshmukh', 'buyer@revogue.demo', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98233 99887', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'College Road, Nashik', 'Maharashtra', 1, FALSE, FALSE),
(5, 'Rohan Kulkarni', 'rohan.kulkarni@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98244 11224', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'FC Road, Pune', 'Maharashtra', 1, TRUE, FALSE),
(6, 'Neha Joshi', 'neha.joshi@outlook.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98255 33445', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'Vile Parle, Mumbai', 'Maharashtra', 1, TRUE, FALSE),
(7, 'Tanvi Patil', 'tanvi.patil@yahoo.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98266 55667', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80', 'Gangapur Road, Nashik', 'Maharashtra', 1, TRUE, FALSE),
(8, 'Kabir Kapoor', 'kabir.kapoor@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98277 77889', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80', 'Juhu, Mumbai', 'Maharashtra', 3, TRUE, TRUE),
(9, 'Siddhi Shinde', 'siddhi.shinde@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98288 88990', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', 'Aundh, Pune', 'Maharashtra', 1, TRUE, FALSE),
(10, 'Aditya Rao', 'aditya.rao@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98299 12345', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', 'Worli, Mumbai', 'Maharashtra', 1, TRUE, FALSE),
(11, 'Kavya Nair', 'kavya.nair@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98311 23456', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80', 'Koregaon Park, Pune', 'Maharashtra', 3, TRUE, TRUE),
(12, 'Varun Chopra', 'varun.chopra@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98322 34567', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', 'Lokhandwala, Mumbai', 'Maharashtra', 1, TRUE, FALSE),
(13, 'Pooja Bhatt', 'pooja.bhatt@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98333 45678', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80', 'Mahatma Nagar, Nashik', 'Maharashtra', 1, FALSE, FALSE),
(14, 'Gaurav Verma', 'gaurav.verma@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98344 56789', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', 'Powai, Mumbai', 'Maharashtra', 1, TRUE, FALSE),
(15, 'Meera Iyer', 'meera.iyer@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98355 67890', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 'Kalyan Nagar, Pune', 'Maharashtra', 1, TRUE, FALSE),
(16, 'Devansh Sen', 'devansh.sen@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98366 78901', 'https://images.unsplash.com/photo-1492446845049-9c50ce313d00?auto=format&fit=crop&w=400&q=80', 'Thane West, Mumbai', 'Maharashtra', 1, FALSE, FALSE),
(17, 'Rituja Salunke', 'rituja.salunke@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98377 89012', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80', 'Indira Nagar, Nashik', 'Maharashtra', 1, TRUE, FALSE),
(18, 'Yashwant Kale', 'yashwant.kale@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98388 90123', 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=400&q=80', 'Baner, Pune', 'Maharashtra', 1, TRUE, FALSE),
(19, 'Ishani Das', 'ishani.das@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98399 01234', 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80', 'Chembur, Mumbai', 'Maharashtra', 1, FALSE, FALSE),
(20, 'Samarth More', 'samarth.more@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98400 12345', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80', 'Deccan, Pune', 'Maharashtra', 1, TRUE, FALSE),
(21, 'Shruti Borse', 'shrutiborse2006@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98411 23456', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Nashik Road, Nashik', 'Maharashtra', 1, TRUE, FALSE),
(22, 'Nikhil Jadhav', 'nikhil.jadhav@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98422 34567', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', 'Dadar, Mumbai', 'Maharashtra', 1, FALSE, FALSE),
(23, 'Pranali Khare', 'pranali.khare@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98433 45678', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'Erandwane, Pune', 'Maharashtra', 1, TRUE, FALSE),
(24, 'Kunal Singhania', 'kunal.singhania@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98444 56789', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80', 'Colaba, Mumbai', 'Maharashtra', 1, TRUE, FALSE),
(25, 'Sneha Gaikwad', 'sneha.gaikwad@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98455 67890', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', 'Panchavati, Nashik', 'Maharashtra', 1, FALSE, FALSE),
(26, 'Saurabh Tandon', 'saurabh.tandon@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98466 78901', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80', 'Viman Nagar, Pune', 'Maharashtra', 1, TRUE, FALSE),
(27, 'Trisha Roy', 'trisha.roy@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98477 89012', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', 'Santacruz, Mumbai', 'Maharashtra', 1, TRUE, FALSE),
(28, 'Tejas Chavan', 'tejas.chavan@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98488 90123', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Shivajinagar, Pune', 'Maharashtra', 1, FALSE, FALSE),
(29, 'Aishwarya Sawant', 'aishwarya.sawant@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98499 01234', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 'Andheri West, Mumbai', 'Maharashtra', 1, TRUE, FALSE),
(30, 'Vikramaditya Solanki', 'vikram.solanki@gmail.com', '$2a$10$wK1k6xZqjB9l8eO3yQeNee.8uW6V1uP6h3n9B4m9Z5w2X0k5l4e2a', '+91 98500 11234', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Govind Nagar, Nashik', 'Maharashtra', 1, TRUE, FALSE);

-- ---------------------------------------------------------------------
-- 4. Insert Seller Profiles
-- ---------------------------------------------------------------------
INSERT INTO seller_profiles (seller_id, user_id, store_name, bio, trust_score, rating, total_sales, cancellation_rate, is_verified, total_earnings, pending_payout, upi_id) VALUES
(1, 2, 'Riya Closet & Curations', 'Fashion influencer & stylist. Selling curated wardrobe pieces, festive wear, and luxury accessories.', 98, 4.95, 126, 0.50, TRUE, 184500.00, 12400.00, 'riya.sharma@okaxis'),
(2, 3, 'Aarav Minimalist Edit', 'Curator of premium men sneakers, jackets, and smart casuals. All items handled with extreme care.', 94, 4.82, 42, 1.20, TRUE, 64200.00, 5200.00, 'aarav.mehta@oksbi'),
(3, 5, 'Rohan Vintage & Denim', 'Vintage streetwear collector from Pune. Authentic Levi’s, jackets, and classic sneakers.', 92, 4.75, 29, 2.00, TRUE, 38900.00, 3100.00, 'rohan.kulkarni@okicici'),
(4, 6, 'Neha Luxury Archive', 'Rehoming authentic watches, branded evening bags, and festive Indian ensembles worn once.', 96, 4.90, 68, 0.80, TRUE, 112000.00, 8900.00, 'neha.joshi@okhdfc'),
(5, 7, 'Tanvi Festive Vault', 'Traditional sarees, designer dupattas, and handcrafted jhumkas from Nashik vineyards.', 91, 4.78, 24, 1.50, TRUE, 31400.00, 2400.00, 'tanvi.patil@okaxis'),
(6, 8, 'Kabir Street & Hype', 'Sneakerhead and streetwear enthusiast. Verified authentic kicks and streetwear hoodies.', 97, 4.92, 85, 0.90, TRUE, 142800.00, 11500.00, 'kabir.kapoor@okkotak'),
(7, 9, 'Siddhi Eco Wardrobe', 'Sustainable living advocate. Linen shirts, organic dresses, and minimalist accessories.', 93, 4.80, 33, 1.10, TRUE, 42100.00, 4200.00, 'siddhi.shinde@oksbi'),
(8, 10, 'Aditya Watch & Time', 'Horology enthusiast. Timex, Fossil, Seiko, and smartwatches rotated frequently.', 95, 4.88, 51, 1.00, TRUE, 89500.00, 7100.00, 'aditya.rao@okicici'),
(9, 11, 'Kavya Chic Thrift', 'Stylist curated contemporary dresses, trench coats, and chic evening tops from Pune.', 97, 4.93, 94, 0.60, TRUE, 134200.00, 9800.00, 'kavya.nair@okhdfc'),
(10, 12, 'Varun Leather & Boots', 'Handmade leather boots, wallets, and durable leather jackets.', 90, 4.70, 19, 2.50, TRUE, 28700.00, 1900.00, 'varun.chopra@okaxis'),
(11, 14, 'Gaurav Athletic Zone', 'Gym wear, Nike running jackets, and dry-fit essentials.', 89, 4.65, 16, 2.80, TRUE, 19800.00, 1600.00, 'gaurav.verma@oksbi'),
(12, 15, 'Meera Designer Lehengas', 'Bridal and reception wear, worn for single family functions.', 95, 4.86, 38, 1.00, TRUE, 96000.00, 6800.00, 'meera.iyer@okicici'),
(13, 17, 'Rituja Handcrafted Gems', 'Handmade brass jewellery, silver chokers, and boho rings.', 92, 4.76, 27, 1.80, TRUE, 33500.00, 2800.00, 'rituja.salunke@okaxis'),
(14, 18, 'Yashwant Casuals', 'Polo t-shirts, chinos, and casual loafers in pristine condition.', 88, 4.60, 14, 3.00, TRUE, 16200.00, 1200.00, 'yashwant.kale@okhdfc'),
(15, 20, 'Samarth Travel & Bags', 'Duffel bags, Samsonite backpacks, and leather laptop sleeves.', 93, 4.82, 31, 1.40, TRUE, 44000.00, 3900.00, 'samarth.more@oksbi');

-- ---------------------------------------------------------------------
-- 5. Insert Creator Profiles (Creator Closets)
-- ---------------------------------------------------------------------
INSERT INTO creator_profiles (creator_id, user_id, handle, social_bio, followers_count, featured_badge, cover_image) VALUES
(1, 2, '@fashionbyriya', 'Editorial Stylist & Content Creator • Featured in Vogue India • Rehoming archive luxury & festive pieces', '142K', 'Featured Stylist', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'),
(2, 8, '@kabirstreetwear', 'Sneakerhead & Street Culture Photographer • Rotating verified authentic kicks & oversized silhouettes', '89K', 'Hype Curator', 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80'),
(3, 11, '@kavyastylenotes', 'Minimalist capsule wardrobe enthusiast • Giving quality sustainable essentials a loving second chapter', '115K', 'Capsule Wardrobe Icon', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80');

-- ---------------------------------------------------------------------
-- 6. Insert Categories (10 distinct categories)
-- ---------------------------------------------------------------------
INSERT INTO categories (category_id, category_name, slug, description, icon, image_url) VALUES
(1, 'Clothing', 'clothing', 'Pre-loved designer shirts, dresses, denim, jackets, and everyday wear', 'Shirt', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80'),
(2, 'Footwear', 'footwear', 'Sneakers, formal oxfords, heels, loafers, and Chelsea boots', 'Footprints', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80'),
(3, 'Jewellery', 'jewellery', 'Earrings, necklaces, silver chokers, bracelets, and artisanal rings', 'Sparkles', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80'),
(4, 'Watches', 'watches', 'Analog chronographs, automatic timepieces, and premium digital watches', 'Watch', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80'),
(5, 'Bags', 'bags', 'Structured leather totes, backpacks, sling bags, and laptop sleeves', 'Briefcase', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80'),
(6, 'Accessories', 'accessories', 'Designer sunglasses, Italian leather belts, silk scarves, and caps', 'Glasses', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80'),
(7, 'Ethnic Wear', 'ethnic-wear', 'Handloom sarees, festive kurta sets, and celebration sherwanis', 'Crown', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'),
(8, 'Luxury Vintage', 'luxury-vintage', 'Rare vintage pieces, collectible apparel, and archival treasures', 'Gem', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80'),
(9, 'Denim & Outerwear', 'denim-outerwear', 'Biker leather jackets, denim trucker coats, and warm fleece hoodies', 'Layers', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'),
(10, 'Activewear', 'activewear', 'High-performance gym wear, dry-fit tracks, and running windbreakers', 'Zap', 'https://images.unsplash.com/photo-1483721074577-83216890f915?auto=format&fit=crop&w=600&q=80');

-- ---------------------------------------------------------------------
-- 7. Insert 60+ Realistic Products with Indian Pricing (INR), Condition Badges, Scores
-- ---------------------------------------------------------------------
INSERT INTO products (product_id, seller_id, category_id, title, brand, description, original_price, selling_price, condition_grade, condition_score, times_worn, why_selling, size, color, material, target_gender, location, is_available, approval_status, view_count) VALUES
-- Creator Products (@fashionbyriya - user_id 2)
(1, 2, 1, 'ZARA Tailored Double-Breasted Blazer', 'Zara', 'Immaculate cream tailored blazer. Only worn once for an indoor fashion panel discussion. Features tortoiseshell buttons and premium structured shoulders.', 5990.00, 2450.00, 'Like New', 98, 1, 'Worn only a few times', 'M', 'Cream / Off-White', 'Polyester Blend', 'Women', 'Bandra, Mumbai', TRUE, 'approved', 342),
(2, 2, 7, 'Raw Mango Chanderi Silk Saree', 'Raw Mango', 'Authentic handwoven emerald green Chanderi silk saree with zari border. Worn for 3 hours at a Diwali gathering. Dry-cleaned and stored in muslin.', 18500.00, 7900.00, 'Like New', 99, 1, 'Occasion-specific', 'Free Size', 'Emerald Green', 'Chanderi Silk', 'Women', 'Bandra, Mumbai', TRUE, 'approved', 612),
(3, 2, 5, 'Coach Signature Jacquard Camera Bag', 'Coach', 'Authentic Coach mini camera bag in tan coated canvas with gold hardware. Comes with original dustbag and purchase tag. Absolutely zero scratches.', 24000.00, 10500.00, 'Like New', 97, 2, 'Wardrobe refresh', 'One Size', 'Tan / Brown', 'Coated Canvas & Leather', 'Women', 'Bandra, Mumbai', TRUE, 'approved', 428),
(4, 2, 3, 'Tribe Amrapali Silver Tribal Jhumkas', 'Tribe Amrapali', 'Pure 92.5 hallmarked sterling silver tribal jhumkas with oxidation finish. Worn twice for festive shoot.', 6500.00, 2900.00, 'Excellent', 94, 2, 'Bought but rarely used', 'One Size', 'Antique Silver', '925 Sterling Silver', 'Women', 'Bandra, Mumbai', TRUE, 'approved', 189),
(5, 2, 1, 'Massimo Dutti Pleated Midi Dress', 'Massimo Dutti', 'Flowy pleated terracotta midi dress with tie waist belt. Lightweight fabric ideal for brunch or evening cocktails.', 8990.00, 3600.00, 'Like New', 96, 2, 'No longer fits', 'S', 'Terracotta', 'Viscose Silk Blend', 'Women', 'Bandra, Mumbai', TRUE, 'approved', 290),

-- Aarav Mehta (user_id 3)
(6, 3, 2, 'Nike Air Jordan 1 Retro High OG "Chicago"', 'Nike', 'Legendary colorway. 100% authentic with original box and extra laces. Soles have minimal heel drag, uppers are crisp and creaseless.', 16995.00, 8900.00, 'Excellent', 93, 4, 'Wardrobe refresh', 'UK 9 / EU 43', 'Red / White / Black', 'Full Grain Leather', 'Men', 'Kothrud, Pune', TRUE, 'approved', 850),
(7, 3, 9, 'Levi’s Premium Vintage Sherpa Trucker Jacket', 'Levi’s', 'Classic medium wash denim trucker jacket lined with warm sherpa fleece. Kept in pristine condition, no stains or fading.', 7999.00, 3200.00, 'Excellent', 92, 3, 'No longer fits', 'L', 'Indigo Blue', '100% Heavy Cotton Denim', 'Men', 'Kothrud, Pune', TRUE, 'approved', 410),
(8, 3, 1, 'Uniqlo Supima Cotton Relaxed Fit Shirts (Set of 2)', 'Uniqlo', 'Two crisp Supima cotton button-down shirts in White and Sky Blue. High thread count, iron-friendly finish.', 3980.00, 1550.00, 'Like New', 95, 2, 'Worn only a few times', 'M', 'White & Sky Blue', '100% Supima Cotton', 'Men', 'Kothrud, Pune', TRUE, 'approved', 245),
(9, 3, 4, 'Fossil Grant Chronograph Leather Watch', 'Fossil', 'Roman numeral navy dial with rose gold accents and genuine brown leather strap. Battery recently replaced by Fossil service center.', 12495.00, 4800.00, 'Excellent', 91, 5, 'Bought but rarely used', '44mm', 'Navy Blue & Rose Gold', 'Stainless Steel & Leather', 'Men', 'Kothrud, Pune', TRUE, 'approved', 315),
(10, 3, 6, 'Ray-Ban Classic Aviator Sunglasses (RB3025)', 'Ray-Ban', 'Gold metal frames with polarized G-15 green lenses. Made in Italy. Comes with original leather case and cleaning cloth.', 9890.00, 4200.00, 'Like New', 96, 2, 'No longer my style', 'Standard 58mm', 'Gold / Green', 'Metal Alloy', 'Unisex', 'Kothrud, Pune', TRUE, 'approved', 520),

-- Rohan Kulkarni (user_id 5)
(11, 5, 9, 'Zara Faux Leather Biker Jacket with Asymmetric Zip', 'Zara Man', 'Heavyweight vegan leather moto jacket with silver hardware and zip pockets. Rocker silhouette, spotless lining.', 6990.00, 2750.00, 'Excellent', 90, 3, 'No longer fits', 'XL', 'Matte Black', 'Polyurethane Leather', 'Men', 'FC Road, Pune', TRUE, 'approved', 230),
(12, 5, 2, 'Adidas Originals Stan Smith Classic White & Green', 'Adidas', 'Timeless tennis shoe. White leather with iconic green heel tab. Ortholite insoles clean and fresh.', 7999.00, 3100.00, 'Good', 86, 6, 'Wardrobe refresh', 'UK 8.5', 'Cloud White / Green', 'Leather', 'Unisex', 'FC Road, Pune', TRUE, 'approved', 380),
(13, 5, 1, 'H&M Relaxed Fit Heavy Knit Sweater', 'H&M', 'Chunky cable knit sweater in oatmeal heather. Warm, cozy, and zero pilling.', 2999.00, 1150.00, 'Like New', 95, 2, 'Worn only a few times', 'L', 'Oatmeal', 'Wool Acrylic Blend', 'Men', 'FC Road, Pune', TRUE, 'approved', 195),
(14, 5, 10, 'Under Armour HeatGear Compression T-Shirt', 'Under Armour', 'Moisture wicking athletic tee for gym training. Flexible 4-way stretch fabric.', 2499.00, 890.00, 'Excellent', 92, 3, 'No longer fits', 'L', 'Anthracite Grey', 'Elastane Poly Blend', 'Men', 'FC Road, Pune', TRUE, 'approved', 140),

-- Neha Joshi (user_id 6)
(15, 6, 5, 'Michael Kors Mercer Accordion Leather Tote', 'Michael Kors', 'Pebbled leather tote bag in soft blush pink with silver padlock charm. Spacious dual compartment with center zip.', 28500.00, 11900.00, 'Like New', 97, 2, 'Occasion-specific', 'Medium', 'Blush Pink', '100% Saffiano Leather', 'Women', 'Vile Parle, Mumbai', TRUE, 'approved', 720),
(16, 6, 4, 'Daniel Wellington Classic Petite Melrose Watch', 'Daniel Wellington', 'Eggshell white dial with rose gold mesh strap. Ultra-thin 6mm case. Elegant daily luxury timepiece.', 14499.00, 5200.00, 'Like New', 96, 3, 'Wardrobe refresh', '28mm', 'Rose Gold', 'Stainless Steel Mesh', 'Women', 'Vile Parle, Mumbai', TRUE, 'approved', 490),
(17, 6, 7, 'Anita Dongre Printed Georgette Anarkali', 'Anita Dongre Grassroot', 'Exquisite floral printed floor-length Anarkali suit with embroidered dupatta. Worn to brother’s engagement.', 26000.00, 9800.00, 'Like New', 98, 1, 'Occasion-specific', 'M', 'Powder Blue', 'Pure Georgette & Mulmul', 'Women', 'Vile Parle, Mumbai', TRUE, 'approved', 580),
(18, 6, 2, 'Steve Madden Irenee Block Heel Sandals', 'Steve Madden', 'Comfortable 2-inch block heel strap sandals in nude suede. Padded footbed, great for weddings or formal dinners.', 6999.00, 2600.00, 'Excellent', 91, 2, 'No longer my style', 'EU 38', 'Nude / Beige', 'Suede Leather', 'Women', 'Vile Parle, Mumbai', TRUE, 'approved', 310),

-- Tanvi Patil (user_id 7)
(19, 7, 7, 'Kanjivaram Pure Silk Temple Saree with Pure Zari', 'Nalli Silks', 'Hand-loomed crimson Kanjivaram saree with golden peacock border. Silk Mark certified. Treasured bridal piece.', 22000.00, 8900.00, 'Like New', 99, 1, 'Occasion-specific', 'Free Size', 'Crimson Red & Gold', '100% Pure Mulberry Silk', 'Women', 'Gangapur Road, Nashik', TRUE, 'approved', 690),
(20, 7, 3, 'Kundan & Pearl Bridal Choker Set', 'FabIndia', 'Intricate handcrafted kundan necklace with matching drop earrings and pearl stringing.', 4800.00, 1950.00, 'Like New', 95, 1, 'Occasion-specific', 'Adjustable', 'Antique Gold & Pearl', 'Brass & Semi-precious Stones', 'Women', 'Gangapur Road, Nashik', TRUE, 'approved', 340),
(21, 7, 1, 'Fabindia Handblock Printed Indigo Kurta', 'FabIndia', 'Kalamkari artisanal cotton knee-length kurta with mother of pearl buttons. Breathable natural indigo dye.', 2490.00, 950.00, 'Excellent', 92, 3, 'Wardrobe refresh', 'L', 'Indigo Blue', 'Handloom Cotton', 'Women', 'Gangapur Road, Nashik', TRUE, 'approved', 215),

-- Kabir Kapoor (@kabirstreetwear - user_id 8)
(22, 8, 2, 'New Balance 550 "White Grey" Classic', 'New Balance', 'Hype retro basketball sneaker. Premium leather with suede toe cap. Clean sole, kept in air-tight box with silica gel.', 11999.00, 5800.00, 'Like New', 96, 2, 'Wardrobe refresh', 'UK 9.5', 'White & Neutral Grey', 'Leather & Suede', 'Men', 'Juhu, Mumbai', TRUE, 'approved', 920),
(23, 8, 1, 'Fear of God Essentials Oversized Hoodie', 'Essentials', 'Heavyweight fleece hoodie in Buttercream colorway. Iconic reflective back logo. Extremely cozy oversized drape.', 14000.00, 6400.00, 'Excellent', 94, 3, 'No longer fits', 'M (Oversized)', 'Buttercream / Beige', '80% Cotton Fleece', 'Unisex', 'Juhu, Mumbai', TRUE, 'approved', 760),
(24, 8, 6, 'Carhartt WIP Watch Beanie (Black)', 'Carhartt WIP', 'Ribbed acrylic knit beanie with woven square Carhartt label on cuff. Warm, versatile streetwear staple.', 2200.00, 950.00, 'Like New', 98, 1, 'Bought but rarely used', 'One Size', 'Jet Black', '100% Acrylic Knit', 'Unisex', 'Juhu, Mumbai', TRUE, 'approved', 310),
(25, 8, 9, 'Alpha Industries MA-1 Flight Bomber Jacket', 'Alpha Industries', 'Original military spec flight jacket with rescue orange lining and "Remove Before Flight" red tag.', 16500.00, 7200.00, 'Excellent', 93, 3, 'Wardrobe refresh', 'L', 'Sage Green', 'Water Resistant Nylon', 'Men', 'Juhu, Mumbai', TRUE, 'approved', 540),

-- Siddhi Shinde (user_id 9)
(26, 9, 1, 'Mango 100% Sustainable Linen Midi Dress', 'Mango', 'Breezy button-down linen dress with patch pockets and tortoiseshell belt. Sustainably crafted.', 5590.00, 2100.00, 'Like New', 96, 2, 'Worn only a few times', 'M', 'Natural Flax / Oat', '100% Organic Linen', 'Women', 'Aundh, Pune', TRUE, 'approved', 320),
(27, 9, 5, 'Hidesign Leather Handcrafted Crossbody Sling', 'Hidesign', 'Vegetable tanned ranch leather sling bag with brass buckle. Solid heritage build that ages gracefully.', 6495.00, 2650.00, 'Excellent', 92, 4, 'Wardrobe refresh', 'Small', 'Tan Chestnut', 'Genuine Vegetable-Tanned Leather', 'Women', 'Aundh, Pune', TRUE, 'approved', 430),
(28, 9, 6, 'Vogue Eyewear Tortoiseshell Cat-Eye Sunglasses', 'Vogue Eyewear', 'Acetate cat-eye frames with brown gradient UV400 lenses. Glamorous silhouette without scratches.', 5290.00, 1990.00, 'Like New', 97, 2, 'Occasion-specific', 'Standard', 'Havana Tortoise', 'Bio-Acetate', 'Women', 'Aundh, Pune', TRUE, 'approved', 290),

-- Aditya Rao (user_id 10)
(29, 10, 4, 'Seiko 5 Sports Automatic Diver "Black Grape"', 'Seiko', 'Ref SRPD55K1. Hardlex crystal, unidirectional rotating bezel, 100m water resistance, automatic caliber 4R36 with 41hr reserve.', 25000.00, 13500.00, 'Like New', 98, 2, 'Wardrobe refresh', '42.5mm', 'Black Sunburst', '316L Stainless Steel', 'Men', 'Worli, Mumbai', TRUE, 'approved', 890),
(30, 10, 4, 'Apple Watch Series 8 GPS 45mm Midnight', 'Apple', 'Midnight aluminum case with Midnight sport band. Battery health at 94%. Comes with original magnetic fast charger.', 45900.00, 21900.00, 'Excellent', 92, 8, 'Bought but rarely used', '45mm', 'Midnight Blue', 'Aluminum & Ion-X Glass', 'Unisex', 'Worli, Mumbai', TRUE, 'approved', 980),
(31, 10, 6, 'Montblanc Meisterstück Classic Leather Belt', 'Montblanc', 'Reversible black/brown calfskin leather with polished palladium-finish horseshoe pin buckle.', 28000.00, 11500.00, 'Excellent', 93, 3, 'Wardrobe refresh', '34-38 waist', 'Black / Brown', 'Calfskin Leather', 'Men', 'Worli, Mumbai', TRUE, 'approved', 410),

-- Kavya Nair (@kavyastylenotes - user_id 11)
(32, 11, 1, 'COS Minimalist Wool Blend Trench Coat', 'COS', 'Tailored camel double-breasted trench coat with storm flap and removable belt. Architectural Scandinavian cut.', 18900.00, 7800.00, 'Like New', 98, 1, 'Occasion-specific', 'EU 36 / S', 'Camel Tan', 'Wool & Recycled Polyamide', 'Women', 'Koregaon Park, Pune', TRUE, 'approved', 740),
(33, 11, 5, 'Polène Numéro Un Nano Structured Bag', 'Polène Paris', 'Full grain textured calf leather sculpted into elegant curves. Gold hardware with top handle and crossbody strap.', 32000.00, 14200.00, 'Like New', 99, 1, 'Occasion-specific', 'Nano', 'Chalk / Ivory', 'Full Grain Calfskin', 'Women', 'Koregaon Park, Pune', TRUE, 'approved', 890),
(34, 11, 2, 'Charles & Keith Lucile Metallic Buckle Loafers', 'Charles & Keith', 'Chic square-toe loafers with gold chain detailing and cushioned soles. Contemporary office look.', 5999.00, 2250.00, 'Excellent', 92, 3, 'No longer my style', 'EU 37', 'Polished Black', 'Synthetic Leather', 'Women', 'Koregaon Park, Pune', TRUE, 'approved', 360),
(35, 11, 3, 'Swarovski Sparkling Dance Clover Pendant', 'Swarovski', 'Rhodium-plated pendant with a floating dancing sparkling clear crystal stone. In original blue presentation box.', 9500.00, 3900.00, 'Like New', 97, 1, 'Occasion-specific', 'One Size', 'Silver Sparkle', 'Rhodium Plated Crystal', 'Women', 'Koregaon Park, Pune', TRUE, 'approved', 470),

-- Varun Chopra (user_id 12)
(36, 12, 2, 'Red Wing Heritage Iron Ranger Boots (Amber Harness)', 'Red Wing', 'Legendary American work boots with Goodyear welt construction and Vibram 430 mini-lug sole. Leather starting to develop gorgeous patina.', 29990.00, 13800.00, 'Excellent', 90, 8, 'No longer fits', 'UK 9 / US 10', 'Amber Brown', 'Full Grain Oil-Tanned Leather', 'Men', 'Lokhandwala, Mumbai', TRUE, 'approved', 610),
(37, 12, 5, 'Fossil Defender Leather Waxed Canvas Messenger', 'Fossil', 'Rugged commuter satchel with padded laptop sleeve for 15-inch MacBooks, brass buckles, and luggage strap.', 14995.00, 5400.00, 'Good', 88, 7, 'Wardrobe refresh', '15 Inch', 'Khaki Green & Brown', 'Waxed Canvas & Leather', 'Men', 'Lokhandwala, Mumbai', TRUE, 'approved', 320),
(38, 12, 6, 'Bellroy Hide & Seek RFID Leather Wallet', 'Bellroy', 'Slim bi-fold wallet in premium environmentally certified leather. Secret coin pouch and RFID protection.', 6900.00, 2800.00, 'Like New', 96, 2, 'Bought but rarely used', 'Slim', 'Charcoal', 'Eco-Tanned Leather', 'Men', 'Lokhandwala, Mumbai', TRUE, 'approved', 270),

-- Gaurav Verma (user_id 14)
(39, 14, 10, 'Nike Windrunner Running Jacket (Black/White)', 'Nike', 'Iconic 26-degree chevron jacket with breathable mesh lining and zippered hand pockets. Water-repellent finish.', 5495.00, 2200.00, 'Excellent', 93, 4, 'Wardrobe refresh', 'L', 'Black / Summit White', '100% Recycled Polyester', 'Men', 'Powai, Mumbai', TRUE, 'approved', 330),
(40, 14, 2, 'Asics Gel-Kayano 29 Stability Running Shoes', 'Asics', 'Top-tier marathon running shoe with FF BLAST PLUS cushioning and LITETRUSS stability. Less than 20km walked.', 13999.00, 5400.00, 'Like New', 95, 3, 'No longer fits', 'UK 9.5', 'Deep Ocean / Amber', 'Engineered Mesh', 'Men', 'Powai, Mumbai', TRUE, 'approved', 420),

-- Meera Iyer (user_id 15)
(41, 15, 7, 'Sabyasachi Heritage Inspired Bridal Lehenga', 'Custom Boutique Archive', 'Opulent crimson velvet lehenga with handcrafted zardozi and gota patti embroidery. Includes raw silk blouse and double net dupattas.', 45000.00, 16500.00, 'Like New', 98, 1, 'Occasion-specific', 'M (Alterable)', 'Heritage Crimson', 'Velvet & Zardozi Silk', 'Women', 'Kalyan Nagar, Pune', TRUE, 'approved', 920),
(42, 15, 3, '22K Gold-Dipped Temple Choker with Rubies', 'Kalyan Jewellers Heritage', 'Stunning silver base 22K micron gold plated temple choker set with syndicate polki and emerald green stones.', 12500.00, 4800.00, 'Like New', 96, 1, 'Occasion-specific', 'One Size', 'Antique Temple Gold', 'Silver 92.5 Gold Plated', 'Women', 'Kalyan Nagar, Pune', TRUE, 'approved', 510),
(43, 15, 1, 'Ritu Kumar Bandhani Silk Tunic with Palazzo', 'Ritu Kumar', 'Vibrant marigold yellow silk bandhani kurta with intricate neck embroidery and matching silk palazzo.', 12900.00, 4500.00, 'Excellent', 94, 2, 'Occasion-specific', 'L', 'Marigold Yellow', 'Pure Silk Blend', 'Women', 'Kalyan Nagar, Pune', TRUE, 'approved', 390),

-- Rituja Salunke (user_id 17)
(44, 17, 3, 'Bohemian Oxidised Silver Hasli Necklace', 'Artisan Guild', 'Traditional Maharashtrian tribal hasli choker handcrafted with floral medallions and ghungroo drops.', 2800.00, 990.00, 'Like New', 95, 2, 'Wardrobe refresh', 'Adjustable', 'Antique Oxidised Silver', 'German Silver Alloy', 'Women', 'Indira Nagar, Nashik', TRUE, 'approved', 280),
(45, 17, 1, 'Handmade Ajrakh Modal Silk Dupatta', 'Kutch Weavers Collective', 'Natural vegetable dye block printed modal silk dupatta with lustrous sheen and tassel ends.', 3500.00, 1350.00, 'Like New', 97, 1, 'Occasion-specific', '2.5 Meters', 'Indigo & Madder Red', 'Modal Silk', 'Women', 'Indira Nagar, Nashik', TRUE, 'approved', 220),

-- Yashwant Kale (user_id 18)
(46, 18, 1, 'Ralph Lauren Polo Custom Slim Fit Mesh Polo', 'Polo Ralph Lauren', 'Signature pony embroidery on left chest. Breathable cotton mesh fabric with ribbed collar and tennis tail hem.', 8500.00, 3100.00, 'Excellent', 92, 3, 'No longer fits', 'M', 'Hunter Navy', '100% Cotton Mesh', 'Men', 'Baner, Pune', TRUE, 'approved', 410),
(47, 18, 1, 'Marks & Spencer Tailored Fit Flat Front Chinos', 'Marks & Spencer', 'Smart casual chinos with active waist stretch. Great for work or weekend dinners.', 3499.00, 1250.00, 'Excellent', 91, 3, 'No longer fits', '32 waist', 'Stone Khaki', 'Stretch Cotton Twill', 'Men', 'Baner, Pune', TRUE, 'approved', 210),

-- Samarth More (user_id 20)
(48, 20, 5, 'Samsonite Urban Pack Professional Laptop Bag', 'Samsonite', 'Ergonomic business backpack with USB charging port, waterproof rain cover, and fleece laptop pocket.', 8990.00, 3300.00, 'Like New', 95, 2, 'Bought but rarely used', '24 Liters', 'Graphite Grey', 'Ballistic Polyester', 'Unisex', 'Deccan, Pune', TRUE, 'approved', 370),
(49, 20, 6, 'Ray-Ban Clubmaster Classic (RB3016)', 'Ray-Ban', 'Retro browline frames with polished mock tortoiseshell and gold metal bridge. Crystal green lenses.', 10890.00, 4600.00, 'Like New', 96, 2, 'No longer my style', '49mm', 'Mock Tortoise / Gold', 'Acetate & Metal', 'Unisex', 'Deccan, Pune', TRUE, 'approved', 440),

-- Shruti Borse (user_id 21)
(50, 21, 1, 'H&M Linen Blend Oversized Resort Shirt', 'H&M', 'Breezy camp-collar relaxed shirt. Perfect for beach vacations or summer day outs.', 2299.00, 850.00, 'Like New', 96, 1, 'Wardrobe refresh', 'S', 'Sage Floral', 'Linen & Viscose', 'Women', 'Nashik Road, Nashik', TRUE, 'approved', 280),
(51, 21, 7, 'Paithani Pure Silk Traditional Saree (Yeola Weave)', 'Yeola Weavers', 'Heritage peacock pallu with pure golden zari work and zari buttis throughout. Direct from Yeola master weavers.', 16000.00, 6800.00, 'Like New', 98, 1, 'Occasion-specific', 'Free Size', 'Royal Purple & Gold', '100% Pure Silk', 'Women', 'Nashik Road, Nashik', TRUE, 'approved', 590),
(52, 21, 3, 'Meenakari Handcrafted Lotus Drop Earrings', 'Jaipur Craft', 'Pastel pink and mint green enamel detailing with tiny seed pearls. Lightweight festive earrings.', 1800.00, 690.00, 'Like New', 95, 2, 'Occasion-specific', 'One Size', 'Pastel Mint & Pink', 'Brass & Enamel', 'Women', 'Nashik Road, Nashik', TRUE, 'approved', 190),

-- Kunal Singhania (user_id 24)
(53, 24, 8, 'Burberry Vintage Nova Check Wool Scarf', 'Burberry', '100% Scottish cashmere classic check scarf with fringed edges. Timeless luxury piece.', 34000.00, 14900.00, 'Excellent', 94, 4, 'Wardrobe refresh', '168 x 30 cm', 'Iconic Archive Tan Check', '100% Pure Cashmere', 'Unisex', 'Colaba, Mumbai', TRUE, 'approved', 680),
(54, 24, 2, 'Church’s Custom Grade Oxford Brogues', 'Church’s English Shoes', 'Handcrafted Goodyear-welted burnished walnut calfskin dress shoes. Worn for 2 black-tie galas.', 48000.00, 18500.00, 'Excellent', 92, 2, 'Occasion-specific', 'UK 8.5', 'Walnut Brown', 'Full Grain Calfskin', 'Men', 'Colaba, Mumbai', TRUE, 'approved', 420),

-- Saurabh Tandon (user_id 26)
(55, 26, 4, 'Tissot PRX Powermatic 80 Blue Sunray Dial', 'Tissot', 'Swiss automatic watch with 80-hour power reserve, Nivachron balance spring, and integrated stainless steel bracelet.', 62500.00, 34500.00, 'Like New', 98, 2, 'Wardrobe refresh', '40mm', 'Deep Sunray Blue', '316L Stainless Steel & Sapphire', 'Men', 'Viman Nagar, Pune', TRUE, 'approved', 810),
(56, 26, 1, 'AllSaints Spitalfields Distressed Graphic Tee', 'AllSaints', 'Washed vintage jersey with signature distressed hem and industrial skull print.', 4500.00, 1650.00, 'Good', 88, 5, 'No longer fits', 'M', 'Washed Charcoal', '100% Carbon-Brushed Cotton', 'Men', 'Viman Nagar, Pune', TRUE, 'approved', 240),

-- Trisha Roy (user_id 27)
(57, 27, 5, 'Kate Spade New York Cedar Street Maise Bag', 'Kate Spade', 'Crosshatched leather satchel with optional shoulder strap and spade jacquard interior lining.', 22000.00, 7900.00, 'Excellent', 93, 3, 'Wardrobe refresh', 'Medium', 'Cherry Red', 'Crosshatched Saffiano Leather', 'Women', 'Santacruz, Mumbai', TRUE, 'approved', 410),
(58, 27, 2, 'Zara Metallic Strappy Stiletto Sandals', 'Zara', 'High heel evening sandals with ankle strap closure. Slender heel, dramatic mirror shine finish.', 4990.00, 1750.00, 'Like New', 95, 1, 'Occasion-specific', 'EU 38', 'Champagne Gold', 'Metallic Polyurethane', 'Women', 'Santacruz, Mumbai', TRUE, 'approved', 310),

-- Aishwarya Sawant (user_id 29)
(59, 29, 1, 'Forever New Floral Tiered Ruffle Dress', 'Forever New', 'Romantic summer dress with delicate ruffles, sweetheart neckline, and smocked back.', 6400.00, 2200.00, 'Like New', 96, 2, 'Worn only a few times', 'UK 10 / M', 'Lilac Floral', 'Polyester Chiffon', 'Women', 'Andheri West, Mumbai', TRUE, 'approved', 360),
(60, 29, 6, 'Accessorize London Woven Straw Beach Tote', 'Accessorize London', 'Handwoven natural straw bag with pompom charm and faux leather shoulder handles.', 3990.00, 1450.00, 'Like New', 95, 1, 'Occasion-specific', 'Large', 'Natural Straw & Tan', 'Natural Corn Husk', 'Women', 'Andheri West, Mumbai', TRUE, 'approved', 230),

-- Pending Approval Item for Admin Review Demo (user_id 4)
(61, 4, 1, 'Urbanic Oversized Corduroy Shacket in Mustard', 'Urbanic', 'Heavyweight ribbed corduroy shacket with dual flap pockets and tortoiseshell buttons.', 2490.00, 950.00, 'Like New', 94, 2, 'No longer fits', 'M', 'Mustard Yellow', '100% Cotton Corduroy', 'Women', 'College Road, Nashik', TRUE, 'pending', 12);

-- ---------------------------------------------------------------------
-- 8. Insert Product Images (Primary + Gallery Views)
-- ---------------------------------------------------------------------
INSERT INTO product_images (image_id, product_id, image_url, is_primary, display_order) VALUES
(1, 1, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(2, 1, 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80', FALSE, 2),
(3, 2, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(4, 2, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', FALSE, 2),
(5, 3, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(6, 3, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', FALSE, 2),
(7, 4, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(8, 5, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(9, 6, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(10, 6, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80', FALSE, 2),
(11, 7, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(12, 8, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(13, 9, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(14, 10, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(15, 11, 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(16, 12, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(17, 13, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(18, 14, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(19, 15, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(20, 16, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(21, 17, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(22, 18, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(23, 19, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(24, 20, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(25, 21, 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(26, 22, 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(27, 23, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(28, 24, 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(29, 25, 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(30, 26, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(31, 27, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(32, 28, 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(33, 29, 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(34, 30, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(35, 31, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(36, 32, 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(37, 33, 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(38, 34, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(39, 35, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(40, 36, 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(41, 37, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(42, 38, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(43, 39, 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(44, 40, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(45, 41, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(46, 42, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(47, 43, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(48, 44, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(49, 45, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(50, 46, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(51, 47, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(52, 48, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(53, 49, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(54, 50, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(55, 51, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(56, 52, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(57, 53, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(58, 54, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(59, 55, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(60, 56, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(61, 57, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(62, 58, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(63, 59, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(64, 60, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(65, 61, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', TRUE, 1);

-- ---------------------------------------------------------------------
-- 9. Insert Addresses (Realistic Indian addresses in Mumbai, Pune, Nashik)
-- ---------------------------------------------------------------------
INSERT INTO addresses (address_id, user_id, recipient_name, phone, street_address, landmark, city, state, pincode, address_type, is_default) VALUES
(1, 4, 'Ananya Deshmukh', '+91 98233 99887', 'Flat 402, Shivshrushti Apts, Off College Road', 'Near BYK College of Commerce', 'Nashik', 'Maharashtra', '422005', 'Home', TRUE),
(2, 4, 'Ananya Deshmukh', '+91 98233 99887', 'CoWork Hub, 3rd Floor, Gangapur Plaza', 'Opposite Big Bazaar', 'Nashik', 'Maharashtra', '422013', 'Office', FALSE),
(3, 3, 'Aarav Mehta', '+91 98230 66778', 'Row House 12, Mayur Colony, Kothrud', 'Behind City Pride Multiplex', 'Pune', 'Maharashtra', '411038', 'Home', TRUE),
(4, 2, 'Priya Sharma', '+91 98221 44556', 'Flat 801, Sea Breeze Residences, Perry Cross Road, Bandra West', 'Near Candies Cafe', 'Mumbai', 'Maharashtra', '400050', 'Home', TRUE),
(5, 21, 'Shruti Borse', '+91 98411 23456', 'Plot 45, Anand Tara Heights, Jail Road, Nashik Road', 'Near St. Philomena School', 'Nashik', 'Maharashtra', '422101', 'Home', TRUE);

-- ---------------------------------------------------------------------
-- 10. Insert Active Orders with Complete Delivery Tracking
-- ---------------------------------------------------------------------
INSERT INTO orders (order_id, order_number, buyer_id, delivery_address_id, subtotal, delivery_charge, platform_fee, total_amount, order_status, payment_status, created_at) VALUES
(1, 'REV-2026-88192', 4, 1, 2450.00, 79.00, 29.00, 2558.00, 'Delivered', 'Paid', '2026-09-28 10:15:00'),
(2, 'REV-2026-90412', 4, 1, 3200.00, 0.00, 29.00, 3229.00, 'In Transit', 'Paid', '2026-10-02 14:30:00'),
(3, 'REV-2026-92144', 3, 3, 10500.00, 0.00, 29.00, 10529.00, 'Order Confirmed', 'Paid', '2026-10-04 09:20:00');

-- ---------------------------------------------------------------------
-- 11. Insert Order Items (with platform commission & seller payout)
-- ---------------------------------------------------------------------
INSERT INTO order_items (order_item_id, order_id, product_id, seller_id, price_at_purchase, platform_commission_pct, platform_commission_amount, seller_earnings) VALUES
(1, 1, 1, 2, 2450.00, 5.00, 122.50, 2327.50),
(2, 2, 7, 3, 3200.00, 5.00, 160.00, 3040.00),
(3, 3, 3, 2, 10500.00, 5.00, 525.00, 9975.00);

-- ---------------------------------------------------------------------
-- 12. Insert Payments
-- ---------------------------------------------------------------------
INSERT INTO payments (payment_id, order_id, transaction_ref, payment_method, amount, status, payment_gateway_response) VALUES
(1, 1, 'TXN_REV_UPI_982419082', 'UPI', 2558.00, 'Success', '{"gateway": "MockRazorpayUPI", "upi_handle": "ananya@oksbi", "auth_code": "APPRV_992104"}'),
(2, 2, 'TXN_REV_CARD_33910281', 'Card', 3229.00, 'Success', '{"gateway": "MockStripeIndia", "card_brand": "Visa", "last4": "4242"}'),
(3, 3, 'TXN_REV_UPI_492104991', 'UPI', 10529.00, 'Success', '{"gateway": "MockPhonePeUPI", "upi_handle": "aarav.mehta@okicici", "auth_code": "APPRV_109284"}');

-- ---------------------------------------------------------------------
-- 13. Insert Delivery Tracking (7-Step Realistic Timeline)
-- ---------------------------------------------------------------------
INSERT INTO delivery_tracking (tracking_id, order_id, status_step, description, location_checkpoint, is_completed, updated_at) VALUES
-- Order 1 (Delivered)
(1, 1, 'Order Confirmed', 'Payment verified. Order received by Revogue hub.', 'Mumbai Central Hub', TRUE, '2026-09-28 10:16:00'),
(2, 1, 'Seller Preparing', 'Seller Priya Sharma carefully packaged the blazer with eco-wrap.', 'Bandra, Mumbai', TRUE, '2026-09-28 15:40:00'),
(3, 1, 'Ready for Pickup', 'Pickup scheduled with Revogue Express Partner.', 'Bandra Hub, Mumbai', TRUE, '2026-09-29 09:30:00'),
(4, 1, 'Picked Up', 'Revogue inspection courier picked up and verified authenticity.', 'Mumbai Transit Facility', TRUE, '2026-09-29 12:10:00'),
(5, 1, 'In Transit', 'Package departed sorting hub via expressway to Nashik.', 'Igatpuri Checkpoint', TRUE, '2026-09-29 19:45:00'),
(6, 1, 'Out for Delivery', 'Courier agent (Vikas K.) out for doorstep delivery.', 'College Road Hub, Nashik', TRUE, '2026-09-30 11:20:00'),
(7, 1, 'Delivered', 'Delivered safely to Ananya Deshmukh. OTP verification completed.', 'College Road, Nashik', TRUE, '2026-09-30 14:05:00'),

-- Order 2 (In Transit)
(8, 2, 'Order Confirmed', 'Order verified and confirmed.', 'Pune Central Hub', TRUE, '2026-10-02 14:31:00'),
(9, 2, 'Seller Preparing', 'Seller Aarav Mehta has boxed the Levi’s jacket.', 'Kothrud, Pune', TRUE, '2026-10-02 17:15:00'),
(10, 2, 'Ready for Pickup', 'Item queued for hub dispatch.', 'Pune Sorting Hub', TRUE, '2026-10-03 08:30:00'),
(11, 2, 'Picked Up', 'Quality seal verified by Revogue agent.', 'Shivajinagar Express Hub', TRUE, '2026-10-03 11:45:00'),
(12, 2, 'In Transit', 'Vehicle in transit between Pune Hub and Nashik Distribution.', 'Sinnar Expressway Checkpost', TRUE, '2026-10-04 04:30:00'),
(13, 2, 'Out for Delivery', 'Scheduled for dispatch tomorrow morning.', 'Nashik Delivery Depot', FALSE, '2026-10-04 08:00:00'),
(14, 2, 'Delivered', 'Pending delivery verification.', 'Destination Address', FALSE, '2026-10-04 08:00:00'),

-- Order 3 (Order Confirmed)
(15, 3, 'Order Confirmed', 'Order placed successfully. Waiting for seller preparation.', 'Mumbai Central Hub', TRUE, '2026-10-04 09:21:00'),
(16, 3, 'Seller Preparing', 'Awaiting seller package confirmation.', 'Bandra, Mumbai', FALSE, '2026-10-04 09:21:00'),
(17, 3, 'Ready for Pickup', 'Pending pickup scheduling.', 'Bandra Hub', FALSE, '2026-10-04 09:21:00'),
(18, 3, 'Picked Up', 'Pending courier collection.', 'Mumbai Facility', FALSE, '2026-10-04 09:21:00'),
(19, 3, 'In Transit', 'Pending transit dispatch.', 'En Route', FALSE, '2026-10-04 09:21:00'),
(20, 3, 'Out for Delivery', 'Pending final leg.', 'Destination Hub', FALSE, '2026-10-04 09:21:00'),
(21, 3, 'Delivered', 'Pending customer handover.', 'Destination Address', FALSE, '2026-10-04 09:21:00');

-- ---------------------------------------------------------------------
-- 14. Insert Reviews
-- ---------------------------------------------------------------------
INSERT INTO reviews (review_id, product_id, order_id, reviewer_id, seller_id, product_rating, seller_rating, comment, condition_matched) VALUES
(1, 1, 1, 4, 2, 5, 5, 'The Zara blazer is in breathtaking condition! Literally looks like it came straight off the showroom rack. Priya packaged it with eco-friendly butter paper and a sweet handwritten note. Love Revogue!', TRUE),
(2, 6, 1, 10, 3, 5, 5, 'Cleanest pair of Jordan 1s I have found in India. Leather is buttery and crisp. Seller Aarav is super responsive.', TRUE),
(3, 15, 1, 7, 6, 5, 5, 'Authentic Michael Kors bag with tags and dustbag. Saved more than ₹16,000 compared to retail!', TRUE);

-- ---------------------------------------------------------------------
-- 15. Insert Notifications
-- ---------------------------------------------------------------------
INSERT INTO notifications (notification_id, user_id, title, message, type, is_read, link_url) VALUES
(1, 4, 'Order Delivered! 🎉', 'Your order REV-2026-88192 (ZARA Tailored Blazer) has been delivered safely. Tap to review.', 'delivery', TRUE, '/orders/1'),
(2, 4, 'Order In Transit 🚚', 'Your order REV-2026-90412 is currently in transit between Pune and Nashik.', 'delivery', FALSE, '/orders/2'),
(3, 2, 'New Order Received! 🛍️', 'User Ananya purchased your ZARA Tailored Blazer. Please prepare the package for Revogue courier pickup.', 'order', TRUE, '/seller/orders'),
(4, 2, 'Payout Credited 💰', '₹2,327.50 for Order REV-2026-88192 has been scheduled to your UPI ID riya.sharma@okaxis.', 'payout', FALSE, '/seller/payouts'),
(5, 3, 'Order In Transit 🚚', 'Your shipment for Levi’s Sherpa Jacket is en route to Nashik.', 'order', FALSE, '/seller/orders'),
(6, 1, 'New Listing Pending Approval ⚖️', 'Urbanic Oversized Corduroy Shacket submitted by Ananya Deshmukh requires review.', 'approval', FALSE, '/admin/approvals');

-- ---------------------------------------------------------------------
-- 16. Insert Wishlist and Cart Items
-- ---------------------------------------------------------------------
INSERT INTO wishlists (user_id, product_id) VALUES
(4, 3),
(4, 6),
(4, 19),
(4, 29);

INSERT INTO cart_items (user_id, product_id, quantity) VALUES
(4, 10, 1),
(4, 26, 1);

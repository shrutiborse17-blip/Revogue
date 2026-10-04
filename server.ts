import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'revogue-wtl-btech-secret-key-2026';
const PORT = 3000;

// =====================================================================
// In-Memory Relational Database Engine (Synchronized with database/schema.sql & seed.sql)
// =====================================================================

interface Role {
  role_id: number;
  role_name: string;
  description: string;
}

interface User {
  user_id: number;
  full_name: string;
  email: string;
  password_hash: string;
  phone: string;
  avatar_url: string;
  city: string;
  state: string;
  role_id: number;
  is_seller: boolean;
  is_creator: boolean;
  is_active: boolean;
  created_at: string;
}

interface SellerProfile {
  seller_id: number;
  user_id: number;
  store_name: string;
  bio: string;
  trust_score: number;
  rating: number;
  total_sales: number;
  cancellation_rate: number;
  is_verified: boolean;
  total_earnings: number;
  pending_payout: number;
  upi_id: string;
}

interface CreatorProfile {
  creator_id: number;
  user_id: number;
  handle: string;
  social_bio: string;
  followers_count: string;
  featured_badge: string;
  cover_image: string;
}

interface Category {
  category_id: number;
  category_name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  is_active: boolean;
}

interface Product {
  product_id: number;
  seller_id: number;
  category_id: number;
  title: string;
  brand: string;
  description: string;
  original_price: number;
  selling_price: number;
  condition_grade: 'Like New' | 'Excellent' | 'Good' | 'Fair';
  condition_score: number;
  times_worn: number;
  why_selling: string;
  size: string;
  color: string;
  material: string;
  target_gender: 'Women' | 'Men' | 'Unisex' | 'Kids';
  location: string;
  is_available: boolean;
  approval_status: 'pending' | 'approved' | 'rejected';
  view_count: number;
  images: string[];
  worn_photo_url?: string;
  fit_notes?: string;
  created_at: string;
}

interface Address {
  address_id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  street_address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  address_type: 'Home' | 'Office' | 'Other';
  is_default: boolean;
}

interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  seller_id: number;
  price_at_purchase: number;
  platform_commission_pct: number;
  platform_commission_amount: number;
  seller_earnings: number;
}

interface DeliveryMilestone {
  step: string;
  description: string;
  location: string;
  is_completed: boolean;
  timestamp: string;
}

interface Order {
  order_id: number;
  order_number: string;
  buyer_id: number;
  delivery_address: Address;
  subtotal: number;
  delivery_charge: number;
  platform_fee: number;
  total_amount: number;
  order_status: 'Order Confirmed' | 'Seller Preparing' | 'Ready for Pickup' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  payment_status: 'Paid' | 'Pending' | 'Failed';
  payment_method: 'UPI' | 'Card' | 'COD';
  transaction_ref: string;
  items: OrderItem[];
  tracking: DeliveryMilestone[];
  created_at: string;
}

interface Review {
  review_id: number;
  product_id: number;
  order_id: number;
  reviewer_id: number;
  seller_id: number;
  product_rating: number;
  seller_rating: number;
  comment: string;
  condition_matched: boolean;
  reviewer_photo_url?: string;
  created_at: string;
}

interface Notification {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'order' | 'approval' | 'delivery' | 'payout' | 'review' | 'system';
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

interface Report {
  report_id: number;
  reporter_id: number;
  product_id?: number;
  seller_id?: number;
  reason: string;
  details: string;
  status: 'Pending Review' | 'Investigating' | 'Resolved' | 'Dismissed';
  created_at: string;
}

// ---------------------------------------------------------------------
// Initialize Database Store
// ---------------------------------------------------------------------
const DB = {
  roles: [
    { role_id: 1, role_name: 'User', description: 'Standard buyer and seller' },
    { role_id: 2, role_name: 'Admin', description: 'Platform administrator' },
    { role_id: 3, role_name: 'Creator', description: 'Verified fashion creator' }
  ] as Role[],

  settings: {
    platform_commission_pct: 5.0,
    flat_delivery_charge: 49.0,
    min_free_delivery_subtotal: 999.0,
    platform_fee: 19.0
  },

  users: [
    {
      user_id: 1,
      full_name: 'Admin Controller',
      email: 'admin@revogue.demo',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98200 11223',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      city: 'Mumbai',
      state: 'Maharashtra',
      role_id: 2,
      is_seller: true,
      is_creator: false,
      is_active: true,
      created_at: '2026-01-10T10:00:00Z'
    },
    {
      user_id: 2,
      full_name: 'Priya Sharma (@fashionbyriya)',
      email: 'fashionbyriya@revogue.demo',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98221 44556',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      city: 'Bandra, Mumbai',
      state: 'Maharashtra',
      role_id: 3,
      is_seller: true,
      is_creator: true,
      is_active: true,
      created_at: '2026-02-14T10:00:00Z'
    },
    {
      user_id: 3,
      full_name: 'Aarav Mehta',
      email: 'seller@revogue.demo',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98230 66778',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      city: 'Kothrud, Pune',
      state: 'Maharashtra',
      role_id: 1,
      is_seller: true,
      is_creator: false,
      is_active: true,
      created_at: '2026-02-18T10:00:00Z'
    },
    {
      user_id: 4,
      full_name: 'Ananya Deshmukh',
      email: 'buyer@revogue.demo',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98233 99887',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      city: 'College Road, Nashik',
      state: 'Maharashtra',
      role_id: 1,
      is_seller: false,
      is_creator: false,
      is_active: true,
      created_at: '2026-03-01T10:00:00Z'
    },
    {
      user_id: 5,
      full_name: 'Rohan Kulkarni',
      email: 'rohan.kulkarni@gmail.com',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98244 11224',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      city: 'FC Road, Pune',
      state: 'Maharashtra',
      role_id: 1,
      is_seller: true,
      is_creator: false,
      is_active: true,
      created_at: '2026-03-05T10:00:00Z'
    },
    {
      user_id: 6,
      full_name: 'Neha Joshi',
      email: 'neha.joshi@outlook.com',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98255 33445',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      city: 'Vile Parle, Mumbai',
      state: 'Maharashtra',
      role_id: 1,
      is_seller: true,
      is_creator: false,
      is_active: true,
      created_at: '2026-03-10T10:00:00Z'
    },
    {
      user_id: 7,
      full_name: 'Tanvi Patil',
      email: 'tanvi.patil@yahoo.com',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98266 55667',
      avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
      city: 'Gangapur Road, Nashik',
      state: 'Maharashtra',
      role_id: 1,
      is_seller: true,
      is_creator: false,
      is_active: true,
      created_at: '2026-03-12T10:00:00Z'
    },
    {
      user_id: 8,
      full_name: 'Kabir Kapoor (@kabirstreetwear)',
      email: 'kabir.kapoor@gmail.com',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98277 77889',
      avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      city: 'Juhu, Mumbai',
      state: 'Maharashtra',
      role_id: 3,
      is_seller: true,
      is_creator: true,
      is_active: true,
      created_at: '2026-03-15T10:00:00Z'
    },
    {
      user_id: 11,
      full_name: 'Kavya Nair (@kavyastylenotes)',
      email: 'kavya.nair@gmail.com',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98311 23456',
      avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
      city: 'Koregaon Park, Pune',
      state: 'Maharashtra',
      role_id: 3,
      is_seller: true,
      is_creator: true,
      is_active: true,
      created_at: '2026-03-18T10:00:00Z'
    },
    {
      user_id: 21,
      full_name: 'Shruti Borse',
      email: 'shrutiborse2006@gmail.com',
      password_hash: bcrypt.hashSync('revogue123', 10),
      phone: '+91 98411 23456',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      city: 'Nashik Road, Nashik',
      state: 'Maharashtra',
      role_id: 1,
      is_seller: true,
      is_creator: false,
      is_active: true,
      created_at: '2026-04-01T10:00:00Z'
    }
  ] as User[],

  sellerProfiles: [
    {
      seller_id: 1,
      user_id: 2,
      store_name: 'Riya Closet & Curations',
      bio: 'Fashion influencer & stylist. Selling curated wardrobe pieces, festive wear, and luxury accessories.',
      trust_score: 98,
      rating: 4.95,
      total_sales: 126,
      cancellation_rate: 0.5,
      is_verified: true,
      total_earnings: 184500,
      pending_payout: 12400,
      upi_id: 'riya.sharma@okaxis'
    },
    {
      seller_id: 2,
      user_id: 3,
      store_name: 'Aarav Minimalist Edit',
      bio: 'Curator of premium men sneakers, jackets, and smart casuals. All items handled with extreme care.',
      trust_score: 94,
      rating: 4.82,
      total_sales: 42,
      cancellation_rate: 1.2,
      is_verified: true,
      total_earnings: 64200,
      pending_payout: 5200,
      upi_id: 'aarav.mehta@oksbi'
    },
    {
      seller_id: 3,
      user_id: 8,
      store_name: 'Kabir Street & Hype',
      bio: 'Sneakerhead and streetwear enthusiast. Verified authentic kicks and streetwear hoodies.',
      trust_score: 97,
      rating: 4.92,
      total_sales: 85,
      cancellation_rate: 0.9,
      is_verified: true,
      total_earnings: 142800,
      pending_payout: 11500,
      upi_id: 'kabir.kapoor@okkotak'
    },
    {
      seller_id: 4,
      user_id: 11,
      store_name: 'Kavya Chic Thrift',
      bio: 'Stylist curated contemporary dresses, trench coats, and chic evening tops from Pune.',
      trust_score: 97,
      rating: 4.93,
      total_sales: 94,
      cancellation_rate: 0.6,
      is_verified: true,
      total_earnings: 134200,
      pending_payout: 9800,
      upi_id: 'kavya.nair@okhdfc'
    }
  ] as SellerProfile[],

  creatorProfiles: [
    {
      creator_id: 1,
      user_id: 2,
      handle: 'fashionbyriya',
      social_bio: 'Editorial Stylist & Content Creator • Featured in Vogue India • Rehoming archive luxury & festive pieces',
      followers_count: '142K',
      featured_badge: 'Featured Stylist',
      cover_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
    },
    {
      creator_id: 2,
      user_id: 8,
      handle: 'kabirstreetwear',
      social_bio: 'Sneakerhead & Street Culture Photographer • Rotating verified authentic kicks & oversized silhouettes',
      followers_count: '89K',
      featured_badge: 'Hype Curator',
      cover_image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80'
    },
    {
      creator_id: 3,
      user_id: 11,
      handle: 'kavyastylenotes',
      social_bio: 'Minimalist capsule wardrobe enthusiast • Giving quality sustainable essentials a loving second chapter',
      followers_count: '115K',
      featured_badge: 'Capsule Wardrobe Icon',
      cover_image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80'
    }
  ] as CreatorProfile[],

  categories: [
    { category_id: 1, category_name: 'Clothing', slug: 'clothing', description: 'Pre-loved designer shirts, dresses, denim, jackets, and everyday wear', icon: 'Shirt', image_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', is_active: true },
    { category_id: 2, category_name: 'Footwear', slug: 'footwear', description: 'Sneakers, formal oxfords, heels, loafers, and Chelsea boots', icon: 'Footprints', image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80', is_active: true },
    { category_id: 3, category_name: 'Jewellery', slug: 'jewellery', description: 'Earrings, necklaces, silver chokers, bracelets, and artisanal rings', icon: 'Sparkles', image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', is_active: true },
    { category_id: 4, category_name: 'Watches', slug: 'watches', description: 'Analog chronographs, automatic timepieces, and premium digital watches', icon: 'Watch', image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80', is_active: true },
    { category_id: 5, category_name: 'Bags', slug: 'bags', description: 'Structured leather totes, backpacks, sling bags, and laptop sleeves', icon: 'Briefcase', image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80', is_active: true },
    { category_id: 6, category_name: 'Accessories', slug: 'accessories', description: 'Designer sunglasses, Italian leather belts, silk scarves, and caps', icon: 'Glasses', image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80', is_active: true },
    { category_id: 7, category_name: 'Ethnic Wear', slug: 'ethnic-wear', description: 'Handloom sarees, festive kurta sets, and celebration sherwanis', icon: 'Crown', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', is_active: true },
    { category_id: 8, category_name: 'Luxury Vintage', slug: 'luxury-vintage', description: 'Rare vintage pieces, collectible apparel, and archival treasures', icon: 'Gem', image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80', is_active: true },
    { category_id: 9, category_name: 'Denim & Outerwear', slug: 'denim-outerwear', description: 'Biker leather jackets, denim trucker coats, and warm fleece hoodies', icon: 'Layers', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', is_active: true },
    { category_id: 10, category_name: 'Activewear', slug: 'activewear', description: 'High-performance gym wear, dry-fit tracks, and running windbreakers', icon: 'Zap', image_url: 'https://images.unsplash.com/photo-1483721074577-83216890f915?auto=format&fit=crop&w=600&q=80', is_active: true }
  ] as Category[],

  products: [
    {
      product_id: 1,
      seller_id: 2,
      category_id: 1,
      title: 'ZARA Tailored Double-Breasted Blazer',
      brand: 'Zara',
      description: 'Immaculate cream tailored blazer. Only worn once for an indoor presentation. Features tortoiseshell buttons and clean structured shoulders.',
      original_price: 2490,
      selling_price: 449,
      condition_grade: 'Like New',
      condition_score: 98,
      times_worn: 1,
      why_selling: 'Worn only a few times',
      size: 'M',
      color: 'Cream / Off-White',
      material: 'Polyester Blend',
      target_gender: 'Women',
      location: 'Bandra, Mumbai',
      is_available: true,
      approval_status: 'approved',
      view_count: 342,
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      fit_notes: "Seller is 5'5 wearing Size M. Fits sleek and sharp with comfortable room for a light camisole underneath. Clicked during a cafe brunch outing.",
      created_at: '2026-09-20T10:00:00Z'
    },
    {
      product_id: 2,
      seller_id: 2,
      category_id: 7,
      title: 'Raw Mango Chanderi Silk Saree',
      brand: 'Raw Mango',
      description: 'Handwoven emerald green Chanderi silk saree with zari border. Worn for 3 hours at a Diwali gathering. Dry-cleaned and stored in muslin.',
      original_price: 3500,
      selling_price: 590,
      condition_grade: 'Like New',
      condition_score: 99,
      times_worn: 1,
      why_selling: 'Occasion-specific',
      size: 'Free Size',
      color: 'Emerald Green',
      material: 'Chanderi Silk',
      target_gender: 'Women',
      location: 'Bandra, Mumbai',
      is_available: true,
      approval_status: 'approved',
      view_count: 612,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Drapes gracefully, extremely lightweight festive saree. Photos taken during family Diwali evening.',
      created_at: '2026-09-21T11:00:00Z'
    },
    {
      product_id: 3,
      seller_id: 2,
      category_id: 5,
      title: 'Coach Signature Jacquard Camera Bag',
      brand: 'Coach',
      description: 'Coach mini camera bag in tan coated canvas with gold hardware. Comes with original dustbag and purchase tag. Absolutely zero scratches.',
      original_price: 3200,
      selling_price: 549,
      condition_grade: 'Like New',
      condition_score: 97,
      times_worn: 2,
      why_selling: 'Wardrobe refresh',
      size: 'One Size',
      color: 'Tan / Brown',
      material: 'Coated Canvas & Leather',
      target_gender: 'Women',
      location: 'Bandra, Mumbai',
      is_available: true,
      approval_status: 'approved',
      view_count: 428,
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Crossbody strap adjusts easily. Sits right at hip level; holds phone, cardholder, lipstick and keys.',
      created_at: '2026-09-22T14:00:00Z'
    },
    {
      product_id: 4,
      seller_id: 2,
      category_id: 3,
      title: 'Tribe Amrapali Silver Tribal Jhumkas',
      brand: 'Tribe Amrapali',
      description: 'Pure 92.5 hallmarked sterling silver tribal jhumkas with oxidation finish. Worn twice for festive shoot.',
      original_price: 1290,
      selling_price: 219,
      condition_grade: 'Excellent',
      condition_score: 94,
      times_worn: 2,
      why_selling: 'Bought but rarely used',
      size: 'One Size',
      color: 'Antique Silver',
      material: '925 Sterling Silver',
      target_gender: 'Women',
      location: 'Bandra, Mumbai',
      is_available: true,
      approval_status: 'approved',
      view_count: 189,
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Lightweight on ears, does not pull. Clicked during university ethnic day celebrations.',
      created_at: '2026-09-23T15:00:00Z'
    },
    {
      product_id: 5,
      seller_id: 2,
      category_id: 1,
      title: 'Massimo Dutti Pleated Midi Dress',
      brand: 'Massimo Dutti',
      description: 'Flowy pleated terracotta midi dress with tie waist belt. Lightweight fabric ideal for brunch or evening cocktails.',
      original_price: 2100,
      selling_price: 379,
      condition_grade: 'Like New',
      condition_score: 96,
      times_worn: 2,
      why_selling: 'No longer fits',
      size: 'S',
      color: 'Terracotta',
      material: 'Viscose Silk Blend',
      target_gender: 'Women',
      location: 'Bandra, Mumbai',
      is_available: true,
      approval_status: 'approved',
      view_count: 290,
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
      fit_notes: "Seller is 5'4. Midi length drops mid-calf. Pleats fall smoothly without sticking.",
      created_at: '2026-09-24T10:00:00Z'
    },
    {
      product_id: 6,
      seller_id: 3,
      category_id: 2,
      title: 'Nike Air Jordan 1 Retro High OG "Chicago"',
      brand: 'Nike',
      description: 'Legendary colorway. Authentic with crisp uppers. Soles have minimal heel drag, uppers are crisp and creaseless.',
      original_price: 3499,
      selling_price: 699,
      condition_grade: 'Excellent',
      condition_score: 93,
      times_worn: 4,
      why_selling: 'Wardrobe refresh',
      size: 'UK 9 / EU 43',
      color: 'Red / White / Black',
      material: 'Full Grain Leather',
      target_gender: 'Men',
      location: 'Kothrud, Pune',
      is_available: true,
      approval_status: 'approved',
      view_count: 850,
      images: [
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'True to UK 9. Snug ankle support, worn with denim jeans on a weekend drive.',
      created_at: '2026-09-25T11:00:00Z'
    },
    {
      product_id: 7,
      seller_id: 3,
      category_id: 9,
      title: 'Levi’s Premium Vintage Sherpa Trucker Jacket',
      brand: 'Levi’s',
      description: 'Classic medium wash denim trucker jacket lined with warm sherpa fleece. Kept in pristine condition, no stains or fading.',
      original_price: 2999,
      selling_price: 499,
      condition_grade: 'Excellent',
      condition_score: 92,
      times_worn: 3,
      why_selling: 'No longer fits',
      size: 'L',
      color: 'Indigo Blue',
      material: '100% Heavy Cotton Denim',
      target_gender: 'Men',
      location: 'Kothrud, Pune',
      is_available: true,
      approval_status: 'approved',
      view_count: 410,
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      fit_notes: "Seller is 5'10, 72kg. Regular L fit, easily layers over a hoodie or long sleeve tee.",
      created_at: '2026-09-25T16:00:00Z'
    },
    {
      product_id: 8,
      seller_id: 3,
      category_id: 1,
      title: 'Uniqlo Supima Cotton Relaxed Fit Shirts (Set of 2)',
      brand: 'Uniqlo',
      description: 'Two crisp Supima cotton button-down shirts in White and Sky Blue. High thread count, iron-friendly finish.',
      original_price: 1499,
      selling_price: 329,
      condition_grade: 'Like New',
      condition_score: 95,
      times_worn: 2,
      why_selling: 'Worn only a few times',
      size: 'M',
      color: 'White & Sky Blue',
      material: '100% Supima Cotton',
      target_gender: 'Men',
      location: 'Kothrud, Pune',
      is_available: true,
      approval_status: 'approved',
      view_count: 245,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      fit_notes: "Clean casual collar fit. Clicked at office during presentation day.",
      created_at: '2026-09-26T12:00:00Z'
    },
    {
      product_id: 9,
      seller_id: 3,
      category_id: 4,
      title: 'Fossil Grant Chronograph Leather Watch',
      brand: 'Fossil',
      description: 'Roman numeral navy dial with rose gold accents and genuine brown leather strap. Battery recently replaced by Fossil service center.',
      original_price: 2790,
      selling_price: 449,
      condition_grade: 'Excellent',
      condition_score: 91,
      times_worn: 5,
      why_selling: 'Bought but rarely used',
      size: '44mm',
      color: 'Navy Blue & Rose Gold',
      material: 'Stainless Steel & Leather',
      target_gender: 'Men',
      location: 'Kothrud, Pune',
      is_available: true,
      approval_status: 'approved',
      view_count: 315,
      images: [
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Fits nicely on wrist without feeling overly bulky. Genuine leather softened comfortably.',
      created_at: '2026-09-26T14:00:00Z'
    },
    {
      product_id: 10,
      seller_id: 3,
      category_id: 6,
      title: 'Ray-Ban Classic Aviator Sunglasses (RB3025)',
      brand: 'Ray-Ban',
      description: 'Gold metal frames with polarized G-15 green lenses. Comes with original leather case and cleaning cloth.',
      original_price: 1990,
      selling_price: 349,
      condition_grade: 'Like New',
      condition_score: 96,
      times_worn: 2,
      why_selling: 'No longer my style',
      size: 'Standard 58mm',
      color: 'Gold / Green',
      material: 'Metal Alloy',
      target_gender: 'Unisex',
      location: 'Kothrud, Pune',
      is_available: true,
      approval_status: 'approved',
      view_count: 520,
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Standard 58mm frame. Super lightweight on bridge of nose; lenses 100% scratch free.',
      created_at: '2026-09-27T09:00:00Z'
    },
    {
      product_id: 22,
      seller_id: 8,
      category_id: 2,
      title: 'New Balance 550 "White Grey" Classic',
      brand: 'New Balance',
      description: 'Hype retro basketball sneaker. Premium leather with suede toe cap. Clean sole, kept in air-tight box with silica gel.',
      original_price: 2999,
      selling_price: 599,
      condition_grade: 'Like New',
      condition_score: 96,
      times_worn: 2,
      why_selling: 'Wardrobe refresh',
      size: 'UK 9.5',
      color: 'White & Neutral Grey',
      material: 'Leather & Suede',
      target_gender: 'Men',
      location: 'Juhu, Mumbai',
      is_available: true,
      approval_status: 'approved',
      view_count: 920,
      images: [
        'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Clean on-foot look. Soles wiped clean after 2 casual mall visits.',
      created_at: '2026-09-27T11:00:00Z'
    },
    {
      product_id: 23,
      seller_id: 8,
      category_id: 1,
      title: 'Fear of God Essentials Oversized Hoodie',
      brand: 'Essentials',
      description: 'Heavyweight fleece hoodie in Buttercream colorway. Iconic reflective back logo. Extremely cozy oversized drape.',
      original_price: 2190,
      selling_price: 429,
      condition_grade: 'Excellent',
      condition_score: 94,
      times_worn: 3,
      why_selling: 'No longer fits',
      size: 'M (Oversized)',
      color: 'Buttercream / Beige',
      material: '80% Cotton Fleece',
      target_gender: 'Unisex',
      location: 'Juhu, Mumbai',
      is_available: true,
      approval_status: 'approved',
      view_count: 760,
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Roomy relaxed streetwear silhouette. Heavyweight cotton fleece, warm and soft.',
      created_at: '2026-09-28T09:00:00Z'
    },
    {
      product_id: 32,
      seller_id: 11,
      category_id: 1,
      title: 'COS Minimalist Wool Blend Trench Coat',
      brand: 'COS',
      description: 'Tailored camel double-breasted trench coat with storm flap and removable belt. Architectural Scandinavian cut.',
      original_price: 2990,
      selling_price: 549,
      condition_grade: 'Like New',
      condition_score: 98,
      times_worn: 1,
      why_selling: 'Occasion-specific',
      size: 'EU 36 / S',
      color: 'Camel Tan',
      material: 'Wool & Recycled Polyamide',
      target_gender: 'Women',
      location: 'Koregaon Park, Pune',
      is_available: true,
      approval_status: 'approved',
      view_count: 740,
      images: [
        'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=800&q=80',
      fit_notes: "Worn on a winter holiday in Himachal. Seller is 5'6, length hits right below knees.",
      created_at: '2026-09-28T14:00:00Z'
    },
    {
      product_id: 33,
      seller_id: 11,
      category_id: 5,
      title: 'Polène Numéro Un Nano Structured Bag',
      brand: 'Polène Paris',
      description: 'Full grain textured calf leather sculpted into elegant curves. Gold hardware with top handle and crossbody strap.',
      original_price: 2800,
      selling_price: 489,
      condition_grade: 'Like New',
      condition_score: 99,
      times_worn: 1,
      why_selling: 'Occasion-specific',
      size: 'Nano',
      color: 'Chalk / Ivory',
      material: 'Full Grain Calfskin',
      target_gender: 'Women',
      location: 'Koregaon Park, Pune',
      is_available: true,
      approval_status: 'approved',
      view_count: 890,
      images: [
        'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Super chic held in hand or crossbody. Pristine corners, zero marks.',
      created_at: '2026-09-29T10:00:00Z'
    },
    {
      product_id: 50,
      seller_id: 4,
      category_id: 1,
      title: 'H&M Linen Blend Oversized Resort Shirt',
      brand: 'H&M',
      description: 'Breezy camp-collar relaxed shirt. Perfect for beach vacations or summer day outs.',
      original_price: 999,
      selling_price: 199,
      condition_grade: 'Like New',
      condition_score: 96,
      times_worn: 1,
      why_selling: 'Wardrobe refresh',
      size: 'S',
      color: 'Sage Floral',
      material: 'Linen & Viscose',
      target_gender: 'Women',
      location: 'Nashik Road, Nashik',
      is_available: true,
      approval_status: 'approved',
      view_count: 280,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Breezy relaxed fit on a beach trip. Looks adorable unbuttoned over a cami.',
      created_at: '2026-09-30T10:00:00Z'
    },
    {
      product_id: 61,
      seller_id: 4,
      category_id: 1,
      title: 'Urbanic Oversized Corduroy Shacket in Mustard',
      brand: 'Urbanic',
      description: 'Heavyweight ribbed corduroy shacket with dual flap pockets and tortoiseshell buttons.',
      original_price: 1199,
      selling_price: 249,
      condition_grade: 'Like New',
      condition_score: 94,
      times_worn: 2,
      why_selling: 'No longer fits',
      size: 'M',
      color: 'Mustard Yellow',
      material: '100% Cotton Corduroy',
      target_gender: 'Women',
      location: 'College Road, Nashik',
      is_available: true,
      approval_status: 'pending',
      view_count: 12,
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'
      ],
      worn_photo_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      fit_notes: 'Oversized boxy fit. Warm ribbed texture, great for evening college hangouts.',
      created_at: '2026-10-04T07:30:00Z'
    }
  ] as Product[],

  addresses: [
    {
      address_id: 1,
      user_id: 4,
      recipient_name: 'Ananya Deshmukh',
      phone: '+91 98233 99887',
      street_address: 'Flat 402, Shivshrushti Apts, Off College Road',
      landmark: 'Near BYK College of Commerce',
      city: 'Nashik',
      state: 'Maharashtra',
      pincode: '422005',
      address_type: 'Home',
      is_default: true
    },
    {
      address_id: 2,
      user_id: 3,
      recipient_name: 'Aarav Mehta',
      phone: '+91 98230 66778',
      street_address: 'Row House 12, Mayur Colony, Kothrud',
      landmark: 'Behind City Pride Multiplex',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      address_type: 'Home',
      is_default: true
    }
  ] as Address[],

  cart: [
    { user_id: 4, product_id: 10, quantity: 1 }
  ] as { user_id: number; product_id: number; quantity: number }[],

  wishlist: [
    { user_id: 4, product_id: 3 },
    { user_id: 4, product_id: 6 },
    { user_id: 4, product_id: 22 }
  ] as { user_id: number; product_id: number }[],

  orders: [
    {
      order_id: 1,
      order_number: 'REV-2026-88192',
      buyer_id: 4,
      delivery_address: {
        address_id: 1,
        user_id: 4,
        recipient_name: 'Ananya Deshmukh',
        phone: '+91 98233 99887',
        street_address: 'Flat 402, Shivshrushti Apts, Off College Road',
        landmark: 'Near BYK College of Commerce',
        city: 'Nashik',
        state: 'Maharashtra',
        pincode: '422005',
        address_type: 'Home',
        is_default: true
      },
      subtotal: 449,
      delivery_charge: 49,
      platform_fee: 19,
      total_amount: 517,
      order_status: 'Delivered',
      payment_status: 'Paid',
      payment_method: 'UPI',
      transaction_ref: 'TXN_REV_UPI_982419082',
      items: [
        {
          order_item_id: 1,
          order_id: 1,
          product_id: 1,
          seller_id: 2,
          price_at_purchase: 449,
          platform_commission_pct: 5,
          platform_commission_amount: 22.45,
          seller_earnings: 426.55
        }
      ],
      tracking: [
        { step: 'Order Confirmed', description: 'Payment verified. Order received by Revogue hub.', location: 'Mumbai Central Hub', is_completed: true, timestamp: '2026-09-28 10:16 AM' },
        { step: 'Seller Preparing', description: 'Seller Priya Sharma packaged the blazer with eco-wrap.', location: 'Bandra, Mumbai', is_completed: true, timestamp: '2026-09-28 03:40 PM' },
        { step: 'Ready for Pickup', description: 'Pickup scheduled with Revogue Express Partner.', location: 'Bandra Hub, Mumbai', is_completed: true, timestamp: '2026-09-29 09:30 AM' },
        { step: 'Picked Up', description: 'Revogue courier collected and verified item condition.', location: 'Mumbai Transit Facility', is_completed: true, timestamp: '2026-09-29 12:10 PM' },
        { step: 'In Transit', description: 'Package departed sorting hub via expressway to Nashik.', location: 'Igatpuri Checkpoint', is_completed: true, timestamp: '2026-09-29 07:45 PM' },
        { step: 'Out for Delivery', description: 'Courier agent (Vikas K.) out for doorstep delivery.', location: 'College Road Hub, Nashik', is_completed: true, timestamp: '2026-09-30 11:20 AM' },
        { step: 'Delivered', description: 'Delivered safely to Ananya Deshmukh with OTP confirmation.', location: 'College Road, Nashik', is_completed: true, timestamp: '2026-09-30 02:05 PM' }
      ],
      created_at: '2026-09-28T10:15:00Z'
    },
    {
      order_id: 2,
      order_number: 'REV-2026-90412',
      buyer_id: 4,
      delivery_address: {
        address_id: 1,
        user_id: 4,
        recipient_name: 'Ananya Deshmukh',
        phone: '+91 98233 99887',
        street_address: 'Flat 402, Shivshrushti Apts, Off College Road',
        landmark: 'Near BYK College of Commerce',
        city: 'Nashik',
        state: 'Maharashtra',
        pincode: '422005',
        address_type: 'Home',
        is_default: true
      },
      subtotal: 499,
      delivery_charge: 49,
      platform_fee: 19,
      total_amount: 567,
      order_status: 'In Transit',
      payment_status: 'Paid',
      payment_method: 'Card',
      transaction_ref: 'TXN_REV_CARD_33910281',
      items: [
        {
          order_item_id: 2,
          order_id: 2,
          product_id: 7,
          seller_id: 3,
          price_at_purchase: 499,
          platform_commission_pct: 5,
          platform_commission_amount: 24.95,
          seller_earnings: 474.05
        }
      ],
      tracking: [
        { step: 'Order Confirmed', description: 'Order verified and confirmed.', location: 'Pune Central Hub', is_completed: true, timestamp: '2026-10-02 02:31 PM' },
        { step: 'Seller Preparing', description: 'Seller Aarav boxed the Levi’s jacket.', location: 'Kothrud, Pune', is_completed: true, timestamp: '2026-10-02 05:15 PM' },
        { step: 'Ready for Pickup', description: 'Item queued for hub dispatch.', location: 'Pune Sorting Hub', is_completed: true, timestamp: '2026-10-03 08:30 AM' },
        { step: 'Picked Up', description: 'Quality inspection sealed by Revogue agent.', location: 'Shivajinagar Express Hub', is_completed: true, timestamp: '2026-10-03 11:45 AM' },
        { step: 'In Transit', description: 'Vehicle in transit between Pune and Nashik Distribution.', location: 'Sinnar Expressway Checkpost', is_completed: true, timestamp: '2026-10-04 04:30 AM' },
        { step: 'Out for Delivery', description: 'Scheduled for dispatch today afternoon.', location: 'Nashik Delivery Depot', is_completed: false, timestamp: 'Pending' },
        { step: 'Delivered', description: 'Pending recipient verification.', location: 'Destination Address', is_completed: false, timestamp: 'Pending' }
      ],
      created_at: '2026-10-02T14:30:00Z'
    }
  ] as Order[],

  reviews: [
    {
      review_id: 1,
      product_id: 1,
      order_id: 1,
      reviewer_id: 4,
      seller_id: 2,
      product_rating: 5,
      seller_rating: 5,
      comment: 'The Zara blazer is in breathtaking condition! Literally looks like it came straight off the showroom rack. Fit is exactly as shown in Priya’s on-body wear photo. Loved the eco-friendly packaging and handwritten note!',
      condition_matched: true,
      reviewer_photo_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      created_at: '2026-09-30T16:00:00Z'
    },
    {
      review_id: 2,
      product_id: 2,
      order_id: 101,
      reviewer_id: 7,
      seller_id: 2,
      product_rating: 5,
      seller_rating: 5,
      comment: 'Wore this Raw Mango silk saree to my cousin’s engagement! Here is a photo of how it draped on me. Fabric is super lightweight and zero scent or stains. Genuine second-hand treasure.',
      condition_matched: true,
      reviewer_photo_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      created_at: '2026-10-01T12:00:00Z'
    },
    {
      review_id: 3,
      product_id: 7,
      order_id: 102,
      reviewer_id: 21,
      seller_id: 3,
      product_rating: 5,
      seller_rating: 5,
      comment: 'Levi’s Sherpa jacket fits so warm! Clicked this photo while wearing it out in Nashik evening breeze. Pristine sherpa lining and heavy denim feel. 10/10 purchase at ₹499.',
      condition_matched: true,
      reviewer_photo_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      created_at: '2026-10-02T18:30:00Z'
    },
    {
      review_id: 4,
      product_id: 5,
      order_id: 103,
      reviewer_id: 6,
      seller_id: 2,
      product_rating: 5,
      seller_rating: 5,
      comment: 'Pleats on this Massimo Dutti dress are intact and fall so smoothly on the body! Adding my try-on photo for reference. Super happy with the condition grading score accuracy.',
      condition_matched: true,
      reviewer_photo_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
      created_at: '2026-10-03T11:20:00Z'
    },
    {
      review_id: 5,
      product_id: 6,
      order_id: 104,
      reviewer_id: 8,
      seller_id: 3,
      product_rating: 5,
      seller_rating: 5,
      comment: 'Authentic Jordan 1 Chicago at an unbelievable thrift price. Soles are clean and toe box is crisp. Attaching my on-foot try-on pic. Fast dispatch by seller!',
      condition_matched: true,
      reviewer_photo_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      created_at: '2026-10-03T17:45:00Z'
    }
  ] as Review[],

  notifications: [
    {
      notification_id: 1,
      user_id: 4,
      title: 'Order Delivered! 🎉',
      message: 'Your order REV-2026-88192 (ZARA Tailored Blazer) has been delivered safely. Tap to review.',
      type: 'delivery',
      is_read: true,
      link_url: '/orders/1',
      created_at: '2026-09-30T14:06:00Z'
    },
    {
      notification_id: 2,
      user_id: 4,
      title: 'Order In Transit 🚚',
      message: 'Your order REV-2026-90412 is currently in transit between Pune and Nashik.',
      type: 'delivery',
      is_read: false,
      link_url: '/orders/2',
      created_at: '2026-10-04T04:31:00Z'
    },
    {
      notification_id: 3,
      user_id: 2,
      title: 'Payout Credited 💰',
      message: '₹2,327.50 for Order REV-2026-88192 has been scheduled to your UPI ID riya.sharma@okaxis.',
      type: 'payout',
      is_read: false,
      link_url: '/seller/payouts',
      created_at: '2026-09-30T14:30:00Z'
    },
    {
      notification_id: 4,
      user_id: 1,
      title: 'New Listing Pending Approval ⚖️',
      message: 'Urbanic Oversized Corduroy Shacket submitted by Ananya Deshmukh requires review.',
      type: 'approval',
      is_read: false,
      link_url: '/admin/approvals',
      created_at: '2026-10-04T07:31:00Z'
    }
  ] as Notification[],

  reports: [] as Report[]
};

// =====================================================================
// Auth Middleware
// =====================================================================

interface AuthenticatedRequest extends Request {
  user?: User;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number; email: string };
    const user = DB.users.find(u => u.user_id === decoded.user_id && u.is_active);
    if (!user) {
      return res.status(403).json({ error: 'User not found or inactive' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role_id !== 2) {
    return res.status(403).json({ error: 'Admin authorization required' });
  }
  next();
};

// =====================================================================
// Express Application Setup
// =====================================================================

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS Headers for API calls
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // -------------------------------------------------------------------
  // 1. Auth REST API
  // -------------------------------------------------------------------

  // Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { full_name, email, password, phone, city, state, is_seller } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (DB.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser: User = {
      user_id: DB.users.length + 1,
      full_name,
      email: email.toLowerCase(),
      password_hash: bcrypt.hashSync(password, 10),
      phone: phone || '+91 98000 00000',
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      city: city || 'Mumbai',
      state: state || 'Maharashtra',
      role_id: 1,
      is_seller: Boolean(is_seller),
      is_creator: false,
      is_active: true,
      created_at: new Date().toISOString()
    };

    DB.users.push(newUser);

    if (is_seller) {
      DB.sellerProfiles.push({
        seller_id: DB.sellerProfiles.length + 1,
        user_id: newUser.user_id,
        store_name: `${newUser.full_name}'s Wardrobe`,
        bio: 'Pre-loved fashion seller on Revogue.',
        trust_score: 90,
        rating: 5.0,
        total_sales: 0,
        cancellation_rate: 0,
        is_verified: true,
        total_earnings: 0,
        pending_payout: 0,
        upi_id: `${newUser.email.split('@')[0]}@okhdfc`
      });
    }

    const token = jwt.sign({ user_id: newUser.user_id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    const { password_hash, ...safeUser } = newUser;
    return res.status(201).json({ success: true, user: safeUser, token });
  });

  // Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = DB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'This account has been deactivated by administrator' });
    }

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const { password_hash, ...safeUser } = user;
    return res.json({ success: true, user: safeUser, token });
  });

  // Me / Session
  app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const { password_hash, ...safeUser } = user;
    const seller = DB.sellerProfiles.find(s => s.user_id === user.user_id);
    const creator = DB.creatorProfiles.find(c => c.user_id === user.user_id);

    return res.json({
      user: safeUser,
      seller_profile: seller || null,
      creator_profile: creator || null
    });
  });

  // 1-Click Demo Switcher
  app.post('/api/auth/switch-demo', (req: Request, res: Response) => {
    const { role } = req.body; // 'admin' | 'seller' | 'buyer' | 'creator'
    let email = 'buyer@revogue.demo';
    if (role === 'admin') email = 'admin@revogue.demo';
    if (role === 'seller') email = 'seller@revogue.demo';
    if (role === 'creator') email = 'fashionbyriya@revogue.demo';

    const user = DB.users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'Demo user not found' });
    }

    const token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const { password_hash, ...safeUser } = user;
    return res.json({ success: true, user: safeUser, token });
  });

  // -------------------------------------------------------------------
  // 2. Categories REST API
  // -------------------------------------------------------------------
  app.get('/api/categories', (req: Request, res: Response) => {
    return res.json({ categories: DB.categories });
  });

  app.post('/api/categories', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { category_name, description, icon, image_url } = req.body;
    if (!category_name) {
      return res.status(400).json({ error: 'Category name required' });
    }
    const slug = category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCategory: Category = {
      category_id: DB.categories.length + 1,
      category_name,
      slug,
      description: description || '',
      icon: icon || 'Sparkles',
      image_url: image_url || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
      is_active: true
    };
    DB.categories.push(newCategory);
    return res.status(201).json({ success: true, category: newCategory });
  });

  // -------------------------------------------------------------------
  // 3. Products REST API (Marketplace, Search, Filtering, Scoring)
  // -------------------------------------------------------------------
  app.get('/api/products', (req: Request, res: Response) => {
    const {
      search,
      category,
      condition,
      min_price,
      max_price,
      sort,
      seller_id,
      creator_handle,
      status
    } = req.query;

    let items = DB.products.filter(p => {
      // By default show approved & available items unless admin requests pending
      if (status === 'pending') {
        return p.approval_status === 'pending';
      }
      if (status === 'all') {
        return true;
      }
      return p.approval_status === 'approved';
    });

    // Search query
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category) {
      const cat = DB.categories.find(c => c.slug === category || c.category_id === Number(category));
      if (cat) {
        items = items.filter(p => p.category_id === cat.category_id);
      }
    }

    // Condition filter
    if (condition && typeof condition === 'string') {
      items = items.filter(p => p.condition_grade.toLowerCase() === condition.toLowerCase());
    }

    // Price range
    if (min_price) {
      items = items.filter(p => p.selling_price >= Number(min_price));
    }
    if (max_price) {
      items = items.filter(p => p.selling_price <= Number(max_price));
    }

    // Seller ID filter
    if (seller_id) {
      items = items.filter(p => p.seller_id === Number(seller_id));
    }

    // Creator Handle filter
    if (creator_handle && typeof creator_handle === 'string') {
      const cleanHandle = creator_handle.replace('@', '');
      const creator = DB.creatorProfiles.find(c => c.handle.toLowerCase() === cleanHandle.toLowerCase());
      if (creator) {
        items = items.filter(p => p.seller_id === creator.user_id);
      }
    }

    // Sorting
    if (sort === 'price_asc') {
      items.sort((a, b) => a.selling_price - b.selling_price);
    } else if (sort === 'price_desc') {
      items.sort((a, b) => b.selling_price - a.selling_price);
    } else if (sort === 'score_desc') {
      items.sort((a, b) => b.condition_score - a.condition_score);
    } else {
      // Newest default
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Enrich with seller profile and category info
    const enriched = items.map(prod => {
      const seller = DB.users.find(u => u.user_id === prod.seller_id);
      const sellerProfile = DB.sellerProfiles.find(s => s.user_id === prod.seller_id);
      const cat = DB.categories.find(c => c.category_id === prod.category_id);
      return {
        ...prod,
        category_name: cat ? cat.category_name : 'General',
        seller_name: seller ? seller.full_name : 'Verified Seller',
        seller_rating: sellerProfile ? sellerProfile.rating : 4.8,
        seller_trust_score: sellerProfile ? sellerProfile.trust_score : 90,
        seller_is_verified: sellerProfile ? sellerProfile.is_verified : true
      };
    });

    return res.json({ products: enriched, count: enriched.length });
  });

  // Product Details by ID
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const prod = DB.products.find(p => p.product_id === id);

    if (!prod) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Increment view count
    prod.view_count += 1;

    const seller = DB.users.find(u => u.user_id === prod.seller_id);
    const sellerProfile = DB.sellerProfiles.find(s => s.user_id === prod.seller_id);
    const cat = DB.categories.find(c => c.category_id === prod.category_id);

    // Reviews for this product or seller (enriched with reviewer profile info)
    const relevantReviews = DB.reviews.filter(r => r.product_id === prod.product_id || r.seller_id === prod.seller_id);
    const enrichedReviews = relevantReviews.map(r => {
      const reviewer = DB.users.find(u => u.user_id === r.reviewer_id);
      return {
        ...r,
        reviewer_name: reviewer ? reviewer.full_name : 'Verified Member',
        reviewer_avatar: reviewer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        reviewer_city: reviewer?.city || 'Mumbai'
      };
    });

    // Similar products
    const similar = DB.products
      .filter(p => p.category_id === prod.category_id && p.product_id !== prod.product_id && p.is_available)
      .slice(0, 4)
      .map(p => ({
        ...p,
        category_name: cat?.category_name || 'General'
      }));

    return res.json({
      product: {
        ...prod,
        category_name: cat ? cat.category_name : 'General',
        seller: {
          user_id: seller?.user_id,
          name: seller?.full_name,
          avatar: seller?.avatar_url,
          city: seller?.city,
          store_name: sellerProfile?.store_name || `${seller?.full_name}'s Closet`,
          rating: sellerProfile?.rating || 4.8,
          trust_score: sellerProfile?.trust_score || 92,
          total_sales: sellerProfile?.total_sales || 24,
          is_verified: sellerProfile?.is_verified ?? true,
          cancellation_rate: sellerProfile?.cancellation_rate || 0.8
        },
        reviews: enrichedReviews
      },
      similar
    });
  });

  // Create Product Listing (Seller)
  app.post('/api/products', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const {
      title,
      brand,
      category_id,
      description,
      original_price,
      selling_price,
      condition_grade,
      times_worn,
      why_selling,
      size,
      color,
      material,
      target_gender,
      location,
      images,
      worn_photo_url,
      fit_notes
    } = req.body;

    if (!title || !original_price || !selling_price || !category_id) {
      return res.status(400).json({ error: 'Title, category, original and selling prices are required' });
    }

    // Algorithm to calculate Revogue Condition Score (0 - 100)
    let score = 95;
    if (condition_grade === 'Like New') score = 98 - Math.min(times_worn || 1, 3);
    else if (condition_grade === 'Excellent') score = 92 - Math.min(times_worn || 2, 5);
    else if (condition_grade === 'Good') score = 85 - Math.min(times_worn || 4, 8);
    else score = 75;

    const newProduct: Product = {
      product_id: DB.products.length + 1,
      seller_id: user.user_id,
      category_id: Number(category_id),
      title,
      brand: brand || 'Unbranded / Custom',
      description: description || 'Pre-loved item in great shape.',
      original_price: Number(original_price),
      selling_price: Number(selling_price),
      condition_grade: condition_grade || 'Excellent',
      condition_score: Math.max(score, 70),
      times_worn: Number(times_worn) || 1,
      why_selling: why_selling || 'Worn only a few times',
      size: size || 'M',
      color: color || 'Black',
      material: material || 'Cotton Blend',
      target_gender: target_gender || 'Unisex',
      location: location || `${user.city}, ${user.state}`,
      is_available: true,
      approval_status: user.role_id === 2 ? 'approved' : 'pending',
      view_count: 0,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'],
      worn_photo_url: worn_photo_url || (images && images.length ? images[0] : undefined),
      fit_notes: fit_notes || `Fits true to size ${size || 'M'}. Verified by seller.`,
      created_at: new Date().toISOString()
    };

    DB.products.unshift(newProduct);

    // Update user to seller if not already
    if (!user.is_seller) {
      user.is_seller = true;
      if (!DB.sellerProfiles.some(s => s.user_id === user.user_id)) {
        DB.sellerProfiles.push({
          seller_id: DB.sellerProfiles.length + 1,
          user_id: user.user_id,
          store_name: `${user.full_name}'s Wardrobe`,
          bio: 'Curator of quality pre-loved fashion.',
          trust_score: 92,
          rating: 4.8,
          total_sales: 0,
          cancellation_rate: 0,
          is_verified: true,
          total_earnings: 0,
          pending_payout: 0,
          upi_id: `${user.email.split('@')[0]}@okaxis`
        });
      }
    }

    // Create notification for admin
    DB.notifications.push({
      notification_id: DB.notifications.length + 1,
      user_id: 1, // Admin
      title: 'New Listing Pending Review ⚖️',
      message: `"${newProduct.title}" was submitted by ${user.full_name}.`,
      type: 'approval',
      is_read: false,
      link_url: '/admin/approvals',
      created_at: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      product: newProduct,
      message: newProduct.approval_status === 'approved' ? 'Listing is live!' : 'Submitted for quality approval.'
    });
  });

  // Delete product (seller or admin)
  app.delete('/api/products/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const prod = DB.products.find(p => p.product_id === id);

    if (!prod) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (prod.seller_id !== req.user!.user_id && req.user!.role_id !== 2) {
      return res.status(403).json({ error: 'Unauthorized to delete this listing' });
    }

    DB.products = DB.products.filter(p => p.product_id !== id);
    return res.json({ success: true, message: 'Listing removed successfully' });
  });

  // -------------------------------------------------------------------
  // 4. Creator Closets API
  // -------------------------------------------------------------------
  app.get('/api/creators', (req: Request, res: Response) => {
    const creators = DB.creatorProfiles.map(c => {
      const user = DB.users.find(u => u.user_id === c.user_id);
      const sellerProfile = DB.sellerProfiles.find(s => s.user_id === c.user_id);
      const itemsCount = DB.products.filter(p => p.seller_id === c.user_id && p.is_available).length;

      return {
        ...c,
        name: user?.full_name || 'Creator',
        avatar_url: user?.avatar_url,
        city: user?.city,
        rating: sellerProfile?.rating || 4.9,
        sales_count: sellerProfile?.total_sales || 100,
        active_items_count: itemsCount
      };
    });

    return res.json({ creators });
  });

  app.get('/api/creators/:handle', (req: Request, res: Response) => {
    const handle = req.params.handle.replace('@', '');
    const creator = DB.creatorProfiles.find(c => c.handle.toLowerCase() === handle.toLowerCase());

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const user = DB.users.find(u => u.user_id === creator.user_id);
    const seller = DB.sellerProfiles.find(s => s.user_id === creator.user_id);
    const closetItems = DB.products.filter(p => p.seller_id === creator.user_id && p.approval_status === 'approved');

    return res.json({
      creator: {
        ...creator,
        name: user?.full_name,
        avatar_url: user?.avatar_url,
        city: user?.city,
        rating: seller?.rating || 4.9,
        trust_score: seller?.trust_score || 98,
        total_sales: seller?.total_sales || 120
      },
      items: closetItems
    });
  });

  // -------------------------------------------------------------------
  // 5. Revogue Match Recommendation Engine (Smart Matching Algorithm)
  // -------------------------------------------------------------------
  app.post('/api/match', (req: Request, res: Response) => {
    const { budget, category, size, condition, gender } = req.body;

    let matched = DB.products.filter(p => p.is_available && p.approval_status === 'approved');

    if (budget) {
      matched = matched.filter(p => p.selling_price <= Number(budget));
    }
    if (category) {
      const cat = DB.categories.find(c => c.slug === category || c.category_id === Number(category));
      if (cat) {
        matched = matched.filter(p => p.category_id === cat.category_id);
      }
    }
    if (gender && gender !== 'Any') {
      matched = matched.filter(p => p.target_gender === gender || p.target_gender === 'Unisex');
    }
    if (condition && condition !== 'Any') {
      matched = matched.filter(p => p.condition_grade === condition);
    }

    // Rank by condition score and discount percentage
    matched.sort((a, b) => {
      const discountA = ((a.original_price - a.selling_price) / a.original_price) * 100;
      const discountB = ((b.original_price - b.selling_price) / b.original_price) * 100;
      return (b.condition_score + discountB) - (a.condition_score + discountA);
    });

    return res.json({
      recommendations: matched.slice(0, 8),
      total_matches: matched.length
    });
  });

  // -------------------------------------------------------------------
  // 6. Cart & Wishlist REST API
  // -------------------------------------------------------------------
  app.get('/api/cart', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    const userCart = DB.cart.filter(c => c.user_id === userId);

    const items = userCart.map(c => {
      const product = DB.products.find(p => p.product_id === c.product_id);
      const seller = DB.users.find(u => u.user_id === product?.seller_id);
      return {
        product_id: c.product_id,
        quantity: c.quantity,
        product,
        seller_name: seller?.full_name || 'Verified Seller'
      };
    }).filter(item => item.product !== undefined);

    const subtotal = items.reduce((acc, item) => acc + (item.product!.selling_price * item.quantity), 0);
    const deliveryCharge = subtotal > DB.settings.min_free_delivery_subtotal || subtotal === 0 ? 0 : DB.settings.flat_delivery_charge;
    const platformFee = subtotal > 0 ? DB.settings.platform_fee : 0;
    const total = subtotal + deliveryCharge + platformFee;

    return res.json({
      items,
      summary: {
        subtotal,
        delivery_charge: deliveryCharge,
        platform_fee: platformFee,
        total,
        free_shipping_eligible: subtotal >= DB.settings.min_free_delivery_subtotal,
        free_shipping_threshold: DB.settings.min_free_delivery_subtotal
      }
    });
  });

  app.post('/api/cart', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    const { product_id, quantity } = req.body;

    const prod = DB.products.find(p => p.product_id === Number(product_id));
    if (!prod || !prod.is_available) {
      return res.status(400).json({ error: 'This pre-loved item is no longer available.' });
    }

    const existing = DB.cart.find(c => c.user_id === userId && c.product_id === Number(product_id));
    if (existing) {
      existing.quantity = 1; // Since it's unique pre-loved pieces, quantity is typically 1
    } else {
      DB.cart.push({ user_id: userId, product_id: Number(product_id), quantity: 1 });
    }

    return res.json({ success: true, message: 'Item added to bag' });
  });

  app.delete('/api/cart/:productId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    const prodId = Number(req.params.productId);
    DB.cart = DB.cart.filter(c => !(c.user_id === userId && c.product_id === prodId));
    return res.json({ success: true, message: 'Item removed from bag' });
  });

  app.delete('/api/cart-clear', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    DB.cart = DB.cart.filter(c => c.user_id !== userId);
    return res.json({ success: true });
  });

  // Wishlist
  app.get('/api/wishlist', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    const ids = DB.wishlist.filter(w => w.user_id === userId).map(w => w.product_id);
    const items = DB.products.filter(p => ids.includes(p.product_id));
    return res.json({ items });
  });

  app.post('/api/wishlist', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    const prodId = Number(req.body.product_id);

    if (!DB.wishlist.some(w => w.user_id === userId && w.product_id === prodId)) {
      DB.wishlist.push({ user_id: userId, product_id: prodId });
    }
    return res.json({ success: true, is_wishlisted: true });
  });

  app.delete('/api/wishlist/:productId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    const prodId = Number(req.params.productId);
    DB.wishlist = DB.wishlist.filter(w => !(w.user_id === userId && w.product_id === prodId));
    return res.json({ success: true, is_wishlisted: false });
  });

  // -------------------------------------------------------------------
  // 7. Orders & Mock Checkout Flow
  // -------------------------------------------------------------------
  app.post('/api/orders', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const {
      items, // array of { product_id, quantity }
      delivery_address,
      payment_method,
      payment_details
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!delivery_address || !delivery_address.recipient_name || !delivery_address.street_address) {
      return res.status(400).json({ error: 'Delivery address is incomplete' });
    }

    // Verify availability
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const prod = DB.products.find(p => p.product_id === item.product_id);
      if (!prod || !prod.is_available) {
        return res.status(400).json({ error: `Item "${prod?.title || item.product_id}" is no longer available.` });
      }

      const commissionPct = DB.settings.platform_commission_pct;
      const commissionAmount = (prod.selling_price * commissionPct) / 100;
      const sellerEarnings = prod.selling_price - commissionAmount;

      orderItems.push({
        order_item_id: DB.orders.length * 10 + orderItems.length + 1,
        order_id: DB.orders.length + 1,
        product_id: prod.product_id,
        seller_id: prod.seller_id,
        price_at_purchase: prod.selling_price,
        platform_commission_pct: commissionPct,
        platform_commission_amount: commissionAmount,
        seller_earnings: sellerEarnings
      });

      subtotal += prod.selling_price;
    }

    const deliveryCharge = subtotal > DB.settings.min_free_delivery_subtotal ? 0 : DB.settings.flat_delivery_charge;
    const platformFee = DB.settings.platform_fee;
    const totalAmount = subtotal + deliveryCharge + platformFee;

    const orderNumber = `REV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const transactionRef = `TXN_REV_${payment_method.toUpperCase()}_${Date.now().toString().slice(-8)}`;

    const newOrder: Order = {
      order_id: DB.orders.length + 1,
      order_number: orderNumber,
      buyer_id: user.user_id,
      delivery_address: {
        address_id: DB.addresses.length + 1,
        user_id: user.user_id,
        ...delivery_address
      },
      subtotal,
      delivery_charge: deliveryCharge,
      platform_fee: platformFee,
      total_amount: totalAmount,
      order_status: 'Order Confirmed',
      payment_status: 'Paid',
      payment_method: payment_method || 'UPI',
      transaction_ref: transactionRef,
      items: orderItems,
      tracking: [
        {
          step: 'Order Confirmed',
          description: 'Payment authorized. Order sent to Revogue fulfillment hub.',
          location: `${delivery_address.city} Hub`,
          is_completed: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          step: 'Seller Preparing',
          description: 'Seller has been notified to package the item in eco-friendly wrap.',
          location: 'Seller Location',
          is_completed: false,
          timestamp: 'Pending'
        },
        {
          step: 'Ready for Pickup',
          description: 'Package ready for Revogue pickup courier.',
          location: 'Origin Sorting Depot',
          is_completed: false,
          timestamp: 'Pending'
        },
        {
          step: 'Picked Up',
          description: 'Quality inspection verified by Revogue agent.',
          location: 'Regional Transit Center',
          is_completed: false,
          timestamp: 'Pending'
        },
        {
          step: 'In Transit',
          description: 'Dispatched via express cargo.',
          location: 'En Route',
          is_completed: false,
          timestamp: 'Pending'
        },
        {
          step: 'Out for Delivery',
          description: 'Assigned to delivery associate.',
          location: `${delivery_address.city} Depot`,
          is_completed: false,
          timestamp: 'Pending'
        },
        {
          step: 'Delivered',
          description: 'Delivered securely with buyer OTP confirmation.',
          location: delivery_address.street_address,
          is_completed: false,
          timestamp: 'Pending'
        }
      ],
      created_at: new Date().toISOString()
    };

    DB.orders.unshift(newOrder);

    // Mark products as unavailable (sold)
    for (const item of items) {
      const prod = DB.products.find(p => p.product_id === item.product_id);
      if (prod) {
        prod.is_available = false;

        // Notify seller
        DB.notifications.push({
          notification_id: DB.notifications.length + 1,
          user_id: prod.seller_id,
          title: 'New Order Received! 🛍️',
          message: `Your item "${prod.title}" was purchased for ₹${prod.selling_price.toLocaleString()}. Please pack it for pickup.`,
          type: 'order',
          is_read: false,
          link_url: `/orders/${newOrder.order_id}`,
          created_at: new Date().toISOString()
        });

        // Update seller stats
        const sellerProfile = DB.sellerProfiles.find(s => s.user_id === prod.seller_id);
        if (sellerProfile) {
          sellerProfile.total_sales += 1;
          const comm = (prod.selling_price * DB.settings.platform_commission_pct) / 100;
          sellerProfile.pending_payout += (prod.selling_price - comm);
        }
      }
    }

    // Buyer notification
    DB.notifications.push({
      notification_id: DB.notifications.length + 1,
      user_id: user.user_id,
      title: 'Order Confirmed! 🎉',
      message: `Your order #${newOrder.order_number} for ₹${newOrder.total_amount.toLocaleString()} is confirmed.`,
      type: 'delivery',
      is_read: false,
      link_url: `/orders/${newOrder.order_id}`,
      created_at: new Date().toISOString()
    });

    // Clear cart for purchased items
    const purchasedIds = items.map((i: any) => i.product_id);
    DB.cart = DB.cart.filter(c => !(c.user_id === user.user_id && purchasedIds.includes(c.product_id)));

    return res.status(201).json({
      success: true,
      order: newOrder,
      receipt: {
        receipt_no: `RCP-${newOrder.order_number}`,
        transaction_ref: transactionRef,
        date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        buyer_name: user.full_name,
        buyer_email: user.email,
        subtotal: newOrder.subtotal,
        delivery_charge: newOrder.delivery_charge,
        platform_fee: newOrder.platform_fee,
        total: newOrder.total_amount,
        payment_method: newOrder.payment_method
      }
    });
  });

  // Get orders list
  app.get('/api/orders', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    let userOrders = DB.orders.filter(o => o.buyer_id === user.user_id);

    // If user is also a seller, include orders where they have sold products
    if (user.is_seller) {
      const sellerOrders = DB.orders.filter(o =>
        o.items.some(it => it.seller_id === user.user_id) && o.buyer_id !== user.user_id
      );
      // We return both buyer orders and incoming seller sales
      return res.json({
        buyer_orders: userOrders,
        seller_sales: sellerOrders
      });
    }

    return res.json({ orders: userOrders });
  });

  // Single Order Details + Printable Receipt
  app.get('/api/orders/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const orderId = Number(req.params.id);
    const order = DB.orders.find(o => o.order_id === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization (buyer, seller of an item, or admin)
    const isBuyer = order.buyer_id === req.user!.user_id;
    const isSeller = order.items.some(i => i.seller_id === req.user!.user_id);
    const isAdmin = req.user!.role_id === 2;

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ error: 'Unauthorized to view this order' });
    }

    const enrichedItems = order.items.map(item => {
      const prod = DB.products.find(p => p.product_id === item.product_id);
      const seller = DB.users.find(u => u.user_id === item.seller_id);
      return {
        ...item,
        title: prod?.title || 'Pre-loved Item',
        image: prod?.images[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
        brand: prod?.brand,
        size: prod?.size,
        seller_name: seller?.full_name || 'Verified Seller'
      };
    });

    const buyer = DB.users.find(u => u.user_id === order.buyer_id);

    return res.json({
      order: {
        ...order,
        items: enrichedItems,
        buyer_name: buyer?.full_name,
        buyer_email: buyer?.email,
        buyer_phone: buyer?.phone
      }
    });
  });

  // Update order delivery status (Admin & Seller simulation)
  app.put('/api/orders/:id/status', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const orderId = Number(req.params.id);
    const { status_step } = req.body;
    const order = DB.orders.find(o => o.order_id === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify authorized user
    if (req.user!.role_id !== 2 && !order.items.some(i => i.seller_id === req.user!.user_id)) {
      return res.status(403).json({ error: 'Only admins or authorized sellers can update status' });
    }

    order.order_status = status_step;

    // Advance milestones in tracking timeline
    let matched = false;
    for (const milestone of order.tracking) {
      if (milestone.step === status_step) {
        milestone.is_completed = true;
        milestone.timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        matched = true;
        break;
      }
      milestone.is_completed = true;
    }

    // Notify buyer
    DB.notifications.push({
      notification_id: DB.notifications.length + 1,
      user_id: order.buyer_id,
      title: `Order Status: ${status_step} 🚚`,
      message: `Your order #${order.order_number} is now marked as "${status_step}".`,
      type: 'delivery',
      is_read: false,
      link_url: `/orders/${order.order_id}`,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, order });
  });

  // -------------------------------------------------------------------
  // 8. Reviews REST API
  // -------------------------------------------------------------------
  app.post('/api/reviews', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user!;
    const { product_id, order_id, product_rating, seller_rating, comment, condition_matched, reviewer_photo_url } = req.body;

    const order = DB.orders.find(o => o.order_id === Number(order_id) && o.buyer_id === user.user_id);
    if (!order) {
      return res.status(400).json({ error: 'You can only review products from your verified delivered orders' });
    }

    const prod = DB.products.find(p => p.product_id === Number(product_id));
    if (!prod) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newReview: Review = {
      review_id: DB.reviews.length + 1,
      product_id: Number(product_id),
      order_id: Number(order_id),
      reviewer_id: user.user_id,
      seller_id: prod.seller_id,
      product_rating: Number(product_rating) || 5,
      seller_rating: Number(seller_rating) || 5,
      comment: comment || 'Product arrived in exact described condition.',
      condition_matched: condition_matched !== false,
      reviewer_photo_url: reviewer_photo_url || undefined,
      created_at: new Date().toISOString()
    };

    DB.reviews.push(newReview);

    // Notify seller
    DB.notifications.push({
      notification_id: DB.notifications.length + 1,
      user_id: prod.seller_id,
      title: 'New 5-Star Review Received! ⭐',
      message: `${user.full_name} reviewed your item "${prod.title}".`,
      type: 'review',
      is_read: false,
      link_url: `/products/${prod.product_id}`,
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ success: true, review: newReview });
  });

  // -------------------------------------------------------------------
  // 9. Notifications REST API
  // -------------------------------------------------------------------
  app.get('/api/notifications', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    const notifs = DB.notifications.filter(n => n.user_id === userId);
    notifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const unreadCount = notifs.filter(n => !n.is_read).length;
    return res.json({ notifications: notifs, unread_count: unreadCount });
  });

  app.put('/api/notifications/:id/read', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const notif = DB.notifications.find(n => n.notification_id === id && n.user_id === req.user!.user_id);
    if (notif) notif.is_read = true;
    return res.json({ success: true });
  });

  app.put('/api/notifications-read-all', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    DB.notifications.filter(n => n.user_id === userId).forEach(n => { n.is_read = true; });
    return res.json({ success: true });
  });

  // -------------------------------------------------------------------
  // 10. Reports REST API
  // -------------------------------------------------------------------
  app.post('/api/reports', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const { product_id, seller_id, reason, details } = req.body;
    const newReport: Report = {
      report_id: DB.reports.length + 1,
      reporter_id: req.user!.user_id,
      product_id: product_id ? Number(product_id) : undefined,
      seller_id: seller_id ? Number(seller_id) : undefined,
      reason: reason || 'Misleading Description',
      details: details || '',
      status: 'Pending Review',
      created_at: new Date().toISOString()
    };
    DB.reports.push(newReport);
    return res.status(201).json({ success: true, message: 'Report submitted for moderation review.' });
  });

  // -------------------------------------------------------------------
  // 11. Seller Dashboard APIs
  // -------------------------------------------------------------------
  app.get('/api/seller/stats', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.user_id;
    const profile = DB.sellerProfiles.find(s => s.user_id === userId);
    const listings = DB.products.filter(p => p.seller_id === userId);

    const activeListings = listings.filter(p => p.is_available && p.approval_status === 'approved');
    const pendingListings = listings.filter(p => p.approval_status === 'pending');
    const soldListings = listings.filter(p => !p.is_available);

    const incomingSales = DB.orders.filter(o => o.items.some(i => i.seller_id === userId));

    const totalRevenue = incomingSales.reduce((acc, order) => {
      const sellerItems = order.items.filter(i => i.seller_id === userId);
      return acc + sellerItems.reduce((sum, it) => sum + it.seller_earnings, 0);
    }, 0);

    const commissionDeducted = incomingSales.reduce((acc, order) => {
      const sellerItems = order.items.filter(i => i.seller_id === userId);
      return acc + sellerItems.reduce((sum, it) => sum + it.platform_commission_amount, 0);
    }, 0);

    return res.json({
      profile: profile || {
        store_name: `${req.user!.full_name}'s Wardrobe`,
        rating: 4.9,
        trust_score: 95,
        is_verified: true,
        upi_id: 'seller@okhdfc'
      },
      counts: {
        active: activeListings.length,
        pending: pendingListings.length,
        sold: soldListings.length,
        total: listings.length
      },
      financials: {
        gross_sales: totalRevenue + commissionDeducted,
        commission_deducted: commissionDeducted,
        net_earnings: totalRevenue,
        pending_payout: profile ? profile.pending_payout : 2327.5
      },
      listings
    });
  });

  // -------------------------------------------------------------------
  // 12. Admin Dashboard & Moderation APIs
  // -------------------------------------------------------------------
  app.get('/api/admin/analytics', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const totalOrders = DB.orders.length;
    const totalGrossRevenue = DB.orders.reduce((acc, o) => acc + o.total_amount, 0);
    const totalCommission = DB.orders.reduce((acc, o) => {
      return acc + o.items.reduce((s, it) => s + it.platform_commission_amount, 0);
    }, 0);
    const totalDeliveryCharges = DB.orders.reduce((acc, o) => acc + o.delivery_charge, 0);
    const totalPlatformFees = DB.orders.reduce((acc, o) => acc + o.platform_fee, 0);

    const activeProducts = DB.products.filter(p => p.approval_status === 'approved' && p.is_available).length;
    const pendingProducts = DB.products.filter(p => p.approval_status === 'pending').length;
    const totalUsers = DB.users.length;
    const activeSellers = DB.users.filter(u => u.is_seller).length;

    return res.json({
      revenue: {
        gross_sales: totalGrossRevenue,
        commission_earned: totalCommission,
        delivery_collected: totalDeliveryCharges,
        platform_fees: totalPlatformFees,
        net_platform_profit: totalCommission + totalPlatformFees
      },
      counts: {
        total_users: totalUsers,
        active_sellers: activeSellers,
        total_products: DB.products.length,
        active_products: activeProducts,
        pending_approvals: pendingProducts,
        total_orders: totalOrders
      },
      pending_approvals_list: DB.products.filter(p => p.approval_status === 'pending'),
      recent_orders: DB.orders.slice(0, 10),
      reports: DB.reports
    });
  });

  app.put('/api/admin/products/:id/approve', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const prod = DB.products.find(p => p.product_id === id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    prod.approval_status = 'approved';

    // Notify seller
    DB.notifications.push({
      notification_id: DB.notifications.length + 1,
      user_id: prod.seller_id,
      title: 'Listing Approved! ✨',
      message: `Your item "${prod.title}" has been verified and is now live in the marketplace.`,
      type: 'approval',
      is_read: false,
      link_url: `/products/${prod.product_id}`,
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Listing approved' });
  });

  app.put('/api/admin/products/:id/reject', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const prod = DB.products.find(p => p.product_id === id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    prod.approval_status = 'rejected';
    prod.is_available = false;

    // Notify seller
    DB.notifications.push({
      notification_id: DB.notifications.length + 1,
      user_id: prod.seller_id,
      title: 'Listing Update Required ⚠️',
      message: `Your item "${prod.title}" did not meet Revogue quality guidelines. Please check photos and descriptions.`,
      type: 'approval',
      is_read: false,
      link_url: '/seller/listings',
      created_at: new Date().toISOString()
    });

    return res.json({ success: true, message: 'Listing rejected' });
  });

  app.get('/api/admin/users', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const safeUsers = DB.users.map(({ password_hash, ...u }) => u);
    return res.json({ users: safeUsers });
  });

  app.put('/api/admin/users/:id/toggle', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const u = DB.users.find(user => user.user_id === id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    u.is_active = !u.is_active;
    return res.json({ success: true, is_active: u.is_active });
  });

  // -------------------------------------------------------------------
  // 13. Sustainability Impact Statistics
  // -------------------------------------------------------------------
  app.get('/api/impact', (req: Request, res: Response) => {
    // Assumptions for sustainable re-use calculations:
    // Avg 1 re-homed garment saves approx 2,700 liters of water and 8.5 kg CO2 vs buying new
    const totalResold = DB.orders.reduce((acc, o) => acc + o.items.length, 0) + 142; // baseline project data
    const waterSavedLiters = totalResold * 2700;
    const co2OffsetKg = Math.round(totalResold * 8.5);
    const textileDivertedKg = Math.round(totalResold * 0.45);

    return res.json({
      total_items_reloved: totalResold,
      water_saved_liters: waterSavedLiters,
      co2_offset_kg: co2OffsetKg,
      textiles_diverted_kg: textileDivertedKg,
      methodology: 'Based on Ellen MacArthur Foundation & Textile Exchange circular fashion lifecycle data models.'
    });
  });

  // -------------------------------------------------------------------
  // 14. Mount Vite Middlewares in Dev or Serve Static in Prod
  // -------------------------------------------------------------------
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[REVOGUE] Server running on port ${PORT}`);
    console.log(`[REVOGUE] REST API available at http://localhost:${PORT}/api/products`);
    console.log(`[REVOGUE] Demo Admin: admin@revogue.demo | Pass: revogue123`);
  });
}

startServer().catch(err => {
  console.error('[REVOGUE] Failed to start server:', err);
});

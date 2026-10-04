export interface User {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  city: string;
  state: string;
  role_id: number; // 1: User, 2: Admin, 3: Creator
  is_seller: boolean;
  is_creator: boolean;
  is_active: boolean;
  created_at: string;
}

export interface SellerProfile {
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

export interface CreatorProfile {
  creator_id: number;
  user_id: number;
  handle: string;
  social_bio: string;
  followers_count: string;
  featured_badge: string;
  cover_image: string;
  name?: string;
  avatar_url?: string;
  city?: string;
  rating?: number;
  sales_count?: number;
  active_items_count?: number;
}

export interface Category {
  category_id: number;
  category_name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  is_active: boolean;
}

export interface Product {
  product_id: number;
  seller_id: number;
  category_id: number;
  title: string;
  brand: string;
  description: string;
  original_price: number;
  selling_price: number;
  condition_grade: 'Like New' | 'Excellent' | 'Good' | 'Fair';
  condition_score: number; // 0 - 100
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
  worn_photo_url?: string; // Real-life photo of product worn on body
  fit_notes?: string; // e.g. "Seller is 5'5, fits true to size with relaxed drape"
  created_at: string;
  // Enriched fields from API:
  category_name?: string;
  seller_name?: string;
  seller_rating?: number;
  seller_trust_score?: number;
  seller_is_verified?: boolean;
}

export interface Address {
  address_id?: number;
  user_id?: number;
  recipient_name: string;
  phone: string;
  street_address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  address_type?: 'Home' | 'Office' | 'Other';
  is_default?: boolean;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  product?: Product;
  seller_name?: string;
}

export interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  seller_id: number;
  price_at_purchase: number;
  platform_commission_pct: number;
  platform_commission_amount: number;
  seller_earnings: number;
  title?: string;
  image?: string;
  brand?: string;
  size?: string;
  seller_name?: string;
}

export interface DeliveryMilestone {
  step: string;
  description: string;
  location: string;
  is_completed: boolean;
  timestamp: string;
}

export interface Order {
  order_id: number;
  order_number: string;
  buyer_id: number;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
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

export interface Review {
  review_id: number;
  product_id: number;
  order_id: number;
  reviewer_id: number;
  seller_id: number;
  product_rating: number;
  seller_rating: number;
  comment: string;
  condition_matched: boolean;
  reviewer_photo_url?: string; // Photo of how it looks on buyer
  reviewer_name?: string;
  reviewer_avatar?: string;
  reviewer_city?: string;
  created_at: string;
}

export interface NotificationItem {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'order' | 'approval' | 'delivery' | 'payout' | 'review' | 'system';
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

export interface SustainabilityImpact {
  total_items_reloved: number;
  water_saved_liters: number;
  co2_offset_kg: number;
  textiles_diverted_kg: number;
  methodology: string;
}

import {
  User,
  Product,
  Category,
  CreatorProfile,
  Order,
  Review,
  NotificationItem,
  Address,
  SustainabilityImpact
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('revogue_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data;
  },

  async register(formData: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async switchDemo(role: 'admin' | 'seller' | 'buyer' | 'creator') {
    const res = await fetch(`${API_BASE}/auth/switch-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to switch demo account');
    return data;
  },

  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: Product[]; count: number }> {
    const url = new URL(`${window.location.origin}${API_BASE}/products`);
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }
    const res = await fetch(url.toString());
    const data = await res.json();
    return data;
  },

  async getProductById(id: number): Promise<{ product: Product & { seller: any; reviews: Review[] }; similar: Product[] }> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Product not found');
    return data;
  },

  async createProduct(productData: any) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to list product');
    return data;
  },

  async deleteProduct(id: number) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete product');
    return data;
  },

  // Categories
  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await fetch(`${API_BASE}/categories`);
    return await res.json();
  },

  async createCategory(catData: any) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(catData)
    });
    return await res.json();
  },

  // Creator Closets
  async getCreators(): Promise<{ creators: CreatorProfile[] }> {
    const res = await fetch(`${API_BASE}/creators`);
    return await res.json();
  },

  async getCreator(handle: string): Promise<{ creator: CreatorProfile; items: Product[] }> {
    const res = await fetch(`${API_BASE}/creators/${handle}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Creator not found');
    return data;
  },

  // Revogue Match
  async getMatches(quizData: any): Promise<{ recommendations: Product[]; total_matches: number }> {
    const res = await fetch(`${API_BASE}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData)
    });
    return await res.json();
  },

  // Cart
  async getCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return { items: [], summary: { subtotal: 0, delivery_charge: 0, platform_fee: 0, total: 0 } };
    return await res.json();
  },

  async addToCart(productId: number, quantity: number = 1) {
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId, quantity })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not add to bag');
    return data;
  },

  async removeFromCart(productId: number) {
    const res = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/cart-clear`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Wishlist
  async getWishlist(): Promise<{ items: Product[] }> {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return { items: [] };
    return await res.json();
  },

  async addToWishlist(productId: number) {
    const res = await fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId })
    });
    return await res.json();
  },

  async removeFromWishlist(productId: number) {
    const res = await fetch(`${API_BASE}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Orders
  async createOrder(orderPayload: {
    items: { product_id: number; quantity: number }[];
    delivery_address: Address;
    payment_method: string;
    payment_details?: any;
  }): Promise<{ success: boolean; order: Order; receipt: any }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order placement failed');
    return data;
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async getOrderById(id: number): Promise<{ order: Order }> {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order not found');
    return data;
  },

  async updateOrderStatus(orderId: number, status_step: string) {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status_step })
    });
    return await res.json();
  },

  // Reviews
  async submitReview(reviewData: {
    product_id: number;
    order_id: number;
    product_rating: number;
    seller_rating: number;
    comment: string;
    condition_matched?: boolean;
    reviewer_photo_url?: string;
  }) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit review');
    return data;
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[]; unread_count: number }> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return { notifications: [], unread_count: 0 };
    return await res.json();
  },

  async markNotificationRead(id: number) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications-read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Reports
  async submitReport(reportData: { product_id?: number; seller_id?: number; reason: string; details: string }) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reportData)
    });
    return await res.json();
  },

  // Seller Dashboard
  async getSellerStats() {
    const res = await fetch(`${API_BASE}/seller/stats`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Admin Dashboard
  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async approveProduct(id: number) {
    const res = await fetch(`${API_BASE}/admin/products/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async rejectProduct(id: number) {
    const res = await fetch(`${API_BASE}/admin/products/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  async toggleUserActive(userId: number) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/toggle`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await res.json();
  },

  // Impact
  async getImpact(): Promise<SustainabilityImpact> {
    const res = await fetch(`${API_BASE}/impact`);
    return await res.json();
  }
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, NotificationItem } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartSummary {
  subtotal: number;
  delivery_charge: number;
  platform_fee: number;
  total: number;
  free_shipping_eligible: boolean;
  free_shipping_threshold: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary;
  wishlistIds: number[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isWishlisted: (productId: number) => boolean;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    subtotal: 0,
    delivery_charge: 79,
    platform_fee: 29,
    total: 0,
    free_shipping_eligible: false,
    free_shipping_threshold: 1999
  });
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      const data = await api.getCart();
      setCartItems(data.items || []);
      setCartSummary(data.summary || {
        subtotal: 0,
        delivery_charge: 0,
        platform_fee: 0,
        total: 0,
        free_shipping_eligible: false,
        free_shipping_threshold: 1999
      });
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const refreshWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistIds([]);
      return;
    }
    try {
      const data = await api.getWishlist();
      setWishlistIds((data.items || []).map((p: Product) => p.product_id));
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  const refreshNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadNotifsCount(0);
      return;
    }
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadNotifsCount(data.unread_count || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
      refreshWishlist();
      refreshNotifications();
    } else {
      setCartItems([]);
      setWishlistIds([]);
      setNotifications([]);
      setUnreadNotifsCount(0);
    }
  }, [isAuthenticated, user?.user_id]);

  const addToCart = async (productId: number) => {
    await api.addToCart(productId, 1);
    await refreshCart();
    setIsCartOpen(true);
  };

  const removeFromCart = async (productId: number) => {
    await api.removeFromCart(productId);
    await refreshCart();
  };

  const clearCart = async () => {
    await api.clearCart();
    await refreshCart();
  };

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    const isCurrently = wishlistIds.includes(productId);
    if (isCurrently) {
      await api.removeFromWishlist(productId);
      setWishlistIds(prev => prev.filter(id => id !== productId));
      return false;
    } else {
      await api.addToWishlist(productId);
      setWishlistIds(prev => [...prev, productId]);
      return true;
    }
  };

  const isWishlisted = (productId: number) => wishlistIds.includes(productId);

  const markNotificationRead = async (id: number) => {
    await api.markNotificationRead(id);
    await refreshNotifications();
  };

  const markAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    await refreshNotifications();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSummary,
        wishlistIds,
        notifications,
        unreadNotifsCount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        refreshCart,
        refreshWishlist,
        refreshNotifications,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

import React, { useState, useEffect } from 'react';
import {
  Package,
  Heart,
  MapPin,
  User,
  Clock,
  CheckCircle,
  FileText,
  Star,
  Truck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Order, Product, Address } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

interface BuyerDashboardPageProps {
  onOpenReceipt: (order: Order) => void;
  onOpenReview: (productId: number, orderId: number, title?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const BuyerDashboardPage: React.FC<BuyerDashboardPageProps> = ({
  onOpenReceipt,
  onOpenReview,
  onSelectProduct
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orderRes, wishRes] = await Promise.all([
        api.getOrders(),
        api.getWishlist()
      ]);
      const list = orderRes.buyer_orders || orderRes.orders || [];
      setOrders(list);
      if (list.length > 0) setSelectedOrderForTracking(list[0]);
      setWishlistItems(wishRes.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.user_id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-stone-800 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt=""
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-stone-700"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black font-serif">{user?.full_name}</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Verified Member
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{user?.email} • {user?.phone}</p>
            <div className="flex items-center gap-3 text-xs text-stone-300 mt-2 justify-center sm:justify-start">
              <span>📍 {user?.city}, {user?.state}</span>
              <span>•</span>
              <span>Total Orders: <strong>{orders.length}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl px-5 py-3 text-center">
            <span className="text-[11px] text-stone-400 block font-semibold">Wishlisted</span>
            <strong className="text-amber-300 text-lg">{wishlistItems.length} Pieces</strong>
          </div>
          <div className="bg-stone-900 border border-stone-800 rounded-2xl px-5 py-3 text-center">
            <span className="text-[11px] text-stone-400 block font-semibold">Active Orders</span>
            <strong className="text-emerald-400 text-lg">
              {orders.filter(o => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled').length}
            </strong>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'orders'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          My Orders & Live Tracking ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'wishlist'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          Saved Wishlist ({wishlistItems.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'addresses'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Saved Addresses
        </button>
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200">
              <Package className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h3 className="font-bold text-stone-900 text-sm">No orders placed yet</h3>
              <p className="text-xs text-stone-500 mt-1">
                Explore the marketplace and discover unique pre-loved treasures!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Order Cards List (6 Cols) */}
              <div className="lg:col-span-6 space-y-4">
                {orders.map(order => {
                  const isSelected = selectedOrderForTracking?.order_id === order.order_id;
                  return (
                    <div
                      key={order.order_id}
                      onClick={() => setSelectedOrderForTracking(order)}
                      className={`bg-white rounded-3xl p-5 border transition cursor-pointer ${
                        isSelected
                          ? 'border-stone-950 shadow-md ring-1 ring-stone-950'
                          : 'border-stone-200 hover:border-stone-400 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            #{order.order_number}
                          </div>
                          <div className="text-[11px] text-stone-400">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            order.order_status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>

                      {/* Items previews */}
                      <div className="space-y-2 mb-3">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-stone-800 line-clamp-1">
                              {it.title || `Item #${it.product_id}`}
                            </span>
                            <span className="font-bold text-stone-900 shrink-0 ml-2">
                              ₹{it.price_at_purchase.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-stone-100 pt-3 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-stone-400 block">Total Amount</span>
                          <strong className="text-stone-950 text-sm">
                            ₹{order.total_amount.toLocaleString('en-IN')}
                          </strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onOpenReceipt(order);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Receipt
                          </button>

                          {order.order_status === 'Delivered' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                const firstItem = order.items[0];
                                onOpenReview(firstItem.product_id, order.order_id, firstItem.title);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition"
                            >
                              <Star className="w-3.5 h-3.5" />
                              Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live 7-Step Delivery Timeline Tracker (6 Cols) */}
              <div className="lg:col-span-6">
                {selectedOrderForTracking ? (
                  <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md sticky top-28 space-y-6">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Truck className="w-5 h-5 text-stone-900" />
                          <h3 className="font-bold text-stone-900 text-base">
                            Delivery Timeline
                          </h3>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Order #{selectedOrderForTracking.order_number}
                        </p>
                      </div>

                      <button
                        onClick={() => onOpenReceipt(selectedOrderForTracking)}
                        className="text-xs font-bold text-stone-900 hover:text-amber-800 flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Print Receipt
                      </button>
                    </div>

                    {/* Timeline Milestones */}
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                      {selectedOrderForTracking.tracking.map((m, idx) => (
                        <div key={idx} className="relative">
                          {/* Indicator Dot */}
                          <div
                            className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-white ${
                              m.is_completed ? 'bg-emerald-600 ring-4 ring-emerald-50' : 'bg-stone-300'
                            }`}
                          >
                            {m.is_completed && <CheckCircle className="w-3 h-3" />}
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <h4
                                className={`text-xs font-bold ${
                                  m.is_completed ? 'text-stone-900' : 'text-stone-400'
                                }`}
                              >
                                {m.step}
                              </h4>
                              <span className="text-[10px] text-stone-400">{m.timestamp}</span>
                            </div>
                            <p className="text-xs text-stone-600 mt-0.5">{m.description}</p>
                            {m.location && (
                              <span className="text-[10px] text-stone-400 flex items-center gap-0.5 mt-0.5">
                                📍 {m.location}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Destination */}
                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs">
                      <span className="font-bold text-stone-700 block mb-1">
                        Shipping Address:
                      </span>
                      <p className="text-stone-600">
                        {selectedOrderForTracking.delivery_address.recipient_name} ({selectedOrderForTracking.delivery_address.phone})<br />
                        {selectedOrderForTracking.delivery_address.street_address}, {selectedOrderForTracking.delivery_address.city} - {selectedOrderForTracking.delivery_address.pincode}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-stone-400">
                    Select an order on the left to track shipment.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistItems.length === 0 ? (
            <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200">
              <Heart className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h3 className="font-bold text-stone-900 text-sm">Your wishlist is empty</h3>
              <p className="text-xs text-stone-500 mt-1">
                Save pre-loved items you love so you can purchase them anytime!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map(prod => (
                <ProductCard
                  key={prod.product_id}
                  product={prod}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded">
                Home (Default)
              </span>
              <span className="text-xs text-emerald-700 font-semibold">✓ Verified</span>
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Ananya Deshmukh</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Flat 402, Shivshrushti Apts, Off College Road,<br />
              Near BYK College of Commerce, Nashik, Maharashtra - 422005
            </p>
            <p className="text-xs text-stone-500">Phone: +91 98233 99887</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded">
                Work / Studio
              </span>
            </div>
            <h4 className="font-bold text-stone-900 text-sm">Ananya Deshmukh</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              CoWork Hub, 3rd Floor, Gangapur Plaza,<br />
              Opposite Big Bazaar, Nashik, Maharashtra - 422013
            </p>
            <p className="text-xs text-stone-500">Phone: +91 98233 99887</p>
          </div>
        </div>
      )}
    </div>
  );
};

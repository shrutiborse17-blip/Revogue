import React, { useState, useEffect } from 'react';
import {
  Store,
  PlusCircle,
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Truck,
  IndianRupee,
  AlertCircle
} from 'lucide-react';
import { Product, Order } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SellerDashboardPageProps {
  onOpenSellModal: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({
  onOpenSellModal,
  onSelectProduct
}) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [incomingOrders, setIncomingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'payouts'>('listings');

  const loadSellerData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.getSellerStats(),
        api.getOrders()
      ]);
      setStats(statsRes);
      setIncomingOrders(ordersRes.seller_sales || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, [user?.user_id]);

  const handleDeleteListing = async (productId: number) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      await api.deleteProduct(productId);
      loadSellerData();
    } catch (err) {
      alert('Could not delete listing');
    }
  };

  const handleMarkReadyForPickup = async (orderId: number) => {
    try {
      await api.updateOrderStatus(orderId, 'Ready for Pickup');
      alert('Order marked as Ready for Pickup! Revogue courier notified.');
      loadSellerData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & New Listing CTA */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-stone-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            Seller Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif">
            {stats?.profile?.store_name || `${user?.full_name}'s Wardrobe`}
          </h1>
          <p className="text-xs text-stone-400">
            UPI Settlement: <strong>{stats?.profile?.upi_id || 'seller@okhdfc'}</strong> • Trust Score: <strong>{stats?.profile?.trust_score || 94}/100</strong>
          </p>
        </div>

        <button
          onClick={onOpenSellModal}
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product Listing</span>
        </button>
      </div>

      {/* Financials & Counts Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Net Earnings (After 5% fee)
          </span>
          <strong className="text-2xl font-black text-stone-900 font-mono mt-1 block">
            ₹{stats?.financials?.net_earnings?.toLocaleString('en-IN') || '64,200'}
          </strong>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            95% Direct Seller Payout
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Pending Disbursal
          </span>
          <strong className="text-2xl font-black text-amber-600 font-mono mt-1 block">
            ₹{stats?.financials?.pending_payout?.toLocaleString('en-IN') || '5,200'}
          </strong>
          <span className="text-[11px] text-stone-400 block mt-1">
            Auto-settled after order delivery
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Active Approved Listings
          </span>
          <strong className="text-2xl font-black text-stone-900 font-mono mt-1 block">
            {stats?.counts?.active ?? 6} Pieces
          </strong>
          <span className="text-[11px] text-stone-500 block mt-1">
            Live in marketplace
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Pending Quality Review
          </span>
          <strong className="text-2xl font-black text-stone-900 font-mono mt-1 block">
            {stats?.counts?.pending ?? 1} Items
          </strong>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">
            Awaiting Admin approval
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'listings'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          My Listings ({stats?.listings?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Incoming Orders & Courier Handover ({incomingOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'payouts'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Payouts & 5% Commission Ledger
        </button>
      </div>

      {/* TAB 1: LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {!stats?.listings?.length ? (
            <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200">
              <Package className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h3 className="font-bold text-stone-900 text-sm">You haven't listed any items yet</h3>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                Give pieces you no longer wear a second life!
              </p>
              <button
                onClick={onOpenSellModal}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-full text-xs font-bold"
              >
                List Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.listings.map((prod: Product) => (
                <div
                  key={prod.product_id}
                  className="bg-white rounded-3xl border border-stone-200 p-4 flex flex-col justify-between shadow-xs"
                >
                  <div className="flex gap-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-20 h-24 object-cover rounded-2xl bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            prod.approval_status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prod.approval_status === 'pending'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prod.approval_status}
                        </span>
                        {!prod.is_available && (
                          <span className="text-[10px] font-bold bg-stone-900 text-white px-2 py-0.5 rounded-full">
                            Sold
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-stone-900 text-xs line-clamp-1">
                        {prod.title}
                      </h4>
                      <div className="text-xs font-extrabold text-stone-900">
                        ₹{prod.selling_price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        Score: {prod.condition_score}/100 • Size {prod.size}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-3 mt-3 flex items-center justify-between">
                    <button
                      onClick={() => onSelectProduct(prod)}
                      className="text-xs font-bold text-stone-900 hover:text-amber-800"
                    >
                      View Live Page →
                    </button>
                    <button
                      onClick={() => handleDeleteListing(prod.product_id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition"
                      title="Remove Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INCOMING ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {incomingOrders.length === 0 ? (
            <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200">
              <Truck className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h3 className="font-bold text-stone-900 text-sm">No incoming orders right now</h3>
              <p className="text-xs text-stone-500 mt-1">
                When a buyer purchases your item, pickup instructions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingOrders.map(order => (
                <div
                  key={order.order_id}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">
                        Order #{order.order_number}
                      </span>
                      <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                        {order.order_status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Deliver to: <strong>{order.delivery_address.recipient_name}</strong> ({order.delivery_address.city})
                    </p>
                    <div className="text-xs text-stone-500">
                      Items sold in this order: {order.items.length} piece(s)
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.order_status === 'Seller Preparing' || order.order_status === 'Order Confirmed' ? (
                      <button
                        onClick={() => handleMarkReadyForPickup(order.order_id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
                      >
                        ✓ Package Ready for Pickup
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-stone-400">
                        Handover step completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h3 className="font-bold text-stone-900 text-base">
              Transparent 5% Platform Commission Model
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Revogue charges only 5% per successful sale to handle seller verification, logistics coordination, and customer support. 95% is transferred directly to your bank account via UPI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-stone-500 block mb-1">Commission Rate</span>
              <strong className="text-xl font-bold text-stone-900">5.0% Flat</strong>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-stone-500 block mb-1">Disbursal Frequency</span>
              <strong className="text-xl font-bold text-stone-900">Within 24 Hours of Delivery</strong>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-stone-500 block mb-1">Linked UPI VPA</span>
              <strong className="text-xl font-bold text-stone-900 font-mono">
                {stats?.profile?.upi_id || 'aarav.mehta@oksbi'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

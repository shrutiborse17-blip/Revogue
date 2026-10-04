import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  Truck,
  IndianRupee,
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Order, User } from '../types';

interface AdminDashboardPageProps {
  onSelectProduct: (product: Product) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onSelectProduct }) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'approvals' | 'logistics' | 'users'>('analytics');
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [anaRes, userRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminUsers()
      ]);
      setAnalytics(anaRes);
      setUsers(userRes.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApprove = async (productId: number) => {
    try {
      await api.approveProduct(productId);
      alert('Listing Approved! Item is now live in marketplace.');
      loadAdminData();
    } catch (err) {
      alert('Failed to approve');
    }
  };

  const handleReject = async (productId: number) => {
    try {
      await api.rejectProduct(productId);
      alert('Listing rejected.');
      loadAdminData();
    } catch (err) {
      alert('Failed to reject');
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      alert(`Order status updated to "${newStatus}"!`);
      loadAdminData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleToggleUser = async (userId: number) => {
    try {
      await api.toggleUserActive(userId);
      loadAdminData();
    } catch (err) {
      alert('Failed to toggle user status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-stone-800 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Administrator Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif">
            Revogue Platform Operations
          </h1>
          <p className="text-xs text-stone-400">
            Marketplace moderation, automated logistics controller, revenue reporting, and user administration.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-800 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Stats
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'analytics'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Revenue & Platform Metrics
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'approvals'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Pending Approvals Queue</span>
          {analytics?.counts?.pending_approvals > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {analytics.counts.pending_approvals}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('logistics')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'logistics'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Logistics & Courier Timeline Controller
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition ${
            activeTab === 'users'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          User Accounts ({users.length})
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Total Gross Sales
              </span>
              <strong className="text-2xl font-black text-stone-900 font-mono mt-1 block">
                ₹{analytics?.revenue?.gross_sales?.toLocaleString('en-IN') || '0'}
              </strong>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Total marketplace GMV
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Commission Earned (5%)
              </span>
              <strong className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                ₹{analytics?.revenue?.commission_earned?.toLocaleString('en-IN') || '0'}
              </strong>
              <span className="text-[11px] text-emerald-800 font-semibold mt-1 block">
                Net Revogue transaction fee
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Quality & Inspection Fees
              </span>
              <strong className="text-2xl font-black text-amber-600 font-mono mt-1 block">
                ₹{analytics?.revenue?.platform_fees?.toLocaleString('en-IN') || '0'}
              </strong>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Collected at ₹29/order
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Total Registered Users
              </span>
              <strong className="text-2xl font-black text-stone-900 font-mono mt-1 block">
                {analytics?.counts?.total_users || 30} Users
              </strong>
              <span className="text-[11px] text-stone-500 mt-1 block">
                {analytics?.counts?.active_sellers || 18} Active Sellers
              </span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <h3 className="font-bold text-stone-900 text-sm mb-4">
              Recent Marketplace Orders
            </h3>
            <div className="divide-y divide-stone-100 overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-stone-400 font-bold uppercase text-[11px] border-b border-stone-200 pb-2">
                    <th className="py-2">Order #</th>
                    <th>Date</th>
                    <th>Delivery Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {analytics?.recent_orders?.map((ord: Order) => (
                    <tr key={ord.order_id} className="py-2">
                      <td className="py-2 font-bold font-mono text-stone-900">
                        {ord.order_number}
                      </td>
                      <td className="text-stone-500">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded text-[11px]">
                          {ord.order_status}
                        </span>
                      </td>
                      <td>
                        <span className="text-emerald-700 font-semibold">{ord.payment_method} ({ord.payment_status})</span>
                      </td>
                      <td className="font-bold text-stone-900">
                        ₹{ord.total_amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT APPROVALS QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {!analytics?.pending_approvals_list?.length ? (
            <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-stone-900 text-sm">Approval Queue is Clear</h3>
              <p className="text-xs text-stone-500 mt-1">
                All submitted pre-loved items have been moderated!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.pending_approvals_list.map((prod: Product) => (
                <div
                  key={prod.product_id}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex gap-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-24 h-28 object-cover rounded-2xl bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Pending Moderation
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm">{prod.title}</h4>
                      <p className="text-xs text-stone-500">
                        Brand: <strong>{prod.brand}</strong> • Original: ₹{prod.original_price} • Resale: <strong>₹{prod.selling_price}</strong>
                      </p>
                      <p className="text-xs text-stone-500">
                        Condition: <strong>{prod.condition_grade}</strong> (Calculated Score: <strong>{prod.condition_score}/100</strong>)
                      </p>
                      <p className="text-xs text-stone-600 italic">
                        Why Selling: "{prod.why_selling}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleReject(prod.product_id)}
                      className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>

                    <button
                      onClick={() => handleApprove(prod.product_id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Publish Live
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LOGISTICS & COURIER STATUS CONTROLLER */}
      {activeTab === 'logistics' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              Courier Delivery Status Controller
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Advance order delivery milestones in real-time. Changes immediately update the buyer's 7-step tracking timeline!
            </p>
          </div>

          <div className="space-y-4">
            {analytics?.recent_orders?.map((ord: Order) => (
              <div
                key={ord.order_id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-bold font-mono text-stone-900 text-sm">
                    {ord.order_number}
                  </div>
                  <div className="text-stone-500">
                    Recipient: {ord.delivery_address.recipient_name} ({ord.delivery_address.city})
                  </div>
                  <div className="text-stone-400 mt-0.5">
                    Current Milestone: <strong className="text-stone-800">{ord.order_status}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-500 font-semibold">Advance Step:</span>
                  <select
                    value={ord.order_status}
                    onChange={e => handleUpdateOrderStatus(ord.order_id, e.target.value)}
                    className="p-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900 text-xs"
                  >
                    <option value="Order Confirmed">1. Order Confirmed</option>
                    <option value="Seller Preparing">2. Seller Preparing</option>
                    <option value="Ready for Pickup">3. Ready for Pickup</option>
                    <option value="Picked Up">4. Picked Up</option>
                    <option value="In Transit">5. In Transit</option>
                    <option value="Out for Delivery">6. Out for Delivery</option>
                    <option value="Delivered">7. Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">Registered Platform Users</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-stone-400 uppercase text-[11px] border-b border-stone-200 pb-2">
                  <th className="py-2">User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map(u => (
                  <tr key={u.user_id} className="py-2">
                    <td className="py-2 font-mono text-stone-500">#{u.user_id}</td>
                    <td className="font-bold text-stone-900">{u.full_name}</td>
                    <td className="text-stone-600">{u.email}</td>
                    <td className="text-stone-500">{u.city}, {u.state}</td>
                    <td>
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {u.role_id === 2 ? 'Admin' : u.role_id === 3 ? 'Creator' : 'Member'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleUser(u.user_id)}
                        className="text-[11px] font-bold text-stone-600 hover:text-stone-950 underline"
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

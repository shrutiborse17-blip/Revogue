import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Bell,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Code,
  Store,
  Layers,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSellModal: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSellModal,
  onOpenSearch
}) => {
  const { user, logout, switchDemo } = useAuth();
  const { cartItems, wishlistIds, notifications, unreadNotifsCount, setIsCartOpen, markNotificationRead } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const cartTotalQuantity = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const navLinks = [
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'creators', label: 'Creator Closets' },
    { id: 'match', label: 'Revogue Match' },
    { id: 'about', label: 'Our Mission' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* 1. Announcement & Account Switcher Strip */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border border-emerald-400/30">
              Verified Pre-Loved
            </span>
            <span className="hidden sm:inline text-stone-300 font-medium">
              "Good things deserve a second life." • Free Shipping on Orders Over ₹999
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[11px] text-stone-400 hidden md:inline">Demo Persona:</span>
            <button
              onClick={() => switchDemo('buyer')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                user?.role_id === 1 && !user.is_seller ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Buyer
            </button>
            <button
              onClick={() => switchDemo('seller')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                user?.is_seller && user?.role_id !== 2 ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Seller
            </button>
            <button
              onClick={() => switchDemo('creator')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                user?.role_id === 3 ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Creator
            </button>
            <button
              onClick={() => switchDemo('admin')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                user?.role_id === 2 ? 'bg-rose-500 text-white font-bold' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentTab('home')}
              className="text-left group flex items-center gap-2.5 focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-950 text-white flex items-center justify-center font-serif text-2xl font-black group-hover:bg-amber-700 transition shadow-md">
                R
              </div>
              <div>
                <span className="font-serif text-2xl font-black tracking-tight text-stone-950 group-hover:text-amber-800 transition">
                  REVOGUE
                </span>
                <span className="block text-[10px] tracking-widest text-stone-500 uppercase font-semibold -mt-1">
                  Pre-loved • Re-loved
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`text-sm font-semibold transition pb-1 relative ${
                    currentTab === link.id
                      ? 'text-stone-950 border-b-2 border-stone-950'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {link.label}
                  {link.id === 'match' && (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                      New
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Utility Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium transition"
              title="Search items, brands, categories"
            >
              <Search className="w-4 h-4 text-stone-500" />
              <span className="hidden md:inline">Search pre-loved...</span>
            </button>

            {/* Sell Button */}
            <button
              onClick={onOpenSellModal}
              className="hidden sm:inline-flex items-center gap-1.5 bg-stone-900 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-full transition shadow-sm hover:shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Sell an Item
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentTab('buyer-dashboard')}
              className="relative p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-full transition"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-full transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-2xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Notifications ({notifications.length})
                    </span>
                    <button
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-stone-400 hover:text-stone-600 text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n.notification_id}
                          onClick={() => {
                            markNotificationRead(n.notification_id);
                            if (n.link_url) {
                              if (n.link_url.includes('orders')) setCurrentTab('buyer-dashboard');
                              if (n.link_url.includes('seller')) setCurrentTab('seller-dashboard');
                              if (n.link_url.includes('admin')) setCurrentTab('admin-dashboard');
                            }
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3 text-left hover:bg-stone-50 transition cursor-pointer ${
                            !n.is_read ? 'bg-amber-50/50' : ''
                          }`}
                        >
                          <div className="text-xs font-bold text-stone-900">{n.title}</div>
                          <div className="text-xs text-stone-600 mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Bag (Cart) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-full transition"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalQuantity > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-stone-950 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartTotalQuantity}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-stone-200 hover:border-stone-400 transition"
              >
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user?.full_name || 'Profile'}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-stone-100">
                    <div className="font-bold text-stone-900 text-sm truncate">{user?.full_name}</div>
                    <div className="text-xs text-stone-500 truncate">{user?.email}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {user?.role_id === 2 ? 'Administrator' : user?.is_seller ? 'Buyer & Seller' : 'Verified Buyer'}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCurrentTab('buyer-dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      Buyer Dashboard (My Orders)
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTab('seller-dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <Store className="w-4 h-4 text-stone-400" />
                      Seller Dashboard (Earnings & Listings)
                    </button>

                    {user?.role_id === 2 && (
                      <button
                        onClick={() => {
                          setCurrentTab('admin-dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        Admin Platform Control & Approvals
                      </button>
                    )}
                  </div>

                  <div className="border-t border-stone-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-950 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentTab(link.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-100"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={() => {
                onOpenSellModal();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-stone-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Sell an Item
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

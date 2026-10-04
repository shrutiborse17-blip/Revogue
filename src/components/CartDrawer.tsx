import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onCheckout,
  onContinueShopping
}) => {
  const { isCartOpen, setIsCartOpen, cartItems, cartSummary, removeFromCart } = useCart();

  if (!isCartOpen) return null;

  const freeShippingNeeded = Math.max(0, cartSummary.free_shipping_threshold - cartSummary.subtotal);
  const freeShippingPct = Math.min(100, Math.round((cartSummary.subtotal / cartSummary.free_shipping_threshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-base font-bold text-stone-900">
                Your Shopping Bag ({cartItems.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-amber-50/70 border-b border-amber-100 px-6 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" />
                {freeShippingNeeded === 0
                  ? '🎉 You unlocked Free Delivery!'
                  : `Add ₹${freeShippingNeeded.toLocaleString('en-IN')} more for Free Delivery`}
              </span>
              <span>{freeShippingPct}%</span>
            </div>
            <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingPct}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-stone-800 text-base mb-1">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Good pre-loved pieces don’t stay available for long. Explore fresh arrivals from verified sellers!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-amber-700 text-white text-xs font-bold rounded-full transition"
                >
                  Explore Marketplace
                </button>
              </div>
            ) : (
              cartItems.map(item => {
                const prod = item.product;
                if (!prod) return null;
                return (
                  <div key={item.product_id} className="py-4 flex gap-4">
                    <img
                      src={prod.images[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=200&q=80'}
                      alt={prod.title}
                      className="w-20 h-24 object-cover rounded-xl bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-stone-900 text-xs sm:text-sm line-clamp-1">
                            {prod.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-stone-400 hover:text-rose-600 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">
                          {prod.brand} • Size {prod.size}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          Seller: {item.seller_name || 'Verified Member'}
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {prod.condition_grade}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-stone-900">
                            ₹{prod.selling_price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-stone-200 px-6 py-5 bg-stone-50/50">
              <div className="space-y-2 text-xs text-stone-600 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">
                    ₹{cartSummary.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>
                    {cartSummary.delivery_charge === 0 ? (
                      <strong className="text-emerald-700">FREE</strong>
                    ) : (
                      `₹${cartSummary.delivery_charge}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    Revogue Quality & Inspection Fee
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  </span>
                  <span>₹{cartSummary.platform_fee}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-extrabold text-stone-900">
                  <span>Total Amount</span>
                  <span>₹{cartSummary.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full bg-stone-900 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 text-center text-[11px] text-stone-400">
                🔒 Safe & secure mock checkout • 100% Quality guarantee
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

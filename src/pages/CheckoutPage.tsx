import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Truck,
  CheckCircle,
  Lock,
  ArrowLeft,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Address, Order } from '../types';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBack,
  onOrderComplete
}) => {
  const { cartItems, cartSummary, clearCart } = useCart();
  const { user } = useAuth();

  // Address State
  const [recipientName, setRecipientName] = useState(user?.full_name || 'Ananya Deshmukh');
  const [phone, setPhone] = useState(user?.phone || '+91 98233 99887');
  const [streetAddress, setStreetAddress] = useState('Flat 402, Shivshrushti Apts, Off College Road');
  const [landmark, setLandmark] = useState('Near BYK College of Commerce');
  const [city, setCity] = useState(user?.city || 'Nashik');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('422005');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('ananya@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recipientName.trim() || !phone.trim() || !streetAddress.trim() || !pincode.trim()) {
      setError('Please fill in all mandatory delivery address fields.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setIsProcessing(true);

    try {
      const addressPayload: Address = {
        recipient_name: recipientName,
        phone,
        street_address: streetAddress,
        landmark,
        city,
        state,
        pincode,
        address_type: 'Home',
        is_default: true
      };

      const orderItemsPayload = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      const res = await api.createOrder({
        items: orderItemsPayload,
        delivery_address: addressPayload,
        payment_method: paymentMethod,
        payment_details: {
          upi_id: paymentMethod === 'UPI' ? upiId : undefined,
          card_last4: paymentMethod === 'Card' ? cardNumber.slice(-4) : undefined
        }
      });

      await clearCart();
      onOrderComplete(res.order);
    } catch (err: any) {
      setError(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Shopping
      </button>

      <div className="border-b border-stone-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif">
          Secure Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Review your delivery details and choose your test payment method.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Address & Payment Method (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-stone-900" />
              <h2 className="font-bold text-stone-900 text-base">Delivery Address</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Street Address & Flat / House No *
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={e => setStreetAddress(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Mock Payment Options */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-stone-900" />
                <h2 className="font-bold text-stone-900 text-base">Payment Method</h2>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                Test Mode Simulation
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'UPI'
                    ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-xs">UPI (Instant)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'Card'
                    ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-xs">Credit/Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'COD'
                    ? 'border-stone-900 bg-stone-900 text-white font-bold shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-xs">Cash on Delivery</span>
              </button>
            </div>

            {/* Sub-inputs based on payment choice */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@okhdfc"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                />
                <p className="text-[11px] text-stone-400">
                  Test credentials pre-filled. Authorization will be simulated instantly.
                </p>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                💵 Pay upon delivery. Please have exact change ready for the Revogue delivery courier.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Placement (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Order Breakdown ({cartItems.length} Pieces)
            </h3>

            {/* Items list */}
            <div className="divide-y divide-stone-200/80 max-h-60 overflow-y-auto pr-1">
              {cartItems.map(item => {
                const prod = item.product;
                if (!prod) return null;
                return (
                  <div key={item.product_id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-12 h-14 object-cover rounded-lg border border-stone-200"
                      />
                      <div>
                        <h4 className="font-bold text-stone-900 line-clamp-1">{prod.title}</h4>
                        <span className="text-stone-500">Size {prod.size} • {prod.condition_grade}</span>
                      </div>
                    </div>
                    <strong className="text-stone-900 text-sm">
                      ₹{prod.selling_price.toLocaleString('en-IN')}
                    </strong>
                  </div>
                );
              })}
            </div>

            {/* Summary lines */}
            <div className="space-y-2 text-xs border-t border-stone-200 pt-4 text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">
                  ₹{cartSummary.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Courier</span>
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
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </span>
                <span>₹{cartSummary.platform_fee}</span>
              </div>
              <div className="border-t border-stone-300 pt-3 flex justify-between text-base font-black text-stone-950">
                <span>Grand Total</span>
                <span>₹{cartSummary.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || cartItems.length === 0}
              className="w-full bg-stone-900 hover:bg-amber-700 text-white font-bold py-4 rounded-2xl text-sm transition shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Lock className="w-4 h-4 text-amber-300" />
              <span>
                {isProcessing ? 'Authorizing Mock Payment...' : `Confirm & Pay ₹${cartSummary.total.toLocaleString('en-IN')}`}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <div className="text-center text-[11px] text-stone-400">
              🔒 256-Bit Encrypted Mock Payment Gateway • Receipt instantly generated
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

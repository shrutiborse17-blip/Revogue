import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { Order } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200">
        {/* Actions Bar (Hidden during print) */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Verified Order Receipt
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-8 space-y-6 text-stone-900">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-stone-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-stone-950 text-white font-serif font-black flex items-center justify-center text-lg">
                  R
                </div>
                <span className="font-serif text-2xl font-black tracking-tight text-stone-950">
                  REVOGUE
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                "Give Good Things a Second Life"
              </p>
              <p className="text-[11px] text-stone-400">
                Revogue Marketplace India Pvt Ltd • GSTIN: 27AABCR8921K1ZM
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                {order.payment_status}
              </span>
              <div className="text-xs font-bold text-stone-800">
                Order #{order.order_number}
              </div>
              <div className="text-[11px] text-stone-500">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-400 block font-medium">Payment Mode</span>
              <strong className="text-stone-800">{order.payment_method} (Authorized)</strong>
              <div className="text-[11px] text-stone-500 font-mono mt-0.5 truncate">
                Ref: {order.transaction_ref}
              </div>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Delivery Address</span>
              <strong className="text-stone-800">{order.delivery_address.recipient_name}</strong>
              <div className="text-[11px] text-stone-600 line-clamp-2">
                {order.delivery_address.street_address}, {order.delivery_address.city} - {order.delivery_address.pincode}
              </div>
            </div>
          </div>

          {/* Items Purchased */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Purchased Items
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-200 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">{item.title || `Item #${item.product_id}`}</div>
                    <div className="text-[11px] text-stone-500">
                      Sold by: {item.seller_name || 'Verified Seller'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-900 text-sm">
                      ₹{item.price_at_purchase.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs border-t border-stone-200 pt-4">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Charge</span>
              <span>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Platform Quality & Inspection Fee</span>
              <span>₹{order.platform_fee}</span>
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-black text-stone-950">
              <span>Total Paid</span>
              <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Verification Footer */}
          <div className="border-t border-dashed border-stone-300 pt-4 flex items-center justify-between text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Revogue Verified Quality & Authenticity Guarantee
            </div>
            <span className="font-mono text-stone-400">REV-AUTH-PASS-2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

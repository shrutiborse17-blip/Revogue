import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: number;
  sellerId?: number;
  title?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  productId,
  sellerId,
  title
}) => {
  const [reason, setReason] = useState('Counterfeit / Fake');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.submitReport({
        product_id: productId,
        seller_id: sellerId,
        reason,
        details
      });
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-stone-900 text-sm">Report Listing or Seller</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">Report Submitted</h4>
            <p className="text-xs text-stone-500">
              Our trust & safety moderators will inspect "{title || 'this item'}" within 12 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Reason for Reporting *
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-white"
              >
                <option value="Counterfeit / Fake">Suspected Counterfeit / Fake</option>
                <option value="Misleading Description">Misleading Condition or Description</option>
                <option value="Condition Discrepancy">Significant Condition Discrepancy</option>
                <option value="Inappropriate Content">Inappropriate Content / Photos</option>
                <option value="Suspicious Seller">Suspicious Seller Activity</option>
                <option value="Other">Other Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Additional Details
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Please describe why this item requires moderator investigation..."
                className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Submitting Report...' : 'Submit Report to Moderators'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  orderId: number;
  productTitle?: string;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  orderId,
  productTitle,
  onSuccess
}) => {
  const [productRating, setProductRating] = useState(5);
  const [sellerRating, setSellerRating] = useState(5);
  const [comment, setComment] = useState('');
  const [conditionMatched, setConditionMatched] = useState(true);
  const [reviewerPhotoUrl, setReviewerPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const sampleTryOnPhotos = [
    { label: 'Casual Outfit Fit', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Festive Wear Fit', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Denim/Jacket Fit', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
    { label: 'Shoes on Foot', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.submitReview({
        product_id: productId,
        order_id: orderId,
        product_rating: productRating,
        seller_rating: sellerRating,
        comment: comment || 'Product arrived in exact described condition.',
        condition_matched: conditionMatched,
        reviewer_photo_url: reviewerPhotoUrl.trim() || undefined
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Review Your Purchase</h3>
            <p className="text-xs text-stone-500 truncate">{productTitle || 'Pre-loved Item'}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg">{error}</div>}

          {/* Product Rating */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Item Quality & Condition Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setProductRating(star)}
                  className="p-1 transition hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= productRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-stone-700 ml-2">{productRating} / 5</span>
            </div>
          </div>

          {/* Seller Rating */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Seller Packaging & Response Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setSellerRating(star)}
                  className="p-1 transition hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= sellerRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-stone-700 ml-2">{sellerRating} / 5</span>
            </div>
          </div>

          {/* Condition Accuracy Checkbox */}
          <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={conditionMatched}
              onChange={e => setConditionMatched(e.target.checked)}
              className="rounded text-stone-900 focus:ring-stone-900 w-4 h-4"
            />
            <span className="text-xs text-stone-700 font-medium">
              Item condition accurately matched the listing photos & description
            </span>
          </label>

          {/* On-Body Try-On Photo Input */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3.5 space-y-2">
            <label className="block text-xs font-bold text-stone-900 flex items-center justify-between">
              <span>Photo of How It Looks on Your Body (Try-On)</span>
              <span className="text-[10px] text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full font-bold">
                Optional
              </span>
            </label>
            <p className="text-[11px] text-stone-600 leading-tight">
              Share a photo of you wearing this used garment to help future thrift shoppers see the real-life fit!
            </p>
            <input
              type="url"
              value={reviewerPhotoUrl}
              onChange={e => setReviewerPhotoUrl(e.target.value)}
              placeholder="Paste photo URL or click sample below"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs"
            />
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] text-stone-400 font-semibold shrink-0">Sample Looks:</span>
              {sampleTryOnPhotos.map(item => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => setReviewerPhotoUrl(item.url)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition shrink-0 ${
                    reviewerPhotoUrl === item.url
                      ? 'bg-amber-700 text-white border-amber-800'
                      : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Share your feedback with the community
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="How did the garment fit? Was the packaging eco-friendly?"
              className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-stone-900 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

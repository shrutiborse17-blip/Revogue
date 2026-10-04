import React from 'react';
import { CheckCircle2, Star, ShieldCheck, MapPin } from 'lucide-react';

interface SellerTrustBadgeProps {
  name: string;
  storeName?: string;
  avatar?: string;
  trustScore?: number;
  rating?: number;
  totalSales?: number;
  city?: string;
  isVerified?: boolean;
}

export const SellerTrustBadge: React.FC<SellerTrustBadgeProps> = ({
  name,
  storeName,
  avatar,
  trustScore = 94,
  rating = 4.8,
  totalSales = 28,
  city = 'Mumbai',
  isVerified = true
}) => {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border-2 border-stone-200"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-stone-900 truncate text-sm">
              {storeName || name}
            </h4>
            {isVerified && (
              <span title="Verified Revogue Closet">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
            <span className="flex items-center gap-1 font-semibold text-stone-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </span>
            <span>•</span>
            <span>{totalSales} sold</span>
            {city && (
              <>
                <span>•</span>
                <span className="flex items-center gap-0.5 truncate">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {city}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-stone-50 border border-stone-100 rounded-lg p-2.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="text-xs text-stone-600 font-medium">Seller Trust Index</span>
        </div>
        <div className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
          {trustScore}/100 Verified
        </div>
      </div>
    </div>
  );
};

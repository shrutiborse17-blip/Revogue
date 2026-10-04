import React, { useState, useEffect } from 'react';
import { CheckCircle2, Star, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { CreatorProfile, Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface CreatorClosetsPageProps {
  initialHandle?: string;
  onSelectProduct: (product: Product) => void;
}

export const CreatorClosetsPage: React.FC<CreatorClosetsPageProps> = ({
  initialHandle,
  onSelectProduct
}) => {
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);
  const [creatorItems, setCreatorItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getCreators();
        setCreators(res.creators || []);

        if (initialHandle) {
          const match = res.creators.find((c: CreatorProfile) => c.handle.toLowerCase() === initialHandle.replace('@', '').toLowerCase());
          if (match) {
            handleSelectCreator(match);
            return;
          }
        }

        if (res.creators && res.creators.length > 0) {
          handleSelectCreator(res.creators[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [initialHandle]);

  const handleSelectCreator = async (creator: CreatorProfile) => {
    setSelectedCreator(creator);
    setLoading(true);
    try {
      const res = await api.getCreator(creator.handle);
      setCreatorItems(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
          Curated Influencer Wardrobes
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Creator Closets
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Discover handpicked festive ensembles, archive bags, and rare footwear directly from top fashion stylists and creators.
        </p>
      </div>

      {/* Creator Selector Tabs */}
      <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
        {creators.map(c => {
          const isSelected = selectedCreator?.handle === c.handle;
          return (
            <button
              key={c.creator_id}
              onClick={() => handleSelectCreator(c)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-xs font-bold transition shrink-0 ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <img
                src={c.avatar_url}
                alt={c.name}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span>@{c.handle}</span>
            </button>
          );
        })}
      </div>

      {/* Active Creator Banner Card */}
      {selectedCreator && (
        <div className="relative rounded-3xl overflow-hidden bg-stone-950 text-white shadow-xl border border-stone-800">
          <div className="h-44 sm:h-56 w-full relative">
            <img
              src={selectedCreator.cover_image}
              alt=""
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent" />
          </div>

          <div className="relative px-6 sm:px-10 pb-8 pt-0 -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-end gap-5">
              <img
                src={selectedCreator.avatar_url}
                alt={selectedCreator.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-stone-950 shadow-2xl shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
                    {selectedCreator.name}
                  </h2>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-xs text-amber-300 font-semibold">
                  @{selectedCreator.handle} • {selectedCreator.followers_count} Followers
                </div>
                <p className="text-xs text-stone-300 max-w-md line-clamp-2 mt-1">
                  {selectedCreator.social_bio}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-stone-900/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-stone-800 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">Rating</span>
                <strong className="text-amber-300 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {selectedCreator.rating}
                </strong>
              </div>
              <div className="border-x border-stone-700 px-4">
                <span className="text-stone-400 block text-[11px]">Sales</span>
                <strong className="text-white font-bold">{selectedCreator.sales_count}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Active Closet</span>
                <strong className="text-emerald-400 font-bold">{creatorItems.length} Pieces</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creator's Closet Items */}
      <div>
        <h3 className="font-serif text-xl font-bold text-stone-900 mb-6">
          Pieces Available from @{selectedCreator?.handle}'s Wardrobe
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-4/5 bg-stone-200 rounded-2xl" />
            ))}
          </div>
        ) : creatorItems.length === 0 ? (
          <div className="p-12 text-center bg-stone-50 rounded-3xl border border-stone-200">
            <p className="text-xs text-stone-500">
              All items from this creator have been snapped up! Check back soon for fresh closet drops.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creatorItems.map(product => (
              <ProductCard
                key={product.product_id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

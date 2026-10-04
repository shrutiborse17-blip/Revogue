import React from 'react';
import { Heart, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { toggleWishlist, isWishlisted, addToCart } = useCart();
  const wishlisted = isWishlisted(product.product_id);

  const discount = Math.round(
    ((product.original_price - product.selling_price) / product.original_price) * 100
  );

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.product_id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.is_available) {
      addToCart(product.product_id);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      className="group relative bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-4/5 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Sold Overlay */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-stone-900 text-white font-extrabold text-sm px-4 py-1.5 rounded-full border border-stone-700 tracking-wider uppercase shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* Condition Grade Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 bg-stone-900/85 backdrop-blur-md text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {product.condition_grade} {product.times_worn ? `• Used ${product.times_worn}x` : ''}
          </span>
          <span className="inline-block bg-white/95 backdrop-blur-md text-stone-900 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-stone-200">
            Score: {product.condition_score}/100
          </span>
          {product.worn_photo_url && (
            <span className="inline-block bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
              📸 Worn on Body
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Save to Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            wishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/85 text-stone-700 hover:bg-white hover:text-rose-600 shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add Button */}
        {product.is_available && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-2.5 bg-stone-900 hover:bg-amber-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 z-10"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <span className="bg-stone-100 text-stone-700 font-medium px-2 py-0.5 rounded text-[11px]">
              Size {product.size}
            </span>
          </div>

          <h3 className="font-semibold text-stone-900 text-sm line-clamp-1 group-hover:text-amber-700 transition-colors">
            {product.title}
          </h3>

          {product.why_selling && (
            <p className="text-xs text-stone-500 mt-1 italic line-clamp-1">
              "{product.why_selling}"
            </p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-stone-900">
                ₹{product.selling_price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[11px] font-bold text-emerald-700">
              {discount}% OFF Retail
            </div>
          </div>

          <div className="text-right">
            <span className="flex items-center gap-0.5 text-[11px] text-stone-500">
              <MapPin className="w-3 h-3 text-stone-400" />
              {product.location ? product.location.split(',')[0] : 'Mumbai'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

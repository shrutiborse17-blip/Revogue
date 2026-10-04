import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Leaf,
  Sparkles,
  MapPin,
  AlertTriangle,
  Star,
  CheckCircle2,
  Camera,
  Maximize2,
  X,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { Product, Review } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { ConditionScoreMeter } from '../components/ConditionScoreMeter';
import { SellerTrustBadge } from '../components/SellerTrustBadge';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  productId: number;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenReportModal: (productId: number, sellerId: number, title: string) => void;
  onBuyNow: (product: Product) => void;
  onOpenReview?: (productId: number, orderId: number, title?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onSelectProduct,
  onOpenReportModal,
  onBuyNow,
  onOpenReview
}) => {
  const [data, setData] = useState<{ product: any; similar: Product[] } | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeViewMode, setActiveViewMode] = useState<'gallery' | 'worn'>('gallery');
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; subtitle?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    api.getProductById(productId)
      .then(res => {
        setData(res);
        if (res.product && res.product.images?.length) {
          setActiveImage(res.product.images[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading || !data?.product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="w-12 h-12 rounded-full bg-stone-200 mx-auto mb-4" />
        <p className="text-stone-400 text-xs font-semibold">Inspecting piece details...</p>
      </div>
    );
  }

  const { product, similar } = data;
  const wishlisted = isWishlisted(product.product_id);
  const discount = Math.round(
    ((product.original_price - product.selling_price) / product.original_price) * 100
  );

  const reviews: Review[] = product.reviews || [];
  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.product_rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const reviewsWithPhotos = reviews.filter(r => Boolean(r.reviewer_photo_url));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      {/* Main Grid: Gallery + Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images Gallery & Worn-on-Body Showcase (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => {
                setActiveViewMode('gallery');
                if (product.images?.length) setActiveImage(product.images[0]);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeViewMode === 'gallery'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <span>Product Photos</span>
              <span className="text-[10px] text-stone-400 font-normal">({product.images?.length || 1})</span>
            </button>

            {product.worn_photo_url && (
              <button
                onClick={() => {
                  setActiveViewMode('worn');
                  setActiveImage(product.worn_photo_url);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeViewMode === 'worn'
                    ? 'bg-amber-500 text-stone-950 shadow-xs font-black'
                    : 'text-amber-900 hover:bg-amber-100/70'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>📸 Worn on Body (Seller Fit Photo)</span>
              </button>
            )}
          </div>

          {/* Main Visual Display */}
          <div className="relative aspect-4/5 w-full bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 group">
            <img
              src={activeImage || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {!product.is_available && (
              <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center z-20">
                <span className="bg-stone-900 text-white font-extrabold text-sm px-6 py-2 rounded-full border border-stone-700 tracking-wider uppercase">
                  Item Sold
                </span>
              </div>
            )}

            {/* Condition badge floating */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="bg-stone-900/85 backdrop-blur-md text-amber-200 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {product.condition_grade} {product.times_worn ? `• Used ${product.times_worn} times` : ''}
              </span>
              {activeViewMode === 'worn' && (
                <span className="bg-amber-500 text-stone-950 text-[11px] font-black px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  Real Try-On Look on Body
                </span>
              )}
            </div>

            {/* Zoom / Lightbox Trigger */}
            <button
              onClick={() =>
                setLightboxImage({
                  url: activeImage || product.images[0],
                  title: product.title,
                  subtitle: activeViewMode === 'worn' ? product.fit_notes : `${product.brand} • ${product.size}`
                })
              }
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/85 hover:bg-white text-stone-800 hover:text-stone-950 shadow-md backdrop-blur-md transition z-10"
              title="Click to view full size"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {product.images && product.images.length > 0 &&
              product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(img);
                    setActiveViewMode('gallery');
                  }}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition shrink-0 relative ${
                    activeImage === img && activeViewMode === 'gallery'
                      ? 'border-stone-950 shadow-md scale-102'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-stone-900/80 text-white text-[9px] px-1 rounded font-mono">
                    #{idx + 1}
                  </span>
                </button>
              ))}

            {/* Thumbnail for Worn on Body */}
            {product.worn_photo_url && (
              <button
                onClick={() => {
                  setActiveImage(product.worn_photo_url);
                  setActiveViewMode('worn');
                }}
                className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition shrink-0 relative ${
                  activeImage === product.worn_photo_url && activeViewMode === 'worn'
                    ? 'border-amber-600 shadow-md scale-102 ring-2 ring-amber-400'
                    : 'border-amber-300 opacity-80 hover:opacity-100'
                }`}
                title="View how it looks worn on body"
              >
                <img src={product.worn_photo_url} alt="Worn on body" className="w-full h-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-amber-600 text-white text-[8px] font-black uppercase text-center py-0.5 tracking-wider">
                  Worn Fit
                </span>
              </button>
            )}
          </div>

          {/* WORN ON BODY HIGHLIGHT CARD (Requested Feature) */}
          {product.worn_photo_url && (
            <div className="bg-linear-to-br from-amber-50/90 via-orange-50/50 to-stone-50 border-2 border-amber-200/90 rounded-3xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-black text-stone-900">
                      Real Wear & Fit Check (How it Looks on Body)
                    </h3>
                    <p className="text-[11px] text-amber-900 font-medium">
                      Clicked by seller when wearing this pre-loved piece in real life
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setLightboxImage({
                      url: product.worn_photo_url,
                      title: `Real Wear Photo: ${product.title}`,
                      subtitle: product.fit_notes || 'Worn on body view provided by seller.'
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition shadow-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge Fit Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-4 items-center">
                <div
                  onClick={() =>
                    setLightboxImage({
                      url: product.worn_photo_url,
                      title: `Real Wear Photo: ${product.title}`,
                      subtitle: product.fit_notes
                    })
                  }
                  className="sm:col-span-4 aspect-3/4 rounded-2xl overflow-hidden border border-amber-200 shadow-md cursor-pointer hover:opacity-95 transition relative group"
                >
                  <img
                    src={product.worn_photo_url}
                    alt="Product worn on body"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition flex items-center justify-center">
                    <span className="bg-stone-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition backdrop-blur-xs flex items-center gap-1">
                      <Maximize2 className="w-3 h-3" /> Tap to zoom
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-8 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      Seller's Fit & Wear Notes
                    </span>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed italic bg-white/80 p-3 rounded-2xl border border-amber-200/70">
                      "{product.fit_notes || `Fits true to size ${product.size}. Clicked while wearing out on a day.`}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-amber-100">
                      <span className="text-[10px] text-stone-400 block">Times Worn</span>
                      <strong className="text-stone-900">{product.times_worn ? `${product.times_worn} times` : '1-2 times'}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-amber-100">
                      <span className="text-[10px] text-stone-400 block">Condition Accuracy</span>
                      <strong className="text-emerald-700 font-bold">{product.condition_score}/100 Score</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Environmental Savings Callout */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3 text-emerald-900">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <strong>Estimated Environmental Impact:</strong> Choosing this pre-loved piece instead of buying brand new conserves approximately <strong>2,700 liters of freshwater</strong> and diverts textiles from landfill.
            </div>
          </div>
        </div>

        {/* Right: Specifications & Buy Box (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-bold text-stone-900 uppercase tracking-widest text-xs">
                {product.brand}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {product.location}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {product.title}
            </h1>

            {/* Why Selling Badge */}
            {product.why_selling && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Why Selling: <em>"{product.why_selling}"</em>
              </div>
            )}
          </div>

          {/* Pricing Box - Realistic Second Hand Pricing */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-stone-950 font-mono">
                ₹{product.selling_price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-semibold text-stone-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                {discount}% OFF Retail
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Accessible pre-loved thrift pricing • Quality verified before doorstep delivery.
            </p>
          </div>

          {/* Revogue Condition Score Meter */}
          <ConditionScoreMeter
            score={product.condition_score}
            timesWorn={product.times_worn}
            conditionGrade={product.condition_grade}
          />

          {/* Action Buttons */}
          {product.is_available ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product.product_id)}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </button>

                <button
                  onClick={() => onBuyNow(product)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg font-black"
                >
                  Buy Now
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.product_id)}
                className={`w-full py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  wishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
                {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-stone-100 text-stone-500 rounded-xl text-center text-xs font-bold">
              This piece has already been purchased by another member.
            </div>
          )}

          {/* Product Specifications Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100 text-xs">
            <div className="px-4 py-2.5 flex justify-between bg-stone-50/50">
              <span className="text-stone-500">Size</span>
              <strong className="text-stone-900">{product.size}</strong>
            </div>
            <div className="px-4 py-2.5 flex justify-between">
              <span className="text-stone-500">Color</span>
              <strong className="text-stone-900">{product.color}</strong>
            </div>
            <div className="px-4 py-2.5 flex justify-between bg-stone-50/50">
              <span className="text-stone-500">Material</span>
              <strong className="text-stone-900">{product.material}</strong>
            </div>
            <div className="px-4 py-2.5 flex justify-between">
              <span className="text-stone-500">Category</span>
              <strong className="text-stone-900">{product.category_name}</strong>
            </div>
            <div className="px-4 py-2.5 flex justify-between bg-stone-50/50">
              <span className="text-stone-500">Gender Fit</span>
              <strong className="text-stone-900">{product.target_gender}</strong>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Seller Description
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white border border-stone-200 rounded-2xl p-4">
              {product.description}
            </p>
          </div>

          {/* Seller Trust Card */}
          {product.seller && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Sold By
              </h3>
              <SellerTrustBadge
                name={product.seller.name}
                storeName={product.seller.store_name}
                avatar={product.seller.avatar}
                trustScore={product.seller.trust_score}
                rating={product.seller.rating}
                totalSales={product.seller.total_sales}
                city={product.seller.city}
                isVerified={product.seller.is_verified}
              />
            </div>
          )}

          {/* Report Item Trigger */}
          <div className="pt-2 text-right">
            <button
              onClick={() => onOpenReportModal(product.product_id, product.seller_id, product.title)}
              className="text-[11px] text-stone-400 hover:text-rose-600 transition inline-flex items-center gap-1 font-medium"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Report listing or authenticity concern
            </button>
          </div>
        </div>
      </div>

      {/* FULL CUSTOMER REVIEWS & ON-BODY WEAR PHOTOS SECTION */}
      <section className="border-t border-stone-200 pt-12 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <Camera className="w-3.5 h-3.5 text-amber-700" />
              Real Look on Body
            </div>
            <h2 className="text-2xl font-black text-stone-900 font-serif tracking-tight">
              Customer Reviews & Real Try-On Photos
            </h2>
            <p className="text-xs text-stone-500">
              See how this used piece actually looks on real people with authentic feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-stone-50 border border-stone-200 px-4 py-2 rounded-2xl text-center">
              <div className="flex items-center gap-1 justify-center">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-black text-stone-900">{averageRating}</span>
                <span className="text-xs text-stone-400">/ 5.0</span>
              </div>
              <span className="text-[10px] text-stone-500 font-medium">({reviews.length} Verified Reviews)</span>
            </div>

            {onOpenReview && (
              <button
                onClick={() => onOpenReview(product.product_id, 1, product.title)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-amber-700 text-white font-bold rounded-2xl text-xs transition flex items-center gap-2 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5 text-amber-300" />
                <span>Add Review & Try-On Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Gallery ribbon of all buyer try-on photos */}
        {reviewsWithPhotos.length > 0 && (
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-600" />
              Community On-Body Lookbook ({reviewsWithPhotos.length} Fit Photos)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {reviewsWithPhotos.map((rev, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setLightboxImage({
                      url: rev.reviewer_photo_url!,
                      title: `Worn by ${rev.reviewer_name || 'Verified Buyer'}`,
                      subtitle: rev.comment
                    })
                  }
                  className="aspect-3/4 rounded-2xl overflow-hidden border border-stone-200 bg-white relative cursor-pointer group shadow-xs hover:shadow-md transition"
                >
                  <img
                    src={rev.reviewer_photo_url}
                    alt="Buyer on-body fit"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition" />
                  <div className="absolute bottom-1 inset-x-1 bg-stone-900/85 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded-lg truncate text-center font-medium">
                    {rev.reviewer_name || 'Buyer'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Cards List */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev: Review) => (
              <div
                key={rev.review_id}
                className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Reviewer profile + Stars */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          rev.reviewer_avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={rev.reviewer_name || 'Reviewer'}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                            {rev.reviewer_name || 'Verified Buyer'}
                          </h4>
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-800 bg-emerald-100 font-bold px-1.5 py-0.2 rounded-full">
                            <UserCheck className="w-2.5 h-2.5" /> Verified
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {rev.reviewer_city ? `${rev.reviewer_city} • ` : ''}
                          {new Date(rev.created_at).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star
                          key={st}
                          className={`w-3.5 h-3.5 ${
                            st <= rev.product_rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Condition Match Badge */}
                  {rev.condition_matched && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Condition exactly as described by seller
                    </div>
                  )}

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Buyer's Real On-Body Try-On Photo (If present) */}
                {rev.reviewer_photo_url && (
                  <div className="pt-3 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() =>
                          setLightboxImage({
                            url: rev.reviewer_photo_url!,
                            title: `On-Body Try-On by ${rev.reviewer_name || 'Customer'}`,
                            subtitle: rev.comment
                          })
                        }
                        className="w-16 h-20 rounded-xl overflow-hidden border border-stone-200 shadow-xs shrink-0 cursor-pointer hover:opacity-90 transition relative group"
                      >
                        <img
                          src={rev.reviewer_photo_url}
                          alt="Buyer worn photo"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-stone-900/30 group-hover:bg-transparent transition flex items-center justify-center">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Camera className="w-2.5 h-2.5" /> Buyer On-Body Photo
                        </span>
                        <p className="text-[11px] text-stone-500">
                          Click image to view how this used piece actually sits and looks on body!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs mx-auto flex items-center justify-center text-amber-600">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-stone-900">No Customer Reviews Yet</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Be the first verified customer to purchase this piece, leave a review, and share your on-body try-on photo!
            </p>
            {onOpenReview && (
              <button
                onClick={() => onOpenReview(product.product_id, 1, product.title)}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl"
              >
                Write First Review
              </button>
            )}
          </div>
        )}
      </section>

      {/* Lightbox / Zoom Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-xl w-full shadow-2xl border border-stone-200 flex flex-col"
          >
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">{lightboxImage.title}</h4>
                <p className="text-[11px] text-amber-700 font-medium">📸 Real-Life On-Body Fit Photo</p>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-3/4 max-h-[65vh] w-full bg-stone-900 flex items-center justify-center overflow-hidden">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            {lightboxImage.subtitle && (
              <div className="p-4 bg-stone-50 text-xs text-stone-700 italic border-t border-stone-100">
                "{lightboxImage.subtitle}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Similar Products */}
      {similar.length > 0 && (
        <section className="border-t border-stone-200 pt-12">
          <h2 className="text-xl font-black text-stone-900 font-serif mb-6">
            Similar Pre-Loved Pieces
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map(p => (
              <ProductCard
                key={p.product_id}
                product={p}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

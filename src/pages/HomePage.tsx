import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  Star,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { Product, Category, CreatorProfile, SustainabilityImpact } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (tab: string, filter?: any) => void;
  onSelectProduct: (product: Product) => void;
  onOpenSellModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onOpenSellModal
}) => {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [under999Products, setUnder999Products] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [impact, setImpact] = useState<SustainabilityImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, creatorRes, impactRes] = await Promise.all([
          api.getProducts({ sort: 'newest' }),
          api.getCategories(),
          api.getCreators(),
          api.getImpact()
        ]);

        setTrendingProducts(prodRes.products.slice(0, 8));
        setUnder999Products(prodRes.products.filter(p => p.selling_price <= 499).slice(0, 4));
        setCategories(catRes.categories || []);
        setCreators(creatorRes.creators || []);
        setImpact(impactRes);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
            alt="Revogue Fashion Editorial"
            className="w-full h-full object-cover object-center filter saturate-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-20 sm:py-28 lg:py-32 flex flex-col justify-center">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Circular Resale Fashion
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
              Good things deserve a <span className="italic font-normal text-amber-300">second life.</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
              Buy better. Sell smarter. Rehome pieces you've worn only a few times, and discover verified designer garments at authentic resale prices.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => onNavigate('marketplace')}
                className="px-7 py-3.5 bg-white hover:bg-stone-100 text-stone-950 font-bold rounded-full text-xs sm:text-sm transition shadow-lg hover:shadow-xl flex items-center gap-2 group"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={onOpenSellModal}
                className="px-7 py-3.5 bg-stone-900/80 hover:bg-stone-900 text-white font-bold rounded-full text-xs sm:text-sm transition border border-stone-700 backdrop-blur-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Sell Your Items</span>
              </button>
            </div>

            {/* Micro Stats Strip */}
            <div className="pt-8 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="block font-black text-white text-lg sm:text-xl">100%</span>
                <span className="text-stone-400 text-[11px]">Quality Checked</span>
              </div>
              <div className="border-x border-stone-800 px-3">
                <span className="block font-black text-amber-300 text-lg sm:text-xl">5%</span>
                <span className="text-stone-400 text-[11px]">Fair Platform Fee</span>
              </div>
              <div>
                <span className="block font-black text-emerald-400 text-lg sm:text-xl">7-Step</span>
                <span className="text-stone-400 text-[11px]">Tracked Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-serif">
              Shop by Category
            </h2>
            <p className="text-xs text-stone-500">Carefully curated authentic pre-loved collections</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-stone-900 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map(cat => (
            <div
              key={cat.category_id}
              onClick={() => onNavigate('marketplace', { category: cat.slug })}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-stone-100 border border-stone-200 cursor-pointer hover:shadow-md transition"
            >
              <img
                src={cat.image_url}
                alt={cat.category_name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="font-bold text-sm block drop-shadow-xs">{cat.category_name}</span>
                <span className="text-[11px] text-stone-300 font-medium">Explore items →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING NOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500 text-stone-950">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-serif">
                Trending Pre-Loved Pieces
              </h2>
              <p className="text-xs text-stone-500">Popular items with highest Revogue Condition Scores</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-stone-900 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>See 60+ Pieces</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map(product => (
            <ProductCard
              key={product.product_id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 4. CREATOR CLOSETS SPOTLIGHT */}
      <section className="bg-stone-100/70 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Exclusive Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif">
              Creator Closets
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Shop directly from verified stylists, models, and fashion creators who frequently rotate high-end festive and runway pieces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creators.map(creator => (
              <div
                key={creator.creator_id}
                onClick={() => onNavigate('creators', { handle: creator.handle })}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={creator.avatar_url}
                      alt={creator.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-stone-900 text-sm">{creator.name}</h4>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold text-stone-500">
                        @{creator.handle}
                      </span>
                      <span className="block mt-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded w-fit">
                        {creator.featured_badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 italic mb-4">
                    "{creator.social_bio}"
                  </p>
                </div>

                <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 font-semibold text-stone-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {creator.rating} Rating
                  </span>
                  <span>{creator.sales_count} items sold</span>
                  <span className="font-bold text-stone-900 hover:text-amber-800">
                    Shop Closet →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW REVOGUE WORKS (4-STEP VISUAL GUIDE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif">
            How Revogue Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            A safe, transparent marketplace engineered so buyers get authenticated pieces and sellers get guaranteed payouts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 relative">
            <span className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center mb-4">
              01
            </span>
            <h3 className="font-bold text-stone-900 text-base mb-1.5">1. List Your Item</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Upload photos of clothing, bags, watches, or shoes in great condition. State reason for selling and wear history.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 relative">
            <span className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center mb-4">
              02
            </span>
            <h3 className="font-bold text-stone-900 text-base mb-1.5">2. Condition Scoring</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our automated algorithm calculates an objective Revogue Condition Score (0–100) and queues the listing for admin verification.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 relative">
            <span className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center mb-4">
              03
            </span>
            <h3 className="font-bold text-stone-900 text-base mb-1.5">3. Tracked Delivery</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              When purchased, Revogue coordinates pickup and updates a live 7-step courier timeline from seller packaging to customer doorstep.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 relative">
            <span className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center mb-4">
              04
            </span>
            <h3 className="font-bold text-stone-900 text-base mb-1.5">4. Guaranteed Payout</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Once delivered safely, the seller receives 95% payout straight to their bank UPI, deducting only a modest 5% platform fee.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SUSTAINABILITY IMPACT CALCULATOR */}
      <section className="bg-emerald-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold">
            <Leaf className="w-4 h-4" />
            Estimated Revogue Environmental Savings
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            Every re-loved piece prevents unnecessary virgin textile production.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="bg-emerald-900/50 backdrop-blur-xs p-6 rounded-2xl border border-emerald-800/80">
              <span className="block text-3xl sm:text-4xl font-black text-amber-300 font-mono">
                {impact ? `${(impact.water_saved_liters / 1000).toFixed(0)}k Liters` : '383k Liters'}
              </span>
              <span className="text-xs text-emerald-200 font-medium mt-1 block">
                Freshwater Conserved
              </span>
            </div>

            <div className="bg-emerald-900/50 backdrop-blur-xs p-6 rounded-2xl border border-emerald-800/80">
              <span className="block text-3xl sm:text-4xl font-black text-amber-300 font-mono">
                {impact ? `${impact.co2_offset_kg.toLocaleString()} kg` : '1,207 kg'}
              </span>
              <span className="text-xs text-emerald-200 font-medium mt-1 block">
                CO2 Emissions Avoided
              </span>
            </div>

            <div className="bg-emerald-900/50 backdrop-blur-xs p-6 rounded-2xl border border-emerald-800/80">
              <span className="block text-3xl sm:text-4xl font-black text-amber-300 font-mono">
                {impact ? `${impact.total_items_reloved}+` : '142+'}
              </span>
              <span className="text-xs text-emerald-200 font-medium mt-1 block">
                Garments Given a Second Life
              </span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-300/80 max-w-lg mx-auto">
            * Calculations based on textile industry standards estimating that re-wearing one existing garment saves roughly 2,700 liters of water compared to manufacturing a new synthetic or cotton garment.
          </p>
        </div>
      </section>

      {/* 7. FRESH ARRIVALS & BUDGET FINDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-serif">
              Thrift & Budget Finds Under ₹499
            </h2>
            <p className="text-xs text-stone-500">Accessible pre-loved wardrobe treasures with verified condition scores</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace', { max_price: 499 })}
            className="text-xs font-bold text-stone-900 hover:text-amber-800 flex items-center gap-1 group"
          >
            <span>View Budget Finds</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {under999Products.map(product => (
            <ProductCard
              key={product.product_id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 8. REVOGUE MATCH TEASER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-stone-800">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Interactive Recommendation Tool
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-black">
              Can’t decide? Try Revogue Match.
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Select your budget, preferred size, occasion, and condition standards. Our recommendation algorithm calculates your optimal wardrobe match.
            </p>
          </div>

          <button
            onClick={() => onNavigate('match')}
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-full text-xs sm:text-sm transition flex items-center gap-2 shrink-0 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Launch Revogue Match</span>
          </button>
        </div>
      </section>
    </div>
  );
};

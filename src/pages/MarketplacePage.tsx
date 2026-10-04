import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface MarketplacePageProps {
  initialFilter?: any;
  onSelectProduct: (product: Product) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  initialFilter,
  onSelectProduct
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(initialFilter?.search || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilter?.category || 'all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(initialFilter?.max_price || 1500);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load Categories once
  useEffect(() => {
    api.getCategories().then(res => setCategories(res.categories || []));
  }, []);

  // Fetch filtered products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { sort: sortBy };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedCondition !== 'all') params.condition = selectedCondition;
      if (maxPrice < 1500) params.max_price = maxPrice;

      const res = await api.getProducts(params);
      setProducts(res.products || []);
    } catch (err) {
      console.error('Failed to load marketplace products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedCondition, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setMaxPrice(35000);
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-serif">
            Marketplace
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse verified authentic pre-loved pieces with guaranteed condition ratings
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-800 rounded-xl text-xs font-bold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-stone-100 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-hidden font-bold text-stone-900 text-xs"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="score_desc">Highest Condition Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop + Mobile Drawer) */}
        <div className={`md:block space-y-6 ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Zara, Nike, bags..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Categories
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.category_id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{cat.category_name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Condition Grade */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Condition Grade
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Like New', 'Excellent', 'Good', 'Fair'].map(cond => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                    selectedCondition === cond
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cond === 'all' ? 'All Grades' : cond}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
              <span>Max Budget</span>
              <span className="text-stone-900 font-extrabold font-mono">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="199"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>₹199</span>
              <span>₹1,500</span>
            </div>
          </div>

          {/* Clear Filter Action */}
          <button
            onClick={handleResetFilters}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
          >
            Reset All Filters
          </button>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {/* Active search chip */}
          <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
            <span>
              Showing <strong>{products.length}</strong> available verified pieces
            </span>
            {search && (
              <span className="font-medium text-stone-800">
                Search results for: <em>"{search}"</em>
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-4/5 bg-stone-200 rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-12 text-center max-w-md mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto mb-3">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">No items matched your filters</h3>
              <p className="text-xs text-stone-500 mb-6">
                Try widening your price range or clearing specific category and condition selections.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-stone-900 text-white rounded-full text-xs font-bold hover:bg-amber-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
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
    </div>
  );
};

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, RotateCcw, Filter } from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';

interface RevogueMatchPageProps {
  onSelectProduct: (product: Product) => void;
}

export const RevogueMatchPage: React.FC<RevogueMatchPageProps> = ({ onSelectProduct }) => {
  const [budget, setBudget] = useState('750');
  const [category, setCategory] = useState('clothing');
  const [size, setSize] = useState('M');
  const [condition, setCondition] = useState('Any');
  const [gender, setGender] = useState('Women');
  const [results, setResults] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFindMatches = async () => {
    setLoading(true);
    try {
      const res = await api.getMatches({
        budget: Number(budget),
        category,
        size,
        condition,
        gender
      });
      setResults(res.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Smart Match Algorithm
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Revogue Match
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Tell us your budget, size, and style preference. Our algorithmic matcher calculates the optimal pre-loved garments based on condition scores and value retention.
        </p>
      </div>

      {/* Quiz Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 1. Budget */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              1. What is your budget limit?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Under ₹350', val: '350' },
                { label: 'Under ₹500', val: '500' },
                { label: 'Under ₹750', val: '750' },
                { label: 'Under ₹1,000', val: '1000' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setBudget(opt.val)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition text-left ${
                    budget === opt.val
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Category */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              2. What category are you hunting for?
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-stone-300 text-sm font-semibold bg-white"
            >
              <option value="clothing">Designer Clothing & Dresses</option>
              <option value="footwear">Footwear & Sneakers</option>
              <option value="jewellery">Fine & Artisanal Jewellery</option>
              <option value="watches">Luxury & Smart Watches</option>
              <option value="bags">Leather Handbags & Totes</option>
              <option value="accessories">Belts, Sunglasses & Scarves</option>
            </select>
          </div>

          {/* 3. Gender Target */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              3. Gender Silhouette
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Women', 'Men', 'Unisex'].map(g => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition text-center ${
                    gender === g
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Condition Strictness */}
          <div>
            <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
              4. Minimum Condition Standard
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Any Condition', val: 'Any' },
                { label: 'Excellent', val: 'Excellent' },
                { label: 'Like New Only', val: 'Like New' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setCondition(opt.val)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition text-center ${
                    condition === opt.val
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-500'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={handleFindMatches}
            disabled={loading}
            className="px-8 py-4 bg-stone-900 hover:bg-amber-600 text-white font-bold rounded-2xl text-sm transition shadow-xl inline-flex items-center gap-2 group disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{loading ? 'Analyzing Revogue Catalog...' : 'Calculate My Matches'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h2 className="text-xl font-black text-stone-900 font-serif">
              Revogue Recommended Matches ({results.length})
            </h2>
            <button
              onClick={() => setResults(null)}
              className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Questionnaire
            </button>
          </div>

          {results.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-12 text-center max-w-md mx-auto">
              <p className="text-xs text-stone-500">
                No pieces precisely met all your strict criteria. Try increasing your budget limit or accepting 'Excellent' condition items!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map(product => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

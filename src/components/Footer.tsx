import React from 'react';
import { Heart, Sparkles, ShieldCheck, RefreshCw, Leaf } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800/80 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="p-2.5 rounded-xl bg-stone-900 text-amber-300 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">100% Quality Checked</h4>
            <p className="text-xs text-stone-400">
              Every listing verified through the Revogue Condition Grading index.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="p-2.5 rounded-xl bg-stone-900 text-emerald-300 w-fit">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Circular Wardrobes</h4>
            <p className="text-xs text-stone-400">
              Each re-loved garment conserves an estimated 2,700L of water and 8.5kg CO2.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="p-2.5 rounded-xl bg-stone-900 text-amber-300 w-fit">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Dual Buyer & Seller Flow</h4>
            <p className="text-xs text-stone-400">
              Seamlessly rehome what you no longer wear and shop curate archive pieces.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="p-2.5 rounded-xl bg-stone-900 text-rose-300 w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Creator Closets</h4>
            <p className="text-xs text-stone-400">
              Shop authentic archives and red-carpet festive pieces from top stylists.
            </p>
          </div>
        </div>

        {/* Links & Brand Description */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-stone-800/80">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-stone-950 font-serif font-black flex items-center justify-center text-lg">
                R
              </div>
              <span className="font-serif text-2xl font-black tracking-tight text-white">
                REVOGUE
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              "Good things deserve a second life." Revogue is India's premier curated pre-loved fashion and lifestyle resale marketplace. Give quality garments, footwear, and accessories a loving second chapter.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-stone-300 text-[11px] border border-stone-800">
              <span className="text-emerald-400 font-bold">● Verified Pre-Loved</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">Circular Wardrobe Initiative</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => setCurrentTab('marketplace')} className="hover:text-white transition">
                  All Pre-Loved Items
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('creators')} className="hover:text-white transition">
                  Creator Closets
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('match')} className="hover:text-white transition">
                  Revogue Match Finder
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('marketplace')} className="hover:text-white transition">
                  Budget Thrift Finds
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Community & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition">
                  How Revogue Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition">
                  5% Fair Seller Commission
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition">
                  Revogue Condition Index
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('buyer-dashboard')} className="hover:text-white transition">
                  Doorstep Delivery Tracking
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Buyer & Seller Assurance
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition text-amber-300 font-medium">
                  ✓ 100% Authenticity Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition">
                  Real Wear & Try-On Photos
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition">
                  Eco-friendly Packaging
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition">
                  Instant UPI Seller Payouts
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} REVOGUE Marketplace • "Good things deserve a second life."</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Curated for conscious circular fashion</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, Calculator, ShieldCheck, Check } from 'lucide-react';
import { api } from '../services/api';
import { Category } from '../types';

interface ProductListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => void;
}

export const ProductListingModal: React.FC<ProductListingModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [conditionGrade, setConditionGrade] = useState<'Like New' | 'Excellent' | 'Good' | 'Fair'>('Excellent');
  const [timesWorn, setTimesWorn] = useState('2');
  const [whySelling, setWhySelling] = useState('Worn only a few times');
  const [size, setSize] = useState('M');
  const [color, setColor] = useState('Black');
  const [material, setMaterial] = useState('100% Cotton');
  const [targetGender, setTargetGender] = useState<'Women' | 'Men' | 'Unisex' | 'Kids'>('Women');
  const [imageUrl, setImageUrl] = useState('');
  const [wornPhotoUrl, setWornPhotoUrl] = useState('');
  const [fitNotes, setFitNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Real-time calculation of condition score
  const wornCount = Number(timesWorn) || 1;
  let calculatedScore = 95;
  if (conditionGrade === 'Like New') calculatedScore = 98 - Math.min(wornCount, 3);
  else if (conditionGrade === 'Excellent') calculatedScore = 92 - Math.min(wornCount, 5);
  else if (conditionGrade === 'Good') calculatedScore = 85 - Math.min(wornCount, 8);
  else calculatedScore = 75;

  // Preset sample image shortcuts for fast demo experience
  const sampleImages = [
    { label: 'Tailored Blazer', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80' },
    { label: 'Silk Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80' },
    { label: 'Leather Bag', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
    { label: 'Watch', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80' }
  ];

  const sampleWornPhotos = [
    { label: 'Blazer Worn on Body', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', notes: "Seller is 5'5, Size M. Relaxed drape over light top, clicked during Sunday cafe outing." },
    { label: 'Saree Draped on Body', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', notes: 'Draped effortlessly at a festive evening, lightweight and elegant fall.' },
    { label: 'Sneakers on Foot', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80', notes: 'True to UK 9. Crisp creaseless toe box, looks fire with blue denim.' },
    { label: 'Dress Try-On', url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', notes: "Seller is 5'4. Midi length hits mid-calf, fluid pleats with comfortable waist." },
    { label: 'Jacket Worn Fit', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', notes: "Seller is 5'10, 72kg. Regular L fit with warm sherpa lining." }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !originalPrice || !sellingPrice) {
      setError('Please provide title, original price, and selling price.');
      return;
    }

    if (Number(sellingPrice) >= Number(originalPrice)) {
      setError('Selling price must be lower than original retail price for pre-loved resale.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalImage = imageUrl.trim() || sampleImages[0].url;
      const finalWornPhoto = wornPhotoUrl.trim() || sampleWornPhotos[0].url;
      const finalFitNotes = fitNotes.trim() || `Seller worn fit check: true to size ${size}. Clicked on real day out.`;

      await api.createProduct({
        title,
        brand: brand || 'Custom / Unbranded',
        category_id: Number(categoryId),
        description: description || 'Pre-loved garment in wonderful condition. Handled with supreme care.',
        original_price: Number(originalPrice),
        selling_price: Number(sellingPrice),
        condition_grade: conditionGrade,
        times_worn: wornCount,
        why_selling: whySelling,
        size,
        color,
        material,
        target_gender: targetGender,
        images: [finalImage],
        worn_photo_url: finalWornPhoto,
        fit_notes: finalFitNotes
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to list product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-950 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base">List a Pre-Loved Piece</h2>
              <p className="text-xs text-stone-500">Good things deserve a second life</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* 1. Item Core Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. ZARA Oversized Wool Blend Coat"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Brand *
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="e.g. Zara, Nike, Raw Mango"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900 bg-white"
              >
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Pricing & Resale Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Original Retail Price (₹) *
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)}
                placeholder="e.g. 5990"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={e => setSellingPrice(e.target.value)}
                placeholder="e.g. 2450"
                required
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-900"
              />
            </div>

            {originalPrice && sellingPrice && Number(originalPrice) > Number(sellingPrice) && (
              <div className="sm:col-span-2 text-xs text-emerald-800 bg-emerald-100/70 p-2.5 rounded-xl flex items-center justify-between">
                <span>
                  Buyer saves <strong>₹{(Number(originalPrice) - Number(sellingPrice)).toLocaleString('en-IN')}</strong> ({Math.round(((Number(originalPrice) - Number(sellingPrice)) / Number(originalPrice)) * 100)}% discount)
                </span>
                <span>Seller Payout (95%): <strong>₹{Math.round(Number(sellingPrice) * 0.95).toLocaleString('en-IN')}</strong></span>
              </div>
            )}
          </div>

          {/* 3. Condition & Revogue Condition Score Calculator */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Condition Grade
                </label>
                <select
                  value={conditionGrade}
                  onChange={e => setConditionGrade(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="Like New">Like New (Unworn/Sample)</option>
                  <option value="Excellent">Excellent (Minimal wear)</option>
                  <option value="Good">Good (Well loved)</option>
                  <option value="Fair">Fair (Vintage charm)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Times Worn / Used
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={timesWorn}
                  onChange={e => setTimesWorn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Target Audience
                </label>
                <select
                  value={targetGender}
                  onChange={e => setTargetGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Unisex">Unisex</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
            </div>

            {/* Why are you selling? (Core Unique Revogue requirement) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Why are you selling? *
              </label>
              <select
                value={whySelling}
                onChange={e => setWhySelling(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
              >
                <option value="Worn only a few times">Worn only a few times</option>
                <option value="No longer fits">No longer fits</option>
                <option value="No longer my style">No longer my style</option>
                <option value="Occasion-specific">Occasion-specific (Festive/Event wear)</option>
                <option value="Bought but rarely used">Bought but rarely used</option>
                <option value="Wardrobe refresh">Wardrobe refresh</option>
                <option value="Gifted item">Gifted item</option>
              </select>
            </div>

            {/* Transparent Condition Score Meter Preview */}
            <div className="bg-stone-900 text-white p-3.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <div>
                  <div className="text-xs font-semibold text-stone-400">Calculated Revogue Condition Score</div>
                  <div className="text-sm font-bold text-amber-300">
                    {calculatedScore >= 95 ? 'Pristine Flawless' : calculatedScore >= 90 ? 'Superb Pre-loved' : 'Good Vintage'}
                  </div>
                </div>
              </div>
              <div className="text-xl font-black text-white">
                {calculatedScore}<span className="text-stone-400 text-xs">/100</span>
              </div>
            </div>
          </div>

          {/* 4. Specifications */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Size</label>
              <input
                type="text"
                value={size}
                onChange={e => setSize(e.target.value)}
                placeholder="e.g. S, M, UK 9"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Color</label>
              <input
                type="text"
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="e.g. Emerald Green"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Material</label>
              <input
                type="text"
                value={material}
                onChange={e => setMaterial(e.target.value)}
                placeholder="e.g. Chanderi Silk"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>

          {/* 5. Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Description & Story
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell buyers why you loved this piece and describe its exact condition..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-stone-900"
            />
          </div>

          {/* 6. Image Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Product Flat-Lay / Hanger Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="Paste direct image URL or choose a preset below"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs mb-2"
            />

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-stone-400 font-semibold shrink-0">Sample Presets:</span>
              {sampleImages.map(img => (
                <button
                  type="button"
                  key={img.label}
                  onClick={() => setImageUrl(img.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition shrink-0 ${
                    imageUrl === img.url
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Worn on Body Photo (Real Try-On Look) */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2">
              <div className="p-1.5 bg-amber-200/80 rounded-lg text-amber-950 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  Real Wear & Fit Photo (How It Looks on Body)
                  <span className="bg-amber-200 text-amber-950 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                    Key Thrift Feature
                  </span>
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                  As this is a pre-loved garment you used, share a photo of you wearing it on a real day out so buyers see genuine fit and drape.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Worn on Body Photo URL
              </label>
              <input
                type="url"
                value={wornPhotoUrl}
                onChange={e => setWornPhotoUrl(e.target.value)}
                placeholder="Paste URL of you wearing this item or select preset below"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs mb-2"
              />

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[11px] text-stone-500 font-semibold shrink-0">Try-On Presets:</span>
                {sampleWornPhotos.map(item => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => {
                      setWornPhotoUrl(item.url);
                      setFitNotes(item.notes);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition shrink-0 ${
                      wornPhotoUrl === item.url
                        ? 'bg-amber-700 text-white border-amber-800'
                        : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Fit & Wear Description
              </label>
              <textarea
                rows={2}
                value={fitNotes}
                onChange={e => setFitNotes(e.target.value)}
                placeholder="e.g. 'I am 5\'5 wearing Size M. Fits true to size with a flowy drape. Clicked during Sunday cafe outing.'"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-amber-700 text-white transition flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isSubmitting ? 'Submitting...' : 'Submit Listing for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

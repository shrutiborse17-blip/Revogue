import React, { useState } from 'react';
import { ShieldCheck, Leaf, RefreshCw, Sparkles, CheckCircle2, Send, HelpCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
  };

  const faqs = [
    { q: 'How does Revogue verify product condition?', a: 'Every seller submits wear history, photos, and answers "Why are you selling?". Our algorithm scores items from 0–100, and our admin moderation queue inspects each listing prior to publication.' },
    { q: 'What is the platform commission rate?', a: 'Revogue charges a modest 5% flat fee on successful sales. 95% of the selling price is transferred directly to the seller upon delivery verification.' },
    { q: 'How does delivery tracking work?', a: 'When an order is confirmed, our logistics timeline advances through 7 transparent milestones from seller packaging and hub pickup to doorstep delivery.' },
    { q: 'Can I be both a buyer and a seller?', a: 'Yes! On Revogue, your single account allows you to shop pre-loved garments and list your own unused wardrobe pieces seamlessly.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Manifesto */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
          Our Philosophy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
          "Good things deserve a second life."
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Millions of high-quality garments, shoes, and bags sit unused after just two or three wears. REVOGUE transforms wardrobes into circular assets by creating a trustworthy resale marketplace tailored for Indian consumers.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">Condition Transparency</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every listing features our transparent Revogue Condition Score and seller trust metrics, eliminating the guesswork of thrift shopping.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-emerald-400 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">Measurable Sustainability</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Re-wearing an existing garment cuts freshwater waste by ~2,700 liters and reduces carbon emissions, fostering circular fashion habits.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">Fair 5% Commission</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We believe sellers should keep the lion's share of their proceeds. 95% is disbursed straight to your bank UPI within 24 hours of delivery.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-serif text-2xl font-bold text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-500">Everything you need to know about buying and selling on Revogue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-1.5">
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                {faq.q}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Support Form */}
      <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 space-y-6">
        <div className="text-center space-y-1 max-w-md mx-auto">
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Have a Question or Feedback?
          </h3>
          <p className="text-xs text-stone-500">
            Reach out to our dedicated support team or submit an inquiry.
          </p>
        </div>

        {feedbackSent ? (
          <div className="p-6 bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            Thank you! Your inquiry has been registered in the database.
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="Shruti Borse"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="shruti@revogue.demo"
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Message</label>
              <textarea
                rows={3}
                value={contactMsg}
                onChange={e => setContactMsg(e.target.value)}
                placeholder="Ask about item condition grading, seller payouts, or doorstep delivery..."
                required
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Send Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

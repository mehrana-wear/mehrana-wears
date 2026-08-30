import React from 'react';
import { Sparkles, ArrowRight, Shield, RefreshCw, Truck, Award } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroBannerProps {
  onSelectCategory: (cat: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory }) => {
  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl bg-[#354024] text-white shadow-xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-[#45532F]/60">
      {/* Subtle Background Pattern & Ambient Lighting */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#8A9A5B_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute -top-20 -right-20 w-[420px] h-[420px] bg-[#45532F]/60 rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#C17F59]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Editorial Copy */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#45532F]/80 border border-[#8A9A5B]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#E8E1D5]">
            <Sparkles className="w-3.5 h-3.5 text-[#C17F59]" />
            <span>New Festive & Autumn Pret Collection 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Elegance Woven in <br />
            <span className="italic font-normal text-white">Pure Raw Silk & Linen</span>
          </h1>

          <p className="text-[#D8CFC4] text-sm sm:text-base max-w-xl leading-relaxed font-light">
            Discover Mehrana Wears’ handcrafted ready-to-wear catalog. From zardozi-embroidered raw silk kurtas to lightweight chiffon abayas and tailored menswear.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-explore-women-btn"
              onClick={() => onSelectCategory('Women')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#C17F59] to-[#A86A46] hover:from-[#B06E4A] hover:to-[#965A38] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 group border border-[#C17F59]/40"
            >
              <span>Explore Women’s Wear</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-explore-festive-btn"
              onClick={() => onSelectCategory('Festive')}
              className="px-5 py-3.5 rounded-2xl bg-[#3B4626]/90 hover:bg-[#45532F] text-[#FDFBF7] border border-[#8A9A5B]/30 font-semibold text-sm transition-all"
            >
              Festive & Bridal
            </button>

            <button
              id="hero-explore-modest-btn"
              onClick={() => onSelectCategory('Modest')}
              className="px-5 py-3.5 rounded-2xl bg-[#3B4626]/90 hover:bg-[#45532F] text-[#FDFBF7] border border-[#8A9A5B]/30 font-semibold text-sm transition-all"
            >
              Abayas & Modest
            </button>
          </div>
        </div>

        {/* Right Feature Showcase Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
          <div 
            onClick={() => onSelectCategory('Women')}
            className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-4/5 shadow-lg border border-[#8A9A5B]/40"
          >
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
              alt="Women Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A341D]/90 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C17F59]">Curated</span>
              <p className="font-serif font-bold text-base text-white">Silk Kurtas & Pret</p>
            </div>
          </div>

          <div 
            onClick={() => onSelectCategory('Men')}
            className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-4/5 shadow-lg border border-[#8A9A5B]/40 mt-4 sm:mt-6"
          >
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80"
              alt="Men Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A341D]/90 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C17F59]">Tailored</span>
              <p className="font-serif font-bold text-base text-white">Linen Bandhgalas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Bar */}
      <div className="border-t border-[#45532F] bg-[#2E381F] px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-[#D8CFC4]">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-[#8A9A5B] shrink-0" />
            <span>Fast Express Dispatch</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-[#8A9A5B] shrink-0" />
            <span>Authentic Handloom Pure Fabrics</span>
          </div>
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-[#8A9A5B] shrink-0" />
            <span>Hassle-Free 14-Day Exchanges</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[#8A9A5B] shrink-0" />
            <span>100% Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

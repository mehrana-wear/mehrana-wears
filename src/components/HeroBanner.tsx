import React from 'react';
import { Sparkles, ArrowRight, Shield, RefreshCw, Truck, Award } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroBannerProps {
  onSelectCategory: (cat: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectCategory }) => {
  return (
    <div className="relative mb-6 sm:mb-10 overflow-hidden rounded-3xl bg-[#354024] text-white shadow-xl mx-3 sm:mx-6 lg:mx-8 mt-3 sm:mt-4 border border-[#45532F]/60">
      {/* Subtle Background Pattern & Ambient Lighting */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#8A9A5B_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute -top-20 -right-20 w-[420px] h-[420px] bg-[#45532F]/60 rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#C17F59]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-10 py-8 sm:py-12 lg:py-16">
        
        {/* Editorial Copy */}
        <div className="max-w-3xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#45532F]/80 border border-[#8A9A5B]/40 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-[#E8E1D5]">
            <Sparkles className="w-3.5 h-3.5 text-[#C17F59] shrink-0" />
            <span>New Festive & Autumn Pret Collection 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Elegance Woven in <br />
            <span className="italic font-normal text-white">Kaftan & Farshi sets</span>
          </h1>

          <p className="text-[#D8CFC4] text-xs sm:text-base max-w-xl leading-relaxed font-light">
            Discover Mehrana Wears’ handcrafted ready-to-wear catalog. From zardozi-embroidered raw silk kurtas to lightweight chiffon abayas and tailored menswear.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <button
              id="hero-explore-women-btn"
              onClick={() => onSelectCategory('Women')}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#C17F59] to-[#A86A46] hover:from-[#B06E4A] hover:to-[#965A38] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group border border-[#C17F59]/40"
            >
              <span>Explore Women’s Wear</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-explore-festive-btn"
              onClick={() => onSelectCategory('Festive')}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-[#3B4626]/90 hover:bg-[#45532F] text-[#FDFBF7] border border-[#8A9A5B]/30 font-semibold text-xs sm:text-sm transition-all text-center"
            >
              Festive & Bridal
            </button>

            <button
              id="hero-explore-modest-btn"
              onClick={() => onSelectCategory('Modest')}
              className="flex-1 sm:flex-none px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-[#3B4626]/90 hover:bg-[#45532F] text-[#FDFBF7] border border-[#8A9A5B]/30 font-semibold text-xs sm:text-sm transition-all text-center"
            >
              Abayas & Modest
            </button>
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

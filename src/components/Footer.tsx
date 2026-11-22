import React, { useState } from 'react';
import { Sparkles, Mail, Check, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { ProductCategory } from '../types';
import { BrandLogo } from './BrandLogo';
import { GoogleGLogo } from './GooglePaySheet';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenSizeGuide: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSizeGuide,
  onOpenAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2A341D] text-[#D8CFC4] border-t border-[#3F4C27] mt-20">
      {/* Newsletter / Latest Updates Banner */}
      <div className="border-b border-[#3F4C27] bg-[#222B17]">
        <div id="newsletter-updates-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-1.5">
              <span className="text-[#C17F59] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Stay Connected & Inspired</span>
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#FDFBF7]">Get the Latest Updates & Exclusive Edits</h3>
              <p className="text-xs text-[#A68F7A] leading-relaxed">
                Be the first to know about new arrivals, seasonal Kaftan & Farshi sets, flash collections, and VIP offers.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="bg-[#3F4C27] border border-[#8A9A5B] text-[#FDFBF7] p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
                  <div className="w-7 h-7 rounded-full bg-[#8A9A5B]/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[#8A9A5B]" />
                  </div>
                  <div>
                    <span className="block font-bold">You're Subscribed!</span>
                    <span className="text-[#D8CFC4] font-normal text-[11px]">We'll send the latest updates and drops straight to your inbox.</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-[#8A9A5B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="newsletter-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to get latest updates..."
                      className="w-full bg-[#354024] border border-[#45532F] text-[#FDFBF7] placeholder-[#8A9A5B]/70 text-xs pl-10 pr-4 py-3.5 rounded-2xl outline-hidden focus:border-[#C17F59] focus:bg-[#3D4B2A]"
                    />
                  </div>
                  <button
                    id="newsletter-submit-btn"
                    type="submit"
                    className="px-6 py-3.5 bg-[#C17F59] hover:bg-[#A86A46] text-white font-bold text-xs rounded-2xl transition shadow-md whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Get Updates</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" variant="light" />
            
            <p className="text-xs text-[#A68F7A] leading-relaxed max-w-sm">
              Mehrana wear redefines luxury modest clothing and artisanal festive pret. We celebrate authentic handlooms, raw silks, and delicate needlework tailored for the modern silhouette.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-[#8A9A5B]">
              <ShieldCheck className="w-4 h-4 text-[#C17F59]" />
              <span>Certified Handloom Silk & Ethical Sustainable Craft</span>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#FDFBF7]">Collections</h4>
            <ul className="space-y-2 text-xs text-[#A68F7A]">
              <li>
                <button onClick={() => onSelectCategory('Women')} className="hover:text-[#FDFBF7] transition">
                  Women's Pret & Silk
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Men')} className="hover:text-[#FDFBF7] transition">
                  Men's Linen Bandhgalas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Modest')} className="hover:text-[#FDFBF7] transition">
                  Modest Abayas & Hijabs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Festive')} className="hover:text-[#FDFBF7] transition">
                  Festive & Wedding Gowns
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Kids')} className="hover:text-[#FDFBF7] transition">
                  Kids Festive Outfits
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Accessories')} className="hover:text-[#FDFBF7] transition">
                  Pashmina & Shawls
                </button>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#FDFBF7]">Customer Concierge</h4>
            <ul className="space-y-2 text-xs text-[#A68F7A]">
              <li>
                <button onClick={onOpenSizeGuide} className="hover:text-[#FDFBF7] transition text-left">
                  Size Guide & Measurements
                </button>
              </li>
              <li className="hover:text-[#FDFBF7] transition cursor-pointer">
                Complimentary Shipping Policy
              </li>
              <li className="hover:text-[#FDFBF7] transition cursor-pointer">
                14-Day Global Returns
              </li>
              <li className="hover:text-[#FDFBF7] transition cursor-pointer">
                Track Consignment
              </li>
              <li className="hover:text-[#FDFBF7] transition cursor-pointer">
                Fabric Care & Maintenance
              </li>
            </ul>
          </div>

          {/* Store & Admin */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#FDFBF7]">Store & Boutique</h4>
            <div className="text-xs text-[#A68F7A] space-y-1.5 leading-relaxed">
              <p>
                <span className="text-[#D8CFC4]">Email: </span>
                <a href="mailto:farukarim@gmail.com" className="hover:text-[#FDFBF7] transition underline underline-offset-2">
                  farukarim@gmail.com
                </a>
              </p>
              <p>
                <span className="text-[#D8CFC4]">Phone No: </span>
                <a href="tel:+923450587779" className="hover:text-[#FDFBF7] transition">
                  +923450587779
                </a>
              </p>
              <p>
                <span className="text-[#D8CFC4]">Available: </span>
                <span>Monday to Thursday</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                id="footer-admin-portal-link-btn"
                onClick={onOpenAdmin}
                className="text-xs text-[#8A9A5B] hover:text-[#FDFBF7] font-semibold underline underline-offset-4"
              >
                Store Admin Portal Access →
              </button>
            </div>
          </div>
        </div>

        {/* Accepted Payment Methods Bar */}
        <div className="mt-10 pt-6 border-t border-[#3F4C27]/70 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#A68F7A]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8A9A5B]" />
            <span className="font-semibold text-[#D8CFC4]">Verified Safe & Secure Checkout</span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[11px] text-[#A68F7A] mr-1">Accepted Payment:</span>
            
            {/* Google Pay Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-[#202124] text-xs font-semibold shadow-xs border border-[#dadce0]">
              <GoogleGLogo className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold tracking-tight">Pay</span>
            </span>

            {/* Apple Pay Pill */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2D2D2D] text-white text-xs font-medium border border-white/10">
              <span> Pay</span>
            </span>

            {/* Visa Pill */}
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#1a73e8] text-white text-[11px] font-bold tracking-wider">
              VISA
            </span>

            {/* Mastercard Pill */}
            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-[#d93025] text-white text-[11px] font-bold tracking-wider">
              Mastercard
            </span>

            {/* Cash on Delivery Pill */}
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#FAF0EB] text-[#C17F59] text-[11px] font-semibold border border-[#C17F59]/30">
              Cash on Delivery
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-[#3F4C27] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#8A9A5B]">
          <p>© {new Date().getFullYear()} Mehrana Wears Ltd. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#A68F7A]">
              Crafted with <Heart className="w-3.5 h-3.5 text-[#C17F59] fill-[#C17F59]" /> for luxury fashion lovers
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-[#3F4C27] hover:bg-[#4F5E34] text-white transition"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

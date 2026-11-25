import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { ProductCategory, CurrencyCode, User } from '../types';
import { CURRENCY_CONFIGS } from '../utils/currency';
import { UserAvatar } from './UserAvatar';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  isAdminUnlocked: boolean;
  currency: CurrencyCode;
  onChangeCurrency: (curr: CurrencyCode) => void;
  onToggleFilterDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  currentUser,
  onOpenAuth,
  onOpenAccount,
  onOpenAdmin,
  isAdminUnlocked,
  currency,
  onChangeCurrency,
  onToggleFilterDrawer,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'All', label: 'Shop All' },
    { id: 'Women', label: 'Women' },
    { id: 'Men', label: 'Men' },
    { id: 'Modest', label: 'Modest & Abayas' },
    { id: 'Kids', label: 'Kids Festive' },
    { id: 'Festive', label: 'Festive & Bridal' },
    { id: 'Accessories', label: 'Shawls & Accessories' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D8] shadow-xs">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#354024] text-[#F5F0E8] text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#2A341D]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 font-medium min-w-0">
            <span className="bg-[#C17F59] text-white px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-2xs shrink-0">
              Express
            </span>
            <span className="text-[#FDFBF7] font-semibold tracking-wide text-[11px] sm:text-xs truncate">
              Delivery all over Pakistan
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[#D8CFC4] shrink-0">
            <span className="hidden md:inline">Fast 2–4 Days Doorstep Service</span>
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#FDFBF7] hover:text-white transition-colors bg-[#45532F] px-2 sm:px-2.5 py-0.5 rounded-md"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showCurrencyDropdown && (
                <div className="absolute right-0 mt-1 w-28 bg-[#FDFBF7] text-[#2D2D2D] rounded-xl shadow-xl border border-[#E8E2D8] py-1 z-50">
                  {(Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onChangeCurrency(c);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#F5F0E8] transition-colors ${
                        currency === c ? 'font-bold text-[#3F4C27] bg-[#F0F4E8]' : 'text-[#5F584E]'
                      }`}
                    >
                      <span>{c}</span>
                      <span className="text-[#A68F7A] font-normal">{CURRENCY_CONFIGS[c].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Button (moved to top utility bar for cleaner logo space) */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative flex items-center gap-1 text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-md text-[#FDFBF7] hover:text-white bg-[#45532F]/60 hover:bg-[#45532F] transition-all"
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C17F59] fill-[#C17F59]/30 shrink-0" />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-[#C17F59] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Quick Admin Portal Button */}
            <button
              id="header-admin-portal-btn"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-medium px-2 sm:px-2.5 py-0.5 rounded-md transition-all ${
                isAdminUnlocked 
                  ? 'bg-[#8A9A5B] text-white font-semibold shadow-xs' 
                  : 'text-[#D8CFC4] hover:text-white bg-[#45532F]/60 hover:bg-[#45532F]'
              }`}
            >
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8A9A5B]" />
              <span>Admin</span>
              <span className="hidden sm:inline">Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1.5 sm:gap-4">
          
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            {/* Mobile Menu Trigger */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#F5F0E8] transition shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Brand Logo */}
            <div 
              onClick={() => onSelectCategory('All')} 
              className="cursor-pointer group select-none min-w-0"
              aria-label="Mehrana wear home"
            >
              <BrandLogo size="md" variant="dark" />
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 text-[#A68F7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="main-product-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search silk kurtas, linen tunics, abayas..."
              className="w-full bg-[#F5F0E8] hover:bg-[#FAF7F2] focus:bg-white text-[#2D2D2D] placeholder-[#A68F7A] text-sm pl-10 pr-8 py-2.5 rounded-full border border-[#E8E2D8] focus:border-[#8A9A5B] focus:ring-2 focus:ring-[#8A9A5B]/20 transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A68F7A] hover:text-[#2D2D2D]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Icons (Bag & Account cleanly separated from brand logo) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#354024] hover:bg-[#2A341D] text-[#FDFBF7] transition-all shadow-sm hover:shadow-md group"
              title="Shopping Cart"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#C17F59] group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs tracking-wide hidden sm:inline">Bag</span>
              <span className="bg-[#45532F] text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>

            {/* User Account / Login - Always visible on mobile & desktop */}
            {currentUser ? (
              <button
                id="header-user-account-btn"
                onClick={onOpenAccount}
                className="flex items-center gap-1.5 sm:gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full border border-[#E8E2D8] hover:border-[#8A9A5B] bg-[#F5F0E8] hover:bg-[#FAF7F2] transition-all group"
                title={`Logged in as ${currentUser.name} (${currentUser.email})`}
              >
                <UserAvatar
                  name={currentUser.name}
                  avatarUrl={currentUser.avatar}
                  size="sm"
                  showGoogleBadge={currentUser.email.toLowerCase().includes('gmail.com') || currentUser.authProvider === 'google'}
                />
                <span className="text-[11px] sm:text-xs font-semibold text-[#2D2D2D] max-w-[56px] sm:max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-[#3F4C27] bg-[#F0F4E8] hover:bg-[#E2ECD5] border border-[#8A9A5B]/40 rounded-full transition-colors whitespace-nowrap shadow-2xs"
              >
                <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3F4C27] shrink-0" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (visible on small screens) */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A68F7A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search clothing, kurtas, abayas..."
              className="w-full bg-[#F5F0E8] text-[#2D2D2D] text-sm pl-10 pr-8 py-2 rounded-full border border-[#E8E2D8] focus:outline-hidden focus:border-[#8A9A5B]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A68F7A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Bar (Scrollable on Mobile/Tablet, Full on Desktop) */}
        <nav className="flex items-center justify-between border-t border-[#E8E2D8]/80 py-2 sm:py-2.5 gap-2">
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar flex-1">
            {categories.map((cat) => {
              const active = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`nav-category-${cat.id.toLowerCase()}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#3F4C27] text-white font-semibold shadow-xs'
                      : 'text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#F5F0E8]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {onToggleFilterDrawer && (
            <button
              onClick={onToggleFilterDrawer}
              className="flex items-center gap-1 sm:gap-1.5 text-xs font-medium text-[#5F584E] hover:text-[#2D2D2D] px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#FAF7F2] lg:bg-transparent border border-[#E8E2D8] lg:border-transparent hover:bg-[#F5F0E8] transition-colors shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A9A5B]" />
              <span>Filters</span>
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute inset-x-0 top-full bg-[#FDFBF7] border-b border-[#E8E2D8] p-4 shadow-2xl z-50 max-h-[78vh] overflow-y-auto animate-fadeIn">
          <div className="space-y-1 pb-4 border-b border-[#E8E2D8]">
            <p className="text-[11px] font-bold text-[#A68F7A] uppercase tracking-wider px-3 mb-1">
              Shop Collections
            </p>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  currentCategory === cat.id
                    ? 'bg-[#3F4C27] text-white font-semibold'
                    : 'text-[#5F584E] hover:bg-[#F5F0E8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-3 space-y-2">
            {!currentUser ? (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#3F4C27] text-white py-2.5 rounded-xl font-medium text-sm shadow-xs"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAccount();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#F5F0E8] text-[#2D2D2D] py-2.5 rounded-xl font-medium text-sm border border-[#E8E2D8]"
              >
                <UserIcon className="w-4 h-4 text-[#8A9A5B]" />
                <span>My Account & Orders</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#FAF0EB] text-[#9E5F3B] border border-[#C17F59]/30 py-2 rounded-xl font-medium text-xs"
            >
              <Heart className="w-4 h-4 text-[#C17F59]" />
              <span>Saved Wishlist ({wishlistCount})</span>
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/30 py-2 rounded-xl font-medium text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#8A9A5B]" />
              <span>Admin Store Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

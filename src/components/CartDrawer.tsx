import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { PROMO_CODES } from '../data/initialProducts';
import { GooglePayButton } from './GooglePaySheet';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currency: CurrencyCode;
  onProceedToCheckout: () => void;
  onGooglePayCheckout?: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  currency,
  onProceedToCheckout,
  onGooglePayCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Free shipping threshold: $120
  const freeShippingThreshold = 120;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Discount calculation
  let discountAmount = 0;
  let hasFreeShippingCoupon = false;

  if (appliedCoupon && PROMO_CODES[appliedCoupon]) {
    const promo = PROMO_CODES[appliedCoupon];
    if (promo.discountPercent) {
      discountAmount = (subtotal * promo.discountPercent) / 100;
    }
    if (promo.freeShipping) {
      hasFreeShippingCoupon = true;
    }
  }

  const shippingFee = (subtotal >= freeShippingThreshold || hasFreeShippingCoupon || subtotal === 0) ? 0 : 9.99;
  const tax = subtotal > 0 ? (subtotal - discountAmount) * 0.05 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + tax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const clean = couponInput.trim().toUpperCase();
    if (!clean) return;

    const success = onApplyCoupon(clean);
    if (success) {
      setCouponSuccess(`Coupon ${clean} applied!`);
      setCouponInput('');
    } else {
      setCouponError('Invalid promo code. Try MEHRANA15 or WELCOME10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-[#E8E2D8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3F4C27] text-[#E8E1D5] flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4 text-[#C17F59]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2D2D2D] leading-none">Shopping Bag</h3>
              <p className="text-xs text-[#A68F7A] mt-1">{totalItems} {totalItems === 1 ? 'garment' : 'garments'} selected</p>
            </div>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#EFE9DF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {cart.length > 0 && (
          <div className="bg-[#F0F4E8] px-5 py-3 border-b border-[#8A9A5B]/30">
            <div className="flex items-center justify-between text-xs font-semibold text-[#3F4C27] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#8A9A5B]" />
                {amountNeededForFreeShipping === 0 || hasFreeShippingCoupon ? (
                  <span className="text-[#3F4C27] font-bold">🎉 You unlocked Complimentary Express Shipping!</span>
                ) : (
                  <span>Add <strong>{formatPrice(amountNeededForFreeShipping, currency)}</strong> for Free Express Delivery</span>
                )}
              </span>
              <span>{Math.round(shippingProgress)}%</span>
            </div>
            <div className="w-full bg-[#E3ECD7] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3F4C27] h-full rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#F0F4E8] text-[#8A9A5B] flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-[#2D2D2D]">Your bag is empty</h4>
                <p className="text-xs text-[#6B655B] mt-1 max-w-xs">
                  Explore our luxury collection of handloom silks, abayas, and festive pret wear.
                </p>
              </div>
              <button
                id="cart-empty-start-shopping-btn"
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[#3F4C27] text-white font-semibold text-xs hover:bg-[#323D1F] transition shadow-md"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E8E2D8] hover:border-[#8A9A5B]/40 transition-all shadow-xs"
              >
                {/* Item Image */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-xl shrink-0 bg-[#F5F0E8]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80';
                  }}
                />

                {/* Item Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-medium text-xs text-[#2D2D2D] line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#A68F7A] hover:text-[#C17F59] transition p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-[#FAF7F2] border border-[#E8E2D8] text-[#5F584E] text-[10px] font-bold px-2 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </span>
                      {item.selectedColor && (
                        <span className="text-[10px] text-[#A68F7A] flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-[#D8CFC4] inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#E8E2D8] rounded-lg bg-[#FAF7F2]">
                      <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#5F584E] hover:bg-[#EFE9DF] rounded-l"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#2D2D2D]">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#5F584E] hover:bg-[#EFE9DF] rounded-r"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif font-bold text-sm text-[#2D2D2D]">
                      {formatPrice(item.price * item.qty, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E8E2D8] bg-[#FAF7F2] space-y-4">
            
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#F0F4E8] border border-[#8A9A5B]/40 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-[#3F4C27] font-bold">
                    <Tag className="w-3.5 h-3.5 text-[#8A9A5B]" />
                    <span>Coupon: {appliedCoupon}</span>
                    <span className="text-[10px] text-[#6B655B] font-normal">
                      ({PROMO_CODES[appliedCoupon]?.description})
                    </span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    className="text-[#C17F59] font-semibold hover:underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (e.g. MEHRANA15)"
                    className="flex-1 bg-white border border-[#E8E2D8] text-xs px-3 py-2 rounded-xl uppercase tracking-wider focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] outline-hidden text-[#2D2D2D] placeholder-[#A68F7A]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#3F4C27] hover:bg-[#323D1F] text-white rounded-xl text-xs font-semibold transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-[#C17F59] font-medium">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-[#3F4C27] font-medium">{couponSuccess}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5F584E] border-t border-[#E8E2D8] pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2D2D2D]">{formatPrice(subtotal, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#8A9A5B] font-semibold">
                  <span>Promo Savings</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-[#3F4C27]">FREE</strong>
                  ) : (
                    formatPrice(shippingFee, currency)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span>{formatPrice(tax, currency)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#2D2D2D] pt-2 border-t border-[#E8E2D8]">
                <span className="font-serif">Grand Total</span>
                <span className="font-serif text-[#3F4C27] text-lg">{formatPrice(grandTotal, currency)}</span>
              </div>
            </div>

            {/* Express Google Pay & Standard Checkout Actions */}
            <div className="space-y-2.5 pt-1">
              <GooglePayButton
                onClick={() => {
                  if (onGooglePayCheckout) {
                    onGooglePayCheckout();
                  } else {
                    onProceedToCheckout();
                  }
                }}
                total={grandTotal}
                currency={currency}
                variant="buy"
                className="w-full"
              />

              <div className="flex items-center gap-2 my-1">
                <div className="h-px bg-[#E8E2D8] flex-1" />
                <span className="text-[10px] font-semibold text-[#A68F7A] uppercase tracking-wider">or continue with</span>
                <div className="h-px bg-[#E8E2D8] flex-1" />
              </div>

              {/* Standard Checkout Action Button */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-[#C17F59] hover:bg-[#A86A46] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all group"
              >
                <span>Standard Delivery Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#A68F7A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8A9A5B]" />
              <span>Encrypted 256-Bit SSL Checkout Protection</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

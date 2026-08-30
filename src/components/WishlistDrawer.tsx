import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
  currency: CurrencyCode;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveWishlist,
  onMoveToCart,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-[#E8E2D8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF0EB] text-[#C17F59] flex items-center justify-center">
              <Heart className="w-4 h-4 fill-[#C17F59]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2D2D2D] leading-none">Saved Wishlist</h3>
              <p className="text-xs text-[#A68F7A] mt-1">{wishlistProducts.length} items saved</p>
            </div>
          </div>

          <button
            id="close-wishlist-drawer-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#EFE9DF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#FAF0EB] text-[#C17F59] flex items-center justify-center">
                <Heart className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-[#2D2D2D]">Your wishlist is empty</h4>
                <p className="text-xs text-[#6B655B] mt-1 max-w-xs">
                  Tap the heart icon on any garment to save your favorites for later.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[#3F4C27] text-white font-semibold text-xs hover:bg-[#323D1F] transition shadow-md"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E8E2D8] hover:border-[#8A9A5B]/40 transition shadow-xs"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded-xl shrink-0 bg-[#F5F0E8]"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-xs text-[#2D2D2D] line-clamp-1">{product.name}</h4>
                      <button
                        onClick={() => onRemoveWishlist(product)}
                        className="text-[#A68F7A] hover:text-[#C17F59] p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#6B655B] mt-0.5">{product.fabric}</p>
                    <p className="font-serif font-bold text-sm text-[#2D2D2D] mt-1">
                      {formatPrice(product.price, currency)}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onMoveToCart(product);
                      onRemoveWishlist(product);
                    }}
                    className="w-full py-2 bg-[#3F4C27] hover:bg-[#323D1F] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C17F59]" />
                    <span>Move to Shopping Bag</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-[#E8E2D8] bg-[#FAF7F2]">
            <button
              onClick={() => {
                wishlistProducts.forEach((p) => onMoveToCart(p));
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>Add All to Bag</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

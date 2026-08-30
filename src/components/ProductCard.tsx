import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product.colors[0] || { name: 'Standard', hex: '#000000' }
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const currentImage = isHovered && product.additional_images && product.additional_images.length > 0
    ? product.additional_images[0]
    : product.image_url;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-[#E8E2D8] hover:border-[#8A9A5B]/40 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#F5F0E8]">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-[#C17F59] text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#3F4C27] text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
              New In
            </span>
          )}
          {discountPercent && discountPercent > 0 && (
            <span className="bg-[#9E5F3B] text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlist}
          aria-label="Toggle Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs z-20 ${
            isWishlisted
              ? 'bg-[#FAF0EB] text-[#C17F59] border border-[#C17F59]/30'
              : 'bg-white/85 text-[#5F584E] hover:text-[#C17F59] hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C17F59]' : ''}`} />
        </button>

        {/* Quick View Floating Button */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/95 backdrop-blur-xs hover:bg-white text-[#2D2D2D] text-xs font-semibold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors border border-[#E8E2D8]/60"
          >
            <Eye className="w-3.5 h-3.5 text-[#3F4C27]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#8A9A5B] font-bold tracking-wider uppercase text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#C17F59]">
              <Star className="w-3.5 h-3.5 fill-[#C17F59] text-[#C17F59]" />
              <span className="font-bold text-[#2D2D2D] text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[#A68F7A] text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-[#2D2D2D] text-sm leading-snug line-clamp-2 group-hover:text-[#3F4C27] transition-colors">
            {product.name}
          </h3>

          {/* Fabric Note */}
          <p className="text-[#6B655B] text-xs line-clamp-1 mt-1 font-light">
            {product.fabric}
          </p>
        </div>

        {/* Size Selection Pills */}
        <div className="space-y-2 pt-1 border-t border-[#E8E2D8]/70" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#5F584E] font-medium">Select Size:</span>
            <span className="font-semibold text-[#2D2D2D]">{selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedSize === sz
                    ? 'bg-[#3F4C27] text-white shadow-xs'
                    : 'bg-[#F5F0E8] text-[#5F584E] hover:bg-[#E8E1D5]'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Color Swatches */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#A68F7A] mr-1">Colors:</span>
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedColor.name === c.name
                      ? 'ring-2 ring-[#3F4C27] ring-offset-1 scale-110'
                      : 'border-[#D8CFC4]'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Bag */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E8E2D8]/50" onClick={(e) => e.stopPropagation()}>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-lg text-[#2D2D2D] leading-none">
                {formatPrice(product.price, currency)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#A68F7A] line-through">
                  {formatPrice(product.originalPrice, currency)}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] font-bold text-[#C17F59] block mt-0.5">
                Only {product.stock} left
              </span>
            )}
          </div>

          <button
            id={`add-to-bag-btn-${product.id}`}
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isAdded
                ? 'bg-[#8A9A5B] text-white'
                : product.stock <= 0
                ? 'bg-[#E8E1D5] text-[#A68F7A] cursor-not-allowed'
                : 'bg-[#3F4C27] hover:bg-[#323D1F] text-white hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#E8E1D5]" />
                <span>Added!</span>
              </>
            ) : product.stock <= 0 ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#C17F59]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Ruler, 
  Check, 
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Send
} from 'lucide-react';
import { Product, CurrencyCode, Review, User } from '../types';
import { formatPrice } from '../utils/currency';
import { GooglePayButton } from './GooglePaySheet';

interface ProductDetailModalProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }, qty: number) => void;
  onBuyNowWithGooglePay?: (product: Product, size: string, color: { name: string; hex: string }, qty: number) => void;
  onClose: () => void;
  onOpenSizeGuide: () => void;
  reviews: Review[];
  onAddReview: (productId: string, rating: number, title: string, comment: string) => void;
  currentUser: User | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNowWithGooglePay,
  onClose,
  onOpenSizeGuide,
  reviews,
  onAddReview,
  currentUser,
}) => {
  const images = [product.image_url, ...(product.additional_images || [])];
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product.colors[0] || { name: 'Standard', hex: '#000000' }
  );
  const [qty, setQty] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'care' | 'reviews'>('details');
  const [isAdded, setIsAdded] = useState(false);

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, qty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) return;
    onAddReview(product.id, newRating, newTitle.trim(), newComment.trim());
    setNewTitle('');
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-[#FDFBF7] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E8E2D8] animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[92vh] flex flex-col text-[#2D2D2D]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-detail-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#FAF7F2]/90 hover:bg-[#FAF7F2] text-[#5F584E] hover:text-[#2D2D2D] border border-[#E8E2D8] shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-4">
              {/* Main Active Image */}
              <div className="aspect-3/4 w-full rounded-2xl overflow-hidden bg-[#F5F0E8] relative shadow-inner border border-[#E8E2D8]">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                {discountPercent && discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#C17F59] text-white font-bold text-xs uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === img
                          ? 'border-[#8A9A5B] ring-2 ring-[#8A9A5B]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info & Action Column */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Category & Sku */}
                <div className="flex items-center justify-between text-xs text-[#A68F7A]">
                  <span className="bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/30 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-[10px]">
                    {product.category}
                  </span>
                  <span className="font-mono text-[#A68F7A]">SKU: {product.sku}</span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2D2D] leading-snug">
                  {product.name}
                </h2>

                {/* Ratings Overview */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-[#C17F59]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating)
                            ? 'fill-[#C17F59] text-[#C17F59]'
                            : 'text-[#D8CFC4]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-[#2D2D2D]">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-[#A68F7A]">({reviews.length} customer reviews)</span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-serif font-extrabold text-3xl text-[#2D2D2D]">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-[#A68F7A] line-through">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="text-xs font-semibold text-[#C17F59] bg-[#FAF0EB] border border-[#C17F59]/30 px-2 py-0.5 rounded-full">
                      Save {formatPrice(product.originalPrice! - product.price, currency)}
                    </span>
                  )}
                </div>

                {/* Quick Fabric Tag */}
                <div className="bg-[#FAF7F2] border border-[#E8E2D8] p-3 rounded-xl flex items-center gap-2.5 text-xs text-[#5F584E]">
                  <Sparkles className="w-4 h-4 text-[#8A9A5B] shrink-0" />
                  <span><strong>Fabric:</strong> {product.fabric}</span>
                </div>

                {/* Size Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                      Select Size: <span className="text-[#3F4C27] ml-1">{selectedSize}</span>
                    </span>
                    <button
                      id="product-detail-size-guide-btn"
                      onClick={onOpenSizeGuide}
                      className="flex items-center gap-1 text-xs text-[#3F4C27] hover:text-[#2D351E] font-semibold underline underline-offset-2"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          selectedSize === sz
                            ? 'bg-[#3F4C27] text-white shadow-xs'
                            : 'bg-[#FAF7F2] border border-[#E8E2D8] hover:bg-[#EFE9DF] text-[#2D2D2D]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider block">
                      Color: <span className="text-[#3F4C27] ml-1">{selectedColor.name}</span>
                    </span>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                            selectedColor.name === c.name
                              ? 'border-[#8A9A5B] bg-[#F0F4E8] text-[#3F4C27] font-semibold'
                              : 'border-[#E8E2D8] bg-white text-[#5F584E] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-[#D8CFC4]"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Stock */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2D2D2D] uppercase tracking-wider">Quantity</span>
                    <span className={`font-semibold ${product.stock > 5 ? 'text-[#3F4C27]' : 'text-[#C17F59]'}`}>
                      {product.stock > 0 ? `${product.stock} items available in stock` : 'Out of stock'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#E8E2D8] rounded-xl bg-[#FAF7F2] p-1">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#EFE9DF] flex items-center justify-center font-bold text-[#5F584E] transition border border-[#E8E2D8]"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-[#2D2D2D]">{qty}</span>
                      <button
                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                        disabled={qty >= product.stock}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#EFE9DF] flex items-center justify-center font-bold text-[#5F584E] transition disabled:opacity-50 border border-[#E8E2D8]"
                      >
                        +
                      </button>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => onToggleWishlist(product)}
                      className={`p-3 rounded-xl border transition-all ${
                        isWishlisted
                          ? 'border-[#C17F59] bg-[#FAF0EB] text-[#C17F59]'
                          : 'border-[#E8E2D8] bg-white text-[#5F584E] hover:bg-[#FAF7F2]'
                      }`}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#C17F59]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Add to Bag Primary Action */}
                <div className="space-y-2.5">
                  <button
                    id="modal-add-to-bag-btn"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                      isAdded
                        ? 'bg-[#3F4C27] text-white'
                        : product.stock <= 0
                        ? 'bg-[#EFE9DF] text-[#A68F7A] cursor-not-allowed'
                        : 'bg-[#C17F59] hover:bg-[#A86A46] text-white hover:shadow-lg'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5 text-white" />
                        <span>Added to Shopping Bag!</span>
                      </>
                    ) : product.stock <= 0 ? (
                      <span>Currently Sold Out</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#FAF7F2]" />
                        <span>Add to Bag • {formatPrice(product.price * qty, currency)}</span>
                      </>
                    )}
                  </button>

                  {/* 1-Click Buy with Google Pay */}
                  {product.stock > 0 && onBuyNowWithGooglePay && (
                    <GooglePayButton
                      onClick={() => onBuyNowWithGooglePay(product, selectedSize, selectedColor, qty)}
                      total={product.price * qty}
                      currency={currency}
                      variant="buy"
                      className="w-full"
                    />
                  )}
                </div>

                {/* Value Markers */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#6B655B]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#8A9A5B] shrink-0" />
                    <span>Dispatched in 24-48 hrs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#8A9A5B] shrink-0" />
                    <span>100% Authentic Quality Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Tabs & Reviews */}
          <div className="mt-10 pt-8 border-t border-[#E8E2D8]">
            <div className="flex border-b border-[#E8E2D8] gap-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'details'
                    ? 'border-[#3F4C27] text-[#3F4C27]'
                    : 'border-transparent text-[#A68F7A] hover:text-[#2D2D2D]'
                }`}
              >
                Description & Cut
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'fabric'
                    ? 'border-[#3F4C27] text-[#3F4C27]'
                    : 'border-transparent text-[#A68F7A] hover:text-[#2D2D2D]'
                }`}
              >
                Fabric & Weave
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'care'
                    ? 'border-[#3F4C27] text-[#3F4C27]'
                    : 'border-transparent text-[#A68F7A] hover:text-[#2D2D2D]'
                }`}
              >
                Care Guide
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-[#3F4C27] text-[#3F4C27]'
                    : 'border-transparent text-[#A68F7A] hover:text-[#2D2D2D]'
                }`}
              >
                <span>Reviews</span>
                <span className="bg-[#FAF7F2] border border-[#E8E2D8] text-[#5F584E] text-xs px-2 py-0.5 rounded-full">
                  {reviews.length}
                </span>
              </button>
            </div>

            <div className="pt-6">
              {activeTab === 'details' && (
                <div className="space-y-4 text-sm text-[#5F584E] leading-relaxed max-w-2xl">
                  <p>{product.description}</p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.tags.map((t) => (
                        <span key={t} className="bg-[#FAF7F2] border border-[#E8E2D8] text-[#5F584E] px-3 py-1 rounded-full text-xs font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'fabric' && (
                <div className="space-y-3 text-sm text-[#5F584E] max-w-2xl">
                  <div className="bg-[#F0F4E8] p-4 rounded-xl border border-[#8A9A5B]/30">
                    <h4 className="font-bold text-[#3F4C27] mb-1">Authentic Fiber Composition</h4>
                    <p className="text-[#2D2D2D]">{product.fabric}</p>
                  </div>
                  <p className="text-xs text-[#6B655B] leading-relaxed">
                    Mehrana Wears sources authentic natural fibers and handloom yarns directly from accredited artisanal weavers to ensure breathability, longevity, and rich luster.
                  </p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-3 text-sm text-[#5F584E] max-w-2xl">
                  <p className="font-semibold text-[#2D2D2D]">{product.careInstructions || 'Dry clean recommended to preserve hand embroidery and fabric integrity.'}</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-[#6B655B]">
                    <li>Do not bleach or wring delicate silks and organza dupattas.</li>
                    <li>Always iron embroidered sections on the reverse side using low-to-medium heat.</li>
                    <li>Store in breathable cotton covers away from direct dampness.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-[#A68F7A] text-sm italic">Be the first to review this exquisite garment!</p>
                    ) : (
                      reviews.map((rev) => (
                        <div key={rev.id} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-[#3F4C27] text-white flex items-center justify-center font-bold text-xs">
                                {rev.userName.charAt(0)}
                              </span>
                              <div>
                                <span className="font-bold text-xs text-[#2D2D2D] block">{rev.userName}</span>
                                {rev.verified && (
                                  <span className="text-[10px] text-[#3F4C27] font-semibold flex items-center gap-0.5">
                                    <Check className="w-3 h-3" /> Verified Purchase
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[11px] text-[#A68F7A]">{rev.date}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[#C17F59]">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating ? 'fill-[#C17F59] text-[#C17F59]' : 'text-[#D8CFC4]'
                                }`}
                              />
                            ))}
                          </div>

                          <h5 className="font-semibold text-xs text-[#2D2D2D]">{rev.title}</h5>
                          <p className="text-xs text-[#5F584E] leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Write a Review Form */}
                  <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E2D8]">
                    <h4 className="font-bold text-sm text-[#2D2D2D] mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#8A9A5B]" />
                      <span>Write a Customer Review</span>
                    </h4>

                    {reviewSubmitted ? (
                      <div className="bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/30 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#3F4C27]" />
                        <span>Thank you! Your verified review has been submitted successfully.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#5F584E] mb-1">Your Rating</label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                className="p-1 text-[#C17F59] hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= newRating ? 'fill-[#C17F59] text-[#C17F59]' : 'text-[#D8CFC4]'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Review headline (e.g. Stunning fabric and perfect fit!)"
                            required
                            className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] outline-hidden text-[#2D2D2D] placeholder-[#A68F7A]"
                          />
                        </div>

                        <div>
                          <textarea
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Tell other shoppers about the material, sizing, comfort, and occasion..."
                            required
                            className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] outline-hidden resize-none text-[#2D2D2D] placeholder-[#A68F7A]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#3F4C27] hover:bg-[#323D1F] text-white font-semibold text-xs flex items-center gap-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Review</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

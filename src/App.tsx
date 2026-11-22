/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  HeroBanner 
} from './components/HeroBanner';
import { 
  ProductCard 
} from './components/ProductCard';
import { 
  ProductDetailModal 
} from './components/ProductDetailModal';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  WishlistDrawer 
} from './components/WishlistDrawer';
import { 
  CheckoutModal 
} from './components/CheckoutModal';
import { 
  AdminPortal 
} from './components/AdminPortal';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  CustomerAccountModal 
} from './components/CustomerAccountModal';
import { 
  SizeGuideModal 
} from './components/SizeGuideModal';
import { 
  Footer 
} from './components/Footer';

import { 
  Product, 
  ProductCategory, 
  CartItem, 
  CurrencyCode, 
  User, 
  Order, 
  Review 
} from './types';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  resetStoredProducts,
  getStoredCart, 
  saveStoredCart, 
  getStoredWishlist, 
  saveStoredWishlist, 
  getStoredUser, 
  saveStoredUser, 
  getStoredOrders, 
  saveStoredOrders, 
  getStoredReviews, 
  saveStoredReviews 
} from './utils/storage';
import { 
  auth, 
  syncUserProfile, 
  updateUserProfile, 
  logOut,
  subscribeProducts,
  saveProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  clearAllProductsInFirestore,
  seedProductsToFirestore,
  subscribeOrders,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  subscribeReviews,
  saveReviewToFirestore
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  SlidersHorizontal, 
  Sparkles, 
  Search, 
  RotateCcw, 
  Filter, 
  Check, 
  ChevronDown,
  ShoppingBag,
  PlusCircle
} from 'lucide-react';
import { PROMO_CODES } from './data/initialProducts';

export default function App() {
  // Primary Store State
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => getStoredWishlist());
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>(() => getStoredReviews());

  // Navigation & Filtering
  const [currentCategory, setCurrentCategory] = useState<ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState<number>(300);
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('MEHRANA15');

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'card' | 'cod' | 'googlepay'>('googlepay');
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [autoOpenGooglePay, setAutoOpenGooglePay] = useState(false);
  const [directCheckoutItems, setDirectCheckoutItems] = useState<CartItem[] | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);

  // Subscribe to Firebase Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userObj = await syncUserProfile(firebaseUser);
          setCurrentUser(userObj);
          if (userObj.role === 'admin') {
            setIsAdminUnlocked(true);
          }
        } catch (err) {
          console.error('Failed to sync Firebase authenticated user profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Subscriptions for Products, Orders, and Reviews across all devices
  useEffect(() => {
    let initialSyncDone = false;

    // 1. Subscribe to Live Products
    const unsubProducts = subscribeProducts((liveProducts) => {
      if (liveProducts.length > 0) {
        initialSyncDone = true;
        setProducts(liveProducts);
      } else if (!initialSyncDone) {
        initialSyncDone = true;
        // If Firestore is empty on cold start, seed catalog
        const localProds = getStoredProducts();
        if (localProds.length > 0) {
          seedProductsToFirestore(localProds);
        }
      } else {
        setProducts([]);
      }
    });

    // 2. Subscribe to Live Orders
    const unsubOrders = subscribeOrders((liveOrders) => {
      if (liveOrders.length > 0) {
        setOrders(liveOrders);
      }
    });

    // 3. Subscribe to Live Reviews
    const unsubReviews = subscribeReviews((liveReviews) => {
      if (Object.keys(liveReviews).length > 0) {
        setReviewsMap(liveReviews);
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubReviews();
    };
  }, []);

  // Sync to Local Storage on State Changes as secondary offline cache
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  useEffect(() => {
    saveStoredWishlist(wishlistIds);
  }, [wishlistIds]);

  useEffect(() => {
    saveStoredUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveStoredReviews(reviewsMap);
  }, [reviewsMap]);

  // Wishlist products
  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category match
        if (currentCategory !== 'All' && product.category !== currentCategory) {
          return false;
        }
        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchFabric = product.fabric.toLowerCase().includes(q);
          const matchTags = product.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchFabric && !matchTags) {
            return false;
          }
        }
        // Price match
        if (product.price > priceFilter) {
          return false;
        }
        // Stock match
        if (inStockOnly && product.stock <= 0) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // Default 'featured': bestsellers & featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, currentCategory, searchQuery, priceFilter, inStockOnly, sortBy]);

  // Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  const handleAddToCart = (
    product: Product,
    size: string,
    color: { name: string; hex: string },
    qty: number = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedSize === size && item.selectedColor.name === color.name
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${size}-${color.name}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image_url: product.image_url,
          selectedSize: size,
          selectedColor: color,
          qty,
          maxStock: product.stock,
          category: product.category,
        };
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (code: string): boolean => {
    const upper = code.toUpperCase();
    if (PROMO_CODES[upper]) {
      setAppliedCoupon(upper);
      return true;
    }
    return false;
  };

  const handleOrderPlaced = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Reduce product inventory accordingly
    setProducts((prev) =>
      prev.map((prod) => {
        const matchingItem = newOrder.items.find((it) => it.productId === prod.id);
        if (matchingItem) {
          const updatedProd = { ...prod, stock: Math.max(0, prod.stock - matchingItem.qty) };
          updateProductInFirestore(updatedProd).catch(console.error);
          return updatedProd;
        }
        return prod;
      })
    );
    // Clear cart
    setCart([]);
    // Save order to Firestore for real-time tracking
    await saveOrderToFirestore(newOrder);
  };

  const handleAddProduct = async (newProdData: Omit<Product, 'id' | 'createdAt' | 'sku'>) => {
    const sku = `MW-${newProdData.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newProduct: Product = {
      ...newProdData,
      id: `mw-prod-${Date.now()}`,
      sku,
      createdAt: new Date().toISOString(),
    };
    // Optimistic UI update
    setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
    // Persist to Firestore across all devices
    await saveProductToFirestore(newProduct);
  };

  const handleUpdateProduct = async (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    await updateProductInFirestore(updated);
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.productId !== id));
    setWishlistIds((prev) => prev.filter((wid) => wid !== id));
    await deleteProductFromFirestore(id);
  };

  const handleClearAllProducts = async () => {
    setProducts([]);
    setCart([]);
    setWishlistIds([]);
    saveStoredProducts([]);
    await clearAllProductsInFirestore();
  };

  const handleResetCatalog = async () => {
    const fresh = resetStoredProducts();
    setProducts(fresh);
    if (fresh.length > 0) {
      await seedProductsToFirestore(fresh);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    await updateOrderStatusInFirestore(orderId, status);
  };

  const handleAddReview = async (productId: string, rating: number, title: string, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: currentUser?.name || 'Customer',
      rating,
      date: new Date().toISOString().split('T')[0],
      title,
      comment,
      verified: true,
      helpfulCount: 0,
    };
    setReviewsMap((prev) => {
      const existing = prev[productId] || [];
      return { ...prev, [productId]: [newRev, ...existing] };
    });
    await saveReviewToFirestore(newRev);
  };

  const handleAdminUnlock = (passcode: string): boolean => {
    const validPasscodes = ['iamadmin', 'Nothing123@#@', '445566'];
    if (validPasscodes.includes(passcode.trim())) {
      setIsAdminUnlocked(true);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D2D2D] flex flex-col antialiased">
      
      {/* Top Header */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminUnlocked={isAdminUnlocked}
        currency={currency}
        onChangeCurrency={setCurrency}
        onToggleFilterDrawer={() => setShowFilterBar(!showFilterBar)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full">
        
        {/* Luxury Hero Banner (shown when browsing All or fresh entry) */}
        {!searchQuery && currentCategory === 'All' && (
          <HeroBanner onSelectCategory={(cat) => setCurrentCategory(cat)} />
        )}

        {/* Search Results & Filter Controls Bar */}
        <section className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#2D2D2D] leading-none">
                  {searchQuery ? `Search Results for "${searchQuery}"` : `${currentCategory} Collection`}
                </h2>
                <span className="text-xs font-semibold text-[#3F4C27] bg-[#F0F4E8] border border-[#8A9A5B]/30 px-2.5 py-0.5 rounded-full">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Garment' : 'Garments'}
                </span>
              </div>
              <p className="text-xs text-[#6B655B] mt-1">
                Artisan-crafted raw silks, breathable linens, embroidered festives, and daily pret wear.
              </p>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none">
                <span className="text-xs text-[#5F584E] font-medium shrink-0">Sort:</span>
                <select
                  id="catalog-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto bg-white border border-[#E8E2D8] text-xs font-semibold rounded-xl px-2.5 sm:px-3 py-2 text-[#2D2D2D] focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] outline-hidden cursor-pointer shadow-2xs"
                >
                  <option value="featured">Featured & Best Sellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* In Stock Toggle */}
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                  inStockOnly
                    ? 'bg-[#3F4C27] text-white border-[#3F4C27] shadow-2xs'
                    : 'bg-white text-[#5F584E] border-[#E8E2D8] hover:bg-[#F5F0E8]'
                }`}
              >
                In Stock Only
              </button>

              {/* Filter Bar Toggle */}
              <button
                onClick={() => setShowFilterBar(!showFilterBar)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                  showFilterBar
                    ? 'bg-[#F0F4E8] text-[#3F4C27] border-[#8A9A5B]'
                    : 'bg-white text-[#5F584E] border-[#E8E2D8] hover:bg-[#F5F0E8]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A9A5B]" />
                <span>Price & Range</span>
              </button>

              {/* Reset filter button if modified */}
              {(currentCategory !== 'All' || searchQuery || inStockOnly || priceFilter < 300) && (
                <button
                  onClick={() => {
                    setCurrentCategory('All');
                    setSearchQuery('');
                    setInStockOnly(false);
                    setPriceFilter(300);
                  }}
                  className="p-2 text-[#A68F7A] hover:text-[#C17F59] hover:bg-[#FAF0EB] rounded-xl transition"
                  title="Reset All Filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filter Slider Panel */}
          {showFilterBar && (
            <div className="mt-3 p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D8] shadow-xs animate-in fade-in duration-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#2D2D2D] mb-1.5">
                  <span>Maximum Price Range:</span>
                  <span className="font-bold text-[#3F4C27]">${priceFilter}</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={300}
                  step={10}
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#3F4C27] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-[#3F4C27] hover:text-[#2D351E] font-semibold underline underline-offset-2"
                >
                  Open Size & Measurement Chart →
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Product Cards Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          {products.length === 0 ? (
            <div className="bg-[#FAF7F2] rounded-3xl p-12 text-center border border-[#E8E2D8] shadow-xs space-y-4 max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-[#EFE9DF] text-[#8A9A5B] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#2D2D2D]">Catalog is Empty</h3>
              <p className="text-xs text-[#6B655B] leading-relaxed max-w-sm mx-auto">
                All pre-uploaded dresses and clothes have been removed. You can upload new garments, silk kurtas, and custom pret collections anytime using the Admin Portal.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="empty-state-open-admin-btn"
                  onClick={() => setIsAdminOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#354024] hover:bg-[#28321B] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-[#8A9A5B]" />
                  <span>Upload New Clothes in Admin Portal</span>
                </button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-[#FAF7F2] rounded-3xl p-12 text-center border border-[#E8E2D8] shadow-xs space-y-4 max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-[#EFE9DF] text-[#8A9A5B] flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#2D2D2D]">No matching garments found</h3>
              <p className="text-xs text-[#6B655B] leading-relaxed">
                We couldn't find any clothing matching your current search or price filters. Try resetting the filters or exploring our other collections.
              </p>
              <button
                onClick={() => {
                  setCurrentCategory('All');
                  setSearchQuery('');
                  setInStockOnly(false);
                  setPriceFilter(300);
                }}
                className="px-6 py-3 rounded-xl bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs shadow-md transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={(p) => setSelectedProduct(p)}
                  onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          currency={currency}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onBuyNowWithGooglePay={(p, size, color, quantity) => {
            const directItem: CartItem = {
              id: `${p.id}-${size}-${color.name}-${Date.now()}`,
              productId: p.id,
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice,
              image_url: p.image_url,
              selectedSize: size,
              selectedColor: color,
              qty: quantity,
              maxStock: p.stock,
              category: p.category,
            };
            handleAddToCart(p, size, color, quantity);
            setDirectCheckoutItems([directItem]);
            setSelectedProduct(null);
            setCheckoutPaymentMethod('googlepay');
            setCheckoutStep(3);
            setAutoOpenGooglePay(true);
            setIsCheckoutOpen(true);
          }}
          onClose={() => setSelectedProduct(null)}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          reviews={reviewsMap[selectedProduct.id] || []}
          onAddReview={handleAddReview}
          currentUser={currentUser}
        />
      )}

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        currency={currency}
        onProceedToCheckout={() => {
          setDirectCheckoutItems(null);
          setCheckoutPaymentMethod('googlepay');
          setCheckoutStep(1);
          setAutoOpenGooglePay(false);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onGooglePayCheckout={() => {
          setDirectCheckoutItems(null);
          setCheckoutPaymentMethod('googlepay');
          setCheckoutStep(3);
          setAutoOpenGooglePay(true);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={() => setAppliedCoupon(null)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveWishlist={handleToggleWishlist}
        onMoveToCart={(p) => {
          handleAddToCart(p, p.sizes[0] || 'M', p.colors[0] || { name: 'Standard', hex: '#000' }, 1);
        }}
        currency={currency}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setAutoOpenGooglePay(false);
          setDirectCheckoutItems(null);
        }}
        cart={cart}
        directItems={directCheckoutItems || undefined}
        autoOpenGooglePaySheet={autoOpenGooglePay}
        currency={currency}
        currentUser={currentUser}
        appliedCoupon={appliedCoupon}
        initialPaymentMethod={checkoutPaymentMethod}
        initialStep={checkoutStep}
        onOrderPlaced={(order) => {
          handleOrderPlaced(order);
          setDirectCheckoutItems(null);
          setAutoOpenGooglePay(false);
        }}
      />

      {/* Admin Portal Modal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onClearAllProducts={handleClearAllProducts}
        onResetCatalog={handleResetCatalog}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        currency={currency}
        isAdminUnlocked={isAdminUnlocked}
        onUnlockAdmin={handleAdminUnlock}
        onLockAdmin={() => setIsAdminUnlocked(false)}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(user) => {
          setCurrentUser(user);
          if (user.role === 'admin') {
            setIsAdminUnlocked(true);
          }
        }}
      />

      {/* Customer Account & Order History Modal */}
      {currentUser && (
        <CustomerAccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          user={currentUser}
          orders={orders}
          onLogout={async () => {
            await logOut();
            setCurrentUser(null);
            setIsAdminUnlocked(false);
          }}
          currency={currency}
          onUpdateUser={async (updated) => {
            setCurrentUser(updated);
            if (updated.id) {
              await updateUserProfile(updated.id, updated);
            }
          }}
        />
      )}

      {/* Size Guide Chart Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}

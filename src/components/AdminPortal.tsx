import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  PlusCircle, 
  Package, 
  ShoppingBag, 
  Trash2, 
  Edit3, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Check, 
  RotateCcw,
  Search,
  Truck,
  Image as ImageIcon
} from 'lucide-react';
import { Product, ProductCategory, Order, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'sku'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetCatalog: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  currency: CurrencyCode;
  isAdminUnlocked: boolean;
  onUnlockAdmin: (passcode: string) => boolean;
  onLockAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetCatalog,
  onUpdateOrderStatus,
  currency,
  isAdminUnlocked,
  onUnlockAdmin,
  onLockAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'catalog' | 'orders'>('upload');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Upload Product Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Women');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [secondaryImageUrl, setSecondaryImageUrl] = useState('');
  const [fabric, setFabric] = useState('');
  const [care, setCare] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('15');
  const [sizes, setSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'XL']);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Emerald', hex: '#064e3b' },
    { name: 'Ivory', hex: '#fdfbf7' },
  ]);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [catalogSearch, setCatalogSearch] = useState('');

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    const success = onUnlockAdmin(passcodeInput.trim());
    if (success) {
      setPasscodeInput('');
    } else {
      setPasscodeError('Invalid admin passcode. (Default: admin123)');
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !imageUrl) return;

    onAddProduct({
      name: title.trim(),
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      image_url: imageUrl.trim(),
      additional_images: secondaryImageUrl.trim() ? [secondaryImageUrl.trim()] : undefined,
      fabric: fabric.trim() || '100% Pure Luxury Handloom Fabric',
      careInstructions: care.trim() || 'Dry clean recommended.',
      description: description.trim() || 'Exquisite handcrafted apparel by Mehrana Wears.',
      stock: parseInt(stock, 10) || 10,
      sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L'],
      colors: colors.length > 0 ? colors : [{ name: 'Default', hex: '#064e3b' }],
      rating: 5.0,
      reviewCount: 1,
      isNew: true,
      isFeatured: true,
    });

    // Reset Form
    setTitle('');
    setPrice('');
    setOriginalPrice('');
    setImageUrl('');
    setSecondaryImageUrl('');
    setFabric('');
    setCare('');
    setDescription('');
    setStock('15');
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FDFBF7] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-[#E8E2D8] my-6 flex flex-col max-h-[94vh] text-[#2D2D2D]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header */}
        <div className="p-5 bg-[#3F4C27] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8A9A5B] text-white flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-white leading-none">Mehrana Admin Center</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isAdminUnlocked ? 'bg-[#8A9A5B] text-white' : 'bg-[#C17F59] text-white'
                }`}>
                  {isAdminUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <p className="text-xs text-[#FAF7F2]/80 mt-1">Catalog management, inventory control, and customer orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminUnlocked && (
              <button
                onClick={onLockAdmin}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-[#C17F59] text-white text-xs font-semibold flex items-center gap-1.5 transition"
                title="Lock Admin Session"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Session</span>
              </button>
            )}

            <button
              id="close-admin-portal-modal-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LOCKED STATE VIEW */}
        {!isAdminUnlocked ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-[#FAF0EB] text-[#C17F59] flex items-center justify-center mx-auto shadow-inner border border-[#C17F59]/20">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-serif font-bold text-2xl text-[#2D2D2D]">Admin Authentication Required</h4>
              <p className="text-xs text-[#A68F7A] mt-1.5 leading-relaxed">
                Enter your administrative security password to upload products, update live stock, and fulfill orders.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter admin password (default: admin123)"
                  className="w-full bg-white border border-[#E8E2D8] text-sm p-3.5 rounded-2xl text-center focus:bg-white focus:border-[#8A9A5B] outline-hidden font-mono text-[#2D2D2D]"
                  required
                />
              </div>

              {passcodeError && (
                <div className="text-xs font-semibold text-[#C17F59] flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{passcodeError}</span>
                </div>
              )}

              <button
                id="unlock-admin-passcode-btn"
                type="submit"
                className="w-full py-3.5 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4 text-[#FAF7F2]" />
                <span>Unlock Store Management</span>
              </button>
            </form>

            <div className="bg-[#FAF7F2] p-3 rounded-xl text-[11px] text-[#A68F7A] border border-[#E8E2D8]">
              💡 Store Owner Note: Default password is <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-[#2D2D2D] border border-[#E8E2D8]">admin123</code>
            </div>
          </div>
        ) : (
          /* UNLOCKED STATE VIEW */
          <div className="flex-1 overflow-y-auto flex flex-col">
            
            {/* Top Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-[#FAF7F2] border-b border-[#E8E2D8]">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
                <span className="text-[11px] text-[#A68F7A] font-medium block">Total Products</span>
                <span className="text-xl font-serif font-bold text-[#2D2D2D]">{products.length} Items</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
                <span className="text-[11px] text-[#A68F7A] font-medium block">Customer Orders</span>
                <span className="text-xl font-serif font-bold text-[#2D2D2D]">{orders.length} Orders</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
                <span className="text-[11px] text-[#A68F7A] font-medium block">Gross Revenue</span>
                <span className="text-xl font-serif font-bold text-[#3F4C27]">{formatPrice(totalRevenue, currency)}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E2D8] shadow-2xs">
                <span className="text-[11px] text-[#A68F7A] font-medium block">Low Stock Alerts</span>
                <span className={`text-xl font-serif font-bold ${lowStockProducts.length > 0 ? 'text-[#C17F59]' : 'text-[#2D2D2D]'}`}>
                  {lowStockProducts.length} Items
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#E8E2D8] px-5 bg-white">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                  activeTab === 'upload'
                    ? 'border-[#3F4C27] text-[#3F4C27] bg-[#F0F4E8]/50'
                    : 'border-transparent text-[#A68F7A] hover:text-[#2D2D2D]'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload New Product</span>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                  activeTab === 'catalog'
                    ? 'border-[#3F4C27] text-[#3F4C27] bg-[#F0F4E8]/50'
                    : 'border-transparent text-[#A68F7A] hover:text-[#2D2D2D]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Manage Catalog ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
                  activeTab === 'orders'
                    ? 'border-[#3F4C27] text-[#3F4C27] bg-[#F0F4E8]/50'
                    : 'border-transparent text-[#A68F7A] hover:text-[#2D2D2D]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-6 flex-1 overflow-y-auto">
              
              {/* TAB 1: UPLOAD PRODUCT */}
              {activeTab === 'upload' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {isSuccessToast && (
                    <div className="bg-[#F0F4E8] border border-[#8A9A5B]/30 text-[#3F4C27] p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
                      <Check className="w-5 h-5 text-[#3F4C27] shrink-0" />
                      <span>Product published and live in catalog instantly!</span>
                    </div>
                  )}

                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5F584E] mb-1">Product Title *</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., Raw Silk Hand-Embroidered Kurta"
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5F584E] mb-1">Category *</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as ProductCategory)}
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        >
                          <option value="Women">Women</option>
                          <option value="Men">Men</option>
                          <option value="Modest">Modest & Abayas</option>
                          <option value="Kids">Kids Festive</option>
                          <option value="Festive">Festive & Bridal</option>
                          <option value="Accessories">Shawls & Accessories</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5F584E] mb-1">Sale Price ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="89.99"
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5F584E] mb-1">Original Price ($) (Optional)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          placeholder="119.99"
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5F584E] mb-1">Stock Quantity *</label>
                        <input
                          type="number"
                          required
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          placeholder="15"
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5F584E] mb-1">Primary Image URL *</label>
                        <input
                          type="url"
                          required
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5F584E] mb-1">Secondary Image URL (Optional)</label>
                        <input
                          type="url"
                          value={secondaryImageUrl}
                          onChange={(e) => setSecondaryImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        />
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    {imageUrl && (
                      <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8]">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-14 h-16 object-cover rounded-lg bg-[#FAF7F2]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[#2D2D2D] block">Image Preview</span>
                          <span className="text-[#A68F7A] truncate max-w-xs block">{imageUrl}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5F584E] mb-1">Fabric & Material *</label>
                        <input
                          type="text"
                          value={fabric}
                          onChange={(e) => setFabric(e.target.value)}
                          placeholder="e.g. 100% Pure Raw Silk with Organza Dupatta"
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5F584E] mb-1">Care Guide</label>
                        <input
                          type="text"
                          value={care}
                          onChange={(e) => setCare(e.target.value)}
                          placeholder="Dry clean only. Gentle steam iron."
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5F584E] mb-1">Product Description</label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail the hand embroidery, cuts, neckline styling, and occasion suitability..."
                        className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden resize-none text-[#2D2D2D]"
                      />
                    </div>

                    <button
                      id="admin-publish-product-btn"
                      type="submit"
                      className="w-full py-4 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4 text-[#FAF7F2]" />
                      <span>Publish Garment to Live Catalog</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: MANAGE CATALOG */}
              {activeTab === 'catalog' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-[#A68F7A] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        placeholder="Search SKU, name, category..."
                        className="w-full bg-white border border-[#E8E2D8] text-xs pl-9 pr-4 py-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to reset the catalog back to default sample items?')) {
                          onResetCatalog();
                        }
                      }}
                      className="px-4 py-2 border border-[#E8E2D8] hover:bg-[#FAF7F2] text-[#5F584E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Default Catalog</span>
                    </button>
                  </div>

                  {/* Catalog Table */}
                  <div className="border border-[#E8E2D8] rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] text-[#5F584E] font-semibold border-b border-[#E8E2D8]">
                        <tr>
                          <th className="p-3">Garment</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E2D8]">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-[#FAF7F2] transition">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image_url}
                                  alt={p.name}
                                  className="w-10 h-12 object-cover rounded-lg bg-[#FAF7F2]"
                                />
                                <div>
                                  <span className="font-bold text-[#2D2D2D] block truncate max-w-xs">{p.name}</span>
                                  <span className="text-[10px] text-[#A68F7A] font-mono">SKU: {p.sku}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/30 font-semibold px-2 py-0.5 rounded text-[10px]">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-3 font-serif font-bold text-[#2D2D2D]">
                              {formatPrice(p.price, currency)}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onUpdateProduct({ ...p, stock: Math.max(0, p.stock - 1) })}
                                  className="w-5 h-5 rounded bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E8E2D8] flex items-center justify-center font-bold text-[#2D2D2D]"
                                >
                                  -
                                </button>
                                <span className={`font-bold w-6 text-center ${p.stock <= 3 ? 'text-[#C17F59]' : 'text-[#2D2D2D]'}`}>
                                  {p.stock}
                                </span>
                                <button
                                  onClick={() => onUpdateProduct({ ...p, stock: p.stock + 1 })}
                                  className="w-5 h-5 rounded bg-[#FAF7F2] hover:bg-[#EFE9DF] border border-[#E8E2D8] flex items-center justify-center font-bold text-[#2D2D2D]"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 text-[#5F584E] hover:text-[#3F4C27] hover:bg-[#F0F4E8] rounded-lg transition"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${p.name}" from catalog?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-[#5F584E] hover:text-[#C17F59] hover:bg-[#FAF0EB] rounded-lg transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-[#A68F7A] space-y-2">
                      <ShoppingBag className="w-12 h-12 mx-auto stroke-[1.5]" />
                      <p className="text-sm font-semibold text-[#2D2D2D]">No orders placed yet</p>
                      <p className="text-xs">Customer checkouts will appear live here.</p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div key={ord.id} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E2D8]">
                          <div>
                            <span className="font-mono font-bold text-[#2D2D2D] text-sm">{ord.orderNumber}</span>
                            <span className="text-xs text-[#A68F7A] ml-2">Placed: {ord.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#5F584E] font-medium">Status:</span>
                            <select
                              value={ord.status}
                              onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                              className="bg-white border border-[#E8E2D8] rounded-lg px-2 py-1 text-xs font-semibold focus:border-[#8A9A5B] text-[#2D2D2D]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[#A68F7A] block text-[10px] uppercase">Customer & Delivery</span>
                            <p className="font-semibold text-[#2D2D2D]">{ord.shippingAddress.fullName}</p>
                            <p className="text-[#5F584E]">{ord.shippingAddress.address}, {ord.shippingAddress.city}, {ord.shippingAddress.country}</p>
                            <p className="text-[#A68F7A] text-[11px]">{ord.shippingAddress.email} • {ord.shippingAddress.phone}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-[#A68F7A] block text-[10px] uppercase">Total Order Value</span>
                            <span className="font-serif font-bold text-base text-[#3F4C27]">{formatPrice(ord.total, currency)}</span>
                            <p className="text-[#A68F7A] text-[11px] mt-0.5">Tracking: {ord.trackingNumber}</p>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="pt-2 border-t border-[#E8E2D8] flex flex-wrap gap-2">
                          {ord.items.map((item, idx) => (
                            <span key={idx} className="bg-white border border-[#E8E2D8] px-2.5 py-1 rounded-lg text-xs text-[#5F584E]">
                              {item.name} ({item.selectedSize}) × {item.qty}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Modal Popup */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FDFBF7] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E8E2D8] space-y-4 text-[#2D2D2D]">
              <div className="flex justify-between items-center">
                <h4 className="font-serif font-bold text-lg text-[#2D2D2D]">Edit Product</h4>
                <button onClick={() => setEditingProduct(null)} className="text-[#5F584E] hover:text-[#2D2D2D]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5F584E] mb-1">Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5F584E] mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.image_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                />
              </div>

              <button
                onClick={() => {
                  onUpdateProduct(editingProduct);
                  setEditingProduct(null);
                }}
                className="w-full py-3 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

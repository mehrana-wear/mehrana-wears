import React, { useState, useRef } from 'react';
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
  Image as ImageIcon,
  Upload,
  Cloud,
  Palette,
  Plus,
  Ruler,
  Clock,
  CheckCircle,
  Filter,
  DollarSign,
  Wallet,
  CreditCard,
  Landmark,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  Save,
  Send,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Product, ProductCategory, Order, CurrencyCode, MerchantPayoutSettings } from '../types';
import { formatPrice } from '../utils/currency';
import { fileToOptimizedDataUrl } from '../utils/imageUpload';
import { GoogleGLogo } from './GooglePaySheet';
import { getStoredMerchantSettings, saveStoredMerchantSettings } from '../utils/storage';
import { saveOrderToFirestore } from '../lib/firebase';

// Curated luxury apparel shades for fast 1-click addition
const PRESET_APPAREL_COLORS = [
  { name: 'Emerald Green', hex: '#064e3b' },
  { name: 'Deep Maroon', hex: '#722f37' },
  { name: 'Royal Navy', hex: '#1b2a4a' },
  { name: 'Champagne Gold', hex: '#d4af37' },
  { name: 'Ivory Pearl', hex: '#fdfbf7' },
  { name: 'Rust Terracotta', hex: '#c17f59' },
  { name: 'Sage Green', hex: '#8a9a5b' },
  { name: 'Jet Black', hex: '#1c1c1c' },
  { name: 'Mustard Gold', hex: '#d99b26' },
  { name: 'Blush Pink', hex: '#e8c5c8' },
  { name: 'Plum Purple', hex: '#4a154b' },
  { name: 'Powder Blue', hex: '#93c5fd' },
  { name: 'Crimson Red', hex: '#b91c1c' },
  { name: 'Warm Beige', hex: '#d8cfc4' },
];

interface ColorPaletteManagerProps {
  colors: { name: string; hex: string }[];
  onChange: (colors: { name: string; hex: string }[]) => void;
  title?: string;
  description?: string;
}

const ColorPaletteManager: React.FC<ColorPaletteManagerProps> = ({
  colors,
  onChange,
  title = 'Available Colors for Shoppers',
  description = 'Customers will choose between these exact colors on the website.',
}) => {
  const [customName, setCustomName] = useState('');
  const [customHex, setCustomHex] = useState('#064e3b');

  const handleAddPreset = (preset: { name: string; hex: string }) => {
    if (colors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) {
      return;
    }
    onChange([...colors, preset]);
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customName.trim();
    if (!trimmed) return;
    if (colors.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setCustomName('');
      return;
    }
    onChange([...colors, { name: trimmed, hex: customHex }]);
    setCustomName('');
  };

  const handleRemoveColor = (nameToRemove: string) => {
    onChange(colors.filter((c) => c.name !== nameToRemove));
  };

  return (
    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] space-y-3.5">
      <div>
        <label className="block text-xs font-bold text-[#2D2D2D] flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-[#3F4C27]" />
          <span>{title}</span>
          <span className="text-[10px] font-normal text-[#A68F7A]">({colors.length} selected)</span>
        </label>
        <p className="text-[11px] text-[#A68F7A] mt-0.5">{description}</p>
      </div>

      {/* Currently Selected Colors */}
      <div>
        <div className="text-[10px] font-bold text-[#5F584E] uppercase tracking-wider mb-1.5">
          Active Colors on this Dress
        </div>
        {colors.length === 0 ? (
          <div className="p-3 bg-white rounded-xl border border-dashed border-[#C17F59] text-xs text-[#C17F59] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>No colors active. Please select preset shades below or enter a custom color so customers can buy this item.</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <div
                key={c.name}
                className="group flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E8E2D8] rounded-xl text-xs font-semibold text-[#2D2D2D] shadow-2xs hover:border-[#8A9A5B] transition"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
                <span className="text-[10px] font-mono text-[#A68F7A]">{c.hex}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(c.name)}
                  className="ml-1 text-[#A68F7A] hover:text-[#C17F59] transition p-0.5"
                  title={`Remove ${c.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add from Preset Apparel Colors */}
      <div>
        <div className="text-[10px] font-bold text-[#5F584E] uppercase tracking-wider mb-1.5">
          1-Click Popular Apparel Shades
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_APPAREL_COLORS.map((preset) => {
            const isSelected = colors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase());
            return (
              <button
                type="button"
                key={preset.name}
                onClick={() => handleAddPreset(preset)}
                disabled={isSelected}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition border ${
                  isSelected
                    ? 'bg-[#EFE9DF]/60 text-[#A68F7A] border-transparent opacity-50 cursor-not-allowed'
                    : 'bg-white text-[#5F584E] border-[#E8E2D8] hover:border-[#3F4C27] hover:text-[#3F4C27]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: preset.hex }}
                />
                <span className="text-[11px] font-medium">{preset.name}</span>
                {isSelected ? <Check className="w-3 h-3 text-[#3F4C27]" /> : <Plus className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Custom Color */}
      <div className="pt-2 border-t border-[#E8E2D8]/80">
        <div className="text-[10px] font-bold text-[#5F584E] uppercase tracking-wider mb-1.5">
          Or Add Custom Color Shade
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-[#E8E2D8] rounded-xl px-2 py-1 flex-1">
            <input
              type="color"
              value={customHex}
              onChange={(e) => setCustomHex(e.target.value)}
              className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
              title="Pick Hex Color"
            />
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
              placeholder="Color name (e.g. Peacock Blue, Antique Copper, Lilac)"
              className="w-full text-xs text-[#2D2D2D] outline-hidden bg-transparent"
            />
            <span className="text-[10px] font-mono text-[#A68F7A] uppercase pr-1">{customHex}</span>
          </div>

          <button
            type="button"
            onClick={() => handleAddCustom()}
            className="px-3.5 py-2 bg-[#3F4C27] hover:bg-[#323D1F] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Color</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Size presets categorized for rapid 1-click addition
const CLOTH_SIZE_PRESET_GROUPS = [
  { label: 'Standard Pret Sizes', sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] },
  { label: 'Ethnic & Modest Cuts', sizes: ['Unstitched', 'Free Size', 'One Size', 'Custom Fit', 'Semi-Stitched'] },
  { label: 'Numeric (Chest / Waist)', sizes: ['36', '38', '40', '42', '44', '46'] },
  { label: 'Kids Festive Sizes', sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y'] },
];

interface ClothSizeManagerProps {
  sizes: string[];
  onChange: (sizes: string[]) => void;
  title?: string;
  description?: string;
}

const ClothSizeManager: React.FC<ClothSizeManagerProps> = ({
  sizes,
  onChange,
  title = 'Available Cloth Sizes for Shoppers',
  description = 'Add all sizes in stock for this garment. Shoppers will select from these sizes when adding to bag or ordering.',
}) => {
  const [customSize, setCustomSize] = useState('');

  const handleTogglePreset = (sz: string) => {
    if (sizes.includes(sz)) {
      onChange(sizes.filter((s) => s !== sz));
    } else {
      onChange([...sizes, sz]);
    }
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSize.trim();
    if (!trimmed) return;
    if (sizes.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setCustomSize('');
      return;
    }
    onChange([...sizes, trimmed]);
    setCustomSize('');
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    onChange(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleAddAllGroup = (groupSizes: string[]) => {
    const toAdd = groupSizes.filter((sz) => !sizes.includes(sz));
    onChange([...sizes, ...toAdd]);
  };

  const handleClearAllSizes = () => {
    onChange([]);
  };

  return (
    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <label className="text-xs font-bold text-[#2D2D2D] flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-[#3F4C27]" />
            <span>{title}</span>
            <span className="text-[10px] font-normal text-[#A68F7A]">({sizes.length} selected)</span>
          </label>
          <p className="text-[11px] text-[#A68F7A] mt-0.5">{description}</p>
        </div>

        {sizes.length > 0 && (
          <button
            type="button"
            onClick={handleClearAllSizes}
            className="text-[11px] text-[#C17F59] hover:underline self-start sm:self-auto font-medium"
          >
            Clear all sizes
          </button>
        )}
      </div>

      {/* Active Sizes Pill Display */}
      <div>
        <div className="text-[10px] font-bold text-[#5F584E] uppercase tracking-wider mb-1.5">
          Active Sizes on this Garment
        </div>
        {sizes.length === 0 ? (
          <div className="p-3 bg-white rounded-xl border border-dashed border-[#C17F59] text-xs text-[#C17F59] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>No sizes selected. Click preset sizes below or type a custom cloth size so customers can purchase this item.</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sizes.map((sz) => (
              <div
                key={sz}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-[#3F4C27] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-[#323D1F] transition"
              >
                <span>{sz}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(sz)}
                  className="text-white/80 hover:text-white transition p-0.5"
                  title={`Remove size ${sz}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset Categories for 1-Click Addition */}
      <div className="space-y-2.5 pt-1 border-t border-[#E8E2D8]/80">
        <div className="text-[10px] font-bold text-[#5F584E] uppercase tracking-wider">
          1-Click Apparel Size Presets (Click to add or remove)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CLOTH_SIZE_PRESET_GROUPS.map((group) => (
            <div key={group.label} className="bg-white p-2.5 rounded-xl border border-[#E8E2D8] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-[#2D2D2D]">{group.label}</span>
                <button
                  type="button"
                  onClick={() => handleAddAllGroup(group.sizes)}
                  className="text-[10px] text-[#3F4C27] hover:underline font-semibold"
                >
                  + Add all
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.sizes.map((presetSize) => {
                  const isSelected = sizes.includes(presetSize);
                  return (
                    <button
                      type="button"
                      key={presetSize}
                      onClick={() => handleTogglePreset(presetSize)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold transition border flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#F0F4E8] text-[#3F4C27] border-[#8A9A5B] shadow-2xs'
                          : 'bg-[#FAF7F2] text-[#5F584E] border-[#E8E2D8] hover:bg-white hover:border-[#3F4C27] hover:text-[#3F4C27]'
                      }`}
                    >
                      <span>{presetSize}</span>
                      {isSelected ? <Check className="w-3 h-3 text-[#3F4C27]" /> : <Plus className="w-3 h-3 text-[#A68F7A]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Cloth Size */}
      <div className="pt-2 border-t border-[#E8E2D8]/80">
        <div className="text-[10px] font-bold text-[#5F584E] uppercase tracking-wider mb-1.5">
          Or Add Custom Cloth Size / Fit
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            placeholder="Type custom cloth size (e.g. 48 Chest, Petite, Semi-Stitched, 14-15Y, Plus)..."
            className="flex-1 bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D] placeholder-[#A68F7A]"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customSize.trim()}
            className="px-4 py-2 bg-[#3F4C27] hover:bg-[#323D1F] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Size</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'sku'>) => Promise<void> | void;
  onUpdateProduct: (product: Product) => Promise<void> | void;
  onDeleteProduct: (id: string) => Promise<void> | void;
  onClearAllProducts?: () => Promise<void> | void;
  onResetCatalog: () => Promise<void> | void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void> | void;
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
  onClearAllProducts,
  onResetCatalog,
  onUpdateOrderStatus,
  currency,
  isAdminUnlocked,
  onUnlockAdmin,
  onLockAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'catalog' | 'orders' | 'payouts'>('upload');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Payouts & Merchant Receiving Settings State
  const [merchantSettings, setMerchantSettings] = useState<MerchantPayoutSettings>(getStoredMerchantSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);
  
  // Withdrawal Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmountInput, setWithdrawAmountInput] = useState('');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [withdrawToast, setWithdrawToast] = useState<string | null>(null);

  // Test Simulation State
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [testPaymentToast, setTestPaymentToast] = useState<string | null>(null);

  // Upload Product Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Women');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);
  const [secondaryUrlInput, setSecondaryUrlInput] = useState('');
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
  const [toastMessage, setToastMessage] = useState('Garment published to live catalog!');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [catalogSearch, setCatalogSearch] = useState('');

  // Delete Item Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Orders Management Filtering & Sorting (Processing First)
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'Processing' | 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'>('all');
  const [orderSearch, setOrderSearch] = useState('');

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    const success = onUnlockAdmin(passcodeInput.trim());
    if (success) {
      setPasscodeInput('');
    } else {
      setPasscodeError('Invalid admin passcode. Access denied.');
    }
  };

  const handleSaveEditProduct = async () => {
    if (!editingProduct) return;
    try {
      await onUpdateProduct({
        ...editingProduct,
        sizes: editingProduct.sizes && editingProduct.sizes.length > 0 
          ? editingProduct.sizes 
          : ['XS', 'S', 'M', 'L', 'XL'],
        colors: editingProduct.colors && editingProduct.colors.length > 0 
          ? editingProduct.colors 
          : [{ name: 'Emerald Green', hex: '#064e3b' }],
      });
      setToastMessage(`"${editingProduct.name}" updated successfully!`);
      setIsSuccessToast(true);
      setTimeout(() => setIsSuccessToast(false), 4000);
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Failed to update product:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(productToDelete.id);
      setToastMessage(`"${productToDelete.name}" was permanently deleted from the store.`);
      setIsSuccessToast(true);
      setTimeout(() => setIsSuccessToast(false), 4000);
      setProductToDelete(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !imageUrl) return;

    setIsPublishing(true);
    setPublishError(null);

    try {
      await onAddProduct({
        name: title.trim(),
        category,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        image_url: imageUrl.trim(),
        additional_images: secondaryImages.length > 0 ? secondaryImages : undefined,
        fabric: fabric.trim() || '100% Pure Luxury Handloom Fabric',
        careInstructions: care.trim() || 'Dry clean recommended.',
        description: description.trim() || 'Exquisite handcrafted apparel by Mehrana Wears.',
        stock: parseInt(stock, 10) || 10,
        sizes: sizes.length > 0 ? sizes : ['XS', 'S', 'M', 'L', 'XL'],
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
      setSecondaryImages([]);
      setSecondaryUrlInput('');
      setFabric('');
      setCare('');
      setDescription('');
      setStock('15');
      setSizes(['XS', 'S', 'M', 'L', 'XL']);
      setColors([
        { name: 'Emerald', hex: '#064e3b' },
        { name: 'Ivory', hex: '#fdfbf7' },
      ]);
      setIsSuccessToast(true);
      setTimeout(() => setIsSuccessToast(false), 4000);
    } catch (err: any) {
      console.error('Failed to upload garment to Firestore:', err);
      setPublishError(err.message || 'Failed to sync dress to cloud database. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const googlePayOrders = orders.filter((o) => o.paymentMethod === 'googlepay');
  const googlePaySettledTotal = googlePayOrders.reduce((sum, o) => sum + o.total, 0);
  const availableBalance = Math.max(0, googlePaySettledTotal - (merchantSettings.totalWithdrawn || 0));
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const handleSaveMerchantSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    saveStoredMerchantSettings(merchantSettings);
    setTimeout(() => {
      setIsSavingSettings(false);
      setSettingsSaveSuccess(true);
      setTimeout(() => setSettingsSaveSuccess(false), 4000);
    }, 400);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmountInput);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > availableBalance) return;

    setIsProcessingWithdraw(true);
    setTimeout(() => {
      const updatedTotal = (merchantSettings.totalWithdrawn || 0) + amount;
      const updatedSettings = { ...merchantSettings, totalWithdrawn: updatedTotal };
      setMerchantSettings(updatedSettings);
      saveStoredMerchantSettings(updatedSettings);
      setIsProcessingWithdraw(false);
      setIsWithdrawModalOpen(false);
      setWithdrawAmountInput('');
      setWithdrawToast(`Direct transfer of ${formatPrice(amount, currency)} to Faruk Karim (${merchantSettings.bankName}) initiated successfully! Funds will reflect in account ending in ${merchantSettings.accountNumber.slice(-4)}.`);
      setTimeout(() => setWithdrawToast(null), 6000);
    }, 700);
  };

  const handleSimulateCustomerPayment = async () => {
    setIsSimulatingPayment(true);
    try {
      const orderNumber = `MW-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const sampleItem = products[0] || {
        id: 'sample-garment',
        name: 'Zari Chiffon Embroidered Anarkali',
        price: 145,
        category: 'Festive',
        image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        stock: 12,
        isNew: true,
        isBestSeller: true,
        colors: [{ name: 'Emerald', hex: '#064e3b' }],
        sizes: ['M', 'L'],
        rating: 5,
        reviewCount: 14,
        sku: 'MW-FES-101',
      };

      const testOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: new Date().toISOString().split('T')[0],
        items: [{
          productId: sampleItem.id,
          name: sampleItem.name,
          price: sampleItem.price,
          image_url: sampleItem.image_url,
          selectedSize: sampleItem.sizes?.[0] || 'M',
          selectedColor: sampleItem.colors?.[0]?.name || 'Emerald',
          qty: 1,
        }],
        shippingAddress: {
          fullName: 'Amina Tariq',
          email: 'amina.tariq@gmail.com',
          phone: '+1 (555) 789-0123',
          address: '450 Sutter St, Suite 800',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94108',
          country: 'United States',
        },
        deliveryMethod: 'standard',
        paymentMethod: 'googlepay',
        subtotal: sampleItem.price,
        discount: 0,
        shippingFee: 0,
        tax: sampleItem.price * 0.05,
        total: sampleItem.price * 1.05,
        status: 'Processing',
        trackingNumber,
        estimatedDelivery: '3 days',
        paymentDetails: {
          transactionId: `GPA.${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10000 + Math.random() * 90000)}`,
          recipientEmail: 'farukarim@gmail.com',
          recipientMerchantName: 'Mehrana Wears (Faruk Karim)',
          settlementStatus: 'Received & Settled',
          cardBrand: 'Mastercard',
          cardLast4: '3190',
          paidAt: new Date().toISOString(),
          payoutDestination: `${merchantSettings.bankName} (${merchantSettings.accountNumber}) via farukarim@gmail.com`,
        },
      };

      await saveOrderToFirestore(testOrder);
      setTestPaymentToast(`Customer payment of ${formatPrice(testOrder.total, currency)} received! Successfully deposited into Faruk Karim's receiving ledger.`);
      setTimeout(() => setTestPaymentToast(null), 6000);
    } catch (err) {
      console.error('Failed to simulate test payment', err);
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  // Order Sorting: Place 'Processing' status orders first, followed by Pending, Shipped, Delivered, Cancelled
  const getOrderStatusPriority = (status: Order['status']): number => {
    switch (status) {
      case 'Processing':
        return 1;
      case 'Pending':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return 5;
      default:
        return 6;
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const priorityA = getOrderStatusPriority(a.status);
    const priorityB = getOrderStatusPriority(b.status);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    // Secondary sort: most recent order date / id first
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    if (dateA !== dateB) return dateB - dateA;
    return b.id.localeCompare(a.id);
  });

  const displayedOrders = sortedOrders.filter((ord) => {
    const matchesFilter = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
    const q = orderSearch.toLowerCase().trim();
    if (!q) return matchesFilter;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.trackingNumber.toLowerCase().includes(q) ||
      ord.shippingAddress.fullName.toLowerCase().includes(q) ||
      ord.shippingAddress.email.toLowerCase().includes(q) ||
      ord.items.some((it) => it.name.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const processingOrdersCount = orders.filter((o) => o.status === 'Processing').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const shippedOrdersCount = orders.filter((o) => o.status === 'Shipped').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'Cancelled').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FDFBF7] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-[#E8E2D8] my-6 flex flex-col max-h-[94vh] text-[#2D2D2D]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header */}
        <div className="p-4 sm:p-5 bg-[#3F4C27] text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#8A9A5B] text-white flex items-center justify-center font-bold shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-base sm:text-xl text-white leading-none truncate">Mehrana Admin Center</h3>
                <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isAdminUnlocked ? 'bg-[#8A9A5B] text-white' : 'bg-[#C17F59] text-white'
                }`}>
                  {isAdminUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#FAF7F2]/80 mt-1 truncate">Catalog management, inventory control, and customer orders</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isAdminUnlocked && (
              <button
                onClick={onLockAdmin}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/15 hover:bg-[#C17F59] text-white text-xs font-semibold flex items-center gap-1.5 transition"
                title="Lock Admin Session"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock</span>
                <span className="hidden sm:inline">Session</span>
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
                  placeholder="Enter admin password"
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
          </div>
        ) : (
          /* UNLOCKED STATE VIEW */
          <div className="flex-1 overflow-y-auto flex flex-col">
            
            {/* Top Metrics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-5 bg-[#FAF7F2] border-b border-[#E8E2D8]">
              <div className="bg-white p-3 rounded-2xl border border-[#E8E2D8] shadow-2xs">
                <span className="text-[10px] text-[#A68F7A] font-medium block">Total Products</span>
                <span className="text-lg font-serif font-bold text-[#2D2D2D]">{products.length} Items</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#E8E2D8] shadow-2xs">
                <span className="text-[10px] text-[#A68F7A] font-medium block">Customer Orders</span>
                <span className="text-lg font-serif font-bold text-[#2D2D2D]">{orders.length} Orders</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#E8E2D8] shadow-2xs">
                <span className="text-[10px] text-[#A68F7A] font-medium block">Gross Revenue</span>
                <span className="text-lg font-serif font-bold text-[#3F4C27]">{formatPrice(totalRevenue, currency)}</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#dadce0] shadow-2xs">
                <div className="flex items-center gap-1 text-[10px] text-[#1a73e8] font-bold">
                  <GoogleGLogo className="w-3 h-3" />
                  <span>G-Pay Settled</span>
                </div>
                <span className="text-lg font-serif font-bold text-[#1a73e8]">{formatPrice(googlePaySettledTotal, currency)}</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#E8E2D8] shadow-2xs">
                <span className="text-[10px] text-[#A68F7A] font-medium block">Low Stock Alerts</span>
                <span className={`text-lg font-serif font-bold ${lowStockProducts.length > 0 ? 'text-[#C17F59]' : 'text-[#2D2D2D]'}`}>
                  {lowStockProducts.length} Items
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#E8E2D8] px-3 sm:px-5 bg-white overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-3 sm:py-3.5 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
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
                className={`py-3 sm:py-3.5 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
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
                className={`py-3 sm:py-3.5 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
                  activeTab === 'orders'
                    ? 'border-[#3F4C27] text-[#3F4C27] bg-[#F0F4E8]/50'
                    : 'border-transparent text-[#A68F7A] hover:text-[#2D2D2D]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('payouts')}
                className={`py-3 sm:py-3.5 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
                  activeTab === 'payouts'
                    ? 'border-[#1a73e8] text-[#1a73e8] bg-[#e8f0fe]/60'
                    : 'border-transparent text-[#A68F7A] hover:text-[#2D2D2D]'
                }`}
              >
                <GoogleGLogo className="w-4 h-4 shrink-0" />
                <span>Payments & Payouts</span>
                <span className="text-[10px] bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded-full font-bold border border-[#ceead6]">
                  {googlePayOrders.length} Settled
                </span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-6 flex-1 overflow-y-auto">
              
              {/* TAB 1: UPLOAD PRODUCT */}
              {activeTab === 'upload' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {isSuccessToast && (
                    <div className="bg-[#F0F4E8] border border-[#8A9A5B]/40 text-[#3F4C27] p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
                      <div className="w-8 h-8 rounded-full bg-[#8A9A5B]/20 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-[#3F4C27]" />
                      </div>
                      <div>
                        <span className="block font-bold">{toastMessage}</span>
                        <span className="text-[#5F584E] font-normal text-[11px]">Synchronized in real-time across customer storefronts and cloud database.</span>
                      </div>
                    </div>
                  )}

                  {publishError && (
                    <div className="bg-[#FAF0EB] border border-[#C17F59]/40 text-[#A84A28] p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
                      <AlertCircle className="w-5 h-5 text-[#C17F59] shrink-0" />
                      <div>
                        <span className="block font-bold">Failed to upload dress to Cloud</span>
                        <span className="text-[#A68F7A] font-normal text-[11px]">{publishError}</span>
                      </div>
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

                    <div className="space-y-4">
                      {/* Primary Image with File Upload + URL */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-[#5F584E]">Primary Dress / Product Image *</label>
                          <label className="text-[11px] font-semibold text-[#3F4C27] hover:underline cursor-pointer flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            <span>Upload photo from device</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const dataUrl = await fileToOptimizedDataUrl(file);
                                    setImageUrl(dataUrl);
                                  } catch (err) {
                                    console.error('Failed to load image:', err);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          required
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Paste image URL or click 'Upload photo from device' above"
                          className="w-full bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                        />
                      </div>

                      {/* Secondary / Model Angle Images (Multiple Upload + URLs) */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <label className="text-xs font-semibold text-[#5F584E]">
                            Secondary / Model Angle Images (Add 2 or more)
                            {secondaryImages.length > 0 && (
                              <span className="ml-1.5 text-[10px] font-bold text-[#3F4C27] bg-[#F0F4E8] px-2 py-0.5 rounded-full border border-[#8A9A5B]/30">
                                {secondaryImages.length} added
                              </span>
                            )}
                          </label>
                          <label className="text-[11px] font-semibold text-[#3F4C27] hover:underline cursor-pointer flex items-center gap-1">
                            <Upload className="w-3 h-3" />
                            <span>Upload multiple photos from device</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []) as File[];
                                if (files.length === 0) return;
                                try {
                                  const uploadedUrls = await Promise.all(
                                    files.map((file) => fileToOptimizedDataUrl(file))
                                  );
                                  setSecondaryImages((prev) => [...prev, ...uploadedUrls]);
                                } catch (err) {
                                  console.error('Failed to load secondary images:', err);
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={secondaryUrlInput}
                            onChange={(e) => setSecondaryUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmed = secondaryUrlInput.trim();
                                if (trimmed) {
                                  setSecondaryImages((prev) => [...prev, trimmed]);
                                  setSecondaryUrlInput('');
                                }
                              }
                            }}
                            placeholder="Paste an angle image URL and click Add, or upload multiple photos above"
                            className="flex-1 bg-white border border-[#E8E2D8] text-xs p-3 rounded-xl focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const trimmed = secondaryUrlInput.trim();
                              if (trimmed) {
                                setSecondaryImages((prev) => [...prev, trimmed]);
                                setSecondaryUrlInput('');
                              }
                            }}
                            className="px-4 py-2.5 bg-[#3F4C27] hover:bg-[#323D1F] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Angle</span>
                          </button>
                        </div>

                        {/* Secondary / Model Angle Thumbnails Grid */}
                        {secondaryImages.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
                            {secondaryImages.map((img, idx) => (
                              <div
                                key={idx}
                                className="relative group rounded-xl overflow-hidden border border-[#E8E2D8] bg-[#FAF7F2] aspect-4/5"
                              >
                                <img
                                  src={img}
                                  alt={`Angle ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80';
                                  }}
                                />
                                <span className="absolute bottom-1 left-1 bg-black/65 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                  Angle {idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSecondaryImages((prev) => prev.filter((_, i) => i !== idx))
                                  }
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-[#C17F59] text-white flex items-center justify-center transition"
                                  title="Remove image"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Preview Box */}
                    {imageUrl && (
                      <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8]">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-14 h-16 object-cover rounded-lg bg-white border border-[#E8E2D8]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[#2D2D2D] block">Primary Image Ready</span>
                          <span className="text-[#A68F7A] text-[11px] line-clamp-1">{imageUrl.startsWith('data:') ? 'Uploaded local device photo (Optimized for Cloud)' : imageUrl}</span>
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

                    {/* Curate Color Category & Available Colors */}
                    <ColorPaletteManager
                      colors={colors}
                      onChange={setColors}
                      title="Curate Color Category & Available Colors"
                      description="Add the exact color shades available for this dress. Shoppers will choose from these colors."
                    />

                    {/* Curate Cloth Sizes */}
                    <ClothSizeManager
                      sizes={sizes}
                      onChange={setSizes}
                      title="Curate Available Cloth Sizes"
                      description="Specify clothing sizes available for this dress (e.g., XS, S, M, L, XL, XXL, Unstitched, custom measurements). Customers will choose from these sizes."
                    />

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
                      disabled={isPublishing}
                      className="w-full py-4 bg-[#3F4C27] hover:bg-[#323D1F] disabled:opacity-60 text-white font-bold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-2"
                    >
                      {isPublishing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Publishing & Syncing to Cloud Database...</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4 text-[#FAF7F2]" />
                          <span>Publish Garment to Live Catalog (All Devices)</span>
                        </>
                      )}
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

                    {products.length > 0 && onClearAllProducts && (
                      <button
                        onClick={() => setConfirmClearAll(true)}
                        className="px-4 py-2 border border-[#C17F59]/40 bg-[#FAF0EB] hover:bg-[#F3E3DB] text-[#A84A28] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete All Clothes</span>
                      </button>
                    )}
                  </div>

                  {/* Catalog Table */}
                  <div className="border border-[#E8E2D8] rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] text-[#5F584E] font-semibold border-b border-[#E8E2D8]">
                        <tr>
                          <th className="p-3">Garment</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Available Sizes</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E2D8]">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-[#A68F7A]">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <ShoppingBag className="w-8 h-8 stroke-[1.5] text-[#8A9A5B]" />
                                <p className="font-semibold text-sm text-[#2D2D2D]">No garments found in catalog</p>
                                <p className="text-xs text-[#5F584E]">Use the "Upload New Garment" tab to add clothes to the store.</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-[#FAF7F2] transition">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.image_url}
                                    alt={p.name}
                                    className="w-12 h-14 object-cover rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <span className="font-bold text-[#2D2D2D] block truncate max-w-xs">{p.name}</span>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <span className="text-[10px] text-[#A68F7A] font-mono">SKU: {p.sku}</span>
                                      {p.colors && p.colors.length > 0 && (
                                        <div className="flex items-center gap-1 bg-[#FAF7F2] px-1.5 py-0.5 rounded-md border border-[#E8E2D8]">
                                          {p.colors.slice(0, 4).map((c, i) => (
                                            <span
                                              key={i}
                                              className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                                              style={{ backgroundColor: c.hex }}
                                              title={c.name}
                                            />
                                          ))}
                                          {p.colors.length > 4 && (
                                            <span className="text-[9px] text-[#A68F7A]">+{p.colors.length - 4}</span>
                                          )}
                                          <span className="text-[10px] text-[#5F584E] font-medium ml-0.5">
                                            {p.colors.length} {p.colors.length === 1 ? 'color' : 'colors'}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/30 font-semibold px-2 py-0.5 rounded text-[10px]">
                                  {p.category}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                  {p.sizes && p.sizes.length > 0 ? (
                                    p.sizes.map((sz) => (
                                      <span
                                        key={sz}
                                        className="px-1.5 py-0.5 bg-[#FAF7F2] border border-[#E8E2D8] rounded text-[10px] font-semibold text-[#3F4C27]"
                                      >
                                        {sz}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-[#A68F7A] italic">No sizes specified</span>
                                  )}
                                </div>
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
                              <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="px-2.5 py-1.5 text-xs font-semibold text-[#3F4C27] hover:bg-[#F0F4E8] border border-[#8A9A5B]/30 rounded-xl transition inline-flex items-center gap-1"
                                  title="Edit garment & colors"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => setProductToDelete(p)}
                                  className="px-2.5 py-1.5 text-xs font-semibold text-[#C17F59] hover:bg-[#FAF0EB] border border-[#C17F59]/30 rounded-xl transition inline-flex items-center gap-1"
                                  title="Delete item from catalog"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Orders Control Bar: Processing-First Filter & Search */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E2D8]">
                    {/* Status Filter Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          orderStatusFilter === 'all'
                            ? 'bg-[#3F4C27] text-white shadow-xs'
                            : 'bg-white text-[#5F584E] border border-[#E8E2D8] hover:bg-[#EFE9DF]'
                        }`}
                      >
                        All Orders ({orders.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('Processing')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          orderStatusFilter === 'Processing'
                            ? 'bg-[#8A9A5B] text-white shadow-xs'
                            : 'bg-white text-[#3F4C27] border border-[#8A9A5B]/40 hover:bg-[#F0F4E8]'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#3F4C27] animate-pulse" />
                        <span>Processing ({processingOrdersCount})</span>
                      </button>

                      {pendingOrdersCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter('Pending')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            orderStatusFilter === 'Pending'
                              ? 'bg-[#C17F59] text-white shadow-xs'
                              : 'bg-white text-[#5F584E] border border-[#E8E2D8] hover:bg-[#EFE9DF]'
                          }`}
                        >
                          Pending ({pendingOrdersCount})
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('Shipped')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          orderStatusFilter === 'Shipped'
                            ? 'bg-[#3F4C27] text-white shadow-xs'
                            : 'bg-white text-[#5F584E] border border-[#E8E2D8] hover:bg-[#EFE9DF]'
                        }`}
                      >
                        Shipped ({shippedOrdersCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('Delivered')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                          orderStatusFilter === 'Delivered'
                            ? 'bg-[#188038] text-white shadow-xs'
                            : 'bg-white text-[#5F584E] border border-[#E8E2D8] hover:bg-[#EFE9DF]'
                        }`}
                      >
                        Delivered ({deliveredOrdersCount})
                      </button>

                      {cancelledOrdersCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setOrderStatusFilter('Cancelled')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            orderStatusFilter === 'Cancelled'
                              ? 'bg-[#d93025] text-white shadow-xs'
                              : 'bg-white text-[#5F584E] border border-[#E8E2D8] hover:bg-[#EFE9DF]'
                          }`}
                        >
                          Cancelled ({cancelledOrdersCount})
                        </button>
                      )}
                    </div>

                    {/* Search and Sort Indicator */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-3.5 h-3.5 text-[#A68F7A] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Search Order #, Tracking, Name..."
                          className="w-full bg-white border border-[#E8E2D8] text-xs pl-8 pr-3 py-1.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                        />
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#3F4C27] bg-[#F0F4E8] px-2.5 py-1.5 rounded-xl border border-[#8A9A5B]/30 shrink-0">
                        <Sparkles className="w-3 h-3 text-[#8A9A5B]" />
                        <span>Processing First</span>
                      </span>
                    </div>
                  </div>

                  {/* Priority Fulfillment Notice Banner */}
                  {processingOrdersCount > 0 && orderStatusFilter === 'all' && (
                    <div className="bg-[#F0F4E8] border border-[#8A9A5B]/50 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs text-[#3F4C27]">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3F4C27] animate-ping shrink-0" />
                        <div>
                          <strong className="font-bold">
                            {processingOrdersCount} {processingOrdersCount === 1 ? 'order is' : 'orders are'} currently in Processing status:
                          </strong>
                          <span className="text-[#5F584E] ml-1">
                            Placed first at the top for priority atelier stitching, quality packaging, and courier dispatch.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOrderStatusFilter('Processing')}
                        className="text-[11px] font-bold text-[#3F4C27] hover:underline shrink-0"
                      >
                        View Only Processing ➔
                      </button>
                    </div>
                  )}

                  {/* Orders List */}
                  {displayedOrders.length === 0 ? (
                    <div className="text-center py-12 text-[#A68F7A] space-y-2 bg-white rounded-2xl border border-[#E8E2D8]">
                      <ShoppingBag className="w-12 h-12 mx-auto stroke-[1.5] text-[#8A9A5B]" />
                      <p className="text-sm font-semibold text-[#2D2D2D]">
                        {orders.length === 0 ? 'No orders placed yet' : 'No orders match this filter'}
                      </p>
                      <p className="text-xs">
                        {orders.length === 0
                          ? 'Customer checkouts will appear live here in real-time.'
                          : 'Try changing your status filter or clearing your search keywords.'}
                      </p>
                    </div>
                  ) : (
                    displayedOrders.map((ord) => {
                      const isProcessing = ord.status === 'Processing';
                      return (
                        <div
                          key={ord.id}
                          className={`p-4 rounded-2xl border transition-all space-y-3 ${
                            isProcessing
                              ? 'bg-[#FAF8F4] border-[#8A9A5B] border-l-4 border-l-[#3F4C27] shadow-xs'
                              : 'bg-[#FAF7F2] border-[#E8E2D8]'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E2D8]">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-mono font-bold text-[#2D2D2D] text-sm">{ord.orderNumber}</span>
                              <span className="text-xs text-[#A68F7A]">Placed: {ord.date}</span>
                              
                              {/* Status Tag */}
                              {isProcessing ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/40 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#3F4C27] animate-pulse" />
                                  <span>1st Priority • Processing</span>
                                </span>
                              ) : ord.status === 'Shipped' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF0EB] text-[#C17F59] border border-[#C17F59]/30">
                                  <Truck className="w-3 h-3" />
                                  <span>In Transit (Shipped)</span>
                                </span>
                              ) : ord.status === 'Delivered' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                                  <Check className="w-3 h-3" />
                                  <span>Delivered</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#5F584E] border border-[#E8E2D8]">
                                  <span>{ord.status}</span>
                                </span>
                              )}
                            </div>

                            {/* Live Status Selector & Quick Action Button */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#5F584E] font-medium">Status:</span>
                              <select
                                value={ord.status}
                                onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold focus:border-[#8A9A5B] border ${
                                  isProcessing
                                    ? 'bg-white border-[#8A9A5B] text-[#3F4C27] font-bold'
                                    : 'bg-white border-[#E8E2D8] text-[#2D2D2D]'
                                }`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>

                              {/* Quick Advancement Action Button */}
                              {isProcessing && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateOrderStatus(ord.id, 'Shipped')}
                                  className="px-2.5 py-1 bg-[#3F4C27] hover:bg-[#323D1F] text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-2xs"
                                  title="Advance to Shipped"
                                >
                                  <span>Ship</span>
                                  <Truck className="w-3 h-3" />
                                </button>
                              )}
                              {ord.status === 'Shipped' && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                                  className="px-2.5 py-1 bg-[#188038] hover:bg-[#137333] text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-2xs"
                                  title="Advance to Delivered"
                                >
                                  <span>Delivered</span>
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-[#A68F7A] block text-[10px] uppercase font-bold tracking-wider">
                                Customer & Delivery Address
                              </span>
                              <p className="font-semibold text-[#2D2D2D]">{ord.shippingAddress.fullName}</p>
                              <p className="text-[#5F584E]">
                                {ord.shippingAddress.address}, {ord.shippingAddress.city}, {ord.shippingAddress.country}
                              </p>
                              <p className="text-[#A68F7A] text-[11px]">
                                {ord.shippingAddress.email} • {ord.shippingAddress.phone}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-[#A68F7A] block text-[10px] uppercase font-bold tracking-wider">
                                Total Order Value
                              </span>
                              <span className="font-serif font-bold text-base text-[#3F4C27]">
                                {formatPrice(ord.total, currency)}
                              </span>
                              <div className="flex items-center justify-end gap-1.5 mt-1">
                                {ord.paymentMethod === 'googlepay' ? (
                                  <div className="flex flex-col items-end gap-0.5">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#dadce0] font-semibold text-[#202124] text-[10px] shadow-2xs">
                                      <GoogleGLogo className="w-2.5 h-2.5" />
                                      <span>Google Pay</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#188038]">
                                      <ShieldCheck className="w-3 h-3 text-[#188038]" />
                                      <span>Settled to farukarim@gmail.com</span>
                                    </span>
                                  </div>
                                ) : ord.paymentMethod === 'cod' ? (
                                  <span className="inline-block text-[10px] font-semibold text-[#C17F59] bg-[#FAF0EB] px-2 py-0.5 rounded-md border border-[#C17F59]/30">
                                    Cash on Deliv.
                                  </span>
                                ) : (
                                  <span className="inline-block text-[10px] font-semibold text-[#5F584E] bg-white px-2 py-0.5 rounded-md border border-[#E8E2D8]">
                                    Credit Card
                                  </span>
                                )}
                              </div>
                              <p className="text-[#A68F7A] text-[11px] mt-1">
                                Tracking: <span className="font-mono font-semibold text-[#2D2D2D]">{ord.trackingNumber}</span>
                              </p>
                            </div>
                          </div>

                          {/* Items list */}
                          <div className="pt-2 border-t border-[#E8E2D8] flex flex-wrap gap-2">
                            {ord.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="bg-white border border-[#E8E2D8] px-2.5 py-1 rounded-lg text-xs text-[#5F584E] flex items-center gap-1.5"
                              >
                                <span className="font-semibold text-[#2D2D2D]">{item.name}</span>
                                <span className="text-[11px] text-[#A68F7A]">
                                  ({item.selectedSize ? `Size: ${item.selectedSize}` : ''}) × {item.qty}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 4: PAYMENTS & PAYOUTS (GOOGLE PAY & BANK SETTLEMENT) */}
              {activeTab === 'payouts' && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  
                  {/* Toast Alerts */}
                  {withdrawToast && (
                    <div className="bg-[#e6f4ea] border border-[#ceead6] text-[#137333] p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs animate-in fade-in">
                      <div className="w-8 h-8 rounded-full bg-[#188038]/10 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-[#188038]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">Bank Withdrawal Successful</p>
                        <p className="text-[11px] text-[#188038]/90">{withdrawToast}</p>
                      </div>
                      <button onClick={() => setWithdrawToast(null)} className="text-[#137333] hover:opacity-70 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {settingsSaveSuccess && (
                    <div className="bg-[#e6f4ea] border border-[#ceead6] text-[#137333] p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs animate-in fade-in">
                      <div className="w-8 h-8 rounded-full bg-[#188038]/10 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-[#188038]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">Settings Saved</p>
                        <p className="text-[11px]">Merchant receiving account (farukarim@gmail.com) and settlement configurations updated successfully.</p>
                      </div>
                      <button onClick={() => setSettingsSaveSuccess(false)} className="text-[#137333] hover:opacity-70 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {testPaymentToast && (
                    <div className="bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs animate-in fade-in">
                      <div className="w-8 h-8 rounded-full bg-[#1a73e8]/10 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-[#1a73e8]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">Customer Payment Received</p>
                        <p className="text-[11px] text-[#1a73e8]/90">{testPaymentToast}</p>
                      </div>
                      <button onClick={() => setTestPaymentToast(null)} className="text-[#1a73e8] hover:opacity-70 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Merchant Payout & Settlement Verification Banner */}
                  <div className="bg-gradient-to-r from-[#1a73e8]/10 via-[#FAF7F2] to-[#3F4C27]/10 p-5 rounded-3xl border border-[#dadce0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#dadce0] flex items-center justify-center shadow-xs shrink-0">
                        <GoogleGLogo className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif font-bold text-base text-[#202124]">
                            Google Pay Merchant Direct Settlement
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#188038] bg-[#e6f4ea] px-2.5 py-0.5 rounded-full border border-[#ceead6]">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>100% Funds Direct to Faruk Karim</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#5f6368] mt-1 leading-relaxed">
                          Receiving Account: <strong className="text-[#202124]">farukarim@gmail.com</strong> • Linked Direct Deposit: <strong className="text-[#202124]">{merchantSettings.bankName} (Acct ending in {merchantSettings.accountNumber.slice(-4)})</strong>
                        </p>
                        <p className="text-[11px] text-[#5f6368] mt-0.5">
                          When shoppers pay with Google Pay, their funds are tokenized, authorized, and automatically credited to your merchant ledger without middleman delays.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleSimulateCustomerPayment}
                        disabled={isSimulatingPayment}
                        className="py-2.5 px-4 bg-white hover:bg-[#F8F9FA] border border-[#dadce0] text-[#1a73e8] hover:text-[#1557b0] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                        title="Simulate a real customer Google Pay payment of $145.00"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSimulatingPayment ? 'Sending Deposit...' : 'Send Test Deposit to Faruk Karim'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Financial Balance & Payout Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: Google Pay Settled Total */}
                    <div className="bg-white p-5 rounded-3xl border border-[#dadce0] shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">
                          Google Pay Revenue
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                          <GoogleGLogo className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="font-serif font-bold text-2xl text-[#202124]">
                        {formatPrice(googlePaySettledTotal, currency)}
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#f1f3f4]">
                        <span className="text-[#5f6368]">{googlePayOrders.length} customer checkout(s)</span>
                        <span className="text-[11px] font-semibold text-[#188038] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                          100% Settled ✓
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Available Net Balance & Transfer CTA */}
                    <div className="bg-gradient-to-br from-[#F0F4E8] to-[#FAF8F4] p-5 rounded-3xl border border-[#8A9A5B]/40 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#3F4C27] uppercase tracking-wider">
                          Available for Payout
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#8A9A5B]/20 text-[#3F4C27] flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-[#3F4C27]" />
                        </div>
                      </div>
                      <div className="font-serif font-bold text-2xl text-[#3F4C27]">
                        {formatPrice(availableBalance, currency)}
                      </div>
                      <div className="pt-1 border-t border-[#8A9A5B]/20 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#5F584E]">Ready to transfer to bank</span>
                        <button
                          type="button"
                          onClick={() => {
                            setWithdrawAmountInput(availableBalance > 0 ? availableBalance.toFixed(2) : '50.00');
                            setIsWithdrawModalOpen(true);
                          }}
                          disabled={availableBalance <= 0}
                          className="py-1.5 px-3 bg-[#3F4C27] hover:bg-[#323D1F] text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Withdraw Funds</span>
                        </button>
                      </div>
                    </div>

                    {/* Card 3: Total Withdrawn to Bank */}
                    <div className="bg-white p-5 rounded-3xl border border-[#dadce0] shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">
                          Total Paid Out to Bank
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#FAF0EB] text-[#C17F59] flex items-center justify-center">
                          <Landmark className="w-4 h-4 text-[#C17F59]" />
                        </div>
                      </div>
                      <div className="font-serif font-bold text-2xl text-[#202124]">
                        {formatPrice(merchantSettings.totalWithdrawn || 0, currency)}
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#f1f3f4]">
                        <span className="text-[#5f6368] truncate">Account •••• {merchantSettings.accountNumber.slice(-4)}</span>
                        <span className="text-[11px] font-semibold text-[#5f6368]">
                          Direct Deposit
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Split: Merchant Receiving Setup & Customer Settlements Ledger */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN (5 cols): Merchant Receiving Configuration */}
                    <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-[#E8E2D8] shadow-2xs space-y-4">
                      <div className="border-b border-[#E8E2D8] pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-base text-[#2D2D2D] flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-[#3F4C27]" />
                            <span>Merchant Receiving Details</span>
                          </h4>
                          <span className="text-[10px] font-bold text-[#188038] bg-[#e6f4ea] px-2 py-0.5 rounded-full border border-[#ceead6]">
                            Active
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A68F7A] mt-1">
                          Configure where Google Pay and bank transfers deposit your money.
                        </p>
                      </div>

                      <form onSubmit={handleSaveMerchantSettings} className="space-y-3.5 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                            Store Owner / Merchant Name
                          </label>
                          <input
                            type="text"
                            value={merchantSettings.merchantName}
                            onChange={(e) => setMerchantSettings({ ...merchantSettings, merchantName: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl p-2.5 outline-hidden focus:border-[#8A9A5B] font-medium text-[#2D2D2D]"
                            required
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-[#5F584E]">
                              Receiving Google Account (Email)
                            </label>
                            <span className="text-[10px] text-[#188038] font-bold flex items-center gap-0.5">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Verified Payee</span>
                            </span>
                          </div>
                          <input
                            type="email"
                            value={merchantSettings.merchantEmail}
                            onChange={(e) => setMerchantSettings({ ...merchantSettings, merchantEmail: e.target.value })}
                            className="w-full bg-[#F0F4E8] border border-[#8A9A5B]/50 rounded-xl p-2.5 outline-hidden focus:border-[#3F4C27] font-semibold text-[#3F4C27]"
                            required
                          />
                          <p className="text-[10px] text-[#8A9A5B] mt-1">
                            All Google Pay checkout payments are routed to this verified merchant address.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                              Google Pay Merchant ID
                            </label>
                            <input
                              type="text"
                              value={merchantSettings.googlePayMerchantId}
                              onChange={(e) => setMerchantSettings({ ...merchantSettings, googlePayMerchantId: e.target.value })}
                              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl p-2.5 outline-hidden focus:border-[#8A9A5B] font-mono text-[11px] text-[#2D2D2D]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                              Business UPI / VPA ID
                            </label>
                            <input
                              type="text"
                              value={merchantSettings.businessUpiId}
                              onChange={(e) => setMerchantSettings({ ...merchantSettings, businessUpiId: e.target.value })}
                              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl p-2.5 outline-hidden focus:border-[#8A9A5B] font-mono text-[11px] text-[#2D2D2D]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                            Receiving Bank Name
                          </label>
                          <input
                            type="text"
                            value={merchantSettings.bankName}
                            onChange={(e) => setMerchantSettings({ ...merchantSettings, bankName: e.target.value })}
                            className="w-full bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl p-2.5 outline-hidden focus:border-[#8A9A5B] font-medium text-[#2D2D2D]"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                              Account Number / IBAN
                            </label>
                            <input
                              type="text"
                              value={merchantSettings.accountNumber}
                              onChange={(e) => setMerchantSettings({ ...merchantSettings, accountNumber: e.target.value })}
                              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl p-2.5 outline-hidden focus:border-[#8A9A5B] font-mono text-[11px] text-[#2D2D2D]"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                              Routing / Sort Code
                            </label>
                            <input
                              type="text"
                              value={merchantSettings.routingNumber}
                              onChange={(e) => setMerchantSettings({ ...merchantSettings, routingNumber: e.target.value })}
                              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl p-2.5 outline-hidden focus:border-[#8A9A5B] font-mono text-[11px] text-[#2D2D2D]"
                              required
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={isSavingSettings}
                            className="w-full py-3 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            <span>{isSavingSettings ? 'Saving Details...' : 'Save Receiving Details'}</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* RIGHT COLUMN (7 cols): Customer Payment Transactions & Settlements Ledger */}
                    <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-[#E8E2D8] shadow-2xs space-y-4">
                      <div className="border-b border-[#E8E2D8] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#2D2D2D] flex items-center gap-2">
                            <GoogleGLogo className="w-4 h-4" />
                            <span>Customer Google Pay Settlements Ledger</span>
                          </h4>
                          <p className="text-[11px] text-[#A68F7A] mt-0.5">
                            Real-time audit log of customer payments credited to Faruk Karim
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-1 rounded-xl self-start sm:self-auto">
                          {googlePayOrders.length} Transaction(s)
                        </span>
                      </div>

                      {googlePayOrders.length === 0 ? (
                        <div className="py-12 text-center text-[#A68F7A] space-y-3 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#E8E2D8]">
                          <GoogleGLogo className="w-10 h-10 mx-auto opacity-40" />
                          <div>
                            <p className="text-sm font-bold text-[#2D2D2D]">No Google Pay transactions yet</p>
                            <p className="text-xs text-[#5F584E] mt-1 max-w-sm mx-auto">
                              When customers check out using Google Pay, their settled funds and bank receipt IDs will appear live right here.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleSimulateCustomerPayment}
                            disabled={isSimulatingPayment}
                            className="py-2 px-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Simulate Customer Payment ($145.00)</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                          {googlePayOrders.map((ord) => {
                            const txId = ord.paymentDetails?.transactionId || `GPA.${ord.orderNumber.replace('MW-', '')}-GPAY-OK`;
                            const payee = ord.paymentDetails?.recipientEmail || 'farukarim@gmail.com';
                            const destination = ord.paymentDetails?.payoutDestination || `${merchantSettings.bankName} (Acct ••9102)`;

                            return (
                              <div
                                key={ord.id}
                                className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] hover:border-[#8A9A5B] transition-all space-y-2 text-xs"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#E8E2D8]">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-[#2D2D2D]">{ord.orderNumber}</span>
                                    <span className="text-[10px] text-[#A68F7A]">{ord.date}</span>
                                  </div>
                                  <span className="font-serif font-bold text-sm text-[#3F4C27]">
                                    {formatPrice(ord.total, currency)}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                  <div>
                                    <span className="text-[#A68F7A] block text-[10px] uppercase font-bold">Payer / Customer</span>
                                    <p className="font-semibold text-[#2D2D2D]">{ord.shippingAddress.fullName}</p>
                                    <p className="text-[#5F584E] text-[10px]">{ord.shippingAddress.email}</p>
                                  </div>

                                  <div className="sm:text-right">
                                    <span className="text-[#A68F7A] block text-[10px] uppercase font-bold">Recipient Account</span>
                                    <p className="font-bold text-[#1a73e8]">{payee}</p>
                                    <p className="text-[#5F584E] text-[10px] truncate">{destination}</p>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between flex-wrap gap-2 text-[10px]">
                                  <div className="flex items-center gap-1.5 font-mono text-[#5f6368]">
                                    <span>TxID:</span>
                                    <span className="font-bold text-[#2D2D2D]">{txId}</span>
                                  </div>
                                  <span className="inline-flex items-center gap-1 font-bold text-[#188038] bg-[#e6f4ea] px-2 py-0.5 rounded-full border border-[#ceead6]">
                                    <ShieldCheck className="w-3 h-3 text-[#188038]" />
                                    <span>Received & Settled</span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bank Withdrawal Modal */}
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FDFBF7] rounded-3xl max-w-md w-full shadow-2xl border border-[#E8E2D8] text-[#2D2D2D] overflow-hidden animate-in fade-in">
              <div className="p-5 border-b border-[#E8E2D8] flex justify-between items-center bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F0F4E8] text-[#3F4C27] flex items-center justify-center border border-[#8A9A5B]/30">
                    <Landmark className="w-5 h-5 text-[#3F4C27]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#2D2D2D]">Withdraw Funds to Bank</h4>
                    <p className="text-[11px] text-[#A68F7A]">Instant direct deposit transfer</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="p-1 rounded-full text-[#A68F7A] hover:text-[#2D2D2D] hover:bg-[#FAF7F2] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4 text-xs">
                {/* Balance display */}
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] space-y-1">
                  <span className="text-[#A68F7A] text-[10px] font-bold uppercase tracking-wider block">
                    Available Balance
                  </span>
                  <div className="font-serif font-bold text-2xl text-[#3F4C27]">
                    {formatPrice(availableBalance, currency)}
                  </div>
                  <p className="text-[10px] text-[#5F584E]">
                    Earned from customer Google Pay checkouts
                  </p>
                </div>

                {/* Amount input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#5F584E]">Withdrawal Amount</label>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmountInput(availableBalance.toFixed(2))}
                      className="text-[10px] font-bold text-[#3F4C27] hover:underline"
                    >
                      Withdraw Maximum
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={availableBalance}
                      value={withdrawAmountInput}
                      onChange={(e) => setWithdrawAmountInput(e.target.value)}
                      placeholder="Enter amount..."
                      className="w-full bg-white border border-[#E8E2D8] rounded-xl p-3 text-sm font-semibold outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                      required
                    />
                  </div>
                </div>

                {/* Destination info */}
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E2D8] space-y-1.5 text-[11px]">
                  <span className="text-[#A68F7A] font-bold block text-[10px] uppercase">Destination Bank Account</span>
                  <p className="font-bold text-[#2D2D2D]">{merchantSettings.accountHolder}</p>
                  <p className="text-[#5F584E]">{merchantSettings.bankName}</p>
                  <div className="flex justify-between text-[#5F584E] pt-1 border-t border-[#E8E2D8]">
                    <span>Account Number:</span>
                    <span className="font-mono font-semibold">{merchantSettings.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-[#5F584E]">
                    <span>Settlement Time:</span>
                    <span className="font-semibold text-[#188038]">Immediate / Instant</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="py-3 px-4 bg-white border border-[#E8E2D8] hover:bg-[#FAF7F2] text-[#5F584E] font-semibold rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessingWithdraw || parseFloat(withdrawAmountInput) > availableBalance || parseFloat(withdrawAmountInput) <= 0}
                    className="py-3 px-4 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{isProcessingWithdraw ? 'Transferring...' : 'Confirm Transfer'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal Popup */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FDFBF7] rounded-3xl max-w-xl w-full shadow-2xl border border-[#E8E2D8] text-[#2D2D2D] max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in">
              {/* Modal Header */}
              <div className="p-5 border-b border-[#E8E2D8] flex justify-between items-center bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F4E8] text-[#3F4C27] flex items-center justify-center border border-[#8A9A5B]/30">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#2D2D2D]">Edit Garment & Colors</h4>
                    <p className="text-[11px] text-[#A68F7A]">SKU: {editingProduct.sku}</p>
                  </div>
                </div>
                <button onClick={() => setEditingProduct(null)} className="p-1.5 text-[#5F584E] hover:text-[#2D2D2D] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5F584E] mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                      className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    >
                      <option value="Women">Women's Pret & Unstitched</option>
                      <option value="Men">Men's Kurtas & Waistcoats</option>
                      <option value="Modest">Modest & Abayas</option>
                      <option value="Kids">Festive Kids</option>
                      <option value="Festive">Luxury Wedding & Festive</option>
                      <option value="Accessories">Shawls & Accessories</option>
                    </select>
                  </div>

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
                    <label className="block text-xs font-semibold text-[#5F584E] mb-1">Inventory Stock</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>
                </div>

                {/* Image field with upload */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#5F584E]">Product Image (URL or Upload)</label>
                    <label className="text-[11px] font-semibold text-[#3F4C27] hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const dataUrl = await fileToOptimizedDataUrl(file);
                              setEditingProduct({ ...editingProduct, image_url: dataUrl });
                            } catch (err) {
                              console.error('Failed to load image:', err);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={editingProduct.image_url}
                      alt={editingProduct.name}
                      className="w-10 h-10 object-cover rounded-lg border border-[#E8E2D8] shrink-0 bg-white"
                    />
                    <input
                      type="text"
                      value={editingProduct.image_url}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                      className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>
                </div>

                {/* Color Category & Options Manager */}
                <ColorPaletteManager
                  colors={editingProduct.colors || []}
                  onChange={(newColors) => setEditingProduct({ ...editingProduct, colors: newColors })}
                  title="Dress Color Category & Options"
                  description="Customize the exact color options customers can pick when viewing or ordering this dress."
                />

                {/* Cloth Sizes Manager */}
                <ClothSizeManager
                  sizes={editingProduct.sizes || []}
                  onChange={(newSizes) => setEditingProduct({ ...editingProduct, sizes: newSizes })}
                  title="Available Cloth Sizes"
                  description="Customize the clothing sizes available for customers when purchasing this garment."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#5F584E] mb-1">Fabric & Texture</label>
                    <input
                      type="text"
                      value={editingProduct.fabric || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                      className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5F584E] mb-1">Care Instructions</label>
                    <input
                      type="text"
                      value={editingProduct.careInstructions || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, careInstructions: e.target.value })}
                      className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 border-t border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProductToDelete(editingProduct);
                    setEditingProduct(null);
                  }}
                  className="py-2.5 px-3.5 bg-[#FAF0EB] hover:bg-[#F3E3DB] border border-[#C17F59]/30 text-[#A84A28] font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                  title="Delete this garment from store"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Garment</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="py-2.5 px-4 bg-white hover:bg-[#EFE9DF] border border-[#E8E2D8] text-[#5F584E] font-semibold text-xs rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEditProduct}
                    className="py-2.5 px-5 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Item Confirmation Modal */}
        {productToDelete && (
          <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FDFBF7] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E8E2D8] space-y-4 text-[#2D2D2D] animate-in fade-in">
              <div className="flex items-center gap-3 text-[#C17F59]">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF0EB] flex items-center justify-center border border-[#C17F59]/30 shrink-0">
                  <Trash2 className="w-5 h-5 text-[#C17F59]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#2D2D2D]">Delete Item from Catalog?</h4>
                  <p className="text-[11px] text-[#A68F7A]">This action will permanently delete this garment.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E8E2D8]">
                <img
                  src={productToDelete.image_url}
                  alt={productToDelete.name}
                  className="w-14 h-16 object-cover rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-[#2D2D2D] block truncate">{productToDelete.name}</span>
                  <span className="text-[10px] text-[#A68F7A] font-mono block mt-0.5">SKU: {productToDelete.sku}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-[#3F4C27]">{formatPrice(productToDelete.price, currency)}</span>
                    <span className="text-[10px] text-[#5F584E]">Category: {productToDelete.category}</span>
                  </div>
                  {productToDelete.colors && productToDelete.colors.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      {productToDelete.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                      <span className="text-[10px] text-[#A68F7A] ml-1">{productToDelete.colors.length} colors</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#5F584E] leading-relaxed">
                Are you sure you want to delete this garment? It will be removed immediately from the customer storefront and cloud database.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setProductToDelete(null)}
                  className="py-2.5 px-4 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#5F584E] font-semibold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="py-2.5 px-4 bg-[#C17F59] hover:bg-[#A84A28] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Yes, Delete Item</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear All Confirmation Modal */}
        {confirmClearAll && (
          <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FDFBF7] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E8E2D8] space-y-4 text-[#2D2D2D] animate-in fade-in">
              <div className="flex items-center gap-3 text-[#C17F59]">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF0EB] flex items-center justify-center border border-[#C17F59]/30 shrink-0">
                  <AlertCircle className="w-5 h-5 text-[#C17F59]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#2D2D2D]">Delete All Catalog Items?</h4>
                  <p className="text-[11px] text-[#A68F7A]">Clear all {products.length} products in store</p>
                </div>
              </div>
              <p className="text-xs text-[#5F584E] leading-relaxed">
                This will delete every garment from the store catalog and reset inventory. This cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="py-2.5 px-4 bg-white hover:bg-[#FAF7F2] border border-[#E8E2D8] text-[#5F584E] font-semibold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (onClearAllProducts) {
                      await onClearAllProducts();
                    }
                    setConfirmClearAll(false);
                  }}
                  className="py-2.5 px-4 bg-[#C17F59] hover:bg-[#A84A28] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Items</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

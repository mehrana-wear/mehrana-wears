import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  LogOut, 
  Truck, 
  Clock, 
  CheckCircle, 
  RefreshCw, 
  Edit3, 
  Save, 
  Home, 
  Phone, 
  Globe, 
  Building2
} from 'lucide-react';
import { User, Order, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { UserAvatar } from './UserAvatar';
import { getGoogleAvatarUrl } from '../utils/googleAvatar';
import { GoogleGLogo } from './GooglePaySheet';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  orders: Order[];
  onLogout: () => void;
  currency: CurrencyCode;
  onUpdateUser?: (updatedUser: User) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  onLogout,
  currency,
  onUpdateUser,
}) => {
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState(user.avatar || '');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Address editing states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    postalCode: user.address?.postalCode || '',
    country: user.address?.country || 'United Kingdom',
    phone: user.phone || '',
  });

  // Keep address form in sync with user prop
  useEffect(() => {
    if (user) {
      setAddressForm({
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'United Kingdom',
        phone: user.phone || '',
      });
      setPhotoUrlInput(user.avatar || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const isGoogleUser = user.email.toLowerCase().includes('gmail.com') || user.authProvider === 'google';

  const handleSyncGooglePhoto = () => {
    const googleAvatar = getGoogleAvatarUrl(user.email, user.name);
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        avatar: googleAvatar,
        authProvider: 'google',
      });
    }
    setPhotoUrlInput(googleAvatar);
    setSyncMessage('Synced profile picture from Google Account!');
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const handleSaveCustomPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser && photoUrlInput.trim()) {
      onUpdateUser({
        ...user,
        avatar: photoUrlInput.trim(),
      });
      setIsEditingPhoto(false);
      setSyncMessage('Profile picture updated successfully!');
      setTimeout(() => setSyncMessage(null), 3000);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        phone: addressForm.phone.trim(),
        address: {
          street: addressForm.street.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          postalCode: addressForm.postalCode.trim(),
          country: addressForm.country.trim(),
        },
      });
    }
    setIsEditingAddress(false);
    setSyncMessage('Home address & contact details updated successfully!');
    setTimeout(() => setSyncMessage(null), 3000);
  };

  const hasAddress = Boolean(
    user.address && (user.address.street || user.address.city || user.address.country)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FDFBF7] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E2D8] p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-[#2D2D2D]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#FAF7F2] transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-[#E8E2D8]">
          <div className="relative group">
            <UserAvatar
              name={user.name}
              avatarUrl={user.avatar}
              size="lg"
              showGoogleBadge={isGoogleUser}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-xl text-[#2D2D2D] leading-none">{user.name}</h3>
              <span className="bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {user.role}
              </span>
              {isGoogleUser && (
                <span className="bg-white text-[#1a73e8] border border-[#1a73e8]/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google Account</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#A68F7A] mt-1">{user.email}</p>
            {user.phone && <p className="text-xs text-[#5F584E] mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3 text-[#8A9A5B]" /> {user.phone}</p>}

            {/* Photo Action Links */}
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleSyncGooglePhoto}
                className="text-[11px] font-semibold text-[#1a73e8] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync from Google</span>
              </button>
              <span className="text-[#E8E2D8]">•</span>
              <button
                type="button"
                onClick={() => setIsEditingPhoto(!isEditingPhoto)}
                className="text-[11px] font-semibold text-[#8A9A5B] hover:underline"
              >
                {isEditingPhoto ? 'Cancel Edit' : 'Edit Photo URL'}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-[#C17F59] bg-[#FAF0EB] hover:bg-[#F5E2D8] transition flex items-center gap-1 border border-[#C17F59]/20 self-start sm:self-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {syncMessage && (
          <div className="mt-3 p-2.5 bg-[#F0F4E8] text-[#3F4C27] text-xs rounded-xl border border-[#8A9A5B]/30 flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-[#8A9A5B]" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Photo URL Form Toggle */}
        {isEditingPhoto && (
          <form onSubmit={handleSaveCustomPhoto} className="mt-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D8] flex gap-2">
            <input
              type="url"
              value={photoUrlInput}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              placeholder="Paste Google profile picture URL or photo link..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#E8E2D8] bg-white outline-hidden focus:border-[#8A9A5B]"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-[#3F4C27] text-white text-xs font-bold rounded-xl hover:bg-[#323D1F] transition"
            >
              Save
            </button>
          </form>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 py-6 space-y-6">
          
          {/* User's Home & Delivery Address Card */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E2D8] transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]/80 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EFE9DF] text-[#3F4C27] flex items-center justify-center">
                  <Home className="w-4 h-4 text-[#8A9A5B]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2D2D2D]">Home & Delivery Address</h4>
                  <p className="text-[11px] text-[#A68F7A]">Default destination for package deliveries & invoices</p>
                </div>
              </div>

              {!isEditingAddress && (
                <button
                  id="edit-home-address-btn"
                  onClick={() => setIsEditingAddress(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#3F4C27] bg-[#F0F4E8] hover:bg-[#E2ECD5] border border-[#8A9A5B]/30 flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{hasAddress ? 'Edit Address' : 'Add Address'}</span>
                </button>
              )}
            </div>

            {/* Read-Only Display Mode */}
            {!isEditingAddress ? (
              hasAddress ? (
                <div className="text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#8A9A5B] mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-semibold text-[#2D2D2D]">{user.address?.street}</p>
                      <p className="text-[#5F584E]">
                        {user.address?.city}
                        {user.address?.state ? `, ${user.address.state}` : ''}
                        {user.address?.postalCode ? ` - ${user.address.postalCode}` : ''}
                      </p>
                      <p className="text-[#A68F7A] font-medium">{user.address?.country}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#E8E2D8]/60 text-[#5F584E]">
                      <Phone className="w-3.5 h-3.5 text-[#8A9A5B]" />
                      <span>Phone: <span className="font-medium text-[#2D2D2D]">{user.phone}</span></span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-[#A68F7A] text-xs space-y-2">
                  <p>No home or delivery address saved yet.</p>
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#3F4C27] hover:underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Click here to set your delivery address</span>
                  </button>
                </div>
              )
            ) : (
              /* Address Editing Form */
              <form onSubmit={handleSaveAddress} className="space-y-3 pt-1 animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                    Street Address / House / Apartment No.
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      placeholder="e.g. 142 Regent Boulevard, Suite 5A"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-white outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="e.g. London / Lahore / San Francisco"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-white outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                      State / Province / Region
                    </label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      placeholder="e.g. Greater London / Punjab / CA"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-white outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                      Postal Code / ZIP
                    </label>
                    <input
                      type="text"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      placeholder="e.g. W1B 5AH / 54000 / 94107"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-white outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      placeholder="e.g. United Kingdom, Pakistan, USA, UAE"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-white outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5F584E] mb-1">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="e.g. +44 7700 900077"
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E8E2D8] bg-white outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingAddress(false);
                      setAddressForm({
                        street: user.address?.street || '',
                        city: user.address?.city || '',
                        state: user.address?.state || '',
                        postalCode: user.address?.postalCode || '',
                        country: user.address?.country || 'United Kingdom',
                        phone: user.phone || '',
                      });
                    }}
                    className="px-4 py-2 text-xs font-semibold text-[#5F584E] hover:bg-[#EFE9DF] rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="save-home-address-btn"
                    className="px-4 py-2 bg-[#3F4C27] hover:bg-[#323D1F] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Address</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Orders History Tracker (Placed by Processing First) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-[#2D2D2D] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#8A9A5B]" />
                <span>Order History & Live Tracking ({orders.length})</span>
              </h4>

              {orders.length > 0 && (
                <span className="text-[10px] bg-[#F0F4E8] text-[#3F4C27] font-semibold px-2.5 py-0.5 rounded-full border border-[#8A9A5B]/30 flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A9A5B] animate-pulse" />
                  <span>Processing Orders First</span>
                </span>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D8] text-[#A68F7A] text-xs">
                You have not placed any orders yet.
              </div>
            ) : (
              [...orders]
                .sort((a, b) => {
                  const getPriority = (status: Order['status']): number => {
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
                  const prioA = getPriority(a.status);
                  const prioB = getPriority(b.status);
                  if (prioA !== prioB) return prioA - prioB;
                  const dateA = new Date(a.date).getTime() || 0;
                  const dateB = new Date(b.date).getTime() || 0;
                  if (dateA !== dateB) return dateB - dateA;
                  return b.id.localeCompare(a.id);
                })
                .map((ord) => {
                  const isProcessing = ord.status === 'Processing';
                  return (
                    <div
                      key={ord.id}
                      className={`p-4 rounded-2xl border space-y-3 text-xs transition-all ${
                        isProcessing
                          ? 'bg-[#FAF8F4] border-[#8A9A5B] border-l-4 border-l-[#3F4C27] shadow-xs'
                          : 'bg-[#FAF7F2] border-[#E8E2D8]'
                      }`}
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D8]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-[#2D2D2D]">{ord.orderNumber}</span>
                          <span className="text-[#A68F7A] text-[11px]">Date: {ord.date}</span>
                          {isProcessing && (
                            <span className="text-[10px] font-bold text-[#3F4C27] bg-[#F0F4E8] px-2 py-0.5 rounded-full border border-[#8A9A5B]/30 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8A9A5B] animate-pulse" />
                              <span>Live Processing</span>
                            </span>
                          )}
                        </div>

                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                            isProcessing
                              ? 'bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/40'
                              : ord.status === 'Delivered'
                              ? 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]'
                              : ord.status === 'Shipped'
                              ? 'bg-[#FAF0EB] text-[#C17F59] border border-[#C17F59]/30'
                              : 'bg-white text-[#5F584E] border border-[#E8E2D8]'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      {/* Status Timeline */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                        <div className="flex flex-col items-center gap-1 text-[#3F4C27] font-semibold">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-[#3F4C27]" />
                            {isProcessing && <span className="w-1.5 h-1.5 rounded-full bg-[#3F4C27] animate-ping" />}
                          </div>
                          <span>{isProcessing ? 'Processing in Atelier' : 'Ordered'}</span>
                        </div>
                        <div
                          className={`flex flex-col items-center gap-1 font-semibold ${
                            ord.status === 'Shipped' || ord.status === 'Delivered'
                              ? 'text-[#3F4C27]'
                              : 'text-[#D8CFC4]'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>In Transit</span>
                        </div>
                        <div
                          className={`flex flex-col items-center gap-1 font-semibold ${
                            ord.status === 'Delivered' ? 'text-[#3F4C27]' : 'text-[#D8CFC4]'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Delivered</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 pt-2 border-t border-[#E8E2D8]">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[#5F584E]">
                            <span>
                              {it.name} ({it.selectedSize ? `Size: ${it.selectedSize}` : ''}) × {it.qty}
                            </span>
                            <span className="font-semibold text-[#2D2D2D]">
                              {formatPrice(it.price * it.qty, currency)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
                        <span className="text-[#5F584E]">Payment:</span>
                        {ord.paymentMethod === 'googlepay' ? (
                          <div className="flex flex-col items-end">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-[#dadce0] font-semibold text-[#202124] text-[11px]">
                              <GoogleGLogo className="w-3 h-3" />
                              <span>Google Pay</span>
                            </span>
                            <span className="text-[10px] text-[#188038] font-semibold mt-0.5">
                              ✓ Deposited to Faruk Karim (farukarim@gmail.com)
                            </span>
                          </div>
                        ) : ord.paymentMethod === 'cod' ? (
                          <span className="text-[11px] font-semibold text-[#C17F59] bg-[#FAF0EB] px-2 py-0.5 rounded-md border border-[#C17F59]/30">
                            Cash on Delivery
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#5F584E] bg-white px-2 py-0.5 rounded-md border border-[#E8E2D8]">
                            Credit Card
                          </span>
                        )}
                      </div>

                      <div className="pt-1.5 border-t border-[#E8E2D8] flex justify-between font-bold text-[#2D2D2D]">
                        <span>Total Paid</span>
                        <span className="text-[#3F4C27] font-serif">{formatPrice(ord.total, currency)}</span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

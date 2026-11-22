import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  ArrowRight,
  Lock,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CurrencyCode, Order, User } from '../types';
import { formatPrice } from '../utils/currency';
import { getStoredMerchantSettings } from '../utils/storage';
import { GoogleGLogo, GooglePayLogo, GooglePayButton, GooglePaySheet, GooglePayConfirmData } from './GooglePaySheet';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: CurrencyCode;
  currentUser: User | null;
  appliedCoupon: string | null;
  onOrderPlaced: (order: Order) => void;
  initialPaymentMethod?: 'card' | 'cod' | 'googlepay';
  initialStep?: 1 | 2 | 3;
  autoOpenGooglePaySheet?: boolean;
  directItems?: CartItem[];
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  currentUser,
  appliedCoupon,
  onOrderPlaced,
  initialPaymentMethod = 'googlepay',
  initialStep = 1,
  autoOpenGooglePaySheet = false,
  directItems,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialStep);

  // Form states
  const [fullName, setFullName] = useState(currentUser?.name || 'Faruk Karim');
  const [email, setEmail] = useState(currentUser?.email || 'farukarim@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  const [street, setStreet] = useState(currentUser?.address?.street || '742 Evergreen Terrace');
  const [city, setCity] = useState(currentUser?.address?.city || 'San Francisco');
  const [state, setState] = useState(currentUser?.address?.state || 'CA');
  const [postalCode, setPostalCode] = useState(currentUser?.address?.postalCode || '94107');
  const [country, setCountry] = useState(currentUser?.address?.country || 'United States');

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'googlepay' | 'applepay' | 'paypal'>(initialPaymentMethod);

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Faruk Karim');

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGooglePaySheet, setShowGooglePaySheet] = useState(false);
  const [paidWithCardLast4, setPaidWithCardLast4] = useState('8842');

  const activeCart = directItems && directItems.length > 0 ? directItems : cart;

  // Sync with initial props and user profile
  React.useEffect(() => {
    if (isOpen) {
      if (initialPaymentMethod) setPaymentMethod(initialPaymentMethod);
      if (initialStep) setStep(initialStep);
      if (currentUser) {
        if (currentUser.name) {
          setFullName(currentUser.name);
          setCardHolder(currentUser.name);
        }
        if (currentUser.email) setEmail(currentUser.email);
        if (currentUser.phone) setPhone(currentUser.phone);
        if (currentUser.address) {
          if (currentUser.address.street) setStreet(currentUser.address.street);
          if (currentUser.address.city) setCity(currentUser.address.city);
          if (currentUser.address.state) setState(currentUser.address.state);
          if (currentUser.address.postalCode) setPostalCode(currentUser.address.postalCode);
          if (currentUser.address.country) setCountry(currentUser.address.country);
        }
      }

      // Automatically pop up Google Pay Sheet if requested
      if (autoOpenGooglePaySheet || (initialPaymentMethod === 'googlepay' && initialStep === 3)) {
        setShowGooglePaySheet(true);
      }
    } else {
      setShowGooglePaySheet(false);
    }
  }, [isOpen, currentUser, initialPaymentMethod, initialStep, autoOpenGooglePaySheet]);

  if (!isOpen) return null;

  // Calculations
  const subtotal = activeCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = appliedCoupon ? (subtotal * 0.15) : 0;
  const shippingFee = deliveryMethod === 'express' ? 15.00 : (subtotal >= 120 ? 0 : 9.99);
  const tax = (subtotal - discountAmount) * 0.05;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + tax);

  const handlePlaceOrder = (overrideMethod?: 'card' | 'cod' | 'googlepay', confirmData?: GooglePayConfirmData) => {
    const finalMethod = overrideMethod || (paymentMethod as 'card' | 'cod' | 'googlepay');
    const finalDeliveryMethod = confirmData?.deliveryMethod || deliveryMethod;
    const finalAddress = confirmData?.shippingAddress || {
      fullName,
      email,
      phone,
      address: street,
      city,
      state,
      postalCode,
      country,
    };

    if (confirmData?.cardLast4) {
      setPaidWithCardLast4(confirmData.cardLast4);
    }

    const finalShippingFee = finalDeliveryMethod === 'express' ? 15.00 : (subtotal >= 120 ? 0 : 9.99);
    const finalGrandTotal = Math.max(0, subtotal - discountAmount + finalShippingFee + tax);

    setIsSubmitting(true);
    setShowGooglePaySheet(false);
    setTimeout(() => {
      const orderNumber = `MW-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      
      const merchantSettings = getStoredMerchantSettings();
      const isGooglePay = finalMethod === 'googlepay';
      const paymentDetails = isGooglePay ? {
        transactionId: confirmData?.transactionId || `GPAY-${orderNumber}`,
        recipientEmail: confirmData?.recipientEmail || merchantSettings.merchantEmail || 'farukarim@gmail.com',
        recipientMerchantName: confirmData?.recipientMerchantName || merchantSettings.merchantName || 'Mehrana Wears (Faruk Karim)',
        settlementStatus: confirmData?.settlementStatus || ('Pending Deposit' as const),
        cardBrand: confirmData?.cardBrand || 'Google Pay UPI',
        cardLast4: confirmData?.cardLast4 || paidWithCardLast4 || 'UPI',
        paidAt: confirmData?.paidAt || new Date().toISOString(),
        payoutDestination: confirmData?.payoutDestination || `UPI: ${merchantSettings.businessUpiId} (${merchantSettings.bankName})`,
      } : undefined;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: new Date().toISOString().split('T')[0],
        items: activeCart.map((c) => ({
          productId: c.productId,
          name: c.name,
          price: c.price,
          image_url: c.image_url,
          selectedSize: c.selectedSize,
          selectedColor: c.selectedColor.name,
          qty: c.qty,
        })),
        shippingAddress: finalAddress,
        deliveryMethod: finalDeliveryMethod,
        paymentMethod: finalMethod,
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon || undefined,
        shippingFee: finalShippingFee,
        tax,
        total: finalGrandTotal,
        status: isGooglePay && paymentDetails?.settlementStatus === 'Pending Deposit' ? 'Pending' : 'Processing',
        trackingNumber,
        estimatedDelivery: new Date(Date.now() + (finalDeliveryMethod === 'express' ? 2 : 4) * 86400000).toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        paymentDetails,
      };

      setPlacedOrder(newOrder);
      onOrderPlaced(newOrder);
      setIsSubmitting(false);
      setStep(4);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#064e3b', '#059669'],
        });
      } catch {
        // Safe fallback
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FDFBF7] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E2D8] animate-in zoom-in-95 duration-200 my-6 flex flex-col max-h-[92vh] text-[#2D2D2D]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Checkout Header */}
        <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                className="p-1.5 rounded-lg hover:bg-[#EFE9DF] text-[#5F584E] transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="font-serif font-bold text-xl text-[#2D2D2D] leading-none">
                {step === 4 ? 'Order Confirmation' : 'Secure Checkout'}
              </h3>
              <p className="text-xs text-[#A68F7A] mt-1">
                {step === 1 && 'Step 1 of 3: Shipping & Contact Address'}
                {step === 2 && 'Step 2 of 3: Dispatch & Delivery Option'}
                {step === 3 && 'Step 3 of 3: Payment & Order Finalization'}
                {step === 4 && 'Thank you for choosing Mehrana Wears'}
              </p>
            </div>
          </div>

          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#EFE9DF] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        {step < 4 && (
          <div className="grid grid-cols-3 border-b border-[#E8E2D8] bg-white">
            <div className={`p-2.5 text-center text-xs font-semibold border-b-2 transition-all ${
              step === 1 ? 'border-[#3F4C27] text-[#3F4C27] bg-[#F0F4E8]/60' : 'border-transparent text-[#A68F7A]'
            }`}>
              1. Address
            </div>
            <div className={`p-2.5 text-center text-xs font-semibold border-b-2 transition-all ${
              step === 2 ? 'border-[#3F4C27] text-[#3F4C27] bg-[#F0F4E8]/60' : 'border-transparent text-[#A68F7A]'
            }`}>
              2. Shipping
            </div>
            <div className={`p-2.5 text-center text-xs font-semibold border-b-2 transition-all ${
              step === 3 ? 'border-[#3F4C27] text-[#3F4C27] bg-[#F0F4E8]/60' : 'border-transparent text-[#A68F7A]'
            }`}>
              3. Payment
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#2D2D2D]">Contact & Delivery Address</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:bg-white focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] outline-hidden text-[#2D2D2D] placeholder-[#A68F7A]"
                    placeholder="e.g. Faruk Karim"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:bg-white focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] outline-hidden text-[#2D2D2D] placeholder-[#A68F7A]"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:bg-white focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] outline-hidden text-[#2D2D2D] placeholder-[#A68F7A]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">Country / Region *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:bg-white focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] outline-hidden text-[#2D2D2D] placeholder-[#A68F7A]"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5F584E] mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:bg-white focus:border-[#8A9A5B] focus:ring-1 focus:ring-[#8A9A5B] outline-hidden text-[#2D2D2D] placeholder-[#A68F7A]"
                  placeholder="Street name, apartment, suite, unit, etc."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:bg-white focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:bg-white focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5F584E] mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D8] text-xs p-2.5 rounded-xl focus:bg-white focus:border-[#8A9A5B] outline-hidden text-[#2D2D2D]"
                  />
                </div>
              </div>

              <button
                id="checkout-step1-next-btn"
                onClick={() => {
                  if (!fullName || !email || !street || !city || !postalCode) {
                    alert('Please complete all required fields.');
                    return;
                  }
                  setStep(2);
                }}
                className="w-full py-3.5 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Shipping Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#2D2D2D]">Select Dispatch & Delivery Speed</h4>

              <div className="space-y-3">
                {/* Standard Shipping */}
                <label
                  onClick={() => setDeliveryMethod('standard')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === 'standard'
                      ? 'border-[#8A9A5B] bg-[#F0F4E8] ring-2 ring-[#8A9A5B]/20'
                      : 'border-[#E8E2D8] bg-white hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F4E8] text-[#3F4C27] flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-[#2D2D2D]">Complimentary Standard Delivery</h5>
                      <p className="text-[11px] text-[#6B655B]">Delivered within 3-5 business days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-[#3F4C27]">
                      {subtotal >= 120 ? 'FREE' : formatPrice(9.99, currency)}
                    </span>
                  </div>
                </label>

                {/* Priority Express Courier */}
                <label
                  onClick={() => setDeliveryMethod('express')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'border-[#8A9A5B] bg-[#F0F4E8] ring-2 ring-[#8A9A5B]/20'
                      : 'border-[#E8E2D8] bg-white hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] text-[#C17F59] flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-[#2D2D2D]">DHL Express Priority Courier</h5>
                      <p className="text-[11px] text-[#6B655B]">Guaranteed 1-2 day air shipment with tracking</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-[#2D2D2D]">{formatPrice(15.00, currency)}</span>
                  </div>
                </label>
              </div>

              {/* Delivery Address Review */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] text-xs space-y-1">
                <span className="font-bold text-[#5F584E] block">Delivering to:</span>
                <p className="text-[#2D2D2D] font-medium">{fullName} • {phone}</p>
                <p className="text-[#6B655B]">{street}, {city}, {postalCode}, {country}</p>
              </div>

              <button
                id="checkout-step2-next-btn"
                onClick={() => setStep(3)}
                className="w-full py-3.5 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs rounded-2xl transition shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#2D2D2D]">Select Secure Payment Method</h4>

              {/* Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="checkout-method-googlepay-btn"
                  onClick={() => setPaymentMethod('googlepay')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'googlepay'
                      ? 'border-[#4285F4] bg-[#F8F9FA] text-[#202124] ring-2 ring-[#4285F4]/30 shadow-xs'
                      : 'border-[#E8E2D8] text-[#5F584E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <GoogleGLogo className="w-4 h-4" />
                    <span className="font-bold text-[#202124]">Pay</span>
                  </div>
                  <span className="text-[10px] text-[#1a73e8] font-bold">1-Click / Fast</span>
                </button>

                <button
                  type="button"
                  id="checkout-method-card-btn"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'card'
                      ? 'border-[#8A9A5B] bg-[#F0F4E8] text-[#3F4C27] ring-2 ring-[#8A9A5B]/20 shadow-xs'
                      : 'border-[#E8E2D8] text-[#5F584E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#8A9A5B]" />
                  <span>Credit Card</span>
                  <span className="text-[10px] text-[#A68F7A]">Visa / Master</span>
                </button>

                <button
                  type="button"
                  id="checkout-method-cod-btn"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'cod'
                      ? 'border-[#C17F59] bg-[#FAF0EB] text-[#C17F59] ring-2 ring-[#C17F59]/20 shadow-xs'
                      : 'border-[#E8E2D8] text-[#5F584E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#C17F59]" />
                  <span>Cash on Deliv.</span>
                  <span className="text-[10px] text-[#A68F7A]">Handover Cash</span>
                </button>
              </div>

              {/* Google Pay Form & Express Sheet trigger */}
              {paymentMethod === 'googlepay' && (
                <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-[#dadce0] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GoogleGLogo className="w-5 h-5" />
                      <span className="font-bold text-sm text-[#202124]">Google Pay Connected</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#188038] bg-[#e6f4ea] px-2.5 py-0.5 rounded-full border border-[#ceead6] flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Verified Google Account</span>
                    </span>
                  </div>

                  {/* Merchant UPI & Direct GPay Details */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#dadce0] space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#dadce0]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-[10px]">
                          G
                        </div>
                        <span className="text-[#5f6368] font-medium">Paying to:</span>
                        <span className="font-semibold text-[#202124]">{getStoredMerchantSettings().merchantName}</span>
                      </div>
                      <span className="text-[10px] text-[#188038] font-semibold">Direct UPI / GPay</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-[#5f6368]">Merchant UPI ID:</span>
                      <span className="font-mono font-bold text-[#1a73e8]">{getStoredMerchantSettings().businessUpiId}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#5f6368]">Merchant Email:</span>
                      <span className="font-mono text-[#202124]">{getStoredMerchantSettings().merchantEmail}</span>
                    </div>
                  </div>

                  {/* Express Google Pay Direct Button */}
                  <div className="pt-1">
                    <GooglePayButton
                      onClick={() => setShowGooglePaySheet(true)}
                      total={grandTotal}
                      currency={currency}
                      variant="pay"
                      className="w-full"
                    />
                    <p className="text-[11px] text-[#5f6368] text-center mt-2 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#188038]" />
                      <span>Encrypted with biometric passkey authentication. Fast & seamless.</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#5F584E]">Cardholder Information</span>
                    <span className="text-[10px] text-[#3F4C27] font-semibold bg-[#F0F4E8] border border-[#8A9A5B]/30 px-2 py-0.5 rounded">
                      256-Bit SSL Secured
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F584E] mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F584E] mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] font-mono text-[#2D2D2D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5F584E] mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] font-mono text-[#2D2D2D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5F584E] mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-white border border-[#E8E2D8] text-xs p-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] font-mono text-[#2D2D2D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="bg-[#FAF0EB] p-4 rounded-2xl border border-[#C17F59]/30 text-xs text-[#C17F59] space-y-1">
                  <p className="font-bold">Cash on Delivery Policy</p>
                  <p className="text-[11px] text-[#A86A46]">
                    Please prepare exact cash of <strong>{formatPrice(grandTotal, currency)}</strong> upon courier handover.
                  </p>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] text-xs space-y-1.5">
                <div className="flex justify-between text-[#5F584E]">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-[#2D2D2D]">{formatPrice(subtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#8A9A5B] font-semibold">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5F584E]">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee, currency)}</span>
                </div>
                <div className="flex justify-between text-[#5F584E]">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(tax, currency)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2D2D2D] pt-2 border-t border-[#E8E2D8]">
                  <span className="font-serif">Total to Pay</span>
                  <span className="font-serif text-[#3F4C27] text-base">{formatPrice(grandTotal, currency)}</span>
                </div>
              </div>

              {/* Submit Button */}
              {paymentMethod === 'googlepay' ? (
                <button
                  id="checkout-place-order-btn"
                  onClick={() => setShowGooglePaySheet(true)}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black hover:bg-[#202124] text-white font-bold text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <GoogleGLogo className="w-5 h-5 shrink-0" />
                  <span>Authorize & Pay with Google Pay ({formatPrice(grandTotal, currency)})</span>
                </button>
              ) : (
                <button
                  id="checkout-place-order-btn"
                  onClick={() => handlePlaceOrder()}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#C17F59] hover:bg-[#A86A46] text-white font-bold text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processing Payment & Securing Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-white" />
                      <span>Authorize & Place Order ({formatPrice(grandTotal, currency)})</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* STEP 4: Success Receipt */}
          {step === 4 && placedOrder && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F0F4E8] text-[#3F4C27] flex items-center justify-center mx-auto shadow-inner border border-[#8A9A5B]/30">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3F4C27] bg-[#F0F4E8] border border-[#8A9A5B]/30 px-3 py-1 rounded-full">
                  Order Successfully Confirmed
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#2D2D2D] mt-2">
                  Thank You, {fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-[#6B655B] mt-1">
                  We have dispatched your order details to <strong>{email}</strong>.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E2D8] text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D8]">
                  <div>
                    <span className="text-[#A68F7A] block text-[10px]">Order Number</span>
                    <span className="font-mono font-bold text-[#2D2D2D] text-sm">{placedOrder.orderNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#A68F7A] block text-[10px]">Tracking Number</span>
                    <span className="font-mono font-bold text-[#3F4C27]">{placedOrder.trackingNumber}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#A68F7A] block text-[10px] mb-1">Estimated Arrival</span>
                  <span className="font-semibold text-[#2D2D2D]">{placedOrder.estimatedDelivery}</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E8E2D8]">
                  <span className="text-[#5F584E] font-bold block text-[10px] uppercase">Purchased Items</span>
                  {placedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-[#5F584E]">
                        {it.name} (Size: {it.selectedSize}) × {it.qty}
                      </span>
                      <span className="font-bold text-[#2D2D2D]">{formatPrice(it.price * it.qty, currency)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E8E2D8] flex justify-between items-center text-xs">
                  <span className="text-[#5F584E]">Payment Method</span>
                  {placedOrder.paymentMethod === 'googlepay' ? (
                    <span className="flex items-center gap-1.5 font-bold text-[#202124] bg-white px-2.5 py-1 rounded-lg border border-[#dadce0]">
                      <GoogleGLogo className="w-3.5 h-3.5" />
                      <span>Google Pay (•••• {paidWithCardLast4})</span>
                    </span>
                  ) : placedOrder.paymentMethod === 'cod' ? (
                    <span className="font-bold text-[#C17F59] bg-[#FAF0EB] px-2.5 py-1 rounded-lg border border-[#C17F59]/30">
                      Cash on Delivery
                    </span>
                  ) : (
                    <span className="font-bold text-[#2D2D2D] bg-white px-2.5 py-1 rounded-lg border border-[#E8E2D8]">
                      Credit Card (•••• 4242)
                    </span>
                  )}
                </div>

                {placedOrder.paymentMethod === 'googlepay' && (
                  <div className="bg-[#e6f4ea] border border-[#ceead6] rounded-xl p-3 space-y-2 text-xs text-[#137333]">
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#188038]" />
                        <span>
                          {placedOrder.paymentDetails?.settlementStatus === 'Pending Deposit'
                            ? 'Google Pay UTR Submitted — Pending Merchant Verification'
                            : 'Google Pay Payment Verified'}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#188038]">
                        {placedOrder.paymentDetails?.transactionId || `GPAY-${placedOrder.orderNumber}`}
                      </span>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 border border-[#ceead6] text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#5f6368]">Sent to Merchant:</span>
                        <span className="font-bold text-[#202124]">
                          {placedOrder.paymentDetails?.recipientMerchantName || 'Mehrana Wears (Faruk Karim)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5f6368]">Destination:</span>
                        <span className="font-medium text-[#188038]">
                          {placedOrder.paymentDetails?.payoutDestination || 'Direct UPI / Bank Account'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-[#E8E2D8] flex justify-between items-center text-sm font-bold text-[#2D2D2D]">
                  <span>Grand Total Paid</span>
                  <span className="text-[#3F4C27] font-serif text-base">{formatPrice(placedOrder.total, currency)}</span>
                </div>
              </div>

              {/* Receipt Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 border border-[#E8E2D8] hover:bg-[#EFE9DF] text-[#5F584E] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#3F4C27] hover:bg-[#323D1F] text-white rounded-xl text-xs font-semibold transition shadow-md"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Google Pay Interactive Authorization Sheet */}
      <GooglePaySheet
        isOpen={showGooglePaySheet}
        onClose={() => setShowGooglePaySheet(false)}
        onConfirm={(confirmData) => handlePlaceOrder('googlepay', confirmData)}
        total={grandTotal}
        subtotal={subtotal}
        discount={discountAmount}
        currency={currency}
        userEmail={email}
        userName={fullName}
        userPhone={phone}
        shippingAddress={{
          fullName,
          street,
          city,
          state,
          postalCode,
          country,
        }}
        orderItems={activeCart.map((c) => ({
          name: c.name,
          qty: c.qty,
          price: c.price,
          image_url: c.image_url,
          selectedSize: c.selectedSize,
          selectedColor: c.selectedColor?.name,
        }))}
        orderItemCount={activeCart.reduce((sum, item) => sum + item.qty, 0)}
      />
    </div>
  );
};

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

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: CurrencyCode;
  currentUser: User | null;
  appliedCoupon: string | null;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  currentUser,
  appliedCoupon,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [fullName, setFullName] = useState(currentUser?.name || 'Faruk Karim');
  const [email, setEmail] = useState(currentUser?.email || 'customer@mehrana.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  const [street, setStreet] = useState(currentUser?.address?.street || '742 Evergreen Terrace');
  const [city, setCity] = useState(currentUser?.address?.city || 'San Francisco');
  const [state, setState] = useState(currentUser?.address?.state || 'CA');
  const [postalCode, setPostalCode] = useState(currentUser?.address?.postalCode || '94107');
  const [country, setCountry] = useState(currentUser?.address?.country || 'United States');

  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'googlepay' | 'applepay' | 'paypal'>('card');

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Faruk Karim');

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = appliedCoupon ? (subtotal * 0.15) : 0;
  const shippingFee = deliveryMethod === 'express' ? 15.00 : (subtotal >= 120 ? 0 : 9.99);
  const tax = (subtotal - discountAmount) * 0.05;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + tax);

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderNumber = `MW-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: new Date().toISOString().split('T')[0],
        items: cart.map((c) => ({
          productId: c.productId,
          name: c.name,
          price: c.price,
          image_url: c.image_url,
          selectedSize: c.selectedSize,
          selectedColor: c.selectedColor.name,
          qty: c.qty,
        })),
        shippingAddress: {
          fullName,
          email,
          phone,
          address: street,
          city,
          state,
          postalCode,
          country,
        },
        deliveryMethod,
        paymentMethod,
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon || undefined,
        shippingFee,
        tax,
        total: grandTotal,
        status: 'Processing',
        trackingNumber,
        estimatedDelivery: new Date(Date.now() + (deliveryMethod === 'express' ? 2 : 4) * 86400000).toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      };

      setPlacedOrder(newOrder);
      onOrderPlaced(newOrder);
      setIsSubmitting(false);
      setStep(4);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#064e3b', '#059669', '#fbbf24', '#f59e0b'],
        });
      } catch {
        // Safe fallback
      }
    }, 1200);
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
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'card'
                      ? 'border-[#8A9A5B] bg-[#F0F4E8] text-[#3F4C27] ring-2 ring-[#8A9A5B]/20'
                      : 'border-[#E8E2D8] text-[#5F584E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('googlepay')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'googlepay'
                      ? 'border-[#8A9A5B] bg-[#F0F4E8] text-[#3F4C27] ring-2 ring-[#8A9A5B]/20'
                      : 'border-[#E8E2D8] text-[#5F584E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span className="font-bold text-xs">GPay / Apple</span>
                  <span>1-Click</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'cod'
                      ? 'border-[#8A9A5B] bg-[#F0F4E8] text-[#3F4C27] ring-2 ring-[#8A9A5B]/20'
                      : 'border-[#E8E2D8] text-[#5F584E] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Cash on Deliv.</span>
                </button>
              </div>

              {/* Card Form */}
              {paymentMethod === 'card' && (
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#5F584E]">Cardholder Information</span>
                    <span className="text-[10px] text-[#3F4C27] font-semibold bg-[#F0F4E8] border border-[#8A9A5B]/30 px-2 py-0.5 rounded">
                      Sandbox Test Mode
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

              {paymentMethod === 'googlepay' && (
                <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E2D8] text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#3F4C27] text-white flex items-center justify-center mx-auto font-bold text-sm">
                    GPay
                  </div>
                  <h5 className="font-bold text-xs text-[#2D2D2D]">Instant One-Touch Payment</h5>
                  <p className="text-[11px] text-[#6B655B]">
                    Your authenticated payment method will be charged seamlessly upon placing order.
                  </p>
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
              <button
                id="checkout-place-order-btn"
                onClick={handlePlaceOrder}
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
    </div>
  );
};

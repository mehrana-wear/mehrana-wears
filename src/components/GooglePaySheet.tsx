import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  Lock,
  X,
  MapPin,
  ChevronDown,
  ChevronUp,
  Edit2,
  Copy,
  Smartphone,
  QrCode,
  CreditCard,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { getStoredMerchantSettings } from '../utils/storage';

declare global {
  interface Window {
    google?: {
      payments?: {
        api?: {
          PaymentsClient: new (options: { environment: 'TEST' | 'PRODUCTION' }) => {
            isReadyToPay: (request: Record<string, unknown>) => Promise<{ result: boolean }>;
            loadPaymentData: (request: Record<string, unknown>) => Promise<{
              paymentMethodData?: {
                info?: {
                  cardNetwork?: string;
                  cardDetails?: string;
                };
                tokenizationData?: {
                  token?: string;
                };
              };
            }>;
          };
        };
      };
    };
  }
}

export const GoogleGLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const GooglePayLogo: React.FC<{ light?: boolean; className?: string }> = ({ light = false, className = '' }) => (
  <div className={`inline-flex items-center gap-1.5 font-medium tracking-tight select-none ${className}`}>
    <GoogleGLogo className="w-4 h-4 shrink-0" />
    <span className={`font-semibold text-sm ${light ? 'text-white' : 'text-[#3c4043]'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      Pay
    </span>
  </div>
);

export const GooglePayBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#dadce0] text-[#3c4043] text-xs font-semibold shadow-2xs ${className}`}>
    <GoogleGLogo className="w-3.5 h-3.5" />
    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Pay</span>
  </span>
);

interface GooglePayButtonProps {
  onClick: () => void;
  disabled?: boolean;
  total?: number;
  currency?: CurrencyCode;
  variant?: 'buy' | 'pay' | 'inline';
  className?: string;
}

export const GooglePayButton: React.FC<GooglePayButtonProps> = ({
  onClick,
  disabled = false,
  total,
  currency,
  variant = 'buy',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative overflow-hidden rounded-2xl bg-black hover:bg-[#202124] active:bg-[#303134] text-white font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3.5 px-5 select-none ${className}`}
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      title="Pay securely with Google Pay"
    >
      <div className="flex items-center gap-1.5">
        <GoogleGLogo className="w-5 h-5 shrink-0" />
        <span className="font-semibold text-sm sm:text-base tracking-tight text-white">
          {variant === 'buy' ? 'Buy with ' : 'Pay with '}
          <span className="font-bold">Pay</span>
        </span>
      </div>

      {total !== undefined && currency && (
        <span className="text-xs font-normal text-white/90 border-l border-white/20 pl-2.5 ml-1">
          {formatPrice(total, currency)}
        </span>
      )}
    </button>
  );
};

export interface GooglePayConfirmData {
  deliveryMethod: 'standard' | 'express';
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  cardBrand: string;
  cardLast4: string;
  transactionId?: string;
  recipientEmail?: string;
  recipientMerchantName?: string;
  settlementStatus?: 'Received & Settled' | 'Pending Deposit';
  paidAt?: string;
  payoutDestination?: string;
}

interface GooglePaySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmData?: GooglePayConfirmData) => void;
  total: number;
  subtotal?: number;
  discount?: number;
  currency: CurrencyCode;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  shippingAddress?: {
    fullName?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  orderItems?: {
    name: string;
    qty: number;
    price: number;
    image_url?: string;
    selectedSize?: string;
    selectedColor?: string;
  }[];
  orderItemCount: number;
}

export const GooglePaySheet: React.FC<GooglePaySheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  total,
  subtotal,
  discount = 0,
  currency,
  userEmail = 'farukarim@gmail.com',
  userName = 'Faruk Karim',
  userPhone = '+1 (555) 234-5678',
  shippingAddress,
  orderItems = [],
  orderItemCount,
}) => {
  const [payMode, setPayMode] = useState<'upi' | 'gpay_api'>('upi');
  const [selectedDelivery, setSelectedDelivery] = useState<'standard' | 'express'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showItemsBreakdown, setShowItemsBreakdown] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Real UPI / GPay Transfer Verification state
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Official Google Pay Web API state
  const [gpayApiError, setGpayApiError] = useState<string | null>(null);

  // Address editable state inside sheet
  const [recipientName, setRecipientName] = useState(userName);
  const [recipientPhone, setRecipientPhone] = useState(userPhone);
  const [streetAddress, setStreetAddress] = useState(shippingAddress?.street || '742 Evergreen Terrace');
  const [city, setCity] = useState(shippingAddress?.city || 'San Francisco');
  const [state, setState] = useState(shippingAddress?.state || 'CA');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '94107');
  const [country, setCountry] = useState(shippingAddress?.country || 'United States');

  const merchantSettings = getStoredMerchantSettings();

  useEffect(() => {
    if (userName) setRecipientName(userName);
    if (userPhone) setRecipientPhone(userPhone);
    if (shippingAddress) {
      if (shippingAddress.street) setStreetAddress(shippingAddress.street);
      if (shippingAddress.city) setCity(shippingAddress.city);
      if (shippingAddress.state) setState(shippingAddress.state);
      if (shippingAddress.postalCode) setPostalCode(shippingAddress.postalCode);
      if (shippingAddress.country) setCountry(shippingAddress.country);
    }
  }, [userName, userPhone, shippingAddress, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setIsEditingAddress(false);
      setUtrInput('');
      setUtrError(null);
      setGpayApiError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Dynamic total calculation
  const calcSubtotal = subtotal !== undefined ? subtotal : total;
  const currentShippingFee = selectedDelivery === 'express' ? 15.0 : calcSubtotal >= 120 ? 0 : 9.99;
  const currentTax = Math.max(0, (calcSubtotal - discount) * 0.05);
  const calculatedGrandTotal = Math.max(0, calcSubtotal - discount + currentShippingFee + currentTax);

  // Build real UPI deep link for Google Pay / UPI apps
  const upiId = merchantSettings.businessUpiId?.trim() || 'farukarim@okaxis';
  const merchantDisplayName = merchantSettings.merchantName?.trim() || 'Mehrana Wears';
  const upiAmount = calculatedGrandTotal.toFixed(2);
  const upiNote = `Mehrana Wears Order (${orderItemCount} item${orderItemCount === 1 ? '' : 's'})`;
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantDisplayName)}&am=${encodeURIComponent(upiAmount)}&cu=INR&tn=${encodeURIComponent(upiNote)}`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Submit real UPI/GPay payment with customer's UTR reference
  const handleConfirmUpiPayment = () => {
    const cleanedUtr = utrInput.trim();
    if (cleanedUtr.length < 6) {
      setUtrError('Please enter your real Google Pay / UPI Transaction ID (UTR) after paying.');
      return;
    }
    setUtrError(null);
    setIsProcessing(true);

    onConfirm({
      deliveryMethod: selectedDelivery,
      shippingAddress: {
        fullName: recipientName,
        email: userEmail,
        phone: recipientPhone,
        address: streetAddress,
        city,
        state,
        postalCode,
        country,
      },
      cardBrand: 'Google Pay UPI',
      cardLast4: cleanedUtr.slice(-4),
      transactionId: cleanedUtr,
      recipientEmail: merchantSettings.merchantEmail || 'farukarim@gmail.com',
      recipientMerchantName: merchantDisplayName,
      settlementStatus: 'Pending Deposit',
      paidAt: new Date().toISOString(),
      payoutDestination: `UPI: ${upiId} (${merchantSettings.bankName})`,
    });
    setIsProcessing(false);
  };

  // Invoke the real Google Pay Web API (pay.js)
  const handleOfficialGooglePayApi = async () => {
    setGpayApiError(null);

    if (!window.google?.payments?.api?.PaymentsClient) {
      setGpayApiError('Google Pay Web SDK is not loaded yet or blocked by your browser. Please use the Direct GPay / UPI QR tab to pay immediately.');
      return;
    }

    setIsProcessing(true);
    try {
      const env = merchantSettings.googlePayEnvironment || 'TEST';
      const gateway = merchantSettings.gatewayName || 'example';
      const gatewayMerchantId = merchantSettings.gatewayMerchantId?.trim() || 'exampleGatewayMerchantId';

      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: env,
      });

      const baseCardPaymentMethod = {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway,
            gatewayMerchantId,
          },
        },
      };

      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [baseCardPaymentMethod],
        merchantInfo: {
          merchantId: merchantSettings.googlePayMerchantId || 'BCR2DN6TZ4K9FARUK',
          merchantName: merchantDisplayName,
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          totalPrice: calculatedGrandTotal.toFixed(2),
          currencyCode: currency === 'PKR' ? 'USD' : currency,
          countryCode: 'US',
        },
      };

      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      const cardNetwork = paymentData?.paymentMethodData?.info?.cardNetwork || 'Google Pay Card';
      const cardLast4 = paymentData?.paymentMethodData?.info?.cardDetails || 'GPAY';
      const txId = `GPAY-${Date.now().toString().slice(-8)}`;

      onConfirm({
        deliveryMethod: selectedDelivery,
        shippingAddress: {
          fullName: recipientName,
          email: userEmail,
          phone: recipientPhone,
          address: streetAddress,
          city,
          state,
          postalCode,
          country,
        },
        cardBrand: cardNetwork,
        cardLast4,
        transactionId: txId,
        recipientEmail: merchantSettings.merchantEmail || 'farukarim@gmail.com',
        recipientMerchantName: merchantDisplayName,
        settlementStatus: env === 'PRODUCTION' ? 'Received & Settled' : 'Pending Deposit',
        paidAt: new Date().toISOString(),
        payoutDestination: `${merchantSettings.bankName} (${merchantSettings.accountNumber})`,
      });
    } catch (err: unknown) {
      const e = err as { statusCode?: string; message?: string };
      if (e?.statusCode === 'CANCELED') {
        setGpayApiError('Google Pay popup was closed before completing payment.');
      } else {
        setGpayApiError(
          e?.message ||
            'Google Pay Web API could not open in this preview frame or requires a live Payment Gateway (Stripe/Razorpay) in Admin Portal. Use the Direct GPay / UPI QR tab to send real money now.'
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-70 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#dadce0] overflow-hidden animate-in slide-in-from-bottom duration-200 flex flex-col max-h-[92vh] text-[#202124]"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Top Google Pay Header Bar */}
        <div className="px-5 py-4 border-b border-[#dadce0] flex items-center justify-between bg-[#F8F9FA]">
          <div className="flex items-center gap-2">
            <GoogleGLogo className="w-5 h-5 shrink-0" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-base text-[#202124] tracking-tight">Google Pay</span>
              <span className="text-[10px] text-[#188038] bg-[#e6f4ea] px-2 py-0.5 rounded-full font-semibold">
                Real Payment
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] transition"
            title="Cancel payment"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher: Direct GPay/UPI QR vs Official Google Pay Card API */}
        <div className="grid grid-cols-2 border-b border-[#dadce0] bg-[#F8F9FA] px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setPayMode('upi')}
            className={`py-2.5 text-xs font-bold rounded-t-xl border-b-2 flex items-center justify-center gap-1.5 transition ${
              payMode === 'upi'
                ? 'border-[#1a73e8] text-[#1a73e8] bg-white'
                : 'border-transparent text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Direct GPay / UPI QR</span>
          </button>
          <button
            type="button"
            onClick={() => setPayMode('gpay_api')}
            className={`py-2.5 text-xs font-bold rounded-t-xl border-b-2 flex items-center justify-center gap-1.5 transition ${
              payMode === 'gpay_api'
                ? 'border-[#1a73e8] text-[#1a73e8] bg-white'
                : 'border-transparent text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Google Pay Card API</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Merchant & Amount Summary */}
          <div className="bg-white rounded-2xl p-4 border border-[#dadce0] space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider block">Paying To</span>
                <span className="font-bold text-sm text-[#202124]">{merchantDisplayName}</span>
                <p className="text-[11px] text-[#5f6368] mt-0.5">
                  {orderItemCount} {orderItemCount === 1 ? 'item' : 'items'} • {merchantSettings.merchantEmail}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider block">Total Amount</span>
                <span className="font-bold text-lg text-[#1a73e8]">
                  {formatPrice(calculatedGrandTotal, currency)}
                </span>
              </div>
            </div>

            {/* Toggle Items Breakdown */}
            {orderItems.length > 0 && (
              <div className="border-t border-[#f1f3f4] pt-2">
                <button
                  type="button"
                  onClick={() => setShowItemsBreakdown(!showItemsBreakdown)}
                  className="flex items-center justify-between w-full text-[11px] font-semibold text-[#1a73e8] hover:text-[#1557b0] py-0.5"
                >
                  <span>{showItemsBreakdown ? 'Hide item details' : 'View order items & charges'}</span>
                  {showItemsBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showItemsBreakdown && (
                  <div className="mt-2 space-y-2 pt-2 border-t border-[#f1f3f4] text-xs">
                    {orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {item.image_url && (
                            <img src={item.image_url} alt="" className="w-8 h-8 rounded-md object-cover border border-[#dadce0] shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-[#202124] text-[11px] truncate">{item.name}</p>
                            <p className="text-[10px] text-[#5f6368]">
                              Qty: {item.qty} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-[#202124] text-xs shrink-0">
                          {formatPrice(item.price * item.qty, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {payMode === 'upi' ? (
            /* TAB 1: REAL DIRECT GPAY / UPI QR + DEEP LINK */
            <div className="space-y-4">
              <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#dadce0] text-center space-y-3">
                <p className="text-xs font-bold text-[#202124]">
                  Scan with Google Pay (or any UPI App) to pay directly
                </p>

                <div className="bg-white p-3 rounded-2xl border border-[#dadce0] inline-block shadow-xs">
                  <QRCodeSVG value={upiUri} size={172} level="M" includeMargin={false} />
                </div>

                {/* Copyable UPI ID */}
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#dadce0] text-xs">
                  <div className="text-left min-w-0">
                    <span className="text-[10px] text-[#5f6368] block">Merchant UPI ID</span>
                    <span className="font-mono font-bold text-[#1a73e8] truncate block">{upiId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2.5 py-1.5 rounded-lg bg-[#e8f0fe] text-[#1a73e8] hover:bg-[#d2e3fc] text-[11px] font-bold flex items-center gap-1 transition shrink-0"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Mobile Direct App Deep Link */}
                <a
                  href={upiUri}
                  className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-[#202124] text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Open Google Pay App on Phone</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>

              {/* UTR / Transaction Reference Verification Input */}
              <div className="bg-white rounded-2xl p-4 border border-[#dadce0] space-y-2">
                <label className="block text-xs font-bold text-[#202124]">
                  Enter Google Pay / UPI Transaction ID (UTR) *
                </label>
                <p className="text-[11px] text-[#5f6368]">
                  After sending money in your Google Pay app, paste the 12-digit UPI Reference / UTR number below so the store owner can verify your payment.
                </p>
                <input
                  type="text"
                  value={utrInput}
                  onChange={(e) => {
                    setUtrInput(e.target.value);
                    if (utrError) setUtrError(null);
                  }}
                  placeholder="e.g. 432198765432 or GPAY Transaction ID"
                  className="w-full bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-3 text-xs font-mono outline-hidden focus:border-[#1a73e8] text-[#202124]"
                />
                {utrError && (
                  <p className="text-[11px] text-[#d93025] font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{utrError}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* TAB 2: OFFICIAL GOOGLE PAY WEB API */
            <div className="space-y-4">
              <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#dadce0] space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#202124]">Official Google Pay Web SDK</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                    {merchantSettings.googlePayEnvironment || 'TEST'} MODE
                  </span>
                </div>
                <p className="text-[11px] text-[#5f6368] leading-relaxed">
                  Uses Google’s official <code className="font-mono text-[#202124]">pay.js</code> API. To charge real credit/debit cards globally via Google Pay Web API, connect a live Payment Gateway (Stripe or Razorpay) in <strong>Admin Portal → Payments & Payouts</strong>.
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-[#dadce0] text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#5f6368]">Merchant ID:</span>
                    <span className="font-mono font-semibold text-[#202124]">{merchantSettings.googlePayMerchantId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5f6368]">Gateway:</span>
                    <span className="font-mono font-semibold text-[#202124]">{merchantSettings.gatewayName || 'example'}</span>
                  </div>
                </div>
              </div>

              {gpayApiError && (
                <div className="p-3 bg-[#fce8e6] border border-[#f5c2c7] rounded-xl text-[11px] text-[#c5221f] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{gpayApiError}</span>
                </div>
              )}
            </div>
          )}

          {/* Delivery Address Section with Quick Edit */}
          <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#dadce0] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#202124]">
                <MapPin className="w-3.5 h-3.5 text-[#1a73e8]" />
                <span>Shipping Address</span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-[11px] font-semibold text-[#1a73e8] hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingAddress ? 'Done' : 'Change'}</span>
              </button>
            </div>

            {isEditingAddress ? (
              <div className="space-y-2 pt-1 text-xs">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient Name"
                  className="w-full bg-white border border-[#dadce0] rounded-lg p-2 text-xs outline-hidden focus:border-[#1a73e8]"
                />
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street Address"
                  className="w-full bg-white border border-[#dadce0] rounded-lg p-2 text-xs outline-hidden focus:border-[#1a73e8]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-white border border-[#dadce0] rounded-lg p-2 text-xs outline-hidden focus:border-[#1a73e8]"
                  />
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal Code"
                    className="w-full bg-white border border-[#dadce0] rounded-lg p-2 text-xs outline-hidden focus:border-[#1a73e8]"
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#3c4043] leading-relaxed">
                <p className="font-semibold text-[#202124]">{recipientName} • {recipientPhone}</p>
                <p>{streetAddress}, {city}, {state} {postalCode}, {country}</p>
              </div>
            )}
          </div>

          {/* Delivery Speed Selection */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedDelivery('standard')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedDelivery === 'standard'
                  ? 'border-[#1a73e8] bg-[#e8f0fe]'
                  : 'border-[#dadce0] bg-white hover:bg-[#f8f9fa]'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-bold text-[#202124]">Standard</span>
                <span className="text-[11px] font-bold text-[#188038]">
                  {calcSubtotal >= 120 ? 'FREE' : formatPrice(9.99, currency)}
                </span>
              </div>
              <p className="text-[10px] text-[#5f6368]">3-5 business days</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedDelivery('express')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedDelivery === 'express'
                  ? 'border-[#1a73e8] bg-[#e8f0fe]'
                  : 'border-[#dadce0] bg-white hover:bg-[#f8f9fa]'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-bold text-[#202124]">DHL Express</span>
                <span className="text-[11px] font-bold text-[#202124]">
                  {formatPrice(15.0, currency)}
                </span>
              </div>
              <p className="text-[10px] text-[#5f6368]">1-2 business days</p>
            </button>
          </div>
        </div>

        {/* Sheet Footer */}
        <div className="p-4 bg-[#f8f9fa] border-t border-[#dadce0] space-y-2">
          {payMode === 'upi' ? (
            <button
              type="button"
              id="google-pay-authorize-btn"
              onClick={handleConfirmUpiPayment}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#188038] hover:bg-[#137333] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>I’ve Paid {formatPrice(calculatedGrandTotal, currency)} — Confirm Order</span>
            </button>
          ) : (
            <button
              type="button"
              id="google-pay-authorize-btn"
              onClick={handleOfficialGooglePayApi}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-black hover:bg-[#202124] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Lock className="w-4 h-4 animate-pulse" />
                  <span>Opening Google Pay...</span>
                </>
              ) : (
                <>
                  <GoogleGLogo className="w-4 h-4" />
                  <span>Pay {formatPrice(calculatedGrandTotal, currency)} with Google Pay</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            id="google-pay-cancel-btn"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full py-1.5 text-xs text-[#5f6368] hover:text-[#202124] font-medium transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

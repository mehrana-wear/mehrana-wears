import React from 'react';
import { X, User as UserIcon, Package, MapPin, LogOut, Truck, Clock, CheckCircle } from 'lucide-react';
import { User, Order, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  orders: Order[];
  onLogout: () => void;
  currency: CurrencyCode;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  onLogout,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FDFBF7] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E2D8] p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col text-[#2D2D2D]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#FAF7F2] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#E8E2D8]">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#8A9A5B] shadow-xs" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#3F4C27] text-white flex items-center justify-center text-xl font-bold font-serif">
              {user.name.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-xl text-[#2D2D2D] leading-none">{user.name}</h3>
              <span className="bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-[#A68F7A] mt-1">{user.email}</p>
            {user.phone && <p className="text-xs text-[#A68F7A]">{user.phone}</p>}
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-[#C17F59] bg-[#FAF0EB] hover:bg-[#F5E2D8] transition flex items-center gap-1 border border-[#C17F59]/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 py-6 space-y-6">
          {/* Saved Address */}
          {user.address && (
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#2D2D2D] mb-1">
                <MapPin className="w-4 h-4 text-[#8A9A5B]" />
                <span>Default Delivery Address</span>
              </div>
              <p className="text-[#5F584E]">{user.address.street}</p>
              <p className="text-[#A68F7A]">{user.address.city}, {user.address.state} {user.address.postalCode}, {user.address.country}</p>
            </div>
          )}

          {/* Orders History Tracker */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-base text-[#2D2D2D] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#8A9A5B]" />
              <span>Order History & Live Tracking ({orders.length})</span>
            </h4>

            {orders.length === 0 ? (
              <div className="text-center py-8 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D8] text-[#A68F7A] text-xs">
                You have not placed any orders yet.
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D8] space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E8E2D8]">
                    <div>
                      <span className="font-mono font-bold text-[#2D2D2D]">{ord.orderNumber}</span>
                      <span className="text-[#A68F7A] ml-2">Date: {ord.date}</span>
                    </div>

                    <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                      ord.status === 'Delivered'
                        ? 'bg-[#F0F4E8] text-[#3F4C27] border border-[#8A9A5B]/30'
                        : ord.status === 'Shipped'
                        ? 'bg-[#FAF0EB] text-[#C17F59] border border-[#C17F59]/30'
                        : 'bg-[#FAF7F2] text-[#A68F7A] border border-[#E8E2D8]'
                    }`}>
                      {ord.status}
                    </span>
                  </div>

                  {/* Status Timeline */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                    <div className="flex flex-col items-center gap-1 text-[#3F4C27] font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Ordered</span>
                    </div>
                    <div className={`flex flex-col items-center gap-1 font-semibold ${
                      ord.status === 'Shipped' || ord.status === 'Delivered' ? 'text-[#3F4C27]' : 'text-[#D8CFC4]'
                    }`}>
                      <Truck className="w-3.5 h-3.5" />
                      <span>In Transit</span>
                    </div>
                    <div className={`flex flex-col items-center gap-1 font-semibold ${
                      ord.status === 'Delivered' ? 'text-[#3F4C27]' : 'text-[#D8CFC4]'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 pt-2 border-t border-[#E8E2D8]">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-[#5F584E]">
                        <span>{it.name} (Size: {it.selectedSize}) × {it.qty}</span>
                        <span className="font-semibold text-[#2D2D2D]">{formatPrice(it.price * it.qty, currency)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E8E2D8] flex justify-between font-bold text-[#2D2D2D]">
                    <span>Total Paid</span>
                    <span className="text-[#3F4C27] font-serif">{formatPrice(ord.total, currency)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

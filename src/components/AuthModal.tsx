import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles, Check } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: mode === 'signup' ? name.trim() : email.split('@')[0],
      email: email.trim(),
      role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      phone: '+1 (555) 234-5678',
      address: {
        street: '742 Evergreen Terrace',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94107',
        country: 'United States',
      },
    };

    onLogin(newUser);
    onClose();
  };

  const handleGoogleDemoLogin = () => {
    const googleUser: User = {
      id: 'usr-google-1',
      name: 'Faruk Karim',
      email: 'farukarim@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'customer',
      phone: '+1 (555) 321-9876',
      address: {
        street: '100 California Street, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94111',
        country: 'United States',
      },
    };
    onLogin(googleUser);
    onClose();
  };

  const handleAdminDemoLogin = () => {
    const adminUser: User = {
      id: 'usr-admin-1',
      name: 'Mehrana Store Admin',
      email: 'admin@mehrana-wear.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      role: 'admin',
      phone: '+1 (800) 555-0199',
    };
    onLogin(adminUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FDFBF7] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E8E2D8] p-6 sm:p-8 animate-in zoom-in-95 duration-200 text-[#2D2D2D]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-auth-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#FAF7F2] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#3F4C27] text-[#FAF7F2] flex items-center justify-center mx-auto mb-2 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#2D2D2D]">
            {mode === 'login' ? 'Welcome to Mehrana' : 'Join the Inner Circle'}
          </h3>
          <p className="text-xs text-[#A68F7A]">
            {mode === 'login' ? 'Sign in to access order history & saved fits' : 'Create an account for personalized luxury shopping'}
          </p>
        </div>

        {/* 1-Click Google Sign In (Works 100% reliably!) */}
        <button
          id="auth-google-signin-btn"
          onClick={handleGoogleDemoLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 border border-[#E8E2D8] bg-white rounded-2xl text-xs font-bold text-[#2D2D2D] hover:bg-[#FAF7F2] transition-all shadow-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#E8E2D8]"></div>
          <span className="px-3 text-[11px] text-[#A68F7A] font-medium uppercase">Or with email</span>
          <div className="flex-1 border-t border-[#E8E2D8]"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#5F584E] mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#A68F7A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Faruk Karim"
                  className="w-full bg-white border border-[#E8E2D8] text-xs pl-9 pr-3 py-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#5F584E] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A68F7A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-white border border-[#E8E2D8] text-xs pl-9 pr-3 py-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F584E] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A68F7A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#E8E2D8] text-xs pl-9 pr-3 py-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D]"
              />
            </div>
          </div>

          {error && <p className="text-[11px] text-[#C17F59] font-medium text-center">{error}</p>}

          <button
            id="auth-submit-form-btn"
            type="submit"
            className="w-full py-3.5 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs rounded-2xl transition shadow-md mt-2"
          >
            {mode === 'login' ? 'Sign In to Account' : 'Create Customer Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-[#6B655B]">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className="text-[#3F4C27] font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already a member?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-[#3F4C27] font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          )}
        </div>

        {/* Demo Shortcut buttons */}
        <div className="mt-6 pt-4 border-t border-[#E8E2D8] flex gap-2">
          <button
            onClick={handleGoogleDemoLogin}
            className="flex-1 py-2 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#5F584E] rounded-xl text-[10px] font-semibold transition border border-[#E8E2D8]"
          >
            Quick Customer Demo
          </button>
          <button
            onClick={handleAdminDemoLogin}
            className="flex-1 py-2 bg-[#F0F4E8] hover:bg-[#E5ECCE] text-[#3F4C27] rounded-xl text-[10px] font-semibold transition border border-[#8A9A5B]/30"
          >
            Quick Admin Demo
          </button>
        </div>
      </div>
    </div>
  );
};

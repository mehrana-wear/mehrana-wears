import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { logInWithGoogle, logInWithEmail, signUpWithEmail } from '../lib/firebase';
import { BrandLogo } from './BrandLogo';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const user = await logInWithGoogle();
      setSuccessMessage(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        onLogin(user);
        onClose();
        setIsGoogleLoading(false);
      }, 500);
    } catch (err: any) {
      console.error('Google Sign In failed', err);
      setError(err.message || 'Google Sign-In could not be completed.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      let user: User;
      if (mode === 'signup') {
        user = await signUpWithEmail(name.trim(), email.trim(), password);
        setSuccessMessage('Account created successfully! Welcome to Mehrana.');
      } else {
        user = await logInWithEmail(email.trim(), password);
        setSuccessMessage(`Welcome back, ${user.name}!`);
      }

      setTimeout(() => {
        onLogin(user);
        onClose();
        setIsLoading(false);
      }, 600);
    } catch (err: any) {
      console.error('Authentication failed', err);
      setError(err.message || 'Authentication failed. Please check your details.');
      setIsLoading(false);
    }
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
          disabled={isLoading || isGoogleLoading}
          className="absolute top-4 right-4 p-2 rounded-full text-[#5F584E] hover:text-[#2D2D2D] hover:bg-[#FAF7F2] transition disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-6 flex flex-col items-center">
          <div className="mb-2">
            <BrandLogo size="lg" variant="dark" showText={false} />
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#2D2D2D]">
            {mode === 'login' ? 'Welcome to Mehrana wear' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-[#A68F7A]">
            {mode === 'login' ? 'Sign in with your Google Account or Email' : 'Join Mehrana wear for synchronized bags, orders & saved addresses'}
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 bg-[#F0F4E8] border border-[#8A9A5B]/40 text-[#3F4C27] rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#8A9A5B] shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-[#FAF0EB] border border-[#C17F59]/30 text-[#C17F59] rounded-2xl text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Official Google Sign In Button */}
        <button
          id="auth-google-signin-btn"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3.5 border border-[#E8E2D8] bg-white rounded-2xl text-xs font-bold text-[#2D2D2D] hover:bg-[#FAF7F2] active:scale-[0.99] transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 text-[#8A9A5B] animate-spin" />
          ) : (
            <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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
          )}
          <span>{isGoogleLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#E8E2D8]"></div>
          <span className="px-3 text-[10px] text-[#A68F7A] font-bold uppercase tracking-wider">Or continue with email</span>
          <div className="flex-1 border-t border-[#E8E2D8]"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-[#5F584E] mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#A68F7A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Faruk Karim"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-white border border-[#E8E2D8] text-xs pl-9 pr-3 py-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D] disabled:bg-gray-50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#5F584E] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A68F7A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-white border border-[#E8E2D8] text-xs pl-9 pr-3 py-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D] disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#5F584E] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A68F7A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-white border border-[#E8E2D8] text-xs pl-9 pr-3 py-2.5 rounded-xl outline-hidden focus:border-[#8A9A5B] text-[#2D2D2D] disabled:bg-gray-50"
              />
            </div>
          </div>

          <button
            id="auth-submit-form-btn"
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3.5 bg-[#3F4C27] hover:bg-[#323D1F] text-white font-bold text-xs rounded-2xl transition shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : null}
            <span>
              {isLoading
                ? mode === 'login' ? 'Signing In...' : 'Creating Account...'
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </span>
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-[#6B655B]">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-[#3F4C27] font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-[#3F4C27] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
